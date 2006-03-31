/**
  * Freja - a javascript Model-View-Controller Framework geared toward Zero-Latency Web Applications
  *
  * Copyright (c) 2006 Cédric Savarese <pro@4213miles.com>, Troels Knak-Nielsen <troelskn@gmail.com>
  * This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
  *
  * Documentation : http://www.csscripting.com/freja/
  */
/**
  * Package : begin
  */
if (typeof(dojo) != "undefined") {
	dojo.provide("Freja");
}
if (typeof(Freja) == "undefined") {
	Freja = {};
}
Freja.NAME = "Freja";
Freja.VERSION = "2.0.alpha";
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
  * Freja._aux
  * wrapper for external functionality (frameworks).
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
Freja._aux = {};
/** bind(func, self[, arg, ...]) : function */
Freja._aux.bind = MochiKit.Base.bind;
/** formContents(elem) : Array */
Freja._aux.formContents = MochiKit.DOM.formContents;
/** getElement() : HTMLElement */
Freja._aux.getElement = MochiKit.DOM.getElement;

/** registerSignals(src, signals) : void */
Freja._aux.registerSignals = MochiKit.Signal.registerSignals;
/** connect(src, signal, dest[, func]) : void */
Freja._aux.connect = MochiKit.Signal.connect;
/** signal(src, signal, ...) : void */
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
	return req;
};
/** sendXMLHttpRequest(req, sendContent) : Deferred */
Freja._aux.sendXMLHttpRequest = MochiKit.Async.sendXMLHttpRequest;
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
/**
  * Single-hierarchy inheritance (class emulation)
  * @see    http://www.itsalleasy.com/2006/02/05/prototype-chain/
  *         http://www.itsalleasy.com/2006/02/24/classjs-third-time-is-the-charm/
  *
  * Extends one prototype by another.
  * The subtype will have two specialpurpose properties:
  *     superconstructor    The parent prototype's constructor
  *     supertype        The parent prototype
  */
Freja.Class = {};
Freja.Class.extend = function(subClass, superconstructor) {
	var inlineSuper = function(){};
	inlineSuper.prototype = superconstructor.prototype;
	subClass.prototype = new inlineSuper();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superconstructor = superconstructor;
	subClass.prototype.supertype = superconstructor.prototype;
};
/**
  * The baseclass for queryengines
  * @abstract
  */
Freja.QueryEngine = function() {};
Freja.QueryEngine.prototype.getElementById = function(document, id) {
	// getElementById doesn't work on XML document without xml:id
	var allElements = document.getElementsByTagName("*");
	for (var i= 0; i < allElements.length; i++) {
		if (allElements[i].getAttribute("id") == id) {
			return allElements[i];
		}
	}
};
Freja.QueryEngine.prototype.get = function(document, expression) {
	return this._find(document, expression).nodeValue;
};
Freja.QueryEngine.prototype.set = function(document, expression, value) {
	this._find(document, expression).nodeValue = value;
};
/**
  * XPath query engine.
  */
Freja.QueryEngine.XPath = function() {};
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
};
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
};
/**
  * Standard model component
  */
Freja.Model = function(url, query) {
	this.url = url;
	this.ready = false;
	this.document = null;
	this._query = query;
	Freja._aux.registerSignals(this, ["onload"]);
};
/**
  * Returns a single value
  */
Freja.Model.prototype.getElementById = function(id) {
	if (this.document) {
		return this._query.getElementById(this.document, id);
	}
	return null;
};
/**
  * Returns a single value
  */
Freja.Model.prototype.get = function(expression) {
	if (this.document) {
		return this._query.get(this.document, expression);
	}
	return null;
};
/**
  * Updates a value
  */
Freja.Model.prototype.set = function(expression, value) {
	if (this.document) {
		return this._query.set(this.document, expression, value);
	}
	return null;
};
/**
  * Updates the model from a view
  */
Freja.Model.prototype.updateFrom = function(view) {
	var values = view.getValues();
	for (var i = 0; i < values[0].length; ++i) {
		this.set(values[0][i], values[1][i]);
	}
};
/**
  * Writes the model back to the remote service
  * @returns MochiKit.Async.Deferred
  */
