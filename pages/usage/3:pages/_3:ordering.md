## Ordering

By default the pages will in the menu will be ordered alphabetically. But if you want a different order you can also achieve this.

You can create filesnames with a `:` in it. Everything before the `:` will not be used in routes or names. Which means that you could for instance a number `1:filename.md` and this file will be added to the top in the menu.

The same counts for the ordering of the partials in. They will also be added to the main file based on alphabetical order. Which means you can prefix the files with anything before the `:` to be ordering your page.

### Example

An example of the documententation for this pages page;

```
3:pages
    - _1:settings.md
    - _2:partials.md
    - _3:ordering.md
```

Which results in the `pages` being the third item in the menu under usage and the sections of this page being in the order or the order above.
