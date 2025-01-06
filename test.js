import {initialize, render, vArray} from "./demos/array_demo/main.js"

const canvas = document.querySelector("#cnv")
initialize(canvas)

let myArray = new vArray([10,20,30])

myArray.push(100)

let secondArray = new vArray([])

for(let i in myArray.data)
{
    secondArray.push(myArray.data[i]*2)
}

requestAnimationFrame(render)