/**
 * Represents the idle state of Pointer
 *
 * It has no update logic, but it is used to indicate that the Pointer is not in any other state.
 */
export class IdleState extends BaseState {
    /**
     * @param {Pointer} pointer The Pointer instance to which this state instance belongs
     */
    constructor(pointer: Pointer);
    /**
     * The Pointer instance to which this state instance belongs
     * @type {Pointer}
     */
    pointer: Pointer;
    update(dt: any): void;
}
import { BaseState } from "../../../utils/index.js";
import { Pointer } from "../../index.js";
