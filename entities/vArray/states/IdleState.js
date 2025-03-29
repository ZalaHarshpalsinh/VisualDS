import { BaseState } from "../../../utils/index.js"

/**
 * Represents the idle state of vArray
 */
export class IdleState extends BaseState
{
    constructor(varray)
    {
        super()
        this.varray = varray
    }
}