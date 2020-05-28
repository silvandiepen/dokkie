# Templates

Dokkie comes with a few html templates. You can use these, or create your own template based on Dokkie's.

### Use your own

```bash
    npx dokkie --template=myown-template.html
```

### Simple Template

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ title }}</title>
		<link rel="stylesheet" type="text/css" href="{{ style }}" />
	</head>
	<body>
		<div class="content">
			{{{ content }}}
		</div>
	</body>
</html>
```

### Default Template

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ title }}</title>
		<link rel="stylesheet" type="text/css" href="{{ style }}" />
	</head>
	<body>
		{{#if navigation.[2] }}
		<nav>
			<ul>
				{{#each navigation}}
				<li><a href="{{ link }}">{{ name }}</a></li>
				{{/each}}
			</ul>
		</nav>
		{{/if}}
		<div class="content">
			{{{ content }}}
		</div>
	</body>
</html>
```

### Advanced Template

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ title }}</title>
		<link rel="stylesheet" type="text/css" href="{{ style }}" />
		<script src="https://myCDN.com/prism@v1.x/components/prism-core.min.js"></script>
		<script src="https://myCDN.com/prism@v1.x/plugins/autoloader/prism-autoloader.min.js"></script>
	</head>
	<body>
		{{#if navigation.[2] }}
		<nav>
			<ul>
				{{#each navigation}}
				<li><a href="{{ link }}">{{ name }}</a></li>
				{{/each}}
			</ul>
		</nav>
		{{/if}}
		<div class="content">
			{{{ content }}}
		</div>
	</body>
</html>
```
