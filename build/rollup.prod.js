import resolve from "rollup-plugin-node-resolve";
import eslint from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";
import simplevars from "postcss-simple-vars";
import nested from "postcss-nested";
import cssnext from "postcss-cssnext";
import cssnano from "cssnano";
import config from "../config/config.js";

const banner =
    "/*!\n" +
    "* author: PengYuan-Jiang\n" +
    "* email: 392579823@qq.com\n" +
    "*/";

module.exports = {
    input: config.inputFile,
    output: [
        {
            file:
                config.outputPath + "/" + config.outputBaseFileName + ".umd.js",
            format: "umd",
            name: config.moduleName,
            banner: banner
        },
        {
            file:
                config.outputPath +
                "/" +
                config.outputBaseFileName +
                ".browser.js",
            format: "iife",
            name: config.moduleName,
            banner: banner
        },
        {
            file:
                config.outputPath +
                "/" +
                config.outputBaseFileName +
                ".module.js",
            format: "es",
            name: config.moduleName,
            banner: banner
        }
    ],
    plugins: [
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || "production")
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
        })
    ]
};
