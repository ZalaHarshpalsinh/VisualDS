import { BaseState } from "../../../utils/index.js"

export class IdleState extends BaseState
{
    constructor(pointer)
    {
        super();
        this.pointer = pointer
    }

    update(dt)
    {
        this.pointer.syncCoords()
    }
}