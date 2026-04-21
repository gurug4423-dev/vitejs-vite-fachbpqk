import { useState, useMemo, useEffect, useRef, useCallback } from "react";
 
const TODAY = new Date("2026-04-20");
const STORAGE_KEY = "batt_timeline_v2";
 
const STAGE_NAMES = [
  "Supplier Hunt","NDA & Technical Discussion","Quotation","DAP",
  "PO/LOI","Manufacturing","Validation-PDI","Dispatch & Delivery","I & C"
];
 
const VENDOR_EMAILS = {
  "AMADA LASER WELD TECH":"amada@vendor.com",
  "ITECH ROBOTICS":"info@itechrobotics.com",
  "ROBOTECH":"contact@robotech.com",
  "KEYENCE/COGNEX":"sales@keyence.com",
  "IROBOTICS":"procurement@irobotics.com",
  "FUJIYA NEBULA":"projects@fujiyaNebula.com",
  "Tsumitomo Pvt Ltd":"info@tsumitomo.in",
  "ADOFIL":"sales@adofil.com",
};
 
const INITIAL_TASKS = [
  {id:1,title:"Amada Laser Welding",vendor:"AMADA LASER WELD TECH",poc:"",pocEmail:"",subtasks:[
    {sub:"1.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Bus bar template delay"},
    {sub:"1.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"1.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"1.4",name:"DAP",plan:null,actual:"2025-10-07",end:null,status:"Completed",remarks:""},
    {sub:"1.5",name:"PO/LOI",plan:null,actual:"2025-09-17",end:null,status:"Completed",remarks:""},
    {sub:"1.6",name:"Manufacturing",plan:"2026-01-07",actual:"2026-01-25",end:null,status:"Completed",remarks:""},
    {sub:"1.7",name:"Validation-PDI",plan:"2026-01-31",actual:"2026-02-06",end:null,status:"Completed",remarks:""},
    {sub:"1.8",name:"Dispatch & Delivery",plan:"2026-02-06",actual:"2026-02-09",end:null,status:"Completed",remarks:""},
    {sub:"1.9",name:"I & C",plan:"2026-02-17",actual:null,end:"2026-02-28",status:"Pending",remarks:"20 Days overdue"},
  ]},
  {id:2,title:"Compression Machine",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[
    {sub:"2.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"2.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"2.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"2.4",name:"DAP",plan:null,actual:"2025-10-06",end:null,status:"Completed",remarks:""},
    {sub:"2.5",name:"PO/LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},
    {sub:"2.6",name:"Manufacturing",plan:null,actual:"2025-11-17",end:null,status:"Completed",remarks:""},
    {sub:"2.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"2.8",name:"Dispatch & Delivery",plan:null,actual:"2025-08-12",end:null,status:"Completed",remarks:""},
    {sub:"2.9",name:"I & C",plan:null,actual:"2026-01-15",end:"2026-01-25",status:"Completed",remarks:""},
    {sub:"2.10",name:"Pilot Trial",plan:null,actual:null,end:null,status:"Pending",remarks:"Pallets required"},
  ]},
  {id:3,title:"Cell Sorting",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[
    {sub:"3.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Training 16/03/2026"},
    {sub:"3.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"3.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"3.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},
    {sub:"3.5",name:"PO/LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},
    {sub:"3.6",name:"Manufacturing",plan:null,actual:"2025-01-15",end:null,status:"Completed",remarks:""},
    {sub:"3.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"3.8",name:"Dispatch & Delivery",plan:null,actual:"2026-01-28",end:null,status:"Completed",remarks:""},
    {sub:"3.9",name:"I & C",plan:"2026-01-29",actual:"2026-02-23",end:"2026-03-14",status:"Completed",remarks:""},
  ]},
  {id:4,title:"Conveyor Line for HV Line",vendor:"ROBOTECH",poc:"",pocEmail:"",subtasks:[
    {sub:"4.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"PLC issues, dry run pending"},
    {sub:"4.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"4.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"4.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},
    {sub:"4.5",name:"PO/LOI",plan:null,actual:"2025-09-08",end:null,status:"Completed",remarks:""},
    {sub:"4.6",name:"Manufacturing",plan:"2024-12-05",actual:"2026-01-25",end:null,status:"Completed",remarks:""},
    {sub:"4.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"4.8",name:"Dispatch & Delivery",plan:"2025-12-20",actual:"2026-01-26",end:null,status:"Completed",remarks:""},
    {sub:"4.9",name:"I & C",plan:"2025-12-25",actual:"2026-01-30",end:null,status:"Pending",remarks:"50 Days overdue"},
  ]},
  {id:5,title:"Module Genealogy Automated",vendor:"KEYENCE/COGNEX",poc:"",pocEmail:"",subtasks:[
    {sub:"5.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Trials done, waiting quotation"},
    {sub:"5.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"5.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"5.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"5.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},
    {sub:"5.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"5.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"5.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"5.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
  ]},
  {id:6,title:"Compression Pallets",vendor:"IROBOTICS",poc:"",pocEmail:"",subtasks:[
    {sub:"6.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation pending"},
    {sub:"6.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"6.3",name:"Quotation",plan:null,actual:null,end:null,status:"Pending",remarks:""},
    {sub:"6.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"6.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"6.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"6.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"6.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"6.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
  ]},
  {id:7,title:"BMS Tester",vendor:"FUJIYA NEBULA",poc:"",pocEmail:"",subtasks:[
    {sub:"7.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Handover pending"},
    {sub:"7.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"7.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"7.4",name:"DAP",plan:null,actual:"2025-09-10",end:null,status:"Completed",remarks:""},
    {sub:"7.5",name:"PO/LOI",plan:null,actual:"2025-09-16",end:null,status:"Completed",remarks:""},
    {sub:"7.6",name:"Manufacturing",plan:null,actual:"2026-01-15",end:null,status:"Completed",remarks:""},
    {sub:"7.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"7.8",name:"Dispatch & Delivery",plan:"2025-12-20",actual:"2026-03-16",end:null,status:"Completed",remarks:""},
    {sub:"7.9",name:"I & C",plan:"2026-03-18",actual:"2026-03-26",end:null,status:"Completed",remarks:""},
  ]},
  {id:8,title:"CDC Expansion",vendor:"Tsumitomo Pvt Ltd",poc:"",pocEmail:"",subtasks:[
    {sub:"8.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Completed Successfully"},
    {sub:"8.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.5",name:"PO/LOI",plan:null,actual:"2025-10-05",end:null,status:"Completed",remarks:""},
    {sub:"8.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"8.9",name:"I & C",plan:null,actual:"2025-10-10",end:null,status:"Completed",remarks:""},
  ]},
  {id:9,title:"Epoxy Flooring - 3mm",vendor:"",poc:"",pocEmail:"",subtasks:[
    {sub:"9.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"OK"},
    {sub:"9.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"9.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"9.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"9.5",name:"PO/LOI",plan:null,actual:"2025-11-07",end:null,status:"Completed",remarks:""},
    {sub:"9.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"9.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"9.8",name:"Dispatch & Delivery",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""},
    {sub:"9.9",name:"I & C",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""},
  ]},
  {id:10,title:"Adhesive Dispensing",vendor:"ADOFIL",poc:"",pocEmail:"",subtasks:[
    {sub:"10.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Waiting for PO"},
    {sub:"10.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"10.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"10.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},
    {sub:"10.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},
    {sub:"10.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"10.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"10.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
    {sub:"10.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""},
  ]},
];
 
// ── HELPERS ──────────────────────────────────────────────────────────────────
const parseDate=(d)=>{if(!d)return null;const dt=new Date(d);return isNaN(dt.getTime())?null:dt;};
const fmt=(d)=>{if(!d)return"—";return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});};
const daysDiff=(d1,d2)=>Math.round((d2-d1)/(1000*60*60*24));
const COLORS=["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316","#6366f1","#84cc16","#a855f7","#0ea5e9","#d946ef"];
const SM={
  "Completed":{color:"#16a34a",bg:"#f0fdf4",border:"#bbf7d0"},
  "Pending":{color:"#d97706",bg:"#fffbeb",border:"#fde68a"},
  "Not Started":{color:"#64748b",bg:"#f8fafc",border:"#e2e8f0"},
  "In Progress":{color:"#2563eb",bg:"#eff6ff",border:"#bfdbfe"},
  "Yet to Complete":{color:"#ea580c",bg:"#fff7ed",border:"#fed7aa"},
};
const getSM=(s)=>SM[s]||SM["Not Started"];
const computeProgress=(task)=>{
  if(!task.subtasks.length)return 0;
  return Math.round(task.subtasks.filter(s=>s.status==="Completed"||s.status==="Completed ").length/task.subtasks.length*100);
};
const getStatus=(task)=>{
  const p=computeProgress(task);
  if(p===100)return"Completed";
  if(task.subtasks.some(s=>s.status==="Pending"))return"Pending";
  if(p>0)return"In Progress";
  return"Not Started";
};
 
// ── NOTIFICATION SOUND ────────────────────────────────────────────────────────
const playSound=(type="default")=>{
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const patterns={urgent:[[880,0,.08],[660,.1,.08],[880,.2,.12]],warning:[[523,0,.1],[659,.12,.1]],success:[[523,0,.06],[659,.07,.06],[784,.14,.1]],default:[[440,0,.08],[554,.1,.08]]};
    (patterns[type]||patterns.default).forEach(([f,start,dur])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=f;o.type="sine";
      g.gain.setValueAtTime(0,ctx.currentTime+start);
      g.gain.linearRampToValueAtTime(.25,ctx.currentTime+start+.01);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+start+dur);
      o.start(ctx.currentTime+start);o.stop(ctx.currentTime+start+dur+.05);
    });
  }catch(e){}
};
 
// ── GANTT ─────────────────────────────────────────────────────────────────────
const GANTT_MONTHS=["Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"];
const MONTH_STARTS=[new Date("2025-09-01"),new Date("2025-10-01"),new Date("2025-11-01"),new Date("2025-12-01"),new Date("2026-01-01"),new Date("2026-02-01"),new Date("2026-03-01"),new Date("2026-04-01"),new Date("2026-05-01")];
const GANTT_START=MONTH_STARTS[0];
const GANTT_TOTAL=daysDiff(GANTT_START,new Date("2026-05-31"));
const pct=(d)=>Math.max(0,Math.min(100,daysDiff(GANTT_START,new Date(d))/GANTT_TOTAL*100));
 
// ── NOTIFICATION BELL ─────────────────────────────────────────────────────────
function NotifBell({notifs,onClear,onClearAll}){
  const[open,setOpen]=useState(false);
  const ref=useRef();
  const unread=notifs.filter(n=>!n.read).length;
  useEffect(()=>{
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);
  },[]);
  const icon=t=>t==="urgent"?"🚨":t==="warning"?"⚠️":t==="success"?"✅":"🔔";
  return(
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        position:"relative",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",
        borderRadius:10,width:42,height:42,cursor:"pointer",fontSize:18,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>🔔
        {unread>0&&<span style={{
          position:"absolute",top:-4,right:-4,background:"#ef4444",color:"#fff",
          borderRadius:10,minWidth:18,height:18,fontSize:10,fontWeight:800,
          display:"flex",alignItems:"center",justifyContent:"center",
          border:"2px solid #0f172a",padding:"0 3px",animation:"pulse 1.5s infinite",
        }}>{unread>9?"9+":unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:50,width:350,background:"#fff",borderRadius:14,boxShadow:"0 20px 60px rgba(0,0,0,0.25)",zIndex:300,overflow:"hidden",border:"1px solid #f1f5f9",animation:"fadeIn .15s ease"}}>
          <div style={{padding:"13px 16px",background:"linear-gradient(135deg,#0f172a,#1e3a5f)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:14}}>🔔 Notifications</span>
            <div style={{display:"flex",gap:7}}>
              {notifs.length>0&&<button onClick={onClearAll} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#94a3b8",fontSize:10,padding:"3px 8px",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>Clear all</button>}
              <button onClick={()=>setOpen(false)} style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",width:22,height:22,borderRadius:5,cursor:"pointer",fontSize:12}}>✕</button>
            </div>
          </div>
          <div style={{maxHeight:370,overflowY:"auto"}}>
            {notifs.length===0
              ?<div style={{padding:28,textAlign:"center",color:"#94a3b8",fontSize:13}}><div style={{fontSize:32,marginBottom:6}}>🎉</div>No notifications</div>
              :notifs.map(n=>(
                <div key={n.id} style={{padding:"11px 14px",borderBottom:"1px solid #f8fafc",background:n.type==="urgent"?"#fff5f5":n.type==="warning"?"#fffbeb":n.type==="success"?"#f0fdf4":"#fff",display:"flex",gap:9,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{icon(n.type)}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>{n.title}</div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{n.body}</div>
                    <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>{n.time}</div>
                  </div>
                  <button onClick={()=>onClear(n.id)} style={{background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:13}}>✕</button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
 
// ── ADD TASK MODAL ────────────────────────────────────────────────────────────
function AddTaskModal({onClose,onAdd,nextId}){
  const[step,setStep]=useState(1);
  const[title,setTitle]=useState("");
  const[vendor,setVendor]=useState("");
  const[poc,setPoc]=useState("");
  const[pocEmail,setPocEmail]=useState("");
  const[desc,setDesc]=useState("");
  const[stages,setStages]=useState(STAGE_NAMES.map(n=>({name:n,enabled:true})));
  const[dates,setDates]=useState(STAGE_NAMES.map(()=>({plan:"",actual:"",end:"",status:"Not Started",remarks:""})));
 
  const toggleStage=(i)=>{const u=[...stages];u[i]={...u[i],enabled:!u[i].enabled};setStages(u);};
  const updateDate=(i,f,v)=>{const u=[...dates];u[i]={...u[i],[f]:v};setDates(u);};
 
  const handleAdd=()=>{
    const subtasks=stages.filter(s=>s.enabled).map((s,i)=>{
      const si=STAGE_NAMES.indexOf(s.name);
      const d=dates[si]||{};
      return{sub:`${nextId}.${i+1}`,name:s.name,plan:d.plan||null,actual:d.actual||null,end:d.end||null,status:d.status||"Not Started",remarks:d.remarks||""};
    });
    onAdd({id:nextId,title:title.trim(),vendor:vendor.trim(),poc:poc.trim(),pocEmail:pocEmail.trim(),description:desc.trim(),subtasks});
    onClose();
  };
 
  const inp={width:"100%",padding:"9px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box",transition:"border-color .2s"};
  const focus=e=>e.target.style.borderColor="#3b82f6";
  const blur=e=>e.target.style.borderColor="#e2e8f0";
 
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:680,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 30px 90px rgba(0,0,0,.35)",fontFamily:"'DM Sans',sans-serif"}}>
        
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f,#1e40af)",padding:"20px 24px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#7dd3fc",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>New Project · Step {step} of 2</div>
              <div style={{color:"#fff",fontSize:17,fontWeight:800,marginTop:2}}>{step===1?"Project Details":`Stage Dates — ${title}`}</div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
          <div style={{display:"flex",gap:6,marginTop:14}}>
            {["Project Info","Stage Dates"].map((s,i)=>(
              <div key={s} style={{flex:1,height:3,borderRadius:3,background:step>i?"#38bdf8":"rgba(255,255,255,.2)",transition:"background .3s"}}/>
            ))}
          </div>
        </div>
 
        <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:5}}>Project Title <span style={{color:"#ef4444"}}>*</span></label>
                  <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Laser Welding Machine" style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:5}}>Vendor / Supplier</label>
                  <input value={vendor} onChange={e=>setVendor(e.target.value)} placeholder="e.g. AMADA" style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:5}}>Vendor Email</label>
                  <input type="email" value={pocEmail} onChange={e=>setPocEmail(e.target.value)} placeholder="vendor@email.com" style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:5}}>POC (Person in Charge)</label>
                  <input value={poc} onChange={e=>setPoc(e.target.value)} placeholder="Your name" style={inp} onFocus={focus} onBlur={blur}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:5}}>Description</label>
                  <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Brief description" style={inp} onFocus={focus} onBlur={blur}/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:"#475569",marginBottom:8}}>Select Stages</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {stages.map((s,i)=>(
                    <button key={s.name} onClick={()=>toggleStage(i)} style={{
                      padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
                      border:s.enabled?"2px solid #3b82f6":"1.5px solid #e2e8f0",
                      background:s.enabled?"#eff6ff":"#fff",
                      color:s.enabled?"#2563eb":"#94a3b8",
                    }}>{s.enabled?"✓ ":""}{s.name}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
 
          {step===2&&(
            <div>
              <div style={{background:"#f8fafc",borderRadius:9,padding:"9px 13px",marginBottom:14,fontSize:12,color:"#64748b"}}>
                💡 Dates are optional — you can always update them later by editing the task.
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:"#f1f5f9"}}>
                      {["Stage","Plan Date","Actual Date","End Date","Status"].map(h=>(
                        <th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:"#64748b",fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stages.filter(s=>s.enabled).map(s=>{
                      const si=STAGE_NAMES.indexOf(s.name);
                      const d=dates[si]||{};
                      return(
                        <tr key={s.name} style={{borderBottom:"1px solid #f8fafc"}}>
                          <td style={{padding:"8px 10px",fontWeight:600,color:"#1e293b",whiteSpace:"nowrap"}}>{s.name}</td>
                          {["plan","actual","end"].map(f=>(
                            <td key={f} style={{padding:"4px 6px"}}>
                              <input type="date" value={d[f]||""} onChange={e=>updateDate(si,f,e.target.value||null)} style={{padding:"5px 8px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none",width:"100%"}}/>
                            </td>
                          ))}
                          <td style={{padding:"4px 6px"}}>
                            <select value={d.status||"Not Started"} onChange={e=>updateDate(si,"status",e.target.value)} style={{padding:"5px 8px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none",background:"#fff"}}>
                              {["Not Started","Pending","In Progress","Completed"].map(st=><option key={st}>{st}</option>)}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
 
        <div style={{padding:"15px 24px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={step===1?onClose:()=>setStep(1)} style={{padding:"10px 22px",border:"1.5px solid #e2e8f0",borderRadius:9,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:"#64748b"}}>{step===1?"Cancel":"← Back"}</button>
          <button onClick={step===1?()=>{if(title.trim())setStep(2);}:handleAdd} disabled={!title.trim()} style={{
            padding:"10px 28px",border:"none",borderRadius:9,
            background:title.trim()?"linear-gradient(135deg,#0f2847,#1e40af)":"#f1f5f9",
            color:title.trim()?"#fff":"#94a3b8",
            cursor:title.trim()?"pointer":"not-allowed",
            fontFamily:"inherit",fontSize:13,fontWeight:700,
            boxShadow:title.trim()?"0 4px 12px rgba(30,64,175,.35)":"none",transition:"all .2s",
          }}>{step===1?"Next: Set Dates →":"✅ Add Project"}</button>
        </div>
      </div>
    </div>
  );
}
 
// ── EDIT MODAL ────────────────────────────────────────────────────────────────
function EditModal({task,onClose,onSave}){
  const[subs,setSubs]=useState(task.subtasks.map(s=>({...s})));
  const[vendor,setVendor]=useState(task.vendor||"");
  const[poc,setPoc]=useState(task.poc||"");
  const[pocEmail,setPocEmail]=useState(task.pocEmail||"");
  const upd=(i,f,v)=>{const u=[...subs];u[i]={...u[i],[f]:v};setSubs(u);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:18,width:"100%",maxWidth:900,maxHeight:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 25px 80px rgba(0,0,0,.3)",fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,#0f2847,#1e3a5f)",padding:"18px 24px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#7dd3fc",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Edit Project</div>
            <div style={{color:"#fff",fontSize:16,fontWeight:800,marginTop:2}}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{padding:"13px 22px",borderBottom:"1px solid #f1f5f9",flexShrink:0,display:"flex",gap:12,flexWrap:"wrap"}}>
          {[["Vendor",vendor,setVendor,"Vendor"],["POC",poc,setPoc,"Person"],["Email",pocEmail,setPocEmail,"email@v.com"]].map(([l,v,s,p])=>(
            <div key={l} style={{flex:1,minWidth:150}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:3}}>{l}</label>
              <input value={v} onChange={e=>s(e.target.value)} placeholder={p} style={{width:"100%",padding:"7px 10px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#f8fafc",position:"sticky",top:0}}>
                {["Sub","Task","Plan","Actual","End","Status","Remarks"].map(h=>(
                  <th key={h} style={{padding:"9px 11px",textAlign:"left",fontWeight:700,color:"#94a3b8",fontSize:10,letterSpacing:.5,textTransform:"uppercase",borderBottom:"1px solid #f1f5f9"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s,i)=>{
                const m=getSM(s.status);
                return(
                  <tr key={s.sub} style={{borderBottom:"1px solid #f8fafc"}}>
                    <td style={{padding:"7px 11px",color:"#94a3b8",fontFamily:"monospace",fontSize:10}}>{s.sub}</td>
                    <td style={{padding:"7px 11px",fontWeight:600,color:"#1e293b",whiteSpace:"nowrap"}}>{s.name}</td>
                    {["plan","actual","end"].map(f=>(
                      <td key={f} style={{padding:"4px 7px"}}>
                        <input type="date" value={s[f]||""} onChange={e=>upd(i,f,e.target.value||null)} style={{padding:"5px 7px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                      </td>
                    ))}
                    <td style={{padding:"4px 7px"}}>
                      <select value={s.status||"Not Started"} onChange={e=>upd(i,"status",e.target.value)} style={{padding:"5px 7px",border:`1.5px solid ${m.border}`,borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none",background:m.bg,color:m.color,fontWeight:600}}>
                        {["Completed","Pending","Not Started","In Progress","Yet to Complete"].map(st=><option key={st}>{st}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"4px 7px"}}>
                      <input value={s.remarks||""} onChange={e=>upd(i,"remarks",e.target.value)} style={{padding:"5px 7px",border:"1px solid #e2e8f0",borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none",width:160}}/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"13px 22px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:10,flexShrink:0}}>
          <button onClick={onClose} style={{padding:"10px 22px",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,color:"#64748b"}}>Cancel</button>
          <button onClick={()=>onSave({...task,vendor,poc,pocEmail,subtasks:subs})} style={{padding:"10px 28px",border:"none",borderRadius:8,background:"linear-gradient(135deg,#0f2847,#1e40af)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,boxShadow:"0 4px 12px rgba(30,64,175,.3)"}}>💾 Save Changes</button>
        </div>
      </div>
    </div>
  );
}
 
// ── EMAIL COMPOSER ────────────────────────────────────────────────────────────
function EmailModal({task,onClose}){
  const ve=task.pocEmail||VENDOR_EMAILS[task.vendor]||"";
  const[to,setTo]=useState(ve);
  const[cc,setCc]=useState("projectmanager@company.com");
  const[subj,setSubj]=useState(`Reminder: ${task.title} — Action Required`);
  const pend=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started");
  const[body,setBody]=useState(`Dear ${task.vendor||"Team"},\n\nThis is a reminder regarding the ${task.title} project.\n\nPENDING ITEMS:\n${pend.map(s=>`  • ${s.sub} — ${s.name}${s.remarks?` (${s.remarks})`:""}`).join("\n")||"  • None"}\n\nPlease provide an update at the earliest.\n\nRegards,\nBattery Industrialization Team`);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.78)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:620,boxShadow:"0 25px 80px rgba(0,0,0,.3)",overflow:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{background:"linear-gradient(135deg,#1e3a5f,#0f2847)",padding:"17px 22px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:"#7dd3fc",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Email Reminder</div>
            <div style={{color:"#fff",fontSize:14,fontWeight:700,marginTop:2}}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",width:30,height:30,borderRadius:7,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        <div style={{padding:"17px 22px"}}>
          {[["To",to,setTo,"email"],["CC",cc,setCc,"email"],["Subject",subj,setSubj,"text"]].map(([l,v,s,t])=>(
            <div key={l} style={{marginBottom:10}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>{l}</label>
              <input type={t} value={v} onChange={e=>s(e.target.value)} style={{width:"100%",padding:"8px 11px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          <label style={{display:"block",fontSize:11,fontWeight:700,color:"#64748b",marginBottom:4}}>Message</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={9} style={{width:"100%",padding:"8px 11px",border:"1.5px solid #e2e8f0",borderRadius:7,fontSize:11,fontFamily:"monospace",outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.6}}/>
          <div style={{display:"flex",gap:8,marginTop:13,justifyContent:"flex-end"}}>
            <button onClick={onClose} style={{padding:"9px 20px",border:"1.5px solid #e2e8f0",borderRadius:8,background:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,color:"#64748b"}}>Cancel</button>
            <button onClick={()=>{window.open(`mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`,"_blank");onClose();}} style={{padding:"9px 22px",border:"none",borderRadius:8,background:"linear-gradient(135deg,#1e3a5f,#2563eb)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,boxShadow:"0 4px 12px rgba(37,99,235,.3)"}}>📧 Open in Mail App</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[tasks,setTasks]=useState(()=>{try{const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):INITIAL_TASKS;}catch{return INITIAL_TASKS;}});
  const[notifs,setNotifs]=useState([]);
  const[tab,setTab]=useState("overview");
  const[emailTask,setEmailTask]=useState(null);
  const[editTask,setEditTask]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[filter,setFilter]=useState("All");
  const[expanded,setExpanded]=useState(null);
  const[notifPerm,setNotifPerm]=useState("default");
  const[liveAt,setLiveAt]=useState(Date.now());
  const[liveDot,setLiveDot]=useState(false);
  const idRef=useRef(0);
 
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}catch{}},[tasks]);
 
  useEffect(()=>{
    if("Notification"in window){
      setNotifPerm(Notification.permission);
      if(Notification.permission==="default")Notification.requestPermission().then(p=>setNotifPerm(p));
    }
  },[]);
 
  const push=useCallback((title,body,type="default")=>{
    const id=++idRef.current;
    const time=new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setNotifs(prev=>[{id,title,body,type,time,read:false},...prev.slice(0,49)]);
    playSound(type);
    if("Notification"in window&&Notification.permission==="granted"){
      try{
        const n=new Notification(`⚡ Battery — ${title}`,{body,tag:`bt-${id}`,icon:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='28'>⚡</text></svg>"});
        setTimeout(()=>n.close(),6000);
      }catch{}
    }
  },[]);
 
  // Real-time check every 30s
  useEffect(()=>{
    const t=setInterval(()=>{
      setLiveDot(v=>!v);
      setLiveAt(Date.now());
      tasks.forEach(task=>{
        task.subtasks.forEach(s=>{
          const d=parseDate(s.end)||parseDate(s.plan);
          if(!d)return;
          const od=daysDiff(d,TODAY);
          if(s.status==="Pending"&&od>0)push(`${task.title} — ${s.name}`,`Overdue by ${od} days. Vendor: ${task.vendor||"TBD"}`,"urgent");
        });
      });
    },30000);
    return()=>clearInterval(t);
  },[tasks,push]);
 
  // Boot notifications
  useEffect(()=>{
    let u=0,w=0;
    tasks.forEach(task=>task.subtasks.forEach(s=>{
      const d=parseDate(s.end)||parseDate(s.plan);
      if(!d)return;
      const od=daysDiff(d,TODAY);
      if(s.status==="Pending"&&od>0)u++;
      else if(s.status==="Pending")w++;
    }));
    if(u>0)push(`${u} Overdue Tasks!`,"Immediate action required.","urgent");
    else if(w>0)push(`${w} Pending Tasks`,"Tasks awaiting action.","warning");
    push("Timeline Active",`${tasks.length} projects · Real-time sync on.`,"success");
  },[]);// eslint-disable-line
 
  const stats=useMemo(()=>{
    const t=tasks.length;
    const c=tasks.filter(x=>getStatus(x)==="Completed").length;
    const p=tasks.filter(x=>getStatus(x)==="Pending").length;
    const i=tasks.filter(x=>getStatus(x)==="In Progress").length;
    const n=tasks.filter(x=>getStatus(x)==="Not Started").length;
    const o=tasks.flatMap(x=>x.subtasks).filter(s=>{const d=parseDate(s.end)||parseDate(s.plan);return s.status==="Pending"&&d&&daysDiff(d,TODAY)>0;}).length;
    const ap=t?Math.round(tasks.reduce((a,x)=>a+computeProgress(x),0)/t):0;
    return{t,c,p,i,n,o,ap};
  },[tasks]);
 
  const filtered=useMemo(()=>filter==="All"?tasks:tasks.filter(t=>getStatus(t)===filter),[tasks,filter]);
  const nextId=useMemo(()=>Math.max(...tasks.map(t=>t.id),0)+1,[tasks]);
 
  const handleAdd=(nt)=>{setTasks(p=>[...p,nt]);push("Project Added",`"${nt.title}" added.`,"success");};
  const handleSave=(u)=>{setTasks(p=>p.map(t=>t.id===u.id?u:t));setEditTask(null);push("Updated",`"${u.title}" saved.`,"success");};
  const handleDel=(id)=>{const t=tasks.find(x=>x.id===id);if(window.confirm(`Delete "${t?.title}"?`)){setTasks(p=>p.filter(x=>x.id!==id));push("Deleted",`"${t?.title}" removed.`,"default");}};
 
  const TABS=[{id:"overview",l:"📊 Overview"},{id:"gantt",l:"📅 Gantt"},{id:"tasks",l:"📋 Tasks"},{id:"reminders",l:"📧 Reminders"}];
 
  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#eef2f7",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.15)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .add-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(56,189,248,.5)!important;}
        .tab-btn:hover{background:rgba(255,255,255,.15)!important;}
        .card:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.12)!important;}
        .row-hover:hover{background:#f8fafc!important;}
        .act:hover{opacity:.85;transform:translateY(-1px);}
      `}</style>
 
      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,#0a0f1e,#0f172a 40%,#1e3a5f 80%,#1e40af)",padding:"0 26px",boxShadow:"0 4px 30px rgba(0,0,0,.4)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{paddingTop:16,paddingBottom:13,display:"flex",alignItems:"center",gap:13,flexWrap:"wrap"}}>
            {/* Logo */}
            <div style={{width:44,height:44,borderRadius:11,background:"linear-gradient(135deg,#38bdf8,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 14px rgba(56,189,248,.45)",flexShrink:0}}>⚡</div>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontSize:17,fontWeight:900,letterSpacing:-.5}}>Battery Industrialization Timeline</div>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:2}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:liveDot?"#22c55e":"#4ade80",boxShadow:"0 0 6px #22c55e",animation:"blink 2s infinite"}}/>
                  <span style={{color:"#4ade80",fontSize:10,fontWeight:800,letterSpacing:.5}}>LIVE</span>
                </div>
                <span style={{color:"#334155",fontSize:10}}>·</span>
                <span style={{color:"#7dd3fc",fontSize:10}}>{tasks.length} Projects · Synced {new Date(liveAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
              </div>
            </div>
            {/* Stat pills */}
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {[{l:"Done",v:stats.c,c:"#22c55e"},{l:"Active",v:stats.i,c:"#3b82f6"},{l:"Pending",v:stats.p,c:"#f59e0b"},{l:"⚠ Overdue",v:stats.o,c:"#ef4444"}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,.08)",borderRadius:9,padding:"6px 13px",textAlign:"center",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,.12)"}}>
                  <div style={{color:s.c,fontSize:17,fontWeight:900,lineHeight:1}}>{s.v}</div>
                  <div style={{color:"#94a3b8",fontSize:9,fontWeight:600,marginTop:1}}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Actions */}
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <button className="add-btn" onClick={()=>setShowAdd(true)} style={{
                padding:"9px 18px",border:"none",borderRadius:10,
                background:"linear-gradient(135deg,#38bdf8,#6366f1)",color:"#fff",
                cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:800,
                boxShadow:"0 4px 14px rgba(56,189,248,.35)",transition:"all .2s",
                display:"flex",alignItems:"center",gap:5,
              }}><span style={{fontSize:16,fontWeight:900}}>+</span> Add Task</button>
              {notifPerm!=="granted"&&(
                <button onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled!","Real-time notifications active.","success");})} style={{padding:"9px 13px",border:"1px solid rgba(255,255,255,.2)",borderRadius:10,background:"rgba(255,255,255,.1)",color:"#fbbf24",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>🔔 Enable</button>
              )}
              <NotifBell notifs={notifs} onClear={id=>setNotifs(p=>p.filter(n=>n.id!==id))} onClearAll={()=>setNotifs([])}/>
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",gap:2}}>
            {TABS.map(t=>(
              <button key={t.id} className="tab-btn" onClick={()=>setTab(t.id)} style={{padding:"8px 17px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,borderRadius:"8px 8px 0 0",transition:"all .15s",background:tab===t.id?"#fff":"transparent",color:tab===t.id?"#1e3a5f":"#7dd3fc"}}>{t.l}</button>
            ))}
          </div>
        </div>
      </div>
 
      {/* CONTENT */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"20px 26px"}}>
 
        {/* ── OVERVIEW ── */}
        {tab==="overview"&&(
          <div>
            <div style={{background:"#fff",borderRadius:15,padding:"18px 22px",marginBottom:16,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                <span style={{fontWeight:900,fontSize:14}}>Overall Completion</span>
                <span style={{fontWeight:900,fontSize:24,color:"#1e3a5f"}}>{stats.ap}%</span>
              </div>
              <div style={{background:"#f1f5f9",borderRadius:11,height:13,overflow:"hidden"}}>
                <div style={{width:`${stats.ap}%`,height:"100%",background:"linear-gradient(90deg,#3b82f6,#06b6d4,#22c55e)",borderRadius:11,transition:"width 1s ease"}}/>
              </div>
              <div style={{display:"flex",gap:18,marginTop:11,flexWrap:"wrap"}}>
                {[{l:"Total",v:stats.t,c:"#64748b"},{l:"Completed",v:stats.c,c:"#22c55e"},{l:"In Progress",v:stats.i,c:"#3b82f6"},{l:"Pending",v:stats.p,c:"#f59e0b"},{l:"Not Started",v:stats.n,c:"#94a3b8"}].map(s=>(
                  <div key={s.l}><div style={{fontWeight:900,fontSize:19,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{s.l}</div></div>
                ))}
              </div>
            </div>
 
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:13}}>
              {tasks.map((task,idx)=>{
                const pr=computeProgress(task);
                const st=getStatus(task);
                const m=getSM(st);
                const col=COLORS[idx%COLORS.length];
                const od=task.subtasks.filter(s=>{const d=parseDate(s.end)||parseDate(s.plan);return s.status==="Pending"&&d&&daysDiff(d,TODAY)>0;});
                const pnd=task.subtasks.filter(s=>s.status==="Pending");
                return(
                  <div key={task.id} className="card" style={{background:"#fff",borderRadius:13,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.07)",transition:"all .2s",borderTop:`3px solid ${col}`}}>
                    <div style={{padding:"15px 17px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>#{task.id} · {task.vendor||"Vendor TBD"}</div>
                          <div style={{fontWeight:800,fontSize:13,color:"#1e293b",marginTop:2,lineHeight:1.3}}>{task.title}</div>
                        </div>
                        <span style={{padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:700,background:m.bg,color:m.color,border:`1px solid ${m.border}`,whiteSpace:"nowrap",marginLeft:7}}>{st}</span>
                      </div>
                      <div style={{marginTop:11}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:11,color:"#64748b"}}>Progress</span>
                          <span style={{fontSize:11,fontWeight:800,color:col}}>{pr}%</span>
                        </div>
                        <div style={{background:"#f1f5f9",borderRadius:5,height:5}}><div style={{width:`${pr}%`,height:"100%",background:col,borderRadius:5,transition:"width .5s"}}/></div>
                      </div>
                      {od.length>0&&<div style={{marginTop:8,padding:"5px 9px",background:"#fff5f5",borderRadius:7,border:"1px solid #fecaca",fontSize:11,color:"#ef4444",fontWeight:700}}>⚠ {od.map(s=>s.name).join(", ")} overdue</div>}
                      {pnd.length>0&&!od.length&&<div style={{marginTop:8,padding:"5px 9px",background:"#fffbeb",borderRadius:7,border:"1px solid #fde68a",fontSize:11,color:"#d97706"}}>⏳ Pending: {pnd.map(s=>s.name).join(", ")}</div>}
                      <div style={{display:"flex",gap:6,marginTop:11}}>
                        <button className="act" onClick={()=>setEditTask(task)} style={{flex:1,padding:"6px",border:"1.5px solid #e2e8f0",borderRadius:7,background:"#f8fafc",cursor:"pointer",fontSize:11,fontWeight:700,color:"#475569",fontFamily:"inherit",transition:"all .15s"}}>✏️ Edit</button>
                        <button className="act" onClick={()=>setEmailTask(task)} style={{flex:1,padding:"6px",border:`1.5px solid ${col}33`,borderRadius:7,background:`${col}12`,cursor:"pointer",fontSize:11,fontWeight:700,color:col,fontFamily:"inherit",transition:"all .15s"}}>📧 Email</button>
                        <button className="act" onClick={()=>push(`Reminder: ${task.title}`,`${pnd.length} pending, ${od.length} overdue.`,od.length?"urgent":"warning")} style={{padding:"6px 9px",border:"1.5px solid #f1f5f9",borderRadius:7,background:"#f8fafc",cursor:"pointer",fontSize:13,fontFamily:"inherit",transition:"all .15s"}}>🔔</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Add card */}
              <div onClick={()=>setShowAdd(true)} className="card" style={{background:"#fff",borderRadius:13,border:"2px dashed #cbd5e1",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:170,transition:"all .2s",padding:20}}>
                <div style={{width:46,height:46,borderRadius:11,background:"linear-gradient(135deg,#38bdf8,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:9}}>+</div>
                <div style={{fontWeight:700,color:"#475569",fontSize:13}}>Add New Project</div>
                <div style={{fontSize:11,color:"#94a3b8",marginTop:3,textAlign:"center"}}>Full stage tracking with reminders</div>
              </div>
            </div>
          </div>
        )}
 
        {/* ── GANTT ── */}
        {tab==="gantt"&&(
          <div style={{background:"#fff",borderRadius:15,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
            <div style={{padding:"17px 22px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
              <div><div style={{fontWeight:900,fontSize:16}}>Gantt Chart</div><div style={{color:"#64748b",fontSize:11,marginTop:1}}>Sep 2025 — May 2026 · {tasks.length} projects</div></div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[["Completed","#22c55e"],["In Progress","#3b82f6"],["Pending","#f59e0b"],["Not Started","#94a3b8"]].map(([l,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:11,color:"#64748b"}}>{l}</span></div>
                ))}
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <div style={{minWidth:800}}>
                <div style={{display:"flex",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{width:200,flexShrink:0,padding:"8px 14px",fontWeight:700,fontSize:10,color:"#94a3b8",background:"#fafafa",borderRight:"1px solid #f1f5f9",textTransform:"uppercase",letterSpacing:.5}}>Project</div>
                  <div style={{flex:1,display:"flex",background:"#fafafa"}}>
                    {GANTT_MONTHS.map(m=><div key={m} style={{flex:1,padding:"8px 2px",fontSize:10,fontWeight:700,color:"#94a3b8",textAlign:"center",borderRight:"1px solid #f1f5f9"}}>{m}</div>)}
                  </div>
                </div>
                {tasks.map((task,idx)=>{
                  const pr=computeProgress(task);
                  const st=getStatus(task);
                  const bc=st==="Completed"?"#22c55e":st==="Pending"?"#f59e0b":st==="In Progress"?"#3b82f6":"#cbd5e1";
                  const ps=task.subtasks.map(s=>parseDate(s.plan)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const as=task.subtasks.map(s=>parseDate(s.actual)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const ed=[...task.subtasks.flatMap(s=>[parseDate(s.end),parseDate(s.actual),parseDate(s.plan)]).filter(Boolean)].sort((a,b)=>b-a)[0];
                  const ss=as||ps;
                  return(
                    <div key={task.id} className="row-hover" style={{display:"flex",borderBottom:"1px solid #f8fafc",background:idx%2===0?"#fff":"#fafafa"}}>
                      <div style={{width:200,flexShrink:0,padding:"8px 14px",borderRight:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:bc,flexShrink:0}}/>
                        <div><div style={{fontSize:11,fontWeight:700,color:"#1e293b",lineHeight:1.3}}>{task.title}</div><div style={{fontSize:9,color:"#94a3b8"}}>{pr}%</div></div>
                      </div>
                      <div style={{flex:1,position:"relative",padding:"4px 0"}}>
                        {MONTH_STARTS.map((m,i)=><div key={i} style={{position:"absolute",left:`${pct(m)}%`,top:0,bottom:0,width:1,background:"#f1f5f9"}}/>)}
                        <div style={{position:"absolute",left:`${pct(TODAY)}%`,top:0,bottom:0,width:2,background:"#ef444466",zIndex:2}}/>
                        {ss&&ed?(
                          <div style={{position:"absolute",left:`${pct(ss)}%`,width:`${Math.max(pct(ed)-pct(ss),1.5)}%`,top:"50%",transform:"translateY(-50%)",height:17,borderRadius:8,background:`linear-gradient(90deg,${bc}bb,${bc})`,boxShadow:`0 2px 6px ${bc}44`,overflow:"hidden"}}>
                            <div style={{width:`${pr}%`,height:"100%",background:"rgba(255,255,255,.3)",borderRadius:8}}/>
                          </div>
                        ):<span style={{position:"absolute",left:"3%",top:"50%",transform:"translateY(-50%)",fontSize:9,color:"#cbd5e1",fontStyle:"italic"}}>No dates</span>}
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex",background:"#fafafa",borderTop:"1px solid #f1f5f9"}}>
                  <div style={{width:200,flexShrink:0,padding:"7px 14px",fontSize:10,color:"#94a3b8"}}>Today: {fmt(TODAY)}</div>
                  <div style={{flex:1,position:"relative",height:26}}>
                    <div style={{position:"absolute",left:`${pct(TODAY)}%`,transform:"translateX(-50%)",top:4,fontSize:9,fontWeight:800,color:"#ef4444",background:"#fff5f5",padding:"2px 7px",borderRadius:4,border:"1px solid #fecaca",whiteSpace:"nowrap"}}>▲ TODAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
 
        {/* ── TASKS ── */}
        {tab==="tasks"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13,flexWrap:"wrap",gap:9}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["All","Completed","In Progress","Pending","Not Started"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 15px",border:"1.5px solid",borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,transition:"all .15s",borderColor:filter===f?"#1e3a5f":"#e2e8f0",background:filter===f?"#1e3a5f":"#fff",color:filter===f?"#fff":"#64748b"}}>{f}</button>
                ))}
              </div>
              <button onClick={()=>setShowAdd(true)} style={{padding:"8px 18px",border:"none",borderRadius:9,background:"linear-gradient(135deg,#38bdf8,#6366f1)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,boxShadow:"0 4px 12px rgba(56,189,248,.35)"}}>+ Add Task</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {filtered.map((task,idx)=>{
                const pr=computeProgress(task);
                const st=getStatus(task);
                const col=COLORS[task.id%COLORS.length];
                const isE=expanded===task.id;
                return(
                  <div key={task.id} style={{background:"#fff",borderRadius:11,overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,.05)",border:"1px solid #f1f5f9"}}>
                    <div style={{display:"flex",alignItems:"center",gap:11,padding:"12px 17px",cursor:"pointer"}} onClick={()=>setExpanded(isE?null:task.id)}>
                      <div style={{width:32,height:32,borderRadius:8,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:col,flexShrink:0}}>{task.id}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:13,color:"#1e293b"}}>{task.title}</div>
                        <div style={{fontSize:10,color:"#94a3b8",marginTop:1}}>{task.vendor||"No vendor"} · {task.subtasks.length} stages</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:9,flexWrap:"wrap"}}>
                        <div><div style={{fontWeight:900,fontSize:14,color:col}}>{pr}%</div><div style={{background:"#f1f5f9",borderRadius:2,height:3,width:65,marginTop:2}}><div style={{width:`${pr}%`,height:"100%",background:col,borderRadius:2}}/></div></div>
                        <span style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:700,background:getSM(st).bg,color:getSM(st).color,border:`1px solid ${getSM(st).border}`}}>{st}</span>
                        <div style={{display:"flex",gap:5}}>
                          <button className="act" onClick={e=>{e.stopPropagation();setEditTask(task);}} style={{padding:"5px 9px",border:"1.5px solid #e2e8f0",borderRadius:6,background:"#f8fafc",cursor:"pointer",fontSize:11,fontWeight:700,color:"#475569",fontFamily:"inherit",transition:"all .15s"}}>✏️</button>
                          <button className="act" onClick={e=>{e.stopPropagation();setEmailTask(task);}} style={{padding:"5px 9px",border:`1.5px solid ${col}33`,borderRadius:6,background:`${col}12`,cursor:"pointer",fontSize:11,fontWeight:700,color:col,fontFamily:"inherit",transition:"all .15s"}}>📧</button>
                          <button className="act" onClick={e=>{e.stopPropagation();handleDel(task.id);}} style={{padding:"5px 9px",border:"1.5px solid #fecaca",borderRadius:6,background:"#fff5f5",cursor:"pointer",fontSize:11,color:"#ef4444",fontFamily:"inherit",transition:"all .15s"}}>🗑</button>
                        </div>
                        <span style={{color:"#94a3b8",fontSize:12}}>{isE?"▲":"▼"}</span>
                      </div>
                    </div>
                    {isE&&(
                      <div style={{borderTop:"1px solid #f8fafc",overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:650}}>
                          <thead><tr style={{background:"#fafafa"}}>
                            {["Sub","Task","Plan","Actual","End","Status","Remarks"].map(h=>(
                              <th key={h} style={{padding:"7px 11px",textAlign:"left",fontWeight:700,color:"#94a3b8",fontSize:10,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>
                            ))}
                          </tr></thead>
                          <tbody>
                            {task.subtasks.map(s=>{
                              const m=getSM(s.status);
                              const d=parseDate(s.end)||parseDate(s.plan);
                              const ov=s.status==="Pending"&&d&&daysDiff(d,TODAY)>0;
                              return(
                                <tr key={s.sub} className="row-hover" style={{borderTop:"1px solid #f8fafc",background:ov?"#fff5f5":""}}>
                                  <td style={{padding:"7px 11px",color:"#94a3b8",fontFamily:"monospace",fontSize:10}}>{s.sub}</td>
                                  <td style={{padding:"7px 11px",fontWeight:600,color:"#1e293b"}}>{s.name}</td>
                                  <td style={{padding:"7px 11px",color:"#64748b"}}>{fmt(s.plan)}</td>
                                  <td style={{padding:"7px 11px",color:"#64748b"}}>{fmt(s.actual)}</td>
                                  <td style={{padding:"7px 11px",color:"#64748b"}}>{fmt(s.end)}</td>
                                  <td style={{padding:"7px 11px"}}><span style={{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:m.bg,color:m.color,border:`1px solid ${m.border}`}}>{s.status||"—"}</span></td>
                                  <td style={{padding:"7px 11px",color:ov?"#ef4444":"#64748b",fontSize:11,fontWeight:ov?700:400}}>{ov&&"⚠ "}{s.remarks||"—"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
 
        {/* ── REMINDERS ── */}
        {tab==="reminders"&&(
          <div>
            {/* Status card */}
            <div style={{background:notifPerm==="granted"?"linear-gradient(135deg,#f0fdf4,#dcfce7)":"linear-gradient(135deg,#fffbeb,#fef3c7)",borderRadius:13,padding:"14px 18px",marginBottom:16,border:`1px solid ${notifPerm==="granted"?"#bbf7d0":"#fde68a"}`,display:"flex",alignItems:"center",gap:11}}>
              <span style={{fontSize:22}}>{notifPerm==="granted"?"🔔":"⚠️"}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,color:notifPerm==="granted"?"#16a34a":"#d97706",fontSize:13}}>{notifPerm==="granted"?"Push Notifications Active":"Notifications Not Enabled"}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{notifPerm==="granted"?"Real-time browser + sound notifications active. Checks every 30 seconds for overdue tasks.":"Enable to receive notifications with sound on overdue & pending tasks."}</div>
              </div>
              {notifPerm!=="granted"&&<button onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled!","Notifications active.","success");})} style={{padding:"8px 16px",border:"none",borderRadius:8,background:"#f59e0b",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Enable Now</button>}
            </div>
 
            {/* Test panel */}
            <div style={{background:"#fff",borderRadius:13,padding:"15px 18px",marginBottom:16,border:"1px solid #f1f5f9",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
              <div style={{fontWeight:800,fontSize:13,marginBottom:11}}>🧪 Test Notification Sounds</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[{l:"🚨 Urgent",t:"urgent"},{l:"⚠️ Warning",t:"warning"},{l:"✅ Success",t:"success"},{l:"🔔 Default",t:"default"}].map(({l,t})=>(
                  <button key={t} onClick={()=>push(`Test: ${t}`,`This is a ${t} notification.`,t)} style={{padding:"8px 15px",border:"1px solid #e2e8f0",borderRadius:8,background:"#f8fafc",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,color:"#475569",transition:"all .15s"}}>{l}</button>
                ))}
              </div>
            </div>
 
            {/* Overdue */}
            {(()=>{
              const ods=tasks.flatMap(t=>t.subtasks.filter(s=>{const d=parseDate(s.end)||parseDate(s.plan);return s.status==="Pending"&&d&&daysDiff(d,TODAY)>0;}).map(s=>({...s,taskTitle:t.title,vendor:t.vendor,task:t,dOD:daysDiff(parseDate(s.end)||parseDate(s.plan),TODAY)})));
              if(!ods.length)return null;
              return(
                <div style={{marginBottom:16}}>
                  <div style={{fontWeight:800,fontSize:14,color:"#ef4444",marginBottom:9}}>🚨 Overdue Items ({ods.length})</div>
                  {ods.map((s,i)=>(
                    <div key={i} style={{background:"#fff",borderRadius:10,padding:"12px 17px",marginBottom:6,border:"1.5px solid #fecaca",display:"flex",alignItems:"center",gap:11,flexWrap:"wrap",boxShadow:"0 2px 8px rgba(239,68,68,.07)"}}>
                      <span style={{fontSize:20,flexShrink:0}}>⚠️</span>
                      <div style={{flex:1,minWidth:160}}>
                        <div style={{fontWeight:800,fontSize:13,color:"#1e293b"}}>{s.taskTitle} — {s.name}</div>
                        <div style={{fontSize:11,color:"#ef4444",marginTop:1}}><strong>{s.dOD} days overdue</strong> · {s.vendor||"TBD"} · Due: {fmt(s.end||s.plan)}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>push(`URGENT: ${s.taskTitle}`,`${s.name} is ${s.dOD} days overdue!`,"urgent")} style={{padding:"7px 13px",border:"none",borderRadius:7,background:"linear-gradient(135deg,#f97316,#ef4444)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>🔔 Alert</button>
                        <button onClick={()=>setEmailTask(s.task)} style={{padding:"7px 13px",border:"none",borderRadius:7,background:"linear-gradient(135deg,#ef4444,#dc2626)",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>📧 Email</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
 
            {/* All tasks */}
            <div>
              <div style={{fontWeight:800,fontSize:14,marginBottom:9}}>📋 All Projects</div>
              {tasks.map((task,idx)=>{
                const st=getStatus(task);
                const pr=computeProgress(task);
                const col=COLORS[task.id%COLORS.length];
                const pnd=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started").length;
                return(
                  <div key={task.id} style={{background:"#fff",borderRadius:10,padding:"12px 17px",marginBottom:6,border:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:11,flexWrap:"wrap",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:col}}/>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{fontWeight:700,fontSize:13}}>{task.title}</div>
                      <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{task.vendor||"No vendor"} · {pr}% done · {pnd} pending{task.poc&&` · ${task.poc}`}</div>
                    </div>
                    <div style={{fontSize:11,color:"#94a3b8",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.pocEmail||VENDOR_EMAILS[task.vendor]||"No email"}</div>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>push(`Reminder: ${task.title}`,`${pnd} items need attention.`,st==="Pending"?"warning":"default")} style={{padding:"7px 13px",border:`1.5px solid ${col}33`,borderRadius:7,background:`${col}12`,color:col,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>🔔 Notify</button>
                      <button onClick={()=>setEmailTask(task)} style={{padding:"7px 13px",border:"none",borderRadius:7,background:st==="Completed"?"#f1f5f9":`linear-gradient(135deg,${col}cc,${col})`,color:st==="Completed"?"#94a3b8":"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:700}}>📧 Email</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
 
      {showAdd&&<AddTaskModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} nextId={nextId}/>}
      {editTask&&<EditModal task={editTask} onClose={()=>setEditTask(null)} onSave={handleSave}/>}
      {emailTask&&<EmailModal task={emailTask} onClose={()=>setEmailTask(null)}/>}
    </div>
  );
}
