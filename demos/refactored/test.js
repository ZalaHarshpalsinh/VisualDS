import {createVisualisation} from './driver.js'
import {vElement, vArray} from './entities/index.js'

createVisualisation('cnv', ()=>{
    let inp = [1, 2, 3, 4, 5, 10, 9, 8, 7, 6]
    //Selection sort
    let arr = new vArray(inp)

    let p1 = arr.getPointer(0)
    let p2 = arr.getPointer(0)
    for(let i=0; i<arr.length();i++)
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
        
        arr.highlight([i], 'green')
    }


    //Bubble sort
    let arr2 = new vArray(inp)

    let p3 = arr2.getPointer(0)

    for(let i=0;i<arr2.length();i++)
    {
        for(let j=0;j<arr2.length()-1-i;j++)
        {
            p3.moveTo(j)

            if(arr2.at(j)>arr2.at(j+1))
            {
                arr2.highlight([j, j+1], 'red')
                arr2.swap(j, j+1)
                arr2.unhighlight([j, j+1])
            }
        }
        arr2.highlight([arr2.length()-1-i], 'green')
    }

    //Insertion sort
    let arr3 = new vArray(inp)

    let p4 = arr3.getPointer(1)
    arr3.highlight([0], "green")

    for(let i=1;i<arr3.length();i++)    
    {
        p4.moveTo(i)
        arr3.highlight([i], "blue")

        let key = arr3.at(i)
        let j = i-1
        while(j>=0 && arr3.at(j)>key)
        {
            arr3.swap(j, j+1)
            j--
        }

        arr3.highlight([j+1], "green")
    }
})