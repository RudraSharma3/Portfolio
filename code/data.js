/* Content for the interactive parts of the page.
   Edit text here; layout lives in index.html and style.css, behaviour in script.js.
   Rule for this file: every number must come from the resume or a public repo. */

const GH = 'https://github.com/RudraSharma3/';

/* ---- Selected projects: the alternating chapters + their breakdown sheets ----
   flow: [title, subtitle, highlight?] drawn as the figure on each chapter.
   links: [label, url]. Use an empty array and set `note` if the code is private. */
const PROJECTS = [
  {
    id: 'datapurge',
    name: 'DataPurge Studio',
    where: 'BytePX',
    year: '2026',
    line: 'A cleaning engine for the multi-sheet Excel files that one-off Pandas scripts kept breaking.',
    metrics: [['15–20x', 'faster than the ad-hoc scripts it replaced'], ['99.9%', 'processing accuracy'], ['< 2 min', 'per complex multi-sheet workbook']],
    problem: 'Teams were cleaning large, multi-sheet workbooks by hand or with one-off Pandas scripts. It was slow, hard to repeat, and the scripts quietly broke cell formatting, formulas and layout.',
    built: 'An async, multi-tenant web app. Upload a workbook, get schema and anomaly detection, set non-destructive cleaning rules, review flagged rows inline, then export a clean file with the original formatting still in place.',
    how: 'Uploads stream through io.BytesIO buffers on Starlette thread pools. An O(N) lookahead sniffer infers column types and downcasts them. RapidFuzz (C++ underneath) handles fuzzy matching, which made that step about 10x faster. OpenPyXL coordinate mapping keeps styles and formulas where they were. PostgreSQL and SQLAlchemy hold auth, sessions and an audit log.',
    result: 'Complex multi-sheet workbooks clean in under two minutes at 99.9% accuracy, 15–20x faster than the scripts it replaced, and every removed record can be traced.',
    stack: ['FastAPI', 'Pandas', 'OpenPyXL', 'RapidFuzz', 'PostgreSQL', 'SQLAlchemy', 'React', 'Docker'],
    fig: 'How a workbook moves through it',
    flow: [['Upload', 'React wizard'], ['FastAPI', 'Auth · async tasks'], ['Cleaning engine', 'Pandas · OpenPyXL · RapidFuzz', 1], ['PostgreSQL', 'Sessions · audit log'], ['Export', 'Formatting preserved']],
    links: [['Code', GH + 'datapurge-studio'], ['Live demo', 'https://datapurge-studio.vercel.app']],
  },
  {
    id: 'vox',
    name: 'VoxContextEngine',
    where: 'Open source',
    year: '2026',
    line: 'Retrieval that combines vector search with keyword search, so answers stay tied to your documents, exact version strings included.',
    metrics: [['5 / 5', 'eval questions answered from the right source'], ['~1.1 s', 'average answer time in the eval run'], ['2 indexes', 'dense vectors and BM25, fused with RRF']],
    problem: 'Vector search finds the right idea but misses exact tokens like CHUNK_OVERLAP or a version number. Keyword search misses paraphrases. Either way, the LLM fills the gap with a guess.',
    built: 'A FastAPI service that ingests documents, indexes them twice (dense vectors in Qdrant and a sparse BM25 index), fuses both rankings, and has Gemini 2.5 Flash answer only from what was retrieved, with sources attached.',
    how: 'Documents are split into 500-character sliding windows with a 50-character overlap, which keeps them inside MiniLM\'s 256-token limit. all-MiniLM-L6-v2 embeddings (384 dimensions, about 15 ms on CPU) go into Qdrant with HNSW; Rank-BM25 runs alongside. Reciprocal rank fusion (k = 60) merges the two lists. Generation runs at temperature 0.1 with a context-only system prompt. I chose Qdrant over pgvector and FAISS for payload filtering and tenant isolation.',
    result: 'The evaluation suite answered 5 of 5 test questions from the correct source file, at about 1.1 seconds per answer.',
    stack: ['Python', 'FastAPI', 'Qdrant', 'Rank-BM25', 'Sentence Transformers', 'Gemini 2.5 Flash', 'Docker'],
    fig: 'The retrieval path',
    flow: [['Documents', 'Sliding-window chunks'], ['Embed + index', 'MiniLM · HNSW · BM25'], ['Rank fusion', 'RRF, k = 60', 1], ['Gemini 2.5 Flash', 'Context-locked, T = 0.1'], ['Answer', 'With sources']],
    links: [['Code', GH + 'vox-context-engine'], ['Eval output', GH + 'vox-context-engine#-evaluation--verification-benchmarks']],
  },
  {
    id: 'speech',
    name: 'Speech Flaw Lab',
    where: 'Multimodal AI Hackathon, Track C',
    year: '2026',
    line: 'Scores how a speech is delivered and points to the exact words where pacing, pitch or volume slipped. No LLM in the loop.',
    metrics: [['75', 'recordings in the benchmark'], ['0', 'false flags on 290 s of clean audio'], ['75.2%', 'recall at IoU 0.3 (target: 80%)']],
    problem: 'Feedback on spoken delivery tends to be vague ("more energy"), and LLM critiques give a different answer every run. I wanted feedback pinned to timestamps that comes out the same every time.',
    built: 'A pipeline that aligns a recording to its transcript word by word, measures pitch, energy, pauses and clarity, compares them with a clean baseline (or LibriSpeech population norms), and flags regions snapped to word boundaries. Each flag comes with a plain-language reason, and the speech gets a 0–100 score across five dimensions.',
    how: 'Loudness normalisation to 16 kHz mono, voice activity detection, then the Montreal Forced Aligner for word and phoneme boundaries. Parselmouth (Praat) and Librosa extract F0, intensity, HNR and MFCCs. Features are speaker-normalised (semitones and dB relative to the median), scored as robust MAD z-scores, then grouped with hysteresis and snapped to words. FastAPI backend, React + Plotly + Wavesurfer front end, all in Docker.',
    result: 'On a 75-recording benchmark built from five public-domain speeches with flaws injected at five severity levels, it raised zero false flags on clean control audio. Recall at IoU 0.3 reached 75.2% against an 80% target, so that gate is still marked as failing.',
    note: 'The benchmark file keeps the failing gate in. I would rather show the miss than round it up.',
    stack: ['Python', 'FastAPI', 'Montreal Forced Aligner', 'Parselmouth', 'Librosa', 'React', 'Plotly', 'Docker'],
    fig: 'From audio to a flagged word',
    flow: [['Audio + transcript', '16 kHz · loudness-normalised'], ['Forced alignment', 'Word + phoneme boundaries'], ['Acoustic features', 'Praat · Librosa'], ['Robust z-scores', 'vs baseline or population', 1], ['Flags + rubric', 'Snapped to words · 0–100']],
    links: [['Code', GH + 'speech-flaw-lab'], ['Benchmark', GH + 'speech-flaw-lab/blob/main/results/benchmark.json']],
  },
  {
    id: 'aios',
    name: 'AI-OS',
    where: 'Open source',
    year: '2026',
    line: 'Rules, hooks and checks that sit between me and AI coding agents, so every session starts from the same ground truth.',
    metrics: [['1', 'canonical rule file shared by every agent'], ['27-point', 'doctor check on install'], ['10-point', 'gate before a lesson becomes a rule']],
    problem: 'AI coding agents start every session from zero. Instructions drift between tools, the same mistakes come back, and letting an agent rewrite its own rules invites prompt injection.',
    built: 'A versioned operating layer you install into any repo: one canonical AGENTS.md with thin adapters for Claude, Gemini and Codex, playbooks for common work, and a self-improvement loop where lessons are logged as candidates and promoted only after a 10-point check.',
    how: 'Pre-commit hooks block leaked secrets (sk-, AKIA, ghp_ and similar) and dependencies nobody approved, which also catches hallucinated packages. An evidence runner writes execution records, so "all tests pass" has to be backed by a real run. A 27-point doctor checks hook paths, CODEOWNERS and pinned action SHAs. Manager–worker orchestration over MCP fixes interface contracts before code is generated, and static rules sit in a pinned prefix to make prompt-cache hits likely.',
    result: 'Installs into a project in three commands and runs fully offline. Its effect on agent speed and cost hasn\'t been benchmarked yet; that is the next step, and the README says so.',
    stack: ['Shell', 'Python', 'Git hooks', 'MCP', 'Claude Code', 'Gemini', 'Codex'],
    fig: 'Where the rules live',
    flow: [['Engineer', 'Task + prompt contract'], ['AGENTS.md', 'One canonical rule set', 1], ['Adapters', 'CLAUDE.md · GEMINI.md · CODEX.md'], ['Guards', 'Secrets · deps · evidence'], ['Lessons', 'Promoted after a 10-point gate']],
    links: [['Code', GH + 'ai-operating-system']],
  },
  {
    id: 'hours',
    name: 'Hours Reconciliation',
    where: 'BytePX',
    year: '2026',
    line: 'Checks ERP timesheets against what people say they worked, without showing them the ERP number first.',
    metrics: [['8–10 h', 'of manual HR work removed each month'], ['20+', 'employees covered'], ['0', 'tolerance on mismatched hours']],
    problem: 'Every billing cycle, HR compared ERP timesheet hours with employees\' own numbers by chasing people over chat and email. Showing the recorded hours up front also nudged people towards agreeing with them.',
    built: 'An end-to-end flow: pull hours from the ERP, ask each employee to confirm theirs through a Google Chat bot or a single-use magic link, reconcile, and flag anything that doesn\'t match for HR.',
    how: 'Next.js and TypeScript with Prisma. ERP adapters for CSV files and the live ERPNext REST API, with versioned imports so a re-run doesn\'t double count. Google Chat Cards v2 for the bot; magic links use single-use SHA-256 hashed tokens. Matching is exact: any difference is flagged, with no rounding. A scheduled job sends reminders and escalates to HR after a set number. Unit tests run on Vitest.',
    result: 'Took 8–10 hours of manual work a month off HR across 20+ employees, with an audit log and CSV export behind every decision.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Google Chat API', 'ERPNext', 'Tailwind', 'Vitest'],
    fig: 'One billing cycle',
    flow: [['ERP hours', 'CSV · ERPNext API'], ['Employee confirms', 'Chat bot · magic link'], ['Exact match', 'Any difference is flagged', 1], ['Reminders', 'Then escalation to HR'], ['HR dashboard', 'Audit log · CSV export']],
    links: [['Code', GH + 'Hr_Hours_reconciliation'], ['Live demo', 'https://hr-hours-reconciliation.vercel.app']],
  },
  {
    id: 'birbal',
    name: 'Birbal 2.0',
    where: 'UltraTech Cement (Birla White), internship',
    year: '2025',
    line: 'A Hindi–English chatbot that lets regional technical teams ask questions of their documentation.',
    metrics: [['95%', 'lower query latency'], ['60%', 'better query efficiency'], ['2', 'languages, with context carried across turns']],
    problem: 'Regional technical teams queried domain documentation through a bot that made blocking SQL and API calls, so answers were slow to come back.',
    built: 'Birbal 2.0, a multilingual agentic RAG chatbot on FastAPI for regional technical teams.',
    how: 'Asynchronous retrieval replaced the blocking SQL/API calls. I added Hindi–English support and contextual state tracking, so a follow-up question keeps the context of the one before it.',
    result: 'Query response latency fell by 95% and query efficiency improved by 60%.',
    stack: ['Python', 'FastAPI', 'RAG', 'NLP', 'Async I/O'],
    fig: 'A question, start to finish',
    flow: [['Question', 'Hindi or English'], ['Context', 'State carried across turns'], ['Async retrieval', 'Replaces blocking SQL/API calls', 1], ['Answer', 'Grounded in the docs']],
    links: [],
    note: 'Built inside UltraTech, so the code isn\'t public.',
  },
];

