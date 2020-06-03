# Configuration

Configuration can be done multiple ways, the easiest way is doing this through the API, you can set all navigation just in your build script during deployment. But you could also add a `dokkie.config.json` to your repository where you can set all configuration, in that case you can just run `npx dokkie` and it will set it all.

### Settings

**Default configuration**

| argument         | default                    | options                                                 | description                                                                                                |
| ---------------- | -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `input`          | `.`                        | any folder                                              | Input folder to search for files.                                                                          |
| `output`         | `docs`                     | any new folder                                          | Output folder for pages                                                                                    |
| `layout`         | `default`                  | `default`,`simple`,`advanced` or a custom hbs/html file | Html layout used                                                                                           |
| `theme`          | `coat`                     |                                                         | When a default layout is chosen, you can choose a theme from (coat)[https://coat.guyn.nl]                  |
| `cleanBefore`    | `true`                     | `true` / `false`                                        | Remove the docs folder before creating a new one.                                                          |
| `extensions`     | `.md`                      | `.md`,`.html`                                           | All file extensions which can be used (supported; .md, .html)                                              |
| `exclude`        | `node_modules, dist, docs` | any folder                                              | Exclude folders from searching for files.                                                                  |
| `copy`           | `null`                     | any folder                                              | "Copy a folder into your output.                                                                           |
| `strip`          | `pages`                    | any folder                                              | Remove parts of paths to get files directly in their root. All files in `pages`, will be directly in docs. |
| `showNavigation` | `header, footer`           | `header`, `footer`,`sidebar`                            | Define which navigations should be shown                                                                   |
| `flatNavigation` | `false`                    | `true` / `false`                                        | Make the navigation flat.                                                                                  |
| `codeHighlight`  | `true`                     | `true` / `false`                                        | Use Prism to create highlighted code                                                                       |

### API

All above settings can be altered using the cli

**example**

```bash
npx dokkie --input=docs --output=dist --cleanbefore=false --copy=themes --showNavigation=header,footer,sidebar
```

### Settings files

Dokkie also accepts a settings file in the root of your project (or root of where your input is).

**example**

```json
{
	"input": "docs",
	"output": "dist",
	"cleanBefore": false,
	"copy": ["themes"],
	"showNavigation": ["header", "footer", "sidebar"]
}
```

### Alternative layouts

Use the `layout` option to define which layout you want to use. More about (layouts)[/usage/templates].

### Alternative styling and scripts

Styles and scripts can be added or overruled in the default layouts.

### add

Adding can be done, this will just ad the extra stylesheets or scripts besides the current ones.

**dokkie.config.json**

```json
{
	"add": {
		"stylesheets": ["/mystylesheet.css"],
		"scripts": ["/my-app.js"]
	}
}
```

#### overrule

Overrule means the current stylesheets won't be added, but instead the given stylesheets will be used.

**dokkie.config.json**

```json
{
	"overrule": {
		"stylesheets": ["/mystylesheet.css"],
		"scripts": ["/my-app.js"]
	}
}
```
