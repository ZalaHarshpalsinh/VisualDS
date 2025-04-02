import { createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort, mergeSort, vArray, linearSearch, binarySearch, vElement } from "./VisualDS.js"

createVisualisation( 'cnv', () =>
{
    test0()
} )

function test1()
{
    setAnimationSpeed( 4 )
    let arr = [ 3, 7, 2, 9, 1, 5, 10, 4, 6, 8 ]

    selectionSort( arr )
    bubbleSort( arr )
    insertionSort( arr )
    mergeSort( arr )
    linearSearch( arr, 8 )
    arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
    binarySearch( arr, 8 )
}

function test0()
{
    let num = new vElement( 100, '[1]' )
    let str = new vElement( "My name is,\nHarshpal", 'Name' )
}