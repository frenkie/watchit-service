# watchit-service
The Watchit service creates a unified video playlist from URLs to (popular) 
video services, regardless of origin.



## Currently in development stage, so come back later! 

## configuration
Watch It uses Mongodb as a database. To connect to the database you have
to set a `MONGODB_URI` environment variable with a fully authenticated
URI to a Mongo DB database.
Example:

`mongodb://<user>:<password>@hostname:port/database`