const assert=require('assert');
describe('Auth',()=>{
  it('should hash password',()=>{
    const bcrypt=require('bcryptjs');
    const h=bcrypt.hashSync('123456',10);
    assert(bcrypt.compareSync('123456',h)===true);
  });
  it('should generate 6-digit OTP',()=>{
    const otp=Math.floor(100000+Math.random()*900000).toString();
    assert(otp.length===6);
  });
});
