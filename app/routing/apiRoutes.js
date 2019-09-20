// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on friend-data.
// ===============================================================================

var friendData = require("../data/friends.js");

// ===============================================================================
// Helper Functions
// ===============================================================================
// Finds the difference between two arrays (sum of the difference between each element)
// ASSUMES ARRAYS ARE OF EQUAL LENGTH
function findDiff(arr_1, arr_2) {
  var diff = 0;

  for (var i = 0; i < arr_1.length; i++) {
    diff += Math.abs(arr_1[i] - arr_2[i]);
  }

  return diff;
}

function findMatch(arr) {
  var minDiff =  Infinity;
  var bestMatch;

  for(friend of friendData) {
    var friendCompatibility = findDiff(arr, friend.answers);
    
    if (friendCompatibility < minDiff) {
      minDiff = friendCompatibility;
      bestMatch = friend;
    }
  }

  return bestMatch;
}
// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/friends", function(req, res) {
    res.json(friendData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out the survey... this data is then sent to the server...
  // Then the server saves the data to the friendsData array)
  // ---------------------------------------------------------------------------

  app.post("/api/friends", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
      var newFriend = req.body;

      // Calculate the best match for the user based on the current database of people (i.e friendData) 
      var match = findMatch();

      friendsData.push(newFriend);
      
      res.json(match);
  });

};
