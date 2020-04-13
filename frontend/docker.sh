#!/bin/bash

CMD=$1
shift

case $CMD in

    dev)
        echo "Application is running in development mode"
        echo "Installing node_modules in host machine for code intellisense in dev environment"
        npm install
        docker-compose build dev && \
        docker-compose up -d dev && \
        docker-compose logs -f
        ;;
    prod)
        echo "Preparing for production build"
        docker-compose build prod && \
        docker-compose up -d prod
        ;;

    stop)
        docker-compose down
        ;;

    *)
        echo usage: "dev|prod|stop"
        exit 1
        ;;
esac 