/* ---- How I work: four cards, each opens a sheet with evidence ---- */
const HABITS = [
  {
    title: 'Deterministic where it matters',
    line: 'If a score decides something, it should come out the same every time.',
    body: 'LLMs are good with language and hard to audit. When a project needs a score or a yes/no, I try to compute it, and keep the model for the parts that really are about language.',
    proof: [
      ['Speech Flaw Lab', GH + 'speech-flaw-lab', 'Scores delivery with signal processing and statistics. No LLM, so the same recording gets the same score, byte for byte.'],
      ['Resume Tailor', GH + 'Resume_tailor', 'The ATS score comes from a deterministic engine. The AI only rewrites text, and every number it adds is checked.'],
      ['Hours Reconciliation', GH + 'Hr_Hours_reconciliation', 'Hours either match exactly or get flagged. No rounding, no tolerance.'],
    ],
  },
  {
    title: 'Don\'t invent numbers',
    line: 'Every figure should trace back to something real.',
    body: 'It\'s the rule this site follows, and it shows up in the tools I build. If a number has no source, it gets flagged or stays a visible placeholder.',
    proof: [
      ['Resume Tailor', GH + 'Resume_tailor', 'Any number that isn\'t in your original resume or your own answers is flagged and sent back for a fix.'],
      ['JobPilot', GH + 'JOB_TOOL', 'Drafts are grounded only in information the user actually provided. It never submits anything on its own.'],
      ['Freelance site', GH + 'Freelance', 'Every stat is pulled from my resume. Testimonials stay marked as placeholders until there are real ones.'],
    ],
  },
  {
    title: 'Show the miss',
    line: 'A benchmark that only reports wins isn\'t much of a benchmark.',
    body: 'When something falls short, I write it down next to the result instead of rounding it up. It makes the numbers that did land easier to trust.',
    proof: [
      ['Speech Flaw Lab', GH + 'speech-flaw-lab/blob/main/results/benchmark.json', 'Recall came in at 75.2% against an 80% target, and the benchmark file marks that gate as FAIL.'],
      ['AI-OS', GH + 'ai-operating-system', 'Its effect on agent speed and cost hasn\'t been measured yet, and the README says exactly that.'],
      ['AI-OS evidence runner', GH + 'ai-operating-system', '"All tests pass" only counts if an execution record backs it up.'],
    ],
  },
  {
    title: 'Build the environment, not just the code',
    line: 'Don\'t just use AI to write code. Engineer the environment it writes code in.',
    body: 'I use AI coding agents every day. The interesting part is the scaffolding around them: rules they share, checks they can\'t skip, and lessons that only stick once they\'ve been verified.',
    proof: [
      ['AI-OS', GH + 'ai-operating-system', 'One AGENTS.md for every agent, with thin adapters for Claude, Gemini and Codex.'],
      ['AI-OS hooks', GH + 'ai-operating-system', 'Pre-commit guards block leaked keys and packages nobody approved.'],
      ['Build your own Claude Code', GH + 'codecrafters-claude-code-python', 'I wrote a small coding agent from scratch to understand the loop I rely on every day.'],
    ],
  },
];

