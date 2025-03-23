import {createVisualisation} from './driver.js'
import {vElement, vArray} from './entities/index.js'

createVisualisation('cnv', ()=>{
    let a = new vElement(10)
    let b = new vElement(JSON.stringify({name:'Harshpal', val: 100}))

    let arr = new vArray([10, 20, 30, "Harshpal\nSanket", "Me ak dur desh ka vyapari hu\nYe mere sathi hai Nobita"])
    let nums = new vArray([1, 2, 3, 4, 5, 1000])

    arr.highlight([0,2,4])
    nums.highlight([1,3,5], "red")
    arr.unhighlight([0,2,4])
    nums.unhighlight([1,3,5])

})