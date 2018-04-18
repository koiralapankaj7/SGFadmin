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


// Get current user
firebase.auth().onAuthStateChanged(function(user) {

	  if (user) {
				currentAdmin = user.uid;
				setUpToolbar(user);
	  }

});

// Setup user profile
function setUpToolbar(user) {

    var profileRef = firebase.database().ref("clients").child(user.uid).child("profile");

    profileRef.on('value', function(dataSnapshot) {
        var name = dataSnapshot.child('name').val();
        $("#userName").text(name);

    });

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
