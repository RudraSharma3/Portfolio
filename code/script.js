/* reveal */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.08});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

/* Three.js hero: reactive node network */
addEventListener("DOMContentLoaded",function(){
const cv=document.getElementById('gl');if(!window.THREE)return;
const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,1,.1,100);C.position.z=9;
const g=new THREE.Group();S.add(g);
const N=110,pts=[],pos=new Float32Array(N*3);
for(let i=0;i<N;i++){const r=3.4+Math.random()*1.6,t=Math.random()*6.283,p=Math.acos(2*Math.random()-1);
const v=new THREE.Vector3(r*Math.sin(p)*Math.cos(t),r*Math.sin(p)*Math.sin(t),r*Math.cos(p));pts.push(v);pos.set([v.x,v.y,v.z],i*3)}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
g.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x7da0ff,size:.07})));
const lp=[];for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(pts[i].distanceTo(pts[j])<1.7)lp.push(pts[i],pts[j]);
g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp),new THREE.LineBasicMaterial({color:0x6c8cff,transparent:true,opacity:.22})));
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),new THREE.MeshBasicMaterial({color:0x35e0c2,wireframe:true,transparent:true,opacity:.35}));g.add(core);
let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
function rs(){const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);C.aspect=w/h;C.updateProjectionMatrix();const d=w>=1100;g.scale.setScalar(d?.85:.72);g.position.x=d?4.685*C.aspect*.56:0}
rs();addEventListener('resize',rs);
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let on=false,inView=true,raf;
function f(){if(!on)return;if(!still){g.rotation.y+=.0016;core.rotation.x+=.003}g.rotation.x+=(my*.5-g.rotation.x)*.03;g.rotation.z+=(-mx*.3-g.rotation.z)*.03;R.render(S,C);raf=requestAnimationFrame(f)}
function go(){if(!on&&inView&&!document.hidden){on=true;f()}}function stop(){on=false;cancelAnimationFrame(raf)}
new IntersectionObserver(e=>{inView=e[0].isIntersecting;inView?go():stop()}).observe(cv);
document.addEventListener("visibilitychange",()=>document.hidden?stop():go());go();
});


