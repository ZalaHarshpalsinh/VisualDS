import { BaseState } from "./BaseState.js";

/**
 * Represents idle state of animator
 */
export class IdleState extends BaseState
{

    constructor(animator)
    {
        super()
        this.animator = animator;
    }

    // to enter the idle state
    enter()
    {}

    // to do update in idle state
    update()
    {
        // take an ele from anim queue
        let animObj = this.animator.animationQueue.shift();

        if(animObj!=undefined)
        {
            console.log(animObj)
            // an animation is there

            // the entity which is going to be animated
            // how? we will change its state by passing the params
            let entity = animObj.entity;

            // an object containing the params to be passed, is of importance to the entity only
            // not the framework
            let params = animObj.params;

            // the state to transit to
            let toState = animObj.toState;

            entity.changeState(toState, params);

            // change animator to animating state
            this.animator.makeAnimating();
        }


    }

}