# Favicons

Dokkie automatically creates a favicon for you. But if you don't like that one, you can ofcourse just
change that into any image you want.

**cli**

```bash
npx dokkie --favicon=your/image/file.jpg
```

**dokkie.config.json**

```json
{
	"favicon": "your/image/file.jpg"
}
```

> **_NOTE:_** Make sure the file is quite big in size; recommended: (1024x1024)

### Meta data

The favicon generator comes with a lot other meta data which is auto included in your head. Turning favicons off, also affects this.

### Skip favicons

If you don't want favicons. For instance in a development environment or you will use your own through a custom template and copy. You can skip them.

**cli**

```bash
npx dokkie --skip=favicons
```

**dokkie.config.json**

```json
{
	"skip": ["favicons"]
}
```
