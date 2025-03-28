import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "VisualDS.js", // Entry point of the library
    output: {
        file: "dist/visualds.min.js", // Output file
        format: "iife", // Immediately Invoked Function Expression for browser compatibility
        name: "VisualDS", // Global variable name for the library
    },
    plugins: [resolve(), terser()], // Resolve imports and minify
};