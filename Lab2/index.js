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


	parent = document.getElementById("eventList");
	var list = document.createElement(ul);
	var item = document.createElement(li);
	var link = document.createElement(a);
	link.setAttribute("href","http://hkuems1.hku.hk/hkuems/ec_hdetail.aspx?guest=Y&UEID=67201");
	link.innerHTML="Public Seminar of Physics RPg Students";
	item.appendChild(link);
	/*yellow*/
	list.appendChild(link);
	parent.appendChild(list);

}

function loadFooter(){


}

function styleSearchButton(){

}

function inputValidation(event){


}
