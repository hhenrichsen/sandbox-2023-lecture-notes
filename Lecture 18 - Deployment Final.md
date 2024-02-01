<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Housekeeping](#housekeeping)
- [News](#news)
- [Deploying a Lambda Container](#deploying-a-lambda-container)
- [SST (Serverless STack) and a Simple Image Host](#sst-serverless-stack-and-a-simple-image-host)
- [Reading](#reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Housekeeping

- LearningSuite is published; I forgot to hit publish last week but it's open as
  of Monday.
- Please use hhenrich@byu.edu to communicate with me over email; the university
  has asked that all email communications I do with you all are done via that
  email.

## News

- [Neuralink does their first human trial](https://www.cnbc.com/2024/01/29/elon-musks-neuralink-implants-brain-tech-in-human-patient-for-the-first-time.html)
- [DeepMind AlphaDev discovers faster sorting algorithms](https://deepmind.google/discover/blog/alphadev-discovers-faster-sorting-algorithms/)
- [Italy tells OpenAI that ChatGPT violates EU privacy regulations](https://apnews.com/article/openai-chatgpt-data-privacy-italy-a6ff88b53ae611ca4dee917e872ac278)

## Deploying a Lambda Container

Here's my basic project setup (also available
[here](https://github.com/hhenrichsen/lambda-container-deploy)):

```bash
mkdir my-lambda
cd my-lambda
npm init -f
npm i -D esbuild typescript eslint prettier
touch src/index.ts
touch tsconfig.json
```

`tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2020",
    "strict": true,
    "preserveConstEnums": true,
    "noEmit": true,
    "sourceMap": false,
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

`package.json`

```json
{
  "name": "my-lambda",
  "version": "1.0.0",
  "main": "src/index.ts",
  "private": true,
  "scripts": {
    "build": "tsc && esbuild src/index.ts --bundle --minify --platform=node --outfile=dist/index.js"
  },
  "keywords": []
  // ...
}
```

`src/index.ts`

```ts
export const handler = async (event: any, context: any) => {
  console.log(event);
  console.log(context);
  return "Hello World!";
};
```

`Dockerfile`

```Dockerfile
FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM amazon/aws-lambda-nodejs:18
COPY --from=builder /app/dist/index.js ./
COPY package*.json ./
RUN npm install --production
CMD [ "index.handler" ]
```

Now to build the container and run it locally:

```bash
docker build . -t my-lambda
docker run --rm -p 8080:8080 my-lambda
```

And to test it locally:

```bash
aws lambda invoke \
--region us-west-1 \
--endpoint http://localhost:8080 \
--no-sign-request \
--function-name function \
--cli-binary-format raw-in-base64-out \
--payload '{"a":"b"}' output.txt
```

Now to deploy it:

```bash
aws iam create-role --role-name lambda-ex --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"}]
  }'

arn:aws:iam::778144397950:role/lambda-ex
```

```bash
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin XXXXXXXXXXXX.dkr.ecr.us-west-1.amazonaws.com/my-lambda
docker tag my-lambda:latest XXXXXXXXXXXX.dkr.ecr.us-west-1.amazonaws.com/hhenrichsen-ecr/my-lambda:latest
docker push XXXXXXXXXXXX.dkr.ecr.us-west-1.amazonaws.com/hhenrichsen-ecr/my-lambda:latest
```

```bash
aws lambda create-function \
--package-type Image \
--function-name lambda-docker-hello-world \
--role arn:aws:iam::XXXXXXXXXXXX:role/lambda-ex \
--code ImageUri=XXXXXXXXXXXX.dkr.ecr.us-west-1.amazonaws.com/hhenrichsen-ecr/lambda-my-lambda:latest
```

```bash
aws lambda \
--region us-west-1 invoke \
--function-name my-lambda \
--cli-binary-format raw-in-base64-out \
--payload '{"a":"b"}' \
output.txt
```

## SST (Serverless STack) and a Simple Image Host

We'll be talking about [this repo](https://github.com/hhenrichsen/hx2-images).

SST is fairly approachable, but is JS-only. It generates code to allow you to
use your infrastructure in a typesafe way, and includes developer tooling. I
think it's pretty cool.

There are other tools like this, including:

- [Serverless Framework](https://www.serverless.com/framework) - mainly focused
  on lambda creation and deployment
- [Terraform](https://www.terraform.io/) - lower level, deals with creating
  individual resources as code
- [Amazon CDK](https://aws.amazon.com/cdk/)

## Reading

None! Q&A Session next time. Find something interesting to share for the News
section next time.
