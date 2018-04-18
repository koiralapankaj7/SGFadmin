// 1. Firebase configuration
	var config = {
	    apiKey: "AIzaSyDgJTKGsbxCeMumPX_IXi4N1mulK1j0VSo",
	    authDomain: "shikshyaguru-182814.firebaseapp.com",
	    databaseURL: "https://shikshyaguru-182814.firebaseio.com",
	    projectId: "shikshyaguru-182814",
	    storageBucket: "shikshyaguru-182814.appspot.com",
	    messagingSenderId: "697329831707"
	};
	firebase.initializeApp(config);
// Firebase configuration

// Current user
var currentAdmin = null;

// If user is not logged in redirect to login page
firebase.auth().onAuthStateChanged(function(user) {

  if (!user) {

    // If there isnt any logged in user redirect to login page
    window.location.replace("../index.html");

  } else {

    // Hide news section at the beginning
    $("#pageContentNews").addClass('hidden');

    // Set current admin
    currentAdmin = user.uid;

    setUpAdminProfile(user);
    getStatistics();
    getAllClientRequest();
    getAllClientsData();
    getAllUsers();

  }
});


// Dashboard click function
$("#mainDiv").click(function() {

    $("#newsDiv").removeClass('opened');
    $("#pageContentNews").addClass('hidden');
    $("#mainDiv").addClass('opened');
    $("#pageContentMain").removeClass('hidden');

    fetchAllNews();
});


// Sidebar news click function
$("#newsDiv").click(function() {

    $("#mainDiv").removeClass('opened');
    $("#pageContentMain").addClass('hidden');
    $("#newsDiv").addClass('opened');
    $("#pageContentNews").removeClass('hidden');

    fetchAllNews();

});


// var currentTime = new Date($.now());
var currentdate = new Date();
var currentTime = currentdate.getDate() + ":"
  + (currentdate.getMonth())  + ":"
    + currentdate.getFullYear() + ":"
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();


// Setup user profile
function setUpAdminProfile(user) {

    //console.log(user.uid );

    var profileRef = firebase.database().ref("super_admin").child(user.uid).child("profile");

    profileRef.on('value', function(dataSnapshot) {
        var name = dataSnapshot.child('name').val();
        $("#userName").text(name);
    });
}


// Get requests from peoples and display into tables
function getAllClientRequest() {
  // body...
    var iCodeRequestRef = firebase.database().ref("i_code_requests").orderByKey();

    iCodeRequestRef.on('value', function(dataSnapshot) {

        // Clear table before appending items
        $("#cliendRequestTable").empty();

        dataSnapshot.forEach(function(data) {

            var id = data.key;
            var name = data.child('name').val();
            var email = data.child('email').val();
            var phone = data.child('phoneNo').val();
            var date = data.child('time').val().toString();

            var appendTable = "<tr>" +
                                "<td><span class='label label-primary'>"+ name +"</span></td>" +
                                "<td>"+ email +"</td>" +
                                "<td align='center'>"+ phone +"</td>" +
                                "<td class='hidden' align='center'>"+ data +"</td>" +
                                "<td align='center'><button class='btn btn-primary acceptRequestBtn' type='button' id='"+ id +"'> Accept </button></td>" +
                              "</tr>";



            $("#cliendRequestTable").append(appendTable);

        });

        // We have to set click event after appearing in DOM otherwise click event will not work.
        // There fore this is the most important to declare here rather in other place
        $(".acceptRequestBtn").click(function() {

              var id = $(this).attr('id');
              var name = $(this).closest('tr').find('td:nth-child(1)').text();
              var email = $(this).closest('tr').find('td:nth-child(2)').text();
              var phone = $(this).closest('tr').find('td:nth-child(3)').text();
              var time = $(this).closest('tr').find('td:nth-child(4)').text();

              acceptRequest(id, name, email, phone, time);

        });

    });
}


// Get clients data
function getAllClientsData() {

    var clientRef = firebase.database().ref("clients");

    clientRef.orderByKey().on('value', function(dataSnapshot) {

        // Clear table before appending items
        $("#clientDetailsTable").empty();

        dataSnapshot.forEach(function(client) {

            var id = client.key;
            var name = client.child("profile/name").val();
            var email = client.child("profile/email").val();
            var phone = client.child("profile/phone").val();

            var street = client.child("address/street").val();
            var city = client.child("address/city").val();
            var state = client.child("address/state").val();
            var country = client.child("address/country").val();

            var address = street+", "+city+", "+state+", "+country;

            var appendTable = "<tr>" +
                                "<td><span class='label label-primary'>"+ name +"</span></td>" +
                                "<td>"+ email +"</td>" +
                                "<td align='center'>"+ phone +"</td>" +
                                "<td>"+ address +"</td>" +
                                "<td align='center'><button class='btn btn-primary removeClientAuthorization' type='button' id='"+ id +"'> Remove </button></td>" +
                              "</tr>";

            $("#clientDetailsTable").append(appendTable);

            //console.log(address);

        });

        // We have to set click event after appearing in DOM otherwise click event will not work.
        // There fore this is the most important to declare here rather in other place
        $(".removeClientAuthorization").click(function() {

              var id = $(this).attr('id');
              removeClientAuthorization(id);

        });

    });
}


