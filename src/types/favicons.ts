export interface IFaviconResult {
	images: any;
	files: any;
}
export interface IFaviconImg {
	name: string;
	contents: string;
}

export interface IImageSettings {
	size: IImageSize;
	background: string;
	text: string;
	textSettings: IImageText;
}

export interface IImageSize {
	width: number;
	height: number;
}
export interface IImageText {
	fontFamily: string;
	fontSize: number;
	fontWeight: string | number;
	font?: string;
	align?: "left" | "center" | "right";
	baseline?: "top" | "bottom" | "middle" | "alphabetic" | "hanging";
	color?: string;
}
