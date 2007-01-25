function wHELPERS() {};
	
	// addEvent adapated from http://ejohn.org/projects/flexible-javascript-events/
	// and  Andy Smith's (http://weblogs.asp.net/asmith/archive/2003/10/06/30744.aspx)
	wHELPERS.prototype.addEvent = function(obj, type, fn) {
		if(!obj) { return; }
		
		if (obj.attachEvent) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
			obj.attachEvent( 'on'+type, obj[type+fn] );
		} else if(obj.addEventListener) {			
			obj.addEventListener( type,fn, false );
		} else {
			var originalHandler = obj["on" + type]; 
			if (originalHandler) { 
			  obj["on" + type] = function(e){originalHandler(e);fn(e);}; 
			} else { 
			  obj["on" + type] = fn; 
			} 
		}
	}
	
	wHELPERS.prototype.removeEvent = function(obj, type, fn) {
		if (obj.detachEvent) {
			if(obj[type+fn]) {
				obj.detachEvent( 'on'+type, obj[type+fn] );
				obj[type+fn] = null;
			}
		} else if(obj.removeEventListener)
			obj.removeEventListener( type, fn, false );
		else {
			obj["on" + type] = null;
		}
	}
	
	
	
	
	
	// Returns the event's source element 
	wHELPERS.prototype.getSourceElement = function(e) {	
		if(!e) e = window.event;	
		if(e.target)
			var srcE = e.target;
		else
			var srcE = e.srcElement;
		if(!srcE) return null;
		if(srcE.nodeType == 3) srcE = srcE.parentNode; // safari weirdness		
		if(srcE.tagName.toUpperCase()=='LABEL' && e.type=='click') { 
			// when clicking a label, firefox fires the input onclick event
			// but the label remains the source of the event. In Opera and IE 
			// the source of the event is the input element. Which is the 
			// expected behavior, I suppose.		
			if(srcE.getAttribute('for')) {
				srcE = document.getElementById(srcE.getAttribute('for'));
			}
		}
		return srcE;
	}
	
	// Cancel the default execution of an event.
	wHELPERS.prototype.preventEvent = function(e) {
		if (!e) e = window.event;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		return false;
	}
	
	// Cancel the propagation of the event
	wHELPERS.prototype.stopPropagation = function(e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
	}
	
	// Generates a random ID
	wHELPERS.prototype.randomId = function () {
		var seed = (new Date()).getTime();
		seed = seed.toString().substr(6);
		for (var i=0; i<6;i++)
			seed += String.fromCharCode(48 + Math.floor((Math.random()*10)));
		return "id-" + seed;
	}
	
	// Activating an Alternate Stylesheet (thx to: http://www.howtocreate.co.uk/tutorials/index.php?tut=0&part=27)
	// Use this to activate a CSS Stylesheet that shouldn't be used if javascript is turned off.
	// The stylesheet rel attribute should be 'alternate stylesheet'. The title attribute MUST be set.
	wHELPERS.prototype.activateStylesheet = function(sheetref) {
		if(document.getElementsByTagName) {
			var ss=document.getElementsByTagName('link');
		} else if (document.styleSheets) {
			var ss = document.styleSheets;
		}
		for(var i=0;ss[i];i++ ) {
			if(ss[i].href.indexOf(sheetref) != -1) {
				ss[i].disabled = true;
				ss[i].disabled = false;			
			}
		}
	}
	
	// hasClass
	wHELPERS.prototype.hasClass = function(element,className) {
		if(element && element.className) {
			if((' ' + element.className + ' ').indexOf(' ' + className +' ') != -1) {
				return true;
			}
		}
		return false;
	}
	wHELPERS.prototype.hasClassPrefix = function(element,className) {
		if(element && element.className) {
			if((' ' + element.className).indexOf(' ' + className) != -1) {
				return true;
			}
		}
		return false;
	}
	
	// getTop / getLeft  
	// Returns pixel coordinates from the top-left window corner.
	wHELPERS.prototype.getTop = function(obj) {
		var cur = 0;
		if(obj.offsetParent) {		
			while(obj.offsetParent) {
				if((new wHELPERS()).getComputedStyle(obj,'position') == 'relative' ) {
					// relatively postioned element
					return cur;
				}
				cur+=obj.offsetTop;
				obj = obj.offsetParent;
			}
		}
		return cur;
	}
	wHELPERS.prototype.getLeft = function(obj) {
		var cur = 0;
		if(obj.offsetParent) {		
			while(obj.offsetParent) {
				if((new wHELPERS()).getComputedStyle(obj,'position') == 'relative' ) {
					// relatively postioned element
					return cur;
				}
				cur+=obj.offsetLeft;
				obj = obj.offsetParent;
			}
		}
		return cur;
	}
 	
	wHELPERS.prototype.getComputedStyle = function(element, styleName) {
		if(window.getComputedStyle) {
			return window.getComputedStyle(element,"").getPropertyValue(styleName);
		} else if(element.currentStyle) {	
			return element.currentStyle[styleName];
		}
		return false;
	}
