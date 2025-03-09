import { Animator } from "./Animator.js"
import { Entity } from "./Entity.js"
import { vArray } from "./vArray.js"
import { Pointer } from "./Pointer.js"
import { vElement } from "./vElement.js"

const animator  = new Animator()

let canvas = null
let context = null

let virtualWidth = 500
let virtualHeight = 500
let actualWidth = 1000
let actualHeight = 1000

/**
 * To initialize the library
 * @param {HTMLCanvasElement} cnv The canvas to draw on
 */
function initialize(cnv)
{
    canvas = cnv
    context = canvas.getContext('2d')
    console.log(canvas.width, canvas.height)
    canvas.width = actualWidth
    canvas.height = actualHeight

    context.font = "20px serif"
    context.imageSmoothingEnabled = false;  // Disables image smoothing for images
    context.scale(actualWidth/virtualWidth, actualHeight/virtualHeight)
}

let lastUpdate = 0

/**
 * Do not call this directly. When you want that your code gets visualized, requestAnimationFrame on this
 * @param {*} time time of call
 */
function render( time )
{
    let dt = ( time - lastUpdate ) / 1000
    lastUpdate = time
    update( dt )
    draw()
    requestAnimationFrame( render )
}

function update( dt )
{
    animator.update(dt)
}

function draw()
{
    context.clearRect(0, 0, actualWidth, actualHeight)
    animator.draw()
}

export {context, virtualWidth, virtualHeight, initialize, render, animator, Entity, vElement, vArray, Pointer}
