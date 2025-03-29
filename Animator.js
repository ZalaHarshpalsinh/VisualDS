import { cnt } from "./CONSTANTS.js";
import { tweenManager } from "./driver.js";
import {TweenManager} from "./utils/index.js";

/**
 * This is the manager class of the whole framework.
 * It has a pool or array of Entity to be drawn on every frame.
 * It also has an animation queue from which it takes up an animation, completes it then moves to the next naimation.
 */
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

        this.animationSpeed = 1.0
    }

    addInPool(entity)
    {
        entity.setCoordinates(this.brushX, this.brushY)
        this.brushY += entity.height + cnt.MARGIN_Y
        this.addAnimation({command: 'add', entity: entity})
    }

    removeFromPool(entity)
    {
        this.addAnimation({command: 'remove', entity: entity})
    }

    /**
     * To queue an animation
     */
    addAnimation(animObj)
    {
        this.animationQueue.push(animObj);
    }

    /**
     * Whenever an animation is finished, this is called by the Entity class
     */
    nextAnimation()
    {
        // don't change to idle directly, allow a delay, to allow the user to observe the changes
        // in other words, once an animation is finished, don't start the nect immediately, allow a delay
        setTimeout(()=>this.state = 'idle', 400 / this.getAnimationSpeed())
    }

    getAnimationSpeed()
    {
        return this.animationSpeed
    }

    setAnimationSpeed(newSpeed)
    {
        this.addAnimation({command: 'change_speed', newSpeed: newSpeed})
    }

    compactEntities()
    {
        this.brushX = cnt.START_X
        this.brushY = cnt.START_Y

        this.dsPool.forEach( e => {
            let oldCoords = e.getCoordinates()
            if(oldCoords.x != this.brushX || oldCoords.y != this.brushY)
            {
                this.state = 'compacting'
                tweenManager.addTween(e,
                    {x: this.brushX, y:this.brushY},
                    300,
                    TweenManager.linear,
                    ()=>{
                        this.nextAnimation()
                    }
                )
            }
            this.brushY += e.height + cnt.MARGIN_Y
        })
    }

    update(dt)
    {   
        if(this.state == 'idle')
            this.compactEntities()

        // in case it is idle, take up the next animation if any
        if(this.state == 'idle')
        {
            // take an element from animation queue
            let animObj = this.animationQueue.shift();

            if(animObj !== undefined)
            {
                if(animObj.command)
                {
                    this.state = 'command'

                    switch(animObj.command)
                    {
                        case "add":
                            this.dsPool.push(animObj.entity)
                            break
                        case "remove":
                            animObj.entity.cleanUp()
                            this.dsPool.splice( this.dsPool.indexOf(animObj.entity), 1)
                            break
                        case "change_speed":
                            this.animationSpeed = animObj.newSpeed
                        default:
                            console.log("Invalid command")
                            break
                    }

                    this.nextAnimation()
                }
                else
                {
                    //change the entity's state for animation
                    animObj.entity.changeState(animObj.toState, animObj.params);
                    this.state = 'animating'
                }
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
        this.dsPool.forEach((entity)=>{
            entity.draw()
        })
    }
}