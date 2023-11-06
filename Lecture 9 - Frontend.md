<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with
[DocToc](https://github.com/thlorenz/doctoc)_

- [News and Housekeeping](#news-and-housekeeping)
- [Lecture 9 - Frontend](#lecture-9---frontend)
  - [Parts of the Frontend](#parts-of-the-frontend)
    - [Before we Start](#before-we-start)
    - [Frontend Frameworks](#frontend-frameworks)
      - [The Original Ones](#the-original-ones)
      - [The Popular Ones](#the-popular-ones)
      - [The New Ones](#the-new-ones)
    - [Component Libraries](#component-libraries)
    - [CSS Frameworks](#css-frameworks)
    - [Bundlers and More](#bundlers-and-more)
      - [Bundlers](#bundlers)
      - [Other Tools](#other-tools)
      - [Build Steps](#build-steps)
  - [Hunter's Crash Course in Design](#hunters-crash-course-in-design)
    - [Start with Features, Not Layouts](#start-with-features-not-layouts)
    - [Information Architecture](#information-architecture)
    - [Design System](#design-system)
    - [Responsive Design](#responsive-design)
    - [Parallel Structure and the Gestalt Rules of Grouping](#parallel-structure-and-the-gestalt-rules-of-grouping)
    - [Designing for Readability](#designing-for-readability)
    - [Study Prior Art](#study-prior-art)
  - [Demo: UI Design for a List](#demo-ui-design-for-a-list)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## News and Housekeeping

- Check-in 2 will be optional, and can be used to replace a missing attendance
  or the initial check-in. You already get 2 free absences, but if you have more
  than that this is one way to raise that score. This is the last week to do
  this.
- Check-in 3 will be starting up next weeks. Due to holidays and such,
  availability may be limited during some weeks in November -- please expect to
  come in earlier and talk about what you've built and learned so far this
  semester.
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

# Lecture 9 - Frontend

## Parts of the Frontend

One resource I found that's worth looking at is the
[State of JS survey](https://2022.stateofjs.com/en-US/) – it's a good way to get
a handle on what's currently popular, discover new tools that other people are
using, and just generally see how things are trending.

### Before we Start

Each of these things has some amount of "magic" and learning involved to make
them work well for you.

### Frontend Frameworks

_Frameworks are how you build webpages that respond to outside data and user
input. Many of the frontend frameworks are now moving towards SSR which allows
you to also use server information and generate the page even if the user is not
using JavaScript, depending on the implementation. There are so many of these._

#### The Original Ones

- **[Vanilla JS](https://vanilla.js.org/)**–The web has become much more
  cross-compatible nowadays than it was 5 or 10 years ago. The JavaScript built
  into each browser is now more than enough to build pages that respond to
  changes, whether user-initiated or remote.
- **[jQuery](https://jquery.com/)**–Before the web had good, cross-browser
  support for DOM manipulation and AJAX requests, jQuery was the way to do these
  things. It's still used on some sites, so is worth mentioning.

#### The Popular Ones

- **[React](https://react.dev/)**–React is one of the most popular frameworks
  currently. My theory for why it's more popular than Vue or Angular is that
  there are many ways to do things in React, and it's fairly un0pinionated in
  how you set things up. For example, in Next.js, there are 4 different ways to
  load CSS! This lets you use what makes sense to you in your codebase.
- **[Vue](https://vuejs.org/)**–Vue is a bit more opinionated than React, and
  I've found that it's a good entrypoint to web frameworks if you've never
  worked in one before. [Nuxt](https://nuxt.com/) is Vue's counterpart to
  Next.js.
- **[Angular](https://angular.io/)**–Angular is one of the most opinionated
  frameworks out there. Angular has concepts like structural directives: if you
  don't like the way that `*ngIf` works, write your own. It enforces separation
  of files between HTML, CSS, and JS. It supports SSR via
  [Angular Universal](https://angular.io/guide/universal). I have found than
  Angular works best for larger codebases where standards are required; Angular
  includes many of them that make sense, where in Vue or React you would have to
  write, set, and enforce standards on your own. That said, that overhead
  doesn't make as much sense outside of an environment with many engineers where
  those standards are needed.

#### The New Ones

- **[Svelte](https://svelte.dev/)**–Svelte is a newer framework that has taken
  some of the learnings from React, Vue, and Angular. It has a lot of cool built
  in utilities.
- **[HTMX](https://htmx.org/)**–HTMX adds a bunch of utilities to the HTML of a
  page, rather than using JS to write the HTML. It expands the available REST
  verbs, allows using websockets, and facilitating animations without writing
  any JS on the client.
- **[Qwik](https://qwik.builder.io/docs/)**–Qwik is built around only loading
  what's needed first, allowing you to get pages that paint and become
  interactive easily. Instead of hydration (downloading and executing component
  code for the current page), Qwik markets that it "resumes" the page instead,
  only loading what's required when the user asks for it.
- **[Lit](https://lit.dev/)**–Built on WebComponents, Lit is a framework that
  helps you use WebComponents to build sites without much overhead.
- **[Alpine](https://alpinejs.dev/)**–A small, lightweight alternative to larger
  frameworks like Angular, React, and Vue.

### Component Libraries

_Component libraries are the primitives used to build an app, and generally run
on top of a framework. I recommend using one, since most of them come with
automatic accessibility benefits, as well as save you time reinventing the
wheel._

- **[Radix](https://www.radix-ui.com/)**–A set of primitive components that can
  be used to build most user interfaces.
- **[Shadcn](https://ui.shadcn.com/)**–Radix with Tailwind, and more. Instead of
  installing their components as packages, they add the components to your
  project for you to use and edit as you like. I'm pretty fond of that approach.
- **[Material](https://mui.com/material-ui/)**–Most of you have seen this
  component library. It's the one that drives the Google design system, and is
  used in many apps even beyond Google's own apps.
- **[WebComponents](https://www.webcomponents.org/introduction)**–WebComponents
  are really cool, since they work without a framework and allow for building
  reusable components without needing the overhead of a framework. I think this
  is worth mentioning, although these are a bit tricky to get working.
- **[DaisyUI](https://daisyui.com/)**–A library built on top of tailwind that
  works to also reduce the number of classes one must stack to get a desired
  result.

### CSS Frameworks

- **[Tailwind](https://tailwindcss.com/)**–Tailwind is an interesting tool that
  allows you to quickly make changes to the style of components without needing
  to change a CSS file. It makes a lot more sense if you understand what CSS the
  classes are going to be writing, but it's a useful tool if you want to quickly
  prototype things. I find that it also makes my HTML code way harder to
  understand at a glance (and can bloat the size of the document sent to users
  if I'm not careful), but the CSS can be hidden into classes and such to help
  alleviate that once I'm done prototyping.
- **[UnoCSS](https://unocss.dev/)**–A faster implementation of Tailwind with
  some extra features like
  [Attributify Mode](https://unocss.dev/presets/attributify#attributify-mode)
  which can deal with some of the readability concerns of Tailwind, to a degree.
- **[PicoCSS](https://picocss.com/)**–A tiny CSS framework that comes with a
  bunch of modern default styles for builtin components, rather than utilities
  to write your own styles.
- **[Open Props](https://open-props.style/)**–Similar to Tailwind, but instead
  using CSS variables that can be mixed in to an existing CSS file.
- **[PureCSS](https://purecss.io/start/)**–Another small collection of CSS
  utilities for common things like layouts, forms, and buttons.
- **[Bootstrap](https://getbootstrap.com/)**–Most of your have seen this CSS
  library before. Lots of websites have used Bootstrap to get a base set of
  styles, such as for menus, buttons, and layouts.
- **[Bulma](https://bulma.io/)**–Sometimes called "modern bootstrap", a
  collection of CSS utility classes to help you with some of the fundamentals of
  a website.

### Bundlers and More

#### Bundlers

- **[Webpack](https://webpack.js.org/)** – Webpack is one of the original
  bundlers. It tends to require a lot of setup to get right, but some other
  packages (like Next.js) have started shipping with reasonable defaults for
  Webpack. This is why when configuring Tailwind, some files are required to
  stay as `.js` files, but some can be `.ts` files; webpack has an expectation.
- **[Rollup](https://rollupjs.org/)** – Rollup is the bundler behind Vite, and
  has much more reasonable defaults. I have added an empty rollup config to some
  of my other projects, and had it just work. It's a bit more modern and usable
  than Webpack, I've found.

#### Other Tools

- **[Speedy Web Compiler](https://swc.rs/)** – can take the place of Babel and
  some other tools, depending on your needs. Implemented in Rust, so can be much
  faster than other JavaScript tools.

#### Build Steps

- **[Babel](https://babeljs.io/)** – Babel allows you to compile your JavaScript
  into JavaScript, with additional rules. Using some of the below tools, this
  means dealing with differences between browsers, supporting new features, or
  allowing special types of syntax (like decorators). Babel can be its own
  bundler, but is generally a step in another bundler's toolchain.
- **Browserlist / Polyfills** – Polyfills allow you to support newer JavaScript
  features on older browsers by adding implementations of those features to your
  runtime environment.
- **Minification / Uglification** -- One way to speed up your website is to
  reduce the amount of data that a user has to download. Minification strips
  whitespace, variable names, class names, etc. and turns them into as small a
  file as possible. It also makes it very hard to read or debug, so this is
  generally only done for production.

## Hunter's Crash Course in Design

We will be working with
[this CodePen](https://codepen.io/hhenrichsen/pen/XWONLEy) as I go over this
section in class, but feel free to read through this section and then jump back
to the CodePen.

### Start with Features, Not Layouts

_From [Refactoring
UI_](https://designary.com/tip/spacing-systems-and-scales-ui-design/)

When starting on a feature, it's easy to fall into the trap of "what should this
all look like?", when instead you should focus on building just what's required
for that feature. You can iterate and ask what things should look like once you
have functionality.

### Information Architecture

The core of good design is information architecture. Not all elements on a page
are equal. Each page generally has a primary piece of information, and some
number of secondary and tertiary pieces of information.

Your design should reflect this. Primary information should be the most
emphasized and easiest to find. Some should be de-emphasized. Color, weight, and
size are easy ways to do this. You can also hide elements in each other, to
remove the amount of secondary or tertiary information, and make it easy for
your users to find the most important info.

### Design System

_From
[Designary](https://designary.com/tip/spacing-systems-and-scales-ui-design/)_

One of the benefits that using Tailwind gives you is the fact that it gives you
a built-in design system. A design system generally revolves around a pixel
grid; normally 4px or 8px. Spacing, images, sizes of elements, images, etc. are
all sized around that grid. The full system doesn't need to be defined in
advance, but should be decided on eventually.

### Responsive Design

One way of "take as much space as is needed" is not hardcoding widths, heights,
and the such. Setting boundaries at breakpoints tends to work well via
`min-width` and `max-width`, but content will generally resize to take up what's
in its children.

Responsive Design generally falls under the mental model of "my site supports
mobile", but building a truly responsive design will mean that your site will
work on the 1:1 square monitor, a mobile phone, and a 32:9 ultrawide monitor
without needing specific breakpoints.

Your content should be designed to squish elegantly, and if it no longer fits,
it should either render a different version, or no longer show.

### Parallel Structure and the Gestalt Rules of Grouping

Parallel structure is an idea from writing: sentences and paragraphs that
accomplish the same idea (list items in a sentence, new supporting ideas, or new
paragraphs) should each follow the same structure to help your reader
intuitively understand what is happening in a paragraph.

Similar is the Gestalt Rules of Grouping: things that take the same structure or
appear close together are psychologically grouped.

This idea comes pretty intuitively from components; you should build components
for ideas, and then use those wherever that idea occurs. Information that is
relevant to other nearby information should be placed near to that information.

### Designing for Readability

Lots of web content is based around text. You should make sure that your text is
readable. There are lots of different implementations about this, but the
general guideline is that text should be no wider than 50-70 characters wide:

- https://winterpm.com/#
- https://www.researchgate.net/publication/234578707_Optimal_Line_Length_in_Reading--A_Literature_Review
- https://designary.com/tip/the-optimal-text-line-length-for-readability/

I also like to apply this concept to other things as well. Users respond better
to taking as much space is needed, rather than using all of the available space.

### Study Prior Art

Some ideas have become fairly canonized in design. Looking at others' designs is
a good way to find what is working and what is not working.

Here are some places that I like to look for ideas if I'm not 100% sure how to
build a UI:

- [Collect UI](https://collectui.com/)
- [UI Garage](https://uigarage.net/)

A lot of these tend to be really pretty / overdesigned, however. Remember my
first point: start with the feature, not with the design.

## Demo: UI Design for a List

Here's a little Vue app that lists some blog posts. It's not very pretty:

```html
<script type="module">
  import { createApp } from "https://unpkg.com/petite-vue?module";
  createApp({
    posts: [
      {
        title: "Testing API Routes in the Next.js 13 App Router",
        date: "Nov 1 2023",
        rating: 4.3,
        content:
          "While I was first getting started in Next.js, I wasn't able to find any details about how to unit test Next.js API routes...",
        readingTime: "3 Minutes",
        imageUrl:
          "https://images.unsplash.com/photo-1698094276298-92b21f2df7f9?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        title: "Deploying Motion Canvas Animations to GitHub Actions",
        date: "Nov 4 2023",
        rating: 4.6,
        content:
          "Start by creating a new node project at the root of your repo and install some dependencies:...",
        readingTime: "5 Minutes",
        imageUrl:
          "https://images.unsplash.com/photo-1688716332896-1a8d510030af?auto=format&fit=crop&q=80&w=2487&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  }).mount("#app");
</script>

<main id="app">
  <div v-for="post in posts">
    <img v-bind:src="post.imageUrl" />
    <div>
      <div>{{ post.title }}</div>
      <div><span>Date:</span> {{ post.date }}</div>
      <div><span>Average Rating:</span> {{ post.rating }}</div>
      <div><span>Reading Time:</span> {{ post.readingTime }}</div>
      <div>{{ post.content }}</div>
    </div>
  </div>
</main>
```
