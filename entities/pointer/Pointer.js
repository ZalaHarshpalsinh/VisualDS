import { Entity } from "../Entity.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, MovingState } from "./states/index.js"
import { vArray } from "../vArray/vArray.js"

/**
 * This class represents a visual array index variable.
 * 
 * DO NOT create an object of this using the constructor.
 * Always use getPointer method of vArray to get an object of this.
 */
export class Pointer extends Entity
{
    /**
     * Create a new pointer object. DO NOT call this directly. Use getPointer of vArray instead.
     * @param {vArray} pointee The vArray object this object will point to
     * @param {number} initialIndex The initial index
     * @param {string} label The name to draw for this. Defaults to empty string.
     */
    constructor( pointee, initialIndex, label = '' )
    {
        super()

        /**
         * The vArray object this object will point to
         */
        this.pointee = pointee

        // again, need two copies of index. One that changes as soon as user makes changes.
        // Other that changes through animations and which is utilized for drawing.

        /**
         * The index
         */
        this.index = initialIndex

        /**
         * The draw index
         */
        this.drawIndex = Math.max( -1, Math.min( this.pointee.length(), initialIndex ) )

        /**
         * The name to draw when drawing this object
         */
        this.label = label

        // now that properties are initialized, sync the coordinates based on the vArray coordinates and the index
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

    /**
     * To draw an arrow along with label and index 
     */
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

    /**
     * Calculate the coordinates based on the vArray object coordinates and the index
     */
    syncCoordinates()
    {
        this.x = ( this.pointee.x ) + ( this.pointee.boxWidth / 2 ) + ( this.drawIndex * this.pointee.boxWidth )
        this.y = ( this.pointee.y ) + ( this.pointee.boxHeight )
    }

    /**
     * To get the index
     * @returns index where this is pointing
     */
    getIndex()
    {
        return this.index
    }

    /**
     * Is this index variable pointing out of bounds?
     * @returns {boolean}
     */
    isOutOfBound()
    {
        return ( this.index < 0 || this.index >= this.pointee.length() )
    }

    /**
     * Method to move the pointer with animation
     * @param change The change to add in the index. Positive moves it ahead, negative moves it back.
     * You can change the index however you want: no exception is thrown.
     * Instead, the draw index is capped till one before start and one after the end.
     */
    move( change )
    {
        // get the old index in range -1 to length
        let oldIndexCapped = Math.max( -1, Math.min( this.pointee.length(), this.index ) )

        // immediately change one copy
        this.index += change

        // get the new index in same range
        let newIndexCapped = Math.max( -1, Math.min( this.pointee.length(), this.index ) )

        // calculate change
        change = newIndexCapped - oldIndexCapped

        // schedule animation for moving
        if ( change != 0 )
            super.addAnimation( { toState: 'moving', enterParams: { change: change } } )
    }

    /**
     * Method to move the pointer to a particular index
     * @param index The index to move to
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

    /**
     * Hightlight the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     * @param {string} color The color to highlight with
     */
    highlight( color )
    {
        if ( !this.isOutOfBound() )
            this.pointee.highlight( [ this.index ], color )
    }

    /**
     * Unightlight the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     */
    unhighlight()
    {
        if ( !this.isOutOfBound() )
            this.pointee.unhighlight( [ this.index ] )
    }

    /**
     * Remove this pointer from the drawing pool. Also, no animations can be queued after this.
     */
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