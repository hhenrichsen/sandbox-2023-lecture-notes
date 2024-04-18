# Lecture 02 - Project Setup

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setting Up](#setting-up)
- [Directory Structure](#directory-structure)
  - [Apps](#apps)
  - [Packages](#packages)
  - [Tooling](#tooling)
  - [Devops](#devops)
  - [Other files](#other-files)
- [Initializing the Repo](#initializing-the-repo)
- [Setting up a formatter](#setting-up-a-formatter)
- [Adding a Database](#adding-a-database)
  - [Using Environment Variables for Configuration](#using-environment-variables-for-configuration)
  - [Exposing the Database to other packages](#exposing-the-database-to-other-packages)
  - [Using Docker to quickly setup local services](#using-docker-to-quickly-setup-local-services)
  - [Writing scripts to operate on the database](#writing-scripts-to-operate-on-the-database)
  - [Caching the generated database files](#caching-the-generated-database-files)
  - [Updating the formatter](#updating-the-formatter)
- [Using the Database in our Next.js App](#using-the-database-in-our-nextjs-app)
- [Communicating between Server and Client with tRPC](#communicating-between-server-and-client-with-trpc)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setting Up

As far as tools go for this project, I have opted to use the following:

- `pnpm` as the package manager due to its support of workspaces / monorepos. If
  you have a recent version of node on your system, you can install `pnpm` by
  using

```
$ corepack enable
```

- As a note, `bun` was recently released and seems to be getting official
  support over at `turbo`. That's not 100% ready yet by the time I am writing
  this, but it may be worth investigating any speed gains your can get from
  switching over if you feel that is worth it. I found
  [an interesting repo here](https://github.com/muuvmuuv/turbo-bun-svelte-trpc-starter)
  to that end.
- turbo for the monorepo manager due to its integration with other Vercel tools.
  I have this installed in the repo, not as a global package.
- I'm also using Docker to help me spin up different services as I need them,
  like a postgres database, and potentially other similar services.
- Most of this is based on [the t3 stack](https://create.t3.gg/) since that was
  built around moving and building quickly. That means Prisma for the ORM, tRPC
  for communication between frontend and backend, Next.js for the backend,
  NextAuth.js for authentication, Vercel for deployment, etc.

## Directory Structure

Here is a high-level view of what I plan the project to look like when it's
ready to go. I have found that this is granular enough to scale up to multiple
developers, but is not so complex that a single developer needs to spend time
making new packages all the time.

This is loosely based on the
[t3 community's `create-t3-turbo` repo](https://github.com/t3-oss/create-t3-turbo)
although I found I understood this repo better when I built a version of it
myself.

```
my-app
├── .github
│   └── workflows
├── README.md
├── apps
│   └── web
├── devops
│   └── docker-compose.yml
├── package.json
├── packages
│   ├── db
│   ├── trpc
│   └── ui
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tooling
│   ├── eslint-config-custom
│   ├── prettier-config
│   └── tsconfig
├── tsconfig.json
├── .env
└── turbo.json
```

Some files and directories of note are:

### Apps

The apps folder is where the actual deployed applications live. This is where my
next.js app lives, and if I were to add a mobile app, it would live here too.

### Packages

The packages folder still contains code, but this is more of the shared
libraries that I will write (like the database models, the tRPC client and
router, any UI components I build, etc.). Some of these will only be consumed by
the web app for the time being, but having these separate means that you are
flexible in the future to build other things (like an SDK for external
developers, or a mobile app, or a design system guide like Storybook).

### Tooling

These are less code-heavy, but instead give me the option to share configs
between different projects so that I can make updates to one config instead of
each package or app's config.

### Devops

These hold my docker-compose files that I use to launch different services. To
me it feels cleaner to keep these in their own folder than in the parent folder.

### Other files

You probably have come to expect a `package.json` if you have used node before,
and it's no different here. This is in the root folder as well as in each
project. One of the ways that monorepos help out here is that they can help us
to keep one version of a package used in the project instead of installing it in
the node_modules folder of each individual package and app.

Of note is also a `turbo.json` file which controls repo-level scripts and their
caching behavior. We'll take a look at this when we install the database, so
that we can cache what's generated from the schema.

Another useful file is `.env` which stores environment variables to be used
during development. This file should not be tracked, but most repos also include
a `.env.example` file to show all of the required keys, as well as documentation
on where to get those keys.

## Initializing the Repo

Let's start by creating the repo, skipping installing any packages so that we
can move things around.

```
$ npx create-turbo@latest --skip-install

>>> TURBOREPO

>>> Welcome to Turborepo! Let's get you set up with a new codebase.

? Where would you like to create your turborepo? my-app
? Which package manager do you want to use? pnpm workspaces
```

This will get us a repo that looks like this:

```
my-app
├── README.md
├── apps
│   ├── docs
│   └── web
├── package.json
├── packages
│   ├── eslint-config-custom
│   ├── tsconfig
│   └── ui
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── turbo.json
```

I am going to move all but the `ui` package from the `packages` folder to their
own folder called `tooling` so that the more configuration-focused packages have
their own place to live, and don't get mixed up with more code-focused packages.

I'm also going to delete the `docs` folder because I'm not going to use it for
some time. It's useful to demonstrate the code sharing features of the monorepo,
but not required for our project at this time.

```
my-app
├── README.md
├── apps
│   └── web
├── package.json
├── packages
│   └── ui
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tooling
│   ├── eslint-config-custom
│   └── tsconfig
├── tsconfig.json
└── turbo.json
```

We’ll also need to let pnpm know that tooling contains local packages:

`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "tooling/*"
```

Then I'll do a proper install:

```
$ pnpm install
```

The reason I skipped the install until now was to make this process a bit
faster, as well as to not save the local positions of packages until they were
in their proper locations. Otherwise, you have to clean the `node_modules`
folder and the `pnpm-lock.yaml` files because they are responsible for telling
packages in the repo where other packages are.

## Setting up a formatter

One of the things that I mentioned last time that I think is important is
setting standards. One way to really easily set and enforce standards is by
automating those. `prettier` and `eslint` will help us to do that. `eslint`
already came with the project and generally has settings that I agree with, and
if there are ones that I don't agree with or want to enforce that aren't
enforced, it's already in a central location.

I'm going to start by creating a new package in the `tooling` directory and
installing a few plugins

```
$ mkdir tooling/prettier-config
$ touch tooling/prettier-config/package.json
```

Then I can strip out almost all of the dependencies and start fairly fresh:

`tooling/prettier-config/package.json`

```json
{
  "name": "prettier-config",
  "private": true,
  "version": "0.0.0",
  "main": "index.mjs"
}
```

I also want a couple packages in here:

```
$ cd tooling/prettier-config
$ pnpm add -S prettier @ianvs/prettier-plugin-sort-imports
$ pnpm add -D typescript tsconfig@workspace:*
```

Mainly, this will let us also have prettier make sure that our imports and such
are in a consistent order; this can help with merge conflicts, and making sure
that everything makes sense.

Then the config will be pretty (pun intended) simple, and live in `index.mjs`.
The main goal of this is to add the option to format import order and define the
order that those imports should take, with the idea that we have a group of
third party modules, and then a group of our own modules:

```js
/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig } */
const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^~/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.4.0",
};

export default config;
```

Because this can also format this package, I will let the package know that we
want to use this file as the prettier config:

```json
{
  "prettier": "./index.mjs"
}
```

In our other packages and apps, we can add the prettier config and add a format
step in each of the local packages. The extensions will vary based on the
package, or you can have it format every file by leaving that off and just using
a `.` instead (`prettier --write .`):

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{mjs,ts,md,json}\" && eslint --fix"
  },
  "devDependencies": {
    "prettier-config": "workspace:*"
  },
  "prettier": "prettier-config"
}
```

And add this as a repo script, too, in `turbo.json`, and the top level
`package.json`:

`turbo.json`

```json
{
  "pipeline": {
    "format": {}
  }
}
```

`package.json`

```json
{
  "scripts": "turbo run format"
}
```

Since we don't need any caching, we can leave the options empty.

## Adding a Database

One of my first steps when writing an app is getting it connected to a database
so that I don't have to worry about how I'm going to persist data. To do that,
I'm going to make a proper package this time.

```
$ mkdir packages/db
$ touch packages/db/package.json
```

`packages/db/package.json`

```json
{
  "name": "db",
  "private": true,
  "version": "0.0.0",
  "main": "index.ts",
  "scripts": {
    "format": "prettier --write \"**/*.{prisma,ts,md,json}\" && eslint --fix"
  },
  "eslint": {
    "root": true,
    "extends": ["eslint-config-custom/library"]
  },
  "prettier": "prettier-config"
}
```

I’m going to use Prisma because it is another technology that Vercel’s stack
uses, and integrates well with Next.js and the auth solution that I want to use
because of this. I also have grown to like how it writes all the queries for me,
so I don’t need to worry about maintaining that code. And it still lets me use
database migrations which are super important when building an app that will be
in a production environment.

Here’s installing those dependencies:

```
$ cd packages/db
$ pnpm add -S @prisma/client dotenv-cli
$ pnpm add -D prisma eslint eslint-config-custom@workspace:* prettier prettier-config@workspace:* typescript tsconfig@workspace:* @types/node
```

Creating a tsconfig:

`tsconfig.json`

```json
{
  "extends": "tsconfig/base.json",
  "include": ["."],
  "exclude": ["dist", "build", "node_modules"]
}
```

Next I’m going to add some prisma code to give us access to database models:

`src/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id      String @id @default(cuid())
  title   String
  content String
  likes   Int
}
```

I’m doing this as a sample to get things running; you will likely want to set
this up so that it will work with the
[NextAuth.js Prisma Adapter](https://authjs.dev/reference/adapter/prisma), but
that is a bit more complex and may take some tweaking to get right when
considering other models, so I will hold off on that, but leave it as a resource
to you.

The `generator` portion determines where the generated queries and other related
code is going to be stored. Normally this goes to `node_modules` but that won’t
work with every configuration; I prefer to pull it into some files that are
ignored, but are in the proper `db` package.

The `datasource` portion determines which SQL dialect we’re using, as well as
where to connect to that. I’m making a call to `env` which reads an environment
variable to determine where we should connect.

### Using Environment Variables for Configuration

The third factor of 12-factor apps is
[Store config in the environment](https://12factor.net/config) . This means that
config variables like database URLs, passwords, secrets, etc. should all live in
environment variables. On a production machine, those should actually live in
the machine’s environment. On a development machine, those might change
frequently, so it makes more sense to keep them in a file. `dotenv` is a popular
package in many languages that allows us to do that, however for this I am going
to be using `dotenv-cli`. Both of these allow loading variables from a `.env`
file that contains the same types of variables, like this:

`.env`

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/app
```

However, very rarely should you source control these; instead, I provide a
`.env.example` and allow any other contributors to fill in their own:

`.env.example`

```env
# A database connection string to a Postgres database
DATABASE_URL=
```

Then, any other developers can quickly make their own `.env` file by copying it
and filling in any variables:

```
$ cp .env.example .env
```

Instead of writing code to load this in my app, I’ll write a pnpm script
instead:

```json
{
  "scripts": {
    "withenv": "dotenv-cli -e ../../.env --",
    "db:generate": "pnpm withenv prisma generate"
  }
}
```

Once I write scripts to perform database calls, generate migrations, and so on,
I’ll use this instead of just running the script. It also allows me to add this
script which allows us to generate the queries for our schema.

But before we can do any of that, we probably need a database to check against.
I’m going to use Docker to do that for me instead of installing it as a full
service on my machine.

You can also host a database locally and build an appropriate connection string
into your `.env` file, or use a
[Vercel Hobby plan](https://vercel.com/docs/accounts/plans/hobby) to get a
postgres database and pull the connection string down with
[`vercel env pull`](https://vercel.com/docs/cli/env#exporting-development-environment-variables).
We’re not quite to CI and Deployment yet, so I’m sticking local for the time
being.

### Exposing the Database to other packages

Now that we can `pnpm run db:generate`, let's do that and see what happens:

```
$ pnpm run db:generate
```

This will generate a folder in the `db` package under the `lib` folder that
contains the model and query code. To use this effectively in other packages,
especially in dev mode (where the client can be recreated frequently), I'm going
to use a global variable, based on the
[prism best practices](https://pris.ly/d/help/next-js-best-practices):

`packages/db/lib/prisma.ts`

```ts
// eslint-disable-next-line -- need to import the generated code
import { PrismaClient } from "./generated/client";

const globalForPrisma: { prisma?: PrismaClient } = global as unknown as {
  prisma: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// eslint-disable-next-line import/no-default-export -- need to get dev mode working correctly
export default prisma;
```

### Using Docker to quickly setup local services

I’m going to set up a folder to hold any docker stuff called `devops` to get us
started:

```
$ mkdir devops
$ touch devops/docker-compose.yml
```

Then I’ll edit the `docker-compose.yml` file to include the following:

```yaml
version: "3"
services:
  db:
    image: postgres:15
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app
```

If I have docker installed, I can run this to start a database:

```
$ docker compose -f devops/docker-compose.yml -p my-app up --build -d
```

This does a couple things:

- `-f devops/docker-compose.yml` tells docker which file to use
- `-p my-app` provides a tag that will be used as a prefix for any created
  containers which makes them a bit easier to find
- `up` tells docker to start what’s contained in that file
- `--build` says build any services necessary in the file
- `-d` says to detach from the services once they are running

### Writing scripts to operate on the database

Now that we have a running database and the ability to read from the
environment, we can do things like push our schema to the development database.

```json
{
  "scripts": {
    "db:push": "pnpm withenv prisma db push --skip-generate",
    "db:makemigration": "pnpm withenv prisma migrate dev --name",
    "db:studio": "pnpm withenv prisma studio"
  }
}
```

- `push` synchronizes my schema with the database
- `makemigration` creates a migration that I can use on a production database
- `studio` opens the studio which allows for easy editing of my database

I skip generation when I push to the database because I handle generation before
I start anything else using turbo in the next section, but it may make sense for
you to drop that flag.

### Caching the generated database files

It doesn’t make sense to generate the database all the time, but we probably
should make it clear that other packages and tasks will depend on the database.
To solve both of these problems, I’m going to make some changes to caching via
the turbo pipeline. This also has the side effect of making `db:push` and
`db:generate` accessible from the top level package.

`turbo.json`

```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["^db:generate"],
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^db:generate"]
    },
    "db:generate": {
      "inputs": ["packages/db/lib/prisma/schema.prisma"],
      "outputs": ["packages/db/lib/generated"]
    },
    "db:push": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`package.json` (root)

```json
{
  "scripts": {
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push"
  }
}
```

Now I can execute these from the root folder instead of needing to run them from
the package, which makes these a bit more convenient to use. Since they will
also be cached and generated when starting other tasks like `dev` and `build`, I
shouldn’t need to think about this too much anymore.

I’m going to go ahead and run that push script to make our database in sync with
our code:

```
$ pnpm run db:push
```

### Updating the formatter

One last aside; if we want the formatter to also check and fix `.prisma` files,
we need to add the `prettier-plugin-prisma` plugin and add that to our prettier
config:

```
$ cd tooling/prettier-config
$ pnpm add -D prettier-plugin-prisma
```

`tooling/prettier-config/index.mjs`

```js
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports"
    "prettier-plugin-prisma"
  ],
};

export const config;
```

I also add a `.eslintignore` file to `packages/db` so that we don’t try to lint
the generated files:

`.eslintignore`

```.ignore
lib/generated
```

## Using the Database in our Next.js App

First, we need to depend on the db package:

```
$ cd apps/web
$ pnpm add -S db@workspace:*
```

Next, we need to add a package that allows
[Next.js to see our schema properly](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo):

```
$ pnpm add -S @prisma/nextjs-monorepo-workaround-plugin
```

And update our `next.config.js`:

```js
const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};
```

Now we can go ahead and add a page. I’m first going to clear out the existing
pages and make a new one:

```
$ rm -rf apps/web/app
$ mkdir apps/web/pages
$ touch apps/web/pages/index.tsx
```

Now I can write a file that will list my posts:

`pages/index.tsx`

```tsx
import type { GetServerSideProps } from "next";
import { prisma } from "db/lib/prisma";
import type { Post } from "db/lib/generated/client";

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany();
  return {
    props: { posts },
  };
};

function Posts({ posts }: { posts: readonly Post[] }): JSX.Element {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>Likes: {post.likes}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default Posts;
```

This pulls from the db packages we just wrote and queries all of the posts from
the post model. Then, it maps those posts into a listing of the titles and
content (if they exist; otherwise we get a zero state).

This is server side rendered based on how we’re using `GetServerSideProps`. But
if we want to add a post?

## Communicating between Server and Client with tRPC

We’ve done it before; we’ll do it again:

```
$ mkdir packages/api
$ touch packages/api/package.json
```

Updating `package.json` (pretty much the same as `packages/db/package.json`,
just with the deps stripped out) `packages/trpc/package.json`

```json
{
  "name": "api",
  "version": "0.0.0",
  "private": true,
  "main": "index.ts",
  "scripts": {
    "withenv": "dotenv -e ../../.env --",
    "clean": "rm -rf .turbo node_modules",
    "lint": "eslint .",
    "format": "prettier --check \"**/*.{mjs,ts,md,json}\"",
    "typecheck": "tsc --noEmit"
  },
  "eslintConfig": {
    "root": true,
    "extends": ["eslint-config-custom/library"]
  },
  "prettier": "prettier-config"
}
```

And adding the deps:

```
$ cd packages/api
$ pnpm add -S @trpc/server @trpc/client zod
$ pnpm add -D eslint eslint-config-custom@workspace:* prettier prettier-config@workspace:* typescript tsconfig@workspace:*
```

And now I’ll create a router:

`packages/api/src/trpc.ts`

```ts
import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

And some procedures:

`packages/api/src/routers/post.ts`

```ts
import { prisma } from "db/lib/prisma";
import * as z from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  postList: publicProcedure.query(async () => {
    const posts = await prisma.post.findMany();
    return posts;
  }),
  addPost: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async (opts) => {
      const { title, content } = opts.input;
      const post = await prisma.post.create({
        data: {
          title,
          content,
        },
      });
      return post;
    }),
});

export type AppRouter = typeof appRouter;
```

Looks like this won’t work – I need to supply a `likes` parameter. But I’d
rather just default that to 0, so instead I’ll update my schema quickly:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id      String @id @default(cuid())
  title   String
  content String
  likes   Int    @default(0)
}
```

And regenerate the model:

```
$ pnpm run db:generate
```

Now let’s consume this API over on the Next.js side. First, we have to
[add dependencies](https://trpc.io/docs/client/nextjs/setup):

```
$ cd apps/web
$ pnpm add -S api@workspace:* @trpc/client @trpc/server @trpc/react-query @trpc/next @tanstack/react-query
```

Next we add a page for tRPC: `apps/web/pages/api/trpc/[trpc].ts`:

```ts
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
```

And then we add hooks based on the router: `apps/web/pages/_app.tsx`

```tsx
import type { AppType } from "next/app";
import { trpc } from "../util/trpc";

function MyApp({ Component, pageProps }): AppType {
  return <Component {...pageProps} />;
}

export default trpc.withTRPC(MyApp);
```

Lastly, I’m going to refactor my SSR page to be clientside so that we can add
posts without too much trouble: `apps/web/pages/index.tsx`

```tsx
import { useState } from "react";
import { trpc } from "../util/trpc";

function Posts(): JSX.Element {
  const mutation = trpc.addPost.useMutation();
  const query = trpc.postList.useQuery();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePost = (): void => {
    mutation.mutate({
      title,
      content,
    });
  };

  const posts = query.data ?? [];

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>Likes: {post.likes}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
      <form onSubmit={handlePost}>
        <input
          id="post-title"
          onChange={(v) => {
            setTitle(v.target.value);
          }}
          placeholder="Title"
          value={title}
        />
        <input
          id="post-content"
          onChange={(v) => {
            setContent(v.target.value);
          }}
          placeholder="Content"
          value={content}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Posts;
```
