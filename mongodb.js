var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/lot',{
        user:'lotUser',
        pass:'q95519000a',
        useNewUrlParser:true,
        poolSize:10
})

var loTSchema = mongoose.Schema({
    deviceId:Number,
    current:Number,
    buttery:Number,
    temperature:Number,
    groupId:Number,
    date:String,
    time:String
})

const loTModelTest = mongoose.model('loTModelTest',loTSchema);

var groupSchema = mongoose.Schema({
    groupId:Number
})
var groupModel = mongoose.model('groupId',groupSchema);

createData({
    deviceId:1001,
    current:0.5,
    buttery:0.8,
    temperature:[1,2,3,4,5,6,7,8,9]
})

async function createData(json){
    let flow = calTime();
    groupIncreament().then(groupId=>{
        let dataArr = [];
        for(let temperature of json.temperature){
            dataArr.push({
                deviceId:json.deviceId,
                current:json.current,
                buttery:json.buttery,
                temperature:temperature,
                groupId:groupId,
                date:flow.date,
                time:flow.time
            });
        }
        loTModelTest.create(dataArr,(err)=>{
            if(err){
                console.log(err)
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
        time:time
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
    saveArray
}