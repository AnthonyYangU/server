const {createData,findData,myTest,search,deleteById,deleteMany,saveArray} = require('../mongodb.js')
const fs = require('fs');
let pt = './uploads/slides.pdf'
const JSON_MIME = 'application/json'
module.exports = {
    api: async (ctx,next) => {
        ctx.type = JSON_MIME;
        ctx.response.body = {
          status: 0,
          data: await findData()
        } 
    },
    login: async (ctx,next) =>{
        // console.log(ctx.request.body)
        let 
            userName=ctx.request.body.userName,
            userPwd=ctx.request.body.userPwd;
        
        if(userName == 'Admin' && userPwd == 'admin'){
            ctx.response.type = JSON_MIME;
            ctx.response.body ={
                status:0
            }
        }else{
            ctx.response.type = JSON_MIME;
            ctx.response.body ={
                status:1
            }            
        }
    },
    inputdb:async(ctx,next)=>{
        let inputArr = ctx.request.body.array;
        // console.log(inputArr);
        saveArray(inputArr);
        ctx.response.body={
            status:0
        }
    },
    search:async(ctx,next)=>{
        let jsonData = ctx.request.body;
        // console.log(jsonData)
        ctx.type = JSON_MIME;
        ctx.response.body = {
            status:0,
            data:await search(jsonData)
        }
    },
    delete:async(ctx,next)=>{
        let id = ctx.request.body.deleteId;
        console.log(id)
        deleteById(id);
        ctx.type = JSON_MIME;
        ctx.response.body={
            status:0
        }
    },
    dm:async(ctx,next)=>{
        let idArray = ctx.request.body.deleteMany;
        // console.log(idArray);
        deleteMany(idArray);
        ctx.type = JSON_MIME;
        ctx.response.body={
            status:0
        }
    },
    upload:async(ctx,next)=>{
        ctx.response.body = {
            status:0
        }
    },
    download:async(ctx,next)=>{
        let stream = fs.createReadStream(pt);
        // let stat = fs.statSync(__dirname + '/uploads'+ '956a0230-c6df-11e9-892b-bfc0b5117f19.jpg')
        ctx.set({
            'Content-Type':'application/octet-stream',
            'Content-Disposition':'attachment;filename=slides.pdf',
        })
        ctx.body = stream;
    }
}