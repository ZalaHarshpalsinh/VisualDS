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
        this.x = (this.pointee.x) + (this.pointee.boxWidth / 2) + ( this.index  * this.pointee.boxWidth)
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

    /**
     * Method to move the pointer with animation
     */
    move( change )
    {
        if ( this.index + change < 0 || this.index + change >= ( this.pointee.data.length ) )
        {
            throw new Error( "Index out of bound" );
        }

        this.index += change
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
}