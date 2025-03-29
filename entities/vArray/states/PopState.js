import { tweenManager } from "../../../driver.js"
import { BaseState, TweenManager } from "../../../utils/index.js"

/**
 * Represents the state where a value is poped from the array
 */
export class PopState extends BaseState
{
    constructor(varray)
    {
        super()
        this.varray = varray
        this.killDistance = 400
    }

    enter(enterPara)
    {
        let {type} = enterPara
        
        //get the popped box
        let box = this.varray.drawData[type=='front' ? 0 : this.varray.drawData.length-1]

        //decide kill site
        let targetX = box.x + (type == 'front' ? -this.killDistance : +this.killDistance)

        //move the box to kill site
        tweenManager.addTween( box,
            {x: targetX},
            500,
            TweenManager.cubicIn,
            ()=>{
                //removed the popped box from drawData
                if(type == 'front')
                    this.varray.drawData.shift()
                else
                    this.varray.drawData.pop()
                
                //move to next animation
                this.varray.changeState('idle')
                this.varray.nextAnimation()
            }
        )
    }
}