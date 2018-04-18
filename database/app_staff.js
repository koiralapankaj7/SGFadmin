/**
  * 1. Firebase configuration
  * 2. News and Events form data processing
  * 3. Inserting news and events into database
  * 4. Fetching news and events data from database
  * 5. Displaying news and events in admin page
**/

// Firebae has been initialisez in toolbar itsel so we dont need to initialize from here
// Current user
var currentAdmin = null;

var currentdate = new Date();
var currentTime = currentdate.getDate() + ":"
    + (currentdate.getMonth())  + ":"
      + currentdate.getFullYear() + ":"
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();


// Get current user
// If user is not logged in redirect to login page
firebase.auth().onAuthStateChanged(function(user) {

    if (!user) {

      // If there isnt any logged in user redirect to login page
      //window.location.replace("../index.html");

    } else {

        // Set current admin
        currentAdmin = user.uid;
        getAllStaff(currentAdmin);

    }

});


//2. processing create news and events form data
function starStaffInsertingProcess() {

    var fullName = $("#fullName").val();
    var designation = $("#designation").val();
    var experiance = $("#experiance").val();
    var phone1 = $("#phone1").val();
    var phone2 = $("#phone2").val();
    var email1 = $("#email1").val();
    var email2 = $("#email2").val();
    var imageURL = $("#download").attr("href");
    // var currentTime = new Date($.now());

    var imageName = $("#download").attr("download");

    var storageRef = firebase.storage().ref("clients/"+ currentAdmin +"/app_staff/" + imageName);
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

          insertStaff(fullName, designation, experiance, phone1, phone2, email1, email2, downloadURL, currentTime);

    });

}


//3. Inserting create news and events form data into firebase database
function insertStaff(fullName, designation, experiance, phone1, phone2, email1, email2, downloadURL, time) {

  	var newStaffRef = firebase.database().ref("clients/"+ currentAdmin +"/app_staff/staff");

  	// Time should be replaces by teachers id
  	newStaffRef.child(time).set({
  		full_name: fullName,
  		designation: designation,
  		experiance: experiance,
  		phone_1: phone1,
  		phone_2: phone2,
  		email_1: email1,
  		email_2: email2,
  		image_url: downloadURL
  	})
    .then(function() {
        console.log('Synchronization succeeded');

        // Display success notification
        swal({
              title: "Record posted",
              text: "Staff details has been posted successfully !",
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
function getAllStaff(clientId) {

  var staffRootRef = firebase.database().ref().child("clients/"+ clientId +"/app_staff/staff");

  staffRootRef.on("child_added", data => {

      var fullName = data.child("full_name").val();
      var designation = data.child("designation").val();
      var experiance = data.child("experiance").val();
      var phone1 = data.child("phone_1").val();
      var phone2 = data.child("phone_2").val();
      var email1 = data.child("email_1").val();
      var email2 = data.child("email_2").val();
      var downloadURL = data.child("image_url").val();

      displayStaff(fullName, designation, experiance, phone1, phone2, email1, email2, downloadURL);

  });

}


//5. Displaying news and events in admin page
function displayStaff(fullName, designation, experiance, phone1, phone2, email1, email2, downloadURL) {

	var appendThis =
		'<div class="col-md-6" style="margin-top: 30px;">'
			+ '<div class="gallery-col">'
				+ '<article class="gallery-item">'
					+ '<img class="gallery-picture" src=" '+ downloadURL +' " alt="" height="300">'
					+ '<div class="gallery-hover-layout">'
						+ '<div class="gallery-hover-layout-in">'
							+ '<h2> '+ fullName +' </h2>'
							+ '<p style="margin-top: -20px;"> '+ designation +' </p>'
							+ '<div class="row" style="margin-top: 15px;">'
								+ '<div class="col-lg-12">'
									+ '<p>'
										+ '<span class="label label-pill label-info" style="background-color: black;"> '+ experiance +' </span>'
										+ '<span class="label label-pill label-info" style="background-color: black;"> '+ experiance +' </span>'
									+ '</p>'
								+ '</div>'
							+ '</div>'
							+ '<div class="row" style="margin-top: 10px;">'
								+ '<div class="col-lg-12">'
									+ '<i class="fa fa-phone-square"></i>'
                        			+ '<span> '+ phone1 +' </span>'
								+ '</div>'
								+ '<div class="col-lg-12">'
									+ '<i class="fa fa-phone-square"></i>'
                            		+ '<span> '+ phone2 +' </span>'
								+ '</div>'
							+ '</div>'
							+ '<div class="row" style="margin-top: 10px;">'
								+ '<div class="col-lg-12">'
									+ '<i class="fa fa-envelope"></i>'
                        			+ '<span> '+ email1 +' </span>'
								+ '</div>'
								+ '<div class="col-lg-12">'
									+ '<i class="fa fa-envelope"></i>'
                            		+ '<span> '+ email2 +' </span>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</article>'
			+ '</div>'
		+ '</div>'
		;

	$("#staffDiv").append(appendThis);

}


// News form validation
$('#addStaffForm').validate({

  submit: {
      settings: {
          inputContainer: '.form-group',
          errorListClass: 'form-tooltip-error'
      },
      callback: {
          onBeforeSubmit: function (node) {
              // Successfull form validation call insert news method
              starStaffInsertingProcess();
              //alert(currentAdmin);
          },
          onSubmit: function (node, formData) {
              console.log("After Submit");
          }
      }
  }
});


$("#cancleBtn").click(function() {
  document.getElementById("addStaffForm").reset();
  $(".croppedImage").addClass("hidden");
  $("#addNewStaffModal").modal("toggle");
});


$(".cropperBtn").click(function() {
  $("#cropperModal").modal("toggle");
  $(".croppedImage").removeClass("hidden");

});
