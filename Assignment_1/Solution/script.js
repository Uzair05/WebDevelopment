var currentPage = 0; //the current page number  
var currentMailBox = "Inbox";
var currentContentId = "";
var showContent = false;

function hideDropDown(mailbox) {
  if (mailbox == "Inbox"){
    document.getElementById("dropdown-inbox").style.display = "none";
    document.getElementById("dropdown-sent").style.display = "block";
    document.getElementById("dropdown-important").style.display = "block";
    document.getElementById("dropdown-trash").style.display = "block";
  } else if (mailbox == "Sent") {
    document.getElementById("dropdown-inbox").style.display = "block";
    document.getElementById("dropdown-sent").style.display = "none";
    document.getElementById("dropdown-important").style.display = "block";
    document.getElementById("dropdown-trash").style.display = "block";
  } else if (mailbox == "Important"){
    document.getElementById("dropdown-inbox").style.display = "block";
    document.getElementById("dropdown-sent").style.display = "block";
    document.getElementById("dropdown-important").style.display = "none";
    document.getElementById("dropdown-trash").style.display = "block";
  } else if (mailbox == "Trash") {
    document.getElementById("dropdown-inbox").style.display = "block";
    document.getElementById("dropdown-sent").style.display = "block";
    document.getElementById("dropdown-important").style.display = "block";
    document.getElementById("dropdown-trash").style.display = "none";
  }
}

//display the email list
function loadMoreEmails(mailbox) {
  //enable the function division
  document.getElementById("compose").disabled = false;
  document.getElementById("new").disabled = false;
  document.getElementById("old").disabled = false;
  document.getElementById("move_func").disabled = false;
  if (document.getElementById("send-email").style.display == "block"){
    document.getElementById("send-email").style.display = "none";
    document.getElementById("emails").style.display = "block";
    document.getElementsByClassName("dropdown-content")[0].style.display = null;
    // clear input of composed email
    document.getElementById("compose-recipient").value = "";
    document.getElementById("compose-title").value = "";
    document.getElementById("compose-content").value = "";
  }

  currentMailBox = mailbox;
  showContent = false;
  hideDropDown(currentMailBox);
  currentPage = 0;
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var mesgs = document.getElementById("emails");
      mesgs.innerHTML = xmlhttp.responseText;
      if(mailbox == 'Inbox'){
        document.getElementById("old").onclick = function(){olderEmail('Inbox')};
        document.getElementById("new").onclick = function(){newerEmail('Inbox')};
        document.getElementById("inbox").style.color = "red";
        document.getElementById("important").style.color = "black";
        document.getElementById("sent").style.color = "black";
        document.getElementById("trash").style.color = "black";
      }

      if(mailbox == 'Important'){
        document.getElementById("old").onclick = function(){olderEmail('Important')};
        document.getElementById("new").onclick = function(){newerEmail('Important')};
        document.getElementById("inbox").style.color = "black";
        document.getElementById("important").style.color = "red";
        document.getElementById("sent").style.color = "black";
        document.getElementById("trash").style.color = "black";
      }
      if (mailbox == 'Sent'){
        document.getElementById("old").onclick = function(){olderEmail('Sent')};
        document.getElementById("new").onclick = function(){newerEmail('Sent')};
        document.getElementById("inbox").style.color = "black";
        document.getElementById("important").style.color = "black";
        document.getElementById("sent").style.color = "red";
        document.getElementById("trash").style.color = "black";
      }
      if(mailbox == 'Trash'){
        document.getElementById("old").onclick = function(){olderEmail('Trash')};
        document.getElementById("new").onclick = function(){newerEmail('Trash')};
        document.getElementById("inbox").style.color = "black";
        document.getElementById("important").style.color = "black";
        document.getElementById("sent").style.color = "black";
        document.getElementById("trash").style.color = "red";
      }
    }
  }
  xmlhttp.open("GET", "retrieveemaillist?currentPage="+currentPage+"&mailbox="+mailbox, true);
  xmlhttp.send();
}

//show older emails when you click " > " button
function olderEmail(mailbox){
  if (showContent == false){ // if it is not showContent page
    currentPage =  currentPage + 1; //increase currentPage by 1
    var xmlhttp = new XMLHttpRequest();
    
	xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {	
        if (xmlhttp.responseText == ""){
          // at the last page
          currentPage = currentPage - 1;
        } else{
          document.getElementById("emails").innerHTML = xmlhttp.responseText;
        }
      }
    }
    xmlhttp.open("GET", "retrieveemaillist?currentPage="+currentPage+"&mailbox="+mailbox, true);
    xmlhttp.send();
  } else { // in showContent page
    var increment = "1";
    var xmlhttp = new XMLHttpRequest();
   
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (xmlhttp.responseText.startsWith('err')){
          console.log("getemail error:"+xmlhttp.responseText);
        } else {
          document.getElementById("emails").innerHTML = xmlhttp.responseText;
          currentContentId = document.getElementById("emails").firstChild.id;
        }
      }
    }
    xmlhttp.open("GET", "getemail?emailID="+currentContentId+"&increment="+increment+"&mailbox="+currentMailBox, true);
    xmlhttp.send();
  }
}