Freja.Model.prototype.save = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	// since the serialization may fail, we create a deferred for the
	// purpose, rather than just returning the sendXMLHttpRequest directly.
	var d = Freja._aux.createDeferred();
	var req = Freja.AssetManager.openXMLHttpRequest("POST", url);
	try {
		// for some obscure reason exceptions aren't thrown back if I call the
		// shorthand version of sendXMLHttpRequest in IE6.
		Freja._aux.sendXMLHttpRequest(req, Freja._aux.serializeXML(this.document)).addCallbacks(Freja._aux.bind(d.callback, d), Freja._aux.bind(d.errback, d));
	} catch (ex) {
		d.errback(ex);
	}
	return d;
};
/**
  * Deletes the model from the remote service
  * @returns MochiKit.Async.Deferred
  */
Freja.Model.prototype.remove = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = Freja.AssetManager.openXMLHttpRequest("DELETE", url);
	return Freja._aux.sendXMLHttpRequest(req);
};
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.Model.prototype.reload = function() {
	this.ready = false;
	var onload = Freja._aux.bind(function(document) {
		this.document = document;
		this.ready = true;
		Freja._aux.signal(this, "onload");
	}, this);
	var d = Freja.AssetManager.loadAsset(this.url, true);
	d.addCallbacks(onload, Freja.AssetManager.onerror);
	return d;
};
/**
  * DataSource provides a gateway-type interface to a REST service.
  */
Freja.Model.DataSource = function(createURL, indexURL) {
	this.createURL = createURL;
	this.indexURL = indexURL;
};
/**
  * Returns a list of primary-keys to records in the datasource
  */
Freja.Model.DataSource.prototype.select = function() {
	return getModel(this.indexURL);
};
/**
  * Creates a new instance of a record
  * @todo errback to the deferred on errors
  */
Freja.Model.DataSource.prototype.create = function(values) {
	var url = this.createURL;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = Freja.AssetManager.openXMLHttpRequest("PUT", url);
	var payload = {};
	for (var i = 0, len = values[0].length; i < len; ++i) {
		payload[values[0][i]] = values[1][i];
	}
	return Freja._aux.sendXMLHttpRequest(req, Freja._aux.xmlize(payload, 'record'));
};
/**
  * Standard view component
  */
Freja.View = function(url, renderer) {
	this.url = url;
	this.ready = false;
	this.document = null;
	this._renderer = renderer;
	this.handlers = [];
	this._destination = null;
	Freja._aux.registerSignals(this, ["onload","onrendercomplete"]);
	Freja._aux.connect(this, "onrendercomplete", Freja._aux.bind(this._connectBehaviour, this));
};
/**
  * @param    model            Freja.Model
  * @param    placeholder      string    If supplied, this will be used instead of the
  *                                      default placeholder.
  * @returns MochiKit.Async.Deferred
  */
