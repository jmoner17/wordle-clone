This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# How to run this project

## 1. install npm and node globally.

### What do I mean by "you will need npm and node installed globally"?

A global installation means that you can run node and npm commands from any terminal session. Without doing this you may run into issues

Even if the account you are using is a privileged user (an account apart of the sudo group) whenever you run any npm task using "sudo" (or any task) this service will run as root and will use images of npm and node that were exclusively installed on the root account. This means any images of npm or node that you have installed on your account will not be used. 

To test if this is an issue. You can run both.
```bash
node -v
# then
sudo node -v

# or

npm -v
# then
sudo npm -v
```

If either of these commands gives you two different versions of npm/node or they don't exist as commands when running these commands as a privileged user. You are very likely to run into issues when using npm and node.

### How do I fix this issue?
Fixing this issue is very simple all you have to do is run these commands [here](https://deb.nodesource.com/) in your terminal.

If you get an issue such as:
```bash
 trying to overwrite '/usr/include/node/common.gypi', which is also in package libnode-dev 12.22.9~dfsg-1ubuntu3.3
dpkg-deb: error: paste subprocess was killed by signal (Broken pipe)
Errors were encountered while processing:
 /var/cache/apt/archives/nodejs_20.11.0-1nodesource1_amd64.deb
needrestart is being skipped since dpkg has failed
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

you will additionally need to run the command:
```bash
sudo apt-get remove libnode-dev
```

Then retry the nodesource commands once again [here](https://deb.nodesource.com/).

## 2. Clone this project from GitHub and switch to the proper branch

This project exists on a branch that is not on the main and will require you to switch this branch using git.

If you have not yet cloned this repository:
```bash
git clone https://github.com/OU-CS3560/s24-wordle-fibble-5
git checkout next-js
```

If you have already cloned this repository (this includes the main branch as well):
```bash
git fetch
git checkout next-js
```

### NOTE: DO NOT MAKE EDITS DIRECTLY TO THIS BRANCH. I HIGHLY RECOMMEND THAT YOU CREATE YOUR OWN BRANCH. YOU WILL CAUSE MANY REBASE ISSUES AND CODE CONFLICTS. THIS IS A HUGE PAIN TO DEAL WITH. ONLY MAKE COMMITS DIRECTLY TO THIS BRANCH IF YOU ABSOLUTELY KNOW WHAT YOU ARE DOING.

## 3. Install dependencies locally

As this project includes a .gitignore file, temp and build-specific files are not included. You will need to install these dependencies on your machine locally.

To do this, run these commands in the root directory of this project:
```bash
npm install -g npm-check-updates
ncu -u
npm install
```

If this command does not work you should check your file permissions and ownership. As a last-ditch effort you may use "sudo" but this is not recommended. 

This command is used to both install and update all dependencies for this project. I have already set up all config files for this project, but I still advise you to understand how these files work. You can find documentation on npm packages [here](https://docs.npmjs.com/)


## 4. Run this project in either dev or production mode.

When actively developing this project you can simply run:
```bash
npm run dev
```

When you want to run this project in a production environment you can run:
```bash
npm run build
npm run start
```


# Additional Information below

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
