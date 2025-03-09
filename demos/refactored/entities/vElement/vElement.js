import { Entity } from "../Entity.js"
import { ctx } from "../../driver.js"
import { cnt } from "../../CONSTANTS.js"
import { drawRectangle, drawText } from "../../utils/helper.js"

export class vElement extends Entity
{
    constructor(val)
    {
        super()
        this.val = val
        this.calculateDimensions()

        super.addInPool()
    }

    calculateDimensions()
    {
        this.text = this.val.toString().split('\n')
        let maxWidth = 0
        this.text.forEach(line => {
            maxWidth = Math.max(maxWidth, ctx.measureText(line).width)
        });
        this.width = maxWidth + cnt.PAD_X*2
        this.height = this.text.length * cnt.DEFAULT_LINE_HEIGHT + cnt.PAD_Y*2
    }

    draw()
    {
        drawRectangle(this.x, this.y, this.width, this.height, 'CornflowerBlue', 'black')
        
        let brushX = this.x + cnt.PAD_X
        let brushY = this.y + cnt.PAD_Y

        this.text.forEach(line => {
            drawText(line, brushX, brushY, '10px serif' ,'black', 'left', 'top')
            brushY += cnt.DEFAULT_LINE_HEIGHT
        })
    }
}