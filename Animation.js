import { Entity } from "./entities"

/**
 * Represents the objects which store information about an animation which is required for communication between Animator and Entity.
 * 
 * Entity will register Animation objects to Animator. Animator will store them in a FIFO queue and execute them one by one.
 * 
 * To execute a single Animation, animator will notify the specified entity by calling notify(), while passing in params object  
 */
export class Animation
{
        /**
         * @param {Entity} entity entity which should be notifyed 
         * @param {object} params object containing all extra parameters. This same object will be passed back to entity in notify() method 
         */
        constructor( entity, params )
        {
                /**
                 * Entity which should be notified for this animation
                 */
                this.entity = entity
                /**
                 * Object containing parameters which will be passed back to entity in a notify() call
                 */
                this.params = params
        }
}