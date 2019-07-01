import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV;

const config = {
    input: 'src/index.js',
    output: {
        file:
            env === 'production'
                ? 'dist/geo-data-integration.min.js'
                : 'dist/geo-data-integration.js',
        format: 'umd',
        // globals: {
        //     "@turf/along": 'along',
        //     "@turf/bearing": 'bearing',
        //     "@turf/distance": 'distance',
        //     "@turf/helpers": 'helpers',
        //     "@turf/nearest-point-on-line": 'nearestPointOnLine',
        //     "@turf/point-to-line-distance": 'pointToLineDistance',
        //     "heap": 'Heap',
        //     "geojson-rbush": 'geojsonrbush'
        // },
        name: 'GeoDataIntegration',
    },
    external: [
        // "@turf/along",
        // "@turf/bearing",
        // "@turf/distance",
        // "@turf/helpers",
        // "@turf/nearest-point-on-line",
        // "@turf/point-to-line-distance",
        "axios", //todo: these shouldn't be dependencies for the algorithm, split to a new data fetch package/integration demo package
        "fast-xml-parser",
        // "geojson-rbush",
        // "heap",
        "ldfetch",
        // "rbush"
    ],
    plugins: [
        babel({
            exclude: '**/node_modules/**',
            runtimeHelpers: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        // json(),
        nodeResolve({browser: true}),
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