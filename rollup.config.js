import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';


////////////////////////////////////////////////
//  ROLLUP
////////////////////////////////////////////////


export default {
    input: `src/client/index.js`,
    output: {
        format: `iife`,
        file: `public/assets/js/script.js`,
        globals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter'
        }
    },
    plugins: [
        babel({
            babelrc: false,
            plugins: [
                [
                    `babel-plugin-root-import`,
                    {
                        rootPathPrefix: `@/`,
                        rootPathSuffix: `src/client`
                    }
                ],
                "@vue/babel-plugin-jsx"
            ],
            babelHelpers: `bundled`
        }),
        terser()
    ],
    external: [
        'vue',
        'vue-router'
    ]
}