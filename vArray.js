import {Entity} from "./Entity.js"
import { context, animator } from "./demos/array_demo/main.js"

export class vArray extends Entity
{
    constructor(data)
    {
        super()
        this.data = data
        this.boxWidth = 30
        this.boxHeight = 30

        this.width = data.length * this.boxWidth
        this.height = this.boxHeight
        animator.add(this)
    }

    push(val)
    {
        sleep(1000)
        this.data.push(val)
    }

    update(dt){}

    draw()
    {
        console.log("Array draw")
        let brushX = this.x;
        let brushY = this.y

        for(let i in this.data)
        {
            // console.log(context)
            context.fillStyle = "#87CEEB";
            context.fillRect(brushX, brushY, this.boxWidth, this.boxHeight);

            // Draw the border
            context.strokeStyle = "#000";
            context.strokeRect(brushX, brushY, this.boxWidth, this.boxHeight);

            // Draw the value
            context.fillStyle = "#000";
            context.font = "16 Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(this.data[i], brushX + this.boxWidth / 2, brushY + this.boxHeight / 2);

            brushX += this.boxWidth
        }
    }
}