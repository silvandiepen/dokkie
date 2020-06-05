import { ISettings, INavigation, IFile, IMenu } from "../types";
import rimraf from "rimraf";
export const buildNavigation = async (
	settings: ISettings
): Promise<ISettings> => {
	let nav: INavigation[] = [];

	settings.files.forEach((file: IFile) => {
		const link = file.route.replace("index.html", "");
		const linkPath = link.substr(1, link.length - 2).split("/");
		const parent = linkPath[linkPath.length - 2]
			? linkPath[linkPath.length - 2]
			: "";
		if (!file.meta.hide)
			nav.push({
				name: file.title,
				link: link,
				path: linkPath,
				self: linkPath[linkPath.length - 1],
				parent: file.meta.parent
					? file.meta.parent.split(",").map((i: string) => i.trim())
					: parent,
				meta: file.meta,
			});
	});

	let newNav = [];

	if (!settings.flatNavigation)
		nav
			.filter((item) => item.parent == "")
			.forEach((item) => {
				newNav.push({
					...item,
					children: nav.filter(
						(subitem) => subitem.parent.includes(item.self) && item.self !== ""
					),
				});
			});
	return { ...settings, navigation: settings.flatNavigation ? nav : newNav };
};

export const cleanFolder = async (settings: ISettings): Promise<void> => {
	if (settings.cleanBefore) rimraf.sync(settings.output);
};

const filterNavigation = (
	nav: INavigation[],
	parent: string
): INavigation[] => {
	// consoleJson(nav);
	const filteredNav = nav.map((item) => {
		if (
			!item.meta?.menu ||
			(item.meta.menu && item.meta.menu.includes(parent))
		) {
			if (item.children)
				return {
					...item,
					children: filterNavigation(item.children, parent).filter(Boolean),
				};
			else {
				return { ...item };
			}
		}
	});
	return filteredNav;
};

export const getNavigation = (settings: ISettings, filter: string): IMenu => {
	const current = settings.showNavigation.find((nav) => nav.name == filter);
	if (current)
		return {
			...current,
			menu: filterNavigation(Array.from(settings.navigation), filter).filter(
				Boolean
			),
			showClass: `${current.mobile ? "" : "hide-mobile"} ${
				current.desktop ? "show-desktop" : "hide-desktop"
			}`,
		};

	return null;
};
