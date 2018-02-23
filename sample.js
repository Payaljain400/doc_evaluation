const path = require('path');
var b= path.extname('payal_960.txt');
console.log(b);
var fs = require('fs');
var stringSimilarity = require('string-similarity');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var mistakes = 0;

var document1 = fs.readFileSync('payal_960.txt','utf-8');
var a=tokenizer.tokenize(document1);
var document2 = fs.readFileSync('stddoc.txt','utf-8');
var c=tokenizer.tokenize(document2);


//calculating string matching
var stringMatch=parseInt((stringSimilarity.compareTwoStrings(document1,document2))*100);
console.log(stringMatch);


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

    },
  Stringmatch:
     {
       string_match: stringMatch
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
