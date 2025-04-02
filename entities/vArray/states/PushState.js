import { tweenManager } from "../../../driver.js"
import { BaseState, TweenManager } from "../../../utils/index.js"
import { vElement } from "../../index.js"

/**
 * Represents the state where a new value is pushed in the array
 */
export class PushState extends BaseState
{
    constructor( varray )
    {
        super()
        this.varray = varray
        this.spawnDistance = 400
    }

    enter( enterPara )
    {
        let { type, val } = enterPara

        //create new vElement and push it in drawData
        let indexLabel = `[${this.varray.drawData.length}]`
        if ( type == 'front' )
            this.varray.drawData.unshift( new vElement( val, indexLabel, true ) )
        else
            this.varray.drawData.push( new vElement( val, indexLabel, true ) )

        // update boxWidth, boxHeight, Width, Height
        this.varray.syncDimensions()
        // update the coordinates of each box
        this.varray.syncCoordinates()

        //save the assigned coordinates of new box as target
        let newBox = this.varray.drawData[ type == 'front' ? 0 : this.varray.drawData.length - 1 ]
        let target = newBox.getCoordinates()

        //move new box to spawn point for animation
        let spawnPoint = 0
        if ( type == 'front' )
            spawnPoint = { x: this.varray.x - this.varray.boxWidth - this.spawnDistance, y: this.varray.y }
        else
            spawnPoint = { x: this.varray.x + this.varray.width - this.varray.boxWidth + this.spawnDistance, y: this.varray.y }
        newBox.setCoordinates( spawnPoint.x, spawnPoint.y )

        tweenManager.addTween( newBox,
            { x: target.x },
            500,
            TweenManager.cubicOut,
            () =>
            {
                //move to next animation if reached target
                this.varray.changeState( 'idle' )
                this.varray.nextAnimation()
            }
        )
    }
}