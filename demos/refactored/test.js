import {createVisualisation} from './driver.js'
import {vElement} from './entities/vElement/vElement.js'

createVisualisation('cnv', ()=>{
    let a = new vElement(10)
    let b = new vElement(JSON.stringify({name:'Harshpal', val: 100}))
})