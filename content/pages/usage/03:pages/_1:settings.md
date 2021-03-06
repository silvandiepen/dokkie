### Settings

If you want to have a specific page under another root, but you don't want to change the position of the file in your folder structure. You can add metadata to the markdown file.

For instance, the License.md in this project should be placed in the root in order to be picked up by certain platforms as the License. But you don't want to show the license directly in your menu. In that case you can add meta data as following to your file.

```md
---
parent: about
---
```

This markdown file will be placed under "about". (see this documentation). More about the menu property in the settings in [Navigation](/usage/navigation#Settings-from-within-the-page).

There are a few other options you can add to the metadata which can be used;

| key    | default            | options                     | description                                                                            |
| ------ | ------------------ | --------------------------- | -------------------------------------------------------------------------------------- |
| title  | first H1 from file |                             | The title will be used in the menu and route instead of the h1 in the top of the page. |
| parent | Current parent     |                             | Parent will be the folder where file is placed in the route                            |
| hide   | `false`            |                             | Add `hide: true` if you don't want the page to show up in the menu                     |
| remove | `false`            |                             | add `remove: true` if you don't this file to be used at all.                           |
| menu   | All menus          | `header`,`footer`,`sidebar` | Add the page only to a specific menu only.                                             |
