## Partials

A page can also be build out of partials. That means, that you can have multiple markdown files, which will form one page instead of separate pages.

For instance this Pages page is build up out of partials.

Partials can be made by giving a underscore `_` to your file in the beginning. That will make the file not be rendered as a page, but automatically added to the readme in the same same directory.

```
folder
    - Readme.md
    - _partial.md
    - _second-partial.md
```

Will become; `[website]/folder/index.html` with all the partials automatically added.
