
/***

MochiKit.Base 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide("MochiKit.Base");
}

if (typeof(MochiKit) == 'undefined') {
    MochiKit = {};
}
if (typeof(MochiKit.Base) == 'undefined') {
    MochiKit.Base = {};
}

MochiKit.Base.VERSION = "1.3";
MochiKit.Base.NAME = "MochiKit.Base"
MochiKit.Base.update = function (self, obj/*, ... */) {
    /***

        Mutate an object by replacing its key:value pairs with those
        from other object(s).  Key:value pairs from later objects will
        overwrite those from earlier objects.

        If null is given as the initial object, a new one will be created.

        This mutates *and returns* the given object, be warned.

        A version of this function that creates a new object is available
        as merge(o1, o2, ...)

    ***/
    if (self == null) {
        self = {};
    }
    for (var i = 1; i < arguments.length; i++) {
        var o = arguments[i];
        if (typeof(o) != 'undefined' && o != null) {
            for (var k in o) {
                self[k] = o[k];
            }
        }
    }
    return self;
};

MochiKit.Base.update(MochiKit.Base, {
    __repr__: function () {
        return "[" + this.NAME + " " + this.VERSION + "]";
    },

    toString: function () {
        return this.__repr__();
    },

    counter: function (n/* = 1 */) {
        if (arguments.length == 0) {
            n = 1;
        }
        return function () {
            return n++;
        };
    },

    clone: function (obj) {
        var me = arguments.callee;
        if (arguments.length == 1) {
            me.prototype = obj;
            return new me();
        }
    },

    extend: function (self, obj, /* optional */skip) {
        /***

            Mutate an array by extending it with an array-like obj,
            starting with the "skip" index of obj.  If null is given
            as the initial array, a new one will be created.

            This mutates *and returns* the given array, be warned.

        ***/

        // Extend an array with an array-like object starting
        // from the skip index
        if (!skip) {
            skip = 0;
        }
        if (obj) {
            // allow iterable fall-through, but skip the full isArrayLike
            // check for speed, this is called often.
            var l = obj.length;
            if (typeof(l) != 'number' /* !isArrayLike(obj) */) {
                if (typeof(MochiKit.Iter) != "undefined") {
                    obj = MochiKit.Iter.list(obj);
                    l = obj.length;
                } else {
                    throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                }
            }
            if (!self) {
                self = [];
            }
            for (var i = skip; i < l; i++) {
                self.push(obj[i]);
            }
        }
        // This mutates, but it's convenient to return because
        // it's often used like a constructor when turning some
        // ghetto array-like to a real array
        return self;
    },


    updatetree: function (self, obj/*, ...*/) {
        if (self == null) {
            self = {};
        }
        for (var i = 1; i < arguments.length; i++) {
            var o = arguments[i];
            if (typeof(o) != 'undefined' && o != null) {
                for (var k in o) {
                    var v = o[k];
                    if (typeof(self[k]) == 'object' && typeof(v) == 'object') {
                        arguments.callee(self[k], v);
                    } else {
                        self[k] = v;
                    }
                }
            }
        }
        return self;
    },

    setdefault: function (self, obj/*, ...*/) {
        /***

            Mutate an object by replacing its key:value pairs with those
            from other object(s) IF they are not already set on the initial
            object.

            If null is given as the initial object, a new one will be created.

            This mutates *and returns* the given object, be warned.

        ***/
        if (self == null) {
            self = {};
        }
        for (var i = 1; i < arguments.length; i++) {
            var o = arguments[i];
            for (var k in o) {
                if (!(k in self)) {
                    self[k] = o[k];
                }
            }
        }
        return self;
    },

    keys: function (obj) {
        /***

            Return an array of the property names of an object
            (in no particular order).

        ***/
        var rval = [];
        for (var prop in obj) {
            rval.push(prop);
        }
        return rval;
    },

    items: function (obj) {
        /***

            Return an array of [propertyName, propertyValue] pairs for an
            object (in no particular order).

        ***/
        var rval = [];
        var e;
        for (var prop in obj) {
            var v;
            try {
                v = obj[prop];
            } catch (e) {
                continue;
            }
            rval.push([prop, v]);
        }
        return rval;
    },


    _newNamedError: function (module, name, func) {
        func.prototype = new MochiKit.Base.NamedError(module.NAME + "." + name);
        module[name] = func;
    },


    operator: {
        /***

            A table of JavaScript's operators for usage with map, filter, etc.

        ***/

        // unary logic operators
        truth: function (a) { return !!a; },
        lognot: function (a) { return !a; },
        identity: function (a) { return a; },

        // bitwise unary operators
        not: function (a) { return ~a; },
        neg: function (a) { return -a; },

        // binary operators
        add: function (a, b) { return a + b; },
        sub: function (a, b) { return a - b; },
        div: function (a, b) { return a / b; },
        mod: function (a, b) { return a % b; },
        mul: function (a, b) { return a * b; },

        // bitwise binary operators
        and: function (a, b) { return a & b; },
        or: function (a, b) { return a | b; },
        xor: function (a, b) { return a ^ b; },
        lshift: function (a, b) { return a << b; },
        rshift: function (a, b) { return a >> b; },
        zrshift: function (a, b) { return a >>> b; },

        // near-worthless built-in comparators
        eq: function (a, b) { return a == b; },
        ne: function (a, b) { return a != b; },
        gt: function (a, b) { return a > b; },
        ge: function (a, b) { return a >= b; },
        lt: function (a, b) { return a < b; },
        le: function (a, b) { return a <= b; },

        // compare comparators
        ceq: function (a, b) { return MochiKit.Base.compare(a, b) == 0; },
        cne: function (a, b) { return MochiKit.Base.compare(a, b) != 0; },
        cgt: function (a, b) { return MochiKit.Base.compare(a, b) == 1; },
        cge: function (a, b) { return MochiKit.Base.compare(a, b) != -1; },
        clt: function (a, b) { return MochiKit.Base.compare(a, b) == -1; },
        cle: function (a, b) { return MochiKit.Base.compare(a, b) != 1; },

        // binary logical operators
        logand: function (a, b) { return a && b; },
        logor: function (a, b) { return a || b; },
        contains: function (a, b) { return b in a; }
    },

    forward: function (func) {
        /***

        Returns a function that forwards a method call to this.func(...)

        ***/
        return function () {
            return this[func].apply(this, arguments);
        };
    },

    itemgetter: function (func) {
        /***

        Returns a function that returns arg[func]

        ***/
        return function (arg) {
            return arg[func];
        };
    },

    typeMatcher: function (/* typ */) {
        /***

        Given a set of types (as string arguments),
        returns a function that will return true if the types of the given
        objects are members of that set.

        ***/

        var types = {};
        for (var i = 0; i < arguments.length; i++) {
            var typ = arguments[i];
            types[typ] = typ;
        }
        return function () {
            for (var i = 0; i < arguments.length; i++) {
                if (!(typeof(arguments[i]) in types)) {
                    return false;
                }
            }
            return true;
        };
    },

    isNull: function (/* ... */) {
        /***

        Returns true if all arguments are null.

        ***/
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== null) {
                return false;
            }
        }
        return true;
    },

    isUndefinedOrNull: function (/* ... */) {
        /***

            Returns true if all arguments are undefined or null

        ***/
        for (var i = 0; i < arguments.length; i++) {
            var o = arguments[i];
            if (!(typeof(o) == 'undefined' || o == null)) {
                return false;
            }
        }
        return true;
    },

    isNotEmpty: function (obj) {
        /***

            Returns true if all the array or string arguments
            are not empty

        ***/
        for (var i = 0; i < arguments.length; i++) {
            var o = arguments[i];
            if (!(o && o.length)) {
                return false;
            }
        }
        return true;
    },

    isArrayLike: function () {
        /***

            Returns true if all given arguments are Array-like

        ***/
        for (var i = 0; i < arguments.length; i++) {
            var o = arguments[i];
            var typ = typeof(o);
            if (
                (typ != 'object' && !(typ == 'function' && typeof(o.item) == 'function')) ||
                o == null ||
                typeof(o.length) != 'number'
            ) {
                return false;
            }
        }
        return true;
    },

    isDateLike: function () {
        /***

            Returns true if all given arguments are Date-like

        ***/
        for (var i = 0; i < arguments.length; i++) {
            var o = arguments[i];
            if (typeof(o) != "object" || o == null
                    || typeof(o.getTime) != 'function') {
                return false;
            }
        }
        return true;
    },


    xmap: function (fn/*, obj... */) {
        /***

            Return an array composed of fn(obj) for every obj given as an
            argument.

            If fn is null, operator.identity is used.

        ***/
        if (fn == null) {
            return MochiKit.Base.extend(null, arguments, 1);
        }
        var rval = [];
        for (var i = 1; i < arguments.length; i++) {
            rval.push(fn(arguments[i]));
        }
        return rval;
    },

    map: function (fn, lst/*, lst... */) {
        /***

            Return a new array composed of the results of fn(x) for every x in
            lst

            If fn is null, and only one sequence argument is given the identity
            function is used.

                map(null, lst) -> lst.slice();

            If fn is null, and more than one sequence is given as arguments,
            then the Array function is used, making it equivalent to zip.

                map(null, p, q, ...)
                    -> zip(p, q, ...)
                    -> [[p0, q0, ...], [p1, q1, ...], ...];

        ***/
        var m = MochiKit.Base;
        var isArrayLike = m.isArrayLike;
        if (arguments.length <= 2) {
            // allow an iterable to be passed
            if (!isArrayLike(lst)) {
                if (MochiKit.Iter) {
                    // fast path for map(null, iterable)
                    lst = MochiKit.Iter.list(lst);
                    if (fn == null) {
                        return lst;
                    }
                } else {
                    throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                }
            }
            // fast path for map(null, lst)
            if (fn == null) {
                return m.extend(null, lst);
            }
            // disabled fast path for map(fn, lst)
            /*
            if (false && typeof(Array.prototype.map) == 'function') {
                // Mozilla fast-path
                return Array.prototype.map.call(lst, fn);
            }
            */
            var rval = [];
            for (var i = 0; i < lst.length; i++) {
                rval.push(fn(lst[i]));
            }
            return rval;
        } else {
            // default for map(null, ...) is zip(...)
            if (fn == null) {
                fn = Array;
            }
            var length = null;
            for (i = 1; i < arguments.length; i++) {
                // allow iterables to be passed
                if (!isArrayLike(arguments[i])) {
                    if (MochiKit.Iter) {
                        arguments[i] = MochiKit.Iter.list(arguments[i]);
                    } else {
                        throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                    }
                }
                // find the minimum length
                var l = arguments[i].length;
                if (length == null || length > l) {
                    length = l;
                }
            }
            rval = [];
            for (i = 0; i < length; i++) {
                var args = [];
                for (var j = 1; j < arguments.length; j++) {
                    args.push(arguments[j][i]);
                }
                rval.push(fn.apply(this, args));
            }
            return rval;
        }
    },

    xfilter: function (fn/*, obj... */) {
        var rval = [];
        if (fn == null) {
            fn = MochiKit.Base.operator.truth;
        }
        for (var i = 1; i < arguments.length; i++) {
            var o = arguments[i];
            if (fn(o)) {
                rval.push(o);
            }
        }
        return rval;
    },

    filter: function (fn, lst, self) {
        var rval = [];
        // allow an iterable to be passed
        var m = MochiKit.Base;
        if (!m.isArrayLike(lst)) {
            if (MochiKit.Iter) {
                lst = MochiKit.Iter.list(lst);
            } else {
                throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
            }
        }
        if (fn == null) {
            fn = m.operator.truth;
        }
        if (typeof(Array.prototype.filter) == 'function') {
            // Mozilla fast-path
            return Array.prototype.filter.call(lst, fn, self);
        } else if (typeof(self) == 'undefined' || self == null) {
            for (var i = 0; i < lst.length; i++) {
                var o = lst[i];
                if (fn(o)) {
                    rval.push(o);
                }
            }
        } else {
            for (i = 0; i < lst.length; i++) {
                o = lst[i];
                if (fn.call(self, o)) {
                    rval.push(o);
                }
            }
        }
        return rval;
    },


    _wrapDumbFunction: function (func) {
        return function () {
            // fast path!
            switch (arguments.length) {
                case 0: return func();
                case 1: return func(arguments[0]);
                case 2: return func(arguments[0], arguments[1]);
                case 3: return func(arguments[0], arguments[1], arguments[2]);
            }
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push("arguments[" + i + "]");
            }
            return eval("(func(" + args.join(",") + "))");
        };
    },

    bind: function (func, self/* args... */) {
        if (typeof(func) == "string") {
            func = self[func];
        }
        var im_func = func.im_func;
        var im_preargs = func.im_preargs;
        var im_self = func.im_self;
        var m = MochiKit.Base;
        if (typeof(func) == "function" && typeof(func.apply) == "undefined") {
            // this is for cases where JavaScript sucks ass and gives you a
            // really dumb built-in function like alert() that doesn't have
            // an apply
            func = m._wrapDumbFunction(func);
        }
        if (typeof(im_func) != 'function') {
            im_func = func;
        }
        if (typeof(self) != 'undefined') {
            im_self = self;
        }
        if (typeof(im_preargs) == 'undefined') {
            im_preargs = [];
        } else  {
            im_preargs = im_preargs.slice();
        }
        m.extend(im_preargs, arguments, 2);
        var newfunc = function () {
            var args = arguments;
            var me = arguments.callee;
            if (me.im_preargs.length > 0) {
                args = m.concat(me.im_preargs, args);
            }
            var self = me.im_self;
            if (!self) {
                self = this;
            }
            return me.im_func.apply(self, args);
        };
        newfunc.im_self = im_self;
        newfunc.im_func = im_func;
        newfunc.im_preargs = im_preargs;
        return newfunc;
    },

    bindMethods: function (self) {
        /***

            Bind all functions in self to self,
            which gives you a semi-Pythonic sort of instance.

        ***/
        var bind = MochiKit.Base.bind;
        for (var k in self) {
            var func = self[k];
            if (typeof(func) == 'function') {
                self[k] = bind(func, self);
            }
        }
    },

    registerComparator: function (name, check, comparator, /* optional */ override) {
        /***

            Register a comparator for use with the compare function.

            name should be a unique identifier describing the comparator.

            check is a function (a, b) that returns true if a and b
            can be compared with comparator.

            comparator is a function (a, b) that returns:

                 0 when a == b
                 1 when a > b
                -1 when a < b

            comparator is guaranteed to only be called if check(a, b)
            returns a true value.

            If override is given and true, then it will be made the
            highest precedence comparator.  Otherwise, the lowest.

        ***/
        MochiKit.Base.comparatorRegistry.register(name, check, comparator, override);
    },

    _primitives: {'bool': true, 'string': true, 'number': true},

    compare: function (a, b) {
        /***

            Compare two objects in a sensible manner.  Currently this is:

                1. undefined and null compare equal to each other
                2. undefined and null are less than anything else
                3. comparators registered with registerComparator are
                   used to find a good comparator.  Built-in comparators
                   are currently available for arrays and dates.
                4. Otherwise hope that the built-in comparison operators
                   do something useful, which should work for numbers
                   and strings.

            Returns what one would expect from a comparison function.

            returns:

                 0 when a == b
                 1 when a > b
                -1 when a < b

        ***/
        if (a == b) {
            return 0;
        }
        var aIsNull = (typeof(a) == 'undefined' || a == null);
        var bIsNull = (typeof(b) == 'undefined' || b == null);
        if (aIsNull && bIsNull) {
            return 0;
        } else if (aIsNull) {
            return -1;
        } else if (bIsNull) {
            return 1;
        }
        var m = MochiKit.Base;
        // bool, number, string have meaningful comparisons
        var prim = m._primitives;
        if (!(typeof(a) in prim && typeof(b) in prim)) {
            try {
                return m.comparatorRegistry.match(a, b);
            } catch (e) {
                if (e != m.NotFound) {
                    throw e;
                }
            }
        }
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        // These types can't be compared
        var repr = m.repr;
        throw new TypeError(repr(a) + " and " + repr(b) + " can not be compared");
    },

    compareDateLike: function (a, b) {
        return MochiKit.Base.compare(a.getTime(), b.getTime());
    },

    compareArrayLike: function (a, b) {
        var compare = MochiKit.Base.compare;
        var count = a.length;
        var rval = 0;
        if (count > b.length) {
            rval = 1;
            count = b.length;
        } else if (count < b.length) {
            rval = -1;
        }
        for (var i = 0; i < count; i++) {
            var cmp = compare(a[i], b[i]);
            if (cmp) {
                return cmp;
            }
        }
        return rval;
    },

    registerRepr: function (name, check, wrap, /* optional */override) {
        /***

            Register a repr function.  repr functions should take
            one argument and return a string representation of it
            suitable for developers, primarily used when debugging.

            If override is given, it is used as the highest priority
            repr, otherwise it will be used as the lowest.

        ***/
        MochiKit.Base.reprRegistry.register(name, check, wrap, override);
    },

    repr: function (o) {
        /***

            Return a "programmer representation" for an object

        ***/

        if (typeof(o) == "undefined") {
            return "undefined";
        } else if (o === null) {
            return "null";
        }
        try {
            if (typeof(o.__repr__) == 'function') {
                return o.__repr__();
            } else if (typeof(o.repr) == 'function' && o.repr != arguments.callee) {
                return o.repr();
            }
            return MochiKit.Base.reprRegistry.match(o);
        } catch (e) {
            if (typeof(o.NAME) == 'string' && (
                    o.toString == Function.prototype.toString ||
                    o.toString == Object.prototype.toString
                )) {
                return o.NAME;
            }
        }
        try {
            var ostring = (o + "");
        } catch (e) {
            return "[" + typeof(o) + "]";
        }
        if (typeof(o) == "function") {
            o = ostring.replace(/^\s+/, "");
            var idx = o.indexOf("{");
            if (idx != -1) {
                o = o.substr(0, idx) + "{...}";
            }
        }
        return ostring;
    },

    reprArrayLike: function (o) {
        var m = MochiKit.Base;
        return "[" + m.map(m.repr, o).join(", ") + "]";
    },

    reprString: function (o) {
        return ('"' + o.replace(/(["\\])/g, '\\$1') + '"'
            ).replace(/[\f]/g, "\\f"
            ).replace(/[\b]/g, "\\b"
            ).replace(/[\n]/g, "\\n"
            ).replace(/[\t]/g, "\\t"
            ).replace(/[\r]/g, "\\r");
    },

    reprNumber: function (o) {
        return o + "";
    },

    registerJSON: function (name, check, wrap, /* optional */override) {
        /***

            Register a JSON serialization function.  JSON serialization
            functions should take one argument and return an object
            suitable for JSON serialization:

            - string
            - number
            - boolean
            - undefined
            - object
                - null
                - Array-like (length property that is a number)
                - Objects with a "json" method will have this method called
                - Any other object will be used as {key:value, ...} pairs

            If override is given, it is used as the highest priority
            JSON serialization, otherwise it will be used as the lowest.

        ***/
        MochiKit.Base.jsonRegistry.register(name, check, wrap, override);
    },


    evalJSON: function () {
        return eval("(" + arguments[0] + ")");
    },

    serializeJSON: function (o) {
        /***

            Create a JSON serialization of an object, note that this doesn't
            check for infinite recursion, so don't do that!

        ***/
        var objtype = typeof(o);
        if (objtype == "undefined") {
            return "undefined";
        } else if (objtype == "number" || objtype == "boolean") {
            return o + "";
        } else if (o === null) {
            return "null";
        }
        var m = MochiKit.Base;
        var reprString = m.reprString;
        if (objtype == "string") {
            return reprString(o);
        }
        // recurse
        var me = arguments.callee;
        // short-circuit for objects that support "json" serialization
        // if they return "self" then just pass-through...
        var newObj;
        if (typeof(o.__json__) == "function") {
            newObj = o.__json__();
            if (o !== newObj) {
                return me(newObj);
            }
        }
        if (typeof(o.json) == "function") {
            newObj = o.json();
            if (o !== newObj) {
                return me(newObj);
            }
        }
        // array
        if (objtype != "function" && typeof(o.length) == "number") {
            var res = [];
            for (var i = 0; i < o.length; i++) {
                var val = me(o[i]);
                if (typeof(val) != "string") {
                    val = "undefined";
                }
                res.push(val);
            }
            return "[" + res.join(", ") + "]";
        }
        // look in the registry
        try {
            newObj = m.jsonRegistry.match(o);
            return me(newObj);
        } catch (e) {
            if (e != m.NotFound) {
                // something really bad happened
                throw e;
            }
        }
        // it's a function with no adapter, bad
        if (objtype == "function") {
            return null;
        }
        // generic object code path
        res = [];
        for (var k in o) {
            var useKey;
            if (typeof(k) == "number") {
                useKey = '"' + k + '"';
            } else if (typeof(k) == "string") {
                useKey = reprString(k);
            } else {
                // skip non-string or number keys
                continue;
            }
            val = me(o[k]);
            if (typeof(val) != "string") {
                // skip non-serializable values
                continue;
            }
            res.push(useKey + ":" + val);
        }
        return "{" + res.join(", ") + "}";
    },


    objEqual: function (a, b) {
        /***

            Compare the equality of two objects.

        ***/
        return (MochiKit.Base.compare(a, b) == 0);
    },

    arrayEqual: function (self, arr) {
        /***

            Compare two arrays for equality, with a fast-path for length
            differences.

        ***/
        if (self.length != arr.length) {
            return false;
        }
        return (MochiKit.Base.compare(self, arr) == 0);
    },

    concat: function (/* lst... */) {
        /***

            Concatenates all given array-like arguments and returns
            a new array:

                var lst = concat(["1","3","5"], ["2","4","6"]);
                assert(lst.toString() == "1,3,5,2,4,6");

        ***/
        var rval = [];
        var extend = MochiKit.Base.extend;
        for (var i = 0; i < arguments.length; i++) {
            extend(rval, arguments[i]);
        }
        return rval;
    },

    keyComparator: function (key/* ... */) {
        /***

            A comparator factory that compares a[key] with b[key].
            e.g.:

                var lst = ["a", "bbb", "cc"];
                lst.sort(keyComparator("length"));
                assert(lst.toString() == "a,cc,bbb");

        ***/
        // fast-path for single key comparisons
        var m = MochiKit.Base;
        var compare = m.compare;
        if (arguments.length == 1) {
            return function (a, b) {
                return compare(a[key], b[key]);
            }
        }
        var compareKeys = m.extend(null, arguments);
        return function (a, b) {
            var rval = 0;
            // keep comparing until something is inequal or we run out of
            // keys to compare
            for (var i = 0; (rval == 0) && (i < compareKeys.length); i++) {
                var key = compareKeys[i];
                rval = compare(a[key], b[key]);
            }
            return rval;
        };
    },

    reverseKeyComparator: function (key) {
        /***

            A comparator factory that compares a[key] with b[key] in reverse.
            e.g.:

                var lst = ["a", "bbb", "cc"];
                lst.sort(reverseKeyComparator("length"));
                assert(lst.toString() == "bbb,cc,aa");

        ***/
        var comparator = MochiKit.Base.keyComparator.apply(this, arguments);
        return function (a, b) {
            return comparator(b, a);
        }
    },

    partial: function (func) {
        var m = MochiKit.Base;
        return m.bind.apply(this, m.extend([func, undefined], arguments, 1));
    },

    listMinMax: function (which, lst) {
        /***

            If which == -1 then it will return the smallest
            element of the array-like lst.  This is also available
            as:

                listMin(lst)


            If which == 1 then it will return the largest
            element of the array-like lst.  This is also available
            as:

                listMax(list)

        ***/
        if (lst.length == 0) {
            return null;
        }
        var cur = lst[0];
        var compare = MochiKit.Base.compare;
        for (var i = 1; i < lst.length; i++) {
            var o = lst[i];
            if (compare(o, cur) == which) {
                cur = o;
            }
        }
        return cur;
    },

    objMax: function (/* obj... */) {
        /***

            Return the maximum object out of the given arguments

        ***/
        return MochiKit.Base.listMinMax(1, arguments);
    },

    objMin: function (/* obj... */) {
        /***

            Return the minimum object out of the given arguments

        ***/
        return MochiKit.Base.listMinMax(-1, arguments);
    },

    findIdentical: function (lst, value, start/* = 0 */, /* optional */end) {
        if (typeof(end) == "undefined" || end == null) {
            end = lst.length;
        }
        for (var i = (start || 0); i < end; i++) {
            if (lst[i] === value) {
                return i;
            }
        }
        return -1;
    },

    find: function (lst, value, start/* = 0 */, /* optional */end) {
        if (typeof(end) == "undefined" || end == null) {
            end = lst.length;
        }
        var cmp = MochiKit.Base.compare;
        for (var i = (start || 0); i < end; i++) {
            if (cmp(lst[i], value) == 0) {
                return i;
            }
        }
        return -1;
    },

    nodeWalk: function (node, visitor) {
        /***

            Non-recursive generic node walking function (e.g. for a DOM)

            @param node: The initial node to be searched.

            @param visitor: The visitor function, will be called as
                            visitor(node), and should return an Array-like
                            of notes to be searched next (e.g.
                            node.childNodes).

        ***/
        var nodes = [node];
        var extend = MochiKit.Base.extend;
        while (nodes.length) {
            var res = visitor(nodes.shift());
            if (res) {
                extend(nodes, res);
            }
        }
    },


    nameFunctions: function (namespace) {
        var base = namespace.NAME;
        if (typeof(base) == 'undefined') {
            base = '';
        } else {
            base = base + '.';
        }
        for (var name in namespace) {
            var o = namespace[name];
            if (typeof(o) == 'function' && typeof(o.NAME) == 'undefined') {
                try {
                    o.NAME = base + name;
                } catch (e) {
                    // pass
                }
            }
        }
    },


    queryString: function (names, values) {
        // check to see if names is a string or a DOM element, and if
        // MochiKit.DOM is available.  If so, drop it like it's a form
        // Ugliest conditional in MochiKit?  Probably!
        if (typeof(MochiKit.DOM) != "undefined" && arguments.length == 1
            && (typeof(names) == "string" || (
                typeof(names.nodeType) != "undefined" && names.nodeType > 0
            ))
        ) {
            var kv = MochiKit.DOM.formContents(names);
            names = kv[0];
            values = kv[1];
        } else if (arguments.length == 1) {
            var o = names;
            names = [];
            values = [];
            for (var k in o) {
                var v = o[k];
                if (typeof(v) != "function") {
                    names.push(k);
                    values.push(v);
                }
            }
        }
        var rval = [];
        var len = Math.min(names.length, values.length);
        var urlEncode = MochiKit.Base.urlEncode;
        for (var i = 0; i < len; i++) {
            v = values[i];
            if (typeof(v) != 'undefined' && v != null) {
                rval.push(urlEncode(names[i]) + "=" + urlEncode(v));
            }
        }
        return rval.join("&");
    },


    parseQueryString: function (encodedString, useArrays) {
        var pairs = encodedString.replace(/\+/g, "%20").split("&");
        var o = {};
        var decode;
        if (typeof(decodeURIComponent) != "undefined") {
            decode = decodeURIComponent;
        } else {
            decode = unescape;
        }
        if (useArrays) {
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split("=");
                var name = decode(pair[0]);
                var arr = o[name];
                if (!(arr instanceof Array)) {
                    arr = [];
                    o[name] = arr;
                }
                arr.push(decode(pair[1]));
            }
        } else {
            for (i = 0; i < pairs.length; i++) {
                pair = pairs[i].split("=");
                o[decode(pair[0])] = decode(pair[1]);
            }
        }
        return o;
    }
});

