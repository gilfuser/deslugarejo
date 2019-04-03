#!/bin/bash

set -e
ARCH="x64"
TARGET=$(node -e "console.log(require('./package.json').devDependencies.electron.match(/\d+\.\d+.\d+/)[0])")
PLATFORM=$(node -e "console.log(process.platform)")

cd node_modules/node-sass/

# Build for Electron for current version
node-gyp rebuild --target=$TARGET --arch=$ARCH --dist-url=https://atom.io/download/electron

# Create vendor directory
VENDOR="vendor/$PLATFORM-$ARCH-69"
mkdir -p $VENDOR
cp build/Release/binding.node $VENDOR

cd ../../

# Clean up
rm -rf build