Freja.View.prototype.render = function(model, placeholder) {

	var Handler = function(model, view, deferred) {
		this.model = model;
		this.view = view;
		this.deferred = deferred;
	};

	Handler.prototype.trigger = function() {
		try {
			if (!this.view.ready) {
				Freja._aux.connect(this.view, "onload", Freja._aux.bind(this.trigger, this));
				return;
			}
			if (typeof(this.model) == "object" && this.model instanceof Freja.Model && !this.model.ready) {
				Freja._aux.connect(this.model, "onload", Freja._aux.bind(this.trigger, this));
				return;
			}
			var model;
			if (typeof(this.model) == "undefined") {
				// supply dummy
				model = { document : Freja._aux.loadXML("<?xml version='1.0' ?><dummy/>")};
			} else if (this.model instanceof Freja.Model) {
				model = this.model;
			} else {
				// wrap pojo's in
				model = { document : Freja._aux.loadXML("<?xml version='1.0' ?>\n" + Freja._aux.xmlize(this.model, "item")) };
			}
			var trans = this.view._renderer.transform(model, this.view);
			trans.addCallback(Freja._aux.bind(function(html) {
				this._destination.innerHTML = html;
			}, this.view));
			trans.addCallback(Freja._aux.bind(function() {
				Freja._aux.signal(this, "onrendercomplete", this._destination)
			}, this.view));
			trans.addCallback(this.deferred.callback);
			trans.addErrback(this.deferred.errback);
		} catch (ex) {
			this.deferred.errback(ex);
		}
	};

	var d = Freja._aux.createDeferred();
	try {
		this._destination = Freja._aux.getElement(placeholder);
		// @todo    Is this a good idea ?
		// Perhaps we should leave it to the programmer to do this.
		this._destination.innerHTML = Freja.AssetManager.THROBBER_HTML;

		var h = new Handler(model, this, d);
		h.trigger();
	} catch (ex) {
		d.errback(ex);
	}
	return d;
};
/**
  * Decorates the output of the primary renderer, to inject behaviour.
  * @note Maybe we could use cssQuery (http://dean.edwards.name/my/cssQuery/)
  *       to identify targets for behaviour, rather than just the id-attribute.
  */
Freja.View.prototype._connectBehaviour = function(destination) {
	try {
		var connectCallback = function(node, eventType, callback) {
			Freja._aux.connect(node, eventType, Freja._aux.bind(
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
		};
		var applyHandlers = function(node, handlers) {
			for (var i = 0, c = node.childNodes, l = c.length; i < l; ++i) {
				var child = c[i];
				if (child.nodeType == 1) {
					var id = child.getAttribute("handler");
					if (id != "") {
						var handler = handlers[id];
						if (handler) {
							for (var eventType in handler) {
								if (eventType == "init") {
									handler.init(child);
								} else {
									connectCallback(child, eventType, handler[eventType]);
								}
							}
						}
					}
					applyHandlers(child, handlers);
				}
			}
		};
		applyHandlers(destination, this.handlers);
	} catch (ex) {
		alert(ex.message);
	}
};
/**
  * Returns the values of a formview
  */
Freja.View.prototype.getValues = function() {
	return formContents(this._destination);
};
/**
  * Base object for viewrenderers
  */
Freja.View.Renderer = function() {};
/**
  * XSLT based render-engine
  */
Freja.View.Renderer.XSLTransformer = function() {};
Freja.Class.extend(Freja.View.Renderer.XSLTransformer, Freja.View.Renderer);
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.View.Renderer.XSLTransformer.prototype.transform = function(model, view) {
        var d = Freja._aux.createDeferred();
        try {
		var html = Freja._aux.transformXSL(model.document, view.document);
		if (!html) {
			d.errback(new Error("XSL Transformation error."));
		} else {
			// fix empty textareas
			// Can't this be fixed by outputting as html rather than xml ?
			// <xsl:output method="html" />
			html = html.replace(/<textarea([^\/>]*)\/>/gi,"<textarea $1></textarea>");
			d.callback(html);
		}
	} catch (ex) {
		d.errback(ex);
	}
	return d;
};
/**
  * XSLT on a remote service for browser which have no native support.
  * @param    url    URL of the transform service
  */
Freja.View.Renderer.RemoteXSLTransformer = function(url) {
	this.url = url;
};
Freja.Class.extend(Freja.View.Renderer.RemoteXSLTransformer, Freja.View.Renderer);
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform = function(model, view) {
        var d = Freja._aux.createDeferred();

	// prepare posted data  (no need to send the XSL document, just its url)
	var xslUrl = view.url;
	var postedData = "xslFile=" + encodeURIComponent(xslUrl) + "&xmlData=" + encodeURIComponent(Freja._aux.serializeXML(model.document));
//	if (xslParams)
//		postedData  = postedData + "&xslParam=" + encodeURIComponent(xslParams.toString());
	// send request to the server-side XSL transformation service
	var req = Freja.AssetManager.openXMLHttpRequest("POST", Freja.AssetManager.XSLT_SERVICE_URL);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				d.callback(req.responseText);
			} else {
				d.errback(req.responseText);
			}
		}
	}
	req.send(postedData);
	return d;
};
/**
  * This is largely s copied with minor stylistic adjustments from Freja 1.1
  * I renamed it from Controller.history to distinguish between window.history
  */
