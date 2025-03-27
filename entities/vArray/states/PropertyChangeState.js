import { BaseState } from "../../../utils/index.js"

/**
 * Represents the state where a property of the vArray is changing
 * such as colour of a box
 */
export class PropertyChangeState extends BaseState
{
    constructor(varray)
    {
        super();
        this.varray = varray;
    }

    enter(enterPara)
    {
        this.data = enterPara;
        if(this.data.type=="box_color_change")
        {
            // change color of boxes
            this.data.indices.forEach((index)=>
            {
                if(index < this.varray.drawData.length)
                {
                    this.varray.drawData[index].changeColor(this.data.toColor)
                }
            });
        }
    
        // done, so exit the state
        this.varray.changeState('idle');
        
        this.varray.nextAnimation()
    }
}