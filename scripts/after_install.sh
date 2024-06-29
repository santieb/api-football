#!/bin/bash

RDSSecrets="arn:aws:secretsmanager:us-east-1:844045035952:secret:RDSSecrets-ABT04snJhb2x-ccYn5w"
AWS_REGION="us-east-1"
StackName="cfn-infrastructure-sbarreto"

SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "${RDSSecrets}" --region "${AWS_REGION}" --query SecretString --output text)
echo "Secret JSON: $SECRET_JSON"

DB_HOST=$(echo "${SECRET_JSON}" | jq -r '.host')
DB_PASSWORD=$(echo "${SECRET_JSON}" | jq -r '.password')
DB_DATABASE=$(echo "${SECRET_JSON}" | jq -r '.dbInstanceIdentifier')
DB_USER=$(echo "${SECRET_JSON}" | jq -r '.username')
DB_PORT=$(echo "${SECRET_JSON}" | jq -r '.port')

cat <<EOF | sudo tee /home/ec2-user/myapp/app/.env >/dev/null
AWS_REGION=${AWS_REGION}
LOG_GROUP_NAME=${StackName}
API_PORT=3000
DB_HOST=${DB_HOST}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=app
DB_USER=${DB_USER}
DB_PORT=${DB_PORT}
EOF

echo "generated env file"

cd /home/ec2-user/myapp/app/
docker-compose up --build -d