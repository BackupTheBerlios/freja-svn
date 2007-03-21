/**
  * Freja._aux
  * wrapper for external dependencies (frameworks).
  *
  * This is the default auxiliary adapter. It bridges Freja to MochiKit + Sarissa
  *
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
if (typeof(Freja) == "undefined") {
	Freja = {};
}
Freja._aux = {};
/** bind(func, self) : function */
Freja._aux.bind = MochiKit.Base.bind;
/** formContents(elem) : Array */
Freja._aux.formContents = function(elem) {
	if (!elem) elem = document;
	var names = [];
	var values = [];
	var inputs = elem.getElementsByTagName("INPUT");
	for (var i = 0; i < inputs.length; ++i) {
		var input = inputs[i];
		if (input.name) {
			if (input.type == "radio" || input.type == "checkbox") {
				if (input.checked) {
					names.push(input.name);
					values.push(input.value);
				} else {
					names.push(input.name);
					values.push("");
				}
			} else {
				names.push(input.name);
				values.push(input.value);
			}
		}
	}
	var textareas = elem.getElementsByTagName("TEXTAREA");
	for (var i = 0; i < textareas.length; ++i) {
		var input = textareas[i];
		if (input.name) {
			names.push(input.name);
			values.push(input.value);
		}
	}
	var selects = elem.getElementsByTagName("SELECT");
	for (var i = 0; i < selects.length; ++i) {
		var input = selects[i];
		if (input.name) {
			if (input.selectedIndex >= 0) {
				var opt = input.options[input.selectedIndex];
				names.push(input.name);
				values.push((opt.value) ? opt.value : "");
			}
		}
	}
	return [names, values];
};

/** getElement(id) : HTMLElement */
Freja._aux.getElement = MochiKit.DOM.getElement;

