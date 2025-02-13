import { animator } from "./demos/array_demo/main.js"

/**
 * This class represents a 'drawable' entity.
 */
export class Entity 
{
    constructor()
    {
        /**
         * The x co-ordinate of the top left point
         */
        this.x = 0
        /**
         * The y co-ordinate of the top left point
         */
        this.y = 0
        /**
         * The width of the entity drawn
         */
        this.width = 0
        /**
         * The height of the entity drawn
         */
        this.height = 0
        /**
         * true: this entity does not know where it should be drawn, it is not relative to any other entity.
         * false: this entity knows where it should be drawn, it is relative to some other entity
         */
        this.isAbsolute = true
    }

    /**
     * Set the co-ordinates of the top left point
     * @param {*} x The x co-ordinate
     * @param {*} y The y co-ordinate
     */
    setCoordinates(x, y)
    {
        this.x = x
        this.y = y
    }

    update(dt){}

    /**
     * Draws this drawable entity from the top left set
     * and also updated the height and width property
     */
    draw(){}

    /**
     * To add this object in the DS Pool of animator
     */
    add()
    {
        animator.add(this);
    }

    /**
     * To add an animation object in the animation queue
     * Will be called by a specific entity (sub class of Entity)
     * To be able to queue an animation
     */
    addAnimation(toState, params)
    {
        // create animObj
        const animObj = {
            toState,
            params,
            entity: this
        };
        
        // add the entity in animObj
        animator.addAnimation(animObj);
    }

    /**
     * To change the state of an entity
     * @param {*} toState The state to transit to
     * @param {*} params The object to pass to the enter method of that state
     */
    changeState(toState, params){}

    /**
     * To make the animator idle again, so that it can take up another animation (if any)
     */
    makeIdle()
    {
        animator.makeIdle();
    }
} 