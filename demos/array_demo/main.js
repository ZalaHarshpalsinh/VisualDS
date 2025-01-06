import { Animator } from "../../Animator.js"
import { Entity } from "../../Entity.js"
import { vArray } from "../../vArray.js"

const animator  = new Animator()

let canvas = null
let context = null

let actualWidth = 0
let actualHeight = 0

function initialize(cnv)
{
    canvas = cnv
    context = canvas.getContext('2d')
    actualWidth = canvas.width 
    actualHeight = canvas.height 
}

let lastUpdate = 0

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
