import { cnt } from "../../CONSTANTS.js"
import { Entity } from "../Entity.js"
import { vElement, Pointer } from "../index.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState, SwapState, PushState, PopState } from "./states/index.js"

/**
 * This class represents a visual array.
 */
export class vArray extends Entity
{
    /**
     * Create vArray object for an array of anything, it may be array of string, number, Student object, or any other array of objects.
     * The only restriction is that the class, whose objects are in the array, should have a toString() method
     * that returns what needs to be written in the visualized object in the visualized array.
     * It may be a single line text, or a multiline text. If just passing array of numbers, or strings, then no need to worry about toString
     * since it is there by default in these inbuilt classes.
     * @param {any[]} data The array whose visualization to create
     * @param {string} label The label to draw above the array. Defaults to empty string.
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
        // because drawing based on an in memory data structure on every frame
        // this is unlike SVG, where you draw once, and that thing stays on the screen forever, until changed explicitly

        /**
         * This is the actual data inside the array, that changes with the synchronous code
         * written by user.
         */
        this.data = []

        /**
         * The label to draw above the array
         */
        this.label = label

        /**
         * This is the copy utilized for drawing on every frame.
         * It changes asynchronously, as and when animations related to
         * the varray object are selected from the animation queue.
         */
        this.drawData = []

        /**
         * The list of pointers (index variables) that point to elements of this array.
         * Required, because along with the array itself, these also need to be drawn and updated on every frame.
         */
        this.pointers = []

        /**
         * Width of a single element drawn
         */
        this.boxWidth = 0
        /**
         * Height of a single element drawn
         */
        this.boxHeight = 0
        /**
         * Width of the whole array
         */
        this.width = 0
        /**
         * Height of the whole array
         */
        this.height = 0

        //Populate both lists with given data
        for ( let i = 0; i < data.length; i++ )
        {
            this.data.push( data[ i ] )
            // create the data to be drawn as an array of vElement, since that is how we support drawing anything with a toString overridden.
            this.drawData.push( new vElement( data[ i ], `[${i}]`, true ) )
        }

        // update boxWidth, boxHeight, Width, Height according to the data
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

    /**
     * To call update on all the vElement objects encapsulated
     */
    updateBoxes( dt )
    {
        this.drawData.forEach( e =>
        {
            e.update( dt )
        } )
    }

    /**
     * To call udate on all the pointers encapsulated
     */
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
        // update each pointer (incase boxWidth/boxHeight changed)
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

    /**
     * To draw all the pointers.
     */
    drawPointers( ctx )
    {
        this.pointers.forEach( p =>
        {
            p.draw( ctx )
        } )
    }

    /**
     * TO draw this array
     */
    draw( ctx )
    {
        // draw the label
        drawText( ctx, this.label, this.x + this.width / 2, this.y - 15, 'bold 12px Arial', 'black', 'center', 'hanging' )
        // now draw the elements
        this.drawBoxes( ctx )
        // finally, draw the pointers
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
     * @param {boolean} highlight Whether to highlight the element while showing updation on screen. Defaults to true.
     */
    set( index, newVal, highlight = true )
    {
        this.data[ index ] = newVal
        this.drawData[ index ].setVal( newVal, highlight )
    }

    /**
     * To add a new element at the end of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     */
    pushBack( val )
    {
        // queue the animation
        super.addAnimation( { toState: "push", enterParams: { type: 'back', val: val } } )
        return this.data.push( val )
    }

    /**
     * To remove an element from the end of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     */
    popBack()
    {
        // queue the animation
        super.addAnimation( { toState: "pop", enterParams: { type: 'back' } } )
        return this.data.pop()
    }

    /**
     * To add a new element at the start of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     */
    pushFront( val )
    {
        //queue the animation
        super.addAnimation( { toState: "push", enterParams: { type: 'front', val: val } } )
        return this.data.unshift( val )
    }

    /**
     * To remove an element from the start of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     */
    popFront()
    {
        // queue the animation
        super.addAnimation( { toState: "pop", enterParams: { type: 'front' } } )
        return this.data.shift()
    }

    /**
     * Highlight a list of indices
     * @param {number[]} indices The list of indices
     * @param {string} color The color to highlight with. Defaults to blue.
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

    /**
     * To highlight a range of indices, start and end both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     * @param {string} color The color to highlight with.
     */
    highlightRange( s, e, color )
    {
        let indices = []
        for ( let i = s; i <= e; i++ )indices.push( i )
        this.highlight( indices, color )
    }

    /**
     * To unhighlight a range of indices, start and end both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     */
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
     * @param {boolean} highlight Whether to highlight the elements while showing animation. Defaults to true. 
     */
    swap( i, j, highlight = true )
    {
        // highlight first
        if ( highlight ) this.highlight( [ i, j ], 'red' )

        //swap the actual raw data directly
        let tmp = this.data[ i ]
        this.data[ i ] = this.data[ j ]
        this.data[ j ] = tmp

        // queue an animation to swap elements in drawData
        super.addAnimation( { toState: 'swap', enterParams: { i, j } } )

        // then unhighlight
        if ( highlight ) this.unhighlight( [ i, j ] )
    }

    /**
    * Get a pointer(index variable) of this array
    * @param {number} initIndex The initial index pointed by the pointer
    * @param {string} label The name to show for this pointer on screen.
    * @returns {Pointer}
    */
    getPointer( initIndex, label = '' )
    {
        const ptr = new Pointer( this, initIndex, label )
        this.addAnimation( { toState: 'property_change', enterParams: { type: 'add_pointer', pointer: ptr } } )
        return ptr
    }

    /**
     * To remove a given pointer. Removing means it will not be drawn following this call, and you cannot queue any animations on the pointer
     * @param {Pointer} ptr The pointer to remove
     */
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