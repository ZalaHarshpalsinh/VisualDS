import { cnt } from "./CONSTANTS.js"
import { Entity } from "./entities/index.js"
import { TweenManager } from "./utils/index.js"
import { Animation } from "./Animation.js"
import { Action } from "./Action.js"

/**
 * This is the manager class of the whole framework.
 * 
 * It has a pool or array of Entity to be drawn on every frame.
 * It calls update() and draw() on every entity in its pool on every frame.
 * 
 * It also has an animation queue from which it takes up an one animation/action at a time, completes it then moves to the next anaimation/action.
 * These animation objects are registered by entities during the execution of their operations in the user script.
 */
export class Animator 
{
    /**
     * 
     * @param {HTMLCanvasElement} canvas The canvas element on which this animator will perform the visualisation
     * @param {CanvasRenderingContext2D} context The 2D context object of the same canvas 
     */
    constructor( canvas, context )
    {
        /**
         * brush holds the coordinates which new entity will be assigned upon registration through addInPool() method.
         * 
         * Initially coordinates are set to Framework Level Constant values START_X and START_Y
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
         * FIFO Queue for storing animation requests from any entity (Registered or unregistered in dsPool  ).
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
         * idle : pop an animation from animationQueue and notify the corresponding entity and move to animating state 
         * 
         * animating : wait for the entity to complete its animation, when nextAnimation() is called by entity to report about completion of animation move to idle state.  
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

        /**
         * An TweenManager instance which will be provided to entities via getTweenManager() method, to register and handle tweens.
         * 
         * Use of TweenManager simplifies the animation logic inside entities and is recommended to be used for simple animations.
         * @type {TweenManager}
         */
        this.tweenManager = new TweenManager()

        /**
         * The canvas element on which this animator will perform the visualisation
         * @type {HTMLCanvasElement}
         */
        this.canvas = canvas

        /**
         * The 2D context object of the same canvas 
         * @type {CanvasRenderingContext2D}
         */
        this.context = context

        /**
         * An object to store the scrolling mechanism related information.
         * @type {{isScrolling: boolean, x: number, y: number, lastX: number, lastY: number}}
         */
        this.scroll = {
            isScrolling: false,
            x: 0,
            y: 0,
            lastX: 0,
            lastY: 0,
        }

        /**
         * Current Zoom intensity of the canvas. It is used to implement zoom in and out features on canvas through scaling during draw() call.
         * 
         * Default value is 1.0
         * @type {number}
         */
        this.zoomLevel = 1.0

        /**
         * configure the received canvas
         */
        this.configureCanvas()
    }

    /**
     * Configures the canvas as per framework's requirements
     */
    configureCanvas()
    {
        // Set the actual width/height of canvas (number of pixels in canvas and not the css width and height properties)
        this.canvas.width = cnt.ACTUAL_WIDTH
        this.canvas.height = cnt.ACTUAL_HEIGHT

        // set the default scale (this is necessary for properly clearing the canvas on every frame regardless of zoom level)
        this.context.scale( cnt.ACTUAL_WIDTH / cnt.VIRTUAL_WIDTH, cnt.ACTUAL_HEIGHT / cnt.VIRTUAL_HEIGHT )

        //Register event listeners for scroll and zoom

        //listener for scroll start
        this.canvas.addEventListener( 'mousedown', ( e ) =>
        {
            //prevent default behaviour
            e.preventDefault()
            //start the scroll
            this.scroll.isScrolling = true
            //record the scroll start position
            this.scroll.lastX = e.clientX
            this.scroll.lastY = e.clientY
            //update the cursor look
            this.canvas.style.cursor = 'grabbing'
        } )

        //listener to actually handle scroll
        this.canvas.addEventListener( 'mousemove', ( e ) =>
        {
            //prevent default behaviour
            e.preventDefault()

            //verify we are in a scroll
            if ( !this.scroll.isScrolling ) return

            // Calculate how much the mouse moved
            const dx = e.clientX - this.scroll.lastX
            const dy = e.clientY - this.scroll.lastY

            // Shift the view by the delta values on both axis
            this.scroll.x += dx
            this.scroll.y += dy

            // Update the last position
            this.scroll.lastX = e.clientX
            this.scroll.lastY = e.clientY
        } )

        // listener for scroll end
        this.canvas.addEventListener( 'mouseup', ( e ) =>
        {
            // prevent default behaviour
            e.preventDefault()
            // end the scroll
            this.scroll.isScrolling = false
            // update cursor look
            this.canvas.style.cursor = 'grab'
        } )

        // listener to handle zoom in and zoom out
        this.canvas.addEventListener( 'wheel', ( e ) =>
        {
            //prevent default behaviour
            e.preventDefault()

            // mouse wheel scrolled up
            if ( e.deltaY < 0 )
            {
                // Zoom in
                this.zoomLevel *= 1.1
            }
            // mouse wheel scrolled down
            else
            { // Zoom out
                this.zoomLevel /= 1.1
            }

            // Cap the zoom level between 0.1 and 5.0
            this.zoomLevel = Math.max( 0.1, Math.min( 5.0, this.zoomLevel ) )
        } )
    }

