const net = require('net');
const TCP_PORT = "9000"
const TIMEOUT = 60000;//tcp客户端超过60秒没发数据判为超时并断开连接
const translate = require('./trans.js');
const {createData} = require('./mongodb.js');
// var tcpClient = null;//tcp客户端

var receiveState = 0;
var receivedData = [];

const tcpServer = net.createServer((socket)=>{
    //connect
    let addr = socket.address().address + ':' + socket.address().port;
    console.log(addr," connect.");
    socket.addr = addr;
    tcpClient = socket;
  
    // recieve data
    socket.on("data",data=>{
      let rd = data.toString('Hex');
      let str = addr+" receive: " + rd + '\n';
      console.log(str);
      //console.log("Ascii data:",data.toString("Ascii"));
      let headId = rd.substring(0,4);
      if(headId==='5a5b'){
        if(receiveState<5){
          let analyseData = translate(rd);
          receiveState++;
          receivedData.push(...analyseData);
          if(receiveState>=5){
            receiveState = 0;
            receivedData = [];
            console.log(socket.addr,'data sended');
            // socket.end();    
            console.log(`Save ${receiveState} receivedData`);
            //createData(receivedData);
            console.log("Save completely");
          }
        }
        console.log("recieve state is ",receiveState);
        // console.log("receivedData is ",receivedData);
      }
      else{
        console.log("incorrect headId");
      }
    });

    // close
    socket.on('close',()=>{
      console.log(addr,"close");
      receiveState = 0;
      receivedData = [];
    });
  
    socket.on('error',(err)=>{
      receiveState = 0;
      receivedData = [];
      console.log("error",err);
    });
  
    socket.setTimeout(TIMEOUT);
      // 超过一定时间 没接收到数据，就主动断开连接。
    socket.on('timeout', () => {
        receiveState = 0;
        receivedData = [];
        console.log(socket.addr,'socket timeout');
        socket.end();
    });
});

tcpServer.on("error",(err)=>{
    console.log(err);
});
  
tcpServer.listen({port: TCP_PORT,host: '0.0.0.0'}, () => {
    console.log('tcp server running on', tcpServer.address())
});

module.exports = tcpServer;
