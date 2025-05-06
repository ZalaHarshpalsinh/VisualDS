/**
 * Represents the state where a value is poped from the array
 */
export class PopState extends BaseState {
    /**
     * @param {vArray} varray The vArray instance to which this state instance belongs
     */
    constructor(varray: vArray);
    /**
     * The vArray instance to which this state instance belongs
     * @type {vArray}
     */
    varray: vArray;
    /**
     * The distance of the kill site from the array
     * @type {number}
     */
    killDistance: number;
    enter(enterPara: any): void;
}
import { BaseState } from "../../../utils/index.js";
import { vArray } from "../vArray.js";
