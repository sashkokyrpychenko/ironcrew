import { useState, useRef, useEffect } from "react";

import { supabase } from "./supabase";

const css = `

  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *{box-sizing:border-box;margin:0;padding:0;}

  :root{--bg:#0a0a0a;--surface:#141414;--surface2:#1c1c1c;--border:#2a2a2a;--accent:#e8ff47;--accent2:#ff6b35;--text:#f0f0f0;--muted:#666;--card:#161616;}

  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;overscroll-behavior:none;}

  .app{width:100%;min-height:100vh;min-height:100dvh;background:var(--bg);}

  .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px;padding-top:max(env(safe-area-inset-top,0px), 20px);position:sticky;top:0;background:rgba(10,10,10,0.96);backdrop-filter:blur(12px);z-index:50;border-bottom:1px solid var(--border);}

  .logo{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:var(--accent);}

  .logo span{color:var(--text);}

  .icon-btn{background:var(--surface);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;position:relative;}

  .ndot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--accent);border-radius:50%;}

  .ava-sm{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#000;cursor:pointer;}

  .bottomnav{position:fixed;bottom:0;left:0;right:0;width:100%;background:rgba(14,14,14,0.97);backdrop-filter:blur(16px);border-top:1px solid var(--border);display:flex;z-index:50;padding:8px 0;padding-bottom:max(env(safe-area-inset-bottom,0px), 16px);}

  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;cursor:pointer;border:none;background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:9px;font-weight:500;transition:color 0.2s;}

  .ni.on{color:var(--accent);}

  .ni-icon{font-size:18px;position:relative;}

  .nbdot{position:absolute;top:-2px;right:-4px;width:7px;height:7px;background:var(--accent2);border-radius:50%;}

  .scroll{padding:16px 20px 120px;overflow-y:auto;}

  .stitle{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1.5px;color:var(--text);margin-bottom:14px;}

  .stitle span{color:var(--accent);}

  .sub{color:var(--muted);font-size:13px;margin-top:2px;margin-bottom:16px;}

  @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  .fcard{background:var(--card);border:1px solid var(--border);border-radius:16px;margin-bottom:14px;overflow:hidden;animation:fu 0.4s ease both;}

  .fhead{display:flex;align-items:center;gap:10px;padding:14px 14px 10px;}

  .uava{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;}

  .uname{font-size:14px;font-weight:600;}

  .utime{font-size:11px;color:var(--muted);}

  .badge{background:var(--accent);color:#000;font-size:9px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:20px;text-transform:uppercase;}

  .badge.fire{background:var(--accent2);color:#fff;}

  .factions{display:flex;align-items:center;gap:4px;padding:10px 14px;border-top:1px solid var(--border);}

  .abtn{display:flex;align-items:center;gap:5px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:7px 12px;color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;}

  .abtn:hover{border-color:var(--accent);color:var(--accent);}

  .abtn.liked{color:var(--accent2);border-color:var(--accent2);}

  .abtn.following{color:var(--accent);border-color:var(--accent);}

  .abtn.danger{color:var(--accent2);border-color:rgba(255,107,53,0.3);}

  .sp{flex:1;}

  .week-nav{display:flex;align-items:center;gap:8px;margin-bottom:12px;}

  .week-arrow{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.18s;}

  .week-arrow:hover{border-color:var(--accent);color:var(--accent);}

  .week-arrow:disabled{opacity:0.3;cursor:not-allowed;}

  .week-label{flex:1;text-align:center;font-size:12px;color:var(--muted);font-weight:500;}

  .dtabs{display:flex;gap:4px;margin-bottom:20px;width:100%;}

  .dtab{flex:1;padding:8px 4px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:11px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;align-items:center;min-width:0;}

  .dtab.on{background:var(--accent);border-color:var(--accent);color:#000;font-weight:700;}

  .dtab.today{border-color:rgba(232,255,71,0.4);}

  .wcard{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:16px;}

  .wch{display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);}

  .wct{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;}

  .mtag{font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(232,255,71,0.1);color:var(--accent);text-transform:uppercase;}

  .exi{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);}

  .exi:last-child{border-bottom:none;}

  .enum{width:28px;height:28px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--accent);flex-shrink:0;}

  .exn{font-size:14px;font-weight:500;}

  .exd{font-size:11px;color:var(--muted);margin-top:2px;}

  .cbtn{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.18s;}

  .cbtn.done{background:var(--accent);border-color:var(--accent);color:#000;}

  .sbtn{width:100%;background:var(--accent);color:#000;border:none;border-radius:14px;padding:16px;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;cursor:pointer;margin-top:8px;}

  .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}

  .pcard{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;}

  .pval{font-family:'Bebas Neue',sans-serif;font-size:36px;line-height:1;color:var(--accent);}

  .plbl{font-size:11px;color:var(--muted);margin-top:4px;}

  .pchg{font-size:11px;color:#4ade80;margin-top:6px;font-weight:500;}

  .bcc{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:16px;}

  .bchart{display:flex;align-items:flex-end;gap:6px;height:100px;}

  .bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;}

  .bar{width:100%;border-radius:6px 6px 0 0;background:var(--surface2);}

  .bar.hi{background:var(--accent);}

  .bday{font-size:9px;color:var(--muted);}

  .prlist{display:flex;flex-direction:column;gap:10px;}

  .prcard{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;}

  .pricon{font-size:24px;width:44px;height:44px;background:var(--surface2);border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

  .prinfo{flex:1;}

  .prn{font-size:13px;font-weight:600;}

  .prd{font-size:11px;color:var(--muted);margin-top:2px;}

  .prv{font-family:'Bebas Neue',sans-serif;font-size:26px;color:var(--accent);line-height:1;}

  .pru{font-size:11px;color:var(--muted);text-align:right;}

  .pava{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#000;border:3px solid var(--bg);margin-bottom:12px;}

  .pname{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:1px;}

  .pbio{font-size:12px;color:var(--muted);margin-top:2px;}

  .pstats{display:grid;grid-template-columns:repeat(3,1fr);background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin:16px 0;}

  .pst{padding:14px;text-align:center;border-right:1px solid var(--border);}

  .pst:last-child{border-right:none;}

  .pstv{font-family:'Bebas Neue',sans-serif;font-size:26px;color:var(--accent);line-height:1;}

  .pstl{font-size:10px;color:var(--muted);margin-top:2px;}

  .epbtn{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:12px;}

  .sbar{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 14px;margin-bottom:16px;}

  .sbar input{flex:1;background:none;border:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}

  .sbar input::placeholder{color:var(--muted);}

  .citem{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;cursor:pointer;transition:background 0.18s;}

  .citem:hover{background:var(--surface);}

  .cava{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0;position:relative;}
  .online-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;background:#4ade80;border-radius:50%;border:2px solid var(--bg);}
  .offline-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;background:var(--border);border-radius:50%;border:2px solid var(--bg);}

  .cinf{flex:1;min-width:0;}

  .cname{font-size:14px;font-weight:600;}

  .cprev{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}

  .cmeta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}

  .ctime{font-size:10px;color:var(--muted);}

  .cwin{display:flex;flex-direction:column;height:100vh;}

  .cwh{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border);background:rgba(10,10,10,0.97);}

  .backbtn{background:var(--surface);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;flex-shrink:0;}

  .cwava{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;position:relative;flex-shrink:0;}

  .cwname{font-size:15px;font-weight:600;}

  .cwst{font-size:11px;color:#4ade80;}

  .msgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px;}

  .mrow{display:flex;align-items:flex-end;gap:8px;}

  .mrow.me{flex-direction:row-reverse;}

  .mbub{max-width:72%;padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.4;}

  .mbub.th{background:var(--surface2);border-bottom-left-radius:4px;}

  .mbub.my{background:var(--accent);color:#000;border-bottom-right-radius:4px;font-weight:500;}

  .mt{font-size:10px;color:var(--muted);margin-top:3px;}

  .mava{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;}

  .cinrow{display:flex;align-items:center;gap:10px;padding:12px 20px 32px;border-top:1px solid var(--border);background:rgba(10,10,10,0.97);}

  .cinput{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:10px 16px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}

  .cinput:focus{border-color:var(--accent);}

  .sendbtn{width:42px;height:42px;border-radius:50%;background:var(--accent);border:none;color:#000;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

  .ftabs{display:flex;gap:6px;margin-bottom:18px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;}

  .ftabs::-webkit-scrollbar{display:none;}

  .ftab{flex-shrink:0;padding:9px 16px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;text-align:center;transition:all 0.18s;font-family:'DM Sans',sans-serif;}

  .ftab.on{background:var(--accent);border-color:var(--accent);color:#000;}

  .rcard{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:12px;animation:fu 0.35s ease both;}

  .rtop{display:flex;align-items:center;gap:12px;margin-bottom:12px;}

  .rava{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0;}

  .rn{font-size:15px;font-weight:600;}

  .rs{font-size:11px;color:var(--muted);margin-top:2px;}

  .mpill{display:inline-flex;align-items:center;gap:4px;border-radius:20px;padding:3px 8px;font-size:10px;font-weight:700;margin-top:4px;}

  .mpill.near{background:rgba(74,222,128,0.1);color:#4ade80;}

  .mpill.sim{background:rgba(255,107,53,0.1);color:var(--accent2);}

  .gym-badge{display:inline-flex;align-items:center;gap:4px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:4px 10px;font-size:11px;color:var(--muted);margin-bottom:12px;}

  .rstats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}

  .rst{background:var(--surface2);border-radius:10px;padding:10px;text-align:center;}

  .rstv{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--accent);line-height:1;}

  .rstl{font-size:9px;color:var(--muted);margin-top:2px;}

  .ract{display:flex;gap:8px;}

  .rbtn{flex:1;padding:10px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}

  .rbtn.pri{background:var(--accent);border-color:var(--accent);color:#000;}

  .filter-bar{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:16px;}

  .filter-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;}

  .filter-row:last-child{margin-bottom:0;}

  .fpill{padding:6px 12px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:11px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;white-space:nowrap;}

  .fpill.on{background:var(--accent);border-color:var(--accent);color:#000;font-weight:700;}

  .tcard{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:12px;animation:fu 0.35s ease both;}

  .thead-row{display:flex;gap:14px;margin-bottom:14px;}

  .tava{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;flex-shrink:0;position:relative;}

  .tonline{position:absolute;top:4px;right:4px;width:10px;height:10px;background:#4ade80;border-radius:50%;border:2px solid var(--card);}

  .tinfo{flex:1;}

  .tname{font-size:15px;font-weight:600;}

  .tspec{font-size:11px;color:var(--accent);margin-top:2px;font-weight:600;}

  .tloc{font-size:11px;color:var(--muted);margin-top:3px;}

  .trating{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;margin-top:4px;}

  .tstars{color:#fbbf24;}

  .ttags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}

  .ttag{padding:4px 10px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);font-size:10px;color:var(--muted);}

  .ttag.green{background:rgba(74,222,128,0.1);border-color:rgba(74,222,128,0.2);color:#4ade80;}

  .ttag.orange{background:rgba(255,107,53,0.1);border-color:rgba(255,107,53,0.2);color:var(--accent2);}

  .tprice-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}

  .tprice{font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--accent);}

  .tacts{display:flex;gap:8px;}

  .tbtn{flex:1;padding:10px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}

  .tbtn.pri{background:var(--accent);border-color:var(--accent);color:#000;}

  .shop-cats{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-bottom:16px;padding-bottom:2px;}

  .shop-cats::-webkit-scrollbar{display:none;}

  .scat{flex-shrink:0;padding:8px 14px;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;}

  .scat.on{background:var(--accent);border-color:var(--accent);color:#000;font-weight:700;}

  .sgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}

  .sprod{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;cursor:pointer;animation:fu 0.3s ease both;}

  .simg{height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;background:var(--surface2);}

  .sinfo{padding:12px;}

  .sbrand{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}

  .sprodn{font-size:13px;font-weight:600;margin-top:2px;line-height:1.3;}

  .sprice{font-family:'Bebas Neue',sans-serif;font-size:22px;color:var(--accent);margin-top:6px;}

  .sold-price{font-size:11px;color:var(--muted);text-decoration:line-through;margin-left:4px;}

  .sdiscount{font-size:9px;font-weight:700;background:var(--accent2);color:#fff;padding:2px 5px;border-radius:4px;margin-left:4px;}

  .saddbtn{width:100%;margin-top:8px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:7px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;}

  .saddbtn.added{background:var(--accent);border-color:var(--accent);color:#000;}

  .cart-badge{position:absolute;top:-4px;right:-4px;background:var(--accent2);color:#fff;font-size:9px;font-weight:700;border-radius:10px;padding:1px 5px;min-width:16px;text-align:center;}

  .add-workout-btn{width:100%;background:var(--surface);border:2px dashed var(--border);border-radius:14px;padding:16px;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px;transition:all 0.18s;display:flex;align-items:center;justify-content:center;gap:8px;}

  .add-workout-btn:hover{border-color:var(--accent);color:var(--accent);}

  .wlog-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:10px;animation:fu 0.3s ease both;}

  .wlog-title{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:1px;margin-bottom:6px;}

  .wlog-meta{display:flex;gap:10px;flex-wrap:wrap;}

  .wlog-chip{font-size:11px;color:var(--muted);background:var(--surface2);border-radius:6px;padding:3px 8px;}

  .wlog-chip span{color:var(--accent);font-weight:700;}

  .wlog-date{font-size:10px;color:var(--muted);margin-top:8px;}

  .wlog-exlist{margin-top:10px;border-top:1px solid var(--border);padding-top:10px;display:flex;flex-direction:column;gap:4px;}

  .wlog-exrow{font-size:12px;color:var(--muted);display:flex;justify-content:space-between;}

  .wlog-exrow span{color:var(--text);}

  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:200;display:flex;align-items:flex-end;justify-content:center;}

  .modal-sheet{background:var(--surface);border-radius:24px 24px 0 0;width:100%;max-width:420px;padding:24px 20px 40px;max-height:90vh;overflow-y:auto;}

  .modal-handle{width:40px;height:4px;background:var(--border);border-radius:2px;margin:0 auto 20px;}

  .modal-title{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1.5px;margin-bottom:20px;}

  .modal-title span{color:var(--accent);}

  .field-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;}

  .field-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;margin-bottom:14px;}

  .field-input:focus{border-color:var(--accent);}

  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}

  .ex-add-row{display:flex;gap:8px;margin-bottom:10px;}

  .ex-add-row .field-input{margin-bottom:0;flex:1;}

  .ex-add-row button{background:var(--accent);border:none;border-radius:10px;width:44px;height:44px;font-size:20px;cursor:pointer;flex-shrink:0;}

  .ex-added-list{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}

  .ex-added-item{background:var(--surface2);border-radius:8px;padding:8px 12px;font-size:12px;display:flex;justify-content:space-between;align-items:center;color:var(--text);}

  .ex-remove{background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;}

  .save-workout-btn{width:100%;background:var(--accent);color:#000;border:none;border-radius:14px;padding:16px;font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:2px;cursor:pointer;}

  .save-workout-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;}

  .empty-workouts{text-align:center;padding:30px 0 10px;}

  .empty-workouts .big-icon{font-size:48px;margin-bottom:10px;}

  .empty-workouts p{font-size:13px;color:var(--muted);}

  .post-composer{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:14px;margin-bottom:16px;}

  .post-composer textarea{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;resize:none;min-height:80px;}

  .post-composer textarea:focus{border-color:var(--accent);}

  .post-composer-actions{display:flex;justify-content:flex-end;margin-top:10px;}

  .post-btn{background:var(--accent);color:#000;border:none;border-radius:10px;padding:9px 20px;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;cursor:pointer;}

  .post-btn:disabled{background:var(--border);color:var(--muted);cursor:not-allowed;}

  .feed-empty{text-align:center;padding:40px 0;color:var(--muted);font-size:14px;}

  .post-content{padding:10px 14px;font-size:14px;line-height:1.55;white-space:pre-wrap;color:var(--text);}

  /* today-workout banner */

  .today-banner{background:linear-gradient(135deg,rgba(232,255,71,0.12),rgba(255,107,53,0.08));border:1px solid rgba(232,255,71,0.2);border-radius:14px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all 0.18s;}

  .today-banner:hover{border-color:var(--accent);}

  .today-banner-icon{font-size:28px;flex-shrink:0;}

  .today-banner-text{flex:1;}

  .today-banner-label{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;}

  .today-banner-title{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--accent);letter-spacing:1px;margin-top:2px;}

  .today-banner-arrow{font-size:18px;color:var(--muted);}

  /* edit mode */

  .edit-mode-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:rgba(232,255,71,0.06);border-bottom:1px solid rgba(232,255,71,0.15);}

  .edit-mode-label{font-size:11px;color:var(--accent);font-weight:700;letter-spacing:1px;text-transform:uppercase;}

  .edit-toggle-btn{padding:6px 14px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.18s;}

  .edit-toggle-btn.active{background:var(--accent);border-color:var(--accent);color:#000;}

  .ex-edit-row{display:flex;flex-direction:column;gap:6px;padding:10px 16px;border-bottom:1px solid var(--border);}

  .ex-edit-row:last-child{border-bottom:none;}

  .ex-name-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;outline:none;}

  .ex-name-input:focus{border-color:var(--accent);}

  .ex-sets-input{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:7px 8px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:12px;outline:none;text-align:left;width:100%;}

  .ex-sets-input:focus{border-color:var(--accent);}

  .ex-delete-btn{width:28px;height:28px;border-radius:8px;background:rgba(255,107,53,0.1);border:1px solid rgba(255,107,53,0.2);color:var(--accent2);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

  .add-ex-inline{display:flex;gap:8px;padding:10px 16px;border-top:1px solid var(--border);}

  .add-ex-inline input{flex:1;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;}

  .add-ex-inline input:focus{border-color:var(--accent);}

  .add-ex-inline input::placeholder{color:var(--muted);}

  .add-ex-inline button{background:var(--accent);border:none;border-radius:8px;width:36px;height:36px;font-size:18px;cursor:pointer;color:#000;flex-shrink:0;}

`;

