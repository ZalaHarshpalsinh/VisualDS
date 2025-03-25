import { cnt } from "../../CONSTANTS.js";
import { Entity } from "../Entity.js";
import { vElement, Pointer } from "../index.js";
import {StateMachine} from "../../utils/index.js"
import { IdleState, PropertyChangeState, SwapState } from "./states/index.js";

/**
 * This class represents a visual array.
 * It may be an array of number, string, or even custom objects, as long as they have toString overridden.
 */
export class vArray extends Entity
{
    /**
     * Create vArray object for an array of anything, it may be array of string, number, Student object, or any other array of objects.
     * The only restriction is that the class, whose objects are in the array, should have a toString method
     * that returns what needs to be written in the visualized object in the visualized array.
     * It may be a single line text, or a multiline text. If just passing array of numbers, or strings, then no need to worry about toString
     * since it is there by default in these inbuilt classes.
     * @param {any[]} data The array whose visualization to create
     */
    constructor(data)
    {
        super()

        // here, we need to have two arrays
        // one representing the actual data inside the array, that changes with the synchronous code
        // written by the user
        // another representing the array using which we draw on every frame.
        // this one changes asynchronously
        // now, this concept of keeping two copies is required, 
        // because drwing based on an in memory data structure on every frame
        // this is unlike SVG, where you draw once, and that thing stays on the screen forever, until changes explicitly

        /**
         * This is the actual data inside the array, that changes with the synchronous code
         * written by user.
         */
        this.data = []

        /**
         * This is the copy utilized for drawing on every frame.
         * It changes asynchronously.
         */
        this.drawData = []

        this.boxWidth = 0
        this.boxHeight = 0
        for(let i=0; i<data.length; i++)
        {
            this.data.push(data[i])
            // create the data to be drawn as an array of vElement, since that is how we support drawing anything with a toString overridden.
            this.drawData.push(new vElement(data[i], true))
            this.boxWidth = Math.max(this.boxWidth, this.drawData[i].width)
            this.boxHeight = Math.max(this.boxHeight, this.drawData[i].height)
        }
        this.width = this.length() * this.boxWidth
        this.height = this.boxHeight

        // since properties of Entity are initialized properly, add in pool
        super.addInPool()
        
        let brush = {x:this.x, y:this.y}
        // set the custom coords for each vElement
        for(let i=0; i< this.length(); i++)
        {
            this.drawData[i].setCoordinates(brush.x, brush.y)
            this.drawData[i].width = this.boxWidth
            this.drawData[i].height = this.boxHeight
            brush.x += this.boxWidth
        }

        /**
         * To manage the animation via states
         */
        this.stateMachine = new StateMachine({
            idle: ()=> new IdleState(this),
            property_change: ()=> new PropertyChangeState(this),
            swap: ()=> new SwapState(this),
        }, 'idle');
    }

    update(dt)
    {
        this.stateMachine.update(dt)
    }

    /**
     * To draw boxes for each element, basically just delegates to the draw of each vElement object in drawData
     */
    drawBoxes()
    {
        this.drawData.forEach(e => {
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
        return this.drawData.length;
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

    /**
     * To swap elements at two indices and show animation
     * @param {number} i The first index
     * @param {number} j The second index
     */
    swap(i, j)
    {
        //swap the actual raw data directly
        let tmp = this.data[i]
        this.data[i] = this.data[j]
        this.data[j] = tmp

        // queue an animation to swap elements in drawData
        const toState = "swap";
        const params = {
            i,j
        };

        super.addAnimation(toState, params);
    }

     /**
     * Get a pointer of this array
     * @param {number} initIndex The initial index pointed by the pointer
     * @returns {Pointer}
     */
     getPointer(initIndex)
     {
         const ptr = new Pointer(this, initIndex);
         return ptr;
     }
}