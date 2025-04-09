import { BaseState, TweenManager } from "../../../utils/index.js"

export class MovingState extends BaseState
{
    constructor( pointer )
    {
        super()
        this.pointer = pointer
    }

    enter( enterPara )
    {
        let change = enterPara.change
        let targetX = ( this.pointer.x ) + ( change * this.pointer.pointee.boxWidth )

        this.pointer.drawIndex += change
        this.pointer.getTweenManager().addTween( this.pointer,
            { x: targetX },
            500,
            TweenManager.linear,
            () =>
            {
                this.pointer.changeState( 'idle' )
                this.pointer.nextAnimation()
            }
        )
    }
}