const wdays = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

const bars = [40,70,55,90,65,30,0];

const DEFAULT_WPLAN = {

  "Пн":{t:"ГРУДИ / ТРИЦЕПС",m:"Push",ex:[{n:"Жим штанги лежачи",s:"4×8-10",d:""},{n:"Жим гантелей під кутом",s:"3×10-12",d:""},{n:"Кросовер",s:"3×15",d:""},{n:"Французький жим",s:"3×12",d:""}]},

  "Вт":{t:"СПИНА / БІЦЕПС",m:"Pull",ex:[{n:"Підтягування",s:"4×max",d:""},{n:"Тяга штанги в нахилі",s:"4×8",d:""},{n:"Тяга верхнього блоку",s:"3×12",d:""},{n:"Підйом на біцепс",s:"4×10",d:""}]},

  "Ср":{t:"ВІДПОЧИНОК",m:"Rest",ex:[]},

  "Чт":{t:"НОГИ",m:"Legs",ex:[{n:"Присідання зі штангою",s:"5×5",d:""},{n:"Жим ногами",s:"4×10",d:""},{n:"Румунська тяга",s:"3×10",d:""},{n:"Розгинання ніг",s:"3×15",d:""}]},

  "Пт":{t:"ПЛЕЧІ / ПРЕС",m:"Shoulders",ex:[{n:"Жим гантелей сидячи",s:"4×10",d:""},{n:"Розведення в сторони",s:"3×15",d:""},{n:"Планка",s:"3×60сек",d:""},{n:"Скручування",s:"3×20",d:""}]},

  "Сб":{t:"КАРДІО",m:"Cardio",ex:[]},

  "Нд":{t:"ВІДПОЧИНОК",m:"Rest",ex:[]},

};

const peopleRecs = {

  near:[{id:10,name:"Вася Ковальчук",ini:"ВК",col:"#0ea5e9",gym:"FitLife Gym · 0.3км",sub:"Пауерліфтинг · 2 роки",match:"near",mlbl:"📍 Ваш зал",w:58,sq:"120кг",bn:"85кг"},{id:11,name:"Таня Мороз",ini:"ТМ",col:"#d946ef",gym:"FitLife Gym · 0.3км",sub:"Фітнес · 1.5 роки",match:"near",mlbl:"📍 Ваш зал",w:72,sq:"60кг",bn:"40кг"}],

  similar:[{id:13,name:"Данило Береза",ini:"ДБ",col:"#10b981",gym:"CrossFit Arena · 2км",sub:"Пауерліфтинг · 3 роки",match:"sim",mlbl:"94% схожість",w:84,sq:"125кг",bn:"92кг"},{id:14,name:"Льоша Савченко",ini:"ЛС",col:"#ef4444",gym:"Iron Zone · 3км",sub:"Силовий · 2.5 роки",match:"sim",mlbl:"89% схожість",w:76,sq:"135кг",bn:"95кг"}]

};

