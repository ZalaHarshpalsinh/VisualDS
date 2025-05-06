import { Animator } from "./Animator.js"
import { Entity } from "./entities/Entity.js"
import { TweenManager } from "./utils/index.js"

/**
 * Array of animator objects. Each animator object is responsible for a single canvas.
 * @type {Animator[]}
 */
let animators = []

/**
 * Get the ID of the current animator.
 * @returns {number} The ID of the current animator. This is the index of the animator in the animators array.
 */
function getCurrentAnimatorId()
{
    return animators.length - 1
}

/**
 * Creates a new visualisation by creating a new animator object and executing the user given code.
 * 
 * The user given code is expected to be a function which takes a controller object as an argument. The controller object contains methods to control the animation speed and other properties of the animator.
 * 
 * Exposes the whole framework to the user.
 * @param {string} cnvId The ID of the canvas element in the DOM. This canvas will be used to draw on.
 * @param {function} userScript The callback containing code to be visualized.
 */
function createVisualisation( cnvId, userScript )
{
    /**
     * A reference of canvas on which everything will be drawn
     * @type {HTMLCanvasElement}
     */
    const cnv = document.getElementById( cnvId )

    /**
     * A reference of 2D context of canvas
     * @type { CanvasRenderingContext2D }
    */
    const ctx = cnv.getContext( '2d' )

    // create new animator object and push it to the animators array
    // this animator will be responsible for the given canvas
    let animator = new Animator( cnv, ctx )
    animators.push( animator )

    /** controller object which will be passed to the user given code to control the animation speed and other properties of the animator
    * @type {{setAnimationSpeed: function(newSpeed): void}}
    */
    let controller = {
        setAnimationSpeed: ( newSpeed ) => animator.setAnimationSpeed( newSpeed )
    }

    // execute user given code (which we call the synchronous code given by user)
    // this will fill up the whole animation queue through different operations, provided by entities and used by user in the code
    userScript( controller )

    // check if it is the first animator object created
    // if yes, then kick start the visualization by requesting the first execution of render on next frame (Kick start the animation loop)
    if ( getCurrentAnimatorId() == 0 )
        // start the visualization by requesting execution of render on next frame
        requestAnimationFrame( render )
}

/**
 * timestamp of last render
 * @type {number}
*/
let lastUpdate = 0


/**
 * Render a single frame. Called on every frame.
 * @param {number} time timestamp of current frame
*/
function render( time )
{
    // Calculate delta time (time elapsed since last render)
    let dt = ( time - lastUpdate ) / 1000

    // Update lastUpdate 
    lastUpdate = time

    // Call update function by passing dt
    update( dt )

    // Call the draw function
    draw()

    // Again request the execution of render on next frame
    requestAnimationFrame( render )
}

/**
 * Updates all the animators by calling their update method.
 * @param {number} dt Delta time: time elapsed since last render
 */
function update( dt )
{
    animators.forEach( a => a.update( dt ) )
}

/**
 * Draws the next frame on every canvas by calling the draw method of each animator.
*/
function draw()
{
    animators.forEach( a => a.draw() )
}

/**
 * Gives the current animation speed.
 * @returns {number} current animation speed (A value multiplied with default speed)
 */
function getAnimationSpeed( animatorId )
{
    return animators[ animatorId ].getAnimationSpeed()
}

/**
 * Sets a new animation speed for the specified animator. All animations after this call will execute at new speed.
 * @param {number} animatorId ID of the animator for which to set the animation speed.
 * @param {number} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
 */
function setAnimationSpeed( animatorId, newSpeed )
{
    // set the new animation speed for the specified animator
    animators[ animatorId ].setAnimationSpeed( newSpeed )
}


/**
 * Registers an entity to the specified animator. The entity will be added to the pool of entities which will be updated and drawn on every frame.
 * @param {number} animatorId ID of the animator to which the entity should be registered.
 * @param {Entity} entity entity to be registered.
 */
function addInPool( animatorId, entity )
{
    animators[ animatorId ].addInPool( entity )
}

/**
 * Removes an entity from the specified animator's pool. The entity will no longer be updated or drawn on every frame.
 * @param {number} animatorId Id of the animator from which the entity should be removed.
 * @param {Entity} entity entity to be removed.
 */
function removeFromPool( animatorId, entity )
{
    animators[ animatorId ].removeFromPool( entity )
}

/**
 * Registers an animation to the specified animator. The animation will be added to the queue of animations which will be executed one by one
 * @param {number} animatorId ID of the animator to which the animation should be registered.
 * @param {Animation} animObj Animation object to be registered.
 */
function addAnimation( animatorId, animObj )
{
    animators[ animatorId ].addAnimation( animObj )
}

/**
 * Moves to the next animation in the queue of the specified animator. This should be called by the entity at the end of every animation, if it is not, next animations in the animator's queue will not execute.
 * @param {number} animatorId ID of the animator for which to move to the next animation.
 */
function nextAnimation( animatorId )
{
    animators[ animatorId ].nextAnimation()
}

/**
 * Get the tween manager of the specified animator.
 * @param {Number} animatorId ID of the animator for which to get the tween manager.
 * @returns {TweenManager} tween manager of the specified animator.
 */
function getTweenManager( animatorId )
{
    return animators[ animatorId ].getTweenManager()
}

export
{
    createVisualisation,
    getCurrentAnimatorId,
    getAnimationSpeed,
    setAnimationSpeed,
    addInPool,
    removeFromPool,
    addAnimation,
    nextAnimation,
    getTweenManager,
}