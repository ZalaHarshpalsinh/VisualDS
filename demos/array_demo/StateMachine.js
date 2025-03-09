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
    change( name , para )
    {
        this.currentState.exit();
        this.currentState = this.states[ state_name ]();
        this.currentState.enter( para );
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