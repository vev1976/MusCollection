/**
 *
 */


var vrTimeInterval; // = setInterval(runningString(),100);

function onclick_btnTest() {
   
   text = document.getElementById('inpText').value;
   interv = document.getElementById('inpInterv').value;
   //  reverse = "";
   //  if (text!==undefined) {
   //     for(var i=text.length;i>=0;i--){
   //       reverse = reverse.concat(text.charAt(i));
   //     }
   //  }
   //  document.getElementById('demo').innerHTML = reverse;
   //  window.alert(reverse);
   document.getElementById('demo').innerHTML = text + " * ";
   if (vrTimeInterval!=undefined) {
    window.clearInterval(vrTimeInterval);
   }
   vrTimeInterval = setInterval(runningString,interv);
}
 
function runningString()
{
  txt = document.getElementById('demo').innerHTML;
/* var ar = txt.split("");
   var ch = ar[0];
   ar.shift();
   ar.push(ch);
   document.getElementById('demo').innerHTML = ar.join("");
 */
  document.getElementById('demo').innerHTML = txt.slice(1).concat(txt.charAt(0));
}

function onclick_btnStop()
{
   window.clearInterval(vrTimeInterval);
}




