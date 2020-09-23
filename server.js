// 用于启动一个express服务器预览本地的index.html
// 把express的安装路径放到这里
module.paths.push('/home/puppy/.nvm/versions/node/v10.22.1/lib/node_modules')

var express = require('express');
var ip = require('ip');

var app = express();
var ipAddress = ip.address()

app.use(express.static("./"));

var server = app.listen(8088,()=>{
    var port = server.address().port;
    console.log("复制地址在浏览器中访问:http://%s:%s",ipAddress,port)
})
