[![pipeline status](https://gitlab.com/redcon-remote/redcon/badges/development/pipeline.svg)](https://gitlab.com/redcon-remote/redcon/-/pipelines)
[![coverage](https://gitlab.com/redcon-remote/redcon/badges/development/coverage.svg?job=client)](https://gitlab.com/redcon-remote/redcon/-/tree/development/client)
[![coverage](https://gitlab.com/redcon-remote/redcon/badges/development/coverage.svg?job=server)](https://gitlab.com/redcon-remote/redcon/-/tree/development/server)
# REDCON (remote ecu device contoller)

REDCON is a utility that makes it easier to connect and debug ECU boards. This project is designed to run on all operating systems. Raspberry pi is selected target device. This device is used for isolating ECU board from the network and controlling it remotely. A typical setup is shown in the diagram given below.

## REDCON Overview 
![alt text](docs/diagrams/redcon-overview.png "Overview" )

# How to run
Please see the document at docs/README.md

# How to commit
1. Checkout a new branch from development to your feature branch
```
git checkout -b feature/redcon-<issue number>

bugfix/redcon-<issue number>
```
2. Complete the development on that branch and commit your code
3. Push your branch to the remote server
```
git push --set-upstream origin feature/redcon-<issue number>
```
4. Open a merge request to the development branch. After review it will be merged to the development by the reviewer.

# How to create release using Gitlab User Interface
1. To create a release, go to "Project overwiev>Releases" from left menu in Gitlab.
2. Choose New releases.
3. Add a release tag name for your application. (Ex: v1.0.0)
4. Select a branch. Release will be created from selected branch. (Ex: master)
5. Add a message as to your release. (Ex: Release v1.0.0)
6. Add release notes. This section is not optional. Changes can be defined in this section.
7. After choose "Create tag", created release can be seen under "Project overview>Releases".

# Coding Standarts
Please check [the coding standards document](docs/CodingStandards.md).

# REDCON Web Interface
When REDCON web interface is opened, features of REDCON which are listed below will be seen at the left menu.

1. Home
2. Board Control
3. Network Config
4. Serial Console
5. USB Storage
6. Utility
7. Logout

## Home
At the home page, user can get informations as to devices.

## Board Control
Power switch is controlled by Raspberry PI's GPIO ports. At the Board Control page, user can switch on/off ECU boards and can observe state of ECU boards.

## Network Config
Configurable packet forwarding is used for directly accessing ECU boards and development tools. This is practical for using multiple ECU boards in the same network with predefined static IPs. An example is given below.

| Device Name | IP Address
|-------------|-----------
|Raspberry PI | 10.0.3.15
|ECU1         | 192.168.0.1
|ECU2         | 192.168.0.2


| IP       | PORT  | DESTINATION
|----------|-------|------------------
| 10.0.3.15| 3000  | 192.168.0.1:8000
| 10.0.3.15| 3001  | 192.168.0.1:23
| 10.0.3.15| 4000  | 192.168.0.2:8000
| 10.0.3.15| 4001  | 192.168.0.2:23

## Serial Console
The purpose of this page is to observe UART data. At serial console page, serial devices which are mounted to Raspberry PI are listed and user can activate/deactivate them. Log messages which come from activated device can be downloaded as a text file. Also, user can send messages via serial console.

## USB Storage
(Some of) ECU Boards have to be updated by the help of USB Devices. The main aim is to realize that function remotely. Also, user can create folder on USB device and delete folder from USB device. In addition, USB device can be formatted in this section.

## Utility
At the utility page, additional services are included. For example, target computer which is run REDCON can be rebooted in this section.

## Logout
REDCON allows to login only one user. User can be logged out via this section.