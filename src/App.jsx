import { useState, useEffect } from "react";

const C = {
  bg: "#06080D", bg2: "#0C1018", sf: "#111620", sf2: "#171E2C",
  bd: "#1C2537", bdH: "#2A3650",
  ac: "#00D4FF", acD: "rgba(0,212,255,0.08)", acM: "rgba(0,212,255,0.2)",
  gn: "#00E68A", gnD: "rgba(0,230,138,0.1)",
  am: "#FFB020", amD: "rgba(255,176,32,0.1)",
  rd: "#FF4D6A", pu: "#9B6DFF", puD: "rgba(155,109,255,0.12)",
  t: "#E8ECF4", tM: "#8C95A8", tD: "#5A6478",
};
const F = "'Söhne',-apple-system,sans-serif";
const M = "'Geist Mono','SF Mono',monospace";

const APIS = [
  { id:"io.github.chetparker/uk-data-api", name:"UK Data API", by:"chetparker", tag:"Property, weather, companies, vehicles, finance", desc:"24 UK data endpoints — Land Registry sold prices, rental yields, stamp duty, EPC, crime, flood risk, planning, council tax, weather, air quality, Companies House, DVLA, MOT, BoE rates, exchange rates, inflation, mortgage calculator. All paid per-request via x402.", ep:24, pr:"$0.001–0.002", net:"Base", cat:"Data", tags:["property","uk","government","companies","vehicles","finance"], st:"live", vf:true, ft:true, url:"https://web-production-18a32.up.railway.app", sse:"https://web-production-18a32.up.railway.app/mcp/sse", c:12847, r:284, up:99.7, ms:142 },
  { id:"demo/crypto-oracle", name:"Crypto Oracle", by:"defi_labs", tag:"Real-time prices, DEX liquidity, whale tracking", desc:"15 endpoints for crypto market intelligence — live prices, DEX pool data, on-chain whale movements, token sentiment, yield farm rates.", ep:15, pr:"$0.001–0.005", net:"Base", cat:"Finance", tags:["crypto","defi","prices"], st:"live", vf:true, ft:true, url:"https://crypto-oracle.example.com", sse:"https://crypto-oracle.example.com/mcp/sse", c:89400, r:1248, up:99.9, ms:67 },
  { id:"demo/weather-global", name:"Global Weather", by:"meteo_api", tag:"200K+ cities, 14-day forecasts, severe alerts", desc:"8 weather endpoints — current conditions, hourly/daily forecasts, historical data, severe weather alerts, marine conditions.", ep:8, pr:"$0.005–0.02", net:"Base", cat:"Weather", tags:["weather","forecast","climate"], st:"live", vf:false, ft:false, url:"https://weather-global.example.com", sse:"https://weather-global.example.com/mcp/sse", c:45200, r:687, up:99.8, ms:89 },
  { id:"demo/eu-compliance", name:"EU Compliance Check", by:"regtech_eu", tag:"GDPR, PSD2, MiCA regulatory checks", desc:"10 endpoints for European regulatory compliance — GDPR data processing, PSD2 payment validation, MiCA crypto compliance, sanctions screening.", ep:10, pr:"$0.01–0.05", net:"Base", cat:"Legal", tags:["compliance","gdpr","regulation"], st:"beta", vf:false, ft:false, url:"https://eu-compliance.example.com", sse:"https://eu-compliance.example.com/mcp/sse", c:3200, r:156, up:97.5, ms:280 },
  { id:"demo/geo-intel", name:"Geospatial Intel", by:"mapdata_io", tag:"Geocoding, isochrones, POI, demographics", desc:"12 geospatial endpoints — forward/reverse geocoding, travel isochrones, POI search, demographic profiles, boundary data.", ep:12, pr:"$0.002–0.01", net:"Base", cat:"Data", tags:["geo","maps","demographics"], st:"live", vf:true, ft:false, url:"https://geo-intel.example.com", sse:"https://geo-intel.example.com/mcp/sse", c:28100, r:412, up:99.6, ms:134 },
];

