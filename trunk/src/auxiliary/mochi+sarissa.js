/**
  * Freja._aux
  * wrapper for external dependencies (frameworks).
  *
  * This is the default auxiliary adapter. It bridges Freja to MochiKit + Sarissa
  *
  * You shouldn't rely on this functionality - it's merely a hook for Freja towards
  * external dependencies. This is the only part of the application you'll need to
  * adjust, to make Freja play ball with your favourite framework.
  */
if (typeof(dojo) != "undefined") {
	dojo.require("MochiKit.Base");
	dojo.require("MochiKit.Signal");
	dojo.require("MochiKit.Async");
	dojo.require("Sarissa");
}
if (typeof(JSAN) != "undefined") {
	JSAN.use("MochiKit.Base", []);
	JSAN.use("MochiKit.Signal", []);
	JSAN.use("MochiKit.Async", []);
	JSAN.use("Sarissa", []);
}
try {
	if (typeof(MochiKit.Base) == "undefined") {
		throw "";
	}
	if (typeof(MochiKit.Signal) == "undefined") {
		throw "";
	}
	if (typeof(MochiKit.Async) == "undefined") {
		throw "";
	}
	if (typeof(Sarissa) == "undefined") {
		throw "";
	}
} catch (e) {
	throw new Error("Freja depends on MochiKit.Base, MochiKit.Signal, MochiKit.Async and Sarissa!");
}
if (typeof(Freja) == "undefined") {
	Freja = {};
}
Freja._aux = {};
/** bind(func, self) : function */
Freja._aux.bind = MochiKit.Base.bind;
/** formContents(elem) : Array */
Freja._aux.formContents = function(elem) {
	if (!elem) elem = document;
	var names = [];
	var values = [];
	var inputs = elem.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; ++i) {
		var input = inputs[i];
		if (input.name) {
			if (input.type == "radio" || input.type == "checkbox") {
				if (input.checked) {
					names.push(input.name);
					values.push(input.value);
				} else {
					names.push(input.name);
					values.push("");
				}
			} else {
				names.push(input.name);
				values.push(input.value);
			}
		}
	}
	var textareas = elem.getElementsByTagName("TEXTAREA");
	for (var i = 0; i < textareas.length; ++i) {
		var input = textareas[i];
		if (input.name) {
			names.push(input.name);
			values.push(input.value);
		}
	}
	var selects = elem.getElementsByTagName("SELECT");
	for (var i = 0; i < selects.length; ++i) {
		var input = selects[i];
		if (input.name) {
			if (input.selectedIndex >= 0) {
				var opt = input.options[input.selectedIndex];
				names.push(input.name);
				values.push((opt.value) ? opt.value : "");
			}
		}
	}
	return [names, values];
};

/** getElement(id) : HTMLElement */
Freja._aux.getElement = MochiKit.DOM.getElement;

/** connect(src, signal, fnc) : void */
Freja._aux.connect = MochiKit.Signal.connect;
/** signal(src, signal, arg) : void */
Freja._aux.signal = MochiKit.Signal.signal;
/** createDeferred() : Deferred */
Freja._aux.createDeferred = function() {
	return new MochiKit.Async.Deferred();
};
/** openXMLHttpRequest(method, url, async, user, pass) : XMLHttpRequest */
Freja._aux.openXMLHttpRequest = function(method, url, async, user, pass) {
	var req = new XMLHttpRequest();
	if (user && pass) {
		req.open(method, url, async, user, pass);
	} else {
		req.open(method, url, async);
	}
	if (method == "POST" || method == "PUT") {
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	// RoR/cakePHP Ajax request detection compatibility:
	req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');	
	return req;
};
/** sendXMLHttpRequest(req, sendContent) : Deferred */
Freja._aux.sendXMLHttpRequest = MochiKit.Async.sendXMLHttpRequest;
/** xmlize(anyObject, objectName) : string */
Freja._aux.xmlize = Sarissa.xmlize;
/** serializeXML(node) : string */
Freja._aux.serializeXML = function(node) {
	if (node.xml) return node.xml;
	return (new XMLSerializer()).serializeToString(node);
};
/** loadXML(string) : XMLDocument */
Freja._aux.loadXML = function(text) {
	return (new DOMParser()).parseFromString(text, "text/xml");
};
/** transformXSL(XMLDocument, XSLDocument) : string */
Freja._aux.transformXSL = function(xml, xsl, xslParameters) {
	var processor = new XSLTProcessor();
	processor.importStylesheet(xsl);
	if(xslParameters) {
		for (var paramName in xslParameters) {
			processor.setParameter("", paramName, xslParameters[paramName]);
		}
	}
	 
	return processor.transformToFragment(xml, window.document);
};
/** cloneXMLDocument(document) : XMLDocument */
Freja._aux.cloneXMLDocument = function(xmlDoc) {
	var clone = null;
	try {
		clone = xmlDoc.cloneNode(true);
	} catch(e) { /* squelch */ }
	
	// Can't clone a DocumentNode in Safari & Opera. Let's try something else.
	// @note Wouldn't it be easier to serialize the document to string and the parse it to a new document ?
	if (!clone) {
		if (document.implementation && document.implementation.createDocument) {
			clone = document.implementation.createDocument("", xmlDoc.documentElement.nodeName, null);
			// importNode is not safe in Safari ! the source document is altered. used cloneNode to fix the prblm
			var data = clone.importNode(xmlDoc.documentElement.cloneNode(true), true);
			try {
				clone.appendChild(data);
			} catch(e) {				
				// Opera has already created a documentElement and can't append another root node
				var rootNode = clone.documentElement;
			
				for (var i = data.childNodes.length-1; i >= 0; i--) {
					rootNode.insertBefore(data.childNodes[i], rootNode.firstChild);
				}
				
				// need to copy root node attributes
				for (var i = 0; i < xmlDoc.documentElement.attributes.length; i++) {
					var name  = xmlDoc.documentElement.attributes.item(i).name;
					var value = xmlDoc.documentElement.attributes.item(i).value;
					clone.documentElement.setAttribute(name, value);
				}				
			}
		}
	}
	
	return clone;
};

/** hasSupportForXSLT() : boolean */
Freja._aux.hasSupportForXSLT = function() { return (typeof(XSLTProcessor) != "undefined"); };
/** createQueryEngine() : Freja.QueryEngine */
Freja._aux.createQueryEngine = function() {
	if (Sarissa._SARISSA_IS_IE || Sarissa.IS_ENABLED_SELECT_NODES) {
		return new Freja.QueryEngine.XPath();
	} else {
		return new Freja.QueryEngine.SimplePath();
	}
};
Freja._aux.importNode = function(document, node, deep) {
	if(typeof deep =='undefined') deep = true;
	if(document.importNode)
		return document.importNode(node,deep);
	else
		return node.cloneNode(deep);
}
