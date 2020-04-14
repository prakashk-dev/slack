#!/bin/bash

CMD=$1
shift

case $CMD in

    dev)
        echo "Application is running in development mode"
        docker-compose build development && \
        docker-compose up -d development && \
        docker-compose logs -f
        ;;
    prod)
        echo "Preparing for production build"
        docker-compose build production && \
        docker-compose up -d production
        ;;

    stop)
        docker-compose down
        ;;

    *)
        echo usage: "dev|prod|stop"
        exit 1
        ;;
esac 