const CATS = ["All","Data","Finance","Weather","Legal"];

const Bd = ({children,color=C.ac,bg})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",borderRadius:100,fontSize:10,fontWeight:600,letterSpacing:"0.04em",color,background:bg||`${color}15`,fontFamily:M}}>{children}</span>;

const Mt = ({v,l,color=C.ac})=><div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color,fontFamily:M,lineHeight:1}}>{v}</div><div style={{fontSize:8,color:C.tD,marginTop:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div></div>;

const Card = ({a,onClick})=>{
  const[h,sH]=useState(false);
  return <div onClick={()=>onClick(a)} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{background:h?C.sf2:C.sf,border:`1px solid ${h?C.acM:C.bd}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",transition:"all 0.15s",transform:h?"translateY(-1px)":"none"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:700,color:C.t,fontFamily:F}}>{a.name}</h3>
          {a.ft&&<span style={{fontSize:10,color:C.am}}>★</span>}
        </div>
        <div style={{fontSize:11,color:C.tD}}>{a.by}</div>
      </div>
      <Bd color={a.st==="live"?C.gn:C.am} bg={a.st==="live"?C.gnD:C.amD}><span style={{width:5,height:5,borderRadius:"50%",background:"currentColor"}}/>{a.st}</Bd>
    </div>
    <p style={{margin:"4px 0 12px",fontSize:12,color:C.tM,lineHeight:1.5}}>{a.tag}</p>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
      {a.vf&&<Bd color={C.pu} bg={C.puD}>✓ verified</Bd>}
      <Bd color={C.ac}>{a.ep} tools</Bd>
      <Bd color={C.gn} bg={C.gnD}>{a.pr}</Bd>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",borderTop:`1px solid ${C.bd}`}}>
      <Mt v={a.c>1000?`${(a.c/1000).toFixed(1)}K`:a.c} l="30d calls"/>
      <Mt v={`$${a.r}`} l="revenue" color={C.gn}/>
      <Mt v={`${a.up}%`} l="uptime" color={a.up>99?C.gn:C.am}/>
      <Mt v={`${a.ms}ms`} l="p50" color={a.ms<150?C.gn:C.am}/>
    </div>
  </div>;
};

const Detail = ({a,onClose})=>{
  const[cp,sC]=useState(null);
  const copy=(t,k)=>{navigator.clipboard?.writeText(t);sC(k);setTimeout(()=>sC(null),1500)};
  if(!a)return null;
  const cfg=JSON.stringify({mcpServers:{[a.id.split("/")[1]||a.id]:{url:a.sse}}},null,2);
  return <div style={{position:"fixed",inset:0,zIndex:100,display:"flex"}}>
    <div style={{flex:1,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
    <div style={{width:"min(440px,92vw)",background:C.bg2,borderLeft:`1px solid ${C.bd}`,overflowY:"auto",padding:"22px 24px",animation:"sR .2s ease"}}>
      <style>{`@keyframes sR{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <button onClick={onClose} style={{float:"right",background:C.sf,border:`1px solid ${C.bd}`,color:C.tD,width:28,height:28,borderRadius:7,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          <Bd color={a.st==="live"?C.gn:C.am} bg={a.st==="live"?C.gnD:C.amD}><span style={{width:5,height:5,borderRadius:"50%",background:"currentColor"}}/>{a.st}</Bd>
          {a.vf&&<Bd color={C.pu} bg={C.puD}>✓ verified</Bd>}
        </div>
        <h2 style={{margin:"0 0 2px",fontSize:20,fontWeight:800,color:C.t}}>{a.name}</h2>
        <span style={{fontSize:12,color:C.tD}}>by <span style={{color:C.ac}}>{a.by}</span> · {a.net} · {a.ep} tools</span>
      </div>
      <p style={{fontSize:13,color:C.tM,lineHeight:1.6,margin:"0 0 18px"}}>{a.desc}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:20}}>
        {[{v:a.ep,l:"Tools",c:C.ac},{v:a.c>1000?`${(a.c/1000).toFixed(1)}K`:a.c,l:"Calls",c:C.ac},{v:`$${a.r}`,l:"Revenue",c:C.gn},{v:`${a.up}%`,l:"Uptime",c:a.up>99?C.gn:C.am}].map(m=>
          <div key={m.l} style={{background:C.sf,borderRadius:8,padding:"10px 6px",textAlign:"center"}}><Mt v={m.v} l={m.l} color={m.c}/></div>
        )}
      </div>
      <div style={{fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,fontWeight:600}}>Connect</div>
      {[{l:"SSE Endpoint",v:a.sse},{l:"Config",v:`${a.url}/mcp/config`},{l:"Registry ID",v:a.id}].map(i=>
        <div key={i.l} onClick={()=>copy(i.v,i.l)} style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:"8px 12px",marginBottom:6,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:9,color:C.tD,textTransform:"uppercase",marginBottom:2}}>{i.l}</div><div style={{fontSize:11,color:C.ac,fontFamily:M,wordBreak:"break-all"}}>{i.v}</div></div>
          <span style={{fontSize:10,color:cp===i.l?C.gn:C.tD,whiteSpace:"nowrap",marginLeft:8}}>{cp===i.l?"✓":"copy"}</span>
        </div>
      )}
      <div style={{fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",margin:"16px 0 8px",fontWeight:600}}>Claude Desktop Config</div>
      <div onClick={()=>copy(cfg,"cfg")} style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:12,cursor:"pointer",fontFamily:M,fontSize:11,color:C.t,lineHeight:1.5,whiteSpace:"pre"}}>
        {cfg}
        <div style={{textAlign:"right",fontSize:10,color:cp==="cfg"?C.gn:C.tD,marginTop:4}}>{cp==="cfg"?"✓ copied":"click to copy"}</div>
      </div>
      <div style={{fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",margin:"16px 0 8px",fontWeight:600}}>Payment</div>
      <div style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:12}}>
        {[["Protocol","x402"],["Network",a.net],["Price",a.pr],["Asset","USDC"]].map(([k,v])=>
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:12,color:C.tM}}>{k}</span><span style={{fontSize:12,color:C.ac,fontFamily:M,fontWeight:600}}>{v}</span></div>
        )}
      </div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:16}}>
        {a.tags.map(t=><span key={t} style={{padding:"3px 8px",borderRadius:100,fontSize:10,background:C.sf,color:C.tD,border:`1px solid ${C.bd}`}}>#{t}</span>)}
      </div>
    </div>
  </div>;
};

const RegModal = ({onClose})=>{
  const[step,sS]=useState(0);
  const[form,sF]=useState({name:"",repo:"",url:"",desc:"",wallet:"",net:"Base"});
  const u=(k,v)=>sF(p=>({...p,[k]:v}));
  const steps=["Details","Endpoints","Payment","Publish"];
  const Inp=({l,k,ph,ta})=><div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontWeight:600}}>{l}</label>
    {ta?<textarea rows={3} value={form[k]} onChange={e=>u(k,e.target.value)} placeholder={ph} style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:10,color:C.t,fontSize:13,resize:"vertical",outline:"none",fontFamily:F,boxSizing:"border-box"}}/>
    :<input value={form[k]} onChange={e=>u(k,e.target.value)} placeholder={ph} style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:"9px 11px",color:C.t,fontSize:13,outline:"none",fontFamily:F,boxSizing:"border-box"}}/>}
  </div>;
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:14,padding:"26px 28px",width:"min(480px,90vw)",maxHeight:"85vh",overflowY:"auto"}}>
      <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:800,color:C.t}}>List Your API</h2>
      <p style={{margin:"0 0 16px",fontSize:12,color:C.tD}}>Make your x402 API discoverable by every AI agent.</p>
      <div style={{display:"flex",gap:2,marginBottom:20}}>
        {steps.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}>
          <div style={{height:2,background:i<=step?C.ac:C.bd,borderRadius:1,marginBottom:5,transition:"background 0.2s"}}/>
          <span style={{fontSize:9,color:i<=step?C.ac:C.tD,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>{s}</span>
        </div>)}
      </div>
      {step===0&&<><Inp l="API Name" k="name" ph="e.g. UK Data API"/><Inp l="GitHub Repo" k="repo" ph="https://github.com/you/api"/><Inp l="Deployed URL" k="url" ph="https://your-api.up.railway.app"/><Inp l="Description" k="desc" ph="What does your API do?" ta/></>}
      {step===1&&<div><p style={{fontSize:12,color:C.tM,margin:"0 0 12px"}}>We auto-detect tools from your <span style={{color:C.ac,fontFamily:M}}>/mcp/config</span></p>
        <div style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:14}}>
          {["/sold-prices","/yield-estimate","/stamp-duty","/epc-rating","/crime-stats","/flood-risk"].map(e=><div key={e} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.bd}08`}}>
            <span style={{fontSize:12,color:C.ac,fontFamily:M}}>{e}</span><span style={{fontSize:12,color:C.gn,fontFamily:M}}>$0.001</span></div>)}
          <div style={{padding:"8px 0 0",fontSize:11,color:C.tD}}>+ 18 more from /mcp/config</div>
        </div></div>}
      {step===2&&<><Inp l="Wallet Address" k="wallet" ph="0x..."/>
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5,fontWeight:600}}>Network</label>
        <select value={form.net} onChange={e=>u("net",e.target.value)} style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:"9px 11px",color:C.t,fontSize:13,outline:"none"}}><option>Base</option><option>Base Sepolia</option></select></div>
        <div style={{background:C.acD,border:`1px solid ${C.acM}`,borderRadius:8,padding:12,fontSize:12,color:C.ac,lineHeight:1.5}}>No platform fees — you keep 100% of revenue via x402.</div></>}
      {step===3&&<div style={{textAlign:"center",padding:"14px 0"}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:C.gnD,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12}}>✓</div>
        <h3 style={{margin:"0 0 6px",fontSize:16,color:C.t}}>Ready to Publish</h3>
        <p style={{margin:"0 0 16px",fontSize:12,color:C.tM}}>Discoverable within minutes.</p>
        <div style={{background:C.sf,borderRadius:10,padding:14,textAlign:"left",border:`1px solid ${C.bd}`}}>
          {[["Official MCP Registry","auto-publish"],["x402 Marketplace","listed"],["mcp.so","submitted"],["PulseMCP","auto-ingested"]].map(([n,s])=>
            <div key={n} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}><span style={{fontSize:12,color:C.tM}}>{n}</span><span style={{fontSize:12,color:C.gn,fontFamily:M}}>✓ {s}</span></div>)}
        </div></div>}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
        <button onClick={()=>step>0?sS(step-1):onClose()} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.bd}`,background:"transparent",color:C.tM,fontSize:12,cursor:"pointer",fontFamily:F}}>{step===0?"Cancel":"Back"}</button>
        <button onClick={()=>step<3?sS(step+1):onClose()} style={{padding:"8px 20px",borderRadius:8,border:"none",background:step===3?C.gn:C.ac,color:C.bg,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:F}}>{step===3?"Publish":"Continue"}</button>
      </div>
    </div>
  </div>;
};

