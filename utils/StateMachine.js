import { BaseState } from "./BaseState"

/**
 * A state manager to efficiently manage all the states of an entity and its transition between those states.
 */
export class StateMachine
{
    /**
     * @param {object} states An object whose keys are state names and values are functions which return new object of those states.
     * @param {string} intitialState Initial state of state machine
     */
    constructor( states, intitialState )
    {
        /**
         * An object whose keys are state names and values are functions which return new object of those states.
         * @type {BaseState[]}
         */
        this.states = states ? states : {}
        /**
         * Object of current state of state machine
         * @type {BaseState}
         */
        this.currentState = states[ intitialState ]()
    }

    /**
     * Transitions the stateMachine from current state to a target state.
     * @param {string} toState State to transition to
     * @param {object} params Object storing all the parameters required while entering the target state
     */
    change( toState, params )
    {
        // exit the current state
        this.currentState.exit()
        // create a new object of target state
        this.currentState = this.states[ toState ]()
        // enter the target state
        this.currentState.enter( params )
    }

    /**
     * Performs the update logic of current state of the state machine. Should be called on every frame.
     * @param {number} dt Delta time 
     */
    update( dt )
    {
        this.currentState.update( dt )
    }

    /**
     * Performs the draw logic of current state of the state machine. Should be called on every frame.
     */
    draw()
    {
        this.currentState.draw()
    }
}