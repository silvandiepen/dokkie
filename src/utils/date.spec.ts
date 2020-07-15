import { convertToDate } from "../utils/date";

test("Date conversion - number", () => {
	// Assert
	expect(convertToDate(20200220)).toStrictEqual(
		new Date("2020-02-19T23:00:00.000Z")
	);
});
test("Date conversion - string", () => {
	// Assert
	expect(convertToDate("20200220")).toStrictEqual(
		new Date("2020-02-19T23:00:00.000Z")
	);
});
test("Date conversion - dashed string", () => {
	// Assert
	expect(convertToDate("2021-02-20")).toStrictEqual(
		new Date("2021-02-19T23:00:00.000Z")
	);
});
test("Date conversion - spaced string", () => {
	// Assert
	expect(convertToDate("2021 02 20")).toStrictEqual(
		new Date("2021-02-19T23:00:00.000Z")
	);
});
