import { Animator } from "./Animator.js"
import { cnt } from "./CONSTANTS.js"

let cnv = null
let ctx = null
let animator = new Animator()

function createVisualisation(cnvId, userScript)
{
    cnv = document.getElementById(cnvId)
    ctx = cnv.getContext('2d')

    initialize()

    userScript()

    requestAnimationFrame( render )
}

function initialize()
{
    cnv.width = cnt.ACTUAL_WIDTH
    cnv.height = cnt.ACTUAL_HEIGHT
    ctx.scale(cnt.ACTUAL_WIDTH/cnt.VIRTUAL_WIDTH, cnt.ACTUAL_HEIGHT/cnt.VIRTUAL_HEIGHT)
}

let lastUpdate = 0
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
}

function draw()
{
    ctx.clearRect(0,0,cnv.width,cnv.height)
    animator.draw()
}

export {ctx, animator, createVisualisation}