---
title: Enums in JS
date: July 11th, 2019
url: https://github.com/Jaredk3nt/enums
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

I find myself using this pattern all the time, and see it in tons of the codebases I have worked on. It's really common to need a set of related *constant* values, so common in fact that many lanugages have a construct specifically to describe them: Enums. Sadly, JavaScript is not one of those languages. That is why we are left with a half-hearted alternative, these "constant object" definitions. Perhaps one day we may get enums as a build-in language feature ( [enum is actually a reserved word](http://www.javascripter.net/faq/reserved.htm) in JavaScript), but for now we are left with what I consider: a lacking alternative.

Though I have disparaged this pattern I called "constant objects", I haven't explained why they are lacking or why enums solve any of their problems. In JavaScript when specifying our object definition with `const` we are only prevented from reassigning the variable, not actually prevented from mutating that variable entirely. If I defined some object `x` using `const`, I could later go and modify one of its properties, add a new one, or completely `delete` it. When it comes to **true constant** values this is less than ideal. We want to avoid somewhere in our program someone coming in and taking away our "pending" status and causing all sorts of bad behavior. While safety is by far the most important feature of enums, I also believe that our "constant objects" are a bit long hand and could use some *syntactic sugar* to make them a bit nicer (because in the end we have to write this kind of code everyday). So I took it upon myself to try and come up with a way to get enum-like behavior in my code.

> Caveat: I don't use typescript, they have enums that work great and are exactly what I am talking about. However I don't always have the opportunity to write typescript and many people don't, so I wanted something I could use in any JS project.

