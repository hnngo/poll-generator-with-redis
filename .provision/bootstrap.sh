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
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(30) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);"

# Create table poll
psql -U polladmin pollredis -h localhost -c "CREATE TABLE polls (
  poll_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  question VARCHAR(255) NOT NULL,
  options text[] NOT NULL,
  date_created TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  private BOOL NOT NULL DEFAULT false,
  multiple_choice BOOL NOT NULL DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);"

# Create table poll_answer
psql -U polladmin pollredis -h localhost -c "CREATE TABLE poll_answers (
  pollanswer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL,
  user_id UUID,
  anonymous BOOL NOT NULL DEFAULT false,
  answer_index int[] NOT NULL,
  UNIQUE(poll_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (poll_id) REFERENCES polls(poll_id) ON DELETE CASCADE
);"

# Create sample user and poll
insertUser=$(psql -X -A -U polladmin pollredis -h localhost -t -c "INSERT INTO users (name, email, password) VALUES ('Admin', 'admin7@test.com', 'admin123') RETURNING user_id;")

adminId="$(cut -d' ' -f1 <<<$insertUser)"

insertPoll=$(psql -X -A -U polladmin pollredis -h localhost -t -c "INSERT INTO polls (user_id, question, options) VALUES ('$adminId', 'Example - What is your favorite color?', '{\"Red\", \"Blue\", \"Green\"}') RETURNING poll_id;")

pollId="$(cut -d' ' -f1 <<<$insertPoll)"

for i in `seq 1 14`; do
  psql -U polladmin pollredis -h localhost -c "INSERT INTO poll_answers (poll_id, answer_index, anonymous) VALUES ('$pollId', '{0, 2}', true);"
done

for i in `seq 1 27`; do
  psql -U polladmin pollredis -h localhost -c "INSERT INTO poll_answers (poll_id, answer_index, anonymous) VALUES ('$pollId', '{0, 1}', true);"
done


# Rebuild the bycript
cd /vagrant/
npm install --save bcrypt

# Run the server
npm run vagrant --prefix /vagrant/

# Run postgresql in vagrant
# sudo su - postgres
# psql


