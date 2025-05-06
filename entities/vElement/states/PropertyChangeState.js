import { BaseState } from "../../../utils/index.js"
import { vElement } from "../vElement.js"

/**
 * Represents the state where a property of the vElement is changing
 * 
 * Such as colour of a box, val inside the box, etc.
 */
export class PropertyChangeState extends BaseState
{
    /**
     * @param {vElement} velement vElement instance to which this state instance belongs
     */
    constructor( velement )
    {
        super()
        /**
         * The vElement instance to which this state instance belongs
         * @type {vElement}
         */
        this.velement = velement
    }

    enter( enterPara )
    {
        this.data = enterPara

        // perform the action according to the type of property change
        if ( this.data.type == "box_color_change" )
        {
            this.velement.color = this.data.color
        }
        else if ( this.data.type == "value_update" )
        {
            // update the drawVal of the vElement
            this.velement.drawVal = this.data.newVal
            // update the text too
            this.velement.text = this.velement.drawVal.toString().split( '\n' )
            // update height and width according to the new text
            this.velement.syncDataAndVisual();
        }

        // done, so exit the state
        this.velement.changeState( 'idle' )

        // nofify the animator that the animation is done
        this.velement.nextAnimation()
    }
}