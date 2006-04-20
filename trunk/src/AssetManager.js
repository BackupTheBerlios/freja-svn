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
	var match = /^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
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
		/* Why using HTTP_METHOD_TUNNEL for a GET? 
		  if (preventCaching && Freja.AssetManager.HTTP_METHOD_TUNNEL) {
			var req = Freja._aux.openXMLHttpRequest("POST", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async", Freja.AssetManager._username, Freja.AssetManager._password);
			req.setRequestHeader(Freja.AssetManager.HTTP_METHOD_TUNNEL, "GET");
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else {
		*/
			var req = Freja._aux.openXMLHttpRequest("GET", url, Freja.AssetManager.HTTP_REQUEST_TYPE == "async", Freja.AssetManager._username, Freja.AssetManager._password);
		/*}*/

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
	if(ex.message) {
		alert("Freja.AssetManager.onerror\n" + ex.message);
	} 
	// @note: on asynchronous calls, ex refers to the xmlhttpobject
	// see Bug #7189 (http://developer.berlios.de/bugs/?func=detailbug&group_id=6277&bug_id=7189)
	else if(ex.status){
		alert('error '+ ex.status + ' ' +  ex.responseText);
	}
};
/**
  * Global exports
  */
window.getModel = Freja._aux.bind("getModel", Freja.AssetManager);
window.getView = Freja._aux.bind("getView", Freja.AssetManager);