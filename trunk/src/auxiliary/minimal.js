/**
  * Freja._aux
  * wrapper for external dependencies (frameworks).
  *
  * This is the minimal auxiliary adapter. It contains self-sufficient
  * implementations of all dependencies.
  * 
  */
if (typeof(Freja) == "undefined") {
	Freja = {};
}
Freja._aux = {};
/** bind(func, self) : function */
// from http://blog.ianbicking.org/prototype-and-object-prototype.html
Freja._aux.bind = function(func, self) {
	if(typeof (func)=="string"){
		func=self[func];
	}

	var im_func = null;
    if (typeof(func.im_func) == 'function') {
        im_func = func.im_func;
    } else {
        im_func = func;
    }
    func = function () {
        return func.im_func.apply(func.im_self, arguments);
    }
    func.im_func = im_func;
    func.im_self = self;
	return func;
};
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
Freja._aux.getElement = function(id) {
	if (typeof(id) == "object") {
		return id;
	} else {
		return document.getElementById(id);
	}
};

/** connect(src, signal, fnc) : void */
Freja._aux.connect = function(src, signal, fnc) {

	if(!src) return;
	if (src.addEventListener) {
		var wrapper = function(e) {
			var evt = {
				stop : function() {
					if (e.cancelable) {
						e.preventDefault();
					}
					e.stopPropagation();
				}
			}
			fnc(evt);
		}
		src.addEventListener(signal.replace(/^(on)/, ""), wrapper, false);
	} else if (src.attachEvent) {
		var wrapper = function() {
			var e = window.event;
			var evt = {
				stop : function() {
					e.cancelBubble = true;
					e.returnValue = false;
				}
			}
			fnc(evt);
		}
		src.attachEvent(signal, wrapper);
	}
	if (!src._signals) {
		src._signals = [];
	}
	if (!src._signals[signal]) {
		src._signals[signal] = [];
	}
	/*
	 * @TODO Check this
	 * see: http://www.formassembly.com/forums/viewtopic.php?t=282&sid=189221aa89bf7245deb04bbfb8d3c7e9
	 * 
	 * // checks if the callback has already been registered with the same function
	 * for(var item=0; item < src._signals[signal].length;item++) {
	 * 	if(src._signals[signal][item].toString() == fnc.toString()) return;
	 * } 
	 */
	 
    
	src._signals[signal].push(fnc);
};
/** signal(src, signal, ...) : void */
Freja._aux.signal = function(src, signal) {

	try {
		if(src._signals && src._signals[signal]) {
			var sigs = src._signals[signal];
			var args = [];
			for (var i=2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			for (var i=0; i < sigs.length; i++) {
				try {
					sigs[i].apply(src, args);
				} catch (e) { /* squelch */ }
			}
		}
	} catch (e) { /* squelch */ }
};
/** createDeferred() : Deferred */
Freja._aux.createDeferred = function() {
	return new Freja._aux.Deferred();
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
Freja._aux.sendXMLHttpRequest = function(req, sendContent) {
	var d = Freja._aux.createDeferred();
	var bComplete = false;
	req.onreadystatechange = function() {
		if (req.readyState == 4 && !bComplete) {
			if (req.status == 0 || req.status == 200 || req.status == 201 || req.status == 304) {
				d.callback(req);
			} else {
				d.errback(req);
			}
			bComplete = true;
		}
	}
	if (!sendContent) sendContent = "";
	req.send(sendContent);
	return d;
};
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
				for (var i = data.childNodes.length; i >= 0; i--) {
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
/** A pale replacement for MochiKit.Async.Deferred */
Freja._aux.Deferred = function() {
	this._good = [];
	this._bad = [];
	this._pending = null;
};
Freja._aux.Deferred.prototype.callback = function() {
	if (this._good.length == 0) {
		this._pending = [this.callback, arguments];
		return;
	}
	for (var i=0; i < this._good.length; i++) {
		this._good[i].apply(window, arguments);
	}
	this._good = [];
};
Freja._aux.Deferred.prototype.errback = function() {
	if (this._bad.length == 0) {
		this._pending = [this.errback, arguments];
		return;
	}
	for (var i=0; i < this._bad.length; i++) {
		this._bad[i].apply(window, arguments);
	}
	this._bad = [];
};
Freja._aux.Deferred.prototype.addCallbacks = function(fncOK, fncError) {
	if (fncOK) this._good[this._good.length] = fncOK;
	if (fncError) this._bad[this._bad.length] = fncError;
	if (this._pending) {
		this._pending[0].apply(this, this._pending[1]);
	}
};
Freja._aux.Deferred.prototype.addCallback = function(fncOK) {
	this.addCallbacks(fncOK);
};
Freja._aux.Deferred.prototype.addErrback = function(fncError) {
	this.addCallbacks(null, fncError);
};
Freja._aux.importNode = function(document, node, deep) {
	if(typeof deep =='undefined') deep = true;
	if(document.importNode)
		return document.importNode(node,deep);
	else
		return node.cloneNode(deep);
}