MochiKit.Base.AdapterRegistry = function () {
    /***

        A registry to facilitate adaptation.

        Pairs is an array of [name, check, wrap] triples

        All check/wrap functions in this registry should be of the same arity.

    ***/
    this.pairs = [];
};

MochiKit.Base.AdapterRegistry.prototype = {
    register: function (name, check, wrap, /* optional */ override) {
        /***

            The check function should return true if the given arguments are
            appropriate for the wrap function.

            If override is given and true, the check function will be given
            highest priority.  Otherwise, it will be the lowest priority
            adapter.

        ***/

        if (override) {
            this.pairs.unshift([name, check, wrap]);
        } else {
            this.pairs.push([name, check, wrap]);
        }
    },

    match: function (/* ... */) {
        /***

            Find an adapter for the given arguments.

            If no suitable adapter is found, throws NotFound.

        ***/
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            if (pair[1].apply(this, arguments)) {
                return pair[2].apply(this, arguments);
            }
        }
        throw MochiKit.Base.NotFound;
    },

    unregister: function (name) {
        /***

            Remove a named adapter from the registry

        ***/
        for (var i = 0; i < this.pairs.length; i++) {
            var pair = this.pairs[i];
            if (pair[0] == name) {
                this.pairs.splice(i, 1);
                return true;
            }
        }
        return false;
    }
};


MochiKit.Base.EXPORT = [
    "counter",
    "clone",
    "extend",
    "update",
    "updatetree",
    "setdefault",
    "keys",
    "items",
    "NamedError",
    "operator",
    "forward",
    "itemgetter",
    "typeMatcher",
    "isCallable",
    "isUndefined",
    "isUndefinedOrNull",
    "isNull",
    "isNotEmpty",
    "isArrayLike",
    "isDateLike",
    "xmap",
    "map",
    "xfilter",
    "filter",
    "bind",
    "bindMethods",
    "NotFound",
    "AdapterRegistry",
    "registerComparator",
    "compare",
    "registerRepr",
    "repr",
    "objEqual",
    "arrayEqual",
    "concat",
    "keyComparator",
    "reverseKeyComparator",
    "partial",
    "merge",
    "listMinMax",
    "listMax",
    "listMin",
    "objMax",
    "objMin",
    "nodeWalk",
    "zip",
    "urlEncode",
    "queryString",
    "serializeJSON",
    "registerJSON",
    "evalJSON",
    "parseQueryString",
    "find",
    "findIdentical"
];

MochiKit.Base.EXPORT_OK = [
    "nameFunctions",
    "comparatorRegistry",
    "reprRegistry",
    "jsonRegistry",
    "compareDateLike",
    "compareArrayLike",
    "reprArrayLike",
    "reprString",
    "reprNumber"
];

MochiKit.Base._exportSymbols = function (globals, module) {
    if (typeof(MochiKit.__export__) == "undefined") {
        MochiKit.__export__ = (MochiKit.__compat__  ||
            (typeof(JSAN) == 'undefined' && typeof(dojo) == 'undefined')
        );
    }
    if (!MochiKit.__export__) {
        return;
    }
    var all = module.EXPORT_TAGS[":all"];
    for (var i = 0; i < all.length; i++) {
        globals[all[i]] = module[all[i]];
    }
};

MochiKit.Base.__new__ = function () {
    // A singleton raised when no suitable adapter is found
    var m = this;
    if (typeof(encodeURIComponent) != "undefined") {
        m.urlEncode = function (unencoded) {
            return encodeURIComponent(unencoded).replace(/\'/g, '%27');
        };
    } else {
        m.urlEncode = function (unencoded) {
            return escape(unencoded
                ).replace(/\+/g, '%2B'
                ).replace(/\"/g,'%22'
                ).rval.replace(/\'/g, '%27');
        };
    }

    m.NamedError = function (name) {
        this.message = name;
        this.name = name;
    };
    m.NamedError.prototype = new Error();
    m.update(m.NamedError.prototype, {
        repr: function () {
            if (this.message && this.message != this.name) {
                return this.name + "(" + m.repr(this.message) + ")";
            } else {
                return this.name + "()";
            }
        },
        toString: m.forward("repr")
    });

    m.NotFound = new m.NamedError("MochiKit.Base.NotFound");


    m.listMax = m.partial(m.listMinMax, 1);
    m.listMin = m.partial(m.listMinMax, -1);

    m.isCallable = m.typeMatcher('function');
    m.isUndefined = m.typeMatcher('undefined');

    m.merge = m.partial(m.update, null);
    m.zip = m.partial(m.map, null);

    m.comparatorRegistry = new m.AdapterRegistry();
    m.registerComparator("dateLike", m.isDateLike, m.compareDateLike);
    m.registerComparator("arrayLike", m.isArrayLike, m.compareArrayLike);

    m.reprRegistry = new m.AdapterRegistry();
    m.registerRepr("arrayLike", m.isArrayLike, m.reprArrayLike);
    m.registerRepr("string", m.typeMatcher("string"), m.reprString);
    m.registerRepr("numbers", m.typeMatcher("number", "boolean"), m.reprNumber);

    m.jsonRegistry = new m.AdapterRegistry();

    var all = m.concat(m.EXPORT, m.EXPORT_OK);
    m.EXPORT_TAGS = {
        ":common": m.concat(m.EXPORT_OK),
        ":all": all
    };

    m.nameFunctions(this);

};

MochiKit.Base.__new__();

//
// XXX: Internet Explorer blows
//
compare = MochiKit.Base.compare;

MochiKit.Base._exportSymbols(this, MochiKit.Base);

/***

MochiKit.Iter 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/
if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Iter');
    dojo.require('MochiKit.Base');
}

if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Base", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Iter depends on MochiKit.Base!";
}

if (typeof(MochiKit.Iter) == 'undefined') {
    MochiKit.Iter = {};
}

MochiKit.Iter.NAME = "MochiKit.Iter";
MochiKit.Iter.VERSION = "1.3";
MochiKit.Base.update(MochiKit.Iter, {
    __repr__: function () {
        return "[" + this.NAME + " " + this.VERSION + "]";
    },
    toString: function () {
        return this.__repr__();
    },

    registerIteratorFactory: function (name, check, iterfactory, /* optional */ override) {
        /***

            Register an iterator factory for use with the iter function.

            check is a function (a) that returns true if a can be converted
            into an iterator with iterfactory.

            iterfactory is a function (a) that returns an object with a
            "next" function that returns the next value in the sequence.

            iterfactory is guaranteed to only be called if check(a)
            returns a true value.

            If override is given and true, then it will be made the
            highest precedence iterator factory.  Otherwise, the lowest.

        ***/

        MochiKit.Iter.iteratorRegistry.register(name, check, iterfactory, override);
    },

    iter: function (iterable, /* optional */ sentinel) {
        /***

            Convert the given argument to an iterator (object implementing
            "next").

            1. If iterable is an iterator (implements "next"), then it will be
               returned as-is.
            2. If iterable is an iterator factory (implements "iter"), then the
               result of iterable.iter() will be returned.
            3. Otherwise, the iterator factory registry is used to find a
               match.
            4. If no factory is found, it will throw TypeError

            When used directly, using an iterator should look like this::

                var it = iter(iterable);
                try {
                    while (var o = it.next()) {
                        // use o
                    }
                } catch (e) {
                    if (e != StopIteration) {
                        throw e;
                    }
                    // pass
                }

        ***/

        var self = MochiKit.Iter;
        if (arguments.length == 2) {
            return self.takewhile(
                function (a) { return a != sentinel; },
                iterable
            );
        }
        if (typeof(iterable.next) == 'function') {
            return iterable;
        } else if (typeof(iterable.iter) == 'function') {
            return iterable.iter();
        }
        try {
            return self.iteratorRegistry.match(iterable);
        } catch (e) {
            var m = MochiKit.Base;
            if (e == m.NotFound) {
                e = new TypeError(typeof(iterable) + ": " + m.repr(iterable) + " is not iterable");
            }
            throw e;
        }
    },

    count: function (n) {
        /***

            count([n]) --> n, n + 1, n + 2, ...

        ***/
        if (!n) {
            n = 0;
        }
        var m = MochiKit.Base;
        return {
            repr: function () { return "count(" + n + ")"; },
            toString: m.forward("repr"),
            next: m.counter(n)
        };
    },

    cycle: function (p) {
        /***

            cycle(p) --> p0, p1, ... plast, p0, p1, ...

        ***/
        var self = MochiKit.Iter;
        var m = MochiKit.Base;
        var lst = [];
        var iterator = self.iter(p);
        return {
            repr: function () { return "cycle(...)"; },
            toString: m.forward("repr"),
            next: function () {
                try {
                    var rval = iterator.next();
                    lst.push(rval);
                    return rval;
                } catch (e) {
                    if (e != self.StopIteration) {
                        throw e;
                    }
                    if (lst.length == 0) {
                        this.next = function () {
                            throw self.StopIteration;
                        };
                    } else {
                        var i = -1;
                        this.next = function () {
                            i = (i + 1) % lst.length;
                            return lst[i];
                        }
                    }
                    return this.next();
                }
            }
        }
    },

    repeat: function (elem, /* optional */n) {
        /***

            repeat(elem, [,n]) --> elem, elem, elem, ... endlessly or up to n
                times

        ***/
        var m = MochiKit.Base;
        if (typeof(n) == 'undefined') {
            return {
                repr: function () {
                    return "repeat(" + m.repr(elem) + ")";
                },
                toString: m.forward("repr"),
                next: function () {
                    return elem;
                }
            };
        }
        return {
            repr: function () {
                return "repeat(" + m.repr(elem) + ", " + n + ")";
            },
            toString: m.forward("repr"),
            next: function () {
                if (n <= 0) {
                    throw MochiKit.Iter.StopIteration;
                }
                n -= 1;
                return elem;
            }
        };
    },

    next: function (iterator) {
        /***

            Return the next value from the iterator

        ***/
        return iterator.next();
    },

    izip: function (p, q/*, ...*/) {
        /***

            izip(p, q, ...) --> (p0, q0, ...), (p1, q1, ...), ...

        ***/
        var m = MochiKit.Base;
        var next = MochiKit.Iter.next;
        var iterables = m.map(iter, arguments);
        return {
            repr: function () { return "izip(...)"; },
            toString: m.forward("repr"),
            next: function () { return m.map(next, iterables); }
        };
    },

    ifilter: function (pred, seq) {
        /***

            ifilter(pred, seq) --> elements of seq where pred(elem) is true

        ***/
        var m = MochiKit.Base;
        seq = MochiKit.Iter.iter(seq);
        if (pred == null) {
            pred = m.operator.truth;
        }
        return {
            repr: function () { return "ifilter(...)"; },
            toString: m.forward("repr"),
            next: function () {
                while (true) {
                    var rval = seq.next();
                    if (pred(rval)) {
                        return rval;
                    }
                }
                // mozilla warnings aren't too bright
                return undefined;
            }
        }
    },

    ifilterfalse: function (pred, seq) {
        /***

            ifilterfalse(pred, seq) --> elements of seq where pred(elem) is
                false

        ***/
        var m = MochiKit.Base;
        seq = MochiKit.Iter.iter(seq);
        if (pred == null) {
            pred = m.operator.truth;
        }
        return {
            repr: function () { return "ifilterfalse(...)"; },
            toString: m.forward("repr"),
            next: function () {
                while (true) {
                    var rval = seq.next();
                    if (!pred(rval)) {
                        return rval;
                    }
                }
                // mozilla warnings aren't too bright
                return undefined;
            }
        }
    },

    islice: function (seq/*, [start,] stop[, step] */) {
        /***

            islice(seq, [start,] stop[, step])  --> elements from
                seq[start:stop:step] (in Python slice syntax)

        ***/
        var self = MochiKit.Iter;
        var m = MochiKit.Base;
        seq = self.iter(seq);
        var start = 0;
        var stop = 0;
        var step = 1;
        var i = -1;
        if (arguments.length == 2) {
            stop = arguments[1];
        } else if (arguments.length == 3) {
            start = arguments[1];
            stop = arguments[2];
        } else {
            start = arguments[1];
            stop = arguments[2];
            step = arguments[3];
        }
        return {
            repr: function () {
                return "islice(" + ["...", start, stop, step].join(", ") + ")";
            },
            toString: m.forward("repr"),
            next: function () {
                var rval;
                while (i < start) {
                    rval = seq.next();
                    i++;
                }
                if (start >= stop) {
                    throw self.StopIteration;
                }
                start += step;
                return rval;
            }
        };
    },

    imap: function (fun, p, q/*, ...*/) {
        /***

            imap(fun, p, q, ...) --> fun(p0, q0, ...), fun(p1, q1, ...), ...

        ***/
        var m = MochiKit.Base;
        var self = MochiKit.Iter;
        var iterables = m.map(self.iter, m.extend(null, arguments, 1));
        var map = m.map;
        var next = self.next;
        return {
            repr: function () { return "imap(...)"; },
            toString: m.forward("repr"),
            next: function () {
                return fun.apply(this, map(next, iterables));
            }
        };
    },

    applymap: function (fun, seq, self) {
        /***

            applymap(fun, seq) -->
                fun.apply(self, seq0), fun.apply(self, seq1), ...

        ***/
        seq = MochiKit.Iter.iter(seq);
        var m = MochiKit.Base;
        return {
            repr: function () { return "applymap(...)"; },
            toString: m.forward("repr"),
            next: function () {
                return fun.apply(self, seq.next());
            }
        };
    },

    chain: function (p, q/*, ...*/) {
        /***

            chain(p, q, ...) --> p0, p1, ... plast, q0, q1, ...

        ***/
        // dumb fast path
        var self = MochiKit.Iter;
        var m = MochiKit.Base;
        if (arguments.length == 1) {
            return self.iter(arguments[0]);
        }
        var argiter = m.map(self.iter, arguments);
        return {
            repr: function () { return "chain(...)"; },
            toString: m.forward("repr"),
            next: function () {
                while (argiter.length > 1) {
                    try {
                        return argiter[0].next();
                    } catch (e) {
                        if (e != self.StopIteration) {
                            throw e;
                        }
                        argiter.shift();
                    }
                }
                if (argiter.length == 1) {
                    // optimize last element
                    var arg = argiter.shift();
                    this.next = m.bind("next", arg);
                    return this.next();
                }
                throw self.StopIteration;
            }
        };
    },

    takewhile: function (pred, seq) {
        /***

            takewhile(pred, seq) --> seq[0], seq[1], ... until pred(seq[n])
                fails

        ***/
        var self = MochiKit.Iter;
        seq = self.iter(seq);
        return {
            repr: function () { return "takewhile(...)"; },
            toString: MochiKit.Base.forward("repr"),
            next: function () {
                var rval = seq.next();
                if (!pred(rval)) {
                    this.next = function () {
                        throw self.StopIteration;
                    };
                    this.next();
                }
                return rval;
            }
        };
    },

    dropwhile: function (pred, seq) {
        /***

            dropwhile(pred, seq) --> seq[n], seq[n + 1], starting when
                pred(seq[n]) fails

        ***/
        seq = MochiKit.Iter.iter(seq);
        var m = MochiKit.Base;
        var bind = m.bind;
        return {
            "repr": function () { return "dropwhile(...)"; },
            "toString": m.forward("repr"),
            "next": function () {
                while (true) {
                    var rval = seq.next();
                    if (!pred(rval)) {
                        break;
                    }
                }
                this.next = bind("next", seq);
                return rval;
            }
        };
    },

    _tee: function (ident, sync, iterable) {
        sync.pos[ident] = -1;
        var m = MochiKit.Base;
        var listMin = m.listMin;
        return {
            repr: function () { return "tee(" + ident + ", ...)"; },
            toString: m.forward("repr"),
            next: function () {
                var rval;
                var i = sync.pos[ident];

                if (i == sync.max) {
                    rval = iterable.next();
                    sync.deque.push(rval);
                    sync.max += 1;
                    sync.pos[ident] += 1;
                } else {
                    rval = sync.deque[i - sync.min];
                    sync.pos[ident] += 1;
                    if (i == sync.min && listMin(sync.pos) != sync.min) {
                        sync.min += 1;
                        sync.deque.shift();
                    }
                }
                return rval;
            }
        };
    },

    tee: function (iterable, n/* = 2 */) {
        /***

            tee(it, n=2) --> (it1, it2, it3, ... itn) splits one iterator
                into n

        ***/
        var rval = [];
        var sync = {
            "pos": [],
            "deque": [],
            "max": -1,
            "min": -1
        };
        if (arguments.length == 1) {
            n = 2;
        }
        var self = MochiKit.Iter;
        iterable = self.iter(iterable);
        var _tee = self._tee;
        for (var i = 0; i < n; i++) {
            rval.push(_tee(i, sync, iterable));
        }
        return rval;
    },

    list: function (iterable) {
        /***

            Convert an iterable to a new array

        ***/

        // Fast-path for Array and Array-like
        var m = MochiKit.Base;
        if (typeof(iterable.slice) == 'function') {
            return iterable.slice();
        } else if (m.isArrayLike(iterable)) {
            return m.concat(iterable);
        }

        var self = MochiKit.Iter;
        iterable = self.iter(iterable);
        var rval = [];
        try {
            while (true) {
                rval.push(iterable.next());
            }
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
            return rval;
        }
        // mozilla warnings aren't too bright
        return undefined;
    },


    reduce: function (fn, iterable, /* optional */initial) {
        /***

            Apply a fn = function (a, b) cumulatively to the items of an
            iterable from left to right, so as to reduce the iterable
            to a single value.

            For example::

                reduce(function (a, b) { return x + y; }, [1, 2, 3, 4, 5])

            calculates::

                ((((1 + 2) + 3) + 4) + 5).

            If initial is given, it is placed before the items of the sequence
            in the calculation, and serves as a default when the sequence is
            empty.

            Note that the above example could be written more clearly as::

                reduce(operator.add, [1, 2, 3, 4, 5])

            Or even simpler::

                sum([1, 2, 3, 4, 5])

        ***/
        var i = 0;
        var x = initial;
        var self = MochiKit.Iter;
        iterable = self.iter(iterable);
        if (arguments.length < 3) {
            try {
                x = iterable.next();
            } catch (e) {
                if (e == self.StopIteration) {
                    e = new TypeError("reduce() of empty sequence with no initial value");
                }
                throw e;
            }
            i++;
        }
        try {
            while (true) {
                x = fn(x, iterable.next());
            }
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
        }
        return x;
    },

    range: function (/* [start,] stop[, step] */) {
        /***

        Return an iterator containing an arithmetic progression of integers.
        range(i, j) returns iter([i, i + 1, i + 2, ..., j - 1]);
        start (!) defaults to 0.  When step is given, it specifies the
        increment (or decrement).  For example, range(4) returns
        iter([0, 1, 2, 3]).  The end point is omitted!  These are exactly the
        valid elements for an array of 4 elements.

        ***/
        var start = 0;
        var stop = 0;
        var step = 1;
        if (arguments.length == 1) {
            stop = arguments[0];
        } else if (arguments.length == 2) {
            start = arguments[0];
            stop = arguments[1];
        } else if (arguments.length == 3) {
            start = arguments[0];
            stop = arguments[1];
            step = arguments[2];
        } else {
            throw new TypeError("range() takes 1, 2, or 3 arguments!");
        }
        if (step == 0) {
            throw new TypeError("range() step must not be 0");
        }
        return {
            next: function () {
                if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
                    throw MochiKit.Iter.StopIteration;
                }
                var rval = start;
                start += step;
                return rval;
            },
            repr: function () {
                return "range(" + [start, stop, step].join(", ") + ")";
            },
            toString: MochiKit.Base.forward("repr")
        };
    },

    sum: function (iterable, start/* = 0 */) {
        /***

        Returns the sum of a sequence of numbers (NOT strings) plus the value
        of parameter 'start' (with a default of 0).  When the sequence is
        empty, returns start.

        Equivalent to::

            reduce(operator.add, iterable, start);

        ***/
        var x = start || 0;
        var self = MochiKit.Iter;
        iterable = self.iter(iterable);
        try {
            while (true) {
                x += iterable.next();
            }
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
        }
        return x;
    },

    exhaust: function (iterable) {
        /***

            Exhausts an iterable without saving the results anywhere,
            like list(iterable) when you don't care what the output is.

        ***/

        var self = MochiKit.Iter;
        iterable = self.iter(iterable);
        try {
            while (true) {
                iterable.next();
            }
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
        }
    },

    forEach: function (iterable, func, /* optional */self) {
        /***

            Call func for each item in iterable.

        ***/
        var m = MochiKit.Base;
        if (arguments.length > 2) {
            func = m.bind(func, self);
        }
        // fast path for array
        if (m.isArrayLike(iterable)) {
            try {
                for (var i = 0; i < iterable.length; i++) {
                    func(iterable[i]);
                }
            } catch (e) {
                if (e != MochiKit.Iter.StopIteration) {
                    throw e;
                }
            }
        } else {
            self = MochiKit.Iter;
            self.exhaust(self.imap(func, iterable));
        }
    },

    every: function (iterable, func) {
        /***

            Return true if func(item) is true for every item in iterable

        ***/
        var self = MochiKit.Iter;
        try {
            self.ifilterfalse(func, iterable).next();
            return false;
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
            return true;
        }
    },

    sorted: function (iterable, /* optional */cmp) {
        /***

            Return a sorted array from iterable

        ***/
        var rval = MochiKit.Iter.list(iterable);
        if (arguments.length == 1) {
            cmp = MochiKit.Base.compare;
        }
        rval.sort(cmp);
        return rval;
    },

    reversed: function (iterable) {
        /***

            Return a reversed array from iterable.

        ***/
        var rval = MochiKit.Iter.list(iterable);
        rval.reverse();
        return rval;
    },

    some: function (iterable, func) {
        /***

            Return true if func(item) is true for at least one item in iterable

        ***/
        var self = MochiKit.Iter;
        try {
            self.ifilter(func, iterable).next();
            return true;
        } catch (e) {
            if (e != self.StopIteration) {
                throw e;
            }
            return false;
        }
    },

    iextend: function (lst, iterable) {
        /***

            Just like list(iterable), except it pushes results on lst

        ***/

        if (MochiKit.Base.isArrayLike(iterable)) {
            // fast-path for array-like
            for (var i = 0; i < iterable.length; i++) {
                lst.push(iterable[i]);
            }
        } else {
            var self = MochiKit.Iter;
            iterable = self.iter(iterable);
            try {
                while (true) {
                    lst.push(iterable.next());
                }
            } catch (e) {
                if (e != self.StopIteration) {
                    throw e;
                }
            }
        }
        return lst;
    },

    groupby: function(iterable, /* optional */ keyfunc) {
        /***

            Like Python's itertools.groupby

        ***/
        var m = MochiKit.Base;
        var self = MochiKit.Iter;
        if (arguments.length < 2) {
            keyfunc = m.operator.identity;
        }
        iterable = self.iter(iterable);

        // shared
        var pk = undefined;
        var k = undefined;
        var v;

        function fetch() {
            v = iterable.next();
            k = keyfunc(v);
        };

        function eat() {
            var ret = v;
            v = undefined;
            return ret;
        };

        var first = true;
        return {
            repr: function () { return "groupby(...)"; },
            next: function() {
                // iterator-next

                // iterate until meet next group
                while (k == pk) {
                    fetch();
                    if (first) {
                        first = false;
                        break;
                    }
                }
                pk = k;
                return [k, {
                    next: function() {
                        // subiterator-next
                        if (v == undefined) { // Is there something to eat?
                            fetch();
                        }
                        if (k != pk) {
                            throw self.StopIteration;
                        }
                        return eat();
                    }
                }];
            }
        };
    },

    groupby_as_array: function (iterable, /* optional */ keyfunc) {
        /***

            Like groupby, but return array of [key, subarray of values]

        ***/
        var m = MochiKit.Base;
        var self = MochiKit.Iter;
        if (arguments.length < 2) {
            keyfunc = m.operator.identity;
        }

        iterable = self.iter(iterable);
        var result = [];
        var first = true;
        var prev_key;
        while (true) {
            try {
                var value = iterable.next();
                var key = keyfunc(value);
            } catch (e) {
                if (e == self.StopIteration) {
                    break;
                }
                throw e;
            }
            if (first || key != prev_key) {
                var values = [];
                result.push([key, values]);
            }
            values.push(value);
            first = false;
            prev_key = key;
        }
        return result;
    },

    arrayLikeIter: function (iterable) {
        var i = 0;
        return {
            repr: function () { return "arrayLikeIter(...)"; },
            toString: MochiKit.Base.forward("repr"),
            next: function () {
                if (i >= iterable.length) {
                    throw MochiKit.Iter.StopIteration;
                }
                return iterable[i++];
            }
        };
    },

    hasIterateNext: function (iterable) {
        return (iterable && typeof(iterable.iterateNext) == "function");
    },

    iterateNextIter: function (iterable) {
        return {
            repr: function () { return "iterateNextIter(...)"; },
            toString: MochiKit.Base.forward("repr"),
            next: function () {
                var rval = iterable.iterateNext();
                if (rval === null || rval === undefined) {
                    throw MochiKit.Iter.StopIteration;
                }
                return rval;
            }
        };
    }
});


