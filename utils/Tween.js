/**
 * Represent a single tween
 */
export class Tween 
{
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
        constructor( target, startValues, changeValues, startTime, duration, easing, callback ) 
        {
                /**
                 * The target object to tween
                 * @type {object}
                 */
                this.target = target;

                /**
                 * Values before tween
                 * @type {object}
                 */
                this.startValues = startValues;

                /**
                 * Change in Values after tween
                 * @type {object}
                 */
                this.changeValues = changeValues;

                /**
                 * Starting time of tween
                 * @type {number}
                 */
                this.startTime = startTime;

                /**
                 * Duration of the tween in milliseconds
                 * @type {number}
                 */
                this.duration = duration;

                /**
                 * Easing function
                 * @type {function}
                 */
                this.easing = easing;

                /**
                 * Callback when tween completes
                 * @type {function}
                 */
                this.callback = callback;
        }
}
