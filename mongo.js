var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test',{
        user:'myTester',
        pass:'q95519000a',
        useNewUrlParser:true,
        poolSize:10
})

var loTSchema = mongoose.Schema({
    deviceId:Number,
    forcex:Number,
    torque:Number,
    buttery:Number,
    temperature:Number,
    date:String,
    time:String
})

var testSchema = mongoose.Schema({
    name:String,
    age:Number,
    id:Number
})

const testModel = mongoose.model('testModels',testSchema);
const loTModel5 = mongoose.model('loTModel5',loTSchema);

async function createData(json){
        // let len = msg.length;
        let flow = calTime();
        let loTStatistic = new loTModel5({
            deviceId:json.deviceId,
            forcex:json.forcex.toFixed(3),
            torque:json.torque.toFixed(3),
            buttery:json.buttery.toFixed(3),
            temperature:json.temperature.toFixed(3),
            date:flow.date,
            time:flow.time
        });
        loTStatistic.save((error)=>{
            if(error)return console.log(`error:${error}`)       
    })
}

async function saveArray(array){
    let flow = calTime();
    for(let i of array){
        i.date = flow.date;
        i.time = flow.time
    }
    loTModel5.create(array,(err)=>{
        if(err){
            console.log(err)
        }
    })
}

function createTest(){
    for(let i=0;i<35;i++){
        createData({
            deviceId:1000+i,
            forcex:2*i*i,
            torque:35+i,
            buttery:i/12,
            temperature:10*i
        }) 
    }
}


// saveArray(
//     [
//         {
//             deviceId:1004,
//             forcex:19,
//             torque:20,
//             buttery:0.3,
//             temperature:8
//         },
//         {
//             deviceId:1005,
//             forcex:19,
//             torque:20,
//             buttery:0.3,
//             temperature:8
//         }
//     ]
// )
// console.log(saveArray([
//     {
//         deviceId:1003,
//         forcex:19,
//         torque:20,
//         buttery:0.3,
//         temperature:8
//     },
//     {
//         deviceId:1003,
//         forcex:19,
//         torque:20,
//         buttery:0.3,
//         temperature:8
//     }
// ]))
// for(let i=0;i<35;i++){
//     createData({
//         deviceId:1000+i,
//         forcex:i*i,
//         torque:20+i,
//         buttery:i/10,
//         temperature:5*i
//     }) 
// }
// createData({
//     deviceId:1003,
//     forcex:19,
//     torque:20,
//     buttery:0.3,
//     temperature:8
// })

function checkTime(i) {
    if (i < 10) { i = "0" + i }
    return i
}



async function search(json){
    let startDate = json.startDate?json.startDate:'2000-01-01';
    let endDate = json.startDate?json.endDate:'9999-99-99';
    let startTime = json.startTime?json.startTime:'00:00:00';
    let endTime = json.endTime?json.endTime:'24:00:00';
    let minId = json.minId?json.minId:'0d58e39159282e26505ada5c';
    let maxId = json.maxId?json.maxId:'9958e39159282e26505ada5c';

    let len = json.type.length;
    let selection = 'deviceId date time';
    for(let i=0;i<len;i++){
        selection = selection + ' ' + json.type[i];
    }
    
    let query = {
        _id: { $gte: minId, $lte: maxId},
        date :{$gte: startDate, $lte: endDate},
        time:{$gte:startTime,$lte:endTime},
    }

    if (json.deviceId != ''){
        query.deviceId = json.deviceId
    }

    return await loTModel5.find(query).
    sort('_id').
    select(selection);
}

async function myTest(json){
    let test = String(json.selection)+' id';
    return await testModel.find({
        id: { $gte: json.min, $lte: json.max}
    }).
    sort('id').
    select(test);
} 

async function deleteById(deleteId){
    if(deleteId){
        loTModel5.deleteOne({_id:deleteId},(error)=>{
            console.log(`Document with _id ${deleteId} has been deleted`)
        })
    }
}

async function deleteMany(idArray){
    if(idArray){
        loTModel5.deleteMany({_id:{$in:idArray}},(error)=>{
            console.log(`Delete ${idArray.length} successfully`);
        })
    }
}

function calTime(){
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    let nd = new Date(utc + 3600000*8);
    let y = nd.getFullYear(),
        mon = nd.getMonth()+1,
        day = nd.getDate(),
        h = nd.getHours(),
        m = nd.getMinutes(),
        s = nd.getSeconds();
    // console.log(d);
    // y=  checkTime(y)
    mon = checkTime(mon)
    day = checkTime(day)
    h = checkTime(h)
    m = checkTime(m)
    s = checkTime(s)
    return {
        date:y+ "-" + mon + "-" + day,
        time:h + ":" + m + ":" + s
    }
}

async function findData(){
    return await loTModel5.find((error)=>{
        if(error) return console.log(`"Find data error:"${error}`)
    }).sort('_id');
}

module.exports = {
    createData,
    findData,
    myTest,
    search,
    deleteById,
    deleteMany,
    saveArray,
    createTest
}