MochiKit.Iter.EXPORT_OK = [
    "iteratorRegistry",
    "arrayLikeIter",
    "hasIterateNext",
    "iterateNextIter",
];

MochiKit.Iter.EXPORT = [
    "StopIteration",
    "registerIteratorFactory",
    "iter",
    "count",
    "cycle",
    "repeat",
    "next",
    "izip",
    "ifilter",
    "ifilterfalse",
    "islice",
    "imap",
    "applymap",
    "chain",
    "takewhile",
    "dropwhile",
    "tee",
    "list",
    "reduce",
    "range",
    "sum",
    "exhaust",
    "forEach",
    "every",
    "sorted",
    "reversed",
    "some",
    "iextend",
    "groupby",
    "groupby_as_array"
];

MochiKit.Iter.__new__ = function () {
    var m = MochiKit.Base;
    this.StopIteration = new m.NamedError("StopIteration");
    this.iteratorRegistry = new m.AdapterRegistry();
    // Register the iterator factory for arrays
    this.registerIteratorFactory(
        "arrayLike",
        m.isArrayLike,
        this.arrayLikeIter
    );

    this.registerIteratorFactory(
        "iterateNext",
        this.hasIterateNext,
        this.iterateNextIter
    );

    this.EXPORT_TAGS = {
        ":common": this.EXPORT,
        ":all": m.concat(this.EXPORT, this.EXPORT_OK)
    };

    m.nameFunctions(this);

};

MochiKit.Iter.__new__();

//
// XXX: Internet Explorer blows
//
reduce = MochiKit.Iter.reduce;

MochiKit.Base._exportSymbols(this, MochiKit.Iter);

/***

MochiKit.Logging 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/
if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Logging');
    dojo.require('MochiKit.Base');
}

if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Base", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Logging depends on MochiKit.Base!";
}

if (typeof(MochiKit.Logging) == 'undefined') {
    MochiKit.Logging = {};
}

MochiKit.Logging.NAME = "MochiKit.Logging";
MochiKit.Logging.VERSION = "1.3";
MochiKit.Logging.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};

MochiKit.Logging.toString = function () {
    return this.__repr__();
};


MochiKit.Logging.EXPORT = [
    "LogLevel",
    "LogMessage",
    "Logger",
    "alertListener",
    "logger",
    "log",
    "logError",
    "logDebug",
    "logFatal",
    "logWarning"
];


MochiKit.Logging.EXPORT_OK = [
    "logLevelAtLeast",
    "isLogMessage",
    "compareLogMessage"
];


MochiKit.Logging.LogMessage = function (num, level, info) {
    this.num = num;
    this.level = level;
    this.info = info;
    this.timestamp = new Date();
};

MochiKit.Logging.LogMessage.prototype = {
    repr: function () {
        var m = MochiKit.Base;
        return 'LogMessage(' +
            m.map(
                m.repr,
                [this.num, this.level, this.info]
            ).join(', ') + ')';
    },
    toString: MochiKit.Base.forward("repr")
};

MochiKit.Base.update(MochiKit.Logging, {
    logLevelAtLeast: function (minLevel) {
        /***

            Return a function that will match log messages whose level
            is at least minLevel

        ***/
        var self = MochiKit.Logging;
        if (typeof(minLevel) == 'string') {
            minLevel = self.LogLevel[minLevel];
        }
        return function (msg) {
            var msgLevel = msg.level;
            if (typeof(msgLevel) == 'string') {
                msgLevel = self.LogLevel[msgLevel];
            }
            return msgLevel >= minLevel;
        }
    },

    isLogMessage: function (/* ... */) {
        var LogMessage = MochiKit.Logging.LogMessage;
        for (var i = 0; i < arguments.length; i++) {
            if (!(arguments[i] instanceof LogMessage)) {
                return false;
            }
        }
        return true;
    },

    compareLogMessage: function (a, b) {
        return MochiKit.Base.compare([a.level, a.info], [b.level, b.info]);
    },

    alertListener: function (msg) {
        /***

        Ultra-obnoxious alert(...) listener

        ***/
        alert(
            "num: " + msg.num +
            "\nlevel: " +  msg.level +
            "\ninfo: " + msg.info.join(" ")
        );
    }

});

MochiKit.Logging.Logger = function (/* optional */maxSize) {
    /***

        A basic logger object that has a buffer of recent messages
        plus a listener dispatch mechanism for "real-time" logging
        of important messages

        maxSize is the maximum number of entries in the log.
        If maxSize >= 0, then the log will not buffer more than that
        many messages.

        There is a default logger available named "logger", and several
        of its methods are also global functions:

            logger.log      -> log
            logger.debug    -> logDebug
            logger.warning  -> logWarning
            logger.error    -> logError
            logger.fatal    -> logFatal

    ***/
    this.counter = 0;
    if (typeof(maxSize) == 'undefined' || maxSize == null) {
        maxSize = -1;
    }
    this.maxSize = maxSize;
    this._messages = [];
    this.listeners = {};
};

MochiKit.Logging.Logger.prototype = {
    clear: function () {
        /***

            Clear all messages from the message buffer.

        ***/
        this._messages.splice(0, this._messages.length);
    },

    dispatchListeners: function (msg) {
        /***

            Dispatch a log message to all listeners.

        ***/
        for (var k in this.listeners) {
            var pair = this.listeners[k];
            if (pair.ident != k || (pair[0] && !pair[0](msg))) {
                continue;
            }
            pair[1](msg);
        }
    },

    addListener: function (ident, filter, listener) {
        /***

            Add a listener for log messages.

            ident is a unique identifier that may be used to remove the listener
            later on.

            filter can be one of the following:
                null:
                    listener(msg) will be called for every log message
                    received.

                string:
                    logLevelAtLeast(filter) will be used as the function
                    (see below).

                function:
                    filter(msg) will be called for every msg, if it returns
                    true then listener(msg) will be called.

            listener is a function that takes one argument, a log message.  A log
            message has three properties:

                num:
                    A counter that uniquely identifies a log message (per-logger)

                level:
                    A string or number representing the log level.  If string, you
                    may want to use LogLevel[level] for comparison.

                info:
                    A list of objects passed as arguments to the log function.

        ***/


        if (typeof(filter) == 'string') {
            filter = MochiKit.Logging.logLevelAtLeast(filter);
        }
        var entry = [filter, listener];
        entry.ident = ident;
        this.listeners[ident] = entry;
    },

    removeListener: function (ident) {
        /***

            Remove a listener using the ident given to addListener

        ***/
        delete this.listeners[ident];
    },

    baseLog: function (level, message/*, ...*/) {
        /***

            The base functionality behind all of the log functions.
            The first argument is the log level as a string or number,
            and all other arguments are used as the info list.

            This function is available partially applied as:

                Logger.debug    'DEBUG'
                Logger.log      'INFO'
                Logger.error    'ERROR'
                Logger.fatal    'FATAL'
                Logger.warning  'WARNING'

            For the default logger, these are also available as global functions,
            see the Logger constructor documentation for more info.

        ***/

        var msg = new MochiKit.Logging.LogMessage(
            this.counter,
            level,
            MochiKit.Base.extend(null, arguments, 1)
        );
        this._messages.push(msg);
        this.dispatchListeners(msg);
        this.counter += 1;
        while (this.maxSize >= 0 && this._messages.length > this.maxSize) {
            this._messages.shift();
        }
    },

    getMessages: function (howMany) {
        /***

            Return a list of up to howMany messages from the message buffer.

        ***/
        var firstMsg = 0;
        if (!(typeof(howMany) == 'undefined' || howMany == null)) {
            firstMsg = Math.max(0, this._messages.length - howMany);
        }
        return this._messages.slice(firstMsg);
    },

    getMessageText: function (howMany) {
        /***

            Get a string representing up to the last howMany messages in the
            message buffer.  The default is 30.

            The message looks like this:

                LAST {messages.length} MESSAGES:
                  [{msg.num}] {msg.level}: {m.info.join(' ')}
                  [{msg.num}] {msg.level}: {m.info.join(' ')}
                  ...

            If you want some other format, use Logger.getMessages and do it
            yourself.

        ***/
        if (typeof(howMany) == 'undefined' || howMany == null) {
            howMany = 30;
        }
        var messages = this.getMessages(howMany);
        if (messages.length) {
            var lst = map(function (m) {
                return '\n  [' + m.num + '] ' + m.level + ': ' + m.info.join(' ');
            }, messages);
            lst.unshift('LAST ' + messages.length + ' MESSAGES:');
            return lst.join('');
        }
        return '';
    },

    debuggingBookmarklet: function (inline) {
        if (typeof(MochiKit.LoggingPane) == "undefined") {
            alert(this.getMessageText());
        } else {
            MochiKit.LoggingPane.createLoggingPane(inline || false);
        }
    }
};


MochiKit.Logging.__new__ = function () {
    this.LogLevel = {
        ERROR: 40,
        FATAL: 50,
        WARNING: 30,
        INFO: 20,
        DEBUG: 10
    };

    var m = MochiKit.Base;
    m.registerComparator("LogMessage",
        this.isLogMessage,
        this.compareLogMessage
    );

    var partial = m.partial;

    var Logger = this.Logger;
    var baseLog = Logger.prototype.baseLog;
    m.update(this.Logger.prototype, {
        debug: partial(baseLog, 'DEBUG'),
        log: partial(baseLog, 'INFO'),
        error: partial(baseLog, 'ERROR'),
        fatal: partial(baseLog, 'FATAL'),
        warning: partial(baseLog, 'WARNING')
    });

    // indirectly find logger so it can be replaced
    var self = this;
    var connectLog = function (name) {
        return function () {
            self.logger[name].apply(self.logger, arguments);
        }
    };

    this.log = connectLog('log');
    this.logError = connectLog('error');
    this.logDebug = connectLog('debug');
    this.logFatal = connectLog('fatal');
    this.logWarning = connectLog('warning');
    this.logger = new Logger();

    this.EXPORT_TAGS = {
        ":common": this.EXPORT,
        ":all": m.concat(this.EXPORT, this.EXPORT_OK)
    };

    m.nameFunctions(this);

};

MochiKit.Logging.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.Logging);

/***

MochiKit.DateTime 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.DateTime');
}

if (typeof(MochiKit) == 'undefined') {
    MochiKit = {};
}

if (typeof(MochiKit.DateTime) == 'undefined') {
    MochiKit.DateTime = {};
}

MochiKit.DateTime.NAME = "MochiKit.DateTime";
MochiKit.DateTime.VERSION = "1.3";
MochiKit.DateTime.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};
MochiKit.DateTime.toString = function () {
    return this.__repr__();
};

MochiKit.DateTime.isoDate = function (str) {
    /***

        Convert an ISO 8601 date (YYYY-MM-DD) to a Date object.

    ***/
    str = str + "";
    if (typeof(str) != "string" || str.length == 0) {
        return null;
    }
    var iso = str.split('-');
    if (iso.length == 0) {
        return null;
    }
    return new Date(iso[0], iso[1] - 1, iso[2]);
};

MochiKit.DateTime._isoRegexp = /(\d{4,})(?:-(\d{1,2})(?:-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?(?:(Z)|([+-])(\d{1,2})(?::(\d{1,2}))?)?)?)?)?/;

MochiKit.DateTime.isoTimestamp = function (str) {
    /***

        Convert an ISO 8601 timestamp (or something close to it) to
        a Date object.  Will accept the "de facto" form:

            YYYY-MM-DD hh:mm:ss

        or (the proper form):

            YYYY-MM-DDThh:mm:ss

    ***/
    str = str + "";
    if (typeof(str) != "string" || str.length == 0) {
        return null;
    }
    var res = str.match(MochiKit.DateTime._isoRegexp);
    if (typeof(res) == "undefined" || res == null) {
        return null;
    }
    var year, month, day, hour, min, sec, msec;
    year = parseInt(res[1], 10);
    if (typeof(res[2]) == "undefined" || res[2] == "") {
        return new Date(year);
    }
    month = parseInt(res[2], 10) - 1;
    day = parseInt(res[3], 10);
    if (typeof(res[4]) == "undefined" || res[4] == "") {
        return new Date(year, month, day);
    }
    hour = parseInt(res[4], 10);
    min = parseInt(res[5], 10);
    sec = (typeof(res[6]) != "undefined" && res[6] != "") ? parseInt(res[6], 10) : 0;
    if (typeof(res[7]) != "undefined" && res[7] != "") {
        msec = Math.round(1000.0 * parseFloat("0." + res[7]));
    } else {
        msec = 0;
    }
    if ((typeof(res[8]) == "undefined" || res[8] == "") && (typeof(res[9]) == "undefined" || res[9] == "")) {
        return new Date(year, month, day, hour, min, sec, msec);
    }
    var ofs;
    if (typeof(res[9]) != "undefined" && res[9] != "") {
        ofs = parseInt(res[10], 10) * 3600000;
        if (typeof(res[11]) != "undefined" && res[11] != "") {
            ofs += parseInt(res[11], 10) * 60000;
        }
        if (res[9] == "-") {
            ofs = -ofs;
        }
    } else {
        ofs = 0;
    }
    return new Date(Date.UTC(year, month, day, hour, min, sec, msec) - ofs);
};

MochiKit.DateTime.toISOTime = function (date, realISO/* = false */) {
    /***

        Get the hh:mm:ss from the given Date object.

    ***/
    if (typeof(date) == "undefined" || date == null) {
        return null;
    }
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var lst = [
        ((realISO && (hh < 10)) ? "0" + hh : hh),
        ((mm < 10) ? "0" + mm : mm),
        ((ss < 10) ? "0" + ss : ss)
    ];
    return lst.join(":");
};

MochiKit.DateTime.toISOTimestamp = function (date, realISO/* = false*/) {
    /***

        Convert a Date object to something that's ALMOST but not quite an
        ISO 8601 timestamp.  If it was a proper ISO timestamp it would be:

            YYYY-MM-DDThh:mm:ssZ

        However, we see junk in SQL and other places that looks like this:

            YYYY-MM-DD hh:mm:ss

        So, this function returns the latter form, despite its name, unless
        you pass true for realISO.

    ***/
    if (typeof(date) == "undefined" || date == null) {
        return null;
    }
    var sep = realISO ? "T" : " ";
    var foot = realISO ? "Z" : "";
    if (realISO) {
        date = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    }
    return MochiKit.DateTime.toISODate(date) + sep + MochiKit.DateTime.toISOTime(date, realISO) + foot;
};

MochiKit.DateTime.toISODate = function (date) {
    /***

        Convert a Date object to an ISO 8601 date string (YYYY-MM-DD)

    ***/
    if (typeof(date) == "undefined" || date == null) {
        return null;
    }
    var _padTwo = MochiKit.DateTime._padTwo;
    return [
        date.getFullYear(),
        _padTwo(date.getMonth() + 1),
        _padTwo(date.getDate())
    ].join("-");
};

MochiKit.DateTime.americanDate = function (d) {
    /***

        Converts a MM/DD/YYYY date to a Date object

    ***/
    d = d + "";
    if (typeof(d) != "string" || d.length == 0) {
        return null;
    }
    var a = d.split('/');
    return new Date(a[2], a[0] - 1, a[1]);
};

MochiKit.DateTime._padTwo = function (n) {
    return (n > 9) ? n : "0" + n;
};

MochiKit.DateTime.toPaddedAmericanDate = function (d) {
    /***

        Converts a Date object to an MM/DD/YYYY date, e.g. 01/01/2001

    ***/
    if (typeof(d) == "undefined" || d == null) {
        return null;
    }
    var _padTwo = MochiKit.DateTime._padTwo;
    return [
        _padTwo(d.getMonth() + 1),
        _padTwo(d.getDate()),
        d.getFullYear()
    ].join('/');
};

