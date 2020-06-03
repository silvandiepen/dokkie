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
		{{#if package.description}}
		<meta name="description" content="{{ package.description }}" />
		{{/if}} {{#if package.keywords}}
		<meta name="keywords" content="{{ package.keywords }}" />
		{{/if}} {{#if package.author}}
		<meta name="author" content="{{ package.author }}" />
		{{/if}}
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ title }}</title>
		{{{ styles }}} {{{ scripts }}}
	</head>

	<body id="{{currentId}}">
		<!--- Main Content -->
		<main id="main" class="content">
			{{{ content }}}
		</main>
	</body>
</html>
```

### Default Template

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		{{#if package.description}}
		<meta name="description" content="{{ package.description }}" />
		{{/if}} {{#if package.keywords}}
		<meta name="keywords" content="{{ package.keywords }}" />
		{{/if}} {{#if package.author}}
		<meta name="author" content="{{ package.author }}" />
		{{/if}}
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ title }}</title>
		{{{ styles }}} {{{ scripts }}}
	</head>

	<body id="{{currentId}}">
		{{#if headerNavigation }} {{#if navigation.[2] }}
		<!--- Page Header -->
		<header id="header">
			<nav>
				<ul>
					{{#each navigation}}
					<li>
						<a href="{{ link }}">{{ name }}</a>
						{{#if children.[1] }}
						<ul>
							{{#each children}}
							<li><a href="{{ link }}">{{ name }}</a></li>
							{{/each}}
						</ul>
						{{/if}} {{/each}}
					</li>
				</ul>
			</nav>
		</header>
		{{/if}} {{/if}} {{#if sidebarNavigation }} {{#if navigation.[2] }}
		<!--- Page Header -->
		<sidebar id="sidebar">
			<nav>
				<ul>
					{{#each navigation}}
					<li>
						<a href="{{ link }}">{{ name }}</a>
						{{#if children.[1] }}
						<ul>
							{{#each children}}
							<li><a href="{{ link }}">{{ name }}</a></li>
							{{/each}}
						</ul>
						{{/if}} {{/each}}
					</li>
				</ul>
			</nav>
		</sidebar>
		{{/if}} {{/if}}

		<!--- Main Content -->
		<main id="main" class="content">
			{{{ content }}}
		</main>

		<!--- Page Footer Content -->
		<footer id="footer">
			{{#if footerNavigation }}
			<nav>
				<ul>
					{{#each navigation}} {{#if (eq link ../currentLink) }}
					<li class="active">{{/if}} {{#if (ne link ../currentLink) }}</li>

					<li>
						{{/if}}

						<a href="{{ link }}">{{ name }}</a>
						{{#if children.[1] }}
						<ul>
							{{#each children}} {{#if (eq link ../../currentLink) }}
							<li class="active">
								{{/if}} {{#if (ne link ../../currentLink) }}
							</li>

							<li>
								{{/if}}
								<a href="{{ link }}">{{ name }}</a>
							</li>
							{{/each}}
						</ul>
						{{/if}}
					</li>
					{{/each}}
				</ul>
			</nav>
			{{/if}} {{#if package}}
			<footnote>
				{{#if package.name}}<span>{{package.name}}@{{ package.version }}</span
				>{{/if}} {{#if package.license}}<span>{{ package.license }}</span
				>{{/if}} {{#if package.author}}<span>&copy; {{ package.author }}</span
				>{{/if}}
			</footnote>
			{{/if}}
		</footer>
	</body>
</html>
```
