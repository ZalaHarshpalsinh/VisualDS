import {createVisualisation} from './driver.js'
import {vElement, vArray} from './entities/index.js'

createVisualisation('cnv', ()=>{
    // let a = new vElement(10)
    // let b = new vElement(JSON.stringify({name:'Harshpal', val: 100}))

    // let arr = new vArray([10, 20, 30, "Harshpal\nSanket", "Me ak dur desh ka vyapari hu\nYe mere sathi hai Nobita"])
    let nums = new vArray([1, 2, 3, 4, 5, 1000])

    nums.highlight([1], 'red')
    nums.highlight([3], 'green')
    nums.swap(1,3)
    nums.unhighlight([1,3])
})