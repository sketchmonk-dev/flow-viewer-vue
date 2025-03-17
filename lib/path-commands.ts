/**
 * @module lib/drawing
 * This file contains utility functions for common svg path commands
 */

import { Point } from "./common";

/**
 * Generates an SVG move command for the given point.
 *
 * @param point - The point to move to, represented by an object with `x` and `y` properties.
 * @returns A string representing the SVG move command.
 */
export function move(point: Point) {
    return `M ${point.x} ${point.y}`;
}

/**
 * Generates an SVG path command for a horizontal line.
 *
 * @param x - The x-coordinate to draw the horizontal line to.
 * @returns An SVG path command string for a horizontal line.
 */
export function horizontal(x: number) {
    return `H ${x}`;
}

/**
 * Generates an SVG path command for a vertical line to the specified y-coordinate.
 *
 * @param y - The y-coordinate to draw the vertical line to.
 * @returns A string representing the SVG path command for a vertical line.
 */
export function vertical(y: number) {
    return `V ${y}`;
}

/**
 * Generates a quadratic Bezier curve command for SVG path data.
 *
 * @param control - The control point for the quadratic Bezier curve.
 * @param end - The end point for the quadratic Bezier curve.
 * @returns A string representing the quadratic Bezier curve command.
 */
export function quadraticBezier(control: Point, end: Point) {
    return `Q ${control.x} ${control.y} ${end.x} ${end.y}`;
}