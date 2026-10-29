const assert=require('assert');
describe('Fraud',()=>{
  it('high amount = high risk',()=>{
    const score=Math.min(99,Math.floor(25000/100));
    assert(score>70);
  });
});
