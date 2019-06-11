import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

import pkg from "./package.json";

const external = [
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.dependencies || {}),
];

const makeExternalPredicate = externalArr => {
    if (externalArr.length === 0) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
    return id => pattern.test(id);
};


const env = process.env.NODE_ENV;

const config = {
    input: 'src/index.js',
    output: {
        file:
            env === 'production'
                ? 'dist/geo-data-integration.min.js'
                : 'dist/geo-data-integration.js',
        format: 'umd',
        name: 'GeoDataIntegration',
    },
    external: makeExternalPredicate(external),
    plugins: [
        nodeResolve(),
        babel({
            exclude: '**/node_modules/**',
            runtimeHelpers: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        commonjs(),
    ],
};

if (env === 'production') {
    config.plugins.push(
        uglify({
            compress: {
                dead_code: true,
            },
        })
    )
}

export default config