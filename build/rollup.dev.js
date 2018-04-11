import resolve from "rollup-plugin-node-resolve";
import eslint from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";

import config from "../config/config.js";

module.exports = {
    input: config.inputFile,
    output: {
        file: config.testBasePath + "/" + "dev.js",
        format: "iife",
        name: config.moduleName,
        sourcemap: true
    },
    plugins: [
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || "development")
        }),
        postcss({
            plugins: [
                simplevars(),
                nested(),
                cssnext({ warnForDuplicates: false }),
                cssnano()
            ],
            extensions: [".css"]
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        eslint({
            include: [config.srcPath + "/**/*.js"] // 需要检查的部分
        }),
        commonjs(),
        babel({
            exclude: "node_modules/**"
        }),
        serve({
            open: false,
            contentBase: config.testBasePath,
            historyApiFallback: true,
            host: config.testHost,
            port: config.testPort
        }),
        livereload({
            watch: config.testBasePath
        })
    ]
};
