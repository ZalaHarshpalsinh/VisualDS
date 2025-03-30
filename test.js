import { createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort, mergeSort, vArray, linearSearch, binarySearch } from "./VisualDS.js"

createVisualisation( 'cnv', () =>
{
    setAnimationSpeed( 10 )
    let arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
    // let arr = [ 3, 7, 2, 9, 1, 5, 10, 4, 6, 8 ]
    // let arr = [ 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 ]

    binarySearch( arr, 7 )
    linearSearch( arr, 7 )
    insertionSort( arr )
    selectionSort( arr )
    bubbleSort( arr )
    mergeSort( arr )
} )