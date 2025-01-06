/**
 * An Animator object is the one that actually has the pool of all the drawable entities. Call add() to add more entities to the pool
 */
export 
class Animator 
{
    constructor()
    {
        /**
         * current x from where to draw
         */
        this.brushX = 10
        /**
         * current y from where to draw
         */
        this.brushY = 10
        /**
         * Pool of drawable entities
         */
        this.pool = []
    }

    /**
     * To add an entity in pool
     * @param {*} entity An Entity object to add in the pool, its draw will be called on every frame
     */
    add(entity)
    {
        if(entity.isAbsolute)
        {
            entity.setCoordinates(this.brushX, this.brushY)
            this.brushY += entity.height + 20
        }
        this.pool.push(entity)
    }

    update(dt)
    {
        this.pool.forEach((entity)=>{
            entity.update(dt)
        })
    }

    /**
     * The actual method responsible for calling draw on every element in the pool. This method is called on every frame
     */
    draw()
    {
        this.pool.forEach((entity)=>{
            entity.draw()
        })
    }
}
