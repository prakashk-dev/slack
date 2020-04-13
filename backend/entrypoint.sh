#!/bin/sh
echo "Copying node_modules folder ... Be calm :)"
cp -r /usr/cache/node_modules/. /usr/app/node_modules/
echo "Finsih copying node_modules folder ... Enjoy"


CMD=$1
shift

case $CMD in

    dev)
        exec npm run dev
        ;;
    prod)
        exec npm run prod
        ;;
    *)
        echo usage: "dev|prod"
        exit 1
        ;;
esac