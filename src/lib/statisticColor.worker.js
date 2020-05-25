
const statisticColors = (color, height) => {
    let R = new Array(256).fill(0);
    let G = new Array(256).fill(0);
    let B = new Array(256).fill(0);
    let max = 0;
    for (let i = 0; i < color.length; i += 4) {
        R[color[i]]++;
        G[color[i + 1]]++;
        B[color[i + 2]]++;
        max = Math.max(max, R[color[i]], G[color[i + 1]], G[color[i + 2]]);
    }

    for (let i = 0; i < 256; i++) {
        R[i] = ~~(height / max * R[i]);
        G[i] = ~~(height / max * G[i]);
        B[i] = ~~(height / max * B[i]);
    }
    return [R, G, B];
};

onmessage = function (e) {
    let [data, height] = e.data;
    let res = statisticColors(data, height);
    postMessage(res);
}