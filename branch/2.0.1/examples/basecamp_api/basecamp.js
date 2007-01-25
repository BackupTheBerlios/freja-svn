
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
	var comment_view         = getView("views/comment.xsl");
	var milestoneList_view   = getView("views/milestone_list.xsl");
	var categoryList_view    = getView("views/category_list.xsl");
	
	// Models
	var projects   = getModel("models/projects.xml"); 	// Snapshot. Live data: getModel(addProxyToUrl("/project/list")));	
	var todos      = null; 	   
	var messages   = null;   
	var milestones = null; 	
	var categories = null;
	var comments   = null;
	
	// Variables
	var currentProjectId = null;

	// Project Dependent Assets	
	function loadProjectAssets(projectId) {	
		
		if(!projectId) 
			currentProjectId = projects.get("//project[status='active']/id");				
		else 
			currentProjectId = projectId;
			
		todos      = getModel("models/todos.xml"); 		// Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/todos/lists"));									
		messages   = getModel("models/posts.xml");  // getModel(addProxyToUrl("/projects/"+currentProjectId+"/msg/archive"));	 // 		// Snapshot.
		milestones = getModel("models/milestones.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/milestones/list"));
		categories = getModel("models/categories.xml"); // Snapshot. Live data: getModel(addProxyToUrl("/projects/"+currentProjectId+"/post_categories"));
		requestTemplate = getModel("models/new_request.xml");   // xml wrapper for posted data
		messageTemplate = getModel("models/new_post.xml");      // skeleton for new data
		commentTemplate = getModel("models/new_comment.xml");   // skeleton for new data
	
		//Freja._aux.connect(messages, 'onload', loadAllComments);
		
		todoList_view.render(todos, 'placeholder_todos');
		messageList_view.render(messages, 'placeholder_messages');
		milestoneList_view.render(milestones, 'placeholder_milestones');
		categoryList_view.render(categories, 'placeholder_categories');
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
			if(!isMessageFullyLoaded(id)) {
				loadFullMessage(id); // prefetch full message				
			} 			
			editMessage(id);
			return false;
		}
	}
	
	messageList_view.behaviors["trashMessageLink"] = {
		onclick : function(node) {	
			if(confirm('Are you sure you want to delete this message?')) {
				var id = extractId(node.id);
				var trashed = messages.document.selectSingleNode("//post[id='"+id+"']");
				trashed.setAttribute('synchronized','false');			
				synchronize(messages,"/msg/delete/"+id);
				trashed.parentNode.removeChild(trashed);
				messageList_view.render(messages, 'placeholder_messages'); 
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
	
	messageList_view.behaviors["refreshCommentsLink"] = {
		onclick : function(node) {				
			id  = extractId(node.id);
			// loadComments(id);
			messageList_view.render(messages, 'placeholder_messages');
			showModelSnapshot(messages);	 
			return false;
		}
	}	
	
	messageList_view.behaviors["newCommentLink"] = {
		onclick : function(node) {	
			messageId = extractId(node.id);		
			id = createComment(messageId);	
			comment_view.render(messages, 'placeholder_messages', {commentId: id});
			return false;
		}
	}
	
	messageList_view.behaviors["editCommentLink"] = {
		onclick : function(node) {	
			var id = extractId(node.id);	
			editComment(id);						
			// if(!isCommentLoaded(id)) {
			//	loadComment(id); // prefetch full message
			// } 			
			return false;
		}
	}
	
	messageList_view.behaviors["trashCommentLink"] = {
		onclick : function(node) {	
			if(confirm('Are you sure you want to delete this comment?')) {
				var id = extractId(node.id);
				var trashed = messages.document.selectSingleNode("//comment[id='"+id+"']");
				trashed.setAttribute('synchronized','false');			
				synchronize(messages,"/msg/delete_comment/"+id);
				trashed.parentNode.removeChild(trashed);
				messageList_view.render(messages, 'placeholder_messages'); 
			}
			return false;
		}
	}
	
	message_view.behaviors["editMessageForm"] = {
		onsubmit : function(node) {	
			var id = extractId(node.id);			
			messages.updateFrom(message_view);
			messageList_view.render(messages, 'placeholder_messages');
			if(isTempId(id)) {
				// new message
				synchronize(messages,"/projects/"+currentProjectId+"/msg/create" , null, function() { messageList_view.render(messages, 'placeholder_messages');} );
			} else {
				// edit message
				synchronize(messages,"/msg/update/"+id, null, function() { messageList_view.render(messages, 'placeholder_messages');} );
			}
			return false;
		}
	}
	
	message_view.behaviors["cancelAction"] = {
		onclick : function(node) {				
			messageList_view.render(messages, 'placeholder_messages');
			return false;
		}
	}
	
	message_view.behaviors["getMessageBodyLink"] = {
		onclick : function(node) {		
			var id = extractId(node.id);		
							
			if(isMessageFullyLoaded(id)) {		
				editMessage(id);
			} else {
				loadFullMessage(id, function() {editMessage(id)});
			}			
			return false;
		}
	}
		
	comment_view.behaviors["editCommentForm"] = {
		onsubmit : function(node) {	
			var id = extractId(node.id);			
			messages.updateFrom(comment_view);
			messageList_view.render(messages, 'placeholder_messages');
			if(isTempId(id)) {
				// new comment
				synchronize(messages,"/msg/create_comment" , null, function() { messageList_view.render(messages, 'placeholder_messages');} );
			} else {
				// edit comment
				synchronize(messages,"/msg/update_comment/", {comment_id: id}, function() { messageList_view.render(messages, 'placeholder_messages');} );
			}
			return false;
		}
	}
	
	comment_view.behaviors["cancelAction"] = {
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
	
	categoryList_view.behaviors["editCategoryLink"] = {
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
	function isMessageFullyLoaded(id) {		
		var message = messages.document.selectSingleNode("//post[id='"+id+"']");
		if(message) {
			// message is in our message list, but could be the abbreviated version.
			if(message.selectSingleNode('extended-body')) 
				return true;			
		}
		return false;
	}
	
	function loadFullMessage(id, callback) {
		
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
		var tmpid = getRandomId();
		messageTemplate.set('/post/id', tmpid);
		messageTemplate.set('/post/category-id', '4007205');
				
		if(messages.document.importNode) {
			var newMessage = messages.document.importNode(messageTemplate.document.documentElement,true);
		} // else try cloneNode

		messages.document.documentElement.insertBefore(newMessage, messages.document.documentElement.firstChild);
		return tmpid; 
	}
	
	function editMessage(id) {
		messages.set("/post[id='"+id+"']/@edit", 'true');
		message_view.render(messages, 'placeholder_messages', {messageId: id});
	}	
	
	function editComment(id) {
		comment_view.render(messages, 'placeholder_messages', {commentId: id});
	}
	
	function createComment(messageId) {
		var tmpid = getRandomId();
		commentTemplate.set('/comment/post-id', messageId);
		commentTemplate.set('/comment/id', tmpid);
		if(messages.document.importNode) {
			var newComment = messages.document.importNode(commentTemplate.document.documentElement,true);
		} // else try cloneNode				
		
		var parentMessage = messages._query._find(messages.document,"//post[id='"+messageId+"']");
		if(parentMessage) {
			var parentMessage = parentMessage.parentNode; // _find returns a text node
			var commentList = parentMessage.getElementsByTagName('comments');
			if(commentList.length==0) {
				var commentRoot = messages.document.createElement('comments');
				commentRoot = parentMessage.appendChild(commentRoot);
			} else 
				var commentRoot = commentList[0];
			commentRoot.appendChild(newComment);
		}
		return tmpid;
	}
	
	function loadAllComments() {
		var posts = messages.document.getElementsByTagName('post');
		for (var i=0;i<posts.length;i++) {			
			loadComments(posts[i]);
		}
	}
		
	function loadComments(message) {
		var messageId = message.getElementsByTagName('id')[0].firstChild.nodeValue;
		var messageComments = getModel(addProxyToUrl("/msg/comments/"+messageId));
		Freja._aux.connect(messageComments, 'onload', 
			function() {
				attachComments(message,messageComments);
			} );
	}
	
	function attachComments(message, messageComments) {	
	 	var newComments = messages.document.importNode(messageComments.document.documentElement, true);	 	
		message.appendChild(newComments,true);
	}
	// ---------------------------------------------------------------------------------------------
	// Synchronize:
	// 1. Takes the given model, finds XML elements that are out-of-sync (@synchronized=fase).
	// 2. Copies each out-of-sync element to a new XML document within a <request> element.
	// 3. Adds additional elements if provided in the additionalParameters object.
	// 4. Sends the <request> XML to the given url (withUrl)
	// 5. If responses is OK, replaces the out-of-sync element in the model with the received data.
	// 6. Clear @synchronized attribute
	// 7. Callback (if provided)
	// ---------------------------------------------------------------------------------------------
	
	function synchronize(model, withUrl, additionalParameters, callback) {
		
		// get first record to be synchronized
		var outofsync = model.document.selectSingleNode("//*[@synchronized='false']"); 
		
		if(outofsync) {		
			// clean synchronized attribute before using outofsync to build the request 
			// (basecamp API doesn't like foreign attributes)
			outofsync.removeAttribute('synchronized');
				
			// clean previous request if any.
			var requestNode = requestTemplate.document.documentElement
			while(requestNode.firstChild)
				requestNode.removeChild(requestNode.firstChild);

			// prepare request
			requestTemplate.url = addProxyToUrl(withUrl);
			
			// add request parameters if any
			if(additionalParameters) {
				for(var p in additionalParameters) {
					var paramElement = requestTemplate.document.createElement(p);
					paramElement.appendChild(requestTemplate.document.createTextNode(additionalParameters[p]));
					requestNode.appendChild(paramElement);
				}
			}

			// add data to request			
			requestNode.appendChild(requestTemplate.document.importNode(outofsync, true));
						
			// clean tmp ids
			var idNodes = requestNode.getElementsByTagName('id');	
			for(var i=idNodes.length-1; i>=0; i--) {							
				if(idNodes[i].firstChild && isTempId(idNodes[i].firstChild.nodeValue)) {
					idNodes[i].parentNode.removeChild(idNodes[i]);						
				}
			}			
			// clean whatever basecamp API chokes on
			var nodes = requestNode.getElementsByTagName('updated-on');	
			for(var i=nodes.length-1; i>=0; i--) {			
				nodes[i].parentNode.removeChild(nodes[i]);
			}		
			
			showModelSnapshot(requestTemplate);	
			showHTTPResponse("WAITING...");
			
			// send request			
			var d = requestTemplate.save();	
			d.addCallback(function(obj) {
								
				showHTTPResponse("OK:\n"+obj.responseText);
				var updatedData =  model.document.importNode(obj.responseXML.documentElement, true); 
					
				if(updatedData) {
					// Replace current model data with what we've received.
					// (mostly to get the record's id, but more new data may be present)
					while(outofsync.firstChild)
						outofsync.removeChild(outofsync.firstChild);	
					while(updatedData.firstChild) {						
						outofsync.appendChild(updatedData.firstChild);	
					}
				}					
				outofsync.setAttribute('synchronized','true');
											
				//showModelSnapshot(model);
				if(callback) 
					callback();
				
			});
			d.addErrback(function(obj) {
				showHTTPResponse("ERROR:\n"+obj.responseText);
				outofsync.setAttribute('synchronized','failed');
			});
			outofsync.setAttribute('synchronized','pending'); 
			
			//is there more to synchronize?
			//outofsync = model.document.selectSingleNode("//*[@synchronized='false']"); 
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
	// Temp ids are used locally but do not match Basecamp record ids.
	function isTempId(id) {
		if(id.indexOf('tmpid-')==0)
			return true
		return false;
	}
	function getRandomId() {
		var seed = (new Date()).getTime();
		seed = seed.toString().substr(6);
		for (var i=0; i<3;i++)
			seed += String.fromCharCode(48 + Math.floor((Math.random()*10)));
		return "tmpid-" + seed
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
		dbg.innerHTML = "<textarea cols='60' rows='15'>"+(new Date()).toLocaleTimeString() + ' ' + xml+"</textarea>";		
		dbg.style.display = "block";
	}
	function showHTTPResponse(txt) {
		var dbg = document.getElementById('placeholder_debug2');
		dbg.innerHTML = "<textarea cols='60' rows='15'>"+ (new Date()).toLocaleTimeString()+ ' ' +txt+"</textarea>";	
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