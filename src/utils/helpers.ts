export const lastIndex = (source: string, find: string): number => {
	var result = [];
	var i = 0;
	while (i < source.length) {
		if (source.substring(i, i + find.length) == find) {
			result.push(i);
			i += find.length;
		} else {
			i++;
		}
	}
	return Math.max(...result) - 1;
};
export const splice = (
	insert: string,
	idx: number,
	rem: number,
	str: string
): string => {
	return insert.slice(0, idx) + str + insert.slice(idx + Math.abs(rem));
};
