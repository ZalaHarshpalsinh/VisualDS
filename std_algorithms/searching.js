import { vArray } from "../entities/index.js"

function linearSearch( inputArr, target )
{
        let arr = new vArray( inputArr, 'Linear Search' )

        for ( let i = arr.getPointer( 0, 'I' ); !i.isOutOfBound() || i.remove(); i.increment() )
        {
                i.highlight()
                if ( arr.get( i.getIndex() ) == target )
                {
                        i.highlight( 'green' )
                        i.remove()
                        break
                }
                else
                {
                        i.unhighlight()
                }
        }
}

function binarySearch( sortedArr, target )
{
        let arr = new vArray( sortedArr, 'Binary Search' )
        search( arr, 0, arr.length() - 1, target )

        function search( arr, s, e, target )
        {
                if ( s > e ) return

                arr.highlightRange( s, e )
                let mid = Math.floor( ( s + e ) / 2 )
                arr.highlight( [ mid ], 'red' )
                arr.unhighlightRange( s, e )
                if ( arr.get( mid ) > target )
                {
                        search( arr, s, mid - 1, target )
                }
                else if ( arr.get( mid ) < target )
                {
                        search( arr, mid + 1, e, target )
                }
                else
                {
                        arr.highlight( [ mid ], 'green' )
                        return
                }
        }
}

export { linearSearch, binarySearch }