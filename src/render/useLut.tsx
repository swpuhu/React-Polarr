import {LutFiltersType} from "../types/type";
import flowerStone from "./lutImages/vintage/Flower Stone.cube.jpeg";
import fluorite from "./lutImages/vintage/Fluorite.cube.jpeg";
import fluoriteBlue from "./lutImages/vintage/Fluorite Blue Sky.cube.jpeg";
import fluoriteVenus from "./lutImages/vintage/Fluorite Venus.cube.jpeg";
import fuchsite from "./lutImages/vintage/Fuchsite.cube.jpeg";
import talc from "./lutImages/vintage/Talc.cube.jpeg";
import tanzanite from "./lutImages/vintage/Tanzanite.cube.jpeg";
import tektite from "./lutImages/vintage/Tektite.cube.jpeg";
import thulite from "./lutImages/vintage/Thulite.cube.jpeg";
import obsidian from "./lutImages/cinema/Obsidian.cube.jpeg";
import okenite from "./lutImages/cinema/Okenite.cube.jpeg";
import oligoclase from "./lutImages/cinema/Oligoclase.cube.jpeg";
import onyx from "./lutImages/cinema/Onyx.cube.jpeg";
import opal from "./lutImages/cinema/Opal.cube.jpeg";
import opalite from "./lutImages/cinema/Opalite.cube.jpeg";
import orpiment from "./lutImages/cinema/Orpiment.cube.jpeg";
import pearl from "./lutImages/cinema/Pearl.cube.jpeg";
import peridot from "./lutImages/cinema/Peridot.cube.jpeg";
import petalite from "./lutImages/cinema/Petalite.cube.jpeg";
import {loadImages} from "../lib/util";
import {globalEvents} from "../lib/globalEvents";

const lutsImageSrc: Partial<LutFiltersType<string>> = {
    flowerStone: flowerStone,
    fluorite: (fluorite),
    fluoriteBlue: (fluoriteBlue),
    fluoriteVenus: (fluoriteVenus),
    fuchsite: (fuchsite),
    talc: (talc),
    tanzanite: (tanzanite),
    tektite: (tektite),
    thulite: (thulite),
    obsidian: (obsidian),
    okenite: (okenite),
    oligoclase: (oligoclase),
    onyx: (onyx),
    opal: (opal),
    opalite: (opalite),
    orpiment: (orpiment),
    pearl: (pearl),
    peridot: (peridot),
    petalite: (petalite),
};

let lutsImage: Partial<LutFiltersType<ImageBitmap>>;
setTimeout(() => {
    loadImages(lutsImageSrc).then((images) => {
        lutsImage = images;
        globalEvents.dispatch('manifestLoaded', lutsImage);
        console.log('load lut ok!');
    });

}, 50);

export const useLut = () => {
    const getLuts = () => {
        return lutsImage;
    };
    return {
        getLuts
    }
};