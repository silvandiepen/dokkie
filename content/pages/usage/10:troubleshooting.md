# Troubleshooting

Sometimes things go wrong, that doesn't mean you are doing something wrong, but Dokkie doesn't recognize it well. Here are some things which can be easily solved or sometimes not.

### Styling doesn't load.

You are probably trying to deploy your generated dokkie in a subfolder. That shouldn't be an issue but for now it unforatunately is. All links to styling and images are relative. That means that your browser tries to get the assets from the direct domain.

**fixes**

- Deploy your website on a direct domain/subdomain.

**Issues**

- [Dokkie in a subfolder #24](https://github.com/silvandiepen/dokkie/issues/24)
