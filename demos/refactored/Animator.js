import { cnt } from "./CONSTANTS.js";
import { drawRectangle, drawText } from "./utils/helper.js";

export 
class Animator 
{
    constructor()
    {
        this.brushX = cnt.START_X
        this.brushY = cnt.START_Y
        this.dsPool = []
        this.animationQueue = []

        this.state = 'idle'
    }

    addInPool(entity)
    {
        if(! entity.customCoordinates)
        {
            console.log(entity)
            entity.setCoordinates(this.brushX, this.brushY)
            this.brushY += entity.height + cnt.MARGIN_Y
        }
        this.dsPool.push(entity)
    }

    
    /**
     * To queue an animation
     */
    addAnimation(animObj)
    {
        // console.log(animObj)
        this.animationQueue.push(animObj);
    }

    /**
     * Whenever an animation is finished, this is called by the Entity class
     */
    nextAnimation()
    {
        setTimeout(()=>this.state='idle', 1000)
    }

    drawHeader()
    {
        drawRectangle(0,0,cnt.VIRTUAL_WIDTH, 50, 'DarkSlateGrey', 'red')
        drawText("Data Structure Visualizer", cnt.VIRTUAL_WIDTH/2, 25,"bold 32px serif", 'white', 'center', 'middle')
    }

    update(dt)
    {
        if(this.state == 'idle')
        {
            // take an element from animation queue
            let animObj = this.animationQueue.shift();

            if(animObj !== undefined)
            {
                //change the entity's state for animation
                animObj.entity.changeState(animObj.toState, animObj.params);

                this.state = 'animating'
            }
        }
        
        this.dsPool.forEach((entity)=>{
            entity.update(dt)
        });
    }
 
    /**
     * The actual method responsible for calling draw on every element in the pool. This method is called on every frame
     */
    draw()
    {
        this.drawHeader()
        this.dsPool.forEach((entity)=>{
            entity.draw()
        })
    }
}