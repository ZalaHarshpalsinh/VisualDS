/**
 * A state manager to manage all the states of an entity and its transition between those states, efficiently.
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
         */
        this.states = states ? states : {}
        /**
         * Object of current state of state machine
         */
        this.currentState = states[ intitialState ]()
    }
    change( toState, params )
    {
        this.currentState.exit()
        this.currentState = this.states[ toState ]()
        this.currentState.enter( params )
    }
    update( dt )
    {
        this.currentState.update( dt )
    }
    draw()
    {
        this.currentState.draw()
    }
}