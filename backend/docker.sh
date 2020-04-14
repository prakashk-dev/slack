  
#!/bin/bash

CMD=$1
shift

case $CMD in

    dev)
        docker-compose up -d --build development
        docker-compose logs -f development
        ;;
    prod)
        docker-compose up -d --build production
        ;;

    stop)
        docker-compose down
        ;;

    *)
        echo usage: "dev|prod|stop"
        exit 1
        ;;
esac