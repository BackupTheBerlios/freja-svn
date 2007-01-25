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

	if(!node) throw new Error("Can't evaluate expression " + expression);

	switch(node.nodeType) {
		case 1: /* element */
			// return content of text nodes
			// @TO-DO: return more than just firstchild?
			if(node.firstChild && (node.firstChild.nodeType == 3 || node.firstChild.nodeType == 4)) {
				return node.firstChild.nodeValue;
			}
			break;
		case 2: /* Attribute */
			return node.nodeValue;
			break;
		case 3: /* text node */
			// fall through
		case 4: /* CDATA section */
			return node.nodeValue;
			break;	
	}
	return null;
};
Freja.QueryEngine.prototype.set = function(document, expression, value) {
	var node = this._find(document, expression);
	if(!node) {
		// Could not evaluate expression.
		// Check if we're trying to set a non-existent attribute
		var nodeName = expression.substr(expression.lastIndexOf('/')+1);
		if(nodeName.charAt(0)=='@') {
			// Let's try to create the attribute.
			var parentExpression =  expression.substring(0, expression.lastIndexOf('/'));
			var pNode = this._find(document, parentExpression);
			if(pNode) {				
				pNode.setAttribute(nodeName.substr(1),value);
				return;
			}
			// else parent node non existent either, give up.
		}
		// not an attribute, give up.
		throw new Error("Can't evaluate expression " + expression);
	}

	// Expression succesfully evaluated. Set content
	switch(node.nodeType) {
		case 1: /* element */
			// @TO-DO: set more than just firstchild			
			if(node.firstChild && (node.firstChild.nodeType == 3 || node.firstChild.nodeType == 4)) {
				node.firstChild.nodeValue = value;
			} else {
				node.appendChild(document.createTextNode(value));
			}
			break;
		case 2: /* Attribute */
			node.nodeValue = value;
			break;
		case 3: /* text node */
			// fall through
		case 4: /* CDATA section */
			node.nodeValue = value;
			break;	
	}
	return ;
};
/**
  * XPath query engine.
  */
Freja.QueryEngine.XPath = function() {};
Freja.Class.extend(Freja.QueryEngine.XPath, Freja.QueryEngine);
Freja.QueryEngine.XPath.prototype._find = function(document, expression) {	
	var result = document.selectSingleNode(expression);	
	return result;
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

	if (!node) {
		throw new Error("Can't evaluate expression " + expression);
	}
	return node;
};