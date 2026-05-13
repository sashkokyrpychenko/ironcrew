import { useState, useRef, useEffect } from "react";

import { supabase } from "./supabase";

const css = `

  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *{box-sizing:border-box;margin:0;padding:0;}

  :root{--bg:#0a0a0a;--surface:#141414;--surface2:#1c1c1c;--border:#2a2a2a;--accent:#e8ff47;--accent2:#ff6b35;--text:#f0f0f0;--muted:#666;--card:#161616;}

  body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;}

  .app{max-width:420px;margin:0 auto;min-height:100vh;background:var(--bg);}

  .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 12px;position:sticky;top:0;background:rgba(10,10,10,0.96);backdrop-filter:blur(12px);z-index:50;border-bottom:1px solid var(--border);}

  .logo{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:var(--accent);}

  .logo span{color:var(--text);}

  .icon-btn{background:var(--surface);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;position:relative;}

  .ndot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--accent);border-radius:50%;}

  .ava-sm{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#000;cursor:pointer;}

  .bottomnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:420px;background:rgba(14,14,14,0.97);backdrop-filter:blur(16px);border-top:1px solid var(--border);display:flex;z-index:50;padding:8px 0 20px;}

  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;cursor:pointer;border:none;background:none;color:var(--muted);font-family:'DM Sans',sans-serif;font-size:9px;font-weight:500;transition:color 0.2s;}

  .ni.on{color:var(--accent);}

  .ni-icon{font-size:18px;position:relative;}

  .nbdot{position:absolute;top:-2px;right:-4px;width:7px;height:7px;background:var(--accent2);border-radius:50%;}

  .scroll{padding:16px 20px 120px;overflow-y:auto;}

  .stitle{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1.5px;color:var(--text);margin-bottom:14px;}

  .stitle span{color:var(--accent);}

  .sub{color:var(--muted);font-size:13px;margin-top:2px;margin-bottom:16px;}

  @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  .stories{display:flex;gap:12px;overflow-x:auto;margin:0 -20px 20px;padding:0 20px 8px;scrollbar-width:none;}

  .stories::-webkit-scrollbar{display:none;}

  .story{display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;cursor:pointer;}

  .sring{width:58px;height:58px;border-radius:50%;padding:2.5px;background:linear-gradient(135deg,var(--accent2),var(--accent));}

  .sring.seen{background:var(--border);}

  .sinner{width:100%;height:100%;border-radius:50%;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid var(--bg);}

  .sname{font-size:10px;color:var(--muted);max-width:58px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

  .fcard{background:var(--card);border:1px solid var(--border);border-radius:16px;margin-bottom:14px;overflow:hidden;animation:fu 0.4s ease both;}

  .fhead{display:flex;align-items:center;gap:10px;padding:14px 14px 10px;}

  .uava{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;}

  .uname{font-size:14px;font-weight:600;}

  .utime{font-size:11px;color:var(--muted);}

  .badge{background:var(--accent);color:#000;font-size:9px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:20px;text-transform:uppercase;}

  .badge.fire{background:var(--accent2);color:#fff;}

  .wsum{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);}

  .sc{background:var(--surface);padding:12px;text-align:center;}

  .sv{font-family:'Bebas Neue',sans-serif;font-size:24px;color:var(--accent);line-height:1;}

  .sl{font-size:10px;color:var(--muted);margin-top:2px;}

  .exlist{padding:12px 14px;}

  .exrow{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;}

  .exrow:last-child{border-bottom:none;}

  .pr-tag{font-size:10px;font-weight:700;color:var(--accent2);background:rgba(255,107,53,0.12);padding:2px 6px;border-radius:4px;}

  .factions{display:flex;align-items:center;gap:4px;padding:10px 14px;border-top:1px solid var(--border);}

  .abtn{display:flex;align-items:center;gap:5px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:7px 12px;color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;}

  .abtn:hover{border-color:var(--accent);color:var(--accent);}

  .abtn.liked{color:var(--accent2);border-color:var(--accent2);}

  .sp{flex:1;}

  .dtabs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;margin-bottom:20px;padding-bottom:4px;}

  .dtabs::-webkit-scrollbar{display:none;}

  .dtab{flex-shrink:0;padding:8px 16px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;}

  .dtab.on{background:var(--accent);border-color:var(--accent);color:#000;font-weight:700;}

  .wcard{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:16px;}

  .wch{display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid var(--border);}

  .wct{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;}

  .mtag{font-size:10px;font-weight:600;padding:3px 8px;border-radius:6px;background:rgba(232,255,71,0.1);color:var(--accent);text-transform:uppercase;}

  .exi{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);}

  .exi:last-child{border-bottom:none;}

  .enum{width:28px;height:28px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--accent);flex-shrink:0;}

  .exinf{flex:1;}

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

  .pbanner{height:0px;position:relative;overflow:visible;background:linear-gradient(135deg,#1a1a0a,#0a1a0a,#0a0a1a);position:relative;margin:0 -20px;overflow:hidden;}

  .bpat{position:absolute;bottom:-36px;left:20px;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(232,255,71,0.04) 20px,rgba(232,255,71,0.04) 21px);}

  .pava{margin-top:36px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#000;border:3px solid var(--bg);margin-top:-36px;margin-bottom:12px;}

  .pname{font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:1px;}

  .pbio{font-size:12px;color:var(--muted);margin-top:2px;}

  .pstats{display:grid;grid-template-columns:repeat(3,1fr);background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin:16px 0;}

  .pst{padding:14px;text-align:center;border-right:1px solid var(--border);}

  .pst:last-child{border-right:none;}

  .pstv{font-family:'Bebas Neue',sans-serif;font-size:26px;color:var(--accent);line-height:1;}

  .pstl{font-size:10px;color:var(--muted);margin-top:2px;}

  .epbtn{width:100%;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:12px;}

  .wtgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}

  .wttile{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;cursor:pointer;}

  .wtn{font-size:13px;font-weight:600;}

  .wtd{font-size:10px;color:var(--muted);margin-top:2px;}

  .wts{font-size:10px;color:var(--accent);margin-top:8px;font-weight:600;}

  .sbar{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:10px 14px;margin-bottom:16px;}

  .sbar input{flex:1;background:none;border:none;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;}

  .sbar input::placeholder{color:var(--muted);}

  .citem{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;cursor:pointer;transition:background 0.18s;}

  .citem:hover{background:var(--surface);}

  .cava{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;flex-shrink:0;position:relative;}

  .odot{position:absolute;bottom:1px;right:1px;width:11px;height:11px;background:#4ade80;border-radius:50%;border:2px solid var(--bg);}

  .cinf{flex:1;min-width:0;}

  .cname{font-size:14px;font-weight:600;}

  .cprev{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}

  .cmeta{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}

  .ctime{font-size:10px;color:var(--muted);}

  .ubadge{background:var(--accent);color:#000;font-size:10px;font-weight:700;border-radius:10px;padding:1px 6px;}

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

  /* ── НОВІ СТИЛІ ЕТАП 3 ── */

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

  /* Модалка додавання тренування */
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

`;

