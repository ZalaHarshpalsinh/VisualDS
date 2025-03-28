import { BaseState } from "../../../utils/index.js"

/**
 * Represents the state where a property of the vElement is changing
 * such as colour of a box
 */
export class PropertyChangeState extends BaseState
{
    constructor(velement)
    {
        super();
        this.velement = velement;
    }

    enter(enterPara)
    {
        this.data = enterPara;

        if(this.data.type=="box_color_change")
        {
            this.velement.color = this.data.color
        }
        else if(this.data.type == "value_update")
        {
            this.velement.drawVal = this.data.newVal
            this.velement.syncDataAndVisual()
        }
    
        // done, so exit the state
        this.velement.changeState('idle');
        this.velement.nextAnimation()
    }
}