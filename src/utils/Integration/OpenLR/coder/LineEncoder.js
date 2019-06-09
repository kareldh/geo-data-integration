import Dijkstra from "./Dijkstra";
import {locationTypeEnum} from "../map/Enum";
import LRPNodeHelper from "./LRPNodeHelper";
import {configProperties} from "./CoderSettings";

export default class LineEncoder {
    static encode(mapDataBase,linesToEncode,posOffset,negOffset){
        let lines = linesToEncode.slice();
        let lrpLines = [];
        let shortestPaths = [];
        let offsets = {
            posOffset: Math.round(posOffset*configProperties.internalPrecision),
            negOffset: Math.round(negOffset*configProperties.internalPrecision)
        };

        // 1: check validity of the location and offsets to be encoded
        LineEncoder.checkValidityAndAdjustOffsets(lines,offsets);

        // 2: adjust start and end nodes of the location to represent valid map nodes
        let expanded = this.adjustToValidStartEnd(mapDataBase,lines,offsets); //lines[expanded.front] to lines[lines.length-1-expanded.back] can NOT be used, the full path should be used in SP calculation!!!
        lrpLines.push(lines[0]);

        // calculate length of the Lines in lines. This can serve as a maxDist value for the Dijkstra algorithm
        // since a node further away than this dist will never be part of any the shortest path
        let maxDist = 0;
        for(let i=0;i<lines.length;i++){
            maxDist += lines[i].getLength();
        }

        // 3: determine coverage of the location by a shortest-path
        let shortestPath;
        // 4: check whether the calculated shortest-path covers the location completely
        let checkResult;
        if(lines.length === 1){
            //if there is only line, the sp calculation would return the line in the other direction of the given line (but wouldn't be used further in the algoritm
            shortestPath = {
                lines: [],
                length: 0
            };
            checkResult = {
                fullyCovered: true,
                lrpIndexInSP: 1,
                lrpIndexInLoc: 1
            }
        }
        else{
            shortestPath = Dijkstra.shortestPath(lines[0].getEndNode(),lines[lines.length-1].getStartNode(),{maxDist: maxDist});
            checkResult = this.checkShortestPathCoverage(1,lines,shortestPath.lines,lines.length-1);
        }
        shortestPaths.push(shortestPath);

        //location not completely covered, intermediate LRPs needed
        LineEncoder.addLRPsUntilFullyCovered(checkResult,lines,lrpLines,shortestPaths,shortestPath);
        // 7: concatenate the calculated shortest-paths for a complete coverage of the location and
        // form an ordered list of location reference points (from the start to the end of the location)
        let concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
        checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath,lines.length);
        if(!checkResult.fullyCovered){
            throw Error("something went wrong with determining the concatenated shortest path");
        }

