import { ctx } from "../driver.js"

/**
 * Draws a solid rectangle with provided specifications
 * @param {number} x X coordinate
 * @param {number} y Y coordinate
 * @param {number} width width of rectangle
 * @param {number} height height of rectangle
 * @param {string} fillColor color of rectangle
 * @param {string} borderColor color of border of rectangle
 */
function drawRectangle( x, y, width, height, fillColor, borderColor )
{
    // save the context
    ctx.save()

    // Draw box
    ctx.fillStyle = fillColor
    ctx.fillRect( x, y, width, height )
    // Draw the border
    ctx.strokeStyle = borderColor
    ctx.strokeRect( x, y, width, height )

    // restore the context
    ctx.restore()
}

/**
 * Draws text with provided specifications
 * @param {*} text text to be drawn
 * @param {*} x X coordinate
 * @param {*} y Y coordinate
 * @param {*} font font to use
 * @param {*} color color of text
 * @param {*} alignment horizontal allignment
 * @param {*} baseline vertical allignment
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

export { drawRectangle, drawText }