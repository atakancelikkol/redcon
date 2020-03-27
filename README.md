# REDCON (remote ecu device contoller)

REDCON is a utility that makes it easier to connect and debug ECU boards. This project is designed to run on a raspberry pi device. This device is used for isolating ECU board from the network and controlling it remotely. A typical setup is shown in the diagram given below.


## Packet Forwarding
Configurable packet forwarding is used for directly accessing ECU boards. This is practical for using multiple ECU boards in the same network with predefined static IPs. An example is given below.

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

## Power Switch
Power switch is controlled by Raspberry PI's GPIO ports. This functionality is exposed by a web interface. Users can switch on/off ECU boards.

## UART Data


## USB Storage Device

