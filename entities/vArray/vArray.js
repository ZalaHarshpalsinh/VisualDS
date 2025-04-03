import { cnt } from "../../CONSTANTS.js"
import { Entity } from "../Entity.js"
import { vElement, Pointer } from "../index.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState, SwapState, PushState, PopState } from "./states/index.js"

/**
 * This class represents a visual array.
 * It may be an array of number, string, or even custom objects, as long as they have toString overridden.
 */
export class vArray extends Entity
{
    /**
     * Create vArray object for an array of anything, it may be array of string, number, Student object, or any other array of objects.
     * The only restriction is that the class, whose objects are in the array, should have a toString method
     * that returns what needs to be written in the visualized object in the visualized array.
     * It may be a single line text, or a multiline text. If just passing array of numbers, or strings, then no need to worry about toString
     * since it is there by default in these inbuilt classes.
     * @param {any[]} data The array whose visualization to create
     */
    constructor( data, label = '' )
    {
        super()

        // here, we need to have two arrays
        // one representing the actual data inside the array, that changes with the synchronous code
        // written by the user
        // another representing the array using which we draw on every frame.
        // this one changes asynchronously
        // now, this concept of keeping two copies is required, 
        // because drwing based on an in memory data structure on every frame
        // this is unlike SVG, where you draw once, and that thing stays on the screen forever, until changes explicitly

        /**
         * This is the actual data inside the array, that changes with the synchronous code
         * written by user.
         */
        this.data = []
        this.label = label

        /**
         * This is the copy utilized for drawing on every frame.
         * It changes asynchronously.
         */
        this.drawData = []

        this.pointers = []

        //Height and width of a single element
        this.boxWidth = 0
        this.boxHeight = 0
        //Height and width of whole array
        this.width = 0
        this.height = 0

        //Populate both lists with given data
        for ( let i = 0; i < data.length; i++ )
        {
            this.data.push( data[ i ] )
            // create the data to be drawn as an array of vElement, since that is how we support drawing anything with a toString overridden.
            this.drawData.push( new vElement( data[ i ], `[${i}]`, true ) )
        }

        // update boxWidth, boxHeight, Width, Height
        this.syncDimensions()

        // since necessary properties of Entity are initialized properly, add in pool and get the assigned coordinates
        super.addInPool()

        /**
         * To manage the animation via states
         */
        this.stateMachine = new StateMachine( {
            idle: () => new IdleState( this ),
            property_change: () => new PropertyChangeState( this ),
            swap: () => new SwapState( this ),
            push: () => new PushState( this ),
            pop: () => new PopState( this ),
        }, 'idle' )
    }

    updateBoxes( dt )
    {
        this.drawData.forEach( e =>
        {
            e.update( dt )
        } )
    }

    updatePointers( dt )
    {
        this.pointers.forEach( p =>
        {
            p.update( dt )
        } )
    }

    update( dt )
    {
        //update each box
        this.updateBoxes( dt )
        // update boxWidth, boxHeight, Width, Height incase any box's value changed
        this.syncDimensions()
        // similarly update the coordinates of each box
        this.syncCoordinates()
        //update each pointer (incase boxWidth/boxHeight changed)
        this.updatePointers( dt )
    }

    /**
     * To draw boxes for each element, basically just delegates to the draw of each vElement object in drawData
     */
    drawBoxes( ctx )
    {
        this.drawData.forEach( ( e, i ) =>
        {
            e.draw( ctx )
        } )
    }

    drawPointers( ctx )
    {
        this.pointers.forEach( p =>
        {
            p.draw( ctx )
        } )
    }

    draw( ctx )
    {
        drawText( ctx, this.label, this.x + this.width / 2, this.y - 15, 'bold 12px Arial', 'black', 'center', 'hanging' )
        this.drawBoxes( ctx )
        this.drawPointers( ctx )
    }

    notify( params )
    {
        let { toState, enterParams } = params
        this.changeState( toState, enterParams )
    }

    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * To update boxWidth, boxHeight, Width, Height based on biggest vElement in drawData
     */
    syncDimensions()
    {
        //Find biggest box's height/width
        for ( let i = 0; i < this.drawData.length; i++ )
        {
            this.boxWidth = Math.max( this.boxWidth, this.drawData[ i ].width )
            this.boxHeight = Math.max( this.boxHeight, this.drawData[ i ].height )
        }

        //Make every box same as biggest box
        for ( let i = 0; i < this.drawData.length; i++ )
        {
            this.drawData[ i ].width = this.boxWidth
            this.drawData[ i ].height = this.boxHeight
        }

        //update height/width of whole array
        this.width = this.drawData.length * this.boxWidth
        this.height = this.boxHeight
    }

