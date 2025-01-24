/**
 * An object of this will be used to manage states of an entity.
 */
export class StateMachine
{
    constructor( states )
    {
        this.states = states ? states : {};
        this.current_state = states[ 'BaseState' ]();
    }
    change( state_name, enter_para )
    {
        this.current_state.exit();
        this.current_state = this.states[ state_name ]();
        this.current_state.enter( enter_para );
    }
    update( dt )
    {
        this.current_state.update( dt );
    }
    draw()
    {
        this.current_state.draw();
    }
}