# Deployment

## Using Netlify

1. Make sure you have an account at Netlify.
2. Login and click on "Net site from git"
3. Connect to your provider and find your repository.
4. Build commands;
5. ![Build command](https://i.ibb.co/YdYJ2Sf/Screenshot-2020-05-31-at-17-38-59.png)
   - Build command: `npx dokkie`
   - Publish directory: `dokkie`

## Github pages

1. Create a Github Action
2. Copy the following workflow

```yaml
name: Deploy Dokkie to GH Pages

on:
  push:
    branches:
      - master

jobs:
  deploy:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2

      - name: Dokkie
        run: npx dokkie

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dokkie
```

3. Push a change on your masterbranch and you are set!
4. Your docs now live at; ```https://[username].github.io/[reponame]
