#!/bin/sh
echo "Copying node_modules folder ..."
cp -r /usr/cache/node_modules/. /usr/app/node_modules/
echo "Finish copying node_modules folder ..."

exec npm run dev
