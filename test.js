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
    controller.setAnimationSpeed( 3 )
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
    
    let var1 = new vElement(5, 'var1');
    let arr = new vArray([1, 2, 3, 4, 5], 'arr');

    for(let i = arr.getPointer(0, 'i'); (!i.isOutOfBound()) || i.remove(); i.increment())
    {
        // highlight the current element
        i.highlight('orange');

        if(arr.get(i.getIndex())==3)
        {
            arr.set(i.getIndex(), 33, false);
            i.unhighlight();
            i.remove();
            break;
        }

        i.unhighlight();
    }

    var1.setVal('hahahahha', true);

}