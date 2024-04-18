# Lecture 7 - Testing

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Feedback and Q&A Forms](#feedback-and-qa-forms)
- [Lecture 6 Follow-up](#lecture-6-follow-up)
  - [Webhooks for Users](#webhooks-for-users)
- [Testing an API Route](#testing-an-api-route)
- [Testing a tRPC Mutation](#testing-a-trpc-mutation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- Check-in 2 will be optional, and can be used to replace a missing attendance
  or the initial check-in. You already get 2 free absences, but if you have more
  than that this is one way to make that up. If you're pivoting or need some
  advice, I'm happy to help out with that.

## Feedback and Q&A Forms

- [Here is a form for the Q&A session](https://forms.gle/BFYvoySKPak98uEw5); if
  I see responses here that are relevant to the next lecture or are frequently
  asked for, I will do my best to include them in that lecture.
- [Here is a form for feedback](https://forms.gle/QqM3vF8ySoRE67gv8); I will do
  my best to apply what I can from here to my next lectures. I know I'm getting
  a biased response talking to people after class, so please help me be less
  biased!

## Lecture 6 Follow-up

- There's a repo
  [here](https://github.com/solaldunckel/next-13-app-router-with-trpc) that
  talks about getting tRPC set up within the app router that is worth looking at
  if you're making that switch or want to start with both tRPC and the app
  router. tRPC isn't super compatible with server side rendering in the app
  router, but on the server side you should have access to the things that tRPC
  would be querying, anyways.

### Webhooks for Users

Last time I mentioned that one way you might get users locally was to use
webhooks. This is how I would do that:

`apps/web/app/api/webhooks/user.ts`

```ts
import { prisma } from "@my-app/db/lib/prisma";
import { HttpStatusCode } from "@my-app/status-codes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import * as z from "zod";

const UserWebhookUpdateSchema = z.object({
  data: z.object({
    id: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
      })
    ),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  }),
});

// Create a schema for the webhooks, choosing a different
// type based on the "type" field.
const UserWebhookSchema = z.discriminatedUnion("type", [
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.created"),
  }),
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.updated"),
  }),
  z.object({
    type: z.literal("user.deleted"),
    data: z.object({ id: z.string() }),
  }),
]);

// Deal with the POST request
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Make sure that the webhook has the expected parameters
    const body = UserWebhookSchema.parse(await request.json());

    if (body.type === "user.deleted") {
      // Remove the user.
      await prisma.user.delete({
        where: {
          id: body.data.id,
        },
      });
    } else {
      // Update the user with the given info (or create it,
      // if it doesn't exist).
      await prisma.user.upsert({
        where: {
          id: body.data.id,
        },
        update: {
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
        create: {
          id: body.data.id,
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
      });
    }
    return new NextResponse(undefined, {
      status: HttpStatusCode.OK,
    });
  } catch (e) {
    // If we got something in an invalid format, return the
    // format error with a 400 error.
    if (e instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(e), {
        status: HttpStatusCode.BAD_REQUEST,
      });
    }

    // Prisma "not found" error; pass it on
    else if (e.code === "P2025") {
      return new NextResponse(undefined, {
        status: HttpStatusCode.NOT_FOUND,
      });
    }

    // Otherwise, this is probably an us problem.
    return new NextResponse(undefined, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
```

Now, this isn't very secure. I can make post requests to this endpoint and
create users on my site without needing any authorization or signing or
anything. Instead, we should make sure that we verify that the request is sent
by Clerk using their signing tokens:

```ts
import { prisma } from "@my-app/db/lib/prisma";
import { HttpStatusCode } from "@my-app/status-codes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import * as z from "zod";

const UserWebhookUpdateSchema = z.object({
  data: z.object({
    id: z.string(),
    email_addresses: z.array(
      z.object({
        email_address: z.string(),
      })
    ),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
  }),
});

// Create a schema for the webhooks, choosing a different
// type based on the "type" field.
const UserWebhookSchema = z.discriminatedUnion("type", [
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.created"),
  }),
  UserWebhookUpdateSchema.extend({
    type: z.literal("user.updated"),
  }),
  z.object({
    type: z.literal("user.deleted"),
    data: z.object({ id: z.string() }),
  }),
]);

// Get the signing key to prevent spoofing webhooks
const { CLERK_USER_WEBHOOK_SECRET_KEY } = process.env;

// Deal with the POST request
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();

    if (!CLERK_USER_WEBHOOK_SECRET_KEY) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET_KEY");
    }

    // Decode the webhook
    const wh = new Webhook(CLERK_USER_WEBHOOK_SECRET_KEY);
    const evt = wh.verify(
      JSON.stringify(payload),
      Object.fromEntries(request.headers.entries())
    );

    // Make sure that the webhook has the expected parameters
    const body = UserWebhookSchema.parse(await request.json());
    if (body.type === "user.deleted") {
      // Remove the user.
      await prisma.user.delete({
        where: {
          id: body.data.id,
        },
      });
    } else {
      // Update the user with the given info (or create it,
      // if it doesn't exist).
      await prisma.user.upsert({
        where: {
          id: body.data.id,
        },
        update: {
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
        create: {
          id: body.data.id,
          email: body.data.email_addresses[0]?.email_address,
          name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
        },
      });
    }
    return new NextResponse(undefined, {
      status: HttpStatusCode.OK,
    });
  } catch (e) {
    // If we got something in an invalid format, return the
    // format error with a 400 error.
    if (e instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(e), {
        status: HttpStatusCode.BAD_REQUEST,
      });
    }

    // Deal with requests that aren't signed properly
    else if (e instanceof WebhookVerificationError) {
      return new NextResponse(undefined, {
        status: HttpStatusCode.UNAUTHORIZED,
      });
    }

    // Prisma "not found" error; pass it on
    else if (e.code === "P2025") {
      return new NextResponse(undefined, {
        status: HttpStatusCode.NOT_FOUND,
      });
    }

    // Otherwise, this is probably an us problem.
    return new NextResponse(undefined, {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    });
  }
}
```

## Testing an API Route

Testing is a very important part of any application, in my opinion. Having a
fast turnaround time on if new changes have affected critical parts of your
application code is a very useful tool when you're trying to move fast.

I'm going to add the `faker` package so that I don't need to come up with test
data (and `vitest` and friends for those who don't have them already, although I
already had that from Lecture 5):

```
cd apps/web
pnpm i -D @faker-js/faker vitest @vitejs/plugin-react @testing-library/jest-dom @testing-library/react jsdom
cd -
```

And here's my config, as a reminder:

`apps/web/vitest.config.ts`

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "e2e/**", "*.test.ts"],
  },
});
```

For this instance, I'm testing a webhook route, but the principle holds for
other types of API routes. I'm going to start with a small refactor to the above
webhook route. Because I'm not interested in signing my test requests, I'm not
going to validate them, either. This is accomplished via dependency injection,
using `serverContainer` to create an authorizer. This means extracting the
functionality into a service:

`apps/web/api/webhooks/user/userwebhookhandler.ts`

```ts
import { prisma } from "@pointcontrol/db/lib/prisma";
import { HttpStatusCode } from "@pointcontrol/status-codes";
import { NextResponse } from "next/server";
import * as z from "zod";
import { inject, injectable } from "tsyringe";
import type { UserWebhookAuthorizer } from "./userwebhookauthorizer";

@injectable()
export class UserWebhookHandler {
  private static UpdateSchema = z.object({
    data: z.object({
      id: z.string(),
      email_addresses: z.array(
        z.object({
          email_address: z.string(),
        })
      ),
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
    }),
  });

  private static Schema = z.discriminatedUnion("type", [
    UserWebhookHandler.UpdateSchema.extend({
      type: z.literal("user.created"),
    }),
    UserWebhookHandler.UpdateSchema.extend({
      type: z.literal("user.updated"),
    }),
    z.object({
      type: z.literal("user.deleted"),
      data: z.object({ id: z.string() }),
    }),
  ]);
  constructor(
    @inject("UserWebhookAuthorizer")
    private readonly webhookAuthorizer: UserWebhookAuthorizer
  ) {}

  public readonly POST: (
    request: Request
  ) => ReturnType<UserWebhookHandler["_POST"]> = this._POST.bind(this);

  private async _POST(request: Request): Promise<NextResponse> {
    try {
      const json: unknown = await request.json();
      if (!(await this.webhookAuthorizer.isAuthorized(request, json))) {
        return new NextResponse(null, {
          status: HttpStatusCode.UNAUTHORIZED,
        });
      }
      const body = UserWebhookHandler.Schema.parse(json);
      if (body.type === "user.deleted") {
        await prisma.user.delete({
          where: {
            id: body.data.id,
          },
        });
      } else {
        await prisma.user.upsert({
          where: {
            id: body.data.id,
          },
          update: {
            email: body.data.email_addresses[0]?.email_address,
            name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
          },
          create: {
            id: body.data.id,
            email: body.data.email_addresses[0]?.email_address,
            name: `${body.data.first_name} ${body.data.last_name ?? ""}`.trim(),
          },
        });
      }
      return new NextResponse(undefined, {
        status: HttpStatusCode.OK,
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(e), {
          status: HttpStatusCode.BAD_REQUEST,
        });
      }
      // Prisma "not found" error
      else if (e.code === "P2025") {
        return new NextResponse(undefined, {
          status: HttpStatusCode.NOT_FOUND,
        });
      }
      return new NextResponse(undefined, {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
```

And then the `route.ts` is just a super thin interface to that handler:

`apps/web/api/webhooks/user/route.ts`

```ts
import { serverContainer } from "../../../../util/server-container";
import { UserWebhookHandler } from "./userwebhookhandler";

const handler = serverContainer.resolve(UserWebhookHandler);

export const POST = handler.POST;
```

First I'll create an interface to represent my authorizers in general:

`apps/web/app/api/webhooks/user/userwebhookauthorizer.ts`

```ts
export interface UserWebhookAuthorizer {
  isAuthorized: (request: Request, body: unknown) => Promise<boolean>;
}
```

Now I'll create both authorizers. First, the one for svix, and the one we want
to use in dev and production modes:

`apps/web/app/api/webhooks/user/svixuserwebhookauthorizer.ts`

```ts
import type { NextRequest } from "next/server";
import { injectable } from "tsyringe";
import { Webhook } from "svix";

const { CLERK_USER_WEBHOOK_SECRET_KEY } = process.env;

@injectable()
export class SvixUserWebhookAuthorizer {
  private readonly key: string;

  constructor() {
    if (!CLERK_USER_WEBHOOK_SECRET_KEY) {
      throw new Error("Missing CLERK_USER_WEBHOOK_SECRET_KEY");
    }
    this.key = CLERK_USER_WEBHOOK_SECRET_KEY;
  }

  isAuthorized(request: NextRequest, body: unknown): Promise<boolean> {
    try {
      const wh = new Webhook(this.key);
      const _ = wh.verify(
        JSON.stringify(body),
        Object.fromEntries(request.headers.entries())
      );
      return Promise.resolve(true);
    } catch (_) {
      return Promise.resolve(false);
    }
  }
}
```

And the null one that just lets every request through, for test mode:

`apps/web/app/api/webhooks/user/nulluserwebhookauthorizer.ts`

```ts
import type { NextRequest } from "next/server";
import { injectable } from "tsyringe";
import type { UserWebhookAuthorizer } from "./userwebhookauthorizer";

@injectable()
export class NullUserWebhookAuthorizer implements UserWebhookAuthorizer {
  isAuthorized(_request: NextRequest, _body: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }
}
```

Now I'll create a server injector, and inject the Svix authorizer by default:

`apps/web/util/server-container.ts`

```ts
import { container } from "tsyringe";
import { SvixUserWebhookAuthorizer } from "../app/api/webhooks/user/svixuserwebhookauthorizer";
import "reflect-metadata";

export const serverContainer = container.createChildContainer();

serverContainer.registerSingleton(
  "UserWebhookAuthorizer",
  SvixUserWebhookAuthorizer
);
```

And update my run scripts for tests (and the other ones to allow for running
with injection):

`apps/web/package.json`

```json
{
  "scripts": {
    "withenv": "dotenv -e ../../.env --",
    "dev": "cross-env NODE_OPTIONS=\"--require reflect-metadata\" pnpm withenv next dev",
    "build": "cross-env NODE_OPTIONS=\"--require reflect-metadata\" next build",
    "start": "cross-env NODE_OPTIONS=\"--require reflect-metadata\" next start",
    "lint": "next lint",
    "format": "prettier --check \"**/*.{js,jsx,cjs,mjs,prisma,ts,tsx,md,json}\"",
    "test:e2e": "cross-env NODE_OPTIONS=\"--require reflect-metadata\" NODE_ENV=test pnpm withenv playwright test",
    "test": "cross-env NODE_OPTIONS=\"--require reflect-metadata\" NODE_ENV=test pnpm withenv vitest"
  }
}
```

I'm not super happy with this approach since it requires stacking a bunch of
required info into a couple scripts, but the Next team has been
[pretty](https://github.com/vercel/next.js/issues/53870)
[quiet](https://github.com/vercel/next.js/discussions/46805) on
[this issue](https://github.com/vercel/next.js/issues/49850).

Now for my test:

`apps/web/api/webhooks/user/route.spec.ts`

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { faker } from "@faker-js/faker";
import { UserWebhookHandler } from "./route";
import { container } from "tsyringe";
import { NullUserWebhookAuthorizer } from "./nulluserwebhookauthorizer";

// @vitest-environment node
describe(module.id, () => {
  let POST: Pick<UserWebhookHandler, "POST">["POST"];

  beforeAll(() => {
    POST = container
      .createChildContainer()
      .register("UserWebhookAuthorizer", NullUserWebhookAuthorizer)
      .resolve(UserWebhookHandler).POST;
  });

  describe("create and delete a user", () => {
    const userId = `user_${faker.string.fromCharacters(
      "abcdefghijklmnopqrstuvwxyz0123456789",
      27
    )}`;

    it("should create a user", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.created",
          data: {
            id: userId,
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
            first_name: first,
            last_name: last,
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(200);
    });

    it("should 400 on mangled bodies", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.created",
          data: {
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(400);
    });

    it("should 400 on invalid 'type's", async () => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      const createReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify({
          type: "user.other",
          data: {
            id: userId,
            email_addresses: [
              {
                email_address: faker.internet.email({
                  firstName: first,
                  lastName: last,
                  provider: "example.com",
                }),
              },
            ],
            first_name: first,
            last_name: last,
          },
        }),
        method: "POST",
      });

      const createRes = await POST(createReq);
      expect(createRes.status).toBe(400);
    });

    it("should delete a user", async () => {
      const body = {
        type: "user.deleted",
        data: {
          id: userId,
        },
      };

      const deleteReq = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify(body),
        method: "POST",
      });

      // Should be fine the first time we ask for it
      const deleteRes = await POST(deleteReq);
      expect(deleteRes.status).toBe(200);

      const deleteReq2 = new Request("localhost:3000/api/webhooks/user", {
        body: JSON.stringify(body),
        method: "POST",
      });
      // Shouldn't find anything the next time and error
      const deleteRes2 = await POST(deleteReq2);
      expect(deleteRes2.status).toBe(404);
    });
  });
});
```

I use three names for my test files:

- `[name].spec.ts` for the actual tests
- `[name].test.ts` for any test-related code for that class that are not the
  actual tests
- `[name].mock.ts` for any mock versions of that class

## Testing a tRPC Mutation

Testing tRPC queries and mutations is much simpler. I'm still going to do that
with a database, but by constructing your context the right way you can get away
with just in-memory tests as well.

First, I'm going to add `vitest` to my `api` package:

```
cd packages/api
pnpm i -D vitest @faker-js/faker
```

First, I need some utilities to create authentication contexts. I'm going to
write them, (but probably copy them in class because they're really long):

`packages/api/src/context.test.ts`

```ts
import { SignedInAuthObject, SignedOutAuthObject, User } from "@clerk/backend";
import { prisma } from "@pointcontrol/db/lib/prisma";
import { faker } from "@faker-js/faker";

export function withAnonContext<R extends void | Promise<void>>(
  run: (params: {
    ctx: { prisma: typeof prisma; auth: SignedOutAuthObject };
  }) => R
): R {
  return run({
    ctx: {
      prisma,
      auth: {
        sessionClaims: null,
        sessionId: null,
        session: null,
        actor: null,
        userId: null,
        user: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        organization: null,
      },
    } as {
      prisma: typeof prisma;
      auth: SignedOutAuthObject;
    },
  });
}

export async function withAuthContext<R>(
  run: (params: {
    userId: string;
    ctx: {
      prisma: typeof prisma;
      auth: SignedInAuthObject;
    };
  }) => R,
  authPartial?: Partial<Exclude<SignedInAuthObject, "userId">>,
  userPartial?: Partial<Exclude<Exclude<User, "id">, "email_addresses">>
): R {
  const userId = `user_${faker.string.fromCharacters(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    27
  )}`;

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const email = faker.internet.email({
    firstName,
    lastName,
    provider: "example.com",
  });

  const data = {
    ...authPartial,
    userId,
  };

  await prisma.user.create({
    data: {
      id: userId,
      email,
      name: `${firstName} ${lastName}`,
    },
  });

  const params = {
    userId,
    ctx: {
      prisma,
      auth: {
        sessionClaims: null,
        sessionId: null,
        session: null,
        actor: null,
        user: {
          id: data.userId,
          passwordEnabled: false,
          totpEnabled: false,
          backupCodeEnabled: false,
          twoFactorEnabled: false,
          banned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          profileImageUrl: "",
          imageUrl: "",
          hasImage: false,
          gender: "",
          birthday: "",
          primaryEmailAddressId: null,
          primaryPhoneNumberId: null,
          primaryWeb3WalletId: null,
          lastSignInAt: null,
          externalId: null,
          username: null,
          firstName,
          lastName,
          emailAddresses: [
            {
              email,
            },
          ],
          ...userPartial,
        },
        orgId: null,
        orgRole: null,
        orgSlug: null,
        organization: null,
        ...data,
      },
    } as {
      prisma: typeof prisma;
      auth: SignedInAuthObject;
    },
  };

  const res = run(params);
  if (res instanceof Promise) {
    await res;
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
```

And now for my tests:

`packages/api/src/index.spec.ts`

```ts
import { describe, expect, it } from "vitest";
import { appRouter } from "./index";
import { withAnonContext, withAuthContext } from "./context.test";

describe(module.id, () => {
  describe("createGame", () => {
    it("should create a game when authenticated", async () => {
      return withAuthContext(async ({ ctx }) => {
        const caller = appRouter.createCaller(ctx);

        const { slug } = await caller.createGame({
          title: "Test Game",
          description: "This is a test game.",
          location: "Test Location",
          public: true,
          approval: true,
        });

        expect(slug).toBeDefined();

        // Clean up afterwards
        await ctx.prisma.game.delete({
          where: {
            slug,
          },
        });
      });
    });

    it("should not create a game when unauthenticated", async () => {
      return withAnonContext(async ({ ctx }) => {
        const caller = appRouter.createCaller(ctx);

        const promise = caller.createGame({
          title: "Test Game",
          description: "This is a test game.",
          location: "Test Location",
          public: true,
          approval: true,
        });
        await expect(promise).rejects.toThrowError();
      });
    });
  });
});
```
