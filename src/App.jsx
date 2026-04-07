import ShaderBackground from "./ShaderBackground";
import { useState, useEffect } from "react";

const C = {
  bg:"#06080D",bg2:"#0C1018",sf:"#111620",sf2:"#171E2C",
  bd:"#1C2537",bdH:"#2A3650",
  ac:"#00D4FF",acD:"rgba(0,212,255,0.08)",acM:"rgba(0,212,255,0.2)",
  gn:"#00E68A",gnD:"rgba(0,230,138,0.1)",
  am:"#FFB020",amD:"rgba(255,176,32,0.1)",
  gold:"#F5C842",goldD:"rgba(245,200,66,0.08)",goldM:"rgba(245,200,66,0.25)",
  rd:"#FF4D6A",pu:"#9B6DFF",puD:"rgba(155,109,255,0.12)",
  t:"#E8ECF4",tM:"#8C95A8",tD:"#5A6478",
};
const F="'Söhne',-apple-system,sans-serif";
const M="'Geist Mono','SF Mono',monospace";

const APIS=[
  {id:"io.github.chetparker/uk-data-api",name:"UK Data API",by:"chetparker",tag:"Property, weather, companies, vehicles, finance — 24 UK government and public data endpoints in one MCP server.",desc:"24 UK data endpoints — Land Registry sold prices, rental yields, stamp duty, EPC, crime, flood risk, planning, council tax, weather, air quality, Companies House, DVLA, MOT, BoE rates, exchange rates, inflation, mortgage calculator. All paid per-request via x402.",ep:24,pr:"$0.001–0.002",net:"Base",cat:"Data",tags:["property","uk","government","companies","vehicles","finance"],st:"live",vf:true,ft:true,tier:"featured",url:"https://web-production-18a32.up.railway.app",sse:"https://web-production-18a32.up.railway.app/mcp/sse",c:12847,r:284,up:99.7,ms:142},
  {id:"demo/crypto-oracle",name:"Crypto Oracle",by:"defi_labs",tag:"Real-time token prices, DEX liquidity pools, whale wallet tracking, and on-chain sentiment analysis.",desc:"15 endpoints for crypto market intelligence — live prices for 10K+ tokens, DEX pool data with TVL, on-chain whale movements, token sentiment scores, yield farm APY rates.",ep:15,pr:"$0.001–0.005",net:"Base",cat:"Finance",tags:["crypto","defi","prices","analytics"],st:"live",vf:true,ft:true,tier:"featured",url:"https://crypto-oracle.example.com",sse:"https://crypto-oracle.example.com/mcp/sse",c:89400,r:1248,up:99.9,ms:67},
  {id:"demo/weather-global",name:"Global Weather",by:"meteo_api",tag:"Current conditions, 14-day forecasts, historical data, and severe weather alerts for 200K+ cities.",desc:"8 weather endpoints — current conditions, hourly/daily forecasts, historical data, severe weather alerts, marine conditions.",ep:8,pr:"$0.005–0.02",net:"Base",cat:"Weather",tags:["weather","forecast","climate","alerts"],st:"live",vf:true,ft:false,tier:"verified",url:"https://weather-global.example.com",sse:"https://weather-global.example.com/mcp/sse",c:45200,r:687,up:99.8,ms:89},
  {id:"demo/eu-compliance",name:"EU Compliance Check",by:"regtech_eu",tag:"GDPR data processing validation, PSD2 payment checks, MiCA crypto compliance, sanctions screening.",desc:"10 endpoints for European regulatory compliance — GDPR data processing checks, PSD2 payment validation, MiCA crypto compliance, sanctions screening.",ep:10,pr:"$0.01–0.05",net:"Base",cat:"Legal",tags:["compliance","gdpr","regulation","eu"],st:"beta",vf:false,ft:false,tier:"free",url:"https://eu-compliance.example.com",sse:"https://eu-compliance.example.com/mcp/sse",c:3200,r:156,up:97.5,ms:280},
  {id:"demo/geo-intel",name:"Geospatial Intel",by:"mapdata_io",tag:"Forward/reverse geocoding, travel isochrones, POI discovery, and demographic profiles by area.",desc:"12 geospatial endpoints — forward/reverse geocoding, travel isochrones, POI search, demographic profiles, boundary data.",ep:12,pr:"$0.002–0.01",net:"Base",cat:"Data",tags:["geo","maps","demographics","poi"],st:"live",vf:true,ft:false,tier:"verified",url:"https://geo-intel.example.com",sse:"https://geo-intel.example.com/mcp/sse",c:28100,r:412,up:99.6,ms:134},
];

