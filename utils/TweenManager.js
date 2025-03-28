export class TweenManager
{
    constructor()
    {
        this.tweens = new Map()
        this.nextId = 1
    }

    /**
     * Create a new tween
     * @param {object} target - The target object to tween
     * @param {object} values - The target values to tween to (e.g., {x: 100, y: 200})
     * @param {number} duration - Duration of the tween in seconds
     * @param {function} [easing] - Easing function (default: linear)
     * @param {function} [callback] - Callback when tween completes
     * @returns {number} - Tween ID
     */
    addTween(target, values, duration, easing = TweenManager.linear, callback = null) 
    {
        const id = this.nextId++
        const startValues = {}
        const changeValues = {}
        const startTime = performance.now() // in miliseconds
        
        // Store initial values and calculate changes
        for (const key in values) {
            startValues[key] = target[key]
            changeValues[key] = values[key] - startValues[key]
        }

        this.tweens.set(id, {
            target,
            startValues,
            changeValues,
            startTime,
            duration,
            easing,
            callback
        });
        
        return id;
    }

    /**
     * Cancel a tween
     * @param {number} id - The tween ID to cancel
     */
    cancel(id) {
        this.tweens.delete(id);
    }

    /**
     * Cancel all tweens
     */
    cancelAll() {
        this.tweens.clear();
    }
    
    /**
     * Update all active tweens
     * @param {number} dt delta time
     */
    update(dt) 
    {
        const now = performance.now()

        const completedTweens = []

        this.tweens.forEach((tween, id) => {

            const elapsed = now - tween.startTime;
            const progress = Math.min(elapsed / tween.duration, 1);
            const easedProgress = tween.easing(progress);

            // Update target properties
            for (const key in tween.changeValues) 
            {
                tween.target[key] = tween.startValues[key] + tween.changeValues[key] * easedProgress
            }

            // Check if tween is complete
            if (progress == 1) 
            {
                completedTweens.push(id);
                if (tween.callback) 
                {
                    tween.callback();
                }
            }
        });

        // Remove completed tweens
        completedTweens.forEach(id => this.tweens.delete(id));
    }

    /**
     * Check if a tween is active
     * @param {number} id - The tween ID to check
     * @returns {boolean} - True if the tween is active
     */
    isActive(id) {
        return this.tweens.get(id) ? true : false
    }
}

// Built-in easing functions
TweenManager.linear = t => t;
TweenManager.quadIn = t => t * t;
TweenManager.quadOut = t => t * (2 - t);
TweenManager.quadInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
TweenManager.cubicIn = t => t * t * t;
TweenManager.cubicOut = t => (--t) * t * t + 1;
TweenManager.cubicInOut = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
TweenManager.sinIn = t => 1 - Math.cos(t * Math.PI / 2);
TweenManager.sinOut = t => Math.sin(t * Math.PI / 2);
TweenManager.sinInOut = t => (1 - Math.cos(Math.PI * t)) / 2;
TweenManager.expoIn = t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
TweenManager.expoOut = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
TweenManager.expoInOut = t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
};