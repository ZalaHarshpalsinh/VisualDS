import { cnt } from "../../../CONSTANTS.js";
import { BaseState } from "../../../utils/index.js"

export class MovingState extends BaseState
{
    constructor(pointer)
    {
        super()
        this.pointer = pointer;
        this.change = 0;
    }

    enter(enterPara)
    {
        this.change = enterPara.change;
        this.targetX = this.pointer.x + (this.change * this.pointer.pointee.boxWidth);

        this.pointer.drawIndex += this.change
    }

    update(dt)
    {
        if(this.pointer.x < this.targetX)
        {
            this.pointer.x = Math.min(this.pointer.x + cnt.DEFAULT_MOVE_SPEED * dt, this.targetX);
        }
        else if(this.pointer.x > this.targetX)
        {
            this.pointer.x = Math.max(this.pointer.x - cnt.DEFAULT_MOVE_SPEED * dt, this.targetX);
        }
        else
        {
            // animation finished
            this.pointer.changeState('idle')
            this.pointer.nextAnimation()
        }
    }
}