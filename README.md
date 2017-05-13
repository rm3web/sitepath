# A self-describing URL path-like thing

[![Greenkeeper badge](https://badges.greenkeeper.io/rm3web/sitepath.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/rm3web/sitepath.svg?branch=master)](https://travis-ci.org/rm3web/sitepath)

This is a URL mapping scheme and utility library designed around the [PostgreSQL ltree data type](http://www.postgresql.org/docs/current/static/ltree.html)

On the database side, you have records accessible with a dot-separated path, say
`site.dir.page`.  On the user side, you want that accessible as `/dir/page/`.  Except that if you are storing large fancy objects in the database, maybe you want to have those accessible with some extra bits and bobs on the URL.

Ergo, you can have a SitePath that looks like this: `/dir/page/history.html` and it will still get the resource available at `site.dir.page` but you can see that there's a `history.html` page.

Finally, if you want to get really complicated and do things like paginated URLs, you can split things with a `/$/` to send a pagination offset.  Something like `/dir/page/$/offset/16`, perhaps.

Here's an example of a Express middleware that translates the URL to a path, where the root is `wh`:

```
function pathMap() {
  return function doPathMap(req, res, next) {
    req.sitepath = new Sitepath();
    req.sitepath.fromUrlSegment(req.path, ['wh']);
    next();
  };
}
```

For further documentation, see [docs](docs.md)

## Contributing

If you've found a bug:
 * Submit away!

If you'd like to submit a PR:
 * I do not expect you to smash multiple commits into a single commit.
 * Unless you say otherwise, I'm assuming "maintainer-fixes" style of merging, where I fix any quibbles and potentially make minor tweaks.  If you specify "maintainer-reviews", I'll maintain a list of things that I've identified for you to change.
 * If you've got a major patch in mind that's larger than an easily-mergable patch, you might consider writing up a blueprint describing what you want to do.

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms -- see [code of conduct](CODE_OF_CONDUCT.md)

## License?

BSD, see LICENSE.txt