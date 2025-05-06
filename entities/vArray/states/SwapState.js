import { BaseState, TweenManager } from "../../../utils/index.js"
import { vArray } from "../vArray.js"

/**
 * Represents the state where two elements are to be swapped in the vArray
 */
export class SwapState extends BaseState
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
        let { i, j } = enterPara

        // get the references to the elements to be swapped
        let refI = this.varray.drawData[ i ]
        let refJ = this.varray.drawData[ j ]

        // swap references
        this.varray.drawData[ i ] = refJ
        this.varray.drawData[ j ] = refI

        // register the tweens to swap their coordinates
        this.varray.getTweenManager().addTween( refI,
            { x: refJ.x },
            400,
            TweenManager.linear
        )
        this.varray.getTweenManager().addTween( refJ,
            { x: refI.x },
            400,
            TweenManager.linear,
            () =>
            {
                //move to next animation
                this.varray.changeState( 'idle' )

                // notify the animator that the animation is done
                this.varray.nextAnimation()
            }
        )
    }
}