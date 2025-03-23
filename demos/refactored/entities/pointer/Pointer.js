import { Entity } from "../Entity.js"


export class Pointer extends Entity
{
    constructor(pointee, initialIndex)
    {
        super()
        this.customCoordinates = true
        super.addInPool()

        this.pointee = pointee
        this.index = initialIndex

        this.updateCoords()
    }

    updateCoords()
    {
        this.x = (this.pointee.x) + (this.pointee.boxWidth / 2) + ( this.index  * this.pointee.boxWidth)
        this.y = this.pointee.y + this.pointee.boxHeight;
    }
}