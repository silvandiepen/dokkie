export const getIndexes = (source: string, find: string): number[] => {
	const result = [];
	let i = 0;
	while (i < source.length) {
		if (source.substring(i, i + find.length) === find) {
			result.push(i);
			i += find.length;
		} else {
			i++;
		}
	}
	return result;
};
export const lastIndex = (source: string, find: string): number => {
	const result = getIndexes(source, find);
	return Math.max(...result) - 1;
};
export const nthIndex = (source: string, find: string, nth: number): number => {
	const result = getIndexes(source, find);
	return result[nth];
};
export const findIndexAfter = (
	source: string,
	find: string,
	after: number
): number => {
	const result = getIndexes(source, find).filter((i) => i > after);
	return result[0];
};
export const splice = (
	insert: string,
	idx: number,
	rem: number,
	str: string
): string => {
	return insert.slice(0, idx) + str + insert.slice(idx + Math.abs(rem));
};