//show newer emails when you click " < " button
function newerEmail(mailbox) {
  if (showContent == false){ // if it is not showContent page
    currentPage = currentPage - 1; //decrease currentPage by 1
    if (currentPage < 0){
      //at the first page
      currentPage = 0;
      return;
    }
	
    var xmlhttp = new XMLHttpRequest();
    
	xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById("emails").innerHTML = xmlhttp.responseText;
      }
    }
	
    xmlhttp.open("GET", "retrieveemaillist?currentPage="+currentPage+"&mailbox="+mailbox, true);
    xmlhttp.send();
  } else { // in showContent page
    var increment = "-1";
    var xmlhttp = new XMLHttpRequest();
    
	xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        if (xmlhttp.responseText.startsWith('err')){
          console.log("getemail error:"+xmlhttp.responseText);
        } else {
          document.getElementById("emails").innerHTML = xmlhttp.responseText;
          currentContentId = document.getElementById("emails").firstChild.id;
        }
      }
    }
    xmlhttp.open("GET", "getemail?emailID="+currentContentId+"&increment="+increment+"&mailbox="+currentMailBox, true);
    xmlhttp.send();
  }
}

//display email content
function showEmailContent(emailID){
  showContent = true;
  currentContentId = emailID;
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var mesgs = document.getElementById("emails");
      mesgs.innerHTML = xmlhttp.responseText;
    } 
  }
  xmlhttp.open("GET", "getemail?emailID="+emailID, true);
  xmlhttp.send();
}

//delete and move emails
function mailboxChange(dstmailbox){
  var srcmailbox = currentMailBox;
  var i,j;
  var querystring = "labelcheck=";

  var xmlhttp = new XMLHttpRequest();
  
  if (showContent == false) {
    //collect all checked email entries	
    var els = document.getElementsByClassName("check");
    var checked = new Array();
    for(i = 0, j = 0; i < els.length; i++){
      if(els[i].checked == true){
        checked[j++] = els[i];
      }
    }
	
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        for(i = 0; i < checked.length; i++){
          //remove selected email entries from the current email list display in the email division
          var mailId = checked[i].id+"_m";
          var element = document.getElementById(mailId);
          element.parentNode.removeChild(element);
        }
        //append newly retrieved email entries to the bottom of the list
        document.getElementById("emails").innerHTML += xmlhttp.responseText;
      }
    }
	
    //collect the emailIDs of all selected email entries and combine them into a string				
    for (i = 0; i < checked.length; i++) {
      if ( i == 0 ){
        querystring += checked[i].id;
      } else {
        querystring += ",";
        querystring += checked[i].id;
      }
    }
	
    xmlhttp.open("POST", "changemailbox", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(querystring+"&srcmailbox="+srcmailbox+"&dstmailbox="+dstmailbox+"&currentPage="+currentPage);
	
  } else {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //append newly retrieved email entries to the bottom of the list
        document.getElementById("emails").innerHTML = xmlhttp.responseText;
      }
    }
    //collect the emailIDs of displayed email entry
    querystring += currentContentId;
    xmlhttp.open("POST", "changemailbox", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(querystring+"&srcmailbox="+srcmailbox+"&dstmailbox="+dstmailbox+"&currentPage="+currentPage+"&showContent=1");
  }
}


function ComposeEmail() {
  document.getElementById("send-email").style.display = "block";
  document.getElementById("emails").style.display = "none";
  document.getElementsByClassName("dropdown-content")[0].style.display = "none";
  document.getElementById("move_func").disabled = true;
  document.getElementById("new").disabled = true;
  document.getElementById("old").disabled = true;
}


function SendEmail(){
  var sender = "amy@cs.hku.hk";
  var recipient = document.getElementById("compose-recipient").value;
  var title = document.getElementById("compose-title").value;
  var content = document.getElementById("compose-content").value;
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var emailList = document.getElementById("emails");
      emailList.innerHTML = xmlhttp.responseText;
      
	    document.getElementById("send-email").style.display = "none";
      document.getElementById("emails").style.display = "block";
      document.getElementById("new").disabled = false;
      document.getElementById("old").disabled = false;
      document.getElementById("move_func").disabled = false;
      document.getElementsByClassName("dropdown-content")[0].style.display = null;
      // clear input of composed email
      document.getElementById("compose-recipient").value = "";
      document.getElementById("compose-title").value = "";
      document.getElementById("compose-content").value = "";
    }
  }
  xmlhttp.open("POST", "sendemail", true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send("sender="+sender+"&recipient="+recipient+
                "&title="+title+"&content="+content+"&mailbox="+currentMailBox);
}
