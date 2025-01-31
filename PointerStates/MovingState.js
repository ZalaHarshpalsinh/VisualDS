import { BaseState } from "../BaseState";

const POINTER_MOVING_SPEED = 100;

export class MovingState extends BaseState
{
    constructor(pointer)
    {
        this.pointer = pointer;
        this.change = 0;
    }

    enter(enterPara)
    {
        this.change = enterPara.change;
        this.targetX = this.pointer.x + (change * this.pointer.pointee.boxWidth);
    }

    update(dt)
    {
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
            this.pointer.changeState("idle")
        }
    }

    draw()
    {
        context.textBaseline = "top";
        context.font = "32 Arial";
        context.fillText("↑", this.pointer.x, this.pointer.y); 
    }
}