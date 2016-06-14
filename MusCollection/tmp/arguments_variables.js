/**
 *
 */

argums = process.argv;
//console.log(argums);
var sum;
for (var i=2;i<argums.length;i++) {
   var n = Number(argums[i]);
   if (!isNaN(n)) {
   if (sum==undefined) sum=0;
     sum = n + sum;
   }
}
//console.log("The sum of arguments is " + sum);
console.log(sum);