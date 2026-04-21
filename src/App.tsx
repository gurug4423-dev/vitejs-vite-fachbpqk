import { useState, useMemo, useEffect, useRef, useCallback } from "react";
 
const TODAY = new Date("2026-04-20");
const STORAGE_KEY = "batt_ind_v3";
const ALERT_STATE_KEY = "batt_alert_v3";
 
const STAGE_NAMES = ["Supplier Hunt","NDA & Discussion","Quotation","DAP","PO / LOI","Manufacturing","Validation-PDI","Dispatch","I & C"];
 
const VENDOR_EMAILS = {"AMADA LASER WELD TECH":"amada@vendor.com","ITECH ROBOTICS":"info@itechrobotics.com","ROBOTECH":"contact@robotech.com","KEYENCE/COGNEX":"sales@keyence.com","IROBOTICS":"procurement@irobotics.com","FUJIYA NEBULA":"projects@fujiyaNebula.com","Tsumitomo Pvt Ltd":"info@tsumitomo.in","ADOFIL":"sales@adofil.com"};
 
const INIT = [
  {id:1,title:"Amada Laser Welding",vendor:"AMADA LASER WELD TECH",poc:"",pocEmail:"",subtasks:[{sub:"1.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Bus bar delay"},{sub:"1.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"1.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"1.4",name:"DAP",plan:null,actual:"2025-10-07",end:null,status:"Completed",remarks:""},{sub:"1.5",name:"PO / LOI",plan:null,actual:"2025-09-17",end:null,status:"Completed",remarks:""},{sub:"1.6",name:"Manufacturing",plan:"2026-01-07",actual:"2026-01-25",end:null,status:"Completed",remarks:""},{sub:"1.7",name:"Validation-PDI",plan:"2026-01-31",actual:"2026-02-06",end:null,status:"Completed",remarks:""},{sub:"1.8",name:"Dispatch",plan:"2026-02-06",actual:"2026-02-09",end:null,status:"Completed",remarks:""},{sub:"1.9",name:"I & C",plan:"2026-02-17",actual:null,end:"2026-02-28",status:"Pending",remarks:"20d overdue"}]},
  {id:2,title:"Compression Machine",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"2.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.4",name:"DAP",plan:null,actual:"2025-10-06",end:null,status:"Completed",remarks:""},{sub:"2.5",name:"PO / LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},{sub:"2.6",name:"Manufacturing",plan:null,actual:"2025-11-17",end:null,status:"Completed",remarks:""},{sub:"2.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.8",name:"Dispatch",plan:null,actual:"2025-08-12",end:null,status:"Completed",remarks:""},{sub:"2.9",name:"I & C",plan:null,actual:"2026-01-15",end:"2026-01-25",status:"Completed",remarks:""},{sub:"2.10",name:"Pilot Trial",plan:null,actual:null,end:null,status:"Pending",remarks:"Pallets required"}]},
  {id:3,title:"Cell Sorting",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"3.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Training 16/03"},{sub:"3.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},{sub:"3.5",name:"PO / LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},{sub:"3.6",name:"Manufacturing",plan:null,actual:"2025-01-15",end:null,status:"Completed",remarks:""},{sub:"3.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.8",name:"Dispatch",plan:null,actual:"2026-01-28",end:null,status:"Completed",remarks:""},{sub:"3.9",name:"I & C",plan:"2026-01-29",actual:"2026-02-23",end:"2026-03-14",status:"Completed",remarks:""}]},
  {id:4,title:"Conveyor Line HV",vendor:"ROBOTECH",poc:"",pocEmail:"",subtasks:[{sub:"4.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"PLC issues"},{sub:"4.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},{sub:"4.5",name:"PO / LOI",plan:null,actual:"2025-09-08",end:null,status:"Completed",remarks:""},{sub:"4.6",name:"Manufacturing",plan:"2024-12-05",actual:"2026-01-25",end:null,status:"Completed",remarks:""},{sub:"4.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.8",name:"Dispatch",plan:"2025-12-20",actual:"2026-01-26",end:null,status:"Completed",remarks:""},{sub:"4.9",name:"I & C",plan:"2025-12-25",actual:"2026-01-30",end:null,status:"Pending",remarks:"50d overdue"}]},
  {id:5,title:"Module Genealogy Auto",vendor:"KEYENCE/COGNEX",poc:"",pocEmail:"",subtasks:[{sub:"5.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation awaited"},{sub:"5.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"5.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:6,title:"Compression Pallets",vendor:"IROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"6.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation pending"},{sub:"6.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"6.3",name:"Quotation",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"6.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:7,title:"BMS Tester",vendor:"FUJIYA NEBULA",poc:"",pocEmail:"",subtasks:[{sub:"7.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Handover pending"},{sub:"7.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.4",name:"DAP",plan:null,actual:"2025-09-10",end:null,status:"Completed",remarks:""},{sub:"7.5",name:"PO / LOI",plan:null,actual:"2025-09-16",end:null,status:"Completed",remarks:""},{sub:"7.6",name:"Manufacturing",plan:null,actual:"2026-01-15",end:null,status:"Completed",remarks:""},{sub:"7.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.8",name:"Dispatch",plan:"2025-12-20",actual:"2026-03-16",end:null,status:"Completed",remarks:""},{sub:"7.9",name:"I & C",plan:"2026-03-18",actual:"2026-03-26",end:null,status:"Completed",remarks:""}]},
  {id:8,title:"CDC Expansion",vendor:"Tsumitomo Pvt Ltd",poc:"",pocEmail:"",subtasks:[{sub:"8.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Done"},{sub:"8.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.5",name:"PO / LOI",plan:null,actual:"2025-10-05",end:null,status:"Completed",remarks:""},{sub:"8.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.9",name:"I & C",plan:null,actual:"2025-10-10",end:null,status:"Completed",remarks:""}]},
  {id:9,title:"Epoxy Flooring 3mm",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"9.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.5",name:"PO / LOI",plan:null,actual:"2025-11-07",end:null,status:"Completed",remarks:""},{sub:"9.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.8",name:"Dispatch",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""},{sub:"9.9",name:"I & C",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""}]},
  {id:10,title:"Adhesive Dispensing",vendor:"ADOFIL",poc:"",pocEmail:"",subtasks:[{sub:"10.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Awaiting PO"},{sub:"10.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"10.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
];
 
const parseDate = d => { if (!d) return null; const x = new Date(d); return isNaN(x) ? null : x; };
const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const daysDiff = (a,b) => Math.round((b-a)/86400000);
const computeProgress = t => !t.subtasks.length ? 0 : Math.round(t.subtasks.filter(s=>s.status==="Completed").length/t.subtasks.length*100);
const getStatus = t => { const p=computeProgress(t); if(p===100)return"Completed"; if(t.subtasks.some(s=>s.status==="Pending"))return"Pending"; if(p>0)return"In Progress"; return"Not Started"; };
const isOD = s => { const d=parseDate(s.end)||parseDate(s.plan); return s.status==="Pending"&&d&&daysDiff(d,TODAY)>0; };
 
const G_MONTHS=["Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"];
const G_STARTS=[new Date("2025-09-01"),new Date("2025-10-01"),new Date("2025-11-01"),new Date("2025-12-01"),new Date("2026-01-01"),new Date("2026-02-01"),new Date("2026-03-01"),new Date("2026-04-01"),new Date("2026-05-01")];
const G_START=G_STARTS[0];
const G_TOTAL=daysDiff(G_START,new Date("2026-05-31"));
const gP=d=>Math.max(0,Math.min(100,daysDiff(G_START,new Date(d))/G_TOTAL*100));
 
const playTone = type => {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const p={critical:[[880,0,.06],[660,.08,.06],[880,.16,.1]],warning:[[523,0,.08],[659,.1,.08]],success:[[523,0,.05],[784,.08,.1]],info:[[440,0,.07]]};
    (p[type]||p.info).forEach(([f,s,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0,ctx.currentTime+s);g.gain.linearRampToValueAtTime(.18,ctx.currentTime+s+.01);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+s+d);o.start(ctx.currentTime+s);o.stop(ctx.currentTime+s+d+.05);});
  } catch {}
};
 
const SC={
  "Completed":{bg:"#f0fdf4",text:"#16a34a",border:"#bbf7d0"},
  "Pending":{bg:"#fffbeb",text:"#d97706",border:"#fde68a"},
  "In Progress":{bg:"#eff6ff",text:"#2563eb",border:"#bfdbfe"},
  "Not Started":{bg:"#f8fafc",text:"#94a3b8",border:"#e2e8f0"},
};
const getSC = s => SC[s]||SC["Not Started"];
 
const seenAlerts = (() => { try { return new Set(JSON.parse(localStorage.getItem(ALERT_STATE_KEY)||"[]")); } catch { return new Set(); } })();
const shouldFire = key => !seenAlerts.has(key);
const markFired = key => { seenAlerts.add(key); try { localStorage.setItem(ALERT_STATE_KEY,JSON.stringify([...seenAlerts].slice(-300))); } catch {} };
 
const ACCENTS=["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316","#6366f1","#84cc16","#a855f7"];
 
function Badge({status}){const sc=getSC(status);return(<span style={{padding:"2px 8px",borderRadius:2,fontSize:10,fontWeight:600,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,letterSpacing:.4,whiteSpace:"nowrap"}}>{status}</span>);}
 
function NotifPanel({notifs,unread,onClear,onClearAll,onRead}){
  const[open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  const col=t=>t==="critical"?"#ef4444":t==="warning"?"#f59e0b":t==="success"?"#22c55e":"#3b82f6";
  const lbl=t=>t==="critical"?"▲":t==="warning"?"!":t==="success"?"✓":"i";
  return(
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>{setOpen(o=>!o);if(!open)onRead();}} style={{position:"relative",background:"transparent",border:"1px solid #e2e8f0",borderRadius:3,width:34,height:34,cursor:"pointer",color:"#64748b",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .12s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#94a3b8"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
        ◻{unread>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#ef4444",color:"#fff",borderRadius:"50%",width:15,height:15,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid #fff"}}>{unread>9?"9+":unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:40,width:320,background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:3,boxShadow:"0 8px 32px rgba(15,23,42,.12)",zIndex:300,overflow:"hidden"}}>
          <div style={{padding:"9px 13px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#64748b",fontSize:9,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>Alerts</span>
            {notifs.length>0&&<button onClick={onClearAll} style={{background:"none",border:"none",color:"#94a3b8",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Clear all</button>}
          </div>
          <div style={{maxHeight:340,overflowY:"auto"}}>
            {notifs.length===0
              ?<div style={{padding:"22px 14px",textAlign:"center",color:"#94a3b8",fontSize:11}}>No alerts</div>
              :notifs.map(n=>(
                <div key={n.id} style={{padding:"9px 13px",borderBottom:"1px solid #e2e8f0",display:"flex",gap:9,alignItems:"flex-start",background:n.read?"#ffffff":"#f8fafc"}}>
                  <span style={{width:16,height:16,borderRadius:2,background:col(n.type)+"1a",color:col(n.type),fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,border:`1px solid ${col(n.type)}33`}}>{lbl(n.type)}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#1e293b",marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>{n.body}</div>
                    <div style={{fontSize:9,color:"#94a3b8",marginTop:3}}>{n.time}</div>
                  </div>
                  <button onClick={()=>onClear(n.id)} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:12}}>×</button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
 
function AddModal({onClose,onAdd,nextId}){
  const[step,setStep]=useState(1);
  const[title,setTitle]=useState("");
  const[vendor,setVendor]=useState("");
  const[poc,setPoc]=useState("");
  const[pocEmail,setPocEmail]=useState("");
  const[stgs,setStgs]=useState(STAGE_NAMES.map(n=>({name:n,enabled:true})));
  const[dates,setDates]=useState(STAGE_NAMES.map(()=>({plan:"",actual:"",end:"",status:"Not Started",remarks:""})));
  const updD=(i,f,v)=>{const u=[...dates];u[i]={...u[i],[f]:v};setDates(u);};
  const togS=i=>{const u=[...stgs];u[i]={...u[i],enabled:!u[i].enabled};setStgs(u);};
  const doAdd=()=>{const subtasks=stgs.filter(s=>s.enabled).map((s,i)=>{const si=STAGE_NAMES.indexOf(s.name);const d=dates[si]||{};return{sub:`${nextId}.${i+1}`,name:s.name,plan:d.plan||null,actual:d.actual||null,end:d.end||null,status:d.status||"Not Started",remarks:d.remarks||""};});onAdd({id:nextId,title:title.trim(),vendor:vendor.trim(),poc:poc.trim(),pocEmail:pocEmail.trim(),subtasks});onClose();};
  const inp={width:"100%",padding:"8px 10px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:3,color:"#0f172a",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const lbl=(l,v,s,t="text",ph="")=>(<div style={{marginBottom:11}}><label style={{display:"block",fontSize:9,fontWeight:600,color:"#64748b",letterSpacing:.8,textTransform:"uppercase",marginBottom:4}}>{l}</label><input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={ph} style={inp} onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/></div>);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,41,59,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:4,width:"100%",maxWidth:620,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(15,23,42,.15)"}}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8f9fa"}}>
          <div><div style={{color:"#94a3b8",fontSize:9,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>New project · step {step}/2</div><div style={{color:"#0f172a",fontSize:14,fontWeight:600,marginTop:3,fontFamily:"'IBM Plex Sans',sans-serif"}}>{step===1?"Project details":title}</div></div>
          <button onClick={onClose} style={{background:"none",border:"1px solid #cbd5e1",color:"#64748b",width:28,height:28,borderRadius:3,cursor:"pointer",fontSize:14}}>×</button>
        </div>
        <div style={{display:"flex"}}><div style={{flex:1,height:2,background:step>=1?"#3b82f6":"#1e1e1e"}}/><div style={{flex:1,height:2,background:step>=2?"#3b82f6":"#1e1e1e"}}/></div>
        <div style={{overflowY:"auto",flex:1,padding:"18px 20px"}}>
          {step===1&&(<div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}><div style={{gridColumn:"1/-1"}}>{lbl("Project title *",title,setTitle,"text","e.g. Laser Welding Machine")}</div>{lbl("Vendor / supplier",vendor,setVendor,"text","e.g. AMADA")}{lbl("Vendor email",pocEmail,setPocEmail,"email","vendor@email.com")}{lbl("POC",poc,setPoc,"text","Your name")}</div><div style={{marginTop:4}}><label style={{display:"block",fontSize:9,fontWeight:600,color:"#64748b",letterSpacing:.8,textTransform:"uppercase",marginBottom:8}}>Stages</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{stgs.map((s,i)=>(<button key={s.name} onClick={()=>togS(i)} style={{padding:"5px 12px",borderRadius:3,fontSize:11,cursor:"pointer",fontFamily:"inherit",transition:"all .12s",border:s.enabled?"1px solid #3b82f6":"1px solid #cbd5e1",background:s.enabled?"#eff6ff":"#f8fafc",color:s.enabled?"#2563eb":"#94a3b8"}}>{s.enabled?"✓ ":""}{s.name}</button>))}</div></div></div>)}
          {step===2&&(<div><div style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:3,padding:"8px 11px",marginBottom:12,fontSize:10,color:"#94a3b8"}}>Dates are optional — edit anytime later.</div><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr style={{borderBottom:"1px solid #e2e8f0"}}>{["Stage","Plan","Actual","End","Status"].map(h=>(<th key={h} style={{padding:"6px 9px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.6,textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{stgs.filter(s=>s.enabled).map(s=>{const si=STAGE_NAMES.indexOf(s.name);const d=dates[si]||{};return(<tr key={s.name} style={{borderBottom:"1px solid #f1f5f9"}}><td style={{padding:"7px 9px",color:"#1e293b",fontWeight:500,whiteSpace:"nowrap"}}>{s.name}</td>{["plan","actual","end"].map(f=>(<td key={f} style={{padding:"3px 5px"}}><input type="date" value={d[f]||""} onChange={e=>updD(si,f,e.target.value||null)} style={{padding:"4px 7px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:2,color:"#475569",fontSize:10,fontFamily:"inherit",outline:"none"}}/></td>))}<td style={{padding:"3px 5px"}}><select value={d.status||"Not Started"} onChange={e=>updD(si,"status",e.target.value)} style={{padding:"4px 7px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:2,color:"#475569",fontSize:10,fontFamily:"inherit",outline:"none"}}>{["Not Started","Pending","In Progress","Completed"].map(st=><option key={st} style={{background:"#ffffff"}}>{st}</option>)}</select></td></tr>);})}</tbody></table></div></div>)}
        </div>
        <div style={{padding:"13px 20px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",background:"#f8f9fa"}}>
          <button onClick={step===1?onClose:()=>setStep(1)} className="btn-ghost">{step===1?"Cancel":"← Back"}</button>
          <button onClick={step===1?()=>{if(title.trim())setStep(2);}:doAdd} disabled={!title.trim()} style={{padding:"7px 20px",border:"none",borderRadius:3,background:title.trim()?"#3b82f6":"#e2e8f0",color:title.trim()?"#fff":"#94a3b8",cursor:title.trim()?"pointer":"not-allowed",fontFamily:"inherit",fontSize:11,fontWeight:600}}>{step===1?"Next →":"Add project"}</button>
        </div>
      </div>
    </div>
  );
}
 
function EditModal({task,onClose,onSave}){
  const[subs,setSubs]=useState(task.subtasks.map(s=>({...s})));
  const[vendor,setVendor]=useState(task.vendor||"");
  const[poc,setPoc]=useState(task.poc||"");
  const[pocEmail,setPocEmail]=useState(task.pocEmail||"");
  const upd=(i,f,v)=>{const u=[...subs];u[i]={...u[i],[f]:v};setSubs(u);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,41,59,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:4,width:"100%",maxWidth:860,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(15,23,42,.15)"}}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8f9fa"}}>
          <div><div style={{color:"#94a3b8",fontSize:9,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>Edit project</div><div style={{color:"#0f172a",fontSize:14,fontWeight:600,marginTop:3,fontFamily:"'IBM Plex Sans',sans-serif"}}>{task.title}</div></div>
          <button onClick={onClose} style={{background:"none",border:"1px solid #cbd5e1",color:"#64748b",width:28,height:28,borderRadius:3,cursor:"pointer",fontSize:14}}>×</button>
        </div>
        <div style={{padding:"12px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",gap:11,flexWrap:"wrap",background:"#f8f9fa"}}>
          {[["Vendor",vendor,setVendor],["POC",poc,setPoc],["Email",pocEmail,setPocEmail]].map(([l,v,s])=>(<div key={l} style={{flex:1,minWidth:130}}><label style={{display:"block",fontSize:9,fontWeight:600,color:"#64748b",letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>{l}</label><input value={v} onChange={e=>s(e.target.value)} style={{width:"100%",padding:"6px 9px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:3,color:"#0f172a",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/></div>))}
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f8f9fa",position:"sticky",top:0,borderBottom:"1px solid #e2e8f0"}}>{["#","Stage","Plan","Actual","End","Status","Remarks"].map(h=>(<th key={h} style={{padding:"8px 11px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.6,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
            <tbody>{subs.map((s,i)=>{const sc=getSC(s.status);const ov=isOD(s);return(<tr key={s.sub} style={{borderBottom:"1px solid #f1f5f9",background:ov?"#fff1f2":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=ov?"#ffe4e6":"#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=ov?"#fff1f2":"transparent"}><td style={{padding:"8px 11px",color:"#94a3b8",fontFamily:"monospace",fontSize:9}}>{s.sub}</td><td style={{padding:"8px 11px",color:"#1e293b",fontWeight:500}}>{s.name}</td>{["plan","actual","end"].map(f=>(<td key={f} style={{padding:"3px 6px"}}><input type="date" value={s[f]||""} onChange={e=>upd(i,f,e.target.value||null)} style={{padding:"4px 7px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:2,color:"#475569",fontSize:10,fontFamily:"inherit",outline:"none"}}/></td>))}<td style={{padding:"3px 6px"}}><select value={s.status||"Not Started"} onChange={e=>upd(i,"status",e.target.value)} style={{padding:"4px 7px",background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:2,color:sc.text,fontSize:10,fontFamily:"inherit",outline:"none",fontWeight:600}}>{["Completed","Pending","Not Started","In Progress"].map(st=>(<option key={st} style={{background:"#ffffff",color:"#0f172a"}}>{st}</option>))}</select></td><td style={{padding:"3px 6px"}}><input value={s.remarks||""} onChange={e=>upd(i,"remarks",e.target.value)} style={{padding:"4px 7px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:2,color:"#475569",fontSize:10,fontFamily:"inherit",outline:"none",width:160}}/></td></tr>);})}</tbody>
          </table>
        </div>
        <div style={{padding:"12px 20px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"flex-end",gap:8,background:"#f8f9fa"}}>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={()=>onSave({...task,vendor,poc,pocEmail,subtasks:subs})} style={{padding:"7px 20px",border:"none",borderRadius:3,background:"#3b82f6",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
 
function EmailModal({task,onClose}){
  const ve=task.pocEmail||VENDOR_EMAILS[task.vendor]||"";
  const[to,setTo]=useState(ve);const[cc,setCc]=useState("pm@company.com");const[subj,setSubj]=useState(`Action Required: ${task.title}`);
  const pend=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started");
  const[body,setBody]=useState(`Dear ${task.vendor||"Team"},\n\nReminder for: ${task.title}\n\nPending items:\n${pend.map(s=>`  - ${s.sub} ${s.name}${s.remarks?` (${s.remarks})`:""}`).join("\n")||"  - None"}\n\nKindly provide an update.\n\nRegards,\nBattery Industrialization Team`);
  const inp={width:"100%",padding:"7px 10px",background:"#f1f5f9",border:"1px solid #cbd5e1",borderRadius:3,color:"#0f172a",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,41,59,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#ffffff",border:"1px solid #cbd5e1",borderRadius:4,width:"100%",maxWidth:560,boxShadow:"0 24px 80px rgba(15,23,42,.15)"}}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f8f9fa"}}>
          <div><div style={{color:"#94a3b8",fontSize:9,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>Compose reminder</div><div style={{color:"#0f172a",fontSize:13,fontWeight:600,marginTop:3,fontFamily:"'IBM Plex Sans',sans-serif"}}>{task.title}</div></div>
          <button onClick={onClose} style={{background:"none",border:"1px solid #cbd5e1",color:"#64748b",width:28,height:28,borderRadius:3,cursor:"pointer",fontSize:14}}>×</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          {[["To",to,setTo,"email"],["CC",cc,setCc,"email"],["Subject",subj,setSubj,"text"]].map(([l,v,s,t])=>(<div key={l} style={{marginBottom:9}}><label style={{display:"block",fontSize:9,fontWeight:600,color:"#64748b",letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>{l}</label><input type={t} value={v} onChange={e=>s(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/></div>))}
          <label style={{display:"block",fontSize:9,fontWeight:600,color:"#64748b",letterSpacing:.7,textTransform:"uppercase",marginBottom:4}}>Message</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{...inp,resize:"vertical",lineHeight:1.6,fontSize:11,fontFamily:"monospace"}} onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#cbd5e1"}/>
          <div style={{display:"flex",gap:7,marginTop:12,justifyContent:"flex-end"}}>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={()=>{window.open(`mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`,"_blank");onClose();}} style={{padding:"7px 20px",border:"none",borderRadius:3,background:"#3b82f6",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>Open in mail app</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default function App(){
  const[tasks,setTasks]=useState(()=>{try{const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):INIT;}catch{return INIT;}});
  const[notifs,setNotifs]=useState([]);
  const[unread,setUnread]=useState(0);
  const[tab,setTab]=useState("overview");
  const[emailTask,setEmailTask]=useState(null);
  const[editTask,setEditTask]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[filter,setFilter]=useState("All");
  const[expanded,setExpanded]=useState(null);
  const[notifPerm,setNotifPerm]=useState("default");
  const[syncTime,setSyncTime]=useState(Date.now());
  const idRef=useRef(0);
 
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}catch{}},[tasks]);
  useEffect(()=>{if("Notification"in window){setNotifPerm(Notification.permission);if(Notification.permission==="default")Notification.requestPermission().then(p=>setNotifPerm(p));}},[]);
 
  const push=useCallback((title,body,type="info",key=null)=>{
    const alertKey=key||`${title}|${body}`;
    if(!shouldFire(alertKey))return;
    markFired(alertKey);
    const id=++idRef.current;
    const time=new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setNotifs(prev=>[{id,title,body,type,time,read:false},...prev.slice(0,49)]);
    setUnread(u=>u+1);
    playTone(type);
    if("Notification"in window&&Notification.permission==="granted"){try{const n=new Notification(`Battery Timeline — ${title}`,{body,tag:alertKey,silent:false});setTimeout(()=>n.close(),5000);}catch{}}
  },[]);
 
  useEffect(()=>{
    tasks.forEach(task=>{
      task.subtasks.forEach(s=>{
        if(!isOD(s))return;
        const d=parseDate(s.end)||parseDate(s.plan);
        const od=daysDiff(d,TODAY);
        push(`Overdue: ${task.title}`,`${s.name} — ${od}d overdue. Vendor: ${task.vendor||"TBD"}`,"critical",`od|${task.id}|${s.sub}|${od}`);
      });
      const pc=task.subtasks.filter(s=>s.status==="Pending"&&!isOD(s)).length;
      if(pc>0)push(`Pending: ${task.title}`,`${pc} stage(s) awaiting action.`,"warning",`pnd|${task.id}|${pc}`);
    });
  },[]); // eslint-disable-line
 
  useEffect(()=>{
    const iv=setInterval(()=>{
      setSyncTime(Date.now());
      tasks.forEach(task=>{
        task.subtasks.forEach(s=>{
          if(!isOD(s))return;
          const d=parseDate(s.end)||parseDate(s.plan);
          const od=daysDiff(d,TODAY);
          push(`Overdue: ${task.title}`,`${s.name} — ${od}d overdue`,"critical",`od|${task.id}|${s.sub}|${od}`);
        });
      });
    },30000);
    return()=>clearInterval(iv);
  },[tasks,push]);
 
  const stats=useMemo(()=>{
    const t=tasks.length,c=tasks.filter(x=>getStatus(x)==="Completed").length,p=tasks.filter(x=>getStatus(x)==="Pending").length,i=tasks.filter(x=>getStatus(x)==="In Progress").length,n=tasks.filter(x=>getStatus(x)==="Not Started").length,o=tasks.flatMap(x=>x.subtasks).filter(isOD).length,ap=t?Math.round(tasks.reduce((a,x)=>a+computeProgress(x),0)/t):0;
    return{t,c,p,i,n,o,ap};
  },[tasks]);
 
  const filtered=useMemo(()=>filter==="All"?tasks:tasks.filter(t=>getStatus(t)===filter),[tasks,filter]);
  const nextId=useMemo(()=>Math.max(...tasks.map(t=>t.id),0)+1,[tasks]);
  const handleAdd=t=>{setTasks(p=>[...p,t]);push("Project added",`"${t.title}" added.`,"success",`add|${t.id}|${Date.now()}`);};
  const handleSave=u=>{setTasks(p=>p.map(t=>t.id===u.id?u:t));seenAlerts.clear();try{localStorage.removeItem(ALERT_STATE_KEY);}catch{}setEditTask(null);push("Saved",`"${u.title}" updated.`,"info",`sav|${u.id}|${Date.now()}`);};
  const handleDel=id=>{const t=tasks.find(x=>x.id===id);if(window.confirm(`Remove "${t?.title}"?`)){setTasks(p=>p.filter(x=>x.id!==id));push("Removed",`"${t?.title}" deleted.`,"info",`del|${id}|${Date.now()}`);};};
 
  const TABS=[{id:"overview",l:"Overview"},{id:"gantt",l:"Gantt"},{id:"tasks",l:"Tasks"},{id:"reminders",l:"Reminders"}];
 
  return(
    <div style={{fontFamily:"'IBM Plex Mono','Courier New',monospace",background:"#f8f9fa",minHeight:"100vh",color:"#0f172a"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:4px;height:4px;}::-webkit-scrollbar-track{background:#f1f5f9;}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:2px;}.row-h:hover{background:#f8fafc!important;}.btn-ghost{background:transparent;border:1px solid #e2e8f0;color:#64748b;padding:5px 11px;border-radius:3px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:500;transition:all .12s;letter-spacing:.3px;}.btn-ghost:hover{border-color:#94a3b8;color:#475569;}`}</style>
 
      {/* TOPBAR */}
      <div style={{background:"#f8f9fa",borderBottom:"1px solid #e2e8f0",padding:"0 22px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,height:50,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
              <div style={{width:22,height:22,background:"#3b82f6",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>B</div>
              <div><div style={{color:"#0f172a",fontSize:12,fontWeight:600,letterSpacing:.2}}>Battery Industrialization</div><div style={{color:"#cbd5e1",fontSize:9,letterSpacing:.8,textTransform:"uppercase"}}>HV Line · Timeline</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"3px 9px",border:"1px solid #e2e8f0",borderRadius:3}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 4px #22c55e"}}/>
              <span style={{color:"#94a3b8",fontSize:9,fontWeight:600,letterSpacing:.8,textTransform:"uppercase"}}>Live</span>
              <span style={{color:"#94a3b8",fontSize:9}}>· {new Date(syncTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
            </div>
            {/* KPI strip */}
            <div style={{display:"flex",gap:0,flex:1,flexWrap:"wrap"}}>
              {[{l:"Projects",v:stats.t,c:"#374151"},{l:"Done",v:stats.c,c:"#22c55e"},{l:"Active",v:stats.i,c:"#3b82f6"},{l:"Pending",v:stats.p,c:"#f59e0b"},{l:"Overdue",v:stats.o,c:"#ef4444"},{l:"Completion",v:`${stats.ap}%`,c:"#60a5fa"}].map(s=>(
                <div key={s.l} style={{padding:"0 13px",borderRight:"1px solid #e2e8f0",display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:13,fontWeight:600,color:s.c,fontFamily:"'IBM Plex Mono',monospace",lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:9,color:"#94a3b8",letterSpacing:.7,textTransform:"uppercase",marginTop:2}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
              {notifPerm!=="granted"&&<button className="btn-ghost" onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled","Push notifications active.","success",`perm|${Date.now()}`)})} style={{color:"#f59e0b",borderColor:"#3d2a00",fontSize:10}}>Enable alerts</button>}
              <button onClick={()=>setShowAdd(true)} style={{padding:"6px 15px",border:"none",borderRadius:3,background:"#3b82f6",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,letterSpacing:.3}}>+ Add task</button>
              <NotifPanel notifs={notifs} unread={unread} onClear={id=>setNotifs(p=>p.filter(n=>n.id!==id))} onClearAll={()=>{setNotifs([]);setUnread(0);}} onRead={()=>setUnread(0)}/>
            </div>
          </div>
          <div style={{display:"flex",gap:0}}>
            {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 15px",border:"none",borderBottom:`2px solid ${tab===t.id?"#3b82f6":"transparent"}`,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:tab===t.id?600:400,color:tab===t.id?"#0f172a":"#94a3b8",letterSpacing:.3,transition:"all .12s"}}>{t.l}</button>))}
          </div>
        </div>
      </div>
 
      {/* CONTENT */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"18px 22px"}}>
 
        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,padding:"14px 18px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                <span style={{fontSize:9,color:"#94a3b8",letterSpacing:.8,textTransform:"uppercase",fontWeight:600}}>Overall completion</span>
                <span style={{fontSize:17,fontWeight:600,color:"#2563eb",fontFamily:"'IBM Plex Mono',monospace"}}>{stats.ap}%</span>
              </div>
              <div style={{background:"#e2e8f0",borderRadius:1,height:3}}><div style={{width:`${stats.ap}%`,height:"100%",background:"#3b82f6",borderRadius:1,transition:"width 1s ease"}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:9}}>
              {tasks.map((task,idx)=>{
                const pr=computeProgress(task),st=getStatus(task),sc=getSC(st),col=ACCENTS[idx%ACCENTS.length];
                const od=task.subtasks.filter(isOD),pnd=task.subtasks.filter(s=>s.status==="Pending"&&!isOD(s));
                return(
                  <div key={task.id} style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,overflow:"hidden",transition:"border-color .15s",borderLeft:`2px solid ${col}`}} onMouseEnter={e=>e.currentTarget.style.borderColor="#94a3b8"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                        <div style={{flex:1}}><div style={{fontSize:9,color:"#cbd5e1",letterSpacing:.7,textTransform:"uppercase",marginBottom:3}}>#{String(task.id).padStart(2,"0")} · {task.vendor||"—"}</div><div style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.3,fontFamily:"'IBM Plex Sans',sans-serif"}}>{task.title}</div></div>
                        <Badge status={st}/>
                      </div>
                      <div style={{marginBottom:9}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:"#94a3b8",letterSpacing:.6,textTransform:"uppercase"}}>Progress</span><span style={{fontSize:9,fontWeight:600,color:col,fontFamily:"'IBM Plex Mono',monospace"}}>{pr}%</span></div>
                        <div style={{background:"#e2e8f0",borderRadius:1,height:2}}><div style={{width:`${pr}%`,height:"100%",background:col,borderRadius:1}}/></div>
                      </div>
                      {od.length>0&&<div style={{background:"#fff1f2",border:"1px solid #fecaca",borderRadius:2,padding:"4px 8px",marginBottom:7,fontSize:9,color:"#f87171"}}>▲ {od.map(s=>s.name).join(", ")} — overdue</div>}
                      {pnd.length>0&&!od.length&&<div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:2,padding:"4px 8px",marginBottom:7,fontSize:9,color:"#fbbf24"}}>! {pnd.map(s=>s.name).join(", ")} — pending</div>}
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn-ghost" onClick={()=>setEditTask(task)} style={{flex:1,fontSize:10}}>Edit</button>
                        <button className="btn-ghost" onClick={()=>setEmailTask(task)} style={{flex:1,fontSize:10}}>Email</button>
                        <button className="btn-ghost" onClick={()=>push(`Reminder: ${task.title}`,`${(pnd.length+od.length)} items need attention.`,od.length?"critical":"warning",`man|${task.id}|${Date.now()}`)} style={{fontSize:10,padding:"5px 9px"}}>Alert</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div onClick={()=>setShowAdd(true)} style={{background:"#f8f9fa",border:"1px dashed #cbd5e1",borderRadius:3,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:150,padding:20,transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#94a3b8"} onMouseLeave={e=>e.currentTarget.style.borderColor="#cbd5e1"}>
                <div style={{width:30,height:30,border:"1px solid #cbd5e1",borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#cbd5e1",marginBottom:9}}>+</div>
                <div style={{fontSize:11,color:"#94a3b8",fontFamily:"'IBM Plex Sans',sans-serif"}}>Add new project</div>
              </div>
            </div>
          </div>
        )}
 
        {/* GANTT */}
        {tab==="gantt"&&(
          <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,overflow:"hidden"}}>
            <div style={{padding:"13px 18px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
              <div><div style={{fontSize:12,fontWeight:600,color:"#0f172a",fontFamily:"'IBM Plex Sans',sans-serif"}}>Gantt chart</div><div style={{fontSize:9,color:"#94a3b8",marginTop:1}}>Sep 2025 – May 2026 · {tasks.length} projects</div></div>
              <div style={{display:"flex",gap:13,flexWrap:"wrap"}}>{[["Completed","#22c55e"],["In Progress","#3b82f6"],["Pending","#f59e0b"],["Not Started","#cbd5e1"]].map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:2,background:c}}/><span style={{fontSize:9,color:"#94a3b8"}}>{l}</span></div>))}</div>
            </div>
            <div style={{overflowX:"auto"}}>
              <div style={{minWidth:760}}>
                <div style={{display:"flex",borderBottom:"1px solid #e2e8f0"}}>
                  <div style={{width:185,flexShrink:0,padding:"7px 13px",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.7,textTransform:"uppercase",background:"#f8f9fa",borderRight:"1px solid #e2e8f0"}}>Project</div>
                  <div style={{flex:1,display:"flex",background:"#f8f9fa"}}>{G_MONTHS.map(m=>(<div key={m} style={{flex:1,padding:"7px 2px",fontSize:8,fontWeight:600,color:"#94a3b8",textAlign:"center",borderRight:"1px solid #e2e8f0",letterSpacing:.4,textTransform:"uppercase"}}>{m}</div>))}</div>
                </div>
                {tasks.map((task,idx)=>{
                  const pr=computeProgress(task),st=getStatus(task);
                  const bc=st==="Completed"?"#22c55e":st==="Pending"?"#f59e0b":st==="In Progress"?"#3b82f6":"#cbd5e1";
                  const ps=task.subtasks.map(s=>parseDate(s.plan)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const as=task.subtasks.map(s=>parseDate(s.actual)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const alld=task.subtasks.flatMap(s=>[parseDate(s.end),parseDate(s.actual),parseDate(s.plan)]).filter(Boolean);
                  const ed=alld.sort((a,b)=>b-a)[0],ss=as||ps;
                  return(
                    <div key={task.id} className="row-h" style={{display:"flex",borderBottom:"1px solid #f1f5f9",background:idx%2===0?"#ffffff":"#f8f9fa"}}>
                      <div style={{width:185,flexShrink:0,padding:"8px 13px",borderRight:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:2,height:16,background:ACCENTS[idx%ACCENTS.length],borderRadius:1,flexShrink:0}}/>
                        <div><div style={{fontSize:10,fontWeight:500,color:"#1e293b",lineHeight:1.3,fontFamily:"'IBM Plex Sans',sans-serif"}}>{task.title}</div><div style={{fontSize:8,color:"#94a3b8",marginTop:1}}>{pr}%</div></div>
                      </div>
                      <div style={{flex:1,position:"relative",padding:"4px 0"}}>
                        {G_STARTS.map((m,i)=>(<div key={i} style={{position:"absolute",left:`${gP(m)}%`,top:0,bottom:0,width:1,background:"#e2e8f0"}}/>))}
                        <div style={{position:"absolute",left:`${gP(TODAY)}%`,top:0,bottom:0,width:1,background:"#ef4444",opacity:.4,zIndex:2}}/>
                        {ss&&ed?(
                          <div style={{position:"absolute",left:`${gP(ss)}%`,width:`${Math.max(gP(ed)-gP(ss),1)}%`,top:"50%",transform:"translateY(-50%)",height:10,borderRadius:1,background:bc,opacity:.9}}>
                            <div style={{width:`${pr}%`,height:"100%",background:"rgba(255,255,255,.45)",borderRadius:1}}/>
                          </div>
                        ):<span style={{position:"absolute",left:"3%",top:"50%",transform:"translateY(-50%)",fontSize:8,color:"#cbd5e1"}}>—</span>}
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex",background:"#f8f9fa",borderTop:"1px solid #e2e8f0"}}>
                  <div style={{width:185,flexShrink:0,padding:"5px 13px",fontSize:9,color:"#94a3b8"}}>Today · {fmt(TODAY)}</div>
                  <div style={{flex:1,position:"relative",height:22}}>
                    <div style={{position:"absolute",left:`${gP(TODAY)}%`,transform:"translateX(-50%)",top:3,fontSize:8,fontWeight:600,color:"#ef4444",background:"#fff1f2",padding:"2px 6px",borderRadius:2,border:"1px solid #fecaca",whiteSpace:"nowrap",fontFamily:"'IBM Plex Mono',monospace"}}>▲ TODAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* TASKS */}
        {tab==="tasks"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:11,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{["All","Completed","In Progress","Pending","Not Started"].map(f=>(<button key={f} onClick={()=>setFilter(f)} className="btn-ghost" style={{borderColor:filter===f?"#3b82f6":"#e2e8f0",color:filter===f?"#2563eb":"#64748b",background:filter===f?"#eff6ff":"transparent"}}>{f}</button>))}</div>
              <button onClick={()=>setShowAdd(true)} style={{padding:"6px 14px",border:"none",borderRadius:3,background:"#3b82f6",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600}}>+ Add task</button>
            </div>
            <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:"#f8f9fa",borderBottom:"1px solid #e2e8f0"}}>{["#","Project","Vendor","Progress","Status","Actions"].map(h=>(<th key={h} style={{padding:"8px 13px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.7,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
                <tbody>
                  {filtered.map((task,idx)=>{
                    const pr=computeProgress(task),st=getStatus(task),col=ACCENTS[idx%ACCENTS.length],isE=expanded===task.id,od=task.subtasks.filter(isOD).length;
                    return(
                      <>
                        <tr key={task.id} className="row-h" style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:isE?"#f1f5f9":"transparent"}} onClick={()=>setExpanded(isE?null:task.id)}>
                          <td style={{padding:"10px 13px",color:"#cbd5e1",fontFamily:"monospace",fontSize:9,borderLeft:`2px solid ${col}`}}>{String(task.id).padStart(2,"0")}</td>
                          <td style={{padding:"10px 13px"}}><div style={{fontWeight:500,color:"#0f172a",fontSize:12,fontFamily:"'IBM Plex Sans',sans-serif"}}>{task.title}</div>{od>0&&<div style={{fontSize:9,color:"#f87171",marginTop:1}}>▲ {od} overdue</div>}</td>
                          <td style={{padding:"10px 13px",color:"#94a3b8",fontSize:11}}>{task.vendor||"—"}</td>
                          <td style={{padding:"10px 13px",minWidth:110}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{flex:1,background:"#e2e8f0",borderRadius:1,height:2}}><div style={{width:`${pr}%`,height:"100%",background:col}}/></div><span style={{fontSize:9,color:col,fontFamily:"monospace",minWidth:25}}>{pr}%</span></div></td>
                          <td style={{padding:"10px 13px"}}><Badge status={st}/></td>
                          <td style={{padding:"10px 13px"}}><div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}><button className="btn-ghost" onClick={()=>setEditTask(task)} style={{fontSize:10,padding:"4px 9px"}}>Edit</button><button className="btn-ghost" onClick={()=>setEmailTask(task)} style={{fontSize:10,padding:"4px 9px"}}>Email</button><button onClick={()=>handleDel(task.id)} style={{padding:"4px 9px",border:"1px solid #fecaca",borderRadius:3,background:"transparent",color:"#f87171",cursor:"pointer",fontFamily:"inherit",fontSize:10,transition:"all .12s"}} onMouseEnter={e=>e.currentTarget.style.background="#fff1f2"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Del</button></div></td>
                        </tr>
                        {isE&&(
                          <tr key={`${task.id}-e`}><td colSpan={6} style={{padding:0,borderBottom:"1px solid #e2e8f0"}}><div style={{background:"#f8f9fa",padding:"11px 18px 11px 30px",overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:580}}><thead><tr style={{borderBottom:"1px solid #e2e8f0"}}>{["Sub","Stage","Plan","Actual","End","Status","Remarks"].map(h=>(<th key={h} style={{padding:"5px 9px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.6,textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{task.subtasks.map(s=>{const sc=getSC(s.status),ov=isOD(s);return(<tr key={s.sub} className="row-h" style={{borderBottom:"1px solid #f1f5f9",background:ov?"#fff1f2":"transparent"}}><td style={{padding:"6px 9px",color:"#cbd5e1",fontFamily:"monospace",fontSize:9}}>{s.sub}</td><td style={{padding:"6px 9px",color:"#1e293b",fontWeight:500}}>{s.name}</td><td style={{padding:"6px 9px",color:"#94a3b8"}}>{fmt(s.plan)}</td><td style={{padding:"6px 9px",color:"#94a3b8"}}>{fmt(s.actual)}</td><td style={{padding:"6px 9px",color:"#94a3b8"}}>{fmt(s.end)}</td><td style={{padding:"6px 9px"}}><Badge status={s.status||"Not Started"}/></td><td style={{padding:"6px 9px",color:ov?"#ef4444":"#94a3b8",fontSize:10}}>{ov?"▲ ":""}{s.remarks||"—"}</td></tr>);})}</tbody></table></div></td></tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
 
        {/* REMINDERS */}
        {tab==="reminders"&&(
          <div>
            <div style={{background:notifPerm==="granted"?"#f0fdf4":"#fffbeb",border:`1px solid ${notifPerm==="granted"?"#bbf7d0":"#fde68a"}`,borderRadius:3,padding:"11px 15px",marginBottom:12,display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:notifPerm==="granted"?"#22c55e":"#f59e0b",flexShrink:0}}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:11,color:notifPerm==="granted"?"#16a34a":"#d97706"}}>{notifPerm==="granted"?"Push notifications active":"Notifications disabled"}</div><div style={{fontSize:10,color:notifPerm==="granted"?"#166534":"#92400e",marginTop:1}}>{notifPerm==="granted"?"Smart alerts — each issue fires once per day. Zero repeated spam.":"Enable to receive device notifications with sound."}</div></div>
              {notifPerm!=="granted"&&<button onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled","Push notifications active.","success",`perm|${Date.now()}`);})} style={{padding:"6px 14px",border:"none",borderRadius:3,background:"#3b82f6",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:600}}>Enable</button>}
            </div>
 
            <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:3,padding:"9px 13px",marginBottom:12,fontSize:10,color:"#2563eb",lineHeight:1.6}}>
              Smart notification system: each overdue alert fires once per overdue-day count. Alerts reset only when you save an update. Manual "Alert" buttons always fire instantly.
            </div>
 
            <div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,padding:"12px 15px",marginBottom:12}}>
              <div style={{fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.8,textTransform:"uppercase",marginBottom:9}}>Test alert sounds</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[{l:"Critical",t:"critical"},{l:"Warning",t:"warning"},{l:"Success",t:"success"},{l:"Info",t:"info"}].map(({l,t})=>(<button key={t} className="btn-ghost" onClick={()=>push(`Test: ${l}`,`${l} sound test.`,t,`test|${t}|${Date.now()}`)} style={{fontSize:10}}>{l}</button>))}</div>
            </div>
 
            {(()=>{const ods=tasks.flatMap(t=>t.subtasks.filter(isOD).map(s=>({...s,taskTitle:t.title,vendor:t.vendor,task:t,dOD:daysDiff(parseDate(s.end)||parseDate(s.plan),TODAY)})));if(!ods.length)return null;
              return(<div style={{marginBottom:12}}><div style={{fontSize:9,fontWeight:600,color:"#f87171",letterSpacing:.8,textTransform:"uppercase",marginBottom:8}}>▲ Overdue ({ods.length})</div><div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:"#f8f9fa",borderBottom:"1px solid #e2e8f0"}}>{["Project","Stage","Vendor","Days overdue","Actions"].map(h=>(<th key={h} style={{padding:"7px 13px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.7,textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{ods.map((s,i)=>(<tr key={i} className="row-h" style={{borderBottom:"1px solid #f1f5f9",background:"#fff1f2"}}><td style={{padding:"9px 13px",color:"#1e293b",fontWeight:500,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12}}>{s.taskTitle}</td><td style={{padding:"9px 13px",color:"#64748b"}}>{s.name}</td><td style={{padding:"9px 13px",color:"#94a3b8"}}>{s.vendor||"—"}</td><td style={{padding:"9px 13px"}}><span style={{color:"#f87171",fontWeight:600,fontFamily:"monospace"}}>{s.dOD}d</span></td><td style={{padding:"9px 13px"}}><div style={{display:"flex",gap:6}}><button className="btn-ghost" onClick={()=>push(`URGENT: ${s.taskTitle}`,`${s.name} — ${s.dOD}d overdue!`,"critical",`man|${s.task.id}|${s.sub}|${Date.now()}`)} style={{fontSize:10,color:"#f87171",borderColor:"#3d1010"}}>Alert</button><button className="btn-ghost" onClick={()=>setEmailTask(s.task)} style={{fontSize:10}}>Email</button></div></td></tr>))}</tbody></table></div></div>);
            })()}
 
            <div><div style={{fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.8,textTransform:"uppercase",marginBottom:8}}>All projects</div><div style={{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:3,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:"#f8f9fa",borderBottom:"1px solid #e2e8f0"}}>{["Project","Vendor","Email","Status","Pending","Actions"].map(h=>(<th key={h} style={{padding:"7px 13px",textAlign:"left",fontSize:9,fontWeight:600,color:"#94a3b8",letterSpacing:.7,textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{tasks.map((task,idx)=>{const st=getStatus(task),pnd=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started").length,col=ACCENTS[idx%ACCENTS.length];return(<tr key={task.id} className="row-h" style={{borderBottom:"1px solid #f1f5f9"}}><td style={{padding:"9px 13px",fontWeight:500,color:"#0f172a",fontFamily:"'IBM Plex Sans',sans-serif",borderLeft:`2px solid ${col}`}}>{task.title}</td><td style={{padding:"9px 13px",color:"#64748b"}}>{task.vendor||"—"}</td><td style={{padding:"9px 13px",color:"#cbd5e1",fontSize:10}}>{task.pocEmail||VENDOR_EMAILS[task.vendor]||"—"}</td><td style={{padding:"9px 13px"}}><Badge status={st}/></td><td style={{padding:"9px 13px",color:"#94a3b8",fontFamily:"monospace"}}>{pnd}</td><td style={{padding:"9px 13px"}}><div style={{display:"flex",gap:5}}><button className="btn-ghost" onClick={()=>push(`Reminder: ${task.title}`,`${pnd} items need attention.`,st==="Pending"?"warning":"info",`man|${task.id}|${Date.now()}`)} style={{fontSize:10}}>Alert</button><button className="btn-ghost" onClick={()=>setEmailTask(task)} style={{fontSize:10}}>Email</button></div></td></tr>);})}</tbody></table></div></div>
          </div>
        )}
      </div>
 
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} nextId={nextId}/>}
      {editTask&&<EditModal task={editTask} onClose={()=>setEditTask(null)} onSave={handleSave}/>}
      {emailTask&&<EmailModal task={emailTask} onClose={()=>setEmailTask(null)}/>}
    </div>
  );
}
