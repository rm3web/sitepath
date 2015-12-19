/* istanbul ignore if  */
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

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

SitePath.prototype.leaf = function() {
  return this.path[this.path.length - 1];
};

SitePath.prototype.jsonSerialize = function() {
  return this.path.slice(0);
};

SitePath.prototype.toUrl = function(prefix, spl) {
  var pathSegment = this.path.slice(spl);
  var str = prefix + pathSegment.join('/');
  if (pathSegment.length !== 0) {
    return str + '/';
  } else {
    return str;
  }
};

SitePath.prototype.toDottedPath = function() {
  return this.path.join('.');
};

SitePath.prototype.up = function() {
  return new SitePath(this.path.slice(0, -1));
};

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
  if (url === undefined) {
    this.path = [];
  } else {
    var pth = url.toLowerCase().split('.');
    this._validatePathArray(pth);
    this.path = pth;
  }
};

SitePath.prototype.fromUrlSegment = function(url, prefix) {
  var arr = url.split('$'), pth;
  if (arr.length > 1) {
    this.partial = arr[1].split('/').slice(1);
    url = arr[0];
  } else {
    this.partial = undefined;
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
    this.page = pth.pop();
  }
  this._validatePathArray(pth);
  if (prefix === undefined) {
    this.path = [];
  } else {
    this.path = prefix;
  }
  this.path = this.path.concat(pth);
};

module.exports = exports = SitePath;
