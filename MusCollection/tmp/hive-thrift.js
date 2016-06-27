var assert     = require('assert');
var thrift     = require('thrift');
var transport  = require('thrift/lib/nodejs/lib/thrift/transport');
var ThriftHive = require('thrift-hive/lib/0.7.1-cdh3u2/ThriftHive');
// Client connection
var options = {transport: transport.TBufferedTransport, timeout: 1000};
var connection = thrift.createConnection('10.200.33.209', 10000, options);
var client = thrift.createClient(ThriftHive, connection);
// Execute query
client.execute('use default', function(err){
  client.execute('show tables', function(err){
    assert.ifError(err);
    client.fetchAll(function(err, databases){
      if(err){
        console.log(err.message);
      }else{
        console.log(databases);
      }
      connection.end();
    });
  });
});