const allTrainers = [

  {id:1,name:"Андрій Кравченко",ini:"АК",col:"#ff6b35",spec:"Пауерліфтинг",loc:"Київ · Офлайн",gender:"Чоловік",format:"Офлайн",price:800,rating:4.9,reviews:127,exp:"7 років",tags:["Силовий тренінг","Техніка","Змагання"],online:true},

  {id:2,name:"Олена Шевченко",ini:"ОШ",col:"#d946ef",spec:"Фітнес / Схуднення",loc:"Київ · Онлайн",gender:"Жінка",format:"Онлайн",price:600,rating:4.8,reviews:89,exp:"5 років",tags:["Схуднення","Харчування","Онлайн"],online:true},

  {id:3,name:"Катя Ліщенко",ini:"КЛ",col:"#10b981",spec:"CrossFit",loc:"Львів · Офлайн",gender:"Жінка",format:"Офлайн",price:550,rating:4.9,reviews:203,exp:"4 роки",tags:["CrossFit","Витривалість","Групові"],online:true},

];

const shopCats = ["Всі","Протеїн","Амінокислоти","Вітаміни","Одяг","Обладнання"];

const allProducts = [

  {id:1,cat:"Протеїн",emoji:"🥛",brand:"MyProtein",name:"Impact Whey 2.5кг",price:1490,oldPrice:1890,discount:21},

  {id:2,cat:"Протеїн",emoji:"🍫",brand:"Optimum",name:"Gold Standard 2кг",price:1890,oldPrice:null,discount:null},

  {id:3,cat:"Амінокислоти",emoji:"⚡",brand:"BPI Sports",name:"Best BCAA 300г",price:690,oldPrice:890,discount:22},

  {id:4,cat:"Вітаміни",emoji:"💊",brand:"Now Foods",name:"Omega-3 180 капсул",price:520,oldPrice:null,discount:null},

  {id:5,cat:"Одяг",emoji:"👕",brand:"Nike",name:"Dri-FIT футболка",price:980,oldPrice:1400,discount:30},

  {id:6,cat:"Обладнання",emoji:"🏋️",brand:"Harbinger",name:"Атлетичний пояс",price:1200,oldPrice:null,discount:null},

];

const COLORS = ["#ff6b35","#7c3aed","#0ea5e9","#d946ef","#10b981","#ef4444","#f59e0b","#3b82f6"];

function getColor(str) {

  if (!str) return COLORS[0];

  let h = 0;

  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);

  return COLORS[Math.abs(h) % COLORS.length];

}

function getIni(name) {

  if (!name) return "IC";

  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

}

function timeAgo(iso) {

  if (!iso) return "";

  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);

  if (diff < 60) return "щойно";

  if (diff < 3600) return `${Math.floor(diff / 60)} хв тому`;

  if (diff < 86400) return `${Math.floor(diff / 3600)} год тому`;

  return `${Math.floor(diff / 86400)} дн тому`;

}

function formatDate(iso) {

  if (!iso) return "";

  return new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });

}

