import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts"; // For TypeScript declaration files

export default [
    {
        input: "VisualDS.js", // Entry point of the library
        output: {
            file: "dist/visualds.min.js", // Output file
            format: "iife", // Immediately Invoked Function Expression for browser compatibility
            name: "VisualDS", // Global variable name for the library
        },
        plugins: [ resolve(), terser() ], // Resolve imports and minify
    },
    {
        input: "dist/VisualDS.d.ts", // Path to the generated declaration file
        output: {
            file: "dist/visualds.d.ts", // Output bundled declaration file
            format: "es",
        },
        plugins: [ dts() ],
    } ];