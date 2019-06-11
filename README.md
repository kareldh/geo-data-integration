[![Codecov Coverage](https://img.shields.io/codecov/c/github/kareldh/geo-data-integration/master.svg?style=flat-square)](https://codecov.io/gh/kareldh/geo-data-integration/)

## Package that can be used to match lines with the road network of a map

This package is based on the OpenLR location referencing methods to map a linestring to the network of a digital map.

First version where many things can still be improved.

## Usage:

Initialise mapdatabase with lines and nodes:
```Javascript
let n1 = new Node(1,51.2126651,4.4066541);
let n2 = new Node(2,51.2126422,4.4066453);
let n3 = new Node(3,51.2126153,4.4067580);
let n4 = new Node(4,51.2125941,4.4068391);

let l1 = new Line(1,n1,n2);
let l2 = new Line(2,n2,n3);
let l3 = new Line(3,n3,n4);

let nodes = {1: n1, 2: n2, 3: n3, 4: n4};
let lines = {1: l1, 2: l2 ,3: l3};

Let mapDataBase = new MapDataBase(lines,nodes);
```

Encode a line:
```Javascript
let LRP = LineEncoder.encode(mapDataBase,l1,0,0); // mapdatabase, line to encode, positive offset, negative offset
```
or
```Javascript
let location = {
  type: locationTypeEnum.LINE_LOCATION,
  locationLines: [l1],
  posOffset: 0,
  negOffset: 0
};
let LRP = OpenLREncoder.encode(location,mapDataBase);
```

Decode the encoded line:
```Javascript
let decoded = LineDecoder.decode(mapDataBase,LRP.LRPs,LRP.posOffset,LRP.negOffset,decoderProperties);
```
or
```Javascript
let decoded = OpenLRDecoder.decode(LRP,mapDataBase,decoderproperties);
```

Decoderproperties format:
```
let decoderProperties = {
    dist: 5,    // maximum distance (in meter) of a candidate node to a LRP
    bearDiff: 60, // maximum difference (in degrees) between the bearing of a candidate node and that of a LRP
    frcDiff: 3, // maximum difference between the FRC of a candidate node and that of a LRP
    lfrcnpDiff: 3, // maximum difference between the lowest FRC until next point of a candidate node and that of a LRP
    distanceToNextDiff: 40, // maximum difference (in meter) between the found distance between 2 LRPs and the given distanceToNext of the first LRP
    alwaysUseProjections: false, // always use projections, even if direct nodes are found
    useFrcFow: true,  // use the frc and fow values
    distMultiplier: 40, // multiplier for the impact of the distance on the rating of a candidate line
    frcMultiplier: 35, // multiplier for the impact of the functional road class on the rating of a candidate line
    fowMultiplier: 40, // multiplier for the impact of the form of way on the rating of a candidate line
    bearMultiplier: 30, // multiplier for the impact of the bearing on the rating of a candidate line
    maxSPSearchRetries: 200, // maximum amount of shortest path lookups, used to limit decode time
    maxDecodeRetries: 2, // maximum amount of retries when decoding fails with the current distance
    distMultiplierForRetry: 2 // multiplier for the distance value to use when retrying
};
```
### Example initialisation of mapdatabase with [Routable Tiles](https://openplanner.team/specs/2018-11-routable-tiles.html)
```Javascript
fetchRoutableTile(14,8392,5469)
                .then((data)=>{getRoutableTilesNodesAndLines(data.triples)
                    .then((nodesAndLines)=> {
                        let mapDatabase = new MapDataBase();
                        let parsed = RoutableTilesIntegration.getNodesLines(mapDatabase, nodesAndLines.nodes,nodesAndLines.lines);
                        mapDataBase.addData(parsed.lines,parsed.nodes);
                    })});
```

