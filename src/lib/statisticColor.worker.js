
const statisticColors = (color) => {
    let R = new Array(256).fill(0);
    let G = new Array(256).fill(0);
    let B = new Array(256).fill(0);
    for (let i = 0; i < color.length; i += 4) {
        R[color[i]]++;
        G[color[i + 1]]++;
        B[color[i + 2]]++;
    }
    return [R, G, B];
};

onmessage = function (e) {
    let data = e.data;
    let res = statisticColors(data);
    postMessage(res);
}