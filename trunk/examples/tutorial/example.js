var data = getModel("models/data.xml");

var display = getView("views/display.xsl");
display.placeholder = 'content';
display.behaviors["editLink"] = {
	onclick : function() { edit.render(data); }
};

var edit = getView("views/edit.xsl");
edit.placeholder = 'content';
edit.behaviors["editForm"] = {
	onsubmit : function() { 
		data.updateFrom(edit);
		display.render(data);
		return false;
	}
};
edit.behaviors["displayLink"] = {
	onclick : function() { display.render(data); }
};


connect(window, "onload", function() {
	display.render(data);
});