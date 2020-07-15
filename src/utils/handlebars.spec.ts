import { Handlebars } from "../utils/handlebars";

test("Renders Handlebars", () => {
	const template = Handlebars.compile(`<p>{{{ title }}}</p>`);

	const contents = template({
		title: `<h1>Title</h1>`,
	});
	const output = "<p><h1>Title</h1></p>";

	// Assert
	expect(expect(contents).toEqual(output));
});

test("Renders Handlebars - test eq function", () => {
	const template = Handlebars.compile(
		`{{#if (eq title 'Title')}}<p><h1>{{title}}</h1></p>{{/if}}`
	);

	const contents = template({
		title: `Title`,
	});
	const output = "<p><h1>Title</h1></p>";

	// Assert
	expect(expect(contents).toEqual(output));
});

test("Renders Handlebars - test date function", () => {
	const template = Handlebars.compile(
		`{{ dateFormat date format="yy MM Do" }}`
	);

	const contents = template({
		date: `2020-02-12`,
	});
	const output = "20 02 43rd";

	// Assert
	expect(expect(contents).toEqual(output));
});
