#!/bin/sh
echo "Building client ..."

# build front end project
cd ../client && npm run build
if [ $? -ne 0 ]
then
  echo "Client Build failed";
  exit 1;
fi
cd -

# copy build files to public folder
cp ../client/dist/* ../server/public/

echo "Done."

# start run while loop with nohup
cd ../server
sudo nohup ..scripts/util/whilerun.sh > server-log.txt 2>&1 &
cd -

echo "Server will start shortly in the background."