const net = require('net');
const TCP_PORT = "9000"
const TIMEOUT = 60000;//tcp客户端超过60秒没发数据判为超时并断开连接
const Translate = require('./trans');

var tcpClient = null;//tcp客户端

const tcpServer = net.createServer((socket)=>{
    //connect
    let addr = socket.address().address + ':' + socket.address().port;
    console.log(addr," connect.");
    socket.addr = addr;
    tcpClient = socket;
  
    // recieve data
    socket.on("data",data=>{
      let str = addr+" receive: " + data.toString('hex') + '\n';
      let receivedData = data.toString('hex');
      console.log(str);
      let headId = receivedData.substring(0,4);
      if(headId==='5a5a')
        socket.lastValue = Translate(receivedData);
      else{
        console.log("incorrect headId");
      }
    });
  
    // close
    socket.on('close',()=>{
      console.log(addr,"close");
      tcpClient = null;
    });
  
    socket.on('error',(err)=>{
      console.log("error",err);
      tcpClient = null;
    });
  
    socket.setTimeout(TIMEOUT);
      // 超过一定时间 没接收到数据，就主动断开连接。
      socket.on('timeout', () => {
          console.log(socket.id,socket.addr,'socket timeout');
      socket.end();
      tcpClient = null;
      });
  });
  
  tcpServer.on("error",(err)=>{
    console.log(err);
    tcpClient = null;
  });
  
 tcpServer.listen({port: TCP_PORT,host: '0.0.0.0'}, () => {
    console.log('tcp server running on', tcpServer.address())
  });

// function sentCommand(command){
//     if(tcpClient){
//         if(command === 'open')
//         tcpClient.write('1','ascii');
//         else if(command === 'close')
//         tcpClient.write('0','ascii');
//     }else{
//         console.log("openLed error:no tcpClient.")
//     }
// }

// function getData(){
//     if(tcpClient){
//         return tcpClient.lastValue;
//     }else{
//         console.log("getData error:no tcpClient.");
//     }
// }
module.exports = {
    // sentCommand:sentCommand,
    // getData:getData
}