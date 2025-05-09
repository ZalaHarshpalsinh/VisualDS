import { cnt } from "../../CONSTANTS.js"
import { Entity } from "../Entity.js"
import { vElement, Pointer } from "../index.js"
import { drawText, StateMachine } from "../../utils/index.js"
import { IdleState, PropertyChangeState, SwapState, PushState, PopState } from "./states/index.js"

/**
 * This class represents a visual array.
 * 
 * It can be an array of anything, i.e string, number, custom objects, etc.
 * The only restriction is that the class, whose objects are in the array, should have a toString() method
 * that returns what needs to be written in the visualized object in the visualized array.
 * It may be a single line text, or a multiline text. If just passing array of numbers, or strings, then no need to worry about toString
 * since it is there by default in these inbuilt classes.
 * 
 * With its pushBack(), popBack(), pushFront(), popFront() methods, it can be used as a stack or queue as well.
 */
export class vArray extends Entity
{
    /**
     * @param {any[]} data The array data to be used for visualization
     * @param {string} label The label to draw above the array. Defaults to empty string.
     * 
     * @example <caption>Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //creating a string
     * let str = "Hello World"
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //creating a string
     * let str = new vArray("Hello World", 'My String')
     */
    constructor( data, label = '' )
    {
        super()

        // here, we need to have two arrays
        // one representing the actual data inside the array, that changes with the synchronous code written by the user
        // another representing the array using which we draw on every frame.
        // this one changes asynchronously
        // as and when animations related to the varray object are selected from the animation queue.

        /**
         * This is the actual data inside the array, that changes with the synchronous code
         * written by user.
         * @type {any[]}
         */
        this.data = []

        /**
         * The label to draw above the array
         * @type {string}
         */
        this.label = label

        /**
         * This is the copy utilized for drawing on every frame.
         * It changes asynchronously, as and when animations related to
         * the varray object are selected from the animation queue.
         * @type {vElement[]}
         */
        this.drawData = []

        /**
         * The list of pointers (index variables) that point to elements of this array.
         * 
         * Required, because along with the array itself, these also need to be drawn and updated on every frame.
         * @type {Pointer[]}
         */
        this.pointers = []

        /**
         * Width of a single element drawn
         * @type {number}
         */
        this.boxWidth = 0
        /**
         * Height of a single element drawn
         * @type {number}
         */
        this.boxHeight = 0
        /**
         * Width of the whole array
         * @type {number}
         */
        this.width = 0
        /**
         * Height of the whole array
         * @type {number}
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

        // Register the vArray to the animator
        super.addInPool()

        /**
         * To manage the animation via states
         * @type {StateMachine}
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
     * Updates all the vElement objects encapsulated in this vArray
     * @param {number} dt The delta time
     * 
     * @ignore
     */
    updateBoxes( dt )
    {
        // update each box
        this.drawData.forEach( e =>
        {
            e.update( dt )
        } )
    }

    /**
     * Updates all the pointers encapsulated in this vArray
     * @param {number} dt The delta time
     * 
     * @ignore
     */
    updatePointers( dt )
    {
        // update each pointer
        // this is required because the boxWidth/boxHeight may have changed, and we need to update the pointers accordingly
        // also, the pointers may have changed their position, so we need to update them as well,  as they are a slave entity of the vArray
        this.pointers.forEach( p =>
        {
            p.update( dt )
        } )
    }

    /**
     * @param {number} dt The delta time
     * 
     * @ignore
     */
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
     * Draws the boxes for each element, basically just delegates to the draw of each vElement object in drawData
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on 
     * 
     * @ignore
     */
    drawBoxes( ctx )
    {
        //draw each box
        this.drawData.forEach( ( e, i ) =>
        {
            e.draw( ctx )
        } )
    }

    /**
     * Draws all the pointers associated with this array
     * @param {CanvasRenderingContext2D} ctx The canvas context to draw on
     * 
     * @ignore
     */
    drawPointers( ctx )
    {
        this.pointers.forEach( p =>
        {
            p.draw( ctx )
        } )
    }

    /**
     * @param {CanvasRenderingContext2D} ctx the canvas context to draw on
     * 
     * @ignore
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

    /**
     * @param {object} params the object containing the parameters for the animation 
     * @ignore
     */
    notify( params )
    {
        // this is called by the animator when its this entity's turn to perform the requested animation
        // use the params object to change to approperiate state to perform the animation
        let { toState, enterParams } = params
        this.changeState( toState, enterParams )
    }

    /**
     * Changes the state of the state machine to the given state
     * @param {string} toState The state to change to
     * @param {*} enterParams The object containing all the parameters required to enter the state
     * 
     * @ignore
     */
    changeState( toState, enterParams )
    {
        this.stateMachine.change( toState, enterParams )
    }

    /**
     * Updates the boxWidth, boxHeight, Width, Height based on biggest vElement in drawData
     * 
     * @ignore
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
     * Updates the coordinates of each box, based on starting coordinates of array and boxWidth
     * 
     * @ignore
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
     * Get the array length
     * @returns Length of the contained array
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //getting the length of the array
     * let length = arr.length
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //getting the length of the array
     * let length = new vElement(arr.length(), 'Length')
     */
    length()
    {
        return this.data.length
    }

    /**
     * Get the value at a given index
     * @param {number} index The index to get value from
     * @returns The value at the given index
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //accessing the value at any index
     * let valAtIndex2 = arr[2]
     *  
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //accessing the value at any index
     * let valAtIndex2 = new vElement(arr.get(2), 'Value at index 2')
     */
    get( index )
    {
        return this.data[ index ]
    }

    /**
     * Set a new value at a given index
     * @param {number} index The index for which to update value
     * @param {*} newVal The new value
     * @param {boolean} highlight Whether to highlight the element while showing updation on screen. Defaults to true.
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //updating the value at any index
     * arr[2] = 10
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //updating the value at any index with highlight
     * arr.set(2, 10)
     * 
     * //updating the value at any index without highlight
     * arr.set(2, 10, false)
     */
    set( index, newVal, highlight = true )
    {
        this.data[ index ] = newVal
        this.drawData[ index ].setVal( newVal, highlight )
    }

    /**
     * Adds a new element at the end of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //adding a new element at the end of array
     * arr.push(6)
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //adding a new element at the end of array
     * arr.pushBack(6)
     */
    pushBack( val )
    {
        // queue the animation of pushing a new element at the end of drawData array
        // enterParams contains the type of push, and the value to be pushed
        super.addAnimation( { toState: "push", enterParams: { type: 'back', val: val } } )

        // add the new value to the data array and return the new length of the array
        return this.data.push( val )
    }

    /**
     * Removes an element from the end of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //removing an element from the end of array
     * let removedElement = arr.pop()
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //removing an element from the end of array
     * let removedElement = arr.popBack()
     * removedElement = new vElement(removedElement, 'Removed Element')
     */
    popBack()
    {
        // queue the animation of popping an element from the end of drawData array
        // enterParams contains the type of pop
        super.addAnimation( { toState: "pop", enterParams: { type: 'back' } } )

        // remove the last element from the data array and return it
        return this.data.pop()
    }

    /**
     * Adds a new element at the start of array
     * @param {*} val The new value to add
     * @returns The new length of the array
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //adding a new element at the start of array
     * arr.unshift(0)
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //adding a new element at the start of array
     * arr.pushFront(0)
     */
    pushFront( val )
    {
        //queue the animation of pushing a new element at the start of drawData array
        // enterParams contains the type of push, and the value to be pushed
        super.addAnimation( { toState: "push", enterParams: { type: 'front', val: val } } )

        // add the new value to the data array and return the new length of the array
        return this.data.unshift( val )
    }

    /**
     * Removes an element from the start of array
     * @returns The removed element. If array is empty, undefined is returned and array is not modified.
     * 
     * @example <caption> Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //removing an element from the start of array
     * let removedElement = arr.shift()
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //removing an element from the start of array
     * let removedElement = arr.popFront()
     * removedElement = new vElement(removedElement, 'Removed Element')
     */
    popFront()
    {
        // queue the animation of popping an element from the start of drawData array
        // enterParams contains the type of pop
        super.addAnimation( { toState: "pop", enterParams: { type: 'front' } } )

        // remove the first element from the data array and return it
        return this.data.shift()
    }

    /**
     * Highlights a list of indices
     * @param {number[]} indices The list of indices
     * @param {string} color The color to highlight with. Defaults to blue.
     * 
     * @example <caption>Highlighting a list of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //highlighting a list of indices (default blue)
     * arr.highlight([1, 3])
     * 
     * //highlighting a list of indices (custom color)
     * arr.highlight([0, 2, 4], 'yellow')
     */
    highlight( indices, color = "blue" )
    {
        // queue an animation to change colour property to specified color
        const toState = "property_change"
        const enterParams = {
            type: "box_color_change",
            indices,
            toColor: color
        }
        super.addAnimation( { toState, enterParams } )
    }

    /**
     * Unhighlights a list of indices 
     * @param {number[]} indices The list of indices
     * 
     * @example <caption>Unhighlighting a list of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //highlighting a list of indices (default blue)
     * arr.highlight([0, 1, 2, 3, 4])
     * 
     * //unhighlighting a list of indices
     * arr.unhighlight([0, 2, 4])
     * 
     */
    unhighlight( indices )
    {
        // queue an animation to change colour property to default color
        this.highlight( indices, cnt.DEFAULT_COLOR )
    }

    /**
     * Highlights a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     * @param {string} color The color to highlight with.
     * 
     * @example <caption>Highlighting a continuous range of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'My Array')
     * 
     * //highlighting a range of indices (default blue)
     * arr.highlightRange(0, 4)
     * 
     * //highlighting a range of indices (custom color)
     * arr.highlightRange(5, 9, 'yellow')
     */
    highlightRange( s, e, color )
    {
        // queue an animation to change colour property to specified color
        let indices = []
        for ( let i = s; i <= e; i++ )indices.push( i )
        this.highlight( indices, color )
    }

    /**
     * Unhighlight a range of indices, start and end are both inclusive.
     * @param {number} s The start of the range
     * @param {number} e The end of the range
     * 
     * @example <caption>Unhighlighting a continuous range of indices</caption>
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'My Array')
     * 
     * //highlighting a range of indices (default blue)
     * arr.highlightRange(0, 9)
     * 
     * //unhighlighting a range of indices
     * arr.unhighlightRange(3, 6)
     */
    unhighlightRange( s, e )
    {
        // queue an animation to change colour property to default color
        let indices = []
        for ( let i = s; i <= e; i++ )indices.push( i )
        this.unhighlight( indices )
    }

    /**
     * Swaps elements at two indices
     * @param {number} i The first index
     * @param {number} j The second index
     * @param {boolean} highlight Whether to highlight the elements while showing animation. Defaults to true. 
     * 
     * @example <caption>Normal JS code</caption>
     * //Vanilla JS
     * 
     * //creating an array
     * let arr = [1, 2, 3, 4, 5]
     * 
     * //swapping two elements
     * [arr[0], arr[1]] = [arr[1], arr[0]]
     * 
     * @example <caption>Corresponding code using visualDS for visualization</caption>
     * //Using visualDS
     * 
     * //creating an array
     * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
     * 
     * //swapping two elements with highlight
     * arr.swap(0, 4)
     * 
     * //swapping two elements without highlight
     * arr.swap(0, 4, false)
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
    * Get a pointer(index variable) for this vArray instance.
    * @param {number} initIndex The initial index pointed by the pointer
    * @param {string} label The name to show for this pointer on screen.
    * @returns {Pointer}
    * 
    * @example <caption>Normal JS code</caption>
    * //Vanilla JS
    * 
    * //creating an array
    * let arr = [1, 2, 3, 4, 5]
    * 
    * // looping through the array using a index variable
    * for (let i = 0; i < arr.length; i++) {
    *     console.log(arr[i])
    * }
    * 
    * @example <caption>Corresponding code using visualDS for visualization</caption>
    * //Using visualDS
    * 
    * //creating an array
    * let arr = new vArray([1, 2, 3, 4, 5], 'My Array')
    * 
    * //looping through the array using a pointer
    * //refer Pointer class for more details
    * for(let i = arr.getPointer(0, "Pointer"); !i.isOutOfBound() || i.remove(); i.increment()) 
    * {
    *    arr.highlight([i.getIndex()])
    * }
    */
    getPointer( initIndex, label = '' )
    {
        // queue an animation to add a new pointer
        // enterParams contains the type of property_change action, and the initial index to point to
        const ptr = new Pointer( this, initIndex, label )
        this.addAnimation( { toState: 'property_change', enterParams: { type: 'add_pointer', pointer: ptr } } )
        return ptr
    }

    /**
     * Remove a given pointer from this vArray instance. 
     * 
     * It has the following effect: It will not be drawn following this call, and you cannot queue any animations from the pointer
     * @param {Pointer} ptr The pointer to remove
     * @ignore
     */
    removePointer( ptr )
    {
        // queue an animation to remove the pointer
        // enterParams contains the type of property_change action, and the pointer to remove
        this.addAnimation( { toState: 'property_change', enterParams: { type: 'remove_pointer', pointer: ptr } } )
    }

    /**
     * @ignore
     */
    cleanUp()
    {
        // mask every vElement and pointer as removed, so that they are not drawn anymore
        // and also call their cleanUp() method as they are slave entities of this vArray
        // this is required because the animator will not call cleanUp() on them, as they are not in the pool 
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