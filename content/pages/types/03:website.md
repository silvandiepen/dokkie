# Website

With Dokkie you can create also a full web page with sections and columns using just Markdown files.

You can find an example of a dokkie website on [website-example.dokkie.dev](https://website-example.dokkie.dev).

## Usage

```bash
npx dokkie --type=website
```

## Section & Partials

Website are build up out of Sections and Partials.

### Partials

Partials can be achieved by adding `_` in front of a markdown file. Every file with an underscore will automatically be added to the parent (readme.md) in alphabetical order. In this way you can build up a full page from several files.

### Sections

Sections have a column layout. A section will be be added to it's parent when the folder has an `_` AND defined a layout in the meta data like

`_overview/readme.md`

```markdown
---
layout: thirds
---
```

Will result in a three column layout using the other `_`-partials as it's content.

### Columns

As for now, there are three options to use;

- **full** 1 column layout
- **half** 2 columns layout
- **thirds** 3 columns layout
