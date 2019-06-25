#!/usr/bin/env bash

# Update and upgrade latest version
sudo apt-get update
sudo apt-get upgrade -y

# Install redis
sudo apt-get install redis-server -y
sudo systemctl enable redis-server.service

# Install postgres
sudo apt-get install postgresql-9.5 -y

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

# Copy nginx config to default
sudo rm /etc/nginx/sites-available/default
sudo cp /vagrant/.provision/nginx/nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo /etc/init.d/nginx reload


# Config postgresql
sudo apt-get install wget ca-certificates
sudo wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo /etc/init.d/postgresql start
sudo cp /vagrant/.provision/postgresql/pg_hba.conf /etc/postgresql/9.5/main/pg_hba.conf
sudo /etc/init.d/postgresql reload

# Config locale
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
sudo locale-gen en_US.UTF-8

# Create roles and database
# sudo -u postgres psql
sudo cp /vagrant/.provision/postgresql/.pgpass ~/.pgpass
sudo chmod 0600 ~/.pgpass
sudo -u postgres psql -c "CREATE ROLE polladmin WITH LOGIN PASSWORD 'password';"
sudo -u postgres psql -c "ALTER ROLE polladmin SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE pollredis;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pollredis TO polladmin;"

# Add UUID lib generator
psql -U polladmin pollredis -h localhost -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Create table user
psql -U polladmin pollredis -h localhost -c "CREATE TABLE users (
  userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(30) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);"

# Rebuild the bycript
npm install bcrypt --prefix /vagrant/

# Run the server
# npm run vagrant --prefix /vagrant/

# Run postgresql in vagrant
# sudo su - postgres
# psql


