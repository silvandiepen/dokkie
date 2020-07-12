### Settings

**Default configuration**

| argument         | default                    | options                                                 | description                                                                                                |
| ---------------- | -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `input`          | `.`                        | any folder                                              | Input folder to search for files.                                                                          |
| `output`         | `dokkie`                   | any new folder                                          | Output folder for pages                                                                                    |
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
| `projectTitle`   | `""`                       |                                                         | Title of the documentation                                                                                 |
| `favicon`        | Custom generated           | path to image                                           | Create favicons and other meta tags automatically                                                          |
| `skip`           | `null`                     | `favicons`                                              | Skip parts of the build process to speed it up. For now this can only be done with Favicons                |
| `config`         | `dokkie.config.json`       | path to json config file                                | Give an alternative path to the config for dokkie                                                          |
| `logging`        | `[]`                       | `silent`, `debug`                                       | Run Dokkie with silent mode or debug.                                                                      |
| `language`       | `en`                       | Any language shortname, ex; `en`, `nl` or `es`          | Language of the page, this is set in the templates                                                         |
