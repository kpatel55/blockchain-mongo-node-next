# Blockchain Comments

A simple blockchain app for storing comments.

## Usage

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

To clean resources when you're done, run the cleanup script.