// Get clients data
function getAllUsers() {

    var userRef = firebase.database().ref("users");

    userRef.orderByKey().on('value', function(dataSnapshot) {

        // Clear table before appending items
        $("#allUsersDiv").empty();

        dataSnapshot.forEach(function(user) {

            var id = user.key;
            var name = user.child("profile/name").val();
            var email = user.child("profile/email").val();
            var type = user.child("profile/type").val();

            var uType = null;
            switch(type) {
              case 1:
                uType = 'Student';
                break;
              case 2:
                uType = 'Teacher';
                break;
              case 3:
                uType = 'Institution';
                break;
            }

            var appendTable = '<article class="contact-row removeUserAuthorization" id="'+ id +'">' +
                                  '<div class="user-card-row">' +
                                      '<div class="tbl-row">' +
                                          '<div class="tbl-cell tbl-cell-photo">' +
                                              '<a href="#">' +
                                                  '<img src="../img/photo-64-2.jpg" alt="">' +
                                              '</a>' +
                                          '</div>' +
                                          '<div class="tbl-cell">' +
                                              '<p class="user-card-row-name">'+ name +'</p>' +
                                              '<p class="user-card-row-mail">'+ email +'</p>' +
                                          '</div>' +
                                          '<div class="tbl-cell tbl-cell-status">'+ uType +'</div>' +
                                      '</div>' +
                                  '</div>' +
                              '</article>';

            $("#allUsersDiv").append(appendTable);

            //console.log(name+" : "+email+" : "+uType);

        });

        // We have to set click event after appearing in DOM otherwise click event will not work.
        // There fore this is the most important to declare here rather in other place
        $(".removeUserAuthorization").click(function() {

              var id = $(this).attr('id');
              removeUserAuthorization(id);

        });

    });
}


// Get clients data
function getReportedInstitution() {

    var userRef = firebase.database().ref("users");

    userRef.orderByKey().on('value', function(dataSnapshot) {

        // Clear table before appending items
        $("#allUsersDiv").empty();

        dataSnapshot.forEach(function(user) {

            var id = user.key;
            var name = user.child("profile/name").val();
            var email = user.child("profile/email").val();
            var type = user.child("profile/type").val();

            var uType = null;
            switch(type) {
              case 1:
                uType = 'Student';
                break;
              case 2:
                uType = 'Teacher';
                break;
              case 3:
                uType = 'Institution';
                break;
            }

            var appendTable = '<article class="contact-row removeUserAuthorization" id="'+ id +'">' +
                                  '<div class="user-card-row">' +
                                      '<div class="tbl-row">' +
                                          '<div class="tbl-cell tbl-cell-photo">' +
                                              '<a href="#">' +
                                                  '<img src="../img/photo-64-2.jpg" alt="">' +
                                              '</a>' +
                                          '</div>' +
                                          '<div class="tbl-cell">' +
                                              '<p class="user-card-row-name">'+ name +'</p>' +
                                              '<p class="user-card-row-mail">'+ email +'</p>' +
                                          '</div>' +
                                          '<div class="tbl-cell tbl-cell-status">'+ uType +'</div>' +
                                      '</div>' +
                                  '</div>' +
                              '</article>';

            $("#allUsersDiv").append(appendTable);

            //console.log(name+" : "+email+" : "+uType);

        });

        // We have to set click event after appearing in DOM otherwise click event will not work.
        // There fore this is the most important to declare here rather in other place
        $(".removeUserAuthorization").click(function() {

              var id = $(this).attr('id');
              removeUserAuthorization(id);

        });

    });
}


// Get all statistics related to database
function getStatistics() {

    var totalAdminRef = firebase.database().ref("super_admin");
    var totalReqRef = firebase.database().ref("i_code_requests");
    var totalClientRef = firebase.database().ref("clients");
    var totalUserRef = firebase.database().ref("users");
    var totalReported = firebase.database().ref("reported_institution");
    var totalNews = firebase.database().ref("news");

    // Total admin
    totalAdminRef.on('value', function(dataSnapshot) {
        var adminCount = dataSnapshot.numChildren();
        $("#totalAdmin").text(adminCount);
    });

    // Total request from client
    totalReqRef.on('value', function(dataSnapshot) {
        var count = dataSnapshot.numChildren();
        $("#totalClientRequest").text(count);
    });

    // Total clients
    totalClientRef.on('value', function(dataSnapshot) {
        var count = dataSnapshot.numChildren();
        $("#totalClients").text(count);
    });

    // Total users
    totalUserRef.on('value', function(dataSnapshot) {
        var count = dataSnapshot.numChildren();
        $("#totalUsers").text(count);
    });

    // Total reported institution
    totalReported.on('value', function(dataSnapshot) {
        var count = dataSnapshot.numChildren();
        $("#totalReportedClients").text(count);
    });

    // Total news
    totalNews.on('value', function(dataSnapshot) {
        var count = dataSnapshot.numChildren();
        $("#totalNewsPosted").text(count);
    });
}


