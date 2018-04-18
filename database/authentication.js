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

// var currentTime = new Date($.now());
var currentdate = new Date(); 
var currentTime = currentdate.getDate() + ":"
  + (currentdate.getMonth())  + ":" 
    + currentdate.getFullYear() + ":"  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();


// If user is logged in redirect
firebase.auth().onAuthStateChanged(function(user) {

  	if (user) {

  		// This is super admin all other are admin for institutions
  		if (user.uid == 'Wuui287OyuPeRBVkTbEg60Gc1F32') {
  			
  			   window.location.replace("pages/super-admin.html");

  		} else {

  			   window.location.replace("pages/institution-admin.html");

  		}   

  	} 

});	


// Login
function login() {

	var userName =  $("#txt_uname").val();
	var password =  $("#txt_pwd").val();

	var email = userName + "@shikshyaguru.com";

	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

		// Display error message
	  $("#infoDisplayer").text(error.message);
		$("#infoDisplayer").removeClass("hidden");

		// Remove mesage after three second
		setTimeout(function() {
			$("#infoDisplayer").addClass("hidden");
		}, 3000);

	});
}


// 3. Request institution code
function sendInstitutionRequest() {

	var institutionName =  $("#institutionName").val();
	var email =  $("#email").val();
	var phoneNo =  $("#phoneNumber").val();

	console.log(institutionName + "," + email + "," +  phoneNo);

	firebase.database().ref("i_code_requests").push().set({
      time: currentTime,
      name: institutionName,
      email: email,
      phoneNo: phoneNo
    })
  	.then(function() {
  		console.log('Synchronization succeeded');

  		// Display success notification
  		swal({
            title: "Request send",
            text: "Your request has been send successfully !",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Done"
        });

        // Clear form data
        document.getElementById("requestForm").reset();

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

 //  	$("#infoDisplayerRequest").text("Request has been submited. We will get back soon.");
 //  	$("#infoDisplayerRequest").removeClass("hidden");

 //  	setTimeout(function() {	
	// 	$("#infoDisplayerRequest").addClass("hidden");
 //        $("#requestForm").addClass("hidden");
 //        $("#loginForm").removeClass("hidden");
	// }, 3000);		
}


// Code request validation
$('#requestForm').validate({

    submit: {
        settings: {
            inputContainer: '.form-group',
            errorListClass: 'form-tooltip-error'
        },
        callback: {
            onBeforeSubmit: function (node) {
                sendInstitutionRequest();
            },
            onSubmit: function (node, formData) {
                console.log("After Submit");
            }
        }
    }
});


// Login validation
$('#loginForm').validate({

    submit: {
        settings: {
            inputContainer: '.form-group',
            errorListClass: 'form-tooltip-error'
        },
        callback: {
            onBeforeSubmit: function (node) {
            	// Successfull form validation call login method
                login();
            },
            onSubmit: function (node, formData) {
                console.log("After Submit");
            }
        }
    }
});


// 5. Different buttons hidden status manupulation
$("#proceedBtn").click(function() {
    // $(".loginContainer").load("sign-up.html");
    $("#loginForm").addClass("hidden");
    $("#requestForm").removeClass("hidden");
});


$(".goBackToSignIn").click(function() {
    $("#loginForm").removeClass("hidden");
    $("#requestForm").addClass("hidden");
    $("#resetPwForm").addClass("hidden");
});


$("#forgetPassBtn").click(function() {
	$("#loginForm").addClass("hidden");
    $("#resetPwForm").removeClass("hidden");
});
// Different buttons hidden status manupulation


// 6. Form's Ui heigh style
$(function() {
    $('.page-center').matchHeight({
        target: $('html')
    });    
});
// Form's Ui heigh style
