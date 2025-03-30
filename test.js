import {createVisualisation, setAnimationSpeed, selectionSort, bubbleSort, insertionSort } from "./VisualDS.js"

createVisualisation('cnv', ()=>{
    setAnimationSpeed(1)
    // let arr = [3, 7, 2, 9, 1, 5, 10, 4, 6, 8]
    let arr = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

    insertionSort(arr)
    selectionSort(arr)
    bubbleSort(arr)
})

function allSorts()
{
     // this is where user writes the code. below are some examples
     let inp = [3, 7, 2, 9, 1, 5, 10, 4, 6, 8]
     
     //Selection sort version 1: where we swap whenever smaller element found
     let arr0 = new vArray(inp)
 
     let p01 = arr0.getPointer(0)
     let p02 = arr0.getPointer(0)
 
     for (let i = 0; i < arr0.length(); i++) {
         // take p01 to curr i, and highlight it
         p01.moveTo(i)
         arr0.highlight([i], "blue")
 
         for (let j = i + 1; j < arr0.length(); j++) {
             // take p02 to curr j
             p02.moveTo(j)
 
             if (arr0.get(j) < arr0.get(i)) {
                 // highlight and swap i-th element with j-th element
                 arr0.highlight([i, j], 'red')
                 arr0.swap(i, j)
                 arr0.unhighlight([i, j])
             }
         }
 
         // current i is correctly sorted, highlight it
         arr0.highlight([i], 'green')
     }
}