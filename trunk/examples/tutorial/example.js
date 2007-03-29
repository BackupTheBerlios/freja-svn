var data = getModel("models/data.xml");

var display = getView("views/display.xsl");
display.placeholder = 'content';
display.behaviors["editLink"] = {
	onclick : function() { edit.render(data).addErrback(errback); }
};

var edit = getView("views/edit.xsl");
edit.placeholder = 'content';
edit.behaviors["editForm"] = {
	onsubmit : function() { 
		data.updateFrom(edit);
		display.render(data).addCallbacks(callback,errback);
		return false;
	}
};
edit.behaviors["displayLink"] = {
	onclick : function() { 
		display.render(data).addErrback(errback);
	}
};


Freja._aux.connect(window, "onload", function() {
	display.render(data).addErrback(errback);
});


function callback() {
	alert('ok');
}
function errback(x) {
	alert('errob:'+x.message+'\n'+x.stack);
}