import { Entity } from "../Entity.js"
import { ctx } from "../../driver.js"
import { cnt } from "../../CONSTANTS.js"
import { drawRectangle, drawText } from "../../utils/helper.js"

export class vElement extends Entity
{
    constructor(val, customCoordinates=false)
    {
        super()
        this.val = val
        this.calculateDimensions()
        this.customCoordinates  = customCoordinates
        super.addInPool()
        
        this.color = cnt.DEFAULT_COLOR
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

    changeColor(color)
    {
        this.color = color
    }

    draw()
    {
        drawRectangle(this.x, this.y, this.width, this.height, this.color, 'black')
        
        let brushX = this.x 
        let brushY = this.y + cnt.PAD_Y 

        this.text.forEach(line => {
            drawText(line, brushX + this.width/2, brushY+cnt.DEFAULT_LINE_HEIGHT/2, '10px serif' ,'black', 'center', 'middle')
            brushY += cnt.DEFAULT_LINE_HEIGHT
        })
    }
}