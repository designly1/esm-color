/* c8 ignore next */
import { clamp, parseHexColor, parseRgbString } from './helpers';
import colorNames from './color-names';

import type { RGB, RGBA, HSL } from './types';

/**
 * Parses a color string into an RGBA or RGB array.
 * Supports #RGB, #RRGGBB, #RGBA, #RRGGBBAA, rgb(r, g, b), rgba(r, g, b, a), and named colors.
 * @param color - The color string to parse.
 * @returns An RGB or RGBA array depending on the input.
 */
export const parseColor = (color: string): RGB | RGBA => {
	if (color.startsWith('#')) {
		const baseHex = color.slice(1);
		const parsedHex = parseHexColor(baseHex);
		return baseHex.length === 8 ? (parsedHex as RGBA) : (parsedHex.slice(0, 3) as RGB);
	} else if (color.startsWith('rgb')) {
		const rgba = parseRgbString(color) as RGBA;
		// Return RGBA if alpha is explicitly provided (not undefined or 1), otherwise RGB
		return rgba[3] !== undefined && rgba[3] !== 1 ? (rgba as RGBA) : (rgba.slice(0, 3) as RGB);
	} else if (colorNames[color.toLowerCase() as keyof typeof colorNames]) {
		// Named colors always return RGB (e.g., "red" => [255, 0, 0])
		return colorNames[color.toLowerCase() as keyof typeof colorNames] as RGB;
	}
	throw new Error('Unsupported color format');
};

/**
 * Converts an RGB color to HSL.
 * @param rgb - The RGB color to convert.
 * @returns The HSL representation of the color.
 */
export const rgbToHsl = ([r, g, b]: RGB): HSL => {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h = 0;
	if (delta > 0) {
		if (max === r) h = ((g - b) / delta) % 6;
		else if (max === g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;
	}
	h = (h * 60 + 360) % 360;

	const l = (max + min) / 2;
	const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	return [parseFloat(h.toFixed(15)), parseFloat((s * 100).toFixed(15)), parseFloat((l * 100).toFixed(15))];
};

/**
 * Converts an HSL color to RGB.
 * @param hsl - The HSL color to convert.
 * @returns The RGB representation of the color.
 */
export const hslToRgb = ([h, s, l]: HSL): RGB => {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];

	return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

/**
 * Converts an RGB array to a hex string.
 * @param rgb - The RGB array to convert.
 * @returns The hex representation of the color.
 */
export const rgbToHex = ([r, g, b]: RGB): string =>
	`#${[r, g, b]
		.map(val => val.toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase()}`;

/**
 * Determines if a color is dark.
 * @param color - The color string to check.
 * @returns `true` if the color is dark, otherwise `false`.
 */
export const isDark = (color: string): boolean => {
	const [r, g, b] = parseColor(color).slice(0, 3) as RGB;
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq < 128;
};

/**
 * Determines if a color is light.
 * @param color - The color string to check.
 * @returns `true` if the color is light, otherwise `false`.
 */
export const isLight = (color: string): boolean => !isDark(color);

/**
 * Lightens a color by a given ratio.
 * @param color - The color string to lighten.
 * @param ratio - The ratio to lighten (0 to 1).
 * @returns The lightened color as a hex string.
 */
export const lighten = (color: string, ratio: number): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[2] = clamp(hsl[2] + hsl[2] * ratio, 0, 100);
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Darkens a color by a given ratio.
 * @param color - The color string to darken.
 * @param ratio - The ratio to darken (0 to 1).
 * @returns The darkened color as a hex string.
 */
export const darken = (color: string, ratio: number): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[2] = clamp(hsl[2] - hsl[2] * ratio, 0, 100);
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Saturates a color by a given ratio.
 * @param color - The color string to saturate.
 * @param ratio - The ratio to saturate (0 to 1).
 * @returns The saturated color as a hex string.
 */
export const saturate = (color: string, ratio: number): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[1] = clamp(hsl[1] + hsl[1] * ratio, 0, 100);
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Desaturates a color by a given ratio.
 * @param color - The color string to desaturate.
 * @param ratio - The ratio to desaturate (0 to 1).
 * @returns The desaturated color as a hex string.
 */
export const desaturate = (color: string, ratio: number): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[1] = clamp(hsl[1] - hsl[1] * ratio, 0, 100);
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Finds the complementary color of the given color.
 * @param color - The color string to find the complement for.
 * @returns The complementary color as a hex string.
 */
export const complementaryColor = (color: string): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[0] = (hsl[0] + 180) % 360;
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Adjusts the hue of a color.
 * @param color - The color string to adjust.
 * @param degrees - The number of degrees to adjust the hue (-360 to 360).
 * @returns The color with the adjusted hue as a hex string.
 */
export const adjustHue = (color: string, degrees: number): string => {
	const hsl = rgbToHsl(parseColor(color).slice(0, 3) as RGB);
	hsl[0] = (hsl[0] + degrees + 360) % 360;
	return rgbToHex(hslToRgb(hsl));
};

/**
 * Mixes two colors by a specified ratio.
 * @param color1 - The first color string.
 * @param color2 - The second color string.
 * @param ratio - The ratio of `color1` in the mix (0 to 1).
 * @returns The mixed color as a hex string.
 */
export const mixColors = (color1: string, color2: string, ratio: number): string => {
	const [r1, g1, b1] = parseColor(color1).slice(0, 3) as RGB;
	const [r2, g2, b2] = parseColor(color2).slice(0, 3) as RGB;

	const r = Math.round(r1 * ratio + r2 * (1 - ratio));
	const g = Math.round(g1 * ratio + g2 * (1 - ratio));
	const b = Math.round(b1 * ratio + b2 * (1 - ratio));

	return rgbToHex([r, g, b]);
};

/**
 * Inverts a color.
 * @param color - The color string to invert.
 * @returns The inverted color as a hex string.
 */
/* c8 ignore next */
export const invertColor = (color: string): string => {
	const [r, g, b] = parseColor(color).slice(0, 3) as RGB;
	return rgbToHex([255 - r, 255 - g, 255 - b]);
};
