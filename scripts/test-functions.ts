import {
	adjustHue,
	complementaryColor,
	darken,
	desaturate,
	hslToRgb,
	lighten,
	invertColor,
	rgbToHsl,
	saturate,
	isDark,
	isLight,
	mixColors,
	parseColor,
	rgbToHex,
} from '../src/index';

import color from 'color';
import colors from 'colors';

(() => {
	const error = colors.bgRed;
	const info = colors.bgBlue;
	const success = colors.bgGreen;

	const compare = (
		label: string,
		esResult: string | number[] | boolean,
		colorResult: string | number[] | boolean,
	): void => {
		const isEqual = JSON.stringify(esResult) === JSON.stringify(colorResult);
		console.log(info(label + ' "colors-es":'), esResult);
		console.log(isEqual ? success(label + ' "color":') : error(label + ' "color":'), colorResult);
	};

	// Define some colors
	const color1 = '#3498db';
	const color2 = '#e74c3c';

	// Parse color
	compare('Parsed Color', parseColor(color1), color(color1).rgb().array());

	// Convert RGB to HSL
	const hsl = rgbToHsl(parseColor(color1).slice(0, 3) as [number, number, number]);
	compare('RGB to HSL', hsl, color(color1).hsl().array());

	// Convert HSL to RGB
	compare('HSL to RGB', hslToRgb(hsl), color(color1).rgb().array());

	// Lighten color
	compare('Lightened Color', lighten(color1, 0.2), color(color1).lighten(0.2).hex());

	// Darken color
	compare('Darkened Color', darken(color1, 0.2), color(color1).darken(0.2).hex());

	// Adjust hue
	compare('Adjusted Hue', adjustHue(color1, 45), color(color1).rotate(45).hex());

	// Saturate color
	compare('Saturated Color', saturate(color1, 0.3), color(color1).saturate(0.3).hex());

	// Desaturate color
	compare('Desaturated Color', desaturate(color1, 0.3), color(color1).desaturate(0.3).hex());

	// Complementary color
	compare('Complementary Color', complementaryColor(color1), color(color1).rotate(180).hex());

	// Mix two colors
	compare('Mixed Colors', mixColors(color1, color2, 0.5), color(color1).mix(color(color2), 0.5).hex());

	// Invert color
	compare('Inverted Color', invertColor(color1), color(color1).negate().hex());

	// Check if color is dark
	compare('Is Dark', isDark(color1), color(color1).isDark());

	// Check if color is light
	compare('Is Light', isLight(color1), color(color1).isLight());

	// Convert RGB to Hex
	const rgb = [255, 69, 0];
	compare('RGB to Hex', rgbToHex(rgb as [number, number, number]), color.rgb(rgb).hex());
})();
