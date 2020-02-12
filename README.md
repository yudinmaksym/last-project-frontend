# X Project Frontend

Dashboard

Live at :address:

## Structure

```
.
├── .build
├── lib
├── pages
├── redux
├── src
├── next.config.js
└── README.md
```

## Installation

```
yarn install
```

## Running locally

```
yarn dev
```

## Running production build locally

Build the app
```
yarn build
```

Run the latest build
```
yarn start
```

### Running using docker

1. Build your Docker image
```
docker build -t dashboard .
```

2. Run the image
```
docker run -p 4000:80 dashboard:latest
```

## Deploying

1. Authenticate to AWS account
```
$(aws ecr get-login --no-include-email --region us-east-1)
```

2. Build your Docker image
```
docker build -t dashboard .
```

3. Tag your image
```
docker tag dashboard:latest 261417093702.dkr.ecr.us-east-1.amazonaws.com/dashboard:latest
```

4. Push the image to Repository

```
docker push 261417093702.dkr.ecr.us-east-1.amazonaws.com/dashboard:latest
```

STAGE

```
docker build --build-arg DOCKER_ENV=stage -t dashboard.stage .
```

```
docker tag dashboard.stage:latest 261417093702.dkr.ecr.us-east-1.amazonaws.com/dashboard.stage:latest
```

```
docker push 261417093702.dkr.ecr.us-east-1.amazonaws.com/dashboard.stage:latest
```

```
docker run -p 4000:80 dashboard.stage:latest
```