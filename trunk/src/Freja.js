if (typeof(dojo) != "undefined") {
	dojo.provide("Freja");
}
if (typeof(Freja) == "undefined") {
	Freja = {};
}
Freja.NAME = "Freja";
Freja.VERSION = "2.0.alpha";
Freja.__repr__ = function () {
	return "[" + this.NAME + " " + this.VERSION + "]";
};
Freja.toString = function () {
	return this.__repr__();
};
/**
  * Single-hierarchy inheritance (class emulation)
  * @see    http://www.itsalleasy.com/2006/02/05/prototype-chain/
  *         http://www.itsalleasy.com/2006/02/24/classjs-third-time-is-the-charm/
  *
  * Extends one prototype by another.
  * The subtype will have two specialpurpose properties:
  *     superconstructor    The parent prototype's constructor
  *     supertype        The parent prototype
  */
Freja.Class = {};
Freja.Class.extend = function(subClass, superconstructor) {
	var inlineSuper = function(){};
	inlineSuper.prototype = superconstructor.prototype;
	subClass.prototype = new inlineSuper();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superconstructor = superconstructor;
	subClass.prototype.supertype = superconstructor.prototype;
};