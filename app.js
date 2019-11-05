const Koa = require('koa')
const router = require('./router')
const app = new Koa()

// const router = new Router()
const tcpserver = require('./tcpserver')
const bodyParser = require('koa-bodyparser')

//console.log(tcpserver.getData);
app.use(bodyParser({multipart:true}))
router(app);
// console.log(Date.now())
app.listen(4001)
console.log('app started at port 4001...');