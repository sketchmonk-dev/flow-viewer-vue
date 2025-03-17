export interface Point {
    x: number;
    y: number;
}
export function p(x: number, y: number): Point {
    return { x, y };
}

export interface NodeGuides {
    /**
     * The left guide of the source node
     */
    l: number;
    /**
     * The right guide of the source node
     */
    r: number;
    /**
     * The top guide of the source node
     */
    t: number;
    /**
     * The bottom guide of the source node
     */
    b: number;
    /**
     * The horizontal center guide of the source node
     */
    hc: number;
    /**
     * The vertical center guide of the source node
     */
    vc: number;
}

/**
 * The grid guides are guideline values used to draw connection between two nodes - source and target.
 * The values are generated on the basis of DOMRect of the source and target nodes and the margin and radius of the curve.
 */
export interface GridGuides {
    /**
     * The left and right margin guides (margins used to keep a gap between connection line and nodes)
     */
    m: {
        /**
         * The left margin guide
         */
        l: number;
        /**
         * The right margin guide
         */
        r: number;
    };
    /**
     * The guides for the source node
     */
    s: NodeGuides;
    /**
     * The guides for the target node
     */
    t: NodeGuides;
    /**
     * The vertical center guide for the gap between source and target nodes
     */
    vc: number;
}

export type SourceSide = 'left' | 'bottom' | 'right';
export type TargetSide = 'left' | 'top' | 'right';

export interface FlowViewerOptions {
    margin: number;
    /**
     * The corner radius for connections
     */
    cornerRadius: number;
    idPrefix: string;
}