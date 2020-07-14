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

REDCON requires sync.exe for Microsoft Windows win32 platform USB synchronization issues. sync.exe should be located in ..\server\bin\win32 folder. sync.exe can be downloaded from https://docs.microsoft.com/en-us/sysinternals/downloads/sync .

## How to Run
Build script can be found on <project_dir>/scripts/build.sh. This script builds the client project and copies it to server's public directory.
```
cd scripts
# sudo is required as server will listen to port 80
sudo ./build.sh
```

## Run server automatically on startup
In order to run a script on startup in Linux environment, copy service file into /lib/systemd/system as a root user. This service file can be found on <project_dir>/scripts/util/redcon-server. 
```
sudo cp <project_dir>/scripts/util/redcon-server.service /lib/systemd/system/
```
In the service file, "ExecStart" and "WorkingDirectory" services must be changed according to your <project_dir>.

## How to test service file
After copying service file, run following commands to test the service file whether it is working properly.
```
#Service can be started with this line
systemctl start redcon-server.service
```
Server should be accesible at http://localhost
Note: If port 80 is already in use, script fill fail silently as it starts the server in the background. In an error case, please check the log file.
```
<project_dir>/server/logs/Server.log
```

```
#To Control status of this service
systemctl status redcon-server.service
```

```
#Service can be stopped with this line
systemctl stop redcon-server.service
```
If the service is working correctly, run following line to start server automatically on boot up.
```
sudo systemctl enable redcon-server.service
```
If the you do not want to start server automatically on boot up after enabling the service, simply you can disable it by this line
```
sudo systemctl disable redcon-server.service
```

## How to run development version
For development, client and server should be run separately.
```
# if you didnt install the dependencies, call npm install at <project_loc> first 
npm install

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

## How to create unit-test scripts
To create unit-test scripts on either client or server side follow the instructions. 
```
# To create unit-test scripts on the client -> go to the <project_loc>/client/test/unit/
cd <project_loc>/client/test/unit/

# Create unit-test script named as my_unit_test.test.js in the above directory

# To create unit-test scripts on the server -> go to the <project_loc>/server/test/unit/
cd <project_loc>/server/test/unit/

# Create unit-test script named as my_unit_test.test.js in the above directory
```

## How to test units and get coverage reports
For the unit-test, client and server should be tested separately.
```
# Go to the <project_loc>/client/ 
cd <project_loc>/client/

# Run unit-tests on the client at <project_loc>/client/
npm run test

# Go to the <project_loc>/server/ 
cd <project_loc>/server/

# Run unit-tests on the server at <project_loc>/server/
npm run test
```

To test the units and getting the code coverage report for client and server, they should be tested and covered separately.
```
# Go to the <project_loc>/client/ 
cd <project_loc>/client/

# Run unit-tests and get coverage report on the client at <project_loc>/client/
npm run coverage

# Go to the <project_loc>/server/ 
cd <project_loc>/server/

# Run unit-tests on the server at <project_loc>/server/
npm run coverage
```