MochiKit.DateTime.toAmericanDate = function (d) {
    /***

        Converts a Date object to an M/D/YYYY date, e.g. 1/1/2001

    ***/
    if (typeof(d) == "undefined" || d == null) {
        return null;
    }
    return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/');
};

MochiKit.DateTime.EXPORT = [
    "isoDate",
    "isoTimestamp",
    "toISOTime",
    "toISOTimestamp",
    "toISODate",
    "americanDate",
    "toPaddedAmericanDate",
    "toAmericanDate"
];

MochiKit.DateTime.EXPORT_OK = [];
MochiKit.DateTime.EXPORT_TAGS = {
    ":common": MochiKit.DateTime.EXPORT,
    ":all": MochiKit.DateTime.EXPORT
};

MochiKit.DateTime.__new__ = function () {
    // MochiKit.Base.nameFunctions(this);
    var base = this.NAME + ".";
    for (var k in this) {
        var o = this[k];
        if (typeof(o) == 'function' && typeof(o.NAME) == 'undefined') {
            try {
                o.NAME = base + k;
            } catch (e) {
                // pass
            }
        }
    }
};

MochiKit.DateTime.__new__();

if (typeof(MochiKit.Base) != "undefined") {
    MochiKit.Base._exportSymbols(this, MochiKit.DateTime);
} else {
    (function (globals, module) {
        if ((typeof(JSAN) == 'undefined' && typeof(dojo) == 'undefined')
            || (typeof(MochiKit.__compat__) == 'boolean' && MochiKit.__compat__)) {
            var all = module.EXPORT_TAGS[":all"];
            for (var i = 0; i < all.length; i++) {
                globals[all[i]] = module[all[i]];
            }
        }
    })(this, MochiKit.DateTime);
}

