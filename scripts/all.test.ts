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

type TestResult = {
	name: string;
	status: 'passed' | 'failed';
	details?: { expected: any; actual: any };
};

const results: TestResult[] = [];

/**
 * Custom assertion function to track test results
 */
function assert(condition: boolean, name: string, details?: { expected: any; actual: any }): void {
	if (condition) {
		results.push({ name, status: 'passed' });
		console.log(`✅ ${name}`);
	} else {
		results.push({ name, status: 'failed', details });
		console.error(`❌ ${name}`);
		if (details) {
			console.error(`   Expected: ${JSON.stringify(details.expected)}`);
			console.error(`   Actual:   ${JSON.stringify(details.actual)}`);
		}
	}
}

const runTests = () => {
	console.log('Running tests...\n');

	// Tests for color functions
	const color1 = '#3498db';
	const color2 = '#e74c3c';

	const roundToTwo = (num: number): number => Math.round(num * 100) / 100;

	assert(
		JSON.stringify(parseColor(color1)) === JSON.stringify([52, 152, 219]),
		'parseColor should parse hex colors correctly for #3498db',
		{ expected: [52, 152, 219], actual: parseColor(color1) },
	);

	// Case where baseHex.length === 8
	assert(
		JSON.stringify(parseColor('#ff5733cc')) === JSON.stringify([255, 87, 51, 0.8]),
		'parseColor should parse 8-character hex correctly',
		{ expected: [255, 87, 51, 0.8], actual: parseColor('#ff5733cc') },
	);

	// Case where baseHex.length !== 8
	assert(
		JSON.stringify(parseColor('#ff5733')) === JSON.stringify([255, 87, 51]),
		'parseColor should parse 6-character hex correctly',
		{ expected: [255, 87, 51], actual: parseColor('#ff5733') },
	);

	assert(
		JSON.stringify(parseColor('rgb(52, 152, 219)')) === JSON.stringify([52, 152, 219]),
		'parseColor should parse RGB colors correctly for rgb(52, 152, 219)',
		{ expected: [52, 152, 219], actual: parseColor('rgb(52, 152, 219)') },
	);

	assert(
		JSON.stringify(parseColor('rgba(52, 152, 219, 0.5)')) === JSON.stringify([52, 152, 219, 0.5]),
		'parseColor should parse RGBA colors correctly for rgba(52, 152, 219, 0.5)',
		{ expected: [52, 152, 219], actual: parseColor('rgba(52, 152, 219, 0.5)') },
	);

	assert(
		JSON.stringify(parseColor('red')) === JSON.stringify([255, 0, 0]),
		'parseColor should parse named colors correctly for red',
		{ expected: [255, 0, 0], actual: parseColor('red') },
	);

	assert(
		(() => {
			try {
				parseColor('invalidColor');
				return false; // Should not reach here
			} catch {
				return true; // Should throw an error
			}
		})(),
		'parseColor should throw an error for unsupported formats',
	);

	const hsl = rgbToHsl([52, 152, 219]);
	assert(
		JSON.stringify(hsl.map(roundToTwo)) === JSON.stringify([204.07, 69.87, 53.14]),
		'rgbToHsl should convert [52, 152, 219] to HSL',
		{ expected: [204.07, 69.87, 53.14], actual: hsl.map(roundToTwo) },
	);

	assert(
		JSON.stringify(rgbToHsl([0, 0, 0])) === JSON.stringify([0, 0, 0]),
		'rgbToHsl should handle black correctly',
		{ expected: [0, 0, 0], actual: rgbToHsl([0, 0, 0]) },
	);

	assert(
		JSON.stringify(rgbToHsl([255, 255, 255])) === JSON.stringify([0, 0, 100]),
		'rgbToHsl should handle white correctly',
		{ expected: [0, 0, 100], actual: rgbToHsl([255, 255, 255]) },
	);

	/* Test for max === r */
	assert(
		JSON.stringify(rgbToHsl([255, 100, 50]).map(n => Math.round(n * 100) / 100)) ===
			JSON.stringify([14.63, 100, 59.8]),
		'rgbToHsl should convert [255, 100, 50] to HSL where max is r',
		{ expected: [14.63, 100, 59.8], actual: rgbToHsl([255, 100, 50]).map(n => Math.round(n * 100) / 100) },
	);

	/* Test for max === g */
	assert(
		JSON.stringify(rgbToHsl([50, 255, 100]).map(n => Math.round(n * 100) / 100)) ===
			JSON.stringify([134.63, 100, 59.8]),
		'rgbToHsl should convert [50, 255, 100] to HSL where max is g',
		{ expected: [134.63, 100, 59.8], actual: rgbToHsl([50, 255, 100]).map(n => Math.round(n * 100) / 100) },
	);

	/* Test for h < 120 */
	assert(
		JSON.stringify(hslToRgb([90, 100, 50])) === JSON.stringify([128, 255, 0]),
		'hslToRgb should convert [90, 100, 50] to RGB where h < 120',
		{ expected: [128, 255, 0], actual: hslToRgb([90, 100, 50]) },
	);

	/* Test for h < 180 */
	assert(
		JSON.stringify(hslToRgb([150, 100, 50])) === JSON.stringify([0, 255, 128]),
		'hslToRgb should convert [150, 100, 50] to RGB where h < 180',
		{ expected: [0, 255, 128], actual: hslToRgb([150, 100, 50]) },
	);

	const rgb = hslToRgb(hsl);
	assert(
		JSON.stringify(rgb) === JSON.stringify([52, 152, 219]),
		'hslToRgb should convert [204.07, 69.87, 53.14] back to RGB',
		{ expected: [52, 152, 219], actual: rgb },
	);

	assert(
		JSON.stringify(hslToRgb([330, 100, 50])) === JSON.stringify([255, 0, 128]),
		'hslToRgb should convert [330, 100, 50] to [255, 0, 128]',
		{ expected: [255, 0, 128], actual: hslToRgb([330, 100, 50]) },
	);

	assert(lighten(color1, 0.2).toLowerCase() === '#62afe3', 'lighten should lighten #3498db by 0.2', {
		expected: '#62afe3',
		actual: lighten(color1, 0.2).toLowerCase(),
	});

	assert(darken(color1, 0.2).toLowerCase() === '#217bb8', 'darken should darken #3498db by 0.2', {
		expected: '#217bb8',
		actual: darken(color1, 0.2).toLowerCase(),
	});

	assert(
		adjustHue(color1, 45).toLowerCase() === '#4d34db',
		'adjustHue should adjust the hue of #3498db by 45 degrees',
		{ expected: '#4d34db', actual: adjustHue(color1, 45).toLowerCase() },
	);

	assert(saturate(color1, 0.3).toLowerCase() === '#1b9df4', 'saturate should increase saturation of #3498db by 0.3', {
		expected: '#1b9df4',
		actual: saturate(color1, 0.3).toLowerCase(),
	});

	assert(
		desaturate(color1, 0.3).toLowerCase() === '#4d93c2',
		'desaturate should decrease saturation of #3498db by 0.3',
		{ expected: '#4d93c2', actual: desaturate(color1, 0.3).toLowerCase() },
	);

	assert(
		complementaryColor(color1).toLowerCase() === '#db7734',
		'complementaryColor should find the complementary color of #3498db',
		{ expected: '#db7734', actual: complementaryColor(color1).toLowerCase() },
	);

	assert(
		mixColors(color1, color2, 0.5).toLowerCase() === '#8e728c',
		'mixColors should mix #3498db and #e74c3c by a ratio of 0.5',
		{ expected: '#8e728c', actual: mixColors(color1, color2, 0.5).toLowerCase() },
	);

	assert(invertColor(color1).toLowerCase() === '#cb6724', 'invertColor should invert #3498db', {
		expected: '#cb6724',
		actual: invertColor(color1).toLowerCase(),
	});

	assert(isDark(color1) === false, 'isDark should return false for #3498db', {
		expected: false,
		actual: isDark(color1),
	});

	assert(isLight(color1) === true, 'isLight should return true for #3498db', {
		expected: true,
		actual: isLight(color1),
	});

	assert(rgbToHex([255, 69, 0]) === '#FF4500', 'rgbToHex should convert [255, 69, 0] to #FF4500', {
		expected: '#FF4500',
		actual: rgbToHex([255, 69, 0]),
	});

	// Summary
	console.log('\nTest summary:');
	const passed = results.filter(r => r.status === 'passed').length;
	const failed = results.filter(r => r.status === 'failed');

	console.log(`✅ Passed: ${passed}`);
	console.log(`❌ Failed: ${failed.length}`);

	if (failed.length > 0) {
		console.error('\nFailed tests:');
		for (const { name, details } of failed) {
			console.error(`❌ ${name}`);
			if (details) {
				console.error(`   Expected: ${JSON.stringify(details.expected)}`);
				console.error(`   Actual:   ${JSON.stringify(details.actual)}`);
			}
		}
		throw new Error('Some tests failed.');
	}
};

runTests();
