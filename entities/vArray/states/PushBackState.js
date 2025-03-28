import { cnt } from "../../../CONSTANTS.js"
import { BaseState } from "../../../utils/index.js"
import { vElement } from "../../index.js"

/**
 * Represents the state where a new value is pushed at the back of the array
 */
export class PushBackState extends BaseState
{
    constructor(varray)
    {
        super()
        this.varray = varray
        this.spawnDistance = 50
    }

    enter(enterPara)
    {
        let {val} = enterPara
        console.log(val)
        //create new vElement and push it in drawData
        this.varray.drawData.push(new vElement(val, true))

        // update boxWidth, boxHeight, Width, Height
        this.varray.syncDimensions()
        // update the coordinates of each box
        this.varray.syncCoordinates()

        //get ref to newly created box
        this.newBox = this.varray.drawData[this.varray.drawData.length-1]
        //save the assigned coordinates of new box as target
        this.target = this.newBox.getCoordinates()
        
        //move new box to spawn point for animation
        let spawnPoint = {x: this.varray.x+this.varray.width-this.varray.boxWidth+this.spawnDistance , y: this.varray.y}
        this.newBox.setCoordinates(spawnPoint.x, spawnPoint.y)
    }

    update(dt)
    {
        //if not reached target
        if(this.newBox.x != this.target.x)
        {
            //move towards target position
            this.newBox.x = Math.max(this.target.x, this.newBox.x - 100*dt)
        }
        else
        {
            //move to next animation if reached target
            this.varray.changeState('idle')
            this.varray.nextAnimation()
        }
    }
}