/** connect(src, signal, fnc) : void */
Freja._aux.connect = MochiKit.Signal.connect;
/** signal(src, signal, arg) : void */
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
	// RoR/cakePHP Ajax request detection compatibility:
	req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');	
	return req;
};
/** sendXMLHttpRequest(req, sendContent) : Deferred */
Freja._aux.sendXMLHttpRequest = MochiKit.Async.sendXMLHttpRequest;
/** xmlize(anyObject, objectName) : string */
Freja._aux.xmlize = Sarissa.xmlize;
/** serializeXML(node) : string */
Freja._aux.serializeXML = function(node) {
	if (node.xml) return node.xml;
	return (new XMLSerializer()).serializeToString(node);
};
/** loadXML(string) : XMLDocument */
Freja._aux.loadXML = function(text) {
	return (new DOMParser()).parseFromString(text, "text/xml");
};
/** transformXSL(XMLDocument, XSLDocument) : string */
Freja._aux.transformXSL = function(xml, xsl, xslParameters) {
	var processor = new XSLTProcessor();
	processor.importStylesheet(xsl);
	if(xslParameters) {
		for (var paramName in xslParameters) {
			processor.setParameter("", paramName, xslParameters[paramName]);
		}
	}
	 
	return processor.transformToFragment(xml, window.document);
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
			
				for (var i = data.childNodes.length-1; i >= 0; i--) {
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
Freja._aux.importNode = function(document, node, deep) {
	if(typeof deep =='undefined') deep = true;
	if(document.importNode)
		return document.importNode(node,deep);
	else
		return node.cloneNode(deep);
}

/**
 * ====================================================================
 * About
 * ====================================================================
 * Sarissa cross browser XML library - IE XPath Emulation 
 * @version 0.9.7.6
 * @author: Manos Batsis, mailto: mbatsis at users full stop sourceforge full stop net
 *
 * This script emulates Internet Explorer's selectNodes and selectSingleNode
 * for Mozilla. Associating namespace prefixes with URIs for your XPath queries
 * is easy with IE's setProperty. 
 * USers may also map a namespace prefix to a default (unprefixed) namespace in the
 * source document with Sarissa.setXpathNamespaces
 *
 *
 * ====================================================================
 * Licence
 * ====================================================================
 * Sarissa is free software distributed under the GNU GPL version 2 (see <a href="gpl.txt">gpl.txt</a>) or higher, 
 * GNU LGPL version 2.1 (see <a href="lgpl.txt">lgpl.txt</a>) or higher and Apache Software License 2.0 or higher 
 * (see <a href="asl.txt">asl.txt</a>). This means you can choose one of the three and use that if you like. If 
 * you make modifications under the ASL, i would appreciate it if you submitted those.
 * In case your copy of Sarissa does not include the license texts, you may find
 * them online in various formats at <a href="http://www.gnu.org">http://www.gnu.org</a> and 
 * <a href="http://www.apache.org">http://www.apache.org</a>.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 * WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE 
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
if(_SARISSA_HAS_DOM_FEATURE && document.implementation.hasFeature("XPath", "3.0")){
    /**
    * <p>SarissaNodeList behaves as a NodeList but is only used as a result to <code>selectNodes</code>,
    * so it also has some properties IEs proprietery object features.</p>
    * @private
    * @constructor
    * @argument i the (initial) list size
    */
    function SarissaNodeList(i){
        this.length = i;
    };
    /** <p>Set an Array as the prototype object</p> */
    SarissaNodeList.prototype = new Array(0);
    /** <p>Inherit the Array constructor </p> */
    SarissaNodeList.prototype.constructor = Array;
    /**
    * <p>Returns the node at the specified index or null if the given index
    * is greater than the list size or less than zero </p>
    * <p><b>Note</b> that in ECMAScript you can also use the square-bracket
    * array notation instead of calling <code>item</code>
    * @argument i the index of the member to return
    * @returns the member corresponding to the given index
    */
    SarissaNodeList.prototype.item = function(i) {
        return (i < 0 || i >= this.length)?null:this[i];
    };
    /**
    * <p>Emulate IE's expr property
    * (Here the SarissaNodeList object is given as the result of selectNodes).</p>
    * @returns the XPath expression passed to selectNodes that resulted in
    *          this SarissaNodeList
    */
    SarissaNodeList.prototype.expr = "";
    /** dummy, used to accept IE's stuff without throwing errors */
    if(window.XMLDocument && (!XMLDocument.prototype.setProperty)){
        XMLDocument.prototype.setProperty  = function(x,y){};
    };
    /**
    * <p>Programmatically control namespace URI/prefix mappings for XPath
    * queries.</p>
    * <p>This method comes especially handy when used to apply XPath queries
    * on XML documents with a default namespace, as there is no other way
    * of mapping that to a prefix.</p>
    * <p>Using no namespace prefix in DOM Level 3 XPath queries, implies you
    * are looking for elements in the null namespace. If you need to look
    * for nodes in the default namespace, you need to map a prefix to it
    * first like:</p>
    * <pre>Sarissa.setXpathNamespaces(oDoc, &quot;xmlns:myprefix=&amp;aposhttp://mynsURI&amp;apos&quot;);</pre>
    * <p><b>Note 1 </b>: Use this method only if the source document features
    * a default namespace (without a prefix), otherwise just use IE's setProperty
    * (moz will rezolve non-default namespaces by itself). You will need to map that
    * namespace to a prefix for queries to work.</p>
    * <p><b>Note 2 </b>: This method calls IE's setProperty method to set the
    * appropriate namespace-prefix mappings, so you dont have to do that.</p>
    * @param oDoc The target XMLDocument to set the namespace mappings for.
    * @param sNsSet A whilespace-seperated list of namespace declarations as
    *            those would appear in an XML document. E.g.:
    *            <code>&quot;xmlns:xhtml=&apos;http://www.w3.org/1999/xhtml&apos;
    * xmlns:&apos;http://www.w3.org/1999/XSL/Transform&apos;&quot;</code>
    * @throws An error if the format of the given namespace declarations is bad.
    */
    Sarissa.setXpathNamespaces = function(oDoc, sNsSet) {
        //oDoc._sarissa_setXpathNamespaces(sNsSet);
        oDoc._sarissa_useCustomResolver = true;
        var namespaces = sNsSet.indexOf(" ")>-1?sNsSet.split(" "):new Array(sNsSet);
        oDoc._sarissa_xpathNamespaces = new Array(namespaces.length);
        for(var i=0;i < namespaces.length;i++){
            var ns = namespaces[i];
            var colonPos = ns.indexOf(":");
            var assignPos = ns.indexOf("=");
            if(colonPos > 0 && assignPos > colonPos+1){
                var prefix = ns.substring(colonPos+1, assignPos);
                var uri = ns.substring(assignPos+2, ns.length-1);
                oDoc._sarissa_xpathNamespaces[prefix] = uri;
            }else{
                throw "Bad format on namespace declaration(s) given";
            };
        };
    };
    /**
    * @private Flag to control whether a custom namespace resolver should
    *          be used, set to true by Sarissa.setXpathNamespaces
    */
    XMLDocument.prototype._sarissa_useCustomResolver = false;
    /** @private */
    XMLDocument.prototype._sarissa_xpathNamespaces = new Array();
    /**
    * <p>Extends the XMLDocument to emulate IE's selectNodes.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as a SarissaNodeList
    * @throws An error if no namespace URI is found for the given prefix.
    */
    XMLDocument.prototype.selectNodes = function(sExpr, contextNode, returnSingle){
        var nsDoc = this;
        var nsresolver = this._sarissa_useCustomResolver
        ? function(prefix){
            var s = nsDoc._sarissa_xpathNamespaces[prefix];
            if(s)return s;
            else throw "No namespace URI found for prefix: '" + prefix+"'";
            }
        : this.createNSResolver(this.documentElement);
        var result = null;
        if(!returnSingle){
            var oResult = this.evaluate(sExpr,
                (contextNode?contextNode:this),
                nsresolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            var nodeList = new SarissaNodeList(oResult.snapshotLength);
            nodeList.expr = sExpr;
            for(var i=0;i<nodeList.length;i++)
                nodeList[i] = oResult.snapshotItem(i);
            result = nodeList;
        }
        else {
            result = oResult = this.evaluate(sExpr,
                (contextNode?contextNode:this),
                nsresolver,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        };
        return result;      
    };
    /**
    * <p>Extends the Element to emulate IE's selectNodes</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An
    *             error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectNodes = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectNodes)
            return doc.selectNodes(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    /**
    * <p>Extends the XMLDocument to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @argument contextNode this is for internal use only by the same
    *           method when called on Elements
    * @returns the result of the XPath search as an (Sarissa)NodeList
    */
    XMLDocument.prototype.selectSingleNode = function(sExpr, contextNode){
        var ctx = contextNode?contextNode:null;
        return this.selectNodes(sExpr, ctx, true);
    };
    /**
    * <p>Extends the Element to emulate IE's selectSingleNode.</p>
    * @argument sExpr the XPath expression to use
    * @returns the result of the XPath search as an (Sarissa)NodeList
    * @throws An error if invoked on an HTML Element as this is only be
    *             available to XML Elements.
    */
    Element.prototype.selectSingleNode = function(sExpr){
        var doc = this.ownerDocument;
        if(doc.selectSingleNode)
            return doc.selectSingleNode(sExpr, this);
        else
            throw "Method selectNodes is only supported by XML Elements";
    };
    Sarissa.IS_ENABLED_SELECT_NODES = true;
};
if(_SARISSA_IS_IE)
	 Sarissa.IS_ENABLED_SELECT_NODES = true;

