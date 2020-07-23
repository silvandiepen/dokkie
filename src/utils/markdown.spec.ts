import { mdToHtml, getTitleFromMD } from "./markdown";
import { extractMeta, removeMeta } from "./markdown-meta";
import { IFile } from "../types";

const input: IFile = {
	name: "mock",
	ext: ".md",
	path: "/",
	data: `
# My name

Is Dokkie, I'm a static site generator`,
	html: "",
	meta: {},
};
const output = {
	document:
		'<h1 id="my-name">My name</h1>\n<p>Is Dokkie, I’m a static site generator</p>\n',
	meta: {},
};

describe("extractMeta", () => {
	it("Should not return any meta", async () => {
		// Assert
		expect(await extractMeta(input.data)).toEqual({});
	});
	it("Should return a title", async () => {
		const inputData = `---
title: test
---`;
		// Assert
		expect(await extractMeta(inputData)).toEqual({ title: "test" });
	});
	it("Should return a full object of metadata", async () => {
		const inputData = `---
title: test
layout: something-else
and something: which is harder to do
plus: 0
---`;
		// Assert
		expect(await extractMeta(inputData)).toEqual({
			title: "test",
			layout: "something-else",
			and_something: "which is harder to do",
			plus: 0,
		});
	});

	it("Should return a title and tags in an array ", async () => {
		const inputData = `---
title: Yeah some title
tags: kudt, blabla, ok
---`;
		// Assert
		expect(await extractMeta(inputData)).toEqual({
			title: "Yeah some title",
			tags: ["kudt", "blabla", "ok"],
		});
	});
});

describe("removeMeta", () => {
	it("Should return the full content", async () => {
		// Assert
		expect(await removeMeta(input.data)).toEqual(input.data.trim());
	});
	it("Should return the content without meta", async () => {
		const inputData = `---
title: Yeah some title
tags: kudt, blabla, ok
---

# This is a title`; // Assert
		expect(await removeMeta(inputData)).toEqual("\n\n# This is a title");
	});
});

describe("mdToHtml", () => {
	it("returns a simple document - also checks anchors", async () => {
		// Assert
		expect(await mdToHtml(input)).toEqual(output);
	});

	it("returns a simple document, with meta data", async () => {
		const currentInput = {
			...input,
			data: `---
title: My Document
---

# My name

Is Dokkie, I'm a static site generator`,
		};

		output.meta = {
			title: "My Document",
		};

		// Assert
		expect(await mdToHtml(currentInput)).toEqual(output);
	});

	it("returns a simple document, with meta data : date", async () => {
		const currentInput = {
			...input,
			data: `---
date: 2020-02-02
---

# My name

Is Dokkie, I'm a static site generator`,
		};
		output.meta = {
			date: new Date("2020-02-02T00:00:00.000Z"),
		};

		// Assert
		expect(await mdToHtml(currentInput)).toEqual(output);
	});

	// //
	it("Render alert block", async () => {
		const currentInput = {
			...input,
			data: `

::: success
Test alert success block
:::`,
		};
		const currentOutput = {
			document: `<div class="alert alert-success" role="alert">
<p>Test alert success block</p>
</div>
`,
			meta: {},
		};
		// Assert
		expect(await mdToHtml(currentInput)).toEqual(currentOutput);
	});

	// //
	it("Render prism block", async () => {
		input.data = "```js\n function(){ alert('hoi'); }\n```";
		output.document = `<pre class=\"language-js\"><code class=\"language-js\"> <span class=\"token keyword\">function</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">{</span> <span class=\"token function\">alert</span><span class=\"token punctuation\">(</span><span class=\"token string\">'hoi'</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span> <span class=\"token punctuation\">}</span>\n</code></pre>\n`;
		output.meta = {};
		// Assert
		expect(await mdToHtml(input)).toEqual(output);
	});

	// //
	it("Render tasklist", async () => {
		input.data = "\n- [x] Done \n - [] Todo";
		output.document = `<ul class=\"contains-task-list\">\n<li class=\"task-list-item enabled\"><input class=\"task-list-item-checkbox\" checked=\"\"type=\"checkbox\"> Done</li>\n<li>[] Todo</li>\n</ul>\n`;
		output.meta = {};
		// Assert
		expect(await mdToHtml(input)).toEqual(output);
	});

	// //
	it("Render emoji", async () => {
		input.data = "\n Emoji: :)";
		output.document = `<p>Emoji: 😃</p>\n`;
		output.meta = {};
		// Assert
		expect(await mdToHtml(input)).toEqual(output);
	});
});
describe("getTitlefromMd - Get the first h1", () => {
	// Assert
	it("Should use the filename as a title", () => {
		expect(getTitleFromMD(`# Test`)).toStrictEqual("Test");
	});
});
