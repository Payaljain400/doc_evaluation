//include fs and natural
var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
//pos tagger
var path = require("path");
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';


var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

var evalNouns = [];
var standardNouns = [];
var evalAdjectives = [];
var standardAdjectives = [];
var evalVerbs = [];
var standardVerbs = [];
var similarNouns = 0;
var similarAdjectives = 0;
var similarVerbs = 0;


//document to be evaluated
var evalDocument = fs.readFileSync('documents/payal_960.txt','utf-8');
//standard document
var standardDocument = fs.readFileSync('documents/stddoc.txt','utf-8');

var standardTokens = tokenizer.tokenize(standardDocument);
var evalTokens = tokenizer.tokenize(evalDocument);
var standardTagged = tagger.tag(standardTokens);
var evalTagged = tagger.tag(evalTokens);
console.log(evalTagged);


 for(var i=0; i < standardTagged.length; i++){ 
    //noun
    if(standardTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      standardNouns.push(standardTagged[i][0]);
    //adjective
    else if(standardTagged[i][1] == "JJ"|"JJR"|"JJS")
      standardAdjectives.push(standardTagged[i][0]);
    //verb
    else if(standardTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP"|"VBZ")
      standardVerbs.push(standardTagged[i][0]);
}

 for(var i=0; i < evalTagged.length; i++){ 
    //noun
    if(evalTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      evalNouns.push(evalTagged[i][0]);
    //adjective
    else if(evalTagged[i][1] == "JJ"|"JJR"|"JJS")
      evalAdjectives.push(evalTagged[i][0]);
    //verb
    else if(evalTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      evalVerbs.push(evalTagged[i][0]); 
}
  //similar nouns
  var corpus = standardNouns;
  var spellcheck = new natural.Spellcheck(corpus);

  for(let i = 0; i < evalNouns.length; i++){
  if(spellcheck.isCorrect(evalNouns[i]))
    similarNouns ++;
  }

  //similar adjectives
  corpus = standardAdjectives;
  spellcheck = new natural.Spellcheck(corpus);
  for(let i = 0; i < evalAdjectives.length; i++){
  if(spellcheck.isCorrect(evalAdjectives[i]))
    similarAdjectives++;
   }

  //similar verbs
  corpus = standardVerbs;
  spellcheck = new natural.Spellcheck(corpus);
  for(let i = 0; i < evalVerbs.length; i++){
  if(spellcheck.isCorrect(evalVerbs[i]))
    similarVerbs++;
  }

var points = 0;
var status;
var remarks;

//wordcount check
var range = (standardTokens.length*20)/100
var standardLength = standardTokens.length;
var evalLength = evalTokens.length;

if(evalLength <= standardLength-range || evalLength >= standardLength+range){
  status = "Rejected";
  remarks="Document does not satisfy word limit range";
    console.log("Document size invalid");
}else{
  status = "Accepted";
  //points
  points+=(similarNouns/standardNouns.length)*5;

  points+=(similarAdjectives/standardAdjectives.length)*5;

  points+=(similarVerbs/standardVerbs.length)*5;
  //remarks
  if(points > 75 && points < 100){
        remarks="Document is good";
     } 
     else if(points > 50 && points < 75){
        remarks="Document is average";
     }
     else{
        remarks="Document is poor"; 
  }
}


makeJson();
function makeJson(){
    var score = {
      Standard : 
        {
          wordCount : standardLength,
          nouns : standardNouns.length,
          adjectives : standardAdjectives.length,
          verbs : standardVerbs.length
        }, 

      Eval : 
        {
          wordCount : evalLength,
          nouns : evalNouns.length,
          adjectives : evalAdjectives.length,
          verbs : evalVerbs.length
        },
      Result :
      {   commonNouns : similarNouns,
          commonAdjectives : similarAdjectives,
          commonVerbs : similarVerbs,
          docStatus : status,
          docScore : points,
          docRemarks : remarks
      }
    
    }

  var json = JSON.stringify(score, null, 2);
  
  fs.writeFileSync('output.json',json)
}
