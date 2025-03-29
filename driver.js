import {vArray, vElement, Pointer, Entity} from './entities/index.js'
import {drawRectangle, drawText, BaseState, StateMachine, TweenManager} from './utils/index.js'
import { Animator } from "./Animator.js"
import { cnt } from "./CONSTANTS.js"

let cnv = null
let ctx = null
let animator = null
let tweenManager = null

/**
 * This is the function that exposes the whole framework to the user, user here meaning one who uses our classes such as vArray to draw and visualize DS and algo.
 * @param {string} cnvId The ID of the canvas in the DOM, this canvas will be used to draw on.
 * @param {Function} userScript The callback given by user containing all the actual visualization code.
 */
function createVisualisation(cnvId, userScript)
{
    // get the canvas
    cnv = document.getElementById(cnvId)
    ctx = cnv.getContext('2d')

    animator = new Animator()
    tweenManager = new TweenManager()

    // initialize the canvas
    initialize()

    // execute user given code (which we call the synchronous code given by user)
    userScript()

    // start the visualization
    requestAnimationFrame( render )
}

function initialize()
{
    cnv.width = cnt.ACTUAL_WIDTH
    cnv.height = cnt.ACTUAL_HEIGHT
    ctx.scale(cnt.ACTUAL_WIDTH/cnt.VIRTUAL_WIDTH, cnt.ACTUAL_HEIGHT/cnt.VIRTUAL_HEIGHT)
}

function getAnimationSpeed()
{
    return animator.getAnimationSpeed()
}

function setAnimationSpeed(newSpeed)
{
    animator.setAnimationSpeed(newSpeed)
}

let lastUpdate = 0

// this method is called on every frame, this should not be called by user directly
function render( time )
{
    let dt = (time - lastUpdate) / 1000
    lastUpdate = time
    update(dt)
    draw()
    requestAnimationFrame(render)
}

function update(dt)
{
    animator.update(dt)
    tweenManager.update(dt)
}

function draw()
{
    ctx.clearRect(0,0,cnv.width,cnv.height)
    animator.draw()
}

export {
    createVisualisation,
    getAnimationSpeed,
    setAnimationSpeed,
    ctx,
    animator,
    tweenManager
}