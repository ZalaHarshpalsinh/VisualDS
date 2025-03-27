import { Entity } from "../Entity.js"
import { ctx } from "../../driver.js"
import { cnt } from "../../CONSTANTS.js"
import { drawRectangle, drawText } from "../../utils/helper.js"

/**
 * This is that class that encapsulates any object that is to be drawn.
 * It may be number, string, or even a custom Student object.
 * It is through this class that we support drawing anything with a toString overridden.
 */
export class vElement extends Entity
{
    /**
     * 
     * @param {any} val The object to visualize. Must have a toString overridden which returns a single/multi line respresentation of object in case it is a custom object.
     * @param {boolean} customCoordinates True if this vElement where it needs to be drawn, which will typically be the case, since the vArray (or any other DS which we might support in future) of which it is a part will give proper x and y coords to this. Otherwise false.
     */
    constructor(val, customCoordinates=false)
    {
        super()
        this.val = val
        this.syncDataAndVisual()
        this.customCoordinates  = customCoordinates
        super.addInPool()
        
        this.color = cnt.DEFAULT_COLOR
    }
    
    /**
     * To actually draw the encapsulated object inside a rectange, with the single/multi line text provided by the toString.
     */
    draw()
    {
        drawRectangle(this.x, this.y, this.width, this.height, this.color, 'black')
        
        let brushX = this.x 
        let brushY = this.y + cnt.PAD_Y 

        this.text.forEach(line => {
            drawText(line, brushX + this.width/2, brushY+cnt.DEFAULT_LINE_HEIGHT/2, '10px serif' ,'black', 'center', 'middle')
            brushY += cnt.DEFAULT_LINE_HEIGHT
        })
    }

    /**
     * To calculate dimensions based on toString of the encapsulated object.
     */
    syncDataAndVisual()
    {
        this.text = this.val.toString().split('\n')
        let maxWidth = 0
        this.text.forEach(line => {
            maxWidth = Math.max(maxWidth, ctx.measureText(line).width)
        });
        this.width = maxWidth + cnt.PAD_X*2
        this.height = this.text.length * cnt.DEFAULT_LINE_HEIGHT + cnt.PAD_Y*2
    }

    /**
     * To change the box's background color
     * @param {string} color The name of the color (supports any CSS color property value)
     */
    changeColor(color)
    {
        this.color = color
    }

    /**
     * To set the new value
     * @param {*} val The new value
     */
    setVal(val)
    {
        this.val = val
        this.syncDataAndVisual()
    }

    /**
     * To get the current value
     * @returns The current value stored by vElement
     */
    getVal()
    {
        return this.val
    }
}