export default function App() {
  const[q,sQ]=useState("");
  const[cat,sC]=useState("All");
  const[sort,sS]=useState("calls");
  const[sel,sSel]=useState(null);
  const[reg,sR]=useState(false);
  const[rSt,sRS]=useState("checking");
  useEffect(()=>{fetch("https://registry.modelcontextprotocol.io/v0/servers?search=uk-data&limit=1").then(r=>r.json()).then(d=>{if(d.servers?.length)sRS("connected");else sRS("partial")}).catch(()=>sRS("offline"))},[]);
  const f=APIS.filter(a=>{const s=q.toLowerCase();return(!s||a.name.toLowerCase().includes(s)||a.tag.toLowerCase().includes(s)||a.tags.some(t=>t.includes(s)))&&(cat==="All"||a.cat===cat)}).sort((a,b)=>sort==="calls"?b.c-a.c:sort==="revenue"?b.r-a.r:b.up-a.up);
  const T={apis:APIS.length,tools:APIS.reduce((s,a)=>s+a.ep,0),calls:APIS.reduce((s,a)=>s+a.c,0),rev:APIS.reduce((s,a)=>s+a.r,0)};
  return <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F,position:"relative",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.ac} 0%,transparent 70%)`,opacity:0.03,top:-200,left:-100,pointerEvents:"none",filter:"blur(60px)"}}/>
    {/* Header */}
    <div style={{borderBottom:`1px solid ${C.bd}`,padding:"20px 24px 16px"}}>
      <div style={{maxWidth:1060,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8}}>
            <span style={{fontSize:22,fontWeight:800,color:C.ac,fontFamily:M}}>x402</span>
            <span style={{fontSize:17,fontWeight:300,color:C.tM}}>marketplace</span>
            <Bd color={rSt==="connected"?C.gn:C.am} bg={rSt==="connected"?C.gnD:C.amD}>registry {rSt}</Bd>
          </div>
          <button onClick={()=>sR(true)} style={{padding:"9px 18px",borderRadius:8,border:"none",cursor:"pointer",background:C.ac,color:C.bg,fontSize:12,fontWeight:700,fontFamily:F}}>+ List Your API</button>
        </div>
        <div style={{display:"flex",gap:24,marginBottom:14}}>
          {[{v:T.apis,l:"APIs",c:C.ac},{v:T.tools,l:"Tools",c:C.pu},{v:`${(T.calls/1000).toFixed(0)}K`,l:"30d Calls",c:C.gn},{v:`$${(T.rev/1000).toFixed(1)}K`,l:"Revenue",c:C.am}].map(s=><div key={s.l} style={{display:"flex",alignItems:"baseline",gap:5}}><span style={{fontSize:17,fontWeight:800,color:s.c,fontFamily:M}}>{s.v}</span><span style={{fontSize:10,color:C.tD,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</span></div>)}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200,position:"relative"}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.tD,fontSize:13}}>⌕</span>
            <input value={q} onChange={e=>sQ(e.target.value)} placeholder="Search APIs, tools, tags..." style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:8,padding:"8px 8px 8px 28px",color:C.t,fontSize:12,outline:"none",fontFamily:F,boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:3}}>
            {CATS.map(c=><button key={c} onClick={()=>sC(c)} style={{padding:"7px 11px",borderRadius:7,border:`1px solid ${cat===c?C.acM:C.bd}`,background:cat===c?C.acD:"transparent",color:cat===c?C.ac:C.tD,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>{c}</button>)}
          </div>
        </div>
      </div>
    </div>
    {/* Sort */}
    <div style={{maxWidth:1060,margin:"10px auto 0",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.tD}}>{f.length} API{f.length!==1&&"s"}</span>
      <div style={{display:"flex",gap:3}}>
        {[["calls","Most Used"],["revenue","Top Revenue"],["uptime","Best Uptime"]].map(([k,l])=><button key={k} onClick={()=>sS(k)} style={{padding:"4px 9px",borderRadius:6,border:"none",background:sort===k?C.acD:"transparent",color:sort===k?C.ac:C.tD,fontSize:10,cursor:"pointer",fontWeight:500,fontFamily:F}}>{l}</button>)}
      </div>
    </div>
    {/* Grid */}
    <div style={{maxWidth:1060,margin:"10px auto",padding:"0 24px 36px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:12}}>
      {f.map(a=><Card key={a.id} a={a} onClick={sSel}/>)}
      {!f.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 0"}}><p style={{fontSize:14,color:C.tD}}>No APIs found.</p><button onClick={()=>sR(true)} style={{marginTop:8,padding:"8px 16px",borderRadius:8,border:`1px solid ${C.ac}`,background:"transparent",color:C.ac,cursor:"pointer",fontSize:12}}>List yours →</button></div>}
    </div>
    {sel&&<Detail a={sel} onClose={()=>sSel(null)}/>}
    {reg&&<RegModal onClose={()=>sR(false)}/>}
  </div>;
}
