#!/bin/bash
echo "Pulling master branch"
git pull origin master
echo "Finish pulling master branch"

cd backend
echo "Building backend production images"
docker-compose build --no-cache production
./docker.sh prod

cd ../frontend
echo "Building frontend production image"
docker-compose build --no-cache production
./docker.sh prod