import { Entity } from "../Entity.js"
import { cnt } from "../../CONSTANTS.js"
import { drawLine, drawRectangle, drawText, getTextDimensions, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState } from './states/index.js'

/**
 * Default padding on X axis to use in vElement within the box
 * @type {number}
 * @constant
 * @ignore
 */
const PAD_X = 8

/**
 * Default padding on Y axis to use in vElement within the box
 * @type {number}
 * @constant
 * @ignore
 */
const PAD_Y = 8

/**
 * Default line gap to use to draw text in vElement
 * @type {number}
 * @constant
 * @ignore
 */
const LINE_GAP = 5

/**
 * This is that class that encapsulates any object that is to be drawn.
 * 
 * It may be number, string, or even a custom Student object, provided it has a toString() overridden
 * that returns the text representation of the object.
 * 
 * User of the framework may want to create individual objects of this class that would be drawn (with isSlave = false)
 * and managed by the animator directly. This is useful when the user wants to show a single object on the screen.,
 * for example, a number or a string.
 * 
 * or the user may not use this at all, instead the user may use higher level classes such as vArray
 * which internally uses vElement objects (with isSlave = true).
 */
export class vElement extends Entity
{
    /**
     * @param {*} val The object to visualize.In case it is a custom object it Must have a toString() overridden which returns a single or multi line
     * respresentation of object.
     * @param {string} label The label/name that is to be displayed when drawing this vElement. Defaults to empty string.
     * @param {boolean} isSlave True if this vElement is not to be managed by the animator directly
     * (managed by some master entity, such as vArray). Defaults to false.
     * 
     * @example <caption>Normal JS code</caption>
     * //Vanilla Js
     * 
     * //Simple variable
     * let simpleVaribale = 10
     * 
     * //Object
     * let objectVariable = { name: "John", age: 30}
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //Simple variable
     * let simpleVariable = new vElement( 10, "simpleVariable" )
     * 
     * //Object
     * let objectVariable = new vElement( { name: "John", age: 30, toString: function() { return this.name + "\n" + this.age } }, "objectVariable" )
     */
    constructor( val, label = '', isSlave = false )
    {
        super()

        /**
         * The object encapsulated. This gets updated along with the synchronous code
         * (code written by the user).
         * @type {*}
         */
        this.val = val

        /**
         * The object utilized to draw. This gets updated as and when the animation related to any updation is executed by animator.
         * @type {*}
         */
        this.drawVal = val

        /**
         * The label/name that is to be displayed when drawing this vElement
         * @type {string}
         */
        this.label = label

        /**
         * The color of the box in which to display the object
         * @type {string}
         */
        this.color = cnt.DEFAULT_COLOR

        /**
         * The font style utilized to write the toString() text of the drawVal in the box
         * @type {string}
         */
        this.font = cnt.DEFAULT_FONT

        /**
         * The font style utilized to write the label
         * @type {string}
         */
        this.labelFont = 'bold 10px Arial'

        /**
         * The text representation of the drawVal object, as an array of strings which are to be drawn on separate lines
         * @type {string[]}
         */
        this.text = this.drawVal ? this.drawVal.toString().split( '\n' ) : [ '0' ]

        // now that properties are set, update the height and width based on text and label
        this.syncDataAndVisual()

        // add the object to the pool if it is not a slave object
        // slave objects are not to be managed by the animator directly, but by some other entity (such as vArray)
        if ( !isSlave )
        {
            super.addInPool()
        }

        /**
         * The state machine to manage the states of vElement. Initial state is idle.
         * @type {StateMachine}
         */
        this.stateMachine = new StateMachine( {
            idle: () => new IdleState( this ),
            property_change: () => new PropertyChangeState( this ),
        }, 'idle' )
    }

    /**
     * Updates the vElement object on every frame.
     * This is the function that is called by the animator or master entity on every frame.
     * @param {number} dt Delta time since last update
     * 
     * @ignore
     */
    update( dt )
    {
        //delegate the update to the state machine
        this.stateMachine.update( dt )
    }

    /**
     * Draws the vElement object on the canvas on every frame.
     * This is the function that is called by the animator or master entity on every frame.
     * 
     * Actually draws the encapsulated object inside a box, with the single/multi line text provided by the toString().
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     * 
     * @ignore
     */
    draw( ctx )
    {
        // draw the box
        drawRectangle( ctx, this.x, this.y, this.width, this.height, this.color, 'black', 2 )

        //put the brush from where to start drawing the text
        let brushX = this.x + this.width / 2
        let brushY = this.y + PAD_Y

        // draw the text
        this.text.forEach( line =>
        {
            drawText( ctx, line, brushX, brushY, this.font, 'black', 'center', 'hanging' )
            brushY += getTextDimensions( this.font, line ).height + LINE_GAP
        } )

        // remove the last line gap and add bottom padding
        brushY -= LINE_GAP
        brushY += PAD_Y

        // if the label is there, draw the label below the text
        if ( this.label )
        {
            // draw the label, separated by a horizontal line from the text
            drawLine( ctx, this.x, brushY, this.x + this.width, brushY, 'black', 2 )
            brushY += PAD_Y
            drawText( ctx, this.label, brushX, brushY, this.labelFont, 'black', 'center', 'hanging' )
        }
    }

