<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Pre-Lecture](#pre-lecture)
  - [News and Housekeeping](#news-and-housekeeping)
  - [Feedback and Q&A Forms](#feedback-and-qa-forms)
  - [Lecture 12 Follow-Up](#lecture-12-follow-up)
- [Lecture 13 - Payments, State Management Part 2](#lecture-13---payments-state-management-part-2)
  - [Payments and Subscriptions](#payments-and-subscriptions)
    - [Payments vs Subscriptions](#payments-vs-subscriptions)
    - [On Providers](#on-providers)
    - [Getting Payment Information](#getting-payment-information)
  - [State Management Part 2: Demo](#state-management-part-2-demo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Pre-Lecture

## News and Housekeeping

- I owe some of your participation points; I need to do better about asking for
  your names if I don't know them yet. **If you have asked one or both of your
  questions already and don't see points in Learning Suite for it yet, please
  come talk to me after class or shoot me a slack message.\***
- **Check-in 3 has started.** Please expect to come in earlier and talk about
  what you've built and learned so far this semester.
- Because Check-In 3 is how I assess the "App Progress" grade, it is mandatory.
  Please come in with your team. You have a full month to do it. Because I have
  to submit grades after Check-In 3 closes, not coming to check in means 65% of
  your grade can't be submitted. I don't want to have to do that. The last day
  to do this will be December 22nd.
- Advent of Code has started. It's a cool way to learn another language, or
  compete with other people to shoot for the global leaderboard.

## Feedback and Q&A Forms

- [Here is a form for the Q&A session](https://forms.gle/BFYvoySKPak98uEw5); if
  I see responses here that are relevant to the next lecture or are frequently
  asked for, I will do my best to include them in that lecture. **Next time is a
  Q&A session; please ask questions beforehand here.** This form now counts for
  participation.
- [Here is a form for feedback](https://forms.gle/QqM3vF8ySoRE67gv8); I will do
  my best to apply what I can from here to my next lectures. I know I'm getting
  a biased response talking to people after class, so please help me be less
  biased!

## Lecture 12 Follow-Up

- Any questions after last time's content that y'all want to go over? Any other
  things y'all want to discuss?

# Lecture 13 - Payments, State Management Part 2

## Payments and Subscriptions

I don't want to take too long on this unless some of you want to; there are two
main types of ways that your users can give you money for your product.

### Payments vs Subscriptions

Payments are used where users pay once for a software license and keep it
forever. Lots of software, especially desktop software, start out like this. If
your product is built around individual events, this might be the way to go.

Subscriptions (sometimes called billing) are the other alternative. They have
become much more popular over the past decade or so. This is where instead of a
permanent license, users will pay for each month they want to have access to
their software. There's a fine balance here of profit-driving and user
friendliness. This quickly turns into an ethics discussion for which I have
opinions, but not qualifications.

What I will say here, at least in terms of product perspective, is a couple
pieces of advice. Users who like your product and what you help them do are not
litigious users, and will frequently help other users find your products. You
have many opportunities to be user-friendly in terms of pricing. Combined with
user access data which you should be collecting, you have the option to remind
users that they are going to be billed when they are not using your product, or
even pause billing for months that they don't use the product.

I don't want to harp on this forever, but the perception of looking out for your
fellow people can go a long way, but that normally comes at the expense of
profit.

### On Providers

When you're starting out, having people Venmo you the money, setting the flag in
their account on the database, and creating a reminder in your calendar to
remove their access in a month might work, but that can quickly get out of hand.

Stripe, Square, and Plaid are all pretty common and trusted providers for
payments, and especially where payments are concerned, trust is important.
There's a tradeoff here, though, since consumer trust is part of the fees you
pay on each transaction. Each of these have their own niche; Plaid is generally
used for banking and user-to-user transactions, Square is more intwined with
point of sale and physical goods, and Stripe is used with software.

I strongly recommend against building a payment processor yourself. There are
lots of rules, and lots of things that can go wrong.

### Getting Payment Information

This looks a lot like authentication, because both of them should be secure, and
both of them have different needs based on what you're building. Here are some
of the options that I've seen or heard about:

- **Return Page**: One way to deal with payments is to send users to an external
  provider, and send them back to a set URL along with some certain information
  that guarantees they've made a payment.
- **Periodic Fetches**: Another option is to periodically check in that users'
  accounts are in good standing.
- **Webhooks**: My favorite option is webhooks; have your payment provider let
  you know when a user makes a payment, and do whatever logic you need then.

## State Management Part 2: Demo

I was working on a more complex example for this, but I encountered this example
instead which I think better illustrates what I'm trying to do. For my app, I
want to build a navigation display that looks something like this:

![](assets/Subpage%20Real.png) _(Spoiler alert I already built it while writing
this lecture)_

I want this to have different behavior depending on the page, too:
![](assets/Subpage%20Mock.png)

Generally the way to communicate to children is via props, and the way to
communicate to parents is via event listeners:

![](assets/Traditional%20State.png)

Because this lives in the root layout, I can't exactly control it with props a
couple layers deep, and the listeners to facilitate this would be crazy even
without SSR. This is where state management comes in. State management is mainly
used to pass data around _outside_ of the tree of the document:

![](assets/State%20Management.png)

While multiple parts of the document may depend or update the data, that data is
not truly part of the tree. That's what gives it the flexibility that we want to
take advantage of here.

So for mine, I'm going to use `jotai`, and create an atom outside of the DOM
tree:

`apps/web/app/currentsubpage.ts`

```ts
import { atom } from "jotai";

export const currentSubpage = atom<string | undefined>();
```

Now, I want to depend on it in my header. Unfortunately for me, my header is
only partly clientside rendered, and state management happens entirely on the
clientside. So I'm going to need to convert my full header to be clientside
rendered:

`apps/web/app/clientheader.tsx` (relevant parts)

```tsx
"use client";

import { useAtom } from "jotai";
import Link from "next/link";
import { currentSubpage } from "./currentsubpage";

export function ClientHeader(): JSX.Element {
  const subpage = useAtom(currentSubpage)[0];

  return (
    <header className="sticky top-0 flex items-center justify-between bg-slate-50 text-slate-950 shadow-md dark:bg-slate-950 dark:text-slate-50">
      <div className="flex flex-row items-end justify-center gap-2 p-4">
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1 className="m-0 text-xl font-bold text-slate-950 dark:text-slate-50">
            hvz.gg
          </h1>
        </Link>
        {subpage ? (
          <span className="invisible flex flex-row items-end gap-2 sm:visible">
            <span className="text-xl text-slate-600 dark:text-slate-400">
              /
            </span>
            <h2 className="text-l font-bold text-slate-950 dark:text-slate-50">
              {subpage.title}
            </h2>
          </span>
        ) : null}
      </div>
    </header>
  );
}
```

Now, each of the places that need it should also have a client component to be
added to the serverside tree and help me manage state on the client:

`apps/web/app/client.tsx`

```tsx
import { useAtom } from "jotai";
import { currentSubpage } from "./currentsubpage";

export function RootClientComponent(): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  // Remove the subpage state when the root page is loaded,
  // but only do so when there is a subpage so we don't
  // rerender all the time.
  if (subpage) {
    setSubpage(undefined);
  }

  // Probabaly not needed, but I like having components
  // actually return components.
  return <span></span>;
}
```

And use that on the rendered page:

`apps/web/app/page.tsx`

```diff
export default function Home(): JSX.Element {
  return (
    <div>
	  ...
+     <RootClient />
    </div>
  );
}
```

Now, I need a client portion to my Games page:

`apps/web/app/games/client.tsx`

```tsx
import { useAtom } from "jotai";
import { currentSubpage } from "./currentsubpage";

const subpageName = "Games";

export function RootClientComponent(): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  // Set the subpage state when the game index page is loaded,
  // but only do so when it's different than expected so we don't
  // rerender all the time.
  if (subpage !== subpageName) {
    setSubpage(subpageName);
  }

  return <span></span>;
}
```

And again one for the game detail. This one needs a bit more information,
because the game details need to be retrieved from the server:

`apps/web/app/games/[gameSlug]/client.tsx`

```tsx
"use client";

import type { PublicGame } from "@pointcontrol/types";
import { useAtom } from "jotai";
import { currentSubpage } from "../../headerstack.store";

export function GameDetailClientComponent({
  game,
}: {
  game: PublicGame;
}): JSX.Element {
  const [subpage, setSubpage] = useAtom(currentSubpage);

  // Pull the subpage from the props, updating it as needed
  if (subpage !== game.name) {
    setSubpage(game.name);
  }

  return <h1 className="text-4xl font-bold">{game.name}</h1>;
}
```

And here's where I provide that info:

`apps/web/app/games/[gameSlug]/page.tsx`

```tsx
import { prisma } from "@pointcontrol/db/lib/prisma";
import { notFound } from "next/navigation";
import { GameDetailClientComponent } from "./client";

export default async function GameHome({
  params,
}: {
  params: { gameSlug: string };
}): Promise<JSX.Element> {
  const game = await prisma.game.findUnique({
    where: {
      slug: params.gameSlug,
    },
  });

  if (!game) {
    return notFound();
  }

  // Pass the game as a prop into the client so that
  // it has access to that data.
  return <GameDetailClientComponent game={game} />;
}
```
