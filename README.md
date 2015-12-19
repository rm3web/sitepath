# A self-describing URL path-like thing

This is a URL mapping scheme and utility library designed around the [PostgreSQL ltree data type](http://www.postgresql.org/docs/current/static/ltree.html)

On the database side, you have records accessible with a dot-separated path, say
`site.dir.page`.  On the user side, you want that accessible as `/dir/page/`.  Except that if you are storing large fancy objects in the database, maybe you want to have those accessible with some extra bits and bobs on the URL.

Ergo, you can have a SitePath that looks like this: `/dir/page/history.html` and it will still get the resource available at `site.dir.page` but you can see that there's a `history.html` page.

Finally, if you want to get really complicated and do things like paginated URLs, you can split things with a `/$/` to send a pagination offset.  Something like `/dir/page/$/offset/16`, perhaps.

```<path>/<page>.<extension>/$/<partial>```

