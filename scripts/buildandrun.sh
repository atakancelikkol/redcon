#!/bin/sh
echo "Building client ..."
BUILD_PROJECT=1
RUN_PROJECT=1
for arg in "$@"
do
  case $arg in 
    -nb|--no-build)
    BUILD_PROJECT=0
    shift
    ;;    
    -nr|--no-run)
    RUN_PROJECT=0
    shift
    ;;
  esac
done

echo "BULD PROJECT" $BUILD_PROJECT
echo "RUN PROJECT" $RUN_PROJECT

if [ $BUILD_PROJECT -eq 1 ]
then
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
fi

if [ $RUN_PROJECT -eq 1 ];
then
  # start run while loop with nohup
  cd ../server
  nohup ../scripts/util/whilerun.sh > server-log.txt 2>&1 &
  cd -

  echo "Server will start shortly in the background."
fi
echo "Completed."
