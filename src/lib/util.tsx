import {AdaptionType, EditType, Layer, LutFiltersType, MyImage, Picture, StateType} from "../types/type";

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
            editingProperty: '',
            temperature: 0,
            tint: 0,
            hue: 0,
            saturation: 0
        },
        effect: {
            editingProperty: '',
            colorOffset: 0
        },
        filter: {
            currentCategory: 'vintage',
            type: 'normal',
            intensity: 100
        }
    }
};

export const clamp = (x: number, min: number, max: number) => {
    if (x < min) {
        x = min;
    } else if (x > max) {
        x = max;
    }
    return x;
};

export const dragable = (container: HTMLElement,
                         mousedown?: (e: MouseEvent | TouchEvent) => void,
                         mousemove?: (offsetX: number, offsetY: number) => void,
                         mouseup?: (e: MouseEvent | TouchEvent) => void,
                         allowX = true,
                         allowY = true,
                         minX = 0,
                         maxX = Infinity,
                         minY = 0,
                         maxY = Infinity) => {
    const mousedownHandler = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        mousedown && mousedown(e);
        const move = (ev: MouseEvent) => {
        };

        const up = (ev: MouseEvent) => {
            mouseup && mouseup(ev);
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        };
        document.addEventListener('mousemove', move);
        document.addEventListener('mousemove', up);
    };
    const touchstartHandler = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        mousedown && mousedown(e);
        let startX = container.offsetLeft;
        let startY = container.offsetTop;
        const move = (ev: TouchEvent) => {
            let offsetX = ev.touches[0].clientX - e.touches[0].clientX;
            let offsetY = ev.touches[0].clientY - e.touches[0].clientY;
            let left = minX, top = minY;
            if (allowX) {
                left = ~~clamp(offsetX + startX, minX, maxX);
                container.style.left = left + 'px';
            }
            if (allowY) {
                top = ~~clamp(offsetY + startY, minY, maxY);
                container.style.top = top + 'px';
            }
            mousemove && mousemove(left, top);
        };

        const up = (ev: TouchEvent) => {
            mouseup && mouseup(ev);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('touchend', up);
        };
        document.addEventListener('touchmove', move);
        document.addEventListener('touchend', up);
    };
    container.addEventListener('mousedown', mousedownHandler);
    container.addEventListener('touchstart', touchstartHandler);
    return {
        'mousedown': mousedownHandler,
        'touchstart': touchstartHandler
    }
};

export const throttle = function (fn: (...args: any) => any, delay = 50) {
    // @ts-ignore
    let self = this;
    let timer: number;
    return function (...args: any) {
        if (timer) {
            return;
        }
        timer = setTimeout(() => {
            timer = 0;
            clearTimeout(timer);
            fn.apply(self, args);
        }, delay);
    }
};

export const debounce = function (fn: (...args: any) => any, delay = 50) {
    let timer: number;
    // @ts-ignore
    let self = this;
    return function (...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(self, args);
        }, delay);
    }
};


export const saveCanvasPicture = (canvas: HTMLCanvasElement, name: string) => {
    return new Promise(resolve => {
        canvas.toBlob(function (blob) {
            let href = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = href;
            a.download = name;
            a.click();
            resolve();
        }, "image/jpeg");
    })
};

export const getAvg = (array: number[]) => {
    return array.reduce((prev, curr) => {
        prev += curr;
        return prev;
    }) / array.length;
};


export function updateLayerSubProperty<T extends keyof Layer> (state: StateType, payload: Layer[T][keyof Layer[T]], property: T, subProperty: keyof Layer[T],) {
    if (state.currentLayer) {
        let newLayer = {...state.currentLayer};
        newLayer[property][subProperty] = payload;

        return {
            ...state,
            currentLayer: newLayer,
        }
    }
    return state;
}


export function updateLayerProperty<T extends keyof Layer> (state: StateType, payload: Layer[T], property: T) {
    if (state.currentLayer) {
        let newLayer = {...state.currentLayer};
        newLayer[property] = payload;

        return {
            ...state,
            currentLayer: newLayer,
        }
    }
    return state;
}

export function isDetachedDOM (dom: HTMLElement): boolean {
    if (!dom) return true;
    if (!dom.parentElement) return dom !== document.children[0];
    return isDetachedDOM(dom.parentElement);
}


export function switchHandler <T>(left: number, right: number, top: number, bottom: number, x: number, y: number, handlers: T[]): T | null {
    let width = right - left;
    let height = bottom - top;
    left = left + width / 3;
    top = top + height /  3;
    width /= 3;
    height /= 3;
    if (x < left && y < top) {
        return handlers[0];
    } else if (x > left && x < left + width && y < top) {
        return handlers[1];
    } else if (x > left + width && y < top) {
        return handlers[2];
    } else if (x < left && y > top && y < top + height) {
        return handlers[3];
    } else if (x > left && x < left + width && y > top && y < top + height) {
        return handlers[4];
    } else if (x > left + width && y > top && y < top + height) {
        return handlers[5];
    } else if (x < left && y > top + height) {
        return handlers[6];
    } else if (x > left && x < left + width && y > top + height) {
        return handlers[7];
    } else if (x > left + width && y > top + height) {
        return handlers[8];
    }
    return null;
}

export function findAdaption(obj: Picture, aspect: number, reverse?: boolean) {
    if (obj.width / obj.height > aspect) {
        return reverse ? AdaptionType.heightAdaption : AdaptionType.widthAdaption;
    } else {
        return reverse ? AdaptionType.widthAdaption : AdaptionType.heightAdaption ;
    }
}

export function loadImage (src: string) {
    return new Promise(resolve => {
        let image = new Image();
        image.onload = () => {
            createImageBitmap(image).then((bitmap) => {
                resolve(bitmap);
            });
        };
        image.src = src;
    });
}

export async function loadImages (srcObject: Partial<LutFiltersType<string>>) {
    let obj: Partial<LutFiltersType<ImageBitmap>> = {};
    for (let key in srcObject) {
        // @ts-ignore
        (obj[key] as ImageBitmap) = await loadImage(srcObject[key]);
    }
    return obj;
}

function getObjectName (obj: any): string {
    return Object.prototype.toString.call(obj);
}
export function clone (obj: any[] | Object): any {
    let res;
    if (Array.isArray(obj)) {
        res = [];
        for (let item of obj) {
            if (getObjectName(obj) === '[object Object]' || Array.isArray(item)) {
                res.push(clone(item));
            } else {
                res.push(item);
            }
        }
    } else if (typeof obj === 'object') {
        res = {};
        for (let key in obj) {
            // @ts-ignore
            if (getObjectName(obj[key]) === '[object Object]' || Array.isArray(obj[key])) {
                // @ts-ignore
                res[key] = clone(obj[key]);
            } else {
                // @ts-ignore
                res[key] = obj[key];
            }
        }
    }
    return res
}


export const getLastState = (state: StateType[]) => {
    let current, next;
    for (let i = 0; i < state.length; i++) {
        current = state[i];
        next = state[i + 1];
        if (next && !next.trackable) {
            return current;
        }
    }
    return state[state.length - 1];
};

export const getLastStateIndex = (state: StateType[]) => {
    let current, next;
    for (let i = 0; i < state.length; i++) {
        current = state[i];
        next = state[i + 1];
        if (next && !next.trackable) {
            return i;
        }
    }
    return state.length - 1;
};