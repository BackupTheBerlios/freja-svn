
	// See http://www.basecamphq.com/api/

	// Error Handler
	window.onerror = errorHandler;
	
	// RESOURCES
	// ---------------------------------------------------------------------------------------------
	// Constants
	var BASECAMP_URL = "http://freja.projectpath.com";	

	// 3rd party libraries.
	var helpers = new wHELPERS();	// misc. javascript functions

	// Views
	var project_view = getView("views/project.xsl");
	var projectSelector_view = getView("views/project_selector.xsl");	
	var todoList_view = getView("views/todo_list.xsl");
	var messageList_view = getView("views/message_list.xsl");
	var milestoneList_view = getView("views/milestone_list.xsl");
	
	// Models
	var projects = getModel("models/projects.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/project/list")));	
	var todos = null; 	   
	var messages = null;   
	var milestones = null; 

	// Project Dependent Assets	
	function loadProjectAssets(projectId) {	
		
		if(!projectId) 
			var projectId = projects.get("//project[status='active']/id");				
		
		todos = getModel("models/todos.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/todos/lists"));							
		Freja._aux.connect(todos, 'onload', function() { dispatch('showToDoList'); });	
		
		messages = getModel("models/posts.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/msg/archive"));
		Freja._aux.connect(messages, 'onload', function() { dispatch('showMessageList'); });	
		
		milestones = getModel("models/milestones.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+projectId+"/milestones/list"));
		Freja._aux.connect(milestones, 'onload', function() { dispatch('showMilestoneList'); });	
	}
	Freja._aux.connect(projects, 'onload', function(){loadProjectAssets()});
	
	
	// ---------------------------------------------------------------------------------------------
	// VIEW BEHAVIORS
	// ---------------------------------------------------------------------------------------------
	
	function addProjectSelectorBehaviors() {
		//showModelSnapshot(projects);
		var select = document.getElementById('currentProjectSelector');
		select.onchange = function(e) {
			var projectId = select.options[select.selectedIndex].value;
			loadProjectAssets(projectId);
		}
	}	
	Freja._aux.connect(projectSelector_view, 'onrendercomplete', addProjectSelectorBehaviors);

	function addToDoListBehaviors() {
		//showModelSnapshot(todos);
		var el = document.getElementById('placeholder_main').getElementsByTagName("a");
		for (var i=0;i<el.length;i++) {
			if (helpers.hasClass(el[i], "editToDoListLink")) {
				el[i].onclick = function() {
					dispatch('editToDoList', {toDoListId : extractId(this.id) });
				}		
			}			
		} 
	}
	Freja._aux.connect(todoList_view, 'onrendercomplete', addToDoListBehaviors);

	function addMessageListBehaviors() {
		//showModelSnapshot(messages);
		var el = document.getElementById('placeholder_main').getElementsByTagName("a");
		for (var i=0;i<el.length;i++) {
			if (helpers.hasClass(el[i], "editMessageLink")) {
				el[i].onclick = function() {
					dispatch('editMessage', {messageId : extractId(this.id) });
				}		
			}			
		} 
	}
	Freja._aux.connect(messageList_view, 'onrendercomplete', addMessageListBehaviors);
	

	function addMilestoneListBehaviors() {
		//showModelSnapshot(milestones);
		var el = document.getElementById('placeholder_main').getElementsByTagName("a");
		for (var i=0;i<el.length;i++) {
			if (helpers.hasClass(el[i], "editMilestoneLink")) {
				el[i].onclick = function() {
					dispatch('editMilestone', {milestoneId : extractId(this.id) });
				}		
			}			
		} 
	}
	Freja._aux.connect(milestoneList_view, 'onrendercomplete', addMilestoneListBehaviors);
	
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
		// format: 'anystring__id'. Returns the part after the '-'.
		//         or [event object]
		// used to encode a Model element id in a unique html id.
		
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