    /**
     * Gets the TweenManager instance.
     * 
     * To be used by entities to get tewenManager instance for registering tweens to perform simple animations. 
     * @returns {TweenManager} tweenManager instance
     */
    getTweenManager()
    {
        return this.tweenManager
    }

    /**
     * Registers an Entity to animator for management.
     * 
     * To be used by entities to register themselves to animator.
     * @param {Entity} entity Entity to be registered
     */
    addInPool( entity )
    {
        /** 
         * Queue the action of actually adding the entity in dsPool, so that it will only be added after all animations registered uptil now would have been completed.
         * Think of registration of new entity as an animation.
         */
        this.addAnimation( new Action( 'add', { entity: entity } ) )
    }

    /**
     * Removes an Entity from the pool of entities managed by animator.
     * 
     * To be used by entities to remove themselves from animator and as a effect from the canvas.
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
     * If it is an animation, animator will notify the requesting entity when this animation's turn come, by calling notify() method on that entity
     * and it will also pass the params object back to entity, which was provided at time of animation registration.
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
     * @param {number} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
     */
    setAnimationSpeed( newSpeed )
    {
        this.addAnimation( new Action( 'change_speed', { newSpeed: newSpeed } ) )
    }

    /**
     * Scrolls the canvas to a new position.
     * @param {number} x scroll destination's x coordinate
     * @param {number} y scroll destination's y coordinate 
     */
    setScroll( x, y )
    {
        this.scroll.x = x
        this.scroll.y = y
    }

    /**
     * Sets the zoom level of the canvas.
     * @param {number} val zoom level to be set. A value between 0.1 and 5.0 
     */
    setZoom( val )
    {
        this.zoomLevel = Math.max( 0.1, Math.min( 5, val ) )
    }

    /**
     * Performs the compaction on all registered entities.
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
             * Margin between entities is a Framework Level Constant MARGIN_Y
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
     * @param {number} dt Delta time : The time elapsed since last frame. It is used to update the animator and entities in a time based manner.
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

        // Update the tween manager to perform all the tweens registered uptil now
        // This will also call the callback function of each tween when it is completed
        this.tweenManager.update( dt )
    }

    /**
     * Draws each registered entity on canvas. It is called on every frame.
     */
    draw()
    {
        // save the current state of the context
        this.context.save()

        // Clear the canvas
        this.context.clearRect( 0, 0, cnt.VIRTUAL_WIDTH, cnt.VIRTUAL_HEIGHT )

        // Apply scrolling to the canvas
        this.context.translate( this.scroll.x, this.scroll.y )

        // Apply scaling to scale the virtual width/height to actual width/height as well as zoom level
        this.context.scale( cnt.ACTUAL_WIDTH / cnt.VIRTUAL_WIDTH * this.zoomLevel, cnt.ACTUAL_HEIGHT / cnt.VIRTUAL_HEIGHT * this.zoomLevel )

        // Delegate the call to draw() method of every entity in dsPool
        this.dsPool.forEach( ( entity ) =>
        {
            entity.draw( this.context )
        } )

        // restore the context to its original state
        this.context.restore()
    }
}