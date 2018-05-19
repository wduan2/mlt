/*
 * Movement, taking the top left corner of the grid as the origin.
 */
export default class Event {

    static LEFT = Object.freeze({
        pos: [0, -1]
    });

    static RIGHT = Object.freeze({
        pos: [0, 1]
    });

    static DOWN = Object.freeze({
        pos: [1, 0]
    });

    static ROTATE = Object.freeze({
        pos: [0, 0]
    });

    static FALL = Object.freeze({
        pos: [0, 0]
    });
}
