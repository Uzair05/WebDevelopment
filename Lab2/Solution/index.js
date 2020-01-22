function loadPage(){
	removeElement();
	loadEvents();
	loadFooter();
	styleSearchButton();

	var form = document.getElementsByTagName("form")[0];
	form.addEventListener("submit", inputValidation); 

}

function removeElement(){
	var parent = document.getElementById("eventList");
	var first_child = parent.children[0];
	parent.removeChild(first_child);
}

function loadEvents(){
	
	var events = document.getElementById("eventList");
	var item = document.createElement("h3");
	item.innerHTML="Upcoming events";
	events.appendChild(item);
	
	item = document.createElement("ul");
	var subitem = document.createElement("li");
	var subsubitem = document.createElement("a");
	subsubitem.setAttribute("href", "http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=67201");
	subsubitem.innerHTML="Public Seminar of Physics RPg Students.";
	subitem.appendChild(subsubitem);
	item.appendChild(subitem);
	events.appendChild(item);

	subitem = document.createElement("li");
	subsubitem = document.createElement("a");
	subsubitem.setAttribute("href",'http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=67198');
	subsubitem.innerHTML="Three-dimensional Quantum Hall Effect and Metal-insulator Transition in ZrTe5.";
	subitem.appendChild(subsubitem);
	item.appendChild(subitem);
	
	subitem = document.createElement("li");
	subsubitem = document.createElement("a");
	subsubitem.setAttribute("href","http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=66860");
	subsubitem.innerHTML="Sharing Session by MPH Alumni.";
	subitem.appendChild(subsubitem);
	item.appendChild(subitem);	
}

function loadFooter(){
	
	var footer = document.getElementById("footer");
	var item = document.createElement("h3");
	item.innerHTML="HKU website - Feedback, Web accessibility";
	footer.appendChild(item);

	item = document.createElement("p");
	var text = document.createTextNode("Email: ");
	item.appendChild(text);
	var subitem = document.createElement("a");
	subitem.setAttribute("href","mailto:webadm@hku.hk");
	subitem.innerHTML = "webadm@hku.hk";
	item.appendChild(subitem);
	footer.appendChild(item);

	item = document.createElement("p");
	item.innerHTML="Telephone: (+852) 3917 0123 ";
	footer.appendChild(item);
}

function styleSearchButton(){
	var search_button = document.getElementById("myButton");
	search_button.style.background = "linear-gradient(to left top, lightskyblue, lightpink)";
}

function inputValidation(event){
	var search = document.getElementById("mySearch");
	
	if(search.value==""){
		event.preventDefault();
		alert("Please fill in the content you want to search!");
		search.focus();
	}

}