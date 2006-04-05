/**
  * Standard view component
  */
Freja.View = function(url, renderer) {
	this.url = url;
	this.ready = false;
	this.document = null;
	this._renderer = renderer;
	this._destination = null;
	this.handlers = [];
	this.placeholder = null;
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
	if (typeof(placeholder) == "undefined") placeholder = this.placeholder;

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
					var id = child.getAttribute("id");
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