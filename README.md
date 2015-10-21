# watchit-service
The Watchit bookmark service creates a unified video playlist from URLs to (popular) 
video services, regardless of origin. No need to visit every video site
separately; with it's accompanying GUI project (in development) you just
sit back and enjoy your saved playlist hassle-free.

# Currently in development stage, so come back later!
The service is currently in development and will be accompanied by
a separate [front end project](https://github.com/frenkie/watchit-frontend)
and hopefully fully [SAAS](https://en.wikipedia.org/wiki/Software_as_a_service) available. Of course you can 
deploy it yourself (even privately) if you want, just check the 
'Running it yourself' item below.

## API
The Watchit service exposes an API with which you can populate the 
video playlists of a specific user.

### /videos

#### save through POST

Posting to the endpoint creates a video entry for a given uses.
A POST call to `http(s)://hostname:port/videos` 
with the following JSON body will do the trick:

```javascript
{
  "username": "your-user-name",
  "consumerKey": "the user's consumer key",
  "url": "the URL to the video page / page with video",
  "title": "the title of the video"
}
``` 

An example of such a POST request can be made with CURL:

```bash
curl -H "Content-Type: application/json" -X POST -d '{"username":"your-username", "consumerKey":"xyz","url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ", "title":"whaddyathink"}' http://hostname:port/videos
```


### If This Then That recipe - Pocket
There is an [If This Then That](https://ifttt.com/recipes/335244-create-a-unified-playlist-of-video-s-saved-through-pocket)
recipe that populates the Watchit service with video's that you save
through [Pocket](https://getpocket.com/) with a special tag of your
choosing. This is as simple as it can get.

## Helping out - video parsing services
The service relies on services that can parse URLs to pages with video,
even scraping those pages to get the right video ID's / URLS out of there
in order for the Watchit service to create a seemless video playlist.
For the most popular services like YouTube this is really easy, but if
you know of a service that has to be included, please provide a parsing
service and strategy for creating a player to play that content.

## Running it yourself

### install
Running `npm install` should do the trick. Pre requisites are that you
have a running [MongoDB](https://www.mongodb.com) instance, either 
locally or remotely.
A service like [MongoLab](https://mongolab.com) can provide the latter
very easily.

### configuration
Watch It uses Mongodb as a database. To connect to the database you have
to set a `MONGODB_URI` environment variable with a fully authenticated
URI to a Mongo DB database.
Example:

`mongodb://<user>:<password>@hostname:port/database`


### users
To be able to save videos there has to be a user in the database.
Watchit users are maintained in the `watcher` collection.
Create a watcher entry with the following properties:
 
```javascript
{
 "name": "username", /* this is the name of the /save/:username API call */
 "consumerKey": "some secret string", /* used for being able to post to the API */
 "credentials": "md5 hash of username:password" /* for future use of the front end project */
} 
``` 
 
### running 
With a MongoDB and watcher user setup you can run the server through:

`MONGODB_URI=mongodb://mongodb-uri npm start`

Or just

`npm start` if you already set the `MONGODB_URI` environment variable.