// Accept client request and make them a user of this project
function acceptRequest(id, name, email, phone, time) {

    console.log(id + ":" + name + ":" + email+ ":" +phone+ ":" +time);

    var arr = email.split('@');

    var emailNew = arr[0] + "@shikshyaguru.com";
    var password = "instpassdef"

    firebase.auth().createUserWithEmailAndPassword(emailNew, password)
    .then(function(user) {
        // Success
        // Remove from i_code_request table
        firebase.database().ref("i_code_requests").child(id).remove();
				// Create clients profile as well
				firebase.database().ref().child("clients").child(user.uid).child("profile").set({
						name: name,
						email: email,
						phone: phone,
						user_name: arr[0],
						password: password
				})
				.then(function() {

	          swal({
	                title: "Request accepted",
	                text: "Cliend request has been updated !",
	                type: "success",
	                confirmButtonClass: "btn-success",
	                confirmButtonText: "Done"
	          });

        })
        .catch(function(e) {

            swal({
                title: "Error",
                text: e.message(),
                type: "warning"
            });
        });

    })
    .catch(function(error) {

        swal({
            title: "Error",
            text: error.message(),
            type: "warning"
        });

    });

}


// Remove client authorization
function removeClientAuthorization(id) {
    alert(id);
}


// Remove user authorization
function removeUserAuthorization(id) {
    alert(id);
}


// Start news insertation process by uploading image first
function startNewsInsertingProcess() {

  var fullName = $("#fullName").val();
  var placeName = $("#placeName").val();
  var newsHeading = $("#newsHeading").val();
  var newsContent = $("#newsContent").val();
  var imageURL = $("#download").attr("href");
  // var currentTime = new Date($.now());
  var currentdate = new Date();
  var currentTime = currentdate.getDate() + ":"
      + (currentdate.getMonth())  + ":"
        + currentdate.getFullYear() + ":"
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

  var imageName = $("#download").attr("download");

  var storageRef = firebase.storage().ref("super_admin/"+ currentAdmin +"/" + imageName);
  var uploadTask = storageRef.putString(imageURL, 'data_url');

  // Register three observers:
  // 1. 'state_changed' observer, called any time the state changes
  // 2. Error observer, called on failure
  // 3. Completion observer, called on successful completion
  uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
      }
    }, function(error) {
        // Handle unsuccessful uploads
        alert(error.message());
    }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
        console.log(currentTime);

        insertNewsData(fullName, placeName, newsHeading, newsContent, downloadURL, currentTime);
  });
}


//3. Inserting create news and events form data into firebase database
function insertNewsData(fullName, placeName, newsHeading, newsContent, downloadURL, time) {

  var newsRef = firebase.database().ref("news");

  newsRef.child(time).set({
      writer: fullName,
      place: placeName,
      heading: newsHeading,
      news: newsContent,
      image: downloadURL
  })
  .then(function() {
      console.log('Synchronization succeeded');

      // Display success notification
      swal({
            title: "News posted",
            text: "News has been posted successfully !",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Done"
        });

        // Clear form data
        //document.getElementById("createNewsForm").reset();

    })
    .catch(function(error) {
      console.log('Synchronization failed');

      // Notify with error message
      swal({
            title: "Error",
            text: error.message(),
            type: "warning"
        });

    });

}


//4. Fetching news and events data from firebase database
function fetchAllNews() {

    var newsRef = firebase.database().ref().child("news");
    newsRef.on("child_added", data => {

	      var fullName = data.child("writer").val();
	      var placeName = data.child("place").val();
	      var newsHeading = data.child("heading").val();
	      var newsContent = data.child("news").val();
	      var downloadURL = data.child("image").val();
	      //var time = data.child("image_url").val();

	      // alert(data.val());
	      // console.log(fullName + " ," + placeName + " ," + newsHeading + " ," + newsContent + " ," + downloadURL);

	      displayNewsAndEvents(fullName, placeName, newsHeading, newsContent, downloadURL, "time");

    });

}


