export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

export const parseHexColor = (hex: string): [number, number, number, number] => {
	if (hex.length === 3 || hex.length === 4) {
		const r = parseInt(hex[0] + hex[0], 16);
		const g = parseInt(hex[1] + hex[1], 16);
		const b = parseInt(hex[2] + hex[2], 16);
		const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
		return [r, g, b, a];
	} else if (hex.length === 6 || hex.length === 8) {
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
		return [r, g, b, a];
	}
	throw new Error('Invalid hex color format');
};

export const parseRgbString = (color: string): [number, number, number, number] => {
	const rgbaRegex = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/;
	const match = color.match(rgbaRegex);
	if (!match) throw new Error('Invalid RGB(a) format');
	return [
		clamp(parseFloat(match[1]), 0, 255),
		clamp(parseFloat(match[2]), 0, 255),
		clamp(parseFloat(match[3]), 0, 255),
		clamp(match[4] ? parseFloat(match[4]) : 1, 0, 1),
	];
};
