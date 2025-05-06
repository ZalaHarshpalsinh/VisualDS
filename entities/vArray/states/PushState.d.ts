/**
 * Represents the state where a new value is pushed in the array
 */
export class PushState extends BaseState {
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
     * The distance of the spawn point from the array
     * @type {number}
     */
    spawnDistance: number;
    enter(enterPara: any): void;
}
import { BaseState } from "../../../utils/index.js";
import { vArray } from "../../index.js";
