# node-app-as-binary-docker-boilerplate

This is a boilerplate to:

- build a binary from a node backend app
- works with docker
- interacting with the host system per ssh and ssh key from a docker container
- on a raspberry pi 4, for example
- run it in scale, replicated (soon)
- as normal user, not as root (soon)

## setup

Setup for a blank linux machine, like a desktop less version of the actual raspberry pi 4 system.  
This script is for systems, where docker is not installed.

Switch to the root user:

```bash
  sudo su
```

Then run from the project directory:

```
  chmod +x setup.sh
  ./setup.sh
```

This will do:

- Install docker and docker-compose
- Add the user `pi` to the docker group
- Create an SSH-key on the docker host
- Setup config for the host's ssh server (sshd) by modifying `/etc/ssh/sshd_config`
  - activating `PubkeyAuthentication`
  - set the `AuthorizedKeysFile`

> If you have a working docker and docker-compose environment, just skip this step by commenting out the `#installDocker` function call in the `setup.sh` file. (soon as script parameter)

## production
At first, for dev or production, you have to install all the node modules. For this, you have to **build** the docker
image:

```bash
  docker-compose -f docker-compose-build.yml up
```

> Because `up` fires the `command` from the compose file.

After this, you can use the image with the binary inside.

```bash
  docker-compose up
```

## development
Build an actual image - or not  

```bash
  docker-compose -f docker-compose-build.yml up
```

This creates a binary version of the node app by installing all node modules and build the binary.

After this, you can use the image with all needed node modules inside.

```bash
  # with shell output
  docker-compose -f docker-compose-dev.yml up
  
  # or detached from console
  docker-compose -f docker-compose-dev.yml up -d  
```

Now it runs the container, but not the app.  
Then crawl into the container... in a second terminal tab...  

```bash
docker exec -it boilerplate-app-dev /bin/bash
```

...and start the app

```bash
npm start
```

> But why? This is why nodemon has problems with pure ES6 apps like this one. You have to restart the app manually.

### Adding a new node module

- In the dev mode, the sources are shared with the container.
- Just install a module. This changes the package json file.
- After adding a module, build the image again. (because the node modules are **not** shared with the container)

```bash
  docker-compose -f docker-compose-build.yml down --rmi all
  docker-compose -f docker-compose-build.yml up
```

Then restart your dev container.

## environment and configuration

- The `.env` file - primary for docker-compose - but also used by the `setup.sh` script
- The environment configuration is stored in `config/` with files like `default.conf`
- The "environment" equals their `ENVIRONMENT` variable and can be: `dev` or `prod` or `default` or `something`
- If no environment was given, the app uses the `default.conf`
- All values from the environment configuration files can be overwritten with environment variables
