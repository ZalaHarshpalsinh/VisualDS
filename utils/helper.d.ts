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
export function drawRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fillColor: string, borderColor: string, borderWidth: number): void;
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
export function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string, alignment: CanvasTextAlign, baseline: CanvasTextBaseline): void;
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
export function drawLine(ctx: CanvasRenderingContext2D, sx: any, sy: any, ex: any, ey: any, color: any, width: any): void;
/**
 * Gets the dimensions of a text with given font
 * @param {string} font font to be used while measuring dimensions
 * @param {string} text text to get dimensions for
 * @returns {{width: number, height: number}} dimensions of the text
 */
export function getTextDimensions(font: string, text: string): {
    width: number;
    height: number;
};
