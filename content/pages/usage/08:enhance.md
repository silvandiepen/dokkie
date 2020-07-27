# Enhance

Or what it means, is the possibility to add extra scripts to enhance and make your project better.

### Search

By default the search is enabled, this means that you will always get a search when there are than 2 pages in your project. You can disable this by adding `--search=false`

### Scroll Classes

To make your header on mobile dissapear and appear when scroll automatically, we need to enable the scroll classes. This is a little bit of JavaScript which just adds a few classes which can be used for anything else too, if you want. You can

### Google Analytics

Adding Google Analytics to your project is as easy as adding it to your build scripts. You can

### Any ideas?

Please feel free to do a Pull Request, create an issue or just contact me.

### Usage

You can add functions through the CLI, Environment settings or in the config file;

**Cli**

```bash
--googleAnalytics=YOURCODE --scrollClasses=true --search=true
```

**Config**

```json
{
	"enhance": {
		"googleAnalytics": "YOURCODE",
		"scrollClasses": true,
		"search": true
	}
}
```

::: warning
By using the config, you will overrule the default. That means that if you still want the search, don't forget to add it.
:::

**env**

| key              | value    |
| ---------------- | -------- |
| GOOGLE_ANALYTICS | YOURCODE |
| SCROLL_CLASSES   | true     |
| SEARCH           | true     |
