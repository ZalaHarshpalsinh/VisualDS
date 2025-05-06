/**
 * Represents the objects which store information about an action which is to be performed by the Animator but in sync with animations.
 *
 * Animator will store the Action objects along with Animation objects in a FIFO queue and execute them one by one.
 *
 * To execute a single Action, animator will use the 'type' parameter to determine what to do.
 */
export class Action {
    /**
     * @param {string} type type of the action
     * @param {object} params object containing all parameters required to complete the action
     */
    constructor(type: string, params: object);
    /**
     * type of the action
     */
    type: string;
    /**
     * object containing all parameters required to complete the action
     */
    params: any;
}
