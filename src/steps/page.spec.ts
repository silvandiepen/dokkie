import { filterHiddenPages, createPages, getLayout } from "./page";
import { ISettings } from "../types";
import { baseSettings } from "../test/mock";
import { join } from "path";
const { readdir, readFile } = require("fs").promises;

const mockOutput = "temp/pages";
const altSettings: ISettings = {
	...baseSettings,
	output: mockOutput,
	navigation: [],
	files: [
		{
			name: "readme",
			path: "/Users/silvandiepen/Repos/_projects/dokkie/pages/usage/readme.md",
			ext: ".md",
			date: "2020-05-28T09:58:59.948Z",
			data: "# Test1\n",
			meta: {},
			html: '<h1 id="test1">Test1</h1>\n',
			title: "Test1",
			route: join(mockOutput, "test1/index.html"),
			destpath: join(__dirname, "../../", mockOutput, "test1"),
			filename: "index.html",
		},
		{
			name: "readme",
			path: "/Users/silvandiepen/Repos/_projects/dokkie/pages/usage/readme.md",
			ext: ".md",
			date: "2020-05-28T09:58:59.948Z",
			data: "# Test2\n",
			meta: { remove: true },
			html: '<h1 id="test2">Test2</h1>\n',
			title: "Test2",
			route: join(mockOutput, "test2/index.html"),
			destpath: join(__dirname, "../../", mockOutput, "test2"),
			filename: "index.html",
		},
	],
};

describe("Page", () => {
	it("Should filter hidden pages", async () => {
		try {
			const result = await filterHiddenPages(altSettings);
			expect(result.files.length).toBe(1);
		} catch (err) {
			console.log(err);
		}
	});
	it("Create Pages", async () => {
		try {
			await getLayout(altSettings).then(createPages);
			const testDir = await readdir(
				join(__dirname, "../../", altSettings.output)
			);

			expect(testDir[1]).toBe("test2");
		} catch (err) {
			console.log(err);
		}
	});
	it("Create Pages - with Filter", async () => {
		try {
			await filterHiddenPages(altSettings).then(getLayout).then(createPages);
			const testDir = await readdir(
				join(__dirname, "../../", altSettings.output)
			);

			expect(testDir[0]).toBe("test1");
		} catch (err) {
			console.log(err);
		}
	});
	it("Page has contents", async () => {
		try {
			const data = await filterHiddenPages(altSettings).then(getLayout);

			await createPages(data);
			const testFile = await readFile(
				join(__dirname, "../../", altSettings.output, "/test1/index.html")
			).then((r: any): string => r.toString());

			expect(testFile.includes("test1")).toBeTruthy();
		} catch (err) {
			console.log(err);
		}
	});
	it("Page has title based on Content title", async () => {
		try {
			const data = await filterHiddenPages(altSettings).then(getLayout);
			await createPages(data);
			const testFile = await readFile(
				join(__dirname, "../../", altSettings.output, "/test1/index.html")
			).then((r: any): string => r.toString());

			document.body.innerHTML = testFile;
			const headerTitle = document.body.querySelector("header h1 a");

			expect(headerTitle.innerHTML).toEqual("Test1");
		} catch (err) {
			console.log(err);
		}
	});
	it("Page has title based on Page title", async () => {
		try {
			const data = await filterHiddenPages({
				...altSettings,
				projectTitle: "AnotherTest",
			}).then(getLayout);

			await createPages(data);
			const testFile = await readFile(
				join(__dirname, "../../", altSettings.output, "/test1/index.html")
			).then((r: any): string => r.toString());

			document.body.innerHTML = testFile;
			const headerTitle = document.body.querySelector("header h1 a");

			expect(headerTitle.innerHTML).toEqual("AnotherTest");
		} catch (err) {
			console.log(err);
		}
	});
});
