import { BaseState } from "../BaseState.js";

export class IdleState extends BaseState
{
    constructor(pointer)
    {
        super();
        this.pointer = pointer
    }
    
    draw()
    {
        context.textBaseline = "top";
        context.font = "32 Arial";
        context.fillText("↑", this.pointer.x, this.pointer.y); 
    }
}