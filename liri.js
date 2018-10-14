var action = process.argv[2];
var search = process.argv.splice(3, process.argv.length - 1);
var request = require('request');
var dotenv = require('dotenv').config();
var fs = require('fs');
var keys = require('./keys.js');
var spacer = "\n _____________________________________________________________\n\n"
var moment = require('moment');
moment().format();
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var movieUrl = "http://www.omdbapi.com/?t=" + search.join('+') + "&y=&plot=short&apikey=trilogy";

function go() {

  if (action === "spotify-this-song") {
    if (search==""){
      search = "I saw the sign"
    }
    spotify.search({ type: 'track', query: search }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      var data = data.tracks.items[0];
      var name = spacer + "Track name: " + data.name;
      var artist = "Artist: " + data.artists[0].name;
      var album = "Album name: " + data.album.name;
      var url = "URL: " + data.external_urls.spotify + spacer;
      var display = name + '\n' + artist + '\n' + album + '\n' + url + '\n';
      console.log(display);
      fs.appendFile('log.txt', display, function (err) {
        if (err) throw err;
      });
    });
  }
  if (action === "movie-this") {
    if (search==""){
      search = "Mr. Nobody"
    }
    request(movieUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body);
        var display = spacer + "Title: " + data.Title +
          '\n' + "Release year: " + data.Released +
          '\n' + "IMDB Rating: " + data.imdbRating +
          '\n' + "Rotten Tomatoes Rating: " + data.Ratings[1].Value +
          '\n' + "Produced in: " + data.Country + '\n' +
          "Language: " + data.Language + '\n' +
          "Plot: " + data.Plot + '\n'
          + "Actors: " + data.Actors + spacer;
        console.log(display);
        fs.appendFile('log.txt', display, function (err) {
          if (err) throw err;
        });
      }
    });
  };
  if (action === "concert-this") {
    var bandUrl = "https://rest.bandsintown.com/artists/" + search.join('') + "/events?app_id=codingbootcamp";

    request(bandUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body)[0].venue;
        var date = moment(data.datetime).format('MM/DD/YYYY');
        console.log(spacer + "Artist: " + JSON.parse(body)[0].lineup + "\nVenue: " + data.name + "\nLocation: " + data.city + ", " + data.region + ", " + data.country +"\nDate: " + date + spacer);
        fs.appendFile('log.txt', spacer + "Artist: " + JSON.parse(body)[0].lineup + "\nVenue: " + data.name + "\nLocation: " + data.city + ", " + data.region + ", " + data.country +"\nDate: " + date + spacer, function (err) {
          if (err) throw err;
        });
      }
    });
  };
  if (action === "do-what-it-says") {
    var text = fs.readFileSync('./random.txt', 'utf8')
    var textArray = text.split(",");
    action = textArray[0];
    search = textArray[1];
    go();
  };
};
go();
