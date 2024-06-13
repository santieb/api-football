import pymysql
from sqlalchemy import (
    create_engine,
    Table,
    Column,
    Integer,
    String,
    Date,
    Boolean,
    MetaData,
)
import pandas as pd
import json
import boto3
import io
import os

DB_NAME = "app"
SECRET_MANAGER_ARN = os.environ["SECRET_MANAGER_ARN"]

secrets_manager = boto3.client("secretsmanager")
s3_client = boto3.client("s3")


def lambda_handler(event, context):
    try:
        print("Fetching secrets from Secrets Manager...")
        secret_response = secrets_manager.get_secret_value(SecretId=SECRET_MANAGER_ARN)
        secret_dict = json.loads(secret_response["SecretString"])

        if not (
            secret_dict.get("username")
            and secret_dict.get("password")
            and secret_dict.get("host")
        ):
            raise ValueError(
                "Failed to retrieve database credentials from Secrets Manager."
            )

        print("Creating database if not exists...")
        create_database_if_not_exists(secret_dict)
        print("Database created if not exists.")

        print("Creating SQLAlchemy engine...")
        engine = create_engine(
            f'mysql+pymysql://{secret_dict["username"]}:{secret_dict["password"]}@{secret_dict["host"]}/{DB_NAME}'
        )

        metadata = MetaData()
        football_matches = Table(
            "football_matches",
            metadata,
            Column("id", Integer, primary_key=True),
            Column("match_date", Date, nullable=False),
            Column("home_team", String(255), nullable=False),
            Column("away_team", String(255), nullable=False),
            Column("home_score", Integer, nullable=False),
            Column("away_score", Integer, nullable=False),
            Column("tournament", String(255), nullable=False),
            Column("city", String(255), nullable=False),
            Column("country", String(255), nullable=False),
            Column("neutral", Boolean, nullable=False),
        )

        metadata.create_all(engine)

        print("Fetching CSV from S3...")
        csv_bucket = event["Records"][0]["s3"]["bucket"]["name"]
        csv_key = event["Records"][0]["s3"]["object"]["key"]

        response = s3_client.get_object(Bucket=csv_bucket, Key=csv_key)
        csv_content = response["Body"].read()

        print("Reading data from CSV...")
        df = pd.read_csv(io.BytesIO(csv_content))
        print("Data read successfully.")

        print("Inserting data into the database...")
        df.to_sql(name="football_matches", con=engine, if_exists="replace", index=False)
        print("Data inserted successfully.")

        return {"statusCode": 200, "body": json.dumps("Data inserted successfully!")}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"statusCode": 500, "body": json.dumps(f"Error: {str(e)}")}


def create_database_if_not_exists(secret_dict):
    connection = pymysql.connect(
        host=secret_dict["host"],
        user=secret_dict["username"],
        password=secret_dict["password"],
    )
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    finally:
        connection.close()
