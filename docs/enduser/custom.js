// @ts-ignore
let { createVisualisation, vArray, vElement, mergeSort, bubbleSort, insertionSort, selectionSort, linearSearch, binarySearch } = VisualDS

document.addEventListener( "DOMContentLoaded", () =>
{
        // @ts-ignore
        const exampleSections = document.querySelectorAll( ".callout-example" );
        exampleSections.forEach( ( section, index ) =>
        {
                const captionText = document.createElement( "p" )
                captionText.innerHTML = "Visual Outout"

                const caption = document.createElement( "div" )
                caption.class = "example-caption"
                caption.appendChild( captionText )

                section.appendChild( caption )

                // Append a new canvas element to the section
                const canvas = document.createElement( "canvas" );
                canvas.id = `exampleCanvas-${index}`;
                canvas.style = "border: 5px solid black; margin: 10px; display: block; width:100%; aspect-ratio: 16/9;";
                section.appendChild( canvas );

                // Get the last <code> snippet in the section
                const codeSnippets = section.querySelectorAll( "pre code" );
                const lastCodeSnippet = codeSnippets[ codeSnippets.length - 1 ];

                if ( lastCodeSnippet )
                {
                        const codeText = lastCodeSnippet.textContent;
                        console.log( "Code inside last snippet:", codeText );

                        // @ts-ignore
                        let codeScript = new Function( [ 'controller' ], codeText );

                        console.log( "Code script:", codeScript );

                        createVisualisation( `exampleCanvas-${index}`, codeScript )
                }
        } );
} )