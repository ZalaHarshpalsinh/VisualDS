/**
 * A manager class which manages all tweens
 */
export class TweenManager {
    animatorId: number;
    /**
     * A map of all unfinished tweens
     * @type {Map<number, Tween>}
     */
    tweens: Map<number, Tween>;
    /**
     * Id to be assigned to next tween
     * @type {number}
     */
    nextId: number;
    /**
     * Create a new tween
     * @param {object} target - The target object to tween
     * @param {object} values - The target values to tween to (e.g., {x: 100, y: 200})
     * @param {number} duration - Duration of the tween in milliseconds
     * @param {function} [easing] - Easing function (default: linear)
     * @param {function} [callback] - Callback when tween completes
     * @returns {number} - Tween ID
     */
    addTween(target: object, values: object, duration: number, easing?: Function, callback?: Function): number;
    /**
     * Cancel a tween
     * @param {number} id - The tween ID to cancel
     */
    cancel(id: number): void;
    /**
     * Cancel all tweens
     */
    cancelAll(): void;
    /**
     * Updates all active tweens
     * @param {number} dt Delta time
     */
    update(dt: number): void;
    /**
     * Check if a tween is active
     * @param {number} id - The tween ID to check
     * @returns {boolean} - True if the tween is active
     */
    isActive(id: number): boolean;
}
export namespace TweenManager {
    function linear(t: any): any;
    function quadIn(t: any): number;
    function quadOut(t: any): number;
    function quadInOut(t: any): number;
    function cubicIn(t: any): number;
    function cubicOut(t: any): number;
    function cubicInOut(t: any): number;
    function sinIn(t: any): number;
    function sinOut(t: any): number;
    function sinInOut(t: any): number;
    function expoIn(t: any): number;
    function expoOut(t: any): number;
    function expoInOut(t: any): number;
}
import { Tween } from "./Tween.js";
