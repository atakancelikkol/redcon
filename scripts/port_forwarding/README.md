# Port Forwarding script and config file
The main aim of this concept is remote connection to Electronic Control Unit’s(ECU) Hosts by using raspberry pi as a gateway. Port Forwarding is used to direct TCP packages to appropriate ports.

In this configuration, Raspberry pi has two ethernet devices. Where, 

eth1 is implies that Debug Pc’s IP address which is defined by ECU. 

eth0 is used for remote connection between local PC and Raspberry pi. 

To connection between local PC and ECU, TCP Packages is forwarded from Raspberry Pi eth0 to host IP of ECU by using some port forwarding rules


## Script 
port_forwarding script defines the rules for the package forwarding. 


## Running Script on Every Booting 

In order to execute the script add the following line to rc.locale
sudo gedit /etc/rc.local 

bash /home/pi/Desktop/port_forward.sh

## Config file of the Script

Config file defines the eth interfaces and the mappped ports and ip's of the raspberry and also ECU. These configrations can be changed acording to set-up.




# Initial commands for forwarding
sudo iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o eth1 -j MASQUERADE


sudo ip route add 192.168.0.0/16 dev eth0
sudo iptables -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth1 -j SNAT --to-source 10.32.32.40

sudo iptables -t nat -A PREROUTING -p tcp -i eth0 --dport 5000 -j DNAT --to-destination 10.32.32.0:23
sudo iptables -A FORWARD -p tcp -d 10.32.32.0 --dport 23 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

sudo iptables -t nat -A PREROUTING -p tcp -i eth0 --dport 8000 -j DNAT --to-destination 10.32.32.0:8000
sudo iptables -A FORWARD -p tcp -d 10.32.32.0 --dport 8000 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
