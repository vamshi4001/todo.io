var TaskManager = function() {
	var getDataFromLocalStore = function(){
		return (localStorage.getItem("TodoData") && JSON.parse(localStorage.getItem("TodoData"))) || ({ recentTaskId: 0, listData: {} });
	},	
	data = getDataFromLocalStore(),
	// taskId = data.recentTaskId,
	updateDataInLocalStore = function(){
		localStorage.setItem("TodoData", JSON.stringify(data));
	};
	return {
		buildTasks : function(task){
			var tasklist = document.getElementById("task-list");
			var li = document.createElement("li");
			li.setAttribute("class","list");	
			li.setAttribute("id",task+'id');	
			li.textContent = task;
			tasklist.appendChild(li);
			var id = task+"div";

			var div = document.createElement("div");
			div.className = "task";
			div.id=task+"div";
			div.setAttribute("ondrop","drop(event)");
			div.setAttribute("ondragover","allowDrop(event)");

			var title = document.createElement("div");
			title.className = "task-title";
			title.textContent = task;

			var timg = document.createElement("img");
			timg.src = "img/delete.png";
			timg.className = "task-delete";
			timg.setAttribute("onclick","myList.removeList(this.parentNode.parentNode.id.split('div')[0])");

			title.appendChild(timg);

			var ul = document.createElement("ul");
			ul.className = "items";

			var inp = document.createElement("div");
			inp.id = task+"input";
			inp.style.display = "none";
			inp.innerHTML = '<input type="text"><button class="btn btn-success add-item" onclick = "addItem(event)">Add</button>';

			var addt = document.createElement("div");
			addt.className = "item-add";
			addt.setAttribute("onclick","showinput(event)");
			addt.textContent = "Add Task";
			
			div.appendChild(title);
			div.appendChild(ul);
			div.appendChild(inp);
			div.appendChild(addt);

			var taskcontainer = document.getElementsByClassName("task-container")[0];
			taskcontainer.appendChild(div);
		},
		addList : function(task){
			if(!task){
				var task = prompt("Enter List Name");		
			}
			if(task){
				if(data.listData[task]) {
					alert("List already exists");
				} else {
					data.listData[task] = {};
					/* Add the list in UI */
					updateDataInLocalStore();
					this.buildTasks(task);
				}
			}						
		},
		addTask : function(name, listName){
			if(name!=""){
				taskId = data.listData[listName].length-1;
				if(data.listData[listName]) {
					var id = "task"+Math.floor((Math.random()*10000000)+1);
					data.listData[listName][id] = name;
					/* Add the task in UI */
					this.addentry(name,listName+"div",id);	
					updateDataInLocalStore();
				} else {
					alert("List not found");
				}
			}
		},
		addentry: function (taskname,taskcontainer,id){
			taskcontainer = document.getElementById(taskcontainer);
			var li = document.createElement("li");	
			li.setAttribute("draggable","true");
			if(!id){
				li.setAttribute("id",Math.floor((Math.random()*10000000)+1));
			}			
			else{
				li.setAttribute("id",id);
			}
			li.setAttribute("ondragstart","drag(event)");
			// li.setAttribute("onclick","edittask(this)");
			taskcontainer.getElementsByClassName("items")[0].appendChild(li);			
			li.textContent = taskname;
			addDelete(li);			
		},
		moveTask : function(taskId,fromList, toList) {
			data.listData[toList][taskId] = data.listData[fromList][taskId];
			delete data.listData[fromList][taskId];			
			updateDataInLocalStore();									
		},
		removeList: function(listName){
			document.getElementById(listName+'div').style.display = "none";	
			document.getElementById(listName+'id').style.display = "none";	
			console.log(this.getData().listData[listName]);
			delete data.listData[listName];			
			/* Remove task from list */
			updateDataInLocalStore();						
		},
		removeTask : function(taskId, fromList) {
			document.getElementById(taskId).style.display = "none";							
			delete data.listData[fromList][taskId];			
			updateDataInLocalStore();						
		},
		updateTask : function(name, taskId, fromList){
			console.log(name);
			data.listData[fromList][taskId] = name;			
			updateDataInLocalStore();			
		},
		getData: function(){
			return getDataFromLocalStore();
		}
	};
}


/*Create UI From The Data*/
var myList = new TaskManager();
var data = myList.getData().listData;
for(var key in data){
	myList.buildTasks(key);
	if(data[key]){
		for (var key1 in data[key]) {
			myList.addentry(data[key][key1],key+"div",key1);
			// console.log(key1+"--->"+data[key][key1]);			
		};
	}
}	

function addDelete(li){
	var delimg = document.createElement("img");
	delimg.setAttribute("title","delete");
	delimg.setAttribute("onclick","myList.removeTask(this.parentNode.id,this.parentNode.parentNode.parentNode.id.split('div')[0])");
	delimg.className = "delete";
	delimg.src = "img/delete.gif";

	var editimg = document.createElement("img");
	editimg.setAttribute("title","edit");
	editimg.setAttribute("onclick","edittask(this.parentNode)");
	editimg.className = "edit";
	editimg.src = "img/edit.gif";
	
	li.appendChild(editimg);
	li.appendChild(delimg);	
}

function allowDrop(ev)
{
	ev.preventDefault();
}

function drag(ev)
{	
	ev.dataTransfer.setData("Text",ev.target.id);
	var src = ev.srcElement.parentNode.parentNode.id;
	ev.dataTransfer.setData("divid",src);
}

function drop(ev)
{
	ev.preventDefault();
	var target = ev.srcElement.parentNode;
	if(ev.srcElement.parentNode.tagName!="DIV"){
		target = ev.srcElement.parentNode.parentNode;
	}
	var data=ev.dataTransfer.getData("Text");
	var divid=ev.dataTransfer.getData("divid");	
	document.getElementById(data).style.display = "block";
	if(target.getElementsByTagName("ul")[0]){
		target.getElementsByTagName("ul")[0].appendChild(document.getElementById(data));
	}	
	else{
		alert("Please drop above text input")
	}
	myList.moveTask(data,divid.split('div')[0],target.id.split('div')[0]);	
}

function showinput(e){
	var inputel = document.getElementById(e.srcElement.previousElementSibling.id);
	inputel.getElementsByTagName("input")[0].focus()
	inputel.style.display = "block"	
}
function addItem(e){
	var button = document.getElementById(e.srcElement);
	var input = e.srcElement.previousElementSibling.value;
	var taskcontainer = e.srcElement.parentNode.parentNode.id;
	var inpcontainer = e.srcElement.parentNode;
	myList.addTask(input,taskcontainer.split('div')[0]);	
	e.srcElement.previousElementSibling.value = "";
	inpcontainer.style.display="none";
}
function edittask(elem){	
	var task = prompt("Edit Task Name",elem.textContent);
	if (task!=null)
	{
			elem.textContent = task;			
			myList.updateTask(task, elem.id, elem.parentNode.parentNode.id.split('div')[0]);			
	}	
	addDelete(elem);	
}