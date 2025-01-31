import { BaseState } from "../BaseState";

export class IdleState extends BaseState
{
    constructor()
    {
        this.pointer = enterPara.pointer
    }
    
    draw()
    {
        context.textBaseline = "top";
        context.font = "32 Arial";
        context.fillText("↑", this.pointer.x, this.pointer.y); 
    }
}