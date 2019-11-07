var count = 0;
var currentMailBox='';

function countF(){
  count+=1;
  LoadInbox(currentMailBox);
}
function countB(){
  count-=1;

  if (count<0){
    count=0;
  }
  LoadInbox(currentMailBox);
}
function countClean(){
  count=0;
}
function setBox(box){
  currentMailBox = box;
}
function cleanColour(){
  document.getElementById("Inbox").style.backgroundColor = "white";
  document.getElementById("Important").style.backgroundColor = "white";
  document.getElementById("Sent").style.backgroundColor = "white";
  document.getElementById("Trash").style.backgroundColor = "white";
}
function LoadInbox(poh){
  setBox(poh);
  //clears mailbox
  document.getElementById("email").innerHTML = "";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var holder = JSON.parse(xmlhttp.responseText)
      //Appends response_string to email division
      document.getElementById("email").innerHTML = ResHTML(holder);
      cleanColour();
      document.getElementById(poh).style.backgroundColor = "#bfbfbf";

    }
  }
  xmlhttp.open("GET","retrieveemaillist?mailBox=" + poh,true);
  xmlhttp.send();
}
function ResHTML(docs) {
  var response_string = "";

  var number_of_messages = 10;

  var ubound = ((count+1)*number_of_messages);
  if (ubound>docs.length){
    ubound = docs.length;
  }
  var lbound=(count*number_of_messages);
  if (lbound>docs.length){
    lbound = docs.length;
  }



  for (var i = lbound; (lbound <= i) && (i < ubound); i++) {
    var email = docs[i];
    response_string += "<input type=\"checkbox\" id="+email['_id']+">" + "<div class=\"hope\" onclick=\"LoadEmail("+"\'"+email['_id']+"\'"+");\">";
    response_string += email['sender'] + " " + email['title'] + " " + email['time'];
    response_string += "</div></input><br>";
  }
  return response_string;
}
function MoveHot(mailBox){
  var Topple = [];
  var mode = document.getElementById("email").childNodes;
  var len = mode.length;

  for(var i = 0;i<len;++i){
    if (mode[i].checked == true){
      Topple.push(mode[i].id);
    }
  }

  for(var i=0;i<Topple.length;++i){
    Update(Topple[i],mailBox);
  }

}
function Update(id,mailBox){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      if(xmlhttp.responseText == 'OK'){
        LoadInbox(currentMailBox);
      }
    }
  }
  xmlhttp.open("POST","changemailbox",true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("mailBox="+mailBox+"&id="+id);
  LoadInbox(currentMailBox);
}
function LoadEmail(id){
  //clears mailbox
  document.getElementById("email").innerHTML = "";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      var holder = JSON.parse(xmlhttp.responseText);
      //Appends response_string to email division
      document.getElementById("email").innerHTML = ResEmail(holder);
      cleanColour();
    }
  }
  xmlhttp.open("GET","getemail?id=" + id,true);
  xmlhttp.send();
}
function ResEmail(mood){
  var docs = mood[0];
  var response_string = "";
  response_string += "<span style=\"float:left;\">" + docs['title'] + "</span><span style=\"float:right;\">" + docs['time'] + "</span><br>" + docs['sender'] + "<br>" + docs['recipient'] + "<br>";
  response_string += "<br>" + docs['content'];

  return response_string;
}
function LoadCompose(){
  cleanColour();
  var response_string="";
  var email = document.getElementById("email");
  response_string += "New Message <br>";
  response_string += "To: <input type=\"text\" style=\"margin-left: 40px;position:relative;\" id=\"recipient\"><br>";
  response_string += "Subject: <input type=\"text\" style=\"margin-left: 09px;position:relative;\" id=\"title\"><br>";
  response_string += "<textarea id=\"content\" id=\"content\"></textarea><br><br>";
  response_string += "<button type=\"button\" onclick=\"PostMan();\">Send</button>";
  email.innerHTML = response_string;
}
function PostMan(){
  var recipient = document.getElementById("recipient").value;
  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      LoadInbox('Sent');
    }
  }
  xmlhttp.open("POST", "sendemail", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("recipient="+recipient+"&title="+title+"&content="+content);
  LoadInbox('Sent');
}
