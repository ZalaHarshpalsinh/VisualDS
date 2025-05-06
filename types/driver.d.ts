/**
 * Creates a new visualisation by creating a new animator object and executing the user given code.
 *
 * The user given code is expected to be a function which takes a controller object as an argument. The controller object contains methods to control the animation speed and other properties of the animator.
 *
 * Exposes the whole framework to the user.
 * @param {string} cnvId The ID of the canvas element in the DOM. This canvas will be used to draw on.
 * @param {function} userScript The callback containing code to be visualized.
 */
export function createVisualisation(cnvId: string, userScript: Function): void;
/**
 * Get the ID of the current animator.
 * @returns {number} The ID of the current animator. This is the index of the animator in the animators array.
 */
export function getCurrentAnimatorId(): number;
/**
 * Gives the current animation speed.
 * @returns {number} current animation speed (A value multiplied with default speed)
 */
export function getAnimationSpeed(animatorId: any): number;
/**
 * Sets a new animation speed for the specified animator. All animations after this call will execute at new speed.
 * @param {number} animatorId ID of the animator for which to set the animation speed.
 * @param {number} newSpeed New animation speed. A multiplier value for default speed. Default is 1.0 (1x).
 */
export function setAnimationSpeed(animatorId: number, newSpeed: number): void;
/**
 * Registers an entity to the specified animator. The entity will be added to the pool of entities which will be updated and drawn on every frame.
 * @param {number} animatorId ID of the animator to which the entity should be registered.
 * @param {Entity} entity entity to be registered.
 */
export function addInPool(animatorId: number, entity: Entity): void;
/**
 * Removes an entity from the specified animator's pool. The entity will no longer be updated or drawn on every frame.
 * @param {number} animatorId Id of the animator from which the entity should be removed.
 * @param {Entity} entity entity to be removed.
 */
export function removeFromPool(animatorId: number, entity: Entity): void;
/**
 * Registers an animation to the specified animator. The animation will be added to the queue of animations which will be executed one by one
 * @param {number} animatorId ID of the animator to which the animation should be registered.
 * @param {Animation} animObj Animation object to be registered.
 */
export function addAnimation(animatorId: number, animObj: Animation): void;
/**
 * Moves to the next animation in the queue of the specified animator. This should be called by the entity at the end of every animation, if it is not, next animations in the animator's queue will not execute.
 * @param {number} animatorId ID of the animator for which to move to the next animation.
 */
export function nextAnimation(animatorId: number): void;
/**
 * Get the tween manager of the specified animator.
 * @param {Number} animatorId ID of the animator for which to get the tween manager.
 * @returns {TweenManager} tween manager of the specified animator.
 */
export function getTweenManager(animatorId: number): TweenManager;
import { Entity } from "./entities/Entity.js";
import { TweenManager } from "./utils/index.js";
