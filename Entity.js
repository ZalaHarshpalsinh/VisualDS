export class Entity 
{
    constructor()
    {
        this.x = 0
        this.y = 0
        this.width = 0
        this.height = 0
        this.isAbsolute = true
    }

    setCoordinates(x, y)
    {
        this.x = x
        this.y = y
    }

    update(dt){}
    draw(){}
} 