/***

MochiKit.Format 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Format');
}

if (typeof(MochiKit) == 'undefined') {
    MochiKit = {};
}

if (typeof(MochiKit.Format) == 'undefined') {
    MochiKit.Format = {};
}

MochiKit.Format.NAME = "MochiKit.Format";
MochiKit.Format.VERSION = "1.3";
MochiKit.Format.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};
MochiKit.Format.toString = function () {
    return this.__repr__();
};

MochiKit.Format._numberFormatter = function (placeholder, header, footer, locale, isPercent, precision, leadingZeros, separatorAt, trailingZeros) {
    return function (num) {
        num = parseFloat(num);
        if (typeof(num) == "undefined" || num == null || isNaN(num)) {
            return placeholder;
        }
        var curheader = header;
        var curfooter = footer;
        if (num < 0) {
            num = -num;
        } else {
            curheader = curheader.replace(/-/, "");
        }
        var me = arguments.callee;
        var fmt = MochiKit.Format.formatLocale(locale);
        if (isPercent) {
            num = num * 100.0;
            curfooter = fmt.percent + curfooter;
        }
        num = MochiKit.Format.roundToFixed(num, precision);
        var parts = num.split(/\./);
        var whole = parts[0];
        var frac = (parts.length == 1) ? "" : parts[1];
        var res = "";
        while (whole.length < leadingZeros) {
            whole = "0" + whole;
        }
        if (separatorAt) {
            while (whole.length > separatorAt) {
                var i = whole.length - separatorAt;
                //res = res + fmt.separator + whole.substring(i, whole.length);
                res = fmt.separator + whole.substring(i, whole.length) + res;
                whole = whole.substring(0, i);
            }
        }
        res = whole + res;
        if (precision > 0) {
            while (frac.length < trailingZeros) {
                frac = frac + "0";
            }
            res = res + fmt.decimal + frac;
        }
        return curheader + res + curfooter;
    };
};

MochiKit.Format.numberFormatter = function (pattern, placeholder/* = "" */, locale/* = "default" */) {
    // http://java.sun.com/docs/books/tutorial/i18n/format/numberpattern.html
    // | 0 | leading or trailing zeros
    // | # | just the number
    // | , | separator
    // | . | decimal separator
    // | % | Multiply by 100 and format as percent
    if (typeof(placeholder) == "undefined") {
        placeholder = "";
    }
    var match = pattern.match(/((?:[0#]+,)?[0#]+)(?:\.([0#]+))?(%)?/);
    if (!match) {
        throw TypeError("Invalid pattern");
    }
    var header = pattern.substr(0, match.index);
    var footer = pattern.substr(match.index + match[0].length);
    if (header.search(/-/) == -1) {
        header = header + "-";
    }
    var whole = match[1];
    var frac = (typeof(match[2]) == "string" && match[2] != "") ? match[2] : "";
    var isPercent = (typeof(match[3]) == "string" && match[3] != "");
    var tmp = whole.split(/,/);
    var separatorAt;
    if (typeof(locale) == "undefined") {
        locale = "default";
    }
    if (tmp.length == 1) {
        separatorAt = null;
    } else {
        separatorAt = tmp[1].length;
    }
    var leadingZeros = whole.length - whole.replace(/0/g, "").length;
    var trailingZeros = frac.length - frac.replace(/0/g, "").length;
    var precision = frac.length;
    var rval = MochiKit.Format._numberFormatter(
        placeholder, header, footer, locale, isPercent, precision,
        leadingZeros, separatorAt, trailingZeros
    );
    var m = MochiKit.Base;
    if (m) {
        var fn = arguments.callee;
        var args = m.concat(arguments);
        rval.repr = function () {
            return [
                self.NAME,
                "(",
                map(m.repr, args).join(", "),
                ")"
            ].join("");
        }
    }
    return rval;
};

MochiKit.Format.formatLocale = function (locale) {
    if (typeof(locale) == "undefined" || locale == null) {
        locale = "default";
    }
    if (typeof(locale) == "string") {
        var rval = MochiKit.Format.LOCALE[locale];
        if (typeof(rval) == "string") {
            rval = arguments.callee(rval);
            MochiKit.Format.LOCALE[locale] = rval;
        }
        return rval;
    } else {
        return locale;
    }
};

MochiKit.Format.twoDigitAverage = function (numerator, denominator) {
    /***

        Calculate an average from a numerator and a denominator and return
        it as a string with two digits of precision (e.g. "1.23").

        If the denominator is 0, "0" will be returned instead of NaN.

    ***/
    if (denominator) {
        var res = numerator / denominator;
        if (!isNaN(res)) {
            return MochiKit.Format.twoDigitFloat(numerator / denominator);
        }
    }
    return "0";
};

MochiKit.Format.twoDigitFloat = function (someFloat) {
    /***

        Roughly equivalent to: sprintf("%.2f", someFloat)

    ***/
    var sign = (someFloat < 0 ? '-' : '');
    var s = Math.floor(Math.abs(someFloat) * 100).toString();
    if (s == '0') {
        return s;
    }
    if (s.length < 3) {
        while (s.charAt(s.length - 1) == '0') {
            s = s.substring(0, s.length - 1);
        }
        return sign + '0.' + s;
    }
    var head = sign + s.substring(0, s.length - 2);
    var tail = s.substring(s.length - 2, s.length);
    if (tail == '00') {
        return head;
    } else if (tail.charAt(1) == '0') {
        return head + '.' + tail.charAt(0);
    } else {
        return head + '.' + tail;
    }
};

MochiKit.Format.lstrip = function (str, /* optional */chars) {
    str = str + "";
    if (typeof(str) != "string") {
        return null;
    }
    if (!chars) {
        return str.replace(/^\s+/, "");
    } else {
        return str.replace(new RegExp("^[" + chars + "]+"), "");
    }
};

MochiKit.Format.rstrip = function (str, /* optional */chars) {
    str = str + "";
    if (typeof(str) != "string") {
        return null;
    }
    if (!chars) {
        return str.replace(/\s+$/, "");
    } else {
        return str.replace(new RegExp("[" + chars + "]+$"), "");
    }
};

MochiKit.Format.strip = function (str, /* optional */chars) {
    var self = MochiKit.Format;
    return self.rstrip(self.lstrip(str, chars), chars);
};

MochiKit.Format.truncToFixed = function (aNumber, precision) {
    aNumber = Math.floor(aNumber * Math.pow(10, precision));
    var res = (aNumber * Math.pow(10, -precision)).toFixed(precision);
    if (res.charAt(0) == ".") {
        res = "0" + res;
    }
    return res;
};

MochiKit.Format.roundToFixed = function (aNumber, precision) {
    return MochiKit.Format.truncToFixed(
        aNumber + 0.5 * Math.pow(10, -precision),
        precision
    );
};

MochiKit.Format.percentFormat = function (someFloat) {
    /***

        Roughly equivalent to: sprintf("%.2f%%", someFloat * 100)

    ***/
    return MochiKit.Format.twoDigitFloat(100 * someFloat) + '%';
};

MochiKit.Format.EXPORT = [
    "truncToFixed",
    "roundToFixed",
    "numberFormatter",
    "formatLocale",
    "twoDigitAverage",
    "twoDigitFloat",
    "percentFormat",
    "lstrip",
    "rstrip",
    "strip"
];

MochiKit.Format.LOCALE = {
    en_US: {separator: ",", decimal: ".", percent: "%"},
    de_DE: {separator: ".", decimal: ",", percent: "%"},
    fr_FR: {separator: " ", decimal: ",", percent: "%"},
    "default": "en_US"
};

MochiKit.Format.EXPORT_OK = [];
MochiKit.Format.EXPORT_TAGS = {
    ':all': MochiKit.Format.EXPORT,
    ':common': MochiKit.Format.EXPORT
};

MochiKit.Format.__new__ = function () {
    // MochiKit.Base.nameFunctions(this);
    var base = this.NAME + ".";
    var k, v, o;
    for (k in this.LOCALE) {
        o = this.LOCALE[k];
        if (typeof(o) == "object") {
            o.repr = function () { return this.NAME; };
            o.NAME = base + "LOCALE." + k;
        }
    }
    for (k in this) {
        o = this[k];
        if (typeof(o) == 'function' && typeof(o.NAME) == 'undefined') {
            try {
                o.NAME = base + k;
            } catch (e) {
                // pass
            }
        }
    }
};

MochiKit.Format.__new__();

if (typeof(MochiKit.Base) != "undefined") {
    MochiKit.Base._exportSymbols(this, MochiKit.Format);
} else {
    (function (globals, module) {
        if ((typeof(JSAN) == 'undefined' && typeof(dojo) == 'undefined')
            || (typeof(MochiKit.__compat__) == 'boolean' && MochiKit.__compat__)) {
            var all = module.EXPORT_TAGS[":all"];
            for (var i = 0; i < all.length; i++) {
                globals[all[i]] = module[all[i]];
            }
        }
    })(this, MochiKit.Format);
}

/***

MochiKit.Async 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide("MochiKit.Async");
    dojo.require("MochiKit.Base");
}
if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Base", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Async depends on MochiKit.Base!";
}

if (typeof(MochiKit.Async) == 'undefined') {
    MochiKit.Async = {};
}

MochiKit.Async.NAME = "MochiKit.Async";
MochiKit.Async.VERSION = "1.3";
MochiKit.Async.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};
MochiKit.Async.toString = function () {
    return this.__repr__();
};

MochiKit.Async.Deferred = function (/* optional */ canceller) {
    /***

    Encapsulates a sequence of callbacks in response to a value that
    may not yet be available.  This is modeled after the Deferred class
    from Twisted <http://twistedmatrix.com>.

    Why do we want this?  JavaScript has no threads, and even if it did,
    threads are hard.  Deferreds are a way of abstracting non-blocking
    events, such as the final response to an XMLHttpRequest.

    The sequence of callbacks is internally represented as a list
    of 2-tuples containing the callback/errback pair.  For example,
    the following call sequence::

        var d = new Deferred();
        d.addCallback(myCallback);
        d.addErrback(myErrback);
        d.addBoth(myBoth);
        d.addCallbacks(myCallback, myErrback);

    is translated into a Deferred with the following internal
    representation::

        [
            [myCallback, null],
            [null, myErrback],
            [myBoth, myBoth],
            [myCallback, myErrback]
        ]

    The Deferred also keeps track of its current status (fired).
    Its status may be one of three things:

        -1: no value yet (initial condition)
         0: success
         1: error

    A Deferred will be in the error state if one of the following
    three conditions are met:

    1. The result given to callback or errback is "instanceof" Error
    2. The previous callback or errback raised an exception while executing
    3. The previous callback or errback returned a value "instanceof" Error

    Otherwise, the Deferred will be in the success state.  The state of the
    Deferred determines the next element in the callback sequence to run.

    When a callback or errback occurs with the example deferred chain, something
    equivalent to the following will happen (imagine that exceptions are caught
    and returned)::

        // d.callback(result) or d.errback(result)
        if (!(result instanceof Error)) {
            result = myCallback(result);
        }
        if (result instanceof Error) {
            result = myErrback(result);
        }
        result = myBoth(result);
        if (result instanceof Error) {
            result = myErrback(result);
        } else {
            result = myCallback(result);
        }

    The result is then stored away in case another step is added to the
    callback sequence.  Since the Deferred already has a value available,
    any new callbacks added will be called immediately.

    There are two other "advanced" details about this implementation that are
    useful:

    Callbacks are allowed to return Deferred instances themselves, so
    you can build complicated sequences of events with ease.

    The creator of the Deferred may specify a canceller.  The canceller
    is a function that will be called if Deferred.cancel is called before
    the Deferred fires.  You can use this to implement clean aborting of an
    XMLHttpRequest, etc.  Note that cancel will fire the deferred with a
    CancelledError (unless your canceller returns another kind of error),
    so the errbacks should be prepared to handle that error for cancellable
    Deferreds.

    ***/


    this.chain = [];
    this.id = this._nextId();
    this.fired = -1;
    this.paused = 0;
    this.results = [null, null];
    this.canceller = canceller;
    this.silentlyCancelled = false;
};

MochiKit.Async.Deferred.prototype = {
    repr: function () {
        var state;
        if (this.fired == -1) {
            state = 'unfired';
        } else if (this.fired == 0) {
            state = 'success';
        } else {
            state = 'error';
        }
        return 'Deferred(' + this.id + ', ' + state + ')';
    },

    toString: MochiKit.Base.forward("repr"),

    _nextId: MochiKit.Base.counter(),

    cancel: function () {
        /***

        Cancels a Deferred that has not yet received a value,
        or is waiting on another Deferred as its value.

        If a canceller is defined, the canceller is called.
        If the canceller did not return an error, or there
        was no canceller, then the errback chain is started
        with CancelledError.

        ***/
        var self = MochiKit.Async;
        if (this.fired == -1) {
            if (this.canceller) {
                this.canceller(this);
            } else {
                this.silentlyCancelled = true;
            }
            if (this.fired == -1) {
                this.errback(new self.CancelledError(this));
            }
        } else if ((this.fired == 0) && (this.results[0] instanceof self.Deferred)) {
            this.results[0].cancel();
        }
    },


    _pause: function () {
        /***

        Used internally to signal that it's waiting on another Deferred

        ***/
        this.paused++;
    },

    _unpause: function () {
        /***

        Used internally to signal that it's no longer waiting on another
        Deferred.

        ***/
        this.paused--;
        if ((this.paused == 0) && (this.fired >= 0)) {
            this._fire();
        }
    },

    _continue: function (res) {
        /***

        Used internally when a dependent deferred fires.

        ***/
        this._resback(res);
        this._unpause();
    },

    _resback: function (res) {
        /***

        The primitive that means either callback or errback

        ***/
        this.fired = ((res instanceof Error) ? 1 : 0);
        this.results[this.fired] = res;
        this._fire();
    },

    _check: function () {
        if (this.fired != -1) {
            if (!this.silentlyCancelled) {
                throw new MochiKit.Async.AlreadyCalledError(this);
            }
            this.silentlyCancelled = false;
            return;
        }
    },

    callback: function (res) {
        /***

        Begin the callback sequence with a non-error value.

        callback or errback should only be called once
        on a given Deferred.

        ***/
        this._check();
        this._resback(res);
    },

    errback: function (res) {
        /***

        Begin the callback sequence with an error result.

        callback or errback should only be called once
        on a given Deferred.

        ***/
        this._check();
        if (!(res instanceof Error)) {
            res = new MochiKit.Async.GenericError(res);
        }
        this._resback(res);
    },

    addBoth: function (fn) {
        /***

        Add the same function as both a callback and an errback as the
        next element on the callback sequence.  This is useful for code
        that you want to guarantee to run, e.g. a finalizer.

        ***/
        if (arguments.length > 1) {
            fn = MochiKit.Base.partial.apply(null, arguments);
        }
        return this.addCallbacks(fn, fn);
    },

    addCallback: function (fn) {
        /***

        Add a single callback to the end of the callback sequence.

        ***/
        if (arguments.length > 1) {
            fn = MochiKit.Base.partial.apply(null, arguments);
        }
        return this.addCallbacks(fn, null);
    },

    addErrback: function (fn) {
        /***

        Add a single errback to the end of the callback sequence.

        ***/
        if (arguments.length > 1) {
            fn = MochiKit.Base.partial.apply(null, arguments);
        }
        return this.addCallbacks(null, fn);
    },

    addCallbacks: function (cb, eb) {
        /***

        Add separate callback and errback to the end of the callback
        sequence.

        ***/
        this.chain.push([cb, eb])
        if (this.fired >= 0) {
            this._fire();
        }
        return this;
    },

    _fire: function () {
        /***

        Used internally to exhaust the callback sequence when a result
        is available.

        ***/
        var chain = this.chain;
        var fired = this.fired;
        var res = this.results[fired];
        var self = this;
        var cb = null;
        while (chain.length > 0 && this.paused == 0) {
            // Array
            var pair = chain.shift();
            var f = pair[fired];
            if (f == null) {
                continue;
            }
            try {
                res = f(res);
                fired = ((res instanceof Error) ? 1 : 0);
                if (res instanceof MochiKit.Async.Deferred) {
                    cb = function (res) {
                        self._continue(res);
                    }
                    this._pause();
                }
            } catch (err) {
                fired = 1;
                if (!(err instanceof Error)) {
                    err = new MochiKit.Async.GenericError(err);
                }
                res = err;
            }
        }
        this.fired = fired;
        this.results[fired] = res;
        if (cb && this.paused) {
            // this is for "tail recursion" in case the dependent deferred
            // is already fired
            res.addBoth(cb);
        }
    }
};

MochiKit.Base.update(MochiKit.Async, {
    evalJSONRequest: function (/* req */) {
        /***

        Evaluate a JSON (JavaScript Object Notation) XMLHttpRequest

        @param req: The request whose responseText is to be evaluated

        @rtype: L{Object}

        ***/
        return eval('(' + arguments[0].responseText + ')');
    },

    succeed: function (/* optional */result) {
        /***

        Return a Deferred that has already had '.callback(result)' called.

        This is useful when you're writing synchronous code to an asynchronous
        interface: i.e., some code is calling you expecting a Deferred result,
        but you don't actually need to do anything asynchronous.  Just return
        succeed(theResult).

        See L{fail} for a version of this function that uses a failing Deferred
        rather than a successful one.

        @param result: The result to give to the Deferred's 'callback' method.

        @rtype: L{Deferred}

        ***/
        var d = new MochiKit.Async.Deferred();
        d.callback.apply(d, arguments);
        return d;
    },

    fail: function (/* optional */result) {
        /***

        Return a Deferred that has already had '.errback(result)' called.

        See L{succeed}'s docstring for rationale.

        @param result: The same argument that L{Deferred.errback} takes.

        @rtype: L{Deferred}

        ***/
        var d = new MochiKit.Async.Deferred();
        d.errback.apply(d, arguments);
        return d;
    },

    getXMLHttpRequest: function () {
        var self = arguments.callee;
        if (!self.XMLHttpRequest) {
            var tryThese = [
                function () { return new XMLHttpRequest(); },
                function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
                function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
                function () { return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
                function () {
                    throw new MochiKit.Async.BrowserComplianceError("Browser does not support XMLHttpRequest");
                }
            ];
            for (var i = 0; i < tryThese.length; i++) {
                var func = tryThese[i];
                try {
                    self.XMLHttpRequest = func;
                    return func();
                } catch (e) {
                    // pass
                }
            }
        }
        return self.XMLHttpRequest();
    },

    sendXMLHttpRequest: function (req, /* optional */ sendContent) {
        if (typeof(sendContent) == 'undefined') {
            sendContent = "";
        }

        var canceller = function () {
            // IE SUCKS
            try {
                req.onreadystatechange = null;
            } catch (e) {
                try {
                    req.onreadystatechange = function () {};
                } catch (e) {
                }
            }
            req.abort();
        };

        var self = MochiKit.Async;
        var d = new self.Deferred(canceller);

        var onreadystatechange = function () {
            // MochiKit.Logging.logDebug('req.readyState', req.readyState);
            if (req.readyState == 4) {
                // IE SUCKS
                try {
                    req.onreadystatechange = null;
                } catch (e) {
                    try {
                        req.onreadystatechange = function () {};
                    } catch (e) {
                    }
                }
                var status = null;
                try {
                    status = req.status;
                    if (!status && MochiKit.Base.isNotEmpty(req.responseText)) {
                        // 0 or undefined seems to mean cached or local
                        status = 304;
                    }
                } catch (e) {
                    // pass
                    // MochiKit.Logging.logDebug('error getting status?', repr(items(e)));
                }
                //  200 is OK, 304 is NOT_MODIFIED
                if (status == 200 || status == 304) { // OK
                    d.callback(req);
                } else {
                    var err = new self.XMLHttpRequestError(req, "Request failed:" + status);
                    if (err.number) {
                        // XXX: This seems to happen on page change
                        d.errback(err);
                    } else {
                        // XXX: this seems to happen when the server is unreachable
                        d.errback(err);
                    }
                }
            }
        }
        try {
            req.onreadystatechange = onreadystatechange;
            req.send(sendContent);
        } catch (e) {
            try {
                req.onreadystatechange = null;
            } catch (ignore) {
                // pass
            }
            d.errback(e);
        }

        return d;

    },

    doSimpleXMLHttpRequest: function (url/*, ...*/) {
        var self = MochiKit.Async;
        var req = self.getXMLHttpRequest();
        if (arguments.length > 1) {
            var m = MochiKit.Base;
            var qs = m.queryString.apply(null, m.extend(null, arguments, 1));
            if (qs) {
                url += "?" + qs;
            }
        }
        req.open("GET", url, true);
        return self.sendXMLHttpRequest(req);
    },

    loadJSONDoc: function (url) {
        /***

        Do a simple XMLHttpRequest to a URL and get the response
        as a JSON document.

        @param url: The URL to GET

        @rtype: L{Deferred} returning the evaluated JSON response

        ***/

        var self = MochiKit.Async;
        var d = self.doSimpleXMLHttpRequest.apply(self, arguments);
        d = d.addCallback(self.evalJSONRequest);
        return d;
    },

    wait: function (seconds, /* optional */value) {
        var d = new MochiKit.Async.Deferred();
        var m = MochiKit.Base;
        if (typeof(value) != 'undefined') {
            d.addCallback(function () { return value; });
        }
        var timeout = setTimeout(
            m.bind("callback", d),
            Math.floor(seconds * 1000));
        d.canceller = function () {
            try {
                clearTimeout(timeout);
            } catch (e) {
                // pass
            }
        };
        return d;
    },

    callLater: function (seconds, func) {
        var m = MochiKit.Base;
        var pfunc = m.partial.apply(m, m.extend(null, arguments, 1));
        return MochiKit.Async.wait(seconds).addCallback(
            function (res) { return pfunc(); }
        );
    }
});


MochiKit.Async.DeferredLock = function () {
    this.waiting = [];
    this.locked = false;
    this.id = this._nextId();
};

MochiKit.Async.DeferredLock.prototype = {
    __class__: MochiKit.Async.DeferredLock,
    acquire: function () {
        d = new MochiKit.Async.Deferred();
        if (this.locked) {
            this.waiting.push(d);
        } else {
            this.locked = true;
            d.callback(this);
        }
        return d;
    },
    release: function () {
        if (!this.locked) {
            throw TypeError("Tried to release an unlocked DeferredLock");
        }
        this.locked = false;
        if (this.waiting.length > 0) {
            this.locked = true;
            this.waiting.shift().callback(this);
        }
    },
    _nextId: MochiKit.Base.counter(),
    repr: function () {
        var state;
        if (this.locked) {
            state = 'locked, ' + this.waiting.length + ' waiting'
        } else {
            state = 'unlocked';
        }
        return 'DeferredLock(' + this.id + ', ' + state + ')';
    },
    toString: MochiKit.Base.forward("repr")

};


MochiKit.Async.EXPORT = [
    "AlreadyCalledError",
    "CancelledError",
    "BrowserComplianceError",
    "GenericError",
    "XMLHttpRequestError",
    "Deferred",
    "succeed",
    "fail",
    "getXMLHttpRequest",
    "doSimpleXMLHttpRequest",
    "loadJSONDoc",
    "wait",
    "callLater",
    "sendXMLHttpRequest",
    "DeferredLock"
];

MochiKit.Async.EXPORT_OK = [
    "evalJSONRequest"
];

MochiKit.Async.__new__ = function () {
    var m = MochiKit.Base;
    var ne = m.partial(m._newNamedError, this);
    ne("AlreadyCalledError",
        function (deferred) {
            /***

            Raised by the Deferred if callback or errback happens
            after it was already fired.

            ***/
            this.deferred = deferred;
        }
    );

    ne("CancelledError",
        function (deferred) {
            /***

            Raised by the Deferred cancellation mechanism.

            ***/
            this.deferred = deferred;
        }
    );

    ne("BrowserComplianceError",
        function (msg) {
            /***

            Raised when the JavaScript runtime is not capable of performing
            the given function.  Technically, this should really never be
            raised because a non-conforming JavaScript runtime probably
            isn't going to support exceptions in the first place.

            ***/
            this.message = msg;
        }
    );

    ne("GenericError",
        function (msg) {
            this.message = msg;
        }
    );

    ne("XMLHttpRequestError",
        function (req, msg) {
            /***

            Raised when an XMLHttpRequest does not complete for any reason.

            ***/
            this.req = req;
            this.message = msg;
            try {
                // Strange but true that this can raise in some cases.
                this.number = req.status;
            } catch (e) {
                // pass
            }
        }
    );


    this.EXPORT_TAGS = {
        ":common": this.EXPORT,
        ":all": m.concat(this.EXPORT, this.EXPORT_OK)
    };

    m.nameFunctions(this);

};

MochiKit.Async.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.Async);

/***

MochiKit.DOM 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide("MochiKit.DOM");
    dojo.require("MochiKit.Iter");
}
if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Iter", []);
}

try {
    if (typeof(MochiKit.Iter) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.DOM depends on MochiKit.Iter!";
}

if (typeof(MochiKit.DOM) == 'undefined') {
    MochiKit.DOM = {};
}

MochiKit.DOM.NAME = "MochiKit.DOM";
MochiKit.DOM.VERSION = "1.3";
MochiKit.DOM.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};
MochiKit.DOM.toString = function () {
    return this.__repr__();
};

MochiKit.DOM.EXPORT = [
    "formContents",
    "currentWindow",
    "currentDocument",
    "withWindow",
    "withDocument",
    "registerDOMConverter",
    "coerceToDOM",
    "createDOM",
    "createDOMFunc",
    "getNodeAttribute",
    "setNodeAttribute",
    "updateNodeAttributes",
    "appendChildNodes",
    "replaceChildNodes",
    "removeElement",
    "swapDOM",
    "BUTTON",
    "TT",
    "PRE",
    "H1",
    "H2",
    "H3",
    "BR",
    "CANVAS",
    "HR",
    "LABEL",
    "TEXTAREA",
    "FORM",
    "STRONG",
    "SELECT",
    "OPTION",
    "OPTGROUP",
    "LEGEND",
    "FIELDSET",
    "P",
    "UL",
    "OL",
    "LI",
    "TD",
    "TR",
    "THEAD",
    "TBODY",
    "TFOOT",
    "TABLE",
    "TH",
    "INPUT",
    "SPAN",
    "A",
    "DIV",
    "IMG",
    "getElement",
    "$",
    "computedStyle",
    "getElementsByTagAndClassName",
    "addToCallStack",
    "addLoadEvent",
    "focusOnLoad",
    "setElementClass",
    "toggleElementClass",
    "addElementClass",
    "removeElementClass",
    "swapElementClass",
    "hasElementClass",
    "escapeHTML",
    "toHTML",
    "emitHTML",
    "setDisplayForElement",
    "hideElement",
    "showElement",
    "scrapeText",
    "elementDimensions",
    "elementPosition",
    "setElementDimensions",
    "setElementPosition",
    "getViewportDimensions",
    "setOpacity"
];

MochiKit.DOM.EXPORT_OK = [
    "domConverters"
];

MochiKit.DOM.Dimensions = function (w, h) {
    this.w = w;
    this.h = h;
};

MochiKit.DOM.Dimensions.prototype.repr = function () {
    var repr = MochiKit.Base.repr;
    return "{w: "  + repr(this.w) + ", h: " + repr(this.h) + "}";
};

MochiKit.DOM.Coordinates = function (x, y) {
    this.x = x;
    this.y = y;
};

MochiKit.DOM.Coordinates.prototype.repr = function () {
    var repr = MochiKit.Base.repr;
    return "{x: "  + repr(this.x) + ", y: " + repr(this.y) + "}";
};

MochiKit.Base.update(MochiKit.DOM, {

    setOpacity: function(elem, o) {
        elem = MochiKit.DOM.getElement(elem);
        MochiKit.DOM.updateNodeAttributes(elem, {'style': {
                'opacity': o,
                '-moz-opacity': o,
                '-khtml-opacity': o,
                'filter':' alpha(opacity=' + (o * 100) + ')'
            }});
    },

    getViewportDimensions: function() {
        var d = new MochiKit.DOM.Dimensions();

        var w = MochiKit.DOM._window;
        var b = MochiKit.DOM._document.body;

        if (w.innerWidth) {
            d.w = w.innerWidth;
            d.h = w.innerHeight;
        } else if (b.parentElement.clientWidth) {
            d.w = b.parentElement.clientWidth;
            d.h = b.parentElement.clientHeight;
        } else if (b && b.clientWidth) {
            d.w = b.clientWidth;
            d.h = b.clientHeight;
        }
        return d;
    },

    elementDimensions: function (elem) {
        var self = MochiKit.DOM;
        if (typeof(elem.w) == 'number' || typeof(elem.h) == 'number') {
            return new self.Dimensions(elem.w || 0, elem.h || 0);
        }
        elem = self.getElement(elem);
        if (!elem) {
            return undefined;
        }
        if (self.computedStyle(elem, 'display') != 'none') {
            return new self.Dimensions(elem.offsetWidth || 0,
                elem.offsetHeight || 0);
        }
        var s = elem.style;
        var originalVisibility = s.visibility;
        var originalPosition = s.position;
        s.visibility = 'hidden';
        s.position = 'absolute';
        s.display = '';
        var originalWidth = elem.offsetWidth;
        var originalHeight = elem.offsetHeight;
        s.display = 'none';
        s.position = originalPosition;
        s.visibility = originalVisibility;
        return new self.Dimensions(originalWidth, originalHeight);
    },

    /*
    elementPosition is adapted from YAHOO.util.Dom.getXY, version 0.9.0.
    Copyright: Copyright (c) 2006, Yahoo! Inc. All rights reserved.
    BSD License: http://developer.yahoo.net/yui/license.txt
    */
    elementPosition: function (elem, /* optional */relativeTo) {
        var self = MochiKit.DOM;
        elem = self.getElement(elem);

        if (!elem ||
            elem.parentNode === null ||
            self.computedStyle(elem, 'display') == 'none') {
            return undefined;
        }

        var c = new self.Coordinates(0, 0);
        var box = null;
        var parent = null;

        var d = MochiKit.DOM._document;

        if (typeof(relativeTo) != 'undefined') {
            relativeTo = arguments.callee(relativeTo);
            if (relativeTo) {
                c.x -= (relativeTo.x || 0);
                c.y -= (relativeTo.y || 0);
            }
        }

        if (elem.getBoundingClientRect) { // IE shortcut
            box = elem.getBoundingClientRect();

            c.x += box.left +
                (d.documentElement.scrollLeft ||
                d.body.scrollLeft);

            c.y += box.top +
                (d.documentElement.scrollTop ||
                d.body.scrollTop);

            return c;
        } else if (d.getBoxObjectFor) { // Gecko shortcut
            box = d.getBoxObjectFor(elem);
            c.x += box.x;
            c.y += box.y;
        } else if (elem.offsetParent) {
            c.x += elem.offsetLeft;
            c.y += elem.offsetTop;
            parent = elem.offsetParent;

            if (parent != elem) {
                while (parent) {
                    c.x += parent.offsetLeft;
                    c.y += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }

            // opera & (safari absolute) incorrectly account for body offsetTop
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('opera') != -1 ||
                (ua.indexOf('safari') != -1 &&
                self.computedStyle(elem, 'position') == 'absolute')) {

                c.y -= d.body.offsetTop;

            }
        } else {
            /* it's just a MochiKit.DOM.Coordinates object */
            c.x += elem.x || 0;
            c.y += elem.y || 0;
            return c;
        }

        if (elem.parentNode) {
            parent = elem.parentNode;
        } else {
            parent = null;
        }

        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
            c.x -= parent.scrollLeft;
            c.y -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                parent = null;
            }
        }

        return c;
    },

    setElementDimensions: function (elem, newSize/* optional */, units) {
        elem = MochiKit.DOM.getElement(elem);
        if (typeof(units) == 'undefined') {
            units = 'px';
        }
        MochiKit.DOM.updateNodeAttributes(elem, {'style': {
            'width': newSize.w + units,
            'height': newSize.h + units
        }});
    },

    setElementPosition: function (elem, newPos/* optional */, units) {
        elem = MochiKit.DOM.getElement(elem);
        if (typeof(units) == 'undefined') {
            units = 'px';
        }
        MochiKit.DOM.updateNodeAttributes(elem, {'style': {
            'left': newPos.x + units,
            'top': newPos.y + units
        }});
    },

    currentWindow: function () {
        return MochiKit.DOM._window;
    },

    currentDocument: function () {
        return MochiKit.DOM._document;
    },

    withWindow: function (win, func) {
        var self = MochiKit.DOM;
        var oldDoc = self._document;
        var oldWin = self._win;
        var rval;
        try {
            self._window = win;
            self._document = win.document;
            rval = func();
        } catch (e) {
            self._window = oldWin;
            self._document = oldDoc;
            throw e;
        }
        self._window = oldWin;
        self._document = oldDoc;
        return rval;
    },

    formContents: function (elem/* = document */) {
        var names = [];
        var values = [];
        var m = MochiKit.Base;
        var self = MochiKit.DOM;
        if (typeof(elem) == "undefined" || elem === null) {
            elem = self._document;
        } else {
            elem = self.getElement(elem);
        }
        m.nodeWalk(elem, function (elem) {
            var name = elem.name;
            if (m.isNotEmpty(name)) {
                var tagName = elem.nodeName;
                if (tagName == "INPUT"
                    && (elem.type == "radio" || elem.type == "checkbox")
                    && !elem.checked
                ) {
                    return null;
                }
                if (tagName == "SELECT") {
                    if (elem.selectedIndex >= 0) {
                        var opt = elem.options[elem.selectedIndex];
                        names.push(name);
                        values.push((opt.value) ? opt.value : opt.text);
                        return null;
                    }
                    // no form elements?
                    names.push(name);
                    values.push("");
                    return null;
                }
                if (tagName == "FORM" || tagName == "P" || tagName == "SPAN"
                    || tagName == "DIV"
                ) {
                    return elem.childNodes;
                }
                names.push(name);
                values.push(elem.value || '');
                return null;
            }
            return elem.childNodes;
        });
        return [names, values];
    },

    withDocument: function (doc, func) {
        var self = MochiKit.DOM;
        var oldDoc = self._document;
        var rval;
        try {
            self._document = doc;
            rval = func();
        } catch (e) {
            self._document = oldDoc;
            throw e;
        }
        self._document = oldDoc;
        return rval;
    },

    registerDOMConverter: function (name, check, wrap, /* optional */override) {
        /***

            Register an adapter to convert objects that match check(obj, ctx)
            to a DOM element, or something that can be converted to a DOM
            element (i.e. number, bool, string, function, iterable).

        ***/
        MochiKit.DOM.domConverters.register(name, check, wrap, override);
    },

    coerceToDOM: function (node, ctx) {
        /***

            Used internally by createDOM, coerces a node to null, a DOM object,
            or an iterable.

        ***/

        var im = MochiKit.Iter;
        var self = MochiKit.DOM;
        var iter = im.iter;
        var repeat = im.repeat;
        var imap = im.imap;
        var domConverters = self.domConverters;
        var coerceToDOM = self.coerceToDOM;
        var NotFound = MochiKit.Base.NotFound;
        while (true) {
            if (typeof(node) == 'undefined' || node === null) {
                return null;
            }
            if (typeof(node.nodeType) != 'undefined' && node.nodeType > 0) {
                return node;
            }
            if (typeof(node) == 'number' || typeof(node) == 'bool') {
                node = node.toString();
                // FALL THROUGH
            }
            if (typeof(node) == 'string') {
                return self._document.createTextNode(node);
            }
            if (typeof(node.toDOM) == 'function') {
                node = node.toDOM(ctx);
                continue;
            }
            if (typeof(node) == 'function') {
                node = node(ctx);
                continue;
            }

            // iterable
            var iterNodes = null;
            try {
                iterNodes = iter(node);
            } catch (e) {
                // pass
            }
            if (iterNodes) {
                return imap(
                    coerceToDOM,
                    iterNodes,
                    repeat(ctx)
                );
            }

            // adapter
            try {
                node = domConverters.match(node, ctx);
                continue;
            } catch (e) {
                if (e != NotFound) {
                    throw e;
                }
            }

            // fallback
            return self._document.createTextNode(node.toString());
        }
        // mozilla warnings aren't too bright
        return undefined;
    },

    setNodeAttribute: function (node, attr, value) {
        var o = {};
        o[attr] = value;
        try {
            return MochiKit.DOM.updateNodeAttributes(node, o);
        } catch (e) {
            // pass
        }
        return null;
    },

    getNodeAttribute: function (node, attr) {
        var self = MochiKit.DOM;
        var rename = self.attributeArray.renames[attr];
        node = self.getElement(node);
        try {
            if (rename) {
                return node[rename];
            }
            return node.getAttribute(attr);
        } catch (e) {
            // pass
        }
        return null;
    },

    updateNodeAttributes: function (node, attrs) {
        var elem = node;
        var self = MochiKit.DOM;
        if (typeof(node) == 'string') {
            elem = self.getElement(node);
        }
        if (attrs) {
            var updatetree = MochiKit.Base.updatetree;
            if (self.attributeArray.compliant) {
                // not IE, good.
                for (var k in attrs) {
                    var v = attrs[k];
                    if (typeof(v) == 'object' && typeof(elem[k]) == 'object') {
                        updatetree(elem[k], v);
                    } else if (k.substring(0, 2) == "on") {
                        if (typeof(v) == "string") {
                            v = new Function(v);
                        }
                        elem[k] = v;
                    } else {
                        elem.setAttribute(k, v);
                    }
                }
            } else {
                // IE is insane in the membrane
                var renames = self.attributeArray.renames;
                for (k in attrs) {
                    v = attrs[k];
                    var renamed = renames[k];
                    if (k == "style" && typeof(v) == "string") {
                        elem.style.cssText = v;
                    } else if (typeof(renamed) == "string") {
                        elem[renamed] = v;
                    } else if (typeof(elem[k]) == 'object'
                            && typeof(v) == 'object') {
                        updatetree(elem[k], v);
                    } else if (k.substring(0, 2) == "on") {
                        if (typeof(v) == "string") {
                            v = new Function(v);
                        }
                        elem[k] = v;
                    } else {
                        elem.setAttribute(k, v);
                    }
                }
            }
        }
        return elem;
    },

    appendChildNodes: function (node/*, nodes...*/) {
        var elem = node;
        var self = MochiKit.DOM;
        if (typeof(node) == 'string') {
            elem = self.getElement(node);
        }
        var nodeStack = [
            self.coerceToDOM(
                MochiKit.Base.extend(null, arguments, 1),
                elem
            )
        ];
        var concat = MochiKit.Base.concat;
        while (nodeStack.length) {
            var n = nodeStack.shift();
            if (typeof(n) == 'undefined' || n === null) {
                // pass
            } else if (typeof(n.nodeType) == 'number') {
                elem.appendChild(n);
            } else {
                nodeStack = concat(n, nodeStack);
            }
        }
        return elem;
    },

    replaceChildNodes: function (node/*, nodes...*/) {
        var elem = node;
        var self = MochiKit.DOM;
        if (typeof(node) == 'string') {
            elem = self.getElement(node);
            arguments[0] = elem;
        }
        var child;
        while ((child = elem.firstChild)) {
            elem.removeChild(child);
        }
        if (arguments.length < 2) {
            return elem;
        } else {
            return self.appendChildNodes.apply(this, arguments);
        }
    },

    createDOM: function (name, attrs/*, nodes... */) {
        /*

            Create a DOM fragment in a really convenient manner, much like
            Nevow's <http://nevow.com> stan.

        */

        var elem;
        var self = MochiKit.DOM;
        if (typeof(name) == 'string') {
            // Internet Explorer is dumb
            if (attrs && "name" in attrs && !self.attributeArray.compliant) {
                // http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/name_2.asp
                name = ('<' + name + ' name="' + self.escapeHTML(attrs.name)
                    + '">');
            }
            elem = self._document.createElement(name);
        } else {
            elem = name;
        }
        if (attrs) {
            self.updateNodeAttributes(elem, attrs);
        }
        if (arguments.length <= 2) {
            return elem;
        } else {
            var args = MochiKit.Base.extend([elem], arguments, 2);
            return self.appendChildNodes.apply(this, args);
        }
    },

    createDOMFunc: function (/* tag, attrs, *nodes */) {
        /***

            Convenience function to create a partially applied createDOM

            @param tag: The name of the tag

            @param attrs: Optionally specify the attributes to apply

            @param *notes: Optionally specify any children nodes it should have

            @rtype: function

        ***/
        var m = MochiKit.Base;
        return m.partial.apply(
            this,
            m.extend([MochiKit.DOM.createDOM], arguments)
        );
    },

    swapDOM: function (dest, src) {
        /***

            Replace dest in a DOM tree with src, returning src

            @param dest: a DOM element to be replaced

            @param src: the DOM element to replace it with
                        or null if the DOM element should be removed

            @rtype: a DOM element (src)

        ***/
        var self = MochiKit.DOM;
        dest = self.getElement(dest);
        var parent = dest.parentNode;
        if (src) {
            src = self.getElement(src);
            parent.replaceChild(src, dest);
        } else {
            parent.removeChild(dest);
        }
        return src;
    },

    getElement: function (id) {
        /***

            A small quick little function to encapsulate the getElementById
            method.  It includes a check to ensure we can use that method.

            If the id isn't a string, it will be returned as-is.

            Also available as $(...) for compatibility/convenience with "other"
            js frameworks (bah).

        ***/
        var self = MochiKit.DOM;
        if (arguments.length == 1) {
            return ((typeof(id) == "string") ?
                self._document.getElementById(id) : id);
        } else {
            return MochiKit.Base.map(self.getElement, arguments);
        }
    },

    computedStyle: function (htmlElement, cssProperty, mozillaEquivalentCSS) {
        if (arguments.length == 2) {
            mozillaEquivalentCSS = cssProperty;
        }
        var self = MochiKit.DOM;
        var el = self.getElement(htmlElement);
        var document = self._document;
        if (!el || el == document) {
            return undefined;
        }
        if (el.currentStyle) {
            return el.currentStyle[cssProperty];
        }
        if (typeof(document.defaultView) == 'undefined') {
            return undefined;
        }
        if (document.defaultView === null) {
            return undefined;
        }
        var style = document.defaultView.getComputedStyle(el, null);
        if (typeof(style) == "undefined" || style === null) {
            return undefined;
        }
        return style.getPropertyValue(mozillaEquivalentCSS);
    },

    getElementsByTagAndClassName: function (tagName, className,
            /* optional */parent) {
        var self = MochiKit.DOM;
        if (typeof(tagName) == 'undefined' || tagName === null) {
            tagName = '*';
        }
        if (typeof(parent) == 'undefined' || parent === null) {
            parent = self._document;
        }
        parent = self.getElement(parent);
        var children = (parent.getElementsByTagName(tagName)
            || self._document.all);
        if (typeof(className) == 'undefined' || className === null) {
            return MochiKit.Base.extend(null, children);
        }

        var elements = [];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j = 0; j < classNames.length; j++) {
                if (classNames[j] == className) {
                    elements.push(child);
                    break;
                }
            }
        }

        return elements;
    },

    _newCallStack: function (path, once) {
        var rval = function () {
            var callStack = arguments.callee.callStack;
            for (var i = 0; i < callStack.length; i++) {
                if (callStack[i].apply(this, arguments) === false) {
                    break;
                }
            }
            if (once) {
                try {
                    this[path] = null;
                } catch (e) {
                    // pass
                }
            }
        };
        rval.callStack = [];
        return rval;
    },

    addToCallStack: function (target, path, func, once) {
        var self = MochiKit.DOM;
        var existing = target[path];
        var regfunc = existing;
        if (!(typeof(existing) == 'function'
                && typeof(existing.callStack) == "object"
                && existing.callStack !== null)) {
            regfunc = self._newCallStack(path, once);
            if (typeof(existing) == 'function') {
                regfunc.callStack.push(existing);
            }
            target[path] = regfunc;
        }
        regfunc.callStack.push(func);
    },

    addLoadEvent: function (func) {
        /***

            This will stack load functions on top of each other.
            Each function added will be called after onload in the
            order that they were added.

        ***/
        var self = MochiKit.DOM;
        self.addToCallStack(self._window, "onload", func, true);

    },

    focusOnLoad: function (element) {
        var self = MochiKit.DOM;
        self.addLoadEvent(function () {
            element = self.getElement(element);
            if (element) {
                element.focus();
            }
        });
    },

    setElementClass: function (element, className) {
        /***

            Set the entire class attribute of an element to className.

        ***/
        var self = MochiKit.DOM;
        var obj = self.getElement(element);
        if (self.attributeArray.compliant) {
            obj.setAttribute("class", className);
        } else {
            obj.setAttribute("className", className);
        }
    },

    toggleElementClass: function (className/*, element... */) {
        /***

            Toggle the presence of a given className in the class attribute
            of all given elements.

        ***/
        var self = MochiKit.DOM;
        for (var i = 1; i < arguments.length; i++) {
            var obj = self.getElement(arguments[i]);
            if (!self.addElementClass(obj, className)) {
                self.removeElementClass(obj, className);
            }
        }
    },

    addElementClass: function (element, className) {
        /***

            Ensure that the given element has className set as part of its
            class attribute.  This will not disturb other class names.

        ***/
        var self = MochiKit.DOM;
        var obj = self.getElement(element);
        var cls = obj.className;
        // trivial case, no className yet
        if (cls.length === 0) {
            self.setElementClass(obj, className);
            return true;
        }
        // the other trivial case, already set as the only class
        if (cls == className) {
            return false;
        }
        var classes = obj.className.split(" ");
        for (var i = 0; i < classes.length; i++) {
            // already present
            if (classes[i] == className) {
                return false;
            }
        }
        // append class
        self.setElementClass(obj, cls + " " + className);
        return true;
    },

    removeElementClass: function (element, className) {
        /***

            Ensure that the given element does not have className set as part
            of its class attribute.  This will not disturb other class names.

        ***/
        var self = MochiKit.DOM;
        var obj = self.getElement(element);
        var cls = obj.className;
        // trivial case, no className yet
        if (cls.length === 0) {
            return false;
        }
        // other trivial case, set only to className
        if (cls == className) {
            self.setElementClass(obj, "");
            return true;
        }
        var classes = obj.className.split(" ");
        for (var i = 0; i < classes.length; i++) {
            // already present
            if (classes[i] == className) {
                // only check sane case where the class is used once
                classes.splice(i, 1);
                self.setElementClass(obj, classes.join(" "));
                return true;
            }
        }
        // not found
        return false;
    },

    swapElementClass: function (element, fromClass, toClass) {
        /***

            If fromClass is set on element, replace it with toClass.  This
            will not disturb other classes on that element.

        ***/
        var obj = MochiKit.DOM.getElement(element);
        var res = MochiKit.DOM.removeElementClass(obj, fromClass);
        if (res) {
            MochiKit.DOM.addElementClass(obj, toClass);
        }
        return res;
    },

    hasElementClass: function (element, className/*...*/) {
        /***

          Return true if className is found in the element

        ***/
        var obj = MochiKit.DOM.getElement(element);
        var classes = obj.className.split(" ");
        for (var i = 1; i < arguments.length; i++) {
            var good = false;
            for (var j = 0; j < classes.length; j++) {
                if (classes[j] == arguments[i]) {
                    good = true;
                    break;
                }
            }
            if (!good) {
                return false;
            }
        }
        return true;
    },

    escapeHTML: function (s) {
        /***

            Make a string safe for HTML, converting the usual suspects (lt,
            gt, quot, amp)

        ***/
        return s.replace(/&/g, "&amp;"
            ).replace(/"/g, "&quot;"
            ).replace(/</g, "&lt;"
            ).replace(/>/g, "&gt;");
    },

    toHTML: function (dom) {
        /***

            Convert a DOM tree to a HTML string using emitHTML

        ***/
        return MochiKit.DOM.emitHTML(dom).join("");
    },

    emitHTML: function (dom, /* optional */lst) {
        /***

            Convert a DOM tree to a list of HTML string fragments

            You probably want to use toHTML instead.

        ***/

        if (typeof(lst) == 'undefined' || lst === null) {
            lst = [];
        }
        // queue is the call stack, we're doing this non-recursively
        var queue = [dom];
        var self = MochiKit.DOM;
        var escapeHTML = self.escapeHTML;
        var attributeArray = self.attributeArray;
        while (queue.length) {
            dom = queue.pop();
            if (typeof(dom) == 'string') {
                lst.push(dom);
            } else if (dom.nodeType == 1) {
                // we're not using higher order stuff here
                // because safari has heisenbugs.. argh.
                //
                // I think it might have something to do with
                // garbage collection and function calls.
                lst.push('<' + dom.nodeName.toLowerCase());
                var attributes = [];
                var domAttr = attributeArray(dom);
                for (var i = 0; i < domAttr.length; i++) {
                    var a = domAttr[i];
                    attributes.push([
                        " ",
                        a.name,
                        '="',
                        escapeHTML(a.value),
                        '"'
                    ]);
                }
                attributes.sort();
                for (i = 0; i < attributes.length; i++) {
                    var attrs = attributes[i];
                    for (var j = 0; j < attrs.length; j++) {
                        lst.push(attrs[j]);
                    }
                }
                if (dom.hasChildNodes()) {
                    lst.push(">");
                    // queue is the FILO call stack, so we put the close tag
                    // on first
                    queue.push("</" + dom.nodeName.toLowerCase() + ">");
                    var cnodes = dom.childNodes;
                    for (i = cnodes.length - 1; i >= 0; i--) {
                        queue.push(cnodes[i]);
                    }
                } else {
                    lst.push('/>');
                }
            } else if (dom.nodeType == 3) {
                lst.push(escapeHTML(dom.nodeValue));
            }
        }
        return lst;
    },

    setDisplayForElement: function (display, element/*, ...*/) {
        /***

            Change the style.display for the given element(s).  Usually
            used as the partial forms:

                showElement(element, ...);
                hideElement(element, ...);

        ***/
        var m = MochiKit.Base;
        var elements = m.extend(null, arguments, 1);
        MochiKit.Iter.forEach(
            m.filter(null, m.map(MochiKit.DOM.getElement, elements)),
            function (element) {
                element.style.display = display;
            }
        );
    },

    scrapeText: function (node, /* optional */asArray) {
        /***

            Walk a DOM tree in-order and scrape all of the text out of it as a
            string or an Array

        ***/
        var rval = [];
        (function (node) {
            var cn = node.childNodes;
            if (cn) {
                for (var i = 0; i < cn.length; i++) {
                    arguments.callee.call(this, cn[i]);
                }
            }
            var nodeValue = node.nodeValue;
            if (typeof(nodeValue) == 'string') {
                rval.push(nodeValue);
            }
        })(MochiKit.DOM.getElement(node));
        if (asArray) {
            return rval;
        } else {
            return rval.join("");
        }
    },


    __new__: function (win) {

        var m = MochiKit.Base;
        this._document = document;
        this._window = win;

        this.domConverters = new m.AdapterRegistry();

        var __tmpElement = this._document.createElement("span");
        var attributeArray;
        if (__tmpElement && __tmpElement.attributes &&
                __tmpElement.attributes.length > 0) {
            // for braindead browsers (IE) that insert extra junk
            var filter = m.filter;
            attributeArray = function (node) {
                return filter(attributeArray.ignoreAttrFilter, node.attributes);
            };
            attributeArray.ignoreAttr = {};
            MochiKit.Iter.forEach(__tmpElement.attributes, function (a) {
                attributeArray.ignoreAttr[a.name] = a.value;
            });
            attributeArray.ignoreAttrFilter = function (a) {
                return (attributeArray.ignoreAttr[a.name] != a.value);
            };
            attributeArray.compliant = false;
            attributeArray.renames = {
                "class": "className",
                "checked": "defaultChecked",
                "usemap": "useMap",
                "for": "htmlFor"
            };
        } else {
            attributeArray = function (node) {
                /***

                    Return an array of attributes for a given node,
                    filtering out attributes that don't belong for
                    that are inserted by "Certain Browsers".

                ***/
                return node.attributes;
            };
            attributeArray.compliant = true;
            attributeArray.renames = {};
        }
        this.attributeArray = attributeArray;


        // shorthand for createDOM syntax
        var createDOMFunc = this.createDOMFunc;
        this.UL = createDOMFunc("ul");
        this.OL = createDOMFunc("ol");
        this.LI = createDOMFunc("li");
        this.TD = createDOMFunc("td");
        this.TR = createDOMFunc("tr");
        this.TBODY = createDOMFunc("tbody");
        this.THEAD = createDOMFunc("thead");
        this.TFOOT = createDOMFunc("tfoot");
        this.TABLE = createDOMFunc("table");
        this.TH = createDOMFunc("th");
        this.INPUT = createDOMFunc("input");
        this.SPAN = createDOMFunc("span");
        this.A = createDOMFunc("a");
        this.DIV = createDOMFunc("div");
        this.IMG = createDOMFunc("img");
        this.BUTTON = createDOMFunc("button");
        this.TT = createDOMFunc("tt");
        this.PRE = createDOMFunc("pre");
        this.H1 = createDOMFunc("h1");
        this.H2 = createDOMFunc("h2");
        this.H3 = createDOMFunc("h3");
        this.BR = createDOMFunc("br");
        this.HR = createDOMFunc("hr");
        this.LABEL = createDOMFunc("label");
        this.TEXTAREA = createDOMFunc("textarea");
        this.FORM = createDOMFunc("form");
        this.P = createDOMFunc("p");
        this.SELECT = createDOMFunc("select");
        this.OPTION = createDOMFunc("option");
        this.OPTGROUP = createDOMFunc("optgroup");
        this.LEGEND = createDOMFunc("legend");
        this.FIELDSET = createDOMFunc("fieldset");
        this.STRONG = createDOMFunc("strong");
        this.CANVAS = createDOMFunc("canvas");

        this.hideElement = m.partial(this.setDisplayForElement, "none");
        this.showElement = m.partial(this.setDisplayForElement, "block");
        this.removeElement = this.swapDOM;

        this.$ = this.getElement;

        this.EXPORT_TAGS = {
            ":common": this.EXPORT,
            ":all": m.concat(this.EXPORT, this.EXPORT_OK)
        };

        m.nameFunctions(this);

    }
});

