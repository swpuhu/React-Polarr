import {EditType, Layer, MyImage} from "../types/type";

export const initLayer = (source: MyImage): Layer => {
    return {
        editStatus: EditType.none,
        source: source,
        position: {
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 1
        },
        originPosition: {
            x1: 0,
            y1: 0,
            x2: 1,
            y2: 1
        },
        transform: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            scaleX: 1,
            scaleY: 1,
            offsetX: 0,
            offsetY: 0,
            rotate: 0
        },
        color: {
            temperature: 0,
            tint: 0
        }
    }
};

export const dragable = (container: HTMLElement,
                         mousedown?: (e: MouseEvent | TouchEvent) => void,
                         mousemove?: (e: MouseEvent | TouchEvent) => void,
                         mouseup?: (e: MouseEvent | TouchEvent) => void) => {
    container.addEventListener('mousedown', (e: MouseEvent) => {
        mousedown && mousedown(e);
        const move = (ev: MouseEvent) => {
            mousemove && mousemove(ev);
        };

        const up = (ev: MouseEvent) => {
            mouseup && mouseup(ev);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mousemove', up);
    });

    container.addEventListener('touchstart', (e: TouchEvent) => {
        mousedown && mousedown(e);
        let startX = container.offsetLeft;
        let startY = container.offsetTop;
        const move = (ev: TouchEvent) => {
            let offsetX = ev.touches[0].clientX - e.touches[0].clientX;
            let offsetY = ev.touches[0].clientY - e.touches[0].clientY;
            container.style.left = startX + offsetX + 'px';
            container.style.top = startY + offsetY + 'px';
            mousemove && mousemove(ev);
        };

        const up = (ev: TouchEvent) => {
            mouseup && mouseup(ev);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', up);
        };
        document.addEventListener('touchmove', move);
        document.addEventListener('touchend', up);
    });
};