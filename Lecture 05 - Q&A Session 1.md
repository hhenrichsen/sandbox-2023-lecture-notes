<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What’s the best way to go about server side rendering in NextJS? Should we be making our initial API calls there to optimize SEO?](#whats-the-best-way-to-go-about-server-side-rendering-in-nextjs-should-we-be-making-our-initial-api-calls-there-to-optimize-seo)
  - [Static](#static)
  - [Serverside](#serverside)
  - [Streaming / Suspense (on the `app` router)](#streaming--suspense-on-the-app-router)
  - [Clientside](#clientside)
- [How do I do authentication, and how does it work?](#how-do-i-do-authentication-and-how-does-it-work)
- [What are the best resources I can use to learn how to think in systems and get good at architecting them?](#what-are-the-best-resources-i-can-use-to-learn-how-to-think-in-systems-and-get-good-at-architecting-them)
  - [For a Specific Case](#for-a-specific-case)
    - [Define Your Requirements](#define-your-requirements)
    - [Implement The Requirements](#implement-the-requirements)
    - [Analyze](#analyze)
    - [Iterate](#iterate)
  - [Other Ways to Learn](#other-ways-to-learn)
    - [Look at Prior Art](#look-at-prior-art)
    - [Ask Questions](#ask-questions)
    - [Review Them](#review-them)
- [What other backend programming languages are good?](#what-other-backend-programming-languages-are-good)
- [How should we set up a VPN for a staging environment? Or is that important at our stage of things?](#how-should-we-set-up-a-vpn-for-a-staging-environment-or-is-that-important-at-our-stage-of-things)
- [How should we set up a testing framework for frontend and backend? How early should we set this up? Prototype? Beta? MVP? Later?](#how-should-we-set-up-a-testing-framework-for-frontend-and-backend-how-early-should-we-set-this-up-prototype-beta-mvp-later)
  - [How early should we set this up?](#how-early-should-we-set-this-up)
  - [Setting up Vitest](#setting-up-vitest)
  - [Setting Up Playwright](#setting-up-playwright)
  - [CI with GitHub Actions](#ci-with-github-actions)
- [What is the best way to use tRPC in our Next.js Frontend App using Dependency Injection and services? Could we do a similar dependency injection on the backend?](#what-is-the-best-way-to-use-trpc-in-our-nextjs-frontend-app-using-dependency-injection-and-services-could-we-do-a-similar-dependency-injection-on-the-backend)
  - [React Context vs DI](#react-context-vs-di)
  - [State Management](#state-management)
  - [Setting Boundaries](#setting-boundaries)
  - [Adding a DI Framework](#adding-a-di-framework)
  - [Doing DI](#doing-di)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- **You have 1 week from today to get the first check-in done**; come talk to me
  about what you're thinking about building and what you have so far. I'm going
  to try to send an email about this to those who have not met with me. This
  helps me stay on top of what to be teaching and ideally gets you some advice
  on what you might not yet be thinking about.
  - If you need an appointment outside of my normal office hours, contact me via
    email or Slack. We can find a time that works for both of us.

## What’s the best way to go about server side rendering in NextJS? Should we be making our initial API calls there to optimize SEO?

Next.js gives a couple of rendering modes for us to use:

### Static

Static rendering is default for the `app` router, or done via `getStaticProps`
in the `pages` router. Pages are generated at build time, or in the background
when data is revalidated on the `app` router (or using
[ISR on the pages router](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)).

### Serverside

Used whenever dynamic data is loaded in the `app` router, or via
`useServerSideProps` in the `pages` router.

### Streaming / Suspense (on the `app` router)

Streaming allows portions of the app that can be to be rendered statically, and
then the rest of them to be rendered on the server of the client. You can use a
`<Suspense>` component to define the boundaries of where that should be, and a
`loading.ts` file to determine how that should work.

### Clientside

- Client (via `'use client'`)

Ideally, pages where SEO and indexability matter (like landing pages, or other
public pages) should be static where possible, or server-rendered if not.

## How do I do authentication, and how does it work?

Here's an example of what this looks like (very loosely) for OAuth. You should
use OAuth. People trust it more, it's more straightforward, they don't have to
remember passwords, and you don't have to worry about accidentally leaking that.

![](<assets/Authentication%20-%20Page%201%20(6).png>)

Once you're logged in, you can use Bearer or Session based authentication. I
think bearer is neat because you can keep more data in there without needing to
query the database, but sessions have worked for a long while and are very
standard.

![](<assets/Authentication%20-%20Page%201%20(4).png>)

This diagram can also be accessed
[here](https://lucid.app/documents/view/415cdb6a-57c4-4462-9880-0c9a9123d438).

I recommend using [NextAuth](https://next-auth.js.org/) (as long as you don't
use a Credentials type), [Clerk](https://clerk.com/),
[Auth0](https://auth0.com/), or
[Supabase Auth](https://supabase.com/docs/guides/auth). All of these have plenty
of guides and integrate well with Next.js and other frameworks.

There is a lot of nuance within Authentication–do we want to move that lecture
up so that it's next?

## What are the best resources I can use to learn how to think in systems and get good at architecting them?

### For a Specific Case

One way I interpret this question is "How do I build a good architecture for the
problem I'm trying to solve?" Here's how I think about that:

#### Define Your Requirements

Figure out what needs to happen in order for you to build what you're trying to
build. Break it down into pieces with enough detail that they can be
accomplished individually. Keep track of new requirements and flesh them out as
needed.

#### Implement The Requirements

Implement the pieces that have been created and fleshed out.

#### Analyze

Use data and feedback to determine what is working and what is not working.
Things that are not working become new requirements. If some of the parts were
implemented suboptimally, file them as tech debt and requirements for the next
time around.

#### Iterate

Start over again with any new requirements.

I find that there are few decisions you can make that permanently lock you into
a bad solution. Even when choosing tech stack, there are ways to slowly convert
to another one, or migrate from a data source. The easiest way to learn what
doesn't work is to build something that doesn't work, and use that experience to
build towards something that does.

### Other Ways to Learn

#### Look at Prior Art

Prior art is a good way to learn without making mistakes yourself. Here are some
of the things I have looked at for system design:

- Search for Architecture Case Studies on [dev.to](https://dev.to/) and
  [medium](https://medium.com/).
- Look for architecture walkthroughs.
- Read people's
  [postmortems](https://dev.to/mblayman/a-failed-saas-postmortem-2ek5).
- System Design is a popular interview topic, and so there are many example
  problems and solutions out there that are less of a commitment than actually
  implementing an architecture.
- Google has [some books available online for SRE](https://sre.google/books/)
  that are also a fantastic resourse here.

There are many more

#### Ask Questions

More experienced people than I talk frequently about things they're working on
and designs they've done in the past. You can consume their content (many have
blogs, twitter accounts, etc.), but also many of them are fairly active in a way
that lets you ask your own questions.

The #engineering channel is also an awesome resource here if you need advice or
a reviewer, which brings me to the next way: having someone else review what
you've made.

#### Review Them

Have someone poke holes in the architecture you're designing. You know the
desired, happy path as the one who designed it, but another person can help to
find things that you haven't yet considered.

## What other backend programming languages are good?

Here is a list of them that I have used and liked:

- **Kotlin** – library support of Java, with the developer experience of Python
  or TypeScript. Can compile to JavaScript and Native code, as well as has
  support for Android by default.
- **Rust** – super fast, super typesafe.
- **Go** – a very straightforward language; C-style, but has modern stuff like
  package management
- **Zig** – I haven't used this one myself, but it seems super interesting,
  performant, and is C++ compatible. Less popular than Rust, though, so finding
  engineers for this one may be tricky.

Ultimately, I also kind of read this as "What backend programming language
should I use?" which I would respond to with "use what you can develop quickly
with". It's up to you to decide if learning something new is useful.

## How should we set up a VPN for a staging environment? Or is that important at our stage of things?

You can get a $6/month server at Vultr or other similar providers and install
OpenVPN on there.

## How should we set up a testing framework for frontend and backend? How early should we set this up? Prototype? Beta? MVP? Later?

### How early should we set this up?

Set it up now. It'll take 5 minutes to get set up and not much longer than that
to write some initial tests, and then start enforcing them on PRs. I don't think
it's worth it to shoot for 100% coverage initially, but you should have a
framework in place and ensure that it runs on your core flows.

### Setting up Vitest

For individual components and unit tests, `vitest` is a recent favorite of mine.
Here's how I'd add that to a component:

```
cd apps/web
pnpm i -D vitest @vitejs/plugin-react @testing-library/jest-dom @testing-library/react jsdom
cd -
```

`apps/web/vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
```

`apps/web/app/component.tsx`

```tsx
import { useState } from "react";

export default function Counter(): JSX.Element {
  const [count, setCount] = useState(0);
  return (
    <>
      <h2>{count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
        type="button"
      >
        +
      </button>
    </>
  );
}
```

`apps/web/app/component.test.tsx`

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Component from "./component";

test("Heading should increment on button click", () => {
  render(<Component />);
  expect(screen.getByRole("heading", { level: 2, name: "0" })).toBeDefined();
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("heading", { level: 2, name: "1" })).toBeDefined();
});
```

I can trigger this with `pnpm vitest`, but I'd rather add a script:
`apps/web/package.json`

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

This way I can add more steps to testing, and use turbo to run tests.

### Setting Up Playwright

Playwright is used to write end to end tests across multiple platforms. Here's
how I'd add that to my project.

```
cd apps/web
pnpm i -D @playwright/test
cd -
```

We may also have to install the browsers that playwright uses:

```
pnpm exec playwright install
```

Now we create a config, setting some URLs so we use the local dev server:
`playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:3000",
    screenshot: "only-on-failure",
  },
  // Run your local dev server before starting the tests
  webServer: {
    command: "pnpm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
});
```

And write a test: `apps/web/e2e/home.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("should navigate the 404 page when clicking my invalid link", async ({
  page,
}) => {
  await page.goto("/");
  // Save a screenshot; this will be generated the first time
  await expect(page).toHaveScreenshot("home.png");
  await page.click("text=Game List");
  await expect(page).toHaveURL("/games");
  // Save another screenshot
  await expect(page.locator("h1")).toContainText("404");
  await expect(page).toHaveScreenshot("404.png");
});
```

You can run this with `pnpm playwright test`, but I'm going to add a script for
this as well:

`apps/web/package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

This will fail the first time we run it (to generate the screenshots), but
should pass as long as the page is deterministic from there.

If you need to regenerate screenshots, you can run
`pnpm test:e2e --update-snapshots`.

You can also run this with `pnpm test:e2e --ui` to see the test as it works, and
see what it sees at each step of the way.

Here are some other script changes that I made and feel obligated to show:

`turbo.json`

```json
{
  "pipeline": {
    "test": {
      "dependsOn": ["^db:generate"]
    },
    "test:e2e": {
      "dependsOn": ["^db:generate"]
    }
  }
}
```

`package.json`

```json
{
  "scripts": {
    "test:e2e": "turbo run test:e2e",
    "test": "turbo run test"
  }
}
```

There are also
[cool articles out there](https://echobind.com/post/playwright-with-next-auth)
about getting this working with authentication and such, so I'd recommend
checking those out too.

### CI with GitHub Actions

Not too much to say here; I tried to add a bunch to this file so you can see how
it works. I try to do some caching here because there are some _really_ slow
steps that can take advantage of caching.

`.github/workflows/tests.yml`

```yaml
name: Verify

on:
  push:
    branches: [main, next]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build and Run Tests
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.38.0-jammy
    services:
      postgres:
        image: postgres
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready --health-interval 10s --health-timeout 5s
          --health-retries 5
    env:
      POSTGRES_PRISMA_URL: postgresql://postgres:postgres@postgres:5432/postgres
      POSTGRES_URL_NON_POOLING: postgresql://postgres:postgres@postgres:5432/postgres
      CI: true
      NEXTAUTH_SECRET: supersecret-supersafe
    steps:
      - uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - uses: actions/cache@v3
        name: Setup pnpm cache
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Check Format
        run: pnpm format

      - name: Build
        run: pnpm build

      - name: Run migrations
        run: pnpm db:deploy

      - name: Run unit tests
        run: pnpm test

      - name: Run e2e tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: apps/web/playwright-report/
          retention-days: 30
```

You may need to
[use Docker to update your screenshots](https://playwright.dev/docs/test-snapshots)
if your CI runs on a different OS than your development environment. There's
also
[a discussion about testing a t3 repo here](https://github.com/trpc/trpc/discussions/3612)
that may be of interest to you.

## What is the best way to use tRPC in our Next.js Frontend App using Dependency Injection and services? Could we do a similar dependency injection on the backend?

### React Context vs DI

There's a
[neat article here](https://blog.testdouble.com/posts/2021-03-19-react-context-for-dependency-injection-not-state/)
about the difference, and how you can use react context to achieve something
similar to DI without needing to add a whole DI framework. If that will work for
you, it might not be worth the full investment in DI now. However, DI can be
useful in testing and in codebase organization.

There's also a good article
[here](https://martinfowler.com/articles/injection.html#UsingAServiceLocator) by
Martin Fowler about why you might use Dependency Injection, specifically service
locators like DI frameworks.

### State Management

This idea originally came up in a conversation about state management. In my
opinion, context should not be used for state management, but can be used to
facilitate state management by providing state management dependencies.

### Setting Boundaries

I'm going to add a package called `server-only` which will help me ensure that
certain things (like files that use environment variables) remain in the server
bundle and error my development environment if I try to add them to the client
bundle.

```
cd apps/web
pnpm i -S server-only
cd -
```

Now, any package into which we import `server-only` will throw an error if we
try to load it on the client, which makes it kind of the opposite of the
`'use client'` string. I'm going to use this to keep my injectors separate.

### Adding a DI Framework

I'm also going to add `inversify` and `reflect-metadata` here, as well as a
couple dev dependencies that are required for the client side to work as
expected. `reflect-metadata` allows us to save information about classes and
types at runtime, allowing us to do things like ask for specific dependencies.
This is required for anything like dependency injection. `inversify` is one of
the available libraries that uses `reflect-metadata` to inject requirements into
classes.

There are also a couple babel dependencies here so that we can add polyfills to
the frontend for different features that aren't standard yet, in this case
decorators and typescript metadata for those.

```
cd apps/api
pnpm i -S inversify reflect-metadata
cd -
```

And let typescript know we want to support decorators as well, so we'll add this
to our tsconfig:

`apps/web/tsconfig.json`

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

And I'm going to import `reflect-metadata` in whatever the start location of my
app is, in this case my `_app.ts`. On the `app` router, I can use the
experimental instrumentation feature to do this instead.

### Doing DI

DI looks mostly the same wherever you do it, so I'm going to provide a better
example here using a past project of mine;
[a discord bot](https://github.com/hhenrichsen/heta-bot).

Since bots are largely just responding to events of many types, it made sense to
abstract some of this away so I could easily add responses to different emojis,
for example.
