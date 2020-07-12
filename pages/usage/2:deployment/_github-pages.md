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
