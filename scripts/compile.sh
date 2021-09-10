#!/bin/bash

echo "Compiling..."

rm -rf dist
mkdir dist

hardhat compile
hardhat typechain

yarn g:tsc
cp -a types/* dist/
cp -a dist/types/* dist/

yarn g:prettier dist -w
yarn g:prettier types -w

echo "Done!"