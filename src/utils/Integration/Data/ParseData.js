import parser from 'fast-xml-parser';

/*
Gaat er van uit dat de eerst de lat en long van node wordt vermeld in een triple, dan de node zijn ID binnen de tile
en dan vervolgens de Ways die verwijzen naar deze interne ID's zodat een lijst van alle nodes en lines opstellen in 1 run kan gebeuren.
 */
export function getRoutableTilesNodesAndLines(triples){
    return new Promise((resolve)=>{
        let nodes = {};
        let ways = {};

        let prevInternalNodeID = undefined;
        let currentWayElement = undefined;
        triples.forEach(function(element){
            if(element.subject && element.predicate && element.object){
                let foundNodeInObject = /^http:\/\/www\.openstreetmap\.org\/node\/\d*$/g.exec(element.object.value);
                let foundNodeInSubject = /^http:\/\/www\.openstreetmap\.org\/node\/\d*$/g.exec(element.subject.value);
                // let foundWayInObject = /^http:\/\/www\.openstreetmap\.org\/way\/\d*$/g.exec(element.object.value);
                let foundWayInSubject = /^http:\/\/www\.openstreetmap\.org\/way\/\d*$/g.exec(element.subject.value);

                // if(element.subject.value === "http://www.openstreetmap.org/node/1085435860"){
                //     console.log(element);
                // }
                if(foundNodeInObject){
                  if(element.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"){
                      if(nodes[element.object.value] === undefined){
                          nodes[element.object.value] = {id: element.object.value, ref: []}
                      }
                      nodes[element.object.value].ref.push(element.subject.value);
                  }
                  else{
                      console.warn(element);
                  }
                }
                else if(foundNodeInSubject){
                    // console.log(element);
                    if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#lat"){
                        if(nodes[element.subject.value] === undefined){
                            nodes[element.subject.value] = {id: element.subject.value, ref: []}
                        }
                        nodes[element.subject.value].lat = Number(element.object.value);
                    }
                    else if(element.predicate.value === "http://www.w3.org/2003/01/geo/wgs84_pos#long"){
                        if(nodes[element.subject.value] === undefined){
                            nodes[element.subject.value] = {id: element.subject.value, ref: []}
                        }
                        nodes[element.subject.value].long = Number(element.object.value);
                    }
                }
                // else if(foundWayInObject){
                //     // console.log(element);
                // }
                else if(foundWayInSubject){
                    if(element.predicate.value === "https://w3id.org/openstreetmap/terms#hasNodes") {
                        if (ways[element.subject.value] === undefined) {
                            ways[element.subject.value] = {
                                nodes: [],
                                id: element.subject.value
                            };
                        }
                        ways[element.subject.value].nodes.push(element.object.value.toString());
                        currentWayElement = element.subject.value;
                        prevInternalNodeID = element.object.value;
                    }
                    else {
                        let match = (/^https:\/\/w3id.org\/openstreetmap\/terms#(.*)$/g.exec(element.predicate.value));
                        if(match){
                            if (ways[element.subject.value] === undefined) {
                                ways[element.subject.value] = {
                                    nodes: [],
                                    id: element.subject.value
                                };
                            }
                            if(match[1] === "hasTag"){ // compatibility code with new routable tiles standard 30/05/2019, will definitely change in future
                                if(element.object.value.indexOf("=") !== -1){
                                    let res = element.object.value.split("=");
                                    if(res[0] === "area" || res[0] === "junction"){
                                        ways[element.subject.value][res[0]] = res[1];
                                    }
                                }
                            }
                            else{
                                ways[element.subject.value][match[1]] = element.object.value;
                            }
                        }
                    }
                }
                else if(element.predicate.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"){
                    if(element.subject.value === prevInternalNodeID && element.object.value !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"){
                        if(currentWayElement === undefined){
                            throw Error("Found a node for an undefined way.");
                        }
                        else{
                            ways[currentWayElement].nodes.push(element.object.value);
                            prevInternalNodeID = element.object.value;
                        }
                    }
                    else{
                        currentWayElement = undefined;
                        prevInternalNodeID = undefined;
                    }
                }
                // else{
                //     console.log(element);
                // }
            }
        });

        resolve({nodes: nodes, lines: ways});
    });
}

export function parseToJson(xml){
    return new Promise(((resolve,reject) => {
        let options = {
            // attributeNamePrefix : "@_",
            // attrNodeName: "attr", //default is 'false'
            // textNodeName : "#text",
            ignoreAttributes : false,
            ignoreNameSpace : false,
            allowBooleanAttributes : true,
            parseNodeValue : true,
            parseAttributeValue : true,
            trimValues: true,
            // cdataTagName: "__cdata", //default is 'false'
            // cdataPositionChar: "\\c",
            // localeRange: "", //To support non english character in tag/attribute values.
            // parseTrueNumberOnly: false,
            // attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
            // tagValueProcessor : a => he.decode(a) //default is a=>a
        };

        if(parser.validate(xml) === true)
            resolve(parser.parse(xml,options));
        else{
            reject("could not parse xml")
        }
    }));
}

//zou eigenlijk al bij parsing moeten gebeuren
export function getMappedElements(json){
    return new Promise((resolve)=>{
        let nodes = {};
        let ways = {};
        let relations = {};
        json.osm.node.forEach(function(node){
            nodes[node["@_id"]] = node;
        });
        json.osm.way.forEach(function (way) {
            ways[way["@_id"]] = way;
        });
        json.osm.relation.forEach(function (relation) {
            relations[relation["@_id"]] = relation;
        });
         resolve ({nodes: nodes, ways: ways, relations: relations});
    });
}

export function filterHighwayData(data){
    return new Promise((resolve => {
        let ways = {};
        for(let key in data.ways){
            if(data.ways.hasOwnProperty(key) && data.ways[key].tag !== undefined){
                if(Array.isArray(data.ways[key].tag)){
                    data.ways[key].tag.forEach(function (tag) {
                        if(tag["@_k"] === "highway"){
                            ways[key] = data.ways[key];
                        }
                    });
                }
                else if(data.ways[key].tag["@_k"] !== undefined && data.ways[key].tag["@_k"] === "highway"){
                    ways[key] = data.ways[key];
                }
            }
        }
        resolve({nodes: data.nodes, ways: ways, relations: data.relations});
    }));
}