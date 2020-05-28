# Dokkie

Dokkie gets your Readme Documentation into a page with one command. Don't bother doing anything else, just keep your Readme up to date and automatically generate a complete webpage out of it.

You know, when you make a package, you create a Readme.md. Well, that
exact readme.md will be converted into a html page. So you can just deploy
your package as a little documentation website.

Just keep your README up to date, and Dokkie does the rest.</p>

### Usage

Add this to your scripts

```bash
    "dokkie": "npx dokkie"
```

### Deployment

There are many ways to deploy your documentation. My recommended way is to check netlify. Create an account, link it to your git provider (github, gitlab, bitbucket, etc) and create a new site.

### Configuration

By default, you don't have to do anything! It will automatically create your documentation website. But, there are quite some things you can change.

| argument    | default                    | description                                                   |
| ----------- | -------------------------- | ------------------------------------------------------------- |
| input       | `.`                        | Input folder to search for files.                             |
| output      | `docs`                     | Output folder for pages                                       |
| layout      | `default`                  | Html layout used                                              |
| cleanBefore | `true`                     | Remove the docs folder before creating a new one.             |
| extensions  | `.md`                      | All file extensions which can be used (supported; .md, .html) |
| exclude     | `node_modules, dist, docs` | Exclude folders from searching for files.                     |