Freja.UndoHistory = function() {
	this.cache = [];
	this.maxLength = 5;
	this._position = 0;
	this._undoSteps = 0;
};
/**
  * Creates a snapshot of the model and stores it.
  */
Freja.UndoHistory.prototype.add = function(model) {
	var historyIndex = this._position % this.maxLength;

	var modelDoc = model.document;
	this.cache[historyIndex] = {};
	this.cache[historyIndex].model = model;
	this.cache[historyIndex].document = Freja._aux.cloneXMLDocument(modelDoc);

	if (!this.cache[historyIndex].document) {
		throw new Error("Couldn't add to history.");
	} else {
		this._position++;
		// clear rest of the history if undo was used.
		var clearHistoryIndex = historyIndex;
		while (this._undoSteps > 0) {
			clearHistoryIndex = (clearHistoryIndex + 1) % this.maxLength;
			this.cache[clearHistoryIndex] = {};
			this._undoSteps--;
		}
		return historyIndex; // what would anybody need this for ?
	}
};
/**
  * Rolls the state back one step.
  */
Freja.UndoHistory.prototype.undo = function(steps) {
	if (this._undoSteps < this.cache.length) {
		this._undoSteps++;
		this._position--;
		if (this._position < 0) {
			this._position = this.maxLength - 1;
		}

		var model = this.cache[this._position].model;
		if (this.cache[this._position].document) {
			model.document = this.cache[this._position].document;
		} else {
			throw new Error("The model's DOMDocument wasn't properly copied into the history");
		}
		if (typeof(steps) != "undefined" && steps > 1) {
			this.undo(steps - 1);
		}
	} else {
		throw new Error("Nothing to undo");
	}
};
/**
  * Reverts the effects of undo.
  */
Freja.UndoHistory.prototype.redo = function() {
	if (this._undoSteps > 0) {
		this._undoSteps--;
		this._position = (this._position + 1) % this.maxLength;

		var model = this.cache[this._position].model;
		model.document = this.cache[this._position].document;
	} else {
		throw new Error("Nothing to redo");
	}
};
/**
  * Removes the last entry in the cache
  */
Freja.UndoHistory.prototype.removeLast = function() {
	this._position--;

	if (this._position < 0) {
		this._position = this.maxLength - 1;
	}
	this.cache[this._position] = {};
	this._undoSteps = 0;
};
/**
  * main repository
  * @static
  */
Freja.AssetManager = {
	models : [],
	views : [],
	_username : null,
	_password : null
};
/**
  * Set to sync to make all requests synchroneous. You shouldn't use
  * this setting for anything but testing/debugging.
  * "async" | "sync"
  */
Freja.AssetManager.HTTP_REQUEST_TYPE = "async";
/**
  * If this is set to null, real PUT and DELETE http-requests will be made,
  * otherwise a header will be set instead, and the request tunneled through
  * POST.
  *
  * Both IE6 and FF1.5 are known to support the required HTTP methods, so
  * if theese are your target platform, you can disable tunneling.
  */
// Freja.AssetManager.HTTP_METHOD_TUNNEL = null;
Freja.AssetManager.HTTP_METHOD_TUNNEL = "Http-Method-Equivalent";
/**
  * Set this url to provide remote xslt-transformation for browsers that
  * doesn't support it natively.
  */
Freja.AssetManager.XSLT_SERVICE_URL = "srvc-xslt.php";
/**
  * HTML displayed while waiting for stuff to happen
  */
Freja.AssetManager.THROBBER_HTML = "<span style='color:white;background:firebrick'>Loading ...</span>";
/**
  * returns an instance of the renderengine to use
  */
