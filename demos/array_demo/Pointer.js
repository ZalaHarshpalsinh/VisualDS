import {Entity} from "./Entity.js"
import { context } from "./main.js"
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

    updateCoords()
    {
        this.x = this.pointee.x + (this.index) * this.pointee.boxWidth + this.pointee.boxWidth/2;
        this.y = this.pointee.y + this.pointee.boxHeight;
    }

    draw()
    {
        // console.log("Draw pointer", myX, myY)
        context.save()
        context.textBaseline = "hanging";
        context.font = "32px Arial";
        context.fillText("↑", this.x, this.y);
        context.restore()
    }

    /**
     * Defining a method to change the state of pointer 
     */
    changeState(toState, param)
    {
        this.stateMachine.change(toState, param)
    }

    /**
     * Method to move the pointer with animation
     */
    move(change)
    {
        if(this.index + change < 0 || this.index + change >= (this.pointee.data.length))
        {
            throw new Error("Index out of bound");
        }

        this.index += change
        super.addAnimation('moving', {change: change})
    }
}