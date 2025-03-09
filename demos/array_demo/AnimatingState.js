import { BaseState } from "./BaseState.js";

/**
 * Represents animating state of animator
 */
export class AnimatingState extends BaseState
{

    constructor(animator)
    {
        super()
        this.animator = animator;
    }

    // to enter the idle state
    enter()
    {}

    // to do update in animatings state
    update()
    {
    }
}