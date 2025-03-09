import { AnimatingState } from "./AnimatingState.js";
import { IdleState } from "./IdleState.js";
import { context, virtualWidth } from "./main.js";
import { StateMachine } from "./StateMachine.js";

/**
 * An Animator object is the one that actually has the pool of all the drawable entities. Call add() to add more entities to the pool
 */
export 
class Animator 
{
    constructor()
    {
        /**
         * current x from where to draw
         */
        this.brushX = 10
        /**
         * current y from where to draw
         */
        this.brushY = 90
        /**
         * Pool of drawable entities
         */
        this.dsPool = []
        /**
         * Queue of animations
         * All animations in this queue will be executed sequentially
         */
        this.animationQueue = [];
        /**
         * To manage states of animator
         * On every frame, update of animator will be called.
         * first we update all the ds in the pool.
         * Then, we call update of the stateMachine,
         * which in turn calls update of the current state.
         * update of idle state: takes an element from animationQueue, and starts animation of it
         * then transit to animating state
         * update of animating state: since already an animation is going on, do nothing
         */
        this.stateMachine = new StateMachine({
            idle: ()=>{
                return (new IdleState(this));
            },
            animating: ()=>{
                return (new AnimatingState(this));
            }
        }, 'idle');
    }

    /**
     * To add an entity in pool
     * @param {*} entity An Entity object to add in the pool, its draw will be called on every frame
     */
    add(entity)
    {
        if(entity.isAbsolute)
        {
            entity.setCoordinates(this.brushX, this.brushY)
            this.brushY += entity.height + 30
        }
        this.dsPool.push(entity)
    }

    update(dt)
    {
        this.dsPool.forEach((entity)=>{
            entity.update(dt)
        });

        // call update of current state
        this.stateMachine.update();
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
    makeIdle()
    {
        this.stateMachine.change('idle')
    }

    /**
     * Whenever an animation is started, this is called by IdleState's change
     */
    makeAnimating()
    {
        this.stateMachine.change('animating');
    }

    drawHeader()
    {
        context.save()
        // Header background
        context.fillStyle = "#2c3e50";
        context.fillRect(0, 0, virtualWidth, 80);
        // Project name
        context.font = "bold 32px 'Arial', sans-serif";
        context.fillStyle = "#ecf0f1";
        context.textAlign = "center";
        context.fillText("Data Structure Visualizer", virtualWidth / 2, 50);
        context.restore()
    }
}