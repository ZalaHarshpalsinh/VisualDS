/**
 * Draws a solid rectangle with provided specifications
 * @param {CanvasRenderingContext2D} ctx canvas context to draw on
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number} width width of rectangle
 * @param {number} height height of rectangle
 * @param {string} fillColor color of rectangle
 * @param {string} borderColor color of border
 * @param {number} borderWidth thickness of border
 */
function drawRectangle( ctx, x, y, width, height, fillColor, borderColor, borderWidth )
{
    // save the context
    ctx.save()

    // Draw box
    ctx.fillStyle = fillColor
    ctx.fillRect( x, y, width, height )
    // Draw the border
    ctx.lineWidth = borderWidth
    ctx.strokeStyle = borderColor
    ctx.strokeRect( x, y, width, height )

    // restore the context
    ctx.restore()
}

/**
 * Draws text with provided specifications
 * @param {CanvasRenderingContext2D} ctx canvas context to draw on
 * @param {string} text text to be drawn
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {string} font font to use
 * @param {string} color color of text
 * @param {CanvasTextAlign} alignment horizontal alignment
 * @param {CanvasTextBaseline} baseline vertical allignment
 */
function drawText( ctx, text, x, y, font, color, alignment /** @type {CanvasTextAlign} */, baseline )
{
    // save the context
    ctx.save()

    // set the context to given specs
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = alignment
    ctx.textBaseline = baseline
    // draw the text
    ctx.fillText( text, x, y )

    // restore the context
    ctx.restore()
}

/**
 * Draws a line with provided specifications
 * @param {CanvasRenderingContext2D} ctx canvas context to draw on
 * @param {*} sx starting x coordinate
 * @param {*} sy starting y coordinate
 * @param {*} ex ending x coordinate
 * @param {*} ey ending y coordinate
 * @param {*} color color of line
 * @param {*} width width of line
 */
function drawLine( ctx, sx, sy, ex, ey, color, width )
{
    // save the context
    ctx.save()

    // set the context to given specs
    ctx.strokeStyle = color
    ctx.lineWidth = width

    // draw the line
    ctx.beginPath()
    ctx.moveTo( sx, sy )
    ctx.lineTo( ex, ey )
    ctx.stroke()

    // restore the context
    ctx.restore()
}


/**
 * Gets the dimensions of a text with given font
 * @param {string} font font to be used while measuring dimensions 
 * @param {string} text text to get dimensions for 
 * @returns {{width: number, height: number}} dimensions of the text
 */
function getTextDimensions( font, text )
{
    // Create a temporary canvas context
    const canvas = document.createElement( 'canvas' )
    const ctx = canvas.getContext( '2d' )

    // Set the font to the context
    ctx.font = font

    // Measure the text dimensions
    let textMetrics = ctx.measureText( text )

    // return the dimensions
    // textMetrics.width gives the width of the text
    // textMetrics.actualBoundingBoxAscent gives the height of the text above the baseline
    // textMetrics.actualBoundingBoxDescent gives the height of the text below the baseline
    return { width: textMetrics.width, height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent }
}

export { drawRectangle, drawText, drawLine, getTextDimensions }