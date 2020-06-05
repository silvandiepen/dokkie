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

> **_NOTE:_** Make sure the file is quite big in size; recommeded: (1024x1024)

### Skip favicons

If you don't want favicons. You can skip them.

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
