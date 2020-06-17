interface globalEvent {
    [propsName: string]: Function[]
}
const GlobalEvents = () => {
    const eventList: globalEvent = {};
    const on = (name: string, fn: Function) => {
        if (!eventList[name]) {
            eventList[name] = [];
        }
        fn && eventList[name].push(fn);
    };

    const off = (name: string, fn: Function) => {
        if (!eventList[name]) return;
        let index = eventList[name].indexOf(fn);
        if (index > -1) {
            eventList[name].splice(index, 1);
        }
    };

    const dispatch = function (name: string, ...args: any) {
        if (!eventList[name]) return;
        for (let i = 0; i < eventList[name].length; i++) {
            eventList[name][i](...args);
        }
    };
    return {
        on,
        off,
        dispatch,
    }
};

export const globalEvents = GlobalEvents();