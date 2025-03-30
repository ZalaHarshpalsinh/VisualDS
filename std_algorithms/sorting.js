import { vArray } from "../entities/index.js"

function selectionSort(inputArr)
{
    let arr = new vArray(inputArr)

    for(let i=arr.getPointer(0); !i.isOutOfBound() || i.remove(); i.increment())
    {
        let min = i.getIndex()
        i.highlight('green')

        for(let j=arr.getPointer(i.getIndex()+1); !j.isOutOfBound() || j.remove(); j.increment())
        {
            if(arr.get(j.getIndex()) < arr.get(min))
            {
                arr.unhighlight([min])
                min = j.getIndex()
                j.highlight('green')
            }
        }
        arr.swap(i.getIndex(), min, false)
    }
}

function bubbleSort(inputArr)
{
    let arr = new vArray(inputArr)
    for(let i=arr.getPointer(0); !i.isOutOfBound() || i.remove(); i.increment())
    {
        let swap = false
        for(let j=arr.getPointer(0); (j.getIndex() < arr.length()-1-i.getIndex()) || j.remove(); j.increment())
        {
            if(arr.get(j.getIndex()) > arr.get(j.getIndex()+1) )
            {
                swap = true
                arr.swap(j.getIndex(),j.getIndex()+1)
            }
        }

        arr.highlight([arr.length()-1-i.getIndex()], 'green')
        if(!swap)
        {
            let allIndex = []
            for(let k=0;k<arr.length();k++)allIndex.push(k)
            arr.highlight(allIndex, 'green')
            break
        }
    }
}

function insertionSort(inputArr)
{
    let arr = new vArray(inputArr)

    arr.highlight([0], 'green')
    for(let i=arr.getPointer(1); !i.isOutOfBound() || i.remove(); i.increment())
    {
        i.highlight()
        let j=arr.getPointer(i.getIndex()-1)
        while(!j.isOutOfBound() && arr.get(j.getIndex()) > arr.get(j.getIndex()+1))
        {
            arr.swap(j.getIndex(), j.getIndex()+1, false)
            j.decrement()
        }
        arr.highlight([j.getIndex()+1], 'green')
        j.remove()
    }
}

export {selectionSort, bubbleSort, insertionSort}