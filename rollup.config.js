import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import dts from "rollup-plugin-dts"; // For TypeScript declaration files

// Custom plugin to remove the export statement from the .d.ts file
function removeExportStatement()
{
    return {
        name: "remove-export-statement",
        generateBundle( options, bundle )
        {
            for ( const fileName in bundle )
            {
                if ( fileName.endsWith( ".d.ts" ) )
                {
                    const chunk = bundle[ fileName ];
                    // Remove the export statement at the end of the file
                    chunk.code = chunk.code.replace( /export\s+\{[^}]*\};?\s*$/, "" );
                }
            }
        },
    };
}

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
        input: "types/VisualDS.d.ts", // Path to the generated declaration file
        output: {
            file: "dist/visualds.d.ts", // Output bundled declaration file
            format: "es",
        },
        plugins: [ dts(), removeExportStatement() ], // Generate declaration files and remove export statement
    }
];