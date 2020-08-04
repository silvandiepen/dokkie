# Troubleshooting

Sometimes things go wrong, that doesn't mean you are doing something wrong, but Dokkie doesn't recognize it well. Here are some things which can be easily solved or sometimes not.

### Styling doesn't load.

You are probably trying to deploy your generated dokkie in a subfolder. That shouldn't be an issue but for now it unforatunately is. All links to styling and images are relative. That means that your browser tries to get the assets from the direct domain.

**fixes**

- Deploy your website on a direct domain/subdomain.

**Issues**

- [Dokkie in a subfolder #24](https://github.com/silvandiepen/dokkie/issues/24)

### Meta data isn't being loaded and comes in my page.

Make sure you add the meta data (the first ---) at the first line of your document. If not, the --- will be seen as a `hr` and being rendered as such.

### When I have more than 10 items, the order isn't right.

If you are adding numbers like `1:filename.md` to your files to get them in the right order. 10 will be "smaller" than 1 and thus will be ordered to the start. If you have have more than 10 items, just ad add 0 in front `01:filename.md` > `10:otherfile.md`.
