if (typeof(dojo) != 'undefined') { dojo.require('Freja'); }
if (typeof(JSAN) != 'undefined') { JSAN.use('Freja'); }
if (typeof(tests) == 'undefined') { tests = {}; }

tests.test_History = function (t) {
	Freja.AssetManager.HTTP_REQUEST_TYPE = "sync";

	var model = Freja.AssetManager.getModel("data/model.xml");
	var model2 = Freja.AssetManager.getModel("data/model2.xml");

	var state = new Freja.UndoHistory();

	var exc = false;
	try {
		state.undo();
	} catch (ex) {
		exc = ex;
	}
	t.ok(exc, "Undo should throw error when nothing has been registered");
	var exc = false;
	try {
		state.redo();
	} catch (ex) {
		exc = ex;
	}
	t.ok(exc, "Redo should throw error when nothing has been registered");

	model.set("item/name", "Yoda");
	state.add(model); // snapshot initial state

	model.set("item/name", "Han-Solo");
	t.is(model.get("item/name"), "Han-Solo");
	state.add(model); // snapshot second state

	state.undo(2); // rollback to initial state
	t.is(model.get("item/name"), "Yoda");

	state.redo(); // re-revert to second state
	t.is(model.get("item/name"), "Han-Solo");
};