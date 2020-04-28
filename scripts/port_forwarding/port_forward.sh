#!/bin/bash

validation() {

if [[ ! $eth0_destination ]]; then
	echo eth0_destination does not exist. 1>&2
elif [[ ! $eth0_destination =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/{0,1}[0-9]{0,3}$ ]]; then
	echo Invalid eth0_destination definition. 1>&2
	exit 0
fi

if [[ ! $RedPine_Local_Eth_Adapt ]]; then
	echo RedPine_Local_Eth_Adapt does not exist. 1>&2
fi

if [[ ! $ECU_Eth_Adapter ]]; then
	echo ECU_Eth_Adapter does not exist. 1>&2
fi

if [[ ! $ECU_Ip ]]; then
	echo ECU_Ip does not exist. 1>&2
elif [[ ! $ECU_Ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
	echo Invalid ECU_Ip definition. 1>&2
fi

if [[ ${#config[@]} = 0 ]]; then
	echo config array does not exist 1>&2
	exit 0
elif [ $((${#config[@]} % 3)) = 0 ]; then
	for ((i=2 ; i<${#config[@]} ; i=i+3)) ; do
		if [[ !  ${config[$i-2]} =~ ^[0-9]{1,5}$ ]] || [[ "${config[$i-2]}" -gt 65535 ]]; then
			echo Invalid element definition for config[$((i-2))]. 1>&2
		fi
		
		if [[ !  ${config[$i-1]} =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
			echo Invalid element definition for config[$((i-1))]. 1>&2
		fi		
				
		if [[ !  ${config[$i]} =~ ^[0-9]{1,5}$ ]] || [[ "${config[$i]}" -gt 65535 ]]; then
				echo Invalid element definition for config[$i]. 1>&2
		fi					
	done
else	
	echo Invalid array configuration. 1>&2
fi

}

source ./custom.config
validation
iptables -F
iptables -F -t nat

#iptables -A FORWARD -i $RedPine_Local_Eth_Adapt -o $ECU_Eth_Adapter -j ACCEPT
#iptables -A FORWARD -i $ECU_Eth_Adapter -o $RedPine_Local_Eth_Adapt -j ACCEPT
#iptables -t nat -A POSTROUTING -o $ECU_Eth_Adapter -j MASQUERADE

ip route add $eth0_destination dev $RedPine_Local_Eth_Adapt
set -e
iptables -t nat -A POSTROUTING ! -d $eth0_destination -o $ECU_Eth_Adapter -j SNAT --to-source $ECU_Ip

for ((i=2 ; i<=${#config[@]} ; i=i+3)) ; do

	iptables -t nat -A PREROUTING -p tcp -i $RedPine_Local_Eth_Adapt --dport ${config[$i-2]} -j DNAT --to-destination ${config[$i-1]}:${config[$i]}
	iptables -A FORWARD -p tcp -d ${config[$i-1]} --dport ${config[$i]} -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT

done
echo "Done"
exit 0
