import {loadNodesLineStringsWegenregisterAntwerpen} from "../LoadData";

test('loadNodesLineStringsWegenregisterAntwerpen',done =>{
    expect.assertions(1);
    loadNodesLineStringsWegenregisterAntwerpen().then(
        data => {
            console.log(data.length);
            expect(data).toBeDefined();
            done();
        }
    );
},10000);