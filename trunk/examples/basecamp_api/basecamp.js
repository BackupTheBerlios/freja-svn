
	// See http://www.basecamphq.com/api/

	// Error Handler
	window.onerror = errorHandler;
	
	// Constants
	var BASECAMP_URL = "http://freja.projectpath.com";	

	// 3rd party libraries.
	var helpers = new wHELPERS();	// misc. javascript functions

	// ---------------------------------------------------------------------------------------------
	// ASSETS
	// ---------------------------------------------------------------------------------------------

	// Views
	var project_view         = getView("views/project.xsl");
	var projectSelector_view = getView("views/project_selector.xsl");	
	var todoList_view        = getView("views/todo_list.xsl");
	var messageList_view     = getView("views/message_list.xsl");
	var message_view         = getView("views/message.xsl");
	var milestoneList_view   = getView("views/milestone_list.xsl");
	
	// Models
	var projects   = getModel("models/projects.xml"); 	// Snapshot. Live data: getModel(addProxyToUrl("/project/list")));	
	var todos      = null; 	   
	var messages   = null;   
	var milestones = null; 
	var newMessage = null;
	var categories = null;
	
	// Variables
	var currentProjectId = null;

	// Project Dependent Assets	
	function loadProjectAssets(projectId) {	
		
		if(!projectId) 
			currentProjectId = projects.get("//project[status='active']/id");				
		else 
			currentProjectId = projectId;
			
		todos      = getModel("models/todos.xml"); 		// Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/todos/lists"));									
		messages   = getModel("models/posts.xml"); 		// Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/msg/archive"));	
		milestones = getModel("models/milestones.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/milestones/list"));
		categories = getModel(addProxyToUrl("/projects/"+currentProjectId+"/post_categories"));
		requestTemplate = getModel("models/new_request.xml");   // xml wrapper for posted data
		messageTemplate = getModel("models/new_post.xml");      // skeleton for new data
		
		
		todoList_view.render(todos, 'placeholder_todos');
		messageList_view.render(messages, 'placeholder_messages');
		milestoneList_view.render(milestones, 'placeholder_milestones');
		
	}
	Freja._aux.connect(projects, 'onload', function(){loadProjectAssets()});

	// ---------------------------------------------------------------------------------------------
	// INITIALIZATION
	// ---------------------------------------------------------------------------------------------	

	function init() {
		projectSelector_view.render(projects, 'placeholder_projectSelector');
	}
	
	// ---------------------------------------------------------------------------------------------
	// VIEW BEHAVIORS
	// ---------------------------------------------------------------------------------------------	

	todoList_view.behaviors["editToDoListLink"] = {
		onclick : function(node) {
			var id = extractId(node.id);
		}
	}
	
	messageList_view.behaviors["editMessageLink"] = {
		onclick : function(node) {	
			var id = extractId(node.id);			
			if(!isMessageLoaded(id)) {
				loadMessage(id, function() { editMessage(id); });
			} else {
				editMessage(id);
			}			
			return false;
		}
	}
	
	messageList_view.behaviors["newMessageLink"] = {
		onclick : function(node) {				
			id = createMessage();
			message_view.render(messages, 'placeholder_messages', {messageId: id});
			return false;
		}
	}
	
	message_view.behaviors["editMessageForm"] = {
		onsubmit : function(node) {	
			messages.updateFrom(message_view);
			messageList_view.render(messages, 'placeholder_messages');
			synchronize(messages,"/projects/"+currentProjectId+"/msg/create");
			return false;
		}
	}
	
	message_view.behaviors["cancelAction"] = {
		onclick : function(node) {				
			messageList_view.render(messages, 'placeholder_messages');
			return false;
		}
	}
	
	milestoneList_view.behaviors["editMilestoneLink"] = {
		onclick : function(node) {
			var id = extractId(node.id);
			return false;
		}
	}
	
	projectSelector_view.behaviors["projectSelector"] = {
		onchange: function(node) { 
			var projectId = node.options[node.selectedIndex].value;
			loadProjectAssets(projectId);			
		}
	}
	

	// ---------------------------------------------------------------------------------------------
	// MESSAGE MANAGEMENT
	// ---------------------------------------------------------------------------------------------
	function isMessageLoaded(id) {		
		var message = messages.document.selectSingleNode("//post[id='"+id+"']");
		if(message) {
			// message is in our message list, but could be the abbreviated version.
			if(message.selectSingleNode('extended-body')) 
				return true;			
		}
		return false;
	}
	
	function loadMessage(id, callback) {
		
		var newMessage = getModel(addProxyToUrl("/msg/get/"+id));
		
		Freja._aux.connect(newMessage,'onload', function() {
			
			var importedNode = newMessage.document.documentElement;
			
			if(messages.document.importNode) {
				importedNode = messages.document.importNode(importedNode,true);
			} // else use cloneNode?
			
			var currentNode = messages.document.selectSingleNode("//post[id='"+id+"']");				
			if(currentNode) {				
				currentNode.parentNode.insertBefore(importedNode,currentNode);
				currentNode.parentNode.removeChild(currentNode);
			} else {		
				messages.document.documentElement.appendChild(importedNode);				
			}	
				
			callback();

			// need to destroy newMessage ?			
		});		
	}
	
	function createMessage() {

		if(!messageTemplate) {
			// problem, template is not loaded.
			return;
		} 
		var tmpid = 'tmp'+getRandomId();
		messageTemplate.set('/post/id', tmpid);
				
		if(messages.document.importNode) {
			newMessage = messages.document.importNode(messageTemplate.document.documentElement,true);
		} // else try cloneNode

		messages.document.documentElement.appendChild(newMessage);
		return tmpid; 
	}
	
	function editMessage(id) {
		message_view.render(messages, 'placeholder_messages', {messageId: id});
	}	
	
	// ---------------------------------------------------------------------------------------------
	//   
	// ---------------------------------------------------------------------------------------------
	
	function synchronize(model, withUrl) {
		
		// get first record to be synchronized
		var outofsync = model.document.selectSingleNode("//*[@synchronized='false']"); 
		
		while(outofsync) {			
			// build request
			var requestNode = requestTemplate.document.documentElement
			requestNode.appendChild(requestTemplate.document.importNode(outofsync, true));
			requestTemplate.url = addProxyToUrl(withUrl);			

			// clean tmp ids
			var idNode = requestNode.getElementsByTagName('id')[0];
			while(idNode) {
				idNode.parentNode.removeChild(idNode);
				idNode = requestNode.getElementsByTagName('id')[0];			
			}
			showModelSnapshot(requestTemplate);	

			// send request			
			var d = requestTemplate.save();	
			d.addCallback(function(obj) {
				alert('ok ' + obj.responseText + ' ' + obj.status + ' ' + obj.responseXML);
				//outofsync.setAttribute('synchronized','true');
			});
			d.addErrback(function() {
				alert('error ');
				//outofsync.setAttribute('synchronized','false');
			});
			outofsync.setAttribute('synchronized','pending'); 
			
			//is there more to synchronize?
			outofsync = model.document.selectSingleNode("//*[@synchronized='false']"); 
		}
	}
	
	// ---------------------------------------------------------------------------------------------
	// MISC.
	// ---------------------------------------------------------------------------------------------
	
	function extractId(obj) {
		// parameter: 'anystring__id' or [event object] or [object]
		// Get the id attribute if necessary and returns the part after the '__'.
		// Used to encode a Model element id in a unique html id.
		
		if(!obj) obj = window.event;		
		switch(typeof obj) {
			case 'string':
				id = obj;
				break;
			case 'object':
				if(!obj.id) 
					obj = helpers.getSourceElement(obj);
				id = obj.id;					
				break;
			case 'undefined':
				return null;
				break;
			default:
				alert('extractId, unhandled object type: ' + typeof obj);
				return null;
				break;
		}				
		id = id.substr(id.lastIndexOf('__')+2);
		return id;
	}
	
	function getRandomId() {
		var seed = (new Date()).getTime();
		seed = seed.toString().substr(6);
		for (var i=0; i<3;i++)
			seed += String.fromCharCode(48 + Math.floor((Math.random()*10)));
		return "id-" + seed
	}
	
	function addProxyToUrl(resourceUrl) {
		return "proxy/php/proxy.php?url="+encodeURIComponent(BASECAMP_URL+resourceUrl);	
	}
	
	
	// ---------------------------------------------------------------------------------------------
	// debug misc.
	// ---------------------------------------------------------------------------------------------
	
	function showModelSnapshot(model) {
		var xml = Freja._aux.serializeXML(model.document);
		var dbg = document.getElementById('placeholder_debug');
		dbg.innerHTML = "<textarea cols='60' rows='15'>"+xml+"</textarea>";		
		dbg.style.display = "block";
	}


	// ---------------------------------------------------------------------------------------------
	// errorHandler
	// ---------------------------------------------------------------------------------------------
	
	function errorHandler(desc,page,line,chr)  {
		 alert(
			  'Sorry, a JavaScript error occurred! \n'
			 +'\nError description: \t'+desc
			 +'\nPage address:      \t'+page
			 +'\nLine number:       \t'+line
		 )
		 return true
	}
	
	// let's go!
	window.onload = init;