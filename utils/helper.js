import { ctx } from "../driver.js"

/**
 * Draws a solid rectangle with provided specifications
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number} width width of rectangle
 * @param {number} height height of rectangle
 * @param {string} fillColor color of rectangle
 * @param {string} borderColor color of border
 * @param {number} borderWidth thickness of border
 */
function drawRectangle( x, y, width, height, fillColor, borderColor, borderWidth )
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
 * @param {string} text text to be drawn
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {string} font font to use
 * @param {string} color color of text
 * @param {string} alignment horizontal allignment
 * @param {string} baseline vertical allignment
 */
function drawText( text, x, y, font, color, alignment, baseline )
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

function drawLine( sx, sy, ex, ey, color, width )
{
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo( sx, sy )
    ctx.lineTo( ex, ey )
    ctx.stroke()
    ctx.restore()
}



function getTextDimensions( font, text )
{
    ctx.save()
    ctx.font = font
    let textMetrics = ctx.measureText( text )
    ctx.restore()

    return { width: textMetrics.width, height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent }
}

export { drawRectangle, drawText, drawLine, getTextDimensions }