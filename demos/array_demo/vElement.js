import { Entity, context } from "./main.js";

export class vElement extends Entity
{
    constructor(val)
    {
        super()
        this.val = val
        this.calculateDimensions()
        super.add()
    }

    calculateDimensions()
    {
        this.text = this.val.toString()
        this.width = context.measureText(this.text).width + 10
        this.height = 30
    }

    draw()
    {
        context.fillStyle = "#87CEEB";
        context.fillRect(this.x, this.y, this.width, this.height);

        // Draw the border
        context.strokeStyle = "#000";
        context.strokeRect(this.x, this.y, this.width, this.height);

        // Draw the value
        context.fillStyle = "#000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
}