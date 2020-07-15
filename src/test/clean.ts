import rimraf from "rimraf";

export const cleanup = (folder: string) => {
	rimraf.sync(folder);
};

cleanup("../../temp");
