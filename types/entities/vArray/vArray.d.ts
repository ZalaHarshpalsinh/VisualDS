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
     *
     * @example <caption>Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //creating a string
     * let str = "Hello World"
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //creating a string
     * let str = new vArray("Hello World", 'My String')
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
     *
     * @ignore
     */
    updateBoxes(dt: number): void;
    /**
     * Updates all the pointers encapsulated in this vArray
     * @param {number} dt The delta time
     *
     * @ignore
     */
    updatePointers(dt: number): void;
    /**
     * Draws the boxes for each element, basically just delegates to the draw of each vElement object in drawData
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     *
     * @ignore
     */
    drawBoxes(ctx: CanvasRenderingContext2D): void;
    /**
     * Draws all the pointers associated with this array
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     *
     * @ignore
     */
    drawPointers(ctx: CanvasRenderingContext2D): void;
    /**
     * Changes the state of the state machine to the given state
     * @param {string} toState The state to change to
     * @param {*} enterParams The object containing all the parameters required to enter the state
     *
     * @ignore
     */
    changeState(toState: string, enterParams: any): void;
    /**
     * Updates the boxWidth, boxHeight, Width, Height based on biggest vElement in drawData
     *
     * @ignore
     */
    syncDimensions(): void;
    /**
     * Updates the coordinates of each box, based on starting coordinates of array and boxWidth
     *
     * @ignore
     */
    syncCoordinates(): void;
    /**
     * Get the array length
     * @returns Length of the contained array
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //getting the length of the array
     * let length = arr.length
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //getting the length of the array
     * let length = new vElement(arr.length(), 'Length')
     */
    length(): number;
    /**
     * Get the value at a given index
     * @param {number} index The index to get value from
     * @returns The value at the given index
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //accessing the value at any index
     * let valAtIndex2 = arr[2]
     *
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //accessing the value at any index
     * let valAtIndex2 = new vElement(arr.get(2), 'Value at index 2')
     */
    get(index: number): any;
    /**
     * Set a new value at a given index
     * @param {number} index The index for which to update value
     * @param {*} newVal The new value
     * @param {boolean} highlight Whether to highlight the element while showing updation on screen. Defaults to true.
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //updating the value at any index
     * arr[2] = 10
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //updating the value at any index with highlight
     * arr.set(2, 10)
     *
     * //updating the value at any index without highlight
     * arr.set(2, 10, false)
     */
    set(index: number, newVal: any, highlight?: boolean): void;
    /**
     * Adds a new element at the end of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //adding a new element at the end of array
     * arr.push(6)
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //adding a new element at the end of array
     * arr.pushBack(6)
     */
    pushBack(val: any): number;
    /**
     * Removes an element from the end of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //removing an element from the end of array
     * let removedElement = arr.pop()
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //removing an element from the end of array
     * let removedElement = arr.popBack()
     * removedElement = new vElement(removedElement, 'Removed Element')
     */
    popBack(): any;
    /**
     * Adds a new element at the start of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //adding a new element at the start of array
     * arr.unshift(0)
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //adding a new element at the start of array
     * arr.pushFront(0)
     */
    pushFront(val: any): number;
    /**
     * Removes an element from the start of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     *
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //removing an element from the start of array
     * let removedElement = arr.shift()
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //removing an element from the start of array
     * let removedElement = arr.popFront()
     * removedElement = new vElement(removedElement, 'Removed Element')
     */
    popFront(): any;
    /**
     * Highlights a list of indices
     * @param {number[]} indices The list of indices
     * @param {string} color The color to highlight with. Defaults to blue.
     *
     * @example <caption>Highlighting a list of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //highlighting a list of indices (default blue)
     * arr.highlight([1, 3])
     *
     * //highlighting a list of indices (custom color)
     * arr.highlight([0, 2, 4], 'yellow')
     */
    highlight(indices: number[], color?: string): void;
    /**
     * Unhighlights a list of indices
     * @param {number[]} indices The list of indices
     *
     * @example <caption>Unhighlighting a list of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //highlighting a list of indices (default blue)
     * arr.highlight([0, 1, 2, 3, 4])
     *
     * //unhighlighting a list of indices
     * arr.unhighlight([0, 2, 4])
     *
     */
    unhighlight(indices: number[]): void;
    /**
     * Highlights a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     * @param {string} color The color to highlight with.
     *
     * @example <caption>Highlighting a continuous range of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'My Array')
     *
     * //highlighting a range of indices (default blue)
     * arr.highlightRange(0, 4)
     *
     * //highlighting a range of indices (custom color)
     * arr.highlightRange(5, 9, 'yellow')
     */
    highlightRange(s: number, e: number, color: string): void;
    /**
     * Unhighlight a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     *
     * @example <caption>Unhighlighting a continuous range of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'My Array')
     *
     * //highlighting a range of indices (default blue)
     * arr.highlightRange(0, 9)
     *
     * //unhighlighting a range of indices
     * arr.unhighlightRange(3, 6)
     */
    unhighlightRange(s: number, e: number): void;
    /**
     * Swaps elements at two indices
     * @param {number} i The first index
     * @param {number} j The second index
     * @param {boolean} highlight Whether to highlight the elements while showing animation. Defaults to true.
     *
     * @example <caption>Normal JS code</caption>
     * //Vanilla JS
     *
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     *
     * //swapping two elements
     * [arr[0], arr[1]] = [arr[1], arr[0]]
     *
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     *
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     *
     * //swapping two elements with highlight
     * arr.swap(0, 4)
     *
     * //swapping two elements without highlight
     * arr.swap(0, 4, false)
     */
    swap(i: number, j: number, highlight?: boolean): void;
    /**
    * Get a pointer(index variable) for this vArray instance.
    * @param {number} initIndex The initial index pointed by the pointer
    * @param {string} label The name to show for this pointer on screen.
    * @returns {Pointer}
    *
    * @example <caption>Normal JS code</caption>
    * //Vanilla JS
    *
    * //creating an array
    * let arr = [1, 2, 3, 4, 5]
    *
    * // looping through the array using a index variable
    * for (let i = 0; i < arr.length; i++) {
    *     console.log(arr[i])
    * }
    *
    * @example <caption>Corresponding code using visualDS for visualization</caption>
    * //Using visualDS
    *
    * //creating an array
    * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
    *
    * //looping through the array using a pointer
    * //refer Pointer class for more details
    * for(let i = arr.getPointer(0, "Pointer"); !i.isOutOfBound() || i.remove(); i.increment())
    * {
    *    arr.highlight([i.getIndex()])
    * }
    */
    getPointer(initIndex: number, label?: string): Pointer;
    /**
     * Remove a given pointer from this vArray instance.
     *
     * It has the following effect: It will not be drawn following this call, and you cannot queue any animations from the pointer
     * @param {Pointer} ptr The pointer to remove
     * @ignore
     */
    removePointer(ptr: Pointer): void;
}
import { Entity } from "../Entity.js";
import { vElement } from "../index.js";
import { Pointer } from "../index.js";
import { StateMachine } from "../../utils/index.js";
