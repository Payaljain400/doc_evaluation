const path = require('path');
var b= path.extname('payal_960.txt');
console.log(b);
var fs = require('fs');

var natural = require('natural');

 var mistakes = 0;

var document1 = fs.readFileSync('payal_960.txt','utf-8');
var tokenizer = new natural.WordTokenizer();

var a=tokenizer.tokenize(document1);
len=a.length;
console.log(len);
var Typo = require("typo-js");
var dictionary = new Typo('en_US');

//for(var i in a)
//console.log(is_spelled_correctly);
for(var i in a)
{
  var is_spelled_correctly = dictionary.check(a[i]);
  if(!is_spelled_correctly)
 mistakes++;
}
 console.log("mistakes:" +mistakes);
var my_json= 
{
  DocumentStats :
     {
       wordCount : len
  
     },
  spellchecking :
  	 {
  	 	no_of_mistakes: mistakes
  	 
  	 }   
};

var json = JSON.stringify(my_json,null,2);
   

      fs.writeFile('output.json',json,'utf-8',(err) => {
        if(err) {
          console.log("error");
          return;
        }
        console.log("success");

      });