While I was looking at enums in other languages and fantasizing about them in JavaScript, I came across [this proposal](https://github.com/rbuckton/proposal-enum) for enums in ECMAScript by [Ron Buckton](https://twitter.com/rbuckton) (This guy is a senior engineer working on TypeScript so think he knows a thing or two about enums). I really liked the proposal, it had roots in enums from Java, C++, C#, and TypeScript, and a very clear definition of the functionality. One feature I really like that was core to his proposal was the "Automatic Initialization" and the use of "auto-initializers". This means that you could determine the value that would be assigned to your enum by simply specifying the initializer you wanted to use, it looks like this:

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

This seemed like a perfect method of removing the clunky object key/value syntax used in the "constant objects" pattern. Rather than have to directly specify the value of your enum it could be implied. Now obviously, any tool I could write wouldn't have all of the niceties of specialized syntax like the proposal (without me having to go to the extraordinary lengths of writing a full blown babel plugin or something). So I decided on a semi-functional looking approach where I could pass in the initializer function to set up my enum creator and then pass in my enum definition into that creator. Let's look at what my original examples would look like in the syntax I was dreaming up:

```js
const PERIODS = enums(string)('week', 'day', 'hour', 'minute');
const STATUSES = enums(number)('pending', 'inReview', 'approved', 'rejected');
```

This format gives the tool a lot of power and potential for growth. The *auto-initializer* function (like `string` and `number`) passed into `enums` is designed to work just like a mapping function you would pass into `Array.prototype.map`. As long as an initializer returns a value for each enum passed to it, the tool will create an enum with that value. An initializer function is provided the current enum value as well as the previous value assigned: `function initializer(currentEnum[, previousValue]) {}` this allows you to modify the given enum or increment based on the last value. Hopefully this initializer API is robust enough to allow for large amounts of customization, so your specific use-case can be packaged and reused. Both `number` and `string` auto-initializers are bundled into the core package. Here are the implementations for both `string` and `number`:

```js
function string(en) {
  return en; // Super simple, we just return the given enum string
}

// number is the default initializer, if you don't pass anything in to `enums` it uses this function
function number(en, prevVal) {
  return prevVal !== undefined && prevVal !== null ? prevVal + 1 : 0;
}
```

To show a custom example, an initializer that returns a capitalized string value of the given enum key might look something like this:

```js
function capitalize(enm) {
  return enm.charAt(0).toUpperCase() + enm.slice(1);
}
```

Obviously not every case is so cut and dry, sometimes we want custom values for each enum that don't map cleanly based on the enum string. To handle this the tool provides support for an *override syntax* to allow directly specifying the values rather than relying on auto-initialization. This ends up requiring the user to pass in a full JS object from which the enum will be constructed:

```js
const COLORS = enums()({ red: '#f44242', green: '#27c65a', blue: '#003bff' });
```

At this point you might be asking: "Why use this tool if I am just going to be writing an object anyways? Now it's even longer to type!". Here is where those natural benefits of safety come in, let's dig into the implementation a bit.

## Enums Implementation

Here is the implementation of the `enums` tool, it's only 39 lines:

```js
function enums(initializer = number) {
  function generator(...args) {
    if (!args || !args.length) return undefined;
    const enums = args.length > 1 ? args : args[0];
    let en = {};
    let pv;

    if (Array.isArray(enums)) {
      for (let val of enums) {
        const v = initializer(val, pv);
        pv = v;
        en[val] = v;
      }
    } else if (typeof enums === "object") {
      for (let val of Object.entries(enums)) {
        const key = val[0];
        const value = val[1];
        if (!value || Array.isArray(value) || typeof value === "object") {
          const v = initializer(key, pv);
          pv = v;
          en[key] = Object.freeze(v);
        } else {
          en[key] = Object.freeze(value);
        }
      }
    }

    giveMethods(en); // Not showing this method definition for conciseness, check out Github for the 'full' source
    
    return Object.freeze(en);
  }

  return generator;
}
```

You may have noticed the use of [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze), this is how we can attempt to guarantee immutibility and safety of our enum implementation. `Object.freeze` will prevent properties from being added or removed from our underlying JS object by "[failing] either silently or by throwing a TypeError exception"\*. It will also prevent values from being changed, "the writable and configurable attributes are set to false..."\*. With freeze and const we are able to emulate object immutability to ensure our enums aren't modified by us or another developer. Freeze does have it's limitations, it can only freeze one level deep in an object. In the implementation not only is the top level "enum" object being frozen but any custom defined values are being frozen at the top level as well. This means that if you are assigning your enum values to nested objects the nested object is still in danger of being mutated. Make sure when doing this that you "deep freeze" your objects before assigning them to an enum. Deep freezing was left out of this implementation as the use of deeply nested objects isn't a pattern I see often, but I wanted to be sure to point it out for anyone that might have that use-case.

> \* Quotes from linked MDN docs on `Object.freeze`

Along with the safety of immutability Ron Bucktons enum proposal defined a set of methods allowed on an enum type.

```js
let Enum: {
  keys(E: object): IterableIterator<string | symbol>;
  values(E: object): IterableIterator<any>;
  entries(E: object): IterableIterator<[string | symbol, any]>;
  has(E: object, key: string | symbol): boolean;
  hasValue(E: object, value: any): boolean;
  getName(E: object, value: any): string | undefined;
  format(E: object, value: any): string | symbol | undefined;
  parse(E: object, value: string): any;
  create(members: object): object;
  flags(descriptor: EnumDescriptor): EnumDescriptor;
};
```

Rather than include a global `Enum` object in the package with methods, the methods can be called directy on your enum:

```js
const PERIODS = enums()('week', 'day', 'hour', 'minute'); // auto-initialized to 'number'

PERIODS.keys() // ['week', 'day', 'hour', 'minute']
PERIODS.values() // [0, 1, 2, 3]
PERIODS.entries() // [['week', 0], ['day', 1], ['hour', 2], ['minute', 3]]
PERIODS.has('month') // false
PERIODS.hasValue(0) // true
PERIODS.getName(0) // 'week'
```

The initial reasoning behind including the methods on the enum created (and break from the proposal format) was for ease of use, since a true **global** object can't be created for `Enum` you would have to import that as well when you wanted these helper functions. I'm still not certain if this was the correct choice for the tools API, hopefully with continued use and some community testing this implementation can be finalized with an API that works best for it's users.

## Conclusion

I love enums, and really wish we could have a true enum in JavaScript without having to use TypeScript. However for now this little tool will hold me over, and I hope it piques your interest too! You can install [fun-enums](https://www.npmjs.com/package/fun-enums) with npm or yarn and start using it today in your projects. The package is a mere **807 bytes** minzipped, with **zero** dependencies, and tested with above **95%** code coverage! Feel free to leave comments or problems as issues on the github repository, thanks for reading!