import { getCurrentAnimatorId, getAnimationSpeed } from "../driver.js"
import { Tween } from "./Tween.js"

/**
 * A manager class which manages all tweens
 */
export class TweenManager
{
    constructor()
    {
        // Get the current animator ID
        // This is used to identify the animator instance that created this tween manager
        this.animatorId = getCurrentAnimatorId() + 1


        /**
         * A map of all unfinished tweens
         * @type {Map<number, Tween>}
         */
        this.tweens = new Map()

        /**
         * Id to be assigned to next tween
         * @type {number}
         */
        this.nextId = 1
    }

    /**
     * Create a new tween
     * @param {object} target - The target object to tween
     * @param {object} values - The target values to tween to (e.g., {x: 100, y: 200})
     * @param {number} duration - Duration of the tween in milliseconds
     * @param {function} [easing] - Easing function (default: linear)
     * @param {function} [callback] - Callback when tween completes
     * @returns {number} - Tween ID
     */
    addTween( target, values, duration, easing = TweenManager.linear, callback = null ) 
    {
        // Assign id to tween
        const id = this.nextId++
        // 
        const startValues = {}
        // Values after tween
        const changeValues = {}

        // Starting time of tween
        const startTime = performance.now() // in miliseconds

        // update ideal duration as per current animation speed
        duration /= getAnimationSpeed( this.animatorId )

        // Store initial values and calculate changes
        for ( const key in values )
        {
            startValues[ key ] = target[ key ]
            changeValues[ key ] = values[ key ] - startValues[ key ]
        }

        // add the tween in map
        this.tweens.set( id, new Tween(
            target,
            startValues,
            changeValues,
            startTime,
            duration,
            easing,
            callback
        ) )

        return id
    }

    /**
     * Cancel a tween
     * @param {number} id - The tween ID to cancel
     */
    cancel( id )
    {
        this.tweens.delete( id )
    }

    /**
     * Cancel all tweens
     */
    cancelAll()
    {
        this.tweens.clear()
    }

    /**
     * Updates all active tweens
     * @param {number} dt Delta time
     */
    update( dt ) 
    {
        const now = performance.now()

        // A list to store ids of completed tweens for later removal
        const completedTweens = []

        this.tweens.forEach( ( tween, id ) =>
        {

            // time elapsed since starting of tween
            const elapsed = now - tween.startTime
            const progress = Math.min( elapsed / tween.duration, 1.0 )
            const easedProgress = tween.easing( progress )

            // Update target properties
            for ( const key in tween.changeValues ) 
            {
                tween.target[ key ] = tween.startValues[ key ] + tween.changeValues[ key ] * easedProgress
            }

            // Check if tween is complete
            if ( progress >= 1.0 ) 
            {
                completedTweens.push( id )
                if ( tween.callback ) 
                {
                    tween.callback()
                }
            }
        } )

        // Remove completed tweens
        completedTweens.forEach( id => this.tweens.delete( id ) )
    }

    /**
     * Check if a tween is active
     * @param {number} id - The tween ID to check
     * @returns {boolean} - True if the tween is active
     */
    isActive( id )
    {
        return this.tweens.get( id ) ? true : false
    }
}

// Built-in easing functions
TweenManager.linear = t => t
TweenManager.quadIn = t => t * t
TweenManager.quadOut = t => t * ( 2 - t )
TweenManager.quadInOut = t => t < 0.5 ? 2 * t * t : -1 + ( 4 - 2 * t ) * t
TweenManager.cubicIn = t => t * t * t
TweenManager.cubicOut = t => ( --t ) * t * t + 1
TweenManager.cubicInOut = t => t < 0.5 ? 4 * t * t * t : ( t - 1 ) * ( 2 * t - 2 ) * ( 2 * t - 2 ) + 1
TweenManager.sinIn = t => 1 - Math.cos( t * Math.PI / 2 )
TweenManager.sinOut = t => Math.sin( t * Math.PI / 2 )
TweenManager.sinInOut = t => ( 1 - Math.cos( Math.PI * t ) ) / 2
TweenManager.expoIn = t => t === 0 ? 0 : Math.pow( 2, 10 * ( t - 1 ) )
TweenManager.expoOut = t => t === 1 ? 1 : 1 - Math.pow( 2, -10 * t )
TweenManager.expoInOut = t =>
{
    if ( t === 0 ) return 0
    if ( t === 1 ) return 1
    if ( ( t *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( t - 1 ) )
    return 0.5 * ( -Math.pow( 2, -10 * --t ) + 2 )
}