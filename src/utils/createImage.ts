import fs from "fs";
import { createCanvas } from "canvas";
import { IImageSettings } from "../types";

export const defaultImageSettings: IImageSettings = {
	size: {
		width: 1200,
		height: 1200,
	},
	text: "default",
	background: "#fff",
	textSettings: {
		fontSize: 70,
		fontWeight: "bold",
		fontFamily: "Menlo",
		align: "center",
		baseline: "middle",
		color: "#ff0000",
	},
};
export const createImage = async (
	imageSettings: IImageSettings
): Promise<any> => {
	const settings = Object.assign(defaultImageSettings, imageSettings);

	const canvas = createCanvas(settings.size.width, settings.size.height);
	const context = canvas.getContext("2d");

	context.fillStyle = settings.background;
	context.fillRect(0, 0, settings.size.width, settings.size.height);

	context.font = `${settings.textSettings.fontWeight} ${settings.textSettings.fontSize}pt ${settings.textSettings.fontFamily}`;
	context.textAlign = settings.textSettings.align;
	context.textBaseline = settings.textSettings.baseline;
	context.fillStyle = settings.textSettings.color;

	const text = "Hello, World!";

	const textSettings: { width: number; height: number } = {
		width: context.measureText(text).width,
		height: 70,
	};

	context.fillRect(
		settings.size.width / 2 - textSettings.width / 2,
		settings.size.height / 2 - textSettings.height / 2,
		textSettings.width + 20,
		120
	);
	context.fillStyle = "#fff";
	context.fillText(
		settings.text,
		settings.size.width / 2,
		settings.size.height / 2
	);

	return canvas.toBuffer("image/png");
};
