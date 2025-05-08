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

                const button = document.createElement( 'button' )
                button.id = `run-btn-${index}`
                button.style = "margin: 10px; padding: 5px; background-color: lightgreen"
                button.innerHTML = "Visualise"

                caption.appendChild( captionText )
                section.appendChild( caption )
                section.appendChild( button )


                // Append a new canvas element to the section
                const canvas = document.createElement( "canvas" );
                canvas.id = `exampleCanvas-${index}`;
                canvas.style = "border: 5px solid black; margin: 10px; display: block; width:100%; aspect-ratio: 2";
                section.appendChild( canvas );

                // Get the last <code> snippet in the section
                const codeSnippets = section.querySelectorAll( "pre code" );
                const lastCodeSnippet = codeSnippets[ codeSnippets.length - 1 ];

                if ( lastCodeSnippet )
                {
                        let codeText = lastCodeSnippet.textContent;

                        codeText = "controller.setZoom(2)\n\n" + codeText
                        // @ts-ignore
                        let codeScript = new Function( [ 'controller' ], codeText );

                        createVisualisation( `exampleCanvas-${index}`, codeScript )
                        button.addEventListener( "click", () =>
                        {
                                createVisualisation( `exampleCanvas-${index}`, codeScript )
                        } );
                }
        } );
} )