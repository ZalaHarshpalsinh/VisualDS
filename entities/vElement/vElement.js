import { Entity } from "../Entity.js"
import { cnt } from "../../CONSTANTS.js"
import { drawLine, drawRectangle, drawText, getTextDimensions, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState } from './states/index.js'

/**
 * Default padding x to use in vElement
 */
const PAD_X = 8

/**
 * Default padding y to use in vElement
 */
const PAD_Y = 8

/**
 * Default line gap to use to draw text in vElement
 */
const LINE_GAP = 5

/**
 * This is that class that encapsulates any object that is to be drawn.
 * It may be number, string, or even a custom Student object, provided it has a toString() overridden
 * that returns the text representation of the object.
 * 
 * User of the framework may want to create individual objects of this class that would be drawn.
 * Or, the user may not use this at all, instead the user may use higher level classes such as vArray
 * which internally uses vElement objects.
 */
export class vElement extends Entity
{
    /**
     * @param {any} val The object to visualize. Must have a toString overridden which returns a single/multi line
     * respresentation of object in case it is a custom object.
     * @param {string} label The label/name that is to be displayed when drawing this vElement. Defaults to empty string.
     * @param {boolean} isSlave True if this vElement is not to be managed by the animator directly
     * (managed by some master entity, such as vArray). Defaults to false.
     */
    constructor( val, label = '', isSlave = false )
    {
        super()

        /**
         * The object encapsulated. This gets updated along with the synchronous code
         * (code written by using using framework).
         */
        this.val = val

        /**
         * The object utilized to draw. This gets updated
         * as and when the animation related to updation is executed by animator.
         */
        this.drawVal = val

        /**
         * The label
         */
        this.label = label

        /**
         * The color of the box in which to display the object
         */
        this.color = cnt.DEFAULT_COLOR

        /**
         * The font style utilized to write the toString() text in the box
         */
        this.font = cnt.DEFAULT_FONT

        /**
         * The font style utilized to write the label
         */
        this.labelFont = 'bold 10px Arial'

        /**
         * The text representation of the object, as an array of strings, to be drawn on separate lines
         */
        this.text = this.drawVal.toString().split( '\n' )
        
        // now that properties are set, update the height and width based on text and label
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
    }

    /**
     * To actually draw the encapsulated object inside a box, with the single/multi line text provided by the toString().
     */
    draw( ctx )
    {
        // draw the box
        drawRectangle( ctx, this.x, this.y, this.width, this.height, this.color, 'black', 2 )

        let brushX = this.x + this.width / 2
        let brushY = this.y + PAD_Y

        // draw the text
        this.text.forEach( line =>
        {
            drawText( ctx, line, brushX, brushY, this.font, 'black', 'center', 'hanging' )
            brushY += getTextDimensions( this.font, line ).height + LINE_GAP
        } )

        brushY -= LINE_GAP
        brushY += PAD_Y

        if ( this.label )
        {
            // draw the label, separated by a horizontal line from the text
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
     * To calculate dimensions based on text and label
     */
    syncDataAndVisual()
    {
        if ( this.label )
        {
            // if label is there, add the dimensions of label, also add padding afterwards
            let labelDimensions = getTextDimensions( this.labelFont, this.label )
            this.width = labelDimensions.width
            this.height = labelDimensions.height + PAD_Y * 2
        }
        else
        {
            // if label absent, initialize dimensions to 0
            this.width = 0
            this.height = 0
        }

        // for each single line in text, calculate dimensions
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
     * To set a new value of the encapsulated object
     * @param {*} val The new value
     * @param {boolean} highlight Is the vElement to be highlighted while showing the change on the screen?
     */
    setVal( val, highlight = true )
    {
        // change the value immediately
        this.val = val

        if ( highlight )
            this.highlight( 'MediumOrchid' )

        // add the animation for showing the change
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

    /**
     * To hightlight the vElement
     * @param {string} color The colour with which to highlight
     */
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

    /**
     * To unhightlight the vElement
     */
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