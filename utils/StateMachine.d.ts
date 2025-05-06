/**
 * A state manager to efficiently manage all the states of an entity and its transition between those states.
 */
export class StateMachine {
    /**
     * @param {object} states An object whose keys are state names and values are functions which return new object of those states.
     * @param {string} intitialState Initial state of state machine
     */
    constructor(states: object, intitialState: string);
    /**
     * An object whose keys are state names and values are functions which return new object of those states.
     * @type {object}
     */
    states: object;
    /**
     * Object of current state of state machine
     * @type {BaseState}
     */
    currentState: BaseState;
    /**
     * Transitions the stateMachine from current state to a target state.
     * @param {string} toState State to transition to
     * @param {object} params Object storing all the parameters required while entering the target state
     */
    change(toState: string, params: object): void;
    /**
     * Performs the update logic of current state of the state machine. Should be called on every frame.
     * @param {number} dt Delta time
     */
    update(dt: number): void;
    /**
     * Performs the draw logic of current state of the state machine. Should be called on every frame.
     * @param {CanvasRenderingContext2D} ctx The 2D rendering context for the drawing surface of a <canvas> element.
     */
    draw(ctx: CanvasRenderingContext2D): void;
}
import { BaseState } from "./BaseState.js";
