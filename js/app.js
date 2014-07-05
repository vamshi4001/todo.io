function allowDrop(ev)
{
	ev.preventDefault();
}

function drag(ev)
{	
	//console.log(ev.target.id);
	ev.dataTransfer.setData("Text",ev.target.id);
}

function drop(ev)
{
	ev.preventDefault();
	var data=ev.dataTransfer.getData("Text");
	ev.target.appendChild(document.getElementById(data));
}
function showinput(e){
	var inputel = document.getElementById(e.srcElement.previousElementSibling.id);
	var addel = document.getElementById(e.srcElement.id);
	inputel.style.display = "block"
	addel.style.display = "none";
}
function addtask(e){
	console.log(e);
	var button = document.getElementById(e.srcElement);
	var input = e.srcElement.previousElementSibling.value;
	var taskcontainer = e.srcElement.parentNode.parentNode;
	addentry(input,taskcontainer);	
}
function addentry(taskname,taskcontainer){
	console.log(taskname);
	console.log(taskcontainer);
}