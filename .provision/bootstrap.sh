#!/usr/bin/env bash

# Update and upgrade latest version
sudo apt-get update
sudo apt-get upgrade -y

# Install redis
sudo apt-get install redis-server -y

# Install postgresql
sudo apt-get install wget ca-certificates
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo apt-get install postgresql postgresql-contrib -y

# Install nginx
sudo apt-get install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install nodejs, npm
sudo apt-get update
sudo apt-get install curl python-software-properties
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get -y install nodejs
sudo apt-get -y install npm

# Build react folder
# cd /vagrant/views
# sudo npm run build
# cd ~

# Copy nginx config to default
sudo rm /etc/nginx/sites-available/default
sudo cp /vagrant/.provision/nginx/nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo /etc/init.d/nginx reload

# Run the server
# cd /vagrant/ 
# sudo node index.js

# Run postgresql in vagrant
# sudo su - postgres
# psql


