// model : contacts
var contacts = new Freja.Model.DataSource("models/contact.php", "models/contacts.php");
Freja.AssetManager.XSLT_SERVICE_URL = "../../external/srvc-xslt.php?path=examples/contacts/";

// view : index
var index = getView("views/index.xsl");
index.placeholder = "content";
index.handlers["edit"] = {
	onclick : function(node) {
//		edit.render(contacts.get(node.getAttribute('pkey')));
		edit.render(getModel(node.getAttribute('url')));
	}
};
index.handlers["delete"] = {
	onclick : function(node) {
		if (!confirm("Really delete it?")) {
			return;
		}
//		var model = contacts.get(node.getAttribute('pkey'));
		var model = getModel(node.getAttribute('url'));
		var d = model._delete()
		d.addCallback(function() {
			contacts.select().reload();
			index.render(contacts.select());
		});
	}
};
index.handlers["create"] = {
	onclick : function(node) {
		create.render();
	}
};

// view : create
var create = getView("views/create.xsl");
create.placeholder = "content";
create.handlers["form"] = {
	onsubmit : function(node) {
		var d = contacts.create(getView("views/create.xsl").getValues());
		d.addCallback(function() {
			contacts.select().reload();
			index.render(contacts.select());
		});
		index.render(contacts.select());
	}
};
create.handlers["cancel"] = {
	onclick : function() {
		index.render(contacts.select());
	}
};

// view : edit
var edit = getView("views/edit.xsl");
edit.placeholder = "content";
edit.handlers["form"] = {
	onsubmit : function(node) {
		try {
//			var model = contacts.get(node.getAttribute('pkey'));
			var model = getModel(node.getAttribute('url'));
			model.updateFrom(getView("views/edit.xsl"));
			var d = model.save();
			d.addCallback(function() {
				contacts.select().reload();
				index.render(contacts.select());
			});
			index.render(contacts.select());
		} catch (ex) {
			alert(ex.message);
		}
	}
};
edit.handlers["cancel"] = {
	onclick : function() {
		index.render(contacts.select());
	}
};

// start execution
connect(window, "onload", function() {
	index.render(contacts.select());
});