import {getAvg} from "./util";

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
    let avgR = getAvg(R);
    let avgG = getAvg(G);
    let avgB = getAvg(B);
    // let avg = (avgR + avgG + avgB) / 3;
    let avg = Math.max(avgR, avgB, avgG);
    for (let i = 0; i < 256; i++) {
        R[i] = ~~(height / avg * R[i]);
        G[i] = ~~(height / avg * G[i]);
        B[i] = ~~(height / avg * B[i]);
    }
    return [R, G, B];
};

onmessage = function (e) {
    let [data, height] = e.data;
    let res = statisticColors(data, height);
    postMessage(res);
}