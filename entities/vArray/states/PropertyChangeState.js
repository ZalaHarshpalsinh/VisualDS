import { BaseState } from "../../../utils/index.js"

/**
 * Represents the state where a property of the vArray is changing
 * such as colour of a box
 */
export class PropertyChangeState extends BaseState
{
    constructor( varray )
    {
        super()
        this.varray = varray
    }

    enter( enterPara )
    {
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
            this.varray.pointers.push( enterPara.pointer )
        }
        else if ( enterPara.type == 'remove_pointer' )
        {
            enterPara.pointer.cleanUp()
            this.varray.pointers.splice( this.varray.pointers.indexOf( enterPara.pointer ), 1 )
        }

        // done, so exit the state
        this.varray.changeState( 'idle' )
        this.varray.nextAnimation()
    }
}