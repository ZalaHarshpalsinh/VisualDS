import { BaseState, TweenManager } from "../../../utils/index.js"

/**
 * Represents the state where two elements are to be swapped in the vArray obj
 */
export class SwapState extends BaseState
{
    constructor( varray )
    {
        super()
        this.varray = varray
    }

    enter( enterPara )
    {
        let { i, j } = enterPara

        let refI = this.varray.drawData[ i ]
        let refJ = this.varray.drawData[ j ]

        // swap references
        this.varray.drawData[ i ] = refJ
        this.varray.drawData[ j ] = refI

        //swap coordinates
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
                this.varray.nextAnimation()
            }
        )
    }
}