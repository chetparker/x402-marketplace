import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "./components/SEOHead";
import EmailCapture from "./components/EmailCapture";

// Two-color system: white text + #3B82F6 accent. Legacy color keys
// (gn/am/gold/pu/rd) are aliased to neutral gray so the rest of the
// component tree renders flat without per-call-site rewrites.
const C = {
  bg:"#06080D",bg2:"#0B0F16",sf:"#0F141C",sf2:"#141A24",
  bd:"#1F2937",bdH:"#374151",
  ac:"#3B82F6",acD:"rgba(59,130,246,0.10)",acM:"rgba(59,130,246,0.30)",
  gn:"#9CA3AF",gnD:"rgba(255,255,255,0.04)",
  am:"#9CA3AF",amD:"rgba(255,255,255,0.04)",
  gold:"#9CA3AF",goldD:"rgba(255,255,255,0.04)",goldM:"#1F2937",
  rd:"#9CA3AF",pu:"#9CA3AF",puD:"rgba(255,255,255,0.04)",
  t:"#FFFFFF",tM:"#9CA3AF",tD:"#6B7280",
};
const F="'Söhne',-apple-system,sans-serif";
const M="'Geist Mono','SF Mono',monospace";

const APIS=[
  {id:"io.github.chetparker/uk-data-api",name:"UK Data API",by:"chetparker",tag:"Property, weather, companies, vehicles, finance — 24 UK government and public data endpoints in one MCP server.",desc:"24 UK data endpoints — Land Registry sold prices, rental yields, stamp duty, EPC, crime, flood risk, planning, council tax, weather, air quality, Companies House, DVLA, MOT, BoE rates, exchange rates, inflation, mortgage calculator. All paid per-request via x402.",ep:24,pr:"$0.001–0.002",net:"Base",cat:"Data",tags:["property","uk","government","companies","vehicles","finance"],st:"live",vf:true,ft:false,tier:"free",url:"https://web-production-18a32.up.railway.app",sse:"https://web-production-18a32.up.railway.app/mcp/sse",c:12847,r:284,up:99.7,ms:142},
  {id:"io.github.chetparker/email-verify-api",name:"Email Verification API",by:"chetparker",tag:"Verify email addresses in real-time. Syntax, MX, SMTP, disposable detection, catch-all, role-based, quality scoring. 8x cheaper than ZeroBounce.",desc:"4 endpoints for real-time email verification — single verify, bulk verify (up to 100), domain check, MX lookup. Each call runs syntax validation, MX resolution, SMTP RCPT probe, catch-all detection, disposable check against 3500+ domains, role-based pattern detection (45+ patterns), free provider classification, typo suggestion, and a 0–100 quality score. Verdict: valid / invalid / risky / unknown.",ep:4,pr:"$0.001",net:"Base",cat:"Verification",tags:["email","verification","smtp","mx","disposable","deliverability"],st:"live",vf:true,ft:false,tier:"free",url:"https://email-verify-api-production-d262.up.railway.app",sse:"https://email-verify-api-production-d262.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:120},
  {id:"io.github.chetparker/company-enrich-api",name:"Company Enrichment API",by:"chetparker",tag:"Domain intelligence, tech stack detection, Companies House lookup, officer data, email patterns. 124x cheaper than ZoomInfo.",desc:"6 endpoints for company and domain intelligence — domain enrichment (meta, social links, DNS, email + hosting providers), full company enrichment (Companies House + officers + domain data), email pattern guessing, UK officer lookup, UK filing history, and pure tech-stack detection across 55+ signatures (frameworks, CMS, e-commerce, analytics, marketing, payments, monitoring, CDN).",ep:6,pr:"$0.003–0.005",net:"Base",cat:"Intelligence",tags:["company","domain","enrichment","tech-stack","officers","companies-house"],st:"live",vf:true,ft:false,tier:"free",url:"https://company-enrich-api-production.up.railway.app",sse:"https://company-enrich-api-production.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:180},
  {id:"io.github.chetparker/postcode-api",name:"Postcode & Address Lookup API",by:"chetparker",tag:"UK postcode lookup, address search, coordinates, council data, nearest postcodes. Powered by Ordnance Survey.",desc:"5 endpoints for UK postcode and address intelligence — full postcode lookup (coordinates, council, ward, parliamentary constituency, region), free-text address search, nearest postcodes within a radius (lat/lng), validity check, and partial-postcode autocomplete. Backed by Ordnance Survey-derived data.",ep:5,pr:"$0.001",net:"Base",cat:"Data",tags:["uk","postcode","address","geocoding","council","constituency"],st:"live",vf:true,ft:false,tier:"free",url:"https://postcode-api-production.up.railway.app",sse:"https://postcode-api-production.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:90},
  {id:"io.github.chetparker/currency-api",name:"Currency & Crypto API",by:"chetparker",tag:"Real-time FX rates from ECB, currency conversion, historical rates, crypto prices via CoinGecko.",desc:"5 endpoints for fiat and crypto pricing — latest ECB exchange rates for any base currency, fast amount conversion, historical rates back to 1999, single-coin crypto price lookup, and batch crypto pricing for up to 50 coins at once. Per-key TTL cache (1h fiat, 30s crypto) keeps upstream load minimal.",ep:5,pr:"$0.001",net:"Base",cat:"Data",tags:["currency","fx","ecb","crypto","coingecko","conversion"],st:"live",vf:true,ft:false,tier:"free",url:"https://currency-api-production-4a8d.up.railway.app",sse:"https://currency-api-production-4a8d.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:110},
  {id:"io.github.chetparker/screenshot-api",name:"Screenshot & PDF Capture API",by:"chetparker",tag:"Capture website screenshots and PDFs programmatically. Full page, element, and viewport options via Playwright.",desc:"4 endpoints for headless web capture — viewport screenshot, full-page screenshot (scrolled), PDF render with print emulation, and CSS-selected element capture. Powered by Playwright + Chromium with one warm browser instance per process. Returns base64-encoded binary in JSON to keep the x402 envelope consistent.",ep:4,pr:"$0.002",net:"Base",cat:"Intelligence",tags:["screenshot","pdf","playwright","chromium","headless","capture"],st:"live",vf:true,ft:false,tier:"free",url:"https://screenshot-api-production-fe7e.up.railway.app",sse:"https://screenshot-api-production-fe7e.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:850},
  {id:"io.github.chetparker/dns-intel-api",name:"DNS & Domain Intelligence API",by:"chetparker",tag:"Full DNS records, WHOIS lookup, SSL certificate details, subdomain discovery via certificate transparency.",desc:"5 endpoints for DNS and domain intelligence — every common record type (A, AAAA, MX, TXT, NS, SOA, CNAME), WHOIS registration metadata, live SSL certificate inspection (issuer, validity, SANs, days remaining), Certificate Transparency-log subdomain discovery via crt.sh, and reverse-IP lookup with PTR fallback.",ep:5,pr:"$0.002",net:"Base",cat:"Intelligence",tags:["dns","whois","ssl","certificate","subdomains","crt-sh","reverse-ip"],st:"live",vf:true,ft:false,tier:"free",url:"https://dns-intel-api-production.up.railway.app",sse:"https://dns-intel-api-production.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:240},
  {id:"io.github.chetparker/web-scraper-api",name:"Web Scraper & Content Extractor API",by:"chetparker",tag:"Extract clean text, links, metadata, and structured content from any URL. Built for RAG pipelines and research agents.",desc:"4 endpoints for HTML scraping — clean main-content text extraction (boilerplate stripped: nav/footer/sidebar/ads), all links split into internal and external with anchor text, full page metadata (title, OG/Twitter tags, canonical, language, author, dates), and structured extraction (heading hierarchy, lists, tables as 2D arrays, images with alt text). Powered by httpx + BeautifulSoup4 + lxml.",ep:4,pr:"$0.002",net:"Base",cat:"Tools",tags:["scraping","html","rag","content-extraction","metadata","crawling"],st:"live",vf:true,ft:false,tier:"free",url:"https://web-scraper-api-production-bf20.up.railway.app",sse:"https://web-scraper-api-production-bf20.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:320},
  {id:"io.github.chetparker/ip-geo-api",name:"IP Geolocation API",by:"chetparker",tag:"IP address to location, ISP, timezone, and datacenter detection. Batch lookup for up to 20 IPs.",desc:"4 endpoints for IP geolocation — single IP lookup (country, region, city, ISP, ASN, lat/lng, timezone, datacenter heuristic), batch lookup of up to 20 IPs in parallel, caller's-IP introspection (via x-forwarded-for chain), and great-circle distance between two IPs in km/miles. Backed by ip-api.com (primary) with ipapi.co fallback.",ep:4,pr:"$0.001",net:"Base",cat:"Data",tags:["ip","geolocation","geoip","asn","datacenter","timezone"],st:"live",vf:true,ft:false,tier:"free",url:"https://ip-geo-api-production.up.railway.app",sse:"https://ip-geo-api-production.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:140},
  {id:"io.github.chetparker/qr-api",name:"QR Code API",by:"chetparker",tag:"Generate and decode QR codes. Custom colours, sizes, batch generation. Returns base64 PNG.",desc:"4 endpoints for QR code generation and decoding — basic generation with default styling, fully styled generation (custom hex colours, module size, border, error-correction level), batch generation of up to 20 codes per call, and image decoding via libzbar (returns content + bounding boxes for any QR codes detected). Returns base64 PNG to keep the x402 envelope consistent.",ep:4,pr:"$0.001",net:"Base",cat:"Tools",tags:["qr","qrcode","barcode","generation","decoding","libzbar"],st:"live",vf:true,ft:false,tier:"free",url:"https://qr-api-production-1836.up.railway.app",sse:"https://qr-api-production-1836.up.railway.app/mcp/sse",c:0,r:0,up:99.9,ms:80},
];

const CATS=["All","Data","Verification","Intelligence","Tools"];
const TIERS={featured:{fee:"2.5%",label:"Featured",color:C.gold,bg:C.goldD,border:C.goldM,price:"$49/mo"},free:{fee:"3%",label:"Free",color:C.tD,bg:"transparent",border:C.bd,price:"Free"}};

const Bd=({children,color=C.ac,bg})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:100,fontSize:11,fontWeight:600,letterSpacing:"0.03em",color,background:bg||`${color}15`,fontFamily:M}}>{children}</span>;

const Mt=({v,l,large})=><div style={{textAlign:"left"}}>
  <div style={{fontSize:large?20:15,fontWeight:600,color:C.tM,lineHeight:1.2}}>{v}</div>
  <div style={{fontSize:large?11:10,color:C.tD,marginTop:3}}>{l}</div>
</div>;

const Card=({a,idx=0,onClick})=>{
  const[h,sH]=useState(false);
  // Subtle layout variation: every 3rd card emphasizes the description
  // and tucks the meta line above it instead of below the title.
  const variant=idx%3===2?"emphasis":"default";
  const live=a.st==="live";
  return <div onClick={()=>onClick(a)} onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)} style={{
    background:C.sf,
    border:`1px solid ${h?C.bdH:C.bd}`,
    borderRadius:10,padding:"22px 24px",cursor:"pointer",
    transition:"border-color 0.15s, background 0.15s",
    position:"relative",
  }}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:variant==="emphasis"?6:10,gap:12}}>
      <div style={{flex:1,minWidth:0}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:600,color:C.t,fontFamily:F,letterSpacing:"-0.01em"}}>{a.name}</h3>
        <div style={{fontSize:12,color:C.tD,marginTop:2}}>
          {a.by}
          {a.vf&&<span style={{marginLeft:8,color:C.tM}}>✓ verified</span>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:C.tD,whiteSpace:"nowrap"}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:live?"#10B981":"#6B7280",display:"inline-block"}}/>
        {live?"live":a.st}
      </div>
    </div>

    <p style={{margin:variant==="emphasis"?"4px 0 14px":"6px 0 14px",fontSize:13,color:C.tM,lineHeight:1.55}}>{a.tag}</p>

    <div style={{fontSize:12,color:C.tD,marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <span>{a.ep} tools</span>
      <span style={{color:C.bdH}}>·</span>
      <span>{a.pr}</span>
      <span style={{color:C.bdH}}>·</span>
      <span>{a.net}</span>
    </div>

    {a.c>0?(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,padding:"14px 0 0",borderTop:`1px solid ${C.bd}`}}>
        <Mt v={a.c>1000?`${(a.c/1000).toFixed(1)}K`:a.c} l="30d calls"/>
        <Mt v={`$${a.r}`} l="revenue"/>
        <Mt v={`${a.up}%`} l="uptime"/>
        <Mt v={`${a.ms}ms`} l="latency"/>
      </div>
    ):(
      <div style={{padding:"14px 0 0",borderTop:`1px solid ${C.bd}`,display:"flex",justifyContent:"center"}}>
        <span style={{padding:"4px 12px",borderRadius:100,fontSize:11,fontWeight:500,color:C.tM,background:C.sf2,border:`1px solid ${C.bd}`,letterSpacing:"0.02em"}}>Just launched</span>
      </div>
    )}
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
    {key:"free",name:"Free",price:"$0",period:"forever",fee:"3%",color:C.ac,features:["Listed in directory","Searchable by agents","MCP Registry sync","Per-request USDC payouts","3% platform fee — you keep 97%"]},
    {key:"featured",name:"Featured",price:"$49",period:"/month",fee:"2.5%",color:C.gold,pop:true,features:["Everything in Free","★ Featured badge + gold card","Always first in results","Highlighted in all categories","Reduced 2.5% fee — you keep 97.5%"]},
  ];
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:16,padding:"32px 36px",width:"min(780px,94vw)",maxHeight:"90vh",overflowY:"auto"}}>
      <h2 style={{margin:"0 0 4px",fontSize:22,fontWeight:800,color:C.t,textAlign:"center"}}>Choose your plan</h2>
      <p style={{margin:"0 0 28px",fontSize:14,color:C.tD,textAlign:"center"}}>Free to list. Upgrade for visibility and lower fees.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16,maxWidth:560,margin:"0 auto"}}>
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
            width:"100%",marginTop:18,padding:"11px 0",borderRadius:10,
            background:t.pop?C.gold:"transparent",
            border:t.pop?"none":`1px solid ${C.bd}`,
            color:t.pop?C.bg:C.tM,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F,
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
          {key:"free",name:"Free",price:"$0",fee:"3%",desc:"Listed in directory, searchable by agents — you keep 97%",color:C.ac},
          {key:"featured",name:"Featured",price:"$49/mo",fee:"2.5%",desc:"★ badge, always first, gold card, reduced fee — you keep 97.5%",color:C.gold},
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
          {tier==="featured"?"Featured: ★ badge, gold card, first in results. Reduced 2.5% fee — you keep 97.5%.":"Free listing: searchable by agents. 3% fee — you keep 97%."}
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

  const sorted=APIS.filter(a=>{const s=q.toLowerCase();return(!s||a.name.toLowerCase().includes(s)||a.tag.toLowerCase().includes(s)||a.tags.some(t=>t.includes(s)))&&(cat==="All"||a.cat===cat)});
  const featured=sorted.filter(a=>a.tier==="featured").sort((a,b)=>b.c-a.c);
  const rest=sorted.filter(a=>a.tier!=="featured").sort((a,b)=>sort==="calls"?b.c-a.c:sort==="revenue"?b.r-a.r:b.up-a.up);
  const f=[...featured,...rest];

  const T={apis:APIS.length,tools:APIS.reduce((s,a)=>s+a.ep,0),calls:APIS.reduce((s,a)=>s+a.c,0),rev:APIS.reduce((s,a)=>s+a.r,0)};

  return <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F,position:"relative",overflow:"hidden"}}>
    <SEOHead page="home" />
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={{position:"absolute",inset:"0 0 auto 0",height:600,background:"radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 60%)",pointerEvents:"none"}}/>

    {/* Header */}
    <div style={{borderBottom:`1px solid ${C.bd}`,padding:"24px 32px 20px"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontSize:22,fontWeight:700,color:C.t,letterSpacing:"-0.02em"}}>x402</span>
            <span style={{fontSize:18,fontWeight:400,color:C.tM,letterSpacing:"-0.01em"}}>marketplace</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Link to="/for/api-providers" style={{padding:"10px 12px",fontSize:13,color:C.tM,textDecoration:"none",fontFamily:F}}>For Providers</Link>
            <Link to="/for/ai-agents" style={{padding:"10px 12px",fontSize:13,color:C.tM,textDecoration:"none",fontFamily:F}}>For Agents</Link>
            <Link to="/blog" style={{padding:"10px 12px",fontSize:13,color:C.tM,textDecoration:"none",fontFamily:F}}>Blog</Link>
            <Link to="/about" style={{padding:"10px 12px",fontSize:13,color:C.tM,textDecoration:"none",fontFamily:F}}>About</Link>
            <Link to="/calculator" style={{padding:"11px 16px",borderRadius:10,border:`1px solid ${C.bd}`,background:"transparent",color:C.tM,fontSize:13,fontFamily:F,textDecoration:"none"}}>Calculator</Link>
            <Link to="/pricing" style={{padding:"11px 18px",borderRadius:10,border:`1px solid ${C.bd}`,background:"transparent",color:C.tM,fontSize:13,fontFamily:F,textDecoration:"none"}}>Pricing</Link>
            <button onClick={()=>sR(true)} style={{padding:"9px 16px",borderRadius:8,border:"1px solid #1D4ED8",cursor:"pointer",background:"#1D4ED8",color:"#FFFFFF",fontSize:13,fontWeight:500,fontFamily:F}}>List your API</button>
          </div>
        </div>
        <div style={{display:"flex",gap:36,marginBottom:18}}>
          {[{v:T.apis,l:"APIs"},{v:T.tools,l:"Tools"},{v:`${(T.calls/1000).toFixed(0)}K`,l:"30d calls"},{v:`$${(T.rev/1000).toFixed(1)}K`,l:"total revenue"}].map(s=>
            <div key={s.l} style={{display:"flex",flexDirection:"column",gap:2}}>
              <span style={{fontSize:18,fontWeight:600,color:C.t,fontFamily:F,letterSpacing:"-0.01em"}}>{s.v}</span>
              <span style={{fontSize:12,color:C.tD}}>{s.l}</span>
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
      {f.map((a,i)=><Card key={a.id} a={a} idx={i} onClick={sSel}/>)}
      {!f.length&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 0"}}><p style={{fontSize:15,color:C.tD}}>No APIs found.</p><button onClick={()=>sR(true)} style={{marginTop:10,padding:"10px 20px",borderRadius:10,border:`1px solid ${C.ac}`,background:"transparent",color:C.ac,cursor:"pointer",fontSize:13}}>List yours →</button></div>}
    </div>

    <div style={{maxWidth:760,margin:"24px auto 0",padding:"0 32px"}}>
      <EmailCapture source="home" />
    </div>

    {/* Builder CTA */}
    <div style={{borderTop:`1px solid ${C.bd}`,padding:"40px 32px"}}>
      <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:800,color:C.t}}>Already built an MCP server?</h2>
        <p style={{margin:"0 0 20px",fontSize:14,color:C.tM,lineHeight:1.6}}>Add x402 payments in 10 minutes and start earning from every agent that calls your API. Free to list. You keep 97%+ of all revenue.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <button onClick={()=>sR(true)} style={{padding:"10px 20px",borderRadius:8,border:"1px solid #1D4ED8",background:"#1D4ED8",color:"#FFFFFF",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:F}}>List your API free</button>
          <button onClick={()=>sP(true)} style={{padding:"10px 20px",borderRadius:8,border:`1px solid ${C.bd}`,background:"transparent",color:C.t,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:F}}>View pricing</button>
        </div>
      </div>
    </div>

    {sel&&<Detail a={sel} onClose={()=>sSel(null)}/>}
    {reg&&<RegModal onClose={()=>sR(false)}/>}
    {pricing&&<Pricing onClose={()=>sP(false)} onSelect={()=>{}}/>}
  </div>;
}
