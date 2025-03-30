import { vArray } from "../entities/index.js"

function selectionSort( inputArr )
{
    let arr = new vArray( inputArr )

    for ( let i = arr.getPointer( 0 ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        let min = i.getIndex()
        i.highlight( 'green' )

        for ( let j = arr.getPointer( i.getIndex() + 1 ); !j.isOutOfBound() || j.remove(); j.increment() )
        {
            if ( arr.get( j.getIndex() ) < arr.get( min ) )
            {
                arr.unhighlight( [ min ] )
                min = j.getIndex()
                j.highlight( 'green' )
            }
        }
        arr.swap( i.getIndex(), min, false )
    }
}

function bubbleSort( inputArr )
{
    let arr = new vArray( inputArr )
    for ( let i = arr.getPointer( 0 ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        let swap = false
        for ( let j = arr.getPointer( 0 ); ( j.getIndex() < arr.length() - 1 - i.getIndex() ) || j.remove(); j.increment() )
        {
            if ( arr.get( j.getIndex() ) > arr.get( j.getIndex() + 1 ) )
            {
                swap = true
                arr.swap( j.getIndex(), j.getIndex() + 1 )
            }
        }

        arr.highlight( [ arr.length() - 1 - i.getIndex() ], 'green' )
        if ( !swap )
        {
            let allIndex = []
            for ( let k = 0; k < arr.length(); k++ )allIndex.push( k )
            arr.highlight( allIndex, 'green' )
            break
        }
    }
}

function insertionSort( inputArr )
{
    let arr = new vArray( inputArr )

    arr.highlight( [ 0 ], 'green' )
    for ( let i = arr.getPointer( 1 ); !i.isOutOfBound() || i.remove(); i.increment() )
    {
        i.highlight()
        let j = arr.getPointer( i.getIndex() - 1 )
        while ( !j.isOutOfBound() && arr.get( j.getIndex() ) > arr.get( j.getIndex() + 1 ) )
        {
            arr.swap( j.getIndex(), j.getIndex() + 1, false )
            j.decrement()
        }
        arr.highlight( [ j.getIndex() + 1 ], 'green' )
        j.remove()
    }
}

function mergeSort( inputArr )
{
    function sort( arr, s, e )
    {
        arr.highlightRange( s, e, 'SpringGreen' )
        arr.unhighlightRange( s, e )

        if ( s === e ) return
        let m = Math.floor( ( s + e ) / 2 )
        sort( arr, s, m )
        sort( arr, m + 1, e )
        merge( arr, s, m, e )
    }

    function merge( arr, s, m, e )
    {
        arr.highlightRange( s, m, 'Turquoise' )
        arr.highlightRange( m + 1, e, 'Tomato' )

        let left = [], right = []
        for ( let i = s; i <= m; i++ )
        {
            left.push( arr.get( i ) )
        }
        left.push( '#' )
        for ( let i = m + 1; i <= e; i++ )
        {
            right.push( arr.get( i ) )
        }
        right.push( '#' )

        left = new vArray( left ), right = new vArray( right )
        left.highlightRange( 0, left.length() - 1, 'Turquoise' )
        right.highlightRange( 0, right.length() - 1, 'Tomato' )

        for ( let i = arr.getPointer( s ); i.getIndex() <= e || i.remove(); i.increment() )
        {
            if ( right.get( 0 ) === '#' || ( left.get( 0 ) !== '#' && left.get( 0 ) < right.get( 0 ) ) )
            {
                arr.set( i.getIndex(), left.popFront() )
            }
            else
            {
                arr.set( i.getIndex(), right.popFront() )
            }
        }

        arr.highlightRange( s, e, 'green' )

        left.remove()
        right.remove()
    }

    let arr = new vArray( inputArr )
    sort( arr, 0, arr.length() - 1 )
}

export { selectionSort, bubbleSort, insertionSort, mergeSort }