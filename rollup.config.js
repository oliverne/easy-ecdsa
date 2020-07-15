import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'umd',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      rollupCommonJSResolveHack: true,
    }),
  ],
};