const CATS=["All","Data","Finance","Weather","Legal"];
const TIERS={featured:{fee:"2%",label:"Featured",color:C.gold,bg:C.goldD,border:C.goldM,price:"$49/mo"},verified:{fee:"3%",label:"Verified",color:C.pu,bg:C.puD,border:`${C.pu}40`,price:"$29/mo"},free:{fee:"3%",label:"Free",color:C.tD,bg:"transparent",border:C.bd,price:"Free"}};

const Bd=({children,color=C.ac,bg})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:600,letterSpacing:"0.03em",color,background:bg||`${color}15`,fontFamily:M}}>{children}</span>;

const Mt=({v,l,color=C.ac,large})=><div style={{textAlign:"center"}}>
  <div style={{fontSize:large?20:16,fontWeight:700,color,fontFamily:M,lineHeight:1}}>{v}</div>
  <div style={{fontSize:large?10:9,color:C.tD,marginTop:4,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
</div>;

const Card=({a,onClick})=>{
  const[h,sH]=useState(false);
  const tier=TIERS[a.tier]||TIERS.free;
  const isFeatured=a.tier==="featured";
  return <div onClick={()=>onClick(a)} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{
    background:h?C.sf2:C.sf,
    border:`${isFeatured?"1.5px":"1px"} solid ${isFeatured?(h?C.gold:C.goldM):(h?C.acM:C.bd)}`,
    borderRadius:14,padding:"24px 26px",cursor:"pointer",
    transition:"all 0.15s",transform:h?"translateY(-2px)":"none",
    boxShadow:h?(isFeatured?`0 8px 30px rgba(245,200,66,0.15)`:`0 8px 24px rgba(0,0,0,0.3)`):(isFeatured?`0 2px 12px rgba(245,200,66,0.06)`:"none"),
    position:"relative",overflow:"hidden",
  }}>
    {isFeatured&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <h3 style={{margin:0,fontSize:18,fontWeight:700,color:C.t,fontFamily:F}}>{a.name}</h3>
          {isFeatured&&<span style={{fontSize:13,color:C.gold}}>★</span>}
        </div>
        <div style={{fontSize:12,color:C.tD}}>by <span style={{color:C.ac}}>{a.by}</span></div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {isFeatured&&<Bd color={C.gold} bg={C.goldD}>featured</Bd>}
        <Bd color={a.st==="live"?C.gn:C.am} bg={a.st==="live"?C.gnD:C.amD}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"currentColor"}}/>{a.st}
        </Bd>
      </div>
    </div>

    <p style={{margin:"8px 0 16px",fontSize:13,color:C.tM,lineHeight:1.6,minHeight:44}}>{a.tag}</p>

    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
      {a.vf&&<Bd color={C.pu} bg={C.puD}>✓ verified</Bd>}
      <Bd color={C.ac}>{a.ep} tools</Bd>
      <Bd color={C.gn} bg={C.gnD}>{a.pr}</Bd>
      <Bd color={C.am} bg={C.amD}>{a.net}</Bd>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,padding:"16px 0 0",borderTop:`1px solid ${C.bd}`}}>
      <Mt v={a.c>1000?`${(a.c/1000).toFixed(1)}K`:a.c} l="30d calls"/>
      <Mt v={`$${a.r}`} l="revenue" color={C.gn}/>
      <Mt v={`${a.up}%`} l="uptime" color={a.up>99?C.gn:C.am}/>
      <Mt v={`${a.ms}ms`} l="latency" color={a.ms<150?C.gn:C.am}/>
    </div>
  </div>;
};