//5. Displaying news and events in admin page
function displayNewsAndEvents(fullName, placeName, newsHeading, newsContent, downloadURL, time) {

	  var appendThis =
	    '<div class="column size-1of4">'
	      + '<div class="card-grid-col"> '
	        + '<article class="card-typical"> '
	          + '<div class="card-typical-section"> '
	            + '<div class="user-card-row"> '
	              + '<div class="tbl-row"> '
	                + '<div class="tbl-cell tbl-cell-photo"> '
	                  + '<a href="#"> '
	                    + '<img src="../img/avatar-1-64.png" alt=""> '
	                  + '</a> '
	                + '</div> '
	                + '<div class="tbl-cell"> '
	                  + '<p class="user-card-row-name"><a href="#"> '+ fullName +' </a></p> '
	                  + '<p class="color-blue-grey-lighter"> '+ time + " | " + placeName  +'</p> '
	                + '</div> '
	              + '</div> '
	            + '</div> '
	          + '</div> '
	          + '<div class="card-typical-section card-typical-content"> '
	            + '<div class="photo"> '
	              + '<img src=" '+ downloadURL +' " alt=""> '
	            + '</div> '
	            + '<header class="title"><a href="#"> '+ newsHeading +' </a></header> '
	            + '<p> '+ newsContent +' </p> '
	          + '</div> '
	        + '</article> '
	      + '</div> '
	    + '</div> '
	    ;

	  $("#newsAndEventsDiv").append(appendThis);
	  // alert("inside");

}


// Logout
function logout() {

  firebase.auth().signOut().then(function() {

      // redirect to login page
      window.location.replace("../index.html");

  }).catch(function(error) {

      // Notify with error message
      swal({
            title: "Error",
            text: error.message(),
            type: "warning"
        });

  });
}


// News form validation
$('#createNewsForm').validate({

  submit: {
      settings: {
          inputContainer: '.form-group',
          errorListClass: 'form-tooltip-error'
      },
      callback: {
          onBeforeSubmit: function (node) {
              // Successfull form validation call insert news method
              startNewsInsertingProcess();
              //alert(currentAdmin);
          },
          onSubmit: function (node, formData) {
              console.log("After Submit");
          }
      }
  }
});


// Cancle button click listener
$("#cancleBtn").click(function() {
    document.getElementById("createNewsForm").reset();
    $(".croppedImage").addClass("hidden");
    $("#createNewsModal").modal("toggle");
});


// Crop button click listener
$(".cropperBtn").click(function() {
    $("#cropperModal").modal("toggle");
    $(".croppedImage").removeClass("hidden");
});


// Google chart with stats
$(document).ready(function() {


      $('.panel').lobiPanel({
        sortable: true
      });
      $('.panel').on('dragged.lobiPanel', function(ev, lobiPanel){
        $('.dahsboard-column').matchHeight();
      });

      google.charts.load('current', {'packages':['corechart']});

      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Day');
        dataTable.addColumn('number', 'Values');
        // A column for custom tooltip content
        dataTable.addColumn({type: 'string', role: 'tooltip', 'p': {'html': true}});
        dataTable.addRows([
          ['MON',  130, ' '],
          ['TUE',  130, '130'],
          ['WED',  180, '180'],
          ['THU',  175, '175'],
          ['FRI',  200, '200'],
          ['SAT',  170, '170'],
          ['SUN',  250, '250'],
          ['MON',  220, '220'],
          ['TUE',  220, ' ']
        ]);

        var options = {
          height: 314,
          legend: 'none',
          areaOpacity: 0.18,
          axisTitlesPosition: 'out',
          hAxis: {
            title: '',
            textStyle: {
              color: '#fff',
              fontName: 'Proxima Nova',
              fontSize: 11,
              bold: true,
              italic: false
            },
            textPosition: 'out'
          },
          vAxis: {
            minValue: 0,
            textPosition: 'out',
            textStyle: {
              color: '#fff',
              fontName: 'Proxima Nova',
              fontSize: 11,
              bold: true,
              italic: false
            },
            baselineColor: '#16b4fc',
            ticks: [0,25,50,75,100,125,150,175,200,225,250,275,300,325,350],
            gridlines: {
              color: '#1ba0fc',
              count: 15
            },
          },
          lineWidth: 2,
          colors: ['#fff'],
          curveType: 'function',
          pointSize: 5,
          pointShapeType: 'circle',
          pointFillColor: '#f00',
          backgroundColor: {
            fill: '#008ffb',
            strokeWidth: 0,
          },
          chartArea:{
            left:0,
            top:0,
            width:'100%',
            height:'100%'
          },
          fontSize: 11,
          fontName: 'Proxima Nova',
          tooltip: {
            trigger: 'selection',
            isHtml: true
          }
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
      }

      $(window).resize(function(){
        drawChart();
        setTimeout(function(){
        }, 1000);
      });

});
