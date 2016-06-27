hive = require('node-hive').for({server:"10.200.33.209", port:10000, timeout:10000});

console.log('Started');

hive.fetch("show tables", function(err, data) {
  console.log(err.message);
  console.log(data);
  console.log("show tables");
  data.each(function(record) {
    console.log(record);
  });
});