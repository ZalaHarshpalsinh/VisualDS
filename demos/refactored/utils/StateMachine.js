/**
 * An object of this will be used to manage states of an entity.
 */
export class StateMachine
{
    constructor( states, intitialState )
    {
        this.states = states ? states : {};
        this.currentState = states[ intitialState ]();
    }
    change( toState , params )
    {
        this.currentState.exit();
        this.currentState = this.states[ toState ]();
        this.currentState.enter( params );
    }
    update( dt )
    {
        this.currentState.update( dt );
    }
    draw()
    {
        this.currentState.draw();
    }
}