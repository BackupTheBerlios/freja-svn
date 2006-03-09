/**
  * Package : begin
  */
if (typeof(dojo) != "undefined") {
	dojo.provide("Freja");
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
Freja.NAME = "Freja";
Freja.VERSION = "0.0";
Freja.__repr__ = function () {
	return "[" + this.NAME + " " + this.VERSION + "]";
};
Freja.toString = function () {
	return this.__repr__();
};
/**
  * Package : end
  */
/**
  * Single-hierarchy inheritance (class emulation)
  * @see    http://www.itsalleasy.com/2006/02/05/prototype-chain/
  */
Freja.Class = {};
Freja.Class.extend = function(subClass, superClass) {
	var inlineSuper = function(){};
	inlineSuper.prototype = superClass.prototype;
	subClass.prototype = new inlineSuper();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superClass = superClass;
}
/**
  * The baseclass for queryengines
  * @abstract
  */
Freja.QueryEngine = function() {}
Freja.QueryEngine.prototype.getElementById = function(document, id) {
	// getElementById doesn't work on XML document without xml:id
	var allElements = document.getElementsByTagName("*");
	for (var i= 0; i < allElements.length; i++) {
		if (allElements[i].getAttribute("id") == id) {
			return allElements[i];
		}
	}
}
Freja.QueryEngine.prototype.get = function(document, expression) {
	return this._find(document, expression).nodeValue;
}
Freja.QueryEngine.prototype.set = function(document, expression, value) {
	this._find(document, expression).nodeValue = value;
}
/**
  * XPath query engine.
  */
Freja.QueryEngine.XPath = function() {}
Freja.Class.extend(Freja.QueryEngine.XPath, Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find = function(document, expression) {
	var node = document.selectSingleNode(expression);
	if (node && node.nodeType == 2) {
		return node;
	} else if (node && node.firstChild && node.firstChild.nodeType == 3) {
		return node.firstChild;
	} else if (node && node.firstChild && node.firstChild.nodeType == 4) {
		return node.firstChild;
	}
	throw new Error("Can't evaluate expression " + expression);
}
/**
  * SimplePath
  */
Freja.QueryEngine.SimplePath = function() {};
Freja.Class.extend(Freja.QueryEngine.SimplePath, Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find = function(document, expression) {
	if (!expression.match(/^[\d\w\/@\[\]]*$/)) {
		throw new Error("Can't evaluate expression " + expression);
	}
	var parts = expression.split(/\//);
	var node = document;
	var regAttr = new RegExp("^@([\\d\\w]*)");
	var regOffset = new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
	var attr = null;
	var offset = 0;
	for (var i = 0; i < parts.length; ++i) {
		var part = parts[i];
		offset = regOffset.exec(part);
		if (offset) {
			part = offset[1];
			offset = offset[2] - 1;
		} else {
			offset = 0;
		}
		if (part != "") {
			attr = regAttr.exec(part);
			if (attr) {
				node = node.getAttributeNode(attr[1]);
			} else {
				node = node.getElementsByTagName(part).item(offset);
			}
		}
	}
	if (node && node.firstChild && node.firstChild.nodeType == 3) {
		return node.firstChild;
	} else if (node && node.firstChild && node.firstChild.nodeType == 4) {
		return node.firstChild;
	}
	if (!node) {
		throw new Error("Can't evaluate expression " + expression);
	}
	return node;
}
/**
  * Standard model component
  */
Freja.Model = function(url, query) {
	this.url = url;
	this.type = "model";
	this.ready = false;
	this.document = null;
	this.query = query;
	registerSignals(this, ["onload"]);
}
/**
  * Returns a single value
  */
Freja.Model.prototype.getElementById = function(id) {
	if (this.document) {
		return this.query.getElementById(this.document, id);
	}
	return null;
}
/**
  * Returns a single value
  */
Freja.Model.prototype.get = function(expression) {
	if (this.document) {
		return this.query.get(this.document, expression);
	}
	return null;
}
/**
  * Updates a value
  */
Freja.Model.prototype.set = function(expression, value) {
	if (this.document) {
		return this.query.set(this.document, expression, value);
	}
	return null;
}
/**
  * Updates the model from a view
  */
Freja.Model.prototype.updateFrom = function(view) {
	var values = view.getValues();
	for (var i = 0; i < values[0].length; ++i) {
		this.set(values[0][i], values[1][i]);
	}
}
/**
  * Writes the model back to the remote service
  * @async
  * @returns Deferred
  */
Freja.Model.prototype.update = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = new XMLHttpRequest();
	if (Freja.AssetManager.HTTP_REQUEST_TYPE == "sync") {
		req.open("POST", url, false);
	} else {
		req.open("POST", url);
	}
	try {
		// for some obscure reason exceptions aren't thrown back if I call the
		// shorthand version of sendXMLHttpRequest in IE6.
		return MochiKit.Async.sendXMLHttpRequest(req, Sarissa.serialize(this.document));
	} catch (ex) {
		var e  = new Error("Can't complete request for : " + url);
		e.innerException = ex;
		throw e;
	}
}
/**
  * Deletes the model from the remote service
  * @todo This doesn't work on Opera since it doesn't support HTTP-DELETE method.
  *       We have to make workaround of sorts ...
  * @async
  * @returns Deferred
  */
Freja.Model.prototype._delete = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = new XMLHttpRequest();
	if (Freja.AssetManager.HTTP_REQUEST_TYPE == "sync") {
		req.open("DELETE", url, false);
	} else {
		req.open("DELETE", url);
	}
	return MochiKit.Async.sendXMLHttpRequest(req);
}
Freja.Model.prototype.reload = function() {
	this.ready = false;
	var onload = bind(function(document) {
		this.document = document;
		this.ready = true;
		MochiKit.Signal.signal(this, "onload");
	}, this);
	Freja.AssetManager.loadAsset(this.url, onload, Freja.AssetManager.onerror);
}

/**
  * Experimental
  */
Freja.Model.DataSource = function(baseURL, selectURL) {
	this.baseURL = baseURL;
	this.selectURL = selectURL;
}

Freja.Model.DataSource.prototype.select = function() {
	return getModel(this.selectURL);
};
Freja.Model.DataSource.prototype.get = function(pkey) {
	try {
		var args = eval("(" + pkey + ")");
	} catch (ex) {
		throw new Error("JSON can't be eval'ed:\n" + pkey);
	}
	var url = this.baseURL + "?" + queryString(args);
	return getModel(url);
};
/**
  * @todo This doesn't work on Opera since it doesn't support HTTP-PUT method.
  *       We have to make workaround of sorts ...
  */
Freja.Model.DataSource.prototype.create = function(values) {
	var url = this.baseURL;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = new XMLHttpRequest();
	if (Freja.AssetManager.HTTP_REQUEST_TYPE == "sync") {
		req.open("PUT", url, false);
	} else {
		req.open("PUT", url);
	}

	var payload = {};
	for (var i = 0, len = values[0].length; i < len; ++i) {
		payload[values[0][i]] = values[1][i];
	}
	return MochiKit.Async.sendXMLHttpRequest(req, Sarissa.xmlize(payload, 'record'));
}

/**
  * Standard view component
  */
Freja.View = function(url, renderer) {
	this.url = url;
	this.type = "view";
	this.ready = false;
	this.document = null;
	this.renderer = renderer;
	this.handlers = [];
	this.placeholder = null;
	this.destination = null;
	registerSignals(this, ["onload","onrendercomplete"]);
	connect(this, "onrendercomplete", bind(this.connectBehaviour, this));
}
/**
  * @async
  */
Freja.View.prototype.render = function(model) {
	try {
		this.destination = $(this.placeholder);
		this.destination.innerHTML = Freja.AssetManager.THROBBER_HTML;
		if (!this.ready) {
			connect(this, "onload", bind(this.render, this, model));
			return;
		}
		if (model && !model.ready) {
			connect(model, "onload", bind(this.render, this, model));
			return;
		}
		if (!model) {
			model = { document : (new DOMParser()).parseFromString("<?xml version='1.0' ?><dummy/>", "text/xml")};
		}
		// @todo this should be considered async
		var oncomplete = bind(function() {
			MochiKit.Signal.signal(this, "onrendercomplete", this.destination)
		}, this);
		this.renderer.transform(model, this, this.destination, oncomplete);
	} catch (ex) {
		alert(ex.message);
	}
}
/**
  * Decorates the output of the primary renderer, to inject behaviour.
  * @note Maybe we could use cssQuery (http://dean.edwards.name/my/cssQuery/)
  *       to identify targets for behaviour, rather than just the id-attribute.
  */
Freja.View.prototype.connectBehaviour = function(destination) {
	try {
		var connectCallback = function(node, eventType, callback) {
			connect(node, eventType, bind(
				function(e) {
					var allow = false;
					try {
						allow = callback(this);
					} catch (ex) {
						throw new Error("An error ocurred in user handler.\n" + ex.message);
					} finally {
						if (!allow) {
							e.stop();
						}
					}
				}, node)
			);
		}
		var applyHandlers = function(node, handlers) {
			for (var i = 0, c = node.childNodes, l = c.length; i < l; ++i) {
				var child = c[i];
				if (child.nodeType == 1) {
					var id = child.getAttribute("handler");
					if (id != "") {
						var handler = handlers[id];
						if (handler) {
							for (var eventType in handler) {
								connectCallback(child, eventType, handler[eventType]);
							}
						}
					}
					applyHandlers(child, handlers);
				}
			}
		}
		applyHandlers(destination, this.handlers);
	} catch (ex) {
		alert(ex.message);
	}
}
/**
  * Returns the values of a formview
  */
Freja.View.prototype.getValues = function() {
	return formContents(this.destination);
}

/**
  * Base object for viewrenderers
  */
Freja.View.Renderer = function() {}
/**
  * XSLT based render-engine
  */
Freja.View.Renderer.XSLTransformer = function() {}
Freja.Class.extend(Freja.View.Renderer.XSLTransformer, Freja.View.Renderer);
/**
  * @async
  */
Freja.View.Renderer.XSLTransformer.prototype.transform = function(model, view, destination, oncomplete) {
	var processor = new XSLTProcessor();
	processor.importStylesheet(view.document);
	var result = processor.transformToDocument(model.document);
	var html = Sarissa.serialize(result);
	if (!html) {
		throw new Error("XSL Transformation error.");
	} else {
		// fix empty textareas
		// Can't this be fixed by outputting as html rather than xml ?
		// <xsl:output method="html" />
		html = html.replace(/<textarea([^\/>]*)\/>/gi,"<textarea $1></textarea>");
	}
	destination.innerHTML = html;
	oncomplete();
}
/**
  * XSLT on a remote service for browser which have no native support.
  * @param    url    URL of the transform service
  */
Freja.View.Renderer.RemoteXSLTransformer = function(url) {
	this.url = url;
}
Freja.Class.extend(Freja.View.Renderer.RemoteXSLTransformer, Freja.View.Renderer);
/**
  * @async
  */
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform = function(model, view, destination, oncomplete) {
	// prepare posted data  (no need to send the XSL document, just its url)
	var xslUrl = view.url;
	var postedData = "xslFile=" + encodeURIComponent(xslUrl) + "&xmlData=" + encodeURIComponent(Sarissa.serialize(model.document));
//	if (xslParams)
//		postedData  = postedData + "&xslParam=" + encodeURIComponent(xslParams.toString());
	// send request to the server-side XSL transformation service
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				destination.innerHTML = req.responseText;
				if (oncomplete) {
					oncomplete();
				}
			} else {
				destination.innerHTML = req.responseText;
			}
		}
	}
	req.open("POST", Freja.AssetManager.XSLT_SERVICE_URL, true);
	req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	req.send(postedData);
}
/**
  * main repository
  * @static
  */
