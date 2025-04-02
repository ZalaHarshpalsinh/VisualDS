import { TweenManager } from './utils/index.js'
import { Animator } from "./Animator.js"
import { cnt } from "./CONSTANTS.js"

/**
 * A reference of canvas on which everything will be drawn
 * @type {HTMLElement}
 */
let cnv = null
/**
 * A reference of 2D context of canvas
 * @type { CanvasRenderingContext2D }
 */
let ctx = null
/**
 * Instance of Animator 
 * @type {Animator}
 */
let animator = null
/**
 * Instance of TweenManager 
 * @type {TweenManager}
 */
let tweenManager = null

/**
 * Exposes the whole framework to the user, user here meaning one who uses our classes such as vArray to draw and visualize DS and algo.
 * @param {string} cnvId The ID of the canvas element in the DOM. This canvas will be used to draw on.
 * @param {function} userScript The callback containing code to be visualized.
 */
function createVisualisation( cnvId, userScript )
{
    // get the canvas
    cnv = document.getElementById( cnvId )
    // get the 2D context
    ctx = cnv.getContext( '2d' )

    // create new animator and tweenManager
    animator = new Animator()
    tweenManager = new TweenManager()

    // initialize the canvas
    initialize()

    // execute user given code (which we call the synchronous code given by user)
    // this will fill up the whole animation queue
    userScript()

    // start the visualization by requesting execution of render on next frame
    requestAnimationFrame( render )
}

/**
 * Configures the canvas as per framework's requirements
 */
function initialize()
{
    // Set the actual width/height of canvas
    cnv.width = cnt.ACTUAL_WIDTH
    cnv.height = cnt.ACTUAL_HEIGHT

    // Apply scaling to scale the virtual width/height to actual width/height
    ctx.scale( cnt.ACTUAL_WIDTH / cnt.VIRTUAL_WIDTH, cnt.ACTUAL_HEIGHT / cnt.VIRTUAL_HEIGHT )
}

/**
 * Gives the current animation speed.
 * @returns {number} current animation speed (A value multiplied with default speed)
 */
function getAnimationSpeed()
{
    return animator.getAnimationSpeed()
}

/**
 * Sets a new animation speed. All animations after this call will execute at new speed.
 * @param {*} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
 */
function setAnimationSpeed( newSpeed )
{
    animator.setAnimationSpeed( newSpeed )
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
    animator.update( dt )
    tweenManager.update( dt )
}

/**
 * Draws the next frame after clearing the canvas first
 */
function draw()
{
    // Clear the canvas
    ctx.clearRect( 0, 0, cnv.width, cnv.height )
    // Draw the next frame
    animator.draw()
}

export
{
    createVisualisation,
    getAnimationSpeed,
    setAnimationSpeed,
    ctx,
    animator,
    tweenManager
}