MochiKit.DOM.__new__(this);

//
// XXX: Internet Explorer blows
//
withWindow = MochiKit.DOM.withWindow;
withDocument = MochiKit.DOM.withDocument;

MochiKit.Base._exportSymbols(this, MochiKit.DOM);

/***

MochiKit.LoggingPane 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito.  All rights Reserved.

***/
if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.LoggingPane');
    dojo.require('MochiKit.Logging');
    dojo.require('MochiKit.Base');
}

if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Logging", []);
    JSAN.use("MochiKit.Base", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined' || typeof(MochiKit.Logging) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.LoggingPane depends on MochiKit.Base and MochiKit.Logging!";
}

if (typeof(MochiKit.LoggingPane) == 'undefined') {
    MochiKit.LoggingPane = {};
}

MochiKit.LoggingPane.NAME = "MochiKit.LoggingPane";
MochiKit.LoggingPane.VERSION = "1.3";
MochiKit.LoggingPane.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};

MochiKit.LoggingPane.toString = function () {
    return this.__repr__();
};

MochiKit.LoggingPane.createLoggingPane = function (inline/* = false */) {
    var m = MochiKit.LoggingPane;
    inline = !(!inline);
    if (m._loggingPane && m._loggingPane.inline != inline) {
        m._loggingPane.closePane();
        m._loggingPane = null;
    }
    if (!m._loggingPane || m._loggingPane.closed) {
        m._loggingPane = new m.LoggingPane(inline, MochiKit.Logging.logger);
    }
    return m._loggingPane;
};

MochiKit.LoggingPane.LoggingPane = function (inline/* = false */, logger/* = MochiKit.Logging.logger */) {
    /* Use a div if inline, pop up a window if not */
    /* Create the elements */
    if (typeof(logger) == "undefined" || logger == null) {
        logger = MochiKit.Logging.logger;
    }
    this.logger = logger;
    var update = MochiKit.Base.update;
    var updatetree = MochiKit.Base.updatetree;
    var bind = MochiKit.Base.bind;
    var clone = MochiKit.Base.clone;
    var win = window;
    var uid = "_MochiKit_LoggingPane";
    if (typeof(MochiKit.DOM) != "undefined") {
        win = MochiKit.DOM.currentWindow();
    }
    if (!inline) {
        // name the popup with the base URL for uniqueness
        var url = win.location.href.split("?")[0].replace(/[:\/.><&]/g, "_");
        var name = uid + "_" + url;
        var nwin = win.open("", name, "dependent,resizable,height=200");
        if (!nwin) {
            alert("Not able to open debugging window due to pop-up blocking.");
            return undefined;
        }
        nwin.document.write(
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" '
            + '"http://www.w3.org/TR/html4/loose.dtd">'
            + '<html><head><title>[MochiKit.LoggingPane]</title></head>'
            + '<body></body></html>'
        );
        nwin.document.close();
        nwin.document.title += ' ' + win.document.title;
        win = nwin;
    }
    var doc = win.document;
    this.doc = doc;

    // Connect to the debug pane if it already exists (i.e. in a window orphaned by the page being refreshed)
    var debugPane = doc.getElementById(uid);
    var existing_pane = !!debugPane;
    if (debugPane && typeof(debugPane.loggingPane) != "undefined") {
        debugPane.loggingPane.logger = this.logger;
        debugPane.loggingPane.buildAndApplyFilter();
        return debugPane.loggingPane;
    }

    if (existing_pane) {
        // clear any existing contents
        var child;
        while ((child = debugPane.firstChild)) {
            debugPane.removeChild(child);
        }
    } else {
        debugPane = doc.createElement("div");
        debugPane.id = uid;
    }
    debugPane.loggingPane = this;
    var levelFilterField = doc.createElement("input");
    var infoFilterField = doc.createElement("input");
    var filterButton = doc.createElement("button");
    var loadButton = doc.createElement("button");
    var clearButton = doc.createElement("button");
    var closeButton = doc.createElement("button");
    var logPaneArea = doc.createElement("div");
    var logPane = doc.createElement("div");

    /* Set up the functions */
    var listenerId = uid + "_Listener";
    this.colorTable = clone(this.colorTable);
    var messages = [];
    var messageFilter = null;

    var messageLevel = function (msg) {
        var level = msg.level;
        if (typeof(level) == "number") {
            level = MochiKit.Logging.LogLevel[level];
        }
        return level;
    };

    var messageText = function (msg) {
        return msg.info.join(" ");
    };

    var addMessageText = bind(function (msg) {
        var level = messageLevel(msg);
        var text = messageText(msg);
        var c = this.colorTable[level];
        var p = doc.createElement("span");
        p.className = "MochiKit-LogMessage MochiKit-LogLevel-" + level;
        p.style.cssText = "margin: 0px; white-space: -moz-pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; white-space: pre-line; word-wrap: break-word; wrap-option: emergency; color: " + c;
        p.appendChild(doc.createTextNode(level + ": " + text));
        logPane.appendChild(p);
        logPane.appendChild(doc.createElement("br"));
        if (logPaneArea.offsetHeight > logPaneArea.scrollHeight) {
            logPaneArea.scrollTop = 0;
        } else {
            logPaneArea.scrollTop = logPaneArea.scrollHeight;
        }
    }, this);

    var addMessage = function (msg) {
        messages[messages.length] = msg;
        addMessageText(msg);
    };

    var buildMessageFilter = function () {
        var levelre, infore;
        try {
            /* Catch any exceptions that might arise due to invalid regexes */
            levelre = new RegExp(levelFilterField.value);
            infore = new RegExp(infoFilterField.value);
        } catch(e) {
            /* If there was an error with the regexes, do no filtering */
            logDebug("Error in filter regex: " + e.message);
            return null;
        }

        return function (msg) {
            return (
                levelre.test(messageLevel(msg)) &&
                infore.test(messageText(msg))
            );
        };
    }

    var clearMessagePane = function () {
        while (logPane.firstChild) {
            logPane.removeChild(logPane.firstChild);
        }
    };

    var clearMessages = function () {
        messages = [];
        clearMessagePane();
    }

    var closePane = bind(function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        if (MochiKit.LoggingPane._loggingPane == this) {
            MochiKit.LoggingPane._loggingPane = null;
        }
        this.logger.removeListener(listenerId);

        debugPane.loggingPane = null;

        if (inline) {
            debugPane.parentNode.removeChild(debugPane);
        } else {
            this.win.close();
        }
    }, this);

    var filterMessages = function () {
        clearMessagePane();

        for (var i = 0; i < messages.length; i++) {
            var msg = messages[i];
            if (messageFilter == null || messageFilter(msg)) {
                addMessageText(msg);
            }
        }
    };

    this.buildAndApplyFilter = function () {
        messageFilter = buildMessageFilter();

        filterMessages();

        this.logger.removeListener(listenerId);
        this.logger.addListener(listenerId, messageFilter, addMessage);
    };


    var loadMessages = bind(function () {
        messages = this.logger.getMessages();
        filterMessages();
    }, this);

    var filterOnEnter = bind(function (event) {
        event = event || window.event;
        key = event.which || event.keyCode;
        if (key == 13) {
            this.buildAndApplyFilter();
        }
    }, this);

    /* Create the debug pane */
    var style = "display: block; left: 0px; bottom: 0px; position: fixed; width: 100%; background-color: white; font: " + this.logFont;
    if (inline) {
        style += "; height: 10em; border-top: 2px solid black";
    } else {
        style += "; height: 100%;";
    }
    debugPane.style.cssText = style;

    if (!existing_pane) {
        doc.body.appendChild(debugPane);
    }

    /* Create the filter fields */
    style = {"cssText": "width: 33%; display: inline; font: " + this.logFont};

    updatetree(levelFilterField, {
        "value": "FATAL|ERROR|WARNING|INFO|DEBUG",
        "onkeypress": filterOnEnter,
        "style": style
    });
    debugPane.appendChild(levelFilterField);

    updatetree(infoFilterField, {
        "value": ".*",
        "onkeypress": filterOnEnter,
        "style": style
    });
    debugPane.appendChild(infoFilterField);

    /* Create the buttons */
    style = "width: 8%; display:inline; font: " + this.logFont;

    filterButton.appendChild(doc.createTextNode("Filter"));
    filterButton.onclick = bind("buildAndApplyFilter", this);
    filterButton.style.cssText = style;
    debugPane.appendChild(filterButton);

    loadButton.appendChild(doc.createTextNode("Load"));
    loadButton.onclick = loadMessages;
    loadButton.style.cssText = style;
    debugPane.appendChild(loadButton);

    clearButton.appendChild(doc.createTextNode("Clear"));
    clearButton.onclick = clearMessages;
    clearButton.style.cssText = style;
    debugPane.appendChild(clearButton);

    closeButton.appendChild(doc.createTextNode("Close"));
    closeButton.onclick = closePane;
    closeButton.style.cssText = style;
    debugPane.appendChild(closeButton);

    /* Create the logging pane */
    logPaneArea.style.cssText = "overflow: auto; width: 100%";
    logPane.style.cssText = "width: 100%; height: " + (inline ? "8em" : "100%");

    logPaneArea.appendChild(logPane);
    debugPane.appendChild(logPaneArea);

    this.buildAndApplyFilter();
    loadMessages();

    if (inline) {
        this.win = undefined;
    } else {
        this.win = win;
    }
    this.inline = inline;
    this.closePane = closePane;
    this.closed = false;

    return this;
};

MochiKit.LoggingPane.LoggingPane.prototype = {
    "logFont": "8pt Verdana,sans-serif",
    "colorTable": {
        "ERROR": "red",
        "FATAL": "darkred",
        "WARNING": "blue",
        "INFO": "black",
        "DEBUG": "green"
    }
};


MochiKit.LoggingPane.EXPORT_OK = [
    "LoggingPane"
];

MochiKit.LoggingPane.EXPORT = [
    "createLoggingPane"
];

MochiKit.LoggingPane.__new__ = function () {
    this.EXPORT_TAGS = {
        ":common": this.EXPORT,
        ":all": MochiKit.Base.concat(this.EXPORT, this.EXPORT_OK)
    };

    MochiKit.Base.nameFunctions(this);

    MochiKit.LoggingPane._loggingPane = null;

};

MochiKit.LoggingPane.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.LoggingPane);

