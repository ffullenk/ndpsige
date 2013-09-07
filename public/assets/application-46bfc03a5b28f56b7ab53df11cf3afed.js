/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);













(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  cacheSize = 10;

  currentState = null;

  referer = null;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  fetchReplacement = function(url) {
    var safeUrl;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(position) {
    var page;
    cacheCurrentPage();
    page = pageCache[position];
    if (xhr != null) {
      xhr.abort();
    }
    changePage(page.title, page.body);
    recallScrollPosition(page);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref1;
      return (400 <= (_ref1 = xhr.status) && _ref1 < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref1, _results;
      _ref1 = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        node = _ref1[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.src || node.href);
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref1, _results;
      if (a.length > b.length) {
        _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var state;
      state = event.state;
      if (state != null ? state.turbolinks : void 0) {
        if (pageCache[state.position]) {
          return fetchHistory(state.position);
        } else {
          return visit(event.target.location.href);
        }
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    visit = function(url) {
      referer = document.location.href;
      cacheCurrentPage();
      return fetchReplacement(url);
    };
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached
  };

}).call(this);
(function() {


}).call(this);
(function() {
  jQuery(function() {
    $("a[rel~=popover], .has-popover").popover();
    return $("a[rel~=tooltip], .has-tooltip").tooltip();
  });

}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*!
 * FullCalendar v1.6.1
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */


(function(e,t){function n(t){e.extend(!0,yt,t)}function r(n,r,f){function l(e){Y?(T(),x(),_(),b(e)):c()}function c(){Z=r.theme?"ui":"fc",n.addClass("fc"),r.isRTL?n.addClass("fc-rtl"):n.addClass("fc-ltr"),r.theme&&n.addClass("ui-widget"),Y=e("<div class='fc-content' style='position:relative'/>").prependTo(n),Q=new i(K,r),G=Q.render(),G&&n.prepend(G),y(r.defaultView),e(window).resize(C),g()||p()}function p(){setTimeout(function(){!et.start&&g()&&b()},0)}function d(){e(window).unbind("resize",C),Q.destroy(),Y.remove(),n.removeClass("fc fc-rtl ui-widget")}function v(){return 0!==ut.offsetWidth}function g(){return 0!==e("body")[0].offsetWidth}function y(t){if(!et||t!=et.name){lt++,P();var n,r=et;r?((r.beforeHide||R)(),q(Y,Y.height()),r.element.hide()):q(Y,1),Y.css("overflow","hidden"),et=at[t],et?et.element.show():et=at[t]=new Et[t](n=rt=e("<div class='fc-view fc-view-"+t+"' style='position:absolute'/>").appendTo(Y),K),r&&Q.deactivateButton(r.name),Q.activateButton(t),b(),Y.css("overflow",""),r&&q(Y,1),n||(et.afterShow||R)(),lt--}}function b(e){if(v()){lt++,P(),nt===t&&T();var r=!1;!et.start||e||et.start>ct||ct>=et.end?(et.render(ct,e||0),N(!0),r=!0):et.sizeDirty?(et.clearEvents(),N(),r=!0):et.eventsDirty&&(et.clearEvents(),r=!0),et.sizeDirty=!1,et.eventsDirty=!1,k(r),tt=n.outerWidth(),Q.updateTitle(et.title);var i=new Date;i>=et.start&&et.end>i?Q.disableButton("today"):Q.enableButton("today"),lt--,et.trigger("viewDisplay",ut)}}function S(){x(),v()&&(T(),N(),P(),et.clearEvents(),et.renderEvents(ht),et.sizeDirty=!1)}function x(){e.each(at,function(e,t){t.sizeDirty=!0})}function T(){nt=r.contentHeight?r.contentHeight:r.height?r.height-(G?G.height():0)-B(Y):Math.round(Y.width()/Math.max(r.aspectRatio,.5))}function N(e){lt++,et.setHeight(nt,e),rt&&(rt.css("position","relative"),rt=null),et.setWidth(Y.width(),e),lt--}function C(){if(!lt)if(et.start){var e=++ft;setTimeout(function(){e==ft&&!lt&&v()&&tt!=(tt=n.outerWidth())&&(lt++,S(),et.trigger("windowResize",ut),lt--)},200)}else p()}function k(e){!r.lazyFetching||st(et.visStart,et.visEnd)?L():e&&M()}function L(){ot(et.visStart,et.visEnd)}function A(e){ht=e,M()}function O(e){M(e)}function M(e){_(),v()&&(et.clearEvents(),et.renderEvents(ht,e),et.eventsDirty=!1)}function _(){e.each(at,function(e,t){t.eventsDirty=!0})}function D(e,n,r){et.select(e,n,r===t?!0:r)}function P(){et&&et.unselect()}function H(){b(-1)}function j(){b(1)}function F(){o(ct,-1),b()}function I(){o(ct,1),b()}function U(){ct=new Date,b()}function z(e,t,n){e instanceof Date?ct=h(e):m(ct,e,t,n),b()}function W(e,n,r){e!==t&&o(ct,e),n!==t&&u(ct,n),r!==t&&a(ct,r),b()}function X(){return h(ct)}function V(){return et}function $(e,n){return n===t?r[e]:(("height"==e||"contentHeight"==e||"aspectRatio"==e)&&(r[e]=n,S()),t)}function J(e,n){return r[e]?r[e].apply(n||ut,Array.prototype.slice.call(arguments,2)):t}var K=this;K.options=r,K.render=l,K.destroy=d,K.refetchEvents=L,K.reportEvents=A,K.reportEventChange=O,K.rerenderEvents=M,K.changeView=y,K.select=D,K.unselect=P,K.prev=H,K.next=j,K.prevYear=F,K.nextYear=I,K.today=U,K.gotoDate=z,K.incrementDate=W,K.formatDate=function(e,t){return w(e,t,r)},K.formatDates=function(e,t,n){return E(e,t,n,r)},K.getDate=X,K.getView=V,K.option=$,K.trigger=J,s.call(K,r,f);var Q,G,Y,Z,et,tt,nt,rt,it,st=K.isFetchNeeded,ot=K.fetchEvents,ut=n[0],at={},ft=0,lt=0,ct=new Date,ht=[];m(ct,r.year,r.month,r.date),r.droppable&&e(document).bind("dragstart",function(t,n){var i=t.target,s=e(i);if(!s.parents(".fc").length){var o=r.dropAccept;(e.isFunction(o)?o.call(i,s):s.is(o))&&(it=i,et.dragStart(it,t,n))}}).bind("dragstop",function(e,t){it&&(et.dragStop(it,e,t),it=null)})}function i(n,r){function i(){p=r.theme?"ui":"fc";var n=r.header;return n?d=e("<table class='fc-header' style='width:100%'/>").append(e("<tr/>").append(o("left")).append(o("center")).append(o("right"))):t}function s(){d.remove()}function o(t){var i=e("<td class='fc-header-"+t+"'/>"),s=r.header[t];return s&&e.each(s.split(" "),function(t){t>0&&i.append("<span class='fc-header-space'/>");var s;e.each(this.split(","),function(t,o){if("title"==o)i.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>"),s&&s.addClass(p+"-corner-right"),s=null;else{var u;if(n[o]?u=n[o]:Et[o]&&(u=function(){l.removeClass(p+"-state-hover"),n.changeView(o)}),u){var a=r.theme?X(r.buttonIcons,o):null,f=X(r.buttonText,o),l=e("<span class='fc-button fc-button-"+o+" "+p+"-state-default'>"+(a?"<span class='fc-icon-wrap'><span class='ui-icon ui-icon-"+a+"'/>"+"</span>":f)+"</span>").click(function(){l.hasClass(p+"-state-disabled")||u()}).mousedown(function(){l.not("."+p+"-state-active").not("."+p+"-state-disabled").addClass(p+"-state-down")}).mouseup(function(){l.removeClass(p+"-state-down")}).hover(function(){l.not("."+p+"-state-active").not("."+p+"-state-disabled").addClass(p+"-state-hover")},function(){l.removeClass(p+"-state-hover").removeClass(p+"-state-down")}).appendTo(i);J(l),s||l.addClass(p+"-corner-left"),s=l}}}),s&&s.addClass(p+"-corner-right")}),i}function u(e){d.find("h2").html(e)}function a(e){d.find("span.fc-button-"+e).addClass(p+"-state-active")}function f(e){d.find("span.fc-button-"+e).removeClass(p+"-state-active")}function l(e){d.find("span.fc-button-"+e).addClass(p+"-state-disabled")}function c(e){d.find("span.fc-button-"+e).removeClass(p+"-state-disabled")}var h=this;h.render=i,h.destroy=s,h.updateTitle=u,h.activateButton=a,h.deactivateButton=f,h.disableButton=l,h.enableButton=c;var p,d=e([])}function s(n,r){function i(e,t){return!T||T>e||t>N}function s(e,t){T=e,N=t,P=[];var n=++M,r=O.length;_=r;for(var i=0;r>i;i++)o(O[i],n)}function o(t,r){u(t,function(i){if(r==M){if(i){n.eventDataTransform&&(i=e.map(i,n.eventDataTransform)),t.eventDataTransform&&(i=e.map(i,t.eventDataTransform));for(var s=0;i.length>s;s++)i[s].source=t,b(i[s]);P=P.concat(i)}_--,_||L(P)}})}function u(r,i){var s,o,a=wt.sourceFetchers;for(s=0;a.length>s;s++){if(o=a[s](r,T,N,i),o===!0)return;if("object"==typeof o)return u(o,i),t}var f=r.events;if(f)e.isFunction(f)?(m(),f(h(T),h(N),function(e){i(e),y()})):e.isArray(f)?i(f):i();else{var l=r.url;if(l){var c=r.success,p=r.error,d=r.complete,v=e.extend({},r.data||{}),g=Z(r.startParam,n.startParam),b=Z(r.endParam,n.endParam);g&&(v[g]=Math.round(+T/1e3)),b&&(v[b]=Math.round(+N/1e3)),m(),e.ajax(e.extend({},St,r,{data:v,success:function(t){t=t||[];var n=Y(c,this,arguments);e.isArray(n)&&(t=n),i(t)},error:function(){Y(p,this,arguments),i()},complete:function(){Y(d,this,arguments),y()}}))}else i()}}function a(e){e=f(e),e&&(_++,o(e,M))}function f(n){return e.isFunction(n)||e.isArray(n)?n={events:n}:"string"==typeof n&&(n={url:n}),"object"==typeof n?(w(n),O.push(n),n):t}function l(t){O=e.grep(O,function(e){return!E(e,t)}),P=e.grep(P,function(e){return!E(e.source,t)}),L(P)}function c(e){var t,n,r=P.length,i=k().defaultEventEnd,s=e.start-e._start,o=e.end?e.end-(e._end||i(e)):0;for(t=0;r>t;t++)n=P[t],n._id==e._id&&n!=e&&(n.start=new Date(+n.start+s),n.end=e.end?n.end?new Date(+n.end+o):new Date(+i(n)+o):null,n.title=e.title,n.url=e.url,n.allDay=e.allDay,n.className=e.className,n.editable=e.editable,n.color=e.color,n.backgroudColor=e.backgroudColor,n.borderColor=e.borderColor,n.textColor=e.textColor,b(n));b(e),L(P)}function p(e,t){b(e),e.source||(t&&(A.events.push(e),e.source=A),P.push(e)),L(P)}function d(t){if(t){if(!e.isFunction(t)){var n=t+"";t=function(e){return e._id==n}}P=e.grep(P,t,!0);for(var r=0;O.length>r;r++)e.isArray(O[r].events)&&(O[r].events=e.grep(O[r].events,t,!0))}else{P=[];for(var r=0;O.length>r;r++)e.isArray(O[r].events)&&(O[r].events=[])}L(P)}function v(t){return e.isFunction(t)?e.grep(P,t):t?(t+="",e.grep(P,function(e){return e._id==t})):P}function m(){D++||C("loading",null,!0)}function y(){--D||C("loading",null,!1)}function b(e){var r=e.source||{},i=Z(r.ignoreTimezone,n.ignoreTimezone);e._id=e._id||(e.id===t?"_fc"+xt++:e.id+""),e.date&&(e.start||(e.start=e.date),delete e.date),e._start=h(e.start=g(e.start,i)),e.end=g(e.end,i),e.end&&e.end<=e.start&&(e.end=null),e._end=e.end?h(e.end):null,e.allDay===t&&(e.allDay=Z(r.allDayDefault,n.allDayDefault)),e.className?"string"==typeof e.className&&(e.className=e.className.split(/\s+/)):e.className=[]}function w(e){e.className?"string"==typeof e.className&&(e.className=e.className.split(/\s+/)):e.className=[];for(var t=wt.sourceNormalizers,n=0;t.length>n;n++)t[n](e)}function E(e,t){return e&&t&&S(e)==S(t)}function S(e){return("object"==typeof e?e.events||e.url:"")||e}var x=this;x.isFetchNeeded=i,x.fetchEvents=s,x.addEventSource=a,x.removeEventSource=l,x.updateEvent=c,x.renderEvent=p,x.removeEvents=d,x.clientEvents=v,x.normalizeEvent=b;for(var T,N,C=x.trigger,k=x.getView,L=x.reportEvents,A={events:[]},O=[A],M=0,_=0,D=0,P=[],H=0;r.length>H;H++)f(r[H])}function o(e,t,n){return e.setFullYear(e.getFullYear()+t),n||c(e),e}function u(e,t,n){if(+e){var r=e.getMonth()+t,i=h(e);for(i.setDate(1),i.setMonth(r),e.setMonth(r),n||c(e);e.getMonth()!=i.getMonth();)e.setDate(e.getDate()+(i>e?1:-1))}return e}function a(e,t,n){if(+e){var r=e.getDate()+t,i=h(e);i.setHours(9),i.setDate(r),e.setDate(r),n||c(e),f(e,i)}return e}function f(e,t){if(+e)for(;e.getDate()!=t.getDate();)e.setTime(+e+(t>e?1:-1)*Ct)}function l(e,t){return e.setMinutes(e.getMinutes()+t),e}function c(e){return e.setHours(0),e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0),e}function h(e,t){return t?c(new Date(+e)):new Date(+e)}function p(){var e,t=0;do e=new Date(1970,t++,1);while(e.getHours());return e}function d(e,t,n){for(t=t||1;!e.getDay()||n&&1==e.getDay()||!n&&6==e.getDay();)a(e,t);return e}function v(e,t){return Math.round((h(e,!0)-h(t,!0))/Nt)}function m(e,n,r,i){n!==t&&n!=e.getFullYear()&&(e.setDate(1),e.setMonth(0),e.setFullYear(n)),r!==t&&r!=e.getMonth()&&(e.setDate(1),e.setMonth(r)),i!==t&&e.setDate(i)}function g(e,n){return"object"==typeof e?e:"number"==typeof e?new Date(1e3*e):"string"==typeof e?e.match(/^\d+(\.\d+)?$/)?new Date(1e3*parseFloat(e)):(n===t&&(n=!0),y(e,n)||(e?new Date(e):null)):null}function y(e,t){var n=e.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);if(!n)return null;var r=new Date(n[1],0,1);if(t||!n[13]){var i=new Date(n[1],0,1,9,0);n[3]&&(r.setMonth(n[3]-1),i.setMonth(n[3]-1)),n[5]&&(r.setDate(n[5]),i.setDate(n[5])),f(r,i),n[7]&&r.setHours(n[7]),n[8]&&r.setMinutes(n[8]),n[10]&&r.setSeconds(n[10]),n[12]&&r.setMilliseconds(1e3*Number("0."+n[12])),f(r,i)}else if(r.setUTCFullYear(n[1],n[3]?n[3]-1:0,n[5]||1),r.setUTCHours(n[7]||0,n[8]||0,n[10]||0,n[12]?1e3*Number("0."+n[12]):0),n[14]){var s=60*Number(n[16])+(n[18]?Number(n[18]):0);s*="-"==n[15]?1:-1,r=new Date(+r+6e4*s)}return r}function b(e){if("number"==typeof e)return 60*e;if("object"==typeof e)return 60*e.getHours()+e.getMinutes();var t=e.match(/(\d+)(?::(\d+))?\s*(\w+)?/);if(t){var n=parseInt(t[1],10);return t[3]&&(n%=12,"p"==t[3].toLowerCase().charAt(0)&&(n+=12)),60*n+(t[2]?parseInt(t[2],10):0)}}function w(e,t,n){return E(e,null,t,n)}function E(e,t,n,r){r=r||yt;var i,s,o,u,a=e,f=t,l=n.length,c="";for(i=0;l>i;i++)if(s=n.charAt(i),"'"==s){for(o=i+1;l>o;o++)if("'"==n.charAt(o)){a&&(c+=o==i+1?"'":n.substring(i+1,o),i=o);break}}else if("("==s){for(o=i+1;l>o;o++)if(")"==n.charAt(o)){var h=w(a,n.substring(i+1,o),r);parseInt(h.replace(/\D/,""),10)&&(c+=h),i=o;break}}else if("["==s){for(o=i+1;l>o;o++)if("]"==n.charAt(o)){var p=n.substring(i+1,o),h=w(a,p,r);h!=w(f,p,r)&&(c+=h),i=o;break}}else if("{"==s)a=t,f=e;else if("}"==s)a=e,f=t;else{for(o=l;o>i;o--)if(u=Lt[n.substring(i,o)]){a&&(c+=u(a,r)),i=o-1;break}o==i&&a&&(c+=s)}return c}function S(e){var t,n=new Date(e.getTime());return n.setDate(n.getDate()+4-(n.getDay()||7)),t=n.getTime(),n.setMonth(0),n.setDate(1),Math.floor(Math.round((t-n)/864e5)/7)+1}function x(e){return e.end?T(e.end,e.allDay):a(h(e.start),1)}function T(e,t){return e=h(e),t||e.getHours()||e.getMinutes()?a(e,1):c(e)}function N(e,t){return 100*(t.msLength-e.msLength)+(e.event.start-t.event.start)}function C(e,t){return e.end>t.start&&e.start<t.end}function k(e,t,n,r){var i,s,o,u,a,f,l,c,p=[],d=e.length;for(i=0;d>i;i++)s=e[i],o=s.start,u=t[i],u>n&&r>o&&(n>o?(a=h(n),l=!1):(a=o,l=!0),u>r?(f=h(r),c=!1):(f=u,c=!0),p.push({event:s,start:a,end:f,isStart:l,isEnd:c,msLength:f-a}));return p.sort(N)}function L(e){var t,n,r,i,s,o=[],u=e.length;for(t=0;u>t;t++){for(n=e[t],r=0;;){if(i=!1,o[r])for(s=0;o[r].length>s;s++)if(C(o[r][s],n)){i=!0;break}if(!i)break;r++}o[r]?o[r].push(n):o[r]=[n]}return o}function A(n,r,i){n.unbind("mouseover").mouseover(function(n){for(var s,o,u,a=n.target;a!=this;)s=a,a=a.parentNode;(o=s._fci)!==t&&(s._fci=t,u=r[o],i(u.event,u.element,u),e(n.target).trigger(n)),n.stopPropagation()})}function O(t,n,r){for(var i,s=0;t.length>s;s++)i=e(t[s]),i.width(Math.max(0,n-_(i,r)))}function M(t,n,r){for(var i,s=0;t.length>s;s++)i=e(t[s]),i.height(Math.max(0,n-B(i,r)))}function _(e,t){return D(e)+H(e)+(t?P(e):0)}function D(t){return(parseFloat(e.css(t[0],"paddingLeft",!0))||0)+(parseFloat(e.css(t[0],"paddingRight",!0))||0)}function P(t){return(parseFloat(e.css(t[0],"marginLeft",!0))||0)+(parseFloat(e.css(t[0],"marginRight",!0))||0)}function H(t){return(parseFloat(e.css(t[0],"borderLeftWidth",!0))||0)+(parseFloat(e.css(t[0],"borderRightWidth",!0))||0)}function B(e,t){return j(e)+I(e)+(t?F(e):0)}function j(t){return(parseFloat(e.css(t[0],"paddingTop",!0))||0)+(parseFloat(e.css(t[0],"paddingBottom",!0))||0)}function F(t){return(parseFloat(e.css(t[0],"marginTop",!0))||0)+(parseFloat(e.css(t[0],"marginBottom",!0))||0)}function I(t){return(parseFloat(e.css(t[0],"borderTopWidth",!0))||0)+(parseFloat(e.css(t[0],"borderBottomWidth",!0))||0)}function q(e,t){t="number"==typeof t?t+"px":t,e.each(function(e,n){n.style.cssText+=";min-height:"+t+";_height:"+t})}function R(){}function U(e,t){return e-t}function z(e){return Math.max.apply(Math,e)}function W(e){return(10>e?"0":"")+e}function X(e,n){if(e[n]!==t)return e[n];for(var r,i=n.split(/(?=[A-Z])/),s=i.length-1;s>=0;s--)if(r=e[i[s].toLowerCase()],r!==t)return r;return e[""]}function V(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;").replace(/\n/g,"<br />")}function $(e){return e.id+"/"+e.className+"/"+e.style.cssText.replace(/(^|;)\s*(top|left|width|height)\s*:[^;]*/gi,"")}function J(e){e.attr("unselectable","on").css("MozUserSelect","none").bind("selectstart.ui",function(){return!1})}function K(e){e.children().removeClass("fc-first fc-last").filter(":first-child").addClass("fc-first").end().filter(":last-child").addClass("fc-last")}function Q(e,t){e.each(function(e,n){n.className=n.className.replace(/^fc-\w*/,"fc-"+Tt[t.getDay()])})}function G(e,t){var n=e.source||{},r=e.color,i=n.color,s=t("eventColor"),o=e.backgroundColor||r||n.backgroundColor||i||t("eventBackgroundColor")||s,u=e.borderColor||r||n.borderColor||i||t("eventBorderColor")||s,a=e.textColor||n.textColor||t("eventTextColor"),f=[];return o&&f.push("background-color:"+o),u&&f.push("border-color:"+u),a&&f.push("color:"+a),f.join(";")}function Y(t,n,r){if(e.isFunction(t)&&(t=[t]),t){var i,s;for(i=0;t.length>i;i++)s=t[i].apply(n,r)||s;return s}}function Z(){for(var e=0;arguments.length>e;e++)if(arguments[e]!==t)return arguments[e]}function et(e,t){function n(e,t){t&&(u(e,t),e.setDate(1));var n=h(e,!0);n.setDate(1);var f=u(h(n),1),l=h(n),c=h(f),p=i("firstDay"),v=i("weekends")?0:1;v&&(d(l),d(c,-1,!0)),a(l,-((l.getDay()-Math.max(p,v)+7)%7)),a(c,(7-c.getDay()+Math.max(p,v))%7);var m=Math.round((c-l)/(7*Nt));"fixed"==i("weekMode")&&(a(c,7*(6-m)),m=6),r.title=o(n,i("titleFormat")),r.start=n,r.end=f,r.visStart=l,r.visEnd=c,s(m,v?5:7,!0)}var r=this;r.render=n,rt.call(r,e,t,"month");var i=r.opt,s=r.renderBasic,o=t.formatDate}function tt(e,t){function n(e,t){t&&a(e,7*t);var n=a(h(e),-((e.getDay()-i("firstDay")+7)%7)),u=a(h(n),7),f=h(n),l=h(u),c=i("weekends");c||(d(f),d(l,-1,!0)),r.title=o(f,a(h(l),-1),i("titleFormat")),r.start=n,r.end=u,r.visStart=f,r.visEnd=l,s(1,c?7:5,!1)}var r=this;r.render=n,rt.call(r,e,t,"basicWeek");var i=r.opt,s=r.renderBasic,o=t.formatDates}function nt(e,t){function n(e,t){t&&(a(e,t),i("weekends")||d(e,0>t?-1:1)),r.title=o(e,i("titleFormat")),r.start=r.visStart=h(e,!0),r.end=r.visEnd=a(h(r.start),1),s(1,1,!1)}var r=this;r.render=n,rt.call(r,e,t,"basicDay");var i=r.opt,s=r.renderBasic,o=t.formatDate}function rt(t,n,r){function i(e,t,n){nt=e,rt=t,s();var r=!W;r?o():kt(),u(n)}function s(){at=Nt("isRTL"),at?(ft=-1,ct=rt-1):(ft=1,ct=0),mt=Nt("firstDay"),yt=Nt("weekends")?0:1,bt=Nt("theme")?"ui":"fc",wt=Nt("columnFormat"),Et=Nt("weekNumbers"),St=Nt("weekNumberTitle"),xt="iso"!=Nt("weekNumberCalculation")?"w":"W"}function o(){G=e("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(t)}function u(n){var r,i,s,o,u="",a=bt+"-widget-header",f=bt+"-widget-content",l=I.start.getMonth(),h=c(new Date);for(u+="<table class='fc-border-separate' style='width:100%' cellspacing='0'><thead><tr>",Et&&(u+="<th class='fc-week-number "+a+"'/>"),r=0;rt>r;r++)s=M(0,r),u+="<th class='fc-day-header fc-"+Tt[s.getDay()]+" "+a+"'/>";for(u+="</tr></thead><tbody>",r=0;nt>r;r++){for(u+="<tr class='fc-week'>",Et&&(u+="<td class='fc-week-number "+f+"'>"+"<div/>"+"</td>"),i=0;rt>i;i++)s=M(r,i),o=["fc-day","fc-"+Tt[s.getDay()],f],s.getMonth()!=l&&o.push("fc-other-month"),+s==+h&&(o.push("fc-today"),o.push(bt+"-state-highlight")),u+="<td class='"+o.join(" ")+"'"+" data-date='"+Mt(s,"yyyy-MM-dd")+"'"+">"+"<div>",n&&(u+="<div class='fc-day-number'>"+s.getDate()+"</div>"),u+="<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>";u+="</tr>"}u+="</tbody></table>",j(),R&&R.remove(),R=e(u).appendTo(t),U=R.find("thead"),z=U.find(".fc-day-header"),W=R.find("tbody"),X=W.find("tr"),V=W.find(".fc-day"),$=X.find("td:first-child"),Q=X.eq(0).find(".fc-day-content > div"),K(U.add(U.find("tr"))),K(X),X.eq(0).addClass("fc-first"),X.filter(":last").addClass("fc-last"),Et&&U.find(".fc-week-number").text(St),z.each(function(t,n){var r=_(t);e(n).text(Mt(r,wt))}),Et&&W.find(".fc-week-number > div").each(function(t,n){var r=M(t,0);e(n).text(Mt(r,xt))}),V.each(function(t,n){var r=_(t);Ct("dayRender",I,r,e(n))}),p(V)}function f(t){Z=t;var n,r,i,s=Z-U.height();"variable"==Nt("weekMode")?n=r=Math.floor(s/(1==nt?2:6)):(n=Math.floor(s/nt),r=s-n*(nt-1)),$.each(function(t,s){nt>t&&(i=e(s),q(i.find("> div"),(t==nt-1?r:n)-B(i)))}),F()}function l(e){Y=e,ut.clear(),tt=0,Et&&(tt=U.find("th.fc-week-number").outerWidth()),et=Math.floor((Y-tt)/rt),O(z.slice(0,-1),et)}function p(e){e.click(d).mousedown(Ot)}function d(t){if(!Nt("selectable")){var n=y(e(this).data("date"));Ct("dayClick",this,n,!0,t)}}function m(e,t,n){n&&st.build();for(var r=h(I.visStart),i=a(h(r),rt),s=0;nt>s;s++){var o=new Date(Math.max(r,e)),u=new Date(Math.min(i,t));if(u>o){var f,l;at?(f=v(u,r)*ft+ct+1,l=v(o,r)*ft+ct+1):(f=v(o,r),l=v(u,r)),p(g(s,f,s,l-1))}a(r,7),a(i,7)}}function g(e,n,r,i){var s=st.rect(e,n,r,i,t);return Lt(s,t)}function b(e){return h(e)}function w(e,t){m(e,a(h(t),1),!0)}function E(){At()}function S(e,t,n){var r=L(e),i=V[r.row*rt+r.col];Ct("dayClick",i,e,t,n)}function x(e,t){ot.start(function(e){At(),e&&g(e.row,e.col,e.row,e.col)},t)}function T(e,t,n){var r=ot.stop();if(At(),r){var i=A(r);Ct("drop",e,i,!0,t,n)}}function N(e){return h(e.start)}function C(e){return ut.left(e)}function k(e){return ut.right(e)}function L(e){return{row:Math.floor(v(e,I.visStart)/7),col:D(e.getDay())}}function A(e){return M(e.row,e.col)}function M(e,t){return a(h(I.visStart),7*e+t*ft+ct)}function _(e){return M(Math.floor(e/rt),e%rt)}function D(e){return(e-Math.max(mt,yt)+rt)%rt*ft+ct}function P(e){return X.eq(e)}function H(){var e=0;return Et&&(e+=tt),{left:e,right:Y}}function j(){q(t,t.height())}function F(){q(t,1)}var I=this;I.renderBasic=i,I.setHeight=f,I.setWidth=l,I.renderDayOverlay=m,I.defaultSelectionEnd=b,I.renderSelection=w,I.clearSelection=E,I.reportDayClick=S,I.dragStart=x,I.dragStop=T,I.defaultEventEnd=N,I.getHoverListener=function(){return ot},I.colContentLeft=C,I.colContentRight=k,I.dayOfWeekCol=D,I.dateCell=L,I.cellDate=A,I.cellIsAllDay=function(){return!0},I.allDayRow=P,I.allDayBounds=H,I.getRowCnt=function(){return nt},I.getColCnt=function(){return rt},I.getColWidth=function(){return et},I.getDaySegmentContainer=function(){return G},lt.call(I,t,n,r),pt.call(I),ht.call(I),it.call(I);var R,U,z,W,X,V,$,Q,G,Y,Z,et,tt,nt,rt,st,ot,ut,at,ft,ct,mt,yt,bt,wt,Et,St,xt,Nt=I.opt,Ct=I.trigger,kt=I.clearEvents,Lt=I.renderOverlay,At=I.clearOverlays,Ot=I.daySelectionMousedown,Mt=n.formatDate;J(t.addClass("fc-grid")),st=new dt(function(t,n){var r,i,s;z.each(function(t,o){r=e(o),i=r.offset().left,t&&(s[1]=i),s=[i],n[t]=s}),s[1]=i+r.outerWidth(),X.each(function(n,o){nt>n&&(r=e(o),i=r.offset().top,n&&(s[1]=i),s=[i],t[n]=s)}),s[1]=i+r.outerHeight()}),ot=new vt(st),ut=new gt(function(e){return Q.eq(e)})}function it(){function t(e,t){p(e),C(r(e),t),f("eventAfterAllRender")}function n(){d(),b().empty()}function r(t){var n,r,i,s,u,f,l=T(),c=N(),p=h(o.visStart),d=a(h(p),c),v=e.map(t,x),m=[];for(n=0;l>n;n++){for(r=L(k(t,v,p,d)),i=0;r.length>i;i++)for(s=r[i],u=0;s.length>u;u++)f=s[u],f.row=n,f.level=i,m.push(f);a(p,7),a(d,7)}return m}function i(e,t,n){l(e)&&s(e,t),n.isEnd&&c(e)&&A(e,t,n),v(e,t)}function s(e,t){var n,r=w();t.draggable({zIndex:9,delay:50,opacity:u("dragOpacity"),revertDuration:u("dragRevertDuration"),start:function(i,s){f("eventDragStart",t,e,i,s),g(e,t),r.start(function(r,i,s,o){t.draggable("option","revert",!r||!s&&!o),S(),r?(n=7*s+o*(u("isRTL")?-1:1),E(a(h(e.start),n),a(x(e),n))):n=0},i,"drag")},stop:function(i,s){r.stop(),S(),f("eventDragStop",t,e,i,s),n?y(this,e,n,0,e.allDay,i,s):(t.css("filter",""),m(e,t))}})}var o=this;o.renderEvents=t,o.compileDaySegs=r,o.clearEvents=n,o.bindDaySeg=i,ct.call(o);var u=o.opt,f=o.trigger,l=o.isEventDraggable,c=o.isEventResizable,p=o.reportEvents,d=o.reportEventClear,v=o.eventElementHandlers,m=o.showEvents,g=o.hideEvents,y=o.eventDrop,b=o.getDaySegmentContainer,w=o.getHoverListener,E=o.renderDayOverlay,S=o.clearOverlays,T=o.getRowCnt,N=o.getColCnt,C=o.renderDaySegs,A=o.resizableDayEvent}function st(e,t){function n(e,t){t&&a(e,7*t);var n=a(h(e),-((e.getDay()-i("firstDay")+7)%7)),u=a(h(n),7),f=h(n),l=h(u),c=i("weekends");c||(d(f),d(l,-1,!0)),r.title=o(f,a(h(l),-1),i("titleFormat")),r.start=n,r.end=u,r.visStart=f,r.visEnd=l,s(c?7:5)}var r=this;r.render=n,ut.call(r,e,t,"agendaWeek");var i=r.opt,s=r.renderAgenda,o=t.formatDates}function ot(e,t){function n(e,t){t&&(a(e,t),i("weekends")||d(e,0>t?-1:1));var n=h(e,!0),u=a(h(n),1);r.title=o(e,i("titleFormat")),r.start=r.visStart=n,r.end=r.visEnd=u,s(1)}var r=this;r.render=n,ut.call(r,e,t,"agendaDay");var i=r.opt,s=r.renderAgenda,o=t.formatDate}function ut(n,r,i){function s(e){Bt=e,o(),et?nn():u(),f()}function o(){Ut=en("theme")?"ui":"fc",Wt=en("weekends")?0:1,zt=en("firstDay"),(Xt=en("isRTL"))?(Vt=-1,$t=Bt-1):(Vt=1,$t=0),Jt=b(en("minTime")),Kt=b(en("maxTime")),Qt=en("columnFormat"),Gt=en("weekNumbers"),Yt=en("weekNumberTitle"),Zt="iso"!=en("weekNumberCalculation")?"w":"W",Dt=en("snapMinutes")||en("slotMinutes")}function u(){var t,r,i,s,o,u=Ut+"-widget-header",a=Ut+"-widget-content",f=0==en("slotMinutes")%15;for(t="<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'><thead><tr>",t+=Gt?"<th class='fc-agenda-axis fc-week-number "+u+"'/>":"<th class='fc-agenda-axis "+u+"'>&nbsp;</th>",r=0;Bt>r;r++)t+="<th class='fc- fc-col"+r+" "+u+"'/>";for(t+="<th class='fc-agenda-gutter "+u+"'>&nbsp;</th>"+"</tr>"+"</thead>"+"<tbody>"+"<tr>"+"<th class='fc-agenda-axis "+u+"'>&nbsp;</th>",r=0;Bt>r;r++)t+="<td class='fc- fc-col"+r+" "+a+"'>"+"<div>"+"<div class='fc-day-content'>"+"<div style='position:relative'>&nbsp;</div>"+"</div>"+"</div>"+"</td>";for(t+="<td class='fc-agenda-gutter "+a+"'>&nbsp;</td>"+"</tr>"+"</tbody>"+"</table>",et=e(t).appendTo(n),tt=et.find("thead"),nt=tt.find("th").slice(1,-1),rt=et.find("tbody"),it=rt.find("td").slice(0,-1),st=it.find("div.fc-day-content div"),ot=it.eq(0),ut=ot.find("> div"),K(tt.add(tt.find("tr"))),K(rt.add(rt.find("tr"))),Tt=tt.find("th:first"),Nt=et.find(".fc-agenda-gutter"),ft=e("<div style='position:absolute;z-index:2;left:0;width:100%'/>").appendTo(n),en("allDaySlot")?(ct=e("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(ft),t="<table style='width:100%' class='fc-agenda-allday' cellspacing='0'><tr><th class='"+u+" fc-agenda-axis'>"+en("allDayText")+"</th>"+"<td>"+"<div class='fc-day-content'><div style='position:relative'/></div>"+"</td>"+"<th class='"+u+" fc-agenda-gutter'>&nbsp;</th>"+"</tr>"+"</table>",mt=e(t).appendTo(ft),yt=mt.find("tr"),E(yt.find("td")),Tt=Tt.add(mt.find("th:first")),Nt=Nt.add(mt.find("th.fc-agenda-gutter")),ft.append("<div class='fc-agenda-divider "+u+"'>"+"<div class='fc-agenda-divider-inner'/>"+"</div>")):ct=e([]),bt=e("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>").appendTo(ft),wt=e("<div style='position:relative;width:100%;overflow:hidden'/>").appendTo(bt),Et=e("<div style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(wt),t="<table class='fc-agenda-slots' style='width:100%' cellspacing='0'><tbody>",i=p(),s=l(h(i),Kt),l(i,Jt),jt=0,r=0;s>i;r++)o=i.getMinutes(),t+="<tr class='fc-slot"+r+" "+(o?"fc-minor":"")+"'>"+"<th class='fc-agenda-axis "+u+"'>"+(f&&o?"&nbsp;":ln(i,en("axisFormat")))+"</th>"+"<td class='"+a+"'>"+"<div style='position:relative'>&nbsp;</div>"+"</td>"+"</tr>",l(i,en("slotMinutes")),jt++;t+="</tbody></table>",St=e(t).appendTo(wt),xt=St.find("div:first"),S(St.find("td")),Tt=Tt.add(St.find("th:first"))}function f(){var e,t,n,r,i=c(new Date);if(Gt){var s=ln(D(0),Zt);Xt?s+=Yt:s=Yt+s,tt.find(".fc-week-number").text(s)}for(e=0;Bt>e;e++)r=D(e),t=nt.eq(e),t.html(ln(r,Qt)),n=it.eq(e),+r==+i?n.addClass(Ut+"-state-highlight fc-today"):n.removeClass(Ut+"-state-highlight fc-today"),Q(t.add(n),r)}function d(e,n){e===t&&(e=Lt),Lt=e,cn={};var r=rt.position().top,i=bt.position().top,s=Math.min(e-r,St.height()+i+1);ut.height(s-B(ot)),ft.css("top",r),bt.height(s-i-1),_t=xt.height()+1,Pt=en("slotMinutes")/Dt,Ht=_t/Pt,n&&g()}function m(t){kt=t,qt.clear(),At=0,O(Tt.width("").each(function(t,n){At=Math.max(At,e(n).outerWidth())}),At);var n=bt[0].clientWidth;Mt=bt.width()-n,Mt?(O(Nt,Mt),Nt.show().prev().removeClass("fc-last")):Nt.hide().prev().addClass("fc-last"),Ot=Math.floor((n-At)/Bt),O(nt.slice(0,-1),Ot)}function g(){function e(){bt.scrollTop(r)}var t=p(),n=h(t);n.setHours(en("firstHour"));var r=j(t,n)+1;e(),setTimeout(e,0)}function y(){Rt=bt.scrollTop()}function w(){bt.scrollTop(Rt)}function E(e){e.click(x).mousedown(an)}function S(e){e.click(x).mousedown(V)}function x(e){if(!en("selectable")){var t=Math.min(Bt-1,Math.floor((e.pageX-et.offset().left-At)/Ot)),n=D(t),r=this.parentNode.className.match(/fc-slot(\d+)/);if(r){var i=parseInt(r[1])*en("slotMinutes"),s=Math.floor(i/60);n.setHours(s),n.setMinutes(i%60+Jt),tn("dayClick",it[t],n,!1,e)}else tn("dayClick",it[t],n,!0,e)}}function T(e,t,n){n&&Ft.build();var r,i,s=h(Z.visStart);Xt?(r=v(t,s)*Vt+$t+1,i=v(e,s)*Vt+$t+1):(r=v(e,s),i=v(t,s)),r=Math.max(0,r),i=Math.min(Bt,i),i>r&&E(N(0,r,0,i-1))}function N(e,t,n,r){var i=Ft.rect(e,t,n,r,ft);return rn(i,ft)}function C(e,t){for(var n=h(Z.visStart),r=a(h(n),1),i=0;Bt>i;i++){var s=new Date(Math.max(n,e)),o=new Date(Math.min(r,t));if(o>s){var u=i*Vt+$t,f=Ft.rect(0,u,0,u,wt),l=j(n,s),c=j(n,o);f.top=l,f.height=c-l,S(rn(f,wt))}a(n,1),a(r,1)}}function k(e){return qt.left(e)}function L(e){return qt.right(e)}function A(e){return{row:Math.floor(v(e,Z.visStart)/7),col:H(e.getDay())}}function _(e){var t=D(e.col),n=e.row;return en("allDaySlot")&&n--,n>=0&&l(t,Jt+n*Dt),t}function D(e){return a(h(Z.visStart),e*Vt+$t)}function P(e){return en("allDaySlot")&&!e.row}function H(e){return(e-Math.max(zt,Wt)+Bt)%Bt*Vt+$t}function j(e,n){if(e=h(e,!0),l(h(e),Jt)>n)return 0;if(n>=l(h(e),Kt))return St.height();var r=en("slotMinutes"),i=60*n.getHours()+n.getMinutes()-Jt,s=Math.floor(i/r),o=cn[s];return o===t&&(o=cn[s]=St.find("tr:eq("+s+") td div")[0].offsetTop),Math.max(0,Math.round(o-1+_t*(i%r/r)))}function F(){return{left:At,right:kt-Mt}}function I(){return yt}function q(e){var t=h(e.start);return e.allDay?t:l(t,en("defaultEventMinutes"))}function R(e,t){return t?h(e):l(h(e),en("slotMinutes"))}function z(e,t,n){n?en("allDaySlot")&&T(e,a(h(t),1),!0):W(e,t)}function W(t,n){var r=en("selectHelper");if(Ft.build(),r){var i=v(t,Z.visStart)*Vt+$t;if(i>=0&&Bt>i){var s=Ft.rect(0,i,0,i,wt),o=j(t,t),u=j(t,n);if(u>o){if(s.top=o,s.height=u-o,s.left+=2,s.width-=5,e.isFunction(r)){var a=r(t,n);a&&(s.position="absolute",s.zIndex=8,Ct=e(a).css(s).appendTo(wt))}else s.isStart=!0,s.isEnd=!0,Ct=e(fn({title:"",start:t,end:n,className:["fc-select-helper"],editable:!1},s)),Ct.css("opacity",en("dragOpacity"));Ct&&(S(Ct),wt.append(Ct),O(Ct,s.width,!0),M(Ct,s.height,!0))}}}else C(t,n)}function X(){sn(),Ct&&(Ct.remove(),Ct=null)}function V(t){if(1==t.which&&en("selectable")){un(t);var n;It.start(function(e,t){if(X(),e&&e.col==t.col&&!P(e)){var r=_(t),i=_(e);n=[r,l(h(r),Dt),i,l(h(i),Dt)].sort(U),W(n[0],n[3])}else n=null},t),e(document).one("mouseup",function(e){It.stop(),n&&(+n[0]==+n[1]&&$(n[0],!1,e),on(n[0],n[3],!1,e))})}}function $(e,t,n){tn("dayClick",it[H(e.getDay())],e,t,n)}function G(e,t){It.start(function(e){if(sn(),e)if(P(e))N(e.row,e.col,e.row,e.col);else{var t=_(e),n=l(h(t),en("defaultEventMinutes"));C(t,n)}},t)}function Y(e,t,n){var r=It.stop();sn(),r&&tn("drop",e,_(r),P(r),t,n)}var Z=this;Z.renderAgenda=s,Z.setWidth=m,Z.setHeight=d,Z.beforeHide=y,Z.afterShow=w,Z.defaultEventEnd=q,Z.timePosition=j,Z.dayOfWeekCol=H,Z.dateCell=A,Z.cellDate=_,Z.cellIsAllDay=P,Z.allDayRow=I,Z.allDayBounds=F,Z.getHoverListener=function(){return It},Z.colContentLeft=k,Z.colContentRight=L,Z.getDaySegmentContainer=function(){return ct},Z.getSlotSegmentContainer=function(){return Et},Z.getMinMinute=function(){return Jt},Z.getMaxMinute=function(){return Kt},Z.getBodyContent=function(){return wt},Z.getRowCnt=function(){return 1},Z.getColCnt=function(){return Bt},Z.getColWidth=function(){return Ot},Z.getSnapHeight=function(){return Ht},Z.getSnapMinutes=function(){return Dt},Z.defaultSelectionEnd=R,Z.renderDayOverlay=T,Z.renderSelection=z,Z.clearSelection=X,Z.reportDayClick=$,Z.dragStart=G,Z.dragStop=Y,lt.call(Z,n,r,i),pt.call(Z),ht.call(Z),at.call(Z);var et,tt,nt,rt,it,st,ot,ut,ft,ct,mt,yt,bt,wt,Et,St,xt,Tt,Nt,Ct,kt,Lt,At,Ot,Mt,_t,Dt,Pt,Ht,Bt,jt,Ft,It,qt,Rt,Ut,zt,Wt,Xt,Vt,$t,Jt,Kt,Qt,Gt,Yt,Zt,en=Z.opt,tn=Z.trigger,nn=Z.clearEvents,rn=Z.renderOverlay,sn=Z.clearOverlays,on=Z.reportSelection,un=Z.unselect,an=Z.daySelectionMousedown,fn=Z.slotSegHtml,ln=r.formatDate,cn={};J(n.addClass("fc-agenda")),Ft=new dt(function(t,n){function r(e){return Math.max(a,Math.min(f,e))}var i,s,o;nt.each(function(t,r){i=e(r),s=i.offset().left,t&&(o[1]=s),o=[s],n[t]=o}),o[1]=s+i.outerWidth(),en("allDaySlot")&&(i=yt,s=i.offset().top,t[0]=[s,s+i.outerHeight()]);for(var u=wt.offset().top,a=bt.offset().top,f=a+bt.outerHeight(),l=0;jt*Pt>l;l++)t.push([r(u+Ht*l),r(u+Ht*(l+1))])}),It=new vt(Ft),qt=new gt(function(e){return st.eq(e)})}function at(){function n(e,t){T(e);var n,r=e.length,o=[],a=[];for(n=0;r>n;n++)e[n].allDay?o.push(e[n]):a.push(e[n]);y("allDaySlot")&&(U(i(o),t),O()),u(s(a),t),b("eventAfterAllRender")}function r(){N(),D().empty(),P().empty()}function i(t){var n,r,i,s,o=L(k(t,e.map(t,x),g.visStart,g.visEnd)),u=o.length,a=[];for(n=0;u>n;n++)for(r=o[n],i=0;r.length>i;i++)s=r[i],s.row=0,s.level=n,a.push(s);return a}function s(t){var n,r,i,s,u,f,c=W(),p=F(),d=j(),v=l(h(g.visStart),p),m=e.map(t,o),y=[];for(n=0;c>n;n++){for(r=L(k(t,m,v,l(h(v),d-p))),ft(r),i=0;r.length>i;i++)for(s=r[i],u=0;s.length>u;u++)f=s[u],f.col=n,f.level=i,y.push(f);a(v,1,!0)}return y}function o(e){return e.end?h(e.end):l(h(e.start),y("defaultEventMinutes"))}function u(n,r){var i,s,o,u,a,l,c,h,d,v,m,g,w,E,S,x,T,N,C,k,L,O,M=n.length,D="",H={},j={},F=P(),U=W();for((k=y("isRTL"))?(L=-1,O=U-1):(L=1,O=0),i=0;M>i;i++)s=n[i],o=s.event,u=I(s.start,s.start),a=I(s.start,s.end),l=s.col,c=s.level,h=s.forward||0,d=q(l*L+O),v=R(l*L+O)-d,v=Math.min(v-6,.95*v),m=c?v/(c+h+1):h?2*(v/(h+1)-6):v,g=d+v/(c+h+1)*c*L+(k?v-m:0),s.top=u,s.left=g,s.outerWidth=m,s.outerHeight=a-u,D+=f(o,s);for(F[0].innerHTML=D,w=F.children(),i=0;M>i;i++)s=n[i],o=s.event,E=e(w[i]),S=b("eventRender",o,o,E),S===!1?E.remove():(S&&S!==!0&&(E.remove(),E=e(S).css({position:"absolute",top:s.top,left:s.left}).appendTo(F)),s.element=E,o._id===r?p(o,E,s):E[0]._fci=i,Y(o,E));for(A(F,n,p),i=0;M>i;i++)s=n[i],(E=s.element)&&(T=H[x=s.key=$(E[0])],s.vsides=T===t?H[x]=B(E,!0):T,T=j[x],s.hsides=T===t?j[x]=_(E,!0):T,N=E.find(".fc-event-title"),N.length&&(s.contentTop=N[0].offsetTop));for(i=0;M>i;i++)s=n[i],(E=s.element)&&(E[0].style.width=Math.max(0,s.outerWidth-s.hsides)+"px",C=Math.max(0,s.outerHeight-s.vsides),E[0].style.height=C+"px",o=s.event,s.contentTop!==t&&10>C-s.contentTop&&(E.find("div.fc-event-time").text(ot(o.start,y("timeFormat"))+" - "+o.title),E.find("div.fc-event-title").remove()),b("eventAfterRender",o,o,E))}function f(e,t){var n="<",r=e.url,i=G(e,y),s=["fc-event","fc-event-vert"];return w(e)&&s.push("fc-event-draggable"),t.isStart&&s.push("fc-event-start"),t.isEnd&&s.push("fc-event-end"),s=s.concat(e.className),e.source&&(s=s.concat(e.source.className||[])),n+=r?"a href='"+V(e.url)+"'":"div",n+=" class='"+s.join(" ")+"'"+" style='position:absolute;z-index:8;top:"+t.top+"px;left:"+t.left+"px;"+i+"'"+">"+"<div class='fc-event-inner'>"+"<div class='fc-event-time'>"+V(ut(e.start,e.end,y("timeFormat")))+"</div>"+"<div class='fc-event-title'>"+V(e.title)+"</div>"+"</div>"+"<div class='fc-event-bg'></div>",t.isEnd&&E(e)&&(n+="<div class='ui-resizable-handle ui-resizable-s'>=</div>"),n+="</"+(r?"a":"div")+">"}function c(e,t,n){w(e)&&d(e,t,n.isStart),n.isEnd&&E(e)&&z(e,t,n),C(e,t)}function p(e,t,n){var r=t.find("div.fc-event-time");w(e)&&v(e,t,r),n.isEnd&&E(e)&&m(e,t,r),C(e,t)}function d(e,t,n){function r(){u||(t.width(i).height("").draggable("option","grid",null),u=!0)}var i,s,o,u=!0,f=y("isRTL")?-1:1,l=H(),c=X(),p=J(),d=K(),v=F();t.draggable({zIndex:9,opacity:y("dragOpacity","month"),revertDuration:y("dragRevertDuration"),start:function(v,m){b("eventDragStart",t,e,v,m),et(e,t),i=t.width(),l.start(function(i,l,v,m){it(),i?(s=!1,o=m*f,i.row?n?u&&(t.width(c-10),M(t,p*Math.round((e.end?(e.end-e.start)/kt:y("defaultEventMinutes"))/d)),t.draggable("option","grid",[c,1]),u=!1):s=!0:(rt(a(h(e.start),o),a(x(e),o)),r()),s=s||u&&!o):(r(),s=!0),t.draggable("option","revert",s)},v,"drag")},stop:function(n,i){if(l.stop(),it(),b("eventDragStop",t,e,n,i),s)r(),t.css("filter",""),Z(e,t);else{var a=0;u||(a=Math.round((t.offset().top-Q().offset().top)/p)*d+v-(60*e.start.getHours()+e.start.getMinutes())),tt(this,e,o,a,u,n,i)}}})}function v(e,t,n){function r(t){var r,i=l(h(e.start),t);e.end&&(r=l(h(e.end),t)),n.text(ut(i,r,y("timeFormat")))}function i(){c&&(n.css("display",""),t.draggable("option","grid",[m,g]),c=!1)}var s,o,u,f,c=!1,p=y("isRTL")?-1:1,d=H(),v=W(),m=X(),g=J(),w=K();t.draggable({zIndex:9,scroll:!1,grid:[m,g],axis:1==v?"y":!1,opacity:y("dragOpacity"),revertDuration:y("dragRevertDuration"),start:function(r,l){b("eventDragStart",t,e,r,l),et(e,t),s=t.position(),u=f=0,d.start(function(r,s,u,f){t.draggable("option","revert",!r),it(),r&&(o=f*p,y("allDaySlot")&&!r.row?(c||(c=!0,n.hide(),t.draggable("option","grid",null)),rt(a(h(e.start),o),a(x(e),o))):i())},r,"drag")},drag:function(e,t){u=Math.round((t.position.top-s.top)/g)*w,u!=f&&(c||r(u),f=u)},stop:function(n,a){var f=d.stop();it(),b("eventDragStop",t,e,n,a),f&&(o||u||c)?tt(this,e,o,c?0:u,c,n,a):(i(),t.css("filter",""),t.css(s),r(0),Z(e,t))}})}function m(e,t,n){var r,i,s=J(),o=K();t.resizable({handles:{s:".ui-resizable-handle"},grid:s,start:function(n,s){r=i=0,et(e,t),t.css("z-index",9),b("eventResizeStart",this,e,n,s)},resize:function(u,a){r=Math.round((Math.max(s,t.height())-a.originalSize.height)/s),r!=i&&(n.text(ut(e.start,r||e.end?l(S(e),o*r):null,y("timeFormat"))),i=r)},stop:function(n,i){b("eventResizeStop",this,e,n,i),r?nt(this,e,0,o*r,n,i):(t.css("z-index",8),Z(e,t))}})}var g=this;g.renderEvents=n,g.compileDaySegs=i,g.clearEvents=r,g.slotSegHtml=f,g.bindDaySeg=c,ct.call(g);var y=g.opt,b=g.trigger,w=g.isEventDraggable,E=g.isEventResizable,S=g.eventEnd,T=g.reportEvents,N=g.reportEventClear,C=g.eventElementHandlers,O=g.setHeight,D=g.getDaySegmentContainer,P=g.getSlotSegmentContainer,H=g.getHoverListener,j=g.getMaxMinute,F=g.getMinMinute,I=g.timePosition,q=g.colContentLeft,R=g.colContentRight,U=g.renderDaySegs,z=g.resizableDayEvent,W=g.getColCnt,X=g.getColWidth,J=g.getSnapHeight,K=g.getSnapMinutes,Q=g.getBodyContent,Y=g.reportEventElement,Z=g.showEvents,et=g.hideEvents,tt=g.eventDrop,nt=g.eventResize,rt=g.renderDayOverlay,it=g.clearOverlays,st=g.calendar,ot=st.formatDate,ut=st.formatDates}function ft(e){var t,n,r,i,s,o;for(t=e.length-1;t>0;t--)for(i=e[t],n=0;i.length>n;n++)for(s=i[n],r=0;e[t-1].length>r;r++)o=e[t-1][r],C(s,o)&&(o.forward=Math.max(o.forward||0,(s.forward||0)+1))}function lt(e,n,r){function i(e,t){var n=M[e];return"object"==typeof n?X(n,t||r):n}function s(e,t){return n.trigger.apply(n,[e,t||T].concat(Array.prototype.slice.call(arguments,2),[T]))}function o(e){return f(e)&&!i("disableDragging")}function u(e){return f(e)&&!i("disableResizing")}function f(e){return Z(e.editable,(e.source||{}).editable,i("editable"))}function c(e){L={};var t,n,r=e.length;for(t=0;r>t;t++)n=e[t],L[n._id]?L[n._id].push(n):L[n._id]=[n]}function p(e){return e.end?h(e.end):N(e)}function d(e,t){A.push(t),O[e._id]?O[e._id].push(t):O[e._id]=[t]}function v(){A=[],O={}}function m(e,n){n.click(function(r){return n.hasClass("ui-draggable-dragging")||n.hasClass("ui-resizable-resizing")?t:s("eventClick",this,e,r)}).hover(function(t){s("eventMouseover",this,e,t)},function(t){s("eventMouseout",this,e,t)})}function g(e,t){b(e,t,"show")}function y(e,t){b(e,t,"hide")}function b(e,t,n){var r,i=O[e._id],s=i.length;for(r=0;s>r;r++)t&&i[r][0]==t[0]||i[r][n]()}function w(e,t,n,r,i,o,u){var a=t.allDay,f=t._id;S(L[f],n,r,i),s("eventDrop",e,t,n,r,i,function(){S(L[f],-n,-r,a),k(f)},o,u),k(f)}function E(e,t,n,r,i,o){var u=t._id;x(L[u],n,r),s("eventResize",e,t,n,r,function(){x(L[u],-n,-r),k(u)},i,o),k(u)}function S(e,n,r,i){r=r||0;for(var s,o=e.length,u=0;o>u;u++)s=e[u],i!==t&&(s.allDay=i),l(a(s.start,n,!0),r),s.end&&(s.end=l(a(s.end,n,!0),r)),C(s,M)}function x(e,t,n){n=n||0;for(var r,i=e.length,s=0;i>s;s++)r=e[s],r.end=l(a(p(r),t,!0),n),C(r,M)}var T=this;T.element=e,T.calendar=n,T.name=r,T.opt=i,T.trigger=s,T.isEventDraggable=o,T.isEventResizable=u,T.reportEvents=c,T.eventEnd=p,T.reportEventElement=d,T.reportEventClear=v,T.eventElementHandlers=m,T.showEvents=g,T.hideEvents=y,T.eventDrop=w,T.eventResize=E;var N=T.defaultEventEnd,C=n.normalizeEvent,k=n.reportEventChange,L={},A=[],O={},M=n.options}function ct(){function n(e,t){var n,r,a,h,m,g,y,b,w=I(),E=k(),S=L(),x=0,T=e.length;for(w[0].innerHTML=i(e),s(e,w.children()),o(e),u(e,w,t),f(e),l(e),c(e),n=p(),r=0;E>r;r++){for(a=0,h=[],m=0;S>m;m++)h[m]=0;for(;T>x&&(g=e[x]).row==r;){for(y=z(h.slice(g.startCol,g.endCol)),g.top=y,y+=g.outerHeight,b=g.startCol;g.endCol>b;b++)h[b]=y;x++}n[r].height(z(h))}v(e,d(n))}function r(t,n,r){var o,u,a,h=e("<div/>"),m=I(),g=t.length;for(h[0].innerHTML=i(t),o=h.children(),m.append(o),s(t,o),f(t),l(t),c(t),v(t,d(p())),o=[],u=0;g>u;u++)a=t[u].element,a&&(t[u].row===n&&a.css("top",r),o.push(a[0]));return e(o)}function i(e){var t,n,r,i,s,o,u,a,f,l,c=y("isRTL"),h=e.length,p=M(),d=p.left,v=p.right,m="";for(t=0;h>t;t++)n=e[t],r=n.event,s=["fc-event","fc-event-hori"],w(r)&&s.push("fc-event-draggable"),n.isStart&&s.push("fc-event-start"),n.isEnd&&s.push("fc-event-end"),c?(o=H(n.end.getDay()-1),u=H(n.start.getDay()),a=n.isEnd?D(o):d,f=n.isStart?P(u):v):(o=H(n.start.getDay()),u=H(n.end.getDay()-1),a=n.isStart?D(o):d,f=n.isEnd?P(u):v),s=s.concat(r.className),r.source&&(s=s.concat(r.source.className||[])),i=r.url,l=G(r,y),m+=i?"<a href='"+V(i)+"'":"<div",m+=" class='"+s.join(" ")+"'"+" style='position:absolute;z-index:8;left:"+a+"px;"+l+"'"+">"+"<div class='fc-event-inner'>",!r.allDay&&n.isStart&&(m+="<span class='fc-event-time'>"+V(R(r.start,r.end,y("timeFormat")))+"</span>"),m+="<span class='fc-event-title'>"+V(r.title)+"</span>"+"</div>",n.isEnd&&E(r)&&(m+="<div class='ui-resizable-handle ui-resizable-"+(c?"w":"e")+"'>"+"&nbsp;&nbsp;&nbsp;"+"</div>"),m+="</"+(i?"a":"div")+">",n.left=a,n.outerWidth=f-a,n.startCol=o,n.endCol=u+1;return m}function s(t,n){var r,i,s,o,u,a=t.length;for(r=0;a>r;r++)i=t[r],s=i.event,o=e(n[r]),u=b("eventRender",s,s,o),u===!1?o.remove():(u&&u!==!0&&(u=e(u).css({position:"absolute",left:i.left}),o.replaceWith(u),o=u),i.element=o)}function o(e){var t,n,r,i=e.length;for(t=0;i>t;t++)n=e[t],r=n.element,r&&x(n.event,r)}function u(e,t,n){var r,i,s,o,u=e.length;for(r=0;u>r;r++)i=e[r],s=i.element,s&&(o=i.event,o._id===n?q(o,s,i):s[0]._fci=r);A(t,e,q)}function f(e){var n,r,i,s,o,u=e.length,a={};for(n=0;u>n;n++)r=e[n],i=r.element,i&&(s=r.key=$(i[0]),o=a[s],o===t&&(o=a[s]=_(i,!0)),r.hsides=o)}function l(e){var t,n,r,i=e.length;for(t=0;i>t;t++)n=e[t],r=n.element,r&&(r[0].style.width=Math.max(0,n.outerWidth-n.hsides)+"px")}function c(e){var n,r,i,s,o,u=e.length,a={};for(n=0;u>n;n++)r=e[n],i=r.element,i&&(s=r.key,o=a[s],o===t&&(o=a[s]=F(i)),r.outerHeight=i[0].offsetHeight+o)}function p(){var e,t=k(),n=[];for(e=0;t>e;e++)n[e]=O(e).find("div.fc-day-content > div");return n}function d(e){var t,n=e.length,r=[];for(t=0;n>t;t++)r[t]=e[t][0].offsetTop;return r}function v(e,t){var n,r,i,s,o=e.length;for(n=0;o>n;n++)r=e[n],i=r.element,i&&(i[0].style.top=t[r.row]+(r.top||0)+"px",s=r.event,b("eventAfterRender",s,s,i))}function m(t,n,i){var s=y("isRTL"),o=s?"w":"e",u=n.find(".ui-resizable-"+o),f=!1;J(n),n.mousedown(function(e){e.preventDefault()}).click(function(e){f&&(e.preventDefault(),e.stopImmediatePropagation())}),u.mousedown(function(u){function l(n){b("eventResizeStop",this,t,n),e("body").css("cursor",""),d.stop(),W(),c&&C(this,t,c,0,n),setTimeout(function(){f=!1},0)}if(1==u.which){f=!0;var c,p,d=g.getHoverListener(),v=k(),m=L(),y=s?-1:1,w=s?m-1:0,E=n.css("top"),x=e.extend({},t),A=B(t.start);X(),e("body").css("cursor",o+"-resize").one("mouseup",l),b("eventResizeStart",this,t,u),d.start(function(e,n){if(e){var u=Math.max(A.row,e.row),f=e.col;1==v&&(u=0),u==A.row&&(f=s?Math.min(A.col,f):Math.max(A.col,f)),c=7*u+f*y+w-(7*n.row+n.col*y+w);var l=a(S(t),c,!0);if(c){x.end=l;var d=p;p=r(j([x]),i.row,E),p.find("*").css("cursor",o+"-resize"),d&&d.remove(),N(t)}else p&&(T(t),p.remove(),p=null);W(),U(t.start,a(h(l),1))}},u)}})}var g=this;g.renderDaySegs=n,g.resizableDayEvent=m;var y=g.opt,b=g.trigger,w=g.isEventDraggable,E=g.isEventResizable,S=g.eventEnd,x=g.reportEventElement,T=g.showEvents,N=g.hideEvents,C=g.eventResize,k=g.getRowCnt,L=g.getColCnt;g.getColWidth;var O=g.allDayRow,M=g.allDayBounds,D=g.colContentLeft,P=g.colContentRight,H=g.dayOfWeekCol,B=g.dateCell,j=g.compileDaySegs,I=g.getDaySegmentContainer,q=g.bindDaySeg,R=g.calendar.formatDates,U=g.renderDayOverlay,W=g.clearOverlays,X=g.clearSelection}function ht(){function t(e,t,i){n(),t||(t=a(e,i)),f(e,t,i),r(e,t,i)}function n(e){c&&(c=!1,l(),u("unselect",null,e))}function r(e,t,n,r){c=!0,u("select",null,e,t,n,r)}function i(t){var i=s.cellDate,u=s.cellIsAllDay,a=s.getHoverListener(),c=s.reportDayClick;if(1==t.which&&o("selectable")){n(t);var h;a.start(function(e,t){l(),e&&u(e)?(h=[i(t),i(e)].sort(U),f(h[0],h[1],!0)):h=null},t),e(document).one("mouseup",function(e){a.stop(),h&&(+h[0]==+h[1]&&c(h[0],!0,e),r(h[0],h[1],!0,e))})}}var s=this;s.select=t,s.unselect=n,s.reportSelection=r,s.daySelectionMousedown=i;var o=s.opt,u=s.trigger,a=s.defaultSelectionEnd,f=s.renderSelection,l=s.clearSelection,c=!1;o("selectable")&&o("unselectAuto")&&e(document).mousedown(function(t){var r=o("unselectCancel");r&&e(t.target).parents(r).length||n(t)})}function pt(){function t(t,n){var r=s.shift();return r||(r=e("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>")),r[0].parentNode!=n[0]&&r.appendTo(n),i.push(r.css(t).show()),r}function n(){for(var e;e=i.shift();)s.push(e.hide().unbind())}var r=this;r.renderOverlay=t,r.clearOverlays=n;var i=[],s=[]}function dt(e){var t,n,r=this;r.build=function(){t=[],n=[],e(t,n)},r.cell=function(e,r){var i,s=t.length,o=n.length,u=-1,a=-1;for(i=0;s>i;i++)if(r>=t[i][0]&&t[i][1]>r){u=i;break}for(i=0;o>i;i++)if(e>=n[i][0]&&n[i][1]>e){a=i;break}return u>=0&&a>=0?{row:u,col:a}:null},r.rect=function(e,r,i,s,o){var u=o.offset();return{top:t[e][0]-u.top,left:n[r][0]-u.left,width:n[s][1]-n[r][0],height:t[i][1]-t[e][0]}}}function vt(t){function n(e){mt(e);var n=t.cell(e.pageX,e.pageY);(!n!=!o||n&&(n.row!=o.row||n.col!=o.col))&&(n?(s||(s=n),i(n,s,n.row-s.row,n.col-s.col)):i(n,s),o=n)}var r,i,s,o,u=this;u.start=function(u,a,f){i=u,s=o=null,t.build(),n(a),r=f||"mousemove",e(document).bind(r,n)},u.stop=function(){return e(document).unbind(r,n),o}}function mt(e){e.pageX===t&&(e.pageX=e.originalEvent.pageX,e.pageY=e.originalEvent.pageY)}function gt(e){function n(t){return i[t]=i[t]||e(t)}var r=this,i={},s={},o={};r.left=function(e){return s[e]=s[e]===t?n(e).position().left:s[e]},r.right=function(e){return o[e]=o[e]===t?r.left(e)+n(e).width():o[e]},r.clear=function(){i={},s={},o={}}}var yt={defaultView:"month",aspectRatio:1.35,header:{left:"title",center:"",right:"today prev,next"},weekends:!0,weekNumbers:!1,weekNumberCalculation:"iso",weekNumberTitle:"W",allDayDefault:!0,ignoreTimezone:!0,lazyFetching:!0,startParam:"start",endParam:"end",titleFormat:{month:"MMMM yyyy",week:"MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",day:"dddd, MMM d, yyyy"},columnFormat:{month:"ddd",week:"ddd M/d",day:"dddd M/d"},timeFormat:{"":"h(:mm)t"},isRTL:!1,firstDay:0,monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],buttonText:{prev:"<span class='fc-text-arrow'>&lsaquo;</span>",next:"<span class='fc-text-arrow'>&rsaquo;</span>",prevYear:"<span class='fc-text-arrow'>&laquo;</span>",nextYear:"<span class='fc-text-arrow'>&raquo;</span>",today:"today",month:"month",week:"week",day:"day"},theme:!1,buttonIcons:{prev:"circle-triangle-w",next:"circle-triangle-e"},unselectAuto:!0,dropAccept:"*"},bt={header:{left:"next,prev today",center:"",right:"title"},buttonText:{prev:"<span class='fc-text-arrow'>&rsaquo;</span>",next:"<span class='fc-text-arrow'>&lsaquo;</span>",prevYear:"<span class='fc-text-arrow'>&raquo;</span>",nextYear:"<span class='fc-text-arrow'>&laquo;</span>"},buttonIcons:{prev:"circle-triangle-e",next:"circle-triangle-w"}},wt=e.fullCalendar={version:"1.6.1"},Et=wt.views={};e.fn.fullCalendar=function(n){if("string"==typeof n){var i,s=Array.prototype.slice.call(arguments,1);return this.each(function(){var r=e.data(this,"fullCalendar");if(r&&e.isFunction(r[n])){var o=r[n].apply(r,s);i===t&&(i=o),"destroy"==n&&e.removeData(this,"fullCalendar")}}),i!==t?i:this}var o=n.eventSources||[];return delete n.eventSources,n.events&&(o.push(n.events),delete n.events),n=e.extend(!0,{},yt,n.isRTL||n.isRTL===t&&yt.isRTL?bt:{},n),this.each(function(t,i){var s=e(i),u=new r(s,n,o);s.data("fullCalendar",u),u.render()}),this},wt.sourceNormalizers=[],wt.sourceFetchers=[];var St={dataType:"json",cache:!1},xt=1;wt.addDays=a,wt.cloneDate=h,wt.parseDate=g,wt.parseISO8601=y,wt.parseTime=b,wt.formatDate=w,wt.formatDates=E;var Tt=["sun","mon","tue","wed","thu","fri","sat"],Nt=864e5,Ct=36e5,kt=6e4,Lt={s:function(e){return e.getSeconds()},ss:function(e){return W(e.getSeconds())},m:function(e){return e.getMinutes()},mm:function(e){return W(e.getMinutes())},h:function(e){return e.getHours()%12||12},hh:function(e){return W(e.getHours()%12||12)},H:function(e){return e.getHours()},HH:function(e){return W(e.getHours())},d:function(e){return e.getDate()},dd:function(e){return W(e.getDate())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return e.getMonth()+1},MM:function(e){return W(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},yy:function(e){return(e.getFullYear()+"").substring(2)},yyyy:function(e){return e.getFullYear()},t:function(e){return 12>e.getHours()?"a":"p"},tt:function(e){return 12>e.getHours()?"am":"pm"},T:function(e){return 12>e.getHours()?"A":"P"},TT:function(e){return 12>e.getHours()?"AM":"PM"},u:function(e){return w(e,"yyyy-MM-dd'T'HH:mm:ss'Z'")},S:function(e){var t=e.getDate();return t>10&&20>t?"th":["st","nd","rd"][t%10-1]||"th"},w:function(e,t){return t.weekNumberCalculation(e)},W:function(e){return S(e)}};wt.dateFormatters=Lt,wt.applyAll=Y,Et.month=et,Et.basicWeek=tt,Et.basicDay=nt,n({weekMode:"fixed"}),Et.agendaWeek=st,Et.agendaDay=ot,n({allDaySlot:!0,allDayText:"all-day",firstHour:6,slotMinutes:30,defaultEventMinutes:120,axisFormat:"h(:mm)tt",timeFormat:{agenda:"h:mm{ - h:mm}"},dragOpacity:{agenda:.5},minTime:0,maxTime:24})})(jQuery);
/*

Holder - 1.9 - client side image placeholders
(c) 2012-2013 Ivan Malopinsky / http://imsky.co

Provided under the Apache 2.0 License: http://www.apache.org/licenses/LICENSE-2.0
Commercial use requires attribution.

*/


var Holder=Holder||{};(function(e,t){function o(e,t){var n="complete",r="readystatechange",i=!1,s=i,o=!0,u=e.document,a=u.documentElement,f=u.addEventListener?"addEventListener":"attachEvent",l=u.addEventListener?"removeEventListener":"detachEvent",c=u.addEventListener?"":"on",h=function(o){(o.type!=r||u.readyState==n)&&((o.type=="load"?e:u)[l](c+o.type,h,i),!s&&(s=!0)&&t.call(e,null))},p=function(){try{a.doScroll("left")}catch(e){setTimeout(p,50);return}h("poll")};if(u.readyState==n)t.call(e,"lazy");else{if(u.createEventObject&&a.doScroll){try{o=!e.frameElement}catch(d){}o&&p()}u[f](c+"DOMContentLoaded",h,i),u[f](c+r,h,i),e[f](c+"load",h,i)}}function u(e){e=e.match(/^(\W)?(.*)/);var t=document["getElement"+(e[1]?e[1]=="#"?"ById":"sByClassName":"sByTagName")](e[2]),n=[];return t!=null&&(t.length?n=t:t.length==0?n=t:n=[t]),n}function a(e,t){var n={};for(var r in e)n[r]=e[r];for(var i in t)n[i]=t[i];return n}function f(e,t,n){var r=[t,e].sort(),i=Math.round(r[1]/16),s=Math.round(r[0]/16),o=Math.max(n.size,i);return{height:o}}function l(e,t,n,r){var i=f(t.width,t.height,n),o=i.height,u=t.width*r,a=t.height*r,l=n.font?n.font:"sans-serif";s.width=u,s.height=a,e.textAlign="center",e.textBaseline="middle",e.fillStyle=n.background,e.fillRect(0,0,u,a),e.fillStyle=n.foreground,e.font="bold "+o+"px "+l;var c=n.text?n.text:t.width+"x"+t.height;return e.measureText(c).width/u>1&&(o=n.size/(e.measureText(c).width/u)),e.font="bold "+o*r+"px "+l,e.fillText(c,u/2,a/2,u),s.toDataURL("image/png")}function c(e,t,n,i){var s=n.dimensions,o=n.theme,u=n.text?decodeURIComponent(n.text):n.text,f=s.width+"x"+s.height;o=u?a(o,{text:u}):o,o=n.font?a(o,{font:n.font}):o;var c=1;window.devicePixelRatio&&window.devicePixelRatio>1&&(c=window.devicePixelRatio);if(e=="image"){t.setAttribute("data-src",i),t.setAttribute("alt",u?u:o.text?o.text+" ["+f+"]":f);if(r||!n.auto)t.style.width=s.width+"px",t.style.height=s.height+"px";r?t.style.backgroundColor=o.background:t.setAttribute("src",l(v,s,o,c))}else r||(t.style.backgroundImage="url("+l(v,s,o,c)+")",t.style.backgroundSize=s.width+"px "+s.height+"px")}function h(e,t,n){var r=t.dimensions,i=t.theme,s=t.text,o=r.width+"x"+r.height;i=s?a(i,{text:s}):i;var u=document.createElement("div");u.style.backgroundColor=i.background,u.style.color=i.foreground,u.className=e.className+" holderjs-fluid",u.style.width=t.dimensions.width+(t.dimensions.width.indexOf("%")>0?"":"px"),u.style.height=t.dimensions.height+(t.dimensions.height.indexOf("%")>0?"":"px"),u.id=e.id,e.style.width=0,e.style.height=0,i.text?u.appendChild(document.createTextNode(i.text)):(u.appendChild(document.createTextNode(o)),m.push(u),setTimeout(p,0)),e.parentNode.insertBefore(u,e.nextSibling),window.jQuery&&jQuery(function(t){t(e).on("load",function(){e.style.width=u.style.width,e.style.height=u.style.height,t(e).show(),t(u).remove()})})}function p(){for(i in m){if(!m.hasOwnProperty(i))continue;var e=m[i],t=e.firstChild;e.style.lineHeight=e.offsetHeight+"px",t.data=e.offsetWidth+"x"+e.offsetHeight}}function d(t,n){var r={theme:g.themes.gray},i=!1;for(sl=t.length,j=0;j<sl;j++){var s=t[j];e.flags.dimensions.match(s)?(i=!0,r.dimensions=e.flags.dimensions.output(s)):e.flags.fluid.match(s)?(i=!0,r.dimensions=e.flags.fluid.output(s),r.fluid=!0):e.flags.colors.match(s)?r.theme=e.flags.colors.output(s):n.themes[s]?r.theme=n.themes[s]:e.flags.text.match(s)?r.text=e.flags.text.output(s):e.flags.font.match(s)?r.font=e.flags.font.output(s):e.flags.auto.match(s)&&(r.auto=!0)}return i?r:!1}var n=!1,r=!1,s=document.createElement("canvas");document.getElementsByClassName||(document.getElementsByClassName=function(e){var t=document,n,r,i,s=[];if(t.querySelectorAll)return t.querySelectorAll("."+e);if(t.evaluate){r=".//*[contains(concat(' ', @class, ' '), ' "+e+" ')]",n=t.evaluate(r,t,null,0,null);while(i=n.iterateNext())s.push(i)}else{n=t.getElementsByTagName("*"),r=new RegExp("(^|\\s)"+e+"(\\s|$)");for(i=0;i<n.length;i++)r.test(n[i].className)&&s.push(n[i])}return s}),window.getComputedStyle||(window.getComputedStyle=function(e,t){return this.el=e,this.getPropertyValue=function(t){var n=/(\-([a-z]){1})/g;return t=="float"&&(t="styleFloat"),n.test(t)&&(t=t.replace(n,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null},this}),Object.prototype.hasOwnProperty||(Object.prototype.hasOwnProperty=function(e){var t=this.__proto__||this.constructor.prototype;return e in this&&(!(e in t)||t[e]!==this[e])});if(!s.getContext)r=!0;else if(s.toDataURL("image/png").indexOf("data:image/png")<0)r=!0;else var v=s.getContext("2d");var m=[],g={domain:"holder.js",images:"img",bgnodes:".holderjs",themes:{gray:{background:"#eee",foreground:"#aaa",size:12},social:{background:"#3a5a97",foreground:"#fff",size:12},industrial:{background:"#434A52",foreground:"#C2F200",size:12}},stylesheet:".holderjs-fluid {font-size:16px;font-weight:bold;text-align:center;font-family:sans-serif;margin:0}"};e.flags={dimensions:{regex:/^(\d+)x(\d+)$/,output:function(e){var t=this.regex.exec(e);return{width:+t[1],height:+t[2]}}},fluid:{regex:/^([0-9%]+)x([0-9%]+)$/,output:function(e){var t=this.regex.exec(e);return{width:t[1],height:t[2]}}},colors:{regex:/#([0-9a-f]{3,})\:#([0-9a-f]{3,})/i,output:function(e){var t=this.regex.exec(e);return{size:g.themes.gray.size,foreground:"#"+t[2],background:"#"+t[1]}}},text:{regex:/text\:(.*)/,output:function(e){return this.regex.exec(e)[1]}},font:{regex:/font\:(.*)/,output:function(e){return this.regex.exec(e)[1]}},auto:{regex:/^auto$/}};for(var y in e.flags){if(!e.flags.hasOwnProperty(y))continue;e.flags[y].match=function(e){return e.match(this.regex)}}e.add_theme=function(t,n){return t!=null&&n!=null&&(g.themes[t]=n),e},e.add_image=function(t,n){var r=u(n);if(r.length)for(var i=0,s=r.length;i<s;i++){var o=document.createElement("img");o.setAttribute("data-src",t),r[i].appendChild(o)}return e},e.run=function(t){var r=a(g,t),i=[];r.images instanceof window.NodeList?imageNodes=r.images:r.images instanceof window.Node?imageNodes=[r.images]:imageNodes=u(r.images),r.elements instanceof window.NodeList?bgnodes=r.bgnodes:r.bgnodes instanceof window.Node?bgnodes=[r.bgnodes]:bgnodes=u(r.bgnodes),n=!0;for(l=0,f=imageNodes.length;l<f;l++)i.push(imageNodes[l]);var s=document.getElementById("holderjs-style");s||(s=document.createElement("style"),s.setAttribute("id","holderjs-style"),s.type="text/css",document.getElementsByTagName("head")[0].appendChild(s)),s.styleSheet?s.styleSheet+=r.stylesheet:s.textContent+=r.stylesheet;var o=new RegExp(r.domain+'/(.*?)"?\\)');for(var f=bgnodes.length,l=0;l<f;l++){var p=window.getComputedStyle(bgnodes[l],null).getPropertyValue("background-image"),v=p.match(o);if(v){var m=d(v[1].split("/"),r);m&&c("background",bgnodes[l],m,p)}}for(var f=i.length,l=0;l<f;l++){var p=i[l].getAttribute("src")||i[l].getAttribute("data-src");if(p!=null&&p.indexOf(r.domain)>=0){var m=d(p.substr(p.lastIndexOf(r.domain)+r.domain.length+1).split("/"),r);m&&(m.fluid?h(i[l],m,p):c("image",i[l],m,p))}}return e},o(t,function(){window.addEventListener?(window.addEventListener("resize",p,!1),window.addEventListener("orientationchange",p,!1)):window.attachEvent("onresize",p),n||e.run()}),typeof define=="function"&&define.amd&&define("Holder",[],function(){return e})})(Holder,window);
(function(e){e.fn.equalHeight=function(){var t=0;this.each(function(){var n=e(this).height();n>t&&(t=n)}),this.each(function(){e(this).css({"min-height":t})})}})(jQuery);
/*
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */


(function(e){function i(e,t){if(e.originalEvent.touches.length>1)return;e.preventDefault();var n=e.originalEvent.changedTouches[0],r=document.createEvent("MouseEvents");r.initMouseEvent(t,!0,!0,window,1,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),e.target.dispatchEvent(r)}e.support.touch="ontouchend"in document;if(!e.support.touch)return;var t=e.ui.mouse.prototype,n=t._mouseInit,r;t._touchStart=function(e){var t=this;if(r||!t._mouseCapture(e.originalEvent.changedTouches[0]))return;r=!0,t._touchMoved=!1,i(e,"mouseover"),i(e,"mousemove"),i(e,"mousedown")},t._touchMove=function(e){if(!r)return;this._touchMoved=!0,i(e,"mousemove")},t._touchEnd=function(e){if(!r)return;i(e,"mouseup"),i(e,"mouseout"),this._touchMoved||i(e,"click"),r=!1},t._mouseInit=function(){var t=this;t.element.bind("touchstart",e.proxy(t,"_touchStart")).bind("touchmove",e.proxy(t,"_touchMove")).bind("touchend",e.proxy(t,"_touchEnd")),n.call(t)}})(jQuery);
/** ===========================================================================
 * Looper.js | a jQuery plugin - v1.1.2
 * Copyright 2013 Ry Racherbaumer
 * http://rygine.com/projects/looper.js
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== **/


(function(e,t,n,r){var i=function(){var e=n.body||n.documentElement,t={transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",MsTransition:"MSTransitionEnd",OTransition:"oTransitionEnd otransitionend"},i;for(i in t)if(e.style[i]!==r)return t[i];return!1}(),s=function(t,n){this.$element=e(t),this.options=n,this.looping=!1;var r=this;this.$element.attr("tabindex",0).keydown(function(e){switch(e.which){case 37:r.prev();break;case 39:r.next();break;default:return}e.preventDefault()}).find(".item").attr("aria-hidden",!0),this.options.pause==="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.loop,this)),this.$element.trigger("init")};s.prototype={loop:function(t){return t||(this.paused=!1),this.interval&&(clearInterval(this.interval),this.interval=null),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},pause:function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&i&&(this.$element.trigger(i),this.loop()),clearInterval(this.interval),this.interval=null,this},next:function(){return this.looping?this:this.go("next")},prev:function(){return this.looping?this:this.go("prev")},to:function(t){--t;var n=this.$element.find(".item"),r=n.filter(".active"),i=n.index(r),s=this;return t>n.length-1||t<0?this:this.looping?this.$element.one("shown",function(){s.to(t)}):i==t?this.pause().loop():this.go(e(n[t]))},go:function(t){if(this.looping)return this;var n=this.$element.find(".item"),r=n.filter(".active"),s=n.index(r),o=typeof t=="string"?r[t]():t,u=n.index(o),a=this.interval,f=typeof t=="string"?t:s==-1&&u==-1||u>s?"next":"prev",l=f=="next"?"first":"last",c=this,h=function(t,r,i){if(!this.looping)return;this.looping=!1,t.removeClass("active go "+i).attr("aria-hidden",!0),r.removeClass("go "+i).addClass("active").removeAttr("aria-hidden");var s=e.Event("shown",{relatedTarget:r[0],relatedIndex:n.index(r)});this.$element.trigger(s)};o=o&&o.length?o:n[l]();if(o.hasClass("active"))return this;var p=e.Event("show",{relatedTarget:o[0],relatedIndex:n.index(o[0])});this.$element.trigger(p);if(p.isDefaultPrevented())return this;this.looping=!0,a&&this.pause();if(this.$element.hasClass("slide")||this.$element.hasClass("xfade"))if(i)o.addClass(f),r.addClass("go "+f),o[0].offsetWidth,o.addClass("go"),this.$element.one(i,function(){if(!r.length)return;h.call(c,r,o,f)}),setTimeout(function(){h.call(c,r,o,f)},this.options.speed);else{var d={},v,m={},g;v=r.attr("style"),g=o.attr("style"),this.$element.hasClass("xfade")&&(d.opacity=0,m.opacity=1,o.css("opacity",0)),this.$element.hasClass("slide")&&(this.$element.hasClass("up")?(d.top=f=="next"?"-100%":"100%",m.top=0):this.$element.hasClass("down")?(d.top=f=="next"?"100%":"-100%",m.top=0):this.$element.hasClass("right")?(d.left=f=="next"?"100%":"-100%",m.left=0):(d.left=f=="next"?"-100%":"100%",m.left=0)),o.addClass(f),r.animate(d,this.options.speed),o.animate(m,this.options.speed,function(){h.call(c,r,o,f),r.attr("style",v||""),o.attr("style",g||"")})}else h.call(c,r,o,f);return(a||!a&&this.options.interval)&&(!t||typeof t=="string"&&t!==this.options.pause||t.length&&this.options.pause!=="to")&&this.loop(),this}},e.fn.looper=function(t){var n=arguments;return this.each(function(){var r=e(this),i=r.data("looperjs"),o=e.extend({},e.fn.looper.defaults,typeof t=="object"&&t),u=typeof t=="string"?t:t.looper,a=t.args||n.length>1&&Array.prototype.slice.call(n,1);i||r.data("looperjs",i=new s(this,o)),typeof t=="number"?i.to(t):u?a?i[u].apply(i,a.length?a:(""+a).split(",")):i[u]():o.interval?i.loop():i.go()})},e.fn.looper.defaults={interval:5e3,pause:"hover",speed:500},e.fn.looper.Constructor=s,e(function(){e("body").on("click.looper","[data-looper]",function(t){var n=e(this);if(n.data("looper")=="go")return;var r,i=e(n.data("target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=e.extend({},i.data(),n.data());i.looper(s),t.preventDefault()}),e('[data-looper="go"]').each(function(){var t=e(this);t.looper(t.data())})})})(jQuery,window,document);
(function(e){var t={init:function(t){var n={set_width:!1,set_height:!1,horizontalScroll:!1,scrollInertia:950,mouseWheel:!0,mouseWheelPixels:"auto",autoDraggerLength:!0,autoHideScrollbar:!1,snapAmount:null,snapOffset:0,scrollButtons:{enable:!1,scrollType:"continuous",scrollSpeed:"auto",scrollAmount:40},advanced:{updateOnBrowserResize:!0,updateOnContentResize:!1,autoExpandHorizontalScroll:!1,autoScrollOnFocus:!0,normalizeMouseWheelDelta:!1},contentTouchScroll:!0,callbacks:{onScrollStart:function(){},onScroll:function(){},onTotalScroll:function(){},onTotalScrollBack:function(){},onTotalScrollOffset:0,onTotalScrollBackOffset:0,whileScrolling:function(){}},theme:"light"},t=e.extend(!0,n,t);return this.each(function(){var n=e(this);t.set_width&&n.css("width",t.set_width),t.set_height&&n.css("height",t.set_height);if(!e(document).data("mCustomScrollbar-index"))e(document).data("mCustomScrollbar-index","1");else{var r=parseInt(e(document).data("mCustomScrollbar-index"));e(document).data("mCustomScrollbar-index",r+1)}n.wrapInner("<div class='mCustomScrollBox mCS-"+t.theme+"' id='mCSB_"+e(document).data("mCustomScrollbar-index")+"' style='position:relative; height:100%; overflow:hidden; max-width:100%;' />").addClass("mCustomScrollbar _mCS_"+e(document).data("mCustomScrollbar-index"));var i=n.children(".mCustomScrollBox");if(t.horizontalScroll){i.addClass("mCSB_horizontal").wrapInner("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />");var s=i.children(".mCSB_h_wrapper");s.wrapInner("<div class='mCSB_container' style='position:absolute; left:0;' />").children(".mCSB_container").css({width:s.children().outerWidth(),position:"relative"}).unwrap()}else i.wrapInner("<div class='mCSB_container' style='position:relative; top:0;' />");var o=i.children(".mCSB_container");e.support.touch&&o.addClass("mCS_touch"),o.after("<div class='mCSB_scrollTools' style='position:absolute;'><div class='mCSB_draggerContainer'><div class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' style='position:relative;'></div></div><div class='mCSB_draggerRail'></div></div></div>");var u=i.children(".mCSB_scrollTools"),a=u.children(".mCSB_draggerContainer"),f=a.children(".mCSB_dragger");t.horizontalScroll?f.data("minDraggerWidth",f.width()):f.data("minDraggerHeight",f.height()),t.scrollButtons.enable&&(t.horizontalScroll?u.prepend("<a class='mCSB_buttonLeft' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonRight' oncontextmenu='return false;'></a>"):u.prepend("<a class='mCSB_buttonUp' oncontextmenu='return false;'></a>").append("<a class='mCSB_buttonDown' oncontextmenu='return false;'></a>")),i.bind("scroll",function(){n.is(".mCS_disabled")||i.scrollTop(0).scrollLeft(0)}),n.data({mCS_Init:!0,mCustomScrollbarIndex:e(document).data("mCustomScrollbar-index"),horizontalScroll:t.horizontalScroll,scrollInertia:t.scrollInertia,scrollEasing:"mcsEaseOut",mouseWheel:t.mouseWheel,mouseWheelPixels:t.mouseWheelPixels,autoDraggerLength:t.autoDraggerLength,autoHideScrollbar:t.autoHideScrollbar,snapAmount:t.snapAmount,snapOffset:t.snapOffset,scrollButtons_enable:t.scrollButtons.enable,scrollButtons_scrollType:t.scrollButtons.scrollType,scrollButtons_scrollSpeed:t.scrollButtons.scrollSpeed,scrollButtons_scrollAmount:t.scrollButtons.scrollAmount,autoExpandHorizontalScroll:t.advanced.autoExpandHorizontalScroll,autoScrollOnFocus:t.advanced.autoScrollOnFocus,normalizeMouseWheelDelta:t.advanced.normalizeMouseWheelDelta,contentTouchScroll:t.contentTouchScroll,onScrollStart_Callback:t.callbacks.onScrollStart,onScroll_Callback:t.callbacks.onScroll,onTotalScroll_Callback:t.callbacks.onTotalScroll,onTotalScrollBack_Callback:t.callbacks.onTotalScrollBack,onTotalScroll_Offset:t.callbacks.onTotalScrollOffset,onTotalScrollBack_Offset:t.callbacks.onTotalScrollBackOffset,whileScrolling_Callback:t.callbacks.whileScrolling,bindEvent_scrollbar_drag:!1,bindEvent_content_touch:!1,bindEvent_scrollbar_click:!1,bindEvent_mousewheel:!1,bindEvent_buttonsContinuous_y:!1,bindEvent_buttonsContinuous_x:!1,bindEvent_buttonsPixels_y:!1,bindEvent_buttonsPixels_x:!1,bindEvent_focusin:!1,bindEvent_autoHideScrollbar:!1,mCSB_buttonScrollRight:!1,mCSB_buttonScrollLeft:!1,mCSB_buttonScrollDown:!1,mCSB_buttonScrollUp:!1});if(t.horizontalScroll)n.css("max-width")!=="none"&&(t.advanced.updateOnContentResize||(t.advanced.updateOnContentResize=!0));else if(n.css("max-height")!=="none"){var l=!1,h=parseInt(n.css("max-height"));n.css("max-height").indexOf("%")>=0&&(l=h,h=n.parent().height()*l/100),n.css("overflow","hidden"),i.css("max-height",h)}n.mCustomScrollbar("update");if(t.advanced.updateOnBrowserResize){var p,d=e(window).width(),v=e(window).height();e(window).bind("resize."+n.data("mCustomScrollbarIndex"),function(){p&&clearTimeout(p),p=setTimeout(function(){if(!n.is(".mCS_disabled")&&!n.is(".mCS_destroyed")){var t=e(window).width(),r=e(window).height();if(d!==t||v!==r)n.css("max-height")!=="none"&&l&&i.css("max-height",n.parent().height()*l/100),n.mCustomScrollbar("update"),d=t,v=r}},150)})}if(t.advanced.updateOnContentResize){var m;if(t.horizontalScroll)var g=o.outerWidth();else var g=o.outerHeight();m=setInterval(function(){if(t.horizontalScroll){t.advanced.autoExpandHorizontalScroll&&o.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:o.outerWidth(),position:"relative"}).unwrap();var e=o.outerWidth()}else var e=o.outerHeight();e!=g&&(n.mCustomScrollbar("update"),g=e)},300)}})},update:function(){var t=e(this),n=t.children(".mCustomScrollBox"),r=n.children(".mCSB_container");r.removeClass("mCS_no_scrollbar"),t.removeClass("mCS_disabled mCS_destroyed"),n.scrollTop(0).scrollLeft(0);var i=n.children(".mCSB_scrollTools"),s=i.children(".mCSB_draggerContainer"),o=s.children(".mCSB_dragger");if(t.data("horizontalScroll")){var u=i.children(".mCSB_buttonLeft"),a=i.children(".mCSB_buttonRight"),f=n.width();t.data("autoExpandHorizontalScroll")&&r.css({position:"absolute",width:"auto"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:r.outerWidth(),position:"relative"}).unwrap();var l=r.outerWidth()}else var h=i.children(".mCSB_buttonUp"),p=i.children(".mCSB_buttonDown"),d=n.height(),v=r.outerHeight();if(v>d&&!t.data("horizontalScroll")){i.css("display","block");var m=s.height();if(t.data("autoDraggerLength")){var g=Math.round(d/v*m),y=o.data("minDraggerHeight");if(g<=y)o.css({height:y});else if(g>=m-10){var b=m-10;o.css({height:b})}else o.css({height:g});o.children(".mCSB_dragger_bar").css({"line-height":o.height()+"px"})}var w=o.height(),E=(v-d)/(m-w);t.data("scrollAmount",E).mCustomScrollbar("scrolling",n,r,s,o,h,p,u,a);var S=Math.abs(r.position().top);t.mCustomScrollbar("scrollTo",S,{scrollInertia:0,trigger:"internal"})}else if(l>f&&t.data("horizontalScroll")){i.css("display","block");var x=s.width();if(t.data("autoDraggerLength")){var T=Math.round(f/l*x),N=o.data("minDraggerWidth");if(T<=N)o.css({width:N});else if(T>=x-10){var C=x-10;o.css({width:C})}else o.css({width:T})}var k=o.width(),E=(l-f)/(x-k);t.data("scrollAmount",E).mCustomScrollbar("scrolling",n,r,s,o,h,p,u,a);var S=Math.abs(r.position().left);t.mCustomScrollbar("scrollTo",S,{scrollInertia:0,trigger:"internal"})}else n.unbind("mousewheel focusin"),t.data("horizontalScroll")?o.add(r).css("left",0):o.add(r).css("top",0),i.css("display","none"),r.addClass("mCS_no_scrollbar"),t.data({bindEvent_mousewheel:!1,bindEvent_focusin:!1})},scrolling:function(t,r,i,s,o,u,a,f){function v(e,t,n,r){l.data("horizontalScroll")?l.mCustomScrollbar("scrollTo",s.position().left-t+r,{moveDragger:!0,trigger:"internal"}):l.mCustomScrollbar("scrollTo",s.position().top-e+n,{moveDragger:!0,trigger:"internal"})}var l=e(this);if(!l.data("bindEvent_scrollbar_drag")){var h,p;e.support.msPointer?(s.bind("MSPointerDown",function(t){t.preventDefault(),l.data({on_drag:!0}),s.addClass("mCSB_dragger_onDrag");var n=e(this),r=n.offset(),i=t.originalEvent.pageX-r.left,o=t.originalEvent.pageY-r.top;i<n.width()&&i>0&&o<n.height()&&o>0&&(h=o,p=i)}),e(document).bind("MSPointerMove."+l.data("mCustomScrollbarIndex"),function(e){e.preventDefault();if(l.data("on_drag")){var t=s,n=t.offset(),r=e.originalEvent.pageX-n.left,i=e.originalEvent.pageY-n.top;v(h,p,i,r)}}).bind("MSPointerUp."+l.data("mCustomScrollbarIndex"),function(e){l.data({on_drag:!1}),s.removeClass("mCSB_dragger_onDrag")})):(s.bind("mousedown touchstart",function(t){t.preventDefault(),t.stopImmediatePropagation();var n=e(this),r=n.offset(),i,o;if(t.type==="touchstart"){var u=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0];i=u.pageX-r.left,o=u.pageY-r.top}else l.data({on_drag:!0}),s.addClass("mCSB_dragger_onDrag"),i=t.pageX-r.left,o=t.pageY-r.top;i<n.width()&&i>0&&o<n.height()&&o>0&&(h=o,p=i)}).bind("touchmove",function(t){t.preventDefault(),t.stopImmediatePropagation();var n=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],r=e(this),i=r.offset(),s=n.pageX-i.left,o=n.pageY-i.top;v(h,p,o,s)}),e(document).bind("mousemove."+l.data("mCustomScrollbarIndex"),function(e){if(l.data("on_drag")){var t=s,n=t.offset(),r=e.pageX-n.left,i=e.pageY-n.top;v(h,p,i,r)}}).bind("mouseup."+l.data("mCustomScrollbarIndex"),function(e){l.data({on_drag:!1}),s.removeClass("mCSB_dragger_onDrag")})),l.data({bindEvent_scrollbar_drag:!0})}if(e.support.touch&&l.data("contentTouchScroll")&&!l.data("bindEvent_content_touch")){var m,g,y,b,w,E,S;r.bind("touchstart",function(t){t.stopImmediatePropagation(),m=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],g=e(this),y=g.offset(),w=m.pageX-y.left,b=m.pageY-y.top,E=b,S=w}),r.bind("touchmove",function(t){t.preventDefault(),t.stopImmediatePropagation(),m=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],g=e(this).parent(),y=g.offset(),w=m.pageX-y.left,b=m.pageY-y.top,l.data("horizontalScroll")?l.mCustomScrollbar("scrollTo",S-w,{trigger:"internal"}):l.mCustomScrollbar("scrollTo",E-b,{trigger:"internal"})})}l.data("bindEvent_scrollbar_click")||(i.bind("click",function(t){var n=(t.pageY-i.offset().top)*l.data("scrollAmount"),r=e(t.target);l.data("horizontalScroll")&&(n=(t.pageX-i.offset().left)*l.data("scrollAmount")),(r.hasClass("mCSB_draggerContainer")||r.hasClass("mCSB_draggerRail"))&&l.mCustomScrollbar("scrollTo",n,{trigger:"internal",scrollEasing:"draggerRailEase"})}),l.data({bindEvent_scrollbar_click:!0})),l.data("mouseWheel")&&(l.data("bindEvent_mousewheel")||(t.bind("mousewheel",function(e,t){var n,o=l.data("mouseWheelPixels"),u=Math.abs(r.position().top),a=s.position().top,f=i.height()-s.height();l.data("normalizeMouseWheelDelta")&&(t<0?t=-1:t=1),o==="auto"&&(o=100+Math.round(l.data("scrollAmount")/2)),l.data("horizontalScroll")&&(a=s.position().left,f=i.width()-s.width(),u=Math.abs(r.position().left));if(t>0&&a!==0||t<0&&a!==f)e.preventDefault(),e.stopImmediatePropagation();n=u-t*o,l.mCustomScrollbar("scrollTo",n,{trigger:"internal"})}),l.data({bindEvent_mousewheel:!0})));if(l.data("scrollButtons_enable"))if(l.data("scrollButtons_scrollType")==="pixels"){l.data("horizontalScroll")?(f.add(a).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",T,N),l.data({bindEvent_buttonsContinuous_x:!1}),l.data("bindEvent_buttonsPixels_x")||(f.bind("click",function(e){e.preventDefault(),x(Math.abs(r.position().left)+l.data("scrollButtons_scrollAmount"))}),a.bind("click",function(e){e.preventDefault(),x(Math.abs(r.position().left)-l.data("scrollButtons_scrollAmount"))}),l.data({bindEvent_buttonsPixels_x:!0}))):(u.add(o).unbind("mousedown touchstart MSPointerDown mouseup MSPointerUp mouseout MSPointerOut touchend",T,N),l.data({bindEvent_buttonsContinuous_y:!1}),l.data("bindEvent_buttonsPixels_y")||(u.bind("click",function(e){e.preventDefault(),x(Math.abs(r.position().top)+l.data("scrollButtons_scrollAmount"))}),o.bind("click",function(e){e.preventDefault(),x(Math.abs(r.position().top)-l.data("scrollButtons_scrollAmount"))}),l.data({bindEvent_buttonsPixels_y:!0})));function x(e){s.data("preventAction")||(s.data("preventAction",!0),l.mCustomScrollbar("scrollTo",e,{trigger:"internal"}))}}else{if(l.data("horizontalScroll")){f.add(a).unbind("click"),l.data({bindEvent_buttonsPixels_x:!1});if(!l.data("bindEvent_buttonsContinuous_x")){f.bind("mousedown touchstart MSPointerDown",function(e){e.preventDefault();var t=L();l.data({mCSB_buttonScrollRight:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(r.position().left)+t,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var T=function(e){e.preventDefault(),clearInterval(l.data("mCSB_buttonScrollRight"))};f.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",T),a.bind("mousedown touchstart MSPointerDown",function(e){e.preventDefault();var t=L();l.data({mCSB_buttonScrollLeft:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(r.position().left)-t,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var N=function(e){e.preventDefault(),clearInterval(l.data("mCSB_buttonScrollLeft"))};a.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",N),l.data({bindEvent_buttonsContinuous_x:!0})}}else{u.add(o).unbind("click"),l.data({bindEvent_buttonsPixels_y:!1});if(!l.data("bindEvent_buttonsContinuous_y")){u.bind("mousedown touchstart MSPointerDown",function(e){e.preventDefault();var t=L();l.data({mCSB_buttonScrollDown:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(r.position().top)+t,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var C=function(e){e.preventDefault(),clearInterval(l.data("mCSB_buttonScrollDown"))};u.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",C),o.bind("mousedown touchstart MSPointerDown",function(e){e.preventDefault();var t=L();l.data({mCSB_buttonScrollUp:setInterval(function(){l.mCustomScrollbar("scrollTo",Math.abs(r.position().top)-t,{trigger:"internal",scrollEasing:"easeOutCirc"})},17)})});var k=function(e){e.preventDefault(),clearInterval(l.data("mCSB_buttonScrollUp"))};o.bind("mouseup touchend MSPointerUp mouseout MSPointerOut",k),l.data({bindEvent_buttonsContinuous_y:!0})}}function L(){var e=l.data("scrollButtons_scrollSpeed");return l.data("scrollButtons_scrollSpeed")==="auto"&&(e=Math.round((l.data("scrollInertia")+100)/40)),e}}l.data("autoScrollOnFocus")&&(l.data("bindEvent_focusin")||(t.bind("focusin",function(){t.scrollTop(0).scrollLeft(0);var n=e(document.activeElement);if(n.is("input,textarea,select,button,a[tabindex],area,object")){var i=r.position().top,s=n.position().top,o=t.height()-n.outerHeight();l.data("horizontalScroll")&&(i=r.position().left,s=n.position().left,o=t.width()-n.outerWidth()),(i+s<0||i+s>o)&&l.mCustomScrollbar("scrollTo",s,{trigger:"internal"})}}),l.data({bindEvent_focusin:!0}))),l.data("autoHideScrollbar")&&(l.data("bindEvent_autoHideScrollbar")||(t.bind("mouseenter",function(e){t.addClass("mCS-mouse-over"),n.showScrollbar.call(t.children(".mCSB_scrollTools"))}).bind("mouseleave touchend",function(e){t.removeClass("mCS-mouse-over"),e.type==="mouseleave"&&n.hideScrollbar.call(t.children(".mCSB_scrollTools"))}),l.data({bindEvent_autoHideScrollbar:!0})))},scrollTo:function(t,r){function E(e){this.mcs={top:a.position().top,left:a.position().left,draggerTop:h.position().top,draggerLeft:h.position().left,topPct:Math.round(100*Math.abs(a.position().top)/Math.abs(a.outerHeight()-u.height())),leftPct:Math.round(100*Math.abs(a.position().left)/Math.abs(a.outerWidth()-u.width()))};switch(e){case"onScrollStart":i.data("mCS_tweenRunning",!0).data("onScrollStart_Callback").call(i,this.mcs);break;case"whileScrolling":i.data("whileScrolling_Callback").call(i,this.mcs);break;case"onScroll":i.data("onScroll_Callback").call(i,this.mcs);break;case"onTotalScrollBack":i.data("onTotalScrollBack_Callback").call(i,this.mcs);break;case"onTotalScroll":i.data("onTotalScroll_Callback").call(i,this.mcs)}}var i=e(this),s={moveDragger:!1,trigger:"external",callbacks:!0,scrollInertia:i.data("scrollInertia"),scrollEasing:i.data("scrollEasing")},r=e.extend(s,r),o,u=i.children(".mCustomScrollBox"),a=u.children(".mCSB_container"),f=u.children(".mCSB_scrollTools"),l=f.children(".mCSB_draggerContainer"),h=l.children(".mCSB_dragger"),p=draggerSpeed=r.scrollInertia,v,m,g,y;if(!a.hasClass("mCS_no_scrollbar")){i.data({mCS_trigger:r.trigger}),i.data("mCS_Init")&&(r.callbacks=!1);if(t||t===0){if(typeof t=="number")r.moveDragger?(o=t,i.data("horizontalScroll")?t=h.position().left*i.data("scrollAmount"):t=h.position().top*i.data("scrollAmount"),draggerSpeed=0):o=t/i.data("scrollAmount");else if(typeof t=="string"){var b;t==="top"?b=0:t==="bottom"&&!i.data("horizontalScroll")?b=a.outerHeight()-u.height():t==="left"?b=0:t==="right"&&i.data("horizontalScroll")?b=a.outerWidth()-u.width():t==="first"?b=i.find(".mCSB_container").find(":first"):t==="last"?b=i.find(".mCSB_container").find(":last"):b=i.find(t),b.length===1?(i.data("horizontalScroll")?t=b.position().left:t=b.position().top,o=t/i.data("scrollAmount")):o=t=b}if(i.data("horizontalScroll")){i.data("onTotalScrollBack_Offset")&&(m=-i.data("onTotalScrollBack_Offset")),i.data("onTotalScroll_Offset")&&(y=u.width()-a.outerWidth()+i.data("onTotalScroll_Offset")),o<0?(o=t=0,clearInterval(i.data("mCSB_buttonScrollLeft")),m||(v=!0)):o>=l.width()-h.width()?(o=l.width()-h.width(),t=u.width()-a.outerWidth(),clearInterval(i.data("mCSB_buttonScrollRight")),y||(g=!0)):t=-t;var w=i.data("snapAmount");w&&(t=Math.round(t/w)*w-i.data("snapOffset")),n.mTweenAxis.call(this,h[0],"left",Math.round(o),draggerSpeed,r.scrollEasing),n.mTweenAxis.call(this,a[0],"left",Math.round(t),p,r.scrollEasing,{onStart:function(){r.callbacks&&!i.data("mCS_tweenRunning")&&E("onScrollStart"),i.data("autoHideScrollbar")&&n.showScrollbar.call(f)},onUpdate:function(){r.callbacks&&E("whileScrolling")},onComplete:function(){r.callbacks&&(E("onScroll"),(v||m&&a.position().left>=m)&&E("onTotalScrollBack"),(g||y&&a.position().left<=y)&&E("onTotalScroll")),h.data("preventAction",!1),i.data("mCS_tweenRunning",!1),i.data("autoHideScrollbar")&&(u.hasClass("mCS-mouse-over")||n.hideScrollbar.call(f))}})}else{i.data("onTotalScrollBack_Offset")&&(m=-i.data("onTotalScrollBack_Offset")),i.data("onTotalScroll_Offset")&&(y=u.height()-a.outerHeight()+i.data("onTotalScroll_Offset")),o<0?(o=t=0,clearInterval(i.data("mCSB_buttonScrollUp")),m||(v=!0)):o>=l.height()-h.height()?(o=l.height()-h.height(),t=u.height()-a.outerHeight(),clearInterval(i.data("mCSB_buttonScrollDown")),y||(g=!0)):t=-t;var w=i.data("snapAmount");w&&(t=Math.round(t/w)*w-i.data("snapOffset")),n.mTweenAxis.call(this,h[0],"top",Math.round(o),draggerSpeed,r.scrollEasing),n.mTweenAxis.call(this,a[0],"top",Math.round(t),p,r.scrollEasing,{onStart:function(){r.callbacks&&!i.data("mCS_tweenRunning")&&E("onScrollStart"),i.data("autoHideScrollbar")&&n.showScrollbar.call(f)},onUpdate:function(){r.callbacks&&E("whileScrolling")},onComplete:function(){r.callbacks&&(E("onScroll"),(v||m&&a.position().top>=m)&&E("onTotalScrollBack"),(g||y&&a.position().top<=y)&&E("onTotalScroll")),h.data("preventAction",!1),i.data("mCS_tweenRunning",!1),i.data("autoHideScrollbar")&&(u.hasClass("mCS-mouse-over")||n.hideScrollbar.call(f))}})}i.data("mCS_Init")&&i.data({mCS_Init:!1})}}},stop:function(){var t=e(this),r=t.children().children(".mCSB_container"),i=t.children().children().children().children(".mCSB_dragger");n.mTweenAxisStop.call(this,r[0]),n.mTweenAxisStop.call(this,i[0])},disable:function(t){var n=e(this),r=n.children(".mCustomScrollBox"),i=r.children(".mCSB_container"),s=r.children(".mCSB_scrollTools"),o=s.children().children(".mCSB_dragger");r.unbind("mousewheel focusin mouseenter mouseleave touchend"),i.unbind("touchstart touchmove"),t&&(n.data("horizontalScroll")?o.add(i).css("left",0):o.add(i).css("top",0)),s.css("display","none"),i.addClass("mCS_no_scrollbar"),n.data({bindEvent_mousewheel:!1,bindEvent_focusin:!1,bindEvent_content_touch:!1,bindEvent_autoHideScrollbar:!1}).addClass("mCS_disabled")},destroy:function(){var t=e(this);t.removeClass("mCustomScrollbar _mCS_"+t.data("mCustomScrollbarIndex")).addClass("mCS_destroyed").children().children(".mCSB_container").unwrap().children().unwrap().siblings(".mCSB_scrollTools").remove(),e(document).unbind("mousemove."+t.data("mCustomScrollbarIndex")+" mouseup."+t.data("mCustomScrollbarIndex")+" MSPointerMove."+t.data("mCustomScrollbarIndex")+" MSPointerUp."+t.data("mCustomScrollbarIndex")),e(window).unbind("resize."+t.data("mCustomScrollbarIndex"))}},n={showScrollbar:function(){this.stop().animate({opacity:1},"fast")},hideScrollbar:function(){this.stop().animate({opacity:0},"fast")},mTweenAxis:function(e,t,n,r,i,s){function v(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()}function m(){c||o.call(),c=v()-f,g(),c>=e._time&&(e._time=c>e._time?c+l-(c-e._time):c+l-1,e._time<c+1&&(e._time=c+1)),e._time<r?e._id=_request(m):a.call()}function g(){r>0?(e.currVal=w(e._time,h,d,r,i),p[t]=Math.round(e.currVal)+"px"):p[t]=n+"px",u.call()}function y(){l=1e3/60,e._time=c+l,_request=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return g(),setTimeout(e,.01)},e._id=_request(m)}function b(){if(e._id==null)return;window.requestAnimationFrame?window.cancelAnimationFrame(e._id):clearTimeout(e._id),e._id=null}function w(e,t,n,r,i){switch(i){case"linear":return n*e/r+t;case"easeOutQuad":return e/=r,-n*e*(e-2)+t;case"easeInOutQuad":e/=r/2;if(e<1)return n/2*e*e+t;return e--,-n/2*(e*(e-2)-1)+t;case"easeOutCubic":return e/=r,e--,n*(e*e*e+1)+t;case"easeOutQuart":return e/=r,e--,-n*(e*e*e*e-1)+t;case"easeOutQuint":return e/=r,e--,n*(e*e*e*e*e+1)+t;case"easeOutCirc":return e/=r,e--,n*Math.sqrt(1-e*e)+t;case"easeOutSine":return n*Math.sin(e/r*(Math.PI/2))+t;case"easeOutExpo":return n*(-Math.pow(2,-10*e/r)+1)+t;case"mcsEaseOut":var s=(e/=r)*e,o=s*e;return t+n*(.499999999999997*o*s+ -2.5*s*s+5.5*o+ -6.5*s+4*e);case"draggerRailEase":e/=r/2;if(e<1)return n/2*e*e*e+t;return e-=2,n/2*(e*e*e+2)+t}}var s=s||{},o=s.onStart||function(){},u=s.onUpdate||function(){},a=s.onComplete||function(){},f=v(),l,c=0,h=e.offsetTop,p=e.style;t==="left"&&(h=e.offsetLeft);var d=n-h;b(),y()},mTweenAxisStop:function(e){if(e._id==null)return;window.requestAnimationFrame?window.cancelAnimationFrame(e._id):clearTimeout(e._id),e._id=null},rafPolyfill:function(){var e=["ms","moz","webkit","o"],t=e.length;while(--t>-1&&!window.requestAnimationFrame)window.requestAnimationFrame=window[e[t]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[t]+"CancelAnimationFrame"]||window[e[t]+"CancelRequestAnimationFrame"]}};n.rafPolyfill.call(),e.support.touch="ontouchstart"in window,e.support.msPointer=window.navigator.msPointerEnabled;var r="https:"==document.location.protocol?"https:":"http:";e.event.special.mousewheel||document.write('<script src="'+r+'//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.0.6/jquery.mousewheel.min.js"></script>'),e.fn.mCustomScrollbar=function(n){if(t[n])return t[n].apply(this,Array.prototype.slice.call(arguments,1));if(typeof n=="object"||!n)return t.init.apply(this,arguments);e.error("Method "+n+" does not exist")}})(jQuery);
(function() {


}).call(this);
$(function(){$('[name="layout-mode"]').on("change",function(){$(".section-content, .footer").toggleClass("container"),$(this).is(":checked")?$(".backgrounds").hide():$(".backgrounds").show()}),$(".backgrounds .background-choice > a").on("click",function(e){e.preventDefault();var t=$(this).attr("data-bg")=="noimage"?"#323232":"url(img/backgrounds/"+$(this).attr("data-bg")+")";$("body").css({background:t,"background-repeat":"no-repeat","background-attachment":"fixed","background-size":"100% 100%"})}),$('[name="header-mode"]').on("change",function(){$("#navbar-top").toggleClass("navbar-fixed-top"),$("body").toggleClass("fixed");if($('[name="sidebar-mode"]').is(":checked")){var e=$(window).scrollTop();e>40&&$("#navside").removeClass("fixed-top").addClass("fixed-top")}}),$('[name="sidebar-mode"]').on("change",function(){$(".side-left").toggleClass("side-left-fixed"),$(this).is(":checked")?$(".side-left").css({"min-height":"100%"}):u()}),$(window).scroll(function(){$(window).scrollTop()>40?$('[name="header-mode"]').is(":checked")||$("#navside").addClass("fixed-top"):$("#navside").removeClass("fixed-top")}),$('[name="theme-mode"]').on("change",function(){var e=$('[name="theme-mode"]:checked').val();e=="dark"?($("#navbar-top").attr("class","navbar navbar-inverse"),$("#navside").attr("class","side-left side-black"),$(".footer").hasClass("container")?$(".footer").attr("class","footer container bg-black"):$(".footer").attr("class","footer bg-black"),$(".side-left > .search-module, .nav-collapse > .search-module").find(".btn").attr("class","btn bg-black")):e=="light"&&($("#navbar-top").attr("class","navbar navbar-cyan"),$("#navside").attr("class","side-left"),$(".footer").hasClass("container")?$(".footer").attr("class","footer container bg-silver"):$(".footer").attr("class","footer bg-silver"),$(".side-left > .search-module, .nav-collapse > .search-module").find(".btn").attr("class","btn bg-cyan")),$('[name="header-mode"]').is(":checked")&&$("#navbar-top").addClass("navbar-fixed-top"),$('[name="sidebar-mode"]').is(":checked")&&$("#navside").toggleClass("side-left-fixed")}),$('[name="syncronize-theme"]').on("change",function(){$(this).is(":checked")?($(".syncronize").show(),$(".unsyncronize").hide()):($(".syncronize").hide(),$(".unsyncronize").show())}),$(".syncronize .themes-choice > a").on("click",function(e){e.preventDefault();var t=$(this).attr("data-theme"),n=$('[name="theme-mode"]:checked').val();$('[name="syncronize-theme"]').is(":checked")&&n=="dark"?($("#navbar-top").attr("class","navbar navbar-inverse"),$("#navside").attr("class","side-left side-"+t),$(".footer").hasClass("container")?$(".footer").attr("class","footer container bg-"+t):$(".footer").attr("class","footer bg-"+t)):$('[name="syncronize-theme"]').is(":checked")&&n=="light"&&($("#navbar-top").attr("class","navbar navbar-"+t),$("#navside").attr("class","side-left")),$('[name="header-mode"]').is(":checked")&&$("#navbar-top").addClass("navbar-fixed-top"),$('[name="sidebar-mode"]').is(":checked")&&$("#navside").toggleClass("side-left-fixed"),$(".side-left > .search-module, .nav-collapse > .search-module").find(".btn").attr("class","btn bg-"+t)}),$(".unsyncronize .themes-navbar > a").on("click",function(e){e.preventDefault();var t=$(this).attr("data-theme");$("#navbar-top").attr("class","navbar navbar-"+t),$('[name="header-mode"]').is(":checked")&&$("#navbar-top").addClass("navbar-fixed-top"),$(".side-left > .search-module, .nav-collapse > .search-module").find(".btn").attr("class","btn bg-"+t)}),$(".unsyncronize .themes-sidebar > a").on("click",function(e){e.preventDefault();var t=$(this).attr("data-theme");$("#navside").attr("class","side-left side-"+t),$(".footer").hasClass("container")?$(".footer").attr("class","footer container bg-"+t):$(".footer").attr("class","footer bg-"+t),$('[name="sidebar-mode"]').is(":checked")&&$("#navside").toggleClass("side-left-fixed")}),$('[data-scrollbar="mscroll"]').each(function(e,t){var n=$(this),r=n.attr("data-theme")==undefined?"light":n.attr("data-theme"),i=n.attr("data-autohide")==undefined?!0:n.attr("data-autohide"),s=n.attr("data-button")==undefined?!1:n.attr("data-button"),o=$.parseJSON(i),u=$.parseJSON(s);n.mCustomScrollbar({autoHideScrollbar:o,scrollButtons:{enable:u,scrollSpeed:100},theme:r})});var e=$("[data-toggle=dropdown-list]");e.click(function(e){e.preventDefault();var t=$(this).offsetParent(".dropdown-list"),n=t.find(".dropdown-menu");n.slideUp();var r=t.hasClass("open");r==0?(t.addClass("open"),n.slideDown()):(t.removeClass("open"),n.slideUp())});var t=$(".btn-navbar").attr("data-target"),n=$('[data-collapse="navbar"]').html();$(t).html(n),$(t).find(".nav").addClass("nav-list").find("li.dropdown-list").removeClass("dropdown-list").addClass("dropdown").find("a[data-toggle=dropdown-list]").attr("data-toggle","dropdown").find("i").remove(),$(".nav-collapse").find("a[data-toggle=dropdown]").find("i, .caret").remove(),$("[data-toggle=collapse-all-widgets]").click(function(e){e.preventDefault();var t=$(".widget").find(".widget-content"),n=$(".widget-header [data-toggle=collapse] > i");$(n).attr("class","icomo-plus"),$(t).slideUp(300,"easeOutQuad")}),$("[data-toggle=expand-all-widgets]").click(function(e){e.preventDefault();var t=$(".widget").find(".widget-content"),n=$(".widget-header [data-toggle=collapse] > i");$(n).attr("class","icomo-minus"),$(t).slideDown(300,"easeOutQuad")}),$("[data-toggle=toggle-all-widgets]").click(function(e){e.preventDefault();var t=$(".widget").find(".widget-content");$(t).slideToggle(300,"easeOutQuad")}),$(".widget > .widget-header").dblclick(function(e){e.preventDefault();var t=$(this).parent().find(".widget-content"),n=$(this).parent().find(".widget-header [data-toggle=collapse] > i"),r=$(n).attr("data-toggle-icon");$(n).toggleClass(r),$(t).slideToggle(300,"easeOutQuad",function(){u()})}),$(".widget[data-collapse=true] .widget-content").slideUp(),$(".widget[data-collapse=true] .widget-header [data-toggle=collapse] > i").attr("class","aweso-plus"),$(".widget [data-toggle=close]").click(function(e){e.preventDefault();var t=$(this).attr("data-close");$(t).hide(300,"easeOutQuad")}),$(".widget [data-toggle=collapse]").click(function(e){e.preventDefault();var t=$(this).attr("data-collapse"),n=$(this).find("i"),r=$(n).attr("data-toggle-icon");$(n).toggleClass(r),$(t+" .widget-content").slideToggle(300,"easeOutQuad",function(){u()})}),$(".widget [data-toggle=fullscreen]").click(function(e){e.preventDefault();var t=$(this).attr("data-fullscreen"),n=$(t).hasClass("with-tile"),r=$(this).find("i"),i=$(r).attr("data-toggle-icon");$(r).toggleClass(i),$(t).toggleClass("fullscreen"),n==1&&($(t).toggleClass("with-tile"),$(t).hide())}),$('[data-toggle="appbar"]').click(function(e){e.preventDefault();var t=$(this).attr("data-target");$(t).hasClass("open")==0?($(".appbar").removeClass("open"),$(t).addClass("open")):!$(e.target).is("input")&&!$(e.target).is("textarea")&&!$(e.target).is("select")&&!$(e.target).is("form")&&$(t).removeClass("open")}).focus(function(e){e.preventDefault();var t=$(this).attr("data-target");$(t).hasClass("open")==0?($(".appbar").removeClass("open"),$(t).addClass("open")):!$(e.target).is("input")&&!$(e.target).is("textarea")&&!$(e.target).is("select")&&!$(e.target).is("form")&&$(t).removeClass("open")}),$(document.body).click(function(e){var t=e.target;!$(t).is(".appbar")&&!$(t).parents().is(".appbar")&&!$(t).is('[data-toggle="appbar"]')&&$(".appbar").removeClass("open")});var r='<div class="splash">    <div class="splash-inner">        <i class="icomo-atom"></i>        <p class="brand">Stilearn Metro</p>        <p class="splash-text">Destination progress text</p>        <div class="splash-loader">            <img class="preload-large" src="img/preload-6-white.gif" alt="" />        </div>    </div></div>',i='<div class="splash splash-inline">    <div class="splash-inner">        <div class="splash-loader">          <img src="img/preload-5-black.gif" alt="" />        </div>    </div></div>',s=$("body").attr("data-splash"),o=$("body").attr("data-splash-type");if(s==1||s=="true")o=="inline"?($("body").append(i),$("body > *").css({visibility:"visible"}),$(".splash.splash-inline").fadeIn()):($("body").append(r),$(".splash").fadeIn(function(){$(this).css({visibility:"visible"})}));$(window).bind("load",function(){o=="inline"?$(".splash.splash-inline").fadeOut():$(".splash").fadeOut(2e3,function(){$("body > *").not(".splash").css({visibility:"visible"})})}),$('[data-ui="slider"]').each(function(){var e=$(this),t=e.attr("data-slider-animate")==undefined?!1:e.attr("data-slider-animate"),n=e.attr("data-slider-disabled")==undefined?!1:Boolean(e.attr("data-slider-disabled")),r=e.attr("data-slider-max")==undefined?100:parseInt(e.attr("data-slider-max")),i=e.attr("data-slider-min")==undefined?0:parseInt(e.attr("data-slider-min")),s=e.attr("data-slider-orientation")==undefined?"horizontal":e.attr("data-slider-orientation"),o=e.attr("data-slider-range")==undefined?!1:e.attr("data-slider-range"),u=e.attr("data-slider-step")==undefined?1:parseInt(e.attr("data-slider-step")),a=e.attr("data-slider-value")==undefined?0:parseInt(e.attr("data-slider-value")),f=e.attr("data-slider-values")==undefined?null:e.attr("data-slider-values").split(","),l=o=="true"?Boolean(o):o,c={animate:t,disabled:n,max:r,min:i,orientation:s,range:l,step:u,value:a,values:f};e.slider(c)}),$("[data-toggle=tooltip]").tooltip(),$("[data-toggle=tooltip-bottom]").tooltip({placement:"bottom"}),$("[data-toggle=tooltip-right]").tooltip({placement:"right"}),$("[data-toggle=tooltip-left]").tooltip({placement:"left"}),$("[data-toggle=popover]").click(function(e){e.preventDefault()}),$("[data-toggle=popover]").popover(),$("[data-toggle=popover-bottom]").popover({placement:"bottom"}),$("[data-toggle=popover-right]").popover({placement:"right"}),$("[data-toggle=popover-left]").popover({placement:"left"}),$("a[data-scroll=true]").click(function(e){e.preventDefault(),$(document.body).animate({scrollTop:$(this.hash).offset().top},"slow")}),$("[data-chart=sparklines]").each(function(){var e=$(this),t=$(e).html(),n=t.split(","),r=e.attr("data-height"),i=e.attr("data-color"),s=function(){e.sparkline(n,{type:"bar",height:r,width:"100%",barColor:i,barWidth:5})},o;$(window).resize(function(e){clearTimeout(o),o=setTimeout(s,500)}),s()}),$('[data-dropdown="no-propagation"] *').click(function(e){e.stopPropagation()}),$(".theme-switcher li a").click(function(e){e.preventDefault();var t=$(this),n=t.parent().parent().attr("data-target"),r=t.parent().parent().attr("data-target-class"),i=t.attr("data-theme");$(n).attr("class",r).addClass(i)}),$(".pie-donat-text").each(function(){var e=$(this),t=e.parent().height()/2-e.height()/2;e.css({top:t})}),$(".message-checked").bind("click",function(){$(this).parent().toggleClass("selected")});var u=function(){var e=$(".section-content").height(),t=$(".section-content > .content").height();$(".side-left").hasClass("side-left-fixed")||(e==t?$(".side-left").css({"min-height":e+"px"}):e>t&&$(".side-left").css({"min-height":t+"px"}))};$(window).bind("load",function(){var e=$(".section-content").height();$(".side-left").css({"min-height":e+"px"})}),$(window).resize(function(){$(window).width()>979&&u()})});
(function(){var e,t,n,r,i=[].slice,s={}.hasOwnProperty,o=function(e,t){function n(){this.constructor=e}for(var r in t)s.call(t,r)&&(e[r]=t[r]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},u=function(e,t){return function(){return e.apply(t,arguments)}},a=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};t=window.Morris={},e=jQuery,t.EventEmitter=function(){function e(){}return e.prototype.on=function(e,t){return this.handlers==null&&(this.handlers={}),this.handlers[e]==null&&(this.handlers[e]=[]),this.handlers[e].push(t),this},e.prototype.fire=function(){var e,t,n,r,s,o,u;n=arguments[0],e=2<=arguments.length?i.call(arguments,1):[];if(this.handlers!=null&&this.handlers[n]!=null){o=this.handlers[n],u=[];for(r=0,s=o.length;r<s;r++)t=o[r],u.push(t.apply(null,e));return u}},e}(),t.commas=function(e){var t,n,r,i;return e!=null?(r=e<0?"-":"",t=Math.abs(e),n=Math.floor(t).toFixed(0),r+=n.replace(/(?=(?:\d{3})+$)(?!^)/g,","),i=t.toString(),i.length>n.length&&(r+=i.slice(n.length)),r):"-"},t.pad2=function(e){return(e<10?"0":"")+e},t.Grid=function(n){function r(t){var n=this;typeof t.element=="string"?this.el=e(document.getElementById(t.element)):this.el=e(t.element);if(this.el==null||this.el.length===0)throw new Error("Graph container element not found");this.el.css("position")==="static"&&this.el.css("position","relative"),this.options=e.extend({},this.gridDefaults,this.defaults||{},t),typeof this.options.units=="string"&&(this.options.postUnits=t.units),this.raphael=new Raphael(this.el[0]),this.elementWidth=null,this.elementHeight=null,this.dirty=!1,this.init&&this.init(),this.setData(this.options.data),this.el.bind("mousemove",function(e){var t;return t=n.el.offset(),n.fire("hovermove",e.pageX-t.left,e.pageY-t.top)}),this.el.bind("mouseout",function(e){return n.fire("hoverout")}),this.el.bind("touchstart touchmove touchend",function(e){var t,r;return r=e.originalEvent.touches[0]||e.originalEvent.changedTouches[0],t=n.el.offset(),n.fire("hover",r.pageX-t.left,r.pageY-t.top),r}),this.el.bind("click",function(e){var t;return t=n.el.offset(),n.fire("gridclick",e.pageX-t.left,e.pageY-t.top)}),this.postInit&&this.postInit()}return o(r,n),r.prototype.gridDefaults={dateFormat:null,axes:!0,grid:!0,gridLineColor:"#aaa",gridStrokeWidth:.5,gridTextColor:"#888",gridTextSize:12,gridTextFamily:"sans-serif",gridTextWeight:"normal",hideHover:!1,yLabelFormat:null,xLabelAngle:0,numLines:5,padding:25,parseTime:!0,postUnits:"",preUnits:"",ymax:"auto",ymin:"auto 0",goals:[],goalStrokeWidth:1,goalLineColors:["#666633","#999966","#cc6666","#663333"],events:[],eventStrokeWidth:1,eventLineColors:["#005a04","#ccffbb","#3a5f0b","#005502"]},r.prototype.setData=function(e,n){var r,i,s,o,u,a,f,l,c,h,p,d,v,m;n==null&&(n=!0),this.options.data=e;if(e==null||e.length===0){this.data=[],this.raphael.clear(),this.hover!=null&&this.hover.hide();return}d=this.cumulative?0:null,v=this.cumulative?0:null,this.options.goals.length>0&&(u=Math.min.apply(null,this.options.goals),o=Math.max.apply(null,this.options.goals),v=v!=null?Math.min(v,u):u,d=d!=null?Math.max(d,o):o),this.data=function(){var n,r,o;o=[];for(s=n=0,r=e.length;n<r;s=++n)f=e[s],a={},a.label=f[this.options.xkey],this.options.parseTime?(a.x=t.parseDate(a.label),this.options.dateFormat?a.label=this.options.dateFormat(a.x):typeof a.label=="number"&&(a.label=(new Date(a.label)).toString())):(a.x=s,this.options.xLabelFormat&&(a.label=this.options.xLabelFormat(a))),c=0,a.y=function(){var e,t,n,r;n=this.options.ykeys,r=[];for(i=e=0,t=n.length;e<t;i=++e)p=n[i],m=f[p],typeof m=="string"&&(m=parseFloat(m)),m!=null&&typeof m!="number"&&(m=null),m!=null&&(this.cumulative?c+=m:d!=null?(d=Math.max(m,d),v=Math.min(m,v)):d=v=m),this.cumulative&&c!=null&&(d=Math.max(c,d),v=Math.min(c,v)),r.push(m);return r}.call(this),o.push(a);return o}.call(this),this.options.parseTime&&(this.data=this.data.sort(function(e,t){return(e.x>t.x)-(t.x>e.x)})),this.xmin=this.data[0].x,this.xmax=this.data[this.data.length-1].x,this.events=[],this.options.parseTime&&this.options.events.length>0&&(this.events=function(){var e,n,i,s;i=this.options.events,s=[];for(e=0,n=i.length;e<n;e++)r=i[e],s.push(t.parseDate(r));return s}.call(this),this.xmax=Math.max(this.xmax,Math.max.apply(null,this.events)),this.xmin=Math.min(this.xmin,Math.min.apply(null,this.events))),this.xmin===this.xmax&&(this.xmin-=1,this.xmax+=1),this.ymin=this.yboundary("min",v),this.ymax=this.yboundary("max",d),this.ymin===this.ymax&&(v&&(this.ymin-=1),this.ymax+=1);if(this.options.axes===!0||this.options.grid===!0)this.options.ymax===this.gridDefaults.ymax&&this.options.ymin===this.gridDefaults.ymin?(this.grid=this.autoGridLines(this.ymin,this.ymax,this.options.numLines),this.ymin=Math.min(this.ymin,this.grid[0]),this.ymax=Math.max(this.ymax,this.grid[this.grid.length-1])):(l=(this.ymax-this.ymin)/(this.options.numLines-1),this.grid=function(){var e,t,n,r;r=[];for(h=e=t=this.ymin,n=this.ymax;t<=n?e<=n:e>=n;h=e+=l)r.push(h);return r}.call(this));this.dirty=!0;if(n)return this.redraw()},r.prototype.yboundary=function(e,t){var n,r;return n=this.options["y"+e],typeof n=="string"?n.slice(0,4)==="auto"?n.length>5?(r=parseInt(n.slice(5),10),t==null?r:Math[e](t,r)):t!=null?t:0:parseInt(n,10):n},r.prototype.autoGridLines=function(e,t,n){var r,i,s,o,u,a,f,l,c;return u=t-e,c=Math.floor(Math.log(u)/Math.log(10)),f=Math.pow(10,c),i=Math.floor(e/f)*f,r=Math.ceil(t/f)*f,a=(r-i)/(n-1),f===1&&a>1&&Math.ceil(a)!==a&&(a=Math.ceil(a),r=i+a*(n-1)),i<0&&r>0&&(i=Math.floor(e/a)*a,r=Math.ceil(t/a)*a),a<1?(o=Math.floor(Math.log(a)/Math.log(10)),s=function(){var e,t;t=[];for(l=e=i;i<=r?e<=r:e>=r;l=e+=a)t.push(parseFloat(l.toFixed(1-o)));return t}()):s=function(){var e,t;t=[];for(l=e=i;i<=r?e<=r:e>=r;l=e+=a)t.push(l);return t}(),s},r.prototype._calc=function(){var e,t,n,r,i,s;i=this.el.width(),n=this.el.height();if(this.elementWidth!==i||this.elementHeight!==n||this.dirty){this.elementWidth=i,this.elementHeight=n,this.dirty=!1,this.left=this.options.padding,this.right=this.elementWidth-this.options.padding,this.top=this.options.padding,this.bottom=this.elementHeight-this.options.padding,this.options.axes&&(s=function(){var e,n,r,i;r=this.grid,i=[];for(e=0,n=r.length;e<n;e++)t=r[e],i.push(this.measureText(this.yAxisFormat(t)).width);return i}.call(this),this.left+=Math.max.apply(Math,s),e=function(){var e,t,n;n=[];for(r=e=0,t=this.data.length;0<=t?e<t:e>t;r=0<=t?++e:--e)n.push(this.measureText(this.data[r].text,-this.options.xLabelAngle).height);return n}.call(this),this.bottom-=Math.max.apply(Math,e)),this.width=Math.max(1,this.right-this.left),this.height=Math.max(1,this.bottom-this.top),this.dx=this.width/(this.xmax-this.xmin),this.dy=this.height/(this.ymax-this.ymin);if(this.calc)return this.calc()}},r.prototype.transY=function(e){return this.bottom-(e-this.ymin)*this.dy},r.prototype.transX=function(e){return this.data.length===1?(this.left+this.right)/2:this.left+(e-this.xmin)*this.dx},r.prototype.redraw=function(){this.raphael.clear(),this._calc(),this.drawGrid(),this.drawGoals(),this.drawEvents();if(this.draw)return this.draw()},r.prototype.measureText=function(e,t){var n,r;return t==null&&(t=0),r=this.raphael.text(100,100,e).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).rotate(t),n=r.getBBox(),r.remove(),n},r.prototype.yAxisFormat=function(e){return this.yLabelFormat(e)},r.prototype.yLabelFormat=function(e){return typeof this.options.yLabelFormat=="function"?this.options.yLabelFormat(e):""+this.options.preUnits+t.commas(e)+this.options.postUnits},r.prototype.updateHover=function(e,t){var n,r;n=this.hitTest(e,t);if(n!=null)return(r=this.hover).update.apply(r,n)},r.prototype.drawGrid=function(){var e,t,n,r,i,s;if(this.options.grid===!1&&this.options.axes===!1)return;i=this.grid,s=[];for(n=0,r=i.length;n<r;n++)e=i[n],t=this.transY(e),this.options.axes&&this.drawYAxisLabel(this.left-this.options.padding/2,t,this.yAxisFormat(e)),this.options.grid?s.push(this.drawGridLine("M"+this.left+","+t+"H"+(this.left+this.width))):s.push(void 0);return s},r.prototype.drawGoals=function(){var e,t,n,r,i,s,o;s=this.options.goals,o=[];for(n=r=0,i=s.length;r<i;n=++r)t=s[n],e=this.options.goalLineColors[n%this.options.goalLineColors.length],o.push(this.drawGoal(t,e));return o},r.prototype.drawEvents=function(){var e,t,n,r,i,s,o;s=this.events,o=[];for(n=r=0,i=s.length;r<i;n=++r)t=s[n],e=this.options.eventLineColors[n%this.options.eventLineColors.length],o.push(this.drawEvent(t,e));return o},r.prototype.drawGoal=function(e,t){return this.raphael.path("M"+this.left+","+this.transY(e)+"H"+this.right).attr("stroke",t).attr("stroke-width",this.options.goalStrokeWidth)},r.prototype.drawEvent=function(e,t){return this.raphael.path("M"+this.transX(e)+","+this.bottom+"V"+this.top).attr("stroke",t).attr("stroke-width",this.options.eventStrokeWidth)},r.prototype.drawYAxisLabel=function(e,t,n){return this.raphael.text(e,t,n).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor).attr("text-anchor","end")},r.prototype.drawGridLine=function(e){return this.raphael.path(e).attr("stroke",this.options.gridLineColor).attr("stroke-width",this.options.gridStrokeWidth)},r}(t.EventEmitter),t.parseDate=function(e){var t,n,r,i,s,o,u,a,f,l,c;return typeof e=="number"?e:(n=e.match(/^(\d+) Q(\d)$/),i=e.match(/^(\d+)-(\d+)$/),s=e.match(/^(\d+)-(\d+)-(\d+)$/),u=e.match(/^(\d+) W(\d+)$/),a=e.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)(Z|([+-])(\d\d):?(\d\d))?$/),f=e.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+):(\d+(\.\d+)?)(Z|([+-])(\d\d):?(\d\d))?$/),n?(new Date(parseInt(n[1],10),parseInt(n[2],10)*3-1,1)).getTime():i?(new Date(parseInt(i[1],10),parseInt(i[2],10)-1,1)).getTime():s?(new Date(parseInt(s[1],10),parseInt(s[2],10)-1,parseInt(s[3],10))).getTime():u?(l=new Date(parseInt(u[1],10),0,1),l.getDay()!==4&&l.setMonth(0,1+(4-l.getDay()+7)%7),l.getTime()+parseInt(u[2],10)*6048e5):a?a[6]?(o=0,a[6]!=="Z"&&(o=parseInt(a[8],10)*60+parseInt(a[9],10),a[7]==="+"&&(o=0-o)),Date.UTC(parseInt(a[1],10),parseInt(a[2],10)-1,parseInt(a[3],10),parseInt(a[4],10),parseInt(a[5],10)+o)):(new Date(parseInt(a[1],10),parseInt(a[2],10)-1,parseInt(a[3],10),parseInt(a[4],10),parseInt(a[5],10))).getTime():f?(c=parseFloat(f[6]),t=Math.floor(c),r=Math.round((c-t)*1e3),f[8]?(o=0,f[8]!=="Z"&&(o=parseInt(f[10],10)*60+parseInt(f[11],10),f[9]==="+"&&(o=0-o)),Date.UTC(parseInt(f[1],10),parseInt(f[2],10)-1,parseInt(f[3],10),parseInt(f[4],10),parseInt(f[5],10)+o,t,r)):(new Date(parseInt(f[1],10),parseInt(f[2],10)-1,parseInt(f[3],10),parseInt(f[4],10),parseInt(f[5],10),t,r)).getTime()):(new Date(parseInt(e,10),0,1)).getTime())},t.Hover=function(){function n(n){n==null&&(n={}),this.options=e.extend({},t.Hover.defaults,n),this.el=e("<div class='"+this.options["class"]+"'></div>"),this.el.hide(),this.options.parent.append(this.el)}return n.defaults={"class":"morris-hover morris-default-style"},n.prototype.update=function(e,t,n){return this.html(e),this.show(),this.moveTo(t,n)},n.prototype.html=function(e){return this.el.html(e)},n.prototype.moveTo=function(e,t){var n,r,i,s,o,u;return o=this.options.parent.innerWidth(),s=this.options.parent.innerHeight(),r=this.el.outerWidth(),n=this.el.outerHeight(),i=Math.min(Math.max(0,e-r/2),o-r),t!=null?(u=t-n-10,u<0&&(u=t+10,u+n>s&&(u=s/2-n/2))):u=s/2-n/2,this.el.css({left:i+"px",top:parseInt(u)+"px"})},n.prototype.show=function(){return this.el.show()},n.prototype.hide=function(){return this.el.hide()},n}(),t.Line=function(e){function n(e){this.hilight=u(this.hilight,this),this.onHoverOut=u(this.onHoverOut,this),this.onHoverMove=u(this.onHoverMove,this),this.onGridClick=u(this.onGridClick,this);if(!(this instanceof t.Line))return new t.Line(e);n.__super__.constructor.call(this,e)}return o(n,e),n.prototype.init=function(){this.pointGrow=Raphael.animation({r:this.options.pointSize+3},25,"linear"),this.pointShrink=Raphael.animation({r:this.options.pointSize},25,"linear");if(this.options.hideHover!=="always")return this.hover=new t.Hover({parent:this.el}),this.on("hovermove",this.onHoverMove),this.on("hoverout",this.onHoverOut),this.on("gridclick",this.onGridClick)},n.prototype.defaults={lineWidth:3,pointSize:4,lineColors:["#0b62a4","#7A92A3","#4da74d","#afd8f8","#edc240","#cb4b4b","#9440ed"],pointWidths:[1],pointStrokeColors:["#ffffff"],pointFillColors:[],smooth:!0,xLabels:"auto",xLabelFormat:null,xLabelMargin:24,continuousLine:!0,hideHover:!1},n.prototype.calc=function(){return this.calcPoints(),this.generatePaths()},n.prototype.calcPoints=function(){var e,t,n,r,i,s;i=this.data,s=[];for(n=0,r=i.length;n<r;n++)e=i[n],e._x=this.transX(e.x),e._y=function(){var n,r,i,s;i=e.y,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],t!=null?s.push(this.transY(t)):s.push(t);return s}.call(this),s.push(e._ymax=Math.min.apply(null,[this.bottom].concat(function(){var n,r,i,s;i=e._y,s=[];for(n=0,r=i.length;n<r;n++)t=i[n],t!=null&&s.push(t);return s}())));return s},n.prototype.hitTest=function(e,t){var n,r,i,s,o;if(this.data.length===0)return null;o=this.data.slice(1);for(n=i=0,s=o.length;i<s;n=++i){r=o[n];if(e<(r._x+this.data[n]._x)/2)break}return n},n.prototype.onGridClick=function(e,t){var n;return n=this.hitTest(e,t),this.fire("click",n,this.options.data[n],e,t)},n.prototype.onHoverMove=function(e,t){var n;return n=this.hitTest(e,t),this.displayHoverForRow(n)},n.prototype.onHoverOut=function(){if(this.options.hideHover!==!1)return this.displayHoverForRow(null)},n.prototype.displayHoverForRow=function(e){var t;return e!=null?((t=this.hover).update.apply(t,this.hoverContentForRow(e)),this.hilight(e)):(this.hover.hide(),this.hilight())},n.prototype.hoverContentForRow=function(e){var t,n,r,i,s,o,u;r=this.data[e],t="<div class='morris-hover-row-label'>"+r.label+"</div>",u=r.y;for(n=s=0,o=u.length;s<o;n=++s)i=u[n],t+="<div class='morris-hover-point' style='color: "+this.colorFor(r,n,"label")+"'>\n  "+this.options.labels[n]+":\n  "+this.yLabelFormat(i)+"\n</div>";return typeof this.options.hoverCallback=="function"&&(t=this.options.hoverCallback(e,this.options,t)),[t,r._x,r._ymax]},n.prototype.generatePaths=function(){var e,n,r,i,s;return this.paths=function(){var o,u,f,l;l=[];for(r=o=0,u=this.options.ykeys.length;0<=u?o<u:o>u;r=0<=u?++o:--o)s=this.options.smooth===!0||(f=this.options.ykeys[r],a.call(this.options.smooth,f)>=0),n=function(){var e,t,n,s;n=this.data,s=[];for(e=0,t=n.length;e<t;e++)i=n[e],i._y[r]!==void 0&&s.push({x:i._x,y:i._y[r]});return s}.call(this),this.options.continuousLine&&(n=function(){var t,r,i;i=[];for(t=0,r=n.length;t<r;t++)e=n[t],e.y!==null&&i.push(e);return i}()),n.length>1?l.push(t.Line.createPath(n,s,this.bottom)):l.push(null);return l}.call(this)},n.prototype.draw=function(){this.options.axes&&this.drawXAxis(),this.drawSeries();if(this.options.hideHover===!1)return this.displayHoverForRow(this.data.length-1)},n.prototype.drawXAxis=function(){var e,n,r,i,s,o,u,a,f,l,c=this;u=this.bottom+this.options.padding/2,s=null,i=null,e=function(e,t){var n,r,o,a,f;return n=c.drawXAxisLabel(c.transX(t),u,e),f=n.getBBox(),n.transform("r"+ -c.options.xLabelAngle),r=n.getBBox(),n.transform("t0,"+r.height/2+"..."),c.options.xLabelAngle!==0&&(a=-0.5*f.width*Math.cos(c.options.xLabelAngle*Math.PI/180),n.transform("t"+a+",0...")),r=n.getBBox(),(s==null||s>=r.x+r.width||i!=null&&i>=r.x)&&r.x>=0&&r.x+r.width<c.el.width()?(c.options.xLabelAngle!==0&&(o=1.25*c.options.gridTextSize/Math.sin(c.options.xLabelAngle*Math.PI/180),i=r.x-o),s=r.x-c.options.xLabelMargin):n.remove()},this.options.parseTime?this.data.length===1&&this.options.xLabels==="auto"?r=[[this.data[0].label,this.data[0].x]]:r=t.labelSeries(this.xmin,this.xmax,this.width,this.options.xLabels,this.options.xLabelFormat):r=function(){var e,t,n,r;n=this.data,r=[];for(e=0,t=n.length;e<t;e++)o=n[e],r.push([o.label,o.x]);return r}.call(this),r.reverse(),l=[];for(a=0,f=r.length;a<f;a++)n=r[a],l.push(e(n[0],n[1]));return l},n.prototype.drawSeries=function(){var e,t,n,r,i,s;this.seriesPoints=[];for(e=t=r=this.options.ykeys.length-1;r<=0?t<=0:t>=0;e=r<=0?++t:--t)this._drawLineFor(e);s=[];for(e=n=i=this.options.ykeys.length-1;i<=0?n<=0:n>=0;e=i<=0?++n:--n)s.push(this._drawPointFor(e));return s},n.prototype._drawPointFor=function(e){var t,n,r,i,s,o;this.seriesPoints[e]=[],s=this.data,o=[];for(r=0,i=s.length;r<i;r++)n=s[r],t=null,n._y[e]!=null&&(t=this.drawLinePoint(n._x,n._y[e],this.options.pointSize,this.colorFor(n,e,"point"),e)),o.push(this.seriesPoints[e].push(t));return o},n.prototype._drawLineFor=function(e){var t;t=this.paths[e];if(t!==null)return this.drawLinePath(t,this.colorFor(null,e,"line"))},n.createPath=function(e,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m,g;l="",n&&(o=t.Line.gradients(e)),c={y:null};for(u=m=0,g=e.length;m<g;u=++m){i=e[u];if(i.y!=null)if(c.y!=null)n?(s=o[u],f=o[u-1],a=(i.x-c.x)/4,h=c.x+a,d=Math.min(r,c.y+a*f),p=i.x-a,v=Math.min(r,i.y-a*s),l+="C"+h+","+d+","+p+","+v+","+i.x+","+i.y):l+="L"+i.x+","+i.y;else if(!n||o[u]!=null)l+="M"+i.x+","+i.y;c=i}return l},n.gradients=function(e){var t,n,r,i,s,o,u,a;n=function(e,t){return(e.y-t.y)/(e.x-t.x)},a=[];for(r=o=0,u=e.length;o<u;r=++o)t=e[r],t.y!=null?(i=e[r+1]||{y:null},s=e[r-1]||{y:null},s.y!=null&&i.y!=null?a.push(n(s,i)):s.y!=null?a.push(n(s,t)):i.y!=null?a.push(n(t,i)):a.push(null)):a.push(null);return a},n.prototype.hilight=function(e){var t,n,r,i,s;if(this.prevHilight!==null&&this.prevHilight!==e)for(t=n=0,i=this.seriesPoints.length-1;0<=i?n<=i:n>=i;t=0<=i?++n:--n)this.seriesPoints[t][this.prevHilight]&&this.seriesPoints[t][this.prevHilight].animate(this.pointShrink);if(e!==null&&this.prevHilight!==e)for(t=r=0,s=this.seriesPoints.length-1;0<=s?r<=s:r>=s;t=0<=s?++r:--r)this.seriesPoints[t][e]&&this.seriesPoints[t][e].animate(this.pointGrow);return this.prevHilight=e},n.prototype.colorFor=function(e,t,n){return typeof this.options.lineColors=="function"?this.options.lineColors.call(this,e,t,n):n==="point"?this.options.pointFillColors[t%this.options.pointFillColors.length]||this.options.lineColors[t%this.options.lineColors.length]:this.options.lineColors[t%this.options.lineColors.length]},n.prototype.drawXAxisLabel=function(e,t,n){return this.raphael.text(e,t,n).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor)},n.prototype.drawLinePath=function(e,t){return this.raphael.path(e).attr("stroke",t).attr("stroke-width",this.options.lineWidth)},n.prototype.drawLinePoint=function(e,t,n,r,i){return this.raphael.circle(e,t,n).attr("fill",r).attr("stroke-width",this.strokeWidthForSeries(i)).attr("stroke",this.strokeForSeries(i))},n.prototype.strokeWidthForSeries=function(e){return this.options.pointWidths[e%this.options.pointWidths.length]},n.prototype.strokeForSeries=function(e){return this.options.pointStrokeColors[e%this.options.pointStrokeColors.length]},n}(t.Grid),t.labelSeries=function(n,r,i,s,o){var u,a,f,l,c,h,p,d,v,m,g;f=200*(r-n)/i,a=new Date(n),p=t.LABEL_SPECS[s];if(p===void 0){g=t.AUTO_LABEL_ORDER;for(v=0,m=g.length;v<m;v++){l=g[v],h=t.LABEL_SPECS[l];if(f>=h.span){p=h;break}}}p===void 0&&(p=t.LABEL_SPECS.second),o&&(p=e.extend({},p,{fmt:o})),u=p.start(a),c=[];while((d=u.getTime())<=r)d>=n&&c.push([p.fmt(u),d]),p.incr(u);return c},n=function(e){return{span:e*60*1e3,start:function(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours())},fmt:function(e){return""+t.pad2(e.getHours())+":"+t.pad2(e.getMinutes())},incr:function(t){return t.setUTCMinutes(t.getUTCMinutes()+e)}}},r=function(e){return{span:e*1e3,start:function(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes())},fmt:function(e){return""+t.pad2(e.getHours())+":"+t.pad2(e.getMinutes())+":"+t.pad2(e.getSeconds())},incr:function(t){return t.setUTCSeconds(t.getUTCSeconds()+e)}}},t.LABEL_SPECS={decade:{span:1728e8,start:function(e){return new Date(e.getFullYear()-e.getFullYear()%10,0,1)},fmt:function(e){return""+e.getFullYear()},incr:function(e){return e.setFullYear(e.getFullYear()+10)}},year:{span:1728e7,start:function(e){return new Date(e.getFullYear(),0,1)},fmt:function(e){return""+e.getFullYear()},incr:function(e){return e.setFullYear(e.getFullYear()+1)}},month:{span:24192e5,start:function(e){return new Date(e.getFullYear(),e.getMonth(),1)},fmt:function(e){return""+e.getFullYear()+"-"+t.pad2(e.getMonth()+1)},incr:function(e){return e.setMonth(e.getMonth()+1)}},day:{span:864e5,start:function(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate())},fmt:function(e){return""+e.getFullYear()+"-"+t.pad2(e.getMonth()+1)+"-"+t.pad2(e.getDate())},incr:function(e){return e.setDate(e.getDate()+1)}},hour:n(60),"30min":n(30),"15min":n(15),"10min":n(10),"5min":n(5),minute:n(1),"30sec":r(30),"15sec":r(15),"10sec":r(10),"5sec":r(5),second:r(1)},t.AUTO_LABEL_ORDER=["decade","year","month","day","hour","30min","15min","10min","5min","minute","30sec","15sec","10sec","5sec","second"],t.Area=function(n){function r(n){var s;if(!(this instanceof t.Area))return new t.Area(n);s=e.extend({},i,n),this.cumulative=!s.behaveLikeLine,s.fillOpacity==="auto"&&(s.fillOpacity=s.behaveLikeLine?.8:1),r.__super__.constructor.call(this,s)}var i;return o(r,n),i={fillOpacity:"auto",behaveLikeLine:!1},r.prototype.calcPoints=function(){var e,t,n,r,i,s,o;s=this.data,o=[];for(r=0,i=s.length;r<i;r++)e=s[r],e._x=this.transX(e.x),t=0,e._y=function(){var r,i,s,o;s=e.y,o=[];for(r=0,i=s.length;r<i;r++)n=s[r],this.options.behaveLikeLine?o.push(this.transY(n)):(t+=n||0,o.push(this.transY(t)));return o}.call(this),o.push(e._ymax=Math.max.apply(Math,e._y));return o},r.prototype.drawSeries=function(){var e,t,n,r,i,s,o,u,a,f,l;this.seriesPoints=[],this.options.behaveLikeLine?t=function(){a=[];for(var e=0,t=this.options.ykeys.length-1;0<=t?e<=t:e>=t;0<=t?e++:e--)a.push(e);return a}.apply(this):t=function(){f=[];for(var e=u=this.options.ykeys.length-1;u<=0?e<=0:e>=0;u<=0?e++:e--)f.push(e);return f}.apply(this),l=[];for(i=0,s=t.length;i<s;i++)e=t[i],this._drawFillFor(e),this._drawLineFor(e),l.push(this._drawPointFor(e));return l},r.prototype._drawFillFor=function(e){var t;t=this.paths[e];if(t!==null)return t+="L"+this.transX(this.xmax)+","+this.bottom+"L"+this.transX(this.xmin)+","+this.bottom+"Z",this.drawFilledPath(t,this.fillForSeries(e))},r.prototype.fillForSeries=function(e){var t;return t=Raphael.rgb2hsl(this.colorFor(this.data[e],e,"line")),Raphael.hsl(t.h,this.options.behaveLikeLine?t.s*.9:t.s*.75,Math.min(.98,this.options.behaveLikeLine?t.l*1.2:t.l*1.25))},r.prototype.drawFilledPath=function(e,t){return this.raphael.path(e).attr("fill",t).attr("fill-opacity",this.options.fillOpacity).attr("stroke-width",0)},r}(t.Line),t.Bar=function(n){function r(n){this.onHoverOut=u(this.onHoverOut,this),this.onHoverMove=u(this.onHoverMove,this),this.onGridClick=u(this.onGridClick,this);if(!(this instanceof t.Bar))return new t.Bar(n);r.__super__.constructor.call(this,e.extend({},n,{parseTime:!1}))}return o(r,n),r.prototype.init=function(){this.cumulative=this.options.stacked;if(this.options.hideHover!=="always")return this.hover=new t.Hover({parent:this.el}),this.on("hovermove",this.onHoverMove),this.on("hoverout",this.onHoverOut),this.on("gridclick",this.onGridClick)},r.prototype.defaults={barSizeRatio:.75,barGap:3,barColors:["#0b62a4","#7a92a3","#4da74d","#afd8f8","#edc240","#cb4b4b","#9440ed"],xLabelMargin:50},r.prototype.calc=function(){var e;this.calcBars();if(this.options.hideHover===!1)return(e=this.hover).update.apply(e,this.hoverContentForRow(this.data.length-1))},r.prototype.calcBars=function(){var e,t,n,r,i,s,o;s=this.data,o=[];for(e=r=0,i=s.length;r<i;e=++r)t=s[e],t._x=this.left+this.width*(e+.5)/this.data.length,o.push(t._y=function(){var e,r,i,s;i=t.y,s=[];for(e=0,r=i.length;e<r;e++)n=i[e],n!=null?s.push(this.transY(n)):s.push(null);return s}.call(this));return o},r.prototype.draw=function(){return this.options.axes&&this.drawXAxis(),this.drawSeries()},r.prototype.drawXAxis=function(){var e,t,n,r,i,s,o,u,a,f,l,c,h;f=this.bottom+this.options.padding/2,o=null,s=null,h=[];for(e=l=0,c=this.data.length;0<=c?l<c:l>c;e=0<=c?++l:--l)u=this.data[this.data.length-1-e],t=this.drawXAxisLabel(u._x,f,u.label),a=t.getBBox(),t.transform("r"+ -this.options.xLabelAngle),n=t.getBBox(),t.transform("t0,"+n.height/2+"..."),this.options.xLabelAngle!==0&&(i=-0.5*a.width*Math.cos(this.options.xLabelAngle*Math.PI/180),t.transform("t"+i+",0...")),(o==null||o>=n.x+n.width||s!=null&&s>=n.x)&&n.x>=0&&n.x+n.width<this.el.width()?(this.options.xLabelAngle!==0&&(r=1.25*this.options.gridTextSize/Math.sin(this.options.xLabelAngle*Math.PI/180),s=n.x-r),h.push(o=n.x-this.options.xLabelMargin)):h.push(t.remove());return h},r.prototype.drawSeries=function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p;return n=this.width/this.options.data.length,u=this.options.stacked!=null?1:this.options.ykeys.length,e=(n*this.options.barSizeRatio-this.options.barGap*(u-1))/u,o=n*(1-this.options.barSizeRatio)/2,p=this.ymin<=0&&this.ymax>=0?this.transY(0):null,this.bars=function(){var u,d,v,m;v=this.data,m=[];for(r=u=0,d=v.length;u<d;r=++u)a=v[r],i=0,m.push(function(){var u,d,v,m;v=a._y,m=[];for(f=u=0,d=v.length;u<d;f=++u)h=v[f],h!==null?(p?(c=Math.min(h,p),t=Math.max(h,p)):(c=h,t=this.bottom),s=this.left+r*n+o,this.options.stacked||(s+=f*(e+this.options.barGap)),l=t-c,this.options.stacked&&(c-=i),this.drawBar(s,c,e,l,this.colorFor(a,f,"bar")),m.push(i+=l)):m.push(null);return m}.call(this));return m}.call(this)},r.prototype.colorFor=function(e,t,n){var r,i;return typeof this.options.barColors=="function"?(r={x:e.x,y:e.y[t],label:e.label},i={index:t,key:this.options.ykeys[t],label:this.options.labels[t]},this.options.barColors.call(this,r,i,n)):this.options.barColors[t%this.options.barColors.length]},r.prototype.hitTest=function(e,t){return this.data.length===0?null:(e=Math.max(Math.min(e,this.right),this.left),Math.min(this.data.length-1,Math.floor((e-this.left)/(this.width/this.data.length))))},r.prototype.onGridClick=function(e,t){var n;return n=this.hitTest(e,t),this.fire("click",n,this.options.data[n],e,t)},r.prototype.onHoverMove=function(e,t){var n,r;return n=this.hitTest(e,t),(r=this.hover).update.apply(r,this.hoverContentForRow(n))},r.prototype.onHoverOut=function(){if(this.options.hideHover!==!1)return this.hover.hide()},r.prototype.hoverContentForRow=function(e){var t,n,r,i,s,o,u,a;r=this.data[e],t="<div class='morris-hover-row-label'>"+r.label+"</div>",a=r.y;for(n=o=0,u=a.length;o<u;n=++o)s=a[n],t+="<div class='morris-hover-point' style='color: "+this.colorFor(r,n,"label")+"'>\n  "+this.options.labels[n]+":\n  "+this.yLabelFormat(s)+"\n</div>";return typeof this.options.hoverCallback=="function"&&(t=this.options.hoverCallback(e,this.options,t)),i=this.left+(e+.5)*this.width/this.data.length,[t,i]},r.prototype.drawXAxisLabel=function(e,t,n){var r;return r=this.raphael.text(e,t,n).attr("font-size",this.options.gridTextSize).attr("font-family",this.options.gridTextFamily).attr("font-weight",this.options.gridTextWeight).attr("fill",this.options.gridTextColor)},r.prototype.drawBar=function(e,t,n,r,i){return this.raphael.rect(e,t,n,r).attr("fill",i).attr("stroke-width",0)},r}(t.Grid),t.Donut=function(n){function r(n){this.select=u(this.select,this),this.click=u(this.click,this);var r;if(!(this instanceof t.Donut))return new t.Donut(n);typeof n.element=="string"?this.el=e(document.getElementById(n.element)):this.el=e(n.element),this.options=e.extend({},this.defaults,n);if(this.el===null||this.el.length===0)throw new Error("Graph placeholder not found.");if(n.data===void 0||n.data.length===0)return;this.data=n.data,this.values=function(){var e,t,n,i;n=this.data,i=[];for(e=0,t=n.length;e<t;e++)r=n[e],i.push(parseFloat(r.value));return i}.call(this),this.redraw()}return o(r,n),r.prototype.defaults={colors:["#0B62A4","#3980B5","#679DC6","#95BBD7","#B0CCE1","#095791","#095085","#083E67","#052C48","#042135"],backgroundColor:"#FFFFFF",labelColor:"#000000",formatter:t.commas},r.prototype.redraw=function(){var e,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x;this.el.empty(),this.raphael=new Raphael(this.el[0]),n=this.el.width()/2,r=this.el.height()/2,p=(Math.min(n,r)-10)/3,c=0,w=this.values;for(d=0,g=w.length;d<g;d++)h=w[d],c+=h;a=5/(2*p),e=1.9999*Math.PI-a*this.data.length,o=0,s=0,this.segments=[],E=this.values;for(i=v=0,y=E.length;v<y;i=++v)h=E[i],f=o+a+e*(h/c),l=new t.DonutSegment(n,r,p*2,p,o,f,this.options.colors[s%this.options.colors.length],this.options.backgroundColor,s,this.raphael),l.render(),this.segments.push(l),l.on("hover",this.select),l.on("click",this.click),o=f,s+=1;this.text1=this.drawEmptyDonutLabel(n,r-10,this.options.labelColor,15,800),this.text2=this.drawEmptyDonutLabel(n,r+10,this.options.labelColor,14),u=Math.max.apply(null,function(){var e,t,n,r;n=this.values,r=[];for(e=0,t=n.length;e<t;e++)h=n[e],r.push(h);return r}.call(this)),s=0,S=this.values,x=[];for(m=0,b=S.length;m<b;m++){h=S[m];if(h===u){this.select(s);break}x.push(s+=1)}return x},r.prototype.click=function(e){return this.fire("click",e,this.data[e])},r.prototype.select=function(e){var t,n,r,i,s,o;o=this.segments;for(i=0,s=o.length;i<s;i++)n=o[i],n.deselect();return r=this.segments[e],r.select(),t=this.data[e],this.setLabels(t.label,this.options.formatter(t.value,t))},r.prototype.setLabels=function(e,t){var n,r,i,s,o,u,a,f;return n=(Math.min(this.el.width()/2,this.el.height()/2)-10)*2/3,s=1.8*n,i=n/2,r=n/3,this.text1.attr({text:e,transform:""}),o=this.text1.getBBox(),u=Math.min(s/o.width,i/o.height),this.text1.attr({transform:"S"+u+","+u+","+(o.x+o.width/2)+","+(o.y+o.height)}),this.text2.attr({text:t,transform:""}),a=this.text2.getBBox(),f=Math.min(s/a.width,r/a.height),this.text2.attr({transform:"S"+f+","+f+","+(a.x+a.width/2)+","+a.y})},r.prototype.drawEmptyDonutLabel=function(e,t,n,r,i){var s;return s=this.raphael.text(e,t,"").attr("font-size",r).attr("fill",n),i!=null&&s.attr("font-weight",i),s},r}(t.EventEmitter),t.DonutSegment=function(e){function t(e,t,n,r,i,s,o,a,f,l){this.cx=e,this.cy=t,this.inner=n,this.outer=r,this.color=o,this.backgroundColor=a,this.index=f,this.raphael=l,this.deselect=u(this.deselect,this),this.select=u(this.select,this),this.sin_p0=Math.sin(i),this.cos_p0=Math.cos(i),this.sin_p1=Math.sin(s),this.cos_p1=Math.cos(s),this.is_long=s-i>Math.PI?1:0,this.path=this.calcSegment(this.inner+3,this.inner+this.outer-5),this.selectedPath=this.calcSegment(this.inner+3,this.inner+this.outer),this.hilight=this.calcArc(this.inner)}return o(t,e),t.prototype.calcArcPoints=function(e){return[this.cx+e*this.sin_p0,this.cy+e*this.cos_p0,this.cx+e*this.sin_p1,this.cy+e*this.cos_p1]},t.prototype.calcSegment=function(e,t){var n,r,i,s,o,u,a,f,l,c;return l=this.calcArcPoints(e),n=l[0],i=l[1],r=l[2],s=l[3],c=this.calcArcPoints(t),o=c[0],a=c[1],u=c[2],f=c[3],"M"+n+","+i+("A"+e+","+e+",0,"+this.is_long+",0,"+r+","+s)+("L"+u+","+f)+("A"+t+","+t+",0,"+this.is_long+",1,"+o+","+a)+"Z"},t.prototype.calcArc=function(e){var t,n,r,i,s;return s=this.calcArcPoints(e),t=s[0],r=s[1],n=s[2],i=s[3],"M"+t+","+r+("A"+e+","+e+",0,"+this.is_long+",0,"+n+","+i)},t.prototype.render=function(){var e=this;return this.arc=this.drawDonutArc(this.hilight,this.color),this.seg=this.drawDonutSegment(this.path,this.color,this.backgroundColor,function(){return e.fire("hover",e.index)},function(){return e.fire("click",e.index)})},t.prototype.drawDonutArc=function(e,t){return this.raphael.path(e).attr({stroke:t,"stroke-width":2,opacity:0})},t.prototype.drawDonutSegment=function(e,t,n,r,i){return this.raphael.path(e).attr({fill:t,stroke:n,"stroke-width":3}).hover(r).click(i)},t.prototype.select=function(){if(!this.selected)return this.seg.animate({path:this.selectedPath},150,"<>"),this.arc.animate({opacity:1},150,"<>"),this.selected=!0},t.prototype.deselect=function(){if(this.selected)return this.seg.animate({path:this.path},150,"<>"),this.arc.animate({opacity:0},150,"<>"),this.selected=!1},t}(t.EventEmitter)}).call(this);
// â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” \\
// â”‚ RaphaÃ«l 2.1.0 - JavaScript Vector Library                          â”‚ \\
// â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤ \\
// â”‚ Copyright Â© 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    â”‚ \\
// â”‚ Copyright Â© 2008-2012 Sencha Labs (http://sencha.com)              â”‚ \\
// â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤ \\
// â”‚ Licensed under the MIT (http://raphaeljs.com/license.html) license.â”‚ \\
// â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ \\

(function(e){var t="0.3.4",n="hasOwnProperty",r=/[\.\/]/,i="*",s=function(){},o=function(e,t){return e-t},u,a,f={n:{}},l=function(e,t){var n=f,r=a,i=Array.prototype.slice.call(arguments,2),s=l.listeners(e),c=0,p=!1,d,v=[],m={},y=[],b=u,w=[];u=e,a=0;for(var E=0,S=s.length;E<S;E++)"zIndex"in s[E]&&(v.push(s[E].zIndex),s[E].zIndex<0&&(m[s[E].zIndex]=s[E]));v.sort(o);while(v[c]<0){d=m[v[c++]],y.push(d.apply(t,i));if(a)return a=r,y}for(E=0;E<S;E++){d=s[E];if("zIndex"in d)if(d.zIndex==v[c]){y.push(d.apply(t,i));if(a)break;do{c++,d=m[v[c]],d&&y.push(d.apply(t,i));if(a)break}while(d)}else m[d.zIndex]=d;else{y.push(d.apply(t,i));if(a)break}}return a=r,u=b,y.length?y:null};l.listeners=function(e){var t=e.split(r),n=f,s,o,u,a,l,c,h,p,v=[n],m=[];for(a=0,l=t.length;a<l;a++){p=[];for(c=0,h=v.length;c<h;c++){n=v[c].n,o=[n[t[a]],n[i]],u=2;while(u--)s=o[u],s&&(p.push(s),m=m.concat(s.f||[]))}v=p}return m},l.on=function(e,t){var n=e.split(r),i=f;for(var o=0,u=n.length;o<u;o++)i=i.n,!i[n[o]]&&(i[n[o]]={n:{}}),i=i[n[o]];i.f=i.f||[];for(o=0,u=i.f.length;o<u;o++)if(i.f[o]==t)return s;return i.f.push(t),function(e){+e==+e&&(t.zIndex=+e)}},l.stop=function(){a=1},l.nt=function(e){return e?(new RegExp("(?:\\.|\\/|^)"+e+"(?:\\.|\\/|$)")).test(u):u},l.off=l.unbind=function(e,t){var s=e.split(r),o,u,a,l,h,p,v,m=[f];for(l=0,h=s.length;l<h;l++)for(p=0;p<m.length;p+=a.length-2){a=[p,1],o=m[p].n;if(s[l]!=i)o[s[l]]&&a.push(o[s[l]]);else for(u in o)o[n](u)&&a.push(o[u]);m.splice.apply(m,a)}for(l=0,h=m.length;l<h;l++){o=m[l];while(o.n){if(t){if(o.f){for(p=0,v=o.f.length;p<v;p++)if(o.f[p]==t){o.f.splice(p,1);break}!o.f.length&&delete o.f}for(u in o.n)if(o.n[n](u)&&o.n[u].f){var g=o.n[u].f;for(p=0,v=g.length;p<v;p++)if(g[p]==t){g.splice(p,1);break}!g.length&&delete o.n[u].f}}else{delete o.f;for(u in o.n)o.n[n](u)&&o.n[u].f&&delete o.n[u].f}o=o.n}}},l.once=function(e,t){var n=function(){var r=t.apply(this,arguments);return l.unbind(e,n),r};return l.on(e,n)},l.version=t,l.toString=function(){return"You are running Eve "+t},typeof module!="undefined"&&module.exports?module.exports=l:typeof define!="undefined"?define("eve",[],function(){return l}):e.eve=l})(this),function(){function e(e){for(var t=0;t<An.length;t++)An[t].el.paper==e&&An.splice(t--,1)}function t(e,t,n,i,s,u){n=at(n);var a,f,l,c=[],h,p,d,v=e.ms,m={},g={},y={};if(i)for(E=0,x=An.length;E<x;E++){var b=An[E];if(b.el.id==t.id&&b.anim==e){b.percent!=n?(An.splice(E,1),l=1):f=b,t.attr(b.totalOrigin);break}}else i=+g;for(var E=0,x=e.percents.length;E<x;E++){if(e.percents[E]==n||e.percents[E]>i*e.top){n=e.percents[E],p=e.percents[E-1]||0,v=v/e.top*(n-p),h=e.percents[E+1],a=e.anim[n];break}i&&t.attr(e.anim[e.percents[E]])}if(!!a){if(!f){for(var T in a)if(a[C](T))if(ht[C](T)||t.paper.customAttributes[C](T)){m[T]=t.attr(T),m[T]==null&&(m[T]=ct[T]),g[T]=a[T];switch(ht[T]){case J:y[T]=(g[T]-m[T])/v;break;case"colour":m[T]=w.getRGB(m[T]);var N=w.getRGB(g[T]);y[T]={r:(N.r-m[T].r)/v,g:(N.g-m[T].g)/v,b:(N.b-m[T].b)/v};break;case"path":var k=Qt(m[T],g[T]),L=k[1];m[T]=k[0],y[T]=[];for(E=0,x=m[T].length;E<x;E++){y[T][E]=[0];for(var A=1,O=m[T][E].length;A<O;A++)y[T][E][A]=(L[E][A]-m[T][E][A])/v}break;case"transform":var M=t._,_=an(M[T],g[T]);if(_){m[T]=_.from,g[T]=_.to,y[T]=[],y[T].real=!0;for(E=0,x=m[T].length;E<x;E++){y[T][E]=[m[T][E][0]];for(A=1,O=m[T][E].length;A<O;A++)y[T][E][A]=(g[T][E][A]-m[T][E][A])/v}}else{var P=t.matrix||new o,H={_:{transform:M.transform},getBBox:function(){return t.getBBox(1)}};m[T]=[P.a,P.b,P.c,P.d,P.e,P.f],on(H,g[T]),g[T]=H._.transform,y[T]=[(H.matrix.a-P.a)/v,(H.matrix.b-P.b)/v,(H.matrix.c-P.c)/v,(H.matrix.d-P.d)/v,(H.matrix.e-P.e)/v,(H.matrix.f-P.f)/v]}break;case"csv":var B=j(a[T])[F](S),I=j(m[T])[F](S);if(T=="clip-rect"){m[T]=I,y[T]=[],E=I.length;while(E--)y[T][E]=(B[E]-m[T][E])/v}g[T]=B;break;default:B=[][D](a[T]),I=[][D](m[T]),y[T]=[],E=t.paper.customAttributes[T].length;while(E--)y[T][E]=((B[E]||0)-(I[E]||0))/v}}var q=a.easing,R=w.easing_formulas[q];if(!R){R=j(q).match(st);if(R&&R.length==5){var U=R;R=function(e){return r(e,+U[1],+U[2],+U[3],+U[4],v)}}else R=Nt}d=a.start||e.start||+(new Date),b={anim:e,percent:n,timestamp:d,start:d+(e.del||0),status:0,initstatus:i||0,stop:!1,ms:v,easing:R,from:m,diff:y,to:g,el:t,callback:a.callback,prev:p,next:h,repeat:u||e.times,origin:t.attr(),totalOrigin:s},An.push(b);if(i&&!f&&!l){b.stop=!0,b.start=new Date-v*i;if(An.length==1)return Mn()}l&&(b.start=new Date-b.ms*i),An.length==1&&On(Mn)}else f.initstatus=i,f.start=new Date-f.ms*i;eve("raphael.anim.start."+t.id,t,e)}}function n(e,t){var n=[],r={};this.ms=t,this.times=1;if(e){for(var i in e)e[C](i)&&(r[at(i)]=e[i],n.push(at(i)));n.sort(xt)}this.anim=r,this.top=n[n.length-1],this.percents=n}function r(e,t,n,r,i,s){function o(e,t){var n,r,i,s,o,u;for(i=e,u=0;u<8;u++){s=a(i)-e;if(X(s)<t)return i;o=(3*c*i+2*l)*i+f;if(X(o)<1e-6)break;i-=s/o}n=0,r=1,i=e;if(i<n)return n;if(i>r)return r;while(n<r){s=a(i);if(X(s-e)<t)return i;e>s?n=i:r=i,i=(r-n)/2+n}return i}function u(e,t){var n=o(e,t);return((d*n+p)*n+h)*n}function a(e){return((c*e+l)*e+f)*e}var f=3*t,l=3*(r-t)-f,c=1-f-l,h=3*n,p=3*(i-n)-h,d=1-h-p;return u(e,1/(200*s))}function i(){return this.x+B+this.y+B+this.width+" Ã— "+this.height}function s(){return this.x+B+this.y}function o(e,t,n,r,i,s){e!=null?(this.a=+e,this.b=+t,this.c=+n,this.d=+r,this.e=+i,this.f=+s):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function u(e,t,n){e=w._path2curve(e),t=w._path2curve(t);var r,i,s,o,u,f,l,c,h,p,d=n?0:[];for(var v=0,m=e.length;v<m;v++){var g=e[v];if(g[0]=="M")r=u=g[1],i=f=g[2];else{g[0]=="C"?(h=[r,i].concat(g.slice(1)),r=h[6],i=h[7]):(h=[r,i,r,i,u,f,u,f],r=u,i=f);for(var y=0,b=t.length;y<b;y++){var E=t[y];if(E[0]=="M")s=l=E[1],o=c=E[2];else{E[0]=="C"?(p=[s,o].concat(E.slice(1)),s=p[6],o=p[7]):(p=[s,o,s,o,l,c,l,c],s=l,o=c);var S=a(h,p,n);if(n)d+=S;else{for(var x=0,T=S.length;x<T;x++)S[x].segment1=v,S[x].segment2=y,S[x].bez1=h,S[x].bez2=p;d=d.concat(S)}}}}}return d}function a(e,t,n){var r=w.bezierBBox(e),i=w.bezierBBox(t);if(!w.isBBoxIntersect(r,i))return n?0:[];var s=p.apply(0,e),o=p.apply(0,t),u=~~(s/5),a=~~(o/5),f=[],l=[],h={},d=n?0:[];for(var v=0;v<u+1;v++){var m=w.findDotsAtSegment.apply(w,e.concat(v/u));f.push({x:m.x,y:m.y,t:v/u})}for(v=0;v<a+1;v++)m=w.findDotsAtSegment.apply(w,t.concat(v/a)),l.push({x:m.x,y:m.y,t:v/a});for(v=0;v<u;v++)for(var g=0;g<a;g++){var y=f[v],b=f[v+1],E=l[g],S=l[g+1],x=X(b.x-y.x)<.001?"y":"x",T=X(S.x-E.x)<.001?"y":"x",N=c(y.x,y.y,b.x,b.y,E.x,E.y,S.x,S.y);if(N){if(h[N.x.toFixed(4)]==N.y.toFixed(4))continue;h[N.x.toFixed(4)]=N.y.toFixed(4);var C=y.t+X((N[x]-y[x])/(b[x]-y[x]))*(b.t-y.t),k=E.t+X((N[T]-E[T])/(S[T]-E[T]))*(S.t-E.t);C>=0&&C<=1&&k>=0&&k<=1&&(n?d++:d.push({x:N.x,y:N.y,t1:C,t2:k}))}}return d}function f(e,t){return a(e,t,1)}function l(e,t){return a(e,t)}function c(e,t,n,r,i,s,o,u){if(!(z(e,n)<W(i,o)||W(e,n)>z(i,o)||z(t,r)<W(s,u)||W(t,r)>z(s,u))){var a=(e*r-t*n)*(i-o)-(e-n)*(i*u-s*o),f=(e*r-t*n)*(s-u)-(t-r)*(i*u-s*o),l=(e-n)*(s-u)-(t-r)*(i-o);if(!l)return;var c=a/l,h=f/l,p=+c.toFixed(2),d=+h.toFixed(2);if(p<+W(e,n).toFixed(2)||p>+z(e,n).toFixed(2)||p<+W(i,o).toFixed(2)||p>+z(i,o).toFixed(2)||d<+W(t,r).toFixed(2)||d>+z(t,r).toFixed(2)||d<+W(s,u).toFixed(2)||d>+z(s,u).toFixed(2))return;return{x:c,y:h}}}function h(e,t,n,r,i,s,o,u,a){if(!(a<0||p(e,t,n,r,i,s,o,u)<a)){var f=1,l=f/2,c=f-l,h,d=.01;h=p(e,t,n,r,i,s,o,u,c);while(X(h-a)>d)l/=2,c+=(h<a?1:-1)*l,h=p(e,t,n,r,i,s,o,u,c);return c}}function p(e,t,n,r,i,s,o,u,a){a==null&&(a=1),a=a>1?1:a<0?0:a;var f=a/2,l=12,c=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],h=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],p=0;for(var v=0;v<l;v++){var m=f*c[v]+f,g=d(m,e,n,i,o),y=d(m,t,r,s,u),b=g*g+y*y;p+=h[v]*U.sqrt(b)}return f*p}function d(e,t,n,r,i){var s=-3*t+9*n-9*r+3*i,o=e*s+6*t-12*n+6*r;return e*o-3*t+3*n}function v(e,t){var n=[];for(var r=0,i=e.length;i-2*!t>r;r+=2){var s=[{x:+e[r-2],y:+e[r-1]},{x:+e[r],y:+e[r+1]},{x:+e[r+2],y:+e[r+3]},{x:+e[r+4],y:+e[r+5]}];t?r?i-4==r?s[3]={x:+e[0],y:+e[1]}:i-2==r&&(s[2]={x:+e[0],y:+e[1]},s[3]={x:+e[2],y:+e[3]}):s[0]={x:+e[i-2],y:+e[i-1]}:i-4==r?s[3]=s[2]:r||(s[0]={x:+e[r],y:+e[r+1]}),n.push(["C",(-s[0].x+6*s[1].x+s[2].x)/6,(-s[0].y+6*s[1].y+s[2].y)/6,(s[1].x+6*s[2].x-s[3].x)/6,(s[1].y+6*s[2].y-s[3].y)/6,s[2].x,s[2].y])}return n}function m(){return this.hex}function g(e,t,n){function r(){var i=Array.prototype.slice.call(arguments,0),s=i.join("â€"),o=r.cache=r.cache||{},u=r.count=r.count||[];return o[C](s)?(y(u,s),n?n(o[s]):o[s]):(u.length>=1e3&&delete o[u.shift()],u.push(s),o[s]=e[_](t,i),n?n(o[s]):o[s])}return r}function y(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return e.push(e.splice(n,1)[0])}function b(e){if(Object(e)!==e)return e;var t=new e.constructor;for(var n in e)e[C](n)&&(t[n]=b(e[n]));return t}function w(e){if(w.is(e,"function"))return E?e():eve.on("raphael.DOMload",e);if(w.is(e,Q))return w._engine.create[_](w,e.splice(0,3+w.is(e[0],J))).add(e);var t=Array.prototype.slice.call(arguments,0);if(w.is(t[t.length-1],"function")){var n=t.pop();return E?n.call(w._engine.create[_](w,t)):eve.on("raphael.DOMload",function(){n.call(w._engine.create[_](w,t))})}return w._engine.create[_](w,arguments)}w.version="2.1.0",w.eve=eve;var E,S=/[, ]+/,x={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},T=/\{(\d+)\}/g,N="prototype",C="hasOwnProperty",k={doc:document,win:window},L={was:Object.prototype[C].call(k.win,"Raphael"),is:k.win.Raphael},A=function(){this.ca=this.customAttributes={}},O,M="appendChild",_="apply",D="concat",P="createTouch"in k.doc,H="",B=" ",j=String,F="split",I="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[F](B),q={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},R=j.prototype.toLowerCase,U=Math,z=U.max,W=U.min,X=U.abs,V=U.pow,$=U.PI,J="number",K="string",Q="array",G="toString",Y="fill",Z=Object.prototype.toString,et={},tt="push",nt=w._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,rt=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,it={NaN:1,Infinity:1,"-Infinity":1},st=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,ot=U.round,ut="setAttribute",at=parseFloat,ft=parseInt,lt=j.prototype.toUpperCase,ct=w._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},ht=w._availableAnimAttrs={blur:J,"clip-rect":"csv",cx:J,cy:J,fill:"colour","fill-opacity":J,"font-size":J,height:J,opacity:J,path:"path",r:J,rx:J,ry:J,stroke:"colour","stroke-opacity":J,"stroke-width":J,transform:"transform",width:J,x:J,y:J},pt=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,dt=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,vt={hs:1,rg:1},mt=/,?([achlmqrstvxz]),?/gi,gt=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,yt=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,bt=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,wt=w._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,Et={},St=function(e,t){return e.key-t.key},xt=function(e,t){return at(e)-at(t)},Tt=function(){},Nt=function(e){return e},Ct=w._rectPath=function(e,t,n,r,i){return i?[["M",e+i,t],["l",n-i*2,0],["a",i,i,0,0,1,i,i],["l",0,r-i*2],["a",i,i,0,0,1,-i,i],["l",i*2-n,0],["a",i,i,0,0,1,-i,-i],["l",0,i*2-r],["a",i,i,0,0,1,i,-i],["z"]]:[["M",e,t],["l",n,0],["l",0,r],["l",-n,0],["z"]]},kt=function(e,t,n,r){return r==null&&(r=n),[["M",e,t],["m",0,-r],["a",n,r,0,1,1,0,2*r],["a",n,r,0,1,1,0,-2*r],["z"]]},Lt=w._getPath={path:function(e){return e.attr("path")},circle:function(e){var t=e.attrs;return kt(t.cx,t.cy,t.r)},ellipse:function(e){var t=e.attrs;return kt(t.cx,t.cy,t.rx,t.ry)},rect:function(e){var t=e.attrs;return Ct(t.x,t.y,t.width,t.height,t.r)},image:function(e){var t=e.attrs;return Ct(t.x,t.y,t.width,t.height)},text:function(e){var t=e._getBBox();return Ct(t.x,t.y,t.width,t.height)}},At=w.mapPath=function(e,t){if(!t)return e;var n,r,i,s,o,u,a;e=Qt(e);for(i=0,o=e.length;i<o;i++){a=e[i];for(s=1,u=a.length;s<u;s+=2)n=t.x(a[s],a[s+1]),r=t.y(a[s],a[s+1]),a[s]=n,a[s+1]=r}return e};w._g=k,w.type=k.win.SVGAngle||k.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(w.type=="VML"){var Ot=k.doc.createElement("div"),Mt;Ot.innerHTML='<v:shape adj="1"/>',Mt=Ot.firstChild,Mt.style.behavior="url(#default#VML)";if(!Mt||typeof Mt.adj!="object")return w.type=H;Ot=null}w.svg=!(w.vml=w.type=="VML"),w._Paper=A,w.fn=O=A.prototype=w.prototype,w._id=0,w._oid=0,w.is=function(e,t){return t=R.call(t),t=="finite"?!it[C](+e):t=="array"?e instanceof Array:t=="null"&&e===null||t==typeof e&&e!==null||t=="object"&&e===Object(e)||t=="array"&&Array.isArray&&Array.isArray(e)||Z.call(e).slice(8,-1).toLowerCase()==t},w.angle=function(e,t,n,r,i,s){if(i==null){var o=e-n,u=t-r;return!o&&!u?0:(180+U.atan2(-u,-o)*180/$+360)%360}return w.angle(e,t,i,s)-w.angle(n,r,i,s)},w.rad=function(e){return e%360*$/180},w.deg=function(e){return e*180/$%360},w.snapTo=function(e,t,n){n=w.is(n,"finite")?n:10;if(w.is(e,Q)){var r=e.length;while(r--)if(X(e[r]-t)<=n)return e[r]}else{e=+e;var i=t%e;if(i<n)return t-i;if(i>e-n)return t-i+e}return t};var _t=w.createUUID=function(e,t){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t).toUpperCase()}}(/[xy]/g,function(e){var t=U.random()*16|0,n=e=="x"?t:t&3|8;return n.toString(16)});w.setWindow=function(e){eve("raphael.setWindow",w,k.win,e),k.win=e,k.doc=k.win.document,w._engine.initWin&&w._engine.initWin(k.win)};var Dt=function(e){if(w.vml){var t=/^\s+|\s+$/g,n;try{var r=new ActiveXObject("htmlfile");r.write("<body>"),r.close(),n=r.body}catch(i){n=createPopup().document.body}var s=n.createTextRange();Dt=g(function(e){try{n.style.color=j(e).replace(t,H);var r=s.queryCommandValue("ForeColor");return r=(r&255)<<16|r&65280|(r&16711680)>>>16,"#"+("000000"+r.toString(16)).slice(-6)}catch(i){return"none"}})}else{var o=k.doc.createElement("i");o.title="RaphaÃ«l Colour Picker",o.style.display="none",k.doc.body.appendChild(o),Dt=g(function(e){return o.style.color=e,k.doc.defaultView.getComputedStyle(o,H).getPropertyValue("color")})}return Dt(e)},Pt=function(){return"hsb("+[this.h,this.s,this.b]+")"},Ht=function(){return"hsl("+[this.h,this.s,this.l]+")"},Bt=function(){return this.hex},jt=function(e,t,n){t==null&&w.is(e,"object")&&"r"in e&&"g"in e&&"b"in e&&(n=e.b,t=e.g,e=e.r);if(t==null&&w.is(e,K)){var r=w.getRGB(e);e=r.r,t=r.g,n=r.b}if(e>1||t>1||n>1)e/=255,t/=255,n/=255;return[e,t,n]},Ft=function(e,t,n,r){e*=255,t*=255,n*=255;var i={r:e,g:t,b:n,hex:w.rgb(e,t,n),toString:Bt};return w.is(r,"finite")&&(i.opacity=r),i};w.color=function(e){var t;return w.is(e,"object")&&"h"in e&&"s"in e&&"b"in e?(t=w.hsb2rgb(e),e.r=t.r,e.g=t.g,e.b=t.b,e.hex=t.hex):w.is(e,"object")&&"h"in e&&"s"in e&&"l"in e?(t=w.hsl2rgb(e),e.r=t.r,e.g=t.g,e.b=t.b,e.hex=t.hex):(w.is(e,"string")&&(e=w.getRGB(e)),w.is(e,"object")&&"r"in e&&"g"in e&&"b"in e?(t=w.rgb2hsl(e),e.h=t.h,e.s=t.s,e.l=t.l,t=w.rgb2hsb(e),e.v=t.b):(e={hex:"none"},e.r=e.g=e.b=e.h=e.s=e.v=e.l=-1)),e.toString=Bt,e},w.hsb2rgb=function(e,t,n,r){this.is(e,"object")&&"h"in e&&"s"in e&&"b"in e&&(n=e.b,t=e.s,e=e.h,r=e.o),e*=360;var i,s,o,u,a;return e=e%360/60,a=n*t,u=a*(1-X(e%2-1)),i=s=o=n-a,e=~~e,i+=[a,u,0,0,u,a][e],s+=[u,a,a,u,0,0][e],o+=[0,0,u,a,a,u][e],Ft(i,s,o,r)},w.hsl2rgb=function(e,t,n,r){this.is(e,"object")&&"h"in e&&"s"in e&&"l"in e&&(n=e.l,t=e.s,e=e.h);if(e>1||t>1||n>1)e/=360,t/=100,n/=100;e*=360;var i,s,o,u,a;return e=e%360/60,a=2*t*(n<.5?n:1-n),u=a*(1-X(e%2-1)),i=s=o=n-a/2,e=~~e,i+=[a,u,0,0,u,a][e],s+=[u,a,a,u,0,0][e],o+=[0,0,u,a,a,u][e],Ft(i,s,o,r)},w.rgb2hsb=function(e,t,n){n=jt(e,t,n),e=n[0],t=n[1],n=n[2];var r,i,s,o;return s=z(e,t,n),o=s-W(e,t,n),r=o==0?null:s==e?(t-n)/o:s==t?(n-e)/o+2:(e-t)/o+4,r=(r+360)%6*60/360,i=o==0?0:o/s,{h:r,s:i,b:s,toString:Pt}},w.rgb2hsl=function(e,t,n){n=jt(e,t,n),e=n[0],t=n[1],n=n[2];var r,i,s,o,u,a;return o=z(e,t,n),u=W(e,t,n),a=o-u,r=a==0?null:o==e?(t-n)/a:o==t?(n-e)/a+2:(e-t)/a+4,r=(r+360)%6*60/360,s=(o+u)/2,i=a==0?0:s<.5?a/(2*s):a/(2-2*s),{h:r,s:i,l:s,toString:Ht}},w._path2string=function(){return this.join(",").replace(mt,"$1")};var It=w._preload=function(e,t){var n=k.doc.createElement("img");n.style.cssText="position:absolute;left:-9999em;top:-9999em",n.onload=function(){t.call(this),this.onload=null,k.doc.body.removeChild(this)},n.onerror=function(){k.doc.body.removeChild(this)},k.doc.body.appendChild(n),n.src=e};w.getRGB=g(function(e){if(!e||!!((e=j(e)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:m};if(e=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:m};!vt[C](e.toLowerCase().substring(0,2))&&e.charAt()!="#"&&(e=Dt(e));var t,n,r,i,s,o,u,a=e.match(rt);return a?(a[2]&&(i=ft(a[2].substring(5),16),r=ft(a[2].substring(3,5),16),n=ft(a[2].substring(1,3),16)),a[3]&&(i=ft((o=a[3].charAt(3))+o,16),r=ft((o=a[3].charAt(2))+o,16),n=ft((o=a[3].charAt(1))+o,16)),a[4]&&(u=a[4][F](dt),n=at(u[0]),u[0].slice(-1)=="%"&&(n*=2.55),r=at(u[1]),u[1].slice(-1)=="%"&&(r*=2.55),i=at(u[2]),u[2].slice(-1)=="%"&&(i*=2.55),a[1].toLowerCase().slice(0,4)=="rgba"&&(s=at(u[3])),u[3]&&u[3].slice(-1)=="%"&&(s/=100)),a[5]?(u=a[5][F](dt),n=at(u[0]),u[0].slice(-1)=="%"&&(n*=2.55),r=at(u[1]),u[1].slice(-1)=="%"&&(r*=2.55),i=at(u[2]),u[2].slice(-1)=="%"&&(i*=2.55),(u[0].slice(-3)=="deg"||u[0].slice(-1)=="Â°")&&(n/=360),a[1].toLowerCase().slice(0,4)=="hsba"&&(s=at(u[3])),u[3]&&u[3].slice(-1)=="%"&&(s/=100),w.hsb2rgb(n,r,i,s)):a[6]?(u=a[6][F](dt),n=at(u[0]),u[0].slice(-1)=="%"&&(n*=2.55),r=at(u[1]),u[1].slice(-1)=="%"&&(r*=2.55),i=at(u[2]),u[2].slice(-1)=="%"&&(i*=2.55),(u[0].slice(-3)=="deg"||u[0].slice(-1)=="Â°")&&(n/=360),a[1].toLowerCase().slice(0,4)=="hsla"&&(s=at(u[3])),u[3]&&u[3].slice(-1)=="%"&&(s/=100),w.hsl2rgb(n,r,i,s)):(a={r:n,g:r,b:i,toString:m},a.hex="#"+(16777216|i|r<<8|n<<16).toString(16).slice(1),w.is(s,"finite")&&(a.opacity=s),a)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:m}},w),w.hsb=g(function(e,t,n){return w.hsb2rgb(e,t,n).hex}),w.hsl=g(function(e,t,n){return w.hsl2rgb(e,t,n).hex}),w.rgb=g(function(e,t,n){return"#"+(16777216|n|t<<8|e<<16).toString(16).slice(1)}),w.getColor=function(e){var t=this.getColor.start=this.getColor.start||{h:0,s:1,b:e||.75},n=this.hsb2rgb(t.h,t.s,t.b);return t.h+=.075,t.h>1&&(t.h=0,t.s-=.2,t.s<=0&&(this.getColor.start={h:0,s:1,b:t.b})),n.hex},w.getColor.reset=function(){delete this.start},w.parsePathString=function(e){if(!e)return null;var t=qt(e);if(t.arr)return Ut(t.arr);var n={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},r=[];return w.is(e,Q)&&w.is(e[0],Q)&&(r=Ut(e)),r.length||j(e).replace(gt,function(e,t,i){var s=[],o=t.toLowerCase();i.replace(bt,function(e,t){t&&s.push(+t)}),o=="m"&&s.length>2&&(r.push([t][D](s.splice(0,2))),o="l",t=t=="m"?"l":"L");if(o=="r")r.push([t][D](s));else while(s.length>=n[o]){r.push([t][D](s.splice(0,n[o])));if(!n[o])break}}),r.toString=w._path2string,t.arr=Ut(r),r},w.parseTransformString=g(function(e){if(!e)return null;var t={r:3,s:4,t:2,m:6},n=[];return w.is(e,Q)&&w.is(e[0],Q)&&(n=Ut(e)),n.length||j(e).replace(yt,function(e,t,r){var i=[],s=R.call(t);r.replace(bt,function(e,t){t&&i.push(+t)}),n.push([t][D](i))}),n.toString=w._path2string,n});var qt=function(e){var t=qt.ps=qt.ps||{};return t[e]?t[e].sleep=100:t[e]={sleep:100},setTimeout(function(){for(var n in t)t[C](n)&&n!=e&&(t[n].sleep--,!t[n].sleep&&delete t[n])}),t[e]};w.findDotsAtSegment=function(e,t,n,r,i,s,o,u,a){var f=1-a,l=V(f,3),c=V(f,2),h=a*a,p=h*a,d=l*e+c*3*a*n+f*3*a*a*i+p*o,v=l*t+c*3*a*r+f*3*a*a*s+p*u,m=e+2*a*(n-e)+h*(i-2*n+e),g=t+2*a*(r-t)+h*(s-2*r+t),y=n+2*a*(i-n)+h*(o-2*i+n),b=r+2*a*(s-r)+h*(u-2*s+r),w=f*e+a*n,E=f*t+a*r,S=f*i+a*o,x=f*s+a*u,T=90-U.atan2(m-y,g-b)*180/$;return(m>y||g<b)&&(T+=180),{x:d,y:v,m:{x:m,y:g},n:{x:y,y:b},start:{x:w,y:E},end:{x:S,y:x},alpha:T}},w.bezierBBox=function(e,t,n,r,i,s,o,u){w.is(e,"array")||(e=[e,t,n,r,i,s,o,u]);var a=Kt.apply(null,e);return{x:a.min.x,y:a.min.y,x2:a.max.x,y2:a.max.y,width:a.max.x-a.min.x,height:a.max.y-a.min.y}},w.isPointInsideBBox=function(e,t,n){return t>=e.x&&t<=e.x2&&n>=e.y&&n<=e.y2},w.isBBoxIntersect=function(e,t){var n=w.isPointInsideBBox;return n(t,e.x,e.y)||n(t,e.x2,e.y)||n(t,e.x,e.y2)||n(t,e.x2,e.y2)||n(e,t.x,t.y)||n(e,t.x2,t.y)||n(e,t.x,t.y2)||n(e,t.x2,t.y2)||(e.x<t.x2&&e.x>t.x||t.x<e.x2&&t.x>e.x)&&(e.y<t.y2&&e.y>t.y||t.y<e.y2&&t.y>e.y)},w.pathIntersection=function(e,t){return u(e,t)},w.pathIntersectionNumber=function(e,t){return u(e,t,1)},w.isPointInsidePath=function(e,t,n){var r=w.pathBBox(e);return w.isPointInsideBBox(r,t,n)&&u(e,[["M",t,n],["H",r.x2+10]],1)%2==1},w._removedFactory=function(e){return function(){eve("raphael.log",null,"RaphaÃ«l: you are calling to method â€œ"+e+"â€ of removed object",e)}};var Rt=w.pathBBox=function(e){var t=qt(e);if(t.bbox)return t.bbox;if(!e)return{x:0,y:0,width:0,height:0,x2:0,y2:0};e=Qt(e);var n=0,r=0,i=[],s=[],o;for(var u=0,a=e.length;u<a;u++){o=e[u];if(o[0]=="M")n=o[1],r=o[2],i.push(n),s.push(r);else{var f=Kt(n,r,o[1],o[2],o[3],o[4],o[5],o[6]);i=i[D](f.min.x,f.max.x),s=s[D](f.min.y,f.max.y),n=o[5],r=o[6]}}var l=W[_](0,i),c=W[_](0,s),h=z[_](0,i),p=z[_](0,s),d={x:l,y:c,x2:h,y2:p,width:h-l,height:p-c};return t.bbox=b(d),d},Ut=function(e){var t=b(e);return t.toString=w._path2string,t},zt=w._pathToRelative=function(e){var t=qt(e);if(t.rel)return Ut(t.rel);if(!w.is(e,Q)||!w.is(e&&e[0],Q))e=w.parsePathString(e);var n=[],r=0,i=0,s=0,o=0,u=0;e[0][0]=="M"&&(r=e[0][1],i=e[0][2],s=r,o=i,u++,n.push(["M",r,i]));for(var a=u,f=e.length;a<f;a++){var l=n[a]=[],c=e[a];if(c[0]!=R.call(c[0])){l[0]=R.call(c[0]);switch(l[0]){case"a":l[1]=c[1],l[2]=c[2],l[3]=c[3],l[4]=c[4],l[5]=c[5],l[6]=+(c[6]-r).toFixed(3),l[7]=+(c[7]-i).toFixed(3);break;case"v":l[1]=+(c[1]-i).toFixed(3);break;case"m":s=c[1],o=c[2];default:for(var h=1,p=c.length;h<p;h++)l[h]=+(c[h]-(h%2?r:i)).toFixed(3)}}else{l=n[a]=[],c[0]=="m"&&(s=c[1]+r,o=c[2]+i);for(var d=0,v=c.length;d<v;d++)n[a][d]=c[d]}var m=n[a].length;switch(n[a][0]){case"z":r=s,i=o;break;case"h":r+=+n[a][m-1];break;case"v":i+=+n[a][m-1];break;default:r+=+n[a][m-2],i+=+n[a][m-1]}}return n.toString=w._path2string,t.rel=Ut(n),n},Wt=w._pathToAbsolute=function(e){var t=qt(e);if(t.abs)return Ut(t.abs);if(!w.is(e,Q)||!w.is(e&&e[0],Q))e=w.parsePathString(e);if(!e||!e.length)return[["M",0,0]];var n=[],r=0,i=0,s=0,o=0,u=0;e[0][0]=="M"&&(r=+e[0][1],i=+e[0][2],s=r,o=i,u++,n[0]=["M",r,i]);var a=e.length==3&&e[0][0]=="M"&&e[1][0].toUpperCase()=="R"&&e[2][0].toUpperCase()=="Z";for(var f,l,c=u,h=e.length;c<h;c++){n.push(f=[]),l=e[c];if(l[0]!=lt.call(l[0])){f[0]=lt.call(l[0]);switch(f[0]){case"A":f[1]=l[1],f[2]=l[2],f[3]=l[3],f[4]=l[4],f[5]=l[5],f[6]=+(l[6]+r),f[7]=+(l[7]+i);break;case"V":f[1]=+l[1]+i;break;case"H":f[1]=+l[1]+r;break;case"R":var p=[r,i][D](l.slice(1));for(var d=2,m=p.length;d<m;d++)p[d]=+p[d]+r,p[++d]=+p[d]+i;n.pop(),n=n[D](v(p,a));break;case"M":s=+l[1]+r,o=+l[2]+i;default:for(d=1,m=l.length;d<m;d++)f[d]=+l[d]+(d%2?r:i)}}else if(l[0]=="R")p=[r,i][D](l.slice(1)),n.pop(),n=n[D](v(p,a)),f=["R"][D](l.slice(-2));else for(var g=0,y=l.length;g<y;g++)f[g]=l[g];switch(f[0]){case"Z":r=s,i=o;break;case"H":r=f[1];break;case"V":i=f[1];break;case"M":s=f[f.length-2],o=f[f.length-1];default:r=f[f.length-2],i=f[f.length-1]}}return n.toString=w._path2string,t.abs=Ut(n),n},Xt=function(e,t,n,r){return[e,t,n,r,n,r]},Vt=function(e,t,n,r,i,s){var o=1/3,u=2/3;return[o*e+u*n,o*t+u*r,o*i+u*n,o*s+u*r,i,s]},$t=function(e,t,n,r,i,s,o,u,a,f){var l=$*120/180,c=$/180*(+i||0),h=[],p,d=g(function(e,t,n){var r=e*U.cos(n)-t*U.sin(n),i=e*U.sin(n)+t*U.cos(n);return{x:r,y:i}});if(!f){p=d(e,t,-c),e=p.x,t=p.y,p=d(u,a,-c),u=p.x,a=p.y;var v=U.cos($/180*i),m=U.sin($/180*i),y=(e-u)/2,b=(t-a)/2,w=y*y/(n*n)+b*b/(r*r);w>1&&(w=U.sqrt(w),n=w*n,r=w*r);var E=n*n,S=r*r,x=(s==o?-1:1)*U.sqrt(X((E*S-E*b*b-S*y*y)/(E*b*b+S*y*y))),T=x*n*b/r+(e+u)/2,N=x*-r*y/n+(t+a)/2,C=U.asin(((t-N)/r).toFixed(9)),k=U.asin(((a-N)/r).toFixed(9));C=e<T?$-C:C,k=u<T?$-k:k,C<0&&(C=$*2+C),k<0&&(k=$*2+k),o&&C>k&&(C-=$*2),!o&&k>C&&(k-=$*2)}else C=f[0],k=f[1],T=f[2],N=f[3];var L=k-C;if(X(L)>l){var A=k,O=u,M=a;k=C+l*(o&&k>C?1:-1),u=T+n*U.cos(k),a=N+r*U.sin(k),h=$t(u,a,n,r,i,0,o,O,M,[k,A,T,N])}L=k-C;var _=U.cos(C),P=U.sin(C),H=U.cos(k),B=U.sin(k),j=U.tan(L/4),I=4/3*n*j,q=4/3*r*j,R=[e,t],z=[e+I*P,t-q*_],W=[u+I*B,a-q*H],V=[u,a];z[0]=2*R[0]-z[0],z[1]=2*R[1]-z[1];if(f)return[z,W,V][D](h);h=[z,W,V][D](h).join()[F](",");var J=[];for(var K=0,Q=h.length;K<Q;K++)J[K]=K%2?d(h[K-1],h[K],c).y:d(h[K],h[K+1],c).x;return J},Jt=function(e,t,n,r,i,s,o,u,a){var f=1-a;return{x:V(f,3)*e+V(f,2)*3*a*n+f*3*a*a*i+V(a,3)*o,y:V(f,3)*t+V(f,2)*3*a*r+f*3*a*a*s+V(a,3)*u}},Kt=g(function(e,t,n,r,i,s,o,u){var a=i-2*n+e-(o-2*i+n),f=2*(n-e)-2*(i-n),l=e-n,c=(-f+U.sqrt(f*f-4*a*l))/2/a,h=(-f-U.sqrt(f*f-4*a*l))/2/a,p=[t,u],d=[e,o],v;return X(c)>"1e12"&&(c=.5),X(h)>"1e12"&&(h=.5),c>0&&c<1&&(v=Jt(e,t,n,r,i,s,o,u,c),d.push(v.x),p.push(v.y)),h>0&&h<1&&(v=Jt(e,t,n,r,i,s,o,u,h),d.push(v.x),p.push(v.y)),a=s-2*r+t-(u-2*s+r),f=2*(r-t)-2*(s-r),l=t-r,c=(-f+U.sqrt(f*f-4*a*l))/2/a,h=(-f-U.sqrt(f*f-4*a*l))/2/a,X(c)>"1e12"&&(c=.5),X(h)>"1e12"&&(h=.5),c>0&&c<1&&(v=Jt(e,t,n,r,i,s,o,u,c),d.push(v.x),p.push(v.y)),h>0&&h<1&&(v=Jt(e,t,n,r,i,s,o,u,h),d.push(v.x),p.push(v.y)),{min:{x:W[_](0,d),y:W[_](0,p)},max:{x:z[_](0,d),y:z[_](0,p)}}}),Qt=w._path2curve=g(function(e,t){var n=!t&&qt(e);if(!t&&n.curve)return Ut(n.curve);var r=Wt(e),i=t&&Wt(t),s={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},o={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},u=function(e,t){var n,r;if(!e)return["C",t.x,t.y,t.x,t.y,t.x,t.y];!(e[0]in{T:1,Q:1})&&(t.qx=t.qy=null);switch(e[0]){case"M":t.X=e[1],t.Y=e[2];break;case"A":e=["C"][D]($t[_](0,[t.x,t.y][D](e.slice(1))));break;case"S":n=t.x+(t.x-(t.bx||t.x)),r=t.y+(t.y-(t.by||t.y)),e=["C",n,r][D](e.slice(1));break;case"T":t.qx=t.x+(t.x-(t.qx||t.x)),t.qy=t.y+(t.y-(t.qy||t.y)),e=["C"][D](Vt(t.x,t.y,t.qx,t.qy,e[1],e[2]));break;case"Q":t.qx=e[1],t.qy=e[2],e=["C"][D](Vt(t.x,t.y,e[1],e[2],e[3],e[4]));break;case"L":e=["C"][D](Xt(t.x,t.y,e[1],e[2]));break;case"H":e=["C"][D](Xt(t.x,t.y,e[1],t.y));break;case"V":e=["C"][D](Xt(t.x,t.y,t.x,e[1]));break;case"Z":e=["C"][D](Xt(t.x,t.y,t.X,t.Y))}return e},a=function(e,t){if(e[t].length>7){e[t].shift();var n=e[t];while(n.length)e.splice(t++,0,["C"][D](n.splice(0,6)));e.splice(t,1),c=z(r.length,i&&i.length||0)}},f=function(e,t,n,s,o){e&&t&&e[o][0]=="M"&&t[o][0]!="M"&&(t.splice(o,0,["M",s.x,s.y]),n.bx=0,n.by=0,n.x=e[o][1],n.y=e[o][2],c=z(r.length,i&&i.length||0))};for(var l=0,c=z(r.length,i&&i.length||0);l<c;l++){r[l]=u(r[l],s),a(r,l),i&&(i[l]=u(i[l],o)),i&&a(i,l),f(r,i,s,o,l),f(i,r,o,s,l);var h=r[l],p=i&&i[l],d=h.length,v=i&&p.length;s.x=h[d-2],s.y=h[d-1],s.bx=at(h[d-4])||s.x,s.by=at(h[d-3])||s.y,o.bx=i&&(at(p[v-4])||o.x),o.by=i&&(at(p[v-3])||o.y),o.x=i&&p[v-2],o.y=i&&p[v-1]}return i||(n.curve=Ut(r)),i?[r,i]:r},null,Ut),Gt=w._parseDots=g(function(e){var t=[];for(var n=0,r=e.length;n<r;n++){var i={},s=e[n].match(/^([^:]*):?([\d\.]*)/);i.color=w.getRGB(s[1]);if(i.color.error)return null;i.color=i.color.hex,s[2]&&(i.offset=s[2]+"%"),t.push(i)}for(n=1,r=t.length-1;n<r;n++)if(!t[n].offset){var o=at(t[n-1].offset||0),u=0;for(var a=n+1;a<r;a++)if(t[a].offset){u=t[a].offset;break}u||(u=100,a=r),u=at(u);var f=(u-o)/(a-n+1);for(;n<a;n++)o+=f,t[n].offset=o+"%"}return t}),Yt=w._tear=function(e,t){e==t.top&&(t.top=e.prev),e==t.bottom&&(t.bottom=e.next),e.next&&(e.next.prev=e.prev),e.prev&&(e.prev.next=e.next)},Zt=w._tofront=function(e,t){t.top!==e&&(Yt(e,t),e.next=null,e.prev=t.top,t.top.next=e,t.top=e)},en=w._toback=function(e,t){t.bottom!==e&&(Yt(e,t),e.next=t.bottom,e.prev=null,t.bottom.prev=e,t.bottom=e)},tn=w._insertafter=function(e,t,n){Yt(e,n),t==n.top&&(n.top=e),t.next&&(t.next.prev=e),e.next=t.next,e.prev=t,t.next=e},nn=w._insertbefore=function(e,t,n){Yt(e,n),t==n.bottom&&(n.bottom=e),t.prev&&(t.prev.next=e),e.prev=t.prev,t.prev=e,e.next=t},rn=w.toMatrix=function(e,t){var n=Rt(e),r={_:{transform:H},getBBox:function(){return n}};return on(r,t),r.matrix},sn=w.transformPath=function(e,t){return At(e,rn(e,t))},on=w._extractTransform=function(e,t){if(t==null)return e._.transform;t=j(t).replace(/\.{3}|\u2026/g,e._.transform||H);var n=w.parseTransformString(t),r=0,i=0,s=0,u=1,a=1,f=e._,l=new o;f.transform=n||[];if(n)for(var c=0,h=n.length;c<h;c++){var p=n[c],d=p.length,v=j(p[0]).toLowerCase(),m=p[0]!=v,g=m?l.invert():0,y,b,E,S,x;v=="t"&&d==3?m?(y=g.x(0,0),b=g.y(0,0),E=g.x(p[1],p[2]),S=g.y(p[1],p[2]),l.translate(E-y,S-b)):l.translate(p[1],p[2]):v=="r"?d==2?(x=x||e.getBBox(1),l.rotate(p[1],x.x+x.width/2,x.y+x.height/2),r+=p[1]):d==4&&(m?(E=g.x(p[2],p[3]),S=g.y(p[2],p[3]),l.rotate(p[1],E,S)):l.rotate(p[1],p[2],p[3]),r+=p[1]):v=="s"?d==2||d==3?(x=x||e.getBBox(1),l.scale(p[1],p[d-1],x.x+x.width/2,x.y+x.height/2),u*=p[1],a*=p[d-1]):d==5&&(m?(E=g.x(p[3],p[4]),S=g.y(p[3],p[4]),l.scale(p[1],p[2],E,S)):l.scale(p[1],p[2],p[3],p[4]),u*=p[1],a*=p[2]):v=="m"&&d==7&&l.add(p[1],p[2],p[3],p[4],p[5],p[6]),f.dirtyT=1,e.matrix=l}e.matrix=l,f.sx=u,f.sy=a,f.deg=r,f.dx=i=l.e,f.dy=s=l.f,u==1&&a==1&&!r&&f.bbox?(f.bbox.x+=+i,f.bbox.y+=+s):f.dirtyT=1},un=function(e){var t=e[0];switch(t.toLowerCase()){case"t":return[t,0,0];case"m":return[t,1,0,0,1,0,0];case"r":return e.length==4?[t,0,e[2],e[3]]:[t,0];case"s":return e.length==5?[t,1,1,e[3],e[4]]:e.length==3?[t,1,1]:[t,1]}},an=w._equaliseTransform=function(e,t){t=j(t).replace(/\.{3}|\u2026/g,e),e=w.parseTransformString(e)||[],t=w.parseTransformString(t)||[];var n=z(e.length,t.length),r=[],i=[],s=0,o,u,a,f;for(;s<n;s++){a=e[s]||un(t[s]),f=t[s]||un(a);if(a[0]!=f[0]||a[0].toLowerCase()=="r"&&(a[2]!=f[2]||a[3]!=f[3])||a[0].toLowerCase()=="s"&&(a[3]!=f[3]||a[4]!=f[4]))return;r[s]=[],i[s]=[];for(o=0,u=z(a.length,f.length);o<u;o++)o in a&&(r[s][o]=a[o]),o in f&&(i[s][o]=f[o])}return{from:r,to:i}};w._getContainer=function(e,t,n,r){var i;i=r==null&&!w.is(e,"object")?k.doc.getElementById(e):e;if(i!=null)return i.tagName?t==null?{container:i,width:i.style.pixelWidth||i.offsetWidth,height:i.style.pixelHeight||i.offsetHeight}:{container:i,width:t,height:n}:{container:1,x:e,y:t,width:n,height:r}},w.pathToRelative=zt,w._engine={},w.path2curve=Qt,w.matrix=function(e,t,n,r,i,s){return new o(e,t,n,r,i,s)},function(e){function t(e){var t=U.sqrt(n(e));e[0]&&(e[0]/=t),e[1]&&(e[1]/=t)}function n(e){return e[0]*e[0]+e[1]*e[1]}e.add=function(e,t,n,r,i,s){var u=[[],[],[]],a=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],f=[[e,n,i],[t,r,s],[0,0,1]],l,c,h,p;e&&e instanceof o&&(f=[[e.a,e.c,e.e],[e.b,e.d,e.f],[0,0,1]]);for(l=0;l<3;l++)for(c=0;c<3;c++){p=0;for(h=0;h<3;h++)p+=a[l][h]*f[h][c];u[l][c]=p}this.a=u[0][0],this.b=u[1][0],this.c=u[0][1],this.d=u[1][1],this.e=u[0][2],this.f=u[1][2]},e.invert=function(){var e=this,t=e.a*e.d-e.b*e.c;return new o(e.d/t,-e.b/t,-e.c/t,e.a/t,(e.c*e.f-e.d*e.e)/t,(e.b*e.e-e.a*e.f)/t)},e.clone=function(){return new o(this.a,this.b,this.c,this.d,this.e,this.f)},e.translate=function(e,t){this.add(1,0,0,1,e,t)},e.scale=function(e,t,n,r){t==null&&(t=e),(n||r)&&this.add(1,0,0,1,n,r),this.add(e,0,0,t,0,0),(n||r)&&this.add(1,0,0,1,-n,-r)},e.rotate=function(e,t,n){e=w.rad(e),t=t||0,n=n||0;var r=+U.cos(e).toFixed(9),i=+U.sin(e).toFixed(9);this.add(r,i,-i,r,t,n),this.add(1,0,0,1,-t,-n)},e.x=function(e,t){return e*this.a+t*this.c+this.e},e.y=function(e,t){return e*this.b+t*this.d+this.f},e.get=function(e){return+this[j.fromCharCode(97+e)].toFixed(4)},e.toString=function(){return w.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},e.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},e.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},e.split=function(){var e={};e.dx=this.e,e.dy=this.f;var r=[[this.a,this.c],[this.b,this.d]];e.scalex=U.sqrt(n(r[0])),t(r[0]),e.shear=r[0][0]*r[1][0]+r[0][1]*r[1][1],r[1]=[r[1][0]-r[0][0]*e.shear,r[1][1]-r[0][1]*e.shear],e.scaley=U.sqrt(n(r[1])),t(r[1]),e.shear/=e.scaley;var i=-r[0][1],s=r[1][1];return s<0?(e.rotate=w.deg(U.acos(s)),i<0&&(e.rotate=360-e.rotate)):e.rotate=w.deg(U.asin(i)),e.isSimple=!+e.shear.toFixed(9)&&(e.scalex.toFixed(9)==e.scaley.toFixed(9)||!e.rotate),e.isSuperSimple=!+e.shear.toFixed(9)&&e.scalex.toFixed(9)==e.scaley.toFixed(9)&&!e.rotate,e.noRotation=!+e.shear.toFixed(9)&&!e.rotate,e},e.toTransformString=function(e){var t=e||this[F]();return t.isSimple?(t.scalex=+t.scalex.toFixed(4),t.scaley=+t.scaley.toFixed(4),t.rotate=+t.rotate.toFixed(4),(t.dx||t.dy?"t"+[t.dx,t.dy]:H)+(t.scalex!=1||t.scaley!=1?"s"+[t.scalex,t.scaley,0,0]:H)+(t.rotate?"r"+[t.rotate,0,0]:H)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(o.prototype);var fn=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(fn&&fn[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&fn&&fn[1]<8?O.safari=function(){var e=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){e.remove()})}:O.safari=Tt;var ln=function(){this.returnValue=!1},cn=function(){return this.originalEvent.preventDefault()},hn=function(){this.cancelBubble=!0},pn=function(){return this.originalEvent.stopPropagation()},dn=function(){if(k.doc.addEventListener)return function(e,t,n,r){var i=P&&q[t]?q[t]:t,s=function(i){var s=k.doc.documentElement.scrollTop||k.doc.body.scrollTop,o=k.doc.documentElement.scrollLeft||k.doc.body.scrollLeft,u=i.clientX+o,a=i.clientY+s;if(P&&q[C](t))for(var f=0,l=i.targetTouches&&i.targetTouches.length;f<l;f++)if(i.targetTouches[f].target==e){var c=i;i=i.targetTouches[f],i.originalEvent=c,i.preventDefault=cn,i.stopPropagation=pn;break}return n.call(r,i,u,a)};return e.addEventListener(i,s,!1),function(){return e.removeEventListener(i,s,!1),!0}};if(k.doc.attachEvent)return function(e,t,n,r){var i=function(e){e=e||k.win.event;var t=k.doc.documentElement.scrollTop||k.doc.body.scrollTop,i=k.doc.documentElement.scrollLeft||k.doc.body.scrollLeft,s=e.clientX+i,o=e.clientY+t;return e.preventDefault=e.preventDefault||ln,e.stopPropagation=e.stopPropagation||hn,n.call(r,e,s,o)};e.attachEvent("on"+t,i);var s=function(){return e.detachEvent("on"+t,i),!0};return s}}(),vn=[],mn=function(e){var t=e.clientX,n=e.clientY,r=k.doc.documentElement.scrollTop||k.doc.body.scrollTop,i=k.doc.documentElement.scrollLeft||k.doc.body.scrollLeft,s,o=vn.length;while(o--){s=vn[o];if(P){var u=e.touches.length,a;while(u--){a=e.touches[u];if(a.identifier==s.el._drag.id){t=a.clientX,n=a.clientY,(e.originalEvent?e.originalEvent:e).preventDefault();break}}}else e.preventDefault();var f=s.el.node,l,c=f.nextSibling,h=f.parentNode,p=f.style.display;k.win.opera&&h.removeChild(f),f.style.display="none",l=s.el.paper.getElementByPoint(t,n),f.style.display=p,k.win.opera&&(c?h.insertBefore(f,c):h.appendChild(f)),l&&eve("raphael.drag.over."+s.el.id,s.el,l),t+=i,n+=r,eve("raphael.drag.move."+s.el.id,s.move_scope||s.el,t-s.el._drag.x,n-s.el._drag.y,t,n,e)}},gn=function(e){w.unmousemove(mn).unmouseup(gn);var t=vn.length,n;while(t--)n=vn[t],n.el._drag={},eve("raphael.drag.end."+n.el.id,n.end_scope||n.start_scope||n.move_scope||n.el,e);vn=[]},yn=w.el={};for(var bn=I.length;bn--;)(function(e){w[e]=yn[e]=function(t,n){return w.is(t,"function")&&(this.events=this.events||[],this.events.push({name:e,f:t,unbind:dn(this.shape||this.node||k.doc,e,t,n||this)})),this},w["un"+e]=yn["un"+e]=function(t){var n=this.events||[],r=n.length;while(r--)if(n[r].name==e&&n[r].f==t)return n[r].unbind(),n.splice(r,1),!n.length&&delete this.events,this;return this}})(I[bn]);yn.data=function(e,t){var n=Et[this.id]=Et[this.id]||{};if(arguments.length==1){if(w.is(e,"object")){for(var r in e)e[C](r)&&this.data(r,e[r]);return this}return eve("raphael.data.get."+this.id,this,n[e],e),n[e]}return n[e]=t,eve("raphael.data.set."+this.id,this,t,e),this},yn.removeData=function(e){return e==null?Et[this.id]={}:Et[this.id]&&delete Et[this.id][e],this},yn.hover=function(e,t,n,r){return this.mouseover(e,n).mouseout(t,r||n)},yn.unhover=function(e,t){return this.unmouseover(e).unmouseout(t)};var wn=[];yn.drag=function(e,t,n,r,i,s){function o(o){(o.originalEvent||o).preventDefault();var u=k.doc.documentElement.scrollTop||k.doc.body.scrollTop,a=k.doc.documentElement.scrollLeft||k.doc.body.scrollLeft;this._drag.x=o.clientX+a,this._drag.y=o.clientY+u,this._drag.id=o.identifier,!vn.length&&w.mousemove(mn).mouseup(gn),vn.push({el:this,move_scope:r,start_scope:i,end_scope:s}),t&&eve.on("raphael.drag.start."+this.id,t),e&&eve.on("raphael.drag.move."+this.id,e),n&&eve.on("raphael.drag.end."+this.id,n),eve("raphael.drag.start."+this.id,i||r||this,o.clientX+a,o.clientY+u,o)}return this._drag={},wn.push({el:this,start:o}),this.mousedown(o),this},yn.onDragOver=function(e){e?eve.on("raphael.drag.over."+this.id,e):eve.unbind("raphael.drag.over."+this.id)},yn.undrag=function(){var e=wn.length;while(e--)wn[e].el==this&&(this.unmousedown(wn[e].start),wn.splice(e,1),eve.unbind("raphael.drag.*."+this.id));!wn.length&&w.unmousemove(mn).unmouseup(gn)},O.circle=function(e,t,n){var r=w._engine.circle(this,e||0,t||0,n||0);return this.__set__&&this.__set__.push(r),r},O.rect=function(e,t,n,r,i){var s=w._engine.rect(this,e||0,t||0,n||0,r||0,i||0);return this.__set__&&this.__set__.push(s),s},O.ellipse=function(e,t,n,r){var i=w._engine.ellipse(this,e||0,t||0,n||0,r||0);return this.__set__&&this.__set__.push(i),i},O.path=function(e){e&&!w.is(e,K)&&!w.is(e[0],Q)&&(e+=H);var t=w._engine.path(w.format[_](w,arguments),this);return this.__set__&&this.__set__.push(t),t},O.image=function(e,t,n,r,i){var s=w._engine.image(this,e||"about:blank",t||0,n||0,r||0,i||0);return this.__set__&&this.__set__.push(s),s},O.text=function(e,t,n){var r=w._engine.text(this,e||0,t||0,j(n));return this.__set__&&this.__set__.push(r),r},O.set=function(e){!w.is(e,"array")&&(e=Array.prototype.splice.call(arguments,0,arguments.length));var t=new Dn(e);return this.__set__&&this.__set__.push(t),t},O.setStart=function(e){this.__set__=e||this.set()},O.setFinish=function(e){var t=this.__set__;return delete this.__set__,t},O.setSize=function(e,t){return w._engine.setSize.call(this,e,t)},O.setViewBox=function(e,t,n,r,i){return w._engine.setViewBox.call(this,e,t,n,r,i)},O.top=O.bottom=null,O.raphael=w;var En=function(e){var t=e.getBoundingClientRect(),n=e.ownerDocument,r=n.body,i=n.documentElement,s=i.clientTop||r.clientTop||0,o=i.clientLeft||r.clientLeft||0,u=t.top+(k.win.pageYOffset||i.scrollTop||r.scrollTop)-s,a=t.left+(k.win.pageXOffset||i.scrollLeft||r.scrollLeft)-o;return{y:u,x:a}};O.getElementByPoint=function(e,t){var n=this,r=n.canvas,i=k.doc.elementFromPoint(e,t);if(k.win.opera&&i.tagName=="svg"){var s=En(r),o=r.createSVGRect();o.x=e-s.x,o.y=t-s.y,o.width=o.height=1;var u=r.getIntersectionList(o,null);u.length&&(i=u[u.length-1])}if(!i)return null;while(i.parentNode&&i!=r.parentNode&&!i.raphael)i=i.parentNode;return i==n.canvas.parentNode&&(i=r),i=i&&i.raphael?n.getById(i.raphaelid):null,i},O.getById=function(e){var t=this.bottom;while(t){if(t.id==e)return t;t=t.next}return null},O.forEach=function(e,t){var n=this.bottom;while(n){if(e.call(t,n)===!1)return this;n=n.next}return this},O.getElementsByPoint=function(e,t){var n=this.set();return this.forEach(function(r){r.isPointInside(e,t)&&n.push(r)}),n},yn.isPointInside=function(e,t){var n=this.realPath=this.realPath||Lt[this.type](this);return w.isPointInsidePath(n,e,t)},yn.getBBox=function(e){if(this.removed)return{};var t=this._;if(e){if(t.dirty||!t.bboxwt)this.realPath=Lt[this.type](this),t.bboxwt=Rt(this.realPath),t.bboxwt.toString=i,t.dirty=0;return t.bboxwt}if(t.dirty||t.dirtyT||!t.bbox){if(t.dirty||!this.realPath)t.bboxwt=0,this.realPath=Lt[this.type](this);t.bbox=Rt(At(this.realPath,this.matrix)),t.bbox.toString=i,t.dirty=t.dirtyT=0}return t.bbox},yn.clone=function(){if(this.removed)return null;var e=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(e),e},yn.glow=function(e){if(this.type=="text")return null;e=e||{};var t={width:(e.width||10)+(+this.attr("stroke-width")||1),fill:e.fill||!1,opacity:e.opacity||.5,offsetx:e.offsetx||0,offsety:e.offsety||0,color:e.color||"#000"},n=t.width/2,r=this.paper,i=r.set(),s=this.realPath||Lt[this.type](this);s=this.matrix?At(s,this.matrix):s;for(var o=1;o<n+1;o++)i.push(r.path(s).attr({stroke:t.color,fill:t.fill?t.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(t.width/n*o).toFixed(3),opacity:+(t.opacity/n).toFixed(3)}));return i.insertBefore(this).translate(t.offsetx,t.offsety)};var Sn={},xn=function(e,t,n,r,i,s,o,u,a){return a==null?p(e,t,n,r,i,s,o,u):w.findDotsAtSegment(e,t,n,r,i,s,o,u,h(e,t,n,r,i,s,o,u,a))},Tn=function(e,t){return function(n,r,i){n=Qt(n);var s,o,u,a,f="",l={},c,h=0;for(var p=0,d=n.length;p<d;p++){u=n[p];if(u[0]=="M")s=+u[1],o=+u[2];else{a=xn(s,o,u[1],u[2],u[3],u[4],u[5],u[6]);if(h+a>r){if(t&&!l.start){c=xn(s,o,u[1],u[2],u[3],u[4],u[5],u[6],r-h),f+=["C"+c.start.x,c.start.y,c.m.x,c.m.y,c.x,c.y];if(i)return f;l.start=f,f=["M"+c.x,c.y+"C"+c.n.x,c.n.y,c.end.x,c.end.y,u[5],u[6]].join(),h+=a,s=+u[5],o=+u[6];continue}if(!e&&!t)return c=xn(s,o,u[1],u[2],u[3],u[4],u[5],u[6],r-h),{x:c.x,y:c.y,alpha:c.alpha}}h+=a,s=+u[5],o=+u[6]}f+=u.shift()+u}return l.end=f,c=e?h:t?l:w.findDotsAtSegment(s,o,u[0],u[1],u[2],u[3],u[4],u[5],1),c.alpha&&(c={x:c.x,y:c.y,alpha:c.alpha}),c}},Nn=Tn(1),Cn=Tn(),kn=Tn(0,1);w.getTotalLength=Nn,w.getPointAtLength=Cn,w.getSubpath=function(e,t,n){if(this.getTotalLength(e)-n<1e-6)return kn(e,t).end;var r=kn(e,n,1);return t?kn(r,t).end:r},yn.getTotalLength=function(){if(this.type=="path")return this.node.getTotalLength?this.node.getTotalLength():Nn(this.attrs.path)},yn.getPointAtLength=function(e){if(this.type=="path")return Cn(this.attrs.path,e)},yn.getSubpath=function(e,t){if(this.type=="path")return w.getSubpath(this.attrs.path,e,t)};var Ln=w.easing_formulas={linear:function(e){return e},"<":function(e){return V(e,1.7)},">":function(e){return V(e,.48)},"<>":function(e){var t=.48-e/1.04,n=U.sqrt(.1734+t*t),r=n-t,i=V(X(r),1/3)*(r<0?-1:1),s=-n-t,o=V(X(s),1/3)*(s<0?-1:1),u=i+o+.5;return(1-u)*3*u*u+u*u*u},backIn:function(e){var t=1.70158;return e*e*((t+1)*e-t)},backOut:function(e){e-=1;var t=1.70158;return e*e*((t+1)*e+t)+1},elastic:function(e){return e==!!e?e:V(2,-10*e)*U.sin((e-.075)*2*$/.3)+1},bounce:function(e){var t=7.5625,n=2.75,r;return e<1/n?r=t*e*e:e<2/n?(e-=1.5/n,r=t*e*e+.75):e<2.5/n?(e-=2.25/n,r=t*e*e+.9375):(e-=2.625/n,r=t*e*e+.984375),r}};Ln.easeIn=Ln["ease-in"]=Ln["<"],Ln.easeOut=Ln["ease-out"]=Ln[">"],Ln.easeInOut=Ln["ease-in-out"]=Ln["<>"],Ln["back-in"]=Ln.backIn,Ln["back-out"]=Ln.backOut;var An=[],On=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){setTimeout(e,16)},Mn=function(){var e=+(new Date),n=0;for(;n<An.length;n++){var r=An[n];if(r.el.removed||r.paused)continue;var i=e-r.start,s=r.ms,o=r.easing,u=r.from,a=r.diff,f=r.to,l=r.t,c=r.el,h={},p,d={},v;r.initstatus?(i=(r.initstatus*r.anim.top-r.prev)/(r.percent-r.prev)*s,r.status=r.initstatus,delete r.initstatus,r.stop&&An.splice(n--,1)):r.status=(r.prev+(r.percent-r.prev)*(i/s))/r.anim.top;if(i<0)continue;if(i<s){var m=o(i/s);for(var g in u)if(u[C](g)){switch(ht[g]){case J:p=+u[g]+m*s*a[g];break;case"colour":p="rgb("+[_n(ot(u[g].r+m*s*a[g].r)),_n(ot(u[g].g+m*s*a[g].g)),_n(ot(u[g].b+m*s*a[g].b))].join(",")+")";break;case"path":p=[];for(var y=0,b=u[g].length;y<b;y++){p[y]=[u[g][y][0]];for(var E=1,S=u[g][y].length;E<S;E++)p[y][E]=+u[g][y][E]+m*s*a[g][y][E];p[y]=p[y].join(B)}p=p.join(B);break;case"transform":if(a[g].real){p=[];for(y=0,b=u[g].length;y<b;y++){p[y]=[u[g][y][0]];for(E=1,S=u[g][y].length;E<S;E++)p[y][E]=u[g][y][E]+m*s*a[g][y][E]}}else{var x=function(e){return+u[g][e]+m*s*a[g][e]};p=[["m",x(0),x(1),x(2),x(3),x(4),x(5)]]}break;case"csv":if(g=="clip-rect"){p=[],y=4;while(y--)p[y]=+u[g][y]+m*s*a[g][y]}break;default:var T=[][D](u[g]);p=[],y=c.paper.customAttributes[g].length;while(y--)p[y]=+T[y]+m*s*a[g][y]}h[g]=p}c.attr(h),function(e,t,n){setTimeout(function(){eve("raphael.anim.frame."+e,t,n)})}(c.id,c,r.anim)}else{(function(e,t,n){setTimeout(function(){eve("raphael.anim.frame."+t.id,t,n),eve("raphael.anim.finish."+t.id,t,n),w.is(e,"function")&&e.call(t)})})(r.callback,c,r.anim),c.attr(f),An.splice(n--,1);if(r.repeat>1&&!r.next){for(v in f)f[C](v)&&(d[v]=r.totalOrigin[v]);r.el.attr(d),t(r.anim,r.el,r.anim.percents[0],null,r.totalOrigin,r.repeat-1)}r.next&&!r.stop&&t(r.anim,r.el,r.next,null,r.totalOrigin,r.repeat)}}w.svg&&c&&c.paper&&c.paper.safari(),An.length&&On(Mn)},_n=function(e){return e>255?255:e<0?0:e};yn.animateWith=function(e,r,i,s,o,u){var a=this;if(a.removed)return u&&u.call(a),a;var f=i instanceof n?i:w.animation(i,s,o,u),l,c;t(f,a,f.percents[0],null,a.attr());for(var h=0,p=An.length;h<p;h++)if(An[h].anim==r&&An[h].el==e){An[p-1].start=An[h].start;break}return a},yn.onAnimation=function(e){return e?eve.on("raphael.anim.frame."+this.id,e):eve.unbind("raphael.anim.frame."+this.id),this},n.prototype.delay=function(e){var t=new n(this.anim,this.ms);return t.times=this.times,t.del=+e||0,t},n.prototype.repeat=function(e){var t=new n(this.anim,this.ms);return t.del=this.del,t.times=U.floor(z(e,0))||1,t},w.animation=function(e,t,r,i){if(e instanceof n)return e;if(w.is(r,"function")||!r)i=i||r||null,r=null;e=Object(e),t=+t||0;var s={},o,u;for(u in e)e[C](u)&&at(u)!=u&&at(u)+"%"!=u&&(o=!0,s[u]=e[u]);return o?(r&&(s.easing=r),i&&(s.callback=i),new n({100:s},t)):new n(e,t)},yn.animate=function(e,r,i,s){var o=this;if(o.removed)return s&&s.call(o),o;var u=e instanceof n?e:w.animation(e,r,i,s);return t(u,o,u.percents[0],null,o.attr()),o},yn.setTime=function(e,t){return e&&t!=null&&this.status(e,W(t,e.ms)/e.ms),this},yn.status=function(e,n){var r=[],i=0,s,o;if(n!=null)return t(e,this,-1,W(n,1)),this;s=An.length;for(;i<s;i++){o=An[i];if(o.el.id==this.id&&(!e||o.anim==e)){if(e)return o.status;r.push({anim:o.anim,status:o.status})}}return e?0:r},yn.pause=function(e){for(var t=0;t<An.length;t++)An[t].el.id==this.id&&(!e||An[t].anim==e)&&eve("raphael.anim.pause."+this.id,this,An[t].anim)!==!1&&(An[t].paused=!0);return this},yn.resume=function(e){for(var t=0;t<An.length;t++)if(An[t].el.id==this.id&&(!e||An[t].anim==e)){var n=An[t];eve("raphael.anim.resume."+this.id,this,n.anim)!==!1&&(delete n.paused,this.status(n.anim,n.status))}return this},yn.stop=function(e){for(var t=0;t<An.length;t++)An[t].el.id==this.id&&(!e||An[t].anim==e)&&eve("raphael.anim.stop."+this.id,this,An[t].anim)!==!1&&An.splice(t--,1);return this},eve.on("raphael.remove",e),eve.on("raphael.clear",e),yn.toString=function(){return"RaphaÃ«lâ€™s object"};var Dn=function(e){this.items=[],this.length=0,this.type="set";if(e)for(var t=0,n=e.length;t<n;t++)e[t]&&(e[t].constructor==yn.constructor||e[t].constructor==Dn)&&(this[this.items.length]=this.items[this.items.length]=e[t],this.length++)},Pn=Dn.prototype;Pn.push=function(){var e,t;for(var n=0,r=arguments.length;n<r;n++)e=arguments[n],e&&(e.constructor==yn.constructor||e.constructor==Dn)&&(t=this.items.length,this[t]=this.items[t]=e,this.length++);return this},Pn.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},Pn.forEach=function(e,t){for(var n=0,r=this.items.length;n<r;n++)if(e.call(t,this.items[n],n)===!1)return this;return this};for(var Hn in yn)yn[C](Hn)&&(Pn[Hn]=function(e){return function(){var t=arguments;return this.forEach(function(n){n[e][_](n,t)})}}(Hn));Pn.attr=function(e,t){if(e&&w.is(e,Q)&&w.is(e[0],"object"))for(var n=0,r=e.length;n<r;n++)this.items[n].attr(e[n]);else for(var i=0,s=this.items.length;i<s;i++)this.items[i].attr(e,t);return this},Pn.clear=function(){while(this.length)this.pop()},Pn.splice=function(e,t,n){e=e<0?z(this.length+e,0):e,t=z(0,W(this.length-e,t));var r=[],i=[],s=[],o;for(o=2;o<arguments.length;o++)s.push(arguments[o]);for(o=0;o<t;o++)i.push(this[e+o]);for(;o<this.length-e;o++)r.push(this[e+o]);var u=s.length;for(o=0;o<u+r.length;o++)this.items[e+o]=this[e+o]=o<u?s[o]:r[o-u];o=this.items.length=this.length-=t-u;while(this[o])delete this[o++];return new Dn(i)},Pn.exclude=function(e){for(var t=0,n=this.length;t<n;t++)if(this[t]==e)return this.splice(t,1),!0},Pn.animate=function(e,t,n,r){(w.is(n,"function")||!n)&&(r=n||null);var i=this.items.length,s=i,o,u=this,a;if(!i)return this;r&&(a=function(){!--i&&r.call(u)}),n=w.is(n,K)?n:a;var f=w.animation(e,t,n,a);o=this.items[--s].animate(f);while(s--)this.items[s]&&!this.items[s].removed&&this.items[s].animateWith(o,f,f);return this},Pn.insertAfter=function(e){var t=this.items.length;while(t--)this.items[t].insertAfter(e);return this},Pn.getBBox=function(){var e=[],t=[],n=[],r=[];for(var i=this.items.length;i--;)if(!this.items[i].removed){var s=this.items[i].getBBox();e.push(s.x),t.push(s.y),n.push(s.x+s.width),r.push(s.y+s.height)}return e=W[_](0,e),t=W[_](0,t),n=z[_](0,n),r=z[_](0,r),{x:e,y:t,x2:n,y2:r,width:n-e,height:r-t}},Pn.clone=function(e){e=new Dn;for(var t=0,n=this.items.length;t<n;t++)e.push(this.items[t].clone());return e},Pn.toString=function(){return"RaphaÃ«lâ€˜s set"},w.registerFont=function(e){if(!e.face)return e;this.fonts=this.fonts||{};var t={w:e.w,face:{},glyphs:{}},n=e.face["font-family"];for(var r in e.face)e.face[C](r)&&(t.face[r]=e.face[r]);this.fonts[n]?this.fonts[n].push(t):this.fonts[n]=[t];if(!e.svg){t.face["units-per-em"]=ft(e.face["units-per-em"],10);for(var i in e.glyphs)if(e.glyphs[C](i)){var s=e.glyphs[i];t.glyphs[i]={w:s.w,k:{},d:s.d&&"M"+s.d.replace(/[mlcxtrv]/g,function(e){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[e]||"M"})+"z"};if(s.k)for(var o in s.k)s[C](o)&&(t.glyphs[i].k[o]=s.k[o])}}return e},O.getFont=function(e,t,n,r){r=r||"normal",n=n||"normal",t=+t||{normal:400,bold:700,lighter:300,bolder:800}[t]||400;if(!!w.fonts){var i=w.fonts[e];if(!i){var s=new RegExp("(^|\\s)"+e.replace(/[^\w\d\s+!~.:_-]/g,H)+"(\\s|$)","i");for(var o in w.fonts)if(w.fonts[C](o)&&s.test(o)){i=w.fonts[o];break}}var u;if(i)for(var a=0,f=i.length;a<f;a++){u=i[a];if(u.face["font-weight"]==t&&(u.face["font-style"]==n||!u.face["font-style"])&&u.face["font-stretch"]==r)break}return u}},O.print=function(e,t,n,r,i,s,o){s=s||"middle",o=z(W(o||0,1),-1);var u=j(n)[F](H),a=0,f=0,l=H,c;w.is(r,n)&&(r=this.getFont(r));if(r){c=(i||16)/r.face["units-per-em"];var h=r.face.bbox[F](S),p=+h[0],d=h[3]-h[1],v=0,m=+h[1]+(s=="baseline"?d+ +r.face.descent:d/2);for(var g=0,y=u.length;g<y;g++){if(u[g]=="\n")a=0,E=0,f=0,v+=d;else{var b=f&&r.glyphs[u[g-1]]||{},E=r.glyphs[u[g]];a+=f?(b.w||r.w)+(b.k&&b.k[u[g]]||0)+r.w*o:0,f=1}E&&E.d&&(l+=w.transformPath(E.d,["t",a*c,v*c,"s",c,c,p,m,"t",(e-p)/c,(t-m)/c]))}}return this.path(l).attr({fill:"#000",stroke:"none"})},O.add=function(e){if(w.is(e,"array")){var t=this.set(),n=0,r=e.length,i;for(;n<r;n++)i=e[n]||{},x[C](i.type)&&t.push(this[i.type]().attr(i))}return t},w.format=function(e,t){var n=w.is(t,Q)?[0][D](t):arguments;return e&&w.is(e,K)&&n.length-1&&(e=e.replace(T,function(e,t){return n[++t]==null?H:n[t]})),e||H},w.fullfill=function(){var e=/\{([^\}]+)\}/g,t=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,n=function(e,n,r){var i=r;return n.replace(t,function(e,t,n,r,s){t=t||r,i&&(t in i&&(i=i[t]),typeof i=="function"&&s&&(i=i()))}),i=(i==null||i==r?e:i)+"",i};return function(t,r){return String(t).replace(e,function(e,t){return n(e,t,r)})}}(),w.ninja=function(){return L.was?k.win.Raphael=L.is:delete Raphael,w},w.st=Pn,function(e,t,n){function r(){/in/.test(e.readyState)?setTimeout(r,9):w.eve("raphael.DOMload")}e.readyState==null&&e.addEventListener&&(e.addEventListener(t,n=function(){e.removeEventListener(t,n,!1),e.readyState="complete"},!1),e.readyState="loading"),r()}(document,"DOMContentLoaded"),L.was?k.win.Raphael=w:Raphael=w,eve.on("raphael.DOMload",function(){E=!0})}(),window.Raphael.svg&&function(e){var t="hasOwnProperty",n=String,r=parseFloat,i=parseInt,s=Math,o=s.max,u=s.abs,a=s.pow,f=/[, ]+/,l=e.eve,c="",h=" ",p="http://www.w3.org/1999/xlink",d={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},v={};e.toString=function(){return"Your browser supports SVG.\nYou are running RaphaÃ«l "+this.version};var m=function(r,i){if(i){typeof r=="string"&&(r=m(r));for(var s in i)i[t](s)&&(s.substring(0,6)=="xlink:"?r.setAttributeNS(p,s.substring(6),n(i[s])):r.setAttribute(s,n(i[s])))}else r=e._g.doc.createElementNS("http://www.w3.org/2000/svg",r),r.style&&(r.style.webkitTapHighlightColor="rgba(0,0,0,0)");return r},g=function(t,i){var f="linear",l=t.id+i,h=.5,p=.5,d=t.node,v=t.paper,g=d.style,y=e._g.doc.getElementById(l);if(!y){i=n(i).replace(e._radial_gradient,function(e,t,n){f="radial";if(t&&n){h=r(t),p=r(n);var i=(p>.5)*2-1;a(h-.5,2)+a(p-.5,2)>.25&&(p=s.sqrt(.25-a(h-.5,2))*i+.5)&&p!=.5&&(p=p.toFixed(5)-1e-5*i)}return c}),i=i.split(/\s*\-\s*/);if(f=="linear"){var b=i.shift();b=-r(b);if(isNaN(b))return null;var w=[0,0,s.cos(e.rad(b)),s.sin(e.rad(b))],E=1/(o(u(w[2]),u(w[3]))||1);w[2]*=E,w[3]*=E,w[2]<0&&(w[0]=-w[2],w[2]=0),w[3]<0&&(w[1]=-w[3],w[3]=0)}var S=e._parseDots(i);if(!S)return null;l=l.replace(/[\(\)\s,\xb0#]/g,"_"),t.gradient&&l!=t.gradient.id&&(v.defs.removeChild(t.gradient),delete t.gradient);if(!t.gradient){y=m(f+"Gradient",{id:l}),t.gradient=y,m(y,f=="radial"?{fx:h,fy:p}:{x1:w[0],y1:w[1],x2:w[2],y2:w[3],gradientTransform:t.matrix.invert()}),v.defs.appendChild(y);for(var x=0,T=S.length;x<T;x++)y.appendChild(m("stop",{offset:S[x].offset?S[x].offset:x?"100%":"0%","stop-color":S[x].color||"#fff"}))}}return m(d,{fill:"url(#"+l+")",opacity:1,"fill-opacity":1}),g.fill=c,g.opacity=1,g.fillOpacity=1,1},y=function(e){var t=e.getBBox(1);m(e.pattern,{patternTransform:e.matrix.invert()+" translate("+t.x+","+t.y+")"})},b=function(r,i,s){if(r.type=="path"){var o=n(i).toLowerCase().split("-"),u=r.paper,a=s?"end":"start",f=r.node,l=r.attrs,h=l["stroke-width"],p=o.length,g="classic",y,b,w,E,S,x=3,T=3,N=5;while(p--)switch(o[p]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":g=o[p];break;case"wide":T=5;break;case"narrow":T=2;break;case"long":x=5;break;case"short":x=2}g=="open"?(x+=2,T+=2,N+=2,w=1,E=s?4:1,S={fill:"none",stroke:l.stroke}):(E=w=x/2,S={fill:l.stroke,stroke:"none"}),r._.arrows?s?(r._.arrows.endPath&&v[r._.arrows.endPath]--,r._.arrows.endMarker&&v[r._.arrows.endMarker]--):(r._.arrows.startPath&&v[r._.arrows.startPath]--,r._.arrows.startMarker&&v[r._.arrows.startMarker]--):r._.arrows={};if(g!="none"){var C="raphael-marker-"+g,k="raphael-marker-"+a+g+x+T;e._g.doc.getElementById(C)?v[C]++:(u.defs.appendChild(m(m("path"),{"stroke-linecap":"round",d:d[g],id:C})),v[C]=1);var L=e._g.doc.getElementById(k),A;L?(v[k]++,A=L.getElementsByTagName("use")[0]):(L=m(m("marker"),{id:k,markerHeight:T,markerWidth:x,orient:"auto",refX:E,refY:T/2}),A=m(m("use"),{"xlink:href":"#"+C,transform:(s?"rotate(180 "+x/2+" "+T/2+") ":c)+"scale("+x/N+","+T/N+")","stroke-width":(1/((x/N+T/N)/2)).toFixed(4)}),L.appendChild(A),u.defs.appendChild(L),v[k]=1),m(A,S);var O=w*(g!="diamond"&&g!="oval");s?(y=r._.arrows.startdx*h||0,b=e.getTotalLength(l.path)-O*h):(y=O*h,b=e.getTotalLength(l.path)-(r._.arrows.enddx*h||0)),S={},S["marker-"+a]="url(#"+k+")";if(b||y)S.d=Raphael.getSubpath(l.path,y,b);m(f,S),r._.arrows[a+"Path"]=C,r._.arrows[a+"Marker"]=k,r._.arrows[a+"dx"]=O,r._.arrows[a+"Type"]=g,r._.arrows[a+"String"]=i}else s?(y=r._.arrows.startdx*h||0,b=e.getTotalLength(l.path)-y):(y=0,b=e.getTotalLength(l.path)-(r._.arrows.enddx*h||0)),r._.arrows[a+"Path"]&&m(f,{d:Raphael.getSubpath(l.path,y,b)}),delete r._.arrows[a+"Path"],delete r._.arrows[a+"Marker"],delete r._.arrows[a+"dx"],delete r._.arrows[a+"Type"],delete r._.arrows[a+"String"];for(S in v)if(v[t](S)&&!v[S]){var M=e._g.doc.getElementById(S);M&&M.parentNode.removeChild(M)}}},w={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},E=function(e,t,r){t=w[n(t).toLowerCase()];if(t){var i=e.attrs["stroke-width"]||"1",s={round:i,square:i,butt:0}[e.attrs["stroke-linecap"]||r["stroke-linecap"]]||0,o=[],u=t.length;while(u--)o[u]=t[u]*i+(u%2?1:-1)*s;m(e.node,{"stroke-dasharray":o.join(",")})}},S=function(r,s){var a=r.node,l=r.attrs,h=a.style.visibility;a.style.visibility="hidden";for(var d in s)if(s[t](d)){if(!e._availableAttrs[t](d))continue;var v=s[d];l[d]=v;switch(d){case"blur":r.blur(v);break;case"href":case"title":case"target":var w=a.parentNode;if(w.tagName.toLowerCase()!="a"){var S=m("a");w.insertBefore(S,a),S.appendChild(a),w=S}d=="target"?w.setAttributeNS(p,"show",v=="blank"?"new":v):w.setAttributeNS(p,d,v);break;case"cursor":a.style.cursor=v;break;case"transform":r.transform(v);break;case"arrow-start":b(r,v);break;case"arrow-end":b(r,v,1);break;case"clip-rect":var x=n(v).split(f);if(x.length==4){r.clip&&r.clip.parentNode.parentNode.removeChild(r.clip.parentNode);var N=m("clipPath"),C=m("rect");N.id=e.createUUID(),m(C,{x:x[0],y:x[1],width:x[2],height:x[3]}),N.appendChild(C),r.paper.defs.appendChild(N),m(a,{"clip-path":"url(#"+N.id+")"}),r.clip=C}if(!v){var k=a.getAttribute("clip-path");if(k){var L=e._g.doc.getElementById(k.replace(/(^url\(#|\)$)/g,c));L&&L.parentNode.removeChild(L),m(a,{"clip-path":c}),delete r.clip}}break;case"path":r.type=="path"&&(m(a,{d:v?l.path=e._pathToAbsolute(v):"M0,0"}),r._.dirty=1,r._.arrows&&("startString"in r._.arrows&&b(r,r._.arrows.startString),"endString"in r._.arrows&&b(r,r._.arrows.endString,1)));break;case"width":a.setAttribute(d,v),r._.dirty=1;if(!l.fx)break;d="x",v=l.x;case"x":l.fx&&(v=-l.x-(l.width||0));case"rx":if(d=="rx"&&r.type=="rect")break;case"cx":a.setAttribute(d,v),r.pattern&&y(r),r._.dirty=1;break;case"height":a.setAttribute(d,v),r._.dirty=1;if(!l.fy)break;d="y",v=l.y;case"y":l.fy&&(v=-l.y-(l.height||0));case"ry":if(d=="ry"&&r.type=="rect")break;case"cy":a.setAttribute(d,v),r.pattern&&y(r),r._.dirty=1;break;case"r":r.type=="rect"?m(a,{rx:v,ry:v}):a.setAttribute(d,v),r._.dirty=1;break;case"src":r.type=="image"&&a.setAttributeNS(p,"href",v);break;case"stroke-width":if(r._.sx!=1||r._.sy!=1)v/=o(u(r._.sx),u(r._.sy))||1;r.paper._vbSize&&(v*=r.paper._vbSize),a.setAttribute(d,v),l["stroke-dasharray"]&&E(r,l["stroke-dasharray"],s),r._.arrows&&("startString"in r._.arrows&&b(r,r._.arrows.startString),"endString"in r._.arrows&&b(r,r._.arrows.endString,1));break;case"stroke-dasharray":E(r,v,s);break;case"fill":var A=n(v).match(e._ISURL);if(A){N=m("pattern");var O=m("image");N.id=e.createUUID(),m(N,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),m(O,{x:0,y:0,"xlink:href":A[1]}),N.appendChild(O),function(t){e._preload(A[1],function(){var e=this.offsetWidth,n=this.offsetHeight;m(t,{width:e,height:n}),m(O,{width:e,height:n}),r.paper.safari()})}(N),r.paper.defs.appendChild(N),m(a,{fill:"url(#"+N.id+")"}),r.pattern=N,r.pattern&&y(r);break}var M=e.getRGB(v);if(!M.error)delete s.gradient,delete l.gradient,!e.is(l.opacity,"undefined")&&e.is(s.opacity,"undefined")&&m(a,{opacity:l.opacity}),!e.is(l["fill-opacity"],"undefined")&&e.is(s["fill-opacity"],"undefined")&&m(a,{"fill-opacity":l["fill-opacity"]});else if((r.type=="circle"||r.type=="ellipse"||n(v).charAt()!="r")&&g(r,v)){if("opacity"in l||"fill-opacity"in l){var _=e._g.doc.getElementById(a.getAttribute("fill").replace(/^url\(#|\)$/g,c));if(_){var D=_.getElementsByTagName("stop");m(D[D.length-1],{"stop-opacity":("opacity"in l?l.opacity:1)*("fill-opacity"in l?l["fill-opacity"]:1)})}}l.gradient=v,l.fill="none";break}M[t]("opacity")&&m(a,{"fill-opacity":M.opacity>1?M.opacity/100:M.opacity});case"stroke":M=e.getRGB(v),a.setAttribute(d,M.hex),d=="stroke"&&M[t]("opacity")&&m(a,{"stroke-opacity":M.opacity>1?M.opacity/100:M.opacity}),d=="stroke"&&r._.arrows&&("startString"in r._.arrows&&b(r,r._.arrows.startString),"endString"in r._.arrows&&b(r,r._.arrows.endString,1));break;case"gradient":(r.type=="circle"||r.type=="ellipse"||n(v).charAt()!="r")&&g(r,v);break;case"opacity":l.gradient&&!l[t]("stroke-opacity")&&m(a,{"stroke-opacity":v>1?v/100:v});case"fill-opacity":if(l.gradient){_=e._g.doc.getElementById(a.getAttribute("fill").replace(/^url\(#|\)$/g,c)),_&&(D=_.getElementsByTagName("stop"),m(D[D.length-1],{"stop-opacity":v}));break};default:d=="font-size"&&(v=i(v,10)+"px");var P=d.replace(/(\-.)/g,function(e){return e.substring(1).toUpperCase()});a.style[P]=v,r._.dirty=1,a.setAttribute(d,v)}}T(r,s),a.style.visibility=h},x=1.2,T=function(r,s){if(r.type=="text"&&!!(s[t]("text")||s[t]("font")||s[t]("font-size")||s[t]("x")||s[t]("y"))){var o=r.attrs,u=r.node,a=u.firstChild?i(e._g.doc.defaultView.getComputedStyle(u.firstChild,c).getPropertyValue("font-size"),10):10;if(s[t]("text")){o.text=s.text;while(u.firstChild)u.removeChild(u.firstChild);var f=n(s.text).split("\n"),l=[],h;for(var p=0,d=f.length;p<d;p++)h=m("tspan"),p&&m(h,{dy:a*x,x:o.x}),h.appendChild(e._g.doc.createTextNode(f[p])),u.appendChild(h),l[p]=h}else{l=u.getElementsByTagName("tspan");for(p=0,d=l.length;p<d;p++)p?m(l[p],{dy:a*x,x:o.x}):m(l[0],{dy:0})}m(u,{x:o.x,y:o.y}),r._.dirty=1;var v=r._getBBox(),g=o.y-(v.y+v.height/2);g&&e.is(g,"finite")&&m(l[0],{dy:g})}},N=function(t,n){var r=0,i=0;this[0]=this.node=t,t.raphael=!0,this.id=e._oid++,t.raphaelid=this.id,this.matrix=e.matrix(),this.realPath=null,this.paper=n,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!n.bottom&&(n.bottom=this),this.prev=n.top,n.top&&(n.top.next=this),n.top=this,this.next=null},C=e.el;N.prototype=C,C.constructor=N,e._engine.path=function(e,t){var n=m("path");t.canvas&&t.canvas.appendChild(n);var r=new N(n,t);return r.type="path",S(r,{fill:"none",stroke:"#000",path:e}),r},C.rotate=function(e,t,i){if(this.removed)return this;e=n(e).split(f),e.length-1&&(t=r(e[1]),i=r(e[2])),e=r(e[0]),i==null&&(t=i);if(t==null||i==null){var s=this.getBBox(1);t=s.x+s.width/2,i=s.y+s.height/2}return this.transform(this._.transform.concat([["r",e,t,i]])),this},C.scale=function(e,t,i,s){if(this.removed)return this;e=n(e).split(f),e.length-1&&(t=r(e[1]),i=r(e[2]),s=r(e[3])),e=r(e[0]),t==null&&(t=e),s==null&&(i=s);if(i==null||s==null)var o=this.getBBox(1);return i=i==null?o.x+o.width/2:i,s=s==null?o.y+o.height/2:s,this.transform(this._.transform.concat([["s",e,t,i,s]])),this},C.translate=function(e,t){return this.removed?this:(e=n(e).split(f),e.length-1&&(t=r(e[1])),e=r(e[0])||0,t=+t||0,this.transform(this._.transform.concat([["t",e,t]])),this)},C.transform=function(n){var r=this._;if(n==null)return r.transform;e._extractTransform(this,n),this.clip&&m(this.clip,{transform:this.matrix.invert()}),this.pattern&&y(this),this.node&&m(this.node,{transform:this.matrix});if(r.sx!=1||r.sy!=1){var i=this.attrs[t]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":i})}return this},C.hide=function(){return!this.removed&&this.paper.safari(this.node.style.display="none"),this},C.show=function(){return!this.removed&&this.paper.safari(this.node.style.display=""),this},C.remove=function(){if(!this.removed&&!!this.node.parentNode){var t=this.paper;t.__set__&&t.__set__.exclude(this),l.unbind("raphael.*.*."+this.id),this.gradient&&t.defs.removeChild(this.gradient),e._tear(this,t),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var n in this)this[n]=typeof this[n]=="function"?e._removedFactory(n):null;this.removed=!0}},C._getBBox=function(){if(this.node.style.display=="none"){this.show();var e=!0}var t={};try{t=this.node.getBBox()}catch(n){}finally{t=t||{}}return e&&this.hide(),t},C.attr=function(n,r){if(this.removed)return this;if(n==null){var i={};for(var s in this.attrs)this.attrs[t](s)&&(i[s]=this.attrs[s]);return i.gradient&&i.fill=="none"&&(i.fill=i.gradient)&&delete i.gradient,i.transform=this._.transform,i}if(r==null&&e.is(n,"string")){if(n=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(n=="transform")return this._.transform;var o=n.split(f),u={};for(var a=0,c=o.length;a<c;a++)n=o[a],n in this.attrs?u[n]=this.attrs[n]:e.is(this.paper.customAttributes[n],"function")?u[n]=this.paper.customAttributes[n].def:u[n]=e._availableAttrs[n];return c-1?u:u[o[0]]}if(r==null&&e.is(n,"array")){u={};for(a=0,c=n.length;a<c;a++)u[n[a]]=this.attr(n[a]);return u}if(r!=null){var h={};h[n]=r}else n!=null&&e.is(n,"object")&&(h=n);for(var p in h)l("raphael.attr."+p+"."+this.id,this,h[p]);for(p in this.paper.customAttributes)if(this.paper.customAttributes[t](p)&&h[t](p)&&e.is(this.paper.customAttributes[p],"function")){var d=this.paper.customAttributes[p].apply(this,[].concat(h[p]));this.attrs[p]=h[p];for(var v in d)d[t](v)&&(h[v]=d[v])}return S(this,h),this},C.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var t=this.paper;return t.top!=this&&e._tofront(this,t),this},C.toBack=function(){if(this.removed)return this;var t=this.node.parentNode;t.tagName.toLowerCase()=="a"?t.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):t.firstChild!=this.node&&t.insertBefore(this.node,this.node.parentNode.firstChild),e._toback(this,this.paper);var n=this.paper;return this},C.insertAfter=function(t){if(this.removed)return this;var n=t.node||t[t.length-1].node;return n.nextSibling?n.parentNode.insertBefore(this.node,n.nextSibling):n.parentNode.appendChild(this.node),e._insertafter(this,t,this.paper),this},C.insertBefore=function(t){if(this.removed)return this;var n=t.node||t[0].node;return n.parentNode.insertBefore(this.node,n),e._insertbefore(this,t,this.paper),this},C.blur=function(t){var n=this;if(+t!==0){var r=m("filter"),i=m("feGaussianBlur");n.attrs.blur=t,r.id=e.createUUID(),m(i,{stdDeviation:+t||1.5}),r.appendChild(i),n.paper.defs.appendChild(r),n._blur=r,m(n.node,{filter:"url(#"+r.id+")"})}else n._blur&&(n._blur.parentNode.removeChild(n._blur),delete n._blur,delete n.attrs.blur),n.node.removeAttribute("filter")},e._engine.circle=function(e,t,n,r){var i=m("circle");e.canvas&&e.canvas.appendChild(i);var s=new N(i,e);return s.attrs={cx:t,cy:n,r:r,fill:"none",stroke:"#000"},s.type="circle",m(i,s.attrs),s},e._engine.rect=function(e,t,n,r,i,s){var o=m("rect");e.canvas&&e.canvas.appendChild(o);var u=new N(o,e);return u.attrs={x:t,y:n,width:r,height:i,r:s||0,rx:s||0,ry:s||0,fill:"none",stroke:"#000"},u.type="rect",m(o,u.attrs),u},e._engine.ellipse=function(e,t,n,r,i){var s=m("ellipse");e.canvas&&e.canvas.appendChild(s);var o=new N(s,e);return o.attrs={cx:t,cy:n,rx:r,ry:i,fill:"none",stroke:"#000"},o.type="ellipse",m(s,o.attrs),o},e._engine.image=function(e,t,n,r,i,s){var o=m("image");m(o,{x:n,y:r,width:i,height:s,preserveAspectRatio:"none"}),o.setAttributeNS(p,"href",t),e.canvas&&e.canvas.appendChild(o);var u=new N(o,e);return u.attrs={x:n,y:r,width:i,height:s,src:t},u.type="image",u},e._engine.text=function(t,n,r,i){var s=m("text");t.canvas&&t.canvas.appendChild(s);var o=new N(s,t);return o.attrs={x:n,y:r,"text-anchor":"middle",text:i,font:e._availableAttrs.font,stroke:"none",fill:"#000"},o.type="text",S(o,o.attrs),o},e._engine.setSize=function(e,t){return this.width=e||this.width,this.height=t||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},e._engine.create=function(){var t=e._getContainer.apply(0,arguments),n=t&&t.container,r=t.x,i=t.y,s=t.width,o=t.height;if(!n)throw new Error("SVG container not found.");var u=m("svg"),a="overflow:hidden;",f;return r=r||0,i=i||0,s=s||512,o=o||342,m(u,{height:o,version:1.1,width:s,xmlns:"http://www.w3.org/2000/svg"}),n==1?(u.style.cssText=a+"position:absolute;left:"+r+"px;top:"+i+"px",e._g.doc.body.appendChild(u),f=1):(u.style.cssText=a+"position:relative",n.firstChild?n.insertBefore(u,n.firstChild):n.appendChild(u)),n=new e._Paper,n.width=s,n.height=o,n.canvas=u,n.clear(),n._left=n._top=0,f&&(n.renderfix=function(){}),n.renderfix(),n},e._engine.setViewBox=function(e,t,n,r,i){l("raphael.setViewBox",this,this._viewBox,[e,t,n,r,i]);var s=o(n/this.width,r/this.height),u=this.top,a=i?"meet":"xMinYMin",f,c;e==null?(this._vbSize&&(s=1),delete this._vbSize,f="0 0 "+this.width+h+this.height):(this._vbSize=s,f=e+h+t+h+n+h+r),m(this.canvas,{viewBox:f,preserveAspectRatio:a});while(s&&u)c="stroke-width"in u.attrs?u.attrs["stroke-width"]:1,u.attr({"stroke-width":c}),u._.dirty=1,u._.dirtyT=1,u=u.prev;return this._viewBox=[e,t,n,r,!!i],this},e.prototype.renderfix=function(){var e=this.canvas,t=e.style,n;try{n=e.getScreenCTM()||e.createSVGMatrix()}catch(r){n=e.createSVGMatrix()}var i=-n.e%1,s=-n.f%1;if(i||s)i&&(this._left=(this._left+i)%1,t.left=this._left+"px"),s&&(this._top=(this._top+s)%1,t.top=this._top+"px")},e.prototype.clear=function(){e.eve("raphael.clear",this);var t=this.canvas;while(t.firstChild)t.removeChild(t.firstChild);this.bottom=this.top=null,(this.desc=m("desc")).appendChild(e._g.doc.createTextNode("Created with RaphaÃ«l "+e.version)),t.appendChild(this.desc),t.appendChild(this.defs=m("defs"))},e.prototype.remove=function(){l("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var t in this)this[t]=typeof this[t]=="function"?e._removedFactory(t):null};var k=e.st;for(var L in C)C[t](L)&&!k[t](L)&&(k[L]=function(e){return function(){var t=arguments;return this.forEach(function(n){n[e].apply(n,t)})}}(L))}(window.Raphael),window.Raphael.vml&&function(e){var t="hasOwnProperty",n=String,r=parseFloat,i=Math,s=i.round,o=i.max,u=i.min,a=i.abs,f="fill",l=/[, ]+/,c=e.eve,h=" progid:DXImageTransform.Microsoft",p=" ",d="",v={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},m=/([clmz]),?([^clmz]*)/gi,g=/ progid:\S+Blur\([^\)]+\)/g,y=/-?[^,\s-]+/g,b="position:absolute;left:0;top:0;width:1px;height:1px",w=21600,E={path:1,rect:1,image:1},S={circle:1,ellipse:1},x=function(t){var r=/[ahqstv]/ig,i=e._pathToAbsolute;n(t).match(r)&&(i=e._path2curve),r=/[clmz]/g;if(i==e._pathToAbsolute&&!n(t).match(r)){var o=n(t).replace(m,function(e,t,n){var r=[],i=t.toLowerCase()=="m",o=v[t];return n.replace(y,function(e){i&&r.length==2&&(o+=r+v[t=="m"?"l":"L"],r=[]),r.push(s(e*w))}),o+r});return o}var u=i(t),a,f;o=[];for(var l=0,c=u.length;l<c;l++){a=u[l],f=u[l][0].toLowerCase(),f=="z"&&(f="x");for(var h=1,g=a.length;h<g;h++)f+=s(a[h]*w)+(h!=g-1?",":d);o.push(f)}return o.join(p)},T=function(t,n,r){var i=e.matrix();return i.rotate(-t,.5,.5),{dx:i.x(n,r),dy:i.y(n,r)}},N=function(e,t,n,r,i,s){var o=e._,u=e.matrix,l=o.fillpos,c=e.node,h=c.style,d=1,v="",m,g=w/t,y=w/n;h.visibility="hidden";if(!!t&&!!n){c.coordsize=a(g)+p+a(y),h.rotation=s*(t*n<0?-1:1);if(s){var b=T(s,r,i);r=b.dx,i=b.dy}t<0&&(v+="x"),n<0&&(v+=" y")&&(d=-1),h.flip=v,c.coordorigin=r*-g+p+i*-y;if(l||o.fillsize){var E=c.getElementsByTagName(f);E=E&&E[0],c.removeChild(E),l&&(b=T(s,u.x(l[0],l[1]),u.y(l[0],l[1])),E.position=b.dx*d+p+b.dy*d),o.fillsize&&(E.size=o.fillsize[0]*a(t)+p+o.fillsize[1]*a(n)),c.appendChild(E)}h.visibility="visible"}};e.toString=function(){return"Your browser doesnâ€™t support SVG. Falling down to VML.\nYou are running RaphaÃ«l "+this.version};var C=function(e,t,r){var i=n(t).toLowerCase().split("-"),s=r?"end":"start",o=i.length,u="classic",a="medium",f="medium";while(o--)switch(i[o]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":u=i[o];break;case"wide":case"narrow":f=i[o];break;case"long":case"short":a=i[o]}var l=e.node.getElementsByTagName("stroke")[0];l[s+"arrow"]=u,l[s+"arrowlength"]=a,l[s+"arrowwidth"]=f},k=function(i,a){i.attrs=i.attrs||{};var c=i.node,h=i.attrs,v=c.style,m,g=E[i.type]&&(a.x!=h.x||a.y!=h.y||a.width!=h.width||a.height!=h.height||a.cx!=h.cx||a.cy!=h.cy||a.rx!=h.rx||a.ry!=h.ry||a.r!=h.r),y=S[i.type]&&(h.cx!=a.cx||h.cy!=a.cy||h.r!=a.r||h.rx!=a.rx||h.ry!=a.ry),b=i;for(var T in a)a[t](T)&&(h[T]=a[T]);g&&(h.path=e._getPath[i.type](i),i._.dirty=1),a.href&&(c.href=a.href),a.title&&(c.title=a.title),a.target&&(c.target=a.target),a.cursor&&(v.cursor=a.cursor),"blur"in a&&i.blur(a.blur);if(a.path&&i.type=="path"||g)c.path=x(~n(h.path).toLowerCase().indexOf("r")?e._pathToAbsolute(h.path):h.path),i.type=="image"&&(i._.fillpos=[h.x,h.y],i._.fillsize=[h.width,h.height],N(i,1,1,0,0,0));"transform"in a&&i.transform(a.transform);if(y){var k=+h.cx,A=+h.cy,O=+h.rx||+h.r||0,_=+h.ry||+h.r||0;c.path=e.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",s((k-O)*w),s((A-_)*w),s((k+O)*w),s((A+_)*w),s(k*w))}if("clip-rect"in a){var D=n(a["clip-rect"]).split(l);if(D.length==4){D[2]=+D[2]+ +D[0],D[3]=+D[3]+ +D[1];var P=c.clipRect||e._g.doc.createElement("div"),H=P.style;H.clip=e.format("rect({1}px {2}px {3}px {0}px)",D),c.clipRect||(H.position="absolute",H.top=0,H.left=0,H.width=i.paper.width+"px",H.height=i.paper.height+"px",c.parentNode.insertBefore(P,c),P.appendChild(c),c.clipRect=P)}a["clip-rect"]||c.clipRect&&(c.clipRect.style.clip="auto")}if(i.textpath){var B=i.textpath.style;a.font&&(B.font=a.font),a["font-family"]&&(B.fontFamily='"'+a["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,d)+'"'),a["font-size"]&&(B.fontSize=a["font-size"]),a["font-weight"]&&(B.fontWeight=a["font-weight"]),a["font-style"]&&(B.fontStyle=a["font-style"])}"arrow-start"in a&&C(b,a["arrow-start"]),"arrow-end"in a&&C(b,a["arrow-end"],1);if(a.opacity!=null||a["stroke-width"]!=null||a.fill!=null||a.src!=null||a.stroke!=null||a["stroke-width"]!=null||a["stroke-opacity"]!=null||a["fill-opacity"]!=null||a["stroke-dasharray"]!=null||a["stroke-miterlimit"]!=null||a["stroke-linejoin"]!=null||a["stroke-linecap"]!=null){var I=c.getElementsByTagName(f),q=!1;I=I&&I[0],!I&&(q=I=M(f)),i.type=="image"&&a.src&&(I.src=a.src),a.fill&&(I.on=!0);if(I.on==null||a.fill=="none"||a.fill===null)I.on=!1;if(I.on&&a.fill){var R=n(a.fill).match(e._ISURL);if(R){I.parentNode==c&&c.removeChild(I),I.rotate=!0,I.src=R[1],I.type="tile";var U=i.getBBox(1);I.position=U.x+p+U.y,i._.fillpos=[U.x,U.y],e._preload(R[1],function(){i._.fillsize=[this.offsetWidth,this.offsetHeight]})}else I.color=e.getRGB(a.fill).hex,I.src=d,I.type="solid",e.getRGB(a.fill).error&&(b.type in{circle:1,ellipse:1}||n(a.fill).charAt()!="r")&&L(b,a.fill,I)&&(h.fill="none",h.gradient=a.fill,I.rotate=!1)}if("fill-opacity"in a||"opacity"in a){var W=((+h["fill-opacity"]+1||2)-1)*((+h.opacity+1||2)-1)*((+e.getRGB(a.fill).o+1||2)-1);W=u(o(W,0),1),I.opacity=W,I.src&&(I.color="none")}c.appendChild(I);var X=c.getElementsByTagName("stroke")&&c.getElementsByTagName("stroke")[0],V=!1;!X&&(V=X=M("stroke"));if(a.stroke&&a.stroke!="none"||a["stroke-width"]||a["stroke-opacity"]!=null||a["stroke-dasharray"]||a["stroke-miterlimit"]||a["stroke-linejoin"]||a["stroke-linecap"])X.on=!0;(a.stroke=="none"||a.stroke===null||X.on==null||a.stroke==0||a["stroke-width"]==0)&&(X.on=!1);var $=e.getRGB(a.stroke);X.on&&a.stroke&&(X.color=$.hex),W=((+h["stroke-opacity"]+1||2)-1)*((+h.opacity+1||2)-1)*((+$.o+1||2)-1);var J=(r(a["stroke-width"])||1)*.75;W=u(o(W,0),1),a["stroke-width"]==null&&(J=h["stroke-width"]),a["stroke-width"]&&(X.weight=J),J&&J<1&&(W*=J)&&(X.weight=1),X.opacity=W,a["stroke-linejoin"]&&(X.joinstyle=a["stroke-linejoin"]||"miter"),X.miterlimit=a["stroke-miterlimit"]||8,a["stroke-linecap"]&&(X.endcap=a["stroke-linecap"]=="butt"?"flat":a["stroke-linecap"]=="square"?"square":"round");if(a["stroke-dasharray"]){var K={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};X.dashstyle=K[t](a["stroke-dasharray"])?K[a["stroke-dasharray"]]:d}V&&c.appendChild(X)}if(b.type=="text"){b.paper.canvas.style.display=d;var Q=b.paper.span,G=100,Y=h.font&&h.font.match(/\d+(?:\.\d*)?(?=px)/);v=Q.style,h.font&&(v.font=h.font),h["font-family"]&&(v.fontFamily=h["font-family"]),h["font-weight"]&&(v.fontWeight=h["font-weight"]),h["font-style"]&&(v.fontStyle=h["font-style"]),Y=r(h["font-size"]||Y&&Y[0])||10,v.fontSize=Y*G+"px",b.textpath.string&&(Q.innerHTML=n(b.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var Z=Q.getBoundingClientRect();b.W=h.w=(Z.right-Z.left)/G,b.H=h.h=(Z.bottom-Z.top)/G,b.X=h.x,b.Y=h.y+b.H/2,("x"in a||"y"in a)&&(b.path.v=e.format("m{0},{1}l{2},{1}",s(h.x*w),s(h.y*w),s(h.x*w)+1));var et=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var tt=0,nt=et.length;tt<nt;tt++)if(et[tt]in a){b._.dirty=1;break}switch(h["text-anchor"]){case"start":b.textpath.style["v-text-align"]="left",b.bbx=b.W/2;break;case"end":b.textpath.style["v-text-align"]="right",b.bbx=-b.W/2;break;default:b.textpath.style["v-text-align"]="center",b.bbx=0}b.textpath.style["v-text-kern"]=!0}},L=function(t,s,o){t.attrs=t.attrs||{};var u=t.attrs,a=Math.pow,f,l,c="linear",h=".5 .5";t.attrs.gradient=s,s=n(s).replace(e._radial_gradient,function(e,t,n){return c="radial",t&&n&&(t=r(t),n=r(n),a(t-.5,2)+a(n-.5,2)>.25&&(n=i.sqrt(.25-a(t-.5,2))*((n>.5)*2-1)+.5),h=t+p+n),d}),s=s.split(/\s*\-\s*/);if(c=="linear"){var v=s.shift();v=-r(v);if(isNaN(v))return null}var m=e._parseDots(s);if(!m)return null;t=t.shape||t.node;if(m.length){t.removeChild(o),o.on=!0,o.method="none",o.color=m[0].color,o.color2=m[m.length-1].color;var g=[];for(var y=0,b=m.length;y<b;y++)m[y].offset&&g.push(m[y].offset+p+m[y].color);o.colors=g.length?g.join():"0% "+o.color,c=="radial"?(o.type="gradientTitle",o.focus="100%",o.focussize="0 0",o.focusposition=h,o.angle=0):(o.type="gradient",o.angle=(270-v)%360),t.appendChild(o)}return 1},A=function(t,n){this[0]=this.node=t,t.raphael=!0,this.id=e._oid++,t.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=n,this.matrix=e.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!n.bottom&&(n.bottom=this),this.prev=n.top,n.top&&(n.top.next=this),n.top=this,this.next=null},O=e.el;A.prototype=O,O.constructor=A,O.transform=function(t){if(t==null)return this._.transform;var r=this.paper._viewBoxShift,i=r?"s"+[r.scale,r.scale]+"-1-1t"+[r.dx,r.dy]:d,s;r&&(s=t=n(t).replace(/\.{3}|\u2026/g,this._.transform||d)),e._extractTransform(this,i+t);var o=this.matrix.clone(),u=this.skew,a=this.node,f,l=~n(this.attrs.fill).indexOf("-"),c=!n(this.attrs.fill).indexOf("url(");o.translate(-0.5,-0.5);if(c||l||this.type=="image"){u.matrix="1 0 0 1",u.offset="0 0",f=o.split();if(l&&f.noRotation||!f.isSimple){a.style.filter=o.toFilter();var h=this.getBBox(),v=this.getBBox(1),m=h.x-v.x,g=h.y-v.y;a.coordorigin=m*-w+p+g*-w,N(this,1,1,m,g,0)}else a.style.filter=d,N(this,f.scalex,f.scaley,f.dx,f.dy,f.rotate)}else a.style.filter=d,u.matrix=n(o),u.offset=o.offset();return s&&(this._.transform=s),this},O.rotate=function(e,t,i){if(this.removed)return this;if(e!=null){e=n(e).split(l),e.length-1&&(t=r(e[1]),i=r(e[2])),e=r(e[0]),i==null&&(t=i);if(t==null||i==null){var s=this.getBBox(1);t=s.x+s.width/2,i=s.y+s.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",e,t,i]])),this}},O.translate=function(e,t){return this.removed?this:(e=n(e).split(l),e.length-1&&(t=r(e[1])),e=r(e[0])||0,t=+t||0,this._.bbox&&(this._.bbox.x+=e,this._.bbox.y+=t),this.transform(this._.transform.concat([["t",e,t]])),this)},O.scale=function(e,t,i,s){if(this.removed)return this;e=n(e).split(l),e.length-1&&(t=r(e[1]),i=r(e[2]),s=r(e[3]),isNaN(i)&&(i=null),isNaN(s)&&(s=null)),e=r(e[0]),t==null&&(t=e),s==null&&(i=s);if(i==null||s==null)var o=this.getBBox(1);return i=i==null?o.x+o.width/2:i,s=s==null?o.y+o.height/2:s,this.transform(this._.transform.concat([["s",e,t,i,s]])),this._.dirtyT=1,this},O.hide=function(){return!this.removed&&(this.node.style.display="none"),this},O.show=function(){return!this.removed&&(this.node.style.display=d),this},O._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},O.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),e.eve.unbind("raphael.*.*."+this.id),e._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var t in this)this[t]=typeof this[t]=="function"?e._removedFactory(t):null;this.removed=!0}},O.attr=function(n,r){if(this.removed)return this;if(n==null){var i={};for(var s in this.attrs)this.attrs[t](s)&&(i[s]=this.attrs[s]);return i.gradient&&i.fill=="none"&&(i.fill=i.gradient)&&delete i.gradient,i.transform=this._.transform,i}if(r==null&&e.is(n,"string")){if(n==f&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var o=n.split(l),u={};for(var a=0,h=o.length;a<h;a++)n=o[a],n in this.attrs?u[n]=this.attrs[n]:e.is(this.paper.customAttributes[n],"function")?u[n]=this.paper.customAttributes[n].def:u[n]=e._availableAttrs[n];return h-1?u:u[o[0]]}if(this.attrs&&r==null&&e.is(n,"array")){u={};for(a=0,h=n.length;a<h;a++)u[n[a]]=this.attr(n[a]);return u}var p;r!=null&&(p={},p[n]=r),r==null&&e.is(n,"object")&&(p=n);for(var d in p)c("raphael.attr."+d+"."+this.id,this,p[d]);if(p){for(d in this.paper.customAttributes)if(this.paper.customAttributes[t](d)&&p[t](d)&&e.is(this.paper.customAttributes[d],"function")){var v=this.paper.customAttributes[d].apply(this,[].concat(p[d]));this.attrs[d]=p[d];for(var m in v)v[t](m)&&(p[m]=v[m])}p.text&&this.type=="text"&&(this.textpath.string=p.text),k(this,p)}return this},O.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&e._tofront(this,this.paper),this},O.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),e._toback(this,this.paper)),this)},O.insertAfter=function(t){return this.removed?this:(t.constructor==e.st.constructor&&(t=t[t.length-1]),t.node.nextSibling?t.node.parentNode.insertBefore(this.node,t.node.nextSibling):t.node.parentNode.appendChild(this.node),e._insertafter(this,t,this.paper),this)},O.insertBefore=function(t){return this.removed?this:(t.constructor==e.st.constructor&&(t=t[0]),t.node.parentNode.insertBefore(this.node,t.node),e._insertbefore(this,t,this.paper),this)},O.blur=function(t){var n=this.node.runtimeStyle,r=n.filter;r=r.replace(g,d),+t!==0?(this.attrs.blur=t,n.filter=r+p+h+".Blur(pixelradius="+(+t||1.5)+")",n.margin=e.format("-{0}px 0 0 -{0}px",s(+t||1.5))):(n.filter=r,n.margin=0,delete this.attrs.blur)},e._engine.path=function(e,t){var n=M("shape");n.style.cssText=b,n.coordsize=w+p+w,n.coordorigin=t.coordorigin;var r=new A(n,t),i={fill:"none",stroke:"#000"};e&&(i.path=e),r.type="path",r.path=[],r.Path=d,k(r,i),t.canvas.appendChild(n);var s=M("skew");return s.on=!0,n.appendChild(s),r.skew=s,r.transform(d),r},e._engine.rect=function(t,n,r,i,s,o){var u=e._rectPath(n,r,i,s,o),a=t.path(u),f=a.attrs;return a.X=f.x=n,a.Y=f.y=r,a.W=f.width=i,a.H=f.height=s,f.r=o,f.path=u,a.type="rect",a},e._engine.ellipse=function(e,t,n,r,i){var s=e.path(),o=s.attrs;return s.X=t-r,s.Y=n-i,s.W=r*2,s.H=i*2,s.type="ellipse",k(s,{cx:t,cy:n,rx:r,ry:i}),s},e._engine.circle=function(e,t,n,r){var i=e.path(),s=i.attrs;return i.X=t-r,i.Y=n-r,i.W=i.H=r*2,i.type="circle",k(i,{cx:t,cy:n,r:r}),i},e._engine.image=function(t,n,r,i,s,o){var u=e._rectPath(r,i,s,o),a=t.path(u).attr({stroke:"none"}),l=a.attrs,c=a.node,h=c.getElementsByTagName(f)[0];return l.src=n,a.X=l.x=r,a.Y=l.y=i,a.W=l.width=s,a.H=l.height=o,l.path=u,a.type="image",h.parentNode==c&&c.removeChild(h),h.rotate=!0,h.src=n,h.type="tile",a._.fillpos=[r,i],a._.fillsize=[s,o],c.appendChild(h),N(a,1,1,0,0,0),a},e._engine.text=function(t,r,i,o){var u=M("shape"),a=M("path"),f=M("textpath");r=r||0,i=i||0,o=o||"",a.v=e.format("m{0},{1}l{2},{1}",s(r*w),s(i*w),s(r*w)+1),a.textpathok=!0,f.string=n(o),f.on=!0,u.style.cssText=b,u.coordsize=w+p+w,u.coordorigin="0 0";var l=new A(u,t),c={fill:"#000",stroke:"none",font:e._availableAttrs.font,text:o};l.shape=u,l.path=a,l.textpath=f,l.type="text",l.attrs.text=n(o),l.attrs.x=r,l.attrs.y=i,l.attrs.w=1,l.attrs.h=1,k(l,c),u.appendChild(f),u.appendChild(a),t.canvas.appendChild(u);var h=M("skew");return h.on=!0,u.appendChild(h),l.skew=h,l.transform(d),l},e._engine.setSize=function(t,n){var r=this.canvas.style;return this.width=t,this.height=n,t==+t&&(t+="px"),n==+n&&(n+="px"),r.width=t,r.height=n,r.clip="rect(0 "+t+" "+n+" 0)",this._viewBox&&e._engine.setViewBox.apply(this,this._viewBox),this},e._engine.setViewBox=function(t,n,r,i,s){e.eve("raphael.setViewBox",this,this._viewBox,[t,n,r,i,s]);var u=this.width,a=this.height,f=1/o(r/u,i/a),l,c;return s&&(l=a/i,c=u/r,r*l<u&&(t-=(u-r*l)/2/l),i*c<a&&(n-=(a-i*c)/2/c)),this._viewBox=[t,n,r,i,!!s],this._viewBoxShift={dx:-t,dy:-n,scale:f},this.forEach(function(e){e.transform("...")}),this};var M;e._engine.initWin=function(e){var t=e.document;t.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!t.namespaces.rvml&&t.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),M=function(e){return t.createElement("<rvml:"+e+' class="rvml">')}}catch(n){M=function(e){return t.createElement("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},e._engine.initWin(e._g.win),e._engine.create=function(){var t=e._getContainer.apply(0,arguments),n=t.container,r=t.height,i,s=t.width,o=t.x,u=t.y;if(!n)throw new Error("VML container not found.");var a=new e._Paper,f=a.canvas=e._g.doc.createElement("div"),l=f.style;return o=o||0,u=u||0,s=s||512,r=r||342,a.width=s,a.height=r,s==+s&&(s+="px"),r==+r&&(r+="px"),a.coordsize=w*1e3+p+w*1e3,a.coordorigin="0 0",a.span=e._g.doc.createElement("span"),a.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",f.appendChild(a.span),l.cssText=e.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",s,r),n==1?(e._g.doc.body.appendChild(f),l.left=o+"px",l.top=u+"px",l.position="absolute"):n.firstChild?n.insertBefore(f,n.firstChild):n.appendChild(f),a.renderfix=function(){},a},e.prototype.clear=function(){e.eve("raphael.clear",this),this.canvas.innerHTML=d,this.span=e._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},e.prototype.remove=function(){e.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var t in this)this[t]=typeof this[t]=="function"?e._removedFactory(t):null;return!0};var _=e.st;for(var D in O)O[t](D)&&!_[t](D)&&(_[D]=function(e){return function(){var t=arguments;return this.forEach(function(n){n[e].apply(n,t)})}}(D))}(window.Raphael);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
/*
Copyright 2012 Igor Vaynberg

Version: 3.4.0 Timestamp: Tue May 14 08:27:33 PDT 2013

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

http://www.apache.org/licenses/LICENSE-2.0
http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the Apache License
or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the Apache License and the GPL License for the specific language governing
permissions and limitations under the Apache License and the GPL License.
*/


(function(e){e.fn.each2===void 0&&e.fn.extend({each2:function(t){for(var n=e([0]),r=-1,i=this.length;i>++r&&(n.context=n[0]=this[r])&&t.call(n[0],r,n)!==!1;);return this}})})(jQuery),function(e,t){function n(e,t){for(var n=0,r=t.length;r>n;n+=1)if(i(e,t[n]))return n;return-1}function r(){var t=e(B);t.appendTo("body");var n={width:t.width()-t[0].clientWidth,height:t.height()-t[0].clientHeight};return t.remove(),n}function i(e,n){return e===n?!0:e===t||n===t?!1:null===e||null===n?!1:e.constructor===String?e+""==n+"":n.constructor===String?n+""==e+"":!1}function s(t,n){var r,i,s;if(null===t||1>t.length)return[];for(r=t.split(n),i=0,s=r.length;s>i;i+=1)r[i]=e.trim(r[i]);return r}function o(e){return e.outerWidth(!1)-e.width()}function u(n){var r="keyup-change-value";n.on("keydown",function(){e.data(n,r)===t&&e.data(n,r,n.val())}),n.on("keyup",function(){var i=e.data(n,r);i!==t&&n.val()!==i&&(e.removeData(n,r),n.trigger("keyup-change"))})}function a(n){n.on("mousemove",function(n){var r=D;(r===t||r.x!==n.pageX||r.y!==n.pageY)&&e(n.target).trigger("mousemove-filtered",n)})}function f(e,n,r){r=r||t;var i;return function(){var t=arguments;window.clearTimeout(i),i=window.setTimeout(function(){n.apply(r,t)},e)}}function l(e){var t,n=!1;return function(){return n===!1&&(t=e(),n=!0),t}}function c(e,t){var r=f(e,function(e){t.trigger("scroll-debounced",e)});t.on("scroll",function(e){n(e.target,t.get())>=0&&r(e)})}function h(e){e[0]!==document.activeElement&&window.setTimeout(function(){var t,n=e[0],r=e.val().length;e.focus(),e.is(":visible")&&n===document.activeElement&&(n.setSelectionRange?n.setSelectionRange(r,r):n.createTextRange&&(t=n.createTextRange(),t.collapse(!1),t.select()))},0)}function p(t){t=e(t)[0];var n=0,r=0;if("selectionStart"in t)n=t.selectionStart,r=t.selectionEnd-n;else if("selection"in document){t.focus();var i=document.selection.createRange();r=document.selection.createRange().text.length,i.moveStart("character",-t.value.length),n=i.text.length-r}return{offset:n,length:r}}function d(e){e.preventDefault(),e.stopPropagation()}function v(e){e.preventDefault(),e.stopImmediatePropagation()}function m(t){if(!_){var n=t[0].currentStyle||window.getComputedStyle(t[0],null);_=e(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:n.fontSize,fontFamily:n.fontFamily,fontStyle:n.fontStyle,fontWeight:n.fontWeight,letterSpacing:n.letterSpacing,textTransform:n.textTransform,whiteSpace:"nowrap"}),_.attr("class","select2-sizer"),e("body").append(_)}return _.text(t.val()),_.width()}function g(t,n,r){var i,s,o=[];i=t.attr("class"),i&&(i=""+i,e(i.split(" ")).each2(function(){0===this.indexOf("select2-")&&o.push(this)})),i=n.attr("class"),i&&(i=""+i,e(i.split(" ")).each2(function(){0!==this.indexOf("select2-")&&(s=r(this),s&&o.push(this))})),t.attr("class",o.join(" "))}function y(e,n,r,i){var s=e.toUpperCase().indexOf(n.toUpperCase()),o=n.length;return 0>s?(r.push(i(e)),t):(r.push(i(e.substring(0,s))),r.push("<span class='select2-match'>"),r.push(i(e.substring(s,s+o))),r.push("</span>"),r.push(i(e.substring(s+o,e.length))),t)}function b(n){var r,i=0,s=null,o=n.quietMillis||100,u=n.url,a=this;return function(f){window.clearTimeout(r),r=window.setTimeout(function(){i+=1;var r=i,o=n.data,l=u,c=n.transport||e.fn.select2.ajaxDefaults.transport,h={type:n.type||"GET",cache:n.cache||!1,jsonpCallback:n.jsonpCallback||t,dataType:n.dataType||"json"},p=e.extend({},e.fn.select2.ajaxDefaults.params,h);o=o?o.call(a,f.term,f.page,f.context):null,l="function"==typeof l?l.call(a,f.term,f.page,f.context):l,null!==s&&s.abort(),n.params&&(e.isFunction(n.params)?e.extend(p,n.params.call(a)):e.extend(p,n.params)),e.extend(p,{url:l,dataType:n.dataType,data:o,success:function(e){if(!(i>r)){var t=n.results(e,f.page);f.callback(t)}}}),s=c.call(a,p)},o)}}function w(n){var r,i,s=n,o=function(e){return""+e.text};e.isArray(s)&&(i=s,s={results:i}),e.isFunction(s)===!1&&(i=s,s=function(){return i});var u=s();return u.text&&(o=u.text,e.isFunction(o)||(r=u.text,o=function(e){return e[r]})),function(n){var r,i=n.term,u={results:[]};return""===i?(n.callback(s()),t):(r=function(t,s){var u,a;if(t=t[0],t.children){u={};for(a in t)t.hasOwnProperty(a)&&(u[a]=t[a]);u.children=[],e(t.children).each2(function(e,t){r(t,u.children)}),(u.children.length||n.matcher(i,o(u),t))&&s.push(u)}else n.matcher(i,o(t),t)&&s.push(t)},e(s().results).each2(function(e,t){r(t,u.results)}),n.callback(u),t)}}function E(n){var r=e.isFunction(n);return function(i){var s=i.term,o={results:[]};e(r?n():n).each(function(){var e=this.text!==t,n=e?this.text:this;(""===s||i.matcher(s,n))&&o.results.push(e?this:{id:this,text:this})}),i.callback(o)}}function S(t){if(e.isFunction(t))return!0;if(!t)return!1;throw Error("formatterName must be a function or a falsy value")}function x(t){return e.isFunction(t)?t():t}function T(t){var n=0;return e.each(t,function(e,t){t.children?n+=T(t.children):n++}),n}function N(e,n,r,s){var o,u,a,f,l,c=e,h=!1;if(!s.createSearchChoice||!s.tokenSeparators||1>s.tokenSeparators.length)return t;for(;;){for(u=-1,a=0,f=s.tokenSeparators.length;f>a&&(l=s.tokenSeparators[a],u=e.indexOf(l),!(u>=0));a++);if(0>u)break;if(o=e.substring(0,u),e=e.substring(u+l.length),o.length>0&&(o=s.createSearchChoice(o,n),o!==t&&null!==o&&s.id(o)!==t&&null!==s.id(o))){for(h=!1,a=0,f=n.length;f>a;a++)if(i(s.id(o),s.id(n[a]))){h=!0;break}h||r(o)}}return c!==e?e:t}function C(t,n){var r=function(){};return r.prototype=new t,r.prototype.constructor=r,r.prototype.parent=t.prototype,r.prototype=e.extend(r.prototype,n),r}if(window.Select2===t){var k,L,A,O,M,_,D,P,H,k={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(e){switch(e=e.which?e.which:e){case k.LEFT:case k.RIGHT:case k.UP:case k.DOWN:return!0}return!1},isControl:function(e){var t=e.which;switch(t){case k.SHIFT:case k.CTRL:case k.ALT:return!0}return e.metaKey?!0:!1},isFunctionKey:function(e){return e=e.which?e.which:e,e>=112&&123>=e}},B="<div class='select2-measure-scrollbar'></div>";P=e(document),M=function(){var e=1;return function(){return e++}}(),P.on("mousemove",function(e){D={x:e.pageX,y:e.pageY}}),L=C(Object,{bind:function(e){var t=this;return function(){e.apply(t,arguments)}},init:function(n){var i,s,o,f,h=".select2-results";this.opts=n=this.prepareOpts(n),this.id=n.id,n.element.data("select2")!==t&&null!==n.element.data("select2")&&this.destroy(),this.container=this.createContainer(),this.containerId="s2id_"+(n.element.attr("id")||"autogen"+M()),this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1"),this.container.attr("id",this.containerId),this.body=l(function(){return n.element.closest("body")}),g(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.css(x(n.containerCss)),this.container.addClass(x(n.containerCssClass)),this.elementTabIndex=this.opts.element.attr("tabindex"),this.opts.element.data("select2",this).attr("tabindex","-1").before(this.container),this.container.data("select2",this),this.dropdown=this.container.find(".select2-drop"),this.dropdown.addClass(x(n.dropdownCssClass)),this.dropdown.data("select2",this),this.results=i=this.container.find(h),this.search=s=this.container.find("input.select2-input"),this.resultsPage=0,this.context=null,this.initContainer(),a(this.results),this.dropdown.on("mousemove-filtered touchstart touchmove touchend",h,this.bind(this.highlightUnderEvent)),c(80,this.results),this.dropdown.on("scroll-debounced",h,this.bind(this.loadMoreIfNeeded)),e(this.container).on("change",".select2-input",function(e){e.stopPropagation()}),e(this.dropdown).on("change",".select2-input",function(e){e.stopPropagation()}),e.fn.mousewheel&&i.mousewheel(function(e,t,n,r){var s=i.scrollTop();r>0&&0>=s-r?(i.scrollTop(0),d(e)):0>r&&i.get(0).scrollHeight-i.scrollTop()+r<=i.height()&&(i.scrollTop(i.get(0).scrollHeight-i.height()),d(e))}),u(s),s.on("keyup-change input paste",this.bind(this.updateResults)),s.on("focus",function(){s.addClass("select2-focused")}),s.on("blur",function(){s.removeClass("select2-focused")}),this.dropdown.on("mouseup",h,this.bind(function(t){e(t.target).closest(".select2-result-selectable").length>0&&(this.highlightUnderEvent(t),this.selectHighlighted(t))})),this.dropdown.on("click mouseup mousedown",function(e){e.stopPropagation()}),e.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource()),null!==n.maximumInputLength&&this.search.attr("maxlength",n.maximumInputLength);var o=n.element.prop("disabled");o===t&&(o=!1),this.enable(!o);var f=n.element.prop("readonly");f===t&&(f=!1),this.readonly(f),H=H||r(),this.autofocus=n.element.prop("autofocus"),n.element.prop("autofocus",!1),this.autofocus&&this.focus()},destroy:function(){var e=this.opts.element.data("select2");this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),e!==t&&(e.container.remove(),e.dropdown.remove(),e.opts.element.removeClass("select2-offscreen").removeData("select2").off(".select2").attr({tabindex:this.elementTabIndex}).prop("autofocus",this.autofocus||!1).show())},optionToData:function(e){return e.is("option")?{id:e.prop("value"),text:e.text(),element:e.get(),css:e.attr("class"),disabled:e.prop("disabled"),locked:i(e.attr("locked"),"locked")}:e.is("optgroup")?{text:e.attr("label"),children:[],element:e.get(),css:e.attr("class")}:t},prepareOpts:function(n){var r,o,u,a,f=this;if(r=n.element,"select"===r.get(0).tagName.toLowerCase()&&(this.select=o=n.element),o&&e.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in n)throw Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.")}),n=e.extend({},{populateResults:function(r,i,s){var o,u=this.opts.id;o=function(r,i,a){var l,c,h,p,d,v,m,g,y,b;for(r=n.sortResults(r,i,s),l=0,c=r.length;c>l;l+=1)h=r[l],d=h.disabled===!0,p=!d&&u(h)!==t,v=h.children&&h.children.length>0,m=e("<li></li>"),m.addClass("select2-results-dept-"+a),m.addClass("select2-result"),m.addClass(p?"select2-result-selectable":"select2-result-unselectable"),d&&m.addClass("select2-disabled"),v&&m.addClass("select2-result-with-children"),m.addClass(f.opts.formatResultCssClass(h)),g=e(document.createElement("div")),g.addClass("select2-result-label"),b=n.formatResult(h,g,s,f.opts.escapeMarkup),b!==t&&g.html(b),m.append(g),v&&(y=e("<ul></ul>"),y.addClass("select2-result-sub"),o(h.children,y,a+1),m.append(y)),m.data("select2-data",h),i.append(m)},o(i,r,0)}},e.fn.select2.defaults,n),"function"!=typeof n.id&&(u=n.id,n.id=function(e){return e[u]}),e.isArray(n.element.data("select2Tags"))){if("tags"in n)throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+n.element.attr("id");n.tags=n.element.data("select2Tags")}if(o?(n.query=this.bind(function(n){var i,s,o,u={results:[],more:!1},a=n.term;o=function(e,t){var r;e.is("option")?n.matcher(a,e.text(),e)&&t.push(f.optionToData(e)):e.is("optgroup")&&(r=f.optionToData(e),e.children().each2(function(e,t){o(t,r.children)}),r.children.length>0&&t.push(r))},i=r.children(),this.getPlaceholder()!==t&&i.length>0&&(s=i[0],""===e(s).text()&&(i=i.not(s))),i.each2(function(e,t){o(t,u.results)}),n.callback(u)}),n.id=function(e){return e.id},n.formatResultCssClass=function(e){return e.css}):"query"in n||("ajax"in n?(a=n.element.data("ajax-url"),a&&a.length>0&&(n.ajax.url=a),n.query=b.call(n.element,n.ajax)):"data"in n?n.query=w(n.data):"tags"in n&&(n.query=E(n.tags),n.createSearchChoice===t&&(n.createSearchChoice=function(e){return{id:e,text:e}}),n.initSelection===t&&(n.initSelection=function(r,o){var u=[];e(s(r.val(),n.separator)).each(function(){var r=this,s=this,o=n.tags;e.isFunction(o)&&(o=o()),e(o).each(function(){return i(this.id,r)?(s=this.text,!1):t}),u.push({id:r,text:s})}),o(u)}))),"function"!=typeof n.query)throw"query function not defined for Select2 "+n.element.attr("id");return n},monitorSource:function(){var e,n=this.opts.element;n.on("change.select2",this.bind(function(){this.opts.element.data("select2-change-triggered")!==!0&&this.initSelection()})),e=this.bind(function(){var e,r=n.prop("disabled");r===t&&(r=!1),this.enable(!r);var e=n.prop("readonly");e===t&&(e=!1),this.readonly(e),g(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.addClass(x(this.opts.containerCssClass)),g(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(x(this.opts.dropdownCssClass))}),n.on("propertychange.select2 DOMAttrModified.select2",e),this.mutationCallback===t&&(this.mutationCallback=function(t){t.forEach(e)}),"undefined"!=typeof WebKitMutationObserver&&(this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),this.propertyObserver=new WebKitMutationObserver(this.mutationCallback),this.propertyObserver.observe(n.get(0),{attributes:!0,subtree:!1}))},triggerSelect:function(t){var n=e.Event("select2-selecting",{val:this.id(t),object:t});return this.opts.element.trigger(n),!n.isDefaultPrevented()},triggerChange:function(t){t=t||{},t=e.extend({},t,{type:"change",val:this.val()}),this.opts.element.data("select2-change-triggered",!0),this.opts.element.trigger(t),this.opts.element.data("select2-change-triggered",!1),this.opts.element.click(),this.opts.blurOnChange&&this.opts.element.blur()},isInterfaceEnabled:function(){return this.enabledInterface===!0},enableInterface:function(){var e=this._enabled&&!this._readonly,t=!e;return e===this.enabledInterface?!1:(this.container.toggleClass("select2-container-disabled",t),this.close(),this.enabledInterface=e,!0)},enable:function(e){return e===t&&(e=!0),this._enabled===e?!1:(this._enabled=e,this.opts.element.prop("disabled",!e),this.enableInterface(),!0)},readonly:function(e){return e===t&&(e=!1),this._readonly===e?!1:(this._readonly=e,this.opts.element.prop("readonly",e),this.enableInterface(),!0)},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var t,n,r,i,s=this.dropdown,o=this.container.offset(),u=this.container.outerHeight(!1),a=this.container.outerWidth(!1),f=s.outerHeight(!1),l=e(window).scrollLeft()+e(window).width(),c=e(window).scrollTop()+e(window).height(),h=o.top+u,p=o.left,d=c>=h+f,v=o.top-f>=this.body().scrollTop(),m=s.outerWidth(!1),g=l>=p+m,y=s.hasClass("select2-drop-above");this.opts.dropdownAutoWidth?(i=e(".select2-results",s)[0],s.addClass("select2-drop-auto-width"),s.css("width",""),m=s.outerWidth(!1)+(i.scrollHeight===i.clientHeight?0:H.width),m>a?a=m:m=a,g=l>=p+m):this.container.removeClass("select2-drop-auto-width"),"static"!==this.body().css("position")&&(t=this.body().offset(),h-=t.top,p-=t.left),y?(n=!0,!v&&d&&(n=!1)):(n=!1,!d&&v&&(n=!0)),g||(p=o.left+a-m),n?(h=o.top-f,this.container.addClass("select2-drop-above"),s.addClass("select2-drop-above")):(this.container.removeClass("select2-drop-above"),s.removeClass("select2-drop-above")),r=e.extend({top:h,left:p,width:a},x(this.opts.dropdownCss)),s.css(r)},shouldOpen:function(){var t;return this.opened()?!1:this._enabled===!1||this._readonly===!0?!1:(t=e.Event("select2-opening"),this.opts.element.trigger(t),!t.isDefaultPrevented())},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")},open:function(){return this.shouldOpen()?(this.opening(),!0):!1},opening:function(){function t(){return{width:Math.max(document.documentElement.scrollWidth,e(window).width()),height:Math.max(document.documentElement.scrollHeight,e(window).height())}}var n,r=this.containerId,i="scroll."+r,s="resize."+r,o="orientationchange."+r;this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.clearDropdownAlignmentPreference(),this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body()),n=e("#select2-drop-mask"),0==n.length&&(n=e(document.createElement("div")),n.attr("id","select2-drop-mask").attr("class","select2-drop-mask"),n.hide(),n.appendTo(this.body()),n.on("mousedown touchstart",function(t){var n,r=e("#select2-drop");r.length>0&&(n=r.data("select2"),n.opts.selectOnBlur&&n.selectHighlighted({noFocus:!0}),n.close(),t.preventDefault(),t.stopPropagation())})),this.dropdown.prev()[0]!==n[0]&&this.dropdown.before(n),e("#select2-drop").removeAttr("id"),this.dropdown.attr("id","select2-drop"),n.css(t()),n.show(),this.dropdown.show(),this.positionDropdown(),this.dropdown.addClass("select2-drop-active"),this.ensureHighlightVisible();var u=this;this.container.parents().add(window).each(function(){e(this).on(s+" "+i+" "+o,function(){e("#select2-drop-mask").css(t()),u.positionDropdown()})})},close:function(){if(this.opened()){var t=this.containerId,n="scroll."+t,r="resize."+t,i="orientationchange."+t;this.container.parents().add(window).each(function(){e(this).off(n).off(r).off(i)}),this.clearDropdownAlignmentPreference(),e("#select2-drop-mask").hide(),this.dropdown.removeAttr("id"),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open"),this.results.empty(),this.clearSearch(),this.search.removeClass("select2-active"),this.opts.element.trigger(e.Event("select2-close"))}},clearSearch:function(){},getMaximumSelectionSize:function(){return x(this.opts.maximumSelectionSize)},ensureHighlightVisible:function(){var n,r,i,s,o,u,a,f=this.results;if(r=this.highlight(),!(0>r)){if(0==r)return f.scrollTop(0),t;n=this.findHighlightableChoices().find(".select2-result-label"),i=e(n[r]),s=i.offset().top+i.outerHeight(!0),r===n.length-1&&(a=f.find("li.select2-more-results"),a.length>0&&(s=a.offset().top+a.outerHeight(!0))),o=f.offset().top+f.outerHeight(!0),s>o&&f.scrollTop(f.scrollTop()+(s-o)),u=i.offset().top-f.offset().top,0>u&&"none"!=i.css("display")&&f.scrollTop(f.scrollTop()+u)}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-selected):not(.select2-disabled)")},moveHighlight:function(t){for(var n=this.findHighlightableChoices(),r=this.highlight();r>-1&&n.length>r;){r+=t;var i=e(n[r]);if(i.hasClass("select2-result-selectable")&&!i.hasClass("select2-disabled")&&!i.hasClass("select2-selected")){this.highlight(r);break}}},highlight:function(r){var i,s,o=this.findHighlightableChoices();return 0===arguments.length?n(o.filter(".select2-highlighted")[0],o.get()):(r>=o.length&&(r=o.length-1),0>r&&(r=0),this.results.find(".select2-highlighted").removeClass("select2-highlighted"),i=e(o[r]),i.addClass("select2-highlighted"),this.ensureHighlightVisible(),s=i.data("select2-data"),s&&this.opts.element.trigger({type:"select2-highlight",val:this.id(s),choice:s}),t)},countSelectableResults:function(){return this.findHighlightableChoices().length},highlightUnderEvent:function(t){var n=e(t.target).closest(".select2-result-selectable");if(n.length>0&&!n.is(".select2-highlighted")){var r=this.findHighlightableChoices();this.highlight(r.index(n))}else 0==n.length&&this.results.find(".select2-highlighted").removeClass("select2-highlighted")},loadMoreIfNeeded:function(){var e,t=this.results,n=t.find("li.select2-more-results"),r=this.resultsPage+1,i=this,s=this.search.val(),o=this.context;0!==n.length&&(e=n.offset().top-t.offset().top-t.height(),this.opts.loadMorePadding>=e&&(n.addClass("select2-active"),this.opts.query({element:this.opts.element,term:s,page:r,context:o,matcher:this.opts.matcher,callback:this.bind(function(e){i.opened()&&(i.opts.populateResults.call(this,t,e.results,{term:s,page:r,context:o}),i.postprocessResults(e,!1,!1),e.more===!0?(n.detach().appendTo(t).text(i.opts.formatLoadMore(r+1)),window.setTimeout(function(){i.loadMoreIfNeeded()},10)):n.remove(),i.positionDropdown(),i.resultsPage=r,i.context=e.context)})})))},tokenize:function(){},updateResults:function(n){function r(){f.scrollTop(0),a.removeClass("select2-active"),c.positionDropdown()}function s(e){f.html(e),r()}var o,u,a=this.search,f=this.results,l=this.opts,c=this,h=a.val(),p=e.data(this.container,"select2-last-term");if((n===!0||!p||!i(h,p))&&(e.data(this.container,"select2-last-term",h),n===!0||this.showSearchInput!==!1&&this.opened())){var d=this.getMaximumSelectionSize();if(d>=1&&(o=this.data(),e.isArray(o)&&o.length>=d&&S(l.formatSelectionTooBig,"formatSelectionTooBig")))return s("<li class='select2-selection-limit'>"+l.formatSelectionTooBig(d)+"</li>"),t;if(a.val().length<l.minimumInputLength)return S(l.formatInputTooShort,"formatInputTooShort")?s("<li class='select2-no-results'>"+l.formatInputTooShort(a.val(),l.minimumInputLength)+"</li>"):s(""),n&&this.showSearch(!0),t;if(l.maximumInputLength&&a.val().length>l.maximumInputLength)return S(l.formatInputTooLong,"formatInputTooLong")?s("<li class='select2-no-results'>"+l.formatInputTooLong(a.val(),l.maximumInputLength)+"</li>"):s(""),t;l.formatSearching&&0===this.findHighlightableChoices().length&&s("<li class='select2-searching'>"+l.formatSearching()+"</li>"),a.addClass("select2-active"),u=this.tokenize(),u!=t&&null!=u&&a.val(u),this.resultsPage=1,l.query({element:l.element,term:a.val(),page:this.resultsPage,context:null,matcher:l.matcher,callback:this.bind(function(o){var u;return this.opened()?(this.context=o.context===t?null:o.context,this.opts.createSearchChoice&&""!==a.val()&&(u=this.opts.createSearchChoice.call(null,a.val(),o.results),u!==t&&null!==u&&c.id(u)!==t&&null!==c.id(u)&&0===e(o.results).filter(function(){return i(c.id(this),c.id(u))}).length&&o.results.unshift(u)),0===o.results.length&&S(l.formatNoMatches,"formatNoMatches")?(s("<li class='select2-no-results'>"+l.formatNoMatches(a.val())+"</li>"),t):(f.empty(),c.opts.populateResults.call(this,f,o.results,{term:a.val(),page:this.resultsPage,context:null}),o.more===!0&&S(l.formatLoadMore,"formatLoadMore")&&(f.append("<li class='select2-more-results'>"+c.opts.escapeMarkup(l.formatLoadMore(this.resultsPage))+"</li>"),window.setTimeout(function(){c.loadMoreIfNeeded()},10)),this.postprocessResults(o,n),r(),this.opts.element.trigger({type:"select2-loaded",data:o}),t)):(this.search.removeClass("select2-active"),t)})})}},cancel:function(){this.close()},blur:function(){this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),this.close(),this.container.removeClass("select2-container-active"),this.search[0]===document.activeElement&&this.search.blur(),this.clearSearch(),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){h(this.search)},selectHighlighted:function(e){var t=this.highlight(),n=this.results.find(".select2-highlighted"),r=n.closest(".select2-result").data("select2-data");r&&(this.highlight(t),this.onSelect(r,e))},getPlaceholder:function(){return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder},initContainerWidth:function(){function n(){var n,r,i,s,o;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){if(n=this.opts.element.attr("style"),n!==t)for(r=n.split(";"),s=0,o=r.length;o>s;s+=1)if(i=r[s].replace(/\s/g,"").match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i),null!==i&&i.length>=1)return i[1];return n=this.opts.element.css("width"),n&&n.length>0?n:"resolve"===this.opts.width?0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px":null}return e.isFunction(this.opts.width)?this.opts.width():this.opts.width}var r=n.call(this);null!==r&&this.container.css("width",r)}}),A=C(L,{createContainer:function(){var t=e(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' onclick='return false;' class='select2-choice' tabindex='-1'>","   <span>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>","   <div><b></b></div>","</a>","<input class='select2-focusser select2-offscreen' type='text'/>","<div class='select2-drop select2-display-none'>","   <div class='select2-search'>","       <input type='text' autocomplete='off' autocorrect='off' autocapitilize='off' spellcheck='false' class='select2-input'/>","   </div>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return t},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.focusser.prop("disabled",!this.isInterfaceEnabled())},opening:function(){var t,n;this.parent.opening.apply(this,arguments),this.showSearchInput!==!1&&this.search.val(this.focusser.val()),this.search.focus(),t=this.search.get(0),t.createTextRange&&(n=t.createTextRange(),n.collapse(!1),n.select()),this.focusser.prop("disabled",!0).val(""),this.updateResults(!0),this.opts.element.trigger(e.Event("select2-open"))},close:function(){this.opened()&&(this.parent.close.apply(this,arguments),this.focusser.removeAttr("disabled"),this.focusser.focus())},focus:function(){this.opened()?this.close():(this.focusser.removeAttr("disabled"),this.focusser.focus())},isFocused:function(){return this.container.hasClass("select2-container-active")},cancel:function(){this.parent.cancel.apply(this,arguments),this.focusser.removeAttr("disabled"),this.focusser.focus()},initContainer:function(){var n,r=this.container,i=this.dropdown;this.showSearch(!1),this.selection=n=r.find(".select2-choice"),this.focusser=r.find(".select2-focusser"),this.focusser.attr("id","s2id_autogen"+M()),e("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.focusser.attr("id")),this.focusser.attr("tabindex",this.elementTabIndex),this.search.on("keydown",this.bind(function(e){if(this.isInterfaceEnabled()){if(e.which===k.PAGE_UP||e.which===k.PAGE_DOWN)return d(e),t;switch(e.which){case k.UP:case k.DOWN:return this.moveHighlight(e.which===k.UP?-1:1),d(e),t;case k.ENTER:return this.selectHighlighted(),d(e),t;case k.TAB:return this.selectHighlighted({noFocus:!0}),t;case k.ESC:return this.cancel(e),d(e),t}}})),this.search.on("blur",this.bind(function(){document.activeElement===this.body().get(0)&&window.setTimeout(this.bind(function(){this.search.focus()}),0)})),this.focusser.on("keydown",this.bind(function(e){return!this.isInterfaceEnabled()||e.which===k.TAB||k.isControl(e)||k.isFunctionKey(e)||e.which===k.ESC?t:this.opts.openOnEnter===!1&&e.which===k.ENTER?(d(e),t):e.which==k.DOWN||e.which==k.UP||e.which==k.ENTER&&this.opts.openOnEnter?(this.open(),d(e),t):e.which==k.DELETE||e.which==k.BACKSPACE?(this.opts.allowClear&&this.clear(),d(e),t):t})),u(this.focusser),this.focusser.on("keyup-change input",this.bind(function(e){e.stopPropagation(),this.opened()||this.open()})),n.on("mousedown","abbr",this.bind(function(e){this.isInterfaceEnabled()&&(this.clear(),v(e),this.close(),this.selection.focus())})),n.on("mousedown",this.bind(function(t){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.opened()?this.close():this.isInterfaceEnabled()&&this.open(),d(t)})),i.on("mousedown",this.bind(function(){this.search.focus()})),n.on("focus",this.bind(function(e){d(e)})),this.focusser.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active")})).on("blur",this.bind(function(){this.opened()||(this.container.removeClass("select2-container-active"),this.opts.element.trigger(e.Event("select2-blur")))})),this.search.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active")})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.setPlaceholder()},clear:function(e){var t=this.selection.data("select2-data");t&&(this.opts.element.val(""),this.selection.find("span").empty(),this.selection.removeData("select2-data"),this.setPlaceholder(),e!==!1&&(this.opts.element.trigger({type:"select2-removed",val:this.id(t),choice:t}),this.triggerChange({removed:t})))},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text())this.updateSelection([]),this.close(),this.setPlaceholder();else{var e=this;this.opts.initSelection.call(null,this.opts.element,function(n){n!==t&&null!==n&&(e.updateSelection(n),e.close(),e.setPlaceholder())})}},prepareOpts:function(){var t=this.parent.prepareOpts.apply(this,arguments),n=this;return"select"===t.element.get(0).tagName.toLowerCase()?t.initSelection=function(e,t){var r=e.find(":selected");t(n.optionToData(r))}:"data"in t&&(t.initSelection=t.initSelection||function(n,r){var s=n.val(),o=null;t.query({matcher:function(e,n,r){var u=i(s,t.id(r));return u&&(o=r),u},callback:e.isFunction(r)?function(){r(o)}:e.noop})}),t},getPlaceholder:function(){return this.select&&""!==this.select.find("option").first().text()?t:this.parent.getPlaceholder.apply(this,arguments)},setPlaceholder:function(){var e=this.getPlaceholder();if(""===this.opts.element.val()&&e!==t){if(this.select&&""!==this.select.find("option:first").text())return;this.selection.find("span").html(this.opts.escapeMarkup(e)),this.selection.addClass("select2-default"),this.container.removeClass("select2-allowclear")}},postprocessResults:function(e,n,r){var s=0,o=this;if(this.findHighlightableChoices().each2(function(e,n){return i(o.id(n.data("select2-data")),o.opts.element.val())?(s=e,!1):t}),r!==!1&&this.highlight(s),n===!0&&this.showSearchInput===!1){var u=this.opts.minimumResultsForSearch;u>=0&&this.showSearch(T(e.results)>=u)}},showSearch:function(t){this.showSearchInput=t,this.dropdown.find(".select2-search").toggleClass("select2-search-hidden",!t),this.dropdown.find(".select2-search").toggleClass("select2-offscreen",!t),e(this.dropdown,this.container).toggleClass("select2-with-searchbox",t)},onSelect:function(e,t){if(this.triggerSelect(e)){var n=this.opts.element.val(),r=this.data();this.opts.element.val(this.id(e)),this.updateSelection(e),this.opts.element.trigger({type:"select2-selected",val:this.id(e),choice:e}),this.close(),t&&t.noFocus||this.selection.focus(),i(n,this.id(e))||this.triggerChange({added:e,removed:r})}},updateSelection:function(e){var n,r=this.selection.find("span");this.selection.data("select2-data",e),r.empty(),n=this.opts.formatSelection(e,r),n!==t&&r.append(this.opts.escapeMarkup(n)),this.selection.removeClass("select2-default"),this.opts.allowClear&&this.getPlaceholder()!==t&&this.container.addClass("select2-allowclear")},val:function(){var e,n=!1,r=null,i=this,s=this.data();if(0===arguments.length)return this.opts.element.val();if(e=arguments[0],arguments.length>1&&(n=arguments[1]),this.select)this.select.val(e).find(":selected").each2(function(e,t){return r=i.optionToData(t),!1}),this.updateSelection(r),this.setPlaceholder(),n&&this.triggerChange({added:r,removed:s});else{if(this.opts.initSelection===t)throw Error("cannot call val() if initSelection() is not defined");if(!e&&0!==e)return this.clear(n),t;this.opts.element.val(e),this.opts.initSelection(this.opts.element,function(e){i.opts.element.val(e?i.id(e):""),i.updateSelection(e),i.setPlaceholder(),n&&i.triggerChange({added:e,removed:s})})}},clearSearch:function(){this.search.val(""),this.focusser.val("")},data:function(e,n){var r;return 0===arguments.length?(r=this.selection.data("select2-data"),r==t&&(r=null),r):(e&&""!==e?(r=this.data(),this.opts.element.val(e?this.id(e):""),this.updateSelection(e),n&&this.triggerChange({added:e,removed:r})):this.clear(n),t)}}),O=C(L,{createContainer:function(){var t=e(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["    <ul class='select2-choices'>","  <li class='select2-search-field'>","    <input type='text' autocomplete='off' autocorrect='off' autocapitilize='off' spellcheck='false' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi select2-display-none'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return t},prepareOpts:function(){var t=this.parent.prepareOpts.apply(this,arguments),n=this;return"select"===t.element.get(0).tagName.toLowerCase()?t.initSelection=function(e,t){var r=[];e.find(":selected").each2(function(e,t){r.push(n.optionToData(t))}),t(r)}:"data"in t&&(t.initSelection=t.initSelection||function(n,r){var o=s(n.val(),t.separator),u=[];t.query({matcher:function(n,r,s){var a=e.grep(o,function(e){return i(e,t.id(s))}).length;return a&&u.push(s),a},callback:e.isFunction(r)?function(){for(var e=[],n=0;o.length>n;n++)for(var s=o[n],a=0;u.length>a;a++){var f=u[a];if(i(s,t.id(f))){e.push(f),u.splice(a,1);break}}r(e)}:e.noop})}),t},selectChoice:function(e){var t=this.container.find(".select2-search-choice-focus");t.length&&e&&e[0]==t[0]||(t.length&&this.opts.element.trigger("choice-deselected",t),t.removeClass("select2-search-choice-focus"),e&&e.length&&(this.close(),e.addClass("select2-search-choice-focus"),this.opts.element.trigger("choice-selected",e)))},initContainer:function(){var n,r=".select2-choices";this.searchContainer=this.container.find(".select2-search-field"),this.selection=n=this.container.find(r);var i=this;this.selection.on("mousedown",".select2-search-choice",function(){i.search[0].focus(),i.selectChoice(e(this))}),this.search.attr("id","s2id_autogen"+M()),e("label[for='"+this.opts.element.attr("id")+"']").attr("for",this.search.attr("id")),this.search.on("input paste",this.bind(function(){this.isInterfaceEnabled()&&(this.opened()||this.open())})),this.search.attr("tabindex",this.elementTabIndex),this.keydowns=0,this.search.on("keydown",this.bind(function(e){if(this.isInterfaceEnabled()){++this.keydowns;var r=n.find(".select2-search-choice-focus"),i=r.prev(".select2-search-choice:not(.select2-locked)"),s=r.next(".select2-search-choice:not(.select2-locked)"),o=p(this.search);if(!(!r.length||e.which!=k.LEFT&&e.which!=k.RIGHT&&e.which!=k.BACKSPACE&&e.which!=k.DELETE&&e.which!=k.ENTER)){var u=r;return e.which==k.LEFT&&i.length?u=i:e.which==k.RIGHT?u=s.length?s:null:e.which===k.BACKSPACE?(this.unselect(r.first()),this.search.width(10),u=i.length?i:s):e.which==k.DELETE?(this.unselect(r.first()),this.search.width(10),u=s.length?s:null):e.which==k.ENTER&&(u=null),this.selectChoice(u),d(e),u&&u.length||this.open(),t}if((e.which===k.BACKSPACE&&1==this.keydowns||e.which==k.LEFT)&&0==o.offset&&!o.length)return this.selectChoice(n.find(".select2-search-choice:not(.select2-locked)").last()),d(e),t;if(this.selectChoice(null),this.opened())switch(e.which){case k.UP:case k.DOWN:return this.moveHighlight(e.which===k.UP?-1:1),d(e),t;case k.ENTER:return this.selectHighlighted(),d(e),t;case k.TAB:return this.selectHighlighted({noFocus:!0}),t;case k.ESC:return this.cancel(e),d(e),t}if(e.which!==k.TAB&&!k.isControl(e)&&!k.isFunctionKey(e)&&e.which!==k.BACKSPACE&&e.which!==k.ESC){if(e.which===k.ENTER){if(this.opts.openOnEnter===!1)return;if(e.altKey||e.ctrlKey||e.shiftKey||e.metaKey)return}this.open(),(e.which===k.PAGE_UP||e.which===k.PAGE_DOWN)&&d(e),e.which===k.ENTER&&d(e)}}})),this.search.on("keyup",this.bind(function(){this.keydowns=0,this.resizeSearch()})),this.search.on("blur",this.bind(function(t){this.container.removeClass("select2-container-active"),this.search.removeClass("select2-focused"),this.selectChoice(null),this.opened()||this.clearSearch(),t.stopImmediatePropagation(),this.opts.element.trigger(e.Event("select2-blur"))})),this.container.on("mousedown",r,this.bind(function(t){this.isInterfaceEnabled()&&(e(t.target).closest(".select2-search-choice").length>0||(this.selectChoice(null),this.clearPlaceholder(),this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.open(),this.focusSearch(),t.preventDefault()))})),this.container.on("focus",r,this.bind(function(){this.isInterfaceEnabled()&&(this.container.hasClass("select2-container-active")||this.opts.element.trigger(e.Event("select2-focus")),this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.clearSearch()},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.search.prop("disabled",!this.isInterfaceEnabled())},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text()&&(this.updateSelection([]),this.close(),this.clearSearch()),this.select||""!==this.opts.element.val()){var e=this;this.opts.initSelection.call(null,this.opts.element,function(n){n!==t&&null!==n&&(e.updateSelection(n),e.close(),e.clearSearch())})}},clearSearch:function(){var e=this.getPlaceholder(),n=this.getMaxSearchWidth();e!==t&&0===this.getVal().length&&this.search.hasClass("select2-focused")===!1?(this.search.val(e).addClass("select2-default"),this.search.width(n>0?n:this.container.css("width"))):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},opening:function(){this.clearPlaceholder(),this.resizeSearch(),this.parent.opening.apply(this,arguments),this.focusSearch(),this.updateResults(!0),this.search.focus(),this.opts.element.trigger(e.Event("select2-open"))},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close(),this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(t){var r=[],i=[],s=this;e(t).each(function(){0>n(s.id(this),r)&&(r.push(s.id(this)),i.push(this))}),t=i,this.selection.find(".select2-search-choice").remove(),e(t).each(function(){s.addSelectedChoice(this)}),s.postprocessResults()},tokenize:function(){var e=this.search.val();e=this.opts.tokenizer(e,this.data(),this.bind(this.onSelect),this.opts),null!=e&&e!=t&&(this.search.val(e),e.length>0&&this.open())},onSelect:function(e,t){this.triggerSelect(e)&&(this.addSelectedChoice(e),this.opts.element.trigger({type:"selected",val:this.id(e),choice:e}),(this.select||!this.opts.closeOnSelect)&&this.postprocessResults(),this.opts.closeOnSelect?(this.close(),this.search.width(10)):this.countSelectableResults()>0?(this.search.width(10),this.resizeSearch(),this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()&&this.updateResults(!0),this.positionDropdown()):(this.close(),this.search.width(10)),this.triggerChange({added:e}),t&&t.noFocus||this.focusSearch())},cancel:function(){this.close(),this.focusSearch()},addSelectedChoice:function(n){var r,i=!n.locked,s=e("<li class='select2-search-choice'>    <div></div>    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a></li>"),o=e("<li class='select2-search-choice select2-locked'><div></div></li>"),u=i?s:o,a=this.id(n),f=this.getVal();r=this.opts.formatSelection(n,u.find("div")),r!=t&&u.find("div").replaceWith("<div title='"+this.opts.escapeMarkup(r)+"'>"+this.opts.escapeMarkup(r)+"</div>"),i&&u.find(".select2-search-choice-close").on("mousedown",d).on("click dblclick",this.bind(function(t){this.isInterfaceEnabled()&&(e(t.target).closest(".select2-search-choice").fadeOut("fast",this.bind(function(){this.unselect(e(t.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),this.close(),this.focusSearch()})).dequeue(),d(t))})).on("focus",this.bind(function(){this.isInterfaceEnabled()&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))})),u.data("select2-data",n),u.insertBefore(this.searchContainer),f.push(a),this.setVal(f)},unselect:function(e){var t,r,i=this.getVal();if(e=e.closest(".select2-search-choice"),0===e.length)throw"Invalid argument: "+e+". Must be .select2-search-choice";t=e.data("select2-data"),t&&(r=n(this.id(t),i),r>=0&&(i.splice(r,1),this.setVal(i),this.select&&this.postprocessResults()),e.remove(),this.opts.element.trigger({type:"removed",val:this.id(t),choice:t}),this.triggerChange({removed:t}))},postprocessResults:function(e,t,r){var i=this.getVal(),s=this.results.find(".select2-result"),o=this.results.find(".select2-result-with-children"),u=this;s.each2(function(e,t){var r=u.id(t.data("select2-data"));n(r,i)>=0&&(t.addClass("select2-selected"),t.find(".select2-result-selectable").addClass("select2-selected"))}),o.each2(function(e,t){t.is(".select2-result-selectable")||0!==t.find(".select2-result-selectable:not(.select2-selected)").length||t.addClass("select2-selected")}),-1==this.highlight()&&r!==!1&&u.highlight(0),!this.opts.createSearchChoice&&!s.filter(".select2-result:not(.select2-selected)").length>0&&this.results.append("<li class='select2-no-results'>"+u.opts.formatNoMatches(u.search.val())+"</li>")},getMaxSearchWidth:function(){return this.selection.width()-o(this.search)},resizeSearch:function(){var e,t,n,r,i,s=o(this.search);e=m(this.search)+10,t=this.search.offset().left,n=this.selection.width(),r=this.selection.offset().left,i=n-(t-r)-s,e>i&&(i=n-s),40>i&&(i=n-s),0>=i&&(i=e),this.search.width(i)},getVal:function(){var e;return this.select?(e=this.select.val(),null===e?[]:e):(e=this.opts.element.val(),s(e,this.opts.separator))},setVal:function(t){var r;this.select?this.select.val(t):(r=[],e(t).each(function(){0>n(this,r)&&r.push(this)}),this.opts.element.val(0===r.length?"":r.join(this.opts.separator)))},buildChangeDetails:function(e,t){for(var t=t.slice(0),e=e.slice(0),n=0;t.length>n;n++)for(var r=0;e.length>r;r++)i(this.opts.id(t[n]),this.opts.id(e[r]))&&(t.splice(n,1),n--,e.splice(r,1),r--);return{added:t,removed:e}},val:function(n,r){var i,s=this;if(0===arguments.length)return this.getVal();if(i=this.data(),i.length||(i=[]),!n&&0!==n)return this.opts.element.val(""),this.updateSelection([]),this.clearSearch(),r&&this.triggerChange({added:this.data(),removed:i}),t;if(this.setVal(n),this.select)this.opts.initSelection(this.select,this.bind(this.updateSelection)),r&&this.triggerChange(this.buildChangeDetails(i,this.data()));else{if(this.opts.initSelection===t)throw Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(t){var n=e(t).map(s.id);s.setVal(n),s.updateSelection(t),s.clearSearch(),r&&s.triggerChange(this.buildChangeDetails(i,this.data()))})}this.clearSearch()},onSortStart:function(){if(this.select)throw Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0),this.searchContainer.hide()},onSortEnd:function(){var t=[],n=this;this.searchContainer.show(),this.searchContainer.appendTo(this.searchContainer.parent()),this.resizeSearch(),this.selection.find(".select2-search-choice").each(function(){t.push(n.opts.id(e(this).data("select2-data")))}),this.setVal(t),this.triggerChange()},data:function(n,r){var i,s,o=this;return 0===arguments.length?this.selection.find(".select2-search-choice").map(function(){return e(this).data("select2-data")}).get():(s=this.data(),n||(n=[]),i=e.map(n,function(e){return o.opts.id(e)}),this.setVal(i),this.updateSelection(n),this.clearSearch(),r&&this.triggerChange(this.buildChangeDetails(s,this.data())),t)}}),e.fn.select2=function(){var r,i,s,o,u=Array.prototype.slice.call(arguments,0),a=["val","destroy","opened","open","close","focus","isFocused","container","onSortStart","onSortEnd","enable","readonly","positionDropdown","data"],f=["val","opened","isFocused","container","data"];return this.each(function(){if(0===u.length||"object"==typeof u[0])r=0===u.length?{}:e.extend({},u[0]),r.element=e(this),"select"===r.element.get(0).tagName.toLowerCase()?o=r.element.prop("multiple"):(o=r.multiple||!1,"tags"in r&&(r.multiple=o=!0)),i=o?new O:new A,i.init(r);else{if("string"!=typeof u[0])throw"Invalid arguments to select2 plugin: "+u;if(0>n(u[0],a))throw"Unknown method: "+u[0];if(s=t,i=e(this).data("select2"),i===t)return;if(s="container"===u[0]?i.container:i[u[0]].apply(i,u.slice(1)),n(u[0],f)>=0)return!1}}),s===t?this:s},e.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:!0,openOnEnter:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(e,t,n,r){var i=[];return y(e.text,n.term,i,r),i.join("")},formatSelection:function(e){return e?e.text:t},sortResults:function(e){return e},formatResultCssClass:function(){return t},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(e,t){var n=t-e.length;return"Please enter "+n+" more character"+(1==n?"":"s")},formatInputTooLong:function(e,t){var n=e.length-t;return"Please delete "+n+" character"+(1==n?"":"s")},formatSelectionTooBig:function(e){return"You can only select "+e+" item"+(1==e?"":"s")},formatLoadMore:function(){return"Loading more results..."},formatSearching:function(){return"Searching..."},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(e){return e.id},matcher:function(e,t){return(""+t).toUpperCase().indexOf((""+e).toUpperCase())>=0},separator:",",tokenSeparators:[],tokenizer:N,escapeMarkup:function(e){var t={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return(e+"").replace(/[&<>"'\/\\]/g,function(e){return t[e]})},blurOnChange:!1,selectOnBlur:!1,adaptContainerCssClass:function(e){return e},adaptDropdownCssClass:function(){return null}},e.fn.select2.ajaxDefaults={transport:e.ajax,params:{type:"GET",cache:!1,dataType:"json"}},window.Select2={query:{ajax:b,local:w,tags:E},util:{debounce:f,markMatch:y},"class":{"abstract":L,single:A,multi:O}}}}(jQuery);
(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){var t={},n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P=0;n=function(){return{common:{type:"line",lineColor:"#00f",fillColor:"#cdf",defaultPixelsPerValue:3,width:"auto",height:"auto",composite:!1,tagValuesAttribute:"values",tagOptionsPrefix:"spark",enableTagOptions:!1,enableHighlight:!0,highlightLighten:1.4,tooltipSkipNull:!0,tooltipPrefix:"",tooltipSuffix:"",disableHiddenCheck:!1,numberFormatter:!1,numberDigitGroupCount:3,numberDigitGroupSep:",",numberDecimalMark:".",disableTooltips:!1,disableInteraction:!1},line:{spotColor:"#f80",highlightSpotColor:"#5f5",highlightLineColor:"#f22",spotRadius:1.5,minSpotColor:"#f80",maxSpotColor:"#f80",lineWidth:1,normalRangeMin:undefined,normalRangeMax:undefined,normalRangeColor:"#ccc",drawNormalOnTop:!1,chartRangeMin:undefined,chartRangeMax:undefined,chartRangeMinX:undefined,chartRangeMaxX:undefined,tooltipFormat:new i('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{y}}{{suffix}}')},bar:{barColor:"#3366cc",negBarColor:"#f44",stackedBarColor:["#3366cc","#dc3912","#ff9900","#109618","#66aa00","#dd4477","#0099c6","#990099"],zeroColor:undefined,nullColor:undefined,zeroAxis:!0,barWidth:4,barSpacing:1,chartRangeMax:undefined,chartRangeMin:undefined,chartRangeClip:!1,colorMap:undefined,tooltipFormat:new i('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{value}}{{suffix}}')},tristate:{barWidth:4,barSpacing:1,posBarColor:"#6f6",negBarColor:"#f44",zeroBarColor:"#999",colorMap:{},tooltipFormat:new i('<span style="color: {{color}}">&#9679;</span> {{value:map}}'),tooltipValueLookups:{map:{"-1":"Loss",0:"Draw",1:"Win"}}},discrete:{lineHeight:"auto",thresholdColor:undefined,thresholdValue:0,chartRangeMax:undefined,chartRangeMin:undefined,chartRangeClip:!1,tooltipFormat:new i("{{prefix}}{{value}}{{suffix}}")},bullet:{targetColor:"#f33",targetWidth:3,performanceColor:"#33f",rangeColors:["#d3dafe","#a8b6ff","#7f94ff"],base:undefined,tooltipFormat:new i("{{fieldkey:fields}} - {{value}}"),tooltipValueLookups:{fields:{r:"Range",p:"Performance",t:"Target"}}},pie:{offset:0,sliceColors:["#3366cc","#dc3912","#ff9900","#109618","#66aa00","#dd4477","#0099c6","#990099"],borderWidth:0,borderColor:"#000",tooltipFormat:new i('<span style="color: {{color}}">&#9679;</span> {{value}} ({{percent.1}}%)')},box:{raw:!1,boxLineColor:"#000",boxFillColor:"#cdf",whiskerColor:"#000",outlierLineColor:"#333",outlierFillColor:"#fff",medianColor:"#f00",showOutliers:!0,outlierIQR:1.5,spotRadius:1.5,target:undefined,targetColor:"#4a2",chartRangeMax:undefined,chartRangeMin:undefined,tooltipFormat:new i("{{field:fields}}: {{value}}"),tooltipFormatFieldlistKey:"field",tooltipValueLookups:{fields:{lq:"Lower Quartile",med:"Median",uq:"Upper Quartile",lo:"Left Outlier",ro:"Right Outlier",lw:"Left Whisker",rw:"Right Whisker"}}}}},k='.jqstooltip { position: absolute;left: 0px;top: 0px;visibility: hidden;background: rgb(0, 0, 0) transparent;background-color: rgba(0,0,0,0.6);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";color: white;font: 10px arial, san serif;text-align: left;white-space: nowrap;padding: 5px;border: 1px solid white;z-index: 10000;}.jqsfield { color: white;font: 10px arial, san serif;text-align: left;}',r=function(){var t,n;return t=function(){this.init.apply(this,arguments)},arguments.length>1?(arguments[0]?(t.prototype=e.extend(new arguments[0],arguments[arguments.length-1]),t._super=arguments[0].prototype):t.prototype=arguments[arguments.length-1],arguments.length>2&&(n=Array.prototype.slice.call(arguments,1,-1),n.unshift(t.prototype),e.extend.apply(e,n))):t.prototype=arguments[0],t.prototype.cls=t,t},e.SPFormatClass=i=r({fre:/\{\{([\w.]+?)(:(.+?))?\}\}/g,precre:/(\w+)\.(\d+)/,init:function(e,t){this.format=e,this.fclass=t},render:function(e,t,n){var r=this,i=e,s,o,u,a,f;return this.format.replace(this.fre,function(){var e;return o=arguments[1],u=arguments[3],s=r.precre.exec(o),s?(f=s[2],o=s[1]):f=!1,a=i[o],a===undefined?"":u&&t&&t[u]?(e=t[u],e.get?t[u].get(a)||a:t[u][a]||a):(l(a)&&(n.get("numberFormatter")?a=n.get("numberFormatter")(a):a=v(a,f,n.get("numberDigitGroupCount"),n.get("numberDigitGroupSep"),n.get("numberDecimalMark"))),a)})}}),e.spformat=function(e,t){return new i(e,t)},s=function(e,t,n){return e<t?t:e>n?n:e},o=function(e,t){var n;return t===2?(n=Math.floor(e.length/2),e.length%2?e[n]:(e[n-1]+e[n])/2):e.length%2?(n=(e.length*t+t)/4,n%1?(e[Math.floor(n)]+e[Math.floor(n)-1])/2:e[n-1]):(n=(e.length*t+2)/4,n%1?(e[Math.floor(n)]+e[Math.floor(n)-1])/2:e[n-1])},u=function(e){var t;switch(e){case"undefined":e=undefined;break;case"null":e=null;break;case"true":e=!0;break;case"false":e=!1;break;default:t=parseFloat(e),e==t&&(e=t)}return e},a=function(e){var t,n=[];for(t=e.length;t--;)n[t]=u(e[t]);return n},f=function(e,t){var n,r,i=[];for(n=0,r=e.length;n<r;n++)e[n]!==t&&i.push(e[n]);return i},l=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},v=function(t,n,r,i,s){var o,u;t=(n===!1?parseFloat(t).toString():t.toFixed(n)).split(""),o=(o=e.inArray(".",t))<0?t.length:o,o<t.length&&(t[o]=s);for(u=o-r;u>0;u-=r)t.splice(u,0,i);return t.join("")},c=function(e,t,n){var r;for(r=t.length;r--;){if(n&&t[r]===null)continue;if(t[r]!==e)return!1}return!0},h=function(e){var t=0,n;for(n=e.length;n--;)t+=typeof e[n]=="number"?e[n]:0;return t},d=function(t){return e.isArray(t)?t:[t]},p=function(e){var t;document.createStyleSheet?document.createStyleSheet().cssText=e:(t=document.createElement("style"),t.type="text/css",document.getElementsByTagName("head")[0].appendChild(t),t[typeof document.body.style.WebkitAppearance=="string"?"innerText":"innerHTML"]=e)},e.fn.simpledraw=function(t,n,r,i){var s,o;if(r&&(s=this.data("_jqs_vcanvas")))return s;t===undefined&&(t=e(this).innerWidth()),n===undefined&&(n=e(this).innerHeight());if(e.fn.sparkline.hasCanvas)s=new M(t,n,this,i);else{if(!e.fn.sparkline.hasVML)return!1;s=new _(t,n,this)}return o=e(this).data("_jqs_mhandler"),o&&o.registerCanvas(s),s},e.fn.cleardraw=function(){var e=this.data("_jqs_vcanvas");e&&e.reset()},e.RangeMapClass=m=r({init:function(e){var t,n,r=[];for(t in e)e.hasOwnProperty(t)&&typeof t=="string"&&t.indexOf(":")>-1&&(n=t.split(":"),n[0]=n[0].length===0?-Infinity:parseFloat(n[0]),n[1]=n[1].length===0?Infinity:parseFloat(n[1]),n[2]=e[t],r.push(n));this.map=e,this.rangelist=r||!1},get:function(e){var t=this.rangelist,n,r,i;if((i=this.map[e])!==undefined)return i;if(t)for(n=t.length;n--;){r=t[n];if(r[0]<=e&&r[1]>=e)return r[2]}return undefined}}),e.range_map=function(e){return new m(e)},g=r({init:function(t,n){var r=e(t);this.$el=r,this.options=n,this.currentPageX=0,this.currentPageY=0,this.el=t,this.splist=[],this.tooltip=null,this.over=!1,this.displayTooltips=!n.get("disableTooltips"),this.highlightEnabled=!n.get("disableHighlight")},registerSparkline:function(e){this.splist.push(e),this.over&&this.updateDisplay()},registerCanvas:function(t){var n=e(t.canvas);this.canvas=t,this.$canvas=n,n.mouseenter(e.proxy(this.mouseenter,this)),n.mouseleave(e.proxy(this.mouseleave,this)),n.click(e.proxy(this.mouseclick,this))},reset:function(e){this.splist=[],this.tooltip&&e&&(this.tooltip.remove(),this.tooltip=undefined)},mouseclick:function(t){var n=e.Event("sparklineClick");n.originalEvent=t,n.sparklines=this.splist,this.$el.trigger(n)},mouseenter:function(t){e(document.body).unbind("mousemove.jqs"),e(document.body).bind("mousemove.jqs",e.proxy(this.mousemove,this)),this.over=!0,this.currentPageX=t.pageX,this.currentPageY=t.pageY,this.currentEl=t.target,!this.tooltip&&this.displayTooltips&&(this.tooltip=new y(this.options),this.tooltip.updatePosition(t.pageX,t.pageY)),this.updateDisplay()},mouseleave:function(){e(document.body).unbind("mousemove.jqs");var t=this.splist,n=t.length,r=!1,i,s;this.over=!1,this.currentEl=null,this.tooltip&&(this.tooltip.remove(),this.tooltip=null);for(s=0;s<n;s++)i=t[s],i.clearRegionHighlight()&&(r=!0);r&&this.canvas.render()},mousemove:function(e){this.currentPageX=e.pageX,this.currentPageY=e.pageY,this.currentEl=e.target,this.tooltip&&this.tooltip.updatePosition(e.pageX,e.pageY),this.updateDisplay()},updateDisplay:function(){var t=this.splist,n=t.length,r=!1,i=this.$canvas.offset(),s=this.currentPageX-i.left,o=this.currentPageY-i.top,u,a,f,l,c;if(!this.over)return;for(f=0;f<n;f++)a=t[f],l=a.setRegionHighlight(this.currentEl,s,o),l&&(r=!0);if(r){c=e.Event("sparklineRegionChange"),c.sparklines=this.splist,this.$el.trigger(c);if(this.tooltip){u="";for(f=0;f<n;f++)a=t[f],u+=a.getCurrentRegionTooltip();this.tooltip.setContent(u)}this.disableHighlight||this.canvas.render()}l===null&&this.mouseleave()}}),y=r({sizeStyle:"position: static !important;display: block !important;visibility: hidden !important;float: left !important;",init:function(t){var n=t.get("tooltipClassname","jqstooltip"),r=this.sizeStyle,i;this.container=t.get("tooltipContainer")||document.body,this.tooltipOffsetX=t.get("tooltipOffsetX",10),this.tooltipOffsetY=t.get("tooltipOffsetY",12),e("#jqssizetip").remove(),e("#jqstooltip").remove(),this.sizetip=e("<div/>",{id:"jqssizetip",style:r,"class":n}),this.tooltip=e("<div/>",{id:"jqstooltip","class":n}).appendTo(this.container),i=this.tooltip.offset(),this.offsetLeft=i.left,this.offsetTop=i.top,this.hidden=!0,e(window).unbind("resize.jqs scroll.jqs"),e(window).bind("resize.jqs scroll.jqs",e.proxy(this.updateWindowDims,this)),this.updateWindowDims()},updateWindowDims:function(){this.scrollTop=e(window).scrollTop(),this.scrollLeft=e(window).scrollLeft(),this.scrollRight=this.scrollLeft+e(window).width(),this.updatePosition()},getSize:function(e){this.sizetip.html(e).appendTo(this.container),this.width=this.sizetip.width()+1,this.height=this.sizetip.height(),this.sizetip.remove()},setContent:function(e){if(!e){this.tooltip.css("visibility","hidden"),this.hidden=!0;return}this.getSize(e),this.tooltip.html(e).css({width:this.width,height:this.height,visibility:"visible"}),this.hidden&&(this.hidden=!1,this.updatePosition())},updatePosition:function(e,t){if(e===undefined){if(this.mousex===undefined)return;e=this.mousex-this.offsetLeft,t=this.mousey-this.offsetTop}else this.mousex=e-=this.offsetLeft,this.mousey=t-=this.offsetTop;if(!this.height||!this.width||this.hidden)return;t-=this.height+this.tooltipOffsetY,e+=this.tooltipOffsetX,t<this.scrollTop&&(t=this.scrollTop),e<this.scrollLeft?e=this.scrollLeft:e+this.width>this.scrollRight&&(e=this.scrollRight-this.width),this.tooltip.css({left:e,top:t})},remove:function(){this.tooltip.remove(),this.sizetip.remove(),this.sizetip=this.tooltip=undefined,e(window).unbind("resize.jqs scroll.jqs")}}),L=function(){p(k)},e(L),D=[],e.fn.sparkline=function(t,n){return this.each(function(){var r=new e.fn.sparkline.options(this,n),i=e(this),s,o;s=function(){var n,s,o,u,a,f,l;if(t==="html"||t===undefined){l=this.getAttribute(r.get("tagValuesAttribute"));if(l===undefined||l===null)l=i.html();n=l.replace(/(^\s*<!--)|(-->\s*$)|\s+/g,"").split(",")}else n=t;s=r.get("width")==="auto"?n.length*r.get("defaultPixelsPerValue"):r.get("width");if(r.get("height")==="auto"){if(!r.get("composite")||!e.data(this,"_jqs_vcanvas"))u=document.createElement("span"),u.innerHTML="a",i.html(u),o=e(u).innerHeight()||e(u).height(),e(u).remove(),u=null}else o=r.get("height");r.get("disableInteraction")?a=!1:(a=e.data(this,"_jqs_mhandler"),a?r.get("composite")||a.reset():(a=new g(this,r),e.data(this,"_jqs_mhandler",a)));if(r.get("composite")&&!e.data(this,"_jqs_vcanvas")){e.data(this,"_jqs_errnotify")||(alert("Attempted to attach a composite sparkline to an element with no existing sparkline"),e.data(this,"_jqs_errnotify",!0));return}f=new(e.fn.sparkline[r.get("type")])(this,n,r,s,o),f.render(),a&&a.registerSparkline(f)};if(e(this).html()&&!r.get("disableHiddenCheck")&&e(this).is(":hidden")||e.fn.jquery<"1.3.0"&&e(this).parents().is(":hidden")||!e(this).parents("body").length){if(!r.get("composite")&&e.data(this,"_jqs_pending"))for(o=D.length;o;o--)D[o-1][0]==this&&D.splice(o-1,1);D.push([this,s]),e.data(this,"_jqs_pending",!0)}else s.call(this)})},e.fn.sparkline.defaults=n(),e.sparkline_display_visible=function(){var t,n,r,i=[];for(n=0,r=D.length;n<r;n++)t=D[n][0],e(t).is(":visible")&&!e(t).parents().is(":hidden")?(D[n][1].call(t),e.data(D[n][0],"_jqs_pending",!1),i.push(n)):!e(t).closest("html").length&&!e.data(t,"_jqs_pending")&&(e.data(D[n][0],"_jqs_pending",!1),i.push(n));for(n=i.length;n;n--)D.splice(i[n-1],1)},e.fn.sparkline.options=r({init:function(n,r){var i,s,o,u;this.userOptions=r=r||{},this.tag=n,this.tagValCache={},s=e.fn.sparkline.defaults,o=s.common,this.tagOptionsPrefix=r.enableTagOptions&&(r.tagOptionsPrefix||o.tagOptionsPrefix),u=this.getTagSetting("type"),u===t?i=s[r.type||o.type]:i=s[u],this.mergedOptions=e.extend({},o,i,r)},getTagSetting:function(e){var n=this.tagOptionsPrefix,r,i,s,o;if(n===!1||n===undefined)return t;if(this.tagValCache.hasOwnProperty(e))r=this.tagValCache.key;else{r=this.tag.getAttribute(n+e);if(r===undefined||r===null)r=t;else if(r.substr(0,1)==="["){r=r.substr(1,r.length-2).split(",");for(i=r.length;i--;)r[i]=u(r[i].replace(/(^\s*)|(\s*$)/g,""))}else if(r.substr(0,1)==="{"){s=r.substr(1,r.length-2).split(","),r={};for(i=s.length;i--;)o=s[i].split(":",2),r[o[0].replace(/(^\s*)|(\s*$)/g,"")]=u(o[1].replace(/(^\s*)|(\s*$)/g,""))}else r=u(r);this.tagValCache.key=r}return r},get:function(e,n){var r=this.getTagSetting(e),i;return r!==t?r:(i=this.mergedOptions[e])===undefined?n:i}}),e.fn.sparkline._base=r({disabled:!1,init:function(t,n,r,i,s){this.el=t,this.$el=e(t),this.values=n,this.options=r,this.width=i,this.height=s,this.currentRegion=undefined},initTarget:function(){var e=!this.options.get("disableInteraction");(this.target=this.$el.simpledraw(this.width,this.height,this.options.get("composite"),e))?(this.canvasWidth=this.target.pixelWidth,this.canvasHeight=this.target.pixelHeight):this.disabled=!0},render:function(){return this.disabled?(this.el.innerHTML="",!1):!0},getRegion:function(e,t){},setRegionHighlight:function(e,t,n){var r=this.currentRegion,i=!this.options.get("disableHighlight"),s;return t>this.canvasWidth||n>this.canvasHeight||t<0||n<0?null:(s=this.getRegion(e,t,n),r!==s?(r!==undefined&&i&&this.removeHighlight(),this.currentRegion=s,s!==undefined&&i&&this.renderHighlight(),!0):!1)},clearRegionHighlight:function(){return this.currentRegion!==undefined?(this.removeHighlight(),this.currentRegion=undefined,!0):!1},renderHighlight:function(){this.changeHighlight(!0)},removeHighlight:function(){this.changeHighlight(!1)},changeHighlight:function(e){},getCurrentRegionTooltip:function(){var t=this.options,n="",r=[],s,o,u,a,f,l,c,h,p,d,v,m,g,y;if(this.currentRegion===undefined)return"";s=this.getCurrentRegionFields(),v=t.get("tooltipFormatter");if(v)return v(this,t,s);t.get("tooltipChartTitle")&&(n+='<div class="jqs jqstitle">'+t.get("tooltipChartTitle")+"</div>\n"),o=this.options.get("tooltipFormat");if(!o)return"";e.isArray(o)||(o=[o]),e.isArray(s)||(s=[s]),c=this.options.get("tooltipFormatFieldlist"),h=this.options.get("tooltipFormatFieldlistKey");if(c&&h){p=[];for(l=s.length;l--;)d=s[l][h],(y=e.inArray(d,c))!=-1&&(p[y]=s[l]);s=p}u=o.length,g=s.length;for(l=0;l<u;l++){m=o[l],typeof m=="string"&&(m=new i(m)),a=m.fclass||"jqsfield";for(y=0;y<g;y++)if(!s[y].isNull||!t.get("tooltipSkipNull"))e.extend(s[y],{prefix:t.get("tooltipPrefix"),suffix:t.get("tooltipSuffix")}),f=m.render(s[y],t.get("tooltipValueLookups"),t),r.push('<div class="'+a+'">'+f+"</div>")}return r.length?n+r.join("\n"):""},getCurrentRegionFields:function(){},calcHighlightColor:function(e,t){var n=t.get("highlightColor"),r=t.get("highlightLighten"),i,o,u,a;if(n)return n;if(r){i=/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(e)||/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(e);if(i){u=[],o=e.length===4?16:1;for(a=0;a<3;a++)u[a]=s(Math.round(parseInt(i[a+1],16)*o*r),0,255);return"rgb("+u.join(",")+")"}}return e}}),b={changeHighlight:function(t){var n=this.currentRegion,r=this.target,i=this.regionShapes[n],s;i&&(s=this.renderRegion(n,t),e.isArray(s)||e.isArray(i)?(r.replaceWithShapes(i,s),this.regionShapes[n]=e.map(s,function(e){return e.id})):(r.replaceWithShape(i,s),this.regionShapes[n]=s.id))},render:function(){var t=this.values,n=this.target,r=this.regionShapes,i,s,o,u;if(!this.cls._super.render.call(this))return;for(o=t.length;o--;){i=this.renderRegion(o);if(i)if(e.isArray(i)){s=[];for(u=i.length;u--;)i[u].append(),s.push(i[u].id);r[o]=s}else i.append(),r[o]=i.id;else r[o]=null}n.render()}},e.fn.sparkline.line=w=r(e.fn.sparkline._base,{type:"line",init:function(e,t,n,r,i){w._super.init.call(this,e,t,n,r,i),this.vertices=[],this.regionMap=[],this.xvalues=[],this.yvalues=[],this.yminmax=[],this.hightlightSpotId=null,this.lastShapeId=null,this.initTarget()},getRegion:function(e,t,n){var r,i=this.regionMap;for(r=i.length;r--;)if(i[r]!==null&&t>=i[r][0]&&t<=i[r][1])return i[r][2];return undefined},getCurrentRegionFields:function(){var e=this.currentRegion;return{isNull:this.yvalues[e]===null,x:this.xvalues[e],y:this.yvalues[e],color:this.options.get("lineColor"),fillColor:this.options.get("fillColor"),offset:e}},renderHighlight:function(){var e=this.currentRegion,t=this.target,n=this.vertices[e],r=this.options,i=r.get("spotRadius"),s=r.get("highlightSpotColor"),o=r.get("highlightLineColor"),u,a;if(!n)return;i&&s&&(u=t.drawCircle(n[0],n[1],i,undefined,s),this.highlightSpotId=u.id,t.insertAfterShape(this.lastShapeId,u)),o&&(a=t.drawLine(n[0],this.canvasTop,n[0],this.canvasTop+this.canvasHeight,o),this.highlightLineId=a.id,t.insertAfterShape(this.lastShapeId,a))},removeHighlight:function(){var e=this.target;this.highlightSpotId&&(e.removeShapeId(this.highlightSpotId),this.highlightSpotId=null),this.highlightLineId&&(e.removeShapeId(this.highlightLineId),this.highlightLineId=null)},scanValues:function(){var e=this.values,t=e.length,n=this.xvalues,r=this.yvalues,i=this.yminmax,s,o,u,a,f;for(s=0;s<t;s++)o=e[s],u=typeof e[s]=="string",a=typeof e[s]=="object"&&e[s]instanceof Array,f=u&&e[s].split(":"),u&&f.length===2?(n.push(Number(f[0])),r.push(Number(f[1])),i.push(Number(f[1]))):a?(n.push(o[0]),r.push(o[1]),i.push(o[1])):(n.push(s),e[s]===null||e[s]==="null"?r.push(null):(r.push(Number(o)),i.push(Number(o))));this.options.get("xvalues")&&(n=this.options.get("xvalues")),this.maxy=this.maxyorg=Math.max.apply(Math,i),this.miny=this.minyorg=Math.min.apply(Math,i),this.maxx=Math.max.apply(Math,n),this.minx=Math.min.apply(Math,n),this.xvalues=n,this.yvalues=r,this.yminmax=i},processRangeOptions:function(){var e=this.options,t=e.get("normalRangeMin"),n=e.get("normalRangeMax");t!==undefined&&(t<this.miny&&(this.miny=t),n>this.maxy&&(this.maxy=n)),e.get("chartRangeMin")!==undefined&&(e.get("chartRangeClip")||e.get("chartRangeMin")<this.miny)&&(this.miny=e.get("chartRangeMin")),e.get("chartRangeMax")!==undefined&&(e.get("chartRangeClip")||e.get("chartRangeMax")>this.maxy)&&(this.maxy=e.get("chartRangeMax")),e.get("chartRangeMinX")!==undefined&&(e.get("chartRangeClipX")||e.get("chartRangeMinX")<this.minx)&&(this.minx=e.get("chartRangeMinX")),e.get("chartRangeMaxX")!==undefined&&(e.get("chartRangeClipX")||e.get("chartRangeMaxX")>this.maxx)&&(this.maxx=e.get("chartRangeMaxX"))},drawNormalRange:function(e,t,n,r,i){var s=this.options.get("normalRangeMin"),o=this.options.get("normalRangeMax"),u=t+Math.round(n-n*((o-this.miny)/i)),a=Math.round(n*(o-s)/i);this.target.drawRect(e,u,r,a,undefined,this.options.get("normalRangeColor")).append()},render:function(){var t=this.options,n=this.target,r=this.canvasWidth,i=this.canvasHeight,s=this.vertices,o=t.get("spotRadius"),u=this.regionMap,a,f,l,c,h,p,d,v,g,y,b,E,S,x,T,N,C,k,L,A,O,M,_,D,P;if(!w._super.render.call(this))return;this.scanValues(),this.processRangeOptions(),_=this.xvalues,D=this.yvalues;if(!this.yminmax.length||this.yvalues.length<2)return;c=h=0,a=this.maxx-this.minx===0?1:this.maxx-this.minx,f=this.maxy-this.miny===0?1:this.maxy-this.miny,l=this.yvalues.length-1,o&&(r<o*4||i<o*4)&&(o=0);if(o){O=t.get("highlightSpotColor")&&!t.get("disableInteraction");if(O||t.get("minSpotColor")||t.get("spotColor")&&D[l]===this.miny)i-=Math.ceil(o);if(O||t.get("maxSpotColor")||t.get("spotColor")&&D[l]===this.maxy)i-=Math.ceil(o),c+=Math.ceil(o);if(O||(t.get("minSpotColor")||t.get("maxSpotColor"))&&(D[0]===this.miny||D[0]===this.maxy))h+=Math.ceil(o),r-=Math.ceil(o);if(O||t.get("spotColor")||t.get("minSpotColor")||t.get("maxSpotColor")&&(D[l]===this.miny||D[l]===this.maxy))r-=Math.ceil(o)}i--,t.get("normalRangeMin")!==undefined&&!t.get("drawNormalOnTop")&&this.drawNormalRange(h,c,i,r,f),d=[],v=[d],x=T=null,N=D.length;for(P=0;P<N;P++)g=_[P],b=_[P+1],y=D[P],E=h+Math.round((g-this.minx)*(r/a)),S=P<N-1?h+Math.round((b-this.minx)*(r/a)):r,T=E+(S-E)/2,u[P]=[x||0,T,P],x=T,y===null?P&&(D[P-1]!==null&&(d=[],v.push(d)),s.push(null)):(y<this.miny&&(y=this.miny),y>this.maxy&&(y=this.maxy),d.length||d.push([E,c+i]),p=[E,c+Math.round(i-i*((y-this.miny)/f))],d.push(p),s.push(p));C=[],k=[],L=v.length;for(P=0;P<L;P++)d=v[P],d.length&&(t.get("fillColor")&&(d.push([d[d.length-1][0],c+i]),k.push(d.slice(0)),d.pop()),d.length>2&&(d[0]=[d[0][0],d[1][1]]),C.push(d));L=k.length;for(P=0;P<L;P++)n.drawShape(k[P],t.get("fillColor"),t.get("fillColor")).append();t.get("normalRangeMin")!==undefined&&t.get("drawNormalOnTop")&&this.drawNormalRange(h,c,i,r,f),L=C.length;for(P=0;P<L;P++)n.drawShape(C[P],t.get("lineColor"),undefined,t.get("lineWidth")).append();if(o&&t.get("valueSpots")){A=t.get("valueSpots"),A.get===undefined&&(A=new m(A));for(P=0;P<N;P++)M=A.get(D[P]),M&&n.drawCircle(h+Math.round((_[P]-this.minx)*(r/a)),c+Math.round(i-i*((D[P]-this.miny)/f)),o,undefined,M).append()}o&&t.get("spotColor")&&D[l]!==null&&n.drawCircle(h+Math.round((_[_.length-1]-this.minx)*(r/a)),c+Math.round(i-i*((D[l]-this.miny)/f)),o,undefined,t.get("spotColor")).append(),this.maxy!==this.minyorg&&(o&&t.get("minSpotColor")&&(g=_[e.inArray(this.minyorg,D)],n.drawCircle(h+Math.round((g-this.minx)*(r/a)),c+Math.round(i-i*((this.minyorg-this.miny)/f)),o,undefined,t.get("minSpotColor")).append()),o&&t.get("maxSpotColor")&&(g=_[e.inArray(this.maxyorg,D)],n.drawCircle(h+Math.round((g-this.minx)*(r/a)),c+Math.round(i-i*((this.maxyorg-this.miny)/f)),o,undefined,t.get("maxSpotColor")).append())),this.lastShapeId=n.getLastShapeId(),this.canvasTop=c,n.render()}}),e.fn.sparkline.bar=E=r(e.fn.sparkline._base,b,{type:"bar",init:function(t,n,r,i,o){var l=parseInt(r.get("barWidth"),10),c=parseInt(r.get("barSpacing"),10),h=r.get("chartRangeMin"),p=r.get("chartRangeMax"),d=r.get("chartRangeClip"),v=Infinity,g=-Infinity,y,b,w,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,F,I,R,U,z;E._super.init.call(this,t,n,r,i,o);for(T=0,N=n.length;T<N;T++){I=n[T],y=typeof I=="string"&&I.indexOf(":")>-1;if(y||e.isArray(I))D=!0,y&&(I=n[T]=a(I.split(":"))),I=f(I,null),b=Math.min.apply(Math,I),w=Math.max.apply(Math,I),b<v&&(v=b),w>g&&(g=w)}this.stacked=D,this.regionShapes={},this.barWidth=l,this.barSpacing=c,this.totalBarWidth=l+c,this.width=i=n.length*l+(n.length-1)*c,this.initTarget(),d&&(M=h===undefined?-Infinity:h,_=p===undefined?Infinity:p),x=[],S=D?[]:x;var W=[],X=[];for(T=0,N=n.length;T<N;T++)if(D){P=n[T],n[T]=F=[],W[T]=0,S[T]=X[T]=0;for(H=0,B=P.length;H<B;H++)I=F[H]=d?s(P[H],M,_):P[H],I!==null&&(I>0&&(W[T]+=I),v<0&&g>0?I<0?X[T]+=Math.abs(I):S[T]+=I:S[T]+=Math.abs(I-(I<0?g:v)),x.push(I))}else I=d?s(n[T],M,_):n[T],I=n[T]=u(I),I!==null&&x.push(I);this.max=O=Math.max.apply(Math,x),this.min=A=Math.min.apply(Math,x),this.stackMax=g=D?Math.max.apply(Math,W):O,this.stackMin=v=D?Math.min.apply(Math,x):A,r.get("chartRangeMin")!==undefined&&(r.get("chartRangeClip")||r.get("chartRangeMin")<A)&&(A=r.get("chartRangeMin")),r.get("chartRangeMax")!==undefined&&(r.get("chartRangeClip")||r.get("chartRangeMax")>O)&&(O=r.get("chartRangeMax")),this.zeroAxis=k=r.get("zeroAxis",!0),A<=0&&O>=0&&k?L=0:k==0?L=A:A>0?L=A:L=O,this.xaxisOffset=L,C=D?Math.max.apply(Math,S)+Math.max.apply(Math,X):O-A,this.canvasHeightEf=k&&A<0?this.canvasHeight-2:this.canvasHeight-1,A<L?(U=D&&O>=0?g:O,R=(U-L)/C*this.canvasHeight,R!==Math.ceil(R)&&(this.canvasHeightEf-=2,R=Math.ceil(R))):R=this.canvasHeight,this.yoffset=R,e.isArray(r.get("colorMap"))?(this.colorMapByIndex=r.get("colorMap"),this.colorMapByValue=null):(this.colorMapByIndex=null,this.colorMapByValue=r.get("colorMap"),this.colorMapByValue&&this.colorMapByValue.get===undefined&&(this.colorMapByValue=new m(this.colorMapByValue))),this.range=C},getRegion:function(e,t,n){var r=Math.floor(t/this.totalBarWidth);return r<0||r>=this.values.length?undefined:r},getCurrentRegionFields:function(){var e=this.currentRegion,t=d(this.values[e]),n=[],r,i;for(i=t.length;i--;)r=t[i],n.push({isNull:r===null,value:r,color:this.calcColor(i,r,e),offset:e});return n},calcColor:function(t,n,r){var i=this.colorMapByIndex,s=this.colorMapByValue,o=this.options,u,a;return this.stacked?u=o.get("stackedBarColor"):u=n<0?o.get("negBarColor"):o.get("barColor"),n===0&&o.get("zeroColor")!==undefined&&(u=o.get("zeroColor")),s&&(a=s.get(n))?u=a:i&&i.length>r&&(u=i[r]),e.isArray(u)?u[t%u.length]:u},renderRegion:function(t,n){var r=this.values[t],i=this.options,s=this.xaxisOffset,o=[],u=this.range,a=this.stacked,f=this.target,l=t*this.totalBarWidth,h=this.canvasHeightEf,p=this.yoffset,d,v,m,g,y,b,w,E,S,x;r=e.isArray(r)?r:[r],w=r.length,E=r[0],g=c(null,r),x=c(s,r,!0);if(g)return i.get("nullColor")?(m=n?i.get("nullColor"):this.calcHighlightColor(i.get("nullColor"),i),d=p>0?p-1:p,f.drawRect(l,d,this.barWidth-1,0,m,m)):undefined;y=p;for(b=0;b<w;b++){E=r[b];if(a&&E===s){if(!x||S)continue;S=!0}u>0?v=Math.floor(h*(Math.abs(E-s)/u))+1:v=1,E<s||E===s&&p===0?(d=y,y+=v):(d=p-v,p-=v),m=this.calcColor(b,E,t),n&&(m=this.calcHighlightColor(m,i)),o.push(f.drawRect(l,d,this.barWidth-1,v-1,m,m))}return o.length===1?o[0]:o}}),e.fn.sparkline.tristate=S=r(e.fn.sparkline._base,b,{type:"tristate",init:function(t,n,r,i,s){var o=parseInt(r.get("barWidth"),10),u=parseInt(r.get("barSpacing"),10);S._super.init.call(this,t,n,r,i,s),this.regionShapes={},this.barWidth=o,this.barSpacing=u,this.totalBarWidth=o+u,this.values=e.map(n,Number),this.width=i=n.length*o+(n.length-1)*u,e.isArray(r.get("colorMap"))?(this.colorMapByIndex=r.get("colorMap"),this.colorMapByValue=null):(this.colorMapByIndex=null,this.colorMapByValue=r.get("colorMap"),this.colorMapByValue&&this.colorMapByValue.get===undefined&&(this.colorMapByValue=new m(this.colorMapByValue))),this.initTarget()},getRegion:function(e,t,n){return Math.floor(t/this.totalBarWidth)},getCurrentRegionFields:function(){var e=this.currentRegion;return{isNull:this.values[e]===undefined,value:this.values[e],color:this.calcColor(this.values[e],e),offset:e}},calcColor:function(e,t){var n=this.values,r=this.options,i=this.colorMapByIndex,s=this.colorMapByValue,o,u;return s&&(u=s.get(e))?o=u:i&&i.length>t?o=i[t]:n[t]<0?o=r.get("negBarColor"):n[t]>0?o=r.get("posBarColor"):o=r.get("zeroBarColor"),o},renderRegion:function(e,t){var n=this.values,r=this.options,i=this.target,s,o,u,a,f,l;s=i.pixelHeight,u=Math.round(s/2),a=e*this.totalBarWidth,n[e]<0?(f=u,o=u-1):n[e]>0?(f=0,o=u-1):(f=u-1,o=2),l=this.calcColor(n[e],e);if(l===null)return;return t&&(l=this.calcHighlightColor(l,r)),i.drawRect(a,f,this.barWidth-1,o-1,l,l)}}),e.fn.sparkline.discrete=x=r(e.fn.sparkline._base,b,{type:"discrete",init:function(t,n,r,i,s){x._super.init.call(this,t,n,r,i,s),this.regionShapes={},this.values=n=e.map(n,Number),this.min=Math.min.apply(Math,n),this.max=Math.max.apply(Math,n),this.range=this.max-this.min,this.width=i=r.get("width")==="auto"?n.length*2:this.width,this.interval=Math.floor(i/n.length),this.itemWidth=i/n.length,r.get("chartRangeMin")!==undefined&&(r.get("chartRangeClip")||r.get("chartRangeMin")<this.min)&&(this.min=r.get("chartRangeMin")),r.get("chartRangeMax")!==undefined&&(r.get("chartRangeClip")||r.get("chartRangeMax")>this.max)&&(this.max=r.get("chartRangeMax")),this.initTarget(),this.target&&(this.lineHeight=r.get("lineHeight")==="auto"?Math.round(this.canvasHeight*.3):r.get("lineHeight"))},getRegion:function(e,t,n){return Math.floor(t/this.itemWidth)},getCurrentRegionFields:function(){var e=this.currentRegion;return{isNull:this.values[e]===undefined,value:this.values[e],offset:e}},renderRegion:function(e,t){var n=this.values,r=this.options,i=this.min,o=this.max,u=this.range,a=this.interval,f=this.target,l=this.canvasHeight,c=this.lineHeight,h=l-c,p,d,v,m;return d=s(n[e],i,o),m=e*a,p=Math.round(h-h*((d-i)/u)),v=r.get("thresholdColor")&&d<r.get("thresholdValue")?r.get("thresholdColor"):r.get("lineColor"),t&&(v=this.calcHighlightColor(v,r)),f.drawLine(m,p,m,p+c,v)}}),e.fn.sparkline.bullet=T=r(e.fn.sparkline._base,{type:"bullet",init:function(e,t,n,r,i){var s,o,u;T._super.init.call(this,e,t,n,r,i),this.values=t=a(t),u=t.slice(),u[0]=u[0]===null?u[2]:u[0],u[1]=t[1]===null?u[2]:u[1],s=Math.min.apply(Math,t),o=Math.max.apply(Math,t),n.get("base")===undefined?s=s<0?s:0:s=n.get("base"),this.min=s,this.max=o,this.range=o-s,this.shapes={},this.valueShapes={},this.regiondata={},this.width=r=n.get("width")==="auto"?"4.0em":r,this.target=this.$el.simpledraw(r,i,n.get("composite")),t.length||(this.disabled=!0),this.initTarget()},getRegion:function(e,t,n){var r=this.target.getShapeAt(e,t,n);return r!==undefined&&this.shapes[r]!==undefined?this.shapes[r]:undefined},getCurrentRegionFields:function(){var e=this.currentRegion;return{fieldkey:e.substr(0,1),value:this.values[e.substr(1)],region:e}},changeHighlight:function(e){var t=this.currentRegion,n=this.valueShapes[t],r;delete this.shapes[n];switch(t.substr(0,1)){case"r":r=this.renderRange(t.substr(1),e);break;case"p":r=this.renderPerformance(e);break;case"t":r=this.renderTarget(e)}this.valueShapes[t]=r.id,this.shapes[r.id]=t,this.target.replaceWithShape(n,r)},renderRange:function(e,t){var n=this.values[e],r=Math.round(this.canvasWidth*((n-this.min)/this.range)),i=this.options.get("rangeColors")[e-2];return t&&(i=this.calcHighlightColor(i,this.options)),this.target.drawRect(0,0,r-1,this.canvasHeight-1,i,i)},renderPerformance:function(e){var t=this.values[1],n=Math.round(this.canvasWidth*((t-this.min)/this.range)),r=this.options.get("performanceColor");return e&&(r=this.calcHighlightColor(r,this.options)),this.target.drawRect(0,Math.round(this.canvasHeight*.3),n-1,Math.round(this.canvasHeight*.4)-1,r,r)},renderTarget:function(e){var t=this.values[0],n=Math.round(this.canvasWidth*((t-this.min)/this.range)-this.options.get("targetWidth")/2),r=Math.round(this.canvasHeight*.1),i=this.canvasHeight-r*2,s=this.options.get("targetColor");return e&&(s=this.calcHighlightColor(s,this.options)),this.target.drawRect(n,r,this.options.get("targetWidth")-1,i-1,s,s)},render:function(){var e=this.values.length,t=this.target,n,r;if(!T._super.render.call(this))return;for(n=2;n<e;n++)r=this.renderRange(n).append(),this.shapes[r.id]="r"+n,this.valueShapes["r"+n]=r.id;this.values[1]!==null&&(r=this.renderPerformance().append(),this.shapes[r.id]="p1",this.valueShapes.p1=r.id),this.values[0]!==null&&(r=this.renderTarget().append(),this.shapes[r.id]="t0",this.valueShapes.t0=r.id),t.render()}}),e.fn.sparkline.pie=N=r(e.fn.sparkline._base,{type:"pie",init:function(t,n,r,i,s){var o=0,u;N._super.init.call(this,t,n,r,i,s),this.shapes={},this.valueShapes={},this.values=n=e.map(n,Number),r.get("width")==="auto"&&(this.width=this.height);if(n.length>0)for(u=n.length;u--;)o+=n[u];this.total=o,this.initTarget(),this.radius=Math.floor(Math.min(this.canvasWidth,this.canvasHeight)/2)},getRegion:function(e,t,n){var r=this.target.getShapeAt(e,t,n);return r!==undefined&&this.shapes[r]!==undefined?this.shapes[r]:undefined},getCurrentRegionFields:function(){var e=this.currentRegion;return{isNull:this.values[e]===undefined,value:this.values[e],percent:this.values[e]/this.total*100,color:this.options.get("sliceColors")[e%this.options.get("sliceColors").length],offset:e}},changeHighlight:function(e){var t=this.currentRegion,n=this.renderSlice(t,e),r=this.valueShapes[t];delete this.shapes[r],this.target.replaceWithShape(r,n),this.valueShapes[t]=n.id,this.shapes[n.id]=t},renderSlice:function(e,t){var n=this.target,r=this.options,i=this.radius,s=r.get("borderWidth"),o=r.get("offset"),u=2*Math.PI,a=this.values,f=this.total,l=o?2*Math.PI*(o/360):0,c,h,p,d,v;d=a.length;for(p=0;p<d;p++){c=l,h=l,f>0&&(h=l+u*(a[p]/f));if(e===p)return v=r.get("sliceColors")[p%r.get("sliceColors").length],t&&(v=this.calcHighlightColor(v,r)),n.drawPieSlice(i,i,i-s,c,h,undefined,v);l=h}},render:function(){var e=this.target,t=this.values,n=this.options,r=this.radius,i=n.get("borderWidth"),s,o;if(!N._super.render.call(this))return;i&&e.drawCircle(r,r,Math.floor(r-i/2),n.get("borderColor"),undefined,i).append();for(o=t.length;o--;)t[o]&&(s=this.renderSlice(o).append(),this.valueShapes[o]=s.id,this.shapes[s.id]=o);e.render()}}),e.fn.sparkline.box=C=r(e.fn.sparkline._base,{type:"box",init:function(t,n,r,i,s){C._super.init.call(this,t,n,r,i,s),this.values=e.map(n,Number),this.width=r.get("width")==="auto"?"4.0em":i,this.initTarget(),this.values.length||(this.disabled=1)},getRegion:function(){return 1},getCurrentRegionFields:function(){var e=[{field:"lq",value:this.quartiles[0]},{field:"med",value:this.quartiles[1]},{field:"uq",value:this.quartiles[2]}];return this.loutlier!==undefined&&e.push({field:"lo",value:this.loutlier}),this.routlier!==undefined&&e.push({field:"ro",value:this.routlier}),this.lwhisker!==undefined&&e.push({field:"lw",value:this.lwhisker}),this.rwhisker!==undefined&&e.push({field:"rw",value:this.rwhisker}),e},render:function(){var e=this.target,t=this.values,n=t.length,r=this.options,i=this.canvasWidth,s=this.canvasHeight,u=r.get("chartRangeMin")===undefined?Math.min.apply(Math,t):r.get("chartRangeMin"),a=r.get("chartRangeMax")===undefined?Math.max.apply(Math,t):r.get("chartRangeMax"),f=0,l,c,h,p,d,v,m,g,y,b,w;if(!C._super.render.call(this))return;if(r.get("raw"))r.get("showOutliers")&&t.length>5?(c=t[0],l=t[1],p=t[2],d=t[3],v=t[4],m=t[5],g=t[6]):(l=t[0],p=t[1],d=t[2],v=t[3],m=t[4]);else{t.sort(function(e,t){return e-t}),p=o(t,1),d=o(t,2),v=o(t,3),h=v-p;if(r.get("showOutliers")){l=m=undefined;for(y=0;y<n;y++)l===undefined&&t[y]>p-h*r.get("outlierIQR")&&(l=t[y]),t[y]<v+h*r.get("outlierIQR")&&(m=t[y]);c=t[0],g=t[n-1]}else l=t[0],m=t[n-1]}this.quartiles=[p,d,v],this.lwhisker=l,this.rwhisker=m,this.loutlier=c,this.routlier=g,w=i/(a-u+1),r.get("showOutliers")&&(f=Math.ceil(r.get("spotRadius")),i-=2*Math.ceil(r.get("spotRadius")),w=i/(a-u+1),c<l&&e.drawCircle((c-u)*w+f,s/2,r.get("spotRadius"),r.get("outlierLineColor"),r.get("outlierFillColor")).append(),g>m&&e.drawCircle((g-u)*w+f,s/2,r.get("spotRadius"),r.get("outlierLineColor"),r.get("outlierFillColor")).append()),e.drawRect(Math.round((p-u)*w+f),Math.round(s*.1),Math.round((v-p)*w),Math.round(s*.8),r.get("boxLineColor"),r.get("boxFillColor")).append(),e.drawLine(Math.round((l-u)*w+f),Math.round(s/2),Math.round((p-u)*w+f),Math.round(s/2),r.get("lineColor")).append(),e.drawLine(Math.round((l-u)*w+f),Math.round(s/4),Math.round((l-u)*w+f),Math.round(s-s/4),r.get("whiskerColor")).append(),e.drawLine(Math.round((m-u)*w+f),Math.round(s/2),Math.round((v-u)*w+f),Math.round(s/2),r.get("lineColor")).append(),e.drawLine(Math.round((m-u)*w+f),Math.round(s/4),Math.round((m-u)*w+f),Math.round(s-s/4),r.get("whiskerColor")).append(),e.drawLine(Math.round((d-u)*w+f),Math.round(s*.1),Math.round((d-u)*w+f),Math.round(s*.9),r.get("medianColor")).append(),r.get("target")&&(b=Math.ceil(r.get("spotRadius")),e.drawLine(Math.round((r.get("target")-u)*w+f),Math.round(s/2-b),Math.round((r.get("target")-u)*w+f),Math.round(s/2+b),r.get("targetColor")).append(),e.drawLine(Math.round((r.get("target")-u)*w+f-b),Math.round(s/2),Math.round((r.get("target")-u)*w+f+b),Math.round(s/2),r.get("targetColor")).append()),e.render()}}),function(){document.namespaces&&!document.namespaces.v?(e.fn.sparkline.hasVML=!0,document.namespaces.add("v","urn:schemas-microsoft-com:vml","#default#VML")):e.fn.sparkline.hasVML=!1;var t=document.createElement("canvas");e.fn.sparkline.hasCanvas=!!t.getContext&&!!t.getContext("2d")}(),A=r({init:function(e,t,n,r){this.target=e,this.id=t,this.type=n,this.args=r},append:function(){return this.target.appendShape(this),this}}),O=r({_pxregex:/(\d+)(px)?\s*$/i,init:function(t,n,r){if(!t)return;this.width=t,this.height=n,this.target=r,this.lastShapeId=null,r[0]&&(r=r[0]),e.data(r,"_jqs_vcanvas",this)},drawLine:function(e,t,n,r,i,s){return this.drawShape([[e,t],[n,r]],i,s)},drawShape:function(e,t,n,r){return this._genShape("Shape",[e,t,n,r])},drawCircle:function(e,t,n,r,i,s){return this._genShape("Circle",[e,t,n,r,i,s])},drawPieSlice:function(e,t,n,r,i,s,o){return this._genShape("PieSlice",[e,t,n,r,i,s,o])},drawRect:function(e,t,n,r,i,s){return this._genShape("Rect",[e,t,n,r,i,s])},getElement:function(){return this.canvas},getLastShapeId:function(){return this.lastShapeId},reset:function(){alert("reset not implemented")},_insert:function(t,n){e(n).html(t)},_calculatePixelDims:function(t,n,r){var i;i=this._pxregex.exec(n),i?this.pixelHeight=i[1]:this.pixelHeight=e(r).height(),i=this._pxregex.exec(t),i?this.pixelWidth=i[1]:this.pixelWidth=e(r).width()},_genShape:function(e,t){var n=P++;return t.unshift(n),new A(this,n,e,t)},appendShape:function(e){alert("appendShape not implemented")},replaceWithShape:function(e,t){alert("replaceWithShape not implemented")},insertAfterShape:function(e,t){alert("insertAfterShape not implemented")},removeShapeId:function(e){alert("removeShapeId not implemented")},getShapeAt:function(e,t,n){alert("getShapeAt not implemented")},render:function(){alert("render not implemented")}}),M=r(O,{init:function(t,n,r,i){M._super.init.call(this,t,n,r),this.canvas=document.createElement("canvas"),r[0]&&(r=r[0]),e.data(r,"_jqs_vcanvas",this),e(this.canvas).css({display:"inline-block",width:t,height:n,verticalAlign:"top"}),this._insert(this.canvas,r),this._calculatePixelDims(t,n,this.canvas),this.canvas.width=this.pixelWidth,this.canvas.height=this.pixelHeight,this.interact=i,this.shapes={},this.shapeseq=[],this.currentTargetShapeId=undefined,e(this.canvas).css({width:this.pixelWidth,height:this.pixelHeight})},_getContext:function(e,t,n){var r=this.canvas.getContext("2d");return e!==undefined&&(r.strokeStyle=e),r.lineWidth=n===undefined?1:n,t!==undefined&&(r.fillStyle=t),r},reset:function(){var e=this._getContext();e.clearRect(0,0,this.pixelWidth,this.pixelHeight),this.shapes={},this.shapeseq=[],this.currentTargetShapeId=undefined},_drawShape:function(e,t,n,r,i){var s=this._getContext(n,r,i),o,u;s.beginPath(),s.moveTo(t[0][0]+.5,t[0][1]+.5);for(o=1,u=t.length;o<u;o++)s.lineTo(t[o][0]+.5,t[o][1]+.5);n!==undefined&&s.stroke(),r!==undefined&&s.fill(),this.targetX!==undefined&&this.targetY!==undefined&&s.isPointInPath(this.targetX,this.targetY)&&(this.currentTargetShapeId=e)},_drawCircle:function(e,t,n,r,i,s,o){var u=this._getContext(i,s,o);u.beginPath(),u.arc(t,n,r,0,2*Math.PI,!1),this.targetX!==undefined&&this.targetY!==undefined&&u.isPointInPath(this.targetX,this.targetY)&&(this.currentTargetShapeId=e),i!==undefined&&u.stroke(),s!==undefined&&u.fill()},_drawPieSlice:function(e,t,n,r,i,s,o,u){var a=this._getContext(o,u);a.beginPath(),a.moveTo(t,n),a.arc(t,n,r,i,s,!1),a.lineTo(t,n),a.closePath(),o!==undefined&&a.stroke(),u&&a.fill(),this.targetX!==undefined&&this.targetY!==undefined&&a.isPointInPath(this.targetX,this.targetY)&&(this.currentTargetShapeId=e)},_drawRect:function(e,t,n,r,i,s,o){return this._drawShape(e,[[t,n],[t+r,n],[t+r,n+i],[t,n+i],[t,n]],s,o)},appendShape:function(e){return this.shapes[e.id]=e,this.shapeseq.push(e.id),this.lastShapeId=e.id,e.id},replaceWithShape:function(e,t){var n=this.shapeseq,r;this.shapes[t.id]=t;for(r=n.length;r--;)n[r]==e&&(n[r]=t.id);delete this.shapes[e]},replaceWithShapes:function(e,t){var n=this.shapeseq,r={},i,s,o;for(s=e.length;s--;)r[e[s]]=!0;for(s=n.length;s--;)i=n[s],r[i]&&(n.splice(s,1),delete this.shapes[i],o=s);for(s=t.length;s--;)n.splice(o,0,t[s].id),this.shapes[t[s].id]=t[s]},insertAfterShape:function(e,t){var n=this.shapeseq,r;for(r=n.length;r--;)if(n[r]===e){n.splice(r+1,0,t.id),this.shapes[t.id]=t;return}},removeShapeId:function(e){var t=this.shapeseq,n;for(n=t.length;n--;)if(t[n]===e){t.splice(n,1);break}delete this.shapes[e]},getShapeAt:function(e,t,n){return this.targetX=t,this.targetY=n,this.render(),this.currentTargetShapeId},render:function(){var e=this.shapeseq,t=this.shapes,n=e.length,r=this._getContext(),i,s,o;r.clearRect(0,0,this.pixelWidth,this.pixelHeight);for(o=0;o<n;o++)i=e[o],s=t[i],this["_draw"+s.type].apply(this,s.args);this.interact||(this.shapes={},this.shapeseq=[])}}),_=r(O,{init:function(t,n,r){var i;_._super.init.call(this,t,n,r),r[0]&&(r=r[0]),e.data(r,"_jqs_vcanvas",this),this.canvas=document.createElement("span"),e(this.canvas).css({display:"inline-block",position:"relative",overflow:"hidden",width:t,height:n,margin:"0px",padding:"0px",verticalAlign:"top"}),this._insert(this.canvas,r),this._calculatePixelDims(t,n,this.canvas),this.canvas.width=this.pixelWidth,this.canvas.height=this.pixelHeight,i='<v:group coordorigin="0 0" coordsize="'+this.pixelWidth+" "+this.pixelHeight+'"'+' style="position:absolute;top:0;left:0;width:'+this.pixelWidth+"px;height="+this.pixelHeight+'px;"></v:group>',this.canvas.insertAdjacentHTML("beforeEnd",i),this.group=e(this.canvas).children()[0],this.rendered=!1,this.prerender=""},_drawShape:function(e,t,n,r,i){var s=[],o,u,a,f,l,c,h;for(h=0,c=t.length;h<c;h++)s[h]=""+t[h][0]+","+t[h][1];return o=s.splice(0,1),i=i===undefined?1:i,u=n===undefined?' stroked="false" ':' strokeWeight="'+i+'px" strokeColor="'+n+'" ',a=r===undefined?' filled="false"':' fillColor="'+r+'" filled="true" ',f=s[0]===s[s.length-1]?"x ":"",l='<v:shape coordorigin="0 0" coordsize="'+this.pixelWidth+" "+this.pixelHeight+'" '+' id="jqsshape'+e+'" '+u+a+' style="position:absolute;left:0px;top:0px;height:'+this.pixelHeight+"px;width:"+this.pixelWidth+'px;padding:0px;margin:0px;" '+' path="m '+o+" l "+s.join(", ")+" "+f+'e">'+" </v:shape>",l},_drawCircle:function(e,t,n,r,i,s,o){var u,a,f;return t-=r,n-=r,u=i===undefined?' stroked="false" ':' strokeWeight="'+o+'px" strokeColor="'+i+'" ',a=s===undefined?' filled="false"':' fillColor="'+s+'" filled="true" ',f='<v:oval  id="jqsshape'+e+'" '+u+a+' style="position:absolute;top:'+n+"px; left:"+t+"px; width:"+r*2+"px; height:"+r*2+'px"></v:oval>',f},_drawPieSlice:function(e,t,n,r,i,s,o,u){var a,f,l,c,h,p,d,v;if(i===s)return"";s-i===2*Math.PI&&(i=0,s=2*Math.PI),f=t+Math.round(Math.cos(i)*r),l=n+Math.round(Math.sin(i)*r),c=t+Math.round(Math.cos(s)*r),h=n+Math.round(Math.sin(s)*r);if(f===c&&l===h){if(s-i<Math.PI)return"";f=c=t+r,l=h=n}return f===c&&l===h&&s-i<Math.PI?"":(a=[t-r,n-r,t+r,n+r,f,l,c,h],p=o===undefined?' stroked="false" ':' strokeWeight="1px" strokeColor="'+o+'" ',d=u===undefined?' filled="false"':' fillColor="'+u+'" filled="true" ',v='<v:shape coordorigin="0 0" coordsize="'+this.pixelWidth+" "+this.pixelHeight+'" '+' id="jqsshape'+e+'" '+p+d+' style="position:absolute;left:0px;top:0px;height:'+this.pixelHeight+"px;width:"+this.pixelWidth+'px;padding:0px;margin:0px;" '+' path="m '+t+","+n+" wa "+a.join(", ")+' x e">'+" </v:shape>",v)},_drawRect:function(e,t,n,r,i,s,o){return this._drawShape(e,[[t,n],[t,n+i],[t+r,n+i],[t+r,n],[t,n]],s,o)},reset:function(){this.group.innerHTML=""},appendShape:function(e){var t=this["_draw"+e.type].apply(this,e.args);return this.rendered?this.group.insertAdjacentHTML("beforeEnd",t):this.prerender+=t,this.lastShapeId=e.id,e.id},replaceWithShape:function(t,n){var r=e("#jqsshape"+t),i=this["_draw"+n.type].apply(this,n.args);r[0].outerHTML=i},replaceWithShapes:function(t,n){var r=e("#jqsshape"+t[0]),i="",s=n.length,o;for(o=0;o<s;o++)i+=this["_draw"+n[o].type].apply(this,n[o].args);r[0].outerHTML=i;for(o=1;o<t.length;o++)e("#jqsshape"+t[o]).remove()},insertAfterShape:function(t,n){var r=e("#jqsshape"+t),i=this["_draw"+n.type].apply(this,n.args);r[0].insertAdjacentHTML("afterEnd",i)},removeShapeId:function(t){var n=e("#jqsshape"+t);this.group.removeChild(n[0])},getShapeAt:function(e,t,n){var r=e.id.substr(8);return r},render:function(){this.rendered||(this.group.innerHTML=this.prerender,this.rendered=!0)}})});
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//





;
