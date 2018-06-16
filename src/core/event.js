import {mapTo} from "rxjs/operators/index";
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

export const keyMap = {
    down: Object.freeze({
        keyCode: 'ArrowDown',
        event: Event.DOWN
    }),

    left: Object.freeze({
        keyCode: 'ArrowLeft',
        event: Event.LEFT
    }),

    right: Object.freeze({
        keyCode: 'ArrowRight',
        event: Event.RIGHT
    }),

    fall: Object.freeze({
        keyCode: 'KeyX',
        event: Event.FALL
    }),

    rotate: Object.freeze({
        keyCode: 'KeyZ',
        event: Event.ROTATE
    })
};

export const keyOb = Observable.fromEvent(window, 'keydown')
    .debounceTime(80)
    .map(keyEvent => {
        let event = null;
        if (keyEvent.code === keyMap.down.keyCode) {
            event = keyMap.down.event
        } else if (keyEvent.code === keyMap.left.keyCode) {
            event = keyMap.left.event
        } else if (keyEvent.code === keyMap.right.keyCode) {
            event = keyMap.right.event
        } else if (keyEvent.code === keyMap.fall.keyCode) {
            event = keyMap.fall.event
        } else if (keyEvent.code === keyMap.rotate.keyCode) {
            event = keyMap.rotate.event
        }
        return event;
    })
    .filter(event => !!event);

export const gravityOb = Observable.interval(800)
    .timeInterval()
    .pipe(mapTo(Event.DOWN));
