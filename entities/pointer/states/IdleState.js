import { BaseState } from "../../../utils/index.js"
import { Pointer } from "../../index.js"

/**
 * Represents the idle state of Pointer
 * 
 * It has no update logic, but it is used to indicate that the Pointer is not in any other state.
 */
export class IdleState extends BaseState
{
    /** 
     * @param {Pointer} pointer The Pointer instance to which this state instance belongs
     */
    constructor( pointer )
    {
        super()
        /**
         * The Pointer instance to which this state instance belongs
         * @type {Pointer}
         */
        this.pointer = pointer
    }

    update( dt )
    {
        //check if array has shrunk and adjust drawIndex and coordinates accordingly
        this.pointer.drawIndex = Math.max( -1, Math.min( this.pointer.pointee.drawData.length, this.pointer.drawIndex ) )
        this.pointer.syncCoordinates()
    }
}