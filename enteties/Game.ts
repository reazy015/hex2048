import { Layout } from './Layout';
import {Orientation} from './Orientation';
import { Point } from './Point';
import { getValueForEmptyCells } from '../api';

export class Game {
    private key_directions = {
        w: {
            axis: 'x',
            direction: 'top'
        },
        e: {
            axis: 'z',
            direction: 'bottom'
        },
        q: {
            axis: 'y',
            direction: 'top'
        },
        a: {
            axis: 'z',
            direction: 'top',
        },
        s: {
            axis: 'x',
            direction: 'bottom',
        },
        d: {
            axis: 'y',
            direction: 'bottom'
        }
    }

    private hash_radius_list = {
        '#test2': 1,
        '#test3': 2,
        '#test4': 3
    }

    private key_pressed_status = {
        pressed: false,
        key: undefined
    }

    private layout: Layout;

    private layout_radius: number;

    public status = 'playing';

    private rng_source = 'http://68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud/'

    constructor() {
        document.addEventListener('keydown', (e) => {
            if(!this.key_pressed_status.pressed) {
                this.key_pressed_status.pressed = true;
                this.key_pressed_status.key = e.key;
                this.layout.recalculateMap(this.key_directions[e.key].axis, this.key_directions[e.key].direction);
                getValueForEmptyCells(this.layout.coordsWithValues, this.layout_radius + 1, this.rng_source).then((data) => this.layout.coordsWithValues = data);
                this.layout.drawCanvas();
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === this.key_pressed_status.key) {
                this.key_pressed_status.pressed = false;
                this.key_pressed_status.key = undefined;

                if (this.layout.getTotalHexValueScore() === 2048) {
                    this.status = 'victory'

                    alert('You\'ve got the score! 2048!')
                }
            }
        });
    }

    public init(radius: number, rngSource?: string) {
        const canvas = <HTMLCanvasElement>document.getElementById('canvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        this.layout_radius = window.location.hash ? this.hash_radius_list[window.location.hash] : radius;
        this.rng_source = rngSource ? rngSource : this.rng_source;

        this.layout = new Layout(new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0),
            2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0,
            0.0,), new Point(65, 65), new Point(width / 2, height / 2), context);

        this.layout.generateMapCoords(this.layout_radius);
        getValueForEmptyCells(this.layout.coordsWithValues, this.layout_radius + 1, this.rng_source).then((data) => this.layout.coordsWithValues = data);
        this.layout.drawCanvas();
    }
}
