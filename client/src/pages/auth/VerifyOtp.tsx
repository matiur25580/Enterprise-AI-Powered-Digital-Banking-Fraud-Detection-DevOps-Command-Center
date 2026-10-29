import {useState} from 'react';
export default function VerifyOtp(){
 const [otp,setOtp]=useState(['','','','','','']);
 const handle=(i,v)=>{const n=[...otp];n[i]=v.slice(-1);setOtp(n);};
 return 'OTP 6-box UI ready - 3 min timer logic to be connected';
}