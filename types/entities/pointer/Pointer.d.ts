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
     */
    getIndex(): number;
    /**
     * Check whether the current index value is out of the bounds of vArray
     * @returns {boolean} true if the index is out of bounds, false otherwise
     */
    isOutOfBound(): boolean;
    /**
     * Moves the pointer by the specified amount of change in index value.
     * @param {number} change The change to add in the index. Positive moves it ahead, negative moves it back.
     *
     * You can change the index however you want: no exception is thrown.
     * Instead, to handle such cases, the drawIndex value is capped till one before start and one after the end of array.
     */
    move(change: number): void;
    /**
     * Moves the pointer to a specified index
     * @param index The index to move to
     */
    moveTo(index: any): void;
    /**
     * Increment the index of pointer by 1
     *
     * Same as calling move(1)
     */
    increment(): void;
    /**
     * Decrement the index of pointer by 1
     *
     * Same as calling move(-1)
     */
    decrement(): void;
    /**
     * Hightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     * @param {string} color The color to highlight with
     */
    highlight(color?: string): void;
    /**
     * Unightlights the element where this pointer is pointing. No effect if isOutOfBound() returns true.
     */
    unhighlight(): void;
}
import { Entity } from "../Entity.js";
import { vArray } from "../vArray/vArray.js";
import { StateMachine } from "../../utils/index.js";
