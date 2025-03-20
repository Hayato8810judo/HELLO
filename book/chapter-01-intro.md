# Introduction
 
## Text Editor

First things first, we need a text editor. There is no shortage of options and they range from just using TextEdit.app that comes with Mac OS to downloading something like Visual Studio Code from Microsoft.

While I use something ridiculous called vim, I suggest you start with Visual Studio Code because it provides a user-friendly interface, built-in debugging tools, and helpful features like syntax highlighting and code completion, making it a great choice for beginners.

Now you can create new files, edit them, and save them—essential skills for programming.

## Terminal

Next, you need to get acquainted with "the terminal"—this is the black screen with green text you see hackers type into in the movies. Locate Terminal.app on your computer and open it.

This is sometimes called “bash”, "unix," "the shell" or “the command line”—the differences aren’t important just yet. The best way to think of the terminal is as a window into the foundation of your computer, underneath all the graphical interfaces. Learning how to use the terminal is essential for programming because it allows you to run scripts, install dependencies, and collaborate with others efficiently.

The most important things to know are that it lets you navigate the folders of your hard drive and that commands must be typed to make anything happen. Here are some basics:

- pwd (print working directory) - Displays the current directory you’re in.
- ls (list directory contents) - Shows all the files and folders in the current directory.
- cd (change directory) - Moves between different folders.
- mkdir (make directory) - Creates a new folder.

Let’s use it. Make a new directory and then "go inside" it:

```
cd ~
mkdir Development
```

~ is a shortcut for "my home directory." If you type open ~, you’ll see that we created a folder alongside Documents and Downloads. This is where we’ll store projects.

Now, create a project folder:

```
mkdir ~/Development/hello
cd ~/Development/hello
```

As you’ve probably noticed, in the terminal, you’re always "in" a folder at a time. Commands are relative to your current folder, but you can also use absolute paths like ~/Development/hello to work with files anywhere on your system.

Great! You’re now ready to move forward.

### Homebrew

Before we continue, take a quick break and visit Homebrew’s website. Homebrew is a package manager–basically an app store–that allows us to install command-line programs easily.

Let’s check if we have homebrew already installed: `which brew`

which is another command in the terminal that finds programs. If you do not have homebrew installed you will be told “brew not found.” Otherwise, you’ll be told where homebrew is installed.

If brew is not found, we’re going to install it. While you should generally avoid pasting commands into the terminal without understanding them, follow Homebrew's installation instructions by running the command they provide. It will look something like this:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Hit enter and let it install. We’ll use this later.

### Programming

#### Hello World

The first thing you learn how to do in every programming language is how to print "Hello World."

In Bash, we do this using the echo command. Open your terminal and type:

```
echo "Hello World"
```

Hit enter, and you should see: Hello World

It might not seem like it, but this is programming—this is Bash, a scripting language used to automate tasks.

Typing commands like this is fine for quick tasks, but if we want to reuse our code, we need to write it into a file so we can run it later without retyping everything. Let's create a Bash script to store our Hello World program.

Open Visual Studio Code, create a new file in our project folder called hello.sh, and enter the following:

```
echo "Hello World"
echo "Goodbye World"
Save the file and return to the terminal.
Make sure you are in the correct directory:
cd ~/Development/hello
```

Run your script: `bash hello.sh`

You should see:
Hello World
Goodbye World

Congratulations on your first program.

#### JavaScript

JavaScript is one of the most popular languages out there because it’s relatively straightforward and it runs in everyone’s web browsers. Websites are created frequently using JavaScript “on the frontend” and even sometimes on the back (server-side).

MacOS includes some programming languages by default (like Bash), but we need to install others. For reasons you don’t need to know, JavaScript is called Node.js when you install it on your computer. Check if Node.js is installed by running: which node

If it’s not found use homebrew to install it: `brew install node`

Let’s try and simulate what we did earlier. Type node and hit enter. You should see something like this:

```
Welcome to Node.js v23.9.0.
Type ".help" for more information.
>
```

We have “left bash” and “entered” node. We can write JavaScript here. Type console.log(“Hello World”) and hit enter and you’ll see a familiar greeting back. To exit hit Ctrl-D.

Now, create a JavaScript file. Open Visual Studio Code, create a new file called hello.js, and enter:

```js
console.log("Hello World");
console.log("Goodbye World");
```

Save the file and return to the terminal.

Run it: `node hello.js`

You’ve now written the same program in two different languages.

Bonus: If you want to make your program more interesting change it to this and experiment running it with node hello.js as well as node hello.js Hayato.

```
const noun = process.argv.length[2] ?? “World”;
console.log("Hello " + noun);
console.log("Goodbye " + noun);
```

#### TypeScript

Every programming language you install often comes with a package manager of its own—so much so that it's often joked about in the developer community. When we installed Node.js, we also got npm, the Node Package Manager. npm allows us to install and manage JavaScript and TypeScript code and tools easily, similar to homebrew.

TypeScript builds on JavaScript by adding static typing, making large-scale collaboration easier. They’re very similar. Let’s install it using npm:

```
npm install -g typescript ts-node
```

Now, create a TypeScript file by renaming your JavaScript file: `mv hello.js hello.ts`
(We rename files on the command line by simply moving them to a new location. mv is the move command.)
Run it using ts-node rather than node: `ts-node hello.ts`

Now you’ve used three different languages! Take a break before we dive into Git!

### Version Control & Collaboration

#### Git

There is another program you need moving forward called Git. Git tracks changes in your code. (it’s a type of version control software) and we use it on the command line. First, check if it’s installed: `which git`

If not, install it: `brew install git`

You should know that git is very daunting at first, but once you get familiar with it, it will feel magical. Navigate to our project and initialize a “git repository”:

```
cd ~/Development/hello
git init
git status
```

You should see something like this:

```
On branch main
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
    hello.sh
    hello.ts
```

Git is describing hello.sh and hello.ts as “untracked” which means it’s not watching them for changes. We want it to, so let’s “add the files to it.”

```
git add hello.sh hello.ts
git commit -m "First commit"
```

The first command adds the files. The second command takes a snapshot or a “commit.” We usually write a note alongside every commit to explain what new changes are included.

I’m not going to teach you all the details of git right away. Luckily code editors like Visual Studio might have buttons to make it easier than using the terminal, but knowing the basics is important.

If you want to learn more you can search for videos on youtube or watch the videos on git’s official website: https://git-scm.com/videos. There’s no shortage of tutorials and books on the topic, but similar to Judo you’ll learn 100x more by “playing with it” rather than reading about it.

#### Github.com

Programmers primarily use git with a website called Github that makes programming with others easier. It helps facilitate sharing commits with one another so that we can work on the same code at the same time without stepping on each other’s toes. The website also has tools that make it easier to reconcile when we both change the same code.

If you haven’t already, sign up for an account on github.com. Afterward, to github.com/new to create a new repository. Name it hello (like our project folder). Make sure not to click any of the options under “initialize this repository with.”

Once you do this, you’ll be given instructions on how to add your code (look at the bottom under “…or push an existing repository from the command line”):

```
git remote add origin https://github.com/<your-user-name>/hello.git
git branch -M main
git push -u origin main
```

Copy and paste their version (which will have your username in the URL) and hit enter.

Refresh the Github page and you should see your code published for anyone else to contribute to.

#### Next Steps

Once you get here, send me the URL of your project. I will copy the files to my machine and make some contributions to teach you how we’ll transform this code into our website.
