import { BaseState, TweenManager } from "../../../utils/index.js"
import { vArray } from "../vArray.js"

/**
 * Represents the state where a value is poped from the array
 */
export class PopState extends BaseState
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
        /**
         * The distance of the kill site from the array
         * @type {number}
         */
        this.killDistance = 400
    }

    enter( enterPara )
    {
        let { type } = enterPara

        //get the popped box
        let box = this.varray.drawData[ type == 'front' ? 0 : this.varray.drawData.length - 1 ]

        //decide kill site location based on the type (front or back)
        let targetX = box.x + ( type == 'front' ? -this.killDistance : +this.killDistance )

        //move the box to kill site
        this.varray.getTweenManager().addTween( box,
            { x: targetX },
            500,
            TweenManager.cubicIn,
            () =>
            {
                //removed the popped box from drawData based on the type (front or back)
                if ( type == 'front' )
                    this.varray.drawData.shift()
                else
                    this.varray.drawData.pop()

                //move to next animation
                this.varray.changeState( 'idle' )

                // notify the animator that the animation is done
                this.varray.nextAnimation()
            }
        )
    }
}