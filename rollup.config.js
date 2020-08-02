import {nodeResolve} from '@rollup/plugin-node-resolve';
import babel from "@rollup/plugin-babel";

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
    },
    plugins: [nodeResolve(), babel({exclude: 'node_modules/**', babelHelpers: "bundled"})],
    external: ['react', 'agora-rtc-sdk-ng']
}
