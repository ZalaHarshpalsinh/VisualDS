/**
 * This is that class that encapsulates any object that is to be drawn.
 *
 * It may be number, string, or even a custom Student object, provided it has a toString() overridden
 * that returns the text representation of the object.
 *
 * User of the framework may want to create individual objects of this class that would be drawn (with isSlave = false)
 * and managed by the animator directly. This is useful when the user wants to show a single object on the screen.,
 * for example, a number or a string.
 *
 * or the user may not use this at all, instead the user may use higher level classes such as vArray
 * which internally uses vElement objects (with isSlave = true).
 */
export class vElement extends Entity {
    /**
     * @param {*} val The object to visualize.In case it is a custom object it Must have a toString() overridden which returns a single or multi line
     * respresentation of object.
     * @param {string} label The label/name that is to be displayed when drawing this vElement. Defaults to empty string.
     * @param {boolean} isSlave True if this vElement is not to be managed by the animator directly
     * (managed by some master entity, such as vArray). Defaults to false.
     */
    constructor(val: any, label?: string, isSlave?: boolean);
    /**
     * The object encapsulated. This gets updated along with the synchronous code
     * (code written by the user).
     * @type {*}
     */
    val: any;
    /**
     * The object utilized to draw. This gets updated as and when the animation related to any updation is executed by animator.
     * @type {*}
     */
    drawVal: any;
    /**
     * The label/name that is to be displayed when drawing this vElement
     * @type {string}
     */
    label: string;
    /**
     * The color of the box in which to display the object
     * @type {string}
     */
    color: string;
    /**
     * The font style utilized to write the toString() text of the drawVal in the box
     * @type {string}
     */
    font: string;
    /**
     * The font style utilized to write the label
     * @type {string}
     */
    labelFont: string;
    /**
     * The text representation of the drawVal object, as an array of strings which are to be drawn on separate lines
     * @type {string[]}
     */
    text: string[];
    /**
     * The state machine to manage the states of vElement. Initial state is idle.
     * @type {StateMachine}
     */
    stateMachine: StateMachine;
    /**
     * Changes the state of the vElement object.
     * @param {string} toState The state to which to change
     * @param {object} enterParams An object containing the parameters required to enter the state and to be passed to the state's enter function.
     */
    changeState(toState: string, enterParams: object): void;
    /**
     * Calculates and sets the box's dimensions based on text and label (Dynamic adjustmenet of dimensions)
     * This is called when the text or label is changed, or when the vElement is created.
     */
    syncDataAndVisual(): void;
    /**
     * Sets the new value of the encapsulated object
     * @param {*} val The new value
     * @param {boolean} highlight Is the vElement to be highlighted while showing the change on the screen
     */
    setVal(val: any, highlight?: boolean): void;
    /**
     * Get the current value of the encapsulated object
     * @returns The current value stored by vElement
     */
    getVal(): any;
    /**
     * Hightlight the vElement with the given color.
     *
     * Registers the animation for changing the color of the box
     * @param {string} color The colour with which to highlight
     */
    highlight(color: string): void;
    /**
     * Unhightlights the vElement
     *
     * Registers the animation for changing the color of the box to default color
     */
    unhighlight(): void;
}
import { Entity } from "../Entity.js";
import { StateMachine } from "../../utils/index.js";
