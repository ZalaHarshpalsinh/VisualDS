import { vArray } from "../entities/index.js"

/**
 * Creates a visualisation for performing a selection sort on the given array of numbers.
 * @param {number[]} inputArr the array of numbers to sort
 * 
 * @example <caption> Visualising selection sort</caption>
 * // Use the function provided by library
 * selectionSort([5, 4, 3, 2, 1])
 */
function selectionSort( inputArr )
{
    // wrap the inputArr in vArray along with the name of the algorithm as array's label
    let arr = new vArray( inputArr, 'Selection Sort' )

    // get the pointer to the first element of the array, labeled as 'I' and move it till the last element of the vArray linearly
    for ( let i = arr.getPointer( 0, 'I' ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        // for each element, find the minimum element in the unsorted part of the array and swap it with the current element
        let min = i.getIndex()

        // highlight the current element and the minimum element
        i.highlight( 'green' )

        // loop through the rest of the array to find the minimum element
        // This other pointer is labeled as 'J' and moves from the current index to the end of the array
        for ( let j = arr.getPointer( i.getIndex() + 1, 'J' ); !j.isOutOfBound() || j.remove(); j.increment() )
        {
            // check if the current element is less than the minimum element
            if ( arr.get( j.getIndex() ) < arr.get( min ) )
            {
                // if it is, unhighlight the previous minimum element and highlight the current element as the new minimum element
                arr.unhighlight( [ min ] )
                min = j.getIndex()
                j.highlight( 'green' )
            }
        }

        //swap the current element with the minimum element
        arr.swap( i.getIndex(), min, false )
    }
}

/**
 * Creates a visualisation for performing a bubble sort on the given array of numbers.
 * @param {number[]} inputArr the array of numbers to sort
 * 
 * @example <caption> Visualising bubble sort</caption>
 * // Use the function provided by library
 * bubbleSort([5, 4, 3, 2, 1])
 */
function bubbleSort( inputArr )
{
    // wrap the inputArr in vArray along with the name of the algorithm as array's label
    let arr = new vArray( inputArr, 'Bubble Sort' )

    // get the pointer to the first element of the array, labeled as 'I' and move it till the last element of the vArray linearly
    for ( let i = arr.getPointer( 0, 'I' ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        let swap = false

        // for each iteration, loop through the unsorted part of the array and swap adjacent elements if they are in the wrong order
        // This other pointer is labeled as 'J' and moves from the first element to the last unsorted elemen
        for ( let j = arr.getPointer( 0, 'J' ); ( j.getIndex() < arr.length() - 1 - i.getIndex() ) || j.remove(); j.increment() )
        {
            // compare the current element with the next element and swap them if they are in the wrong order
            if ( arr.get( j.getIndex() ) > arr.get( j.getIndex() + 1 ) )
            {
                swap = true
                arr.swap( j.getIndex(), j.getIndex() + 1 )
            }
        }

        // highlight the element that was just sorted in this iteration
        arr.highlight( [ arr.length() - 1 - i.getIndex() ], 'green' )

        // if no swaps were made in this iteration, the array is already sorted, so we can break out of the loop
        if ( !swap )
        {
            // highlight the entire array in green to indicate that it is sorted
            let allIndex = []
            for ( let k = 0; k < arr.length(); k++ )allIndex.push( k )
            arr.highlight( allIndex, 'green' )
            i.remove()
            break
        }
    }
}

/**
 * Creates a visualisation for performing an insertion sort on the given array of numbers.
 * @param {number[]} inputArr the array of numbers to sort
 * 
 * @example <caption> Visualising insertion sort</caption>
 * // Use the function provided by library
 * insertionSort([5, 4, 3, 2, 1])
 */
function insertionSort( inputArr )
{
    // wrap the inputArr in vArray along with the name of the algorithm as array's label
    let arr = new vArray( inputArr, 'Insertion Sort' )

    // highlight the first element in green to indicate that it is sorted
    arr.highlight( [ 0 ], 'green' )

    // get the pointer to the second element of the array, labeled as 'I' and move it till the last element of the vArray linearly
    for ( let i = arr.getPointer( 1, 'I' ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        // for each element, highlight it to indicate that it is being sorted
        i.highlight()

        // loop through the sorted part of the array to find the correct position for the current element
        // This other pointer is labeled as 'J' and moves from the current index to the beginning of the array
        let j = arr.getPointer( i.getIndex() - 1, 'J' )

        // check if the current element is greater than the element to its right
        while ( !j.isOutOfBound() && arr.get( j.getIndex() ) > arr.get( j.getIndex() + 1 ) )
        {
            // if it is, swap the two elements and move the pointer to the left
            arr.swap( j.getIndex(), j.getIndex() + 1, false )
            j.decrement()
        }

        // highlight the element that was just sorted in this iteration
        arr.highlight( [ j.getIndex() + 1 ], 'green' )
        j.remove()
    }
}


/**
 * Creates a visualisation for performing a merge sort on the given array of numbers.
 * @param {number[]} inputArr the array of numbers to sort
 * 
 * @example <caption> Visualising merge sort</caption>
 * // Use the function provided by library
 * mergeSort([5, 4, 3, 2, 1]) 
 */
function mergeSort( inputArr )
{
    // sort is a recursive function that takes the array, start index and end index as parameters and sorts the array using the merge sort algorithm
    function sort( arr, s, e )
    {
        // temporarily highlight the range of elements being sorted
        arr.highlightRange( s, e, 'SpringGreen' )
        arr.unhighlightRange( s, e )

        // base case: if the start index is equal to the end index, return
        if ( s === e ) return

        // find the middle index of the current range 
        let m = Math.floor( ( s + e ) / 2 )

        // call the sort function recursively with the left half of the array and the right half of the array
        sort( arr, s, m )
        sort( arr, m + 1, e )

        // merge the two halves of the array
        merge( arr, s, m, e )
    }

    // merge is a helper function that takes the array, start index, middle index and end index as parameters and merges the two halves of the array
    function merge( arr, s, m, e )
    {
        // highlight the range of elements being merged with different colors for the left and right halves
        arr.highlightRange( s, m, 'Turquoise' )
        arr.highlightRange( m + 1, e, 'Tomato' )

        // create two temporary arrays to hold the left and right halves of the array
        // add a '#' at the end of each array to indicate the end of the array (# is treated as infinity)
        let leftTmp = [], rightTmp = []
        for ( let i = s; i <= m; i++ )
        {
            leftTmp.push( arr.get( i ) )
        }
        leftTmp.push( '#' )
        for ( let i = m + 1; i <= e; i++ )
        {
            rightTmp.push( arr.get( i ) )
        }
        rightTmp.push( '#' )

        // wrap the left and right arrays in vArray along with proper names
        let left = new vArray( leftTmp, 'left' ), right = new vArray( rightTmp, 'right' )
        // highlight the entire left and right arrays in different colors
        left.highlightRange( 0, left.length() - 1, 'Turquoise' )
        right.highlightRange( 0, right.length() - 1, 'Tomato' )

        // get the pointer to the first element of the current sort range, labeled as 'I' and move it till the last element of the range linearly
        for ( let i = arr.getPointer( s, 'I' ); i.getIndex() <= e || i.remove(); i.increment() )
        {
            // compare the first elements of the left and right arrays
            if ( right.get( 0 ) === '#' || ( left.get( 0 ) !== '#' && left.get( 0 ) < right.get( 0 ) ) )
            {
                // if the left element is smaller, pop it from the left array and set it to the current index of the merged array
                arr.set( i.getIndex(), left.popFront() )
            }
            else
            {
                // if the right element is smaller, pop it from the right array and set it to the current index of the merged array
                arr.set( i.getIndex(), right.popFront() )
            }
        }

        // highlight the merged range in green to indicate that it is sorted
        arr.highlightRange( s, e, 'green' )

        // remove the left and right arrays from the visualisation
        left.remove()
        right.remove()
    }

    // wrap the inputArr in vArray along with the name of the algorithm as array's label
    let arr = new vArray( inputArr, 'Merge Sort' )
    // call the sort function with the array, start index and end index
    sort( arr, 0, arr.length() - 1 )
}

export { selectionSort, bubbleSort, insertionSort, mergeSort }