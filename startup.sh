#!/bin/bash
cd fabric/test-network
./network.sh up createChannel -s couchdb -ca
./network.sh deployCC -ccn comment -ccp ../add-comment-ledger -ccl javascript
cd ../../explorer
cp -R ../fabric/test-network/organizations/* ./organizations
mv organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/*_sk organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/priv_sk
docker-compose up -d
cd ../backend
pm2 start app.js
