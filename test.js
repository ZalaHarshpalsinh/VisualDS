import {createVisualisation} from './driver.js'
import {vElement, vArray} from './entities/index.js'

createVisualisation('cnv', ()=>{
    setTimeout(()=>{
        let arr = new vArray([1,2,3,4,5])
        
        for(let i=arr.getPointer(0); i.index<arr.length() || i.delete(); i.increment())
        {
            i.highlight('red')
            i.unhighlight()
        }
        
        arr.delete()
        
        let num = new vArray([10, 20, 30])
        
    }, 0)
})

function allSorts()
{
     // this is where user writes the code. below are some examples

     let inp = [1, 2, 3, 4, 5, 10, 9, 8, 7, 6]

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
 
             if (arr0.at(j) < arr0.at(i)) {
                 // highlight and swap i-th element with j-th element
                 arr0.highlight([i, j], 'red')
                 arr0.swap(i, j)
                 arr0.unhighlight([i, j])
             }
         }
 
         // current i is correctly sorted, highlight it
         arr0.highlight([i], 'green')
     }
 
     //Selection sort version 2: where we keep trach of the min index
     let arr = new vArray(inp)
 
     let p1 = arr.getPointer(0)
     let p2 = arr.getPointer(0)
     for(let i=0; i<arr.length();i++)
     {
         // take p1 to curr i, and highlight it
         p1.moveTo(i)
         arr.highlight([i], "blue")
 
         let min = i;
         for(let j=i+1;j<arr.length();j++)
         {
             // take p2 to curr j
             p2.moveTo(j)
             if(arr.at(j)<arr.at(min))
             {
                 // if got a new min, unhighlight prev, and then highlight new one
 
                 // unhighlight prev min iff it is not i
                 if(min!=i)arr.unhighlight([min])
                 // new min
                 min = j;
                 // highlight it
                 arr.highlight([min], "green")
             }
         }
         
         if(min != i)
         {
             // highlight and swap iit element with minth element
             arr.highlight([i, min], 'red')
             arr.swap(i, min)
             arr.unhighlight([i, min])  
         }
         
         // current i is correctly sorted, highlight it
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
}