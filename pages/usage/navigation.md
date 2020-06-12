# Navigation

There are multiple ways you can navigate through a website. Dokkie has multiple build in navigation options.

### Navigation types

By default you will get a footer navigation and a top navigation. But you can also add a sidebar navigation just like you see on this page.

**dokkie.config.json**

```json
{
	"showNavigation": ["header", "footer", "sidebar"]
}
```

### Flat navigation

Dokkie creates the navigation, like you structure your files. But if you want, you can also make the navigation completely flat.

**dokkie.config.json**

```json
{
	"flatNavigation": true
}
```

### Responsive

Header and Sidebar menu's will automatically be converted to their mobile counterpart when available. All menu's can be either shown or hidden on mobile/desktop.

The default setting of showing the header and footer navigation will automatically be converted. It is also possible to supply this object yourself in order to hide and show certain navigation on certain devices.

```json
{
	"showNavigation" [
		{ name: "header", mobile: true, desktop:true},
		{ name: "footer", mobile: true, desktop:true}
	]
}
```

For instance the Dokkie documentation has the following setting; The header and footer will always be shown, the sidebar will only be shown on desktop format.

```json
{
	"showNavigation" [
		"header",
		"footer",
		{ name: "sidebar", mobile: false, desktop:true }
	]
}
```

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
