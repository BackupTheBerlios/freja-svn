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
	var node = this._find(document, expression);
	if(node) return node.nodeValue;
	return null;
};
Freja.QueryEngine.prototype.set = function(document, expression, value) {
	var node = this._find(document, expression);	
	if(node) {
		node.nodeValue = value;
	} else {
		// text node not found. Might need to be created.
		// try not to process field names that are not meant to be xpath expressions  
		if(expression.lastIndexOf('/') != -1) {		 	
			var nodeName = expression.substr(expression.lastIndexOf('/')+1);
			
			if(nodeName.charAt(0)=='@') {
				// trying to set a non-existing attribute. Let's create it.
				var newexpression =  expression.substring(0, expression.lastIndexOf('/'));
				var node = document.selectSingleNode(newexpression);
				if(node) 
					node.setAttribute(nodeName.substr(1),value);
			} else {
				// this could be an empty node (<tag />)
				// let's try to create the text node.
				var node = document.selectSingleNode(expression);
				if(node) {
					var n = document.createTextNode(value);
					node.appendChild(n);							
				} else {
					// the element does not exist.
				}
			}
		}
	}
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
//	throw new Error("Can't evaluate expression " + expression);
	return null;
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