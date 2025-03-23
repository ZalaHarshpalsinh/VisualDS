import { cnt } from "../../CONSTANTS.js";
import { Entity } from "../Entity.js";
import { vElement } from "../index.js";
import {StateMachine} from "../../utils/index.js"
import { IdleState, PropertyChangeState } from "./states/index.js";

export class vArray extends Entity
{
    constructor(data)
    {
        super()

        this.data = []
        this.boxWidth = 0
        this.boxHeight = 0
        for(let i=0; i<data.length; i++)
        {
            this.data.push(new vElement(data[i], true))
            this.boxWidth = Math.max(this.boxWidth, this.data[i].width)
            this.boxHeight = Math.max(this.boxHeight, this.data[i].height)
        }
        this.width = this.length() * this.boxWidth
        this.height = this.boxHeight

        super.addInPool()
        
        let brush = {x:this.x, y:this.y}
        for(let i=0; i< this.length(); i++)
        {
            this.data[i].setCoordinates(brush.x, brush.y)
            this.data[i].width = this.boxWidth
            this.data[i].height = this.boxHeight
            brush.x += this.boxWidth
        }

        this.stateMachine = new StateMachine({
            idle: ()=> new IdleState(this),
            property_change: ()=> new PropertyChangeState(this)
        }, 'idle');
    }

    drawBoxes()
    {
        this.data.forEach(e => {
            e.draw()
        })
    }

    draw()
    {
        this.stateMachine.draw()
    }

    changeState(toState, param)
    {
        this.stateMachine.change(toState, param);
    }

    /**
     * Get array length
     * @returns Length of the contained array
     */
    length()
    {
        return this.data.length;
    }
    
    /**
     * To get value at a given index
     * @param {number} index The index to get value at
     * @returns The value at the given index
     */
    at(index)
    {
        return this.data[index];
    }

    /**
     * Highlight a list of indices
     * @param indices The list of indices
     */
    highlight(indices, color="blue")
    {
        // queue an animation to change colour property
        const toState = "property_change";
        const params = {
                type: "box_color_change",
                indices,
                toColor: color
            };

        super.addAnimation(toState, params);
    }
    
    /**
     * To unhighlight a list of indices
     * @param indices The list
     */
    unhighlight(indices)
    {
        // queue an animation to change colour property
        const toState = "property_change";
        const params = {
                type: "box_color_change",
                indices,
                toColor: cnt.DEFAULT_COLOR
            };

        super.addAnimation(toState, params);
    }
}