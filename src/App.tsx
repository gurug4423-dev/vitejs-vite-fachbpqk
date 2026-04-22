import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.min.js";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TODAY = new Date("2026-04-20");
const STORAGE_KEY = "batt_v4";
const ALERT_KEY   = "batt_alerts_v4";

const STAGE_NAMES = ["Supplier Hunt","NDA & Discussion","Quotation","DAP","PO / LOI","Manufacturing","Validation-PDI","Dispatch","I & C"];
const VENDOR_EMAILS = {"AMADA LASER WELD TECH":"amada@vendor.com","ITECH ROBOTICS":"info@itechrobotics.com","ROBOTECH":"contact@robotech.com","KEYENCE/COGNEX":"sales@keyence.com","IROBOTICS":"procurement@irobotics.com","FUJIYA NEBULA":"projects@fujiyaNebula.com","Tsumitomo Pvt Ltd":"info@tsumitomo.in","ADOFIL":"sales@adofil.com"};

const INIT=[
  {id:1,title:"Amada Laser Welding",vendor:"AMADA LASER WELD TECH",poc:"",pocEmail:"",subtasks:[{sub:"1.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Bus bar delay"},{sub:"1.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"1.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"1.4",name:"DAP",plan:null,actual:"2025-10-07",end:null,status:"Completed",remarks:""},{sub:"1.5",name:"PO / LOI",plan:null,actual:"2025-09-17",end:null,status:"Completed",remarks:""},{sub:"1.6",name:"Manufacturing",plan:"2026-01-07",actual:"2026-01-25",end:null,status:"Completed",remarks:""},{sub:"1.7",name:"Validation-PDI",plan:"2026-01-31",actual:"2026-02-06",end:null,status:"Completed",remarks:""},{sub:"1.8",name:"Dispatch",plan:"2026-02-06",actual:"2026-02-09",end:null,status:"Completed",remarks:""},{sub:"1.9",name:"I & C",plan:"2026-02-17",actual:null,end:"2026-02-28",status:"Pending",remarks:"20d overdue"}]},
  {id:2,title:"Compression Machine",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"2.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.4",name:"DAP",plan:null,actual:"2025-10-06",end:null,status:"Completed",remarks:""},{sub:"2.5",name:"PO / LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},{sub:"2.6",name:"Manufacturing",plan:null,actual:"2025-11-17",end:null,status:"Completed",remarks:""},{sub:"2.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"2.8",name:"Dispatch",plan:null,actual:"2025-08-12",end:null,status:"Completed",remarks:""},{sub:"2.9",name:"I & C",plan:null,actual:"2026-01-15",end:"2026-01-25",status:"Completed",remarks:""},{sub:"2.10",name:"Pilot Trial",plan:null,actual:null,end:null,status:"Pending",remarks:"Pallets required"}]},
  {id:3,title:"Cell Sorting",vendor:"ITECH ROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"3.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Training 16/03"},{sub:"3.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},{sub:"3.5",name:"PO / LOI",plan:null,actual:"2025-09-11",end:null,status:"Completed",remarks:""},{sub:"3.6",name:"Manufacturing",plan:null,actual:"2025-01-15",end:null,status:"Completed",remarks:""},{sub:"3.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"3.8",name:"Dispatch",plan:null,actual:"2026-01-28",end:null,status:"Completed",remarks:""},{sub:"3.9",name:"I & C",plan:"2026-01-29",actual:"2026-02-23",end:"2026-03-14",status:"Completed",remarks:""}]},
  {id:4,title:"Conveyor Line – HV",vendor:"ROBOTECH",poc:"",pocEmail:"",subtasks:[{sub:"4.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"PLC issues"},{sub:"4.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.4",name:"DAP",plan:null,actual:"2025-10-04",end:null,status:"Completed",remarks:""},{sub:"4.5",name:"PO / LOI",plan:null,actual:"2025-09-08",end:null,status:"Completed",remarks:""},{sub:"4.6",name:"Manufacturing",plan:"2024-12-05",actual:"2026-01-25",end:null,status:"Completed",remarks:""},{sub:"4.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"4.8",name:"Dispatch",plan:"2025-12-20",actual:"2026-01-26",end:null,status:"Completed",remarks:""},{sub:"4.9",name:"I & C",plan:"2025-12-25",actual:"2026-01-30",end:null,status:"Pending",remarks:"50d overdue"}]},
  {id:5,title:"Module Genealogy Auto",vendor:"KEYENCE/COGNEX",poc:"",pocEmail:"",subtasks:[{sub:"5.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation awaited"},{sub:"5.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"5.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"5.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"5.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:6,title:"Compression Pallets",vendor:"IROBOTICS",poc:"",pocEmail:"",subtasks:[{sub:"6.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Quotation pending"},{sub:"6.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"6.3",name:"Quotation",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"6.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"6.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:7,title:"BMS Tester",vendor:"FUJIYA NEBULA",poc:"",pocEmail:"",subtasks:[{sub:"7.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Handover pending"},{sub:"7.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.4",name:"DAP",plan:null,actual:"2025-09-10",end:null,status:"Completed",remarks:""},{sub:"7.5",name:"PO / LOI",plan:null,actual:"2025-09-16",end:null,status:"Completed",remarks:""},{sub:"7.6",name:"Manufacturing",plan:null,actual:"2026-01-15",end:null,status:"Completed",remarks:""},{sub:"7.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"7.8",name:"Dispatch",plan:"2025-12-20",actual:"2026-03-16",end:null,status:"Completed",remarks:""},{sub:"7.9",name:"I & C",plan:"2026-03-18",actual:"2026-03-26",end:null,status:"Completed",remarks:""}]},
  {id:8,title:"CDC Expansion",vendor:"Tsumitomo Pvt Ltd",poc:"",pocEmail:"",subtasks:[{sub:"8.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Done"},{sub:"8.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.5",name:"PO / LOI",plan:null,actual:"2025-10-05",end:null,status:"Completed",remarks:""},{sub:"8.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"8.9",name:"I & C",plan:null,actual:"2025-10-10",end:null,status:"Completed",remarks:""}]},
  {id:9,title:"Epoxy Flooring – 3mm",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"9.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.5",name:"PO / LOI",plan:null,actual:"2025-11-07",end:null,status:"Completed",remarks:""},{sub:"9.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"9.8",name:"Dispatch",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""},{sub:"9.9",name:"I & C",plan:null,actual:"2025-11-10",end:null,status:"Completed",remarks:""}]},
  {id:10,title:"Adhesive Dispensing",vendor:"ADOFIL",poc:"",pocEmail:"",subtasks:[{sub:"10.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Awaiting PO"},{sub:"10.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.3",name:"Quotation",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.4",name:"DAP",plan:null,actual:null,end:null,status:"Completed",remarks:""},{sub:"10.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"10.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"10.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:11,title:"XY Rail – Sub Assembly Area",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"11.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:"11m×4m, 2 cross rails, 1T payload motor each"},{sub:"11.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"11.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:12,title:"XY Rail – Packaging Area",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"12.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:"30m×10m, 3 cross rails, 1T payload motor each"},{sub:"12.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"12.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:13,title:"Conveyor Line – Packaging Area",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"13.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:"2 Nos, 20m×1m×0.9m, 5T payload"},{sub:"13.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"13.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:14,title:"Suspension Wheels for Towing",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"14.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"Towing trolley T1 to T4 battery movement"},{sub:"14.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"14.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:15,title:"Pallets for New Compression Machine",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"15.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Completed",remarks:"10 Sets"},{sub:"15.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"15.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:16,title:"Trolley for CDC (One over One)",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"16.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:"15s-10Nos, Beta-10Nos, Gamma-10Nos"},{sub:"16.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"16.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:17,title:"Cage Pallet / Trolley – Battery Box BOP",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"17.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"17.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"17.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:18,title:"High Rise Racks – Battery Box Storage",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"18.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"18.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"18.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:19,title:"MZ Floor – Obsolete Inventory (NMC)",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"19.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"19.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"19.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:20,title:"Entry Exit Gate – Increased Height",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"20.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"20.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"20.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:21,title:"Module Storage System",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"21.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"21.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"21.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:22,title:"Leak Detector Machines",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"22.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:"Qty: 2 Nos"},{sub:"22.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"22.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:23,title:"Existing Laser Machine Upgradation",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"23.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"23.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"23.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:24,title:"Pallet Stacker / Fork Lifter – Battery Store",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"24.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"24.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"24.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:25,title:"Cell Storage Enclosure – 2nd",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"25.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"25.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"25.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:26,title:"Vertical Storage – Battery BOPs",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"26.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"26.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"26.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
  {id:27,title:"DC Tools with Controller",vendor:"",poc:"",pocEmail:"",subtasks:[{sub:"27.1",name:"Supplier Hunt",plan:null,actual:null,end:null,status:"Pending",remarks:""},{sub:"27.2",name:"NDA & Discussion",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.3",name:"Quotation",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.4",name:"DAP",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.5",name:"PO / LOI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.6",name:"Manufacturing",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.7",name:"Validation-PDI",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.8",name:"Dispatch",plan:null,actual:null,end:null,status:"Not Started",remarks:""},{sub:"27.9",name:"I & C",plan:null,actual:null,end:null,status:"Not Started",remarks:""}]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const parseDate = d => { if (!d) return null; const x = new Date(d); return isNaN(x) ? null : x; };
const fmt = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const daysDiff = (a,b) => Math.round((b-a)/86400000);
const computeProgress = t => !t.subtasks.length ? 0 : Math.round(t.subtasks.filter(s=>s.status==="Completed").length/t.subtasks.length*100);
const getStatus = t => {const p=computeProgress(t);if(p===100)return"Completed";if(t.subtasks.some(s=>s.status==="Pending"))return"Pending";if(p>0)return"In Progress";return"Not Started";};
const isOD = s => {const d=parseDate(s.end)||parseDate(s.plan);return s.status==="Pending"&&d&&daysDiff(d,TODAY)>0;};

// ─── GANTT ────────────────────────────────────────────────────────────────────
const G_MONTHS=["Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"];
const G_STARTS=[new Date("2025-09-01"),new Date("2025-10-01"),new Date("2025-11-01"),new Date("2025-12-01"),new Date("2026-01-01"),new Date("2026-02-01"),new Date("2026-03-01"),new Date("2026-04-01"),new Date("2026-05-01")];
const G_START=G_STARTS[0];
const G_TOTAL=daysDiff(G_START,new Date("2026-05-31"));
const gP=d=>Math.max(0,Math.min(100,daysDiff(G_START,new Date(d))/G_TOTAL*100));

// ─── SOUND ───────────────────────────────────────────────────────────────────
const playTone = type => {
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const p={critical:[[880,0,.06],[660,.08,.06],[880,.16,.1]],warning:[[523,0,.08],[659,.1,.08]],success:[[523,0,.05],[784,.08,.1]],info:[[440,0,.07]]};
  (p[type]||p.info).forEach(([f,s,d])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(0,ctx.currentTime+s);g.gain.linearRampToValueAtTime(.18,ctx.currentTime+s+.01);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+s+d);o.start(ctx.currentTime+s);o.stop(ctx.currentTime+s+d+.05);});}catch{}
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Warm slate — not whitish, not coal black. Steel-blue mid-tones.
const C = {
  bg:       "#1a1f2e",   // page bg — deep navy-slate
  surface:  "#232a3b",   // card/table surface
  surface2: "#2a3347",   // slightly lighter surface
  border:   "#334155",   // visible border
  border2:  "#3d4f6a",   // hover border
  text1:    "#e2e8f0",   // primary text
  text2:    "#94a3b8",   // secondary
  text3:    "#64748b",   // muted
  accent:   "#3b82f6",   // blue accent
  hdr:      "#141824",   // header — solid, distinct
  hdrBdr:   "#2a3347",
};

const STATUS_COLORS = {
  "Completed":   {bg:"#0d3320",text:"#4ade80",border:"#166534"},
  "Pending":     {bg:"#2d1f00",text:"#fbbf24",border:"#78350f"},
  "In Progress": {bg:"#0c2040",text:"#60a5fa",border:"#1d4ed8"},
  "Not Started": {bg:"#202736",text:"#64748b",border:"#334155"},
};
const getSC = s => STATUS_COLORS[s]||STATUS_COLORS["Not Started"];

const ACCENTS = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#f43f5e","#ec4899","#14b8a6","#f97316","#a78bfa","#34d399","#fb923c"];

// ─── SMART ALERTS ─────────────────────────────────────────────────────────────
const seenSet = (()=>{try{return new Set(JSON.parse(localStorage.getItem(ALERT_KEY)||"[]"));}catch{return new Set();}})();
const shouldFire = k => !seenSet.has(k);
const markFired  = k => {seenSet.add(k);try{localStorage.setItem(ALERT_KEY,JSON.stringify([...seenSet].slice(-300)));}catch{}};

// ─── EXCEL EXPORT ─────────────────────────────────────────────────────────────
function exportToExcel(tasks) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData = [
    ["BATTERY INDUSTRIALIZATION TIMELINE — EXPORT"],
    [`Generated: ${new Date().toLocaleString("en-IN")}`],
    [],
    ["#","Project Title","Vendor","POC","POC Email","Progress %","Status","Overdue Subtasks","Total Subtasks","Completed"],
    ...tasks.map(t => {
      const pr = computeProgress(t);
      const st = getStatus(t);
      const od = t.subtasks.filter(isOD).length;
      const done = t.subtasks.filter(s=>s.status==="Completed").length;
      return [t.id, t.title, t.vendor||"", t.poc||"", t.pocEmail||"", `${pr}%`, st, od, t.subtasks.length, done];
    }),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1["!cols"] = [{wch:4},{wch:32},{wch:24},{wch:18},{wch:26},{wch:12},{wch:14},{wch:16},{wch:15},{wch:12}];
  ws1["!merges"] = [{s:{r:0,c:0},e:{r:0,c:9}}];
  XLSX.utils.book_append_sheet(wb, ws1, "Summary");

  // Sheet 2: Detailed Timeline
  const detailData = [
    ["DETAILED STAGE-WISE TIMELINE"],
    [`As of: ${fmt(TODAY)}`],
    [],
    ["S.No","Project","Vendor","Stage","Plan Date","Actual Date","End Date","Status","Overdue?","Remarks"],
  ];
  tasks.forEach(t => {
    t.subtasks.forEach(s => {
      const od = isOD(s);
      detailData.push([
        s.sub, t.title, t.vendor||"", s.name,
        s.plan ? fmt(s.plan) : "—",
        s.actual ? fmt(s.actual) : "—",
        s.end ? fmt(s.end) : "—",
        s.status||"",
        od ? `YES — ${daysDiff(parseDate(s.end)||parseDate(s.plan),TODAY)}d` : "No",
        s.remarks||"",
      ]);
    });
    detailData.push([]); // blank row between projects
  });
  const ws2 = XLSX.utils.aoa_to_sheet(detailData);
  ws2["!cols"] = [{wch:6},{wch:30},{wch:22},{wch:22},{wch:14},{wch:14},{wch:14},{wch:14},{wch:14},{wch:36}];
  XLSX.utils.book_append_sheet(wb, ws2, "Detailed Timeline");

  // Sheet 3: Pending & Overdue
  const alertData = [
    ["PENDING & OVERDUE ITEMS"],
    [`As of: ${fmt(TODAY)}`],
    [],
    ["Project","Vendor","Stage","Status","Plan Date","End Date","Days Overdue","Remarks"],
  ];
  tasks.forEach(t => {
    t.subtasks.filter(s=>s.status==="Pending"||isOD(s)).forEach(s => {
      const d = parseDate(s.end)||parseDate(s.plan);
      const od = d ? Math.max(0,daysDiff(d,TODAY)) : 0;
      alertData.push([t.title, t.vendor||"", s.name, s.status, s.plan?fmt(s.plan):"—", s.end?fmt(s.end):"—", od>0?od:"", s.remarks||""]);
    });
  });
  const ws3 = XLSX.utils.aoa_to_sheet(alertData);
  ws3["!cols"] = [{wch:30},{wch:22},{wch:22},{wch:14},{wch:14},{wch:14},{wch:14},{wch:36}];
  XLSX.utils.book_append_sheet(wb, ws3, "Pending & Overdue");

  // Sheet 4: Gantt — colored cell fills
  const GM = ["Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"];
  const GS = [new Date("2025-09-01"),new Date("2025-10-01"),new Date("2025-11-01"),new Date("2025-12-01"),new Date("2026-01-01"),new Date("2026-02-01"),new Date("2026-03-01"),new Date("2026-04-01"),new Date("2026-05-01")];
  const GE = new Date("2026-05-31");
  // color map per status: ARGB hex (no #)
  const ganttColor = {Completed:"FF22C55E","In Progress":"FF3B82F6",Pending:"FFF59E0B","Not Started":"FFE2E8F0"};
  const ganttTextColor = {Completed:"FFFFFFFF","In Progress":"FFFFFFFF",Pending:"FFFFFFFF","Not Started":"FF94A3B8"};

  const ws4 = XLSX.utils.aoa_to_sheet([]);
  const setCell = (r,c,v,opts={}) => {
    const addr = XLSX.utils.encode_cell({r,c});
    ws4[addr] = {v, t: typeof v==="number"?"n":"s", ...opts};
  };

  // Row 0: title
  setCell(0,0,"BATTERY INDUSTRIALIZATION — GANTT CHART");
  ws4["!merges"] = [{s:{r:0,c:0},e:{r:0,c:GM.length+6}}];
  // Row 1: generated
  setCell(1,0,`Generated: ${new Date().toLocaleString("en-IN")}`);
  // Row 3: header
  const hdr = ["#","Project Title","Vendor","Status","Progress %",...GM,"Start Date","End Date"];
  hdr.forEach((h,c) => {
    const addr = XLSX.utils.encode_cell({r:3,c});
    ws4[addr] = {
      v:h, t:"s",
      s:{ font:{bold:true,color:{rgb:"FFFFFFFF"}}, fill:{fgColor:{rgb:"FF1E293B"}}, alignment:{horizontal:"center"} }
    };
  });

  // Data rows
  tasks.forEach((t,idx) => {
    const r = idx + 4;
    const st = getStatus(t);
    const pr = computeProgress(t);
    const allDates = t.subtasks.flatMap(s=>[parseDate(s.actual),parseDate(s.plan),parseDate(s.end)]).filter(Boolean).sort((a,b)=>a-b);
    const startD = allDates[0];
    const endD = allDates[allDates.length-1];
    const rowBg = idx%2===0 ? "FFFFFFFF" : "FFF8FAFC";

    // fixed columns
    [[0,t.id,"n"],[1,t.title,"s"],[2,t.vendor||"","s"],[3,st,"s"],[4,`${pr}%`,"s"]].forEach(([c,v,type]) => {
      const addr = XLSX.utils.encode_cell({r,c});
      ws4[addr] = {v,t:type,s:{fill:{fgColor:{rgb:rowBg}},alignment:{vertical:"center"}}};
    });

    // month columns
    GM.forEach((_,i) => {
      const c = i + 5;
      const addr = XLSX.utils.encode_cell({r,c});
      const mStart = GS[i];
      const mEnd = i < GM.length-1 ? GS[i+1] : GE;
      if (startD && endD && startD < mEnd && endD >= mStart) {
        const bg = ganttColor[st] || "FFE2E8F0";
        const fg = ganttTextColor[st] || "FF000000";
        ws4[addr] = {v:" ", t:"s", s:{fill:{patternType:"solid",fgColor:{rgb:bg}},font:{color:{rgb:fg}},alignment:{horizontal:"center",vertical:"center"}}};
      } else {
        ws4[addr] = {v:"", t:"s", s:{fill:{fgColor:{rgb:rowBg}}}};
      }
    });

    // start / end date columns
    const c1 = GM.length+5, c2 = GM.length+6;
    setCell(r, c1, startD ? fmt(startD) : "—");
    setCell(r, c2, endD ? fmt(endD) : "—");
  });

  ws4["!ref"] = XLSX.utils.encode_range({s:{r:0,c:0},e:{r:tasks.length+4,c:GM.length+6}});
  ws4["!cols"] = [{wch:4},{wch:32},{wch:22},{wch:14},{wch:10},...GM.map(()=>({wch:9})),{wch:14},{wch:14}];
  ws4["!rows"] = [{hpt:18},{hpt:14},{hpt:6},{hpt:20},...tasks.map(()=>({hpt:18}))];
  XLSX.utils.book_append_sheet(wb, ws4, "Gantt");

  XLSX.writeFile(wb, `Battery_Timeline_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({status,size="sm"}){
  const sc=getSC(status);
  const pad = size==="lg" ? "4px 12px" : "3px 9px";
  const fs  = size==="lg" ? 12 : 11;
  return(<span style={{padding:pad,borderRadius:4,fontSize:fs,fontWeight:600,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,whiteSpace:"nowrap",letterSpacing:.2}}>{status}</span>);
}

// ─── NOTIFICATION PANEL ───────────────────────────────────────────────────────
function NotifPanel({notifs,unread,onClear,onClearAll,onRead}){
  const[open,setOpen]=useState(false);const ref=useRef();
  useEffect(()=>{const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",fn);return()=>document.removeEventListener("mousedown",fn);},[]);
  const col=t=>t==="critical"?"#f87171":t==="warning"?"#fbbf24":t==="success"?"#4ade80":"#60a5fa";
  const ico=t=>t==="critical"?"▲":t==="warning"?"!":t==="success"?"✓":"i";
  return(
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>{setOpen(o=>!o);if(!open)onRead();}} style={{position:"relative",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,width:38,height:38,cursor:"pointer",color:C.text2,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.border2} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
        🔔{unread>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#ef4444",color:"#fff",borderRadius:"50%",width:17,height:17,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.hdr}`}}>{unread>9?"9+":unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:44,width:340,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:`0 12px 40px rgba(0,0,0,.5)`,zIndex:300,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.surface2}}>
            <span style={{color:C.text1,fontSize:13,fontWeight:700}}>Alerts</span>
            {notifs.length>0&&<button onClick={onClearAll} style={{background:"none",border:"none",color:C.text3,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Clear all</button>}
          </div>
          <div style={{maxHeight:360,overflowY:"auto"}}>
            {notifs.length===0?<div style={{padding:"28px",textAlign:"center",color:C.text3,fontSize:13}}>No alerts</div>
              :notifs.map(n=>(
                <div key={n.id} style={{padding:"11px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,background:n.read?C.surface:C.surface2}}>
                  <span style={{width:20,height:20,borderRadius:4,background:col(n.type)+"22",color:col(n.type),fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,border:`1px solid ${col(n.type)}44`}}>{ico(n.type)}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.text1,marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:11,color:C.text2,lineHeight:1.5}}>{n.body}</div>
                    <div style={{fontSize:10,color:C.text3,marginTop:4}}>{n.time}</div>
                  </div>
                  <button onClick={()=>onClear(n.id)} style={{background:"none",border:"none",color:C.text3,cursor:"pointer",fontSize:15}}>×</button>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADD MODAL ────────────────────────────────────────────────────────────────
function AddModal({onClose,onAdd,nextId}){
  const[step,setStep]=useState(1);
  const[title,setTitle]=useState("");const[vendor,setVendor]=useState("");const[poc,setPoc]=useState("");const[pocEmail,setPocEmail]=useState("");
  const[stgs,setStgs]=useState(STAGE_NAMES.map(n=>({name:n,enabled:true})));
  const[dates,setDates]=useState(STAGE_NAMES.map(()=>({plan:"",actual:"",end:"",status:"Not Started"})));
  const updD=(i,f,v)=>{const u=[...dates];u[i]={...u[i],[f]:v};setDates(u);};
  const togS=i=>{const u=[...stgs];u[i]={...u[i],enabled:!u[i].enabled};setStgs(u);};
  const doAdd=()=>{const subtasks=stgs.filter(s=>s.enabled).map((s,i)=>{const si=STAGE_NAMES.indexOf(s.name);const d=dates[si]||{};return{sub:`${nextId}.${i+1}`,name:s.name,plan:d.plan||null,actual:d.actual||null,end:d.end||null,status:d.status||"Not Started",remarks:""};});onAdd({id:nextId,title:title.trim(),vendor:vendor.trim(),poc:poc.trim(),pocEmail:pocEmail.trim(),subtasks});onClose();};
  const inp = {width:"100%",padding:"9px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text1,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  const F=(l,v,s,t="text",ph="")=>(<div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.text2,marginBottom:6,letterSpacing:.3}}>{l}</label><input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={ph} style={inp} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/></div>);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,14,26,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:640,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.7)"}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,background:C.surface2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:C.text3,fontSize:12,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:4}}>New project · Step {step} of 2</div>
            <div style={{color:C.text1,fontSize:18,fontWeight:700}}>{step===1?"Project details":title}</div>
          </div>
          <button onClick={onClose} style={{background:C.bg,border:`1px solid ${C.border}`,color:C.text2,width:32,height:32,borderRadius:6,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        <div style={{display:"flex"}}><div style={{flex:1,height:3,background:step>=1?C.accent:C.border}}/><div style={{flex:1,height:3,background:step>=2?C.accent:C.border}}/></div>
        <div style={{overflowY:"auto",flex:1,padding:"22px 24px"}}>
          {step===1&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{gridColumn:"1/-1"}}>{F("Project Title *",title,setTitle,"text","e.g. Laser Welding Machine")}</div>
                {F("Vendor / Supplier",vendor,setVendor,"text","e.g. AMADA")}
                {F("Vendor Email",pocEmail,setPocEmail,"email","vendor@email.com")}
                {F("Person in Charge (POC)",poc,setPoc,"text","Your name")}
              </div>
              <div><label style={{display:"block",fontSize:12,fontWeight:600,color:C.text2,marginBottom:10,letterSpacing:.3}}>Stages to include</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{stgs.map((s,i)=>(<button key={s.name} onClick={()=>togS(i)} style={{padding:"7px 14px",borderRadius:6,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",border:s.enabled?`1px solid ${C.accent}`:`1px solid ${C.border}`,background:s.enabled?"#0c1d40":C.bg,color:s.enabled?"#60a5fa":C.text3,fontWeight:s.enabled?600:400}}>{s.enabled?"✓  ":""}{s.name}</button>))}</div></div>
            </div>
          )}
          {step===2&&(
            <div>
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 14px",marginBottom:16,fontSize:13,color:C.text3}}>Dates are optional — you can always update them by editing the task later.</div>
              <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Stage","Plan Date","Actual Date","End Date","Status"].map(h=>(<th key={h} style={{padding:"9px 10px",textAlign:"left",fontSize:11,fontWeight:600,color:C.text2,letterSpacing:.3}}>{h}</th>))}</tr></thead>
                <tbody>{stgs.filter(s=>s.enabled).map(s=>{const si=STAGE_NAMES.indexOf(s.name);const d=dates[si]||{};return(<tr key={s.name} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={{padding:"8px 10px",color:C.text1,fontWeight:600,whiteSpace:"nowrap"}}>{s.name}</td>
                  {["plan","actual","end"].map(f=>(<td key={f} style={{padding:"5px 7px"}}><input type="date" value={d[f]||""} onChange={e=>updD(si,f,e.target.value||null)} style={{padding:"6px 9px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,color:C.text2,fontSize:12,fontFamily:"inherit",outline:"none"}}/></td>))}
                  <td style={{padding:"5px 7px"}}><select value={d.status||"Not Started"} onChange={e=>updD(si,"status",e.target.value)} style={{padding:"6px 9px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,color:C.text2,fontSize:12,fontFamily:"inherit",outline:"none"}}>{["Not Started","Pending","In Progress","Completed"].map(st=>(<option key={st} style={{background:C.surface}}>{st}</option>))}</select></td>
                </tr>);})}</tbody>
              </table></div>
            </div>
          )}
        </div>
        <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",background:C.surface2}}>
          <button onClick={step===1?onClose:()=>setStep(1)} style={{padding:"9px 20px",border:`1px solid ${C.border}`,borderRadius:6,background:"transparent",color:C.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500}}>
            {step===1?"Cancel":"← Back"}
          </button>
          <button onClick={step===1?()=>{if(title.trim())setStep(2);}:doAdd} disabled={!title.trim()} style={{padding:"9px 24px",border:"none",borderRadius:6,background:title.trim()?C.accent:"#2a3347",color:title.trim()?"#fff":C.text3,cursor:title.trim()?"pointer":"not-allowed",fontFamily:"inherit",fontSize:13,fontWeight:700,transition:"opacity .15s"}}>
            {step===1?"Next →":"Add project"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT MODAL ───────────────────────────────────────────────────────────────
function EditModal({task,onClose,onSave}){
  const[subs,setSubs]=useState(task.subtasks.map(s=>({...s})));
  const[vendor,setVendor]=useState(task.vendor||"");const[poc,setPoc]=useState(task.poc||"");const[pocEmail,setPocEmail]=useState(task.pocEmail||"");
  const upd=(i,f,v)=>{const u=[...subs];u[i]={...u[i],[f]:v};setSubs(u);};
  const inp2={padding:"7px 10px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,color:C.text1,fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,14,26,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:900,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 24px 80px rgba(0,0,0,.7)"}}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,background:C.surface2,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{color:C.text3,fontSize:12,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:3}}>Edit Project</div><div style={{color:C.text1,fontSize:18,fontWeight:700}}>{task.title}</div></div>
          <button onClick={onClose} style={{background:C.bg,border:`1px solid ${C.border}`,color:C.text2,width:32,height:32,borderRadius:6,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        <div style={{padding:"14px 22px",borderBottom:`1px solid ${C.border}`,background:C.surface2,display:"flex",gap:14,flexWrap:"wrap"}}>
          {[["Vendor",vendor,setVendor],["POC",poc,setPoc],["Email",pocEmail,setPocEmail]].map(([l,v,s])=>(<div key={l} style={{flex:1,minWidth:140}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.text2,marginBottom:5}}>{l}</label><input value={v} onChange={e=>s(e.target.value)} style={inp2} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/></div>))}
        </div>
        <div style={{overflowY:"auto",flex:1}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:C.surface2,position:"sticky",top:0,borderBottom:`1px solid ${C.border}`}}>{["#","Stage","Plan","Actual","End","Status","Remarks"].map(h=>(<th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:12,fontWeight:600,color:C.text2,letterSpacing:.3}}>{h}</th>))}</tr></thead>
            <tbody>{subs.map((s,i)=>{const sc=getSC(s.status);const ov=isOD(s);return(
              <tr key={s.sub} style={{borderBottom:`1px solid ${C.border}`,background:ov?"#2d1508":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=ov?"#341a0a":C.surface2} onMouseLeave={e=>e.currentTarget.style.background=ov?"#2d1508":"transparent"}>
                <td style={{padding:"9px 14px",color:C.text3,fontFamily:"monospace",fontSize:12}}>{s.sub}</td>
                <td style={{padding:"9px 14px",color:C.text1,fontWeight:600,fontSize:13}}>{s.name}</td>
                {["plan","actual","end"].map(f=>(<td key={f} style={{padding:"5px 8px"}}><input type="date" value={s[f]||""} onChange={e=>upd(i,f,e.target.value||null)} style={{padding:"6px 9px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,color:C.text2,fontSize:12,fontFamily:"inherit",outline:"none"}}/></td>))}
                <td style={{padding:"5px 8px"}}><select value={s.status||"Not Started"} onChange={e=>upd(i,"status",e.target.value)} style={{padding:"6px 9px",background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:5,color:sc.text,fontSize:12,fontFamily:"inherit",outline:"none",fontWeight:600}}>{["Completed","Pending","Not Started","In Progress"].map(st=>(<option key={st} style={{background:C.surface}}>{st}</option>))}</select></td>
                <td style={{padding:"5px 8px"}}><input value={s.remarks||""} onChange={e=>upd(i,"remarks",e.target.value)} style={{padding:"6px 9px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,color:C.text2,fontSize:12,fontFamily:"inherit",outline:"none",width:170}}/></td>
              </tr>
            );})}</tbody>
          </table>
        </div>
        <div style={{padding:"14px 22px",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"flex-end",gap:10,background:C.surface2}}>
          <button onClick={onClose} style={{padding:"9px 20px",border:`1px solid ${C.border}`,borderRadius:6,background:"transparent",color:C.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Cancel</button>
          <button onClick={()=>onSave({...task,vendor,poc,pocEmail,subtasks:subs})} style={{padding:"9px 24px",border:"none",borderRadius:6,background:C.accent,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── EMAIL MODAL ──────────────────────────────────────────────────────────────
function EmailModal({task,onClose}){
  const ve=task.pocEmail||VENDOR_EMAILS[task.vendor]||"";
  const[to,setTo]=useState(ve);const[cc,setCc]=useState("pm@company.com");const[subj,setSubj]=useState(`Action Required: ${task.title}`);
  const pend=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started");
  const[body,setBody]=useState(`Dear ${task.vendor||"Team"},\n\nReminder for: ${task.title}\n\nPending items:\n${pend.map(s=>`  - ${s.sub} ${s.name}${s.remarks?` (${s.remarks})`:""}`).join("\n")||"  - None"}\n\nKindly provide an update.\n\nRegards,\nBattery Industrialization Team`);
  const inp={width:"100%",padding:"9px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,color:C.text1,fontSize:13,fontFamily:"inherit",outline:"none",boxSizing:"border-box"};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,14,26,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:560,boxShadow:"0 24px 80px rgba(0,0,0,.7)"}}>
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`,background:C.surface2,display:"flex",justifyContent:"space-between",alignItems:"center",borderRadius:"12px 12px 0 0"}}>
          <div><div style={{color:C.text3,fontSize:12,letterSpacing:.5,textTransform:"uppercase",marginBottom:3}}>Compose reminder</div><div style={{color:C.text1,fontSize:17,fontWeight:700}}>{task.title}</div></div>
          <button onClick={onClose} style={{background:C.bg,border:`1px solid ${C.border}`,color:C.text2,width:32,height:32,borderRadius:6,cursor:"pointer",fontSize:16}}>×</button>
        </div>
        <div style={{padding:"20px 22px"}}>
          {[["To",to,setTo,"email"],["CC",cc,setCc,"email"],["Subject",subj,setSubj,"text"]].map(([l,v,s,t])=>(<div key={l} style={{marginBottom:12}}><label style={{display:"block",fontSize:12,fontWeight:600,color:C.text2,marginBottom:5}}>{l}</label><input type={t} value={v} onChange={e=>s(e.target.value)} style={inp} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/></div>))}
          <label style={{display:"block",fontSize:12,fontWeight:600,color:C.text2,marginBottom:5}}>Message</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} rows={8} style={{...inp,resize:"vertical",lineHeight:1.6,fontSize:12,fontFamily:"monospace"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
          <div style={{display:"flex",gap:9,marginTop:14,justifyContent:"flex-end"}}>
            <button onClick={onClose} style={{padding:"9px 20px",border:`1px solid ${C.border}`,borderRadius:6,background:"transparent",color:C.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Cancel</button>
            <button onClick={()=>{window.open(`mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`,"_blank");onClose();}} style={{padding:"9px 22px",border:"none",borderRadius:6,background:C.accent,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>Open in mail app</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[tasks,setTasks]=useState(()=>{try{const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):INIT;}catch{return INIT;}});
  const[notifs,setNotifs]=useState([]);const[unread,setUnread]=useState(0);
  const[tab,setTab]=useState("overview");
  const[emailTask,setEmailTask]=useState(null);const[editTask,setEditTask]=useState(null);const[showAdd,setShowAdd]=useState(false);
  const[filter,setFilter]=useState("All");const[expanded,setExpanded]=useState(null);
  const[notifPerm,setNotifPerm]=useState("default");const[syncTime,setSyncTime]=useState(Date.now());
  const idRef=useRef(0);

  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}catch{}},[tasks]);
  useEffect(()=>{if("Notification"in window){setNotifPerm(Notification.permission);if(Notification.permission==="default")Notification.requestPermission().then(p=>setNotifPerm(p));}},[]);

  const push=useCallback((title,body,type="info",key=null)=>{
    const k=key||`${title}|${body}`;if(!shouldFire(k))return;markFired(k);
    const id=++idRef.current;const time=new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setNotifs(p=>[{id,title,body,type,time,read:false},...p.slice(0,49)]);setUnread(u=>u+1);playTone(type);
    if("Notification"in window&&Notification.permission==="granted"){try{const n=new Notification(`Battery Timeline — ${title}`,{body,tag:k});setTimeout(()=>n.close(),5000);}catch{}}
  },[]);

  useEffect(()=>{tasks.forEach(t=>{t.subtasks.forEach(s=>{if(!isOD(s))return;const d=parseDate(s.end)||parseDate(s.plan);const od=daysDiff(d,TODAY);push(`Overdue: ${t.title}`,`${s.name} — ${od}d overdue`,"critical",`od|${t.id}|${s.sub}|${od}`);});const pc=t.subtasks.filter(s=>s.status==="Pending"&&!isOD(s)).length;if(pc>0)push(`Pending: ${t.title}`,`${pc} stage(s) awaiting`,"warning",`pnd|${t.id}|${pc}`);});},[]);// eslint-disable-line
  useEffect(()=>{const iv=setInterval(()=>{setSyncTime(Date.now());tasks.forEach(t=>{t.subtasks.forEach(s=>{if(!isOD(s))return;const d=parseDate(s.end)||parseDate(s.plan);const od=daysDiff(d,TODAY);push(`Overdue: ${t.title}`,`${s.name} — ${od}d overdue`,"critical",`od|${t.id}|${s.sub}|${od}`);});});},30000);return()=>clearInterval(iv);},[tasks,push]);

  const stats=useMemo(()=>{const t=tasks.length,c=tasks.filter(x=>getStatus(x)==="Completed").length,p=tasks.filter(x=>getStatus(x)==="Pending").length,i=tasks.filter(x=>getStatus(x)==="In Progress").length,n=tasks.filter(x=>getStatus(x)==="Not Started").length,o=tasks.flatMap(x=>x.subtasks).filter(isOD).length,ap=t?Math.round(tasks.reduce((a,x)=>a+computeProgress(x),0)/t):0;return{t,c,p,i,n,o,ap};},[tasks]);
  const filtered=useMemo(()=>filter==="All"?tasks:tasks.filter(t=>getStatus(t)===filter),[tasks,filter]);
  const nextId=useMemo(()=>Math.max(...tasks.map(t=>t.id),0)+1,[tasks]);
  const handleAdd=t=>{setTasks(p=>[...p,t]);push("Project added",`"${t.title}" added.`,"success",`add|${t.id}|${Date.now()}`);};
  const handleSave=u=>{setTasks(p=>p.map(t=>t.id===u.id?u:t));seenSet.clear();try{localStorage.removeItem(ALERT_KEY);}catch{}setEditTask(null);push("Saved",`"${u.title}" updated.`,"info",`sav|${u.id}|${Date.now()}`);};
  const handleDel=id=>{const t=tasks.find(x=>x.id===id);if(window.confirm(`Remove "${t?.title}"?`)){setTasks(p=>p.filter(x=>x.id!==id));}};

  const TABS=[{id:"overview",l:"Overview"},{id:"gantt",l:"Gantt"},{id:"tasks",l:"Tasks"},{id:"reminders",l:"Reminders"}];

  // shared button styles
  const btnPrimary={padding:"9px 18px",border:"none",borderRadius:7,background:C.accent,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,letterSpacing:.2};
  const btnGhost={padding:"8px 16px",border:`1px solid ${C.border}`,borderRadius:7,background:"transparent",color:C.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:500};
  const btnGreen={padding:"9px 18px",border:"none",borderRadius:7,background:"#16a34a",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700,letterSpacing:.2};

  return(
    <div style={{fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",background:C.bg,minHeight:"100vh",color:C.text1}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
        ::-webkit-scrollbar-thumb:hover{background:${C.border2};}
        .row-h:hover{background:${C.surface2}!important;}
        .card-h:hover{border-color:${C.border2}!important;transform:translateY(-1px);}
      `}</style>

      {/* ── HEADER — solid, opaque, distinct ── */}
      <div style={{background:C.hdr,borderBottom:`1px solid ${C.hdrBdr}`,padding:"0 28px",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 20px rgba(0,0,0,.5)"}}>
        <div style={{maxWidth:1440,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:16,height:64,flexWrap:"wrap"}}>

            {/* Brand */}
            <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
              <div style={{width:36,height:36,background:C.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff",letterSpacing:-1}}>B</div>
              <div>
                <div style={{color:C.text1,fontSize:16,fontWeight:800,letterSpacing:-.3,lineHeight:1.1}}>Battery Industrialization</div>
                <div style={{color:C.text3,fontSize:11,letterSpacing:.5,textTransform:"uppercase",marginTop:1}}>HV Line · Timeline Manager</div>
              </div>
            </div>

            {/* Live indicator */}
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"5px 11px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:6}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 5px #22c55e88"}}/>
              <span style={{color:"#4ade80",fontSize:11,fontWeight:700,letterSpacing:.5}}>LIVE</span>
              <span style={{color:C.text3,fontSize:11}}>· {new Date(syncTime).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>
            </div>

            {/* KPI strip */}
            <div style={{display:"flex",flex:1,flexWrap:"wrap",gap:0}}>
              {[
                {l:"Total",v:stats.t,c:C.text2},
                {l:"Completed",v:stats.c,c:"#4ade80"},
                {l:"Active",v:stats.i,c:"#60a5fa"},
                {l:"Pending",v:stats.p,c:"#fbbf24"},
                {l:"Overdue",v:stats.o,c:"#f87171"},
                {l:"Overall",v:`${stats.ap}%`,c:"#a78bfa"},
              ].map(s=>(
                <div key={s.l} style={{padding:"0 16px",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:s.c,lineHeight:1,letterSpacing:-.5}}>{s.v}</div>
                  <div style={{fontSize:10,color:C.text3,letterSpacing:.6,textTransform:"uppercase",marginTop:2,fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{display:"flex",gap:9,alignItems:"center",flexShrink:0}}>
              <button onClick={()=>exportToExcel(tasks)} style={{...btnGreen,display:"flex",alignItems:"center",gap:7,fontSize:13}}>
                <span style={{fontSize:15}}>↓</span> Download Excel
              </button>
              {notifPerm!=="granted"&&<button onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled","Notifications active.","success",`perm|${Date.now()}`)})} style={{...btnGhost,color:"#fbbf24",borderColor:"#78350f",fontSize:12}}>Enable alerts</button>}
              <button onClick={()=>setShowAdd(true)} style={btnPrimary}>+ Add task</button>
              <NotifPanel notifs={notifs} unread={unread} onClear={id=>setNotifs(p=>p.filter(n=>n.id!==id))} onClearAll={()=>{setNotifs([]);setUnread(0);}} onRead={()=>setUnread(0)}/>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2}}>
            {TABS.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 20px",border:"none",borderBottom:`3px solid ${tab===t.id?C.accent:"transparent"}`,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:tab===t.id?700:500,color:tab===t.id?C.text1:C.text3,letterSpacing:.1,transition:"all .15s"}}>{t.l}</button>))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{maxWidth:1440,margin:"0 auto",padding:"24px 28px"}}>

        {/* ─ OVERVIEW ─ */}
        {tab==="overview"&&(
          <div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px",marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:14,fontWeight:700,color:C.text2,letterSpacing:.2}}>Overall project completion</span>
                <span style={{fontSize:26,fontWeight:800,color:"#a78bfa"}}>{stats.ap}%</span>
              </div>
              <div style={{background:C.bg,borderRadius:4,height:8,overflow:"hidden"}}>
                <div style={{width:`${stats.ap}%`,height:"100%",background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",borderRadius:4,transition:"width 1s ease"}}/>
              </div>
              <div style={{display:"flex",gap:24,marginTop:14,flexWrap:"wrap"}}>
                {[{l:"Projects",v:stats.t,c:C.text2},{l:"Completed",v:stats.c,c:"#4ade80"},{l:"In Progress",v:stats.i,c:"#60a5fa"},{l:"Pending",v:stats.p,c:"#fbbf24"},{l:"Not Started",v:stats.n,c:C.text3}].map(s=>(
                  <div key={s.l}><div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:12,color:C.text3,fontWeight:600,marginTop:1}}>{s.l}</div></div>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
              {tasks.map((task,idx)=>{
                const pr=computeProgress(task),st=getStatus(task),sc=getSC(st),col=ACCENTS[idx%ACCENTS.length];
                const od=task.subtasks.filter(isOD),pnd=task.subtasks.filter(s=>s.status==="Pending"&&!isOD(s));
                return(
                  <div key={task.id} className="card-h" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",transition:"all .18s",borderTop:`3px solid ${col}`}}>
                    <div style={{padding:"16px 18px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,color:C.text3,fontWeight:600,letterSpacing:.4,textTransform:"uppercase",marginBottom:4}}>#{String(task.id).padStart(2,"0")} · {task.vendor||"No vendor"}</div>
                          <div style={{fontSize:15,fontWeight:700,color:C.text1,lineHeight:1.35}}>{task.title}</div>
                        </div>
                        <Badge status={st}/>
                      </div>
                      <div style={{marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:12,color:C.text3,fontWeight:600}}>Progress</span>
                          <span style={{fontSize:12,fontWeight:700,color:col}}>{pr}%</span>
                        </div>
                        <div style={{background:C.bg,borderRadius:4,height:5}}><div style={{width:`${pr}%`,height:"100%",background:col,borderRadius:4,transition:"width .5s"}}/></div>
                      </div>
                      {od.length>0&&<div style={{background:"#2d1508",border:"1px solid #7f1d1d",borderRadius:6,padding:"6px 10px",marginBottom:10,fontSize:12,color:"#fca5a5",fontWeight:500}}>▲ Overdue: {od.map(s=>s.name).join(", ")}</div>}
                      {pnd.length>0&&!od.length&&<div style={{background:"#2d1f00",border:"1px solid #78350f",borderRadius:6,padding:"6px 10px",marginBottom:10,fontSize:12,color:"#fde68a",fontWeight:500}}>⏳ Pending: {pnd.map(s=>s.name).join(", ")}</div>}
                      <div style={{display:"flex",gap:7}}>
                        <button onClick={()=>setEditTask(task)} style={{...btnGhost,flex:1,fontSize:12,padding:"7px 0"}}>Edit</button>
                        <button onClick={()=>setEmailTask(task)} style={{...btnGhost,flex:1,fontSize:12,padding:"7px 0"}}>Email</button>
                        <button onClick={()=>push(`Reminder: ${task.title}`,`${pnd.length+od.length} items need attention.`,od.length?"critical":"warning",`man|${task.id}|${Date.now()}`)} style={{...btnGhost,fontSize:12,padding:"7px 11px"}}>🔔</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div onClick={()=>setShowAdd(true)} className="card-h" style={{background:C.surface,border:`2px dashed ${C.border}`,borderRadius:10,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:170,transition:"all .18s"}}>
                <div style={{width:44,height:44,border:`2px dashed ${C.border2}`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:C.text3,marginBottom:10}}>+</div>
                <div style={{fontSize:14,color:C.text2,fontWeight:600}}>Add new project</div>
                <div style={{fontSize:12,color:C.text3,marginTop:4}}>Full stage tracking</div>
              </div>
            </div>
          </div>
        )}

        {/* ─ GANTT ─ */}
        {tab==="gantt"&&(
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,background:C.surface2}}>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:C.text1}}>Gantt chart</div>
                <div style={{fontSize:13,color:C.text3,marginTop:2}}>Sep 2025 – May 2026 · {tasks.length} projects</div>
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
                {[["Completed","#4ade80"],["In Progress","#60a5fa"],["Pending","#fbbf24"],["Not Started","#334155"]].map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:14,height:4,background:c,borderRadius:2}}/><span style={{fontSize:13,color:C.text2,fontWeight:500}}>{l}</span></div>))}
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <div style={{minWidth:800}}>
                {/* Month header */}
                <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:210,flexShrink:0,padding:"10px 16px",fontSize:12,fontWeight:700,color:C.text3,letterSpacing:.5,textTransform:"uppercase",background:C.surface2,borderRight:`1px solid ${C.border}`}}>Project</div>
                  <div style={{flex:1,display:"flex",background:C.surface2}}>
                    {G_MONTHS.map(m=>(<div key={m} style={{flex:1,padding:"10px 4px",fontSize:11,fontWeight:700,color:C.text3,textAlign:"center",borderRight:`1px solid ${C.border}`,letterSpacing:.4}}>{m}</div>))}
                  </div>
                </div>
                {tasks.map((task,idx)=>{
                  const pr=computeProgress(task),st=getStatus(task);
                  const bc=st==="Completed"?"#22c55e":st==="Pending"?"#f59e0b":st==="In Progress"?"#3b82f6":"#334155";
                  const ps=task.subtasks.map(s=>parseDate(s.plan)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const as=task.subtasks.map(s=>parseDate(s.actual)).filter(Boolean).sort((a,b)=>a-b)[0];
                  const ed=[...task.subtasks.flatMap(s=>[parseDate(s.end),parseDate(s.actual),parseDate(s.plan)]).filter(Boolean)].sort((a,b)=>b-a)[0];
                  const ss=as||ps;
                  return(
                    <div key={task.id} className="row-h" style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:idx%2===0?C.surface:C.bg}}>
                      <div style={{width:210,flexShrink:0,padding:"11px 16px",borderRight:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:3,height:22,background:ACCENTS[idx%ACCENTS.length],borderRadius:2,flexShrink:0}}/>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:C.text1,lineHeight:1.3}}>{task.title}</div>
                          <div style={{fontSize:11,color:C.text3,marginTop:2}}>{pr}%</div>
                        </div>
                      </div>
                      <div style={{flex:1,position:"relative",padding:"6px 0"}}>
                        {G_STARTS.map((m,i)=>(<div key={i} style={{position:"absolute",left:`${gP(m)}%`,top:0,bottom:0,width:1,background:C.border}}/>))}
                        <div style={{position:"absolute",left:`${gP(TODAY)}%`,top:0,bottom:0,width:2,background:"#ef444466",zIndex:2}}/>
                        {ss&&ed?(
                          <div style={{position:"absolute",left:`${gP(ss)}%`,width:`${Math.max(gP(ed)-gP(ss),1)}%`,top:"50%",transform:"translateY(-50%)",height:16,borderRadius:4,background:bc,opacity:.85}}>
                            <div style={{width:`${pr}%`,height:"100%",background:"rgba(255,255,255,.2)",borderRadius:4}}/>
                          </div>
                        ):<span style={{position:"absolute",left:"3%",top:"50%",transform:"translateY(-50%)",fontSize:11,color:C.text3,fontStyle:"italic"}}>No dates</span>}
                      </div>
                    </div>
                  );
                })}
                <div style={{display:"flex",background:C.surface2,borderTop:`1px solid ${C.border}`}}>
                  <div style={{width:210,flexShrink:0,padding:"8px 16px",fontSize:12,color:C.text3}}>Today · {fmt(TODAY)}</div>
                  <div style={{flex:1,position:"relative",height:28}}>
                    <div style={{position:"absolute",left:`${gP(TODAY)}%`,transform:"translateX(-50%)",top:5,fontSize:11,fontWeight:700,color:"#f87171",background:"#2d1508",padding:"2px 8px",borderRadius:4,border:"1px solid #7f1d1d",whiteSpace:"nowrap"}}>▲ TODAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ TASKS ─ */}
        {tab==="tasks"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {["All","Completed","In Progress","Pending","Not Started"].map(f=>(
                  <button key={f} onClick={()=>setFilter(f)} style={{...btnGhost,borderColor:filter===f?C.accent:C.border,color:filter===f?"#60a5fa":C.text3,background:filter===f?"#0c1d40":"transparent",fontSize:13,fontWeight:filter===f?700:500}}>{f}</button>
                ))}
              </div>
              <button onClick={()=>setShowAdd(true)} style={btnPrimary}>+ Add task</button>
            </div>
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{background:C.surface2,borderBottom:`1px solid ${C.border}`}}>
                    {["#","Project","Vendor","Progress","Status","Actions"].map(h=>(<th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:C.text2,letterSpacing:.3}}>{h}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task,idx)=>{
                    const pr=computeProgress(task),st=getStatus(task),col=ACCENTS[idx%ACCENTS.length],isE=expanded===task.id,od=task.subtasks.filter(isOD).length;
                    return(
                      <>
                        <tr key={task.id} className="row-h" style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isE?C.surface2:"transparent"}} onClick={()=>setExpanded(isE?null:task.id)}>
                          <td style={{padding:"13px 16px",color:C.text3,fontFamily:"monospace",fontSize:12,borderLeft:`3px solid ${col}`}}>{String(task.id).padStart(2,"0")}</td>
                          <td style={{padding:"13px 16px"}}>
                            <div style={{fontSize:14,fontWeight:700,color:C.text1}}>{task.title}</div>
                            {od>0&&<div style={{fontSize:11,color:"#f87171",marginTop:3,fontWeight:500}}>▲ {od} overdue</div>}
                          </td>
                          <td style={{padding:"13px 16px",color:C.text2,fontSize:13}}>{task.vendor||"—"}</td>
                          <td style={{padding:"13px 16px",minWidth:140}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{flex:1,background:C.bg,borderRadius:3,height:6}}><div style={{width:`${pr}%`,height:"100%",background:col,borderRadius:3}}/></div>
                              <span style={{fontSize:13,color:col,fontWeight:700,minWidth:32}}>{pr}%</span>
                            </div>
                          </td>
                          <td style={{padding:"13px 16px"}}><Badge status={st} size="lg"/></td>
                          <td style={{padding:"13px 16px"}}>
                            <div style={{display:"flex",gap:7}} onClick={e=>e.stopPropagation()}>
                              <button onClick={()=>setEditTask(task)} style={{...btnGhost,fontSize:12,padding:"6px 13px"}}>Edit</button>
                              <button onClick={()=>setEmailTask(task)} style={{...btnGhost,fontSize:12,padding:"6px 13px"}}>Email</button>
                              <button onClick={()=>handleDel(task.id)} style={{padding:"6px 13px",border:"1px solid #7f1d1d",borderRadius:7,background:"transparent",color:"#f87171",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:500}}>Del</button>
                            </div>
                          </td>
                        </tr>
                        {isE&&(
                          <tr key={`${task.id}-exp`}>
                            <td colSpan={6} style={{padding:0,borderBottom:`1px solid ${C.border}`}}>
                              <div style={{background:C.bg,padding:"14px 22px 14px 36px",overflowX:"auto"}}>
                                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:620}}>
                                  <thead>
                                    <tr style={{borderBottom:`1px solid ${C.border}`}}>
                                      {["Sub","Stage","Plan","Actual","End","Status","Remarks"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.text3,letterSpacing:.3}}>{h}</th>))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {task.subtasks.map(s=>{const sc=getSC(s.status);const ov=isOD(s);return(
                                      <tr key={s.sub} className="row-h" style={{borderBottom:`1px solid ${C.border}`,background:ov?"#2d1508":"transparent"}}>
                                        <td style={{padding:"8px 12px",color:C.text3,fontFamily:"monospace",fontSize:11}}>{s.sub}</td>
                                        <td style={{padding:"8px 12px",color:C.text1,fontWeight:600,fontSize:13}}>{s.name}</td>
                                        <td style={{padding:"8px 12px",color:C.text2,fontSize:12}}>{fmt(s.plan)}</td>
                                        <td style={{padding:"8px 12px",color:C.text2,fontSize:12}}>{fmt(s.actual)}</td>
                                        <td style={{padding:"8px 12px",color:C.text2,fontSize:12}}>{fmt(s.end)}</td>
                                        <td style={{padding:"8px 12px"}}><Badge status={s.status||"Not Started"}/></td>
                                        <td style={{padding:"8px 12px",color:ov?"#fca5a5":C.text3,fontSize:12,fontWeight:ov?600:400}}>{ov?"▲ ":""}{s.remarks||"—"}</td>
                                      </tr>
                                    );})}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─ REMINDERS ─ */}
        {tab==="reminders"&&(
          <div>
            {/* Status */}
            <div style={{background:notifPerm==="granted"?"#0d3320":"#2d1f00",border:`1px solid ${notifPerm==="granted"?"#166534":"#78350f"}`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:notifPerm==="granted"?"#4ade80":"#fbbf24",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:notifPerm==="granted"?"#4ade80":"#fbbf24"}}>{notifPerm==="granted"?"Push notifications active — smart mode":"Notifications disabled"}</div>
                <div style={{fontSize:12,color:notifPerm==="granted"?"#166534":"#78350f",marginTop:3}}>{notifPerm==="granted"?"Each alert fires once per overdue-day count — no repeated spam.":"Enable to receive browser & sound alerts for overdue tasks."}</div>
              </div>
              {notifPerm!=="granted"&&<button onClick={()=>Notification.requestPermission().then(p=>{setNotifPerm(p);if(p==="granted")push("Enabled","Notifications active.","success",`perm|${Date.now()}`)})} style={btnPrimary}>Enable</button>}
            </div>

            {/* Excel download banner */}
            <div style={{background:"#0c2040",border:`1px solid ${C.accent}44`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:13,flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#60a5fa",marginBottom:3}}>Download full timeline as Excel</div>
                <div style={{fontSize:12,color:C.text3}}>3 sheets: Summary · Detailed stage-wise · Pending &amp; Overdue</div>
              </div>
              <button onClick={()=>exportToExcel(tasks)} style={{...btnGreen,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:16}}>↓</span> Download .xlsx
              </button>
            </div>

            {/* Test sounds */}
            <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700,color:C.text2,marginBottom:12}}>Test alert sounds</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[{l:"Critical",t:"critical"},{l:"Warning",t:"warning"},{l:"Success",t:"success"},{l:"Info",t:"info"}].map(({l,t})=>(
                  <button key={t} onClick={()=>push(`Test: ${l}`,`${l} sound test.`,t,`test|${t}|${Date.now()}`)} style={{...btnGhost,fontSize:13}}>{l}</button>
                ))}
              </div>
            </div>

            {/* Overdue table */}
            {(()=>{
              const ods=tasks.flatMap(t=>t.subtasks.filter(isOD).map(s=>({...s,taskTitle:t.title,vendor:t.vendor,task:t,dOD:daysDiff(parseDate(s.end)||parseDate(s.plan),TODAY)})));
              if(!ods.length)return null;
              return(
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#f87171",marginBottom:10}}>▲ Overdue items ({ods.length})</div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr style={{background:C.surface2,borderBottom:`1px solid ${C.border}`}}>{["Project","Stage","Vendor","Days overdue","Actions"].map(h=>(<th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:C.text2,letterSpacing:.2}}>{h}</th>))}</tr></thead>
                      <tbody>{ods.map((s,i)=>(
                        <tr key={i} className="row-h" style={{borderBottom:`1px solid ${C.border}`,background:"#2d1508"}}>
                          <td style={{padding:"12px 16px",color:C.text1,fontWeight:700,fontSize:14}}>{s.taskTitle}</td>
                          <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{s.name}</td>
                          <td style={{padding:"12px 16px",color:C.text3,fontSize:13}}>{s.vendor||"—"}</td>
                          <td style={{padding:"12px 16px"}}><span style={{color:"#f87171",fontWeight:800,fontSize:15}}>{s.dOD}d</span></td>
                          <td style={{padding:"12px 16px"}}>
                            <div style={{display:"flex",gap:8}}>
                              <button onClick={()=>push(`URGENT: ${s.taskTitle}`,`${s.name} — ${s.dOD}d overdue!`,"critical",`man|${s.task.id}|${s.sub}|${Date.now()}`)} style={{...btnGhost,fontSize:12,color:"#f87171",borderColor:"#7f1d1d"}}>Alert</button>
                              <button onClick={()=>setEmailTask(s.task)} style={{...btnGhost,fontSize:12}}>Email</button>
                            </div>
                          </td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* All projects */}
            <div>
              <div style={{fontSize:15,fontWeight:800,color:C.text2,marginBottom:10}}>All projects — reminder control</div>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:C.surface2,borderBottom:`1px solid ${C.border}`}}>{["Project","Vendor","Email","Status","Pending","Actions"].map(h=>(<th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:C.text2,letterSpacing:.2}}>{h}</th>))}</tr></thead>
                  <tbody>{tasks.map((task,idx)=>{
                    const st=getStatus(task),pnd=task.subtasks.filter(s=>s.status==="Pending"||s.status==="Not Started").length,col=ACCENTS[idx%ACCENTS.length];
                    return(
                      <tr key={task.id} className="row-h" style={{borderBottom:`1px solid ${C.border}`}}>
                        <td style={{padding:"12px 16px",color:C.text1,fontWeight:700,fontSize:14,borderLeft:`3px solid ${col}`}}>{task.title}</td>
                        <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{task.vendor||"—"}</td>
                        <td style={{padding:"12px 16px",color:C.text3,fontSize:12}}>{task.pocEmail||VENDOR_EMAILS[task.vendor]||"—"}</td>
                        <td style={{padding:"12px 16px"}}><Badge status={st}/></td>
                        <td style={{padding:"12px 16px",color:pnd>0?C.text1:C.text3,fontSize:14,fontWeight:pnd>0?700:400}}>{pnd}</td>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",gap:7}}>
                            <button onClick={()=>push(`Reminder: ${task.title}`,`${pnd} items need attention.`,st==="Pending"?"warning":"info",`man|${task.id}|${Date.now()}`)} style={{...btnGhost,fontSize:12}}>Alert</button>
                            <button onClick={()=>setEmailTask(task)} style={{...btnGhost,fontSize:12}}>Email</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} nextId={nextId}/>}
      {editTask&&<EditModal task={editTask} onClose={()=>setEditTask(null)} onSave={handleSave}/>}
      {emailTask&&<EmailModal task={emailTask} onClose={()=>setEmailTask(null)}/>}
    </div>
  );
}
