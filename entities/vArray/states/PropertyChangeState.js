import { BaseState } from "../../../utils/index.js"
import { vArray } from "../vArray.js"

/**
 * Represents the state where a property of the vArray is changing
 * 
 * such as colour of a box, adding a pointer, removing a pointer, etc.
 */
export class PropertyChangeState extends BaseState
{
    /**
     * @param {vArray} varray The vArray instance to which this state instance belongs
     */
    constructor( varray )
    {
        super()
        /**
         * The vArray instance to which this state instance belongs
         * @type {vArray}
         */
        this.varray = varray
    }

    enter( enterPara )
    {
        // check for the type of property change action and perform the necessary action
        if ( enterPara.type == "box_color_change" )
        {
            // change color of boxes
            enterPara.indices.forEach( ( index ) =>
            {
                if ( index < this.varray.drawData.length )
                {
                    this.varray.drawData[ index ].color = enterPara.toColor
                }
            } )
        }
        else if ( enterPara.type == "add_pointer" )
        {
            // add a pointer to the vArray
            this.varray.pointers.push( enterPara.pointer )
        }
        else if ( enterPara.type == 'remove_pointer' )
        {
            // remove a pointer from the vArray
            enterPara.pointer.cleanUp()
            this.varray.pointers.splice( this.varray.pointers.indexOf( enterPara.pointer ), 1 )
        }

        // done, so exit the state
        this.varray.changeState( 'idle' )

        // notify the animator that the animation is done
        this.varray.nextAnimation()
    }
}