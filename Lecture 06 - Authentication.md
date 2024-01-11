<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [News and Housekeeping](#news-and-housekeeping)
- [Feedback and Q&A Forms](#feedback-and-qa-forms)
- [Lecture 6 - Authentication](#lecture-6---authentication)
  - [Resources and AAA](#resources-and-aaa)
    - [Resources](#resources)
    - [Authentication](#authentication)
    - [Authorization](#authorization)
    - [Accounting](#accounting)
  - [Demo: Authenticating with Clerk](#demo-authenticating-with-clerk)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## News and Housekeeping

- Check-in 1 is due **today**. I have some office hours available this evening,
  please come talk to me about what you're building or planning on building.
- Check-in 2 will be optional, and can be used to replace a missing attendance
  or the initial check-in. You already get 2 free absences, but if you have more
  than that this is one way to raise that score.

## Feedback and Q&A Forms

- [Here is a form for the Q&A session](https://forms.gle/BFYvoySKPak98uEw5); if
  I see responses here that are relevant to the next lecture or are frequently
  asked for, I will do my best to include them in that lecture.
- [Here is a form for feedback](https://forms.gle/QqM3vF8ySoRE67gv8); I will do
  my best to apply what I can from here to my next lectures. I know I'm getting
  a biased response talking to people after class, so please help me be less
  biased!

# Lecture 6 - Authentication

## Resources and AAA

Authentication is at the core of pretty much any application. You can't have
unique users if they can't identify themselves, right? Authentication is a
smaller part of the AAA framework of security (which actually originates from
network security, but is applicable here), where Authorization and Accounting
also should play a role in your app. Let's talk about what those ideas are, and
what they mean within the context of our app.

I want to start off this lecture with a word of caution:

Authentication is complicated, and authentication-related information is
valuable. The former means that it's easy to miss something, or mess up in such
a way that things go wrong. The latter means that the information stored for
authentication is a valuable target for those who would abuse things going
wrong.

Please don't rush building this, try other possibilities (like OAuth) where
possible, and if that's not possible, let someone else help you do it right
(like Supabase, or Auth0, or Clerk).

### Resources

I'm going to talk a lot about "resources" in this lecture. This is an abstract
term for "things that users can access." That might mean REST endpoints, certain
pages, and really anything else that may have controls attached.

### Authentication

Authentication is your ability to identify a user based on the request that they
are making. Some endpoints may only make sense in relation to a current user,
for example an endpoint that shows the currently logged in user, or lists
resources owned by that user.

### Authorization

Authorization is your ability to restrict resources to specific users.
Authorization issues are much more common than authentication issues, especially
as you add more and more resources with more complex access relationships.

### Accounting

Accounting (or auditing) is information that you store that allows you to see a
sequence of events that users are taking. One example is an audit log, where you
keep a history of any administrative actions taken, or where you can show what
activities users are doing. This is useful when something goes wrong in
authorization; you can still use authentication to establish a list of resources
that were improperly accessed.

Normally, an access log with a user ID will be sufficient, but this may vary by
your use case.

## Demo: Authenticating with Clerk

I'm going to update my site to allow people to save and edit draft posts, as
well as to view their own draft posts, but not the posts of the others. To do
this, I'm moving the detail view to something like
`localhost:3000/hhenrichsen/my-cool-post`.

For the purposes of this demo, I already have an application created at
https://clerk.com. I'm going to add the dependency next:

```
cd apps/web
pnpm i -S @clerk/nextjs
cd -
```

And the same for my `api`:

```
cd packages/api
pnpm i -S @clerk/nextjs
cd -
```

My next step is to add the `ClerkProvider` to my root layout so that I can pull
authentication information in my server components.

`apps/web/app/layout.tsx`

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

I'm also going to set up some authentication middleware:

`apps/web/middleware.ts`

```ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/posts/(.*)/(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

And set up some context for tRPC:

`packages/api/src/context.ts`

```ts
import {
  getAuth,
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createContextInner = async ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return await createContextInner({ auth: getAuth(opts.req) });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
```

Update tRPC to use the context as well as new middleware:

`packages/api/src/trpc.ts`

```ts
import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);
```

And update my next.js tRPC route to supply the context:

`apps/web/pages/api/trpc/[trpc].ts`

```ts
import { getAuth } from "@clerk/nextjs/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@my-app/api/src/index";
import { connect } from "@my-app/mongo";

// export API handler
// @see https://trpc.io/docs/server/adapters
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async (opts: trpcNext.CreateNextContextOptions) => {
    await connect();
    const auth = getAuth(opts.req);
    return {
      auth,
    };
  },
});
```

Lastly, I'm going to add some URLs we can hit to sign in and sign out, then we
can work on adding some features.

`apps/web/app/auth/sign-in/[[...sign-in]]/page.tsx`

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

`apps/web/app/auth/sign-up/[[...sign-up]]/page.tsx`

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp />;
}
```

Now I'm going to adjust my schema to account for users and their info:
`packages/db/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/client"
}

model User {
  id    String @id
  slug  String @unique
  name  String
  likes Like[]
  Post  Post[]

  @@index([slug])
}

model Like {
  id     String   @id @default(cuid())
  postId String
  post   Post     @relation(fields: [postId], references: [id])
  userId String
  user   User     @relation(fields: [userId], references: [id])
  date   DateTime @default(now())

  @@index([postId])
  @@index([userId])
}

model Post {
  id        String    @id @default(cuid())
  slug      String
  title     String
  content   String
  likes     Like[]
  draft     Boolean   @default(false)
  deleted   Boolean   @default(false)
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  created   DateTime? @default(now())
  published DateTime?
  edited    DateTime? @updatedAt

  @@unique([slug, authorId])
  @@index([slug])
  @@index([authorId])
}
```

This is probably a bit more featureful than I need, but it'll let me set up some
interesting tRPC queries at least. Now I'm going to amend my previous layout to
add a bit more information about the logged in user (or absence of one):

`apps/web/app/layout.tsx`

```tsx
import Link from "next/link";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const userAuth = await currentUser();

  const authButton = userAuth ? (
    <UserButton />
  ) : (
    <Link
      href="/auth/sign-in"
      style={{ textDecoration: "none", color: "black" }}
    >
      Sign In
    </Link>
  );

  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0 }}>
          <header
            style={{
              justifyContent: "space-between",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              backgroundColor: "lightgray",
              position: "sticky",
            }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1
                style={{
                  margin: 0,
                  padding: 8,
                  color: "black",
                  fontFamily: "sans-serif",
                }}
              >
                Blog Site
              </h1>
            </Link>
            <div style={{ padding: 8 }}>{authButton}</div>
          </header>
          <div id="content">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

And re-add the post listing, but on the server this time:

`apps/web/app/page.tsx`

```tsx
import Link from "next/link";
import { prisma } from "@my-app/db/lib/prisma";

export default async function Home(): Promise<JSX.Element> {
  const posts = await prisma.post.findMany({
    where: { draft: false },
    orderBy: { published: "desc" },
    include: { author: true },
  });

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Link href={`posts/${post.author.slug}/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>
            <i>By {post.author.name}</i>
          </p>
        </div>
      ))}
    </div>
  );
}
```

Now let's implement that post page:

`apps/web/app/posts/[user]/[post]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { prisma } from "@my-app/db/lib/prisma";

export default async function CreatePost({
  params,
}: {
  params: { user: string; post: string };
}): Promise<JSX.Element> {
  const { user: userSlug, post: postSlug } = params;
  const { userId: authUserId } = auth();

  const { id: authorId } = (await prisma.user.findUnique({
    where: { slug: userSlug },
    select: { id: true },
  })) ?? { id: null };

  if (!authorId) {
    return notFound();
  }

  const post = await prisma.post.findUnique({
    where: {
      slug_authorId: {
        slug: postSlug,
        authorId,
      },
    },
    include: {
      author: true,
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!post) {
    return notFound();
  }

  if (post.draft && (!authUserId || authUserId !== post.authorId)) {
    return notFound();
  }

  return (
    <>
      <h1>{post.title}</h1>
      <p>
        <i>By {post.author.name}</i>
      </p>
      <p>
        <i>{post._count.likes} Likes</i>
      </p>
      <p>{post.content}</p>
    </>
  );
}
```

Now let's write some tRPC queries:

`packages/api/src/index.ts`

```ts
import * as z from "zod";
import type { Post } from "@my-app/db/lib/generated/client";
import { prisma } from "@my-app/db/lib/prisma";
import { comment } from "@my-app/mongo";
import type { Comment } from "@my-app/mongo/models/comment";
import { authedProcedure, publicProcedure, router } from "./trpc";

export const appRouter = router({
  postList: publicProcedure.query(
    async (opts): Promise<(Post & { comments: readonly Comment[] })[]> => {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { draft: false },
            { authorId: opts.ctx.auth.userId ?? undefined },
          ],
          AND: [{ deleted: false }],
        },
        orderBy: {
          published: "desc",
        },
      });
      return Promise.all(
        posts.map(async (post) => {
          const postId = post.id;
          const comments = await comment.find({ post: postId }).exec();
          return { ...post, comments };
        }),
      );
    },
  ),
  postDetail: publicProcedure.input(z.string()).mutation(async (opts) => {
    const postId = opts.input;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        OR: [{ draft: false }, { authorId: opts.ctx.auth.userId ?? undefined }],
        AND: [{ deleted: false }],
      },
    });
    return post;
  }),
  addUserInfo: authedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async (opts) => {
      prisma.user.create({
        data: {
          id: opts.ctx.auth.userId,
          slug: opts.input.slug,
          name: opts.input.name,
        },
      });
    }),
  addPost: authedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        draft: z.boolean().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { title, content } = opts.input;
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: opts.ctx.auth.userId,
          slug: title.toLowerCase().replace(/ /g, "-"),
          draft: opts.input.draft ?? false,
        },
      });
      return post;
    }),

  updatePost: authedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        draft: z.boolean().optional(),
      }),
    )
    .mutation(async (opts) => {
      const { id, title, content, draft } = opts.input;

      const post = await prisma.post.update({
        where: { id, authorId: opts.ctx.auth.userId },
        data: {
          title,
          content,
          draft,
          edited: new Date(),
        },
      });
      return post;
    }),
  likePost: authedProcedure.input(z.string()).mutation(async (opts) => {
    const postId = opts.input;
    await prisma.like.create({
      data: {
        userId: opts.ctx.auth.userId,
        postId,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
```
