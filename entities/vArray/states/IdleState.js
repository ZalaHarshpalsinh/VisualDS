import { BaseState } from "../../../utils/index.js"

/**
 * Represents the idle state of vArray
 */
export class IdleState extends BaseState
{
    constructor(varray)
    {
        super()
        this.varray = varray
    }

    update(dt)
    {
        //update each box
        this.varray.updateBoxes(dt)
        //update each pointer
        this.varray.updatePointers(dt)
        // update boxWidth, boxHeight, Width, Height incase any box's value changed
        this.varray.syncDimensions()
        // similarly update the coordinates of each box
        this.varray.syncCoordinates()
    }
}