Freja.AssetManager = {
	models : [],
	views : [],
	undoHistory : []	// this isn't used atm
}
/**
  * "async" | "sync"
  */
Freja.AssetManager.HTTP_REQUEST_TYPE = "async";
/**
  * url of the service to do the work.
  */
Freja.AssetManager.XSLT_SERVICE_URL = "srvc-xslt.php";
/**
  * HTML displayed while waiting for stuff to happen
  */
Freja.AssetManager.THROBBER_HTML = "<span style='color:white;background:firebrick'>Loading ...</span>";
/**
  * returns an instance of the queryengine to use
  */
Freja.AssetManager.createQueryEngine = function() {
	if (Sarissa.IS_ENABLED_SELECT_NODES) {
		return new Freja.QueryEngine.XPath();
	} else {
		return new Freja.QueryEngine.SimplePath();
	}
}
/**
  * returns an instance of the renderengine to use
  */
Freja.AssetManager.createRenderer = function() {
//	return new Freja.View.Renderer.RemoteXSLTransformer(this.XSLT_SERVICE_URL);
	if (typeof(XSLTProcessor) != "undefined") {
		return new Freja.View.Renderer.XSLTransformer();
	} else {
		return new Freja.View.Renderer.RemoteXSLTransformer(this.XSLT_SERVICE_URL);
	}
}
/**
  * Wipes all caches. This isn't something you will normally use during production,
  * but it's very helpful for debugging/testing
  */
