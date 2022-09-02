#!/bin/bash
cd backend
rm -rf wallet
pm2 delete app.js
cd ../fabric/test-network
./network.sh down
cd ../../explorer
docker-compose down -v
rm -r organizations/*
