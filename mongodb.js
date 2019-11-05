var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lot',{
        user:'lotUser',
        pass:'q95519000a',
        useNewUrlParser:true,
        poolSize:10
})

//typedef struct
//{
//		double battery;
//    double temperature;
//		double deepth;
//    double force1[26];
//	  double force2[26];
//		double stress1[26];
//	  double stress2[26];
//	  double current[26];
//}testValue_t;

var loTSchema = mongoose.Schema({
    battery:String,
    temperature:String,
    deepth:String,
    force1:String,
    force2:String,
    stress1:String,
    stress2:String,
    current:String,
    deviceId:String,
    groupId:String,
    date:String,
    time:String
})

const loTModelTest = mongoose.model('loTModelTest',loTSchema);

var groupSchema = mongoose.Schema({
    groupId:Number
})
var groupModel = mongoose.model('groupId',groupSchema);

async function createData(jsonArray){
    let flow = calTime();
    groupIncreament().then(groupId=>{
        for(let data of jsonArray){
            data.groupId = groupId;
            data.date = flow.date;
            data.time = flow.time;
        }
        loTModelTest.create(jsonArray,(err)=>{
            if(err){
                console.log(err);
            }
        });    
    });
}

async function saveArray(array){
    let flow = calTime();
    for(let i of array){
        i.date = flow.date;
        i.time = flow.time
    }
    loTModelTest.create(array,(err)=>{
        if(err){
            console.log(err)
        }
    })
}

async function search(json){
    let startDate = json.startDate?json.startDate:'2000-01-01';
    let endDate = json.startDate?json.endDate:'9999-99-99';
    let startTime = json.startTime?json.startTime:'00:00:00';
    let endTime = json.endTime?json.endTime:'24:00:00';
    let minId = json.minId?json.minId:'000000000000000000000000';
    let maxId = json.maxId?json.maxId:'999999999999999999999999';

    let len = json.type.length;
    let selection = 'deviceId groupId date time';
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
    if(json.groupId !=''){
        query.groupId = json.groupId
    }

    return await loTModelTest.find(query).
    sort('_id').
    select(selection);
}

async function deleteById(deleteId){
    if(deleteId){
        loTModelTest.deleteOne({_id:deleteId},(error)=>{
            console.log(`Document with _id ${deleteId} has been deleted`)
        })
    }
}

async function deleteMany(idArray){
    if(idArray){
        loTModelTest.deleteMany({_id:{$in:idArray}},(error)=>{
            console.log(`Delete ${idArray.length} successfully`);
        })
    }
}

async function findData(){
    return await loTModelTest.find((error)=>{
        if(error) return console.log(`"Find data error:"${error}`)
    }).sort('_id');
}

function checkTime(i) {
    if (i < 10) { i = "0" + i }
    return i
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
    mon = checkTime(mon);
    day = checkTime(day);
    h = checkTime(h);;
    m = checkTime(m);
    s = checkTime(s);

    let date = y+ "-" + mon + "-" + day,
        time = h + ":" + m + ":" + s;

    return {
        date:date,
        time:time,
    }
}

async function groupIncreament(){
    var query = await groupModel.find({}).lean().limit(1);
    if(!query.length){
        groupModel.create({groupId:0},(error)=>{
            if(error){
                throw error;
            }
        })
        return 0;
    }else{
        groupModel.updateOne({groupId:query[0].groupId+1},(error)=>{
            if(error){
                throw error;
            }
        })
        return query[0].groupId+1;
    }
}

module.exports = {
    createData,
    findData,
    search,
    deleteById,
    deleteMany,
    saveArray,
    calTime
}