#!/bin/bash

if [ ! -d build ];
then
	sudo mkdir ./build
fi
#sudo cmake clear
sudo rm -rf ./build/*
cd ./build

cmake -DCMAKE_TOOLCHAIN_FILE=/data/develop/scripts/dcmtk/toolsChain.cmake ../

