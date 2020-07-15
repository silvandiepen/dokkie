# Scheduling a post

Sometimes, you don't want to post your post yet. Blokkie automatically only uses the posts which are made in the past. Giving in an alternative date in your post, in this case in the future. Will make sure you post won't be online yet.

Add a date (metadata) to the top your post.

**your-post.md**

```
---
date: 2022-01-01
---
```

This post will only be shown, when your blog will be deployed after the first of january 2022.

::: warning
This post, won't automatically come online on that date. You will have to do a deployment trigger on that date
:::
