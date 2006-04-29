/**
  * Standard view component
  */
Freja.View = function(url, renderer) {
	this.url = url;
	this.ready = false;
	this.document = null;
	this._renderer = renderer;
	this._destination = null;
	this.behaviors = [];
	this.placeholder = null;
	Freja._aux.connect(this, "onrendercomplete", Freja._aux.bind(this._connectBehavior, this));
};
/**
  * @param    model            Freja.Model
  * @param    placeholder      string    If supplied, this will be used instead of the
  *                                      default placeholder.
  * @returns MochiKit.Async.Deferred
  */
Freja.View.prototype.render = function(model, placeholder, xslParameters) {
	if (typeof(placeholder) == "undefined") placeholder = this.placeholder;
	if (typeof(xslParameters) == "undefined") xslParameters = this.xslParameters;

	var Handler = function(model, view, deferred, xslParameters) {
		this.model = model;
		this.view = view;
		this.deferred = deferred;
		this.xslParameters = xslParameters;
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

			var trans = this.view._renderer.transform(model, this.view, this.xslParameters);
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

		var h = new Handler(model, this, d, xslParameters);
		h.trigger();
	} catch (ex) {
		d.errback(ex);
	}
	return d;
};
/**
  * Decorates the output of the primary renderer, to inject behavior.
  * @note Maybe we could use cssQuery (http://dean.edwards.name/my/cssQuery/)
  *       to identify targets for behavior
  */
Freja.View.prototype._connectBehavior = function(destination) {
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
		var applyHandlers = function(node, behaviors) {
			for (var i = 0, c = node.childNodes, l = c.length; i < l; ++i) {
				var child = c[i];
				if (child.nodeType == 1) {
					if(child.className) {
						var classNames = child.className.split(' ');
						for (var j=0;j<classNames.length;j++) {
							var handler = behaviors[classNames[j]];
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
					}
					applyHandlers(child, behaviors);
				}
			}
		};

		// Avoid traversing the DOM tree if there's no handler to process.
		// @note: is there a better way? this.behaviors.length is always 0.
		// @note  This is fine. behaviors is a hashmap, not an array.
		for (var ids in this.behaviors) {
			applyHandlers(destination, this.behaviors);
			break;
		}

	} catch (ex) {
		alert(ex.message);
	}
};
/**
  * Returns the values of a formview
  */
Freja.View.prototype.getValues = function() {
	return Freja._aux.formContents(this._destination);
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
Freja.View.Renderer.XSLTransformer.prototype.transform = function(model, view, xslParameters) {
        var d = Freja._aux.createDeferred();
        try {
		var html = Freja._aux.transformXSL(model.document, view.document, xslParameters);
		if (!html) {
			d.errback(new Error("XSL Transformation error."));
		} else {
			// fix empty textareas
			// Can't this be fixed by outputting as html rather than xml ?
			// <xsl:output method="html" />
			// (cedsav) don't remember all the details but method="xml" is the way to go.
			// method="html" would output html not xhtml, plus I think it implies that
			// you want to output a valid html document (with html, head and body tags).
			html = html.replace(/<textarea([^>]*)\/>/gi,"<textarea $1></textarea>");
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
Freja.View.Renderer.RemoteXSLTransformer.prototype.transform = function(model, view, xslParameters) {
        var d = Freja._aux.createDeferred();

	// prepare posted data  (no need to send the XSL document, just its url)
	var xslUrl = view.url;
	var postedData = "xslFile=" + encodeURIComponent(xslUrl) + "&xmlData=" + encodeURIComponent(Freja._aux.serializeXML(model.document));

	var xslParameterString = '';
	for (var paramname in xslParameters) {
		xslParameterString += encodeURIComponent(paramname + "," + xslParameters[paramname]);
	}
	if(xslParameterString.length > 0) {
		postedData  = postedData + '&xslParam=' + xslParameterString;
	}

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