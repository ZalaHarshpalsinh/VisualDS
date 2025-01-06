import { Animator } from "../../Animator.js"
import { Entity } from "../../Entity.js"
import { vArray } from "../../vArray.js"

const animator  = new Animator()

let canvas = null
let context = null

let actualWidth = 0
let actualHeight = 0

/**
 * To initialize the library
 * @param {HTMLCanvasElement} cnv The canvas to draw on
 */
function initialize(cnv)
{
    canvas = cnv
    context = canvas.getContext('2d')
    actualWidth = canvas.width 
    actualHeight = canvas.height 
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

export {context, initialize, render, animator, Entity, vArray}
