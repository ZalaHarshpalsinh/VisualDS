/**
 * This class represents a visual array.
 *
 * It can be an array of anything, i.e string, number, custom objects, etc.
 * The only restriction is that the class, whose objects are in the array, should have a toString() method
 * that returns what needs to be written in the visualized object in the visualized array.
 * It may be a single line text, or a multiline text. If just passing array of numbers, or strings, then no need to worry about toString
 * since it is there by default in these inbuilt classes.
 *
 * With its pushBack(), popBack(), pushFront(), popFront() methods, it can be used as a stack or queue as well.
 */
export class vArray extends Entity {
    /**
     * @param {any[]} data The array data to be used for visualization
     * @param {string} label The label to draw above the array. Defaults to empty string.
     */
    constructor(data: any[], label?: string);
    /**
     * This is the actual data inside the array, that changes with the synchronous code
     * written by user.
     * @type {any[]}
     */
    data: any[];
    /**
     * The label to draw above the array
     * @type {string}
     */
    label: string;
    /**
     * This is the copy utilized for drawing on every frame.
     * It changes asynchronously, as and when animations related to
     * the varray object are selected from the animation queue.
     * @type {vElement[]}
     */
    drawData: vElement[];
    /**
     * The list of pointers (index variables) that point to elements of this array.
     *
     * Required, because along with the array itself, these also need to be drawn and updated on every frame.
     * @type {Pointer[]}
     */
    pointers: Pointer[];
    /**
     * Width of a single element drawn
     * @type {number}
     */
    boxWidth: number;
    /**
     * Height of a single element drawn
     * @type {number}
     */
    boxHeight: number;
    /**
     * To manage the animation via states
     * @type {StateMachine}
     */
    stateMachine: StateMachine;
    /**
     * Updates all the vElement objects encapsulated in this vArray
     * @param {number} dt The delta time
     */
    updateBoxes(dt: number): void;
    /**
     * Updates all the pointers encapsulated in this vArray
     * @param {number} dt The delta time
     */
    updatePointers(dt: number): void;
    update(dt: any): void;
    /**
     * Draws the boxes for each element, basically just delegates to the draw of each vElement object in drawData
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     */
    drawBoxes(ctx: CanvasRenderingContext2D): void;
    /**
     * Draws all the pointers associated with this array
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     */
    drawPointers(ctx: CanvasRenderingContext2D): void;
    draw(ctx: any): void;
    notify(params: any): void;
    /**
     * Changes the state of the state machine to the given state
     * @param {string} toState The state to change to
     * @param {*} enterParams The object containing all the parameters required to enter the state
     */
    changeState(toState: string, enterParams: any): void;
    /**
     * Updates the boxWidth, boxHeight, Width, Height based on biggest vElement in drawData
     */
    syncDimensions(): void;
    /**
     * Updates the coordinates of each box, based on starting coordinates of array and boxWidth
     */
    syncCoordinates(): void;
    /**
     * Get the array length
     * @returns Length of the contained array
     */
    length(): number;
    /**
     * Get the value at a given index
     * @param {number} index The index to get value from
     * @returns The value at the given index
     */
    get(index: number): any;
    /**
     * Set a new value at a given index
     * @param {number} index The index for which to update value
     * @param {*} newVal The new value
     * @param {boolean} highlight Whether to highlight the element while showing updation on screen. Defaults to true.
     */
    set(index: number, newVal: any, highlight?: boolean): void;
    /**
     * Adds a new element at the end of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     */
    pushBack(val: any): number;
    /**
     * Removes an element from the end of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     */
    popBack(): any;
    /**
     * Adds a new element at the start of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     */
    pushFront(val: any): number;
    /**
     * Removes an element from the start of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     */
    popFront(): any;
    /**
     * Highlights a list of indices
     * @param {number[]} indices The list of indices
     * @param {string} color The color to highlight with. Defaults to blue.
     */
    highlight(indices: number[], color?: string): void;
    /**
     * Unhighlights a list of indices
     * @param {number[]} indices The list of indices
     */
    unhighlight(indices: number[]): void;
    /**
     * Highlights a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     * @param {string} color The color to highlight with.
     */
    highlightRange(s: number, e: number, color: string): void;
    /**
     * Unhighlight a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     */
    unhighlightRange(s: number, e: number): void;
    /**
     * Swaps elements at two indices
     * @param {number} i The first index
     * @param {number} j The second index
     * @param {boolean} highlight Whether to highlight the elements while showing animation. Defaults to true.
     */
    swap(i: number, j: number, highlight?: boolean): void;
    /**
    * Get a pointer(index variable) for this vArray instance.
    * @param {number} initIndex The initial index pointed by the pointer
    * @param {string} label The name to show for this pointer on screen.
    * @returns {Pointer}
    */
    getPointer(initIndex: number, label?: string): Pointer;
    /**
     * Remove a given pointer from this vArray instance.
     *
     * It has the following effect: It will not be drawn following this call, and you cannot queue any animations from the pointer
     * @param {Pointer} ptr The pointer to remove
     */
    removePointer(ptr: Pointer): void;
}
import { Entity } from "../Entity.js";
import { vElement } from "../index.js";
import { Pointer } from "../index.js";
import { StateMachine } from "../../utils/index.js";
