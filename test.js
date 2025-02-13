import {initialize, render, vArray, animator} from "./demos/array_demo/main.js"

const canvas = document.querySelector("#cnv")
initialize(canvas)

let myArray = new vArray([10,20,30])

myArray.push(100)

let secondArray = new vArray([])

for(let i in myArray.data)
{
    secondArray.push(myArray.data[i]*2)
}

let i = myArray.getPointer(3);
let j = secondArray.getPointer(1);

while(i.index < myArray.data.length-1)
{
    i.move(1);
}

i.move(-1)

j.move(2)
j.move(-1)
j.move(1)

i.move(-1)
i.move(1)
i.move(-1)
i.move(1)
requestAnimationFrame(render)