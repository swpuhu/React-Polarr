export const Histogram = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.classList.add('histogram');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const draw = (r: Array<number>, g: Array<number>, b: Array<number>) => {
        let step = width / 256;
        if (ctx) {
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = '#ff0000';
            ctx.clearRect(0, height - 0, width, height);
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < r.length; i++) {
                ctx.lineTo(i * step, height - r[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < g.length; i++) {
                ctx.lineTo(i * step, height - g[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();


            ctx.fillStyle = '#0000ff';
            ctx.beginPath();
            ctx.moveTo(0, height - 0);
            for (let i = 0; i < b.length; i++) {
                ctx.lineTo(i * step, height - b[i]);
            }
            ctx.lineTo(width, height - 0);
            ctx.closePath();
            ctx.fill();
        }

    }
    return {
        draw,
        canvasElement: canvas
    }
};