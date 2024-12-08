import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'esm',
			sourcemap: true,
		},
	],
	plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()],
	external: [],
	onwarn: (warning, warn) => {
		if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.message.includes('Importing JSON modules')) {
			return;
		}
		warn(warning);
	},
};
