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
	try {
		var node = this._find(document, expression);
	} catch(x) {
		return null;
	}
	if(node) return node.nodeValue;

};
Freja.QueryEngine.prototype.set = function(document, expression, value) {
	try {
		var node = this._find(document, expression);
		if(node)
			node.nodeValue = value;
	} catch(x) {
		// text node not found. Might need to be created.
		// try not to process field names that are not meant to be xpath expressions
		if(expression.lastIndexOf('/') != -1) {
			var nodeName = expression.substr(expression.lastIndexOf('/')+1);
			if(nodeName.charAt(0)=='@') {
				// trying to set a non-existing attribute. Let's create it.
				var parentExpression =  expression.substring(0, expression.lastIndexOf('/'));
				var pNode = this._find(document, parentExpression);
				if(pNode) {
					// this._find returns a text node
					pNode = pNode.parentNode;
					pNode.setAttribute(nodeName.substr(1),value);
				}
			}
			// else parent element does not exist.. can't do anything
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
	}
	if (node && node.firstChild && node.firstChild.nodeType == 3) {
		return node.firstChild;
	}
	if (node && node.firstChild && node.firstChild.nodeType == 4) {
		return node.firstChild;
	}
	if (node && node.nodeType==1 && !node.firstChild) {
		// empty element (<tag/>). Let's create and return a blank text node
		return node.appendChild(window.document.createTextNode(''));
	}

	throw new Error("Can't evaluate expression " + expression);
	return null;
};
/**
  * SimplePath
  */
Freja.QueryEngine.SimplePath = function() {};
Freja.Class.extend(Freja.QueryEngine.SimplePath, Freja.QueryEngine);
Freja.QueryEngine.SimplePath.prototype._find = function(document, expression) {
	if (!expression.match(/^[\d\w\/@\[\]=_\-']*$/)) {
		throw new Error("Can't evaluate expression " + expression);
	}
	var parts = expression.split(/\//);
	var node = document;
	var regAttr = new RegExp("^@([\\d\\w]*)");
	var regOffset = new RegExp("^([@\\d\\w]*)\\[([\\d]*)\\]$");
	var regFilter = new RegExp("^([\\d\\w]+)\\[@([@\\d\\w]+)=['\"]{1}(.*)['\"]{1}\\]$");
	var attr = null;
	var offset = 0;
	for (var i = 0; i < parts.length; ++i) {
		var part = parts[i];
		var filter = regFilter.exec(part);
		if(filter) {
			// filter[1] element name, filter[2] attribute name, filter[3] attribute value
			if(i>0 && parts[i-1]=='') {
				// expression was of type //element[...]
				var cn = node.getElementsByTagName(filter[1]);
			} else {
				var cn = node.childNodes;
			}
			for(var j=0, l=cn.length; j<l ; j++) {
				if(cn[j].nodeType==1 && cn[j].tagName==filter[1] && cn[j].getAttribute(filter[2])== filter[3]) {
					node = cn[j];
					break;
				}
			}
			if (j==l)
				throw new Error("Can't evaluate expression " + part);
		}
		else {
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
	}
	if (node && node.firstChild && node.firstChild.nodeType == 3) {
		return node.firstChild;
	}
	if (node && node.firstChild && node.firstChild.nodeType == 4) {
		return node.firstChild;
	}
	if (node && node.nodeType==1 && !node.firstChild) {
		// empty element (<tag/>). Let's create and return a blank text node
		return node.appendChild(window.document.createTextNode(''));
	}

	if (!node) {
		throw new Error("Can't evaluate expression " + expression);
	}
	return node;
};