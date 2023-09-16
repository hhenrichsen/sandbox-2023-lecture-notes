## Introducing Hunter
Howdy, I'm Hunter, I'm 24 and a Software Engineer and Team Lead at Lucid, working on Lucidspark. I'm the oldest of six boys, and grew up in Connecticut. I've been programming since I was 14, but the first time I felt like a real programmer was when I built an app that would allow a group of my friends to run a game of Humans vs Zombies and keep track of who tagged who and who was infected while I was attending Utah State University. Since then I've written a bunch of other random software, become a maintainer on some open source software, and written a second version of the tag tracking website. Over the duration of this class, I'm planning on writing a third version of my tag tracking website so that I'm building something right along with y'all in the same stack.

## Syllabus Overview

You all are free and encouraged to call me Hunter. You can reach my by email at hunter.henrichsen@gmail.com, or I am also on the Sandbox slack. I prefer Slack, but will stay on top of both during the week.

For office hours I'm planning on doing open office hours where anyone can drop in from 6 to 8 PM on Tuesday and Thursdays, and Calendly for anything else, Tuesday through Friday, 6 to 10PM.

## Grading
- **Participation** (10%) -  I am of the opinion that the most beneficial way to learn is to ask relevant questions that will help you along. Students are expected to ask at least two relevant questions in class per semester.
- **Attendance** (20%) - There's a lot to cover when building a new application; attending classes or doing related research are the best ways to learn what needs to be covered. Students are expected to attend the majority of class sessions. The first two absences will not affect this grade, and then further absences will be deducted from this grade.
- **Check-Ins** (10%) - I understand that asking questions in a general audience is not something that always is applicable to everyone, and a goal of this program is to give you 1:1 mentorship. To this end, we (or other advisors) will check in with you and provide specific mentorship to questions or problems that you've run into. 
* **App Progress** (60%) - The goal of this class is to actually build something, so that is reflected in my grading scheme. Students will be expected to set goals and deadlines for the engineering efforts of their projects, and to meet and assess how well they met those goals.


### Schedule

|   |   |
|---|---|
|Date|Topic|
|9/11/2023|Syllabus, Task Management, Setting Standards|
|9/18/2023|Tech Overview, Project Setup|
|9/25/2023|Backend|
|10/2/2023|Databases, Migrations|
|10/9/2023|Q&A Session|
|10/16/2023|Authentication|
|10/23/2023|Testing|
|10/30/2023|Q&A Session|
|11/6/2023|Frontend|
|11/13/2023|Continuous Integration and Delivery|
|11/20/2023|Q&A Session|
|11/27/2023|Mobile|
|12/4/2023|Payments|
|12/11/2023|Q&A Session|

You may notice on our schedule that there are a few days marked as Q&A days. I want this class to be useful to y'all, and one of the ways I want to do that is to let you pick the topics. I'll probably answer frequent questions from office hours to kick these off, but will largely leave them up to you all.
## Quick Poll
### Who has already picked out a tech stack? If you have, what are you using?

### Who has already started working on their app?

### Who has built some kind of software outside of assignments before? 
## Priorities of a Startup

### Speed
At a startup, one of the things that you have to do well is build, learn, and adapt quickly. As an engineer, that means that you need to set up an environment where you can make changes quickly, and see the results. I have two main points of advice here that are relevant starting out:

1. Speed means testing. There is no way to learn this better than by breaking things, but the ideal process is moving fast without breaking things. To me, that means you need ways to make sure that things are not broken, like unit and integration tests. I will have dedicated lectures on this, but making the effort early--especially around some of the critical flows that you are going to be writing early on--will have exponential returns in the future.
2. Speed means measuring. You should not waste development effort on flows that few users are going to use. You should not waste effort trying to make things faster that are rarely called. In order to determine what flows users are using, what flows aren't performing well, you need metrics. This is likely a second semester topic, but this is another thing that if you invest in early, it will pay dividends down the line.

I'm going to show you a toolchain that has some additional features baked into it that will help you get a tight feedback loop while you are developing, such as hot module reloading and code sharing. You don't have to use this, but these are features that are worth looking at in any tech stack.

I encourage you to build your apps in such a way that the above are respected, as well as writing your code in a way that can work well. There is lots of design advice out there on how to write clean code. Don't waste time by writing code quickly.
### Scale
The whole goal of a startup is to acquire users. More users mean more problems, more features, and more server load, however. 

This warrants its own lecture, maybe multiple. There are lots of ways to deal with this, from increasing the number of servers or services available, to caching more frequently, to proactively computing things commonly computed together.
### Onboarding
Eventually, you will want to enlist the help of another engineer, or pass the project off to another engineer. I'm going to call this process "Onboarding". Your ability to do this quickly an effectively should be a priority, and efforts you make little by little will be worth it when it comes time to bring another person up to speed.

Writing documentation and keeping design documents and records of decisions is important. Up-to-date system documentation does wonders for getting new engineers up to speed on what all the moving parts are and where in the codebase they would need to go to make a change. These should also include:

* Clear steps on how to get a development version of the site working
* What steps need to happen to get a change into production
* What standards need to be followed? Do tests need to be written before code is merged?
* Any contractual obligations you have--do you need specific accessibility requirements before code goes to production?

One of the other things you can be doing day-to-day is doing good project management. That means keeping good records of what has been done and what needs to be done. That means keeping track of deadlines and what features need to be released together, or which work blocks other work.

## Project Management

### Stories / Issues / Tickets
Stories, issues or tickets are the fundamental units of work in project management. These are the simple tasks that make everything else up. Generally larger than a commit, but as small a task that can generally be described.

Examples:
* Add google sign in option to authentication
* Allow storing and querying user subscription level
* Allow users to join and leave games

You will want to work with your team to get these designed and fleshed out in advance.
### Projects / Epics
Projects or epics are the larger units of work. These are the larger units of work and are generally made up of stories.

Example:
* Game Management -- allow users to create, join, leave, and administer games. Games should allow joining via invitation links, or by searching in a public directory.
### Tech Debt
Sometimes in the effort to develop something quickly, you will need to make a sacrifice in terms of quality. I recommend that you file these as their own stories, perhaps in their own epic or bucket as tech debt. That way you have a record and can address these as you go, rather than allowing it to pile up and eventually cause larger issues.

## Ecosystem
### Next.js
I am using Next.js for my app because it is popular--which means integration with libraries and lots of community resources, especially since it is closely tied to React, and it comes with many nice features--like hot reloading during development.
### Monorepo
I am using a turbo monorepo so that I can write shared library code and use that throughout the codebase. If I ever need to create additional services or segmented portions of the codebase (like a mobile app), I can share that code with each of them. This comes with some additional challenges, but I think the sharing is worth it.
### Dependency Injection
I have a more in depth example of this [here](https://henrichsen.dev) but will go over a similar example in class. Dependency Injection makes testing and working with large codebases like the one you will be creating much easier than alternatives. I am of the opinion that any codebase that expects future development should be using some form of dependency injection.
## Lucid Account
I am working on getting access to an enterprise Lucid account for us all to use so that you can create architecture diagrams and other documentation. I will follow up on this next time.
## Next Time
Tech Overview, Project Setup