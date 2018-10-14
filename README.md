LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

In order to use this you'll need to provide this information in a file named '.env'

        Spotify API keys

        SPOTIFY_ID=your-spotify-id
        SPOTIFY_SECRET=your-spotify-secret

LIRI can accept an incredible four commands in only very specific formats!
    spotify-this-song song name
    movie-this movie name
    concert-this band name
    do-what-it-says

Spotify, movie, and concert each make a call to a separate API and return some information to the console. It also adds that information to log.txt for future reference. 

Do-what-it-says uses the command and query from the random.txt file and runs the appropriate command as it would if it was direct user entry.

Used: JavaScript, Node.js, and NPM
APIs: Spotify, Bands In Town, and OMDB
![screenshot 17](https://user-images.githubusercontent.com/40703719/46912039-ea8d1480-cf39-11e8-8a8d-2154751b3c7f.png)
![screenshot 18](https://user-images.githubusercontent.com/40703719/46912045-21632a80-cf3a-11e8-8336-e83df8bc37cd.png)
