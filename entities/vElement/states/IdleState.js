import { BaseState } from "../../../utils/index.js"

/**
 * Represents the idle state of vElement
 */
export class IdleState extends BaseState
{
    constructor( velement )
    {
        super()
        this.velement = velement
    }
}