/* ---- GitHub archive: everything not featured above, grouped by the year the repo was created ----
   repo: repository name on GitHub. live: deployed URL or null. */
const ARCHIVE = [
  { y: 2026, name: 'Data-Tool', repo: 'Data-Tool', lang: 'Python', tag: 'BytePX', line: 'Data prep studio: pulls from S3, Salesforce, Dynamics 365, Google Sheets and SQL databases, profiles the data, runs 30+ transforms or plain-English commands through a sandboxed agent, and exports back out.' },
  { y: 2026, name: 'StandupPulse', repo: 'ChucklePulse', lang: 'TypeScript', live: 'https://chuckle-pulse.vercel.app', line: 'Google Chat bot that messages each teammate for their standup, turns replies like "project X for 3 hours" into tasks and hours, and builds a dashboard for leads.' },
  { y: 2026, name: 'Resume Tailor', repo: 'Resume_tailor', lang: 'Python', line: 'Tailors a resume to a job description without inventing anything: a computed ATS score, evidence-checked keywords, and edits written back into the Overleaf .tex.' },
  { y: 2026, name: 'JobPilot', repo: 'JOB_TOOL', lang: 'TypeScript', tag: 'In progress', line: 'Job-search copilot. Auth with row-level security, resume upload and parsing are done; job matching is next.' },
  { y: 2026, name: 'Build your own Claude Code', repo: 'codecrafters-claude-code-python', lang: 'Python', line: 'A small coding agent in Python: an agent loop with Read, Write and Bash tools, from the CodeCrafters challenge.' },
  { y: 2026, name: 'Freelance site', repo: 'Freelance', lang: 'TypeScript', live: 'https://freelance-kappa-orpin.vercel.app', line: 'My freelance site, with its own analytics pipeline: event tracking, UTM attribution and a private dashboard on Supabase.' },
  { y: 2026, name: 'ClearSpend', repo: 'ClearSpend', lang: 'Python', line: 'Expense tracker that parses bank SMS messages into categorised transactions. FastAPI and SQLite.' },
  { y: 2026, name: 'SMS Transaction Parser', repo: 'Parser', lang: 'Python', line: 'Two parsers side by side for bank SMS: regex rules, and Gemini structured outputs validated with Pydantic.' },
  { y: 2026, name: 'Vaultic', repo: 'Finova', lang: 'TypeScript', line: 'Personal-finance prototype that estimates how today\'s spending delays a savings goal. Next.js front end, FastAPI with JWT auth.' },
  { y: 2026, name: 'GitHub Zero to Hero', repo: 'github-zero-to-hero', lang: 'Shell', line: 'A hands-on Git and GitHub course where the repository itself follows every practice it teaches.' },
  { y: 2026, name: 'Trader behaviour vs sentiment', repo: 'ds_rudra_sharma', lang: 'Jupyter', line: 'Analysis of trader behaviour against Bitcoin market sentiment (the Fear & Greed index).' },

  { y: 2025, name: 'Estimated Delivery Date', repo: 'Estimated_Delivery_Date', lang: 'Jupyter', line: 'XGBoost model predicting transit days from 500K+ shipment records. R² about 0.85, mean absolute error about 1.2 days.' },
  { y: 2025, name: 'Medical NLP pipeline', repo: 'NOTETAKER', lang: 'Python', line: 'Turns a doctor–patient transcript into structured output: entities, keywords, sentiment and intent, and a SOAP-style summary.' },
  { y: 2025, name: 'AI Empathy Test', repo: 'Reddit_Hackathon', lang: 'Python', tag: 'Hackathon', line: 'Reddit Devvit hackathon entry. People chat with a bot, and a live score tracks how empathetically they treat it.' },
  { y: 2025, name: 'Aave wallet credit score', repo: 'aave-credit-score', lang: 'Python', line: 'Feature engineering on raw Aave V2 transactions and an XGBoost model that scores wallets for creditworthiness.' },
  { y: 2025, name: 'Crypto crash game backend', repo: 'crypto-crash-backend', lang: 'JavaScript', line: 'Real-time crash-style betting game backend: Node, Express, MongoDB and WebSockets.' },
  { y: 2025, name: 'Birla chatbot prototype', repo: 'ChatBot', lang: 'Python', line: 'The first prototype from my UltraTech internship, on sample data, before Birbal 2.0.' },
  { y: 2025, name: 'Bite-sized learning', repo: 'bite-sized-learning', lang: 'JavaScript', line: 'Front-end prototype for building micro-courses out of short videos.' },
  { y: 2025, name: 'Digital CV', repo: 'rudra-digital-cv', lang: 'CSS', line: 'My first portfolio site, built on an HTML5 UP template.' },

  { y: 2024, name: 'LeetCode', repo: 'LeetCode', lang: 'C++', line: '125 solved problems, mostly C++ with some Java and SQL, each with its write-up.' },
  { y: 2024, name: 'Data analysis projects', repo: 'Data-Analysis-Projects', lang: 'Jupyter', line: 'Early notebooks: spam email detection and a Marvel box-office analysis.' },
  { y: 2024, name: 'Laundry management system', repo: 'JAVA-Basic-Project', lang: 'Java', line: 'Java lab final: custom exceptions, interfaces and inheritance in a small management app.' },

  { y: 2023, name: 'Java GUI projects', repo: 'JAVA_GUI_PROJECTS', lang: 'Java', line: 'Early Swing layouts: a calculator, an MCQ screen, GridBag and scroll-bar experiments.' },
];

