import { cnt } from "../../../CONSTANTS.js"
import { tweenManager } from "../../../driver.js"
import { BaseState, TweenManager } from "../../../utils/index.js"
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
        this.spawnDistance = 400
    }

    enter(enterPara)
    {
        let {val} = enterPara
        
        //create new vElement and push it in drawData
        this.varray.drawData.push(new vElement(val, true))
        // update boxWidth, boxHeight, Width, Height
        this.varray.syncDimensions()
        // update the coordinates of each box
        this.varray.syncCoordinates()

        //get ref to newly created box
        let newBox = this.varray.drawData[this.varray.drawData.length-1]
        //save the assigned coordinates of new box as target
        let target = newBox.getCoordinates()
        
        //move new box to spawn point for animation
        let spawnPoint = {x: this.varray.x+this.varray.width-this.varray.boxWidth+this.spawnDistance , y: this.varray.y}
        newBox.setCoordinates(spawnPoint.x, spawnPoint.y)

        tweenManager.addTween( newBox,
            {x: target.x},
            500,
            TweenManager.linear,
            ()=>{
                //move to next animation if reached target
                this.varray.changeState('idle')
                this.varray.nextAnimation()
            }
        )
    }
}