if (typeof(dojo) != 'undefined') { dojo.require('Freja'); }
if (typeof(JSAN) != 'undefined') { JSAN.use('Freja'); }
if (typeof(tests) == 'undefined') { tests = {}; }

tests.test_Model = function (t) {
	// test of SimplePath (XPath query replacement)
	var q = new Freja.QueryEngine.SimplePath();
	var doc = document.createElement("DIV");
	var span = document.createElement("SPAN");
	doc.appendChild(document.createElement("DIV")).appendChild(span);
	var found = q._find(doc, "div/span");
	t.is(found, span, "Test simple path selection");

	span.setAttribute("foo", "bar");
	var found = q._find(doc, "div/span/@foo");
	t.is(found.nodeValue, "bar", "Test selection of attribute node");
	t.is(q.get(doc, "div/span/@foo"), "bar", "Test selection of attribute node, through getter");

	span.appendChild(document.createElement("DIV")).appendChild(document.createTextNode("a"));
	span.appendChild(document.createElement("DIV")).appendChild(document.createTextNode("b"));
	t.is(q.get(doc, "div/span/div[2]"), "b");

	// test of Model
	Freja.AssetManager.HTTP_REQUEST_TYPE = "sync";

	var model = Freja.AssetManager.getModel("data/model.xml");
	t.ok(model instanceof Freja.Model);
	t.is(model.ready, true, "state should be ready (loaded)");
	t.is(typeof(model.document), "object", "the document shouldn't be null");

	t.is(model.get("item/name"), "Black Bean and Smoked Tomato");
	model.set("item/name", "Yo mama");
	t.is(model.get("item/name"), "Yo mama");

	var collection = Freja.AssetManager.getModel("data/collection.xml");
	t.is(collection.ready, true, "state should be ready (loaded)");
	t.is(collection.get("collection/item[2]/name"), "Four Star Ham Salad");
	var elm = collection.getElementById(2);
	t.is(elm.getAttribute("id"), 2);

	var model = Freja.AssetManager.getModel("data/model2.xml");
	t.is(model.get("item/@price"), "$3.80");
	t.is(model.get("item/description"), "with Goat Cheese, a touch of Cumin and Cayenne");

};