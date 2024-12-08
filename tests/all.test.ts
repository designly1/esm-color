import {
	parseColor,
	rgbToHsl,
	hslToRgb,
	lighten,
	darken,
	adjustHue,
	saturate,
	desaturate,
	complementaryColor,
	mixColors,
	invertColor,
	isDark,
	isLight,
	rgbToHex,
} from '../src/index';

describe('Color Manipulation Library', () => {
	const roundToTwo = (num: number): number => Math.round(num * 100) / 100;

	describe('parseColor', () => {
		test('should parse hex colors correctly', () => {
			expect(parseColor('#3498db')).toEqual([52, 152, 219]);
		});

		test('should parse 8-character hex correctly', () => {
			expect(parseColor('#ff5733cc')).toEqual([255, 87, 51, 0.8]);
		});

		test('should parse 6-character hex correctly', () => {
			expect(parseColor('#ff5733')).toEqual([255, 87, 51]);
		});

		test('should parse RGB string correctly', () => {
			expect(parseColor('rgb(52, 152, 219)')).toEqual([52, 152, 219]);
		});

		test('should parse RGBA string correctly', () => {
			expect(parseColor('rgba(52, 152, 219, 0.5)')).toEqual([52, 152, 219, 0.5]);
		});

		test('should parse named colors correctly', () => {
			expect(parseColor('red')).toEqual([255, 0, 0]);
		});

		test('should throw an error for unsupported formats', () => {
			expect(() => parseColor('invalidColor')).toThrow('Unsupported color format');
		});
	});

	describe('rgbToHsl', () => {
		test('should convert RGB to HSL', () => {
			expect(rgbToHsl([52, 152, 219]).map(roundToTwo)).toEqual([204.07, 69.87, 53.14]);
		});

		test('should handle black correctly', () => {
			expect(rgbToHsl([0, 0, 0])).toEqual([0, 0, 0]);
		});

		test('should handle white correctly', () => {
			expect(rgbToHsl([255, 255, 255])).toEqual([0, 0, 100]);
		});

		test('should handle max === r', () => {
			expect(rgbToHsl([255, 100, 50]).map(roundToTwo)).toEqual([14.63, 100, 59.8]);
		});

		test('should handle max === g', () => {
			expect(rgbToHsl([50, 255, 100]).map(roundToTwo)).toEqual([134.63, 100, 59.8]);
		});
	});

	describe('hslToRgb', () => {
		test('should convert HSL to RGB', () => {
			const hsl = rgbToHsl([52, 152, 219]);
			expect(hslToRgb(hsl)).toEqual([52, 152, 219]);
		});

		test('should handle h < 120', () => {
			expect(hslToRgb([90, 100, 50])).toEqual([128, 255, 0]);
		});

		test('should handle h < 180', () => {
			expect(hslToRgb([150, 100, 50])).toEqual([0, 255, 128]);
		});

		test('should handle h > 300', () => {
			expect(hslToRgb([330, 100, 50])).toEqual([255, 0, 128]);
		});
	});

	describe('Other functions', () => {
		const color1 = '#3498db';
		const color2 = '#e74c3c';

		test('lighten should lighten a color', () => {
			expect(lighten(color1, 0.2).toLowerCase()).toBe('#62afe3');
		});

		test('darken should darken a color', () => {
			expect(darken(color1, 0.2).toLowerCase()).toBe('#217bb8');
		});

		test('adjustHue should adjust hue of a color', () => {
			expect(adjustHue(color1, 45).toLowerCase()).toBe('#4d34db');
		});

		test('saturate should increase saturation of a color', () => {
			expect(saturate(color1, 0.3).toLowerCase()).toBe('#1b9df4');
		});

		test('desaturate should decrease saturation of a color', () => {
			expect(desaturate(color1, 0.3).toLowerCase()).toBe('#4d93c2');
		});

		test('complementaryColor should find the complementary color', () => {
			expect(complementaryColor(color1).toLowerCase()).toBe('#db7734');
		});

		test('mixColors should mix two colors', () => {
			expect(mixColors(color1, color2, 0.5).toLowerCase()).toBe('#8e728c');
		});

		test('invertColor should invert a color', () => {
			expect(invertColor(color1).toLowerCase()).toBe('#cb6724');
		});

		test('isDark should return false for a light color', () => {
			expect(isDark(color1)).toBe(false);
		});

		test('isLight should return true for a light color', () => {
			expect(isLight(color1)).toBe(true);
		});

		test('rgbToHex should convert RGB to hex', () => {
			expect(rgbToHex([255, 69, 0])).toBe('#FF4500');
		});
	});
});