const feedData=[
  {id:1,user:"Олексій К.",ini:"ОК",col:"#ff6b35",time:"2 год тому",badge:"🔥 PR",btype:"fire",dur:"72хв",vol:"8.4т",sets:"24",exs:[{n:"Присідання",s:"5×5",pr:true,w:"130кг"},{n:"Жим лежачи",s:"4×8",pr:false,w:"95кг"},{n:"Тяга сумо",s:"3×6",pr:false,w:"160кг"}],likes:18,comments:4},
  {id:2,user:"Марина В.",ini:"МВ",col:"#7c3aed",time:"5 год тому",badge:"Chest Day",btype:"",dur:"55хв",vol:"5.1т",sets:"18",exs:[{n:"Жим гантелей",s:"4×10",pr:false,w:"24кг"},{n:"Кросовер",s:"3×15",pr:false,w:"15кг"},{n:"Відмикання",s:"4×12",pr:true,w:"BW+10"}],likes:31,comments:7},
];

const wdays=["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];
const bars=[40,70,55,90,65,30,0];

const wplan={
  "Пн":{t:"ГРУДИ / ТРИЦЕПС",m:"Push",ex:[{n:"Жим штанги лежачи",s:"4×8-10",d:"відпочинок 2хв"},{n:"Жим гантелей під кутом",s:"3×10-12",d:"відпочинок 90сек"},{n:"Кросовер",s:"3×15",d:"відпочинок 60сек"},{n:"Французький жим",s:"3×12",d:"відпочинок 90сек"}]},
  "Вт":{t:"СПИНА / БІЦЕПС",m:"Pull",ex:[{n:"Підтягування",s:"4×max",d:"відпочинок 2хв"},{n:"Тяга штанги в нахилі",s:"4×8",d:"відпочинок 2хв"},{n:"Тяга верхнього блоку",s:"3×12",d:"відпочинок 90сек"},{n:"Підйом на біцепс",s:"4×10",d:"відпочинок 90сек"}]},
  "Ср":{t:"ВІДПОЧИНОК",m:"Rest",ex:[]},
  "Чт":{t:"НОГИ",m:"Legs",ex:[{n:"Присідання зі штангою",s:"5×5",d:"відпочинок 3хв"},{n:"Жим ногами",s:"4×10",d:"відпочинок 2хв"},{n:"Румунська тяга",s:"3×10",d:"відпочинок 2хв"},{n:"Розгинання ніг",s:"3×15",d:"відпочинок 60сек"}]},
  "Пт":{t:"ПЛЕЧІ / ПРЕС",m:"Shoulders",ex:[{n:"Жим гантелей сидячи",s:"4×10",d:"відпочинок 2хв"},{n:"Розведення в сторони",s:"3×15",d:"відпочинок 60сек"},{n:"Планка",s:"3×60сек",d:"відпочинок 60сек"},{n:"Скручування",s:"3×20",d:"відпочинок 45сек"}]},
  "Сб":{t:"КАРДІО",m:"Cardio",ex:[]},
  "Нд":{t:"ВІДПОЧИНОК",m:"Rest",ex:[]},
};

const chatsData=[
  {id:1,name:"Олексій К.",ini:"ОК",col:"#ff6b35",online:true,prev:"Братан, який протеїн береш?",time:"10хв",unread:2},
  {id:2,name:"Марина В.",ini:"МВ",col:"#7c3aed",online:true,prev:"Красиво відпрацювала 🔥",time:"1год",unread:0},
  {id:3,name:"Сергій Т.",ini:"СТ",col:"#0ea5e9",online:false,prev:"Завтра ноги, йдеш?",time:"3год",unread:1},
  {id:4,name:"Аня Л.",ini:"АЛ",col:"#d946ef",online:true,prev:"Дякую за пораду!",time:"вчора",unread:0},
];

const initMsgs={1:[{id:1,from:"th",text:"Привіт! Бачив твій рекорд 💪",time:"10:32"},{id:2,from:"me",text:"Дякую! Довго йшов до цього)",time:"10:33"},{id:3,from:"th",text:"Братан, який протеїн береш?",time:"10:35"}],2:[],3:[{id:1,from:"th",text:"Завтра ноги, йдеш?",time:"вчора"}],4:[]};

const peopleRecs={near:[{id:10,name:"Вася Ковальчук",ini:"ВК",col:"#0ea5e9",gym:"FitLife Gym · 0.3км",sub:"Пауерліфтинг · 2 роки",match:"near",mlbl:"📍 Ваш зал",w:58,sq:"120кг",bn:"85кг"},{id:11,name:"Таня Мороз",ini:"ТМ",col:"#d946ef",gym:"FitLife Gym · 0.3км",sub:"Фітнес · 1.5 роки",match:"near",mlbl:"📍 Ваш зал",w:72,sq:"60кг",bn:"40кг"}],similar:[{id:13,name:"Данило Береза",ini:"ДБ",col:"#10b981",gym:"CrossFit Arena · 2км",sub:"Пауерліфтинг · 3 роки",match:"sim",mlbl:"94% схожість",w:84,sq:"125кг",bn:"92кг"},{id:14,name:"Льоша Савченко",ini:"ЛС",col:"#ef4444",gym:"Iron Zone · 3км",sub:"Силовий · 2.5 роки",match:"sim",mlbl:"89% схожість",w:76,sq:"135кг",bn:"95кг"}]};

const allTrainers=[
  {id:1,name:"Андрій Кравченко",ini:"АК",col:"#ff6b35",spec:"Пауерліфтинг",loc:"Київ · Офлайн",gender:"Чоловік",sport:"Пауерліфтинг",format:"Офлайн",price:800,rating:4.9,reviews:127,exp:"7 років",clients:43,tags:["Силовий тренінг","Техніка","Змагання"],online:true},
  {id:2,name:"Олена Шевченко",ini:"ОШ",col:"#d946ef",spec:"Фітнес / Схуднення",loc:"Київ · Онлайн",gender:"Жінка",sport:"Фітнес",format:"Онлайн",price:600,rating:4.8,reviews:89,exp:"5 років",clients:61,tags:["Схуднення","Харчування","Онлайн"],online:true},
  {id:3,name:"Катя Ліщенко",ini:"КЛ",col:"#10b981",spec:"CrossFit",loc:"Львів · Офлайн",gender:"Жінка",sport:"CrossFit",format:"Офлайн",price:550,rating:4.9,reviews:203,exp:"4 роки",clients:78,tags:["CrossFit","Витривалість","Групові"],online:true},
];

const shopCats=["Всі","Протеїн","Амінокислоти","Вітаміни","Одяг","Обладнання"];

const allProducts=[
  {id:1,cat:"Протеїн",emoji:"🥛",brand:"MyProtein",name:"Impact Whey 2.5кг",price:1490,oldPrice:1890,discount:21},
  {id:2,cat:"Протеїн",emoji:"🍫",brand:"Optimum",name:"Gold Standard 2кг",price:1890,oldPrice:null,discount:null},
  {id:3,cat:"Амінокислоти",emoji:"⚡",brand:"BPI Sports",name:"Best BCAA 300г",price:690,oldPrice:890,discount:22},
  {id:4,cat:"Вітаміни",emoji:"💊",brand:"Now Foods",name:"Omega-3 180 капсул",price:520,oldPrice:null,discount:null},
  {id:5,cat:"Одяг",emoji:"👕",brand:"Nike",name:"Dri-FIT футболка",price:980,oldPrice:1400,discount:30},
  {id:6,cat:"Обладнання",emoji:"🏋️",brand:"Harbinger",name:"Атлетичний пояс",price:1200,oldPrice:null,discount:null},
];

// ── ДОПОМІЖНА ФУНКЦІЯ: форматування дати ──
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("uk-UA", { day: "numeric", month: "short", year: "numeric" });
}

