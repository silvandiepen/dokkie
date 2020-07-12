### Settings from within the page.

**Change menu in page**
Every page will automatically be placed in the navigation based on where the file is placed in the tree. This can be overruled by defining the menu in a markdown file;

The following file is only shown in the `footer` menu, not like by default in any other menu.

```markdown
---
menu: footer
---
```

**Change parent in menu**
Every page will automatically be placed in the navigation based on where the file is placed in the tree. This can be overruled by defining the parent in a markdown file;

The following file is placed in the root of your repository but should in the menu be placed under `usage` in the menu;

```markdown
---
parent: usage
---
```

---

::: warning
**Navigation depth**
For now the navigation won't go deeper than 2 levels. This means that levels deeper than 2, will simply not be shown in the menu. This does not mean they don't exist.
:::
