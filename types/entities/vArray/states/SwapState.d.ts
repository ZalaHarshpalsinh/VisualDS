/**
 * Represents the state where two elements are to be swapped in the vArray
 */
export class SwapState extends BaseState {
    /**
     * @param {vArray} varray The vArray instance to which this state instance belongs
     */
    constructor(varray: vArray);
    /**
     * The vArray instance to which this state instance belongs
     * @type {vArray}
     */
    varray: vArray;
    enter(enterPara: any): void;
}
import { BaseState } from "../../../utils/index.js";
import { vArray } from "../vArray.js";
