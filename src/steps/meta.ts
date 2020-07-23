import { ISettings, IFile } from "../types";
import { getPageTitle, makeRoute, makePath, makeFileName } from "../utils";

export const setMetadata = async (settings: ISettings): Promise<ISettings> => {
	const files = await Promise.all(
		settings.files.map(
			async (file: IFile) =>
				(file = {
					...file,
					title: getPageTitle(file),
					route: makeRoute(file, settings),
					destpath: makePath(file, settings),
					filename: makeFileName(file),
				})
		)
	).then((res) => res);

	return { ...settings, files };
};
