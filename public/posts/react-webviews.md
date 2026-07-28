---
title: Faking React for VS Code Webviews
date: February 10th, 2020
---

I recently worked on a hackathon project at work that involved creating a custom webview for previewing YAML specs. If you haven't worked with the VS Code webview API before, it is very simplistic and involves sending a string of an HTML page to VS Code that it will manually render. A very simple example would look something like this:

```js
// Taken from the visual studio docs
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "catCoding",
        "Cat Coding",
        vscode.ViewColumn.One,
        {}
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent();
    })
  );
}

function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
</body>
</html>`;
}
```

I'm sure you can see where this post is going... this can become very cumbersome very quickly. Writing complex logic in template strings is messy and doesn't give you intellisense on errors which just makes things harder to debug. Now I write React components all day, so I wanted to be able to use JSX to make my life easier. JSX isn't something that is "react only", it's simply a bit of syntactic sugar that makes a function call look like HTML. The function it is hiding is called `createElement` which converts a html element definition into a React node that it can handle. In my case all I need is for `createElement` to spit out an HTML string so that I can pass it to VS Code. So let's see if we can write our own `createElement` that will turn JSX into a string!

If we take a look at the [React createElement](https://github.com/facebook/react/blob/master/packages/react/src/ReactElement.js) function we can see it takes 3 arguments:

```js
function createElement(type, config, children) { ... }
```

Let's go over what these mean: `type` is the type of element we are going to render (like `h1` or `div`), `config` allows us to pass options to our element like attributes and props, and finally `children` are the nested elements to render within my current element. If we look a bit harder we can also see a comment about the children:

```js
// ...
// Children can be more than one argument, and those are transferred onto
// the newly allocated props object.
const childrenLength = arguments.length - 2;
// ...
```

This lets us know that when there are multiple children it will pass them as multiple arguments, in their implementation they are opting to look at the arguments array but we can also handle this with the "rest" syntax (opposite of "spread" but with the same syntax). For our solution we don't need alot of the fancy bits React handles, in fact we don't really need custom components because we can just use functions and make our job much simpler, so instead of `config` the options are just going to be the `attributes` we want to attach to the actual DOM element. With all of that we have figured out the definition for our `createElement` function!

```js
function createElement(type, attributes, ...children) { ... }
```

Before we go much further, you may be thinking to yourself "So what if we can write our own `createElement` function? How are we going to get our JSX to use that?". So let's talk about how React deals with compiling JSX. If you are familiar with tools like `create-react-app` this process is often obfuscated from you, but it is very simple! React uses `babel` to compile everything down to vanilla JS that can run everywhere, so all we need to do is copy the build process React uses by setting up babel ourselves. We will need 3 packages:

- `@babel/cli`
- `@babel/core`
- `@babel/plugin-transform-react-jsx`

The important one here is `@babel/plugin-transform-react-jsx` which handles the transpiling of our JSX to `createElement` function calls. And the coolest part of this package is that it allows us to specify our own `createElement` function by defining a "pragma". This is just a string of the function babel should use when making the JSX calls, the default is `React.createElement` (that's why you have to import `react` in any file where you use JSX in a normal React project). In our `.babelrc` file let's set up the plugin:

```json
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", { "pragma": "createElement" }]
  ]
}
```

Here we are telling babel, "When you run use the plugin `plugin-transform-react-jsx` and give it the options object that tells you to call `createElement` instead of `React.createElement`". Now the only thing we have to do to get our JSX to work is run babel and ensure we have our `createElement` function in scope anywhere we use JSX! To get our VS Code extension to run babel before the extension launches we need to add a `build` script to our `package.json` that runs babel, and then we need to define a `preLaunchTask` in our `.vscode/launch.json` file.

```js
// package.json
{
  //...
  "scripts": {
    "build": "babel src -d dist"
  }
  //...
}
```

```js
{
  //...
  "configurations": [
    {
      "name": "Extension",
      "type": "extensionHost",
      "request": "launch",
      "runtimeExecutable": "${execPath}",
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}"
      ],
      "preLaunchTask": "npm: build"
    }
  ]
  //...
}
```

Now that we have all of the configuration stuff squared away we can get back to developing our `createElement` function! Remember our goal is to turn JSX into an HTML string that can be read by VS Code's webview API. Let's start simple: getting it to create the right type of element in a string:

```js
function createElement(type) {
  return `<${type}></${type}>`;
}
```

Easy enough. We could add some error handling to ensure that we are only passing in valid HTML elements, but let's stick with simplicity for now. Next up is adding the attributes to our element:

```js
function createElement(type, attributes = {}) {
  const attributeString = Object.entries(attributes)
    .map(([attr, value]) => `${attr}="${value}"`)
    .join(" ");
  return `<${type} ${attributeString}></${type}>`;
}
```

All we need to do is create a string where each attribute has the format: `attribute="value"`. We can take our object and map over it's entries and then join the string we created for each. I also added a default to the `attributes` parameter so we don't have to pass it in every time. Easy peasy! Lastly let's deal with those pesky children. This one may be the most confusing, because many people's initial reaction would be to use recursion to handle creating the children strings, however that is already handled for us. Given the way that JS runs the most nested function call with be evaluated first so by the time we are looking at a child it has already been converted from it's function form into it's resulting string.

```js
function createElement(type, attributes = {}, ...children) {
  const attributeString = Object.entries(attributes)
    .map(([attr, value]) => `${attr}="${value}"`)
    .join(" ");
  const childrenString = Array.isArray(children)
    ? children.filter(c => c !== null).join("")
    : children || "";
  return `<${type} ${attributeString}>${childrenString}</${type}>`;
}
```

Voila! We have handled our children whether there are multiple or only a single one. That's really it, that will convert our JSX into stringified HTML that can be read by VS Code as long as we use valid HTML element types. Let's convert that earlier example into nice clean JSX code and add some logic real easily:

```js
const vscode = require("vscode");
// Even though we don't use this line it is required to be in scope
const createElement = require('./createElement.js');

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "catCoding",
        "Cat Coding",
        vscode.ViewColumn.One,
        {}
      );

      // And set its HTML content
      panel.webview.html = getWebviewContent();
    })
  );
}

function getWebviewContent() {
  const images = [
    "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
    "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif"
  ];
  return (
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cat Coding</title>
      </head>
      <body>
        {images.map(img => (
          <img src={img} width="300" />
        ))}
      </body>
    </html>
  );
}
```

Just like that we can write UI code just like we are used to! It is important to note that while this may feel very familiar this is *not* React, we are only imitating the syntax. We don't have any sort of vDOM or any kind of dynamic updating. Once the functions are run it's just a string not some fancy fiber tree that can detect changes for us. If we want the webview to be updated we are going to have to run everything over again with the updated values, and keep track of that manually. That isn't to say that any of our changes made this worse, we would have to do that anyways, it's just how the webviews are designed.

I hope this post was informative to anyone else who got annoyed writing wild template strings in their webviews. And don't forget this pattern can be used anywhere that you feel JSX might help you out, don't be afraid to experiment in your projects!
