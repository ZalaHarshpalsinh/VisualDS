import { Entity } from "../Entity.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, MovingState } from "./states/index.js"

export class Pointer extends Entity
{
    constructor( pointee, initialIndex, label = '' )
    {
        super()

        this.pointee = pointee
        this.index = initialIndex
        this.drawIndex = Math.max( -1, Math.min( this.pointee.length(), initialIndex ) )
        this.label = label
        this.syncCoordinates()

        this.stateMachine = new StateMachine( {
            idle: () => new IdleState( this ),
            moving: () => new MovingState( this )
        }, 'idle' )
    }

    update( dt )
    {
        this.stateMachine.update( dt )
    }

    drawArrow( ctx )
    {
        drawText( ctx, "↑", this.x, this.y, "14px Arial", 'red', 'center', 'top' )
        drawText( ctx, `${this.label}${this.label ? ': ' : ''}${this.drawIndex}`, this.x, this.y + 14, '9px Arial', 'blue', 'center', 'top' )
    }

    draw( ctx )
    {
        this.drawArrow( ctx )
    }

    notify( params )
    {
        let { toState, enterParams } = params
        this.changeState( toState, enterParams )
    }

    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    syncCoordinates()
    {
        this.x = ( this.pointee.x ) + ( this.pointee.boxWidth / 2 ) + ( this.drawIndex * this.pointee.boxWidth )
        this.y = ( this.pointee.y ) + ( this.pointee.boxHeight )
    }

    /**
     * To get the index
     * @returns index where ptr is pointing
     */
    getIndex()
    {
        return this.index
    }

    isOutOfBound()
    {
        return ( this.index < 0 || this.index >= this.pointee.length() )
    }

    /**
     * Method to move the pointer with animation
     */
    move( change )
    {
        let oldIndexCapped = Math.max( -1, Math.min( this.pointee.length(), this.index ) )
        this.index += change

        let newIndexCapped = Math.max( -1, Math.min( this.pointee.length(), this.index ) )
        change = newIndexCapped - oldIndexCapped
        if ( change != 0 )
            super.addAnimation( { toState: 'moving', enterParams: { change: change } } )
    }

    /**
     * Method to move the pointer to a particular index
     */
    moveTo( index )
    {
        this.move( index - this.getIndex() )
    }

    /**
     * To increment this pointer
     */
    increment()
    {
        this.move( 1 )
    }

    /**
     * To decrement this pointer
     */
    decrement()
    {
        this.move( -1 )
    }

    highlight( color )
    {
        if ( !this.isOutOfBound() )
            this.pointee.highlight( [ this.index ], color )
    }

    unhighlight()
    {
        if ( !this.isOutOfBound() )
            this.pointee.unhighlight( [ this.index ] )
    }

    remove()
    {
        this.removed = true
        this.pointee.removePointer( this )
    }

    cleanUp()
    {
        this.drawIndex = null
        this.pointee = null
        this.stateMachine = null
    }
}