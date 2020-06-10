---
date: 2020-06-02
---

# Create a blog in three steps using Dokkie, Github and Netlify.

Dokkie makes it really easy to setup a blog. Assuming you have a Github and Netlify account already set up.

### 1. Create

Create a Github repository and add a `welcome.md` (markdown files in it).

**welcome.md**

```
# My first post
```

### 2. Deploy

Go to netlify, log in and "New site from git". Find your repository and use the following build command:

Build Command: `npx dokkie --type=blog`
Plublish directory: `blog`

### 3. Done!

Your blog is online! Netlify will give you a link where the blog is where you can add your own domain or anything. Every time you add a file to your repository, the blog will be updated automatically.