export default function IronCrew({ user }) {

  const todayKey = ["Нд","Пн","Вт","Ср","Чт","Пт","Сб"][new Date().getDay()];

  const [tab, setTab] = useState("feed");

  const [aday, setAday] = useState(todayKey);

  const [period, setPeriod] = useState("Тиждень");

  const [checked, setChecked] = useState({});

  const [openChat, setOpenChat] = useState(null);

  const [chatMsgsReal, setChatMsgsReal] = useState([]);

  const [inp, setInp] = useState("");

  const [chatLoading, setChatLoading] = useState(false);

  const [findTab, setFindTab] = useState("people");

  const [recSub, setRecSub] = useState("near");

  const [fGender, setFGender] = useState("Всі");

  const [fFormat, setFFormat] = useState("Всі");

  const [shopCat, setShopCat] = useState("Всі");

  const [cart, setCart] = useState({});

  const [profile, setProfile] = useState(null);

  const [workouts, setWorkouts] = useState([]);

  const [editProfile, setEditProfile] = useState(false);

  const [editName, setEditName] = useState("");

  const [editGym, setEditGym] = useState("");

  const [editCity, setEditCity] = useState("");

  const [showAddWorkout, setShowAddWorkout] = useState(false);

  const [newTitle, setNewTitle] = useState("");

  const [newDuration, setNewDuration] = useState("");

  const [newVolume, setNewVolume] = useState("");

  const [newExInput, setNewExInput] = useState("");

  const [newExList, setNewExList] = useState([]);

  const [savingWorkout, setSavingWorkout] = useState(false);

  const [feedPosts, setFeedPosts] = useState([]);

  const [postLikes, setPostLikes] = useState({});

  const [myLikes, setMyLikes] = useState({});

  const [followed, setFollowed] = useState({});

  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

  const [newPostText, setNewPostText] = useState("");

  const [postingText, setPostingText] = useState(false);

  const [feedLoading, setFeedLoading] = useState(true);

  const [realUsers, setRealUsers] = useState([]);

  const [timerActive, setTimerActive] = useState(false);

  const [timerStart, setTimerStart] = useState(null); // timestamp старту

  const [timerSeconds, setTimerSeconds] = useState(0); // для відображення

  const [selectedEx, setSelectedEx] = useState(null);

  const [exSets, setExSets] = useState("");

  const [exReps, setExReps] = useState("");

  const [exWeight, setExWeight] = useState("");

  const [savedSets, setSavedSets] = useState({});

  const [wplan, setWplan] = useState(DEFAULT_WPLAN);

  const [editMode, setEditMode] = useState(false);

  const [newExName, setNewExName] = useState("");

  const [weekOffset, setWeekOffset] = useState(0); // 0=поточний тиждень, 1=наступний...

  const [showNextWorkout, setShowNextWorkout] = useState(false);

  // Спринт 9 — Онлайн статус
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Спринт 8 — Знайти
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Спринт 7 — профіль
  const [showFollowModal, setShowFollowModal] = useState(null); // 'followers' | 'following' | null
  const [followList, setFollowList] = useState([]);
  const [followListLoading, setFollowListLoading] = useState(false);
  const [swipeState, setSwipeState] = useState({}); // {workoutId: offsetX}

  // Спринт 6 — реальна статистика
  const [setsData, setSetsData] = useState([]); // всі workout_sets юзера
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null); // для графіка

  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgsReal, openChat]);

  // Спринт 9 — Realtime Presence для онлайн статусу
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel("online_users", {
      config: { presence: { key: user.id } }
    });
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineUsers(new Set(Object.keys(state)));
      })
      .on("presence", { event: "join" }, ({ key }) => {
        setOnlineUsers(prev => new Set([...prev, key]));
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        setOnlineUsers(prev => { const n = new Set(prev); n.delete(key); return n; });
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {

    if (!timerActive || !timerStart) return;

    // Одразу показуємо актуальний час (якщо повернулись з фону)
    setTimerSeconds(Math.floor((Date.now() - timerStart) / 1000));

    const interval = setInterval(() => {
      setTimerSeconds(Math.floor((Date.now() - timerStart) / 1000));
    }, 1000);

    return () => clearInterval(interval);

  }, [timerActive, timerStart]);

  useEffect(() => {

    if (!user) return;

    supabase.from("profiles").select("*").eq("user_id", user.id).single()

      .then(({ data }) => { if (data) setProfile(data); });

  }, [user]);

  useEffect(() => {

    if (!user) return;

    supabase.from("workouts").select("*").eq("user_id", user.id)

      .order("created_at", { ascending: false })

      .then(({ data }) => { if (data) setWorkouts(data); });

  }, [user]);

  const loadFeed = async () => {

    setFeedLoading(true);

    const { data: posts, error } = await supabase.from("posts")
      .select("*, profiles(name, gym, city)")
      .order("created_at", { ascending: false }).limit(50);

    if (error || !posts) { setFeedLoading(false); return; }

    const postIds = posts.map(p => p.id);

    const { data: likesData } = postIds.length

      ? await supabase.from("likes").select("post_id, user_id").in("post_id", postIds)

      : { data: [] };

    const likeCounts = {};

    const myLikesMap = {};

    (likesData || []).forEach(l => {

      likeCounts[l.post_id] = (likeCounts[l.post_id] || 0) + 1;

      if (l.user_id === user.id) myLikesMap[l.post_id] = true;

    });

    setFeedPosts(posts);

    setPostLikes(likeCounts);

    setMyLikes(myLikesMap);

    setFeedLoading(false);

  };

  useEffect(() => { if (user) loadFeed(); }, [user]);

  useEffect(() => {

    if (!user) return;

    supabase.from("profiles").select("user_id, name, gym, city").neq("user_id", user.id)

      .then(async ({ data }) => {

        if (!data) return;

        const withMsg = await Promise.all(data.map(async (p) => {

          const { data: msgs } = await supabase.from("messages").select("content, created_at")

            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${p.user_id}),and(sender_id.eq.${p.user_id},receiver_id.eq.${user.id})`)

            .order("created_at", { ascending: false }).limit(1);

          return { ...p, lastMsg: msgs?.[0]?.content || null };

        }));

        setRealUsers(withMsg);

      });

  }, [user]);

  useEffect(() => {

    if (!openChat || !user) return;

    setChatLoading(true);

    const otherId = openChat.userId;

    supabase.from("messages").select("*")

      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)

      .order("created_at", { ascending: true })

      .then(({ data }) => { setChatMsgsReal(data || []); setChatLoading(false); });

    const channel = supabase.channel(`chat_${user.id}_${otherId}`)

      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `receiver_id=eq.${user.id}` },

        (payload) => { if (payload.new.sender_id === otherId) setChatMsgsReal(prev => [...prev, payload.new]); })

      .subscribe();

    return () => { supabase.removeChannel(channel); };

  }, [openChat, user]);

  useEffect(() => {

    if (!user) return;

    supabase.from("follows").select("following_id").eq("follower_id", user.id)

      .then(({ data }) => {

        if (data) { const map = {}; data.forEach(f => { map[f.following_id] = true; }); setFollowed(map); }

      });

    Promise.all([

      supabase.from("follows").select("id", { count: "exact" }).eq("following_id", user.id),

      supabase.from("follows").select("id", { count: "exact" }).eq("follower_id", user.id),

    ]).then(([r1, r2]) => setFollowCounts({ followers: r1.count || 0, following: r2.count || 0 }));

  }, [user]);

  // Завантаження workout_sets для прогресу
  // Завантажити реальних юзерів для Знайти
  const loadDiscoverUsers = async () => {
    if (!user) return;
    setDiscoverLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, name, gym, city")
      .neq("user_id", user.id)
      .limit(50);
    if (data) setDiscoverUsers(data);
    setDiscoverLoading(false);
  };

  useEffect(() => {
    if (tab === "find") loadDiscoverUsers();
  }, [tab]);

  // Відкрити модалку підписників або підписок
  const openFollowModal = async (type) => {
    setShowFollowModal(type);
    setFollowListLoading(true);
    setFollowList([]);
    let ids = [];
    if (type === 'followers') {
      const { data } = await supabase.from("follows").select("follower_id").eq("following_id", user.id);
      ids = (data || []).map(f => f.follower_id);
    } else {
      const { data } = await supabase.from("follows").select("following_id").eq("follower_id", user.id);
      ids = (data || []).map(f => f.following_id);
    }
    if (ids.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, gym, city").in("user_id", ids);
      setFollowList(profiles || []);
    }
    setFollowListLoading(false);
  };

  // Видалити тренування
  const deleteWorkout = async (workoutId) => {
    await supabase.from("workouts").delete().eq("id", workoutId).eq("user_id", user.id);
    setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    setSwipeState({});
  };

  const loadSetsData = async () => {
    if (!user) return;
    setStatsLoading(true);
    const { data } = await supabase
      .from("workout_sets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (data) setSetsData(data);
    setStatsLoading(false);
  };

  useEffect(() => {
    if (tab === "progress") loadSetsData();
  }, [tab]);

  const submitPost = async () => {

    if (!newPostText.trim() || postingText) return;

    setPostingText(true);

    const { data, error } = await supabase.from("posts").insert([{ user_id: user.id, content: newPostText.trim() }]).select("*");

    if (!error && data) { setFeedPosts(prev => [data[0], ...prev]); setNewPostText(""); }

    setPostingText(false);

  };

  // ── ВИДАЛЕННЯ ПОСТА (Спринт 5) ──

  const deletePost = async (postId) => {

    await supabase.from("likes").delete().eq("post_id", postId);

    await supabase.from("posts").delete().eq("id", postId).eq("user_id", user.id);

    setFeedPosts(prev => prev.filter(p => p.id !== postId));

  };

  const toggleLike = async (postId) => {

    const isLiked = myLikes[postId];

    setMyLikes(prev => ({ ...prev, [postId]: !isLiked }));

    setPostLikes(prev => ({ ...prev, [postId]: (prev[postId] || 0) + (isLiked ? -1 : 1) }));

    if (isLiked) {

      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);

    } else {

      await supabase.from("likes").insert([{ user_id: user.id, post_id: postId }]);

    }

  };

  const toggleFollow = async (targetUserId) => {

    const isFollowing = followed[targetUserId];

    setFollowed(prev => ({ ...prev, [targetUserId]: !isFollowing }));

    setFollowCounts(prev => ({ ...prev, following: prev.following + (isFollowing ? -1 : 1) }));

    if (isFollowing) {

      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", targetUserId);

    } else {

      await supabase.from("follows").insert([{ follower_id: user.id, following_id: targetUserId }]);

    }

  };

  const addExercise = () => {

    const trimmed = newExInput.trim();

    if (!trimmed) return;

    setNewExList(prev => [...prev, trimmed]);

    setNewExInput("");

  };

  const saveWorkout = async () => {

    if (!newTitle.trim()) return;

    setSavingWorkout(true);

    const workout = {

      user_id: user.id, title: newTitle.trim(),

      duration: newDuration ? parseInt(newDuration) : null,

      volume: newVolume ? parseFloat(newVolume) : null,

      exercises: newExList,

    };

    const { data, error } = await supabase.from("workouts").insert([workout]).select();

    if (!error && data) {

      setWorkouts(prev => [data[0], ...prev]);

      const postContent = `💪 ${workout.title}` +

        (workout.duration ? ` · ⏱${workout.duration}хв` : "") +

        (workout.volume ? ` · 🏋️${workout.volume}т` : "") +

        (newExList.length > 0 ? `\n${newExList.map(e => `• ${e}`).join("\n")}` : "");

      await supabase.from("posts").insert([{ user_id: user.id, content: postContent }]);

      await loadFeed();

    }

    setNewTitle(""); setNewDuration(""); setNewVolume("");

    setNewExList([]); setNewExInput("");

    setShowAddWorkout(false); setSavingWorkout(false);

  };

  const sendMsg = async () => {

    if (!inp.trim() || !openChat) return;

    const content = inp.trim();

    setInp("");

    const msg = { sender_id: user.id, receiver_id: openChat.userId, content };

    const { data } = await supabase.from("messages").insert([msg]).select();

    if (data) setChatMsgsReal(prev => [...prev, data[0]]);

  };

  const openChatWith = (p) => {

    setOpenChat({ ...p, userId: p.userId || p.id });

    setTab("chat");

  };

  // ── ПЕРЕЙТИ НА СЬОГОДНІШНЄ ТРЕНУВАННЯ (Спринт 5) ──

  const goToTodayWorkout = () => {

    setAday(todayKey);

    setTab("workout");

  };

  const updateExName = (day, index, newName) => {

    setWplan(prev => {

      const updated = { ...prev };

      const exArr = [...updated[day].ex];

      exArr[index] = { ...exArr[index], n: newName };

      updated[day] = { ...updated[day], ex: exArr };

      return updated;

    });

  };

  const updateExSets = (day, index, newSets) => {

    setWplan(prev => {

      const updated = { ...prev };

      const exArr = [...updated[day].ex];

      exArr[index] = { ...exArr[index], s: newSets };

      updated[day] = { ...updated[day], ex: exArr };

      return updated;

    });

  };

  const addExToDay = (day) => {

    const name = newExName.trim();

    if (!name) return;

    setWplan(prev => {

      const updated = { ...prev };

      updated[day] = { ...updated[day], ex: [...updated[day].ex, { n: name, s: "3×10", d: "" }] };

      return updated;

    });

    setNewExName("");

  };

  const deleteExFromDay = (day, index) => {

    setWplan(prev => {

      const updated = { ...prev };

      updated[day] = { ...updated[day], ex: updated[day].ex.filter((_, i) => i !== index) };

      return updated;

    });

    const k = `${day}-${index}`;

    setChecked(c => { const n = { ...c }; delete n[k]; return n; });

  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const filteredTrainers = allTrainers.filter(t => {

    if (fGender !== "Всі" && t.gender !== fGender) return false;

    if (fFormat !== "Всі" && t.format !== fFormat) return false;

    return true;

  });

  const filteredProducts = shopCat === "Всі" ? allProducts : allProducts.filter(p => p.cat === shopCat);

  const plan = wplan[aday];

  const todayPlan = wplan[todayKey];

  // ── ЧАТ ВІКНО ──

  if (openChat) {

    return (<><style>{css}</style>

      <div className="app"><div className="cwin">

        <div className="cwh">

          <div className="backbtn" onClick={() => { setOpenChat(null); setChatMsgsReal([]); }}>←</div>

          <div className="cwava" style={{ background: openChat.col || getColor(openChat.userId), color: "#fff" }}>

            {openChat.ini || getIni(openChat.name)}

          </div>

          <div style={{ flex: 1 }}>

            <div className="cwname">{openChat.name}</div>

            <div className="cwst" style={{color: openChat?.isOnline ? "#4ade80" : "var(--muted)"}}>{openChat?.isOnline ? "● онлайн" : "● офлайн"}</div>

          </div>

        </div>

        <div className="msgs">

          {chatLoading && <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 40 }}>Завантаження...</div>}

          {!chatLoading && chatMsgsReal.length === 0 && <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginTop: 40 }}>Почни розмову 💬</div>}

          {chatMsgsReal.map(m => {

            const isMe = m.sender_id === user.id;

            const time = new Date(m.created_at).toLocaleTimeString("uk", { hour: "2-digit", minute: "2-digit" });

            return (

              <div key={m.id} className={`mrow${isMe ? " me" : ""}`}>

                {!isMe && <div className="mava" style={{ background: openChat.col || getColor(openChat.userId), color: "#fff" }}>{(openChat.ini || getIni(openChat.name))[0]}</div>}

                <div>

                  <div className={`mbub${isMe ? " my" : " th"}`}>{m.content}</div>

                  <div className="mt" style={{ textAlign: isMe ? "right" : "left" }}>{time}</div>

                </div>

              </div>

            );

          })}

          <div ref={endRef} />

        </div>

        <div className="cinrow">

          <input className="cinput" placeholder="Написати..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} />

          <button className="sendbtn" onClick={sendMsg}>↑</button>

        </div>

      </div></div>

    </>);

  }

  return (<><style>{css}</style>

    <div className="app">

      <div className="topbar">

        <div className="logo">IRON<span>CREW</span></div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

          {tab === "find" && findTab === "shop" && <div className="icon-btn" style={{ position: "relative" }}>🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</div>}

          <div className="icon-btn" onClick={() => setShowNextWorkout(true)} style={{cursor:"pointer"}}>🔔<div className="ndot" /></div>

          <div className="ava-sm">{getIni(profile?.name)}</div>

        </div>

      </div>

      <div className="scroll">

        {/* ── СТРІЧКА (Спринт 5: без stories, з видаленням постів, з банером тренування) ── */}

        {tab === "feed" && (<>

          {/* Банер сьогоднішнього тренування */}

          {todayPlan.ex.length > 0 && (

            <div className="today-banner" onClick={goToTodayWorkout}>

              <div className="today-banner-icon">🏋️</div>

              <div className="today-banner-text">

                <div className="today-banner-label">Сьогодні · {todayKey}</div>

                <div className="today-banner-title">{todayPlan.t}</div>

              </div>

              <div className="today-banner-arrow">→</div>

            </div>

          )}

          <div className="post-composer">

            <textarea

              placeholder="Поділись своїм тренуванням... 💪"

              value={newPostText}

              onChange={e => setNewPostText(e.target.value)}

              onKeyDown={e => e.key === "Enter" && e.ctrlKey && submitPost()}

            />

            <div className="post-composer-actions">

              <button className="post-btn" disabled={!newPostText.trim() || postingText} onClick={submitPost}>

                {postingText ? "..." : "ОПУБЛІКУВАТИ"}

              </button>

            </div>

          </div>

          <div className="stitle">СТРІЧКА <span>АКТИВНОСТІ</span></div>

          {feedLoading && <div style={{ textAlign: "center", color: "var(--muted)", padding: 30 }}>Завантаження...</div>}

          {!feedLoading && feedPosts.length === 0 && (

            <div className="feed-empty">

              <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>

              <div>Поки що немає постів.<br />Додай тренування або напиши щось!</div>

            </div>

          )}

          {feedPosts.map((post, pi) => {

            const authorName = post.profiles?.name || "Користувач";

            const ini = getIni(authorName);

            const col = getColor(post.user_id);

            const isLiked = !!myLikes[post.id];

            const isMe = post.user_id === user.id;

            return (

              <div className="fcard" key={post.id} style={{ animationDelay: `${pi * 0.06}s` }}>

                <div className="fhead">

                  <div className="uava" style={{ background: col, color: "#fff" }}>{ini}</div>

                  <div style={{ flex: 1 }}>

                    <div className="uname">{isMe ? (profile?.name || "Ти") : authorName}</div>

                    <div className="utime">{timeAgo(post.created_at)}</div>

                  </div>

                  {post.profiles?.gym && <div className="badge">{post.profiles.gym}</div>}

                </div>

                <div className="post-content">{post.content}</div>

                <div className="factions">

                  <button className={`abtn${isLiked ? " liked" : ""}`} onClick={() => toggleLike(post.id)}>

                    {isLiked ? "🔥" : "🤍"} {postLikes[post.id] || 0}

                  </button>

                  {!isMe && (

                    <button className={`abtn${followed[post.user_id] ? " following" : ""}`} onClick={() => toggleFollow(post.user_id)}>

                      {followed[post.user_id] ? "✓ Підписаний" : "+ Підписатись"}

                    </button>

                  )}

                  <div className="sp" />

                  {/* Видалення для своїх постів */}

                  {isMe ? (

                    <button className="abtn danger" onClick={() => { if (window.confirm("Видалити пост?")) deletePost(post.id); }}>🗑</button>

                  ) : (

                    <button className="abtn" onClick={() => openChatWith({ id: post.user_id, userId: post.user_id, name: authorName, ini, col })}>✉️</button>

                  )}

                </div>

              </div>

            );

          })}

        </>)}

        {/* ── ПРОГРАМА ── */}

        {tab === "workout" && (<>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>

            <div className="stitle" style={{ marginBottom: 0 }}>МОЯ <span>ПРОГРАМА</span></div>

            <button

              className={`edit-toggle-btn${editMode ? " active" : ""}`}

              onClick={() => { setEditMode(m => !m); setNewExName(""); }}

            >

              {editMode ? "✓ ГОТОВО" : "✏️ РЕДАГУВАТИ"}

            </button>

          </div>

          <div className="sub">Тижневий план тренувань</div>

          {(() => {

            // Обчислюємо дати тижня з урахуванням weekOffset

            const jsToday = new Date().getDay(); // 0=Нд

            // Початок поточного тижня (Пн)

            const monday = new Date();

            const daysToMon = (jsToday === 0 ? -6 : 1 - jsToday);

            monday.setDate(monday.getDate() + daysToMon + weekOffset * 7);

            // Мітка тижня

            const weekEnd = new Date(monday); weekEnd.setDate(weekEnd.getDate() + 6);

            const weekLabel = `${monday.toLocaleDateString("uk-UA",{day:"numeric",month:"short"})} – ${weekEnd.toLocaleDateString("uk-UA",{day:"numeric",month:"short"})}`;

            return (<>

              <div className="week-nav">

                <button className="week-arrow" onClick={() => setWeekOffset(w => w - 1)}>‹</button>

                <div className="week-label">{weekOffset === 0 ? "Цей тиждень" : weekOffset === 1 ? "Наступний тиждень" : weekLabel}</div>

                <button className="week-arrow" onClick={() => setWeekOffset(w => w + 1)}>›</button>

              </div>

              <div className="dtabs">{wdays.map((d, i) => {

                const date = new Date(monday);

                date.setDate(monday.getDate() + i);

                const dateStr = date.toLocaleDateString("uk-UA", { day: "numeric", month: "numeric" });

                const isToday = weekOffset === 0 && d === todayKey;

                return (

                  <button key={d} className={`dtab${aday === d ? " on" : ""}${isToday && aday !== d ? " today" : ""}`} onClick={() => setAday(d)}>

                    <div style={{fontWeight:700,fontSize:11}}>{d}</div>

                    <div style={{fontSize:9,opacity:0.75,marginTop:2}}>{dateStr}</div>

                    {isToday && <div style={{width:4,height:4,borderRadius:"50%",background: aday===d ? "#000" : "var(--accent)",marginTop:3}}/>}

                  </button>

                );

              })}</div>

            </>);

          })()}

          {plan.ex.length > 0 || editMode ? (

            <div className="wcard">

              <div className="wch">

                <div className="wct">{plan.t}</div>

                <div className="mtag">{plan.m}</div>

              </div>

              {editMode && (

                <div className="edit-mode-bar">

                  <span className="edit-mode-label">✏️ Режим редагування</span>

                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Змінюй прямо в картці</span>

                </div>

              )}

              {plan.ex.length === 0 && editMode && (

                <div style={{ padding: "16px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Додай першу вправу 👇</div>

              )}

              {plan.ex.map((ex, i) => {

                const k = `${aday}-${i}`;

                const done = checked[k];

                if (!editMode) {

                  return (

                    <div className="exi" key={i}>

                      <div className="enum">{i + 1}</div>

                      <div style={{ flex: 1 }}>

                        <div className="exn" style={{ color: done ? "var(--muted)" : "var(--text)", textDecoration: done ? "line-through" : "none", cursor: "pointer" }}

                          onClick={() => { setSelectedEx({ name: ex.n, key: k }); setExSets(""); setExReps(""); setExWeight(""); }}>

                          {ex.n}

                        </div>

                        <div className="exd">{ex.s}</div>

                        {savedSets[k] && (

                          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, marginTop: 2 }}>

                            {savedSets[k].sets}×{savedSets[k].reps} · {savedSets[k].weight}кг

                          </div>

                        )}

                      </div>

                      <button className={`cbtn${done ? " done" : ""}`} onClick={() => setChecked(c => ({ ...c, [k]: !c[k] }))}>{done ? "✓" : ""}</button>

                    </div>

                  );

                }

                return (

                  <div className="ex-edit-row" key={i}>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                      <div className="enum" style={{ flexShrink: 0 }}>{i + 1}</div>

                      <input className="ex-name-input" value={ex.n} onChange={e => updateExName(aday, i, e.target.value)} placeholder="Назва вправи" />

                      <button className="ex-delete-btn" onClick={() => deleteExFromDay(aday, i)}>✕</button>

                    </div>

                    <div style={{ paddingLeft: 36 }}>

                      <div style={{ fontSize: 9, color: "var(--muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>Підходи × Повторення</div>

                      <input className="ex-sets-input" value={ex.s} onChange={e => updateExSets(aday, i, e.target.value)} placeholder="4×8-10" />

                    </div>

                  </div>

                );

              })}

              {editMode && (

                <div className="add-ex-inline">

                  <input value={newExName} onChange={e => setNewExName(e.target.value)} placeholder="Назва нової вправи..." onKeyDown={e => e.key === "Enter" && addExToDay(aday)} />

                  <button onClick={() => addExToDay(aday)}>+</button>

                </div>

              )}

            </div>

          ) : (

            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>

              <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>

              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22 }}>{plan.t}</div>

            </div>

          )}

          {selectedEx && !editMode && (

            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>

              <div style={{ background: "var(--surface)", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 420, padding: "24px 20px 40px" }}>

                <div style={{ width: 40, height: 4, background: "var(--border)", borderRadius: 2, margin: "0 auto 20px" }} />

                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, marginBottom: 20 }}>{selectedEx.name}</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>

                  {[["ПІДХОДИ", exSets, setExSets], ["ПОВТОРЕННЯ", exReps, setExReps], ["ВАГА (кг)", exWeight, setExWeight]].map(([lbl, val, setter]) => (

                    <div key={lbl}>

                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{lbl}</div>

                      <input style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, color: "var(--text)", fontSize: 16, textAlign: "center" }}

                        type="number" value={val} onChange={e => setter(e.target.value)} />

                    </div>

                  ))}

                </div>

                <button style={{ width: "100%", background: "var(--accent)", color: "#000", border: "none", borderRadius: 14, padding: 16, fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, cursor: "pointer" }}

                  onClick={async () => {

                    await supabase.from("workout_sets").insert({

                      user_id: user.id, exercise_name: selectedEx.name,

                      sets: exSets ? parseInt(exSets) : null, reps: exReps ? parseInt(exReps) : null,

                      weight: exWeight ? parseFloat(exWeight) : null, day: aday,

                    });

                    setSavedSets(prev => ({ ...prev, [selectedEx.key]: { sets: exSets, reps: exReps, weight: exWeight } }));

                    setSelectedEx(null);

                  }}>

                  💾 ЗБЕРЕГТИ ПІДХІД

                </button>

                <button style={{ width: "100%", background: "none", border: "none", color: "var(--muted)", padding: 12, cursor: "pointer", marginTop: 8 }} onClick={() => setSelectedEx(null)}>Скасувати</button>

              </div>

            </div>

          )}

          {!editMode && plan.ex.length > 0 && (

            !timerActive ? (

              <button className="sbtn" onClick={() => { setTimerStart(Date.now()); setTimerActive(true); setTimerSeconds(0); }}>▶ ЄБАШ!</button>

            ) : (

              <div style={{ marginTop: 12 }}>

                <div style={{ background: "var(--accent)", borderRadius: 16, padding: "20px", textAlign: "center", marginBottom: 10 }}>

                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: "#000", letterSpacing: 2 }}>

                    {String(Math.floor(timerSeconds / 3600)).padStart(2, "0")}:{String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0")}:{String(timerSeconds % 60).padStart(2, "0")}

                  </div>

                  <div style={{ fontSize: 12, color: "#000", fontWeight: 600 }}>ТРЕНУВАННЯ ТРИВАЄ</div>

                </div>

                <button className="sbtn"

                  style={{ background: Object.keys(checked).filter(k => k.startsWith(aday) && checked[k]).length > 0 ? "var(--accent2)" : "var(--border)", cursor: Object.keys(checked).filter(k => k.startsWith(aday) && checked[k]).length > 0 ? "pointer" : "not-allowed" }}

                  disabled={Object.keys(checked).filter(k => k.startsWith(aday) && checked[k]).length === 0}

                  onClick={async () => {

                    await supabase.from("workouts").insert({ user_id: user.id, title: plan.t, duration: Math.floor(timerSeconds / 60), volume: null, exercises: plan.ex.map(e => e.n) });

                    setTimerActive(false); setTimerStart(null); setTimerSeconds(0); setSavedSets({});

                  }}>

                  ⏹ ВСЬО НАХОЙ

                </button>

              </div>

            )

          )}

        </>)}

        {/* ── ПРОГРЕС ── */}

        {tab === "progress" && (() => {
          // ── Обчислення реальної статистики з workout_sets ──

          // Загальний обсяг (кг) = сума weight * sets * reps
          const totalVolume = setsData.reduce((acc, s) => {
            return acc + ((s.weight || 0) * (s.sets || 1) * (s.reps || 1));
          }, 0);
          const totalVolumeTons = (totalVolume / 1000).toFixed(1);

          // Загальний час тренувань з workouts таблиці
          const totalMinutes = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);
          const totalHours = (totalMinutes / 60).toFixed(1);

          // PR по кожній вправі — максимальна вага
          const prMap = {};
          setsData.forEach(s => {
            if (!s.exercise_name || !s.weight) return;
            if (!prMap[s.exercise_name] || s.weight > prMap[s.exercise_name].weight) {
              prMap[s.exercise_name] = { weight: s.weight, date: s.created_at, sets: s.sets, reps: s.reps };
            }
          });
          const prList = Object.entries(prMap)
            .sort((a, b) => b[1].weight - a[1].weight)
            .slice(0, 6);

          // Графік — обсяг по останніх 7 днях
          const last7 = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().slice(0, 10);
          });
          const volumeByDay = {};
          setsData.forEach(s => {
            const day = s.created_at?.slice(0, 10);
            if (!day) return;
            const vol = (s.weight || 0) * (s.sets || 1) * (s.reps || 1);
            volumeByDay[day] = (volumeByDay[day] || 0) + vol;
          });
          const chartData = last7.map(d => volumeByDay[d] || 0);
          const chartMax = Math.max(...chartData, 1);

          // Графік прогресу по вибраній вправі
          const exNames = [...new Set(setsData.map(s => s.exercise_name).filter(Boolean))];
          const activeEx = selectedExercise || exNames[0] || null;
          const exHistory = setsData
            .filter(s => s.exercise_name === activeEx && s.weight)
            .slice(-10)
            .map(s => ({ date: s.created_at?.slice(0,10), weight: s.weight, sets: s.sets, reps: s.reps }));
          const exMax = Math.max(...exHistory.map(e => e.weight), 1);

          return (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div className="stitle" style={{ marginBottom: 0 }}>МІЙ <span>ПРОГРЕС</span></div>
              {statsLoading && <div style={{ fontSize: 12, color: "var(--muted)" }}>Завантаження...</div>}
            </div>

            {/* Статистика — 4 картки */}
            <div className="pgrid">
              <div className="pcard">
                <div className="pval">{workouts.length}</div>
                <div className="plbl">Тренувань</div>
                <div className="pchg">💪</div>
              </div>
              <div className="pcard">
                <div className="pval">{totalVolumeTons}т</div>
                <div className="plbl">Загальний обсяг</div>
                <div className="pchg" style={{ color: "#4ade80" }}>↑ реально</div>
              </div>
              <div className="pcard">
                <div className="pval">{totalHours}</div>
                <div className="plbl">Год у залі</div>
                <div className="pchg">⏱</div>
              </div>
              <div className="pcard">
                <div className="pval">{prList.length}</div>
                <div className="plbl">Вправ записано</div>
                <div className="pchg" style={{ color: "var(--accent2)" }}>🔥</div>
              </div>
            </div>

            {/* Графік обсягу за 7 днів */}
            <div className="bcc">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Обсяг за 7 днів (кг)</div>
              {chartData.every(v => v === 0) ? (
                <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, padding: "20px 0" }}>
                  Немає даних — почни записувати підходи під час тренування
                </div>
              ) : (
                <div className="bchart">
                  {chartData.map((v, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const label = date.toLocaleDateString("uk-UA", { day: "numeric", month: "numeric" });
                    const h = Math.round((v / chartMax) * 90) + (v > 0 ? 6 : 0);
                    return (
                      <div className="bcol" key={i}>
                        <div className={`bar${i === 6 ? " hi" : ""}`} style={{ height: h, background: v > 0 ? (i === 6 ? "var(--accent)" : "var(--surface2)") : "transparent", border: v > 0 ? "none" : "1px dashed var(--border)" }} />
                        <div className="bday" style={{ fontSize: 8 }}>{label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Графік прогресу по вправі */}
            {exNames.length > 0 && (<>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Прогрес по вправі</div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", marginBottom: 14, paddingBottom: 2 }}>
                {exNames.map(n => (
                  <button key={n} onClick={() => setSelectedExercise(n)}
                    style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: "1px solid", borderColor: activeEx === n ? "var(--accent)" : "var(--border)", background: activeEx === n ? "var(--accent)" : "var(--surface)", color: activeEx === n ? "#000" : "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="bcc" style={{ marginBottom: 20 }}>
                {exHistory.length < 2 ? (
                  <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, padding: "16px 0" }}>
                    Потрібно мінімум 2 записи щоб побачити прогрес
                  </div>
                ) : (<>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90, marginBottom: 8 }}>
                    {exHistory.map((e, i) => {
                      const h = Math.round((e.weight / exMax) * 80) + 10;
                      const isLast = i === exHistory.length - 1;
                      const isPR = e.weight === exMax;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          {isPR && <div style={{ fontSize: 8, color: "var(--accent2)", fontWeight: 700 }}>PR</div>}
                          <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: isPR ? "var(--accent2)" : isLast ? "var(--accent)" : "var(--surface2)", height: h }} />
                          <div style={{ fontSize: 9, color: "var(--muted)" }}>{e.weight}кг</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted)" }}>
                    <span>{exHistory[0]?.date}</span>
                    <span>PR: {exMax}кг 🔥</span>
                    <span>{exHistory[exHistory.length-1]?.date}</span>
                  </div>
                </>)}
              </div>
            </>)}

            {/* Особисті рекорди */}
            <div className="stitle" style={{ marginBottom: 12 }}>ОСОБИСТІ <span>РЕКОРДИ</span></div>
            {prList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "var(--muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🏋️</div>
                <div style={{ fontSize: 13 }}>Рекордів ще немає.<br/>Запиши перше тренування!</div>
              </div>
            ) : (
              <div className="prlist">
                {prList.map(([name, pr], i) => (
                  <div className="prcard" key={i}>
                    <div className="pricon">🏋️</div>
                    <div className="prinfo">
                      <div className="prn">{name}</div>
                      <div className="prd">{pr.sets}×{pr.reps} · {new Date(pr.date).toLocaleDateString("uk-UA", { day: "numeric", month: "short" })}</div>
                    </div>
                    <div>
                      <div className="prv">{pr.weight}</div>
                      <div className="pru">кг</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>);
        })()}

        {/* ── ЗНАЙТИ ── */}

        {tab === "find" && (<>

          <div className="stitle">ЗНАЙТИ <span>АТЛЕТІВ</span></div>

          {/* Пошук */}
          <div className="sbar" style={{marginBottom:16}}>
            <span style={{fontSize:16,color:"var(--muted)"}}>🔍</span>
            <input
              placeholder="Ім'я, зал, місто..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && <span style={{cursor:"pointer",color:"var(--muted)",fontSize:16}} onClick={() => setSearchQuery("")}>✕</span>}
          </div>

          {discoverLoading && <div style={{textAlign:"center",color:"var(--muted)",padding:30,fontSize:13}}>Завантаження...</div>}

          {!discoverLoading && (() => {
            const filtered = discoverUsers.filter(u => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (u.name||"").toLowerCase().includes(q) ||
                     (u.gym||"").toLowerCase().includes(q) ||
                     (u.city||"").toLowerCase().includes(q);
            });

            if (filtered.length === 0) return (
              <div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}>
                <div style={{fontSize:40,marginBottom:10}}>🔍</div>
                <div style={{fontSize:13}}>{searchQuery ? "Нікого не знайдено" : "Поки що немає інших атлетів"}</div>
              </div>
            );

            return filtered.map((p, i) => {
              const col = getColor(p.user_id);
              const ini = getIni(p.name);
              const isFollowing = followed[p.user_id];
              return (
                <div key={p.user_id} className="rcard" style={{animationDelay:`${i*0.05}s`}}>
                  <div className="rtop">
                    <div className="rava" style={{background:col,color:"#fff"}}>{ini}</div>
                    <div style={{flex:1}}>
                      <div className="rn">{p.name || "Атлет"}</div>
                      <div className="rs">{p.gym || ""}{p.city ? (p.gym ? " · " : "") + p.city : ""}</div>
                    </div>
                  </div>
                  {(p.gym || p.city) && (
                    <div className="gym-badge">🏢 {p.gym || p.city}</div>
                  )}
                  <div className="ract">
                    <button className="rbtn" onClick={() => openChatWith({id:p.user_id,userId:p.user_id,name:p.name||"Атлет",ini,col})}>💬 Написати</button>
                    <button className={`rbtn${isFollowing ? "" : " pri"}`} onClick={() => toggleFollow(p.user_id)}>
                      {isFollowing ? "✓ Підписаний" : "+ Підписатись"}
                    </button>
                  </div>
                </div>
              );
            });
          })()}

          <div style={{display:"none"}}>
          <div className="ftabs">
            {[{id:"people",l:"👥 Люди"}].map(ft => (
              <button key={ft.id} className={`ftab${findTab===ft.id?" on":""}`} onClick={() => setFindTab(ft.id)}>{ft.l}</button>
            ))}
          </div>

          {findTab === "people" && (<>

            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>

              {[{id:"near",l:"📍 Поруч"},{id:"similar",l:"🎯 Схожий прогрес"}].map(s => (

                <button key={s.id} className={`ftab${recSub===s.id?" on":""}`} style={{ flex: 1 }} onClick={() => setRecSub(s.id)}>{s.l}</button>

              ))}

            </div>

            {peopleRecs[recSub].map((rec,i) => (

              <div className="rcard" key={rec.id} style={{ animationDelay: `${i*0.07}s` }}>

                <div className="rtop"><div className="rava" style={{ background: rec.col, color: "#fff" }}>{rec.ini}</div><div><div className="rn">{rec.name}</div><div className="rs">{rec.sub}</div><div className={`mpill ${rec.match}`}>{rec.mlbl}</div></div></div>

                <div className="gym-badge">🏢 {rec.gym}</div>

                <div className="rstats">

                  <div className="rst"><div className="rstv">{rec.w}</div><div className="rstl">ТРЕНУВАНЬ</div></div>

                  <div className="rst"><div className="rstv">{rec.sq}</div><div className="rstl">ПРИСІД</div></div>

                  <div className="rst"><div className="rstv">{rec.bn}</div><div className="rstl">ЖИМ</div></div>

                </div>

                <div className="ract">

                  <button className="rbtn" onClick={() => openChatWith(rec)}>💬 Написати</button>

                  <button className={`rbtn${followed[rec.id] ? "" : " pri"}`} onClick={() => toggleFollow(rec.id)}>

                    {followed[rec.id] ? "✓ Підписаний" : "+ Підписатись"}

                  </button>

                </div>

              </div>

            ))}

          </>)}

          {findTab === "trainers" && (<>

            <div className="filter-bar">

              <div className="filter-row">

                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>Стать:</span>

                {["Всі","Чоловік","Жінка"].map(g => <button key={g} className={`fpill${fGender===g?" on":""}`} onClick={() => setFGender(g)}>{g}</button>)}

              </div>

              <div className="filter-row">

                <span style={{ fontSize: 11, color: "var(--muted)", alignSelf: "center", marginRight: 4 }}>Формат:</span>

                {["Всі","Онлайн","Офлайн"].map(f => <button key={f} className={`fpill${fFormat===f?" on":""}`} onClick={() => setFFormat(f)}>{f}</button>)}

              </div>

            </div>

            {filteredTrainers.map((tr,i) => (

              <div className="tcard" key={tr.id} style={{ animationDelay: `${i*0.07}s` }}>

                <div className="thead-row">

                  <div className="tava" style={{ background: tr.col, color: "#fff" }}>{tr.ini}{tr.online && <div className="tonline" />}</div>

                  <div className="tinfo"><div className="tname">{tr.name}</div><div className="tspec">{tr.spec}</div><div className="tloc">📍 {tr.loc}</div>

                    <div className="trating"><span className="tstars">★★★★★</span><span>{tr.rating}</span><span style={{ color: "var(--muted)", fontWeight: 400 }}>({tr.reviews})</span></div>

                  </div>

                </div>

                <div className="ttags">{tr.tags.map((tg,j) => <span key={j} className={`ttag${j===0?" orange":j===1?" green":""}`}>{tg}</span>)}<span className="ttag">{tr.exp}</span></div>

                <div className="tprice-row"><div className="tprice">{tr.price} ₴<span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}> / год</span></div></div>

                <div className="tacts">

                  <button className="tbtn" onClick={() => openChatWith({ id: tr.id+100, name: tr.name, ini: tr.ini, col: tr.col })}>💬 Написати</button>

                  <button className="tbtn pri">📅 Записатись</button>

                </div>

              </div>

            ))}

          </>)}

          {findTab === "shop" && (<>

            <div className="shop-cats">{shopCats.map(c => <button key={c} className={`scat${shopCat===c?" on":""}`} onClick={() => setShopCat(c)}>{c}</button>)}</div>

            <div className="sgrid">{filteredProducts.map((p,i) => (

              <div className="sprod" key={p.id} style={{ animationDelay: `${i*0.05}s` }}>

                <div className="simg">{p.emoji}</div>

                <div className="sinfo">

                  <div className="sbrand">{p.brand}</div>

                  <div className="sprodn">{p.name}</div>

                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", marginTop: 6 }}>

                    <span className="sprice">{p.price}₴</span>

                    {p.oldPrice && <><span className="sold-price">{p.oldPrice}₴</span><span className="sdiscount">-{p.discount}%</span></>}

                  </div>

                  <button className={`saddbtn${cart[p.id] ? " added" : ""}`} onClick={() => setCart(c => ({ ...c, [p.id]: (c[p.id]||0)+1 }))}>

                    {cart[p.id] ? `✓ В кошику (${cart[p.id]})` : "+ Додати"}

                  </button>

                </div>

              </div>

            ))}</div>

          </>)}

          </div>{/* кінець hidden */}

        </>)}

        {/* ── ЧАТ ── */}

        {tab === "chat" && (<>

          <div className="stitle">ПОВІДОМЛЕННЯ</div>

          <div className="sbar"><span style={{ fontSize: 16, color: "var(--muted)" }}>🔍</span><input placeholder="Пошук..." /></div>

          {realUsers.length === 0 && <div style={{ textAlign: "center", color: "var(--muted)", padding: 30, fontSize: 13 }}>Поки що немає інших користувачів</div>}

          {realUsers.map(u => {

            const col = getColor(u.user_id);

            const ini = getIni(u.name);

            return (

              <div key={u.user_id} className="citem" onClick={() => openChatWith({ id: u.user_id, userId: u.user_id, name: u.name || "Користувач", ini, col, isOnline: onlineUsers.has(u.user_id) })}>

                <div className="cava" style={{ background: col, color: "#fff" }}>
                  {ini}
                  <div className={onlineUsers.has(u.user_id) ? "online-dot" : "offline-dot"} />
                </div>

                <div className="cinf">
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div className="cname">{u.name || "Користувач"}</div>
                    {onlineUsers.has(u.user_id) && <span style={{fontSize:9,color:"#4ade80",fontWeight:700,letterSpacing:0.5}}>ОНЛАЙН</span>}
                  </div>
                  <div className="cprev">{u.lastMsg || u.gym || "Напиши першим 👋"}</div>
                </div>

                <div className="cmeta"><div className="ctime">💬</div></div>

              </div>

            );

          })}

        </>)}

        {/* ── ПРОФІЛЬ ── */}

        {tab === "profile" && (() => {
          // Обчислення streak
          const workoutDays = new Set(workouts.map(w => w.created_at?.slice(0, 10)).filter(Boolean));
          let streak = 0;
          const today = new Date();
          for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            if (workoutDays.has(key)) { streak++; } else if (i > 0) { break; }
          }
          return (<>

          <div className="pava">{getIni(profile?.name)}</div>

          <div className="pname">{profile?.name || user?.email || "Профіль"}</div>

          <div className="pbio">{profile?.gym || ""}{profile?.city ? ` · ${profile.city}` : ""}</div>

          {/* Streak badge */}
          {streak > 0 && (
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,107,53,0.1)",border:"1px solid rgba(255,107,53,0.3)",borderRadius:20,padding:"6px 14px",marginBottom:12}}>
              <span style={{fontSize:18}}>🔥</span>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"var(--accent2)",letterSpacing:1}}>{streak}</span>
              <span style={{fontSize:12,color:"var(--muted)"}}>днів поспіль</span>
            </div>
          )}

          <div className="pstats">

            <div className="pst" style={{cursor:"pointer"}} onClick={() => openFollowModal('followers')}>
              <div className="pstv">{followCounts.followers}</div>
              <div className="pstl">Підписники</div>
            </div>

            <div className="pst">
              <div className="pstv">{workouts.length}</div>
              <div className="pstl">Тренувань</div>
            </div>

            <div className="pst" style={{cursor:"pointer"}} onClick={() => openFollowModal('following')}>
              <div className="pstv">{followCounts.following}</div>
              <div className="pstl">Підписки</div>
            </div>

          </div>

          <button className="epbtn" onClick={() => { setEditName(profile?.name||""); setEditGym(profile?.gym||""); setEditCity(profile?.city||""); setEditProfile(true); }}>✏️ Редагувати профіль</button>

          <button className="add-workout-btn" onClick={() => setShowAddWorkout(true)}>

            <span style={{ fontSize: 20 }}>+</span> Додати тренування

          </button>

          <div className="stitle" style={{ marginBottom: 12 }}>ОСТАННІ <span>ТРЕНУВАННЯ</span></div>

          {workouts.length === 0 ? (

            <div className="empty-workouts"><div className="big-icon">🏋️</div><p>Ще немає тренувань.<br />Натисни «Додати тренування»!</p></div>

          ) : (

            workouts.map((w,i) => {
              const offset = swipeState[w.id] || 0;
              const swiped = offset < -60;
              return (
                <div key={w.id} style={{position:"relative",marginBottom:10,overflow:"hidden",borderRadius:14}}>
                  {/* Фон кнопки видалення */}
                  <div style={{position:"absolute",inset:0,background:"rgba(255,59,48,0.15)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:20}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                      <span style={{fontSize:20}}>🗑</span>
                      <span style={{fontSize:9,color:"#ff3b30",fontWeight:700}}>ВИДАЛИТИ</span>
                    </div>
                  </div>
                  {/* Картка тренування */}
                  <div
                    className="wlog-card"
                    style={{
                      animationDelay:`${i*0.07}s`,
                      marginBottom:0,
                      transform:`translateX(${Math.max(offset, -80)}px)`,
                      transition: offset === 0 ? "transform 0.3s ease" : "none",
                      position:"relative",zIndex:1,
                      background: swiped ? "var(--surface)" : "var(--card)",
                    }}
                    onTouchStart={e => {
                      const startX = e.touches[0].clientX;
                      const onMove = ev => {
                        const dx = ev.touches[0].clientX - startX;
                        if (dx < 0) setSwipeState(s => ({...s, [w.id]: dx}));
                      };
                      const onEnd = () => {
                        const cur = swipeState[w.id] || 0;
                        if (cur < -60) { deleteWorkout(w.id); }
                        else { setSwipeState(s => ({...s, [w.id]: 0})); }
                        document.removeEventListener("touchmove", onMove);
                        document.removeEventListener("touchend", onEnd);
                      };
                      document.addEventListener("touchmove", onMove);
                      document.addEventListener("touchend", onEnd);
                    }}
                  >
                    <div className="wlog-title">{w.title}</div>
                    <div className="wlog-meta">
                      {w.duration && <div className="wlog-chip">⏱ <span>{w.duration} хв</span></div>}
                      {w.volume && <div className="wlog-chip">🏋️ <span>{w.volume} т</span></div>}
                      {Array.isArray(w.exercises) && w.exercises.length > 0 && <div className="wlog-chip">📋 <span>{w.exercises.length} вправ</span></div>}
                    </div>
                    {Array.isArray(w.exercises) && w.exercises.length > 0 && (
                      <div className="wlog-exlist">{w.exercises.map((ex,j) => <div className="wlog-exrow" key={j}><span>{ex}</span></div>)}</div>
                    )}
                    <div className="wlog-date">📅 {formatDate(w.created_at)}</div>
                  </div>
                </div>
              );
            })

          )}

          </>);
        })()}

        {/* ── МОДАЛКА РЕДАГУВАННЯ ПРОФІЛЮ ── */}

        {editProfile && (

          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>

            <div style={{ background: "#141414", border: "1px solid #2a2a2a", padding: 28, width: 320, borderRadius: 12 }}>

              <div style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f0", marginBottom: 20 }}>Редагувати профіль</div>

              {[["ІМ'Я", editName, setEditName], ["ЗАЛ", editGym, setEditGym], ["МІСТО", editCity, setEditCity]].map(([lbl, val, setter]) => (

                <div key={lbl} style={{ marginBottom: 12 }}>

                  <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{lbl}</div>

                  <input value={val} onChange={e => setter(e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "10px 12px", fontSize: 14, boxSizing: "border-box", borderRadius: 8 }} />

                </div>

              ))}

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>

                <button onClick={() => setEditProfile(false)} style={{ flex: 1, padding: 12, background: "#1c1c1c", border: "1px solid #2a2a2a", color: "#666", cursor: "pointer", borderRadius: 8 }}>Скасувати</button>

                <button onClick={async () => {

                  await supabase.from("profiles").upsert({ user_id: user.id, name: editName, gym: editGym, city: editCity });

                  setProfile({ ...profile, name: editName, gym: editGym, city: editCity });

                  setEditProfile(false);

                }} style={{ flex: 1, padding: 12, background: "#e8ff47", border: "none", color: "#000", fontWeight: 700, cursor: "pointer", borderRadius: 8 }}>Зберегти</button>

              </div>

            </div>

          </div>

        )}

        {/* ── МОДАЛКА ДОДАВАННЯ ТРЕНУВАННЯ ── */}

        {showAddWorkout && (

          <div className="modal-overlay" onClick={e => { if (e.target.className === "modal-overlay") setShowAddWorkout(false); }}>

            <div className="modal-sheet">

              <div className="modal-handle" />

              <div className="modal-title">НОВЕ <span>ТРЕНУВАННЯ</span></div>

              <div className="field-label">Назва тренування *</div>

              <input className="field-input" placeholder="Наприклад: Груди / Трицепс" value={newTitle} onChange={e => setNewTitle(e.target.value)} />

              <div className="field-row">

                <div><div className="field-label">Тривалість (хв)</div><input className="field-input" type="number" placeholder="60" value={newDuration} onChange={e => setNewDuration(e.target.value)} /></div>

                <div><div className="field-label">Обсяг (тонни)</div><input className="field-input" type="number" step="0.1" placeholder="5.4" value={newVolume} onChange={e => setNewVolume(e.target.value)} /></div>

              </div>

              <div className="field-label">Вправи</div>

              <div className="ex-add-row">

                <input className="field-input" placeholder="Жим лежачи 4×8" value={newExInput} onChange={e => setNewExInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addExercise()} />

                <button onClick={addExercise}>+</button>

              </div>

              {newExList.length > 0 && (

                <div className="ex-added-list">

                  {newExList.map((ex,i) => (

                    <div className="ex-added-item" key={i}>

                      <span>{ex}</span>

                      <button className="ex-remove" onClick={() => setNewExList(prev => prev.filter((_,j) => j !== i))}>×</button>

                    </div>

                  ))}

                </div>

              )}

              <button className="save-workout-btn" disabled={!newTitle.trim() || savingWorkout} onClick={saveWorkout}>

                {savingWorkout ? "ЗБЕРЕЖЕННЯ..." : "💾 ЗБЕРЕГТИ ТРЕНУВАННЯ"}

              </button>

            </div>

          </div>

        )}

      </div>

        {/* ── МОДАЛКА НАСТУПНОГО ТРЕНУВАННЯ ── */}

        {showNextWorkout && (() => {

          // Знаходимо наступний день з вправами

          const todayIdx = wdays.indexOf(todayKey);

          let nextDay = null;

          let nextPlan = null;

          for (let i = 1; i <= 7; i++) {

            const d = wdays[(todayIdx + i) % 7];

            if (wplan[d].ex.length > 0) { nextDay = d; nextPlan = wplan[d]; break; }

          }

          // Дата наступного тренування

          const todayJs = new Date().getDay();

          const nextIdx = nextDay ? wdays.indexOf(nextDay) : 0;

          const nextDayJs = nextIdx === 6 ? 0 : nextIdx + 1;

          let daysUntil = nextDayJs - todayJs;

          if (daysUntil <= 0) daysUntil += 7;

          const nextDate = new Date();

          nextDate.setDate(nextDate.getDate() + daysUntil);

          const nextDateStr = nextDate.toLocaleDateString("uk-UA", { weekday: "long", day: "numeric", month: "long" });

          return (

            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={() => setShowNextWorkout(false)}>

              <div style={{background:"var(--surface)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:"24px 20px 40px"}} onClick={e => e.stopPropagation()}>

                <div style={{width:40,height:4,background:"var(--border)",borderRadius:2,margin:"0 auto 20px"}}/>

                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"var(--muted)",letterSpacing:2,marginBottom:4}}>НАСТУПНЕ ТРЕНУВАННЯ</div>

                {nextDay && nextPlan ? (<>

                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"var(--accent)",letterSpacing:1,marginBottom:4}}>{nextPlan.t}</div>

                  <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>📅 {nextDateStr}</div>

                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>

                    {nextPlan.ex.map((ex, i) => (

                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:"var(--surface2)",borderRadius:10,padding:"10px 14px"}}>

                        <div style={{width:24,height:24,borderRadius:6,background:"rgba(232,255,71,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:"var(--accent)",flexShrink:0}}>{i+1}</div>

                        <div style={{flex:1}}>

                          <div style={{fontSize:13,fontWeight:600}}>{ex.n}</div>

                          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{ex.s}</div>

                        </div>

                      </div>

                    ))}

                  </div>

                  <button style={{width:"100%",background:"var(--accent)",color:"#000",border:"none",borderRadius:14,padding:16,fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,cursor:"pointer"}}

                    onClick={() => { setAday(nextDay); setTab("workout"); setShowNextWorkout(false); }}>

                    ВІДКРИТИ ПРОГРАМУ

                  </button>

                </>) : (

                  <div style={{textAlign:"center",padding:"20px 0",color:"var(--muted)"}}>Немає запланованих тренувань 😴</div>

                )}

              </div>

            </div>

          );

        })()}


        {/* ── МОДАЛКА ПІДПИСНИКИ / ПІДПИСКИ ── */}
        {showFollowModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={() => setShowFollowModal(null)}>
            <div style={{background:"var(--surface)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:480,padding:"24px 20px 40px",maxHeight:"70vh",overflowY:"auto"}} onClick={e => e.stopPropagation()}>
              <div style={{width:40,height:4,background:"var(--border)",borderRadius:2,margin:"0 auto 20px"}}/>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:1.5,marginBottom:20}}>
                {showFollowModal === 'followers' ? 'ПІДПИСНИКИ' : 'ПІДПИСКИ'}
              </div>
              {followListLoading && <div style={{textAlign:"center",color:"var(--muted)",padding:20}}>Завантаження...</div>}
              {!followListLoading && followList.length === 0 && (
                <div style={{textAlign:"center",color:"var(--muted)",padding:20,fontSize:13}}>
                  {showFollowModal === 'followers' ? 'Ще немає підписників' : 'Ти ще нікого не підписаний'}
                </div>
              )}
              {followList.map(p => (
                <div key={p.user_id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:getColor(p.user_id),display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:"#fff",flexShrink:0}}>{getIni(p.name)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600}}>{p.name || "Користувач"}</div>
                    <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{p.gym || p.city || ""}</div>
                  </div>
                  <button
                    style={{padding:"7px 14px",borderRadius:10,border:"1px solid",borderColor:followed[p.user_id]?"var(--accent)":"var(--border)",background:followed[p.user_id]?"rgba(232,255,71,0.1)":"var(--surface2)",color:followed[p.user_id]?"var(--accent)":"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
                    onClick={() => toggleFollow(p.user_id)}
                  >
                    {followed[p.user_id] ? "✓ Підписаний" : "+ Підписатись"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="bottomnav">

        {[{id:"feed",ic:"🏠",l:"Стрічка"},{id:"workout",ic:"📋",l:"Програма"},{id:"progress",ic:"📈",l:"Прогрес"},{id:"find",ic:"🔍",l:"Знайти"},{id:"chat",ic:"💬",l:"Чат",b:true},{id:"profile",ic:"👤",l:"Профіль"}].map(n => (

          <button key={n.id} className={`ni${tab===n.id?" on":""}`} onClick={() => setTab(n.id)}>

            <span className="ni-icon">{n.ic}{n.b && tab!==n.id && <span className="nbdot" />}</span>{n.l}

          </button>

        ))}

      </div>

    </div>

  </>);

}