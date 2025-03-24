import {createVisualisation} from './driver.js'
import {vElement, vArray} from './entities/index.js'

createVisualisation('cnv', ()=>{

    //Selection sort
    let arr = new vArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    let p1 = arr.getPointer(0)
    let p2 = arr.getPointer(0)
    for(let i=0; i<arr.length()-1;i++)
    {
        p1.moveTo(i)
        arr.highlight([i], "blue")

        let min = i;
        for(let j=i+1;j<arr.length();j++)
        {
            p2.moveTo(j)
            if(arr.at(j)<arr.at(min))
            {
                if(min!=i)arr.unhighlight([min])
                min = j;
                arr.highlight([min], "green")
            }
        }
        
        if(min != i)
        {
            arr.highlight([i, min], 'red')
            arr.swap(i, min)
            arr.unhighlight([i, min])  
        }
        
        arr.unhighlight([i])
    }


    //Bubble sort
    let arr2 = new vArray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

    p1 = arr2.getPointer(0)

    for(let i=0;i<arr2.length()-1;i++)
    {
        for(let j=0;j<arr2.length()-1-i;j++)
        {
            p1.moveTo(j)

            if(arr2.at(j)>arr2.at(j+1))
            {
                arr2.highlight([j, j+1], 'red')
                arr2.swap(j, j+1)
                arr2.unhighlight([j, j+1])
            }
        }
        arr2.highlight([arr2.length()-1-i], 'green')
    }
})