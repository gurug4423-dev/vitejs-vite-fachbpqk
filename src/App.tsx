import { useState, useMemo } from "react";

const TODAY = new Date("2026-04-20");

const VENDORS = {
  "AMADA LASER WELD TECH": "amada@vendor.com",
  "ITECH ROBOTICS": "info@itechrobotics.com",
  "ROBOTECH": "contact@robotech.com",
  "KEYENCE/COGNEX": "sales@keyence.com",
  "IROBOTICS": "procurement@irobotics.com",
  "FUJIYA NEBULA": "projects@fujiyaNebula.com",
  "Tsumitomo Pvt Ltd": "info@tsumitomo.in",
  "ADOFIL": "sales@adofil.com",
};

const RAW_TASKS = [
  { id:1, title:"Amada Laser Welding", vendor:"AMADA LASER WELD TECH", subtasks:[
    {sub:"1.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Delay due to bus bar templates missing then PO delay"},
    {sub:"1.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"1.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"1.4",name:"DAP",plan:null,actual:"2025-10-07",end:null,status:"Completed"},
    {sub:"1.5",name:"PO/LOI",plan:null,actual:"2025-09-17",end:null,status:"Completed"},
    {sub:"1.6",name:"Manufacturing",plan:"2026-01-07",actual:"2026-01-25",end:null,status:"Completed"},
    {sub:"1.7",name:"Validation-PDI",plan:"2026-01-31",actual:"2026-02-06",end:null,status:"Completed"},
    {sub:"1.8",name:"Dispatch",plan:"2026-02-06",actual:"2026-02-09",end:null,status:"Completed"},
    {sub:"1.9",name:"I & C",plan:"2026-02-17",actual:null,end:"2026-02-28",status:"Pending",overdue:"20 Days"},
  ]},
  { id:2, title:"Compression Machine", vendor:"ITECH ROBOTICS", subtasks:[
    {sub:"2.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"2.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"2.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"2.4",name:"DAP",plan:null,actual:"2025-10-06",end:null,status:"Completed"},
    {sub:"2.5",name:"PO/LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed"},
    {sub:"2.6",name:"Manufacturing",plan:null,actual:"2025-11-17",end:null,status:"Completed"},
    {sub:"2.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"2.8",name:"Dispatch",plan:null,actual:"2025-08-12",end:null,status:"Completed"},
    {sub:"2.9",name:"I & C",plan:null,actual:"2026-01-15",end:"2026-01-25",status:"Completed"},
    {sub:"2.91",name:"Pilot Trial",plan:null,actual:null,end:null,status:"Pending",remarks:"Pallets required"},
  ]},
  { id:3, title:"Cell Sorting", vendor:"ITECH ROBOTICS", subtasks:[
    {sub:"3.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Training On (16/03/2026)"},
    {sub:"3.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"3.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"3.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed"},
    {sub:"3.5",name:"PO/LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed"},
    {sub:"3.6",name:"Manufacturing",plan:null,actual:"2025-01-15",end:null,status:"Completed"},
    {sub:"3.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"3.8",name:"Dispatch & Delivery",plan:null,actual:"2026-01-28",end:null,status:"Completed"},
    {sub:"3.9",name:"I & C",plan:"2026-01-29",actual:"2026-02-23",end:"2026-03-14",status:"Completed"},
  ]},
  { id:4, title:"Conveyor Line for HV Line", vendor:"ROBOTECH", subtasks:[
    {sub:"4.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Pallet jackup mismatch, PLC issues, dry run pending"},
    {sub:"4.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"4.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"4.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed"},
    {sub:"4.5",name:"PO/LOI",plan:null,actual:"2025-09-08",end:null,status:"Completed"},
    {sub:"4.6",name:"Manufacturing",plan:"2024-12-05",actual:"2026-01-25",end:null,status:"Completed"},
    {sub:"4.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"4.8",name:"Dispatch & Delivery",plan:"2025-12-20",actual:"2026-01-26",end:null,status:"Completed"},
    {sub:"4.9",name:"I & C",plan:"2025-12-25",actual:"2026-01-30",end:null,status:"Pending",overdue:"50 Days"},
  ]},
  { id:5, title:"Module Genealogy Automated", vendor:"KEYENCE/COGNEX", subtasks:[
    {sub:"5.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Trials done, waiting for quotation"},
    {sub:"5.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"5.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"5.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"5.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"5.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"5.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"5.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"5.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
  { id:6, title:"Compression Pallets", vendor:"IROBOTICS", subtasks:[
    {sub:"6.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation yet to receive"},
    {sub:"6.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"6.3",name:"Quotation",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"6.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"6.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"6.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"6.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"6.8",name:"Dispatch & Delivery",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"6.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
  { id:7, title:"BMS Tester", vendor:"FUJIYA NEBULA", subtasks:[
    {sub:"7.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Machine Installed, Handover pending"},
    {sub:"7.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"7.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"7.4",name:"DAP",plan:null,actual:"2025-09-10",end:null,status:"Completed"},
    {sub:"7.5",name:"PO/LOI",plan:null,actual:"2025-09-16",end:null,status:"Completed"},
    {sub:"7.6",name:"Manufacturing",plan:null,actual:"2026-01-15",end:null,status:"Completed"},
    {sub:"7.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"7.8",name:"Dispatch & Delivery",plan:"2025-12-20",actual:"2026-03-16",end:null,status:"Completed"},
    {sub:"7.9",name:"I & C",plan:"2026-03-18",actual:"2026-03-26",end:null,status:"Completed"},
  ]},
  { id:8, title:"CDC Expansion", vendor:"Tsumitomo Pvt Ltd", subtasks:[
    {sub:"8.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Completed Successfully"},
    {sub:"8.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.5",name:"PO/LOI",plan:null,actual:"2025-10-05",end:null,status:"Completed"},
    {sub:"8.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"8.9",name:"I & C",plan:null,actual:"2025-10-10",end:null,status:"Completed"},
  ]},
  { id:9, title:"Epoxy Flooring - 3mm", vendor:"", subtasks:[
    {sub:"9.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Completed Successfully"},
    {sub:"9.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"9.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"9.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"9.5",name:"PO/LOI",plan:null,actual:"2025-11-07",end:null,status:"Completed"},
    {sub:"9.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"9.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"9.8",name:"Dispatch",plan:null,actual:"2025-11-10",end:null,status:"Completed"},
    {sub:"9.9",name:"I & C",plan:null,actual:"2025-11-10",end:null,status:"Completed"},
  ]},
  { id:10, title:"Adhesive Dispensing", vendor:"ADOFIL", subtasks:[
    {sub:"10.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Waiting for PO"},
    {sub:"10.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"10.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"10.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed"},
    {sub:"10.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"10.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"10.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"10.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"10.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
  { id:11, title:"XY Rail Setup - Assembly Area", vendor:"", subtasks:[
    {sub:"11.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"11.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"11.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
  { id:12, title:"XY Rail Setup - Packaging Area", vendor:"", subtasks:[
    {sub:"12.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"12.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"12.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
  { id:13, title:"Conveyor Line - Packaging Area", vendor:"", subtasks:[
    {sub:"13.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending"},
    {sub:"13.2",name:"NDA & Technical Discussion",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.5",name:"PO/LOI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started"},
    {sub:"13.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started"},
  ]},
];

const parseDate = (d) => {
  if (!d || d === "-" || d === "NaN") return null;
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
};

const fmt = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
};

const daysDiff = (d1, d2) => Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

const STATUS_META = {
  "Completed": { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", dot: "#16a34a" },
  "Pending": { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", dot: "#d97706" },
  "Not Started": { color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8" },
  "Yet to Complete": { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", dot: "#ea580c" },
};

const getStatusMeta = (s) => STATUS_META[s] || STATUS_META["Not Started"];

function computeProgress(task) {
  const total = task.subtasks.length;
  const done = task.subtasks.filter(s => s.status === "Completed" || s.status === "Completed ").length;
  return Math.round((done / total) * 100);
}

function getTaskOverallStatus(task) {
  const progress = computeProgress(task);
  if (progress === 100) return "Completed";
  if (task.subtasks.some(s => s.status === "Pending" || s.overdue)) return "Pending";
  if (progress > 0) return "In Progress";
  return "Not Started";
}

const GANTT_MONTHS = [
  "Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"
];
const MONTH_STARTS = [
  new Date("2025-09-01"), new Date("2025-10-01"), new Date("2025-11-01"),
  new Date("2025-12-01"), new Date("2026-01-01"), new Date("2026-02-01"),
  new Date("2026-03-01"), new Date("2026-04-01"), new Date("2026-05-01"),
];
const GANTT_START = MONTH_STARTS[0];
const GANTT_END = new Date("2026-05-31");
const GANTT_TOTAL_DAYS = daysDiff(GANTT_START, GANTT_END);

const pct = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const p = daysDiff(GANTT_START, d) / GANTT_TOTAL_DAYS * 100;
  return Math.max(0, Math.min(100, p));
};

function GanttBar({ task }) {
  const planStart = task.subtasks.map(s => parseDate(s.plan)).filter(Boolean).sort((a,b)=>a-b)[0];
  const actualStart = task.subtasks.map(s => parseDate(s.actual)).filter(Boolean).sort((a,b)=>a-b)[0];
  const endDates = task.subtasks.map(s => parseDate(s.end) || parseDate(s.actual) || parseDate(s.plan)).filter(Boolean);
  const endDate = endDates.sort((a,b)=>b-a)[0];

  const progress = computeProgress(task);
  const status = getTaskOverallStatus(task);

  const barColor = status === "Completed" ? "#22c55e" : status === "Pending" ? "#f59e0b" : status === "In Progress" ? "#3b82f6" : "#cbd5e1";

  const start = actualStart || planStart;
  if (!start || !endDate) {
    return (
      <div style={{ height: 28, display: "flex", alignItems: "center", paddingLeft: 8 }}>
        <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>No dates</span>
      </div>
    );
  }

  const left = pct(start);
  const right = pct(endDate);
  const width = Math.max(right - left, 1.5);

  return (
    <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
      <div style={{
        position: "absolute",
        left: `${left}%`,
        width: `${width}%`,
        height: 16,
        background: `linear-gradient(90deg, ${barColor}dd, ${barColor})`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: `0 1px 4px ${barColor}55`,
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "rgba(255,255,255,0.35)",
          borderRadius: 8,
        }}/>
      </div>
    </div>
  );
}

function EmailComposer({ task, onClose }) {
  const [to, setTo] = useState(VENDORS[task.vendor] || "");
  const [cc, setCc] = useState("projectmanager@company.com");
  const [subject, setSubject] = useState(`Reminder: ${task.title} — Action Required`);
  const pendingItems = task.subtasks.filter(s => s.status === "Pending" || s.status === "Not Started");
  const overdueItems = task.subtasks.filter(s => s.overdue);

  const defaultBody = `Dear ${task.vendor || "Team"},

This is a reminder regarding the **${task.title}** project.

📋 PENDING ITEMS:
${pendingItems.map(s => `  • ${s.sub} — ${s.name}${s.remarks ? ` (${s.remarks})` : ""}`).join("\n") || "  • No pending items"}

${overdueItems.length > 0 ? `⚠️ OVERDUE ITEMS:\n${overdueItems.map(s => `  • ${s.sub} — ${s.name} — OVERDUE by ${s.overdue}`).join("\n")}\n` : ""}
Please provide an update on the above items at your earliest convenience.

Regards,
Battery Industrialization Team`;

  const [body, setBody] = useState(defaultBody);

  const handleOpenMail = () => {
    const mailto = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 680,
        boxShadow: "0 25px 80px rgba(0,0,0,0.3)", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2847 100%)",
          padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ color: "#7dd3fc", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Email Reminder</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, marginTop: 2 }}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16,
          }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          {[["To", to, setTo], ["CC", cc, setCc], ["Subject", subject, setSubject]].map(([label, val, setter]) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{label}</label>
              <input value={val} onChange={e => setter(e.target.value)} style={{
                width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0",
                borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s",
              }} onFocus={e => e.target.style.borderColor="#3b82f6"}
                onBlur={e => e.target.style.borderColor="#e2e8f0"} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10} style={{
              width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0",
              borderRadius: 8, fontSize: 12, fontFamily: "monospace", outline: "none",
              resize: "vertical", boxSizing: "border-box", lineHeight: 1.6,
            }} onFocus={e => e.target.style.borderColor="#3b82f6"}
              onBlur={e => e.target.style.borderColor="#e2e8f0"} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{
              padding: "10px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8,
              background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#64748b",
            }}>Cancel</button>
            <button onClick={handleOpenMail} style={{
              padding: "10px 20px", border: "none", borderRadius: 8,
              background: "linear-gradient(135deg, #1e3a5f, #2563eb)", color: "#fff",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              boxShadow: "0 4px 12px #2563eb44",
            }}>📧 Open in Mail App</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskEditModal({ task, onClose, onSave }) {
  const [subtasks, setSubtasks] = useState(task.subtasks.map(s => ({ ...s })));
  const [vendor, setVendor] = useState(task.vendor);

  const update = (idx, field, val) => {
    const updated = [...subtasks];
    updated[idx] = { ...updated[idx], [field]: val };
    setSubtasks(updated);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 860,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 25px 80px rgba(0,0,0,0.3)", fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #0f2847 0%, #1e3a5f 100%)",
          padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <div>
            <div style={{ color: "#7dd3fc", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Edit Task</div>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginTop: 2 }}>{task.title}</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
            width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 16,
          }}>✕</button>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Vendor / Supplier</label>
          <input value={vendor} onChange={e => setVendor(e.target.value)} style={{
            display: "block", marginTop: 4, padding: "7px 12px", border: "1.5px solid #e2e8f0",
            borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", width: 300,
          }} />
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8fafc", position: "sticky", top: 0 }}>
                {["Sub","Task","Plan Date","Actual Date","End Date","Status","Remarks"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#64748b", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subtasks.map((s, i) => (
                <tr key={s.sub} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px 12px", color: "#94a3b8", fontWeight: 500 }}>{s.sub}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 500, color: "#1e293b" }}>{s.name}</td>
                  {["plan","actual","end"].map(field => (
                    <td key={field} style={{ padding: "4px 8px" }}>
                      <input type="date" value={s[field] || ""} onChange={e => update(i, field, e.target.value || null)}
                        style={{ padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, fontFamily: "inherit", outline: "none" }} />
                    </td>
                  ))}
                  <td style={{ padding: "4px 8px" }}>
                    <select value={s.status || "Not Started"} onChange={e => update(i, "status", e.target.value)}
                      style={{ padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, fontFamily: "inherit", outline: "none", background: "#fff" }}>
                      {["Completed","Pending","Not Started","Yet to Complete","In Progress"].map(st => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "4px 8px" }}>
                    <input value={s.remarks || ""} onChange={e => update(i, "remarks", e.target.value)}
                      placeholder="Add remarks..." style={{ padding: "5px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, fontFamily: "inherit", outline: "none", width: 160 }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", border: "1.5px solid #e2e8f0", borderRadius: 8,
            background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, color: "#64748b",
          }}>Cancel</button>
          <button onClick={() => onSave({ ...task, vendor, subtasks })} style={{
            padding: "10px 24px", border: "none", borderRadius: 8,
            background: "linear-gradient(135deg, #0f2847, #1e40af)", color: "#fff",
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
          }}>💾 Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(RAW_TASKS);
  const [activeTab, setActiveTab] = useState("overview");
  const [emailTask, setEmailTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedTask, setExpandedTask] = useState(null);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => getTaskOverallStatus(t) === "Completed").length;
    const pending = tasks.filter(t => getTaskOverallStatus(t) === "Pending").length;
    const inProgress = tasks.filter(t => getTaskOverallStatus(t) === "In Progress").length;
    const notStarted = tasks.filter(t => getTaskOverallStatus(t) === "Not Started").length;
    const overdue = tasks.flatMap(t => t.subtasks).filter(s => s.overdue).length;
    const avgProgress = Math.round(tasks.reduce((a, t) => a + computeProgress(t), 0) / total);
    return { total, completed, pending, inProgress, notStarted, overdue, avgProgress };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filterStatus === "All") return tasks;
    return tasks.filter(t => getTaskOverallStatus(t) === filterStatus);
  }, [tasks, filterStatus]);

  const handleSaveTask = (updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditTask(null);
  };

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "gantt", label: "📅 Gantt Chart" },
    { id: "tasks", label: "📋 Task Tracker" },
    { id: "reminders", label: "📧 Email Reminders" },
  ];

  const colors = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316","#6366f1","#84cc16","#a855f7"];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f0f4f8", minHeight: "100vh", color: "#1e293b" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .tab-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .row-hover:hover { background: #f8fafc !important; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)",
        padding: "0 32px",
        boxShadow: "0 4px 24px rgba(15,23,42,0.3)",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ paddingTop: 24, paddingBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 4px 12px rgba(56,189,248,0.4)",
              }}>⚡</div>
              <div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Battery Industrialization Timeline</div>
                <div style={{ color: "#7dd3fc", fontSize: 12, fontWeight: 500, marginTop: 2 }}>
                  HV Line · 27 Projects · Live as of {TODAY.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Completed", val: stats.completed, color: "#22c55e" },
                  { label: "In Progress", val: stats.inProgress, color: "#3b82f6" },
                  { label: "Pending", val: stats.pending, color: "#f59e0b" },
                  { label: "⚠ Overdue", val: stats.overdue, color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 16px",
                    textAlign: "center", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    <div style={{ color: s.color, fontSize: 20, fontWeight: 800 }}>{s.val}</div>
                    <div style={{ color: "#cbd5e1", fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map(tab => (
              <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{
                padding: "10px 20px", border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                borderRadius: "10px 10px 0 0", transition: "all 0.2s",
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#1e3a5f" : "#93c5fd",
              }}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            {/* Progress bar */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Overall Project Progress</span>
                <span style={{ fontWeight: 800, fontSize: 22, color: "#1e3a5f" }}>{stats.avgProgress}%</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 12, height: 14, overflow: "hidden" }}>
                <div style={{
                  width: `${stats.avgProgress}%`, height: "100%",
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                  borderRadius: 12, transition: "width 0.8s ease",
                }}/>
              </div>
              <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
                {[
                  { label: "Total Projects", val: stats.total, color: "#64748b" },
                  { label: "Completed", val: stats.completed, color: "#22c55e" },
                  { label: "In Progress", val: stats.inProgress, color: "#3b82f6" },
                  { label: "Pending", val: stats.pending, color: "#f59e0b" },
                  { label: "Not Started", val: stats.notStarted, color: "#94a3b8" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {tasks.map((task, idx) => {
                const progress = computeProgress(task);
                const status = getTaskOverallStatus(task);
                const meta = getStatusMeta(status);
                const color = colors[idx % colors.length];
                const overdues = task.subtasks.filter(s => s.overdue);
                const pendingItems = task.subtasks.filter(s => s.status === "Pending");

                return (
                  <div key={task.id} className="card" style={{
                    background: "#fff", borderRadius: 14, overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s",
                    borderTop: `3px solid ${color}`,
                  }}>
                    <div style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.5 }}>#{task.id} · {task.vendor || "Vendor TBD"}</div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginTop: 2, lineHeight: 1.3 }}>{task.title}</div>
                        </div>
                        <div style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                          whiteSpace: "nowrap", marginLeft: 8,
                        }}>{status}</div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: "#64748b" }}>Progress</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: color }}>{progress}%</span>
                        </div>
                        <div style={{ background: "#f1f5f9", borderRadius: 6, height: 6 }}>
                          <div style={{ width: `${progress}%`, height: "100%", background: color, borderRadius: 6 }}/>
                        </div>
                      </div>

                      {overdues.length > 0 && (
                        <div style={{ marginTop: 8, padding: "6px 10px", background: "#fff5f5", borderRadius: 8, border: "1px solid #fecaca" }}>
                          <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>⚠ {overdues.length} overdue: </span>
                          <span style={{ fontSize: 11, color: "#ef4444" }}>{overdues.map(s => s.name).join(", ")}</span>
                        </div>
                      )}

                      {pendingItems.length > 0 && !overdues.length && (
                        <div style={{ marginTop: 8, padding: "6px 10px", background: "#fffbeb", borderRadius: 8, border: "1px solid #fde68a" }}>
                          <span style={{ fontSize: 11, color: "#d97706", fontWeight: 600 }}>⏳ Pending: </span>
                          <span style={{ fontSize: 11, color: "#d97706" }}>{pendingItems.map(s => s.name).join(", ")}</span>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button className="action-btn" onClick={() => setEditTask(task)} style={{
                          flex: 1, padding: "7px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                          background: "#f8fafc", cursor: "pointer", fontSize: 11, fontWeight: 600,
                          color: "#475569", fontFamily: "inherit", transition: "all 0.15s",
                        }}>✏️ Edit</button>
                        <button className="action-btn" onClick={() => setEmailTask(task)} style={{
                          flex: 1, padding: "7px", border: "none", borderRadius: 8,
                          background: `linear-gradient(135deg, ${color}22, ${color}33)`,
                          cursor: "pointer", fontSize: 11, fontWeight: 600,
                          color: color, fontFamily: "inherit", transition: "all 0.15s",
                          border: `1.5px solid ${color}44`,
                        }}>📧 Remind</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── GANTT CHART ── */}
        {activeTab === "gantt" && (
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Gantt Chart</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Battery Industrialization Timeline · Sep 2025 — May 2026</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                {[["Completed","#22c55e"],["In Progress","#3b82f6"],["Pending","#f59e0b"],["Not Started","#94a3b8"]].map(([label,color]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: color }}/>
                    <span style={{ color: "#64748b" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 900 }}>
                {/* Month headers */}
                <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: 220, flexShrink: 0, padding: "10px 16px", fontWeight: 700, fontSize: 12, color: "#64748b", background: "#fafafa", borderRight: "1px solid #f1f5f9" }}>
                    Project
                  </div>
                  <div style={{ flex: 1, display: "flex", background: "#fafafa" }}>
                    {GANTT_MONTHS.map(m => (
                      <div key={m} style={{
                        flex: 1, padding: "10px 4px", fontSize: 10, fontWeight: 700,
                        color: "#64748b", textAlign: "center", borderRight: "1px solid #f1f5f9",
                        letterSpacing: 0.5,
                      }}>{m}</div>
                    ))}
                  </div>
                </div>

                {/* Today line position */}
                {tasks.map((task, idx) => {
                  const progress = computeProgress(task);
                  const status = getTaskOverallStatus(task);
                  const color = colors[idx % colors.length];
                  const barColor = status === "Completed" ? "#22c55e" : status === "Pending" ? "#f59e0b" : status === "In Progress" ? "#3b82f6" : "#cbd5e1";

                  const planStart = task.subtasks.map(s => parseDate(s.plan)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const actualStart = task.subtasks.map(s => parseDate(s.actual)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const endDates = task.subtasks.flatMap(s => [parseDate(s.end), parseDate(s.actual), parseDate(s.plan)]).filter(Boolean);
                  const endDate = endDates.sort((a,b)=>b-a)[0];
                  const start = actualStart || planStart;

                  const todayPct = pct(TODAY);

                  return (
                    <div key={task.id} className="row-hover" style={{
                      display: "flex", borderBottom: "1px solid #f8fafc",
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}>
                      <div style={{
                        width: 220, flexShrink: 0, padding: "10px 16px",
                        borderRight: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8,
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%", background: barColor, flexShrink: 0,
                        }}/>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{task.title}</div>
                          <div style={{ fontSize: 10, color: "#94a3b8" }}>{progress}% done</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, position: "relative", padding: "6px 0" }}>
                        {/* Month grid lines */}
                        {MONTH_STARTS.map((ms, i) => (
                          <div key={i} style={{
                            position: "absolute", left: `${pct(ms)}%`, top: 0, bottom: 0,
                            width: 1, background: "#f1f5f9",
                          }}/>
                        ))}
                        {/* Today line */}
                        <div style={{
                          position: "absolute", left: `${todayPct}%`, top: 0, bottom: 0,
                          width: 2, background: "#ef4444", opacity: 0.6, zIndex: 2,
                        }}/>
                        {/* Bar */}
                        {start && endDate ? (
                          <div style={{
                            position: "absolute",
                            left: `${pct(start)}%`,
                            width: `${Math.max(pct(endDate) - pct(start), 1.5)}%`,
                            top: "50%", transform: "translateY(-50%)",
                            height: 20, borderRadius: 10,
                            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                            boxShadow: `0 2px 6px ${barColor}44`,
                            overflow: "hidden",
                          }}>
                            <div style={{
                              width: `${progress}%`, height: "100%",
                              background: "rgba(255,255,255,0.3)", borderRadius: 10,
                            }}/>
                          </div>
                        ) : (
                          <div style={{
                            position: "absolute", left: "5%", top: "50%", transform: "translateY(-50%)",
                          }}>
                            <span style={{ fontSize: 9, color: "#cbd5e1", fontStyle: "italic" }}>No dates set</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Today label */}
                <div style={{ display: "flex", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <div style={{ width: 220, flexShrink: 0, padding: "8px 16px", fontSize: 11, color: "#94a3b8" }}>Today: {fmt(TODAY)}</div>
                  <div style={{ flex: 1, position: "relative", height: 32 }}>
                    <div style={{
                      position: "absolute", left: `${pct(TODAY)}%`, transform: "translateX(-50%)",
                      top: 8, fontSize: 9, fontWeight: 700, color: "#ef4444",
                      background: "#fff5f5", padding: "2px 6px", borderRadius: 4, border: "1px solid #fecaca",
                      whiteSpace: "nowrap",
                    }}>▲ TODAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TASK TRACKER ── */}
        {activeTab === "tasks" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {["All","Completed","In Progress","Pending","Not Started"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)} style={{
                  padding: "8px 18px", border: "1.5px solid", borderRadius: 20, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  borderColor: filterStatus === f ? "#1e3a5f" : "#e2e8f0",
                  background: filterStatus === f ? "#1e3a5f" : "#fff",
                  color: filterStatus === f ? "#fff" : "#64748b",
                }}>{f} {f !== "All" && <span style={{ opacity: 0.7 }}>({tasks.filter(t => getTaskOverallStatus(t) === f).length})</span>}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredTasks.map((task, idx) => {
                const progress = computeProgress(task);
                const status = getTaskOverallStatus(task);
                const color = colors[task.id % colors.length];
                const isExpanded = expandedTask === task.id;

                return (
                  <div key={task.id} style={{
                    background: "#fff", borderRadius: 12, overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9",
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                      cursor: "pointer",
                    }} onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${color}18`, display: "flex", alignItems: "center",
                        justifyContent: "center", fontWeight: 800, fontSize: 13, color, flexShrink: 0,
                      }}>{task.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{task.title}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{task.vendor || "Vendor TBD"} · {task.subtasks.length} subtasks</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800, fontSize: 16, color }}>{progress}%</div>
                          <div style={{ background: "#f1f5f9", borderRadius: 4, height: 4, width: 80, marginTop: 3 }}>
                            <div style={{ width: `${progress}%`, height: "100%", background: color, borderRadius: 4 }}/>
                          </div>
                        </div>
                        <div style={{
                          padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                          ...{ background: getStatusMeta(status).bg, color: getStatusMeta(status).color, border: `1px solid ${getStatusMeta(status).border}` }
                        }}>{status}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="action-btn" onClick={e => { e.stopPropagation(); setEditTask(task); }} style={{
                            padding: "6px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7,
                            background: "#f8fafc", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#475569",
                            fontFamily: "inherit", transition: "all 0.15s",
                          }}>✏️</button>
                          <button className="action-btn" onClick={e => { e.stopPropagation(); setEmailTask(task); }} style={{
                            padding: "6px 12px", border: "none", borderRadius: 7,
                            background: `${color}18`, cursor: "pointer", fontSize: 11, fontWeight: 600,
                            color, fontFamily: "inherit", transition: "all 0.15s",
                            border: `1.5px solid ${color}33`,
                          }}>📧</button>
                        </div>
                        <span style={{ color: "#94a3b8", fontSize: 14 }}>{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ borderTop: "1px solid #f8fafc" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ background: "#fafafa" }}>
                              {["Sub","Task Name","Plan Date","Actual Date","End Date","Status","Overdue","Remarks"].map(h => (
                                <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "#94a3b8", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {task.subtasks.map(s => {
                              const meta = getStatusMeta(s.status);
                              return (
                                <tr key={s.sub} className="row-hover" style={{ borderTop: "1px solid #f8fafc" }}>
                                  <td style={{ padding: "8px 14px", color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>{s.sub}</td>
                                  <td style={{ padding: "8px 14px", fontWeight: 600, color: "#1e293b" }}>{s.name}</td>
                                  <td style={{ padding: "8px 14px", color: "#64748b" }}>{fmt(s.plan)}</td>
                                  <td style={{ padding: "8px 14px", color: "#64748b" }}>{fmt(s.actual)}</td>
                                  <td style={{ padding: "8px 14px", color: "#64748b" }}>{fmt(s.end)}</td>
                                  <td style={{ padding: "8px 14px" }}>
                                    <span style={{
                                      padding: "3px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                                      background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                                    }}>{s.status || "—"}</span>
                                  </td>
                                  <td style={{ padding: "8px 14px" }}>
                                    {s.overdue ? <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 11 }}>⚠ {s.overdue}</span> : <span style={{ color: "#cbd5e1" }}>—</span>}
                                  </td>
                                  <td style={{ padding: "8px 14px", color: "#64748b", maxWidth: 200, fontSize: 11 }}>
                                    {s.remarks ? <span title={s.remarks}>{s.remarks.length > 50 ? s.remarks.slice(0,50)+"…" : s.remarks}</span> : <span style={{ color: "#cbd5e1" }}>—</span>}
                                  </td>
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

        {/* ── EMAIL REMINDERS ── */}
        {activeTab === "reminders" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              borderRadius: 14, padding: "16px 20px", marginBottom: 20,
              border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{ fontSize: 28 }}>📧</div>
              <div>
                <div style={{ fontWeight: 700, color: "#1e40af", fontSize: 14 }}>Automated Email Reminders</div>
                <div style={{ color: "#3b82f6", fontSize: 12, marginTop: 2 }}>
                  Click "Send Reminder" on any task to compose and send a pre-filled email to the vendor/POC. Add the vendor email in the To field.
                </div>
              </div>
            </div>

            {/* Overdue items */}
            {tasks.flatMap(t => t.subtasks.filter(s => s.overdue).map(s => ({ ...s, taskTitle: t.title, taskId: t.id, vendor: t.vendor, task: t }))).length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#ef4444", marginBottom: 10 }}>🚨 Overdue Items ({tasks.flatMap(t => t.subtasks.filter(s => s.overdue)).length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {tasks.flatMap(t => t.subtasks.filter(s => s.overdue).map(s => ({ ...s, taskTitle: t.title, vendor: t.vendor, task: t }))).map((s, i) => (
                    <div key={i} style={{
                      background: "#fff", borderRadius: 10, padding: "14px 18px",
                      border: "1.5px solid #fecaca", display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, background: "#fff5f5",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                      }}>⚠️</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{s.taskTitle} — {s.name}</div>
                        <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>
                          Overdue by <strong>{s.overdue}</strong> · Vendor: {s.vendor || "TBD"} · Planned: {fmt(s.plan)}
                        </div>
                      </div>
                      <button className="action-btn" onClick={() => setEmailTask(s.task)} style={{
                        padding: "8px 18px", border: "none", borderRadius: 8,
                        background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700,
                        transition: "all 0.15s", boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                      }}>📧 Send Urgent Reminder</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All pending by vendor */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 10 }}>📋 All Tasks — Reminder Status</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tasks.map((task, idx) => {
                  const status = getTaskOverallStatus(task);
                  const progress = computeProgress(task);
                  const color = colors[task.id % colors.length];
                  const pendingCount = task.subtasks.filter(s => s.status === "Pending" || s.status === "Not Started").length;

                  return (
                    <div key={task.id} style={{
                      background: "#fff", borderRadius: 10, padding: "14px 18px",
                      border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 14,
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                        background: status === "Completed" ? "#22c55e" : status === "Pending" ? "#f59e0b" : status === "In Progress" ? "#3b82f6" : "#cbd5e1",
                      }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{task.title}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                          Vendor: <strong>{task.vendor || "Not assigned"}</strong> · {progress}% complete · {pendingCount} items pending
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{VENDORS[task.vendor] || "No email"}</div>
                      <button className="action-btn" onClick={() => setEmailTask(task)} style={{
                        padding: "8px 18px", border: "none", borderRadius: 8,
                        background: status === "Completed" ? "#f1f5f9" : `linear-gradient(135deg, ${color}cc, ${color})`,
                        color: status === "Completed" ? "#94a3b8" : "#fff",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                        transition: "all 0.15s", boxShadow: status === "Completed" ? "none" : `0 2px 8px ${color}44`,
                      }}>📧 {status === "Completed" ? "Send Update" : "Send Reminder"}</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {emailTask && <EmailComposer task={emailTask} onClose={() => setEmailTask(null)} />}
      {editTask && <TaskEditModal task={editTask} onClose={() => setEditTask(null)} onSave={handleSaveTask} />}
    </div>
  );
}