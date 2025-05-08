/**
 * This class represents a visual array index variable.
 *
 * DO NOT create an object of this using the constructor.
 * Always use getPointer() method of vArray to get an object of this.
 */
export class Pointer extends Entity {
    /**
     * @param {vArray} pointee The vArray object this Pointer object will point to
     * @param {number} initialIndex The initial index
     * @param {string} label The label to show below this pointer. Defaults to empty string.
     *
     * @example <caption>Creating a pointer</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * // DO NOT CREATE POINTER LIKE THIS
     * let pointer = new Pointer(arr, 0, "Incorrect Use") //Incorrect
     *
     * //creating a pointer using the array
     * let pointer = arr.getPointer(0, 'My Pointer')
     */
    constructor(pointee: vArray, initialIndex: number, label?: string);
    /**
     * The vArray object this Pointer object will point to
     * @type {vArray}
     */
    pointee: vArray;
    /**
     * The index at which this pointer is pointing to. This is the index that changes when user makes changes.
     * @type {number}
     */
    index: number;
    /**
     * The index at which this pointer is drawn. This is the index that changes when animations are scheduled.
     * @type {number}
     */
    drawIndex: number;
    /**
     * The label to show below this pointer
     * @type {string}
     */
    label: string;
    /**
     * The state machine to handle the states of this pointer. Initial state is idle.
     * @type {StateMachine}
     */
    stateMachine: StateMachine;
    /**
     * Draws an arrow along with label and index
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     *
     * @ignore
     */
    drawArrow(ctx: CanvasRenderingContext2D): void;
    /**
     * Changes the state of the state machine to the given state
     * @param {string} toState The state to change to
     * @param {*} enterParams The object containing all the parameters required to enter the state
     *
     * @ignore
     */
    changeState(toState: string, enterParams: any): void;
    /**
     * Calculates the coordinates of pointer based on the vArray object coordinates and the index
     * @ignore
     */
    syncCoordinates(): void;
    /**
     * Get the current index value of the pointer
     * @returns current index value
     *
     * @example <caption> Get the currend index of pointer </caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //creating a pointer using the array
     * let pointer = arr.getPointer(5, 'My Pointer')
     *
     * // getting the current index of pointer
     * let currentIndex = new vElement(pointer.getIndex(), "Index")
     */
    getIndex(): number;
    /**
     * Check whether the current index value is out of the bounds of vArray
     * @returns {boolean} true if the index is out of bounds, false otherwise
     *
     * @example <caption> Check whether pointer is outside the array bounds </caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //looping through the array using a pointer
     * for(let i = arr.getPointer(0, "Pointer"); !i.isOutOfBound() || i.remove(); i.increment())
     * {
     *    arr.highlight([i.getIndex()])
     * }
     */
    isOutOfBound(): boolean;
    /**
     * Moves the pointer by the specified amount of change in index value.
     * @param {number} change The change to add in the index. Positive moves it ahead, negative moves it back.
     *
     * You can change the index however you want: no exception is thrown.
     * Instead, to handle such cases, the drawIndex value is capped till one before start and one after the end of array.
     *
     * @example <caption>Moving the pointer</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // move forward
     * i.move(4)
     *
     * // move backward
     * i.move(-3)
     */
    move(change: number): void;
    /**
     * Moves the pointer to a specified index
     * @param index The index to move to
     *
     * @example <caption>Moving the pointer to a specific index</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // move to a specific index
     * i.moveTo(4)
     * i.moveTo(1)
     */
    moveTo(index: any): void;
    /**
     * Increment the index of pointer by 1
     *
     * Same as calling move(1)
     *
     * @example <caption>Moving pointer forward by 1 index</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // Moving pointer forward by 1 index with 3 different styles (all are equivalent)
     * i.move(1)
     *
     * i.moveTo(i.getIndex()+1)
     *
     * i.increment()
     */
    increment(): void;
    /**
     * Decrement the index of pointer by 1
     *
     * Same as calling move(-1)
     *
     * @example <caption>Moving pointer backward by 1 index</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // Moving pointer backward by 1 index with 3 different styles (all are equivalent)
     * i.move(-1)
     *
     * i.moveTo(i.getIndex()-1)
     *
     * i.decrement()
     */
    decrement(): void;
    /**
     * Hightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     * @param {string} color The color to highlight with
     *
     * @example <caption>Highlight the current index of pointer</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // highlight the current index at which pointer is currently
     *
     * // default blue color
     * i.highlight()
     *
     * //custom color
     * i.highlight('yellow')
     */
    highlight(color?: string): void;
    /**
     * Unightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     *
     * @example <caption>Unhighlight the current index of pointer</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //get the pointer
     * let i = arr.getPointer(0, "Moving Pointer")
     *
     * // unhighlight the current index at which pointer is currently
     * i.unhighlight()
     */
    unhighlight(): void;
}
import { Entity } from "../Entity.js";
import { vArray } from "../vArray/vArray.js";
import { StateMachine } from "../../utils/index.js";
