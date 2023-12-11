<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Pre-Lecture](#pre-lecture)
  - [News and Housekeeping](#news-and-housekeeping)
  - [Feedback and Q&A Forms](#feedback-and-qa-forms)
- [Retrospective](#retrospective)
- [Q&A](#qa)
  - [What's your suggestion on hosting? Is Vercel typically the best option for the turbo stack?](#whats-your-suggestion-on-hosting-is-vercel-typically-the-best-option-for-the-turbo-stack)
  - [What are different tools we can use to run analytics on our webpages or apps? Which ones are recommended how do we implement them?](#what-are-different-tools-we-can-use-to-run-analytics-on-our-webpages-or-apps-which-ones-are-recommended-how-do-we-implement-them)
  - [How do you manage using multiple different component libraries and maintaining a cohesive look? Is it best to build out a custom component base on top of these libraries for this?](#how-do-you-manage-using-multiple-different-component-libraries-and-maintaining-a-cohesive-look-is-it-best-to-build-out-a-custom-component-base-on-top-of-these-libraries-for-this)
  - [What are the considerations for figuring out where to store data for a mobile app (what should be local storage vs. cloud based)](#what-are-the-considerations-for-figuring-out-where-to-store-data-for-a-mobile-app-what-should-be-local-storage-vs-cloud-based)
  - [What is missing from Flutter that makes React Native better for more complex/in-depth things?](#what-is-missing-from-flutter-that-makes-react-native-better-for-more-complexin-depth-things)
  - [Advice for storing environment variables for mobile apps?](#advice-for-storing-environment-variables-for-mobile-apps)
  - [What things do I need to do to make sure my website is optimized for SEO traffic?](#what-things-do-i-need-to-do-to-make-sure-my-website-is-optimized-for-seo-traffic)
  - [At what point does it make sense to rewrite sections of your code that aren't the most efficient or round about way of doing things?](#at-what-point-does-it-make-sense-to-rewrite-sections-of-your-code-that-arent-the-most-efficient-or-round-about-way-of-doing-things)
  - [For those using stripe for payments what are the pros and cons to using checkout versus stripe elements? Why did you choose to use a certain one?](#for-those-using-stripe-for-payments-what-are-the-pros-and-cons-to-using-checkout-versus-stripe-elements-why-did-you-choose-to-use-a-certain-one)

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

# Retrospective

Let's talk about what has gone well and what has not gone well so far this
semester.

Our goal from this is to learn from each other, not to place the blame on
people:

> **Regardless of what we discover, we understand and truly believe that
> everyone did the best job they could, given what they knew at the time, their
> skills and abilities, the resources available, and the situation at hand**

– Norm Kerth, Project Retrospectives: A Handbook for Team Review, quoted in
[the Retrospective Wiki](https://retrospectivewiki.org/index.php?title=The_Prime_Directive).

# Q&A

## What's your suggestion on hosting? Is Vercel typically the best option for the turbo stack?

With both Turbo and Next.js being owned and maintained by Vercel, Vercel is
generally a pretty good place to start. There's cost and build system overhead
to switch to something that has less baked-in support. That said, there are
resources like [OpenNext](https://open-next.js.org/) that can help you deploy
your app somewhere else.

I have used each of Azure, Google Cloud, and AWS, and each of them worked for
what I was trying to do. I think all of those can work well and cost
effectively, especially given the startup credits they have to offer.

## What are different tools we can use to run analytics on our webpages or apps? Which ones are recommended how do we implement them?

[Hotjar](https://www.hotjar.com/) and [Posthog](https://posthog.com/) are the
main ones that I've heard about that are fairly startup friendly. I want to do a
full lecture on this next semester, so I might hold off on a full demo until
then, but most of the time it's as simple as this, using Posthog for an example:

```bash
pnpm install -S posthog-js
```

Logging in (this for a client component; serverside you might just use the raw
client):

```tsx
<PostHogProvider
  apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
></PostHogProvider>
```

And then recording events as they happen:

```tsx
function Component() {
  const posthog = usePostHog();

  posthog?.capture("clicked_log_in");
}
```

Or even with data:

```tsx
function Component() {
  const posthog = usePostHog();
  const [sessionId] = useAtom(currentSessionId);

  posthog?.capture("clicked_log_out", {
    sessionId,
  });
}
```

Some of these provide other tools like session replay and feature flags / AB
tests which can also be super useful. Just make sure you're setting those up
with good regard to users' privacy.

## How do you manage using multiple different component libraries and maintaining a cohesive look? Is it best to build out a custom component base on top of these libraries for this?

This is part of why I'm such a big fan of the
[shadcn/ui](https://ui.shadcn.com/) package, because it's _not_ a component
library, but a set of source code that you can bring into your own app, and move
towards things that you want to use.

Outside of that, I try to pick one that's the core library, and only pull in the
parts that I need. To this end, you can fork component libraries and run your
own copies. That's not super ideal, but it's possible if you need to create
branded components in a way that breaks away from whatever your existing library
is like.

That said, a lot of my components are built on top of a set of core components.
Those core components are normally the ones from the library.

## What are the considerations for figuring out where to store data for a mobile app (what should be local storage vs. cloud based)

I default to storing things on my servers, because most users like to see their
stuff on multiple devices. Things that relate to my product, especially, or
things that other users will see almost have to be in some form of cloud
storage.

Things like user preferences, login details, and other things that are more
related to the current user's session should stay on their device, but I find
most of the time things end up on the cloud.

## What is missing from Flutter that makes React Native better for more complex/in-depth things?

The benefit I see to using React Native is not one of complexity, but that my
code is the same across my whole codebase; my backend is in TypeScript, my
frontend is in TypeScript, and my mobile app is in TypeScript. I don't think
there are features missing, but there are two other benefits:

- Most developers who are familiar with web code will feel at home in my
  codebase; JavaScript is a popular language. This is the biggest benefit when
  combined with the unified codebase.
- The code that I write maps to what runs on my browser. This is a little bit
  less true with things like TypeScript and Webpack, but is something to
  consider.

Especially with the advent of WebAssembly, I think you can write a fully capable
web and backend app using a single language. With Flutter, this even extends to
native apps, since dart has libraries like
[conduit](https://github.com/conduit-dart/conduit) for server-side stuff.

## Advice for storing environment variables for mobile apps?

Environment variables normally are used in mobile apps as build-time environment
variables:

- Expo has
  [Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- Flutter has
  [`--dart-define` and `--dart-define-from-file`](https://pub.dev/documentation/dart_define/latest/)

Generally these are read at **build** time and not runtime, since including
things like environment variables in the system's environment is not generally
possible for mobile apps, and including a `.env` file is more overhead than
exposing some constants, generally.

## What things do I need to do to make sure my website is optimized for SEO traffic?

SEO is a big topic on its own, but some pointers:

- Most search engine crawlers do not use JavaScript, so some portions of your
  site will need to either be statically or server-side rendered.
- Sitemaps are useful to crawlers because they give an easy way to see all of
  the files that are available.
- `robots.txt` files can be used to tell crawlers which files they are allowed
  and not allowed to look at
- [OpenGraph](https://ogp.me/) is being used more broadly to get metadata about
  sites, so having that implemented can be useful even outside of an SEO
  context.

## At what point does it make sense to rewrite sections of your code that aren't the most efficient or round about way of doing things?

I think
[Martin Fowler's advice on this](https://martinfowler.com/articles/workflowsOfRefactoring/#final)
is pretty good; basically, refactor when you think you're going to see a
benefit. Don't refactor just to refactor; refactor when things no longer work,
or you need to add capabilities to your code (there are a couple more reasons
listed in the link above).

"Efficiency" can also mean things that aren't working fast enough for what you
need, and in that case you should run a profiler and then work on resolving the
worst problems, but again only when performance is an issue, not just for the
sake of making things fast.

## For those using stripe for payments what are the pros and cons to using checkout versus stripe elements? Why did you choose to use a certain one?

Any thoughts from the class on this one?
