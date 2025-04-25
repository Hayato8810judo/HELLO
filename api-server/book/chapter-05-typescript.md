# What Exactly is TypeScript? 🤔

If you already know JavaScript, TypeScript is like JavaScript with a safety net. It helps catch mistakes before your code runs by checking types—hence the name TypeScript.

Think of it this way:
- JavaScript lets you do anything—even if it’s wrong.
- TypeScript checks your work first—so you don’t break things later.

## How Does TypeScript Catch Errors?
The key feature of TypeScript is types. These tell the system what kind of values a variable or function should accept.

For example, here’s a common JavaScript mistake:

```js
function addNumbers(a, b) {
  return a + b;
}
console.log(addNumbers(5, "10")); // Oops! Returns "510" instead of 15.
```

Because JavaScript doesn’t check types, it treats "10" as a string instead of a number. JavaScript doesn’t complain—until it silently does something weird.

In TypeScript, we can enforce the type of each variable:

```ts
function add(a: number, b: number) {
  return a + b;
}
console.log(add(5, "10")); // ❌ ERROR: '10' is not a number.
```

Instead of letting us run bad code, TypeScript stops us right away with an error message.

This is what makes TypeScript so powerful—it prevents these kinds of mistakes before the code even runs.

## What is Compiling? (And Why Do We Do It?)

Here’s the catch: Node.js and browsers don’t understand TypeScript. They only understand JavaScript.

That’s why we compile (transform) TypeScript into JavaScript before running it. This process does two things:

1. Checks your code for errors – If TypeScript finds a mistake, it won’t let you compile until you fix it.
2. Converts TypeScript (.ts) into JavaScript (.js) – Once it’s error-free, TypeScript translates your code so Node.js or the browser can run it.

This forces us to catch mistakes before they affect real users.

## Why Not Just Use ts-node?

If you’ve been using ts-node in development, that’s totally fine! It lets you run TypeScript without compiling first, which is great for quick testing.

However, in production, using ts-node is not a good idea because:

- ✅ Performance – Compiled JavaScript runs faster than live-converted TypeScript.
- ✅ Reliability – Compilation catches more issues than ts-node running on the fly.
- ✅ Deployment Simplicity – Production servers don’t need TypeScript’s extra information, just the compiled JavaScript.

## How Do We Compile TypeScript?

The command that compiles TypeScript is `tsc`, which stands for TypeScript Compiler.

This will check for errors and convert TypeScript (.ts) into JavaScript (.js). Try it out.
