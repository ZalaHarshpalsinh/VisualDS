import { BaseState } from "../BaseState.js";

const POINTER_MOVING_SPEED = 30;

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
    }

    update(dt)
    {
        // console.log("hi from ptr moving state update");
        if(this.pointer.x < this.targetX)
        {
            this.pointer.x = Math.min(this.pointer.x + POINTER_MOVING_SPEED * dt, this.targetX);
        }
        else if(this.pointer.x > this.targetX)
        {
            this.pointer.x = Math.max(this.pointer.x - POINTER_MOVING_SPEED * dt, this.targetX);
        }
        else
        {
            // animation finished
            this.pointer.changeState('idle')
            this.pointer.makeIdle()
        }
    }
}