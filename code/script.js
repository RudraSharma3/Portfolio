/* reveal */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.08});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

/* Three.js hero: reactive node network */
addEventListener("DOMContentLoaded",function(){
const cv=document.getElementById('gl');if(!window.THREE)return;
const R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(30,1,.1,100);C.position.z=15.5;
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
function rs(){const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;R.setSize(w,h,false);C.aspect=w/h;const d=w>=1100;g.scale.setScalar(d?.82:.62);if(d)C.setViewOffset(w,h,-w*.26,0,w,h);else C.clearViewOffset();C.updateProjectionMatrix()}
rs();new ResizeObserver(rs).observe(cv);
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
const BADGES=[
{f:"responsible-ai-interpretability-transparency",n:"Responsible AI for Developers: Interpretability & Transparency",g:"Responsible AI"},
{f:"responsible-ai-fairness-bias",n:"Responsible AI for Developers: Fairness & Bias",g:"Responsible AI"},
{f:"responsible-ai-privacy-safety",n:"Responsible AI for Developers: Privacy & Safety",g:"Responsible AI"},
{f:"applying-ai-principles-google-cloud",n:"Applying AI Principles with Google Cloud",g:"Responsible AI"},
{f:"skill-genai-apps-gemini-streamlit",n:"Develop GenAI Apps with Gemini and Streamlit",g:"Skill badges"},
{f:"skill-gemini-multimodal-rag",n:"Inspect Rich Documents with Gemini Multimodality and Multimodal RAG",g:"Skill badges"},
{f:"gemini-end-to-end-sdlc",n:"Gemini for end-to-end SDLC",g:"Gemini for…"},
{f:"gemini-devops-engineers",n:"Gemini for DevOps Engineers",g:"Gemini for…"},
{f:"gemini-security-engineers",n:"Gemini for Security Engineers",g:"Gemini for…"},
{f:"gemini-network-engineers",n:"Gemini for Network Engineers",g:"Gemini for…"},
{f:"gemini-cloud-architects",n:"Gemini for Cloud Architects",g:"Gemini for…"},
{f:"gemini-application-developers",n:"Gemini for Application Developers",g:"Gemini for…"},
{f:"gemini-data-scientists-analysts",n:"Gemini for Data Scientists and Analysts",g:"Gemini for…"},
{f:"intro-generative-ai",n:"Introduction to Generative AI",g:"GenAI & ML"},
{f:"intro-vertex-ai-studio",n:"Introduction to Vertex AI Studio",g:"GenAI & ML"},
{f:"intro-image-generation",n:"Introduction to Image Generation",g:"GenAI & ML"},
{f:"image-captioning-models",n:"Create Image Captioning Models",g:"GenAI & ML"},
{f:"attention-mechanism",n:"Attention Mechanism",g:"GenAI & ML"},
{f:"encoder-decoder-architecture",n:"Encoder-Decoder Architecture",g:"GenAI & ML"},
{f:"transformer-models-bert",n:"Transformer Models and BERT Model",g:"GenAI & ML"},
{f:"vector-search-embeddings",n:"Vector Search and Embeddings",g:"GenAI & ML"},
{f:"mlops-generative-ai",n:"Machine Learning Operations (MLOps) for Generative AI",g:"GenAI & ML"}];
const OTHER=[{n:'Java Gold Badge',s:'HackerRank'}];
const cgx=document.getElementById('cg'),cf=document.getElementById('cf'),co=document.getElementById('co');
document.getElementById('bn').textContent=BADGES.length+' Google Cloud badges · Generative AI, Responsible AI, Gemini';
const GR=['All',...new Set(BADGES.map(b=>b.g))];
function showB(g){cf.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===g));cgx.querySelectorAll('.bd').forEach(b=>b.hidden=!(g==='All'||b.dataset.g===g))}
GR.forEach(g=>{const b=document.createElement('button');b.type='button';b.dataset.g=g;b.textContent=g==='All'?'All ('+BADGES.length+')':g;b.onclick=()=>showB(g);cf.appendChild(b)});
let lb;function openLB(b,opener){if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<img alt=""><p></p><button type="button" aria-label="Close">×</button>';document.body.appendChild(lb);const x=()=>{lb.classList.remove('open');lb.opener&&lb.opener.focus()};lb.onclick=x;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lb.classList.contains('open'))x()})}
lb.opener=opener;lb.querySelector('img').src='./assets/certificates/'+b.f+'.png';lb.querySelector('img').alt=b.n+' badge';lb.querySelector('p').textContent=b.n;lb.classList.add('open');lb.querySelector('button').focus()}
BADGES.forEach(b=>{const e=document.createElement('button');e.type='button';e.className='bd';e.dataset.g=b.g;e.setAttribute('aria-label',b.n+' — view badge');
e.innerHTML=`<img src="./assets/certificates/thumbs/${b.f}.webp" alt="${b.n} badge" width="440" height="400" loading="lazy" decoding="async"><span>${b.n}</span>`;e.onclick=()=>openLB(b,e);cgx.appendChild(e)});
showB('All');
OTHER.forEach(c=>{const e=document.createElement('div');e.className='card rv';e.innerHTML=`<h4>${c.n}</h4><p>${c.s}</p>`;co.appendChild(e);io.observe(e)});
const SK=[['Programming',['Python','SQL','Java','JavaScript']],['AI / ML',['Scikit-learn','PyTorch','TensorFlow','XGBoost','SHAP','NLP']],['LLMs & Agents',['LLMs','RAG','Agentic AI','MCP','LangChain','Qdrant']],['Data Engineering',['Apache Spark','Databricks','Delta Lake','Pandas','ETL/ELT Pipelines','Data Validation']],['Backend',['FastAPI','Flask','REST APIs','PostgreSQL']],['Cloud & Tools',['Docker','Git & GitHub','Microsoft Azure','IBM watsonx']]];
const sg=document.getElementById('sg');SK.forEach(([c,i])=>{const d=document.createElement('div');d.className='card rv';d.innerHTML=`<h5>${c}</h5><ul>${i.map(x=>`<li>${x}</li>`).join('')}</ul>`;sg.appendChild(d);io.observe(d)});

const mb=document.getElementById('mb'),mm=document.getElementById('mm');
mb.onclick=()=>{const o=mm.classList.toggle('open');mb.classList.toggle('open',o);mb.setAttribute('aria-expanded',o)};
mm.querySelectorAll('a').forEach(a=>a.onclick=()=>{mm.classList.remove('open');mb.classList.remove('open')});
const na=[...document.querySelectorAll('#nv a')],so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)na.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
na.forEach(a=>{const t=document.querySelector(a.getAttribute('href'));t&&so.observe(t)});
const cl=()=>{mm.classList.remove('open');mb.classList.remove('open');mb.setAttribute('aria-expanded','false')};
document.addEventListener('keydown',e=>{if(e.key==='Escape')cl()});document.addEventListener('click',e=>{if(!e.target.closest('nav'))cl()});
