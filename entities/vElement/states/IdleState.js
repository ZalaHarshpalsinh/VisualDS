import { BaseState } from "../../../utils/index.js"
import { vElement } from "../vElement.js"

/**
 * Represents the idle state of vElement
 * 
 * It has no update logic, but it is used to indicate that the vElement is not in any other state.
 */
export class IdleState extends BaseState
{
    /**
     * @param {vElement} velement vElement instance to which this state instance belongs
     */
    constructor( velement )
    {
        super()
        /**
         * The vElement instance to which this state instance belongs
         * @type {vElement}
         */
        this.velement = velement
    }
}