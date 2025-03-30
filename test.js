import { createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort, mergeSort, vArray } from "./VisualDS.js"

createVisualisation( 'cnv', () =>
{
    setAnimationSpeed( 4 )
    let arr = [ 3, 7, 2, 9, 1, 5, 10, 4, 6, 8 ]
    // let arr = [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]

    mergeSort( arr )
    insertionSort( arr )
    selectionSort( arr )
    bubbleSort( arr )

} )