#!/usr/bin/env zsh

echo $(pwd)

if [ ! -d ./node_modules ]; then
    echo "Installing packages"
    pnpm i  -force --loglevel=http
fi


echo "Starting your application"

pnpm concurrently

