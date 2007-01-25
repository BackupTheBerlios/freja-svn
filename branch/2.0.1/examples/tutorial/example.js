var data = getModel("models/data.xml");

var display = getView("views/display.xsl");
display.placeholder = 'content';
display.behaviors["editLink"] = {
	onclick : function() { dispatch('edit'); }
};

var edit = getView("views/edit.xsl");
edit.placeholder = 'content';
edit.behaviors["editForm"] = {
	onsubmit : function() { dispatch('update'); }
};
edit.behaviors["displayLink"] = {
	onclick : function() { dispatch('display'); }
};

dispatch = function(action) {
	switch (action) {
		default:
			// fall through to case 'display'
		case 'display':
			display.render(data)
			break;
		case 'edit':
			edit.render(data);
			break;
		case 'update':
			data.updateFrom(edit);
			dispatch('display');
		break;
	}
}
connect(window, "onload", function() {
	dispatch("display");
});