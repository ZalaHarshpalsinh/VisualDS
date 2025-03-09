import { BaseState } from "../BaseState.js";

export class IdleState extends BaseState
{
    constructor(pointer)
    {
        super();
        this.pointer = pointer
    }
}