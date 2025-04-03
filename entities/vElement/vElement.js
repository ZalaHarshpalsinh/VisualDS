import { Entity } from "../Entity.js"
import { cnt } from "../../CONSTANTS.js"
import { drawLine, drawRectangle, drawText, getTextDimensions, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState } from './states/index.js'

const PAD_X = 8
const PAD_Y = 8
const LINE_GAP = 5
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
        this.font = cnt.DEFAULT_FONT
        this.labelFont = 'bold 10px Arial'
        this.syncDataAndVisual()

        if ( !isSlave )
        {
            super.addInPool()
        }

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
    draw( ctx )
    {
        drawRectangle( ctx, this.x, this.y, this.width, this.height, this.color, 'black', 2 )

        let brushX = this.x + this.width / 2
        let brushY = this.y + PAD_Y

        this.text.forEach( line =>
        {
            drawText( ctx, line, brushX, brushY, this.font, 'black', 'center', 'hanging' )
            brushY += getTextDimensions( this.font, line ).height + LINE_GAP
        } )

        brushY -= LINE_GAP
        brushY += PAD_Y

        if ( this.label )
        {
            drawLine( ctx, this.x, brushY, this.x + this.width, brushY, 'black', 2 )
            brushY += PAD_Y
            drawText( ctx, this.label, brushX, brushY, this.labelFont, 'black', 'center', 'hanging' )
        }
    }

    notify( params )
    {
        let { toState, enterParams } = params
        this.stateMachine.change( toState, enterParams )
    }

    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * To calculate dimensions based on toString of the encapsulated object.
     */
    syncDataAndVisual()
    {
        if ( this.label )
        {
            let labelDimensions = getTextDimensions( this.labelFont, this.label )
            this.width = labelDimensions.width
            this.height = labelDimensions.height + PAD_Y * 2
        }
        else
        {
            this.width = 0
            this.height = 0
        }

        this.text = this.drawVal.toString().split( '\n' )
        this.text.forEach( line =>
        {
            let lineDimensions = getTextDimensions( this.font, line )
            this.width = Math.max( this.width, lineDimensions.width )
            this.height += lineDimensions.height + LINE_GAP
        } )

        this.width += PAD_X * 2
        this.height -= LINE_GAP
        this.height += PAD_Y * 2
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

        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'value_update',
                newVal: val,
            }
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
        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'box_color_change',
                color: color,
            }
        } )
    }

    unhighlight()
    {
        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'box_color_change',
                color: cnt.DEFAULT_COLOR,
            }
        } )
    }

    cleanUp()
    {
        this.drawVal = null
        this.text = null
        this.stateMachine = null
    }
}