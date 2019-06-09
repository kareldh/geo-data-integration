import axios from 'axios';
import ldfetch from "ldfetch";
import {DATASET_URL} from "./const";
import {tile2boundingBox} from "../../tileUtils";

let REACT_APP_WEGENREGISTER_ANTWERPEN_URL="http://portaal-stadantwerpen.opendata.arcgis.com/datasets/6bad868c084a43ef8031cfe1b96956b2_297.geojson";

export function loadNodesLineStringsWegenregisterAntwerpen(){
    return new Promise((resolve, reject) => {
        axios.get(REACT_APP_WEGENREGISTER_ANTWERPEN_URL)
            .then((data) => { resolve(data.data.features) })
            .catch((error) => { reject(error) })
    });
}

export function fetchRoutableTile(z, x, y) {
    return new Promise((resolve,reject) => {
        try{
            let fetch = new ldfetch({headers: {accept: 'application/ld+json'}});
            fetch.get(DATASET_URL + z + "/" + x + "/" + y).then(
                response => {
                    resolve(response)
                }
            )
        }
        catch(e){
            reject(e);
        }
    });
}

export function fetchOsmData(latLower,latUpper,longLower,longUpper) {
    return new Promise((resolve, reject) => {
        axios.get("https://api.openstreetmap.org/api/0.6/map?bbox="+longLower+","+latLower+","+longUpper+","+latUpper)
            .then((data) => resolve(data.data))
            .catch((error) => {
                reject(error)
            })
    })
}

export function fetchOsmTileData(zoom,tileX,tileY) {
    let boundingBox = tile2boundingBox(tileX,tileY,zoom);
    return fetchOsmData(boundingBox.latLower,boundingBox.latUpper,boundingBox.longLower,boundingBox.longUpper)
}