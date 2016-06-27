/**
 * http://usejsdoc.org*/
 

var asyncTask = function() {
  console.log("promise");	
  var p = new Promise(function(resolve) {
         delay = Math.floor(Math.random() * 10000);
         console.log("before setTimeout");
   //      setTimeout(function () {
                       console.log("middle");
     //                  resolve(delay);
       //            }, delay);
         console.log("after setTimeout");
         });
         
  console.log("promise2");
  return p;
}

var makeMeLookSync = function(fn) {
  iterator = fn();
 /* loop = function(result) {
	 // console.log("loop");  
    !result.done && result.value.then(function(res){
                                                  loop(iterator.next(res));
                                                   }
      );
  };*/
  console.log("mark1"); 
  iterator.next().value.then(function(res){
	  console.log("mark2"); 
	  iterator.next(res);  
  });
  console.log("mark3"); 
 // loop(iterator.next());
  return 0;
};


function ex() {
console.log("main1");

var s = makeMeLookSync(function* () {
  console.log("start");	
  result = yield asyncTask();
  console.log("finish");
  console.log(result);
});



//console.log(r);

console.log("main2");
return s;
}

console.log(ex());
/*
function f1(txt){
  console.log(txt);
  return "ret func1";
}



function* channel () {
  console.log("start");
  var name = yield f1("func1"); // [1]
  console.log("name is ", name);
  var name2 = yield f1("func2"); // [1]
  console.log("name2 is ", name2);
  return 'well hi there ' + name;
}
var gen = channel();
//console.log(gen.next().value) // hello, what is your name? [2]
//console.log(gen.next('billy')) // well hi there billy [3]
//console.log(gen.next('qqqqqq').value)
gen.next();
console.log('next');
gen.next('111111');
console.log('next');
gen.next('222222');
console.log('next');
gen.next('333333');
console.log('next');
gen.next('444444');
*/




