<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [News](#news)
- [Deployment](#deployment)
- [Containers](#containers)
  - [Why Containers?](#why-containers)
  - [Adding Containers to My App](#adding-containers-to-my-app)
- [AWS and Friends](#aws-and-friends)
- [IAM](#iam)
- [EC2 and Compute Servers](#ec2-and-compute-servers)
- [Lambda and Serverless Compute](#lambda-and-serverless-compute)
- [ECS and Container Servers](#ecs-and-container-servers)
- [Custom AI Deployment / GPUs](#custom-ai-deployment--gpus)
- [Reading](#reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## News

- [AWS to start charging for IPv4](https://supabase.com/blog/ipv6)
-

## Deployment

Deploying an app is an important part of getting your app in front of users, and
there are many, many ways to do this. There's nothing to stop you from buying a
small virtual private server and doing the same thing you do in your development
environment on there.

Deployment tends to get more complex the more you scale, and the more components
you use. I'm going to be focusing on compute resources today (the things that
actually run your code), and we'll expand from there as this 3-part lecture goes
on.

## Containers

One of the first things I think of for deployment are containers. Containers are
cool. They're tiny, isolated environments that contain your code and
dependencies, allowing you to run your code in a consistent and secure setup.
They are frequently compared to Virtual Machines, but they work a little
differently. Most importantly, they allow you to keep your production and
development environments the same, or very similar.

Docker containers are made up of cached layers, each based on a command. Some of
the most common commands are `ADD` and `COPY` which add files to the container,
`RUN` which runs commands on the container, `CMD` which sets the default
command, and a collection of other more niche verbs.

I have some slides from HackUSU last year
[here](https://docs.google.com/presentation/d/1ivHA3nHSwD4pjBPeDdqNAfYRbRSVcug668aRqhadLYg/edit?usp=sharing)
that I'll go through.

### Why Containers?

- Containers are self-contained; you don't need to worry about different machine
  configurations or dependencies, since all of those are managed within the
  container.
- Containers are minimal; ideally when building a container, you're using the
  bare minimum you need to run your app. This makes things more secure since
  there are fewer avenues of attack for malicious users.
- Containers can be fast; if you set up your caching properly, your container
  will only need to rebuild when there are related changes to what they are
  trying to do (i.e. dependencies will only be reinstalled when there are
  changes to dependencies)

### Adding Containers to My App

There's a bit of config that I need to do on my app to make it work with Docker.
I'm going to enable
[standalone deployment](https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)
so that I can have Docker build this and then keep the end image small.

`apps/web/next.config.js`

```js
module.exports = {
  // ...
  output: "standalone",
};
```

Next, I need to make Prisma work with Docker: `packages/db/schema.prisma`

```prisma
generator client {
  binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x", "linux-musl-openssl-3.0.x", "rhel-openssl-1.0.x"]
}
```

For mine, I'm going to create a dockerfile for my app with a couple steps. The
first will be a build step:

`apps/web/Dockerfile`

```dockerfile
FROM node:20-alpine as base

FROM base as builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune @pointcontrol/web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN yarn global add turbo
RUN yarn global add pnpm

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml .
COPY --from=builder /app/pnpm-workspace.yaml .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
# Load some environment variables
ARG CLERK_USER_WEBHOOK_SECRET_KEY
ENV CLERK_USER_WEBHOOK_SECRET_KEY ${CLERK_USER_WEBHOOK_SECRET_KEY}
RUN pnpm turbo db:generate
RUN pnpm turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
# Disabled because I don't have static files
# COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
```

Then I can build my docker container:

```sh
docker build -f .\apps\web\Dockerfile . --build-arg CLERK_USER_WEBHOOK_SECRET_KEY=fake_value_for_next -t pointcontrol-next
```

And run it:

```
docker run --env-file=.env -p 3000:3000 pointcontrol-next
```

## AWS and Friends

AWS is not the only cloud provider out there; many of the services that I'm
going to talk through today and over the next couple weeks have equivalents on
other providers as well. The UI and pricing might be a bit different, but many
of them are trying to solve the same problems.

Here's a comparison chart from
[ByteByteGo](https://blog.bytebytego.com/p/ep70-cloud-services-cheat-sheet):
![Cloud provider comparison](assets/Cloud%20provider%20comparison.png)

These are not the only ones out there. I feel like I've given this advice
before, but generally my advice is to find one that works for what you're trying
to do, and optimize it as problems arise. Some other less-well-known ones:

- [Kurtosis](https://www.kurtosis.com/), for distributed containerized
  applications
- [Vultr](https://www.vultr.com/) for a simpler ecosystem than AWS

One example is what we talked about last time: WebSockets are hard to run on
Vercel. That sounds like a problem, and one we can solve by trying out different
providers, or continuing with what works on Vercel and then adding another
server that's running elsewhere.

## IAM

The recommended process for using AWS is to have a root account and some number
of other accounts underneath that root account that do the actual management.
IAM is the system that allows this.

IAM is also a permissions system; you can allow certain services to access other
services. One example is building docker images on an EC2 instance, and pushing
those to the ECR. In order to do that, you'll need to make sure that the EC2
instance you use has access to the ECR on your account.

## EC2 and Compute Servers

EC2 (and other providers' equivalents) are servers out in the providers' data
centers. Generally, you provision one and it starts up with the configured
operating system and settings.

These are fairly flexible; you can run databases on EC2 instances. You can copy
your development environment into an EC2 instance and call it production. I've
used EC2 instances as build minions that run formatting, tests, and compile my
code.

Basically, anything you can do with a linux server you can do with an EC2
server. The main limitations are storage (which we will talk about next week,
although [EBS](https://aws.amazon.com/ebs/) may be of interest if it's something
you're looking at now).

For instance, if I wanted to deploy my site to EC2, I might provision a new EC2
instance, and then do the following once I logged in:

```bash
# Install node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
. ~/.nvm/nvm.sh
nvm install --lts
corepack enable
# I might take an image here so I don't need to do this if I provision more machines
git clone https://github.com/hhenrichsen/point-control-next
cd point-control-next
git checkout next
pnpm install
pnpm build
# Copy static files; these should normally be served by a CDN but for simplicity's sake I'll have the backend serve these.
cp -r ./apps/web/.next/static ./apps/web/.next/standalone/apps/web/.next
pnpm start
```

There are GitHub actions that can handle doing the latter part of this for you
if you need a really simple CI pipeline, like the SSH action.

You may also want to look at something like pm2 to manage running your server
for you, since just starting the server will close it when you disconnect from
the session. There are other options like system services, `screen`, `tmux`,
etc. that can also help out here.

If I wanted to add Docker I could also do that:

```bash
yum update -y
amazon-linux-extras install docker
service docker start
usermod -a -G docker ec2-user
chkconfig docker on
```

And then I can use the container that I built earlier to run my project.

## Lambda and Serverless Compute

Lambdas are small, on-demand servers that can help to scale automatically. These
are normally used for things like:

- Writing endpoints that can scale up and down with demand
- Scheduled tasks, like database cleanup jobs
- Processing jobs, like getting data from third party providers or dealing with
  object files
- Queue listeners

There are many frameworks around setting these up, like
[Claudia.js](https://claudiajs.com/) and the
[Serverless Framework](https://www.serverless.com/).

## ECS and Container Servers

It doesn't always make sense to use a full EC2 instance, only to install docker
on it and run another, smaller server on top of an existing OS. This is where
ECS comes in. ECS can deploy and scale images published to the
[ECR](https://aws.amazon.com/ecr/), and makes a bit more sense than dealing with
container infrastructure yourself on individual compute instances.

GitHub has
[a guide here](https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-amazon-elastic-container-service)
for deploying a container to the ECR / ECS.

Part of the challenge I've had working with the ECS has been that there are
other services required to make it make sense. That's a common critique with AWS
moreso than ECS, however.

## Custom AI Deployment / GPUs

I've done some research and looked into providers who offer GPUs for compute
servers, and my findings have been generally that GPUs are quite expensive, and
that's been the case for quite some time. If cost is a concern, you may get
better results using a third-party provider that's already benefiting from an
economy of scale.

That said, you can get
[EC2 instances with GPUs attached](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-gpu.html)
for AI-related tasks, and that's not exclusive to AWS, either.

## Reading

**Skim:** [AWS - s3](https://aws.amazon.com/s3/) **Skim:**
[MinIO S3 - Docker Hub](https://hub.docker.com/r/minio/minio) **Read:**
[AWS EC2 - Storage Options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Storage.html)
**Read:**
[Slashing AWS Data Transfer Costs](https://www.bitsand.cloud/posts/slashing-data-transfer-costs/)
**Read:**
[FreeCodeCamp - AWS IAM Explained](https://www.freecodecamp.org/news/aws-iam-explained/)
