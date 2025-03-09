import { animator } from "../driver.js"

export class Entity 
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        /**
         * true: this entity knows where it should be drawn, it is relative to some other entity
         * false: this entity does not know where it should be drawn, it is not relative to any other entity.
         */
        this.customCoordinates = false
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

    /**
     * To add this object in the DS Pool of animator
     */
    addInPool()
    {
        animator.addInPool(this);
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
    
    nextAnimation()
    {
        animator.nextAnimation()
    }

    update(dt){}
 
    /**
     * Draws this drawable entity from the top left set
     * and also updated the height and width property
     */
    draw(){}
} 