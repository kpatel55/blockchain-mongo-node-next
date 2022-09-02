# Blockchain Comments

A simple blockchain app for storing comments.

## Usage

Be sure to have Docker installed and running locally prior to running scripts.

In the /backend folder, be sure to run npm install, and create a .env file based on your local environment:

```
PORT=[my_port]
MONGODB_URI=[my_mongo_uri]
MONGODB_SECRET=[my_mongo_secret]
```

### Deployment

Run the startup script to start the blockchain network and express API

After successful deployment, call the falling endpoint to enroll the admin user:

```
curl -H "Content-Type: application/json" -XPOST 'http://localhost:8081/users/enroll'
```

Then install dependencies and start the frontend with:

```
cd blockchain-comments
npm install
npm run dev
```

### Explorer

http://localhost:8080/#/login

user: exploreradmin

pw: exploreradminpw

### State CouchDB

http://localhost:5984/\_utils/#login

user: admin

pw: adminpw

### Clean Up

To teardown resources when you're done, run the clean up script.
