const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { copy } = require('@guanghechen/rollup-plugin-copy');
const staticFiles = ['styles', 'templates', 'lang', 'module.json'];
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

const sourceDirectory = './src';
const distDirectory = './dist';

module.exports = {
  input: 'src/module/foundryvtt-importer.ts',
  output: {
    dir: 'dist/module',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    json(),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    typescript({}),
    copy({
      targets: [{ src: staticFiles.map((file) => `${sourceDirectory}/${file}`), dest: distDirectory }],
    }),
  ],
};
