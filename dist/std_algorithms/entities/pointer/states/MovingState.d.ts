/**
 * Represents the moving state of Pointer
 */
export class MovingState extends BaseState {
    /**
     * @param {Pointer} pointer The Pointer instance to which this state instance belongs
     */
    constructor(pointer: Pointer);
    /**
     * The Pointer instance to which this state instance belongs
     * @type {Pointer}
     */
    pointer: Pointer;
    enter(enterPara: any): void;
}
import { BaseState } from "../../../utils/index.js";
import { Pointer } from "../Pointer.js";
