<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [News and Housekeeping](#news-and-housekeeping)
- [Feedback and Q&A Forms](#feedback-and-qa-forms)
- [Lecture 3 Follow-Up](#lecture-3-follow-up)
  - [Creating HTTP JSON API Routes](#creating-http-json-api-routes)
  - [The App Router](#the-app-router)
  - [Versioning](#versioning)
  - [New Example App](#new-example-app)
- [Lecture 4 - Databases](#lecture-4---databases)
  - [Common Database Attributes](#common-database-attributes)
    - [Relational](#relational)
    - [Document](#document)
    - [Graph](#graph)
    - [Key / Value](#key--value)
    - [Blob](#blob)
    - [In-Memory](#in-memory)
    - [Flatfile](#flatfile)
  - [Database Type Resources](#database-type-resources)
  - [Migrations](#migrations)
  - [Demo: Adding mongoDB to our app](#demo-adding-mongodb-to-our-app)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## News and Housekeeping

- If you read the Lecture 1 notes you know this already, but feel free to call
  me Hunter. I'm about the same age as y'all and I feel weird having extra
  titles or going by my last name.
- Office hours going forward will be done via calendly; I get a lot more
  calendly appointments than I do people in zoom office hours, so I'd rather
  focus on what's working for you all.
- **You have 2 weeks from today to get the first check-in done**; come talk to
  me about what you're thinking about building and what you have so far.
  - If you need an appointment outside of my normal office hours, contact me via
    email or Slack. We can find a time that works for both of us.
- **Next time is a Q&A session**; please submit any questions or demos you would
  like to see before next time, otherwise I will just stand up here and work on
  my app.
  - Maybe that's what y'all want, and I'm okay doing that, but I'd rather
    support what you all are doing and building.
  - Or if you all want, we can do a mini demo day and have some of you up here
    to talk about what you're building / decisions you have already made.

## Feedback and Q&A Forms

- [Here is a form for the Q&A session](https://forms.gle/BFYvoySKPak98uEw5); if
  I see responses here that are relevant to the next lecture or are frequently
  asked for, I will do my best to include them in that lecture.
- [Here is a form for feedback](https://forms.gle/QqM3vF8ySoRE67gv8); I will do
  my best to apply what I can from here to my next lectures. I know I'm getting
  a biased response talking to people after class, so please help me be less
  biased!

## Lecture 3 Follow-Up

### Creating HTTP JSON API Routes

Last time I wrote a handler that returned XML, and ended up pretty complicated.
Here is what that might look like for JSON instead:

`apps/web/pages/api/pageposts.ts` or `apps/web/pages/api/pageposts/index.ts`

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { HttpStatusCode } from "@my-app/status-codes";

const AllowedFields = new Set(["title", "content", "likes"]);

export default async function PostList(
  req: NextApiRequest,
  // Primary difference 1: We are returning a partial post list
  res: NextApiResponse<readonly Partial<Post>[]>
): Promise<void> {
  // Same as last time; this is pretty generic, so probably can be extracted
  // into a utility function.
  const filter = req.query.filter;
  const parts = typeof filter === "string" ? filter.split(",") : filter;
  const selectFields = parts?.reduce((acc, curr) => {
    if (AllowedFields.has(curr)) {
      acc[curr] = true;
    }
    return acc;
  }, {});
  const select =
    selectFields && Object.keys(selectFields).length > 0
      ? selectFields
      : undefined;

  const postList = await prisma.post.findMany({ select });

  // Primary difference 2: we just return the post list, no processing needed
  res.status(HttpStatusCode.OK).json(postList);
}
```

If I wanted a detail view, it might look like this:

`apps/web/pages/api/pageposts/[post].ts`

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { HttpStatusCode } from "@my-app/status-codes";

const AllowedFields = new Set(["title", "content", "likes"]);

export default async function PostDetail(
  req: NextApiRequest,
  res: NextApiResponse<Partial<Post>>
): Promise<void> {
  const filter = req.query.filter;
  const parts = typeof filter === "string" ? filter.split(",") : filter;
  const selectFields = parts?.reduce((acc, curr) => {
    if (AllowedFields.has(curr)) {
      acc[curr] = true;
    }
    return acc;
  }, {});
  const select =
    selectFields && Object.keys(selectFields).length > 0
      ? selectFields
      : undefined;

  const rawPost = req.query.post;
  const id = typeof rawPost === "string" ? rawPost : undefined;
  if (!id) {
    res.status(HttpStatusCode.BAD_REQUEST).end();
    return;
  }

  const post = await prisma.post.findFirst({ select, where: { id } });
  if (!post) {
    res.status(HttpStatusCode.NOT_FOUND).end();
    return;
  }

  res.status(HttpStatusCode.OK).json(post);
}
```

Note that `[post]` is creating a URL parameter. This is what lets tRPC intercept
requests to `/api/trpc/...`.

I also added a super small package to my repo, containing
[this](https://gist.github.com/scokmen/f813c904ef79022e84ab2409574d1b45) file,
which is just a big typescript enum of the named status codes and brief
explanations of them. Using names instead of magic numbers is good. The docs are
extra useful in determining what should happen with the responses I choose.
Since this can be useful on both the frontend and backend, it gets its own
package.

### The App Router

There is another paradigm in Next.js called the
[App Router](https://nextjs.org/docs/app/building-your-application/routing#the-app-router)
(and is used in the `app` folder, as opposed to the pages router for files
created in the `pages` folder) that is very powerful, less opinionated, and can
be more performant, depending on what you are doing.

Here is what the same json route might look like:

`apps/web/app/api/posts/route.ts`

```ts
import type { NextRequest } from "next/server";
import { prisma } from "@my-app/db/lib/prisma";

const AllowedFields = new Set(["title", "content", "likes"]);

export async function GET(req: NextRequest): Promise<Response> {
  const filter = req.nextUrl.searchParams.get("filter");
  const selectFields = filter?.split(",").reduce((acc, curr) => {
    if (AllowedFields.has(curr)) {
      acc[curr] = true;
    }
    return acc;
  }, {});
  const select =
    selectFields && Object.keys(selectFields).length > 0
      ? selectFields
      : undefined;

  const postList = await prisma.post.findMany({ select });

  return Response.json(postList);
}
```

This is slightly more secure, because instead of making every file in the
directory an exported route, instead only `route.ts` and `page.tsx` files are
exposed. That means utility files can be kept in the same directories without
accidentally exposing them to the client. You can read more about that
[here](https://nextjs.org/docs/app/building-your-application/routing).

Getting this set up with the tRPC client can be a bit challenging, but there are
[resources out there](https://levelup.gitconnected.com/next-js-13-trpc-a-match-made-in-heaven-9764fadd1084)
to help with that.

### Versioning

If you _are_ building an HTTP API, you might consider versioning it, for
example, instead of `POST api/posts`, you do `POST api/v1/posts` (or v0 if
you're still breaking things). Then, if other people build on top of your API,
you can make changes to the next version without breaking either your or their
apps, and then deprecate older versions as new ones come out.

This and migrations are two of the things that I build to help future proof me.
Planning on and having the infrastructure for changing API routes is much better
to plan for up front than it is to need to migrate things to a new versioned
API, and then migrate things to the actual new API.

Planning on not making changes is planning on not adapting to what your
customers and users are doing.

### New Example App

Can be found [here](https://github.com/hhenrichsen/sandbox-example-app). Some
changes:

- Made scripts to format and lint consistent, as well as added writing versions
  of those scripts.
- Namespaced the package names.
- Added a package.json linter to the lint script.
- Fixed some issues with peer dependencies.
- Made the typescript version consistent between packages.
- Added some example routes from Lecture 3.
- Added some example routes from above.

# Lecture 4 - Databases

_This lecture should probably be called "Data Backends", because we are talking
about more than just databases._

## Common Database Attributes

I'm going to call these attributes rather than types, because some of these will
dip into multiple attributes. For example, Redis is a Key / Value, In-Memory
database; and PostgreSQL is primarily a Relational database, but it can
accomplish some similar feats to a Document database via its JSON column type.

### Relational

**Examples:** PostgreSQL, mySQL, msSQL, MariaDB

Relational databases have been around for awhile, and are used pretty broadly.
The core idea is that everything is a field in a row of a table, and any
connections between data are implied from the data itself.

The fundamental units of data are:

- **Databases**, which contain schemas and tables
- **Schemas** (varies by implementation), which are an abstraction to prevent
  collisions between multiple clients on the same database, or are
  interchangeable with databases.
- **Tables**, which are composed of rows and a set of typed fields
- **Rows**, which contain values for each of the table's fields.

#### Data Sample

| id: `uuid`                           | email: `varchar(256)` | username: `text` | registered: `datetime`   |
| ------------------------------------ | --------------------- | ---------------- | ------------------------ |
| 18F041C8-2543-4066-94E4-CCF9E3B08764 | someone@nowhere.com   | someone          | 2021-10-04T00:00:00.000Z |

#### Query Sample

```js
connection.execute("SELECT * from users WHERE email = ?", [
  "someone@nowhere.com",
]);
```

#### Reasoning

Since relational databases have been around for a long time, many scaling
problems have been solved with them. You can scale databases by adding more
discrete databases in a process called sharding, where certain tables are split
into databases by certain types of information, for example, post IDs in a
social network.

If your data keeps a similar shape between occurrences, a relational database is
probably a good choice.

Anything that is not relational is sometimes called noSQL or Non-relational.

### Document

**Examples:** mongoDB, CouchDB, DocumentDB

Document databases have emerged as popular as an alternative to relational
databases. Instead of dealing with a fixed shape for data, document databases
store JSON documents that can have any number of arbitrary properties.

The fundamental units of data are:

- **Documents**, which are JSON that can be queried and mutated as needed.

#### Data Sample

```json
{
  "_id": "18F041C8-2543-4066-94E4-CCF9E3B08764",
  "info": {
    "email": "someone@nowhere.com",
    "username": "someone"
  },
  "registerred": "2021-10-04T00:00:00.000Z"
}
```

#### Query Sample

```js
connection.find({ "info.email": "someone@nowhere.com" });
```

#### Reasoning

If your data is flexible and changes by user, or doesn't fit into the rigid
types that relational database fields require, a document database may be a
better choice. Rather than spinning up duplicate databases, most document
databases are designed to scale by adding additional compute clusters.

### Graph

**Examples:** Neo4j, Neptune

Graph databases are similar to relational and document databases, however
instead of inferring relationships from the data, relationships are a
first-class part of the database.

The fundamental units of data are:

- **Nodes**, which hold a set of properties
- **Labels**, which classify a node or attach metadata
- **Edges** or **Relationships**, which link two nodes and hold a set of
  properties
- **Properties**, which store information about a given node

#### Data Sample

```
:Person
id: 18F041C8-2543-4066-94E4-CCF9E3B08764
email: someone@nowhere.com
username: someone
registerred: 2021-10-04T00:00:00.000Z
```

#### Query Sample

```js
connection.run(`MATCH (p:Person {username: $username})`);
```

#### Reasoning

Because these are stored as graphs, there are optimizations to querying some of
these databases that may make sense (as well as additional query types that are
less complex in a graph), especially if there are many different types of
connections that need to be a part of your data.

Graph databases scale by clustering (optimizing for frequently used clusters)
and sharding.

If relationships are an important part of your data, looking into a Graph
database may be worth it.

### Key / Value

**Examples:** Redis, DynamoDB

Key / Value databases are fairly simple; you have a key in the database, and
that holds some value. Some databases allow for arbitrary properties within a
single key, and some others will hold whatever data you give them.

The fundamental units of data are:

- **Keys**, which identify a value uniquely, and
- **Values** or **Properties**, which depending on implementation allow for
  various types of data to be stored.

These can be useful for caching, and for holding less-structured unique data.

### Blob

**Examples:** s3, Blob Storage

Short for Binary Large OBject, Blob storage is the best place to keep files,
images, user documents, and other binary data. Generally, there aren't many
operations on blob storage because it acts like a file system where you can
upload and delete objects.

The fundamental unit of data are:

- **Objects**, normally some binary that is required to run your app (user
  profile pictures, shared documents, etc).

### In-Memory

**Examples:** Redis, ElastiCache

When read and write speed is very important (AWS claims microsecond read and
single-digit millisecond write latency), you want your data backend to not rely
on writing to a disk and live in-memory instead. Generally the tradeoff of this
is that the data is volatile; if the database shuts down for any reason, the
data is lost.

This can be mitigated by snapshots or storing a log of transactions, but will
vary by implementation. This is frequently combined with a Key / Value database,
but can apply to others.

### Flatfile

**Examples:** SQLite, H2

Sometimes it doesn't make sense to have a whole database running to run an
application, such as when running tests. Flatfile databases write to an
arbitrary file, which makes them easy to create and throw away.

Generally these aren't used for production apps, but can be useful while
developing.

## Database Type Resources

Resources:

- [AWS: noSQL Hub](https://aws.amazon.com/nosql/)
- [Neo4J: Modeling Data](https://neo4j.com/docs/getting-started/data-modeling/guide-data-modeling/)

## Migrations

As I mentioned earlier,

> Planning on not making changes is planning on not adapting to what your
> customers and users are doing.

Migrations are a tool that allow you to change the shape of data in your app,
especially in your data source. These are most frequently seen in relational
databases in order to allow updates to the data, or creating new tables, but
these apply for any data source.

For example, say we have a document database where the user's info is nested
inside a large user object:

```json
{
  "_id": "B7AF75C7-658B-4D37-9AB1-53EEE0E0D25E",
  "info": {
    "email": "someone@nowhere.com",
    "username": "someone"
  },
  "posts": []
}
```

And we want to take each user and pull the info into the top level so that it's
easier to access. How would we do that? We can do that by updating each one as
we read it, but then we have to maintain backwards compatibility code ad
infinitum.

A similar approach applies to relational data; what if I had a table that I
wanted to split into two, so that I could optimize some queries that needed less
data?

These are questions that I think are worth planning around. Prisma will write
your migrations for you, as will many other database libraries. There are also
[good resources out there](https://www.freecodecamp.org/news/how-to-automate-database-migrations-in-mongodb-d6b68efe084e/)
that can show you how to do this in mongo or other libraries, and generally the
idea is pretty straightforward: you have a script that applies the change, and
one that undoes it in case of issues.

GitHub found that they were spending a lot of time doing migrations at their
scale, and so they solved some interesting problems with migrations.
[This blog post](https://github.blog/2020-02-14-automating-mysql-schema-migrations-with-github-actions-and-more/)
is worth a read if you are interested in how large companies take these to
scale.

## Demo: Adding mongoDB to our app

I'm using docker to manage local services, so my first step will be to add mongo
to my docker compose file: `devops/docker-compose.yml`

```yaml
version: '3'
services:
  db:
    image: postgres:15
    restart: always
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: app

  mongo:
    image: mongo:7
    restart: always
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: app
    volumes:
	  ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
```

I need to actually create the database, and that's what the last portion of the
compose file is doing; creating and running an init script:

`devops/mongo-init.js`

```js
db.getSiblingDB("admin").auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);
db.createUser({
  user: "app",
  pwd: "password",
  roles: ["readWrite"],
});
```

Next I'll update my `.env` and `.env.example` files to point to the new mongo
service:

`.env`

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/app
MONGO_URL=mongodb://app:password@localhost:27017/app
PORT=3000
```

Next, I'm going to make another package called `mongo` to manage my mongoose
schema.

```bash
cd packages/mongo
pnpm add -S mongoose
```

I'll create a basic, root-level `index.ts` file:

`packages/mongo/index.ts`

```
export * from './src';
```

And create an index file for me to work within:

`packages/mongo/src/index.ts`

```ts
import mongoose from "mongoose";

async function connect(): Promise<Mongoose> {
  const { MONGO_URL } = process.env;
  if (!MONGO_URL) {
    throw new Error("Missing MONGO_URL env variable");
  }

  return mongoose.connect(MONGO_URL);
}
```

I'm also going to define a Comment schema:

`packages/mongo/src/models/comment.ts`

```ts
import mongoose, { Model } from "mongoose";

export interface Comment extends mongoose.Document {
  postId: string;
  content: string;
  meta: unknown;
}

const CommentSchema = new mongoose.Schema<Comment>({
  postId: {
    type: String,
    required: [true, "Please provide a post ID"],
  },
  content: {
    type: String,
    required: [true, "Please provide a comment"],
  },
  meta: {
    type: {},
    required: false,
  },
});

export const comment: Model<Comment> =
  mongoose.models.comments ||
  mongoose.model<Comment>("comments", CommentSchema);
```

I'll also make sure to export this from the `src/index.ts` file:

```ts
export * from "./models/comment";
```

I want to query mongo using tRPC, so I'll add it as a dependency:

```bash
cd packages/api
pnpm add -S @my-app/mongo:*
```

Now I'm going to update my tRPC queries to ask for any comments:

> [!Warning]
>
> This is probably not how you want to do this in your app. Related data
> probably should be stored in related places. In this case, to query the posts,
> we have to do 1 query on the Postgres database, and then N queries to the
> Mongo database. This can be better accomplished with a SQL join than two data
> sources, but serves this example well enough.

`packages/api/src/index.ts`

```ts
import * as z from "zod";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { comment } from "@my-app/mongo";
import type { Comment } from "@my-app/mongo/models/comment";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  postList: publicProcedure.query(
    // Note the new type here -- post plus comments
    async (): Promise<(Post & { comments: readonly Comment[] })[]> => {
      const posts = await prisma.post.findMany();
      return Promise.all(
        posts.map(async (post) => {
          const postId = post.id;
          // Go find the comments for this post in mongodb
          const comments = await comment.find({ post: postId }).exec();
          // Add it to the returned object
          return { ...post, comments };
        })
      );
    }
  ),
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
  createComment: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        meta: z.any().optional(),
      })
    )
    .mutation(async (opts) => {
      const { postId, content, meta } = opts.input;
      const created = await comment.create({ postId, content, meta });
      return created;
    }),
});

export type AppRouter = typeof appRouter;
```

In order for this to work, I'll need to make sure the database is connected. We
can do that in the web app. Let's start by adding the mongo dependency:

```bash
cd apps/web
pnpm add -S @my-app/mongo:*
```

Now I'll update the `apps/web/pages/api/trpc/[trpc].ts` route to have the
following:

```ts
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "api/src/index";
import { connect } from "@my-app/mongo";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async () => {
    await connect();
    return {};
  },
});
```

This will make sure that the database is connected before the app tries anything
with tRPC.

Finally, I can make sure this is working by querying it on the frontend,
updating my post rendering block:

`apps/web/pages/index.tsx`

```tsx
{
  posts.length > 0 ? (
    posts.map((post) => {
      return (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>Likes: {post.likes}</p>
          <p>Comments: {post.comments.length}</p>
          <p>{post.content}</p>
        </div>
      );
    })
  ) : (
    <p>No posts found.</p>
  );
}
```
