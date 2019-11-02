const {createData} = require('./mongo');
// async function createData(json){
//     // let len = msg.length;
//     let flow = calTime();
//     let loTStatistic = new loTModel5({
//         deviceId:json.deviceId,
//         forcex:json.forcex.toFixed(3),
//         torque:json.torque.toFixed(3),
//         buttery:json.buttery.toFixed(3),
//         temperature:json.temperature.toFixed(3),
//         date:flow.date,
//         time:flow.time
//     });
//     loTStatistic.save((error)=>{
//         if(error)return console.log(`error:${error}`)       
// })
// }

createData({
    deviceId:1004,
    forcex:[13,14.5,17],
    torque:19.3,
    buttery:90,
    temperature:23
})
