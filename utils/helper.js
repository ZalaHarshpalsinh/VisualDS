import { ctx } from "../driver.js"

function drawRectangle(x, y, width, height, fillColor, borderColor )
{
    ctx.save()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)

    // Draw the border
    ctx.strokeStyle = borderColor
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
}

function drawText(text, x, y, font, color, alignment, baseline)
{
    ctx.save()
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = alignment
    ctx.textBaseline = baseline
    ctx.fillText(text, x , y)
    ctx.restore()
}

export {drawRectangle, drawText}