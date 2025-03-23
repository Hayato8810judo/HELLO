# More Node.js: NPM, package.json, and .nvmrc

If you’re working with Node.js, you’ll hear about NPM, package.json, and .nvmrc all the time. These tools help us manage dependencies, run scripts, and ensure we’re using the right version of Node.js.

Let’s break down each part step by step.

## What is NPM?

NPM (Node Package Manager) is the default package manager for Node.js. It lets us:

- Install dependencies (libraries and frameworks we need).
- Run scripts (like starting a server or compiling code).
- Manage different versions of libraries to keep projects stable.

Whenever you install Node.js, you automatically get NPM with it.

## What is package.json?

package.json is the configuration file for a Node.js project. It tells us:

- What dependencies the project needs.
- What scripts we can run.
- What Node.js version we should use.

You can think of it as the "blueprint" for a Node.js project.

## How Do We Create package.json?

To generate it, run:

```
npm init -y
```

This creates a package.json file with default values.

Here’s what a basic package.json looks like:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon --ext ts --exec ts-node src/index.ts"
  },
  "dependencies": {
    "express": "^4.17.3"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## What Are Dependencies?

Dependencies are external code libraries that our project needs.

### 1. Regular Dependencies (dependencies)

These are libraries our app needs to run. For example:

```
npm install express
```

This adds Express (a web server library) and updates package.json:

```json
"dependencies": {
  "express": "^4.17.3"
}
```

If someone else downloads this project, they can install everything with:

```
npm install
```

### 2. Development Dependencies (devDependencies)

These are tools we need only during development, like TypeScript and testing libraries.Example:

```
npm install --save-dev typescript ts-node
```

Updates package.json:

```json
"devDependencies": {
  "typescript": "^5.0.0",
  "ts-node": "^10.9.1"
}
```

## What Are NPM Scripts?

NPM scripts let us run commands without typing long terminal commands.

In package.json, we define scripts inside the "scripts" section:

```json
"scripts": {
  "start": "node dist/index.js",
  "dev": "nodemon --ext ts --exec ts-node src/index.ts",
  "build": "tsc",
  "test": "jest"
}
```

Now, instead of typing long commands, we can just run:

- `npm run dev`   # Starts the server in dev mode
- `npm run build` # Compiles TypeScript to JavaScript
- `npm run start` # Runs the compiled server

This makes development easier and enforces consistency across the team.

## Why Do We Fix the Node.js Version?

Different Node.js versions support different features. If everyone on the team runs slightly different Node.js versions, things might break unexpectedly.

To prevent this, we specify a required version in package.json:

```json
"engines": {
  "node": ">=18.0.0"
}
```

This warns users if they are using an unsupported version of Node.js.

## What is .nvmrc and Why Do We Use It?

.nvmrc is a simple file that tells NVM (Node Version Manager) which Node.js version to use. The dot (.) at the beginning of the filename means it is a hidden file on Unix-based systems like macOS and Linux. If you don’t see it in your file explorer, you may need to enable hidden files in your system settings:

- On macOS Finder, press Cmd + Shift + . to toggle hidden files.
- In Visual Studio Code, go to Explorer and check if hidden files are enabled.


Now, when someone opens this project, they can run: `nvm use`. This automatically switches their system to the correct Node.js version.

### How to Install NVM

To install NVM, follow the official instructions on NVM's website.

On macOS or Linux, you can install it with:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

## Another Important Dot File: .gitignore

A .gitignore file tells Git which files and directories to ignore when committing changes. This keeps the repository clean and prevents unnecessary or sensitive files from being tracked.

For a Node.js project, we typically include:

- node_modules/ : node_modules/ contains all installed dependencies, which can be reinstalled using npm install. There's no need to track them in version control.
- dist/ : dist/ contains compiled files (e.g., JavaScript output from TypeScript). Since they are generated, they don't need to be stored in Git.