Freja.AssetManager.clearCache = function() {
	this.models = [];
	this.views = [];
}
/**
  * Load a model-component
  * @param    url      string
  */
Freja.AssetManager.getModel = function(url) {
	for (var i=0; i < this.models.length; i++) {
		if (this.models[i].url == url) {
			return this.models[i];
		}
	}
	var m = new Freja.Model(url, this.createQueryEngine());
	var onload = bind(function(document) {
		this.document = document;
		this.ready = true;
		MochiKit.Signal.signal(this, "onload");
	}, m);
	this.loadAsset(url, onload, Freja.AssetManager.onerror);
	this.models.push(m);
	return m;
}
/**
  * Load a view-component
  * @param    url      string
  */
Freja.AssetManager.getView = function(url) {
	for (var i=0; i < this.views.length; i++) {
		if (this.views[i].url == url) {
			return this.views[i];
		}
	}
	var v = new Freja.View(url, this.createRenderer());
	var onload = bind(function(document) {
		this.document = document;
		this.ready = true;
		MochiKit.Signal.signal(this, "onload");
	}, v);
	this.loadAsset(url, onload, Freja.AssetManager.onerror);
	this.views.push(v);
	return v;
}
Freja.AssetManager.loadAsset = function(url, onload, onerror) {
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var callback = function(transport) {
		try {
			if (transport.responseText != "" && transport.responseXML.xml == "") {
				// The server doesn't reply with Content-Type: text/xml
				// this will happen if the file is loaded locally (through file://)
				var document = (new DOMParser()).parseFromString(transport.responseText, "text/xml");
			} else {
				var document = transport.responseXML;
			}
		} catch (ex) {
			if (onerror) {
				onerror(ex);
			}
			throw ex;
		}
		onload(document);
	}
	try {
		var req = new XMLHttpRequest();
		if (this.HTTP_REQUEST_TYPE == "sync") {
			req.open("GET", url, false);
//			MochiKit.Async.sendXMLHttpRequest(req).addCallbacks(callback, onerror);

			req.send(null);
			callback(req);

		} else {
			req.open("GET", url);
//			MochiKit.Async.sendXMLHttpRequest(req).addCallbacks(callback, onerror);

			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					try {
						status = req.status;
						if (!status && MochiKit.Base.isNotEmpty(req.responseText)) {
							// 0 or undefined seems to mean cached or local
							status = 304;
						}
					} catch (ex) {}
					if (status == 200 || status == 304) { // OK
						callback(req);
					} else {
						onerror(new Error("HTTP Request failed: " + status));
					}
				}
			}
			req.send(null);

		}
	} catch (ex) {
		if (onerror) {
			onerror(ex);
		}
		throw ex;
	}
}
Freja.AssetManager.onerror = function(ex) {
	alert(ex.message);
}
/**
  * Global exports
  */
window.getModel = bind("getModel", Freja.AssetManager);
window.getView = bind("getView", Freja.AssetManager);