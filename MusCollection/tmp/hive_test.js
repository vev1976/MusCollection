/**
 *
 */

var hive = require('thrift-hive');
console.log('Started!!!');

// Client connection
var client = hive.createClient({
  version: '0.7.1-cdh3u1',
  server: '10.200.33.209',
  port: 10000,
  timeout: 1000,
  username : '',
  password : ''
});


// Execute call
client.execute('use default', function(err,data){
  // Query call
  console.log(err.message);
  console.log('callback');
  console.log(data);
  client.query('show tables')
  .on('row', function(database){
    console.log(database);
  })
  .on('error', function(err){
    console.log(err.message);
    client.end();
  })
  .on('end', function(){
    client.end();
  });
});
console.log(client);
console.log('second!!!');