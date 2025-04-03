import { createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort, mergeSort, vArray, linearSearch, binarySearch, vElement } from "./VisualDS.js"

let arr = [ 3, 7, 2, 9, 1, 5, 10, 4, 6, 8 ]
createVisualisation( 'cnv1', ( controller ) =>
{
    selectionSort( arr )
} )

createVisualisation( 'cnv2', ( controller ) =>
{
    bubbleSort( arr )
} )

createVisualisation( 'cnv3', ( controller ) =>
{
    insertionSort( arr )
} )

createVisualisation( 'cnv4', ( controller ) =>
{
    mergeSort( arr )
} )

function test1()
{
    setAnimationSpeed( 4 )
    let arr = [ 3, 7, 2, 9, 1, 5, 10, 4, 6, 8 ]
    mergeSort( arr )

    setAnimationSpeed( 2 )
    selectionSort( arr )
    bubbleSort( arr )
    insertionSort( arr )

    setAnimationSpeed( 1 )
    linearSearch( arr, 8 )
    arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
    binarySearch( arr, 8 )
}

function test0()
{
    let num = new vElement( 100, '[1]' )
    let str = new vElement( "My name is,\nHarshpal", 'Name' )

    let arr = new vArray( [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ], 'Array' )
    for ( let i = arr.getPointer( 0 ); i.getIndex() < 5 || i.remove(); i.increment() )
    {
        arr.pushBack( i.getIndex() )
        arr.popFront()
    }
}