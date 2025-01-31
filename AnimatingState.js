import { BaseState } from "./BaseState";

/**
 * Represents animating state of animator
 */
export class AnimatingState extends BaseState
{

    constructor(animator)
    {
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