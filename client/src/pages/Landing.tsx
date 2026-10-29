import { useState } from 'react';
export default function Landing(){
  const [theme,setTheme]=useState('dark');
  const dark=theme==='dark';
  const bg=dark?'#0a1628':'#f1f5f9';
  const cardBg=dark?'#111f3a':'#ffffff';
  const card={background:cardBg,padding:'20px',borderRadius:'16px',margin:'10px 0',boxShadow:'0 4px 16px rgba(0,0,0,0.2)'};
  return(
    <div style={{background:bg,color:dark?'#fff':'#0a1628',minHeight:'100vh'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px'}}>
        <b style={{fontSize:'20px'}}>🏦 TrustShield</b>
        <div>
          <button onClick={()=>setTheme(dark?'light':'dark')} style={{marginRight:'8px',padding:'8px 14px',borderRadius:'8px',border:'1px solid #475569',background:dark?'#1e293b':'#fff',color:dark?'#fff':'#000'}}>{dark?'☀️ Light':'🌙 Dark'}</button>
          <button onClick={()=>window.location.href='/login'} style={{marginRight:'8px',padding:'8px 16px',borderRadius:'8px',border:'1px solid #475569',background:'transparent',color:dark?'#fff':'#000'}}>Login</button>
          <button onClick={()=>window.location.href='/register'} style={{padding:'8px 16px',borderRadius:'8px',border:'none',background:'#f59e0b',color:'#000',fontWeight:'bold'}}>Get Started</button>
        </div>
      </nav>
      <div style={{textAlign:'center',padding:'30px 20px'}}>
        <p style={{color:'#f59e0b',fontWeight:'bold',letterSpacing:'2px',fontSize:'12px'}}>ENTERPRISE DIGITAL BANKING PLATFORM</p>
        <h1 style={{fontSize:'32px',margin:'12px 0'}}>AI-Powered Digital Banking<br/><span style={{color:'#f59e0b'}}>Fraud Detection Command Center</span></h1>
        <p style={{color:'#94a3b8',maxWidth:'480px',margin:'auto'}}>One platform for your entire bank — accounts, transactions, fraud detection, loans and support, secured in real time.</p>
        <div style={{marginTop:'16px'}}>
          <button onClick={()=>window.location.href='/register'} style={{padding:'12px 28px',borderRadius:'10px',border:'none',background:'#f59e0b',color:'#000',fontWeight:'bold',marginRight:'10px'}}>Open Account</button>
          <button onClick={()=>window.location.href='/login'} style={{padding:'12px 28px',borderRadius:'10px',border:'1px solid #475569',background:'transparent',color:dark?'#fff':'#000'}}>Login to Dashboard</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'10px',padding:'0 20px',flexWrap:'wrap'}}>
        {[['2,847','Customers'],['.2M','Volume'],['23','Modules'],['98.2%','AI Accuracy']].map((s,i)=>
          <div key={i} style={{...card,flex:1,minWidth:'120px',textAlign:'center' as const}}><h2 style={{margin:0,color:'#f59e0b'}}>{s[0]}</h2><p style={{margin:0,fontSize:'12px',color:'#94a3b8'}}>{s[1]}</p></div>
        )}
      </div>
      <div style={{padding:'20px'}}>
        <h2 style={{textAlign:'center'}}>Everything you need to run a bank</h2>
        <p style={{textAlign:'center',color:'#94a3b8',fontSize:'13px'}}>Built for scale, designed for trust.</p>
        {[
          ['🤖 AI Fraud Detection','Real-time transaction scoring with machine learning'],
          ['⚡ Instant Transfers','Send money in seconds with unique transaction IDs'],
          ['🏦 Smart Loans','Apply and track loans with automated approval'],
          ['📊 Wealth Analytics','Spending insights, credit score and savings goals'],
          ['🔐 Secure OTP Auth','Email OTP + 2FA authenticator protected routes'],
          ['👥 Role-Based Access','Admin, RiskManager, SupportAgent and Customer portals'],
        ].map((f,i)=><div key={i} style={card}><b>{f[0]}</b><p style={{margin:'4px 0',fontSize:'13px',color:'#94a3b8'}}>{f[1]}</p></div>)}
      </div>
      <div style={{padding:'20px'}}>
        <h2 style={{textAlign:'center'}}>Four portals, one command center</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[['Admin','#dc2626','Full command center: users, branches, audit'],['RiskManager','#7c3aed','AI fraud alerts, block/approve'],['SupportAgent','#0284c7','Tickets, KYC verify, customer 360'],['Customer','#16a34a','Transfer, statements, smart insights']].map((r,i)=>
            <div key={i} style={{...card,borderTop:}}><b style={{color:r[1]}}>{r[0]}</b><p style={{fontSize:'12px',color:'#94a3b8',margin:'4px 0'}}>{r[2]}</p></div>
          )}
        </div>
      </div>
      <div style={{textAlign:'center',padding:'20px'}}>
        <button onClick={()=>window.location.href='/register'} style={{padding:'14px 40px',borderRadius:'12px',border:'none',background:'#f59e0b',color:'#000',fontWeight:'bold',fontSize:'16px'}}>Create your account</button>
        <p style={{fontSize:'12px',color:'#94a3b8',marginTop:'16px'}}>TrustShield Bank — Enterprise AI-Powered Digital Banking Fraud Detection Command Center</p>
      </div>
    </div>
  );
}
