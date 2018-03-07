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

// initialising the variables used
var mydocNouns = [];
var stdNouns = [];
var mydocAdjectives = [];
var stdAdjectives = [];
var mydocVerbs = [];
var stdVerbs = [];
var similarNouns = 0;
var similarAdjectives = 0;
var similarVerbs = 0;


//Read My document 
var myDocument = fs.readFileSync('documents/payal_960.txt','utf-8');
// Read standard document
var stdDocument = fs.readFileSync('documents/stddoc.txt','utf-8');

var stdTokens = tokenizer.tokenize(stdDocument);
var mydocTokens = tokenizer.tokenize(myDocument);
var stdTagged = tagger.tag(stdTokens);
var mydocTagged = tagger.tag(mydocTokens);
console.log(mydocTagged);


 for(var i=0; i < stdTagged.length; i++){ 
    //noun
    if(stdTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      stdNouns.push(stdTagged[i][0]);
    //adjective
    else if(stdTagged[i][1] == "JJ"|"JJR"|"JJS")
      stdAdjectives.push(stdTagged[i][0]);
    //verb
    else if(stdTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP"|"VBZ")
      stdVerbs.push(stdTagged[i][0]);
}

 for(var i=0; i < mydocTagged.length; i++){ 
    //noun
    if(mydocTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      mydocNouns.push(mydocTagged[i][0]);
    //adjective
    else if(mydocTagged[i][1] == "JJ"|"JJR"|"JJS")
      mydocAdjectives.push(mydocTagged[i][0]);
    //verb
    else if(mydocTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      mydocVerbs.push(mydocTagged[i][0]); 
}
  //similar nouns
  var check = stdNouns;
  var spellcheck = new natural.Spellcheck(check);

  for(let i = 0; i < mydocNouns.length; i++){
  if(spellcheck.isCorrect(mydocNouns[i]))
    similarNouns ++;
  }

  //similar adjectives
  check = stdAdjectives;
  spellcheck = new natural.Spellcheck(check);
  for(let i = 0; i < mydocAdjectives.length; i++){
  if(spellcheck.isCorrect(mydocAdjectives[i]))
    similarAdjectives++;
   }

  //similar verbs
  check = stdVerbs;
  spellcheck = new natural.Spellcheck(check);
  for(let i = 0; i < mydocVerbs.length; i++){
  if(spellcheck.isCorrect(mydocVerbs[i]))
    similarVerbs++;
  }

var points = 0;
var status;
var remarks;

//wordcount check
var range = (stdTokens.length*20)/100
var stdLength = stdTokens.length;
var mydocLength = mydocTokens.length;

if(mydocLength <= stdLength-range || mydocLength >= stdLength+range){
  status = "Rejected";
  remarks="word limit range is not correct";
    console.log("invalid size of Document");
}else{
  status = "Accepted";
  //points
  points+=(similarNouns/stdNouns.length)*5;

  points+=(similarAdjectives/stdAdjectives.length)*5;

  points+=(similarVerbs/stdVerbs.length)*5;

  //remarks
  if(points > 80 && points < 100){
        remarks="Document is good";
     } 
     else if(points > 50 && points < 80){
        remarks="Document is average";
     }
     else{
        remarks="Document is poor"; 
  }
}


makeJson();
// Function to make JSON
function makeJson(){
    var score = {
      Standard : 
        {
          wordCount : stdLength,
          nouns : stdNouns.length,
          adjectives : stdAdjectives.length,
          verbs : stdVerbs.length
        }, 

      Mydoc : 
        {
          wordCount : mydocLength,
          nouns : mydocNouns.length,
          adjectives : mydocAdjectives.length,
          verbs : mydocVerbs.length
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
  // Writing in the JSON file
  fs.writeFileSync('output.json',json)
}
