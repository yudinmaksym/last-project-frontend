#!/bin/bash
export BITBUCKET_BUILD_ID=${BITBUCKET_COMMIT}:${BITBUCKET_BUILD_NUMBER}
echo ${BITBUCKET_BUILD_ID}
apt-get update
apt-get -y install gettext-base
#register task definition
envsubst < task-definition-template > task-definition.json
export TASK_VERSION=$(aws ecs register-task-definition --cli-input-json file://task-definition.json | grep revision | cut -d ":" -f2 | cut -d "," -f1 | tr -d ' ')
echo ${TASK_NAME}:${TASK_VERSION}
# aws login
eval $(aws ecr get-login --region ${AWS_DEFAULT_REGION} --no-include-email)
# docker
docker build --build-arg DOCKER_ENV=${DOCKER_ENV} --build-arg TASK_DEFINITION=${TASK_NAME}:${TASK_VERSION} --build-arg BITBUCKET_BUILD_ID=${BITBUCKET_BUILD_ID} -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${AWS_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}
docker push ${AWS_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}
#restart aws service
export RUNNING_TASK=$(aws ecs list-tasks --cluster $AWS_ECS_CLUSTER --service-name $AWS_ECS_SERVICE | grep arn:aws:ecs:us-east-1:261417093702:task/ | tr -d ' ' | tr -d '"')
echo ${RUNNING_TASK}
aws ecs stop-task --task $RUNNING_TASK --cluster $AWS_ECS_CLUSTER
aws ecs update-service --cluster ${AWS_ECS_CLUSTER} --service ${AWS_ECS_SERVICE} --task-definition ${TASK_NAME}:${TASK_VERSION}