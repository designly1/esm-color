
# esm-color

[![Test and Coverage](https://github.com/designly1/esm-color/actions/workflows/test-and-coverage.yml/badge.svg)](https://github.com/designly1/esm-color/actions/workflows/test-and-coverage.yml)

A lightweight, tree-shakable ESM library for color manipulation. Supply any valid CSS color string (e.g., `#3498db`, `green`, `rgb(255,0,0)`, or `hsl(240,100%,50%)`) to a variety of utility functions for parsing, converting, and manipulating colors.

## Features

- Parse and convert between color formats (e.g., RGB, HSL, HEX).
- Manipulate colors with functions like `lighten`, `darken`, `saturate`, and `desaturate`.
- Check whether a color is light or dark.
- Generate complementary, inverted, or mixed colors.

## Installation

Install the library using npm:

```bash
npm install esm-color
```

## Usage

Import the functions you need and use them in your project:

```ts
import { lighten, darken, parseColor, complementaryColor } from 'esm-color';

// Lighten a color
const lightenedColor = lighten('#3498db', 0.2); // #5ba8e1

// Darken a color
const darkenedColor = darken('#3498db', 0.2); // #2e7aba

// Parse a color
const rgba = parseColor('rgba(255, 0, 0, 0.5)'); // [255, 0, 0, 0.5]

// Get a complementary color
const complementary = complementaryColor('#3498db'); // #db8234
```

## API

### `parseColor(color: string): RGBA`
Parses a CSS color string into an RGBA array. Supported formats:
- HEX (`#3498db`, `#fff`)
- RGB (`rgb(255, 0, 0)`)
- RGBA (`rgba(255, 0, 0, 0.5)`)

---

### `lighten(color: string, ratio: number): string`
Lightens a color by a specified ratio (0 to 1).

---

### `darken(color: string, ratio: number): string`
Darkens a color by a specified ratio (0 to 1).

---

### `rgbToHsl(rgb: RGB): HSL`
Converts an RGB color to HSL format.

---

### `hslToRgb(hsl: HSL): RGB`
Converts an HSL color to RGB format.

---

### `rgbToHex(rgb: RGB): string`
Converts an RGB color to HEX format.

---

### `isDark(color: string): boolean`
Determines if a color is dark.

---

### `isLight(color: string): boolean`
Determines if a color is light.

---

### `saturate(color: string, ratio: number): string`
Increases the saturation of a color by a specified ratio (0 to 1).

---

### `desaturate(color: string, ratio: number): string`
Decreases the saturation of a color by a specified ratio (0 to 1).

---

### `adjustHue(color: string, degrees: number): string`
Adjusts the hue of a color by the specified number of degrees (-360 to 360).

---

### `mixColors(color1: string, color2: string, ratio: number): string`
Mixes two colors by the specified ratio (0 to 1).

---

### `invertColor(color: string): string`
Inverts a color (e.g., black to white).

---

### `complementaryColor(color: string): string`
Finds the complementary color of the given color.

---

## License

This project is licensed under the MIT License. See [LICENSE.md](./LICENSE.md) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full changelog.

---

## Contribution

Feel free to contribute by submitting issues or pull requests. We welcome feedback and suggestions to improve the library.

---

## Contact

- **Author:** Jay Simons
- **Email:** [jay@1337707.xyz](mailto:jay@1337707.xyz)
- **Website:** [1337707.xyz](https://1337707.xyz)

---
