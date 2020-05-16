#!/bin/bash
git pull origin master
cd backend
docker-compose build production --no-cache
./docker.sh prod
cd ../frontend
docker-compose build production --no-cache
./docker.sh prod