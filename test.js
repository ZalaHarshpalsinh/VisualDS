import {createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort, mergeSort, vArray } from "./VisualDS.js"

createVisualisation('cnv', ()=>{
    setAnimationSpeed(1)
    // let arr = [3, 7, 2, 9, 1, 5, 10, 4, 6, 8]
    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

    // insertionSort(arr)
    // selectionSort(arr)
    // bubbleSort(arr)
    // mergeSort(arr)

    let x = []
    for(let i=0;i<5;i++)
    {
        x.push(new vArray([1,2,3]))
    }
    for(let i=0;i<3;i++)
    {
        x[i].remove()
    }
    for(let i=0;i<5;i++)
    {
        x.push(new vArray([4,5,6]))
    }
})