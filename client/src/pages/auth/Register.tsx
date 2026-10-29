import { useState } from 'react';
export default function Register(){
  const [theme,setTheme]=useState('dark');
  const [form,setForm]=useState({name:'',email:'',phone:'',dob:'',role:'',password:'',confirm:''});
  const [err,setErr]=useState('');
  const dark=theme==='dark';
  const inputStyle={width:'100%',padding:'12px',margin:'8px 0',borderRadius:'10px',fontSize:'14px',boxSizing:'border-box' as const,
    background:dark?'#1e293b':'#ffffff',color:dark?'#ffffff':'#000000',border:dark?'1px solid #475569':'1px solid #cbd5e1'};
  const submit=async()=>{
    setErr('');
    if(form.password!==form.confirm){ setErr('Passwords do not match'); return; }
    try{
      const api=(import.meta as any).env.VITE_API_URL||'http://localhost:5000';
      const res=await fetch(api+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:form.name,email:form.email,password:form.password,role:form.role,dob:form.dob})});
      const data=await res.json();
      if(!res.ok){ setErr(data.error||'Registration failed'); return; }
      window.location.href='/verify-otp?uid='+encodeURIComponent(data.uid)+'&email='+encodeURIComponent(form.email)+'&name='+encodeURIComponent(form.name);
    }catch(e){ setErr('Server error. Try again.'); }
  };
  return(
    <div style={{background:dark?'#0a1628':'#f1f5f9',color:dark?'#fff':'#0a1628',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',padding:'16px'}}>
      <div style={{background:dark?'#111f3a':'#fff',padding:'28px',borderRadius:'16px',width:'100%',maxWidth:'380px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <h2 style={{margin:0,fontSize:'20px'}}>🏦 Create Account</h2>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{width:'40px',height:'32px',borderRadius:'8px',cursor:'pointer',background:dark?'#1e293b':'#fff',border:'1px solid #475569'}}>🌙</button>
        </div>
        {err&&<p style={{background:'#fee2e2',color:'#dc2626',padding:'10px',borderRadius:'8px',fontSize:'13px'}}>{err}</p>}
        <input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inputStyle} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={inputStyle} />
        <input placeholder="Contact Number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={inputStyle} />
        <input placeholder="Date of Birth DDMMYYYY" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} style={inputStyle} />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={inputStyle}>
          <option value="" disabled>Select your role</option><option>Customer</option><option>Admin</option><option>RiskManager</option><option>SupportAgent</option>
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={inputStyle} />
        <input type="password" placeholder="Confirm Password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} style={inputStyle} />
        <button onClick={submit} style={{...inputStyle,background:'#2563eb',color:'#fff',border:'none',fontWeight:'bold',cursor:'pointer'}}>SUBMIT</button>
        <p style={{textAlign:'center',fontSize:'13px'}}><a href="/login">Back to Login</a></p>
      </div>
    </div>
  );
}
