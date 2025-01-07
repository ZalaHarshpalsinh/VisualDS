import {Entity} from "./Entity.js"
import { context, animator } from "./demos/array_demo/main.js"

export
class Pointer extends Entity
{
    constructor(pointee, initialIndex)
    {
        super()
        this.pointee = pointee
        this.initialIndex = initialIndex
        animator.add(this)
    }

    draw()
    {
        let myX = this.pointee.x + (this.initialIndex) * this.pointee.boxWidth + this.pointee.boxWidth/2
        let myY = this.pointee.y + this.pointee.boxHeight
        // console.log("Draw pointer", myX, myY)
        context.fillStyle = "#000"
        context.textBaseline = "top";
        context.font = "32 Arial"
        context.fillText("↑", myX, myY)
    }
}