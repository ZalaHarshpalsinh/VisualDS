import { Entity } from "../Entity.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, MovingState } from "./states/index.js"

export class Pointer extends Entity
{
    constructor(pointee, initialIndex)
    {
        super()
        this.customCoordinates = true
        super.addInPool()

        this.pointee = pointee
        this.index = initialIndex
        this.drawIndex = initialIndex
        this.updateCoords()

        this.stateMachine = new StateMachine( {
            idle: () => new IdleState( this ),
            moving: () => new MovingState( this )
        }, 'idle' )
    }

    update(dt)
    {
        this.stateMachine.update(dt)
    }

    drawArrow()
    {
        drawText("↑", this.x, this.y, "16px Arial", 'red', 'center', 'top')
    }

    draw()
    {
        this.stateMachine.draw()
    }

    changeState(toState, params)
    {
        this.stateMachine.change(toState, params)
    }

    updateCoords()
    {
        this.x = (this.pointee.x) + (this.pointee.boxWidth / 2) + ( this.drawIndex  * this.pointee.boxWidth)
        this.y = this.pointee.y + this.pointee.boxHeight;
    }

     /**
     * To get the index
     * @returns index where ptr is pointing
     */
     getIndex()
     {
         return this.index;
     }

     isOutOfBound()
     {
        return (this.index < 0 || this.index >= this.pointee.length())
     }

    /**
     * Method to move the pointer with animation
     */
    move( change )
    {
        let oldIndex = this.index
        this.index =  Math.max(-1, Math.min(this.pointee.length(), this.index + change))

        change = this.index - oldIndex
        if(change!=0)
            super.addAnimation( 'moving', { change: change } )
    }

    /**
     * Method to move the pointer to a particular index
     */
    moveTo( index )
    {
        this.move( index - this.getIndex() );
    }
 
     /**
      * To increment this pointer
      */
     increment()
     {
         this.move(1);
     }

     /**
      * To decrement this pointer
      */
     decrement()
     {
         this.move(-1);
     }

     highlight(color)
     {
        if(! this.isOutOfBound())
            this.pointee.highlight([this.index], color)
     }

     unhighlight()
     {
        if(! this.isOutOfBound())
            this.pointee.unhighlight([this.index])
     }
}