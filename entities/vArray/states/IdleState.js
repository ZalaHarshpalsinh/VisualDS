import { BaseState } from "../../../utils/index.js"
import { vArray } from "../vArray.js"

/**
 * Represents the idle state of vArray
 * 
 * It has no update logic, but it is used to indicate that the vArray is not in any other state.
 */
export class IdleState extends BaseState
{
    /**
     * @param {vArray} varray The vArray instance to which this state instance belongs 
     */
    constructor( varray )
    {
        super()

        /**
         * The vArray instance to which this state instance belongs
         * @type {vArray}
         */
        this.varray = varray
    }
}