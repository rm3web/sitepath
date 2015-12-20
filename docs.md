# SitePath

A Site Path object

**Parameters**

-   `path` **string or SitePath or Object or undefined** will copy a SitePath, 
     convert an array into a SitePath, convert a dotted-string serialized ltree 
     into a sitepath, accept an Object with path, partial, and page keys, or
     construct an empty SitePath.

## down

Returns the child path of the current path (e.g. down('c') 
 from `a.b` returns `a.b.c`)

**Parameters**

-   `added` **string** The path to be added to the end

Returns **SitePath** the child path

## leaf

Returns the outermost 'leaf' component of the path.
(e.g. the leaf of `a.b.c` is going to be `c`)

Returns **string** the leaf node.

## pathArray

Serializes just the path into an array (e.g. no partial or page)

Returns **Array** the path, as an array

## toDottedPath

Serializes just the path seperated by dots, as PostgreSQL's ltree type expects

Returns **string** the path, separated by dots

## toUrl

Serializes just the path.  (e.g. no partial or page)

**Parameters**

-   `prefix` **string** The prefix, to be prepended to the url, e.g. 
     '<http://www.example.com/>'
-   `spl` **Number** How many nodes to lop off the front of the url 
     (0 or blank means put every path -- e.g. a.b.c becomes /a/b/c/.  1 means 
      a.b.c becomes /b/c/)

Returns **string** the path, as a URL

## up

Returns the parent path of the current path (e.g. up from `a.b.c` returns `a.b`)

Returns **SitePath** the parent path

## fromUrlSegment

Parses from a URL segment.

**Parameters**

-   `url` **string** 
-   `prefix` **Array** The path to be added to the end

**Examples**

```javascript
p = sitepath.fromUrlSegment('/cat', ['wh']);
 // returns SitePath('wh.cat');
```

```javascript
var p = sitepath.fromUrlSegment('/wh/cat');
 // returns SitePath('wh.cat');
```

Returns **SitePath** the child path
