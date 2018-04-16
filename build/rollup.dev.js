import path from "path";
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

const fullPath = p => path.resolve(__dirname, "../", p);

module.exports = {
    input: fullPath("src/easy-bar.js"),
    output: {
        file: fullPath("test/dev.js"),
        format: "umd",
        name: "EasyBar",
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
            include: [fullPath("src/") + "**/*.js"] // 需要检查的部分
        }),
        commonjs(),
        babel({
            exclude: "node_modules/**"
        }),
        serve({
            open: false,
            contentBase: fullPath("test/"),
            historyApiFallback: true,
            host: "localhost",
            port: 8080
        }),
        livereload({
            watch: fullPath("test/")
        })
    ]
};
