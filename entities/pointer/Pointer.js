import { Entity } from "../Entity.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, MovingState } from "./states/index.js"
import { vArray } from "../vArray/vArray.js"

/**
 * This class represents a visual array index variable.
 * 
 * DO NOT create an object of this using the constructor.
 * Always use getPointer() method of vArray to get an object of this.
 */
export class Pointer extends Entity
{
    /**
     * @param {vArray} pointee The vArray object this Pointer object will point to
     * @param {number} initialIndex The initial index
     * @param {string} label The label to show below this pointer. Defaults to empty string.
     */
    constructor( pointee, initialIndex, label = '' )
    {
        super()

        /**
         * The vArray object this Pointer object will point to
         * @type {vArray}
         */
        this.pointee = pointee

        // again we need two copies of index. One that changes as soon as user makes changes.
        // Other that changes through animations and which is utilized for drawing.

        /**
         * The index at which this pointer is pointing to. This is the index that changes when user makes changes.
         * @type {number}
         */
        this.index = initialIndex

        /**
         * The index at which this pointer is drawn. This is the index that changes when animations are scheduled.
         * @type {number}
         */
        this.drawIndex = Math.max( -1, Math.min( this.pointee.length(), initialIndex ) )

        /**
         * The label to show below this pointer
         * @type {string}
         */
        this.label = label

        // now that properties are initialized, sync the coordinates of pointer based on the vArray coordinates and the index
        this.syncCoordinates()

        /**
         * The state machine to handle the states of this pointer. Initial state is idle.
         * @type {StateMachine}
         */
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
     * Draws an arrow along with label and index
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on 
     */
    drawArrow( ctx )
    {
        //draw the arrow
        drawText( ctx, "↑", this.x, this.y, "14px Arial", 'red', 'center', 'top' )
        //draw the label and index
        drawText( ctx, `${this.label}${this.label ? ': ' : ''}${this.drawIndex}`, this.x, this.y + 14, '9px Arial', 'blue', 'center', 'top' )
    }

    draw( ctx )
    {
        // draw the arrow and label
        this.drawArrow( ctx )
    }

    notify( params )
    {
        // this is called by the animator when its this entity's turn to perform the requested animation
        // use the params object to change to approperiate state to perform the animation
        let { toState, enterParams } = params
        this.changeState( toState, enterParams )
    }

    /**
     * Changes the state of the state machine to the given state
     * @param {string} toState The state to change to
     * @param {*} enterParams The object containing all the parameters required to enter the state
     */
    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * Calculates the coordinates of pointer based on the vArray object coordinates and the index
     */
    syncCoordinates()
    {
        this.x = ( this.pointee.x ) + ( this.pointee.boxWidth / 2 ) + ( this.drawIndex * this.pointee.boxWidth )
        this.y = ( this.pointee.y ) + ( this.pointee.boxHeight )
    }

    /**
     * Get the current index value of the pointer
     * @returns current index value
     */
    getIndex()
    {
        return this.index
    }

    /**
     * Check whether the current index value is out of the bounds of vArray
     * @returns {boolean} true if the index is out of bounds, false otherwise
     */
    isOutOfBound()
    {
        return ( this.index < 0 || this.index >= this.pointee.length() )
    }

    /**
     * Moves the pointer by the specified amount of change in index value.
     * @param {number} change The change to add in the index. Positive moves it ahead, negative moves it back.
     * 
     * You can change the index however you want: no exception is thrown.
     * Instead, to handle such cases, the drawIndex value is capped till one before start and one after the end of array.
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

        // schedule animation for moving the pointer and changing the drawIndex
        if ( change != 0 )
            super.addAnimation( { toState: 'moving', enterParams: { change: change } } )
    }

    /**
     * Moves the pointer to a specified index
     * @param index The index to move to
     */
    moveTo( index )
    {
        this.move( index - this.getIndex() )
    }

    /**
     * Increment the index of pointer by 1
     * 
     * Same as calling move(1)
     */
    increment()
    {
        this.move( 1 )
    }

    /**
     * Decrement the index of pointer by 1
     * 
     * Same as calling move(-1)
     */
    decrement()
    {
        this.move( -1 )
    }

    /**
     * Hightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     * @param {string} color The color to highlight with
     */
    highlight( color = 'blue' )
    {
        if ( !this.isOutOfBound() )
            this.pointee.highlight( [ this.index ], color )
    }

    /**
     * Unightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     */
    unhighlight()
    {
        if ( !this.isOutOfBound() )
            this.pointee.unhighlight( [ this.index ] )
    }

    /**
     * Removes this pointer from the drawing pool. Also, no animations can be queued after this feom this pointer.
     */
    remove()
    {
        this.removed = true
        this.pointee.removePointer( this )
    }

    cleanUp()
    {
        // throw away references to the objects to free up memory
        this.drawIndex = null
        this.pointee = null
        this.stateMachine = null
    }
}