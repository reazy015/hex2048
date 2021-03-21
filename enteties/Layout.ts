import { Point } from './Point';
import { Orientation } from './Orientation';
import { Hex } from './Hex';
import { sumValuesList } from '../utilities/sumValuesList';
import {colorPalette} from '../const/colorPallete';

export class Layout {
    private mapCoords: Hex[] = [];
    private radius: number;

    constructor(public orientation: Orientation, public size: Point, public origin: Point, public canvasContext: CanvasRenderingContext2D) {
        this.orientation = orientation;
        this.size = size;
        this.origin = origin;
        this.canvasContext = canvasContext;
    }

    private hexToPixel(h: Hex) {
        const M: Orientation = this.orientation;
        const size: Point = this.size;
        const origin: Point = this.origin;
        const x: number = (M.f0 * h.x + M.f1 * h.y) * size.x;
        const y: number = (M.f2 * h.x + M.f3 * h.y) * size.y;
        return new Point(x + origin.x, y + origin.y);
    }

    public generateMapCoords(radius: number) {
        this.radius = radius;
        for(let x = -radius; x <= radius; x++) {
            const r1 = Math.max(-radius, -x - radius);
            const r2 = Math.min(radius, -x + radius);

            for(let z = r1; z <= r2; z++) {
                this.mapCoords.push(new Hex(x, -x-z, z, 0));
            }
        }
    }

    private drawHexagon(x: number, y: number, coord: Hex) {
        const a = 2 * Math.PI / 6;
        const r = 60;


        this.canvasContext.beginPath();
        for (let i = 0; i < 6; i++) {
            this.canvasContext.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
        }
        this.canvasContext.closePath();
        this.canvasContext.stroke();
        this.canvasContext.fillStyle = colorPalette[coord.value > 2048 ? 2048 : coord.value].color;
        this.canvasContext.fill();

        this.canvasContext.font = '18px sans-serif';
        this.canvasContext.textAlign = 'center';
        this.canvasContext.textBaseline = 'middle';
        this.canvasContext.fillStyle = '#000';
        this.canvasContext.fillText(`${coord.value ? coord.value : ''}`, x, y);
    }

    private updateShadowDOMCoords(mapCoords: Hex[]) {
        const root = <HTMLDivElement>document.getElementById('dom-hex');
        root.innerHTML = '';

        mapCoords.forEach(coord => {
            const node = document.createElement('div');
            node.setAttribute('data-y', `${coord.y}`);
            node.setAttribute('data-x', `${coord.x}`);
            node.setAttribute('data-z', `${coord.z}`);
            node.setAttribute('data-value', `${coord.value}`);
            if(coord.value) node.innerHTML = `${coord.value}`;

            root.appendChild(node);
        })
    }

    public drawCanvas() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this.canvasContext.clearRect(0,0, windowWidth, windowHeight);

        this.mapCoords.forEach((coord, index) => {
            const point = this.hexToPixel(coord);
            this.drawHexagon(point.x, point.y, coord);
        })

        this.updateShadowDOMCoords(this.mapCoords);
    }

    public recalculateMap(axis, direction) {
        let sumDirection = direction !== 'top';

        for(let i = -this.radius; i <= this.radius; i++) {
            const filteredHexList = this.mapCoords.filter((coord) => coord[axis] === i);
            const hexListValue = filteredHexList.map(hex => hex.value);
            const newCalculatedValuesList = sumValuesList(hexListValue, hexListValue.length, sumDirection);

            for(let j = 0; j < filteredHexList.length; j++) {
                filteredHexList[j].value = newCalculatedValuesList[j];
            }
        }
    }

    get coordsWithValues() {
        return this.mapCoords.filter(coord => coord.value !== 0);
    }

    set coordsWithValues(values) {
        values.forEach((hex) => {
            const mapCoord = this.mapCoords
                .find((coord) => coord.x === hex.x && coord.y === hex.y && coord.z === hex.z );

            if (mapCoord) {
                mapCoord.value = hex.value;
            }
        });

        this.drawCanvas();
    }

    public getTotalHexValueScore() {
        return this.mapCoords.map(hex => hex.value).reduce((sum, current) => {
            return sum + current;
        }, 0)
    }
}
