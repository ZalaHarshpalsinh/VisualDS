/**
 * Represents a state. Every other state should extends this base class.
 */
export class BaseState {
    /**
     * Executes tasks to be performed while entering this state
     * @param {object} enterParams object containing parameters required while entering this state
     */
    enter(enterParams: object): void;
    /**
     * Executes tasks to be performed while exiting this state
     */
    exit(): void;
    /**
     * Executes update logic of this state
     * @param {number} dt Delta time
     */
    update(dt: number): void;
    /**
     * Executes draw logic of this state
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw with
     */
    draw(ctx: CanvasRenderingContext2D): void;
}
