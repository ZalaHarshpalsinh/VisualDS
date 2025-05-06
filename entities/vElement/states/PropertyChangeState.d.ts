/**
 * Represents the state where a property of the vElement is changing
 *
 * Such as colour of a box, val inside the box, etc.
 */
export class PropertyChangeState extends BaseState {
    /**
     * @param {vElement} velement vElement instance to which this state instance belongs
     */
    constructor(velement: vElement);
    /**
     * The vElement instance to which this state instance belongs
     * @type {vElement}
     */
    velement: vElement;
    enter(enterPara: any): void;
    data: any;
}
import { BaseState } from "../../../utils/index.js";
import { vElement } from "../vElement.js";
