/**
 * Represents a state. Every other state should extends this base class.
 */
export class BaseState
{
    constructor() { }
    /**
     * Executes tasks to be performed while entering this state  
     * @param {object} params 
     */
    enter( params ) { }
    /**
     * Executes tasks to be performed while exiting this state
     */
    exit() { }
    /**
     * Executes update logic of this state
     * @param {number} dt Delta time 
     */
    update( dt ) { }
    /**
     * Executes draw logic of this state
     */
    draw() { }
}