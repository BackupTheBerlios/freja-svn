if (typeof(dojo) != 'undefined') { dojo.require('Freja'); }
if (typeof(JSAN) != 'undefined') { JSAN.use('Freja'); }
if (typeof(tests) == 'undefined') { tests = {}; }

tests.test_View = function (t) {
	Freja.AssetManager.HTTP_REQUEST_TYPE = "sync";
	var view = Freja.AssetManager.getView("data/view.xsl");
	t.ok(view instanceof Freja.View);
	t.is(view.ready, true, "state should be ready (loaded)");
	t.is(typeof(view.document), "object", "the document shouldn't be null");

	var model = Freja.AssetManager.getModel("data/model.xml");
	var out = document.createElement("DIV");
	view.placeholder = out;
	view.render(model);
	t.ok(out.firstChild.nodeName.toLowerCase() == "div");
	t.ok(out.firstChild.firstChild.nodeName.toLowerCase() == "h3");
	t.is(out.firstChild.firstChild.firstChild.nodeValue, model.get("item/name"), "Rendered view should contain the models value");

	// test of form
	var formView = Freja.AssetManager.getView("data/form-view.xsl");
	var testofsubmit = false;
	formView.handlers["form"] = {
		onsubmit : function() { testofsubmit = true; }
	};
	formView.placeholder = out;
	formView.render(model);
	$("out").appendChild(out);
	$("form-submit").click();
	out.parentNode.removeChild(out);

	t.ok(testofsubmit, "The form has been intercepted by our handler");

	// we can't test asynch function properly, but we can fire them and assert that
	// they don't throw any exceptions at least
	Freja.AssetManager.clearCache();
	var view = Freja.AssetManager.getView("data/view.xsl");
	var out = document.createElement("DIV");
	view.placeholder = out;
	// you may uncomment the following line to manually verify that the view gets rendered
//	$("out").appendChild(out);
	Freja.AssetManager.HTTP_REQUEST_TYPE = "async";
	var model = Freja.AssetManager.getModel("data/model.xml");
	var exc = false;
	try {
		view.render(model);
	} catch (ex) {
		exc = ex;
	}
	t.ok(exc == false, "The render should be postproned until loading have completed");
};