/***

MochiKit.Color 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito and others.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Color');
    dojo.require('MochiKit.Base');
}

if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Base", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Color depends on MochiKit.Base";
}

if (typeof(MochiKit.Color) == "undefined") {
    MochiKit.Color = {};
}

MochiKit.Color.NAME = "MochiKit.Color";
MochiKit.Color.VERSION = "1.3";

MochiKit.Color.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};

MochiKit.Color.toString = function () {
    return this.__repr__();
};


MochiKit.Color.Color = function (red, green, blue, alpha) {
    if (typeof(alpha) == 'undefined' || alpha == null) {
        alpha = 1.0;
    }
    this.rgb = {
        r: red,
        g: green,
        b: blue,
        a: alpha
    };
};


// Prototype methods
MochiKit.Color.Color.prototype = {

    __class__: MochiKit.Color.Color,

    colorWithAlpha: function (alpha) {
        var rgb = this.rgb;
        var m = MochiKit.Color;
        return m.Color.fromRGB(rgb.r, rgb.g, rgb.b, alpha);
    },

    colorWithHue: function (hue) {
        // get an HSL model, and set the new hue...
        var hsl = this.asHSL();
        hsl.h = hue;
        var m = MochiKit.Color;
        // convert back to RGB...
        return m.Color.fromHSL(hsl);
    },

    colorWithSaturation: function (saturation) {
        // get an HSL model, and set the new hue...
        var hsl = this.asHSL();
        hsl.s = saturation;
        var m = MochiKit.Color;
        // convert back to RGB...
        return m.Color.fromHSL(hsl);
    },

    colorWithLightness: function (lightness) {
        // get an HSL model, and set the new hue...
        var hsl = this.asHSL();
        hsl.l = lightness;
        var m = MochiKit.Color;
        // convert back to RGB...
        return m.Color.fromHSL(hsl);
    },

    darkerColorWithLevel: function (level) {
        var hsl  = this.asHSL();
        hsl.l = Math.max(hsl.l - level, 0);
        var m = MochiKit.Color;
        return m.Color.fromHSL(hsl);
    },

    lighterColorWithLevel: function (level) {
        var hsl  = this.asHSL();
        hsl.l = Math.min(hsl.l + level, 1);
        var m = MochiKit.Color;
        return m.Color.fromHSL(hsl);
    },

    blendedColor: function (other, /* optional */ fraction) {
        if (typeof(fraction) == 'undefined' || fraction == null) {
            fraction = 0.5;
        }
        var sf = 1.0 - fraction;
        var s = this.rgb;
        var d = other.rgb;
        var df = fraction;
        return MochiKit.Color.Color.fromRGB(
            (s.r * sf) + (d.r * df),
            (s.g * sf) + (d.g * df),
            (s.b * sf) + (d.b * df),
            (s.a * sf) + (d.a * df)
        );
    },

    compareRGB: function (other) {
        var a = this.asRGB();
        var b = other.asRGB();
        return MochiKit.Base.compare(
            [a.r, a.g, a.b, a.a],
            [b.r, b.g, b.b, b.a]
        );
    },

    isLight: function () {
        return this.asHSL().b > 0.5;
    },

    isDark: function () {
        return (!this.isLight());
    },

    toHSLString: function () {
        var c = this.asHSL();
        var ccc = MochiKit.Color.clampColorComponent;
        var rval = this._hslString;
        if (!rval) {
            var mid = (
                ccc(c.h, 360).toFixed(0)
                + "," + ccc(c.s, 100).toPrecision(4) + "%"
                + "," + ccc(c.l, 100).toPrecision(4) + "%"
            );
            var a = c.a;
            if (a >= 1) {
                a = 1;
                rval = "hsl(" + mid + ")";
            } else {
                if (a <= 0) {
                    a = 0;
                }
                rval = "hsla(" + mid + "," + a + ")";
            }
            this._hslString = rval;
        }
        return rval;
    },

    toRGBString: function () {
        var c = this.rgb;
        var ccc = MochiKit.Color.clampColorComponent;
        var rval = this._rgbString;
        if (!rval) {
            var mid = (
                ccc(c.r, 255).toFixed(0)
                + "," + ccc(c.g, 255).toFixed(0)
                + "," + ccc(c.b, 255).toFixed(0)
            );
            if (c.a != 1) {
                rval = "rgba(" + mid + "," + c.a + ")";
            } else {
                rval = "rgb(" + mid + ")";
            }
            this._rgbString = rval;
        }
        return rval;
    },

    asRGB: function () {
        return MochiKit.Base.clone(this.rgb);
    },

    toHexString: function () {
        var m = MochiKit.Color;
        var c = this.rgb;
        var ccc = MochiKit.Color.clampColorComponent;
        var rval = this._hexString;
        if (!rval) {
            rval = ("#" +
                m.toColorPart(ccc(c.r, 255)) +
                m.toColorPart(ccc(c.g, 255)) +
                m.toColorPart(ccc(c.b, 255))
            );
            this._hexString = rval;
        }
        return rval;
    },

    asHSV: function () {
        var hsv = this.hsv;
        var c = this.rgb;
        if (typeof(hsv) == 'undefined' || hsv == null) {
            hsv = MochiKit.Color.rgbToHSV(this.rgb);
            this.hsv = hsv;
        }
        return MochiKit.Base.clone(hsv);
    },

    asHSL: function () {
        var hsl = this.hsl;
        var c = this.rgb;
        if (typeof(hsl) == 'undefined' || hsl == null) {
            hsl = MochiKit.Color.rgbToHSL(this.rgb);
            this.hsl = hsl;
        }
        return MochiKit.Base.clone(hsl);
    },

    toString: function () {
        return this.toRGBString();
    },

    repr: function () {
        var c = this.rgb;
        var col = [c.r, c.g, c.b, c.a];
        return this.__class__.NAME + "(" + col.join(", ") + ")";
    }

};

// Constructor methods
MochiKit.Base.update(MochiKit.Color.Color, {
    fromRGB: function (red, green, blue, alpha) {
        // designated initializer
        var Color = MochiKit.Color.Color;
        if (arguments.length == 1) {
            var rgb = red;
            red = rgb.r;
            green = rgb.g;
            blue = rgb.b;
            if (typeof(rgb.a) == 'undefined') {
                alpha = undefined;
            } else {
                alpha = rgb.a;
            }
        }
        return new Color(red, green, blue, alpha);
    },

    fromHSL: function (hue, saturation, lightness, alpha) {
        var m = MochiKit.Color;
        return m.Color.fromRGB(m.hslToRGB.apply(m, arguments));
    },

    fromHSV: function (hue, saturation, value, alpha) {
        var m = MochiKit.Color;
        return m.Color.fromRGB(m.hsvToRGB.apply(m, arguments));
    },

    fromName: function (name) {
        var Color = MochiKit.Color.Color;
        var htmlColor = Color._namedColors[name.toLowerCase()];
        if (typeof(htmlColor) == 'string') {
            return Color.fromHexString(htmlColor);
        } else if (name == "transparent") {
            return Color.transparentColor();
        }
        return null;
    },

    fromString: function (colorString) {
        var self = MochiKit.Color.Color;
        var three = colorString.substr(0, 3);
        if (three == "rgb") {
            return self.fromRGBString(colorString);
        } else if (three == "hsl") {
            return self.fromHSLString(colorString);
        } else if (colorString.charAt(0) == "#") {
            return self.fromHexString(colorString);
        }
        return self.fromName(colorString);
    },


    fromHexString: function (hexCode) {
        if (hexCode.charAt(0) == '#') {
            hexCode = hexCode.substring(1);
        }
        var components = [];
        var i, hex;
        if (hexCode.length == 3) {
            for (i = 0; i < 3; i++) {
                hex = hexCode.substr(i, 1);
                components.push(parseInt(hex + hex, 16) / 255.0);
            }
        } else {
            for (i = 0; i < 6; i += 2) {
                hex = hexCode.substr(i, 2);
                components.push(parseInt(hex, 16) / 255.0);
            }
        }
        var Color = MochiKit.Color.Color;
        return Color.fromRGB.apply(Color, components);
    },


    _fromColorString: function (pre, method, scales, colorCode) {
        // parses either HSL or RGB
        if (colorCode.indexOf(pre) == 0) {
            colorCode = colorCode.substring(colorCode.indexOf("(", 3) + 1, colorCode.length - 1);
        }
        var colorChunks = colorCode.split(/\s*,\s*/);
        var colorFloats = [];
        for (var i = 0; i < colorChunks.length; i++) {
            var c = colorChunks[i];
            var val;
            var three = c.substring(c.length - 3);
            if (c.charAt(c.length - 1) == '%') {
                val = 0.01 * parseFloat(c.substring(0, c.length - 1));
            } else if (three == "deg") {
                val = parseFloat(c) / 360.0;
            } else if (three == "rad") {
                val = parseFloat(c) / (Math.PI * 2);
            } else {
                val = scales[i] * parseFloat(c);
            }
            colorFloats.push(val);
        }
        return this[method].apply(this, colorFloats);
    },

    fromComputedStyle: function (elem, style, mozillaEquivalentCSS) {
        var d = MochiKit.DOM;
        var cls = MochiKit.Color.Color;
        for (elem = d.getElement(elem); elem; elem = elem.parentNode) {
            var actualColor = d.computedStyle.apply(d, arguments);
            if (!actualColor) {
                continue;
            }
            var color = cls.fromString(actualColor);
            if (!color) {
                break;
            }
            if (color.asRGB().a > 0) {
                return color;
            }
        }
        return null;
    },

    fromBackground: function (elem) {
        var cls = MochiKit.Color.Color;
        return cls.fromComputedStyle(
            elem, "backgroundColor", "background-color") || cls.whiteColor();
    },

    fromText: function (elem) {
        var cls = MochiKit.Color.Color;
        return cls.fromComputedStyle(
            elem, "color", "color") || cls.blackColor();
    },

    namedColors: function () {
        return MochiKit.Base.clone(MochiKit.Color.Color._namedColors);
    }
});

// Module level functions
MochiKit.Base.update(MochiKit.Color, {
    clampColorComponent: function (v, scale) {
        v *= scale;
        if (v < 0) {
            return 0;
        } else if (v > scale) {
            return scale;
        } else {
            return v;
        }
    },

    _hslValue: function (n1, n2, hue) {
        if (hue > 6.0) {
            hue -= 6.0;
        } else if (hue < 0.0) {
            hue += 6.0;
        }
        var val;
        if (hue < 1.0) {
            val = n1 + (n2 - n1) * hue;
        } else if (hue < 3.0) {
            val = n2;
        } else if (hue < 4.0) {
            val = n1 + (n2 - n1) * (4.0 - hue);
        } else {
            val = n1;
        }
        return val;
    },

    hsvToRGB: function (hue, saturation, value, alpha) {
        if (arguments.length == 1) {
            var hsv = hue;
            hue = hsv.h;
            saturation = hsv.s;
            value = hsv.v;
            alpha = hsv.a;
        }
        var red;
        var green;
        var blue;
        if (saturation == 0.0) {
            red = 0;
            green = 0;
            blue = 0;
        } else {
            var i = Math.floor(hue * 6);
            var f = (hue * 6) - i;
            var p = value * (1 - saturation);
            var q = value * (1 - (saturation * f));
            var t = value * (1 - (saturation * (1 - f)));
            switch (i) {
                case 1: red = q; green = value; blue = p; break;
                case 2: red = p; green = value; blue = t; break;
                case 3: red = p; green = q; blue = value; break;
                case 4: red = t; green = p; blue = value; break;
                case 5: red = value; green = p; blue = q; break;
                case 6: // fall through
                case 0: red = value; green = t; blue = p; break;
            }
        }
        return {
            r: red,
            g: green,
            b: blue,
            a: alpha
        };
    },

    hslToRGB: function (hue, saturation, lightness, alpha) {
        if (arguments.length == 1) {
            var hsl = hue;
            hue = hsl.h;
            saturation = hsl.s;
            lightness = hsl.l;
            alpha = hsl.a;
        }
        var red;
        var green;
        var blue;
        if (saturation == 0) {
            red = lightness;
            green = lightness;
            blue = lightness;
        } else {
            var m2;
            if (lightness <= 0.5) {
                m2 = lightness * (1.0 + saturation);
            } else {
                m2 = lightness + saturation - (lightness * saturation);
            }
            var m1 = (2.0 * lightness) - m2;
            var f = MochiKit.Color._hslValue;
            var h6 = hue * 6.0;
            red = f(m1, m2, h6 + 2);
            green = f(m1, m2, h6);
            blue = f(m1, m2, h6 - 2);
        }
        return {
            r: red,
            g: green,
            b: blue,
            a: alpha
        };
    },

    rgbToHSV: function (red, green, blue, alpha) {
        if (arguments.length == 1) {
            var rgb = red;
            red = rgb.r;
            green = rgb.g;
            blue = rgb.b;
            alpha = rgb.a;
        }
        var max = Math.max(Math.max(red, green), blue);
        var min = Math.min(Math.min(red, green), blue);
        var hue;
        var saturation;
        var value = max;
        if (min == max) {
            hue = 0;
            saturation = 0;
        } else {
            var delta = (max - min);
            saturation = delta / max;

            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            if (hue < 0) {
                hue += 1;
            }
            if (hue > 1) {
                hue -= 1;
            }
        }
        return {
            h: hue,
            s: saturation,
            v: value,
            a: alpha
        };
    },

    rgbToHSL: function (red, green, blue, alpha) {
        if (arguments.length == 1) {
            var rgb = red;
            red = rgb.r;
            green = rgb.g;
            blue = rgb.b;
            alpha = rgb.a;
        }
        var max = Math.max(red, Math.max(green, blue));
        var min = Math.min(red, Math.min(green, blue));
        var hue;
        var saturation;
        var lightness = (max + min) / 2.0;
        var delta = max - min;
        if (delta == 0) {
            hue = 0;
            saturation = 0;
        } else {
            if (lightness <= 0.5) {
                saturation = delta / (max + min);
            } else {
                saturation = delta / (2 - max - min);
            }
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            if (hue < 0) {
                hue += 1;
            }
            if (hue > 1) {
                hue -= 1;
            }

        }
        return {
            h: hue,
            s: saturation,
            l: lightness,
            a: alpha
        };
    },

    toColorPart: function (num) {
        var digits = Math.round(num).toString(16);
        if (num < 16) {
            return '0' + digits;
        }
        return digits;
    },

    __new__: function () {
        var m = MochiKit.Base;
        this.Color.fromRGBString = m.bind(
            this.Color._fromColorString, this.Color, "rgb", "fromRGB",
            [1.0/255.0, 1.0/255.0, 1.0/255.0, 1]
        );
        this.Color.fromHSLString = m.bind(
            this.Color._fromColorString, this.Color, "hsl", "fromHSL",
            [1.0/360.0, 0.01, 0.01, 1]
        );

        var third = 1.0 / 3.0;
        var colors = {
            // NSColor colors plus transparent
            black: [0, 0, 0],
            blue: [0, 0, 1],
            brown: [0.6, 0.4, 0.2],
            cyan: [0, 1, 1],
            darkGray: [third, third, third],
            gray: [0.5, 0.5, 0.5],
            green: [0, 1, 0],
            lightGray: [2 * third, 2 * third, 2 * third],
            magenta: [1, 0, 1],
            orange: [1, 0.5, 0],
            purple: [0.5, 0, 0.5],
            red: [1, 0, 0],
            transparent: [0, 0, 0, 0],
            white: [1, 1, 1],
            yellow: [1, 1, 0]
        };

        var makeColor = function (name, r, g, b, a) {
            var rval = this.fromRGB(r, g, b, a);
            this[name] = function () { return rval; };
            return rval;
        }

        for (var k in colors) {
            var name = k + "Color";
            var bindArgs = m.concat(
                [makeColor, this.Color, name],
                colors[k]
            );
            this.Color[name] = m.bind.apply(null, bindArgs);
        }

        var isColor = function () {
            for (var i = 0; i < arguments.length; i++) {
                if (!(arguments[i] instanceof Color)) {
                    return false;
                }
            }
            return true;
        }

        var compareColor = function (a, b) {
            return a.compareRGB(b);
        }

        m.nameFunctions(this);

        m.registerComparator(this.Color.NAME, isColor, compareColor);

        this.EXPORT_TAGS = {
            ":common": this.EXPORT,
            ":all": m.concat(this.EXPORT, this.EXPORT_OK)
        };

    }
});

MochiKit.Color.EXPORT = [
    "Color"
];

MochiKit.Color.EXPORT_OK = [
    "clampColorComponent",
    "rgbToHSL",
    "hslToRGB",
    "rgbToHSV",
    "hsvToRGB",
    "toColorPart"
];

MochiKit.Color.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.Color);

// Full table of css3 X11 colors <http://www.w3.org/TR/css3-color/#X11COLORS>

MochiKit.Color.Color._namedColors = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
};

/***

MochiKit.Signal 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2006 Jonathan Gardner, Beau Hartshorne.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Signal');
    dojo.require('MochiKit.Base');
    dojo.require('MochiKit.DOM');
}
if (typeof(JSAN) != 'undefined') {
    JSAN.use('MochiKit.Base', []);
    JSAN.use('MochiKit.DOM', []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined') {
        throw '';
    }
} catch (e) {
    throw 'MochiKit.Signal depends on MochiKit.Base!';
}

try {
    if (typeof(MochiKit.DOM) == 'undefined') {
        throw '';
    }
} catch (e) {
    throw 'MochiKit.Signal depends on MochiKit.DOM!';
}

if (typeof(MochiKit.Signal) == 'undefined') {
    MochiKit.Signal = {};
}

MochiKit.Signal.NAME = 'MochiKit.Signal';
MochiKit.Signal.VERSION = '1.3';

MochiKit.Signal._observers = [];

MochiKit.Signal.Event = function (e) {
    this._event = e || window.event;
};

MochiKit.Signal.Event.prototype.event = function () {
    // just to keep the top-level api consistent, i forget to look for
    // event or event() -- maybe we should just keep this private so
    // people know they should be filing bugs instead of playing with the
    // raw event?
    return this._event;
};

MochiKit.Signal.Event.prototype.type = function () {
    return this._event.type || undefined;
};

MochiKit.Signal.Event.prototype.target = function () {
    return this._event.target || this._event.srcElement;
};

MochiKit.Signal.Event.prototype.relatedTarget = function () {
    if (this.type() == 'mouseover') {
        return (this._event.relatedTarget ||
            this._event.fromElement);
    } else if (this.type() == 'mouseout') {
        return (this._event.relatedTarget ||
            this._event.toElement);
    }
    // FIXME: throw an exception instead?
    return undefined;
};

MochiKit.Signal.Event.prototype.modifier = function () {
    var m = {};
    m.alt = this._event.altKey;
    m.ctrl = this._event.ctrlKey;
    m.meta = this._event.metaKey || false; // ie and opera punt here
    m.shift = this._event.shiftKey;
    return m;
};

MochiKit.Signal.Event.prototype.key = function () {
    var k = {};
    if (this.type() && this.type().indexOf('key') === 0) {

        /*

        // If you're looking for a special key, look for it in keydown or
        // keyup, but never keypress. If you're looking for a Unicode
        // chracter, look for it with keypress, but never kd or ku.

        // keyCode will contain the raw key code in a kd/ku event
        // keyString will contain a human-redable keyCode

        // charCode will contain the raw character code in a kp event
        // charString will contain the actual character

        Here are some of my notes:

            FF key event behavior:
            key event   charCode    keyCode
            DOWN    ku,kd   0           40
            DOWN    kp      0           40
            ESC     ku,kd   0           27
            ESC     kp      0           27
            a       ku,kd   0           65
            a       kp      97          0
            shift+a ku,kd   0           65
            shift+a kp      65          0
            1       ku,kd   0           49
            1       kp      49          0
            shift+1 ku,kd   0           0
            shift+1 kp      33          0

            IE key event behavior:
            key     event   keyCode
            DOWN    ku,kd   40
            DOWN    kp      undefined
            ESC     ku,kd   27
            ESC     kp      27
            a       ku,kd   65
            a       kp      97
            shift+a ku,kd   65
            shift+a kp      65
            1       ku,kd   49
            1       kp      49
            shift+1 ku,kd   49
            shift+1 kp      33

            Safari key event behavior:
            key     event   charCode    keyCode
            DOWN    ku,kd   63233       40
            DOWN    kp      63233       63233
            ESC     ku,kd   27          27
            ESC     kp      27          27
            a       ku,kd   97          65
            a       kp      97          97
            shift+a ku,kd   65          65
            shift+a kp      65          65
            1       ku,kd   49          49
            1       kp      49          49
            shift+1 ku,kd   33          49
            shift+1 kp      33          33

        */

        // look for special keys here
        if (this.type() == 'keydown' || this.type() == 'keyup') {
            k.code = this._event.keyCode;
            k.string = (MochiKit.Signal._specialKeys[k.code] ||
                'KEY_UNKNOWN');
            return k;
        // look for unicode characters here
        } else if (this.type() == 'keypress') {
            k.code = (this._event.charCode || this._event.keyCode);
            // special keys don't have a character
            if (MochiKit.Signal._specialKeys[k.code]) {
                // remind users not to look for special chars in keypress
                // FIXME: throw an exception instead?
                return undefined;
            } else {
                k.string = String.fromCharCode(k.code);
            }
            return k;
        }
    }
    // FIXME: throw an exception instead?
    return undefined;
};

MochiKit.Signal.Event.prototype._fixPoint = function (point) {
    // maybe this should be an inline function?
    if (typeof(point) == 'undefined' || point < 0) {
        return 0;
    }
    return point;
};

MochiKit.Signal.Event.prototype.mouse = function () {
    // mouse events
    var m = {};
    if (this.type() && (
        this.type().indexOf('mouse') === 0 ||
        this.type().indexOf('click') != -1 ||
        this.type() == 'contextmenu')) {

        m.client = new MochiKit.DOM.Coordinates(0, 0);
        if (this._event.clientX || this._event.clientY) {
            m.client.x = this._fixPoint(this._event.clientX);
            m.client.y = this._fixPoint(this._event.clientY);
        }

        m.page = new MochiKit.DOM.Coordinates(0, 0);
        if (this._event.pageX || this._event.pageY) {
            m.page.x = this._fixPoint(this._event.pageX);
            m.page.y = this._fixPoint(this._event.pageY);
        } else {
            // IE keeps its document offset in
            // document.documentElement.clientTop

            // see http://msdn.microsoft.com/workshop/author/dhtml/reference/
            //     methods/getboundingclientrect.asp

            // the offset is (2,2) in standards mode and (0,0) in quirks mode
            m.page.x = (this._event.clientX +
                (document.documentElement.scrollLeft ||
                document.body.scrollLeft) -
                document.documentElement.clientLeft);
            m.page.y = (this._event.clientY +
                (document.documentElement.scrollTop ||
                document.body.scrollTop) -
                document.documentElement.clientTop);
        }
        if (this.type() != 'mousemove') {
            m.button = {};
            m.button.left = false;
            m.button.right = false;
            m.button.middle = false;

            // we could check this._event.button, but which is more consistent
            if (this._event.which) {
                m.button.left = (this._event.which == 1);
                m.button.middle = (this._event.which == 2);
                m.button.right = (this._event.which == 3);

                // mac browsers and right click:
                // safari doesn't fire any click events on a right click
                // firefox fires the event, and sets ctrlKey = true
                // opera fires the event, and sets metaKey = true
                // oncontextmenu can detect right clicks between browsers and
                // across platforms

            } else {
                m.button.left = !!(this._event.button & 1);
                m.button.right = !!(this._event.button & 2);
                m.button.middle = !!(this._event.button & 4);
            }
        }
        return m;
    }
    // FIXME: throw an exception instead?
    return undefined;
};

MochiKit.Signal.Event.prototype.stop = function () {
    this.stopPropagation();
    this.preventDefault();
};

MochiKit.Signal.Event.prototype.stopPropagation = function () {
    if (this._event.stopPropagation) {
        this._event.stopPropagation();
    } else {
        this._event.cancelBubble = true;
    }
};

MochiKit.Signal.Event.prototype.preventDefault = function () {
    if (this._event.preventDefault) {
        this._event.preventDefault();
    } else {
        this._event.returnValue = false;
    }
};

