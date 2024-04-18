# Lecture 24 - Responsive Design

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Announcements](#announcements)
- [News](#news)
- [Follow-Ups](#follow-ups)
  - [Analytics](#analytics)
  - [Site Performance](#site-performance)
  - [OOP vs Functional](#oop-vs-functional)
- [Responsive Design](#responsive-design)
- [Assignment 3](#assignment-3)
- [Next Time](#next-time)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Announcements

- Tanner Linsley is doing a portion of the lecture next week. You should be
  there, and please help me get other people who generally don't come to class
  there, too.
- Reminder to use Slack or hhenrich@byu.edu for communication for the class.
- We'll be starting final check-ins after next week. Please come in early, as
  hours near the end of the semester may be limited.

## News

## Follow-Ups

### Analytics

> What is the best way to run analytics on a webapp. Google Analytics? Build
> your own event trackers into your code? Compare and contrast options please.

This feels a little bit like a ChatGPT prompt 😅

There are lots of third party solutions to this:

- PostHog – recordings, click tracking, and custom events
- HotJar – recordings and click tracking
- Google Analytics – click tracking

You can also build your own. The tradeoffs generally are:

- How much work you have to do to build it
- What features and data you need to build (tracking click elements? easy, table
  with two columns; recording user sessions and anonymizing them? hard, probably
  not worth doing on your own)
- How much it costs to run your own vs pay someone else to run and develop
  theirs

### Site Performance

> What is the best way to monitor site performance and determine if improvements
> need to be made. Are there benchmarks to go by?

What ways to monitor:

- [Google Lighthouse](https://github.com/GoogleChrome/lighthouse) automation –
  tracks time to first paint and other significant user metrics. This can be a
  part of your build pipeline.
- Performance tests – operations (especially UI tests) that should complete in a
  certain amount of time, and fail if they don't.
- Chrome Devtools Profiler – see where your code is going slowly and what it's
  spending time on. This should be used to diagnose potential issues. You can
  also add
  [Server Timing headers](https://ma.ttias.be/server-timings-chrome-devtools/)
  that can be interpreted by the network tab for you.

### OOP vs Functional

> Pros and Cons/When To Use OOP vs Functional Programming vs etc.

I don't take a hardline stance on this one; my favorite language is Kotlin which
lets me pick my favorite paradigm and use it where it makes sense, but doesn't
force one on me. I think using the right paradigm in the right place can lead to
much more readable code, and I try to learn a bunch of paradigms so I can use
them where they make sense.

I find functional is really good for working with immutable data, especially on
mathematically complete types like lists, options, and errors (I'm trying really
hard not to say the
[M-word](<https://en.wikipedia.org/wiki/Monad_(functional_programming)>) here,
but I'm legally required to link it).

I find OOP is really good for working with and organizing data, and
encapsulating functionality into services that operate on that data.

I find data-driven (think an entity component system) is really good for working
with consistent data quickly.

Use what's readable and makes sense for your use case. It's not a holy war when
you no longer have to pick just one (coming from a guy who uses neovim in
VSCode).

## Responsive Design

Most of responsive design comes down to two things:

- Instead of setting fixed sizes, setting boundaries (especially for widths)
- When content doesn't fit anymore, hide it or move it elsewhere

## Assignment 3

We'll be working out of
[this repo](https://github.com/hhenrichsen/blog-data-example).

## Next Time

- Tanner Linsley -- please show up!
