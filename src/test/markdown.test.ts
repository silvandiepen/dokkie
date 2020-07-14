import { mdToHtml, getTitleFromMD } from "../utils/markdown";
import { IFile } from "../types";

let input: IFile = {
	name: "mock",
	ext: ".md",
	path: "/",
	data: `
# My name
  
Is Dokkie, I'm a static site generator`,
};
let output = {
	document:
		'<h1 id="my-name">My name</h1>\n<p>Is Dokkie, I’m a static site generator</p>\n',
	meta: {},
};

test("returns a simple document - also checks anchors", () => {
	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

test("returns a simple document, with meta data", () => {
	input.data = `---
title: My Document
---

# My name

Is Dokkie, I'm a static site generator`;

	output.meta = {
		title: "My Document",
	};

	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

test("returns a simple document, with meta data : date", () => {
	input.data = `---
date: 2020-02-02
---

# My name

Is Dokkie, I'm a static site generator`;

	output.meta = {
		date: new Date("2020-02-02T00:00:00.000Z"),
	};

	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

//
test("Render alert block", () => {
	input.data = `::: success
Test alert success block
:::`;

	output = {
		document: `<div class="alert alert-success" role="alert">
<p>Test alert success block</p>
</div>
`,
		meta: {},
	};
	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

// //
test("Render prism block", () => {
	input.data = "```js\n function(){ alert('hoi'); }\n```";
	output.document = `<pre class=\"language-js\"><code class=\"language-js\"> <span class=\"token keyword\">function</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">{</span> <span class=\"token function\">alert</span><span class=\"token punctuation\">(</span><span class=\"token string\">'hoi'</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span> <span class=\"token punctuation\">}</span>\n</code></pre>\n`;
	output.meta = {};
	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

// //
test("Render tasklist", () => {
	input.data = "\n- [x] Done \n - [] Todo";
	output.document = `<ul class=\"contains-task-list\">\n<li class=\"task-list-item enabled\"><input class=\"task-list-item-checkbox\" checked=\"\"type=\"checkbox\"> Done</li>\n<li>[] Todo</li>\n</ul>\n`;
	output.meta = {};
	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

// //
test("Render emoji", () => {
	input.data = "\n Emoji: :)";
	output.document = `<p>Emoji: 😃</p>\n`;
	output.meta = {};
	// Assert
	expect(mdToHtml(input).then((s) => expect(s).toEqual(output)));
});

describe("getTitlefromMd - Get the first h1", () => {
	const input = `# Test`;
	const output = "Test";

	// Assert
	it("Should use the filename as a title", () => {
		expect(getTitleFromMD(input)).toStrictEqual(output);
	});
});

// describe("getTitlefromMd - Get the first h1, even when its not on the first line", () => {
// 	const input = `## Another test\n\n# Test`;
// 	const output = "Test";

// 	// Assert
// 	it("Should use the filename as a title", () => {
// 		expect(getTitleFromMD(input)).toStrictEqual(output);
// 	});
// });
