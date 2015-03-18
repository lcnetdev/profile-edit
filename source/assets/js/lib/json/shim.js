Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
  
Array.prototype.map = function(callback, thisArg) {

  var T, A, k;

  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the |this| 
  //    value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal 
  //    method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let A be a new array created as if by the expression new Array(len) 
  //    where Array is the standard built-in constructor with that name and 
  //    len is the value of len.
  A = new Array(len);

  // 7. Let k be 0
  k = 0;

  // 8. Repeat, while k < len
  while (k < len) {

    var kValue, mappedValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal 
    //    method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal 
      //    method of O with argument Pk.
      kValue = O[k];

      // ii. Let mappedValue be the result of calling the Call internal 
      //     method of callback with T as the this value and argument 
      //     list containing kValue, k, and O.
      mappedValue = callback.call(T, kValue, k, O);

      // iii. Call the DefineOwnProperty internal method of A with arguments
      // Pk, Property Descriptor
      // { Value: mappedValue,
      //   Writable: true,
      //   Enumerable: true,
      //   Configurable: true },
      // and false.

      // In browsers that support Object.defineProperty, use the following:
      // Object.defineProperty(A, k, {
      //   value: mappedValue,
      //   writable: true,
      //   enumerable: true,
      //   configurable: true
      // });

      // For best browser support, use the following:
      A[k] = mappedValue;
    }
    // d. Increase k by 1.
    k++;
  }

  // 9. return A
  return A;
};

Array.prototype.filter = function(fun/*, thisArg*/) {
  'use strict';

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== 'function') {
    throw new TypeError();
  }

  var res = [];
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t) {
      var val = t[i];

      // NOTE: Technically this should Object.defineProperty at
      //       the next index, as push can be affected by
      //       properties on Object.prototype and Array.prototype.
      //       But that method's new, and collisions should be
      //       rare, so use the more-compatible alternative.
      if (fun.call(thisArg, val, i, t)) {
        res.push(val);
      }
    }
  }

  return res;
};
  
  document.getElementsByClassName = 
Element.prototype.getElementsByClassName = function(class_names) {
    // Turn input in a string, prefix space for later space-dot substitution
    class_names = (' ' + class_names)
        // Escape special characters
        .replace(/[~!@$%^&*()_+\-=,./';:"?><[\]{}|`#]/g, '\\$&')
        // Normalize whitespace, right-trim
        .replace(/\s*(\s|$)/g, '$1')
        // Replace spaces with dots for querySelectorAll
        .replace(/\s/g, '.');
    return this.querySelectorAll(class_names);
};

"getComputedStyle" in window || function() {
  function c(a, b, g, e) {
    var h = b[g];
    b = parseFloat(h);
    h = h.split(/\d/)[0];
    e = null !== e ? e : /%|em/.test(h) && a.parentElement ? c(a.parentElement, a.parentElement.currentStyle, "fontSize", null) : 16;
    a = "fontSize" == g ? e : /width/i.test(g) ? a.clientWidth : a.clientHeight;
    return "em" == h ? b * e : "in" == h ? 96 * b : "pt" == h ? 96 * b / 72 : "%" == h ? b / 100 * a : b;
  }
  function a(a, c) {
    var b = "border" == c ? "Width" : "", e = c + "Top" + b, h = c + "Right" + b, l = c + "Bottom" + b, b = c + "Left" + b;
    a[c] = (a[e] == a[h] == a[l] == a[b] ? [a[e]] : a[e] == a[l] && a[b] == a[h] ? [a[e], a[h]] : a[b] == a[h] ? [a[e], a[h], a[l]] : [a[e], a[h], a[l], a[b]]).join(" ");
  }
  function b(b) {
    var d, g = b.currentStyle, e = c(b, g, "fontSize", null);
    for (d in g) {
      /width|height|margin.|padding.|border.+W/.test(d) && "auto" !== this[d] ? this[d] = c(b, g, d, e) + "px" : "styleFloat" === d ? this["float"] = g[d] : this[d] = g[d];
    }
    a(this, "margin");
    a(this, "padding");
    a(this, "border");
    this.fontSize = e + "px";
    return this;
  }
  b.prototype = {};
  window.getComputedStyle = function(a) {
    return new b(a);
  };
}();

Array.prototype.some = function(fun /*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
  
Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      var kValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
  
Array.isArray = function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};