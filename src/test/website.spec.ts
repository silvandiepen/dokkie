import {
	createPages,
	getLayout,
	filterHiddenPages,
	convertDataToHtml,
	getFileTree,
} from "../steps";
import { sectionPartials, concatPartials } from "../steps/get-files";
import { cleanup } from "./clean";
import { ISettings } from "../types";
import { baseSettings } from "./mock";
import { join } from "path";
const { readdir, readFile } = require("fs").promises;

const mockOutput = "temp/website";

const basePage: any = (name: string) => {
	return {
		ext: ".md",
		date: "2020-05-28T09:58:59.948Z",
		meta: {},
		filename: "index.html",
		route: join(mockOutput, `${name.toLowerCase()}/index.html`),
		destpath: join(__dirname, "../../", mockOutput, name),
		data: `# ${name}\n`,
		html: `<h1 id="${name.toLowerCase()}">${name}</h1>\n`,
		title: name,
	};
};
const altSettingsPartials: ISettings = {
	...baseSettings,
	output: mockOutput,
	layout: "website",
	navigation: [],
	files: [
		{
			...basePage("Work"),
			name: "readme",
			path: "/Users/someuser/dokkie/content/website/b:work/readme.md",
		},
		{
			...basePage("Item1"),
			name: "_item1",
			path: "/Users/someuser/dokkie/content/website/b:work/_item1.md",
		},
		{
			...basePage("Item2"),
			name: "_item2",
			path: "/Users/someuser/dokkie/content/website/b:work/_item2.md",
		},
	],
};

const altSettingsSections: ISettings = {
	...altSettingsPartials,
	files: [
		{
			...basePage("Work"),
			name: "readme",
			path: "/Users/someuser/dokkie/content/website/b:work/readme.md",
		},
		{
			...basePage("_overview"),
			name: "readme",
			path: "/Users/someuser/dokkie/content/website/b:work/_overview/readme.md",
			meta: {
				layout: "thirds",
			},
			data: `---\nlayout: thirds\n---\n# Overview\n`,
		},
		{
			...basePage("Item1"),
			name: "_item1",
			path: "/Users/someuser/dokkie/content/website/b:work/_overview/_item1.md",
		},
		{
			...basePage("Item2"),
			name: "_item2",
			path: "/Users/someuser/dokkie/content/website/b:work/_overview/_item2.md",
		},
	],
};

afterEach(() => cleanup(join(__dirname, "../../", mockOutput)));

describe("Website", () => {
	it("Build a website", async () => {
		try {
			const result = await filterHiddenPages(altSettingsPartials);
			expect(result.files.length).toBe(3);
		} catch (err) {
			throw Error(err);
		}
	});
	it("Create Pages", async () => {
		try {
			await getLayout(altSettingsPartials).then(createPages);
			const testDir = await readdir(
				join(__dirname, "../../", altSettingsPartials.output)
			);
			expect(testDir.length).toBe(3);
		} catch (err) {
			throw Error(err);
		}
	});
	it("Concat Partials", async () => {
		try {
			await concatPartials(altSettingsPartials)
				.then(getLayout)
				.then(createPages);
			const testDir = await readdir(
				join(__dirname, "../../", altSettingsPartials.output)
			);
			expect(testDir.length).toBe(1);
		} catch (err) {
			throw Error(err);
		}
	});
	// Check if the sections are also take up into the page.
	it("Page has meta tag", async () => {
		try {
			await getLayout(altSettingsPartials).then(createPages);
			const testDir = await readdir(
				join(__dirname, "../../", altSettingsSections.output)
			);
			const testFile = await readFile(
				join(
					__dirname,
					"../../",
					altSettingsSections.output,
					testDir[0],
					"index.html"
				)
			).then((r: any): string => r.toString());
			document.body.innerHTML = testFile;

			expect(
				document.body.querySelector('meta[name="dokkie"][content="website"]')
			).toBeDefined();
		} catch (err) {
			throw Error(err);
		}
	});

	// Check if the sections are also take up into the page.
	it("Concat Sections", async () => {
		try {
			const result = await concatPartials(altSettingsSections)
				.then(sectionPartials)
				.then(getLayout);

			await createPages(result);

			const testDir = await readdir(
				join(__dirname, "../../", altSettingsSections.output)
			);
			expect(testDir.length).toBe(1);
		} catch (err) {
			throw Error(err);
		}
	});
	it("Concat Sections file", async () => {
		try {
			const result = await concatPartials(altSettingsSections)
				.then(sectionPartials)
				.then(getLayout)
				.then(convertDataToHtml);
			await createPages(result);

			expect(result.files[0].sections[0].articles.length).toBe(2);
		} catch (err) {
			throw Error(err);
		}
	});
	it("Sections have the right columns", async () => {
		try {
			const result = await concatPartials({
				...altSettingsSections,
				logging: ["debug"],
			})
				.then(sectionPartials)
				.then(getLayout)
				.then(convertDataToHtml);
			await createPages(result);

			const testFile = await readFile(
				join(__dirname, "../../", altSettingsSections.output, "work/index.html")
			).then((r: any): string => r.toString());

			document.body.innerHTML = testFile;
			const sectionContainer = document.body.querySelector(
				"main .section__container"
			);
			expect(sectionContainer.querySelector(`h1#item1`)).toBeDefined();
			expect(sectionContainer.querySelector(`h1#item2`)).toBeDefined();
		} catch (err) {
			throw Error(err);
		}
	});
});
