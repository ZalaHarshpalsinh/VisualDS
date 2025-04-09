import { cnt } from "./CONSTANTS.js"
import { Entity } from "./entities/index.js"
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
    constructor( canvas, context )
    {
        /**
         * brush holds the coordinates which new entity will be assigned upon registration through addInPool() method.
         * 
         * Initially coordinates are set to Framework Level Constant values.
         * 
         * @type {{x: number, y:number}}
         */
        this.brush = { x: cnt.START_X, y: cnt.START_Y }

        /**
         * Array of entities registered to animator for management.
         * 
         * This implies : Animator will call update and draw on each of them on every frame.
         * 
         * @type {Entity[]}
         */
        this.dsPool = []

        /**
         * FIFO Queue for storing animation requests for any entity (Registered or unregistered).
         * Animator also stores its actions in this queue which need to be synchronized with animations, i.e. adding a entity
         * 
         * @type {(Animation | Action)[]}
         */
        this.animationQueue = []

        /**
         * A simple variable to keep track of animator's state.
         * 
         * Animator behaves differently in each state.
         * 
         * Initially set to idle state.
         * 
         * @type {string}
         */
        this.state = 'idle'

        /**
         * Variable which controls the speed of animation.
         * 
         * It is a multiplier which will be applied to default speed.
         * 
         * By default, the animation speed is set to 1.0x.
         * 
         * @type {number}
         */
        this.animationSpeed = 1.0

        this.tweenManager = new TweenManager()

        this.canvas = canvas
        this.context = context

        this.scroll = {
            isScrolling: false,
            x: 0,
            y: 0,
            lastX: 0,
            lastY: 0,
        }

        this.zoomLevel = 1.0

        this.configureCanvas()
    }

    /**
     * Configures the canvas as per framework's requirements
     */
    configureCanvas()
    {
        // Set the actual width/height of canvas
        this.canvas.width = cnt.ACTUAL_WIDTH
        this.canvas.height = cnt.ACTUAL_HEIGHT

        this.context.scale( cnt.ACTUAL_WIDTH / cnt.VIRTUAL_WIDTH, cnt.ACTUAL_HEIGHT / cnt.VIRTUAL_HEIGHT )

        //Register event listeners for scroll and zoom
        this.canvas.addEventListener( 'mousedown', ( e ) =>
        {
            e.preventDefault()
            this.scroll.isScrolling = true
            this.scroll.lastX = e.clientX // Remember start position
            this.scroll.lastY = e.clientY
            this.canvas.style.cursor = 'grabbing'
        } )

        this.canvas.addEventListener( 'mousemove', ( e ) =>
        {
            e.preventDefault()
            if ( !this.scroll.isScrolling ) return

            const dx = e.clientX - this.scroll.lastX // How much the mouse moved
            const dy = e.clientY - this.scroll.lastY

            this.scroll.x += dx // Shift the view
            this.scroll.y += dy

            this.scroll.lastX = e.clientX // Update last position
            this.scroll.lastY = e.clientY
        } )

        // 3. Mouse up: Stop panning
        this.canvas.addEventListener( 'mouseup', ( e ) =>
        {
            e.preventDefault()
            this.scroll.isScrolling = false
            this.canvas.style.cursor = 'grab'
        } )

        // Zoom functionality
        this.canvas.addEventListener( 'wheel', ( e ) =>
        {
            e.preventDefault()
            if ( e.deltaY < 0 )
            { // Zoom in
                this.zoomLevel *= 1.1
            } else
            { // Zoom out
                this.zoomLevel /= 1.1
            }

            this.zoomLevel = Math.max( 0.1, Math.min( 5.0, this.zoomLevel ) )
        } )
    }

    getTweenManager()
    {
        return this.tweenManager
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

    setScroll( x, y )
    {
        this.scroll.x = x
        this.scroll.y = y
    }

    setZoom( val )
    {
        this.zoomLevel = Math.max( 0.1, Math.min( 5, val ) )
    }

    /**
     * Performs the compaction of all registered entities.
     * Reassigns the coordinates to each entity, so that empty space left by some removed entity can be reutilized.
     * Entities which has their coordinates change as result of this compaction, will move to their new position with an animation. 
     */
    compactEntities()
    {
        // Put brush as starting point
        this.brush.x = cnt.START_X
        this.brush.y = cnt.START_Y

        // Reassign coordinates to each entity
        this.dsPool.forEach( e =>
        {
            // Get old coordinates
            let oldCoords = e.getCoordinates()

            // To keep track whether it's a first tween or not
            let isFirst = true
            // Compare old coordinates with new ones, to see if there's a change
            if ( oldCoords.x != this.brush.x || oldCoords.y != this.brush.y )
            {
                // if there is a change, tween the coordinates to new values
                this.tweenManager.addTween( e,
                    { x: this.brush.x, y: this.brush.y },
                    300,
                    TweenManager.linear,
                    () =>
                    {
                        // Only first tween should notify animator about completion
                        if ( isFirst )
                            // When all the tweens are completed, notify animator to move to next animation
                            this.nextAnimation()
                    }
                )

                isFirst = false
            }

            /** 
             * Move the brush to next location based on width/height of entity.
             * Margin between entities is a Framework Level Constant.
             */
            this.brush.y += e.height + cnt.MARGIN_Y
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
                this.nextAnimation()
            }
            // It is an action, but not a valid one
            else if ( animObj.type )
            {
                console.log( "Invalid command" )
                this.nextAnimation()
            }
            // It is an animation request
            else
            {
                //change the entity's state for animation
                animObj.entity.notify( animObj.params )
            }
        }

        // Regardless of state, update each registered entity
        this.dsPool.forEach( ( entity ) =>
        {
            entity.update( dt )
        } )

        this.tweenManager.update( dt )
    }

    /**
     * Draws each registered entity on canvas. It is called on every frame.
     */
    draw()
    {
        this.context.save()

        this.context.clearRect( 0, 0, cnt.VIRTUAL_WIDTH, cnt.VIRTUAL_HEIGHT )

        this.context.translate( this.scroll.x, this.scroll.y )
        // Apply scaling to scale the virtual width/height to actual width/height
        this.context.scale( cnt.ACTUAL_WIDTH / cnt.VIRTUAL_WIDTH * this.zoomLevel, cnt.ACTUAL_HEIGHT / cnt.VIRTUAL_HEIGHT * this.zoomLevel )
        // Delegate the call to draw() method of every entity 

        this.dsPool.forEach( ( entity ) =>
        {
            entity.draw( this.context )
        } )

        this.context.restore()
    }
}