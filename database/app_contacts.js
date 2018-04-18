/**
  * 1. Firebase configuration
  * 2. News and Events form data processing
  * 3. Inserting news and events into database
  * 4. Fetching news and events data from database
  * 5. Displaying news and events in admin page
  * 6. processing create message to users form data
  * 7. Inserting create message to users form data into firebase database
  * 8. Fetching message to users data from firebase database
  * 9. Displaying message to users in admin page
**/

// Firebae has been initialisez in toolbar itsel so we dont need to initialize from here
// Get current user
// If user is not logged in redirect to login page
firebase.auth().onAuthStateChanged(function(user) {

    if (!user) {

      // If there isnt any logged in user redirect to login page
      //window.location.replace("../index.html");

    } else {

        getAllMessages(user.uid);

    }

});


//8. Fetching message to users data from firebase database
function getAllMessages(clientId) {

    var count = 0;
    var messageRef = firebase.database().ref().child("clients/"+ clientId +"/app_contact");
    messageRef.on("child_added", data => {

        var name = data.child("name").val();
        var email = data.child("email").val();
        var phone = data.child("phone").val();
        var message = data.child("message").val();

        count++;
        displayMessage(count, name, email, phone, message);

    });

}


//9. Displaying message to users in admin page
function displayMessage(count, name, email, phone, message) {

  	var appendThis =
      '<tr>' +
          '<td width="1">'+ count +'</td>' +
          '<td>'+ name +'</td>' +
          '<td>'+ email +'</td>' +
          '<td>'+ phone +'</td>' +
          '<td>'+ message +'</td>' +
      '</tr>';


  	$("#messageTable").append(appendThis);

}
