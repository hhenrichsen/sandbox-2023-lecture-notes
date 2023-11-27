<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with
[DocToc](https://github.com/thlorenz/doctoc)_

- [Pre-Lecture](#pre-lecture)
  - [News and Housekeeping](#news-and-housekeeping)
  - [Lecture 11 Follow-Up](#lecture-11-follow-up)
- [Lecture 12 - Mobile, State Management](#lecture-12---mobile-state-management)
  - [Native vs Hybrid vs Web](#native-vs-hybrid-vs-web)
    - [Access](#access)
    - [Experience](#experience)
    - [Effort](#effort)
    - [Market / Use Case](#market--use-case)
  - [App Stores](#app-stores)
    - ["Bug Fixes and Small Improvements"](#bug-fixes-and-small-improvements)
    - [Standard Requirements](#standard-requirements)
  - [Electron, React Native, Flutter, and Native](#electron-react-native-flutter-and-native)
    - [Electron](#electron)
    - [React Native](#react-native)
    - [Flutter](#flutter)
    - [Pure Native](#pure-native)
  - [React Native Tools](#react-native-tools)
  - [State Management](#state-management)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Pre-Lecture

## News and Housekeeping

- Check-in 3 has started. Please expect to come in earlier and talk about what
  you've built and learned so far this semester.
- I owe some of your participation points; I need to do better about asking for
  your names if I don't know them yet. If you have asked one or both of your
  questions already and don't see points in Learning Suite for it yet, please
  come talk to me after class or shoot me a slack message.
- Please make sure you are tracking your attendance in Learning Suite. Some of
  you have not recorded any attendance yet.
- Because Check-In 3 is how I assess the "App Progress" grade, it is mandatory.
  You have a full month to do it. Because I have to submit grades after Check-In
  3 closes, not coming to check in means 65% of your grade can't be submitted. I
  don't want to have to do that.

## Lecture 11 Follow-Up

- Any specific questions or things you want to talk about with this group after
  the more mixed class last time?

# Lecture 12 - Mobile, State Management

## Native vs Hybrid vs Web

We covered this last time, but I'd like to go into a little more depth focused
on engineering. One good question to think about when thinking about a Mobile
app is what kind of app you need. I think this comes down to a couple things:
access, experience, effort, and market.

### Access

I think the biggest factor when deciding if I should add a native component to
any project is "do I need native access to accomplish this?" If I'm talking to
hardware types that don't have good cross-platform support (pretty much anything
that isn't a camera, microphone, or file browser, although there are some cool
ongoing efforts to support more hardware access on the web), I probably need
some kind of native app.

Native apps aren't just mobile apps, either. I use native apps for most of the
things I do; VSCode, Obsidian, IntelliJ, my terminal emulator, Steam, etc. are
all native apps. Some of these touch on one other thing that you sometimes need
access to: performance. Running things on the web or a hybrid environment means
taking a performance hit for the indirection.

I think the Speedy Web Compiler is an interesting example of this; they claim
they found 30x speed increases by using native (Rust) code that is compiled for
the users' individual machine types, rather than using a more cross-platform
language that runs everywhere (Node.js). When native memory management and
processor use is important, it might make sense to lean more towards native and
even native compiled code.

### Experience

Another important factor is how my app looks and feels. A web app will feel and
respond very differently to different circumstances. For example, on a webb app
unless I'm using a PWA or other native-like technologies, losing network
connectivity will mean that I lose the entire user interface on a web app. On a
mobile app I still get rendering and interactivity, but instead might see error
states instead when the network goes away.

On mobile, I also get a set of components that have been used in many of the
hundreds of apps that my user has used on that platform for free. Things like
switches and buttons have a distinctive look and feel on iOS and Android, and
that's hard to replicate in a web app. In a web app I have to design
intentionally to make things work intuitively (although we also have the
benefits of things like component libraries that can help in this regard).

### Effort

Sometimes the answer to the above costs and benefits is "why not do both?" and
while I think that's an appropriate response when you have the engineering
effort to invest into both, it can also be a footgun while still trying to get a
project off the ground.

Generally including both a mobile app and a web app, or a hybrid app and a web
app means maintaining two codebases, even if there is a significant amount of
code shared between them. Using the right technologies can alleviate this, but
it makes every part of the development process more difficult:

- **Deployment:** You now need to manage the backend in such a way that the
  frontend and the mobile app can be using different versions of the API,
  because you can deploy the frontend when you want to, but you are at the mercy
  of app stores to deploy the mobile app.
- **Development:** You now need to manage both a local web development
  environment as well as a local emulator environment for the native code, and
  make sure that development tooling works for both.
- **Dependencies:** Mobile apps tend to be more particular about which versions
  of dependencies are built for which versions, which can make package
  management more difficult. Depending on how you set it up, you may have
  different sets of features allowed in different environments and need to
  develop against the lowest common denominator.

There are technologies that can help with these, but those are also additional
"magic" complexity in your project that you need to setup and maintain.

### Market / Use Case

Sometimes, your market or use case will mean that a mobile app makes more sense,
or a web app makes more sense, or a desktop app makes more sense. This should be
a part of your validation process. You may find out that some of your potential
clients are still stuck on IE11, and have to develop with the set of features
that are available there.

Many startups will shoot for an iOS app as their first app because those users
tend to be wealthier, even if they don't make up the larger market share.

## App Stores

App stores are wonderful for getting your app out there, but they also come with
rules, requirements, and often will be interested in taking a portion of
whatever sales you make to users on those app stores.

App stores also set guidelines and have a review process, which gives many users
the assumption that mobile apps on the app store are higher quality than
websites, where anyone can publish a website. This is where the sentiment that
there are no viruses on the app store(s) comes from, but does not prevent people
from uploading malware to the app stores.

### "Bug Fixes and Small Improvements"

I mentioned this offhand last time; one of the reasons that you will frequently
see "Bug Fixes and Small Improvements" frequently as the update notes in the app
stores is that this tends to not trigger a full review, and helps to get updates
out there faster. I've seen mixed results with this; it seems like the larger
apps on the store have dedicated reviewers and will have more leeway on this
than a brand new app which can take more time regardless.

### Standard Requirements

These are some things that I've seen in my experience publishing things to the
app store, as well as heard from others who have tried to publish apps. Apple
tends to be more stringent on these than Google:

- If your app allows users to communicate with each other, your app will also
  need to allow users to block other users.
- If your app allows signing in with other third parties, the app store version
  normally will require that they be one of the allowed third parties
- Screenshots in the app store should be up to date, and updated when you submit
  new versions.
- Placeholder features or text should not be in published versions of apps.
- Other app stores / platforms shouldn't be mentioned.
- App functionality -- the app shouldn't just be a web view to your web app, but
  should have dedicated functionality.

## Electron, React Native, Flutter, and Native

This section isn't a definitive list (and might not warrant going through in
class), but I thought it would make sense to talk about some of what's out there
in terms of mobile frameworks and code sharing.

### Electron

**Language:** JavaScript **Targets:** Desktop, Mobile **Backer:** OpenJS

[Electron](https://www.electronjs.org/) is a controversial start to this
section, but I figured that it would be worth mentioning since it runs many
popular desktop and mobile apps:

- [Slack](https://slack.engineering/building-hybrid-applications-with-electron/)
- Spotify
- [Discord](https://twitter.com/discord/status/822874230631100416)
- Obsidian
- VSCode
- Atom
- and many, many more.

Why is it popular? Why is it controversial? Because it's running a whole
instance of Chromium under the hood to run the app, which makes it less
effective, at least resource-wise, than a web app. That said, Electron gives you
some utilities allowing you to run a backend-type service under the hood to deal
with things like native calls and code, while still giving you all of the
features of a reasonably modern browser.

That said, some of the teams have moved from Electron to other libraries where
it makes sense.
[Discord has an interesting blog post here about their native apps and why they are using our next framework, React Native](https://discord.com/blog/why-discord-is-sticking-with-react-native).
[And another one here about the benefits they saw once they brought that to Android](https://discord.com/blog/android-react-native-framework-update).

### React Native

**Language:** JavaScript **Targets:** Mobile **Backer:** Meta

[React Native](https://reactnative.dev/) is my favorite library for writing
mobile apps, at least coming from a web background. It benefits from the
popularity of the React ecosystem, and allows you to share some of your code
between web and native while still getting the native benefits. In addition, you
can share code between mobile platforms, allowing you to develop features fewer
times.

Part of the reason that I'm as big a fan of this as I am is that I can use the
same language for my entire project by using React Native. My backend can run on
Node.js, my web app runs on JavaScript, and my mobile app runs on React Native.
That means that if I set up my projects right, I get code sharing without too
much effort, and that's huge. There are other approaches similar to this like
[Kotlin/JS](https://kotlinlang.org/docs/js-overview.html), (or an interesting
[Django -> TypeScript generator](https://remaster.com/blog/typescript-types-from-drf-serializers))
but few of those have the same scope that React Native does.

### Flutter

**Language:** Dart **Targets:** Web, Desktop, Mobile **Backer:** Google

[Flutter](https://flutter.dev/) came out around the same time that React Native
did. It uses a C-style language called Dart , and can create web, desktop, and
mobile apps all in the same language. I think this is my second favorite
approach because your entire frontend is in the same language, and then all you
need to deal with is communication with your backend services.

This framework moves fast, which can be to your benefit or detriment. Guides
that worked a few years ago don't work anymore, because things that those guides
used have been deprecated and removed.

### Pure Native

**Language:** Varies **Targets:** Desktop, Mobile **Backer:** Varies

Sometimes it makes sense at a large enough scale to develop native apps for each
platform, or to exclusively publish on one platform. If you want to utilize all
of the features that that platform gives you, it might make sense to write it
all natively. Kotlin and Swift are both capable languages for writing apps, and
come with years of tooling.

## React Native Tools

I've talked about these in our check-ins, but I figured it might make sense to
put them here as well:

- [Expo](https://expo.dev/) - a set of tools for react native development,
  including talking to emulators, building for production, and more.
- [Solito](https://solito.dev/) - React Navigation + Next.js code sharing
- [Tamagui](https://tamagui.dev/) - UI library and tooling to make React and
  React Native work together without much additional work. Also has some
  interesting optimizations that are worth looking into.
- [Nativewind](https://www.nativewind.dev/) - Tailwind but React Native.
- [T4 Stack](https://t4stack.com/): similar to Theo's T3 stack, except a bit
  more native inclusive and features some interesting choices by default.

## State Management

There are a couple approaches to state management that I've seen.

- Stateless, where you build endpoints that give you all of the information you
  need to render. You can cache this information for some amount of time. I
  would start here if possible.
- Jotai / Signals, with atoms and derived values.
  [Angular](https://angular.io/guide/signals), and
  [Motion Canvas](https://github.com/motion-canvas/motion-canvas) use this
  approach. Lucid uses a combination of this, and Injectables. If you need state
  that jumps beyond many components and doesn't work passing around props, I
  would use this next.
- Redux / Zustand style, with stores for specific types of information and
  picking specific information from here. There are two sub-approaches here as
  well, one being a store that contains the full application state, and one
  where multiple stores are used for unrelated information.
- Injectables, where an injected client-side model layer (made up of classes
  that contain one or more signals) owns the document state. This is more useful
  when your frontend is deep and complex. I've found this one doesn't work super
  well with Next.js, since its goal is to keep things sparse and just related to
  what you want on the one page you're loading.
