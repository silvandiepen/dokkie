---
title: Blog
---

# Creating a blog

Besides easily creating documentation, you can also use Dokkie to build your blog! The only thing you do is set up a repository with markdown files and build it with one command;

```bash
npx dokkie --type=blog
```

### Sorted on date.

Blogs are automatically ordered by their file creation date. If you don't want that, you can set an alternate date in your files with the following format;

```md
---
date: 2020-02-22
---
```

### Meta

A blog post by default has just a title and text, but if you want to give extra info like the tags. You can also just add them to your post;

**Tags**

```md
---
tags: test, tag, for, post
---
```

**Author + Link**
The author also supports a authorLink, which will automatically be the link for the author when clicked on.

```md
---
author: Sil
authorLink: https://silvandiepen.nl
---
```
