/**
  * Standard model component
  */
Freja.Model = function(url, query) {
	this.url = url;
	this.ready = false;
	this.document = null;
	this._query = query;
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
		// try not to process field names that are not meant to be xpath expressions
		if(values[0][i].lastIndexOf('/') != -1) {		
			this.set(values[0][i], values[1][i]);
		}
	}
};
/**
  * Writes the model back to the remote service
  * @returns Freja._aux.Deferred
  */
Freja.Model.prototype.save = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
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
  * @returns Freja._aux.Deferred
  */
Freja.Model.prototype.remove = function() {
	var url = this.url;
	var match = /^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
	if (match) {
		url = match[1] + url; // local
	}
	var req = Freja.AssetManager.openXMLHttpRequest("DELETE", url);
	return Freja._aux.sendXMLHttpRequest(req);
};
/**
  * @returns Freja._aux.Deferred
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
	var match = /^(file:\/\/.*\/)([^\/]*)$/.exec(window.location.href);
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
