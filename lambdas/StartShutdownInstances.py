import json
import boto3

region = "us-east-1"
stack_key = "aws:cloudformation:stack-name"
stack_value = "cfn-infrastructure-sbarreto"


def get_ec2_instances_ids():
    ec2_client = boto3.client("ec2", region_name=region)
    ec2_instances = ec2_client.describe_instances(
        Filters=[
            {"Name": f"tag:{stack_key}", "Values": [stack_value]},
        ]
    )

    ec2_instance_ids = []
    for instance in ec2_instances["Reservations"][0]["Instances"]:
        ec2_instance_ids.append(instance["InstanceId"])

    return ec2_instance_ids


def get_rds_instances_ids():
    rds_client = boto3.client("rds", region_name=region)
    rds_instances = rds_client.describe_db_instances()

    rds_instance_ids = []
    for instance in rds_instances["DBInstances"]:
        if "Tags" in instance:
            for tag in instance["Tags"]:
                if tag["Key"] == stack_key and tag["Value"] == stack_value:
                    rds_instance_ids.append(instance["DBInstanceIdentifier"])

    return rds_instances_ids


def start_shutdown_instances():
    action = event["action"]

    if action == "start":
        ec2.start_instances(InstanceIds=instance_ids)
        print(f"Started EC2 instances: {ec2_instance_ids}")

        for db_instance_id in rds_instance_ids:
            rds_client.start_db_instance(DBInstanceIdentifier=db_instance_id)
            print(f"Started RDS instance: {db_instance_id}")

    if action == "stop":
        ec2.stop_instances(InstanceIds=instance_ids)
        print(f"Stopped EC2 instances: {ec2_instance_ids}")

        for db_instance_id in rds_instance_ids:
            rds_client.stop_db_instance(DBInstanceIdentifier=db_instance_id)
            print(f"Stopped RDS instance: {db_instance_id}")


def lambda_handler(event, context):
    start_shutdown_instances(event["action"] = 'stop')
