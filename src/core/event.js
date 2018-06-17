import {mapTo} from "rxjs/operators";
import {Observable} from "rxjs/Rx";

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

export const START = Object.freeze('Start');

export const RESTART = Object.freeze('Restart');

export const RESUME = Object.freeze('Resume');

export const PAUSE = Object.freeze('Pause');

export const KEY_MAP = {
    down: Object.freeze({
        keyCode: 'ArrowDown',
        event: Event.DOWN,
        display: '\u2193'
    }),

    left: Object.freeze({
        keyCode: 'ArrowLeft',
        event: Event.LEFT,
        display: '\u2190'
    }),

    right: Object.freeze({
        keyCode: 'ArrowRight',
        event: Event.RIGHT,
        display: '\u2192'
    }),

    fall: Object.freeze({
        keyCode: 'KeyX',
        event: Event.FALL,
        display: 'X'
    }),

    rotate: Object.freeze({
        keyCode: 'KeyZ',
        event: Event.ROTATE,
        display: 'Z'
    })
};

const keyOb = Observable.fromEvent(window, 'keydown')
    .debounceTime(80)
    .map(keyEvent => {
        let event = null;

        if (keyEvent.code === KEY_MAP.down.keyCode) {
            event = KEY_MAP.down.event
        } else if (keyEvent.code === KEY_MAP.left.keyCode) {
            event = KEY_MAP.left.event
        } else if (keyEvent.code === KEY_MAP.right.keyCode) {
            event = KEY_MAP.right.event
        } else if (keyEvent.code === KEY_MAP.fall.keyCode) {
            event = KEY_MAP.fall.event
        } else if (keyEvent.code === KEY_MAP.rotate.keyCode) {
            event = KEY_MAP.rotate.event
        }

        return event;
    })
    .filter(event => !!event);

const gravityOb = Observable.interval(800)
    .timeInterval()
    .pipe(mapTo(Event.DOWN));

export const gameOb = keyOb.merge(gravityOb);