const YEAR_NOTES = {
  2026: 'Work at BytePX, a hackathon, and a lot of tooling around AI agents.',
  2025: 'Internships at UltraTech and SmartBridge, plus a run of ML assignments and a hackathon.',
  2024: 'Data structures, first ML notebooks, and Java.',
  2023: 'Where it started: Java and Swing.',
};

/* Languages across public repositories (from GitHub, Nov 2026). */
const LANGS = [
  ['Python', 12, '#2e6b5a'],
  ['TypeScript', 5, '#5f8f80'],
  ['JavaScript', 4, '#a9c2b8'],
  ['Jupyter', 3, '#c9a86a'],
  ['Java', 2, '#b07c5a'],
  ['Shell', 2, '#8a8274'],
  ['Other', 3, '#d3c9b7'],
];

/* ---- Google Cloud badges. f = file slug in assets/certificates/ ---- */
const BADGES = [
  { f: 'responsible-ai-interpretability-transparency', n: 'Responsible AI for Developers: Interpretability & Transparency', g: 'Responsible AI' },
  { f: 'responsible-ai-fairness-bias', n: 'Responsible AI for Developers: Fairness & Bias', g: 'Responsible AI' },
  { f: 'responsible-ai-privacy-safety', n: 'Responsible AI for Developers: Privacy & Safety', g: 'Responsible AI' },
  { f: 'applying-ai-principles-google-cloud', n: 'Applying AI Principles with Google Cloud', g: 'Responsible AI' },
  { f: 'skill-genai-apps-gemini-streamlit', n: 'Develop GenAI Apps with Gemini and Streamlit', g: 'Skill badges' },
  { f: 'skill-gemini-multimodal-rag', n: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG', g: 'Skill badges' },
  { f: 'gemini-end-to-end-sdlc', n: 'Gemini for end-to-end SDLC', g: 'Gemini' },
  { f: 'gemini-devops-engineers', n: 'Gemini for DevOps Engineers', g: 'Gemini' },
  { f: 'gemini-security-engineers', n: 'Gemini for Security Engineers', g: 'Gemini' },
  { f: 'gemini-network-engineers', n: 'Gemini for Network Engineers', g: 'Gemini' },
  { f: 'gemini-cloud-architects', n: 'Gemini for Cloud Architects', g: 'Gemini' },
  { f: 'gemini-application-developers', n: 'Gemini for Application Developers', g: 'Gemini' },
  { f: 'gemini-data-scientists-analysts', n: 'Gemini for Data Scientists and Analysts', g: 'Gemini' },
  { f: 'intro-generative-ai', n: 'Introduction to Generative AI', g: 'GenAI & ML' },
  { f: 'intro-vertex-ai-studio', n: 'Introduction to Vertex AI Studio', g: 'GenAI & ML' },
  { f: 'intro-image-generation', n: 'Introduction to Image Generation', g: 'GenAI & ML' },
  { f: 'image-captioning-models', n: 'Create Image Captioning Models', g: 'GenAI & ML' },
  { f: 'attention-mechanism', n: 'Attention Mechanism', g: 'GenAI & ML' },
  { f: 'encoder-decoder-architecture', n: 'Encoder-Decoder Architecture', g: 'GenAI & ML' },
  { f: 'transformer-models-bert', n: 'Transformer Models and BERT Model', g: 'GenAI & ML' },
  { f: 'vector-search-embeddings', n: 'Vector Search and Embeddings', g: 'GenAI & ML' },
  { f: 'mlops-generative-ai', n: 'Machine Learning Operations (MLOps) for Generative AI', g: 'GenAI & ML' },
];