Freja.AssetManager.createRenderer = function() {
//	return new Freja.View.Renderer.RemoteXSLTransformer(this.XSLT_SERVICE_URL);
	if (Freja._aux.hasSupportForXSLT()) {
		return new Freja.View.Renderer.XSLTransformer();
	} else {
		return new Freja.View.Renderer.RemoteXSLTransformer(this.XSLT_SERVICE_URL);
	}
};
/**
  * Wipes all caches. This isn't something you will normally use during production,
  * but it's very helpful for debugging/testing
  */
Freja.AssetManager.clearCache = function() {
	this.models = [];
	this.views = [];
};
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
	var m = new Freja.Model(url, Freja._aux.createQueryEngine());
	var onload = Freja._aux.bind(function(document) {
		this.document = document;
		this.ready = true;
		Freja._aux.signal(this, "onload");
	}, m);
	this.loadAsset(url, true).addCallbacks(onload, Freja.AssetManager.onerror);
	this.models.push(m);
	return m;
};
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
	var onload = Freja._aux.bind(function(document) {
		this.document = document;
		this.ready = true;
		Freja._aux.signal(this, "onload");
	}, v);
	this.loadAsset(url, false).addCallbacks(onload, Freja.AssetManager.onerror);
	this.views.push(v);
	return v;
};
/**
  * Creates and opens a http-request, tunneling exotic methods if needed.
  */
Freja.AssetManager.openXMLHttpRequest = function(method, url) {
	var tunnel = null;
	if (Freja.AssetManager.HTTP_METHOD_TUNNEL && method != "GET" && method != "POST") {
		tunnel = method;
		method = "POST";
	}
	var req = Freja._aux.openXMLHttpRequest(method, url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async", Freja.AssetManager._username, Freja.AssetManager._password);
	if (tunnel) {
		req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, tunnel);
	}
	return req;
};
/**
  * Sets username + password for Http-Authentication
  */
Freja.AssetManager.setCredentials = function(username, password) {
	this._username = username;
	this._password = password;
};
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.AssetManager.loadAsset = function(url, preventCaching) {
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var d = Freja._aux.createDeferred();
	var handler = function(transport) {
		try {
			if (transport.responseText == "") {
				throw new Error("Empty response.");
			}
			if (transport.responseXML.xml == "") {
				// The server doesn't reply with Content-Type: text/xml
				// this will happen if the file is loaded locally (through file://)
				var document = Freja._aux.loadXML(transport.responseText);
			} else {
				var document = transport.responseXML;
			}
		} catch (ex) {
			d.errback(ex);
		}
		d.callback(document);
	};
	try {
		if (preventCaching && Freja.AssetManager.HTTP_METHOD_TUNNEL) {
			var req = Freja._aux.openXMLHttpRequest("POST", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async", Freja.AssetManager._username, Freja.AssetManager._password);
			req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, "GET");
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else {
			var req = Freja._aux.openXMLHttpRequest("GET", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async", Freja.AssetManager._username, Freja.AssetManager._password);
		}

		// This shouldn't be nescesary, but alas it is - firefox chokes
		// It's probably due to an error in MochiKit, so the problem
		// should be fixed there.
		var comm = Freja._aux.sendXMLHttpRequest(req);
		if (Freja.AssetManager.HTTP_REQUEST_TYPE == "async") {
			comm.addCallbacks(handler, Freja._aux.bind(d.errback, d));
		} else {
			if (req.status == 0 || req.status == 200 || req.status == 304) {
				handler(req);
			} else {
				d.errback(new Error("Request failed:" + req.status));
			}
		}
	} catch (ex) {
		d.errback(ex);
	}
	return d;
};
/**
  * This is a default error-handler. You should provide your own.
  * The handler is called if an asynchronous error happens, since
  * this could not be caught with the usual try ... catch
  *
  * It ought to be replaced completely with Deferred
  */
Freja.AssetManager.onerror = function(ex) {
	alert("Freja.AssetManager.onerror\n" + ex.message);
};
/**
  * Global exports
  */
window.getModel = Freja._aux.bind("getModel", Freja.AssetManager);
window.getView = Freja._aux.bind("getView", Freja.AssetManager);