const PR=[
{id:'dp',tag:'Data platform · BytePX',name:'DataPurge Studio',sub:'Asynchronous multi-tenant spreadsheet cleaning platform, architected at BytePX',link:'https://github.com/RudraSharma3/datapurge-studio',
m:[['15–20x','Faster preprocessing'],['99.9%','Processing accuracy'],['94%','Fewer manual data errors'],['4.5h → 12m','Avg. prep time reduced']],
p:'Enterprise teams cleaned complex multi-sheet Excel workbooks by hand or with one-off Pandas scripts: slow, unrepeatable, and prone to silently breaking cell formatting, formulas and layout.',
b:'An async multi-tenant web platform: upload workbooks, get automatic schema and anomaly detection, configure non-destructive cleaning rules, review flagged records inline, and export sanitized files with formatting preserved.',
t:'FastAPI streaming uploads through io.BytesIO buffers on Starlette thread pools; dynamic type downcasting and an O(N) lookahead sniffer for schema inference; RapidFuzz (C++) for fuzzy matching; OpenPyXL coordinate-mapping to preserve styles and formulas; PostgreSQL + SQLAlchemy for auth, sessions and audit logs.',
r:'Complex multi-sheet workbooks in under two minutes at 99.9% accuracy, a 15–20x speedup over ad-hoc scripting, with a full audit trail of every removed record.',
s:['FastAPI','Pandas','OpenPyXL','RapidFuzz','PostgreSQL','SQLAlchemy','React','JWT Auth','Docker'],
f:[['React SPA','Wizard · Grid Editor'],['FastAPI','Auth · Async Tasks'],['Cleaning Engine','Pandas · OpenPyXL · RapidFuzz',1],['Storage','PostgreSQL']]},
{id:'vox',tag:'Production RAG platform',name:'VoxContextEngine',sub:'Hybrid retrieval that keeps LLM answers grounded in source documents',link:'https://github.com/RudraSharma3/vox-context-engine',
m:[['100%','Safety-run completeness'],['Dense + BM25','Hybrid retrieval'],['HNSW','Vector index']],
p:'LLM answers drift away from the source material. Teams need responses locked to their own documents, plus a way to measure when the system can be trusted.',
b:'A production-grade hybrid RAG platform on FastAPI and Docker that retrieves from ingested documents and grounds every answer in them, with an automated Python evaluation suite.',
t:'Dense semantic search through Qdrant (all-MiniLM-L6-v2 embeddings, HNSW indexing) fused with sparse keyword retrieval via Rank-BM25. The evaluation suite benchmarks ingestion and retrieval precision.',
r:'Hallucination-validation runs achieved a 100% safety-run completeness score.',
s:['FastAPI','Docker','Qdrant','Rank-BM25','all-MiniLM-L6-v2'],
f:[['Documents','Ingestion'],['Embeddings','MiniLM · HNSW'],['Qdrant + BM25','Hybrid retrieval',1],['LLM','Grounded answer']]},
{id:'aios',tag:'Agent infrastructure',name:'AI-OS',sub:'Versioned operating layer for AI coding agents (Claude, Gemini, Codex)',link:'https://github.com/RudraSharma3',
m:[['up to 5x','Lower agent latency'],['90%','Lower token cost'],['14-point','Health check']],
p:'Working across several AI coding agents means duplicated setup, rules that drift apart and lessons that never get consolidated.',
b:'A versioned operating layer (v2.0): adapter files per agent, project playbooks and a self-improvement loop that promotes only quality-checked lessons into one canonical rule hierarchy.',
t:'Pinned-prefix prompt caching and multi-agent MCP orchestration; a self-healing test loop that auto-remediates failures before escalation; a pre-commit secret-interception hook and a 14-point health check.',
r:'Agent latency cut up to 5x and token cost 90%, with zero-incident credential handling.',
s:['MCP','Prompt caching','Multi-agent','Git hooks','Python'],
f:[['Agent adapters','Claude · Gemini · Codex'],['Playbooks','Per project'],['Canonical rules','One hierarchy',1],['Self-improvement','Quality-gated lessons']]},
{id:'eta',tag:'Applied ML',name:'Estimated Delivery Date Prediction',sub:'XGBoost model predicting e-commerce delivery windows',link:'https://github.com/RudraSharma3/Estimated_Delivery_Date',
m:[['500K+','Shipment records'],['XGBoost','Model']],
p:'E-commerce delivery estimates vary widely with supply-chain constraints, which makes ETAs unreliable.',
b:'An XGBoost model that predicts delivery windows from historical shipment data.',
t:'Advanced feature engineering and data-scaling pipelines to capture supply-chain constraints and minimize ETA prediction variance.',
r:'Trained and optimized across 500K+ historical e-commerce shipment records.',
s:['XGBoost','Pandas','Feature Engineering','Scikit-learn'],
f:[['Shipment data','500K+ records'],['Features','Engineering · scaling'],['XGBoost','Training',1],['ETA','Delivery window']]},
{id:'pneu',tag:'Healthcare ML · Research',name:'Pneumonia Detection & Genomic Analysis',sub:'Co-authored research on hybrid deep learning for non-invasive diagnostics',link:'https://github.com/RudraSharma3',
m:[['94%','Pneumonia identification accuracy'],['CNN','Chest X-ray model']],
p:'Clinical diagnostics need non-invasive tools that can combine imaging with genomic signals.',
b:'Co-authored research on a hybrid deep learning architecture for non-invasive clinical diagnostics.',
t:'CNNs trained on chest X-ray datasets for automated pneumonia identification, paired with logistic regression over genomic sequence data to predict multi-factor polygenic disorder risk.',
r:'94% accuracy on automated pneumonia identification.',
s:['CNN','Logistic Regression','TensorFlow','Research Paper'],
f:[['Chest X-rays','Imaging data'],['CNN','Pneumonia detection',1],['Genomic data','Sequences'],['Logistic Regression','Polygenic risk']]},
{id:'bir',tag:'Agentic RAG · UltraTech Cement',name:'Birbal 2.0',sub:'Hindi–English agentic RAG chatbot for regional technical teams',link:null,
m:[['95%','Lower query latency'],['60%','Query efficiency gain'],['Hindi + English','Languages']],
p:'Regional technical teams queried domain-specific documentation through blocking SQL/API calls that were slow to respond.',
b:'Birbal 2.0, a multilingual agentic RAG chatbot on FastAPI for regional technical teams.',
t:'Asynchronous retrieval replacing blocking SQL/API calls, Hindi–English support and contextual state tracking.',
r:'Query response latency cut by 95% and query efficiency improved by 60%.',
s:['FastAPI','RAG','NLP','Async'],
f:[['Query','Hindi · English'],['Context','State tracking'],['Async retrieval','Docs',1],['Answer','Grounded reply']]}];
let cur='dp';
const feat=document.getElementById('feat'),pg=document.getElementById('pg');
function fcard(p){return `<div class="ctop"><div><h3>${p.name}</h3><p class="sub" style="font-size:14px">${p.sub}</p></div>${p.link?`<a class="gh" href="${p.link}" target="_blank" rel="noopener" aria-label="${p.name} on GitHub">↗</a>`:`<div class="gl"><small>Repository coming soon</small><span class="gh off">↗</span></div>`}</div>
<div class="mt">${p.m.map(x=>`<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>
<div class="c2"><div><h6>Problem</h6><p>${p.p}</p><h6>What I built</h6><p>${p.b}</p></div><div><h6>Technical approach</h6><p>${p.t}</p><h6>Result</h6><p>${p.r}</p></div></div>
<div class="tg">${p.s.map(x=>`<span>${x}</span>`).join('')}</div>
<div class="arch">${p.f.map((x,i)=>`${i?'<i>→</i>':''}<span class="${x[2]?'hl':''}">${x[0]}<small>${x[1]}</small></span>`).join('')}</div>`}
function render(scroll){const p=PR.find(x=>x.id===cur);feat.innerHTML=fcard(p);pg.innerHTML='';
PR.filter(x=>x.id!==cur).forEach(x=>{const c=document.createElement('div');c.className='card pc';c.tabIndex=0;c.setAttribute('role','button');
c.innerHTML=`<div class="eye">${x.tag}</div><h4>${x.name}</h4><p>${x.sub}</p><div class="tg">${x.s.slice(0,4).map(y=>`<span>${y}</span>`).join('')}</div><div class="go">View full breakdown →</div>`;
const go=()=>{cur=x.id;render(true)};c.onclick=go;c.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}};pg.appendChild(c)});
if(scroll)feat.scrollIntoView({behavior:'smooth',block:'start'})}
render(false);
const CERTS=[{n:'Google Cloud Skill Badges',s:'25+ badges earned'},{n:'Java Gold Badge',s:'HackerRank'}]; /* add {n:'Name',s:'Issuer',file:'./assets/certificates/file.pdf'} */
const cg=document.getElementById('cg');CERTS.forEach(c=>{const e=document.createElement(c.file?'a':'div');e.className='card rv';if(c.file){e.href=c.file;e.target='_blank';e.rel='noopener'}e.innerHTML=`<h4>${c.n}</h4><p>${c.s}</p>`;cg.appendChild(e);io.observe(e)});
const SK=[['Programming',['Python','SQL','Java','JavaScript']],['AI / ML',['Scikit-learn','PyTorch','TensorFlow','XGBoost','SHAP','NLP']],['LLMs & Agents',['LLMs','RAG','Agentic AI','MCP','LangChain','Qdrant']],['Data Engineering',['Apache Spark','Databricks','Delta Lake','Pandas','ETL/ELT Pipelines','Data Validation']],['Backend',['FastAPI','Flask','REST APIs','PostgreSQL']],['Cloud & Tools',['Docker','Git & GitHub','Microsoft Azure','IBM watsonx']]];
const sg=document.getElementById('sg');SK.forEach(([c,i])=>{const d=document.createElement('div');d.className='card rv';d.innerHTML=`<h5>${c}</h5><ul>${i.map(x=>`<li>${x}</li>`).join('')}</ul>`;sg.appendChild(d);io.observe(d)});

const mb=document.getElementById('mb'),mm=document.getElementById('mm');
mb.onclick=()=>{const o=mm.classList.toggle('open');mb.classList.toggle('open',o);mb.setAttribute('aria-expanded',o)};
mm.querySelectorAll('a').forEach(a=>a.onclick=()=>{mm.classList.remove('open');mb.classList.remove('open')});
const na=[...document.querySelectorAll('#nv a')],so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)na.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
na.forEach(a=>{const t=document.querySelector(a.getAttribute('href'));t&&so.observe(t)});
const cl=()=>{mm.classList.remove('open');mb.classList.remove('open');mb.setAttribute('aria-expanded','false')};
document.addEventListener('keydown',e=>{if(e.key==='Escape')cl()});document.addEventListener('click',e=>{if(!e.target.closest('nav'))cl()});
