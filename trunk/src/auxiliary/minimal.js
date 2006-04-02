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
Freja._aux.bind = function(func, self) {
	return function() { func.apply(self, arguments); };
};
/** formContents(elem) : Array */
Freja._aux.formContents = MochiKit.DOM.formContents;
/** getElement(id) : HTMLElement */
Freja._aux.getElement = function(id) {
	if (typeof(id) == "object") {
		return id;
	} else {
		return document.getElementById(id);
	}
};

/** registerSignals(src, signals) : void */
Freja._aux.registerSignals = function(src, signals) { /* void */ };
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
	src._signals[signal].push(fnc);
};
/** signal(src, signal, ...) : void */
Freja._aux.signal = function(src, signal) {
	try {
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
	} catch (e) { /* squelch */ }
};
/** createDeferred() : Deferred */
Freja._aux.createDeferred = function() {
	return new Freja._aux.Deferred();
};
/** openXMLHttpRequest(method, url, async, user, pass) : XMLHttpRequest */
Freja._aux.openXMLHttpRequest = function(method, url, async, user, pass) {
	var req;
	method = method.toUpperCase();
	try { req = new ActiveXObject("Msxml2.XMLHTTP"); }
	catch (e) { try { req = new ActiveXObject("Microsoft.XMLHTTP"); }
	catch (e) { req = new XMLHttpRequest(); }}
	if (!req) throw new Error("Can't create XMLHttpRequest");
	if (user && pass) {
		req.open(method, url, async, user, pass);
	} else {
		req.open(method, url, async);
	}
	if (method == "POST" || method == "PUT") {
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	return req;
};
/** sendXMLHttpRequest(req, sendContent) : Deferred */
Freja._aux.sendXMLHttpRequest = function(req, sendContent) {
	var d = Freja._aux.createDeferred();
	var bComplete = false;
	req.onreadystatechange = function() {
		if (req.readyState == 4 && !bComplete) {
			if (req.status == 0 || req.status == 200 || req.status == 304) {
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
Freja._aux.serializeXML = Sarissa.serialize;
/** loadXML(string) : XMLDocument */
Freja._aux.loadXML = function(text) {
	return (new DOMParser()).parseFromString(text, "text/xml");
};
/** transformXSL(XMLDocument, XSLDocument) : string */
Freja._aux.transformXSL = function(xml, xsl) {
	var processor = new XSLTProcessor();
	processor.importStylesheet(xsl);
	return Freja._aux.serializeXML(processor.transformToDocument(xml));

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
	if (Sarissa.IS_ENABLED_SELECT_NODES) {
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
};
Freja._aux.Deferred.prototype.errback = function() {
	if (this._bad.length == 0) {
		this._pending = [this.errback, arguments];
		return;
	}
	for (var i=0; i < this._bad.length; i++) {
		this._bad[i].apply(window, arguments);
	}
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
	this.addCallbacks(null, fncOK);
};
