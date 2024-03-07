# Lecture 23 - Dependency Injection

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Lecture 23 - Dependency Injection](#lecture-23---dependency-injection)
  - [Announcements](#announcements)
  - [News](#news)
  - [Code Organization](#code-organization)
    - [Why should I organize my code?](#why-should-i-organize-my-code)
    - [How should I organize my code?](#how-should-i-organize-my-code)
  - [Dependency Injection](#dependency-injection)
    - [Why not a Singleton?](#why-not-a-singleton)
    - [Inject Your Dependencies](#inject-your-dependencies)
  - [Reading](#reading)
  <!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Announcements

- Assignment 2 is due tomorrow. Please contact me _in advance_ if you need more
  time / need to do an adjusted version of the assignment.
- I'm working with Tanner Linsley to do a guest lecture in 2 weeks. You should
  be there!
- Reminder to use Slack or hhenrich@byu.edu for communication for the class.

## News

- [Apple Terminates Epic Games' Developer Account](https://techcrunch.com/2024/03/06/apple-terminates-epic-games-developer-account-calling-it-a-threat-to-the-ios-ecosystem/)
- [PlanetScale Removes Free Plan](https://planetscale.com/blog/planetscale-forever)
- [Tailwind Announces v4.0 Alpha](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

## Code Organization

You're the only gatekeeper between your entire codebase living in one file, and
being impossible to understand (or merge with other branches) without
understanding everything. I've seen a few codebases like that in my time; I've
written a few codebases like that, even.

### Why should I organize my code?

A better way of asking this question is "why should I have standards about where
my code should live"? In my opinion, there are a variety of reasons, including:

- Makes it easier to identify code that is ideal for refactoring (it depends on
  too many things or is too heavily depended on)
- Defines clear boundaries for responsibilities
- Makes it easier to create smaller units of logic We're going to spend most of
  the time on that last one today, but the other reasons are valuable and
  useful, too.

### How should I organize my code?

I propose a fairly straightforward _model_, pun intended:

- Create a view layer that manages anything to do with displaying data. Any
  components, and code that relates to components belongs here.
- Create a model layer that holds any operations you do on your underlying data.
- Create a data layer (sometimes I call it my `db` layer) that holds any
  operations you need to create, read, update, and delete data, and the code you
  need to call to do so. Most of your application code will fit into these
  categories, and generally they should depend downwards; view depends on model,
  model depends on data. This prevents you from finding a more efficient query,
  or otherwise changing the structure of low-level data, and ending up needing
  to change a lot of higher-level data at the same time.

As a codebase grows, I find that it makes sense to make things more granular,
but at that point hopefully you have enough data that it's clear where the next
ideal separate layers or sublayers are.

For example, lets say I'm building a blog site for myself.

- I have a component that I use to render a comment – that belongs in the View
  layer.
- I have a class that does a query against my database for posts – that belongs
  in my data layer.
- I have a class that represents a post and the operations that can be done to
  it – that belongs in my model layer.

Now for a couple trickier examples; where should these go?

- A frontend client to a backend endpoint? – That's a trick question; it belongs
  in either the View or Model layer, depending on which portions of your
  codebase live on which end.
- A job that scans for entities in my database that are marked as deleted and
  should be fully deleted after some number of days of being "really" deleted? –
  Probably on the Model layer, calling into the Data layer, but that depends a
  lot on implementation.

Depending on the technologies you're using, the model and data layers may be
blurry. In Django, for example, the model classes that represent your data are
the same ones that set up the table and query structure in your database.

The important part is that there's separation here between logical units; I
don't want all of my database queries in one file, or many duplicated queries
scattered through tens or hundreds of endpoints. But now that everything's all
split up, how do I actually use these small pieces? That's where Dependency
Injection is useful.

## Dependency Injection

I first heard about DI 8 years ago while I was trying (and failing,
spectacularly) to write a Minecraft plugin. Someone introduced me to the term,
and I was able to fix my issue, but I didn't really understand the principle
until much later in my software engineering career.

Dependency Injection is the idea that instead going out and getting what you
need to do whatever is needed, instead you ask nicely for it. Here's a
relatively simple example:

```java
public class Authenticator {
	protected UserRepository userRepo;

	public Authenticator() {
		this.userRepo = new UserRepository(new DatabaseConnection());
	}

	public boolean isAuthenticated(String cookie) {
		try {
			var user = this.userRepo.getUserByCookie(cookie);
			if (user == null) {
				return false
			}
			return user.cookieExpiration > System.currentTimeMillis();
		}
		catch (ConnectionError error) {
			return false;
		}
	}
}
```

In this class, I'm constructing my own instance of a UserRepository and a
DatabaseConnection that I use. If I need to use some other kind of
UserRepository (perhaps a mock version that I can use for tests, rather than
connecting to the database), I need to extend this class and use that instead.
While this works, there are problems here:

1. In order to change the functionality, I need to extend the class.
2. If the same Cryptography is used elsewhere, I'm wasting memory by keeping
   multiple instances of it around.

### Why not a Singleton?

One solution might be to make my UserRepository a singleton, and just use that
instance instead, right?

```java
public class Authenticator {
	public boolean isAuthenticated(String cookie) {
		try {
			var user = UserRepository.INSTANCE.getUserByCookie(cookie);
			if (user == null) {
				return false
			}
			return user.cookieExpiration > System.currentTimeMillis();
		}
		catch (ConnectionError error) {
			return false;
		}
	}
}
```

It certainly simplifies the code, but the problem is that now we have what
amounts to a global variable, and we still haven't solved the problem of changes
to functionality very well. Java does okay at preventing global variables, but
other languages don't do as well and can make things even worse than this.

For example, In JavaScript I've written this at the bottom of a file:

```ts
let instance: Harbinger;
export function getInstance() {
  return instance;
}
```

Which is just a global variable with extra steps, because I can only change its
value from within this file.

### Inject Your Dependencies

I feel like I've beaten around the bush enough; what if we did this instead?

```java
public class Authenticator {
	protected UserRepository userRepo;

	public Authenticator(UserRepository userRepo) {
		this.userRepo = userRepo
	}

	public boolean isAuthenticated(String cookie) {
		try {
			var user = this.userRepo.getUserByCookie(cookie);
			if (user == null) {
				return false
			}
			return user.cookieExpiration > System.currentTimeMillis();
		}
		catch (ConnectionError error) {
			return false;
		}
	}
}
```

Another name for this is Inversion of Control, which I feel is accurate. My
class is no longer in control of what it needs, which makes it far easier to
write more flexible code.

We'll go through
[this example](https://github.com/hhenrichsen/kotlin-dependency-injection-example)
in class.

## Reading

- **Read:**
  [CSS Tricks: Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- **Read:**
  [CSS Tricks: A Complete Guide to Dark Mode on the Web](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
- **Watch:** [Steve Schoger](https://www.youtube.com/@SteveSchoger) – pick at
  least one of his videos and see what you can learn.
- **Skim:**
  [Khoirul Abdul Aziz: Responsive Across All Devices](https://bootcamp.uxdesign.cc/responsive-across-all-devices-an-incredible-guide-to-responsive-ui-ux-design-7d710eddc9c8)
- **Skim:** [Designary Archive](https://blog.designary.com/archive?sort=top) –
  see if there are any UX tips that pique your interest.