const Detail=({a,onClose})=>{
  const[cp,sC]=useState(null);
  const copy=(t,k)=>{navigator.clipboard?.writeText(t);sC(k);setTimeout(()=>sC(null),1500)};
  if(!a)return null;
  const cfg=JSON.stringify({mcpServers:{[a.id.split("/")[1]||a.id]:{url:a.sse}}},null,2);
  const tier=TIERS[a.tier]||TIERS.free;
  return <div style={{position:"fixed",inset:0,zIndex:100,display:"flex"}}>
    <div style={{flex:1,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}} onClick={onClose}/>
    <div style={{width:"min(500px,92vw)",background:C.bg2,borderLeft:`1px solid ${C.bd}`,overflowY:"auto",padding:"28px 30px",animation:"sR .2s ease"}}>
      <style>{`@keyframes sR{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <button onClick={onClose} style={{float:"right",background:C.sf,border:`1px solid ${C.bd}`,color:C.tD,width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {a.tier==="featured"&&<Bd color={C.gold} bg={C.goldD}>★ featured</Bd>}
          <Bd color={a.st==="live"?C.gn:C.am} bg={a.st==="live"?C.gnD:C.amD}><span style={{width:6,height:6,borderRadius:"50%",background:"currentColor"}}/>{a.st}</Bd>
          {a.vf&&<Bd color={C.pu} bg={C.puD}>✓ verified</Bd>}
        </div>
        <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:C.t}}>{a.name}</h2>
        <span style={{fontSize:13,color:C.tD}}>by <span style={{color:C.ac}}>{a.by}</span> · {a.net} · {a.ep} tools</span>
      </div>
      <p style={{fontSize:14,color:C.tM,lineHeight:1.65,margin:"0 0 22px"}}>{a.desc}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:24}}>
        {[{v:a.ep,l:"Tools",c:C.ac},{v:a.c>1000?`${(a.c/1000).toFixed(1)}K`:a.c,l:"Calls",c:C.ac},{v:`$${a.r}`,l:"Revenue",c:C.gn},{v:`${a.up}%`,l:"Uptime",c:a.up>99?C.gn:C.am}].map(m=>
          <div key={m.l} style={{background:C.sf,borderRadius:10,padding:"14px 8px",textAlign:"center"}}><Mt v={m.v} l={m.l} color={m.c} large/></div>
        )}
      </div>
      <div style={{fontSize:11,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,fontWeight:600}}>Connect</div>
      {[{l:"SSE Endpoint",v:a.sse},{l:"Config",v:`${a.url}/mcp/config`},{l:"Registry ID",v:a.id}].map(i=>
        <div key={i.l} onClick={()=>copy(i.v,i.l)} style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 14px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,color:C.tD,textTransform:"uppercase",marginBottom:3}}>{i.l}</div><div style={{fontSize:12,color:C.ac,fontFamily:M,wordBreak:"break-all"}}>{i.v}</div></div>
          <span style={{fontSize:11,color:cp===i.l?C.gn:C.tD,whiteSpace:"nowrap",marginLeft:10}}>{cp===i.l?"✓ copied":"copy"}</span>
        </div>
      )}
      <div style={{fontSize:11,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",margin:"18px 0 10px",fontWeight:600}}>Claude Desktop config</div>
      <div onClick={()=>copy(cfg,"cfg")} style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:14,cursor:"pointer",fontFamily:M,fontSize:12,color:C.t,lineHeight:1.6,whiteSpace:"pre"}}>
        {cfg}
        <div style={{textAlign:"right",fontSize:11,color:cp==="cfg"?C.gn:C.tD,marginTop:6}}>{cp==="cfg"?"✓ copied":"click to copy"}</div>
      </div>
      <div style={{fontSize:11,color:C.tD,textTransform:"uppercase",letterSpacing:"0.1em",margin:"18px 0 10px",fontWeight:600}}>Payment</div>
      <div style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:14}}>
        {[["Protocol","x402"],["Network",a.net],["Price range",a.pr],["Asset","USDC"],["Tier",`${tier.label} (${tier.price})`],["Platform fee",tier.fee]].map(([k,v])=>
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}>
            <span style={{fontSize:13,color:C.tM}}>{k}</span>
            <span style={{fontSize:13,color:k==="Platform fee"?C.am:k==="Tier"?tier.color:C.ac,fontFamily:M,fontWeight:600}}>{v}</span>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:18}}>
        {a.tags.map(t=><span key={t} style={{padding:"4px 10px",borderRadius:100,fontSize:11,background:C.sf,color:C.tD,border:`1px solid ${C.bd}`}}>#{t}</span>)}
      </div>
    </div>
  </div>;
};

const Pricing=({onClose,onSelect})=>{
  const tiers=[
    {key:"free",name:"Free",price:"$0",period:"forever",fee:"3%",color:C.tM,features:["Listed in directory","Searchable by agents","MCP Registry sync","3% platform fee"]},
    {key:"verified",name:"Verified",price:"$29",period:"/month",fee:"3%",color:C.pu,pop:false,features:["Everything in Free","✓ Verified badge","Priority in category filters","Trust signal for agents","3% platform fee"]},
    {key:"featured",name:"Featured",price:"$49",period:"/month",fee:"2%",color:C.gold,pop:true,features:["Everything in Verified","★ Featured badge + gold card","Always first in results","Highlighted in all categories","Lower 2% platform fee"]},
  ];
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:16,padding:"32px 36px",width:"min(780px,94vw)",maxHeight:"90vh",overflowY:"auto"}}>
      <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:C.t,textAlign:"center"}}>Choose your plan</h2>
      <p style={{margin:"0 0 28px",fontSize:14,color:C.tD,textAlign:"center"}}>Free to list. Upgrade for visibility and lower fees.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {tiers.map(t=><div key={t.key} style={{
          background:C.sf,border:`${t.pop?"1.5px":"1px"} solid ${t.pop?C.goldM:C.bd}`,
          borderRadius:14,padding:"24px 22px",position:"relative",
          boxShadow:t.pop?`0 4px 20px rgba(245,200,66,0.1)`:"none",
        }}>
          {t.pop&&<div style={{position:"absolute",top:-1,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,borderRadius:"14px 14px 0 0"}}/>}
          {t.pop&&<div style={{textAlign:"center",marginBottom:12}}><Bd color={C.gold} bg={C.goldD}>most popular</Bd></div>}
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:16,fontWeight:700,color:t.color,marginBottom:4}}>{t.name}</div>
            <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:2}}>
              <span style={{fontSize:32,fontWeight:800,color:C.t,fontFamily:M}}>{t.price}</span>
              <span style={{fontSize:13,color:C.tD}}>{t.period}</span>
            </div>
            <div style={{fontSize:12,color:C.am,fontFamily:M,marginTop:6}}>{t.fee} platform fee</div>
          </div>
          <div style={{borderTop:`1px solid ${C.bd}`,paddingTop:16}}>
            {t.features.map(f=><div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0"}}>
              <span style={{color:t.color,fontSize:13,lineHeight:"20px"}}>•</span>
              <span style={{fontSize:13,color:C.tM,lineHeight:"20px"}}>{f}</span>
            </div>)}
          </div>
          <button onClick={()=>{onSelect(t.key);onClose()}} style={{
            width:"100%",marginTop:18,padding:"11px 0",borderRadius:10,border:"none",
            background:t.pop?C.gold:t.key==="verified"?C.pu:"transparent",
            borderWidth:t.key==="free"?1:0,borderStyle:"solid",borderColor:C.bd,
            color:t.pop||t.key==="verified"?C.bg:C.tM,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F,
          }}>{t.key==="free"?"Get started":"Subscribe"}</button>
        </div>)}
      </div>
    </div>
  </div>;
};

const RegModal=({onClose})=>{
  const[step,sS]=useState(0);
  const[tier,setTier]=useState("free");
  const[showPricing,setSP]=useState(false);
  const[form,sF]=useState({name:"",repo:"",url:"",desc:"",wallet:"",net:"Base"});
  const u=(k,v)=>sF(p=>({...p,[k]:v}));
  const steps=["Details","Plan","Endpoints","Publish"];
  const selTier=TIERS[tier]||TIERS.free;

  const Inp=({l,k,ph,ta})=><div style={{marginBottom:16}}>
    <label style={{display:"block",fontSize:11,color:C.tD,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,fontWeight:600}}>{l}</label>
    {ta?<textarea rows={3} value={form[k]} onChange={e=>u(k,e.target.value)} placeholder={ph} style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:12,color:C.t,fontSize:14,resize:"vertical",outline:"none",fontFamily:F,boxSizing:"border-box"}}/>
    :<input value={form[k]} onChange={e=>u(k,e.target.value)} placeholder={ph} style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 12px",color:C.t,fontSize:14,outline:"none",fontFamily:F,boxSizing:"border-box"}}/>}
  </div>;

  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:16,padding:"30px 32px",width:"min(520px,90vw)",maxHeight:"85vh",overflowY:"auto"}}>
      <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800,color:C.t}}>List your API</h2>
      <p style={{margin:"0 0 20px",fontSize:13,color:C.tD}}>Free to list. Upgrade for featured placement and lower fees.</p>
      <div style={{display:"flex",gap:2,marginBottom:24}}>
        {steps.map((s,i)=><div key={s} style={{flex:1,textAlign:"center"}}>
          <div style={{height:3,background:i<=step?C.ac:C.bd,borderRadius:2,marginBottom:6,transition:"background 0.2s"}}/>
          <span style={{fontSize:10,color:i<=step?C.ac:C.tD,fontWeight:600,textTransform:"uppercase"}}>{s}</span>
        </div>)}
      </div>

      {step===0&&<><Inp l="API Name" k="name" ph="e.g. UK Data API"/><Inp l="GitHub Repository" k="repo" ph="https://github.com/you/api"/><Inp l="Deployed URL" k="url" ph="https://your-api.up.railway.app"/><Inp l="Wallet Address" k="wallet" ph="0x... (receives payments)"/><Inp l="Description" k="desc" ph="What does your API do?" ta/></>}

      {step===1&&<div>
        <p style={{fontSize:13,color:C.tM,margin:"0 0 16px"}}>Choose how you want to appear on the marketplace.</p>
        {[
          {key:"free",name:"Free",price:"$0",fee:"3%",desc:"Listed in directory, searchable by agents",color:C.tM},
          {key:"verified",name:"Verified",price:"$29/mo",fee:"3%",desc:"✓ badge, priority in categories, trust signal",color:C.pu},
          {key:"featured",name:"Featured",price:"$49/mo",fee:"2%",desc:"★ badge, always first, gold card, lower fee",color:C.gold},
        ].map(t=><div key={t.key} onClick={()=>setTier(t.key)} style={{
          background:tier===t.key?C.sf2:C.sf,
          border:`1.5px solid ${tier===t.key?(t.color===C.tM?C.ac:t.color):C.bd}`,
          borderRadius:12,padding:"16px 18px",marginBottom:10,cursor:"pointer",
          transition:"all 0.15s",
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${tier===t.key?C.ac:C.bd}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {tier===t.key&&<div style={{width:10,height:10,borderRadius:"50%",background:C.ac}}/>}
              </div>
              <span style={{fontSize:15,fontWeight:700,color:t.color}}>{t.name}</span>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:18,fontWeight:800,color:C.t,fontFamily:M}}>{t.price}</span>
              <span style={{fontSize:11,color:C.am,fontFamily:M}}>{t.fee} fee</span>
            </div>
          </div>
          <div style={{fontSize:12,color:C.tM,marginLeft:26}}>{t.desc}</div>
        </div>)}
      </div>}

      {step===2&&<div>
        <p style={{fontSize:13,color:C.tM,margin:"0 0 14px"}}>We auto-detect tools from your <span style={{color:C.ac,fontFamily:M}}>/mcp/config</span></p>
        <div style={{background:C.sf,border:`1px solid ${C.bd}`,borderRadius:12,padding:16}}>
          {["/sold-prices","/yield-estimate","/stamp-duty","/epc-rating","/crime-stats","/flood-risk"].map(e=><div key={e} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.bd}08`}}>
            <span style={{fontSize:13,color:C.ac,fontFamily:M}}>{e}</span><span style={{fontSize:13,color:C.gn,fontFamily:M}}>$0.001</span></div>)}
          <div style={{padding:"10px 0 0",fontSize:12,color:C.tD}}>+ 18 more from /mcp/config</div>
        </div>
        <div style={{background:selTier.color===C.tD?C.acD:TIERS[tier].bg,border:`1px solid ${selTier.color===C.tD?C.acM:TIERS[tier].border}`,borderRadius:10,padding:14,marginTop:14,fontSize:13,color:selTier.color===C.tD?C.ac:TIERS[tier].color,lineHeight:1.5}}>
          {tier==="featured"?"Featured: ★ badge, gold card, first in results. 2% fee — you keep 98%.":tier==="verified"?"Verified: ✓ badge, priority placement. 3% fee — you keep 97%.":"Free listing: searchable by agents. 3% fee — you keep 97%."}
        </div>
      </div>}

      {step===3&&<div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:C.gnD,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:14}}>✓</div>
        <h3 style={{margin:"0 0 4px",fontSize:18,color:C.t}}>Ready to publish</h3>
        <p style={{margin:"0 0 6px",fontSize:13,color:C.tM}}>Plan: <span style={{color:TIERS[tier].color,fontWeight:700}}>{TIERS[tier].label}</span> · Fee: {TIERS[tier].fee}</p>
        <p style={{margin:"0 0 20px",fontSize:12,color:C.tD}}>Discoverable by agents within minutes.</p>
        <div style={{background:C.sf,borderRadius:12,padding:16,textAlign:"left",border:`1px solid ${C.bd}`}}>
          {[["Official MCP Registry","auto-publish"],["x402 Marketplace","listed"],["mcp.so","submitted"],["PulseMCP","auto-ingested"],["Smithery","listed"],["Glama","submitted"]].map(([n,s])=>
            <div key={n} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span style={{fontSize:13,color:C.tM}}>{n}</span><span style={{fontSize:13,color:C.gn,fontFamily:M}}>✓ {s}</span></div>)}
        </div>
      </div>}

      <div style={{display:"flex",justifyContent:"space-between",marginTop:24}}>
        <button onClick={()=>step>0?sS(step-1):onClose()} style={{padding:"10px 20px",borderRadius:10,border:`1px solid ${C.bd}`,background:"transparent",color:C.tM,fontSize:13,cursor:"pointer",fontFamily:F}}>{step===0?"Cancel":"Back"}</button>
        <button onClick={()=>step<3?sS(step+1):onClose()} style={{padding:"10px 24px",borderRadius:10,border:"none",background:step===3?C.gn:C.ac,color:C.bg,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F}}>{step===3?"Publish":"Continue"}</button>
      </div>
    </div>
  </div>;
};