MochiKit.Signal.Event.prototype.repr = function () {
    var repr = MochiKit.Base.repr;
    var str = '{event(): ' + repr(this.event()) +
        ', type(): ' + repr(this.type()) +
        ', target(): ' + repr(this.target()) +
        ', modifier(): ' + '{alt: ' + repr(this.modifier().alt) +
        ', ctrl: ' + repr(this.modifier().ctrl) +
        ', meta: ' + repr(this.modifier().meta) +
        ', shift: ' + repr(this.modifier().shift) + '}';

    if (this.type() && this.type().indexOf('key') === 0) {
        str += ', key(): {code: ' + repr(this.key().code) +
            ', string: ' + repr(this.key().string) + '}';
    }

    if (this.type() && (
        this.type().indexOf('mouse') === 0 ||
        this.type().indexOf('click') != -1 ||
        this.type() == 'contextmenu')) {

        str += ', mouse(): {page: ' + repr(this.mouse().page) +
            ', client: ' + repr(this.mouse().client);

        if (this.type() != 'mousemove') {
            str += ', button: {left: ' + repr(this.mouse().button.left) +
                ', middle: ' + repr(this.mouse().button.middle) +
                ', right: ' + repr(this.mouse().button.right) + '}}';
        } else {
            str += '}';
        }
    }
    if (this.type() == 'mouseover' || this.type() == 'mouseout') {
        str += ', relatedTarget(): ' + repr(this.relatedTarget());
    }
    str += '}';
    return str;
};

MochiKit.Base.update(MochiKit.Signal, {

    __repr__: function () {
        return '[' + this.NAME + ' ' + this.VERSION + ']';
    },

    toString: function () {
        return this.__repr__();
    },

    // this is straight out of Dojo
    _specialKeys: {
        8: 'KEY_BACKSPACE',
        9: 'KEY_TAB',
        13: 'KEY_ENTER',
        16: 'KEY_SHIFT',
        17: 'KEY_CTRL',
        18: 'KEY_ALT',
        19: 'KEY_PAUSE',
        20: 'KEY_CAPS_LOCK',
        27: 'KEY_ESCAPE',
        32: 'KEY_SPACE',
        33: 'KEY_PAGE_UP',
        34: 'KEY_PAGE_DOWN',
        35: 'KEY_END',
        36: 'KEY_HOME',
        37: 'KEY_LEFT_ARROW',
        38: 'KEY_UP_ARROW',
        39: 'KEY_RIGHT_ARROW',
        40: 'KEY_DOWN_ARROW',
        45: 'KEY_INSERT',
        46: 'KEY_DELETE',
        91: 'KEY_LEFT_WINDOW',
        92: 'KEY_RIGHT_WINDOW',
        93: 'KEY_SELECT',
        112: 'KEY_F1',
        113: 'KEY_F2',
        114: 'KEY_F3',
        115: 'KEY_F4',
        116: 'KEY_F5',
        117: 'KEY_F6',
        118: 'KEY_F7',
        119: 'KEY_F8',
        120: 'KEY_F9',
        121: 'KEY_F10',
        122: 'KEY_F11',
        123: 'KEY_F12',
        144: 'KEY_NUM_LOCK',
        145: 'KEY_SCROLL_LOCK'
        // undefined: 'KEY_UNKNOWN'
    },

    _getSlot: function (slot, func) {
        if (typeof(func) == 'string' || typeof(func) == 'function') {
            slot = [slot, func];
        } else if (!func && typeof(slot) == 'function') {
            slot = [slot];
        } else {
            throw new Error('Invalid slot parameters');
        }

        return slot;
    },

    _unloadCache: function () {
        for (var i = 0; i < MochiKit.Signal._observers.length; i++) {
            var src = MochiKit.Signal._observers[i][0];
            var sig = MochiKit.Signal._observers[i][1];
            var listener = MochiKit.Signal._observers[i][2];

            try {
                if (src.addEventListener) {
                    src.removeEventListener(sig.substr(2), listener, false);
                } else if (src.attachEvent) {
                    src.detachEvent(sig, listener);
                } else {
                    src.__signals[sig] = undefined;
                }

                src.__listeners[sig] = undefined;

                // delete removes object properties, not variables
                delete(src.__listeners);
                delete(src.__signals);

            } catch(e) {
                // clean IE garbage
            }
        }

        MochiKit.Signal._observers = undefined;

        try {
            window.onload = undefined;
        } catch(e) {
            // clean IE garbage
        }

        try {
            window.onunload = undefined;
        } catch(e) {
            // clean IE garbage
        }
    },

    connect: function (src, sig, slot, /* optional */func) {
        /***

        Connects a signal to a slot.

        'src' is the object that has the signal. You may pass in a string, in
        which case, it is interpreted as an id for an HTML Element.

        'signal' is a string that represents a signal name. If 'src' is an
        HTML Element, Window, or the Document, then it can be one of the
        'on-XYZ' events. Note that you must include the 'on' prefix, and it
        must be all lower-case. If 'src' is another kind of object, the signal
        must be previously registered with 'registerSignals()'.

        'dest' and 'func' describe the slot, or the action to take when the
        signal is triggered.

            -   If 'dest' is an object and 'func' is a string, then
                'dest[func](...)' will be called when the signal is signalled.

            -   If 'dest' is an object and 'func' is a function, then
                'func.apply(dest, ...)' will be called when the signal is
                signalled.

            -   If 'func' is undefined and 'dest' is a function, then
                'func.apply(src, ...)' will be called when the signal is
                signalled.

        No other combinations are allowed and should raise and exception.

        You may call 'connect()' multiple times with the same connection
        paramters. However, only a single connection will be made.

        ***/
        if (typeof(src) == 'string') {
            src = MochiKit.DOM.getElement(src);
        }

        if (typeof(sig) != 'string') {
            throw new Error("'sig' must be a string");
        }

        slot = MochiKit.Signal._getSlot(slot, func);

        // Find the signal, attach the slot.

        // DOM object
        if (src.addEventListener || src.attachEvent || src[sig]) {
            // Create the __listeners object. This will help us remember which
            // events we are watching.
            if (!src.__listeners) {
                src.__listeners = {};
            }

            // Add the signal connector if it hasn't been done already.
            if (!src.__listeners[sig]) {
                var listener = function (nativeEvent) {
                    var eventObject = new MochiKit.Signal.Event(nativeEvent);
                    MochiKit.Signal.signal(src, sig, eventObject);
                    return true;
                };
                MochiKit.Signal._observers.push([src, sig, listener]);

                if (src.addEventListener) {
                    src.addEventListener(sig.substr(2), listener, false);
                } else if (src.attachEvent) {
                    src.attachEvent(sig, listener);
                } else {
                    src[sig] = listener;
                }

                src.__listeners[sig] = listener;
            }

            if (!src.__signals) {
                src.__signals = {};
            }
            if (!src.__signals[sig]) {
                src.__signals[sig] = [];
            }
        } else {
            if (!src.__signals || !src.__signals[sig]) {
                throw new Error("No such signal '" + sig + "' registered.");
            }
        }

        // Actually add the slot... if it isn't there already.
        var signals = src.__signals[sig];
        for (var i = 0; i < signals.length; i++) {
            var s = signals[i];
            if (slot[0] === s[0] && slot[1] === s[1] && slot[2] === s[2]) {
                return;
            }
        }
        signals.push(slot);
    },

    disconnect: function (src, sig, slot, /* optional */func) {
        /***

        When 'disconnect()' is called, it will disconnect whatever connection
        was made given the same parameters to 'connect()'. Note that if you
        want to pass a closure to 'connect()', you'll have to remember it if
        you want to later 'disconnect()' it.

        ***/
        if (typeof(src) == 'string') {
            src = MochiKit.DOM.getElement(src);
        }

        if (typeof(sig) != 'string') {
            throw new Error("'signal' must be a string");
        }

        slot = MochiKit.Signal._getSlot(slot, func);

        if (src.__signals && src.__signals[sig]) {
            var signals = src.__signals[sig];
            var origlen = signals.length;
            for (var i = 0; i < signals.length; i++) {
                var s = signals[i];
                if (s[0] === slot[0] && s[1] === slot[1] && s[2] === slot[2]) {
                    signals.splice(i, 1);
                    break;
                }
            }
        }

        if (src.addEventListener || src.attachEvent || src.__signals[sig]) {
            // DOM object

            // Stop listening if there are no connected slots.
            if (src.__listeners && src.__listeners[sig] &&
                src.__signals[sig].length === 0) {

                var listener = src.__listeners[sig];

                if (src.addEventListener) {
                    src.removeEventListener(sig.substr(2), listener, false);
                } else if (src.attachEvent) {
                    src.detachEvent(sig, listener);
                } else {
                    src.__signals[sig] = undefined;
                }

                var observers = MochiKit.Signal._observers;
                for (var i = 0; i < observers.length; i++) {
                    var o = observers[i];
                    if (o[0] === src && o[1] === sig && o[2] === listener) {
                        observers.splice(i, 1);
                        break;
                    }
                }
                src.__listeners[sig] = undefined;
            }
        }
    },

    signal: function (src, sig) {
        /***

        This will signal a signal, passing whatever additional parameters
        on to the connected slots. 'src' and 'signal' are the same as for
        'connect()'.

        ***/
        if (typeof(src) == 'string') {
            src = MochiKit.DOM.getElement(src);
        }

        if (typeof(sig) != 'string') {
            throw new Error("'signal' must be a string");
        }

        if (!src.__signals || !src.__signals[sig]) {
            if (src.addEventListener || src.attachEvent || src[sig]) {
                // Ignored.
                return;
            } else {
                throw new Error("No such signal '" + sig + "'");
            }
        }
        var slots = src.__signals[sig];

        var args = MochiKit.Base.extend(null, arguments, 2);

        var slot;
        var errors = [];
        for (var i = 0; i < slots.length; i++) {
            slot = slots[i];
            try {
                if (slot.length == 1) {
                    slot[0].apply(src, args);
                } else {
                    if (typeof(slot[1]) == 'string') {
                        slot[0][slot[1]].apply(slot[0], args);
                    } else {
                        slot[1].apply(slot[0], args);
                    }
                }
            } catch (e) {
                errors.push(e);
            }
        }
        if (errors.length) {
            var e = new Error("There were errors in handling signal 'sig'.");
            e.errors = errors;
            throw e;
        }
    },

    registerSignals: function (src, signals) {
        /***

        This will register signals for the object 'src'. (Note that a string
        here is not allowed--you don't need to register signals for DOM
        objects.) 'signals' is an array of strings.

        You may register the same signals multiple times; subsequent register
        calls with the same signal names will have no effect, and the existing
        connections, if any, will not be lost.

        ***/
        if (!src.__signals) {
            src.__signals = {
                /*
                __repr__: function () {
                    var m = MochiKit.Base;
                    var signals = m.items(this);
                    signals = m.filter(
                        function (a) { return a[0] != "__repr__"; },
                        signals
                    );
                    signals.sort(m.compare);
                    return (
                        '{\n    ' + m.map(
                            function (a) {
                                return m.map(m.repr, a).join(": ")
                            },
                            signals
                        ).join(",\n    ") + "\n}"
                    );
                }
                */
            };
        }

        for (var i = 0; i < signals.length; i++) {
            var sig = signals[i];
            if (!src.__signals[sig]) {
                src.__signals[sig] = [];
            }
        }
    }
});

MochiKit.Signal.EXPORT_OK = [];

MochiKit.Signal.EXPORT = [
    'connect',
    'disconnect',
    'signal',
    'registerSignals'
];

MochiKit.Signal.__new__ = function (win) {
    var m = MochiKit.Base;
    this._document = document;
    this._window = win;

    try {
        this.connect(window, 'onunload', this._unloadCache);
    } catch (e) {
        // pass: might not be a browser
    }

    this.EXPORT_TAGS = {
        ':common': this.EXPORT,
        ':all': m.concat(this.EXPORT, this.EXPORT_OK)
    };

    m.nameFunctions(this);

};

MochiKit.Signal.__new__(this);

MochiKit.Base._exportSymbols(this, MochiKit.Signal);

/***

MochiKit.Visual 1.3

See <http://mochikit.com/> for documentation, downloads, license, etc.

(c) 2005 Bob Ippolito and others.  All rights Reserved.

***/

if (typeof(dojo) != 'undefined') {
    dojo.provide('MochiKit.Visual');
    dojo.require('MochiKit.Base');
    dojo.require('MochiKit.DOM');
    dojo.require('MochiKit.Color');
}

if (typeof(JSAN) != 'undefined') {
    JSAN.use("MochiKit.Base", []);
    JSAN.use("MochiKit.DOM", []);
    JSAN.use("MochiKit.Color", []);
}

try {
    if (typeof(MochiKit.Base) == 'undefined' ||
        typeof(MochiKit.DOM) == 'undefined' ||
        typeof(MochiKit.Color) == 'undefined') {
        throw "";
    }
} catch (e) {
    throw "MochiKit.Visual depends on MochiKit.Base, MochiKit.DOM and MochiKit.Color!";
}

if (typeof(MochiKit.Visual) == "undefined") {
    MochiKit.Visual = {};
}

MochiKit.Visual.NAME = "MochiKit.Visual";
MochiKit.Visual.VERSION = "1.3";

MochiKit.Visual.__repr__ = function () {
    return "[" + this.NAME + " " + this.VERSION + "]";
};

MochiKit.Visual.toString = function () {
    return this.__repr__();
};


MochiKit.Visual._RoundCorners = function (e, options) {
    e = MochiKit.DOM.getElement(e);
    this._setOptions(options);
    if (this.options.__unstable__wrapElement) {
        e = this._doWrap(e);
    }

    var color = this.options.color;
    var C = MochiKit.Color.Color;
    if (this.options.color == "fromElement") {
        color = C.fromBackground(e);
    } else if (!(color instanceof C)) {
        color = C.fromString(color);
    }
    this.isTransparent = (color.asRGB().a <= 0);

    var bgColor = this.options.bgColor;
    if (this.options.bgColor == "fromParent") {
        bgColor = C.fromBackground(e.offsetParent);
    } else if (!(bgColor instanceof C)) {
        bgColor = C.fromString(bgColor);
    }

    this._roundCornersImpl(e, color, bgColor);
};

MochiKit.Visual._RoundCorners.prototype = {
    _doWrap: function (e) {
        var parent = e.parentNode;
        var doc = MochiKit.DOM.currentDocument();
        if (typeof(doc.defaultView) == "undefined"
            || doc.defaultView == null) {
            return e;
        }
        var style = doc.defaultView.getComputedStyle(e, null);
        if (typeof(style) == "undefined" || style == null) {
            return e;
        }
        var wrapper = MochiKit.DOM.DIV({"style": {
            display: "block",
            // convert padding to margin
            marginTop: style.getPropertyValue("padding-top"),
            marginRight: style.getPropertyValue("padding-right"),
            marginBottom: style.getPropertyValue("padding-bottom"),
            marginLeft: style.getPropertyValue("padding-left"),
            // remove padding so the rounding looks right
            padding: "0px"
            /*
            paddingRight: "0px",
            paddingLeft: "0px"
            */
        }});
        wrapper.innerHTML = e.innerHTML;
        e.innerHTML = "";
        e.appendChild(wrapper);
        return e;
    },

    _roundCornersImpl: function (e, color, bgColor) {
        if (this.options.border) {
            this._renderBorder(e, bgColor);
        }
        if (this._isTopRounded()) {
            this._roundTopCorners(e, color, bgColor);
        }
        if (this._isBottomRounded()) {
            this._roundBottomCorners(e, color, bgColor);
        }
    },

    _renderBorder: function (el, bgColor) {
        var borderValue = "1px solid " + this._borderColor(bgColor);
        var borderL = "border-left: "  + borderValue;
        var borderR = "border-right: " + borderValue;
        var style   = "style='" + borderL + ";" + borderR +  "'";
        el.innerHTML = "<div " + style + ">" + el.innerHTML + "</div>";
    },

    _roundTopCorners: function (el, color, bgColor) {
        var corner = this._createCorner(bgColor);
        for (var i = 0; i < this.options.numSlices; i++) {
            corner.appendChild(
                this._createCornerSlice(color, bgColor, i, "top")
            );
        }
        el.style.paddingTop = 0;
        el.insertBefore(corner, el.firstChild);
    },

    _roundBottomCorners: function (el, color, bgColor) {
        var corner = this._createCorner(bgColor);
        for (var i = (this.options.numSlices - 1); i >= 0; i--) {
            corner.appendChild(
                this._createCornerSlice(color, bgColor, i, "bottom")
            );
        }
        el.style.paddingBottom = 0;
        el.appendChild(corner);
    },

    _createCorner: function (bgColor) {
        var dom = MochiKit.DOM;
        return dom.DIV({style: {backgroundColor: bgColor.toString()}});
    },

    _createCornerSlice: function (color, bgColor, n, position) {
        var slice = MochiKit.DOM.SPAN();

        var inStyle = slice.style;
        inStyle.backgroundColor = color.toString();
        inStyle.display = "block";
        inStyle.height = "1px";
        inStyle.overflow = "hidden";
        inStyle.fontSize = "1px";

        var borderColor = this._borderColor(color, bgColor);
        if (this.options.border && n == 0) {
            inStyle.borderTopStyle = "solid";
            inStyle.borderTopWidth = "1px";
            inStyle.borderLeftWidth = "0px";
            inStyle.borderRightWidth = "0px";
            inStyle.borderBottomWidth = "0px";
            // assumes css compliant box model
            inStyle.height = "0px";
            inStyle.borderColor = borderColor.toString();
        } else if (borderColor) {
            inStyle.borderColor = borderColor.toString();
            inStyle.borderStyle = "solid";
            inStyle.borderWidth = "0px 1px";
        }

        if (!this.options.compact && (n == (this.options.numSlices - 1))) {
            inStyle.height = "2px";
        }

        this._setMargin(slice, n, position);
        this._setBorder(slice, n, position);

        return slice;
    },

    _setOptions: function (options) {
        this.options = {
            corners: "all",
            color: "fromElement",
            bgColor: "fromParent",
            blend: true,
            border: false,
            compact: false,
            __unstable__wrapElement: false
        };
        MochiKit.Base.update(this.options, options);

        this.options.numSlices = (this.options.compact ? 2 : 4);
    },

    _whichSideTop: function () {
        var corners = this.options.corners;
        if (this._hasString(corners, "all", "top")) {
            return "";
        }

        var has_tl = (corners.indexOf("tl") != -1);
        var has_tr = (corners.indexOf("tr") != -1);
        if (has_tl && has_tr) {
            return "";
        }
        if (has_tl) {
            return "left";
        }
        if (has_tr) {
            return "right";
        }
        return "";
    },

    _whichSideBottom: function () {
        var corners = this.options.corners;
        if (this._hasString(corners, "all", "bottom")) {
            return "";
        }

        var has_bl = (corners.indexOf('bl') != -1);
        var has_br = (corners.indexOf('br') != -1);
        if (has_bl && has_br) {
            return "";
        }
        if (has_bl) {
            return "left";
        }
        if (has_br) {
            return "right";
        }
        return "";
    },

    _borderColor: function (color, bgColor) {
        if (color == "transparent") {
            return bgColor;
        } else if (this.options.border) {
            return this.options.border;
        } else if (this.options.blend) {
            return bgColor.blendedColor(color);
        }
        return "";
    },


    _setMargin: function (el, n, corners) {
        var marginSize = this._marginSize(n) + "px";
        var whichSide = (
            corners == "top" ? this._whichSideTop() : this._whichSideBottom()
        );
        var style = el.style;

        if (whichSide == "left") {
            style.marginLeft = marginSize;
            style.marginRight = "0px";
        } else if (whichSide == "right") {
            style.marginRight = marginSize;
            style.marginLeft  = "0px";
        } else {
            style.marginLeft = marginSize;
            style.marginRight = marginSize;
        }
    },

    _setBorder: function (el, n, corners) {
        var borderSize = this._borderSize(n) + "px";
        var whichSide = (
            corners == "top" ? this._whichSideTop() : this._whichSideBottom()
        );

        var style = el.style;
        if (whichSide == "left") {
            style.borderLeftWidth = borderSize;
            style.borderRightWidth = "0px";
        } else if (whichSide == "right") {
            style.borderRightWidth = borderSize;
            style.borderLeftWidth  = "0px";
        } else {
            style.borderLeftWidth = borderSize;
            style.borderRightWidth = borderSize;
        }
    },

    _marginSize: function (n) {
        if (this.isTransparent) {
            return 0;
        }

        var o = this.options;
        if (o.compact && o.blend) {
            var smBlendedMarginSizes = [1, 0];
            return smBlendedMarginSizes[n];
        } else if (o.compact) {
            var compactMarginSizes = [2, 1];
            return compactMarginSizes[n];
        } else if (o.blend) {
            var blendedMarginSizes = [3, 2, 1, 0];
            return blendedMarginSizes[n];
        } else {
            var marginSizes = [5, 3, 2, 1];
            return marginSizes[n];
        }
    },

    _borderSize: function (n) {
        var o = this.options;
        var borderSizes;
        if (o.compact && (o.blend || this.isTransparent)) {
            return 1;
        } else if (o.compact) {
            borderSizes = [1, 0];
        } else if (o.blend) {
            borderSizes = [2, 1, 1, 1];
        } else if (o.border) {
            borderSizes = [0, 2, 0, 0];
        } else if (this.isTransparent) {
            borderSizes = [5, 3, 2, 1];
        } else {
            return 0;
        }
        return borderSizes[n];
    },

    _hasString: function (str) {
        for (var i = 1; i< arguments.length; i++) {
            if (str.indexOf(arguments[i]) != -1) {
                return true;
            }
        }
        return false;
    },

    _isTopRounded: function () {
        return this._hasString(this.options.corners,
            "all", "top", "tl", "tr"
        );
    },

    _isBottomRounded: function () {
        return this._hasString(this.options.corners,
            "all", "bottom", "bl", "br"
        );
    },

    _hasSingleTextChild: function (el) {
        return (el.childNodes.length == 1 && el.childNodes[0].nodeType == 3);
    }
};

MochiKit.Visual.roundElement = function (e, options) {
    new MochiKit.Visual._RoundCorners(e, options);
};

MochiKit.Visual.roundClass = function (tagName, className, options) {
    var elements = MochiKit.DOM.getElementsByTagAndClassName(
        tagName, className
    );
    for (var i = 0; i < elements.length; i++) {
        MochiKit.Visual.roundElement(elements[i], options);
    }
};

// Compatibility with MochiKit 1.0
MochiKit.Visual.Color = MochiKit.Color.Color;
MochiKit.Visual.getElementsComputedStyle = MochiKit.DOM.computedStyle;

/* end of Rico adaptation */

MochiKit.Visual.__new__  = function () {
    var m = MochiKit.Base;

    m.nameFunctions(this);

    this.EXPORT_TAGS = {
        ":common": this.EXPORT,
        ":all": m.concat(this.EXPORT, this.EXPORT_OK)
    };

};

MochiKit.Visual.EXPORT = [
    "roundElement",
    "roundClass"
];

MochiKit.Visual.EXPORT_OK = [];

MochiKit.Visual.__new__();

MochiKit.Base._exportSymbols(this, MochiKit.Visual);
