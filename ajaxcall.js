function getData(){
  var xmlHttp = new XMLHttpRequest();
  var url = "http://localhost:3000/db";
  xmlHttp.open("GET", url, true);
  xmlHttp.send();

  xmlHttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
      	var myArr= JSON.parse(this.responseText);
      	var dataObj= JSON.stringify(myArr);
      	document.getElementById('button').innerHTML=dataObj;
 var standardNouns = obj.Standard.nouns;
        var standardAdjectives = obj.Standard.adjectives;
        var standardVerbs = obj.Standard.verbs;
        var standWordCount = obj.Standard.wordCount;
        var evalNouns = obj.Eval.nouns;
        var evalAdjectives = obj.Eval.adjectives;
        var evalVerbs = obj.Eval.verbs;
        var evalWordCount = obj.Eval.wordCount;
        var status = obj.Result.docStatus;
        var points = obj.Result.docPoints;
        var remark = obj.Result.docRemarks;
    
       //code to be added in html page dynamically
        var html_code = "<p class = \"new_content\">Comparison completed!!<br>"; 
        html_code+="<table id = \"table\"><tr><th>Table</th><th>Word Count</th><th>Nouns</th><th>Adjectives</th><th>Verbs</th></tr>";
        html_code+="<tr><th>Your Document</th><td>"+evalWordCount+"</td><td>"+evalNouns+"</td><td>"+evalAdjectives+"</td><td>"+evalVerbs+"</td></tr>";
        html_code+="<tr><th>Standard Document</th><td>"+standWordCount+"</td><td>"+standardNouns+"</td><td>"+standardAdjectives+"</td><td>"+standardVerbs+"</td></tr></table><br></p>";
        html_code+="<p class = \"new-content\"></b> Your document status :"+status+" </p>";
        html_code+="<p class = \"new-content\"></b> Your final score :"+points+" </p>";
        html_code+="<p class = \"new-content\"></b> Remark :"+remark+" </p>";

        document.getElementById('content').insertAdjacentHTML('afterend', html_code);
    }  
  }
}