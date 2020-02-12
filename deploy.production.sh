#!/bin/bash
export BITBUCKET_BUILD_ID=${BITBUCKET_COMMIT}:${BITBUCKET_BUILD_NUMBER}
echo ${BITBUCKET_BUILD_ID}
# aws login
eval $(aws ecr get-login --region ${AWS_DEFAULT_REGION} --no-include-email)
# docker
docker build --build-arg DOCKER_ENV=${DOCKER_ENV} --build-arg TASK_DEFINITION=${TASK_NAME}:${TASK_VERSION} --build-arg BITBUCKET_BUILD_ID=${BITBUCKET_BUILD_ID} -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${AWS_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}
docker push ${AWS_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}

aws ecs update-service --cluster ${AWS_ECS_CLUSTER} --service ${AWS_ECS_SERVICE} --force-new-deployment