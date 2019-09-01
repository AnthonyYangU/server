const HexToDouble = require('./number');
const {createData} = require('./mongo');
function translate(string){
    let 
        headId = string.substring(0,4),
        deviceId = string.substring(4,8),
        // swId = string.substring(8,12),
        // opeCode = string.substring(12,16),
        forcex = HexToDouble(string.substring(16,32)),
        torque = HexToDouble(string.substring(656,672)),
        buttery =HexToDouble(string.substring(1296,1312)),
        temperature = HexToDouble(string.substring(1936,1952));

    if(headId==='5a5a'){
        createData({
            deviceId:deviceId,
            forcex:forcex,
            torque:torque,
            buttery:buttery,
            temperature:temperature
        });
        console.log(`Save information into the database`);
    }    
    else{
        console.log("incorrect headId");
    }
}

// translate("5a5a0004000001013cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a3cb968999999999a")
// console.log(a);
module.exports = translate;


