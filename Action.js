/**
 * Represents the objects which store information about an action which is to be performed by the Animator but in sync with animations.
 * 
 * Animator will store the Action objects along with Animation objects in a FIFO queue and execute them one by one.
 * 
 * To execute a single Action, animator will use the type to determine what to do.
 */
export class Action 
{
        /**
         * @param {string} type type of the action
         * @param {object} params object containing all parameters required to complete the action
         */
        constructor( type, params )
        {
                /**
                 * type of the action
                 */
                this.type = type
                /**
                 * object containing all parameters required to complete the action
                 */
                this.params = params
        }
}