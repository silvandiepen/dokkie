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
