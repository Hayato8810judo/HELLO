# Collaborating with Git

In the previous guide, we introduced Git and used it to push code to GitHub. Now, we’re going to see how Git helps us collaborate effectively. When multiple people work on the same project, we need a way to:

- Work on changes without affecting the main code.
- Experiment with new ideas while keeping a stable version available.
- Share our work with others and review their changes.

This is where branches and Pull Requests come in.

## Understanding Branches

Branches in Git are cheap copies of the code that allow us to work on changes without affecting the main version. Think of a branch as a temporary workspace where you can experiment and make modifications. If something goes wrong, you can always switch back to the main branch, and nothing is lost.

With branches, you can:

- Work on new features without breaking existing code.
- Switch between different versions of your project.
- Submit changes for review before merging them into the main codebase.

Let's go through the process of creating a branch, making changes, and switching back and forth between branches before issuing a pull request.

## Checking Your Current Branch

Before creating a new branch, it's useful to check which branch you're currently on. You can do this by running:

```
git branch
```

This command lists all available branches and highlights the one you're currently on. Most likely, you're on main.

If you want to confirm explicitly, use:

```
git status
```

It will display information about your working directory, including the branch name.

## Creating a Branch and Making Changes

We're going to modify our Node.js server so that it accepts a query parameter to customize the greeting message. Right now, our server always responds with "Hello, world!", but we want to allow a name to be passed in, like this:

[http://localhost:3000/?name=Hayato](http://localhost:3000/?name=Hayato)

This should return "Hello, Hayato!" instead of just "Hello, world!"

### Step 1: Create a New Branch
Before making changes, create a new branch to keep our updates separate from the main version:
git checkout -b hayato/custom-greeting
git checkout -b creates and switches to a new branch called hayato/custom-greeting (we frequently use our name and then a slash so that we remember whose is whose).
Now you are in your own isolated workspace, separate from main
### Step 2: Modify the Code

Open hello-server.ts and update it to handle a query parameter for a name:

```ts
import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

function handler(req: IncomingMessage, res: ServerResponse) {
  const query = parse(req.url, true).query;
  const name = query.name ? query.name.toString() : "world";

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Hello, ${name}!`);
}

const server = createServer(handler);

server.listen(3000, function() {
  console.log(`Server running at http://localhost:3000/`);
});
```

### Step 3: Save and Test the Changes

Save the file and restart the server: `ts-node server.ts`

Open your browser and test different URLs:

- http://localhost:3000/ → should return "Hello, world!"
- http://localhost:3000/?name=Hayato → should return "Hello, Hayato!"

### Step 4: Switch Between Branches

Let's say we want to go back to the original version of our code (before adding the name parameter). We can switch back to the main branch without losing our changes:

```
git checkout main
```

Now, if you restart the server and test it, you'll notice that it's back to saying just "Hello, world!" because our new feature only exists on the hayato/custom-greeting branch.

To go back to our new feature, simply switch branches again:

```
git checkout hayato/custom-greeting
```

Now you're back to your modified version with the query parameter support.

## Committing and Pushing the Changes

Once you're happy with the changes, it's time to save them in Git. Run the following commands:

```
git add server.ts
git commit -m "Added query parameter support for custom greetings"
```

- `git add server.ts` stages the modified file.
- `git commit -m` saves the change with a message describing what was done.

Next, push the branch to GitHub:

```
git push origin feature/custom-greeting
```

Unlike your first commit, this won't immediately show up on the main page of the repository. GitHub defaults to showing the main branch, so you have to click to view your new branch.

To see your branch and create a Pull Request:

1. Go to your repository on GitHub.
2. Click the "Branches" dropdown.
3. Find feature/custom-greeting.
4. Click "Compare & pull request" to start the PR process.

## Merging Without a Pull Request
While creating a Pull Request is the recommended way to collaborate (since it allows me to review and discuss possible improvements), you don’t need a PR to merge your code. You can merge it directly using the command line:

```
git checkout main
git merge feature/custom-greeting
```

More details on merging manually: [Git Merge Documentation](https://git-scm.com/docs/git-merge)
However, using a Pull Request allows me to see your code, critique it, and discuss improvements before merging. This is a key part of effective collaboration in software development.

## Next Steps

Once you get here, send me the URL of your Pull Request. You have essentially experienced writing both front-end and back-end code. Real backends do far more than just implement an if/else based on the URL—they save data to databases, handle authentication, and manage complex business logic. Real frontends do more than format a greeting—they display data dynamically, interact with users, and connect with backends to create fully functional applications.

Up until now, I’ve been teaching you how to build a website using only the tools that come with Node.js, but in reality, most developers use frameworks and libraries—code that other people have built to make handling complex tasks easier and more efficient. We'll start using some of these soon to make our development faster and more scalable.

We haven’t touched HTML or Databases yet, and most developers prefer specializing in one before the other. Our next steps will involve adding more complexity on both sides.

- If you find yourself more interested in handling how data is stored and processed, we’ll focus more on backend development.
- If you prefer designing how things look and interact with users, we’ll shift towards frontend development.

Once you start to feel a preference, let me know, and we’ll optimize for you to tackle those tasks while I focus on the other side. Looking forward to your Pull Request!
