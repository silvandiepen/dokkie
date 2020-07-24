import { concatPartials } from "./get-files";
import { ISettings } from "../types";
import { baseSettings } from "../test/mock";
import { join } from "path";

const mockOutput = "temp/files";
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
			name: "_2:partial",
			path:
				"/Users/silvandiepen/Repos/_projects/dokkie/pages/usage/_2:partial.md",
			ext: ".md",
			date: "2020-05-28T09:58:59.948Z",
			data: "# Partial\n",
			meta: { remove: true },
			html: '<h2 id="partial">Partial</h2>\n',
			title: "First Partial",
			route: join(mockOutput, "test1/_partial.html"),
			destpath: join(__dirname, "../../", mockOutput, "_partial"),
			filename: "index.html",
		},
		{
			name: "_1:another",
			path:
				"/Users/silvandiepen/Repos/_projects/dokkie/pages/usage/_1:another.md",
			ext: ".md",
			date: "2020-05-28T09:58:59.948Z",
			data: "# Another\n",
			meta: { remove: true },
			html: '<h2 id="another">Another</h2>\n',
			title: "Another Partial",
			route: join(mockOutput, "test1/_another.html"),
			destpath: join(__dirname, "../../", mockOutput, "_another"),
			filename: "index.html",
		},
	],
};

describe("Page", () => {
	it("Filter out partial files", async () => {
		try {
			const result = await concatPartials(altSettings);
			expect(result.files.length).toBe(1);
		} catch (err) {
			throw Error(err);
		}
	});
	it("Should add the contents to the parent", async () => {
		try {
			const result = await concatPartials(altSettings);
			// The order is not correct, but that happens when the files are being loaded. In the mock, order is manual and
			// won't get ordered anymore.
			expect(result.files[0].data).toEqual(
				"# Test1\n\n\n# Partial\n\n\n# Another\n"
			);
		} catch (err) {
			throw Error(err);
		}
	});
});
