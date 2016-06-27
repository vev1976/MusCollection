/**
 *
     var net = require('net')
       
     function zeroFill(i) {
       return (i < 10 ? '0' : '') + i
     }
       
     function now () {
       var d = new Date()
       return d.getFullYear() + '-'
         + zeroFill(d.getMonth() + 1) + '-'
         + zeroFill(d.getDate()) + ' '
         + zeroFill(d.getHours()) + ':'
         + zeroFill(d.getMinutes())
     }
       
     var server = net.createServer(function (socket) {
       socket.end(now() + '\n')
     })
       
     server.listen(Number(process.argv[2]))
     
 */

var net = require('net');
var strftime = require('/usr/local/lib/node_modules/strftime/strftime.js');  //https://github.com/samsonjs/strftime

function requestProcessing(socket) {

//	console.log(strftime('%F %T', new Date(1307472705067)))
  socket.write(strftime('%F %H:%M', new Date()));
  socket.end('');
  
}

var server = net.createServer(requestProcessing);

server.listen(process.argv[2]);

server.on('listening',function(){
  console.log('Server started!');
});
     


