# Dokkie

#### A Static site generator for your documentation without any extra code in your repository

Dokkie gets your Readme Documentation into a page with one command. Don't bother doing anything else, just keep your Readme up to date and automatically generate a complete webpage out of it.

You know, when you make a package, you create a Readme.md. Well, that
exact readme.md will be converted into a html page. So you can just deploy
your package as a little documentation website.

Just keep your README up to date, and Dokkie does the rest.

### Features

- **No code** Build a documentation website or blog without any code in your repository
- **Code highlighting** Automatic code highlighting for code examples
- **Automatic menu's** Create automatic menu's
- **Fully responsive**, obviously, it's 2020.
- **Static and fast**, just flat html
- **100\*4 Lighthouse score**, Google thinks it's fast :)
- **Multiple themes** All themes from [coat](https://coat.guyn.nl) can be used, or your own custom css.
- **Fully customizable**, because you want to give it your own look.

### Usage

Add this to your scripts

```bash
    "dokkie": "npx dokkie"
```

### Deployment

There are many ways to deploy your documentation. My recommended way is to check netlify. Create an account, link it to your git provider (github, gitlab, bitbucket, etc) and create a new site.

### Configuration

By default, you don't have to do anything! It will automatically create your documentation website. But, there are quite some things you can change.

[Configuration](/usage/configuration)

### Layouts

At the moment, Dokkie only supports one layout. This layout is defined in the package as 'default'. A custom layout can be used by giving a layout argument;

```bash
    npx dokkie --layout=src/my-own/layout.html
```

Dokkie uses Handlebars for templating and gives you the following options;

| option       | description                                                                                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content`    | The content of the files which are being rendered.                                                                                                                                                  |
| `Title`      | The title can be given as meta information in a markdown file. If not given, Dokkie will search for the first H1 in the file. If that's not found, the name of the file will be used for the title. |
| `Navigation` | Dokkie gives the template a navigation, which is build up out of all the files which are found.                                                                                                     |

#### Available Layouts

- **default** A default theme with navigation
- **simple** Simple html pages without any navigation
- **advanced** Advanced loads some extra scripts and enables code highlighting.

### Themes

When a default Layout is used, you can set the `theme` option. The themes are all being used from [coat](https://coat.guyn.nl).
