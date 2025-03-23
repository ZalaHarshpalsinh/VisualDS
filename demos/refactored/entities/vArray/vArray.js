import { Entity } from "../Entity.js";
import { vElement } from "../index.js";


export class vArray extends Entity
{
    constructor(data)
    {
        super()

        this.data = []
        this.boxWidth = 0
        this.boxHeight = 0

        for(let i=0; i<data.length; i++)
        {
            this.data.push(new vElement(data[i], true))
            this.boxWidth = Math.max(this.boxWidth, this.data[i].width)
            this.boxHeight = Math.max(this.boxHeight, this.data[i].height)
        }
        this.width = this.data.length * this.boxWidth
        this.height = this.boxHeight

        super.addInPool()
        
        let brush = {x:this.x, y:this.y}
        for(let i=0; i<this.data.length; i++)
        {
            this.data[i].setCoordinates(brush.x, brush.y)
            this.data[i].width = this.boxWidth
            this.data[i].height = this.boxHeight
            brush.x += this.boxWidth
        }
    }

    draw()
    {
        this.data.forEach(e => {
            e.draw()
        })
    }
}