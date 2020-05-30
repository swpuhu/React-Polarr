import {dragable} from "../lib/util";

export const Histogram = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.classList.add('histogram');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    dragable(canvas, (e) => {}, (e) => {console.log('move')});
    const draw = (r: Array<number>, g: Array<number>, b: Array<number>) => {
        let step = width / 256;
        if (ctx) {
            ctx.lineWidth = 2;
            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = '#aa0000';
            ctx.strokeStyle = '#ff0000';
            ctx.clearRect(0, height - 0, width, height);
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < r.length; i++) {
                ctx.lineTo(i * step, height - r[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#00aa00';
            ctx.strokeStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < g.length; i++) {
                ctx.lineTo(i * step, height - g[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


            ctx.fillStyle = '#0000aa';
            ctx.strokeStyle = '#0000ff';
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < b.length; i++) {
                ctx.lineTo(i * step, height - b[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    return {
        draw,
        canvasElement: canvas
    }
};