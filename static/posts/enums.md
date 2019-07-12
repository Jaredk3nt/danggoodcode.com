---
title: Enums in JS
date: July 11th, 2019
---

Have you ever found yourself writing something like this?

```js
const PERIODS = {
  week: 'week',
  day: 'day',
  hour: 'hour',
  minute: 'minute'
};

// OR

const STATUSES = {
  pending: 0,
  inReview: 1,
  approved: 2,
  rejected: 3
};
```

I have found myself and tons of developers I have worked with imploying this pattern. It's really common to need a set of related constant values, in fact so common that many lanugages have a construct specifically to describe them: Enums. JavaScript is not one of those languages, and that is why we are left with a half-hearted alternative, these "constant" objects. Perhaps one day we may get enums as a build-in language feature (in fact [enum is a reserved word](http://www.javascripter.net/faq/reserved.htm) is JavaScript), but for now we are left with a lacking alternative.

I have been rather rude to these "constant objects" and haven't explained why I feel this way. In JavaScript when specifying our object definition with `const` we are only prevented from reassigning the variable, not actually prevented from mutating that variable entirely. If I defined some object `x` using `const` I could later go and modify one of its properties, add a new one, or completely `delete` it. When it comes to true constant values this is less than ideal, we want to avoid somewhere in our program someone coming in and taking away our "pending" status and causing all sorts of bad behavior. While this is by far the most important feature of enums, I also believe that our "constant objects" are a bit long hand and could use some *syntactic sugar* to make them a bit nicer. So I took it upon myself to try and come up with a way to get enum-like behavior in my code.

> Caveat: I don't use typescript, they have enums that work great and are exactly what I am talking about. However I don't always have the opportunity to write typescript and many people don't so I wanted something I could use in any project I worked on.

While I was looking at enums in other languages and fantasizing about them in my JavaScript, I came across [this proposal](https://github.com/rbuckton/proposal-enum) for an enum feature in ECMAScript by [Ron Buckton](https://twitter.com/rbuckton) (This guy is a senior engineer working on TypeScript so think he knows a thing or two about enums). I really liked this proposal, it had roots in enums from Java, C++, C#, and TypeScript. One feature I really like that was core to his proposal was the "Automatic Initialization" and the use of "auto-initializers". This means that you could determine the value that would be assigned to your enum by simply specifying the initializer you wanted to use, it looks like this:

```js
enum Colors of Number {
  red,
  green,
  blue
}

enum PlayState of String {
  idle,
  running,
  paused
}
```

This seemed like a perfect method of removing the clunky object key/value syntax we use in the "constant objects" pattern. Now obviously any tool I would make wouldn't have all of the niceties of specialized syntax like the proposal without me having to go to the extraordinary lengths of writing a crazy babel plugin or something. So I decided on a semi-functional looking approach where I could pass in the initializer function to set up my enum creator and then pass in my enum definition into that creator. Here is what the examples I provided at the top look like with my enums tools:

```js
const PERIODS = enums(string)('week', 'day', 'hour', 'minute');
const STATUSES = enums(number)('pending', 'inReview', 'approved', 'rejected');
```


