#!/bin/sh
echo "Building client ..."
echo "BUILD PROJECT"

# build front end project
cd ../client 
npm install
npm run build
if [ $? -ne 0 ]
then
  echo "Client Build failed";
  exit 1;
fi
cd -

# copy build files to public folder
cp ../client/dist/* ../server/public/ -R

echo "Build Done."
  
cd ../server
npm install
cd -
