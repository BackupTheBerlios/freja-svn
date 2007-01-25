/**
  * This is largely s copied with minor stylistic adjustments from Freja 1.1
  * I renamed it from Controller.history to distinguish between window.history
  */
Freja.UndoHistory = function() {
	this.cache = [];
	this.maxLength = 5;
	this._position = 0;
	this._undoSteps = 0;
};
/**
  * Creates a snapshot of the model and stores it.
  */
Freja.UndoHistory.prototype.add = function(model) {
	var historyIndex = this._position % this.maxLength;

	var modelDoc = model.document;
	this.cache[historyIndex] = {};
	this.cache[historyIndex].model = model;
	this.cache[historyIndex].document = Freja._aux.cloneXMLDocument(modelDoc);

	if (!this.cache[historyIndex].document) {
		throw new Error("Couldn't add to history.");
	} else {
		this._position++;
		// clear rest of the history if undo was used.
		var clearHistoryIndex = historyIndex;
		while (this._undoSteps > 0) {
			clearHistoryIndex = (clearHistoryIndex + 1) % this.maxLength;
			this.cache[clearHistoryIndex] = {};
			this._undoSteps--;
		}
		return historyIndex; // what would anybody need this for ?
	}
};
/**
  * Rolls the state back one step.
  */
Freja.UndoHistory.prototype.undo = function(steps) {
	if (this._undoSteps < this.cache.length) {
		this._undoSteps++;
		this._position--;
		if (this._position < 0) {
			this._position = this.maxLength - 1;
		}

		var model = this.cache[this._position].model;
		if (this.cache[this._position].document) {
			model.document = this.cache[this._position].document;
		} else {
			throw new Error("The model's DOMDocument wasn't properly copied into the history");
		}
		if (typeof(steps) != "undefined" && steps > 1) {
			this.undo(steps - 1);
		}
	} else {
		throw new Error("Nothing to undo");
	}
};
/**
  * Reverts the effects of undo.
  */
Freja.UndoHistory.prototype.redo = function() {
	if (this._undoSteps > 0) {
		this._undoSteps--;
		this._position = (this._position + 1) % this.maxLength;

		var model = this.cache[this._position].model;
		model.document = this.cache[this._position].document;
	} else {
		throw new Error("Nothing to redo");
	}
};
/**
  * Removes the last entry in the cache
  */
Freja.UndoHistory.prototype.removeLast = function() {
	this._position--;

	if (this._position < 0) {
		this._position = this.maxLength - 1;
	}
	this.cache[this._position] = {};
	this._undoSteps = 0;
};
