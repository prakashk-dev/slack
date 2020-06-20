# Bhetghat Chat application

### Available commands

| Command                    | Description                                                                   |
| -------------------------- | ----------------------------------------------------------------------------- |
| `./docker.sh dev`        | Run application in development mode                                           |
| `./docker.sh build` |      Build application with :master environment                                    |
| `./docker.sh run`   | Run images with :master flag                                                         |
| `./docker.sh make-release`       | staging release                                     |

### Url 

Development environment are available on http://localhost:3000 (frontend) and http://localhost:3001 (backend)

Production images are available on http://localhost:4000 (frontend) and http://localhost:4001 (backend)
**What** happens
 
 > Nice thing happends 

## Making release to staging

```bash
./docker.sh make-release ${git_tag}

```
This will 
* add and push git tag
* update the version file
* build the container with --no-cache flag
* promote docker.bhet-ghat.com/bhetghat/[backend|frontend]:master image to staging
* and push docker.bhet-ghat.com/bhetghat/backend:staging and docker.bhet-ghat.com/bhetghat/frontend:staging image

## Promote staging image to production and push production image

```bash
# This will promote docker.bhet-ghat.com/bhetghat/{frontend|backend}:staging to docker.bhet-ghat.com/bhetghat/{frontend|backend}:production
./docker.sh promote

#This will push the docker.bhet-ghat.com/bhetghat/{backend|frontned}:production image
./docker.sh push production
```
