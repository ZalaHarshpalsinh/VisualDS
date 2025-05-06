import { getCurrentAnimatorId, addInPool, removeFromPool, addAnimation, nextAnimation, getAnimationSpeed, setAnimationSpeed, getTweenManager } from "../driver.js"
import { Animation } from "../Animation.js"
import { TweenManager } from "../utils/index.js"

/**
 * Represents an drawable entity which uses the framework functionalities and services of Animator to perform animations.
 */
export class Entity 
{
    constructor()
    {
        // Get the animator id of the current animator
        // This is the animator which will be used to perform animations on this entity
        this.animatorId = getCurrentAnimatorId()

        /**
         * X coordinate assigned to entity by Animator
         * @type {number}
         */
        this.x = 0
        /**
         * Y coordinate assigned to entity by Animator
         * @type {number}
         */
        this.y = 0
        /**
         * Width of the entity in pixels
         * @type {number}
         */
        this.width = 0
        /**
         * Height of the entity in pixels
         * @type {number}
         */
        this.height = 0

        /**
         * Indicates whether this entity is removed or not
         * 
         * true : this entity is removed from scope and will not be able to queue any animations
         * @type {boolean}
         */
        this.removed = false
    }

    /**
     * Set the coordinates of the top left corner of entity
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     */
    setCoordinates( x, y )
    {
        this.x = x
        this.y = y
    }

    /**
     * Get the current coodinates of the entity
     * @returns {{x: number, y:number}} Object containing coordinates
     */
    getCoordinates()
    {
        return { x: this.x, y: this.y }
    }

    /**
     * Register the entity object ( this ) to animator
     * 
     * Immediate effect: Animator queues the Action of adding this entity
     * 
     * Animation effect: Entity gets registered to animator and starts appearing on canvas
     */
    addInPool()
    {
        // Delegate the call to animator
        addInPool( this.animatorId, this )
    }

    /**
     * Remove the entity object ( this ) from animator
     * 
     * Immediate effect: Entity object is marked removed and will not be able to register any more animations and
     * animator queues the Action of removing this entity
     * 
     * Animation effect: Entity gets removed from animator and disappears from the canvas.
     * Other entities move to fill the gap left by removed entity.
     */
    remove()
    {
        // Mark entity as removed so that it can not register any animation after this
        this.removed = true

        // Delegate the call to animator
        removeFromPool( this.animatorId, this )
    }

    /**
     * Registers an animation to animator. Animator adds the animation in a queue
     * 
     * Animator will notify the entity when this animation's turn come, by calling notify() method on entity.
     * And it will also pass the params object back to entity which is provided here, at the time of animation registration.
     * 
     * Upon execution of queued animation, animator will move to and stay in 'animating' state until nextAnimation() is called on it.
     * 
     * If entity is already removed, this call will have no effect. 
     * @param {object} params object containing all extra parameters required to complete animation. This same object will be passed back to entity in notify() method 
     */
    addAnimation( params )
    {
        // dont't queue animation if already removed by user
        if ( this.removed ) return

        // create animation object
        const animObj = new Animation( this, params )

        // delegate the call to animator
        addAnimation( this.animatorId, animObj )
    }

    /**
     * Notifies the entity that its turn has arrived and it can perform the requested animation
     * @param {object} params object containing all extra parameters required to complete animation. This is the same object which was passed in while calling addAnimation.
     */
    notify( params ) { }

    /**
     * Notifies the Animator about the completion of entity's animation, so that it can move to next animation.
     * 
     * It must be called by the entity at the end of every animation, if it is not, next animations in the animator's queue will not execute. 
     */
    nextAnimation()
    {
        // Delegate the call to animator
        nextAnimation( this.animatorId )
    }

    /**
     * Gets the current animation speed of the animator
     * @returns {number} The current animation speed of the animator
     */
    getAnimationSpeed()
    {
        return getAnimationSpeed( this.animatorId )
    }

    /**
     * Sets the animation speed of the animator
     * @param {number} newSpeed The new animation speed of the animator. It must be between 0.1 and 5.0
     */
    setAnimationSpeed( newSpeed )
    {
        setAnimationSpeed( this.animatorId, newSpeed )
    }

    /**
     * Gets the tween manager of the animator. It can be used to create tweens for this entity.
     * @returns {TweenManager} The tween manager of the animator.
     */
    getTweenManager()
    {
        return getTweenManager( this.animatorId )
    }

    /**
     * Updates the entity. It is called on every frame if entity is registered to animator.
     * @param {number} dt Delta time 
     */
    update( dt ) { }

    /**
     * Draws the entity. It is called on every frame if entity is registered to animator.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context of canvas to draw with
     */
    draw( ctx ) { }

    /**
     * Performs the clean up tasks. It is called by the animator when the entity is removed from its pool.
     */
    cleanUp() { }
} 