        // 8: check validity of the location reference path. If the location reference path is invalid then
        // go to step 9, if the location reference path is valid, then go to step 10
        while(!concatenatedSPResult.isValid){
            // 9: add a sufficient number of additional intermediate location reference points if the
            // distance between two location reference points exceeds the maximum distance.
            // Remove the start/end LR-point if the positive/negative offset value exceeds the length
            // of the corresponding path.
            if(concatenatedSPResult.wrongPosOffset){
                //remove LRP at the front
                this.removeLRPatFront(lrpLines,shortestPaths,lines,offsets,concatenatedSPResult.distanceBetweenFirstTwo);
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongNegOffset){
                //remove LRP at the end
                this.removeLRPatEnd(lrpLines,shortestPaths,lines,offsets,concatenatedSPResult.distanceBetweenLastTwo);
                concatenatedSPResult = this.concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets);
            }
            if(concatenatedSPResult.wrongIntermediateDistance){
                //add intermediate LRPs
                this.addIntermediateLRPs(lrpLines,shortestPaths,lines);
                //todo
                throw Error("not yet supported");
            }
            //check if the location is still fully covered
            checkResult = this.checkShortestPathCoverage(0,lines,concatenatedSPResult.shortestPath,lines.length);
            if(!checkResult.fullyCovered){
                throw Error("something went wrong while making the concatenated shortest path valid");
            }
        }

        // 10: create physical representation of the location reference (json)
        let LRPs = LRPNodeHelper.lrpLinesToLRPs(lrpLines,shortestPaths);
        return {
            type:locationTypeEnum.LINE_LOCATION,
            LRPs: LRPs,
            posOffset: Math.round(offsets.posOffset/configProperties.internalPrecision),
            negOffset: Math.round(offsets.negOffset/configProperties.internalPrecision)
        };
    }

    static checkValidityAndAdjustOffsets(lines,offsets){
        if(lines !== undefined && lines.length > 0){
            let pathLength = lines[0].getLength();
            let prevLineEndNode = lines[0].getEndNode();
            let i=1;
            while(i<lines.length && lines[i] !== undefined
            && lines[i].getStartNode().getID() === prevLineEndNode.getID()){
                prevLineEndNode = lines[i].getEndNode();
                pathLength+=lines[i].getLength();
                i++;
                //todo: check if also traversable from start to end
            }
            if(i !== lines.length){
                throw Error("line isn't a connected path");
            }
            if(offsets.posOffset + offsets.negOffset >= pathLength){
                throw Error("offsets longer than path: path="+pathLength+" posOffset="+offsets.posOffset+ " negOffset="+offsets.negOffset);
            }
            //remove unnecessary start or end lines
            while(lines.length>0 && offsets.posOffset >= lines[0].getLength()){
                console.log("first line should be omitted");
                offsets.posOffset -= lines[0].getLength();
                lines.shift();
            }
            while(lines.length>0 && offsets.negOffset >= lines[lines.length-1].getLength()){
                console.log("last line should be omitted");
                offsets.negOffset -= lines[lines.length-1].getLength();
                lines.pop();
            }
            //todo vereisten voor binary formaat
            //todo if(pathLength > 15km) ... happens in step 8
        }
    }

    // if this step fails, the encoding can proceed to the next step
    static adjustToValidStartEnd(mapDataBase,lines,offsets){
        let expanded = {
            front: 0,
            back: 0
        };

        let pathLength = {length: 0};
        lines.forEach(function (line) {
           pathLength.length+=line.getLength();
        });
        // check if map has turn restrictions, detect invalid nodes according rule 4 of the whitepaper
        if(!mapDataBase.hasTurnRestrictions() && !mapDataBase.hasTurnRestrictionOnPath(lines)){ //todo: why do we need to check this?
            //node is invalid if
            //one line enters and line leaves (note: lines are directed)
            //two lines enter and two lines leave, but they are connected to only 2 adjacent nodes,
            //unless a u-turn is possible at that node
            if(lines[0] !== undefined && lines[lines.length-1] !== undefined){
                //start node expansion
                let originalStartLineId = lines[0].getID();
                while(LineEncoder.nodeIsInValid(lines[0].getStartNode())
                    && !(expanded.front > 0 && lines[0].getID() === originalStartLineId)) //detect an infinite start node expansion
                {
                    if(lines[0].getStartNode().getIncomingLines().length === 1){
                        this.expand(lines[0].getStartNode().getIncomingLines()[0],lines,pathLength,offsets,true);
                        expanded.front += 1;
                    }
                    else if(lines[0].getStartNode().getIncomingLines().length === 2){
                        // one of the outgoing lines is the second line of the location, so expansion should happen in the other direction
                        if(lines[0].getStartNode().getIncomingLines()[0].getStartNode().getID() === lines[0].getEndNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(lines[0].getStartNode().getIncomingLines()[1],lines,pathLength,offsets,true);
                            expanded.front += 1;
                        }
                        else if(lines[0].getStartNode().getIncomingLines()[1].getStartNode().getID() === lines[0].getEndNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(lines[0].getStartNode().getIncomingLines()[0],lines,pathLength,offsets,true);
                            expanded.front += 1;
                        }
                        else{
                            console.log("something went wrong at determining the start node expansion node");
                        }
                    }
                    else{
                        console.log("something went wrong with determining if expansion is needed");
                    }
                }
                if(expanded.front > 0 && lines[0].getID() === originalStartLineId){
                    // the line lays on a loop without valid nodes, so the line has been expanded with all the lines of the loop
                    // these added lines should be removed so only the original line remains
                    LineEncoder.undoExpansion(lines,originalStartLineId,expanded,offsets,true);
                }
                let originalEndLineId = lines[lines.length-1].getID();
                //end node expansion
                while(LineEncoder.nodeIsInValid(lines[lines.length-1].getEndNode())
                    && !(expanded.back > 0 && lines[lines.length-1].getID() === originalEndLineId)) // detect an infinite end node expansion
                {
                    if(lines[lines.length-1].getEndNode().getOutgoingLines().length === 1){
                        this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[0],lines,pathLength,offsets,false);
                        expanded.back += 1;
                    }
                    else if(lines[lines.length-1].getEndNode().getOutgoingLines().length === 2){
                        // one of the incoming lines is the second-last line of the location, so expansion should happen in the other direction
                        if(lines[lines.length-1].getEndNode().getOutgoingLines()[0].getEndNode().getID() === lines[lines.length-1].getStartNode().getID()){
                            //expand to the start node of the second incoming line
                            this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[1],lines,pathLength,offsets,false);
                            expanded.back += 1;
                        }
                        else if(lines[lines.length-1].getEndNode().getOutgoingLines()[1].getEndNode().getID() === lines[lines.length-1].getStartNode().getID()){
                            //expand to the start node of the first incoming line
                            this.expand(lines[lines.length-1].getEndNode().getOutgoingLines()[0],lines,pathLength,offsets,false);
                            expanded.back += 1;
                        }
                        else{
                            console.log("something went wrong at determining the end node expansion node");
                        }
                    }
                    else{
                        console.log("something went wrong with determining if expansion is needed");
                    }
                }
                if(expanded.back > 0 && lines[lines.length-1].getID() === originalEndLineId){
                    // the line lays on a loop without valid nodes, so the line has been expanded with all the lines of the loop
                    // these added lines should be removed so only the original line remains
                    LineEncoder.undoExpansion(lines,originalEndLineId,expanded,offsets,false);
                }
            }
        }
        return expanded;
        //todo what if there are turn restrictions?
    }

    static nodeIsInValid(node){
        let oneInOneOut = (node.getIncomingLines().length === 1 && node.getOutgoingLines().length === 1);
        let twoInTwoOut = (node.getIncomingLines().length === 2 && node.getOutgoingLines().length === 2);

        let expansionNeeded = false;
        if(oneInOneOut){
            //if the incoming line starts from the same node as the outgoing line ends, this node has only one sibling (border node in our graph) and thus is a valid node
            expansionNeeded = (node.getIncomingLines()[0].getStartNode().getID() !== node.getOutgoingLines()[0].getEndNode().getID());
        }
        else if(twoInTwoOut){
            //todo: if a u-turn can be made at the node, the node should be valid: turn restrictions should be known, how to implement these?
            let firstIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let secondIncomingStartEqFirstOutgoingEnd = (node.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[0].getEndNode().getID());
            let firstIncomingStartEqSecondOutgoingEnd = (node.getIncomingLines()[0].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());
            let secondIncomingStartEqSecondOutgoingEnd = (node.getIncomingLines()[1].getStartNode().getID() === node.getOutgoingLines()[1].getEndNode().getID());

            expansionNeeded = ((firstIncomingStartEqFirstOutgoingEnd && secondIncomingStartEqSecondOutgoingEnd) || (firstIncomingStartEqSecondOutgoingEnd && secondIncomingStartEqFirstOutgoingEnd));
        }

        return expansionNeeded;
    }

    static expand(lineToAdd,lines,pathLength,offsets,positive){
        if(pathLength.length + lineToAdd.getLength() < 15000*configProperties.internalPrecision){
            pathLength.length += lineToAdd.getLength();
            if(positive){
                offsets.posOffset += lineToAdd.getLength();
                lines.unshift(lineToAdd);
            }
            else{
                offsets.negOffset += lineToAdd.getLength();
                lines.push(lineToAdd);
            }
        }
        else{
            console.log("start node expansion aborted because path length exceeding 15000m")
        }
    }

    static undoExpansion(lines,originalLineId,expanded,offsets,positive){
        if(positive){
            if(lines[0].getID() === originalLineId){
                // the first line should be the line with the same ID as originalLineId and will be shifted out first
                offsets.posOffset -= lines[0].getLength();
                expanded.front--;
                lines.shift();
            }
            else{
                throw Error("undoExpansion at start node called but was not needed");
            }
            while(lines[0].getID() !== originalLineId){
                offsets.posOffset -= lines[0].getLength();
                expanded.front--;
                lines.shift();
            }
            if(expanded.front < 0){
                throw Error("Something went wrong during reversing the start node expansion.")
            }
        }
        else {
            if(lines[lines.length-1].getID() === originalLineId){
                // the last line should be the line with the same ID as originalLineId and will be popped of first
                offsets.negOffset -= lines[lines.length-1].getLength();
                expanded.back--;
                lines.pop();
            }
            else{
                throw Error("undoExpansion at end node called but was not needed");
            }
            while(lines[lines.length-1].getID() !== originalLineId){
                offsets.negOffset -= lines[lines.length-1].getLength();
                expanded.back--;
                lines.pop();
            }
            if(expanded.back < 0){
                throw Error("Something went wrong during reversing the end node expansion.")
            }
        }
    }

    static checkShortestPathCoverage(lStartIndex,lines,shortestPath,lEndIndex){ //lEndIndex is one greater than the last index to be checked (confer length of an array)
        if(lStartIndex === undefined || lines === undefined || shortestPath === undefined || lEndIndex === undefined){
            throw Error("One of the parameters is undefined.");
        }
        if(lEndIndex>lines.length){
            throw Error("lEndIndex can't be greater than lines.length");
        }
        else if(lStartIndex > lEndIndex){
            throw Error("lStartIndex can't be greater than lEndIndex");
        }
        let spIndex = 0;
        let lIndex = lStartIndex;

        if(lStartIndex === lEndIndex-1 && shortestPath.length  === 0){
            return {
                fullyCovered: true,
                lrpIndexInSP: spIndex,
                lrpIndexInLoc: lIndex+1
            }
        }
        else {
            while (lIndex < lEndIndex && spIndex < shortestPath.length
                && lines[lIndex].getID() === shortestPath[spIndex].getID()
                ) {
                spIndex++;
                lIndex++;
            }
            //if even the first line of the shortest path is not correct, a new LRP (lines[lStartIndex].getStartNode()) should be added that has the lines[lStartIndex] as outgoing line
            //if only the first line of the shortest path is correct, the next line lines[lStartIndex+1] should start in a new LRP
            //so lrpIndexInLoc indicates the index of the line of which the startnode should be a new LRP, because that is the line that didn't match the shortest path
            if (lIndex === lEndIndex && spIndex + lStartIndex === lIndex) {
                return {
                    fullyCovered: true,
                    lrpIndexInSP: spIndex,
                    lrpIndexInLoc: lIndex
                }
            }
            else {
                return {
                    fullyCovered: false,
                    lrpIndexInSP: spIndex,
                    lrpIndexInLoc: lIndex
                }
            }
        }
    }

    static addLRPsUntilFullyCovered(prevCheckResult,lines,lrpLines,shortestPaths,prevShortestPath){
        let checkResult = prevCheckResult;
        let shortestPath = prevShortestPath;
        while(! checkResult.fullyCovered){
            //calculate the length of the location that should be covered, this can be used to speed up the Dijkstra algorithm
            let maxDist = 0;
            for(let i=checkResult.lrpIndexInLoc+1;i<lines.length-1;i++){
                maxDist += lines[i].getLength();
            }
            // 5: Determine the position of a new intermediate location reference point so that the part of
            // the location between the start of the shortest-path calculation and the new intermediate
            // is covered completely by a shortest-path.
            if(!this.nodeIsInValid(lines[checkResult.lrpIndexInLoc].getStartNode())){
                // the node is valid, this means that the shortest path would follow the location reference up until the point of lrpIndexInLoc
                // this point of lrpIndexInLoc can be made into a new LRP
                lrpLines.push(lines[checkResult.lrpIndexInLoc]);
                // 6: go to step 3 and restart shortest path calculation between the new intermediate location
                // reference point and the end of the location
                shortestPath = Dijkstra.shortestPath(lines[checkResult.lrpIndexInLoc].getEndNode(),lines[lines.length-1].getStartNode(),{maxDist: maxDist});
                shortestPaths.push(shortestPath);
                checkResult = this.checkShortestPathCoverage(checkResult.lrpIndexInLoc+1,lines,shortestPath.lines,lines.length-1);
            }
            else{
                // this can happen if the path between two LRPs contains invalid nodes, but there exist a route in the other direction
                // that forms a loop between these LRPs and provides a shorter path.
                // so while the path can't change in an invalid node, a U-turn can be made because the way in the other direction is still shorter
                // we will search for valid nodes on the path to encode that can function as LRPs
                // if no valid nodes can be found, invalid nodes must be used instead
                if(checkResult.lrpIndexInSP !== 0){
                    // this means that the shortest path should have no line in common with the lines to encode between te LRPs
                    // if some lines should overlap, it would mean that a point exists were the shortest path and the lines to encode can take another route
                    // which would mean that that point would be a valid node and we would not be in the first part of this if else structure
                    throw Error("Something went wrong during the covering of the location with shortest paths. The location contains a part of a loop with invalid nodes" +
                        " but the shortest path diverges on this part which would imply the existence of a valid node on this part, which is not possible.")
                }
                // since the shortest path doesn't have any lines in common with the location, it shouldn't have been pushed on the shortestPaths array
                shortestPaths.pop();

                // try to find a valid node on the shortest path that leads to the invalid node !!wrong
                // let validNodeResult = this.findValidNodeOnSP(shortestPath.lines,checkResult.lrpIndexInSP); // wrong function/not needed/never needed since the SP doesn't cover the lines to encode at any point
                // we could add the next line to encode as a LRP. This line does start in an invalid node.
                // lrpLines.push(lines[checkResult.lrpIndexInLoc]);
                // we know there are now more valid nodes on the lines to the next LRP, so we can try to only add 1 invalid LRP by counting the line length to the next LRP
                // and since we know the length of the shortest path, we have to make sure that the line length to the invalid LRP + the length of the shortest path is longer than
                // is bigger than the distance from the invalid LRP to the next LRP. That way, the next shortest path between the invalid LRP and the next LRP wil never return on it's way
                // and will guaranteed cover the lines between the invalid LRP and the next LRP.
                // since the list of lines and the wrong shortest path create a loop, we also have to make sure that the length of the path to the chosen invalid LRP is smaller than
                // the length of the wrong shortest path + the length of the lines between the invalid LRP and the next LRP, because otherwise the wrong shortest path will be the shortest path to this invalid LRP
                // for this we do need to know what next LRP, which can simply be the next valid node that is present in the list of lines. If there is no valid node in the list of lines,
                // because even the last node was invalid (because the network is an infinite loop of invalid nodes), the last node will always function as an LRP.


                checkResult = LineEncoder.findInvalidNodeOnLinesAfterACertainLength(lines,checkResult.lrpIndexInLoc,shortestPath.length,lrpLines,shortestPaths,maxDist);
            }
        }

        // push the last line of the expanded location to the list of LRPs,
        // even if the expanded location contains only one line: in that case lrpLines contains the line two times
        lrpLines.push(lines[lines.length-1]);
    }

    static findInvalidNodeOnLinesAfterACertainLength(lines,lrpIndexInLoc,shortestPathLength,lrpLines,shortestPaths,maxDist){
        //todo: not al different cases are tested in unit tests
        let nextValidNode = LineEncoder.findNextValidNode(lines,lrpIndexInLoc);
        let nextValidIndex = nextValidNode.nextValidStartNodeIndexInLoc === undefined ? lines.length-1 : nextValidNode.nextValidStartNodeIndexInLoc;

        if(nextValidIndex !== lines.length-1){
            // there is still a valid node on the location between the current LRP and the last LRP
            let lengthFromLRPToNextLRP =  nextValidNode.restLengthOfLines - nextValidNode.lengthToIndex;
            if(nextValidNode.lengthToIndex-shortestPathLength < lengthFromLRPToNextLRP){
                //the shortest path to this valid location doesn't follow the wrong shortest path to the end LRP
                shortestPaths.push(nextValidNode.spToValidNode);
                lrpLines.push(lines[nextValidIndex]);
                let shortestPath = Dijkstra.shortestPath(lines[nextValidIndex].getEndNode(),lines[lines.length-1].getStartNode(),{maxDist: maxDist});
                shortestPaths.push(shortestPath);
                return this.checkShortestPathCoverage(nextValidIndex,lines,shortestPath.lines,lines.length-1);
            }
        }
        else {
            // there is no valid node on the location between the current LRP and the last LRP,
            // or there is a valid node, but it doesn't lay in the correct interval
            let lengthToLRP = lines[lrpIndexInLoc].getLength();
            let spLines = [lines[lrpIndexInLoc]];
            let i=lrpIndexInLoc+1;
            let invalidLRPAdded = false;
            while(i<nextValidIndex && !invalidLRPAdded){
                let lengthFromLRPToNextLRP =  nextValidNode.restLengthOfLines -lengthToLRP;
                if(lengthToLRP+shortestPathLength > lengthFromLRPToNextLRP && lengthToLRP-shortestPathLength < lengthFromLRPToNextLRP){
                    // this line lays on the loop of invalid nodes, at a position were the wrong shortest path would never be
                    // taken as part of a shortest path calculation to this line, and the wrong shortest path would never be taken
                    // as part of a shortest path calculation from this line to the next LRP
                    lrpLines.push(lines[i]);
                    shortestPaths.push({
                        length: lengthToLRP,
                        lines: spLines
                    });
                    invalidLRPAdded = true;
                    spLines = [];
                    lengthToLRP = 0;
                }
                else{
                    lengthToLRP += lines[i].getLength();
                    spLines.push(lines[i]);
                }
                i++;
            }
            if(invalidLRPAdded){
                // we added an invalid LRP in the previous while loop, we can loop over the remaining lines to form the shortest path
                // to the next valid LRP and push this on the shortestPaths array
                while(i<nextValidIndex){
                    lengthToLRP += lines[i].getLength();
                    spLines.push(lines[i]);
                    i++;
                }
                shortestPaths.push({
                    length: lengthToLRP,
                    lines: spLines
                });
                if(nextValidIndex === lines.length-1){
                    // the full location to the last line is covered
                    return {
                        fullyCovered: true,
                        lrpIndexInSP: spLines.length-1,
                        lrpIndexInLoc: i
                    }
                }
                else{
                    // we should add the next valid LRP and check if the location is covered
                    let shortestPath = Dijkstra.shortestPath(lines[nextValidIndex].getEndNode(),lines[lines.length-1].getStartNode(),{maxDist: maxDist});
                    shortestPaths.push(shortestPath);
                    return this.checkShortestPathCoverage(nextValidIndex,lines,shortestPath.lines,lines.length-1);
                }
            }
            else{
                // there is no valid or invalid LRP possible in the given distance interval
                // so we simply convert the second line in the list of lines to an lrpLine (starts in an invalid Node)
                // since the first Line is a straight Line, adjacent to the last LRP, the shortest path to the beginning of second Line can not deviate from this first Line
                // there always will be a second Line, otherwise an intermediate LRP wasn't needed because the last LRP and the first Line would already cover the location
                lrpLines.push(lines[lrpIndexInLoc+1]);
                shortestPaths.push({
                    length: lines[lrpIndexInLoc].getLength(),
                    lines: [lines[lrpIndexInLoc]]
                });
                let shortestPath = Dijkstra.shortestPath(lines[lrpIndexInLoc+1].getEndNode(),lines[lines.length-1].getStartNode(),{maxDist: maxDist});
                shortestPaths.push(shortestPath);
                return this.checkShortestPathCoverage(lrpIndexInLoc+2,lines,shortestPath.lines,lines.length-1);
            }
        }
    }

    static findNextValidNode(lines,lrpIndexInLoc){
        // the startnode of lines[lrpIndexInLoc] will be invalid, otherwise this function wouldn't be called
        let nextValidStartNodeIndexInLoc = undefined;
        let lengthOfLines = lines[lrpIndexInLoc].getLength();
        let lengthToIndex = undefined;
        let spLinesToValidNode = [lines[lrpIndexInLoc]];
        let spToValidNode = {};
        let i = lrpIndexInLoc+1;
        while(i<lines.length){
            if(nextValidStartNodeIndexInLoc === undefined && !LineEncoder.nodeIsInValid(lines[i].getStartNode())){
                nextValidStartNodeIndexInLoc = i;
                lengthToIndex = lengthOfLines;
                spToValidNode = {lines: spLinesToValidNode, length: lengthToIndex};
            }
            spLinesToValidNode.push(lines[i]);
            lengthOfLines += lines[i].getLength();
            i++;
        }
        return {
            nextValidStartNodeIndexInLoc: nextValidStartNodeIndexInLoc,
            lengthToIndex: lengthToIndex,
            restLengthOfLines: lengthOfLines,
            spToValidNode: spToValidNode
        }
    }

    static concatenateAndValidateShortestPaths(lrpLines,shortestPaths,offsets){
        if(lrpLines === undefined || shortestPaths === undefined || offsets === undefined){
            throw Error("Parameters can not be undefined");
        }
        let isValid = true;
        let distanceBetweenFirstTwoLength = lrpLines[0].getLength();
        let distanceBetweenLastTwoLength = lrpLines[lrpLines.length-1].getLength();
        let wrongPosOffset = false;
        let wrongNegOffset = false;
        let wrongIntermediateOffset = false;

        if(lrpLines.length-1 === shortestPaths.length){
            let shortestPath = [];
            if(lrpLines.length === 2 && lrpLines[0].getID() === lrpLines[1].getID()){
                // lines contains only one line, so the first 2 lines in lrpLines are the same
                // the second lrp line should not be pushed on the shortestPath
                shortestPath.push(lrpLines[0]);
            }
            else{
                for(let i=0;i<shortestPaths.length;i++){
                    shortestPath.push(lrpLines[i]);
                    if(i === shortestPaths.length-1){
                        distanceBetweenLastTwoLength += lrpLines[i].getLength();
                    }
                    let a = 0;
                    let lengthBetweenLRPs = lrpLines[i].getLength();
                    //while the start node of a line is not the next LRP node, this line can be added
                    //otherwise we should add the lines of the shortest path of that LRP node
                    while(shortestPaths[i].lines !== undefined && shortestPaths[i].lines[a] !== undefined && shortestPaths[i].lines[a].getStartNode().getID() !== lrpLines[i+1].getStartNode().getID()){
                        shortestPath.push(shortestPaths[i].lines[a]);
                        lengthBetweenLRPs += shortestPaths[i].lines[a].getLength();
                        if(i===0){
                            distanceBetweenFirstTwoLength += shortestPaths[i].lines[a].getLength();
                        }
                        if(i===shortestPaths.length-1){
                            distanceBetweenLastTwoLength += shortestPaths[i].lines[a].getLength();
                        }
                        a++;
                    }
                    if(lengthBetweenLRPs >= 15000*configProperties.internalPrecision){
                        isValid = false;
                        wrongIntermediateOffset = true;
                    }
                }
                shortestPath.push(lrpLines[lrpLines.length-1]); //add the line incoming in the last LRP
                if(lrpLines.length === 2){
                    distanceBetweenFirstTwoLength += lrpLines[lrpLines.length-1].getLength();
                }
            }
            if(distanceBetweenFirstTwoLength >=  15000*configProperties.internalPrecision || distanceBetweenLastTwoLength >= 15000*configProperties.internalPrecision){
                isValid = false;
                wrongIntermediateOffset = true;
            }
            //check if offset values are shorter then the distance between the first two/last two location reference points
            if(offsets.posOffset >= distanceBetweenFirstTwoLength){
                // can happen if we added extra intermediate LRPs on invalid nodes
                isValid = false;
                wrongPosOffset = true;
            }
            else if(offsets.negOffset >= distanceBetweenLastTwoLength){
                // can happen if we added extra intermediate LRPs on invalid nodes
                isValid = false;
                wrongNegOffset = true;
            }
            return {
                shortestPath: shortestPath,
                isValid: isValid,
                wrongPosOffset: wrongPosOffset,
                wrongNegOffset: wrongNegOffset,
                wrongIntermediateDistance: wrongIntermediateOffset,
                distanceBetweenFirstTwo: distanceBetweenFirstTwoLength,
                distanceBetweenLastTwo: distanceBetweenLastTwoLength
            }
        }
        else{
            throw Error("the amount of shortest paths is not one less than the amount of lrp nodes");
        }
    }

    static removeLRPatFront(lrpLines,shortestPaths,lines,offsets,length){
        if(lrpLines.length > 0
            && offsets.posOffset>=length
        ){
            offsets.posOffset -= length;
            lrpLines.shift();
            shortestPaths.shift();
            while(lines[0].getID() !== lrpLines[0].getID()){
                lines.shift();
            }
        }
        else{
            throw Error("unnecessary removing of LRP at front");
        }
    }

    static removeLRPatEnd(lrpLines,shortestPaths,lines,offsets,length){
        if(lrpLines.length > 0
            && offsets.negOffset>=length
        ){
            offsets.negOffset -= length;
            lrpLines.pop();
            shortestPaths.pop();
            while(lines[lines.length-1].getID() !== lrpLines[lrpLines.length-1].getID()){
                lines.pop();
            }
        }
        else{
            throw Error("unnecessary removing of LRP at end");
        }
    }

    static addIntermediateLRPs(lrpLines,shortestPaths,lines){
        //todo
        console.warn("todo addIntermediateLRPs");
    }
}