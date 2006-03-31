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