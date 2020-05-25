export const Histogram = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const draw = (r: Array<number>, g: Array<number>, b: Array<number>) => {
        let step = width / 256;
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#fff';
            for (let i = 0; i < r.length; i++) {
                ctx.moveTo(i * step, 0);
                ctx.lineTo(i * step, r[i]);
            }
            ctx.stroke();
        }

    }
    return {
        draw,
        canvasElement: canvas
    }
};