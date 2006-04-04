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
	if(typeof (func)=="string"){
		func=self[func];
	}
	return function() { func.apply(self, arguments); };
};
/** formContents(elem) : Array */
Freja._aux.formContents = function(elem) {
	if (!elem) v = document;
	var names = [];
	var values = [];
	var inputs = elem.getElementsByTagNames("INPUT");
	for (var i = 0; i < inputs.length; ++i) {
		var input = inputs[i];
		if (input.name) {
			if (input.type == "radio" || input.type == "checkbox") {
				if (input.checked) {
					names.push(input.name);
					values.push(input.value);
				}
			} else {
				names.push(input.name);
				values.push(input.value);
			}
		}
	}
	var textareas = elem.getElementsByTagNames("TEXTAREA");
	for (var i = 0; i < textareas.length; ++i) {
		var input = textareas[i];
		if (input.name) {
			names.push(input.name);
			values.push(input.value);
		}
	}
	var selects = elem.getElementsByTagNames("SELECT");
	for (var i = 0; i < selects.length; ++i) {
		var input = textareas[i];
		if (input.name) {
			if (input.selectedIndex >= 0) {
				var opt = input.options[input.selectedIndex];
				names.push(input.name);
				values.push((opt.value) ? opt.value : opt.text);
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
Freja._aux.xmlize = function(anyObject, objectName, indentSpace) {
	var escape = function(sXml) {
		return sXml.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	};
	indentSpace = indentSpace ? indentSpace : '';
	var s = indentSpace  + '<' + objectName + '>';
	var isLeaf = false;
	if(!(anyObject instanceof Object) || anyObject instanceof Number || anyObject instanceof String
	|| anyObject instanceof Boolean || anyObject instanceof Date){
		s += escape(""+anyObject);
		isLeaf = true;
	} else {
		s += "\n";
		var itemKey = '';
		var isArrayItem = anyObject instanceof Array;
		for (var name in anyObject) {
			s += Freja._aux.xmlize(anyObject[name], (isArrayItem ? "array-item key=\""+name+"\"" : name), indentSpace + "   ");
		};
		s += indentSpace;
	};
	return s += (objectName.indexOf(' ') != -1 ? "</array-item>\n":"</" + objectName + ">\n");
};
/** serializeXML(node) : string */
Freja._aux.serializeXML = function(node) {
	if (node.xml) return node.xml;
	return (new XMLSerializer()).serializeToString(node);
};
/** loadXML(string) : XMLDocument */
Freja._aux.loadXML = function(text) {
	if (window.ActiveXObject) {
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.4.0");
		xmlDoc.loadXML(text);
		return xmlDoc;
	}
	return (new DOMParser()).parseFromString(text, "text/xml");
};
/** transformXSL(XMLDocument, XSLDocument) : string */
Freja._aux.transformXSL = function(xml, xsl) {
	if (xml.transformNode) {
		return xml.transformNode(xsl);
	};
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
	if (window.ActiveXObject || (document.implementation && document.implementation.hasFeature("XPath", "3.0"))) {
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
if (document.implementation && document.implementation.hasFeature("XPath", "3.0")) {
	XMLDocument.prototype.selectNodes = function(sExpr, contextNode) {
		var nsDoc = this;
		var nsresolver = this.createNSResolver(this.documentElement);
		var oResult = this.evaluate(sExpr,
			(contextNode ? contextNode : this),
			nsresolver,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var nodeList = new Array(oResult.snapshotLength);
		nodeList.item = function(i) {
			return (i < 0 || i >= this.length) ? null : this[i];
		};
		nodeList.expr = sExpr;
		for (var i = 0;i < nodeList.length; i++) {
			nodeList[i] = oResult.snapshotItem(i);
		};
		return nodeList;
	    };
	Element.prototype.selectNodes = function(sExpr) {
		var doc = this.ownerDocument;
		if (doc.selectNodes) {
			return doc.selectNodes(sExpr, this);
		} else {
			throw new Error("Method selectNodes is only supported by XML Elements");
		};
	};
	XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode) {
		var ctx = contextNode ? contextNode : null;
		sExpr = "("+sExpr+")[1]";
		var nodeList = this.selectNodes(sExpr, ctx);
		if (nodeList.length > 0) {
			return nodeList.item(0);
		} else {
			return null;
		}
	};
	Element.prototype.selectSingleNode = function(sExpr) {
		var doc = this.ownerDocument;
		if (doc.selectSingleNode) {
			return doc.selectSingleNode(sExpr, this);
		} else {
			throw new Error("Method selectNodes is only supported by XML Elements");
		}
	};
};