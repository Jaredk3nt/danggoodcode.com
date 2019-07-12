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

This format gives the tool a lot of power and potential for growth. The *auto-initializer* function (like `string` or `number`) passed into `enums` is designed to work just like a mapping function you would pass into `Array.prototype.map`. An initializer function should be able to accept the given enum as well as the previous value assigned: `function initializer(enm, prevVal) {}`. This allows for many types of initializers to be created and writen specifically for your needs. Both `number` and `string` are bundled into the core package as these are the most common type of auto-initialization, their implementations look like this:

```js
function string(en) {
  return en; // Super simple, we just return the given enum string
}

// number is the default initializer, if you don't pass anything in to `enums` it uses this function
function number(en, prevVal) {
  return prevVal !== undefined && prevVal !== null ? prevVal + 1 : 0;
}
```

Here is what an initializer might look like if you wanted to capitalize the first letter of the enum:

```js
function capitalize(enm) {
  return enm.charAt(0).toUpperCase() + enm.slice(1);
}
```

Obviously not every case is so cut and dry, sometimes we want custom values for each enum that don't map cleanly based on the enum string. For this I made sure to add an "override" syntax that allows you to give an object just like our "constant object" pattern:

```js
const COLORS = enums()({ red: '#f44242', green: '#27c65a', blue: '#003bff' });
```

At this point you might be asking: "Why use this tool if I am just going to be writing an object anyways? Now it's even longer to type!". Here is where those natural benefits of safety come in, let's dig into the implementation a bit.

## Enums Implementation

Here is the full implementation of the `fun-enums` package, it's only 39 lines:

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

You may have noticed the use of [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze), this is how we can attempt to guarantee immutibility and safety of our enum implementation. `Object.freeze` will prevent properties from being added or removed from our underlying JS object by "[failing] either silently or by throwing a TypeError exception"*. It will also prevent values from being changed, "the writable and configurable attributes are set to false..."*. With freeze and const we are able to get pretty much entirely to object immutability to ensure our enums aren't modified by us or another developer. Freeze does have it's limitations, it can only freeze one level deep in an object. In the implementation not only is the top level "enum" object being frozen but any custom defined values are being frozen at the top level. This means that if you are assigning your enum values to nested objects the nested object is still in danger of being mutated. Make sure when doing this that you "deep freeze" your objects when assigning them to an enum. Deep freezing was left out of this implementation as it is not a pattern I use almost ever, but I wanted to be sure to point it out for anyone that might have that use-case.

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