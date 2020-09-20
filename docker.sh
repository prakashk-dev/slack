#!/bin/bash

PROJECT_NAME=${PROJECT_NAME:-bhetghat}
DOCKER_REPO=${DOCKER_REPO:-docker.prakashk.com}

build-container() {
    echo ${PROJECT_NAME}/bhetghat revision $( git describe --tags ) built $( date ) > backend/version
    echo From $( git show -s --format=%H ) on $( git log -1 --format=%cd --date=local ) >> backend/version
    docker-compose -f docker-compose.prod.yaml build --no-cache

}
# Promote one tag to another
promote-image() {
    docker tag $DOCKER_REPO/${PROJECT_NAME}/backend:$1 $DOCKER_REPO/${PROJECT_NAME}/backend:$2
    docker tag $DOCKER_REPO/${PROJECT_NAME}/frontend:$1 $DOCKER_REPO/${PROJECT_NAME}/frontend:$2
}

push-image(){
    docker push $DOCKER_REPO/${PROJECT_NAME}/backend:$1
    docker push $DOCKER_REPO/${PROJECT_NAME}/frontend:$1
}


CMD=$1
shift

case $CMD in

    build)
        ARGS=$@
        build-container
        ;;

    dev)
        echo "Application is running in development mode"
        docker-compose build
        docker-compose up -d
        docker-compose logs -f
        ;;

    push)
        push-image "$1"
        ;;

    pull)
        docker-compose  -f docker-compose.prod.yaml  pull
        ;;

    run)
        docker-compose  -f docker-compose.prod.yaml  up -d
        ;;

    make-release)
        # git tag -a "$1" -m "Tagging (staging) release $1"
        # git push origin --tags
        build-container
        promote-image master staging
        push-image staging
        ;;

    promote)
        promote-image staging production
        ;;

    down)
        docker-compose down --remove-orphans
        ;;

    *)

        echo "usages: $0 [dev|build|push|pull|run|make-release|promote|down]"
        exit 1
        ;;

esac