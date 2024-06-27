#!/bin/bash

DB_HOST="test-db.example.com"
DB_PASSWORD="mysecretpassword"
DB_DATABASE="testdb"
DB_USER="testuser"
DB_PORT="3306"

cat <<EOF | sudo tee /home/ec2-user/myapp/.env >/dev/null
AWS_REGION=us-east-1
LOG_GROUP_NAME=myapp-logs
API_PORT=3000
DB_HOST=$DB_HOST
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=$DB_DATABASE
DB_USER=$DB_USER
DB_PORT=$DB_PORT
EOF

sudo chown ec2-user:ec2-user /home/ec2-user/myapp/.env

echo ".env generado exitosamente."