    /**
     * Nofies the vElement object to change its state. This is called by the animator or master entity when an animation is to be executed.
     * @param {object} params An object which was registered by the entity during animation registration.
     * 
     * @ignore
     */
    notify( params )
    {
        // fetch the parameters from the params object and call the change function of state machine
        let { toState, enterParams } = params
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * Changes the state of the vElement object.
     * @param {string} toState The state to which to change
     * @param {object} enterParams An object containing the parameters required to enter the state and to be passed to the state's enter function.
     * 
     * @ignore
     */
    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * Calculates and sets the box's dimensions based on text and label (Dynamic adjustmenet of dimensions)
     * This is called when the text or label is changed, or when the vElement is created.
     * @ignore
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

            // set the width to the maximum width of all lines, and height to the sum of all heights
            this.width = Math.max( this.width, lineDimensions.width )
            this.height += lineDimensions.height + LINE_GAP
        } )

        //adjust the padding and line gap
        this.width += PAD_X * 2
        this.height -= LINE_GAP
        this.height += PAD_Y * 2
    }

    /**
     * Sets the new value of the encapsulated object
     * @param {*} val The new value
     * @param {boolean} highlight Is the vElement to be highlighted while showing the change on the screen
     * 
     * @example <caption>Normal JS code</caption>
     * //Vanilla Js
     * 
     * //declaring a variable
     * let myVaribale = 10
     * 
     * //updating the variable
     * myVariable = 20
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //declaring a variable
     * let myVariable = new vElement( 10, "myVariable" )
     * 
     * //updating the variable
     * myVariable.setVal( 20 )
     */
    setVal( val, highlight = true )
    {
        // change the value immediately
        this.val = val

        // highlight the vElement if required. It registers the animation for highlighting the vElement
        if ( highlight )
            this.highlight( 'MediumOrchid' )

        // Here, we are not updating the drawVal immediately, because we want to show the animation of changing the value
        // add the animation for showing the change and updating the drawVal
        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'value_update',
                newVal: val,
            }
        } )

        // Register the animation for unhighlighting the vElement after the animation is done
        if ( highlight )
            this.unhighlight()
    }

    /**
     * Get the current value of the encapsulated object
     * @returns The current value stored by vElement
     * 
     * @example <caption>Normal JS code</caption>
     * //Vanilla Js
     * 
     * //declaring a variable
     * let myVaribale = 10
     * 
     * //Using it's value
     * let copyOfMyVariable = myVariable
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //declaring a variable
     * let myVariable = new vElement( 10, "myVariable" )
     * 
     * //Using it's value
     * let copyOfMyVariable = new vElement( myVariable.getVal(), "copyOfMyVariable" )
     */
    getVal()
    {
        return this.val
    }

    /**
     * Hightlight the vElement with the given color.
     * 
     * Registers the animation for changing the color of the box
     * @param {string} color The colour with which to highlight
     * 
     * @example <caption>Highlighting a vElement</caption>
     * 
     * //declaring a variable
     * let myVariable = new vElement( "It's a beautiful day", "myVariable" )
     * 
     * //highlighting the vElement with a color
     * // Works with any valid CSS color value, such as 'red', '#FF0000', 'rgb(255, 0, 0)', etc.
     * myVariable.highlight( 'MediumOrchid' )
     */
    highlight( color )
    {
        // Register the animation for changing the color of the box
        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'box_color_change',
                color: color,
            }
        } )
    }

    /**
     * Unhightlights the vElement
     * 
     * Registers the animation for changing the color of the box to default color
     * 
     * @example <caption>Unhighlighting a vElement</caption>
     * //declaring a variable
     * let myVariable = new vElement( "It's a beautiful day", "myVariable" )
     * 
     * //highlighting the vElement with a color
     * myVariable.highlight( 'MediumOrchid' )
     * 
     * // unhighlighting the vElement
     * myVariable.unhighlight()
     */
    unhighlight()
    {
        // Register the animation for changing the color of the box to default color
        this.addAnimation( {
            toState: 'property_change',
            enterParams: {
                type: 'box_color_change',
                color: cnt.DEFAULT_COLOR,
            }
        } )
    }

    /**
     * Remove the vElement from the visualization
     * 
     * @example <caption>Removing a vElement</caption>
     * //declaring a variable
     * let myVariable = new vElement( "This will be removed very soon", "myVariable" )
     * myVariable.highlight( 'red' )
     * 
     * // removing the vElement from the visualization
     * myVariable.remove()
     */
    remove()
    {
        // Call the parent class remove function to remove the object from the pool
        super.remove()
    }

    /**
     * Performs the cleanup tasks for the vElement. It is called when the vElement is removed from the pool or destroyed.
     * @ignore
     */
    cleanUp()
    {
        // Remove the references to drawVal, text and stateMachine to free up memory
        this.drawVal = null
        this.text = null
        this.stateMachine = null
    }
}