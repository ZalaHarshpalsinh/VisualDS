/**
 * This is the manager class of the whole framework.
 *
 * It has a pool or array of Entity to be drawn on every frame.
 * It calls update() and draw() on every entity in its pool on every frame.
 *
 * It also has an animation queue from which it takes up an one animation/action at a time, completes it then moves to the next anaimation/action.
 * These animation objects are registered by entities during the execution of their operations in the user script.
 */
export class Animator {
    /**
     *
     * @param {HTMLCanvasElement} canvas The canvas element on which this animator will perform the visualisation
     * @param {CanvasRenderingContext2D} context The 2D context object of the same canvas
     */
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D);
    /**
     * brush holds the coordinates which new entity will be assigned upon registration through addInPool() method.
     *
     * Initially coordinates are set to Framework Level Constant values START_X and START_Y
     *
     * @type {{x: number, y:number}}
     */
    brush: {
        x: number;
        y: number;
    };
    /**
     * Array of entities registered to animator for management.
     *
     * This implies : Animator will call update and draw on each of them on every frame.
     *
     * @type {Entity[]}
     */
    dsPool: Entity[];
    /**
     * FIFO Queue for storing animation requests from any entity (Registered or unregistered in dsPool  ).
     * Animator also stores its actions in this queue which need to be synchronized with animations, i.e. adding a entity
     *
     * @type {(Animation | Action)[]}
     */
    animationQueue: (Animation | Action)[];
    /**
     * A simple variable to keep track of animator's state.
     *
     * Animator behaves differently in each state.
     *
     * Initially set to idle state.
     *
     * idle : pop an animation from animationQueue and notify the corresponding entity and move to animating state
     *
     * animating : wait for the entity to complete its animation, when nextAnimation() is called by entity to report about completion of animation move to idle state.
     * @type {string}
     */
    state: string;
    /**
     * Variable which controls the speed of animation.
     *
     * It is a multiplier which will be applied to default speed.
     *
     * By default, the animation speed is set to 1.0x.
     *
     * @type {number}
     */
    animationSpeed: number;
    /**
     * An TweenManager instance which will be provided to entities via getTweenManager() method, to register and handle tweens.
     *
     * Use of TweenManager simplifies the animation logic inside entities and is recommended to be used for simple animations.
     * @type {TweenManager}
     */
    tweenManager: TweenManager;
    /**
     * The canvas element on which this animator will perform the visualisation
     * @type {HTMLCanvasElement}
     */
    canvas: HTMLCanvasElement;
    /**
     * The 2D context object of the same canvas
     * @type {CanvasRenderingContext2D}
     */
    context: CanvasRenderingContext2D;
    /**
     * An object to store the scrolling mechanism related information.
     * @type {{isScrolling: boolean, x: number, y: number, lastX: number, lastY: number}}
     */
    scroll: {
        isScrolling: boolean;
        x: number;
        y: number;
        lastX: number;
        lastY: number;
    };
    /**
     * Current Zoom intensity of the canvas. It is used to implement zoom in and out features on canvas through scaling during draw() call.
     *
     * Default value is 1.0
     * @type {number}
     */
    zoomLevel: number;
    /**
     * Configures the canvas as per framework's requirements
     */
    configureCanvas(): void;
    /**
     * Gets the TweenManager instance.
     *
     * To be used by entities to get tewenManager instance for registering tweens to perform simple animations.
     * @returns {TweenManager} tweenManager instance
     */
    getTweenManager(): TweenManager;
    /**
     * Registers an Entity to animator for management.
     *
     * To be used by entities to register themselves to animator.
     * @param {Entity} entity Entity to be registered
     */
    addInPool(entity: Entity): void;
    /**
     * Removes an Entity from the pool of entities managed by animator.
     *
     * To be used by entities to remove themselves from animator and as a effect from the canvas.
     * @param {Entity} entity Entity to be removed
     */
    removeFromPool(entity: Entity): void;
    /**
     * Queues an animation/action.
     *
     * If it is an animation, animator will notify the requesting entity when this animation's turn come, by calling notify() method on that entity
     * and it will also pass the params object back to entity, which was provided at time of animation registration.
     *
     * If it is an action then, animator will perform the action itself.
     *
     * Upon execution of queued animation/action, animator will move to and stay in 'animating' state until nextAnimation() is called on it.
     * @param {Animation | Action} animObj animation to be queued
     */
    addAnimation(animObj: Animation | Action): void;
    /**
     * Moves the animator to 'idle' state after some delay which is decided based on animationSpeed.
     *
     * After going in 'idle' state animator will pick the next item from animationQueue, hence the name 'nextAnimation'.
     *
     * It should be called by the entity to notify the animator about the completion of its animation.
     */
    nextAnimation(): void;
    /**
     * Gives the current animation speed.
     * @returns {number} current animation speed (A value multiplied with default speed)
     */
    getAnimationSpeed(): number;
    /**
     * Queues the action of actually changing the animation speed, so that all the animations registerd/queued after this execute at new speed
     * @param {number} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
     */
    setAnimationSpeed(newSpeed: number): void;
    /**
     * Scrolls the canvas to a new position.
     * @param {number} x scroll destination's x coordinate
     * @param {number} y scroll destination's y coordinate
     */
    setScroll(x: number, y: number): void;
    /**
     * Sets the zoom level of the canvas.
     * @param {number} val zoom level to be set. A value between 0.1 and 5.0
     */
    setZoom(val: number): void;
    /**
     * Performs the compaction on all registered entities.
     * Reassigns the coordinates to each entity, so that empty space left by some removed entity can be reutilized.
     * Entities which has their coordinates change as result of this compaction, will move to their new position with an animation.
     */
    compactEntities(): void;
    /**
     * Updates the animator based on the current state value. It is called on every frame.
     *
     * If state is 'idle', executes next animation/action in animationQueue, moves to 'animating' state.
     *
     * If state is 'animating', waits for animated entity to notify about completion of animation.
     * @param {number} dt Delta time : The time elapsed since last frame. It is used to update the animator and entities in a time based manner.
     */
    update(dt: number): void;
    /**
     * Draws each registered entity on canvas. It is called on every frame.
     */
    draw(): void;
}
import { Entity } from "./entities/index.js";
import { Animation } from "./Animation.js";
import { Action } from "./Action.js";
import { TweenManager } from "./utils/index.js";
