import {Entity} from "./Entity.js"
import { context } from "./demos/array_demo/main.js"
import { StateMachine } from "./StateMachine.js"
import { IdleState, MovingState } from "./PointerStates/PointerStates.js"

export
class Pointer extends Entity
{
    constructor(pointee, initialIndex)
    {
        super()
        this.pointee = pointee
        this.index = initialIndex
        // pointer knows where to be drawn
        this.isAbsolute = false;

        this.stateMachine = new StateMachine({
            idle : () => new IdleState(this),
            moving: () => new MovingState(this)
        }, 'idle')

        // derive coords based on index and the array
        this.updateCoords();
        super.add();
        
    }

    update(dt)
    {
        this.stateMachine.update(dt)
    }

    changeState(stateName)
    {
        this.stateMachine.change(stateName);
    }

    updateCoords()
    {
        this.x = this.pointee.x + (this.index) * this.pointee.boxWidth + this.pointee.boxWidth/2;
        this.y = this.pointee.y + this.pointee.boxHeight;
    }

    draw()
    {
        // console.log("Draw pointer", myX, myY)
        context.textBaseline = "top";
        context.font = "32 Arial";
        context.fillText("↑", this.x, this.y);
    }
}