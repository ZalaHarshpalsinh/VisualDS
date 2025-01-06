export 
class Animator 
{
    constructor()
    {
        this.brushX = 10
        this.brushY = 10
        this.pool = []
    }

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

    draw()
    {
        this.pool.forEach((entity)=>{
            entity.draw()
        })
    }
}
