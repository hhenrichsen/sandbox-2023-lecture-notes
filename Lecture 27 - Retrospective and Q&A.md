# Lecture 27 - Retrospective and Q&A

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Lecture 27 - Retrospective and Q&A](#lecture-27---retrospective-and-qa)
  - [Announcements](#announcements)
  - [News](#news)
  - [Extra Credit](#extra-credit)
  - [Retrospective](#retrospective)
  - [Security Addendum](#security-addendum)
    - [Supply Chain Attacks](#supply-chain-attacks)
    - [Third Party Vulnerabilities](#third-party-vulnerabilities)
    - [Secrets Leaking](#secrets-leaking)
    - [Hack This Site](#hack-this-site)
    - [Your Own Audits and Bug Bounties](#your-own-audits-and-bug-bounties)
  - [Q&A](#qa)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Announcements

- I owe some of your participation points. **If you have asked one or both of
  your questions already and don't see points in Learning Suite for it yet,
  please come talk to me after class or shoot me a slack message.\***
- **Final check-ins have started.** Please expect to come in earlier and talk
  about what you've built and learned so far this semester.
- I will not be here in person next week, but Alexander has talked about
  organizing a zoom session where we all can talk about tech stacks and problems
  we've solved. I think this is a good idea – keep an eye on the slack channel
  for more details next Thursday.
- Please, please, please read the assignment descriptions. There are certain
  requirements that have been frequently missed. For example, you have to leave
  a comment on your profile to indicate that you're who you say you are on
  HackThisSite.

## News

- [xz vulnerability](https://nvd.nist.gov/vuln/detail/CVE-2024-3094) –
  [and my favorite opinion piece from the coverage on it](https://robmensching.com/blog/posts/2024/03/30/a-microcosm-of-the-interactions-in-open-source-projects/)
- [Firebase misconfiguration vulnerability](https://env.fail/posts/firewreck-1/)
  (and some [other](https://mrbruh.com/chattr/), similar vulns)
- [Amazon stops Cashierless Grocery](https://arstechnica.com/gadgets/2024/04/amazon-ends-ai-powered-store-checkout-which-needed-1000-video-reviewers/)
- [Bun 1.1](https://bun.sh/blog/bun-v1.1)

## Extra Credit

If you don't want to arrange make-up credit by talking to me (or bonus
participation), do an extra track on HackThisSite and I'll throw in 3 points to
an assignment where you have lost them. Steganography and Realistic are both
interesting exercises to go through, but I'll accept any of them.

## Retrospective

Let's talk about what has gone well and what has not gone well so far this
semester.

Our goal from this is to learn from each other, not to place the blame on people
or technologies:

> **Regardless of what we discover, we understand and truly believe that
> everyone did the best job they could, given what they knew at the time, their
> skills and abilities, the resources available, and the situation at hand**

– Norm Kerth, Project Retrospectives: A Handbook for Team Review, quoted in
[the Retrospective Wiki](https://retrospectivewiki.org/index.php?title=The_Prime_Directive).

## Security Addendum

Here are some things that I think are worth touching on that we didn't get to
last time.

### Supply Chain Attacks

These are vulnerabilities introduced to upstream dependencies like npm
dependencies. Some people get around these by pinning versions or vendoring
packages. The recent `xz` vuln is an example of this.
[This is another example of a theoretical supply chain attack](https://david-gilbertson.medium.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5)
that I think about a lot.

### Third Party Vulnerabilities

A variant of Supply Chain Attacks, but ones that I attribute to incompetence and
ignorance more than malice. Sometimes third parties, especially third party
services that you use, or even customers, do insecure things. You should be
careful of what third parties are allowed to do on your services and have a plan
in place should one of them stop working.

### Secrets Leaking

Through a number of other things that could go wrong, sometimes your secrets get
exposed to the public. You should have a plan in place (and perhaps practice)
rotating your secrets.

### Hack This Site

Please go through the exercises on the site; they show you some of the many ways
people can get to information on your app. I think the DEFCON talks are worth
watching / listening to as well to learn about how things are breached. There
are also security and exploit reports worth reading, and learning from other
people's mistakes.

### Your Own Audits and Bug Bounties

It's definitely worth it to do something like we did last week on your own site
– get together, try to find vulnerabilities, or just otherwise explore what
information you can get access to.

You can also do bug bounties, and there are individuals out there who will look
for vulnerabilities in your apps in exchange for a fee for each one they find.

## Q&A
