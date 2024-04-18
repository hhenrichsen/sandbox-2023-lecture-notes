# Lecture 28 - The Bonus Episode

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Q&A Stuff](#qa-stuff)
  - [How Do You Make an App Usable without Internet but Still Synchronize Data across Devices?](#how-do-you-make-an-app-usable-without-internet-but-still-synchronize-data-across-devices)
    - [Peer To Peer](#peer-to-peer)
    - [Saving Work Offline](#saving-work-offline)
  - [Best Resources to Automatically Test Your Code for Security Vulnerabilities?](#best-resources-to-automatically-test-your-code-for-security-vulnerabilities)
  - [Is there a Best way to See how much of Your Ec2 Instance You're Using?](#is-there-a-best-way-to-see-how-much-of-your-ec2-instance-youre-using)
  - [Most Common Startup Dev Mistakes and how to Avoid Them](#most-common-startup-dev-mistakes-and-how-to-avoid-them)
    - [Letting Perfect Be the Enemy of Good](#letting-perfect-be-the-enemy-of-good)
    - [Making Decisions Without Signal](#making-decisions-without-signal)
    - [Not Automating Enough](#not-automating-enough)
  - [What is the Best Resources for Crafting Privacy and Security Policies?](#what-is-the-best-resources-for-crafting-privacy-and-security-policies)
  - [How Do I Stay up to Date with Security?](#how-do-i-stay-up-to-date-with-security)
  - [Courses and Resources](#courses-and-resources)
  - [Interactive](#interactive)
- [Personal Stuff](#personal-stuff)
  - [Getting in Contact](#getting-in-contact)
  - [What's next for Me?](#whats-next-for-me)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Q&A Stuff

### How Do You Make an App Usable without Internet but Still Synchronize Data across Devices?

I interpet this two ways. Both of them have shared core pieces:

- Any functionality should support both a local storage backend as well as a
  remote storage backend. Queues, local databases, and lists of actions to
  perform are some common actions here, especially with a pattern like the
  [Command](https://refactoring.guru/design-patterns/command).
- Failing to make remote requests should not crash or otherwise break the app.
  Failed requests can be a queueing mechanism for data that should be synced in
  the future.
- Generally, a way to resolve conflicts is good. Most single-user data won't
  have conflicts, but may need to be resolved into a more sensible order. CRDTs
  are the conflict resolution that the Zed editor uses, but there are other
  options. Sometimes it's as simple as a timestamp.

#### Peer To Peer

The first is "how do I sync data without storing it on a server", in which case
you'll probably want to look at Peer-to-Peer communication, although most of the
time you still need some server to facilitate the initial connection at least.

There are lots of frameworks for this, and each is a little different. The
process is normally something like:

- Any changes made offline are queued or otherwise saved locally.
- Ask the server if any peers are online.
- If so, ask the server help the peers connect to each other.
- Sync data between them.
- Close the connection (and periodically poll when it's online), or use a
  WebSocket, or any other realtime technology for any new updates.

#### Saving Work Offline

The other way I interpret this is "how do I save data offline and send it back
online when there is a connection".

This is a little bit similar to the peer to peer, except the server performs the
role of the peer:

- If you're offline, queue the requests and save them locally.
- If you're online, process the queue and send the data to the server.
- Close the connection (and periodically poll when it's online), or use a
  WebSocket, or any other realtime technology for any new updates.

### Best Resources to Automatically Test Your Code for Security Vulnerabilities?

The OWASP Foundation has
[a list of vulnerability scanning tools](https://owasp.org/www-community/Vulnerability_Scanning_Tools)
that might be useful to look through. I don't think these should be the only
step in your security process, but might be a good place to start. Some of these
can be integrated into a security pipeline.

One other thing I like to do is turn any security vulnerability, or any security
requirement into a suite of automated tests that are run. I want to make sure
that I don't introduce old security vulnerabilities, and unit tests are a great
way to do this.

### Is there a Best way to See how much of Your Ec2 Instance You're Using?

CloudWatch on its own might do what you want to do, especially if your goal is
to figure out if you need to upgrade or can downgrade. If you have multiple
instances, something like DataDog or Grafana might be good enough for what
you're trying to do to aggregate that data and alert on issues.

### Most Common Startup Dev Mistakes and how to Avoid Them

#### Letting Perfect Be the Enemy of Good

I don't think this is a startup-only problem, but there have been times where I
have spent a long time making sure my code was super clean and maintainable, and
then watched it sit unchanged for years because it's not a frequently modified
area. I could have spent that time doing so many other things!

I think guessing correctly here is definitely a skill that comes from messing up
here, but your goal should be to ship features and products that will get users.
Those users can then guide you to build something that's useful to them much
more easily than you can, unless you are one of your own users yourself.

Perfectionism came up a lot in our retrospective. I think the reality is that
none of us know what a perfect app is, and we're definitely not going to get it
on the first try–so why try to build something perfect on the first try? Talking
to users, leads, and listening other signals are much better north stars than
some imagined perfect solution.

#### Making Decisions Without Signal

Speaking of signals, I've seen people waste a lot of time building features that
their users don't want and will not use. One of the reasons that I've talked
about analytics in class so much is that analytics give you a much more holistic
picture of user behavior. That's super useful to inform where improvements and
new features should go. Quantitative signal is much less biased and harder to
manipulate than qualitative signal.

A source of signal that can be hit or miss is passionate users. They are
normally vocal and involved and hard to ignore, so I think it's worthwhile to
listen to what they have to say. Combined with research and other more holistic
data, this qualitative feedback can help inform decisions.

That's not to say that making a decision based on strategy is invalid, either.
Sometimes it makes sense to take a stab at capturing market you don't have yet,
or just simply want to add a feature. That's entirely reasonable; I think it
just needs to come from the place of "this is a strategic decision" over the "we
don't know what else to do" case, or even worse "we don't have enough
information to decide".

#### Not Automating Enough

I'm not going to beat this dead horse (much) more than I already have, but I
will mention that I've talked to some people who have some fairly detailed
manual testing steps. Those are really good to have! I would encourage you to
make those automated testing steps; you've already broken down what needs to
happen, now all you have to do is translate those steps into a language that the
computer speaks.

I'm really fond of end-to-end tests because they tend to come naturally from
manual testing steps. You don't have to deal with much mocking, if any, and can
just instruct the orchestrator to do clicks and navigate to pages and such.

Automation can save you a lot of time. If a test saves me 1 minute of manual
testing, that adds up to almost an hour per year. An hour is long enough for me
to fix an extra bug, or tweak an extra feature. And most automated tests save me
a lot more than 1 minute, especially if I have a 30 minute manual verification
process before releasing something to production.

Automation is also what should give you enough confidence to deploy things on
merge instead of needing a staging verification step for all but the most risky
changes. I'm very fond of it, and I hope that you will be too.

### What is the Best Resources for Crafting Privacy and Security Policies?

I've heard a couple things from people in the cohort, and so I'll echo what
they've said:

- Copy a similar site's policies (probably the most risky, but can be a good
  starting place I suppose). I've seen this advice online, too.
- Use a service like [termly](https://termly.io/pricing/) to generate and host
  your terms. I think this is a safer bet than writing one on your own or
  copying another site.
- I think the safest, but probably most expensive and hardest bet is to talk to
  a lawyer. By the time you're starting to get users, I think it's good to have
  at least a tentative relationship with a lawyer for if anything ever goes
  wrong.

All in all, use your judgement. I tend to be more cautious, but that doesn't
mean that needs to be the case for you.

### How Do I Stay up to Date with Security?

Here are some ideas from me and one of my friends who has spent some time
pentesting.

### Courses and Resources

- Read through the [OWASP Top 10](https://owasp.org/Top10/) and become familiar
  with the most common vulnerabilities. Since these are the most common, these
  are also some of the things that attackers will look for.
- Learn about the exploits and processes that are out there for analyzing and
  breaking into apps. The [MITRE ATTACK](https://attack.mitre.org/) framework is
  one good resource to learn about different methods attackers will use at
  different phases of a breach.
- Look for vulnerability reports and blog posts about getting into libraries and
  3rd parties that you're using–Dependabot and similar tools should do this for
  you, at least for code libraries. A misconfiguration in a Supabase or Firebase
  can lead to full access to all of your data if you're not careful, and that's
  not just limited to those tools.
- Major breaches tend to make the news, as well. Here are some examples:
  - [xz](https://arstechnica.com/security/2024/04/what-we-know-about-the-xz-utils-backdoor-that-almost-infected-the-world/)
  - [Log4J](https://blog.cloudflare.com/inside-the-log4j2-vulnerability-cve-2021-44228/)
  - [Cloudbleed](https://blog.cloudflare.com/quantifying-the-impact-of-cloudbleed/)
  - [Heartbleed](https://owasp.org/www-community/vulnerabilities/Heartbleed_Bug)
- [DEFCON](https://www.youtube.com/@DEFCONConference) talks are an interesting
  resource, and cover many different aspects from data recovery and trolling
  potential malicious users to picking locks and breaking into elevator
  controls. In my experience, these are useful ways to quickly learn the basics
  about something, and then I can find other resources and more in-depth talks
  to look into on my own.

### Interactive

- Try out the [OverTheWire](https://overthewire.org/wargames/bandit/)
  challenges. These are similar to HackThisSite, but more focused around Linux
  (and will teach you the basics!) as well as some of what can happen when
  someone gets into a server you control.
- I also recommend continuing with the tracks we've not done as a class on
  [HackThisSite](https://www.hackthissite.org/).
- Take a look at [HackTheBox](https://www.hackthebox.com/hacker) courses.
- Take a stab at getting into the
  [Metasploitable](https://github.com/rapid7/metasploitable3) VM, using the
  [Metasploit](https://www.metasploit.com/) framework to do attacks against the
  VM.
- Use your devtools to look into what your site is doing. What happens if you
  request different endpoints, send invalid data, or try to get access to things
  that you shouldn't.
- Use a tool like [Wireshark](https://www.wireshark.org/) to analyze traffic to
  and from your app (especially a mobile app). See what's available and what you
  can manipulate.

## Personal Stuff

### Getting in Contact

So class is pretty much over for almost all of you, and demo day is looming.
However, one of the questions that I've got frequently has been "Are we still
allowed to talk to you after the semester's over?"

My short answer to that is Yes!

I'm going to take a little break from office hours, but my goal is to have
[Calendly](https://calendly.com/hhenrichsen) hours still available in the
evenings if you ever wanted to come and chat. I'm not sure that I'm going to
stay in the Slack unless I end up teaching again, but you can always contact me
on [my Discord server](https://discord.gg/hHxXWy7FRQ) instead. You also get the
bonus of seeing my awful taste in music. My email and LinkedIn are also open,
and you are welcome to contact me there if you're in no hurry to get a response.

### What's next for Me?

I'm not sure yet. I have interesting projects inside of Lucid right now; I have
an infection tag tracker that I'm working on written in Kotlin, Ktor, Alpine,
and HTMX that I want to finish at some point; I have features I want to add to
Motion Canvas. And even outside of that, I have some cool non-technical stuff
that I might pursue.
