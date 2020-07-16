import {
	makeFileName,
	makeRoute,
	makePath,
	getPageTitle,
} from "../utils/files";
import { IFile } from "../types";
import { baseSettings } from "../test/mock";

let input: IFile = {
	ext: ".md",
	path: "",
	data: "",
	name: "readme",
	meta: {},
	html: "",
};
describe("makeFileName", () => {
	it("index", () => {
		const altInput = { ...input, name: "readme" };
		const output = "index.html";

		// Assert
		expect(expect(makeFileName(altInput)).toEqual(output));
	});

	it("sub", () => {
		const altInput = { ...input, name: "test" };
		const output = "test/index.html";

		// Assert
		expect(expect(makeFileName(altInput)).toEqual(output));
	});
});
describe("makeRoute", () => {
	it("to make a route", () => {
		const altInput = { ...input, name: "test" };
		const output = "/test/index.html";

		// Assert
		expect(expect(makeRoute(altInput, baseSettings)).toEqual(output));
	});

	it("alternative input dir", () => {
		const output = "/my/folder/readme/index.html";
		const altInput = { ...input, name: "my/folder/readme" };

		// Assert
		expect(expect(makeRoute(altInput, baseSettings)).toEqual(output));
	});

	it("alternative input dir - with strip", () => {
		const output = "/my/readme/index.html";
		const altInput = { ...input, name: "my/folder/readme" };
		baseSettings.strip = ["folder"];

		// Assert
		expect(expect(makeRoute(altInput, baseSettings)).toEqual(output));
	});

	it("alternative input dir - with alternative input", () => {
		const output = "/my/readme/index.html";
		const altInput = { ...input, name: "my/folder/readme" };
		baseSettings.strip = [];
		baseSettings.input = "folder";

		// Assert
		expect(expect(makeRoute(altInput, baseSettings)).toEqual(output));
	});
});

describe("makePath", () => {
	it("should make a path", () => {
		const output = process.cwd() + "/dokkie";
		expect(expect(makePath(input, baseSettings)).toEqual(output));
	});
});

describe("getPageTitle", () => {
	// Assert
	it("with meta, Should find the title in the metadata", () => {
		const altInput = { ...input, meta: { title: "test-meta" } };
		const output = "test-meta";
		expect(getPageTitle(altInput)).toEqual(output);
	});

	it("without meta - with title in file, Should use the title of the first h1 in the content", () => {
		const altInput = { ...input, data: `# test-file` };
		const output = "test-file";
		expect(getPageTitle(altInput)).toEqual(output);
	});

	it("without meta or title - Should use the filename as a title", () => {
		const altInput = { ...input };
		const output = "readme";
		expect(getPageTitle(altInput)).toEqual(output);
	});
});
