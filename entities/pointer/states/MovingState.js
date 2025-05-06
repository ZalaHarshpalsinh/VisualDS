import { BaseState, TweenManager } from "../../../utils/index.js"
import { Pointer } from "../Pointer.js"

/**
 * Represents the moving state of Pointer
 */
export class MovingState extends BaseState
{
    /**
     * @param {Pointer} pointer The Pointer instance to which this state instance belongs 
     */
    constructor( pointer )
    {
        super()
        /**
         * The Pointer instance to which this state instance belongs
         * @type {Pointer}
         */
        this.pointer = pointer
    }

    enter( enterPara )
    {
        // get the change in index from the enter parameters
        let change = enterPara.change
        // update the drawIndex of the pointer based on the change
        this.pointer.drawIndex += change
        // calculate the target x position based on the change in index and the box width
        let targetX = ( this.pointer.x ) + ( change * this.pointer.pointee.boxWidth )

        // register the tween to move the pointer to the target x position
        this.pointer.getTweenManager().addTween( this.pointer,
            { x: targetX },
            500,
            TweenManager.linear,
            () =>
            {
                // when the tween is complete, move the pointer to idle state
                this.pointer.changeState( 'idle' )

                // notify the pointer that the animation is complete
                this.pointer.nextAnimation()
            }
        )
    }
}