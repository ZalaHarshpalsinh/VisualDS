import { cnt } from "./CONSTANTS.js"
import { tweenManager } from "./driver.js"
import { Entity } from "./entities/Entity.js"
import { TweenManager } from "./utils/index.js"
import { Animation } from "./Animation.js"
import { Action } from "./Action.js"

/**
 * This is the manager class of the whole framework.
 * 
 * It has a pool or array of Entity to be drawn on every frame.
 * 
 * It also has an animation queue from which it takes up an animation/action, completes it then moves to the next naimation/action.
 */
export class Animator 
{
    constructor()
    {
        /**
         * brush holds the coordinates which new entity will be assigned upon registration through addInPool() method.
         * 
         * Initially coordinates are set to Framework Level Constant values.
         */
        this.brush = { x: cnt.START_X, y: cnt.START_Y }

        /**
         * Array of entities registered to animator for management.
         * 
         * This implies : Animator will call update and draw on each of them on every frame.
         */
        this.dsPool = []

        /**
         * FIFO Queue for storing animation requests for any entity (Registered or unregistered).
         * Animator also stores its actions in this queue which need to be synchronized with animations, i.e. adding a entity
         */
        this.animationQueue = []

        /**
         * A simple variable to keep track of animator's state.
         * 
         * Animator behaves differently in each state.
         * 
         * Initially set to idle state.
         */
        this.state = 'idle'

        /**
         * Variable which controls the speed of animation.
         * 
         * It is a multiplier which will be applied to default speed.
         * 
         * By default, the animation speed is set to 1.0x.
         */
        this.animationSpeed = 1.0
    }

    /**
     * Registers an Entity to animator for management.
     * @param {Entity} entity Entity to be registered
     */
    addInPool( entity )
    {
        /** 
         * Queue the action of actually adding the entity in dsPool, so that it is only added after all animations registered uptil now would have been completed.
         * Think of registration of new entity as an animation.
         */
        this.addAnimation( new Action( 'add', { entity: entity } ) )
    }

    /**
     * Removes an Entity from the pool of entities managed by animator.
     * @param {Entity} entity Entity to be removed
     */
    removeFromPool( entity )
    {
        /** 
         * Queue the action of actually removing the entity from dsPool, so that it is only removed after all animations registered uptil now would have been completed.
         * Think of removal of an entity as an animation.
         * Also, compaction is performed to fill the gap left by the entity, when this animation takes effect.
         */
        this.addAnimation( new Action( 'remove', { entity: entity } ) )
    }

    /**
     * Queues an animation/action.
     * 
     * If it is an animation, animator will notify the requesting entity when this animation's turn come, by calling notify() method on that entity.
     * And it will also pass the params object back to entity, which was provided at time of animation registration.
     * 
     * If it is an action then, animator will perform the action itself. 
     * 
     * Upon execution of queued animation/action, animator will move to and stay in 'animating' state until nextAnimation() is called on it. 
     * @param {Animation | Action} animObj animation to be queued
     */
    addAnimation( animObj )
    {
        // Add the animation into queue
        this.animationQueue.push( animObj )
    }

    /**
     * Moves the animator to 'idle' state after some delay which is decided based on animationSpeed.
     * 
     * After going in 'idle' state animator will pick the next item from animationQueue, hence the name 'nextAnimation'.
     * 
     * It should be called by the entity to notify the animator about the completion of its animation.
     */
    nextAnimation()
    {
        /**
         * Change the state to 'idle' after some delay decided by the animation speed.
         * So that animations appear as discrete steps and not a continuous motion which is hard to observe
         */
        setTimeout( () => this.state = 'idle', 400 / this.getAnimationSpeed() )
    }

    /**
     * Gives the current animation speed.
     * @returns {number} current animation speed (A value multiplied with default speed)
     */
    getAnimationSpeed()
    {
        return this.animationSpeed
    }

