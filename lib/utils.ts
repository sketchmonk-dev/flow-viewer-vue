import { type GridGuides, p, type Point, type SourceSide, type TargetSide } from "./common";
import * as c from './path-commands';

/**
 * Computes the grid guides for aligning a source rectangle and a target rectangle.
 *
 * @param sourceRect - The bounding rectangle of the source element.
 * @param targetRect - The bounding rectangle of the target element.
 * @param offset - The x/y co-ordinates of the parent element used to adjust the position of the grid guides relatively.
 * @param margin - The margin to be applied around the rectangles (default is 12).
 * @returns An object containing the grid guides for the source and target rectangles.
 */
export function computeGridGuides(
    sourceRect: DOMRect,
    targetRect: DOMRect,
    offset: Point,
    margin = 12,
): GridGuides {
    return {
        m: {
            l: Math.min(sourceRect.left, targetRect.left) - margin - offset.x,
            r: Math.max(sourceRect.right, targetRect.right) + margin - offset.x,
        },
        s: {
            l: sourceRect.left - offset.x,
            r: sourceRect.right - offset.x,
            t: sourceRect.top - offset.y,
            b: sourceRect.bottom - offset.y,
            hc: (sourceRect.left + sourceRect.width / 2) - offset.x,
            vc: (sourceRect.top + sourceRect.height / 2) - offset.y,
        },
        t: {
            l: targetRect.left - offset.x,
            r: targetRect.right - offset.x,
            t: targetRect.top - offset.y,
            b: targetRect.bottom - offset.y,
            hc: (targetRect.left + targetRect.width / 2) - offset.x,
            vc: (targetRect.top + targetRect.height / 2) - offset.y,
        },
        vc: (sourceRect.bottom + targetRect.top) / 2 - offset.y,
    }
}

// generate points for the path between source and target nodes
/**
 * Generates an array of points representing a path between a source and target side based on the provided grid guides.
 *
 * @param guides - An object containing grid guide coordinates.
 * @param sourceSide - The side of the source element ('left', 'right', or other).
 * @param targetSide - The side of the target element ('left', 'top', or other).
 * @returns An array of points representing the path.
 */
export function generatePathPoints(
    guides: GridGuides,
    sourceSide: SourceSide,
    targetSide: TargetSide,
) {
    const points: Point[] = [];
    const { s, t, m, vc } = guides;
    // add points from source
    if (sourceSide === 'left') {
        points.push(
            p(s.l, s.vc),
            p(m.l, s.vc),
            p(m.l, vc),
        )
    }
    else if (sourceSide === 'right') {
        points.push(
            p(s.r, s.vc),
            p(m.r, s.vc),
            p(m.r, vc),
        )
    }
    else {
        points.push(
            p(s.hc, s.b),
            p(s.hc, vc),
        )
    }
    // add points from target
    if (targetSide === 'left') {
        points.push(
            p(m.l, vc),
            p(m.l, t.vc),
            p(t.l, t.vc),
        )
    } else if (targetSide === 'top') {
        points.push(
            p(t.hc, vc),
            p(t.hc, t.t),
        )
    } else {
        points.push(
            p(m.r, vc),
            p(m.r, t.vc),
            p(t.r, t.vc),
        )
    }
    // cleanup - remove any repeated points
    for (let i=1; i < points.length; i++) {
        const cur = points[i];
        const prev = points[i-1];
        if (cur.x === prev.x && cur.y === prev.y) {
            points.splice(i, 1);
            i--;
        }
    }

    return points;
}


/**
 * Generates a path string based on the provided grid guides, source side, target side, and optional radius.
 *
 * @param guides - An object containing the grid guides with properties `s`, `t`, `m`, and `vc`.
 * @param sourceSide - The side of the source element ('left', 'bottom', or other).
 * @param targetSide - The side of the target element ('left', 'top', or other).
 * @param radius - The radius for the path curves (default is 8).
 * @returns A string array of path commands.
 */
export function generatePathString(
    guides: GridGuides,
    sourceSide: SourceSide,
    targetSide: TargetSide,
    radius = 8,
) {
    const { s, t, m, vc } = guides;
    const r = radius; // for brevity
    const commands: string[] = [];
    // add source commands
    if (sourceSide === 'left') {
        commands.push(
            c.move(p(s.l, s.vc)),
            c.horizontal(m.l+r),
            c.quadraticBezier(p(m.l, s.vc), p(m.l, s.vc+r)),
            c.vertical(vc-r)
        )
    } else if (sourceSide === 'bottom') {
        commands.push(
            c.move(p(s.hc, s.b)),
            c.vertical(vc-r),
        )
    } else {
        commands.push(
            c.move(p(s.r, s.vc)),
            c.horizontal(m.r-r),
            c.quadraticBezier(p(m.r, s.vc), p(m.r, s.vc+r)),
            c.vertical(vc-r)
        )
    }
    // add source -> target join commands
    if (sourceSide === 'left') {
        if (targetSide === 'left') {
            commands.push(c.vertical(vc+r))
        } else if (targetSide === 'top') {
            commands.push(
                c.quadraticBezier(p(m.l, vc), p(m.l+r, vc)),
                c.horizontal(t.hc-r),
                c.quadraticBezier(p(t.hc, vc), p(t.hc, vc+r)),
            )
        } else {
            commands.push(
                c.quadraticBezier(p(m.l, vc), p(m.l+r, vc)),
                c.horizontal(t.hc-r),
                c.horizontal(t.hc+r),
                c.horizontal(m.r-r),
                c.quadraticBezier(p(m.r, vc), p(m.r, vc+r)),
            )
        }
    } else if (sourceSide === 'bottom') {
        if (targetSide === 'left') {
            commands.push(
                c.quadraticBezier(p(s.hc, vc), p(s.hc-r, vc)),
                c.horizontal(m.l+r),
                c.quadraticBezier(p(m.l, vc), p(m.l, vc+r)),
            )
        } else if (targetSide === 'top') {
            commands.push(c.vertical(vc+r))
        } else {
            commands.push(
                c.quadraticBezier(p(s.hc, vc), p(s.hc+r, vc)),
                c.horizontal(m.r-r),
                c.quadraticBezier(p(m.r, vc), p(m.r, vc+r)),
            )
        }
    } else {
        if (targetSide === 'left') {
            commands.push(
                c.quadraticBezier(p(m.r, vc), p(m.r-r, vc)),
                c.horizontal(t.hc-r),
                c.horizontal(t.hc+r),
                c.horizontal(m.l+r),
                c.quadraticBezier(p(m.l, vc), p(m.l, vc+r)),
            )
        } else if (targetSide === 'top') {
            commands.push(
                c.quadraticBezier(p(m.r, vc), p(m.r-r, vc)),
                c.horizontal(t.hc+r),
                c.quadraticBezier(p(t.hc, vc), p(t.hc, vc+r)),
            )
        } else {
            commands.push(c.vertical(vc+r))
        }
    }
    // add target commands
    if (targetSide === 'left') {
        commands.push(
            c.vertical(t.vc-r),
            c.quadraticBezier(p(m.l, t.vc), p(m.l+r, t.vc)),
            c.horizontal(t.l),
        )
    } else if (targetSide === 'top') {
        commands.push(
            c.vertical(t.t)
        )
    } else {
        commands.push(
            c.vertical(t.vc-r),
            c.quadraticBezier(p(m.r, t.vc), p(m.r-r, t.vc)),
            c.horizontal(t.r),
        )
    }
    return commands.join(' ');
}