# Lecture 22 - Q&A Session 4

## Announcements

- HackUSU is tomorrow, I'm looking forward to seeing some of you there.
- Assignment 2 is due next week!

## News

## Security Crash Course

### Authorization and Authentication

Authentication and Authorization are two very different things. Authentication
is a user being able to prove they are who they say they are, usually via one or
more of a set of factors:

- Something they have
- Something they know
- Somewhere they are

Authorization is being able to take a user and see if they have access to a
given resource or operation. Authorization issues get more complex and insidious
as your access model gets more complex. If users only have their data, the
checks are easy – is the owner making the request? If so, they have access. Say
things get more complex: users can now share their data with other users. Now I
need to check a couple places to determine if someone has access.

### Auditability

Another factor of security is auditability. If I discover that someone has been
accessing my server in a way that they shouldn't have access to, ideally I have
records that I can use to determine exactly what they were able to access, and
then create a mitigation plan.

### Server Authority

Anything that the client has control over can (and will) be exploited. If your
client has access to all of your data without restriction, a user exists who can
and will try to get all of the data they can.

This also means that any security-critical (as well as business critical)
operations should be cleared and enforced by the server, especially in
environments where users might interact with each other or each other's data.

### Security by Obscurity

Which of these is easier to guess?

- `GET mycool.app/requests/33`
- `GET mycool.app/requests/33?access_token=5801a305-2ac9-40da-9d2b-cf783c42004e`
- `GET mycool.app/requests/166112eb-579e-42cd-96e8-f92f5c76ca1b?access_token=9c25e6e5-fc56-422a-a66c-a0b87b4288dd`

If you're going to be distributing links or other things that need to be
available to the public, your best bet is going to be making them hard to guess.
Any resource that is public should not be using an auto-incrementing ID, and if
there's an expectation of privacy from your customers it might be best to stack
2 UUIDs, one as the resource identifier and one as a public access token.

UUIDs aren't the only option here, either. JWTs can be used in interesting ways
to ensure that data hasn't been tampered with via encryption.

### Rate Limiting

Another way you can mitigate bad actors is rate limiting important routes. A
general way is limiting requests per IP in a certain timeframe, but this is a
fairly solved problem so many different approaches exist. You don't want people
bruteforcing passwords (or resource IDs) without some measure of prevention.

There are some hilarious ways of doing this; for example, marking someone who is
clearly bruteforcing and giving them errors even when they are successful, or
artificially slowing down each request they make. Anything you can do to induce
frustration into bad actors goes toward added security.

##

## Reading

- **Read:**
  [Dependency Injection: Principles, Practices, and Patterns](https://livebook.manning.com/book/dependency-injection-principles-practices-patterns/chapter-1)
  (or on
  [Google Books](https://www.google.com/books/edition/_/zzczEAAAQBAJ?hl=en&gbpv=1))
  – try reading Chapter 1 if you can find it for free.
