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
  * This code was written by Tyler Akins and has been placed in the
  * public domain.  It would be nice if you left this header intact.
  * Base64 code from Tyler Akins -- http://rumkin.com
  */
Freja.Base64 = {};
Freja.Base64.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
Freja.Base64.encode = function(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var keyStr = this.keyStr;

	do {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
		keyStr.charAt(enc3) + keyStr.charAt(enc4);
	} while (i < input.length);

	return output;
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
	var d = new MochiKit.Async.Deferred();

	var req = new XMLHttpRequest();
	req.open("POST", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async");
	if (Freja.AssetManager.USERNAME && Freja.AssetManager.PASSWORD) {
		var auth = "Basic " + Freja.Base64.encode(Freja.AssetManager.USERNAME + ":" + Freja.AssetManager.PASSWORD);
		req.setRequestHeader("Authorization", auth);
	}
	try {
		// for some obscure reason exceptions aren't thrown back if I call the
		// shorthand version of sendXMLHttpRequest in IE6.
		MochiKit.Async.sendXMLHttpRequest(req, Sarissa.serialize(this.document)).addCallbacks(bind(d.callback, d), bind(d.errback, d));
	} catch (ex) {
		d.errback(ex);
	}
	return d;
}
/**
  * Deletes the model from the remote service
  * @returns MochiKit.Async.Deferred
  */
Freja.Model.prototype._delete = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = new XMLHttpRequest();
	if (Freja.AssetManager.HTTP_METHOD_TUNNEL) {
		req.open("POST", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async");
		req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, "DELETE");
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	} else {
		req.open("DELETE", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async");
	}
	if (Freja.AssetManager.USERNAME && Freja.AssetManager.PASSWORD) {
		var auth = "Basic " + Freja.Base64.encode(Freja.AssetManager.USERNAME + ":" + Freja.AssetManager.PASSWORD);
		req.setRequestHeader("Authorization", auth);
	}
	return MochiKit.Async.sendXMLHttpRequest(req);
}
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.Model.prototype.reload = function() {
	this.ready = false;
	var onload = bind(function(document) {
		this.document = document;
		this.ready = true;
		MochiKit.Signal.signal(this, "onload");
	}, this);
	var d = Freja.AssetManager.loadAsset(this.url, true);
	d.addCallbacks(onload, Freja.AssetManager.onerror);
	return d;
}

/**
  * DataSource provides a gateway-type interface to a model service.
  */
Freja.Model.DataSource = function(baseURL, selectURL) {
	this.baseURL = baseURL;
	this.selectURL = selectURL;
}
/**
  * Returns a list of primary-keys to records in the datasource
  */
Freja.Model.DataSource.prototype.select = function() {
	return getModel(this.selectURL);
};
/**
  * Returns a single record from a primary-key
  */
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
  * Creates a new instance of a record
  * @todo errback to the deferred on errors
  */
Freja.Model.DataSource.prototype.create = function(values) {
	var url = this.baseURL;
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = new XMLHttpRequest();
	if (Freja.AssetManager.HTTP_METHOD_TUNNEL) {
		req.open("POST", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async");
		req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, "PUT");
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	} else {
		req.open("PUT", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async");
	}
	if (Freja.AssetManager.USERNAME && Freja.AssetManager.PASSWORD) {
		var auth = "Basic " + Freja.Base64.encode(Freja.AssetManager.USERNAME + ":" + Freja.AssetManager.PASSWORD);
		req.setRequestHeader("Authorization", auth);
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
  * @param    model            Freja.Model
  * @param    placeholder      string    If supplied, this will be used instead of the
  *                                      default placeholder.
  * @returns MochiKit.Async.Deferred
  */
Freja.View.prototype.render = function(model, placeholder /* optional */ ) {

	var Handler = function(model, view, deferred) {
		this.model = model;
		this.view = view;
		this.deferred = deferred;
	}

	Handler.prototype.trigger = function() {
		try {
			if (!this.view.ready) {
				connect(this.view, "onload", bind(this.trigger, this));
				return;
			}
			if (this.model && !this.model.ready) {
				connect(this.model, "onload", bind(this.trigger, this));
				return;
			}
			if (!model) {
				model = { document : (new DOMParser()).parseFromString("<?xml version='1.0' ?><dummy/>", "text/xml")};
			}
			var trans = this.view.renderer.transform(model, this.view);
			trans.addCallback(bind(function(html) {
				this.destination.innerHTML = html;
			}, this.view));
			trans.addCallback(bind(function() {
				MochiKit.Signal.signal(this, "onrendercomplete", this.destination)
			}, this.view));
			trans.addCallback(this.deferred.callback);
			trans.addErrback(this.deferred.errback);
		} catch (ex) {
			this.deferred.errback(ex);
		}
	}

	var d = new MochiKit.Async.Deferred();
	try {
		var id = (typeof(placeholder) == "undefined") ? this.placeholder : placeholder;
		this.destination = $(id);
		// @todo    Is this a good idea ?
		// Perhaps we should leave it to the programmer to do this.
		this.destination.innerHTML = Freja.AssetManager.THROBBER_HTML;

		var h = new Handler(model, this, d);
		h.trigger();
/*
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
		var trans = this.renderer.transform(model, this);
		trans.addCallback(bind(function(html) {
			this.destination.innerHTML = html;
		}, this));
		trans.addCallback(bind(function() {
			MochiKit.Signal.signal(this, "onrendercomplete", this.destination)
		}, this));
		trans.addCallback(d.callback);
		trans.addErrback(d.errback);
*/
	} catch (ex) {
		d.errback(ex);
	}
	return d;
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
  * @returns MochiKit.Async.Deferred
  */
Freja.View.Renderer.XSLTransformer.prototype.transform = function(model, view) {
        var d = new MochiKit.Async.Deferred();
        try {
		var processor = new XSLTProcessor();
		processor.importStylesheet(view.document);
		var result = processor.transformToDocument(model.document);
		var html = Sarissa.serialize(result);
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
  * @returns MochiKit.Async.Deferred
  */
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform = function(model, view) {
        var d = new MochiKit.Async.Deferred();

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
				d.callback(req.responseText);
			} else {
				d.errback(req.responseText);
			}
		}
	}
	var async = Freja.AssetManager.HTTP_REQUEST_TYPE == "async";
	req.open("POST", Freja.AssetManager.XSLT_SERVICE_URL, async);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if (Freja.AssetManager.USERNAME && Freja.AssetManager.PASSWORD) {
		var auth = "Basic " + Freja.Base64.encode(Freja.AssetManager.USERNAME + ":" + Freja.AssetManager.PASSWORD);
		req.setRequestHeader("Authorization", auth);
	}
	req.send(postedData);
	return d;
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
  * Set to sync to make all requests synchroneous. You shouldn't use
  * this setting for anything but testing/debugging.
  * "async" | "sync"
  */
Freja.AssetManager.HTTP_REQUEST_TYPE = "async";
/**
  * If this is set to NULL, real PUT and DELETE http-requests will be made,
  * otherwise a header will be set instead, and the request tunneled through
  * POST. For compatibility, you should use tunneling.
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
  * Set USERNAME + PASSWORD to authenticate with basic HTTP-Authorization.
  */
Freja.AssetManager.USERNAME = null;
Freja.AssetManager.PASSWORD = null;
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
	this.loadAsset(url, true).addCallbacks(onload, Freja.AssetManager.onerror);
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
	this.loadAsset(url, false).addCallbacks(onload, Freja.AssetManager.onerror);
	this.views.push(v);
	return v;
}
/**
  * @returns MochiKit.Async.Deferred
  */
Freja.AssetManager.loadAsset = function(url, preventCaching) {
	var match = /^(file:\/\/.*\/)([^/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var d = new MochiKit.Async.Deferred();
	var handler = function(transport) {
		try {
			if (transport.responseText == "") {
				throw new Error("Empty response.");
			}
			if (transport.responseXML.xml == "") {
				// The server doesn't reply with Content-Type: text/xml
				// this will happen if the file is loaded locally (through file://)
				var document = (new DOMParser()).parseFromString(transport.responseText, "text/xml");
			} else {
				var document = transport.responseXML;
			}
		} catch (ex) {
			d.errback(ex);
		}
		d.callback(document);
	}
	try {
		var req = new XMLHttpRequest();
		var async = Freja.AssetManager.HTTP_REQUEST_TYPE == "async";
		if (preventCaching && Freja.AssetManager.HTTP_METHOD_TUNNEL) {
			req.open("POST", url, async);
			req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, "GET");
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else {
			req.open("GET", url, async);
		}
		if (Freja.AssetManager.USERNAME && Freja.AssetManager.PASSWORD) {
			var auth = "Basic " + Freja.Base64.encode(Freja.AssetManager.USERNAME + ":" + Freja.AssetManager.PASSWORD);
			req.setRequestHeader("Authorization", auth);
		}
		// This shouldn't be nescesary, but alas it is - firefox chokes
		// It's probably due to an error in MochiKit, so the problem
		// should be fixed there.
		var comm = MochiKit.Async.sendXMLHttpRequest(req);
		if (async) {
			comm.addCallbacks(handler, bind(d.errback, d));
		} else {
			if (req.status == 200 || req.status == 304) {
				handler(req);
			} else {
				d.errback(new Error("Request failed:" + req.status));
			}
		}
	} catch (ex) {
		d.errback(ex);
	}
	return d;
}
Freja.AssetManager.onerror = function(ex) {
	alert("Freja.AssetManager.onerror\n" + ex.message);
}
/**
  * Global exports
  */
window.getModel = bind("getModel", Freja.AssetManager);
window.getView = bind("getView", Freja.AssetManager);