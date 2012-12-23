var expect = require('chai').expect;

describe('Package', function(){
  describe('at creation', function(){
    it('should should have 0 hit', function(){
      expect([1,2,3].indexOf(5)).to.equal(-1);
      expect([1,2,3].indexOf(0)).to.equal(-1);
    });
  });
});
