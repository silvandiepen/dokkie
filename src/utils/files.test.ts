import { makeFileName, makeRoute, makePath, getPageTitle } from "./files";
import { IFile } from "../types";
import { baseSettings } from "../test/mock";

let input: IFile = {
	ext: ".md",
	path: "",
	data: "",
	name: "readme",
};

test("makeFileName - index", () => {
	input.name = "readme";
	const output = "index.html";

	// Assert
	expect(expect(makeFileName(input)).toEqual(output));
});

test("makeFileName - sub", () => {
	input.name = "test";
	const output = "test/index.html";

	// Assert
	expect(expect(makeFileName(input)).toEqual(output));
});

test("makeRoute", () => {
	const output = "/test/index.html";

	// Assert
	expect(expect(makeRoute(input, baseSettings)).toEqual(output));
});

test("makeRoute - alternative input dir", () => {
	const output = "/my/folder/readme/index.html";
	input.name = "my/folder/readme";

	// Assert
	expect(expect(makeRoute(input, baseSettings)).toEqual(output));
});

test("makeRoute - alternative input dir - with strip", () => {
	const output = "/my/readme/index.html";
	input.name = "my/folder/readme";
	baseSettings.strip = ["folder"];

	// Assert
	expect(expect(makeRoute(input, baseSettings)).toEqual(output));
});

test("makeRoute - alternative input dir - with alternative input", () => {
	const output = "/my/readme/index.html";
	input.name = "my/folder/readme";
	baseSettings.strip = [];
	baseSettings.input = "folder";

	// Assert
	expect(expect(makeRoute(input, baseSettings)).toEqual(output));
});

test("makePath", () => {
	const output = process.cwd() + "/dokkie";
	// Assert
	expect(expect(makePath(input, baseSettings)).toEqual(output));
});

describe("getPageTitle - with meta", () => {
	const altInput = { ...input, meta: { title: "test-meta" } };
	const output = "test-meta";

	// Assert
	it("Should find the title in the metadata", () => {
		expect(getPageTitle(altInput)).toEqual(output);
	});
});

describe("getPageTitle - without meta - with title in file", () => {
	const altInput = { ...input, data: `# test-file` };
	const output = "test-file";

	// Assert
	it("Should use the title of the first h1 in the content", () => {
		expect(getPageTitle(altInput)).toEqual(output);
	});
});

describe("getPageTitle - without meta or title", () => {
	const altInput = { ...input };
	const output = "readme";

	// Assert
	it("Should use the filename as a title", () => {
		expect(getPageTitle(altInput)).toEqual(output);
	});
});
