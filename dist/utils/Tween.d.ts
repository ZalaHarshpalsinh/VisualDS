/**
 * Represent a single tween
 */
export class Tween {
    /**
     *
     * @param {object} target The target object to tween
     * @param {object} startValues Values before tween
     * @param {object} changeValues Change in Values after tween
     * @param {number} startTime  Starting time of tween
     * @param {number} duration Duration of the tween in milliseconds
     * @param {function} easing Easing function
     * @param {function} callback Callback when tween completes
     */
    constructor(target: object, startValues: object, changeValues: object, startTime: number, duration: number, easing: Function, callback: Function);
    /**
     * The target object to tween
     * @type {object}
     */
    target: object;
    /**
     * Values before tween
     * @type {object}
     */
    startValues: object;
    /**
     * Change in Values after tween
     * @type {object}
     */
    changeValues: object;
    /**
     * Starting time of tween
     * @type {number}
     */
    startTime: number;
    /**
     * Duration of the tween in milliseconds
     * @type {number}
     */
    duration: number;
    /**
     * Easing function
     * @type {function}
     */
    easing: Function;
    /**
     * Callback when tween completes
     * @type {function}
     */
    callback: Function;
}
