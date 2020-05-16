#!/bin/bash

CMD=$1
shift

case $CMD in

    dev)
        echo "Application is running in development mode"
        docker-compose build --no-cache
        docker-compose up -d
        docker-compose logs -f
        ;;
    build)
        docker-compose build --no-cache
        ;;
    build:prod)
        echo "Preparing for production build"
        exit 1
        ;;
    run:prod)
        echo "Running production build"
        exit 1
        ;;
    push)
        echo "Pushing images"
        exit 1
        ;;
    stop)
        docker-compose down
        ;;

    *)
        echo usage: "dev|build|build:prod|run:prod|push|stop"
        exit 1
        ;;
esac 