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

       
    }  
  }
}
