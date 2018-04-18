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

        getAllReviews(user.uid);

    }

});


//8. Fetching message to users data from firebase database
function getAllReviews(clientId) {

    var count = 0;
    var messageRef = firebase.database().ref().child("clients/"+ clientId +"/app_reviews");
    messageRef.on("child_added", data => {

        var user = data.key;
        var inst = data.child("institution").val();
        var edu = data.child("education").val();
        var tech = data.child("teachers").val();
        var mgmt = data.child("management").val();
        var infra = data.child("infrastructure").val();
        var time = data.child("post_time").val();
        var comment = data.child("comment").val();
        var like = data.child("comment_like").val();
        var dislike = data.child("comment_dislike").val();

        count++;
        displayReviews(count, user, inst, edu, tech, mgmt, infra, time, comment, like, dislike);

    });

}


//9. Displaying message to users in admin page
function displayReviews(count, user, inst, edu, tech, mgmt, infra, time, comment, like, dislike) {

  	var appendThis =
      '<tr>' +
          '<td width="1">'+ count +'</td>' +
          '<td>'+ user +'</td>' +
          '<td>'+ inst +'</td>' +
          '<td>'+ edu +'</td>' +
          '<td>'+ tech +'</td>' +
          '<td>'+ mgmt +'</td>' +
          '<td>'+ infra +'</td>' +
          '<td>'+ time +'</td>' +
          '<td>'+ comment +'</td>' +
          '<td>'+ like +'</td>' +
          '<td>'+ dislike +'</td>' +
      '</tr>';


  	$("#reviewTable").append(appendThis);

}
