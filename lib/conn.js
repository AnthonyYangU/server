const mongoose = require('mongoose');
async function connect(){
  await  mongoose.connect('mongodb://localhost/test',{
        user:'myTester',
        pass:'q95519000a',
        useNewUrlParser:true,
        poolSize:10
    });
}

async function close () {
  await mongoose.connection.close()
}



module.exports = {
  mongoose,
  connect,
  close
}
