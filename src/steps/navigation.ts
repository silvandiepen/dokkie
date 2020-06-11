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
		if (!file.meta?.hide)
			nav.push({
				name: file.title,
				link: link,
				path: linkPath,
				self: linkPath[linkPath.length - 1],
				parent: file.meta?.parent
					? file.meta.parent.split(",").map((i: string) => i.trim())
					: parent,
				meta: file.meta,
				date: file.date,
			});
	});

	if (settings.extendNavigation)
		settings.extendNavigation.forEach((item: INavigation) => {
			if (!item.parent) item.parent = "";
			nav.push(item);
		});

	if (settings.overruleNavigation) {
		// When it's a blog. None of the menu's should be shown by default. So, first all items found
		// are put into the menu 'overview'. Then the overruled menus will be added to their respective menus.

		if (settings.type == "blog") {
			nav.forEach((item) => (item.meta.menu = ["overview"]));
			settings.overruleNavigation.forEach((item: INavigation) => {
				if (!item.parent) item.parent = "";
				nav.push(item);
			});
		}
		// 1. Otherwise, for docs all items will first be given menus in case they don't have them defined yet (which usually)
		// results in appearing in all menus.
		// 2. Then a list will be made of the menu's which will be overruled.
		// 3. These menus will be emptied.
		else {
			// 1.
			const menus = settings.overruleNavigation.map((item) => {
				if (item.meta?.menu) return item;
				else
					return {
						...item,
						meta: { ...item.meta, menu: ["header", "footer", "sidebar"] },
					};
			});
			// 2.
			const overruleMenus = [];
			menus.forEach((item) => overruleMenus.push(item.meta.menu));

			// 3.

			overruleMenus.forEach((menu) => {
				nav = nav
					.map((item) =>
						item.meta?.menu.find(menu, menu.name == menu)
							? {
									...item,
									meta: {
										...item.meta,
										menu: item.meta.menu.filter((item) => item.name !== menu),
									},
							  }
							: item
					)
					.filter((item) => item.meta.menu !== []);
			});

			nav = settings.overruleNavigation.map(
				(item) => (item = { ...item, parent: item.parent || "" })
			);
		}
	}

	// Flat navigation can be an option.
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

	// If the project is a blog. The menu's are sorted by date.
	if (settings.type == "blog") {
		nav.sort((a, b) => (a.date < b.date ? 1 : -1));
	}

	return { ...settings, navigation: settings.flatNavigation ? nav : newNav };
};

export const cleanFolder = async (settings: ISettings): Promise<void> => {
	if (settings.cleanBefore) rimraf.sync(settings.output);
};

const filterNavigation = (
	nav: INavigation[],
	parent: string
): INavigation[] => {
	const filteredNav = nav.map((item) => {
		if (!item.meta?.menu || (item.meta.menu && item.meta.menu.includes(parent)))
			if (item.children)
				return {
					...item,
					children: filterNavigation(item.children, parent).filter(Boolean),
				};
			else return { ...item };
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
