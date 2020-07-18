import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupJSON from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    },
    {
      name: 'EasyECDSA',
      file: 'dist/index.umd.js',
      format: 'umd',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  ],

  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    rollupJSON(),
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    terser({
      output: {
        comments: function (node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == 'comment2') {
            return /@preserve|@license|@cc_on/i.test(text);
          }
        },
      },
    }),
  ],
};
