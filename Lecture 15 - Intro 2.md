# Intro 2: Syllabus, Task Management, High Level Architecture

- [Intro 2: Syllabus, Task Management, High Level Architecture](#intro-2-syllabus-task-management-high-level-architecture)
  - [Schedule](#schedule)
  - [Grading](#grading)
  - [Tech Talks](#tech-talks)
  - [Assignments](#assignments)
    - [Assignment 1 - CI Pipeline (6 points, Due 11:59PM February 9)](#assignment-1---ci-pipeline-6-points-due-1159pm-february-9)
    - [Assignment 2 - Working Deployment (6 points, Due 11:59PM March 7)](#assignment-2---working-deployment-6-points-due-1159pm-march-7)
    - [Assignment 3 - Responsive Design (6 points, Due 11:59PM March 28)](#assignment-3---responsive-design-6-points-due-1159pm-march-28)
    - [Assignment 4 - Security (6 points, Due 11:59PM April 11)](#assignment-4---security-6-points-due-1159pm-april-11)
  - [Make-Up Credit](#make-up-credit)
    - [Attendance](#attendance)
    - [Assignments](#assignments-1)
  - [Readings](#readings)
    - [Syllabus](#syllabus)
      - [How this Section Works](#how-this-section-works)
  - [Project Management](#project-management)
  - [High-Level Architecture](#high-level-architecture)
  - [Next Time - AWS Day 1: EC2, ECS, Lambda, and Docker](#next-time---aws-day-1-ec2-ecs-lambda-and-docker)

## Schedule

| Date        | Topic                                              |
| ----------- | -------------------------------------------------- |
| January 11  | Syllabus, Task Management, High Level Architecture |
| January 18  | Deployment: Docker, Containers, EC2, Lambda, ECS   |
| January 26  | Deployment: RDS, DocumentDB, S3, Docker Compose    |
| February 2  | Deployment: VPC                                    |
| February 9  | Tech Talks, Q&A                                    |
| February 16 | Scaling: Services                                  |
| February 23 | Scaling: Sharding                                  |
| March 7     | Tech Talks, Q&A                                    |
| March 14    | Code Organization, Dependency Injection            |
| March 21    | Responsive Design                                  |
| March 28    | Tech Talks, Q&A                                    |
| April 4     | Security                                           |
| April 11    | Payments                                           |

## Grading

Grading will be based on attendance, assignments, participation, and check-ins.

- **Attendance** (12 points, 1 per class, 10%) - There's a lot to cover when
  building a new application; attending classes or doing related research are
  the best ways to learn what needs to be covered. Students are expected to
  attend the majority of class sessions. Will be graded out of 13, with 1
  absence not effecting the grade.
- **Participation** (12 points, 10%) - I want this class to be useful for you
  and others. The easiest way you can help others and make the class more useful
  for you is to ask questions in class, but there will be more options for
  participation this semester:
  - Give a Tech Talk (12 points)
  - Ask questions in class (4 points)
  - Talk about news at the beginning of class (4 points)
  - Come in for office hours (4 points)
  - Submit topics to the Q&A sessions (2 points)
  - Answer questions on Slack (1 point per useful answer)
- **Assignments** (24 points, 6 per assignment, 20%) - I want your main focus to
  be on your own app, but there are some useful things to learn on the side, so
  I will have a couple assignments to help you grasp and implement some concepts
  for your app.
- **Final Check-In + App Progress** (72 points, 60%)

## Tech Talks

One of the most frequently requested things as I was talking to y'all last
semester was the opportunity to learn from each other. This semester, the first
part of Q&A days will be presentations led by you all on topics you've found
interesting. This is entirely voluntary, but as mentioned above can fulfill your
entire participation grade.

All other days, we'll have portions of class dedicated to interesting things
going on, tools you've found, etc. 2024-01-11T09:48:25-07:00

## Assignments

### Assignment 1 - CI Pipeline (6 points, Due 11:59PM February 9)

If you are building a web / mobile app, build a CI pipeline into your app that
does the following (2 points each):

- Format / Linting according to some style guide (can be your own configuration)
- Run Tests
- Build / Compile the App

If you are not building a web / mobile app, work with me and we can try to find
something comparable.

### Assignment 2 - Working Deployment (6 points, Due 11:59PM March 7)

Add a step to your CI pipeline that deploys your app. Ideally, this should
include deployment to some kind of staging environment, and then the ability to
promote that to production, however this assignment will only require that there
be a process to go from code to production.

If you are not building a web / mobile app, work with me and we can try to find
something comparable.

### Assignment 3 - Responsive Design (6 points, Due 11:59PM March 28)

Build a simple blog site that does the following:

- Has a header with links to an archive of posts, top posts, and a page about
  the author. These links do not need to work or go to different pages. (1
  point)
- Has a listing of posts (at least 3) for the main body of the content that
  follows good readability rules and responds to changes in screen size well. (2
  points)
- Each post should have a published date, an author, an estimated reading time,
  a title, a preview of the content, a banner image, and a like count. More
  prominent and important elements should be emphasized. (1 point)
- Has a footer that lists the copyright year. (1 point)
- Responds to dark and light mode. (1 point) The site can be entirely static.
  Push this to a private GitHub repo. Share the repo with hhenrichsen. Submit
  the link to the repo to this assignment. Using CSS libraries is not required,
  but may make this easier for you.

### Assignment 4 - Security (6 points, Due 11:59PM April 11)

Complete the Basic and JavaScript portions of HackThisSite (3 points each) and
submit a link to your profile on the site. Leave a comment on your profile that
mentions BYU Sandbox.

## Make-Up Credit

### Attendance

- Read a couple articles about the topic at hand (in addition to the reading; I
  recommend individuals' pieces rather than organization/marketing articles),
  and send me a message describing how that can and does apply to what you're
  working on, or why it doesn't.

### Assignments

- Assignments can be turned in late for half credit. If you are concerned about
  the deadline / have other sandbox-related things going on, please let me know
  beforehand and we can figure out an equivalent or more individualized
  deadline.

## Readings

### Syllabus

#### How this Section Works

- **Skim** - Take a look at the page. See if there's anything interesting to you
  on it, and read that. Otherwise, it's there as a resource.
- **Read** - Read through the full article.
- **Read and Follow** - Read through the article, following along with the steps
  if you've not done something similar before.
- **Do** - complete this task before the lecture.

## Project Management

I'll be going through an example today where I'll task out the next steps for my
project. I'll be using GitHub Projects and Issues, but there are a lot of other
tools that can be used for this.

Generally, I encourage you to follow milestone-based development. A lot of my
projects that don't work out, I followed a more gardening approach, where I work
on a bunch of little things in lots of areas. That doesn't work well when you're
serious about building something. Instead, I recommend you set a goal and
implement that goal. That way when you're finished, you have a feature that you
can see, use, and even sell.

## High-Level Architecture

We'll go through an example architecture (and maybe some of yours) in a
Lucidchart document. I'll add that to these notes afterwards.

## Next Time - AWS Day 1: EC2, ECS, Lambda, and Docker

- **Skim:** [AWS: Intro to IAM](https://aws.amazon.com/iam/)
- **Skim:** [AWS: Intro to EC2](https://aws.amazon.com/ec2/)
- **Skim:** [AWS: Intro to EBS](https://aws.amazon.com/ebs/)
- **Skim:** [AWS: Intro to Lambda](https://aws.amazon.com/lambda/)
- **Skim:**
  [AWS: Intro to Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- **Skim:** [AWS: Intro to Fargate](https://aws.amazon.com/fargate/)
- **Skim:** [AWS: Intro to ECS](https://aws.amazon.com/ecs/)
- **Read:**
  [FreeCodeCamp: A Beginner-Friendly Introduction to Containers, VMs, and Docker](https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/)
- **Read:**
  [Kubernetes: Intro to Kubernetes](https://kubernetes.io/docs/concepts/overview/#why-you-need-kubernetes-and-what-can-it-do)
- **Read:**
  [Igor Mardari: Why I migrated from AWS Beanstalk to ECS + Fargate: A Personal Perspective](https://medium.com/7code/why-i-prefer-aws-ecs-over-beanstalk-a-personal-perspective-55b3ebc444e1)
- **Read and Follow:**
  [AWS: Creating an IAM User](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).
  Create a root AWS user (or work with your team to create an account for your
  team), and an IAM non-root user for yourself (and your teammates) to use.
- **Do:** install Docker on your machine if you don't have it already.
