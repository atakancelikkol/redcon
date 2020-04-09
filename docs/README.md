# Install REDCON to Raspberry PI

## Clone repository
Clone REDCON repository and checkout development branch
```
git clone https://gitlab.com/redcon-remote/redcon.git

# you can also clone using ssh key
git clone git@gitlab.com:redcon-remote/redcon.git

cd redcon
git checkout development
```

## Dependencies
REDCON is written in Javascript, it requires nodejs and npm to run.
```
sudo apt-get install nodejs npm
```

## How to Run
Build and run script is can be found on <project_dir>/scripts/buildandrun.sh. This script builds the client project and copies it to server's public directory. Then starts the server in the background.
```
cd scripts
# sudo is required as server will listen to port 80
sudo ./buildandrun.sh

# if you dont want to build it 
sudo ./buildandrun.sh --no-build

# if you dont want to run at the end
sudo ./buildandrun.sh --no-run
```
Server should be accesible at http://localhost

Note: If port 80 is already in use, script fill fail silently as it starts the server in the background. In an error case, please check the log file.
```
<project_dir>/server/server-log.txt
```

## Run server automatically on startup
In order to run a script on startup in Linux environment, add the following lines to /etc/rc.local file
```
# frontend will start at port 80
cd <project_directory>/scripts
./buildandrun.sh
cd -
```


## How to run development version
For development, client and server should be run separately.
```
# frontend will start at port 8080
cd client
# if you didnt install the dependencies, call npm install first
npm install
npm run serve
cd ..

# backend will start at port 3000
cd server
# if you didnt install the dependencies, call npm install first
npm install
npm run serve
cd ..
```
Server should be accesible at http://localhost:8080