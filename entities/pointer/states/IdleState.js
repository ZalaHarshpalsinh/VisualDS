import { BaseState } from "../../../utils/index.js"

export class IdleState extends BaseState
{
    constructor( pointer )
    {
        super()
        this.pointer = pointer
    }

    update( dt )
    {
        //check if array has shrunk
        this.pointer.drawIndex = Math.max( -1, Math.min( this.pointer.pointee.drawData.length, this.pointer.drawIndex ) )
        this.pointer.syncCoordinates()
    }
}