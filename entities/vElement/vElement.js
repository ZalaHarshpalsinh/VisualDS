import { Entity } from "../Entity.js"
import { ctx } from "../../driver.js"
import { cnt } from "../../CONSTANTS.js"
import { drawRectangle, drawText, StateMachine } from "../../utils/index.js"
import {IdleState, PropertyChangeState} from './states/index.js'

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
    constructor(val, isSlave=false)
    {
        super()

        this.val = val
        this.drawVal = val
        this.syncDataAndVisual()
        this.color = cnt.DEFAULT_COLOR
       
        if(!isSlave)
            super.addInPool()
        
        this.stateMachine = new StateMachine({
            idle: ()=> new IdleState(this),
            property_change: ()=> new PropertyChangeState(this),
        }, 'idle')
    }

    update(dt)
    {
        this.stateMachine.update(dt)
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

    changeState(toState, params)
    {
        this.stateMachine.change(toState, params)
    }

    /**
     * To calculate dimensions based on toString of the encapsulated object.
     */
    syncDataAndVisual()
    {
        this.text = this.drawVal.toString().split('\n')
        let maxWidth = 0
        this.text.forEach(line => {
            maxWidth = Math.max(maxWidth, ctx.measureText(line).width)
        });
        this.width = maxWidth + cnt.PAD_X*2
        this.height = this.text.length * cnt.DEFAULT_LINE_HEIGHT + cnt.PAD_Y*2
    }

    /**
     * To set the new value
     * @param {*} val The new value
     */
    setVal(val, highlight=true)
    {
        this.val = val

        if(highlight)
            this.highlight('MediumOrchid')

        this.addAnimation('property_change', {
            type: 'value_update',
            newVal: val
        })

        if(highlight)
            this.unhighlight()
    }

    /**
     * To get the current value
     * @returns The current value stored by vElement
     */
    getVal()
    {
        return this.val
    }

    highlight(color)
    {
        this.addAnimation('property_change', {
            type: 'box_color_change',
            color: color,
        })
    }

    unhighlight()
    {
        this.addAnimation('property_change',{
            type: 'box_color_change',
            color: cnt.DEFAULT_COLOR, 
        })
    }
}