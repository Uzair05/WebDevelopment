function loadPage(){
	removeElement();
	loadEvents();
	loadFooter();
	styleSearchButton();


}

function removeElement(){
	var parent = document.getElementById("eventList");
	parent.removeChild(parent.children[0]);
}

function loadEvents(){
	var parent = document.getElementById("eventList");
	var x = document.createElement("h3");
	x.innerHTML="Upcoming events";
	parent.appendChild(x);


	var list = document.createElement("ul");
	var item1 = document.createElement("li");
	var link1 = document.createElement("a");
	link1.setAttribute("href","http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=67201");
	link1.innerHTML="Public Seminar of Physics RPg Students.";
	item1.appendChild(link1);

	var item2 = document.createElement("li");
	var link2 = document.createElement("a");
	link2.setAttribute("href","http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=67198");
	link2.innerHTML="Three-dimensional Quantum Hall Effect and Metal-insulator Transition in ZrTe5.";
	item2.appendChild(link2);

	var item3 = document.createElement("li");
	var link3 = document.createElement("a");
	link3.setAttribute("href","http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=66860");
	link3.innerHTML="Sharing Session by MPH Alumni.";
	item3.appendChild(link3);


	list.appendChild(item1);
	list.appendChild(item2);
	list.appendChild(item3);
	parent.appendChild(list);


}

function loadFooter(){
	var parent = document.getElementById("footer");
	var header = document.createElement("h3");
	header.innerHTML = "HKU website - Feedback, Web accessibility";
	parent.appendChild(header);
	var para1 = document.createElement("p");
	para1.innerHTML="Email:";
	var link = document.createElement("a");
	link.setAttribute("href","mailto:webadm@hku.hk");
	link.innerHTML="webadm@hku.hk";
	para1.appendChild(link);
	parent.appendChild(para1);
	var para2 = document.createElement("p");
	para2.innerHTML="Telephone: (+852) 3917 0123";
	parent.appendChild(para2);
}

function styleSearchButton(){
 var parent = document.getElementById("myButton");
 parent.style.backgroundImage =  'linear-gradient(to left top, #87CEFA, #FFB6C1)';
}




/*error in this function*/
function inputValidation(event){

	var f = document.getElementById("mySearch");
	if (f.value == ""){
		alert("Please fill in the content you want to search!");
		document.getElementTagName("myButton").addEventListener("click", function(event){event.preventDefault()});
	}

}
