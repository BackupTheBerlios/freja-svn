
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

	// Project Dependent Assets	
	function loadProjectAssets(projectId) {	
		
		if(!projectId) 
			var projectId = projects.get("//project[status='active']/id");				
		
		todos      = getModel("models/todos.xml"); 		// Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/todos/lists"));									
		messages   = getModel("models/posts.xml"); 		// Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/msg/archive"));	
		milestones = getModel("models/milestones.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/milestones/list"));
		dispatch('showMessageList');
	}
	Freja._aux.connect(projects, 'onload', function(){loadProjectAssets()});
	
	
	// ---------------------------------------------------------------------------------------------
	// VIEW BEHAVIORS
	// ---------------------------------------------------------------------------------------------	

	todoList_view.behaviors["editToDoListLink"] = {
		onclick : function(node) {
			dispatch('editToDoList', {toDoListId : extractId(node.id) });
		}
	}
	
	messageList_view.behaviors["editMessageLink"] = {
		onclick : function(node) {	
			var id = extractId(node.id);			
			if(!isMessageLoaded(id)) {
				loadMessage(id);
			}		
			
		}
	}
	
	milestoneList_view.behaviors["editMilestoneLink"] = {
		onclick : function(node) {
			dispatch('editMilestone', {milestoneId : extractId(node.id) });
		}
	}
	
	function addMoreBehaviors() {		
		switch(this.url) {
			case "views/project_selector.xsl":				
				var select = document.getElementById('currentProjectSelector');
				select.onchange = function(e) {
					var projectId = select.options[select.selectedIndex].value;
					loadProjectAssets(projectId);
				}
				break;
		}
	}	
	Freja._aux.connect(projectSelector_view,'onrendercomplete',Freja._aux.bind(addMoreBehaviors, projectSelector_view));
	
	// ---------------------------------------------------------------------------------------------

	// ---------------------------------------------------------------------------------------------
	function isMessageLoaded(id) {		
		var post = messages.document.selectSingleNode("//post[id='"+id+"']");
		if(post) {
			// message is in our message list, but could be the abbreviated version.
			if(post.selectSingleNode('extended-body')) 
				return true;			
		}
		return false;
	}
	function loadMessage(id) {
		
		var newMessage = getModel(addProxyToUrl("/msg/get/"+id));
		
		Freja._aux.connect(newMessage,'onload', function() {
			
			var node = newMessage.document.documentElement;
			
			if(messages.document.importNode) {
				node = messages.document.importNode(node,true);
			} // else use cloneNode?
			
			// need to destroy newMessage ?
			
			var currentNode = messages.document.selectSingleNode("//post[id='"+id+"']");				
			if(currentNode) {				
				currentNode.parentNode.insertBefore(node,currentNode);
				currentNode.parentNode.removeChild(currentNode);
			} else {		
				messages.document.documentElement.appendChild(node);				
			}			
			showModelSnapshot(newMessage);
			message_view.render(messages, 'placeholder_main', {messageId: id });	
		});		
	}
	// ---------------------------------------------------------------------------------------------
	// DISPATCHER
	// ---------------------------------------------------------------------------------------------
	
	function dispatch(action, params) {
		
		switch (action) {
			default:	
				// init												
				dispatch('showProjectSelector');				
				break;
			case 'showProjectSelector':	
				projectSelector_view.render(projects, 'placeholder_projectSelector');				
				break;
			case 'showToDoList':					
				todoList_view.render(todos, 'placeholder_main');				
				break;
			case 'showMessageList':
				messageList_view.render(messages, 'placeholder_main');				
				break;	
			case 'showMilestoneList':
				milestoneList_view.render(milestones, 'placeholder_main');				
				break;				
			case 'editMessage':
				
				//message_view.render(messages, 'placeholder_main', params);				
				break;
				
			case 'editProject':
				project_view.render(projects, 'placeholder_main', params);				
				break;
			case 'editCompany':
				company_view.render(company, 'placeholder_main', params);				
				break;
				
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
	window.onload = dispatch;