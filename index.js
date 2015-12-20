/* istanbul ignore if  */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/**
 * A Site Path object
 * @param {string | SitePath | Object | undefined} path will copy a SitePath, 
 *  convert an array into a SitePath, convert a dotted-string serialized ltree 
 *  into a sitepath, accept an Object with path, partial, and page keys, or
 *  construct an empty SitePath.
 * @constructor
 */

var SitePath = function(path) {
  this.path = undefined;
  this.partial = undefined;
  this.page = undefined;
  if (path instanceof SitePath) {
    if (path.path) {
      this.path = path.path.slice(0);
    }
    if (path.partial) {
      this.partial = path.partial.slice(0);
    }
    this.page = path.page;
  } else if (Array.isArray(path)) {
    this._validatePathArray(path);
    this.path = path;
    this.partial = undefined;
    this.page = undefined;
  } else if (typeof path === 'string' || path instanceof String) {
    this._fromDottedPath(path);
  } else if (path !== undefined) {
    if (path.hasOwnProperty('path')) {
      this.path = path.path;
    }
    if (path.hasOwnProperty('partial')) {
      this.partial = path.partial;
    }
    if (path.hasOwnProperty('page')) {
      this.page = path.page;
    }
  }
};

/**
 * Returns the outermost 'leaf' component of the path.
 * (e.g. the leaf of `a.b.c` is going to be `c`)
 * @returns {string} the leaf node.
 */
SitePath.prototype.leaf = function() {
  return this.path[this.path.length - 1];
};

/**
 * Serializes just the path into an array (e.g. no partial or page)
 * @returns {Array} the path, as an array
 */
SitePath.prototype.pathArray = function() {
  return this.path.slice(0);
};

/**
 * Serializes just the path.  (e.g. no partial or page)
 * @param {string} prefix The prefix, to be prepended to the url, e.g. 
 *  'http://www.example.com/'
 * @param {Number} spl How many nodes to lop off the front of the url 
 *  (0 or blank means put every path -- e.g. a.b.c becomes /a/b/c/.  1 means 
 *   a.b.c becomes /b/c/)
 * @returns {string} the path, as a URL
 */
SitePath.prototype.toUrl = function(prefix, spl) {
  var pathSegment = this.path.slice(spl);
  var str = prefix + pathSegment.join('/');
  if (pathSegment.length !== 0) {
    return str + '/';
  } else {
    return str;
  }
};

/**
 * Serializes just the path seperated by dots, as PostgreSQL's ltree type expects
 * @returns {string} the path, separated by dots
 */
SitePath.prototype.toDottedPath = function() {
  return this.path.join('.');
};

/**
 * Returns the parent path of the current path (e.g. up from `a.b.c` returns `a.b`)
 * @returns {SitePath} the parent path
 */
SitePath.prototype.up = function() {
  return new SitePath(this.path.slice(0, -1));
};

/**
 * Returns the child path of the current path (e.g. down('c') 
 *  from `a.b` returns `a.b.c`)
 * @param {string} added The path to be added to the end
 * @returns {SitePath} the child path
 */
SitePath.prototype.down = function(added) {
  return new SitePath(this.path.concat(added));
};

SitePath.prototype._validatePathArray = function(pathArray) {
  var re = /^[A-Za-z0-9]\w*$/;
  pathArray.forEach(function(element, i, array) {
    if (!re.test(element)) {
      throw new Error('validation error');
    }
  });
}

SitePath.prototype._fromDottedPath = function(url) {
  var pth = url.toLowerCase().split('.');
  this._validatePathArray(pth);
  this.path = pth;
};

/**
 * Parses from a URL segment.
 * @example
 *  p = sitepath.fromUrlSegment('/cat', ['wh']);
 *  // returns SitePath('wh.cat');
 * @example
 *  var p = sitepath.fromUrlSegment('/wh/cat');
 *  // returns SitePath('wh.cat');
 * @param {string} url 
 * @param {Array} prefix The path to be added to the end
 * @returns {SitePath} the child path
 */
SitePath.fromUrlSegment = function(url, prefix) {
  var newPath = new SitePath();
  var arr = url.split('$'), pth;
  if (arr.length > 1) {
    newPath.partial = arr[1].split('/').slice(1);
    url = arr[0];
  } else {
    newPath.partial = undefined;
  }
  pth = url.toLowerCase().split('/');
  pth = pth.filter(function(v, i, o) {
    if (v === '') {
      return false;
    } else {
      return true;
    }
  });
  var pagematch = /^\w+\.\w+$/;
  if (pagematch.test(pth.slice(-1))) {
    newPath.page = pth.pop();
  }
  newPath._validatePathArray(pth);
  if (prefix === undefined) {
    newPath.path = [];
  } else {
    newPath.path = prefix;
  }
  newPath.path = newPath.path.concat(pth);
  return newPath;
};

module.exports = exports = SitePath;
