var assert = require('chai').assert;
var player = require('../js/objects/player');
var expected, current;

before(function(){
  expected = ['a', 'b', 'c'];
})

describe('String#split', function(){
  beforeEach(function(){
    current = 'a,b,c'.split(',');
  })

  it('should return an array', function(){
    assert(Array.isArray(current));
  });

  it('should return the same array', function(){
    assert.equal(expected.length, current.length, 'arrays have equal lenght');
    for (var i=0; i<expected.length; i++){
      assert.equal(expected[i], current[i], i+'element is equal');
    }
  })
})
