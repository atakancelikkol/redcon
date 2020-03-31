#!/bin/sh

. /home/pi/Desktop/PortForwarding/int.config



sudo iptables -A FORWARD -i $RedPine_Local_Eth_Adapt -o $ECU_Eth_Adapter -j ACCEPT
sudo iptables -A FORWARD -i $ECU_Eth_Adapter -o $RedPine_Local_Eth_Adapt -j ACCEPT
sudo iptables -t nat -A POSTROUTING -o $ECU_Eth_Adapter -j MASQUERADE

sudo ip route add $eth0_destination dev $RedPine_Local_Eth_Adapt

for ((i=2 ; i<=${#config[@]} ; i=i+3)) ; do


sudo iptables -t nat -A POSTROUTING ! -d $eth0_destination -o $ECU_Eth_Adapter -j SNAT --to-source $ECU_Ip
sudo iptables -t nat -A PREROUTING -p tcp -i $RedPine_Local_Eth_Adapt --dport ${config[$i-2]} -j DNAT --to-destination ${config[$i-1]}:${config[$i]}
sudo iptables -A FORWARD -p tcp -d ${config[$i-1]} --dport ${config[$i]} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT


done

exit 0
