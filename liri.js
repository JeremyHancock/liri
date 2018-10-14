//The first two variables take in the users entries
var action = process.argv[2];
var search = process.argv.splice(3, process.argv.length - 1);

var request = require('request');
var dotenv = require('dotenv').config();
var fs = require('fs');
var keys = require('./keys.js');
var moment = require('moment');
moment().format();
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//This is used in all the different console logs
var spacer = "\n _____________________________________________________________\n\n"

//These queries required different separation in words so I had to use .join
var movieUrl = "http://www.omdbapi.com/?t=" + search.join('+') + "&y=&plot=short&apikey=trilogy";
var bandUrl = "https://rest.bandsintown.com/artists/" + search.join('') + "/events?app_id=codingbootcamp";

//One function to help everything go. This wasn't necessary until I added the do-what-it-says command
function go() {
  //If the first user entry is for spotify this runs
  if (action === "spotify-this-song") {
    //if the user doesn't input a song "I saw the sign" is default
    if (search == "") {
      search = "I saw the sign"
    }
    //this is spotify's format, specifying that we are looking for a particular track and passing in the formatted 'search'
    spotify.search({ type: 'track', query: search }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      //This is the root position for all the information we cant to access
      var data = data.tracks.items[0];
      //I'm using the spacer defined in the global variables and naming all the results so they can be referenced easily
      var name = spacer + "Track name: " + data.name;
      var artist = "Artist: " + data.artists[0].name;
      var album = "Album name: " + data.album.name;
      var url = "URL: " + data.external_urls.spotify + spacer;
      //var display makes it even easier to reference the whole thing at once
      var display = name + '\n' + artist + '\n' + album + '\n' + url + '\n';
      console.log(display);
      fs.appendFile('log.txt', display, function (err) {
        if (err) throw err;
      });
    });
  }
  //If the first user entry is for OMDB, this runs
  if (action === "movie-this") {
    //If no movie is entered a default is put in
    if (search == "") {
      search = "Mr. Nobody"
    }
    //this runs the request npm and passes the movieURL in and asks for information back
    request(movieUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //this gets us the information in a JSON format
        var data = JSON.parse(body);
        //this isn't as neat as the way I did the spotify one, but it puts all the information into a variable
        var display = spacer + "Title: " + data.Title +
          '\n' + "Release year: " + data.Released +
          '\n' + "IMDB Rating: " + data.imdbRating +
          '\n' + "Rotten Tomatoes Rating: " + data.Ratings[1].Value +
          '\n' + "Produced in: " + data.Country + '\n' +
          "Language: " + data.Language + '\n' +
          "Plot: " + data.Plot + '\n'
          + "Actors: " + data.Actors + spacer;
        //that variable is used here for the console and the log.txt file
        console.log(display);
        fs.appendFile('log.txt', display, function (err) {
          if (err) throw err;
        });
      }
    });
  };
  //if the user types concer-this, this runs
  if (action === "concert-this") {
    //this uses the request NPM and passes in the bandURL and asks gets information back
    request(bandUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //this is the root of all the info we want put into a JSON format
        var data = JSON.parse(body)[0].venue;
        //this uses moment to take the time information and put it in the format we want
        var date = moment(data.datetime).format('MM/DD/YYYY');
        //this is the ugliest way to get this information to the console and the log.txt
        console.log(spacer + "Artist: " + JSON.parse(body)[0].lineup + "\nVenue: " + data.name + "\nLocation: " + data.city + ", " + data.region + ", " + data.country + "\nDate: " + date + spacer);
        fs.appendFile('log.txt', spacer + "Artist: " + JSON.parse(body)[0].lineup + "\nVenue: " + data.name + "\nLocation: " + data.city + ", " + data.region + ", " + data.country + "\nDate: " + date + spacer, function (err) {
          if (err) throw err;
        });
      }
    });
  };
  //if the user types do-what-it-says ...
  if (action === "do-what-it-says") {
    //... it reads the random.txt file and sets the contents to the text variable
    var text = fs.readFileSync('./random.txt', 'utf8')
    //it finds commas and moves elements into an array using .split
    var textArray = text.split(",");
    //variables are set to get us our action and search, needed for anything to happen
    action = textArray[0];
    search = textArray[1];
    //the function is run from inside the function with action and search set to the contents of the random.txt file
    go();
  };
};
//kicks the whole show off
go();