    /**
     * To update the coordinates of each box, based on starting coordinates of array and boxWidth
     */
    syncCoordinates()
    {
        // Put brush at start of array
        let brush = { x: this.x, y: this.y }
        for ( let i = 0; i < this.drawData.length; i++ )
        {
            // set the custom coords for each vElement
            this.drawData[ i ].setCoordinates( brush.x, brush.y )
            this.drawData[ i ].label = `[${i}]`
            //move brush to the right by boxWidth
            brush.x += this.boxWidth
        }
    }

    /**
     * Get array length
     * @returns Length of the contained array
     */
    length()
    {
        return this.data.length
    }

    /**
     * To get value at a given index
     * @param {number} index The index to get value from
     * @returns The value at the given index
     */
    get( index )
    {
        return this.data[ index ]
    }

    /**
     * To set a new value at a given index
     * @param {*} index The index for which to update value
     * @param {*} newVal The new value
     */
    set( index, newVal, highlight = true )
    {
        this.data[ index ] = newVal
        this.drawData[ index ].setVal( newVal, highlight )
    }

    pushBack( val )
    {
        // queue the animation
        super.addAnimation( { toState: "push", enterParams: { type: 'back', val: val } } )
        return this.data.push( val )
    }

    popBack()
    {
        // queue the animation
        super.addAnimation( { toState: "pop", enterParams: { type: 'back' } } )
        return this.data.pop()
    }

    pushFront( val )
    {
        //queue the animation
        super.addAnimation( { toState: "push", enterParams: { type: 'front', val: val } } )
        return this.data.unshift( val )
    }

    popFront()
    {
        // queue the animation
        super.addAnimation( { toState: "pop", enterParams: { type: 'front' } } )
        return this.data.shift()
    }

    /**
     * Highlight a list of indices
     * @param indices The list of indices
     */
    highlight( indices, color = "blue" )
    {
        // queue an animation to change colour property
        const toState = "property_change"
        const enterParams = {
            type: "box_color_change",
            indices,
            toColor: color
        }
        super.addAnimation( { toState, enterParams } )
    }

    /**
     * To unhighlight a list of indices
     * @param indices The list
     */
    unhighlight( indices )
    {
        // queue an animation to change colour property
        this.highlight( indices, cnt.DEFAULT_COLOR )
    }

    highlightRange( s, e, color )
    {
        let indices = []
        for ( let i = s; i <= e; i++ )indices.push( i )
        this.highlight( indices, color )
    }

    unhighlightRange( s, e )
    {
        let indices = []
        for ( let i = s; i <= e; i++ )indices.push( i )
        this.unhighlight( indices )
    }

    /**
     * To swap elements at two indices and show animation
     * @param {number} i The first index
     * @param {number} j The second index
     */
    swap( i, j, highlight = true )
    {
        if ( highlight ) this.highlight( [ i, j ], 'red' )

        //swap the actual raw data directly
        let tmp = this.data[ i ]
        this.data[ i ] = this.data[ j ]
        this.data[ j ] = tmp

        // queue an animation to swap elements in drawData
        super.addAnimation( { toState: 'swap', enterParams: { i, j } } )

        if ( highlight ) this.unhighlight( [ i, j ] )
    }

    /**
    * Get a pointer of this array
    * @param {number} initIndex The initial index pointed by the pointer
    * @returns {Pointer}
    */
    getPointer( initIndex, label = '' )
    {
        const ptr = new Pointer( this, initIndex, label )
        this.addAnimation( { toState: 'property_change', enterParams: { type: 'add_pointer', pointer: ptr } } )
        return ptr
    }

    removePointer( ptr )
    {
        this.addAnimation( { toState: 'property_change', enterParams: { type: 'remove_pointer', pointer: ptr } } )
    }

    cleanUp()
    {
        this.drawData.forEach( e =>
        {
            e.removed = true
            e.cleanUp()
        } )
        this.drawData = []
        this.pointers.forEach( p =>
        {
            p.removed = true
            p.cleanUp()
        } )
        this.pointers = []
    }
}