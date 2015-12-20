var sitepath = require ('../');
var should = require('chai').should();

describe('sitepath', function() {
  describe('creation', function() {
    it('works with an array', function() {
      var p = new sitepath(['wh', 'hat']);
      var p2 = new sitepath(p);

      p.path.should.eql(['wh','hat']);
      should.not.exist(p.page);
      should.not.exist(p.partial);
      p.should.eql(p2);
    });

    it('works with a string', function() {
      var p = new sitepath('wh.hat');
      var p2 = new sitepath(p);

      p.path.should.eql(['wh','hat']);
      should.not.exist(p.page);
      should.not.exist(p.partial);
      p.should.eql(p2);
    });

    it('works with no value', function() {
      var p = new sitepath();
      var p2 = new sitepath(p);

      should.not.exist(p.path);
      should.not.exist(p.page);
      should.not.exist(p.partial);
      p.should.eql(p2);
    });

    it('works with an object', function() {
      var p = new sitepath({path: ['35'], page: 'fro.trt', partial: ['525']});
      var p2 = new sitepath(p);

      p.path.should.eql(['35']);
      p.page.should.eql('fro.trt');
      p.partial.should.eql(['525']);
      p.should.eql(p2);
    });

    it('works with an empty object', function() {
      var p = new sitepath({});

      should.not.exist(p.path);
      should.not.exist(p.page);
      should.not.exist(p.partial);
    });

    it('works from a dotted path', function() {
      var p = new sitepath('wh.bleh');

      p.path.should.eql(['wh', 'bleh']);
    });
  });

  describe('#pathArray()', function() {
    it('works', function() {
      var p = new sitepath(['wh', 'hat'], ['test']);

      p.pathArray().should.eql(['wh', 'hat']);
    });
  });

  describe('#toUrl()', function() {
    it('works', function() {
      var p = new sitepath(['wh', 'hat']);

      p.toUrl('http://www.wirewd.com/').should.equal('http://www.wirewd.com/wh/hat/');
      p.toUrl('http://www.wirewd.com/',1).should.equal('http://www.wirewd.com/hat/');

      p.toUrl('/').should.equal('/wh/hat/');
    });

    it('works for the top page', function() {
      var p = new sitepath(['wh']);

      p.toUrl('http://www.wirewd.com/',1).should.equal('http://www.wirewd.com/');
    });
  });

  describe('#toDottedPath()', function() {
    it('works', function() {
      var p = new sitepath(['wh', 'hat']);

      p.toDottedPath().should.equal('wh.hat');
    });
  });

  describe('#up()', function() {
    it('works', function() {

      var p = new sitepath(['wh', 'hat']);
      var p2 = new sitepath(['wh']);

      p2.should.eql(p.up());
    });
  });

  describe('#leaf()', function() {
    it('works', function() {

      var p = new sitepath(['wh', 'hat']);

      p.leaf().should.eql('hat');
    });
  });

  describe('#fromUrlSegment()', function() {
    it('works', function() {

      var p = sitepath.fromUrlSegment('/wh/suck');
      p.path.should.eql(['wh', 'suck']);

      var p2 = sitepath.fromUrlSegment('/wh/suck/');
      p2.path.should.eql(['wh', 'suck']);
    });

    it('works with a prefix', function() {
      var p = sitepath.fromUrlSegment('/suck', ['wh']);
      p.path.should.eql(['wh', 'suck']);
    });

    it('works with a bad segment', function() {
      var p = sitepath.fromUrlSegment('//suck///');
      p.path.should.eql(['suck']);
    });

    it('works with a file path', function() {
      var p = sitepath.fromUrlSegment('/suck/blah.html');

      p.path.should.eql(['suck']);
      p.page.should.eql('blah.html');
    });

    it('works with a partial', function() {
      var p = sitepath.fromUrlSegment('/suck/$/offset/15');
      p.path.should.eql(['suck']);
      should.not.exist(p.page);
      p.partial.should.eql(['offset', '15']);

      p = sitepath.fromUrlSegment('/suck/blah.txt/$/offset/15');
      p.path.should.eql(['suck']);
      p.page.should.eql('blah.txt');
      p.partial.should.eql(['offset', '15']);
    });

    it('throws when there\'s an invalid string', function() {
      

      (function() {
        var p = sitepath.fromUrlSegment('/suck/bla-.html');
      }).should.throw('validation error');
    });
  });

  describe('#down()', function() {
    it('works', function() {
      var p = new sitepath(['wh', 'hat']);
      var p2 = new sitepath(['wh']);

      p.should.eql(p2.down('hat'));
    });
  });

});