export default function IronCrew({ user }) {
  const [tab,setTab]=useState("feed");
  const [aday,setAday]=useState("Пн");
  const [period,setPeriod]=useState("Тиждень");
  const [likes,setLikes]=useState({1:false,2:false});
  const [lcount,setLcount]=useState({1:18,2:31});
  const [checked,setChecked]=useState({});
  const [openChat,setOpenChat]=useState(null);
  const [msgs,setMsgs]=useState(initMsgs);
  const [inp,setInp]=useState("");
  const [findTab,setFindTab]=useState("people");
  const [recSub,setRecSub]=useState("near");
  const [followed,setFollowed]=useState({});
  const [fGender,setFGender]=useState("Всі");
  const [fFormat,setFFormat]=useState("Всі");
  const [shopCat,setShopCat]=useState("Всі");
  const [profile,setProfile]=useState(null);
  const [workouts,setWorkouts]=useState([]);
  const [editProfile,setEditProfile]=useState(false);
  const [editName,setEditName]=useState("");
  const [editGym,setEditGym]=useState("");
  const [editCity,setEditCity]=useState("");
  const [cart,setCart]=useState({});

  // ── НОВІ СТАНИ ЕТАП 3 ──
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [newExInput, setNewExInput] = useState("");
  const [newExList, setNewExList] = useState([]);
  const [savingWorkout, setSavingWorkout] = useState(false);

  const endRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,openChat]);

  useEffect(()=>{
    if(user){
      supabase.from("profiles").select("*").eq("user_id",user.id).single().then(({data})=>{if(data)setProfile(data);});
    }
  },[user]);

  useEffect(()=>{
    if(user){
      supabase.from("workouts").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).then(({data})=>{if(data)setWorkouts(data);});
    }
  },[user]);

  // ── ФУНКЦІЯ: додати вправу до списку ──
  const addExercise = () => {
    const trimmed = newExInput.trim();
    if (!trimmed) return;
    setNewExList(prev => [...prev, trimmed]);
    setNewExInput("");
  };

  // ── ФУНКЦІЯ: зберегти тренування в Supabase ──
  const saveWorkout = async () => {
    if (!newTitle.trim()) return;
    setSavingWorkout(true);
    const workout = {
      user_id: user.id,
      title: newTitle.trim(),
      duration: newDuration ? parseInt(newDuration) : null,
      volume: newVolume ? parseFloat(newVolume) : null,
      exercises: newExList,
    };
    const { data, error } = await supabase.from("workouts").insert([workout]).select();
    if (!error && data) {
      setWorkouts(prev => [data[0], ...prev]);
    }
    // Скидаємо форму
    setNewTitle("");
    setNewDuration("");
    setNewVolume("");
    setNewExList([]);
    setNewExInput("");
    setShowAddWorkout(false);
    setSavingWorkout(false);
  };

  const sendMsg=()=>{
    if(!inp.trim()||!openChat)return;
    const m={id:Date.now(),from:"me",text:inp.trim(),time:new Date().toLocaleTimeString('uk',{hour:'2-digit',minute:'2-digit'})};
    setMsgs(prev=>({...prev,[openChat.id]:[...(prev[openChat.id]||[]),m]}));
    setInp("");
  };

  const openChatWith=(p)=>{
    const c=chatsData.find(x=>x.id===p.id)||{id:p.id,name:p.name,ini:p.ini,col:p.col,online:true};
    setOpenChat(c);setTab("chat");
  };

  const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);

  const filteredTrainers=allTrainers.filter(t=>{
    if(fGender!=="Всі"&&t.gender!==fGender)return false;
    if(fFormat!=="Всі"&&t.format!==fFormat)return false;
    return true;
  });

  const filteredProducts=shopCat==="Всі"?allProducts:allProducts.filter(p=>p.cat===shopCat);
  const plan=wplan[aday];

  if(openChat){
    const chatMsgs=msgs[openChat.id]||[];
    return(<><style>{css}</style>
      <div className="app"><div className="cwin">
        <div className="cwh">
          <div className="backbtn" onClick={()=>setOpenChat(null)}>←</div>
          <div className="cwava" style={{background:openChat.col,color:"#fff"}}>{openChat.ini}{openChat.online&&<div className="odot"/>}</div>
          <div style={{flex:1}}><div className="cwname">{openChat.name}</div><div className="cwst">● онлайн</div></div>
        </div>
        <div className="msgs">
          {chatMsgs.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:40}}>Почни розмову 💬</div>}
          {chatMsgs.map(m=>(
            <div key={m.id} className={`mrow${m.from==="me"?" me":""}`}>
              {m.from==="th"&&<div className="mava" style={{background:openChat.col,color:"#fff"}}>{openChat.ini[0]}</div>}
              <div><div className={`mbub${m.from==="me"?" my":" th"}`}>{m.text}</div><div className="mt" style={{textAlign:m.from==="me"?"right":"left"}}>{m.time}</div></div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div className="cinrow">
          <input className="cinput" placeholder="Написати..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
          <button className="sendbtn" onClick={sendMsg}>↑</button>
        </div>
      </div></div>
    </>);
  }

  return(<><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="logo">IRON<span>CREW</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {tab==="find"&&findTab==="shop"&&<div className="icon-btn" style={{position:"relative"}}>🛒{cartCount>0&&<span className="cart-badge">{cartCount}</span>}</div>}
          <div className="icon-btn">🔔<div className="ndot"/></div>
          <div className="ava-sm">ДМ</div>
        </div>
      </div>

      <div className="scroll">

        {tab==="feed"&&(<>
          <div className="stories">
            {[{e:"💪",n:"Олексій",s:false},{e:"🏋️",n:"Марина",s:false},{e:"🔥",n:"Сергій",s:true},{e:"⚡",n:"Аня",s:false},{e:"🎯",n:"Дмитро",s:true}].map((x,i)=>(
              <div className="story" key={i}><div className={`sring${x.s?" seen":""}`}><div className="sinner">{x.e}</div></div><span className="sname">{x.n}</span></div>
            ))}
          </div>
          <div className="stitle">СТРІЧКА <span>АКТИВНОСТІ</span></div>
          {feedData.map((p,pi)=>(
            <div className="fcard" key={p.id} style={{animationDelay:`${pi*0.08}s`}}>
              <div className="fhead">
                <div className="uava" style={{background:p.col,color:"#fff"}}>{p.ini}</div>
                <div style={{flex:1}}><div className="uname">{p.user}</div><div className="utime">{p.time}</div></div>
                <div className={`badge${p.btype==="fire"?" fire":""}`}>{p.badge}</div>
              </div>
              <div className="wsum">
                <div className="sc"><div className="sv">{p.dur}</div><div className="sl">ТРИВАЛІСТЬ</div></div>
                <div className="sc"><div className="sv">{p.vol}</div><div className="sl">ОБСЯГ</div></div>
                <div className="sc"><div className="sv">{p.sets}</div><div className="sl">ПІДХОДИ</div></div>
              </div>
              <div className="exlist">{p.exs.map((ex,i)=>(
                <div className="exrow" key={i}><span style={{fontWeight:500}}>{ex.n}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>{ex.pr&&<span className="pr-tag">PR</span>}<span style={{color:"var(--muted)",fontSize:12}}>{ex.s} · {ex.w}</span></div>
                </div>
              ))}</div>
              <div className="factions">
                <button className={`abtn${likes[p.id]?" liked":""}`} onClick={()=>{setLikes(l=>({...l,[p.id]:!l[p.id]}));setLcount(c=>({...c,[p.id]:c[p.id]+(likes[p.id]?-1:1)}));}}>{likes[p.id]?"🔥":"🤍"} {lcount[p.id]}</button>
                <button className="abtn">💬 {p.comments}</button>
                <div className="sp"/>
                <button className="abtn" onClick={()=>openChatWith({id:p.id,name:p.user,ini:p.ini,col:p.col})}>✉️</button>
              </div>
            </div>
          ))}
        </>)}

        {tab==="workout"&&(<>
          <div className="stitle">МОЯ <span>ПРОГРАМА</span></div>
          <div className="sub">Тижневий план тренувань</div>
          <div className="dtabs">{wdays.map(d=><button key={d} className={`dtab${aday===d?" on":""}`} onClick={()=>setAday(d)}>{d}</button>)}</div>
          {plan.ex.length>0?(<>
            <div className="wcard">
              <div className="wch"><div className="wct">{plan.t}</div><div className="mtag">{plan.m}</div></div>
              {plan.ex.map((ex,i)=>{const k=`${aday}-${i}`;const done=checked[k];return(
                <div className="exi" key={i}>
                  <div className="enum">{i+1}</div>
                  <div className="exinf"><div className="exn" style={{color:done?"var(--muted)":"var(--text)",textDecoration:done?"line-through":"none"}}>{ex.n}</div><div className="exd">{ex.s} · {ex.d}</div></div>
                  <button className={`cbtn${done?" done":""}`} onClick={()=>setChecked(c=>({...c,[k]:!c[k]}))}>{done?"✓":""}</button>
                </div>
              );})}
            </div>
            <button className="sbtn">▶ ПОЧАТИ ТРЕНУВАННЯ</button>
          </>):(<div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}><div style={{fontSize:48,marginBottom:12}}>😴</div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22}}>{plan.t}</div></div>)}
        </>)}

        {tab==="progress"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="stitle" style={{marginBottom:0}}>МІЙ <span>ПРОГРЕС</span></div>
            <div style={{display:"flex",gap:4,background:"var(--surface)",borderRadius:10,padding:3,border:"1px solid var(--border)"}}>
              {["Тиждень","Місяць"].map(p=><button key={p} onClick={()=>setPeriod(p)} style={{padding:"5px 12px",borderRadius:7,border:"none",background:period===p?"var(--accent)":"none",color:period===p?"#000":"var(--muted)",fontSize:12,fontWeight:period===p?700:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{p}</button>)}
            </div>
          </div>
          <div className="pgrid">
            <div className="pcard"><div className="pval">6</div><div className="plbl">Тренувань</div><div className="pchg">↑ +1</div></div>
            <div className="pcard"><div className="pval">42т</div><div className="plbl">Загальний обсяг</div><div className="pchg">↑ +8%</div></div>
            <div className="pcard"><div className="pval">7.2</div><div className="plbl">Год у залі</div><div className="pchg">↑ +0.5</div></div>
            <div className="pcard"><div className="pval">3</div><div className="plbl">Нових рекордів</div><div className="pchg" style={{color:"var(--accent2)"}}>🔥 PR!</div></div>
          </div>
          <div className="bcc">
            <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Обсяг по днях (кг)</div>
            <div className="bchart">{wdays.map((d,i)=><div className="bcol" key={d}><div className={`bar${i===3?" hi":""}`} style={{height:bars[i]}}/><div className="bday">{d}</div></div>)}</div>
          </div>
          <div className="stitle" style={{marginBottom:12}}>ОСОБИСТІ <span>РЕКОРДИ</span></div>
          <div className="prlist">
            {[{ic:"🏋️",n:"Присідання",d:"8 трав",v:"130",u:"кг"},{ic:"💪",n:"Жим лежачи",d:"5 трав",v:"100",u:"кг"},{ic:"⚡",n:"Станова тяга",d:"1 трав",v:"160",u:"кг"},{ic:"🤸",n:"Підтягування",d:"3 трав",v:"18",u:"разів"}].map((pr,i)=>(
              <div className="prcard" key={i}><div className="pricon">{pr.ic}</div><div className="prinfo"><div className="prn">{pr.n}</div><div className="prd">{pr.d}</div></div><div><div className="prv">{pr.v}</div><div className="pru">{pr.u}</div></div></div>
            ))}
          </div>
        </>)}

        {tab==="find"&&(<>
          <div className="stitle">ЗНАЙТИ</div>
          <div className="ftabs">
            {[{id:"people",l:"👥 Люди"},{id:"trainers",l:"🎯 Тренери"},{id:"shop",l:"🛍 Магазин"}].map(ft=>(
              <button key={ft.id} className={`ftab${findTab===ft.id?" on":""}`} onClick={()=>setFindTab(ft.id)}>{ft.l}</button>
            ))}
          </div>
          {findTab==="people"&&(<>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[{id:"near",l:"📍 Поруч"},{id:"similar",l:"🎯 Схожий прогрес"}].map(s=>(
                <button key={s.id} className={`ftab${recSub===s.id?" on":""}`} style={{flex:1}} onClick={()=>setRecSub(s.id)}>{s.l}</button>
              ))}
            </div>
            {peopleRecs[recSub].map((rec,i)=>(
              <div className="rcard" key={rec.id} style={{animationDelay:`${i*0.07}s`}}>
                <div className="rtop"><div className="rava" style={{background:rec.col,color:"#fff"}}>{rec.ini}</div><div><div className="rn">{rec.name}</div><div className="rs">{rec.sub}</div><div className={`mpill ${rec.match}`}>{rec.mlbl}</div></div></div>
                <div className="gym-badge">🏢 {rec.gym}</div>
                <div className="rstats">
                  <div className="rst"><div className="rstv">{rec.w}</div><div className="rstl">ТРЕНУВАНЬ</div></div>
                  <div className="rst"><div className="rstv">{rec.sq}</div><div className="rstl">ПРИСІД</div></div>
                  <div className="rst"><div className="rstv">{rec.bn}</div><div className="rstl">ЖИМ</div></div>
                </div>
                <div className="ract">
                  <button className="rbtn" onClick={()=>openChatWith(rec)}>💬 Написати</button>
                  <button className={`rbtn${followed[rec.id]?"":" pri"}`} onClick={()=>setFollowed(f=>({...f,[rec.id]:!f[rec.id]}))}>
                    {followed[rec.id]?"✓ Підписаний":"+ Підписатись"}
                  </button>
                </div>
              </div>
            ))}
          </>)}
          {findTab==="trainers"&&(<>
            <div className="filter-bar">
              <div className="filter-row">
                <span style={{fontSize:11,color:"var(--muted)",alignSelf:"center",marginRight:4}}>Стать:</span>
                {["Всі","Чоловік","Жінка"].map(g=><button key={g} className={`fpill${fGender===g?" on":""}`} onClick={()=>setFGender(g)}>{g}</button>)}
              </div>
              <div className="filter-row">
                <span style={{fontSize:11,color:"var(--muted)",alignSelf:"center",marginRight:4}}>Формат:</span>
                {["Всі","Онлайн","Офлайн"].map(f=><button key={f} className={`fpill${fFormat===f?" on":""}`} onClick={()=>setFFormat(f)}>{f}</button>)}
              </div>
            </div>
            {filteredTrainers.map((tr,i)=>(
              <div className="tcard" key={tr.id} style={{animationDelay:`${i*0.07}s`}}>
                <div className="thead-row">
                  <div className="tava" style={{background:tr.col,color:"#fff"}}>{tr.ini}{tr.online&&<div className="tonline"/>}</div>
                  <div className="tinfo"><div className="tname">{tr.name}</div><div className="tspec">{tr.spec}</div><div className="tloc">📍 {tr.loc}</div>
                    <div className="trating"><span className="tstars">★★★★★</span><span>{tr.rating}</span><span style={{color:"var(--muted)",fontWeight:400}}>({tr.reviews})</span></div>
                  </div>
                </div>
                <div className="ttags">{tr.tags.map((tg,j)=><span key={j} className={`ttag${j===0?" orange":j===1?" green":""}`}>{tg}</span>)}<span className="ttag">{tr.exp}</span></div>
                <div className="tprice-row"><div className="tprice">{tr.price} ₴<span style={{fontSize:12,color:"var(--muted)",fontFamily:"'DM Sans',sans-serif",fontWeight:400}}> / год</span></div></div>
                <div className="tacts">
                  <button className="tbtn" onClick={()=>openChatWith({id:tr.id+100,name:tr.name,ini:tr.ini,col:tr.col})}>💬 Написати</button>
                  <button className="tbtn pri">📅 Записатись</button>
                </div>
              </div>
            ))}
          </>)}
          {findTab==="shop"&&(<>
            <div className="shop-cats">{shopCats.map(c=><button key={c} className={`scat${shopCat===c?" on":""}`} onClick={()=>setShopCat(c)}>{c}</button>)}</div>
            <div className="sgrid">{filteredProducts.map((p,i)=>(
              <div className="sprod" key={p.id} style={{animationDelay:`${i*0.05}s`}}>
                <div className="simg">{p.emoji}</div>
                <div className="sinfo">
                  <div className="sbrand">{p.brand}</div>
                  <div className="sprodn">{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",marginTop:6}}>
                    <span className="sprice">{p.price}₴</span>
                    {p.oldPrice&&<><span className="sold-price">{p.oldPrice}₴</span><span className="sdiscount">-{p.discount}%</span></>}
                  </div>
                  <button className={`saddbtn${cart[p.id]?" added":""}`} onClick={()=>setCart(c=>({...c,[p.id]:(c[p.id]||0)+1}))}>
                    {cart[p.id]?`✓ В кошику (${cart[p.id]})`:"+ Додати"}
                  </button>
                </div>
              </div>
            ))}</div>
          </>)}
        </>)}

        {tab==="chat"&&(<>
          <div className="stitle">ПОВІДОМЛЕННЯ</div>
          <div className="sbar"><span style={{fontSize:16,color:"var(--muted)"}}>🔍</span><input placeholder="Пошук..."/></div>
          {chatsData.map(c=>(
            <div key={c.id} className="citem" onClick={()=>setOpenChat(c)}>
              <div className="cava" style={{background:c.col,color:"#fff"}}>{c.ini}{c.online&&<div className="odot"/>}</div>
              <div className="cinf"><div className="cname">{c.name}</div><div className="cprev">{c.prev}</div></div>
              <div className="cmeta"><div className="ctime">{c.time}</div>{c.unread>0&&<div className="ubadge">{c.unread}</div>}</div>
            </div>
          ))}
        </>)}

        {tab==="profile"&&(<>
          {/* ── АВАТАР І ІМ'Я ── */}
          <div className="pava">{profile?.name?.slice(0,2).toUpperCase()||"IC"}</div>
          <div className="pname">{profile?.name||user?.email||"Профіль"}</div>
          <div className="pbio">{profile?.gym||""}{profile?.city?` · ${profile.city}`:""}</div>

          {/* ── СТАТИСТИКА: тепер workouts.length — реальне число ── */}
          <div className="pstats">
            <div className="pst">
              <div className="pstv">{workouts.length}</div>
              <div className="pstl">Тренувань</div>
            </div>
            <div className="pst"><div className="pstv">142</div><div className="pstl">Підписники</div></div>
            <div className="pst"><div className="pstv">38</div><div className="pstl">Підписки</div></div>
          </div>

          <button className="epbtn" onClick={()=>{setEditName(profile?.name||"");setEditGym(profile?.gym||"");setEditCity(profile?.city||"");setEditProfile(true);}}>✏️ Редагувати профіль</button>

          {/* ── КНОПКА ДОДАТИ ТРЕНУВАННЯ ── */}
          <button className="add-workout-btn" onClick={()=>setShowAddWorkout(true)}>
            <span style={{fontSize:20}}>+</span> Додати тренування
          </button>

          {/* ── СПИСОК ТРЕНУВАНЬ ── */}
          <div className="stitle" style={{marginBottom:12}}>ОСТАННІ <span>ТРЕНУВАННЯ</span></div>

          {workouts.length === 0 ? (
            <div className="empty-workouts">
              <div className="big-icon">🏋️</div>
              <p>Ще немає тренувань.<br/>Натисни «Додати тренування»!</p>
            </div>
          ) : (
            workouts.map((w, i) => (
              <div className="wlog-card" key={w.id} style={{animationDelay:`${i*0.07}s`}}>
                <div className="wlog-title">{w.title}</div>
                <div className="wlog-meta">
                  {w.duration && <div className="wlog-chip">⏱ <span>{w.duration} хв</span></div>}
                  {w.volume   && <div className="wlog-chip">🏋️ <span>{w.volume} т</span></div>}
                  {Array.isArray(w.exercises) && w.exercises.length > 0 &&
                    <div className="wlog-chip">📋 <span>{w.exercises.length} вправ</span></div>
                  }
                </div>
                {Array.isArray(w.exercises) && w.exercises.length > 0 && (
                  <div className="wlog-exlist">
                    {w.exercises.map((ex, j) => (
                      <div className="wlog-exrow" key={j}><span>{ex}</span></div>
                    ))}
                  </div>
                )}
                <div className="wlog-date">📅 {formatDate(w.created_at)}</div>
              </div>
            ))
          )}
        </>)}

        {/* ── МОДАЛКА РЕДАГУВАННЯ ПРОФІЛЮ ── */}
        {editProfile&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#141414",border:"1px solid #2a2a2a",padding:28,width:320,borderRadius:12}}><div style={{fontSize:16,fontWeight:700,color:"#f0f0f0",marginBottom:20}}>Редагувати профіль</div><div style={{marginBottom:12}}><div style={{fontSize:11,color:"#666",marginBottom:4}}>ІМ'Я</div><input value={editName} onChange={e=>setEditName(e.target.value)} style={{width:"100%",background:"#0a0a0a",border:"1px solid #2a2a2a",color:"#f0f0f0",padding:"10px 12px",fontSize:14,boxSizing:"border-box"}}/></div><div style={{marginBottom:12}}><div style={{fontSize:11,color:"#666",marginBottom:4}}>ЗАЛ</div><input value={editGym} onChange={e=>setEditGym(e.target.value)} style={{width:"100%",background:"#0a0a0a",border:"1px solid #2a2a2a",color:"#f0f0f0",padding:"10px 12px",fontSize:14,boxSizing:"border-box"}}/></div><div style={{marginBottom:20}}><div style={{fontSize:11,color:"#666",marginBottom:4}}>МІСТО</div><input value={editCity} onChange={e=>setEditCity(e.target.value)} style={{width:"100%",background:"#0a0a0a",border:"1px solid #2a2a2a",color:"#f0f0f0",padding:"10px 12px",fontSize:14,boxSizing:"border-box"}}/></div><div style={{display:"flex",gap:8}}><button onClick={()=>setEditProfile(false)} style={{flex:1,padding:12,background:"#1c1c1c",border:"1px solid #2a2a2a",color:"#666",cursor:"pointer"}}>Скасувати</button><button onClick={async()=>{await supabase.from("profiles").upsert({user_id:user.id,name:editName,gym:editGym,city:editCity});setProfile({...profile,name:editName,gym:editGym,city:editCity});setEditProfile(false);}} style={{flex:1,padding:12,background:"#e8ff47",border:"none",color:"#000",fontWeight:700,cursor:"pointer"}}>Зберегти</button></div></div></div>)}

        {/* ── МОДАЛКА ДОДАВАННЯ ТРЕНУВАННЯ (НОВА) ── */}
        {showAddWorkout && (
          <div className="modal-overlay" onClick={(e)=>{if(e.target.className==="modal-overlay")setShowAddWorkout(false);}}>
            <div className="modal-sheet">
              <div className="modal-handle"/>
              <div className="modal-title">НОВЕ <span>ТРЕНУВАННЯ</span></div>

              <div className="field-label">Назва тренування *</div>
              <input
                className="field-input"
                placeholder="Наприклад: Груди / Трицепс"
                value={newTitle}
                onChange={e=>setNewTitle(e.target.value)}
              />

              <div className="field-row">
                <div>
                  <div className="field-label">Тривалість (хв)</div>
                  <input
                    className="field-input"
                    type="number"
                    placeholder="60"
                    value={newDuration}
                    onChange={e=>setNewDuration(e.target.value)}
                  />
                </div>
                <div>
                  <div className="field-label">Обсяг (тонни)</div>
                  <input
                    className="field-input"
                    type="number"
                    step="0.1"
                    placeholder="5.4"
                    value={newVolume}
                    onChange={e=>setNewVolume(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-label">Вправи</div>
              <div className="ex-add-row">
                <input
                  className="field-input"
                  placeholder="Назва вправи (наприклад: Жим лежачи 4×8)"
                  value={newExInput}
                  onChange={e=>setNewExInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addExercise()}
                />
                <button onClick={addExercise}>+</button>
              </div>

              {newExList.length > 0 && (
                <div className="ex-added-list">
                  {newExList.map((ex, i) => (
                    <div className="ex-added-item" key={i}>
                      <span>{ex}</span>
                      <button className="ex-remove" onClick={()=>setNewExList(prev=>prev.filter((_,j)=>j!==i))}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="save-workout-btn"
                disabled={!newTitle.trim() || savingWorkout}
                onClick={saveWorkout}
              >
                {savingWorkout ? "ЗБЕРЕЖЕННЯ..." : "💾 ЗБЕРЕГТИ ТРЕНУВАННЯ"}
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="bottomnav">
        {[{id:"feed",ic:"🏠",l:"Стрічка"},{id:"workout",ic:"📋",l:"Програма"},{id:"progress",ic:"📈",l:"Прогрес"},{id:"find",ic:"🔍",l:"Знайти"},{id:"chat",ic:"💬",l:"Чат",b:true},{id:"profile",ic:"👤",l:"Профіль"}].map(n=>(
          <button key={n.id} className={`ni${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>
            <span className="ni-icon">{n.ic}{n.b&&tab!==n.id&&<span className="nbdot"/>}</span>{n.l}
          </button>
        ))}
      </div>
    </div>
  </>);
}
