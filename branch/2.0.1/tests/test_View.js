if (typeof(dojo) != 'undefined') { dojo.require('Freja'); }
if (typeof(JSAN) != 'undefined') { JSAN.use('Freja'); }
if (typeof(tests) == 'undefined') { tests = {}; }

tests.test_View = function (t) {
	Freja.AssetManager.HTTP_REQUEST_TYPE = "sync";
	Freja.AssetManager.XSLT_SERVICE_URL = "../external/srvc-xslt.php";
	Freja.AssetManager.XSLT_SERVICE_URL = "../external/srvc-xslt.php?path=tests/";

	var view = Freja.AssetManager.getView("data/view.xsl");
	t.ok(view instanceof Freja.View);
	t.is(view.ready, true, "state should be ready (loaded)");
	t.is(typeof(view.document), "object", "the document shouldn't be null");

	var model = Freja.AssetManager.getModel("data/model.xml");
	var out = document.createElement("DIV");
	view.render(model, out);

//	alert(out.innerHTML);
	t.is(out.getElementsByTagName("H3").length, 1, "The rendered view should contain 1 H3 tag");
	t.is(out.getElementsByTagName("H3").item(0).firstChild.nodeValue, model.get("item/name"), "Rendered view should contain the model's value");

	// test of pojo model
	Freja.AssetManager.clearCache();
	var view = Freja.AssetManager.getView("data/view.xsl");
	var out = document.createElement("DIV");

	var pojo = {
		name : "pojo",
		description : "Plain Old Javascript Object",
		price : "Priceless"
	};
	view.render(pojo, out);

	t.ok(out.innerHTML.toLowerCase().match("<p>plain old javascript object</p>"),"The rendered view should contain the text 'plain old javascript object'");

	// test of form
	var formView = Freja.AssetManager.getView("data/form-view.xsl");
	var testofsubmit = false;

	formView.behaviors["form"] = {
		onsubmit : function() { testofsubmit = true; }
	};
	formView.render(model, out);
	$("out").appendChild(out);
	$("form-submit").click();
	out.parentNode.removeChild(out);

	t.ok(testofsubmit, "The form has been intercepted by our handler");
	
	//////////////////////////////////////////////////////////////////////
	// async tests below

	// we can't test asynch function properly, but we can fire them and assert that
	// they don't throw any exceptions at least
	Freja.AssetManager.clearCache();
	var view = Freja.AssetManager.getView("data/view.xsl");
	var out = document.createElement("DIV");
	// you may uncomment the following line to manually verify that the view gets rendered
//	$("out").appendChild(out);
	Freja.AssetManager.HTTP_REQUEST_TYPE = "async";
	var model = Freja.AssetManager.getModel("data/model.xml");
	var exc = false;
	try {
		view.render(model, out);
	} catch (ex) {
		exc = ex;
	}
	t.ok(exc == false, "The render should be postproned until loading have completed");

	// test Bug #7189 (http://developer.berlios.de/bugs/?func=detailbug&group_id=6277&bug_id=7189)
	Freja.AssetManager.onerror = function (ex) { if (ex.message != "Request failed:404") throw ex; }
	var view = Freja.AssetManager.getView("not_there.xsl");
};