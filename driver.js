import { Animator } from "./Animator.js"

let animators = []

function getCurrentAnimatorId()
{
    return animators.length - 1
}

/**
 * Exposes the whole framework to the user, user here meaning one who uses our classes such as vArray to draw and visualize DS and algo.
 * @param {string} cnvId The ID of the canvas element in the DOM. This canvas will be used to draw on.
 * @param {function} userScript The callback containing code to be visualized.
 */
function createVisualisation( cnvId, userScript )
{
    /**
     * A reference of canvas on which everything will be drawn
     * @type {HTMLElement}
     */
    const cnv = document.getElementById( cnvId )
    /**
     * A reference of 2D context of canvas
     * @type { CanvasRenderingContext2D }
    */
    const ctx = cnv.getContext( '2d' )

    // create new animator and tweenManager
    let animator = new Animator( cnv, ctx )
    animators.push( animator )

    // execute user given code (which we call the synchronous code given by user)
    // this will fill up the whole animation queue
    let controller = {
        setAnimationSpeed: ( newSpeed ) => animator.setAnimationSpeed( newSpeed )
    }

    userScript( controller )

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
 * Updates the animator and tweenManager
 * @param {number} dt Delta time: time elapsed since last render
 */
function update( dt )
{
    animators.forEach( a => a.update( dt ) )
}

/**
 * Draws the next frame after clearing the canvas first
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
 * Sets a new animation speed. All animations after this call will execute at new speed.
 * @param {*} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
 */
function setAnimationSpeed( animatorId, newSpeed )
{
    animators[ animatorId ].setAnimationSpeed( newSpeed )
}

function addInPool( animatorId, entity )
{
    animators[ animatorId ].addInPool( entity )
}

function removeFromPool( animatorId, entity )
{
    animators[ animatorId ].removeFromPool( entity )
}

function addAnimation( animatorId, animObj )
{
    animators[ animatorId ].addAnimation( animObj )
}

function nextAnimation( animatorId )
{
    animators[ animatorId ].nextAnimation()
}

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