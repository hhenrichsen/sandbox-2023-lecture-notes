<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Announcements](#announcements)
- [News / Articles](#news--articles)
- [Tech Talk - Eden (Choosing TypeORM over Prisma)](#tech-talk---eden-choosing-typeorm-over-prisma)
- [Tech Talk - Alec (AI and Other Tools for Building Quickly)](#tech-talk---alec-ai-and-other-tools-for-building-quickly)
- [Managing Costs (off of Lambdas) and Scale-to-Zero](#managing-costs-off-of-lambdas-and-scale-to-zero)
- [Aside - Lower-tech Versions of Course Technologies](#aside---lower-tech-versions-of-course-technologies)
  - [Other Lower-Tech JS Libraries](#other-lower-tech-js-libraries)
  - [Other Tools You Should Know About](#other-tools-you-should-know-about)
- [Reading](#reading)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Announcements

- Assignment 1 is due next week; share the repo with `hhenrichsen` on GitHub,
  and submit the link to Learning Suite.
- [HackUSU](https://www.hackusu.com/) is coming up next month; it's a good
  opportunity to continue working on what you've been working on, and meet other
  SWEs (and business students) in Utah.
- Lucid and the Utah Java Users Group is having an event soon about
  [Design Tradeoffs in Modern Architectures](https://www.meetup.com/utah-java-users-group/events/296259318/)
  a week from today that may be interesting to you all.

## News / Articles

- [Postgres for Everything](https://www.amazingcto.com/postgres-for-everything/)
  (and a
  [related gist](https://gist.github.com/cpursley/c8fb81fe8a7e5df038158bdfe0f06dbb))

## Tech Talk - Eden (Choosing TypeORM over Prisma)

## Tech Talk - Alec (AI and Other Tools for Building Quickly)

## Managing Costs (off of Lambdas) and Scale-to-Zero

I had some questions before and after last class about how to achieve a
serverless effect, or in other words, how to create and dispose machines as
they're needed.

Fly.io has a concept called [Machines](https://fly.io/docs/machines/) that can
be started and stopped on demand, in addition to GPU machines available. These
can be triggered via API, which means you can use your other server to trigger
starting and communicating with a machine like this.

## Aside - Lower-tech Versions of Course Technologies

[Example Repo](https://github.com/hhenrichsen/docker-node-api-example) – does a
Node.js API, and a Frontend as separate apps in one repo, run with Docker.

### Other Lower-Tech JS Libraries

- [Kysely](https://kysely.dev/)
- [Knex](https://knexjs.org/)

### Other Tools You Should Know About

- [Grafana](https://grafana.com/) – Monitoring and Graphs
- [MailHog](https://github.com/mailhog/MailHog) (or alternative,
  [Mailpit](https://github.com/axllent/mailpit)) – view sent emails in a
  development environment
- [Adminer](https://www.adminer.org/) - SQL Admin interface
- [Prometheus](https://prometheus.io/) - OSS version of Datadog; used for
  metrics and alerts

## Reading
- **Read:** [Microsoft: Designing Microservices Architecture](https://learn.microsoft.com/en-us/azure/architecture/microservices/design/) -- checkout the sidebar on this one and read through the other subsections.
- **Read:** [LogRocket: Methods for Microservice Communication](https://blog.logrocket.com/methods-for-microservice-communication/)
- **Read:** [DHH: The Majestic Monolith](https://signalvnoise.com/svn3/the-majestic-monolith/)
