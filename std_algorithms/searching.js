import { vArray } from "../entities/index.js"


/**
 * Creates a visualisation for performing a linear search on the given array of numbers and highlights the first found element.
 * @param {number[]} inputArr the array of numbers to search in
 * @param {number} target the number to search for
 * 
 * @example <caption> Visualising linear search </caption>
 * // Use the function provided by library
 * linearSearch([1,2,3,4,5], 5)
 */
function linearSearch( inputArr, target )
{
        // wrap the inpurArr in vArray along with the name of the algorithm as array's label
        let arr = new vArray( inputArr, 'Linear Search' )

        // get the pointer to the first element of the array, labeled as 'I' and move it till the last element of the vArray linearly
        for ( let i = arr.getPointer( 0, 'I' ); !i.isOutOfBound() || i.remove(); i.increment() )
        {
                // highlight the current element and check if it is equal to the target
                i.highlight()
                if ( arr.get( i.getIndex() ) == target )
                {
                        // if it is, highlight it in green and remove the pointer
                        i.highlight( 'green' )
                        i.remove()
                        //search is over
                        break
                }
                else
                {
                        // if it is not, unhighlight the current element and move to the next one
                        i.unhighlight()
                }
        }
}

/**
 * Creates a visualisation for performing a binary search on the given sorted array of numbers and highlights the found element.
 * @param {number[]} sortedArr the sorted array of numbers to search in
 * @param {number} target the number to search for
 * 
 * @example <caption> Visualising binary search </caption>
 * // Use the function provided by library
 * binarySearch([1,2,3,4,5], 5)
 */
function binarySearch( sortedArr, target )
{
        // wrap the sortedArr in vArray along with the name of the algorithm as array's label
        let arr = new vArray( sortedArr, 'Binary Search' )

        // call the search function with the array, start index, end index and target number
        search( arr, 0, arr.length() - 1, target )


        // the search function is a recursive function that takes the array, start index, end index and target number as parameters
        function search( arr, s, e, target )
        {
                // base case: if the start index is greater than the end index, return
                if ( s > e ) return

                // highlight the range of elements being searched
                arr.highlightRange( s, e )

                // find the middle index of the current range and highlight it in red
                let mid = Math.floor( ( s + e ) / 2 )
                arr.highlight( [ mid ], 'red' )

                // unhighlight the range of elements being searched
                arr.unhighlightRange( s, e )

                // check if the middle element is greater than the target number
                if ( arr.get( mid ) > target )
                {
                        // if it is, call the search function recursively with the left half of the array
                        search( arr, s, mid - 1, target )
                }
                // check if the middle element is less than the target number
                else if ( arr.get( mid ) < target )
                {
                        // if it is, call the search function recursively with the right half of the array
                        search( arr, mid + 1, e, target )
                }
                // if the middle element is equal to the target number, highlight it in green and return
                else
                {
                        arr.highlight( [ mid ], 'green' )
                        return
                }
        }
}

export { linearSearch, binarySearch }