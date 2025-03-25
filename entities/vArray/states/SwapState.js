import { BaseState } from "../../../utils/index.js"

/**
 * Represents the state where two elements are to be swapped in the vArray obj
 */
export class SwapState extends BaseState
{
    constructor(varray)
    {
        super()
        this.varray = varray
    }

    enter(enterPara)
    {
        let {i, j} = enterPara
        
        // swap references
        let tmp = this.varray.drawData[i]
        this.varray.drawData[i] = this.varray.drawData[j]
        this.varray.drawData[j] = tmp

        //swap coordinates
        tmp = this.varray.drawData[i].getCoordinates()
        this.varray.drawData[i].setCoordinates(this.varray.drawData[j].getCoordinates().x, this.varray.drawData[j].getCoordinates().y)
        this.varray.drawData[j].setCoordinates(tmp.x, tmp.y)

        //move to next animation
        this.varray.changeState('idle')
        this.varray.nextAnimation()
    }
}