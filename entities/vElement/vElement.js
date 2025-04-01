import { Entity } from "../Entity.js"
import { ctx } from "../../driver.js"
import { cnt } from "../../CONSTANTS.js"
import { drawRectangle, drawText, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState } from './states/index.js'

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
     * @param {boolean} isSlave True if this vElement is not to be managed by the animator directly (managed by some master entity, i.e. vArray)
     */
    constructor( val, label = '', isSlave = false )
    {
        super()

        this.val = val
        this.drawVal = val
        this.label = label
        this.color = cnt.DEFAULT_COLOR
        this.font = '15px sans-serif'
        this.syncDataAndVisual()

        if ( !isSlave )
            super.addInPool()

        this.stateMachine = new StateMachine( {
            idle: () => new IdleState( this ),
            property_change: () => new PropertyChangeState( this ),
        }, 'idle' )
    }

    update( dt )
    {
        this.syncDataAndVisual()
    }

    /**
     * To actually draw the encapsulated object inside a rectange, with the single/multi line text provided by the toString.
     */
    draw()
    {
        drawRectangle( this.x, this.y, this.width, this.height, this.color, 'black' )
        drawText( this.label, this.x + this.width / 2, this.y, '10px Times New Roman', 'black', 'center', 'bottom' )

        let brushX = this.x
        let brushY = this.y + cnt.PAD_Y

        this.text.forEach( line =>
        {
            drawText( line, brushX + this.width / 2, brushY + cnt.DEFAULT_LINE_HEIGHT / 2, this.font, 'black', 'center', 'middle' )
            brushY += cnt.DEFAULT_LINE_HEIGHT
        } )
    }

    changeState( toState, params )
    {
        this.stateMachine.change( toState, params )
    }

    /**
     * To calculate dimensions based on toString of the encapsulated object.
     */
    syncDataAndVisual()
    {
        this.text = this.drawVal.toString().split( '\n' )
        let maxWidth = 0
        this.text.forEach( line =>
        {
            ctx.save()
            ctx.font = this.font
            maxWidth = Math.max( maxWidth, ctx.measureText( line ).width )
            ctx.restore()
        } )
        this.width = maxWidth + cnt.PAD_X * 2
        this.height = this.text.length * cnt.DEFAULT_LINE_HEIGHT + cnt.PAD_Y * 2
    }

    /**
     * To set the new value
     * @param {*} val The new value
     */
    setVal( val, highlight = true )
    {
        this.val = val

        if ( highlight )
            this.highlight( 'MediumOrchid' )

        this.addAnimation( 'property_change', {
            type: 'value_update',
            newVal: val
        } )

        if ( highlight )
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

    highlight( color )
    {
        this.addAnimation( 'property_change', {
            type: 'box_color_change',
            color: color,
        } )
    }

    unhighlight()
    {
        this.addAnimation( 'property_change', {
            type: 'box_color_change',
            color: cnt.DEFAULT_COLOR,
        } )
    }

    cleanUp()
    {
        this.drawVal = null
        this.text = null
        this.stateMachine = null
    }
}