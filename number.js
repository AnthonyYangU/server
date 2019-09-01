// var string = '3cb968999999999a'

function hexTobin(n){
    let num = parseInt(n,16).toString(2);
    let add = 64 - num.length;
    for(let len=0;len<add;len++){
        num = '0'+num;
    }
    return num;
}

// num = hexTobin(string)
// console.log("num:"+num);

function binToDouble(binString){
    let orderCode = binString.substring(1,12);
    let tailNumber = '1' + binString.substring(12);
    let index = parseInt(orderCode,2)-1023;
    // console.log(orderCode)
    // console.log(index)
    var integerNum = 0;
    var decimalNum = 0;
    if(index>=0){
        var integer = tailNumber.substring(0,index+1);
        var decimal = tailNumber.substring(index+1);
        // console.log("TaiNumber:"+tailNumber);
        // console.log("Integer:"+integer);
        // console.log("Decimal"+decimal);
        for(var i=0;i<integer.length;i++){
            integerNum = integerNum + integer[i]*Math.pow(2,index-i);
        }
        for(var j=0;j<decimal.length;j++){
            decimalNum = decimalNum + decimal[j]*Math.pow(2,-1-j);
        }
    }else{
        var decimal = tailNumber;   
        for(let minus=0;minus>index;minus--){
            decimal = '0' + decimal;
        }
        // console.log("decimal:"+decimal);
        for(var j=0;j<decimal.length;j++){
            decimalNum = decimalNum + decimal[j]*Math.pow(2,-j);
        }             
    }
    if(binString.substring(0)==='0')
        return integerNum + decimalNum;
    else
        return -(integerNum + decimalNum);
}

function hexToDouble(hexString){
    return binToDouble(hexTobin(hexString));
}
// console.log(hexToDouble('3cb968999999999a'));

module.exports = hexToDouble;