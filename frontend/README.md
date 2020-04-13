# Running Instruction

First Install docker and docker-compose in your machine.

### For Development purpose(This will also run npm install, which enables code intellisense for local development)

```
./docker.sh dev

```

And browse your browser to http://localhost:3000

### For production use

```
./docker.sh prod
```

This will serve the static content from nginx server. You can access the site in http://localhost:4000