    /**
     * Queues the action of actually changing the animation speed, so that all the animations registerd/queued after this execute at new speed
     * @param {*} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
     */
    setAnimationSpeed( newSpeed )
    {
        this.addAnimation( new Action( 'change_speed', { newSpeed: newSpeed } ) )
    }

    /**
     * Performs the compaction of all registered entities.
     * Reassigns the coordinates to each entity, so that empty space left by some removed entity can be reutilized.
     * Entities which has their coordinates change as result of this compaction, will move to their new position with an animation. 
     */
    compactEntities()
    {
        // Put brush as starting point
        this.brushX = cnt.START_X
        this.brushY = cnt.START_Y

        // Reassign coordinates to each entity
        this.dsPool.forEach( e =>
        {
            // Get old coordinates
            let oldCoords = e.getCoordinates()

            // Compare old coordinates with new ones, to see if there's a change
            if ( oldCoords.x != this.brushX || oldCoords.y != this.brushY )
            {
                // if there is a change, tween the coordinates to new values
                tweenManager.addTween( e,
                    { x: this.brushX, y: this.brushY },
                    300,
                    TweenManager.linear,
                    () =>
                    {
                        // When all the tweens are completed, notify animator to move to next animation
                        this.nextAnimation()
                    }
                )
            }

            /** 
             * Move the brush to next location based on width/height of entity.
             * Margin between entities is a Framework Level Constant.
             */
            this.brushY += e.height + cnt.MARGIN_Y
        } )
    }

    /**
     * Updates the animator based on the current state value. It is called on every frame.
     * 
     * If state is 'idle', executes next animation/action in animationQueue, moves to 'animating' state. 
     * 
     * If state is 'animating', waits for animated entity to notify about completion of animation.
     * @param {number} dt Delta time 
     */
    update( dt )
    {
        /**
         * Object to hold the popped animation/action 
         */
        let animObj = undefined

        // Check if state is idle and there is a valid animation/action object in queue.
        if ( this.state == 'idle' && ( animObj = this.animationQueue.shift() ) !== undefined )
        {
            // Change state
            this.state = 'animating'

            // Check if it is one of the valid actions
            if ( animObj.type == 'add' )
            {
                // Assign current position of brush to entity's coordinates.
                animObj.params.entity.setCoordinates( this.brush.x, this.brush.y )
                /** 
                 * Move the brush to next location based on width/height of entity.
                 * Margin between entities is a Framework Level Constant.
                 */
                this.brush.y += animObj.params.entity.height + cnt.MARGIN_Y
                // Actually add the entity to dsPool
                this.dsPool.push( animObj.params.entity )
                // Move to next animation/action by transitioning to idle state
                this.nextAnimation()
            }
            else if ( animObj.type == 'remove' )
            {
                // Actually remove the entity from dsPool
                this.dsPool.splice( this.dsPool.indexOf( animObj.params.entity ), 1 )
                /**
                 * Compact the entities to fill the space left by removed entity.
                 * After compaction process will be finished, brush will point to an empty location available for assignment to next entity 
                */
                this.compactEntities()
                // Call the cleanUp() function of entity so that it can perform clean up tasks before leaving
                animObj.params.entity.cleanUp()
                // Move to next animation/action by transitioning to idle state
                this.nextAnimation()
            }
            else if ( animObj.type == 'change_speed' )
            {
                // Set the new animation
                this.animationSpeed = animObj.params.newSpeed
            }
            // It is an action, but not a valid one
            else if ( animObj.type )
            {
                console.log( "Invalid command" )
            }
            // It is an animation request
            else
            {
                //change the entity's state for animation
                animObj.entity.changeState( animObj.params )
            }
        }

        // Regardless of state, update each registered entity
        this.dsPool.forEach( ( entity ) =>
        {
            entity.update( dt )
        } );
    }

    /**
     * Draws each registered entity on canvas. It is called on every frame.
     */
    draw()
    {
        // Delegate the call to draw() method of every entity 
        this.dsPool.forEach( ( entity ) =>
        {
            entity.draw()
        } )
    }
}