# Node.js S3 Pipe Server

  

If you are are using AWS S3 service and you want to serve s3 objects on your own. then you came to the right place! S3 Pipe Server give you some additional features like custom authentication, CORS support, pauseable download by choice and etc...

# Features

 - Implemented in Typescript
 - CORS Support
 - High Performance
 - Custom Object Resolver
 - Custom User Authentication
 - etc...
 
# How To Use
You can clone this repo in your project and use it based on your use case!
**Environment Variables:**

    STORAGE_URL=[s3-endpoint]
    STORAGE_ACCESS=[s3-client-access-key]
    STORAGE_SECRET=[s3-client-secret-key]
    STORAGE_REGION=[s3-region]
    STORAGE_BUCKETS=[s3-buckets-seperate-by-,-char]

**Docker**
````shell
git clone https://github.com/erfanshekari/node-s3-pipe-server
cd node-s3-pipe-server
docker build -t s3-server .
````

**Docker-Compose**

````shell
git clone https://github.com/erfanshekari/node-s3-pipe-server
cd node-s3-pipe-server
docker-compose up -d
````

**Node.js Example App**
````shell
git clone https://github.com/erfanshekari/node-s3-pipe-server
cd node-s3-pipe-server
yarn
yarn build
yarn start
````

# Example Custom Server Setup
````typescript
import { createS3PipeServer } from "./server/server";

const serverConfig: S3PipeServerCustomHandlers = {
    requestListener: (request: IncomingMessage, response: ServerResponse) => {
        // you can have access to actual request and response of http server
    },
    authenticate: async (headers: IncomingHttpHeaders): Promise<boolean> => {
        // if You need to implement your own authentication, do it here 
        // to determine user is allowed to proceed, return a boolean
        return true
    }
}

const server = createS3PipeServer(serverConfig)

// default listen on port 9000
server.listen()
````
# Object Resolver
by default you can access your s3 objects like example bellow:
~~~~
http://127.0.0.1:9000/<bucket-name>/<object-key>
~~~~

but if you need to change this approch, you can make your own object resolver if you need a custom routing
**Example:**
~~~~typescript
const server = createS3PipeServer({
    ...serverConfig,
    resolveObject: (uri: string): S3Object => {
        // parse uri and return Key, Bucket
        return { Key: "<s3object-key>", Bucket: "<s3-bucket>" }
    }
})
~~~~

# settings.json

~~~~json
{    
    "use-cors": true,
    /*
        cors is on by default, but if you don't need it just change use-cors to false
    */

    "cors-config": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Request-Method": "*",
        "Access-Control-Allow-Methods": "OPTIONS, GET",
        "Access-Control-Allow-Headers": "*"
    },

    "download": {
        "pauseable": true
        /*
            if you change pauseable to false user won't be able to make partial request for objects
        */
    },

    "buckets": {
        "allow-any": false
        /*
            if you want to allow user to access any bucket that demands. set allow-any to true
        */
    },

    "request-timeout": 3000
}
~~~~