# Templates

Dokkie comes with a few html templates. You can use these, or create your own template based on Dokkie's.

### Use your own

```bash
    npx dokkie --template=myown-template.html
```

### Simple Template

<script src="https://gist-it.appspot.com/github/silvandiepen/dokkie/blob/master/template/simple.hbs"></script>

### Default Template

<script src="https://gist-it.appspot.com/github/silvandiepen/dokkie/blob/master/template/default.hbs"></script>

### Blog Template

<script src="https://gist-it.appspot.com/github/silvandiepen/dokkie/blob/master/template/blog.hbs"></script>

## Inject Html

It's also possible to inject html into the templates.

**dokkie.config.json**

```json
{
	"injectHtml": {
		"mainBefore": "<my-html>string</my-html>"
	}
}
```

**options**

| option         | description                    | availabe in layout |
| -------------- | ------------------------------ | ------------------ |
| headerBefore   | Add html in top of header      | default, blog      |
| headerAfter    | Add html in bottom of header   | default, blog      |
| sidebarBefore  | Add html in top of sidebar     | default            |
| sidebarAfter   | Add html in bottom of sidebar  | default            |
| mainBefore     | Add html in top of main        | default            |
| mainAfter      | Add html in bottom of main     | default            |
| footerBefore   | Add html in top of footer      | default            |
| footerAfter    | Add html in bottom of footer   | default            |
| overviewBefore | Add html in top of overview    | blog               |
| overviewAfter  | Add html in bottom of overview | blog               |
| articleBefore  | Add html in top of article     | blog               |
| articleAfter   | Add html in bottom of article  | blog               |
