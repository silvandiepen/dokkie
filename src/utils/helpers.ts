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