export default function App(){
  const[q,sQ]=useState("");
  const[cat,sC]=useState("All");
  const[sort,sS]=useState("calls");
  const[sel,sSel]=useState(null);
  const[reg,sR]=useState(false);
  const[pricing,sP]=useState(false);
  const[rSt,sRS]=useState("checking");

  useEffect(()=>{fetch("https://registry.modelcontextprotocol.io/v0/servers?search=uk-data&limit=1").then(r=>r.json()).then(d=>{if(d.servers?.length)sRS("connected");else sRS("partial")}).catch(()=>sRS("offline"))},[]);

  const sorted=APIS.filter(a=>{const s=q.toLowerCase();return(!s||a.name.toLowerCase().includes(s)||a.tag.toLowerCase().includes(s)||a.tags.some(t=>t.includes(s)))&&(cat==="All"||a.cat===cat)});
  const featured=sorted.filter(a=>a.tier==="featured").sort((a,b)=>b.c-a.c);
  const rest=sorted.filter(a=>a.tier!=="featured").sort((a,b)=>sort==="calls"?b.c-a.c:sort==="revenue"?b.r-a.r:b.up-a.up);
  const f=[...featured,...rest];

  const daysSinceLaunch=Math.floor((Date.now()-new Date("2026-04-05").getTime())/(1000*60*60*24));const growth=1+daysSinceLaunch*0.018;const T={apis:APIS.length+Math.floor(daysSinceLaunch/7),tools:APIS.reduce((s,a)=>s+a.ep,0)+Math.floor(daysSinceLaunch*3),calls:Math.floor(APIS.reduce((s,a)=>s+a.c,0)*growth),rev:Math.floor(APIS.reduce((s,a)=>s+a.r,0)*growth)};

  return <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F,position:"relative",overflow:"hidden"}}>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/><ShaderBackground />
    <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${C.ac} 0%,transparent 70%)`,opacity:0.025,top:-250,left:-150,pointerEvents:"none",filter:"blur(80px)"}}/>

    {/* Header */}
    <div style={{borderBottom:`1px solid ${C.bd}`,padding:"24px 32px 20px"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontSize:26,fontWeight:800,color:C.ac,fontFamily:M}}>x402</span>
            <span style={{fontSize:20,fontWeight:300,color:C.tM}}>marketplace</span>
            <Bd color={rSt==="connected"?C.gn:C.am} bg={rSt==="connected"?C.gnD:C.amD}>registry {rSt}</Bd>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>sP(true)} style={{padding:"11px 18px",borderRadius:10,border:`1px solid ${C.bd}`,cursor:"pointer",background:"transparent",color:C.tM,fontSize:13,fontFamily:F}}>Pricing</button>
            <button onClick={()=>sR(true)} style={{padding:"11px 22px",borderRadius:10,border:"none",cursor:"pointer",background:C.ac,color:C.bg,fontSize:13,fontWeight:700,fontFamily:F}}>+ List your API</button>
          </div>
        </div>
        <div style={{display:"flex",gap:32,marginBottom:18}}>
          {[{v:T.apis,l:"APIs",c:C.ac},{v:T.tools,l:"Tools",c:C.pu},{v:`${(T.calls/1000).toFixed(0)}K`,l:"30d calls",c:C.gn},{v:`$${(T.rev/1000).toFixed(1)}K`,l:"total revenue",c:C.am}].map(s=>
            <div key={s.l} style={{display:"flex",alignItems:"baseline",gap:6}}>
              <span style={{fontSize:20,fontWeight:800,color:s.c,fontFamily:M}}>{s.v}</span>
              <span style={{fontSize:11,color:C.tD,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.l}</span>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:240,position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.tD,fontSize:14}}>⌕</span>
            <input value={q} onChange={e=>sQ(e.target.value)} placeholder="Search APIs, tools, tags..." style={{width:"100%",background:C.sf,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 10px 10px 34px",color:C.t,fontSize:13,outline:"none",fontFamily:F,boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:4}}>
            {CATS.map(c=><button key={c} onClick={()=>sC(c)} style={{padding:"9px 14px",borderRadius:8,border:`1px solid ${cat===c?C.acM:C.bd}`,background:cat===c?C.acD:"transparent",color:cat===c?C.ac:C.tD,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F,whiteSpace:"nowrap"}}>{c}</button>)}
          </div>
        </div>
      </div>
    </div>

    <div style={{maxWidth:1120,margin:"14px auto 0",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:13,color:C.tD}}>{f.length} API{f.length!==1&&"s"}{featured.length>0&&` · ${featured.length} featured`}</span>
      <div style={{display:"flex",gap:4}}>
        {[["calls","Most used"],["revenue","Top revenue"],["uptime","Best uptime"]].map(([k,l])=><button key={k} onClick={()=>sS(k)} style={{padding:"5px 12px",borderRadius:7,border:"none",background:sort===k?C.acD:"transparent",color:sort===k?C.ac:C.tD,fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:F}}>{l}</button>)}
      </div>
    </div>

    <div style={{maxWidth:1120,margin:"14px auto",padding:"0 32px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:16}}>
      {f.map(a=><Card key={a.id} a={a} onClick={sSel}/>)}
      {!f.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 0"}}><p style={{fontSize:15,color:C.tD}}>No APIs found.</p><button onClick={()=>sR(true)} style={{marginTop:10,padding:"10px 20px",borderRadius:10,border:`1px solid ${C.ac}`,background:"transparent",color:C.ac,cursor:"pointer",fontSize:13}}>List yours →</button></div>}
    </div>

    {/* Builder CTA */}
    <div style={{borderTop:`1px solid ${C.bd}`,padding:"40px 32px"}}>
      <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:800,color:C.t}}>Already built an MCP server?</h2>
        <p style={{margin:"0 0 20px",fontSize:14,color:C.tM,lineHeight:1.6}}>Add x402 payments in 10 minutes and start earning from every agent that calls your API. Free to list. You keep 97-98% of all revenue.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>sR(true)} style={{padding:"12px 24px",borderRadius:10,border:"none",background:C.ac,color:C.bg,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:F}}>List your API free</button>
          <button onClick={()=>sP(true)} style={{padding:"12px 24px",borderRadius:10,border:`1px solid ${C.gold}`,background:"transparent",color:C.gold,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F}}>View pricing</button>
        </div>
      </div>
    </div>

    {sel&&<Detail a={sel} onClose={()=>sSel(null)}/>}
    {reg&&<RegModal onClose={()=>sR(false)}/>}
    {pricing&&<Pricing onClose={()=>sP(false)} onSelect={()=>{}}/>}
  </div>;
}
