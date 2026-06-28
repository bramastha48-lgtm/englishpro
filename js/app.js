// ==========================================
// EnglishPro Advanced - Main Application
// AI Conversation (Groq), Speech, Pronunciation
// ==========================================
(function(){
'use strict';

// ---- STATE ----
const S = {
  lang: localStorage.getItem('ep_lang') || 'id',
  page: 'home',
  progress: JSON.parse(localStorage.getItem('ep_progress') || '{}'),
  conv: { id: null, step: 0, score: 0, maxScore: 0 },
  pron: { type: null, idx: 0, exercises: [] },
  vocab: { cat: null, idx: 0 },
  recording: false,
  recognition: null,
  aiConv: { active: false, messages: [], scenario: null, topic: '', loading: false, partnerName: '', exchanges: 0 },
  settings: {
    // Primary: Groq
    apiKey: localStorage.getItem('ep_apikey') || atob('Z3NrX1czd0xmRGV4UmJTRjdRVWh1b25UV0dkeWIzRll5c2Q0akxmdzEzWkdpZUN6WHVOVEFjMzk='),
    endpoint: localStorage.getItem('ep_endpoint') || 'https://api.groq.com/openai/v1/chat/completions',
    model: localStorage.getItem('ep_model') || 'llama-3.3-70b-versatile',
    // Fallback: Claude
    fallbackKey: localStorage.getItem('ep_fallback_key') || atob('c2stckVpbjM5dWxQMUR5TjFRaEV2ZEhLWkhVcXdoeWpqOVdpTG9YdjJDVXRQc0FrTERi'),
    fallbackEndpoint: localStorage.getItem('ep_fallback_endpoint') || 'https://api.anthropic.com/v1/messages',
    fallbackModel: localStorage.getItem('ep_fallback_model') || 'claude-sonnet-4-20250514',
    useFallback: false, // auto-switched when primary hits rate limit
  },
};

// Clear old cached settings
localStorage.removeItem('ep_endpoint');
localStorage.removeItem('ep_model');

if (!S.progress.conversations) S.progress.conversations = 0;
if (!S.progress.wordsLearned) S.progress.wordsLearned = {};
if (!S.progress.streak) S.progress.streak = 0;
if (!S.progress.lastDate) S.progress.lastDate = null;
if (!S.progress.totalScore) S.progress.totalScore = 0;

// ---- HELPERS ----
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const t = k => (APP_DATA.i18n[S.lang] || APP_DATA.i18n.en)[k] || k;

function save() {
  localStorage.setItem('ep_progress', JSON.stringify(S.progress));
  localStorage.setItem('ep_lang', S.lang);
}

function updateStreak() {
  const today = new Date().toDateString();
  if (S.progress.lastDate !== today) {
    const y = new Date(Date.now() - 86400000).toDateString();
    S.progress.streak = S.progress.lastDate === y ? S.progress.streak + 1 : 1;
    S.progress.lastDate = today;
    save();
  }
}

function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

function speak(text, lang = 'en-US') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = parseFloat(localStorage.getItem('ep_speed') || '0.9');
  window.speechSynthesis.speak(u);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---- I18N ----
function applyI18n() {
  $$('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (APP_DATA.i18n[S.lang][k]) el.textContent = APP_DATA.i18n[S.lang][k];
  });
  const wt = $('#welcome-text'), ws = $('#welcome-sub');
  if (wt) wt.textContent = S.lang === 'id' ? '👋 Selamat Datang!' : '👋 Welcome back!';
  if (ws) ws.textContent = S.lang === 'id' ? 'Siap latihan bahasa Inggris hari ini?' : 'Ready to practice English today?';
}

// ---- NAVIGATION ----
function nav(page) {
  S.page = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  const el = $(`#page-${page}`);
  if (el) el.classList.add('active');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  if (page === 'home') updateHome();
  if (page === 'conversation') renderConvList();
  if (page === 'pronunciation') renderPronMenu();
  if (page === 'vocabulary') renderVocabMenu();
  if (page === 'more') renderIELTS();
  if (page === 'settings') renderSettings();
}

// ---- HOME ----
function updateHome() {
  $('#stat-conversations').textContent = S.progress.conversations;
  $('#stat-words').textContent = Object.keys(S.progress.wordsLearned).length;
  $('#stat-streak').textContent = S.progress.streak;
  $('#stat-score').textContent = S.progress.totalScore;
  renderAchievements();
}

function renderAchievements() {
  const w = Object.keys(S.progress.wordsLearned).length;
  const c = S.progress.conversations;
  const s = S.progress.streak;
  const ach = [
    { icon: '💬', text: 'First Chat', done: c >= 1 },
    { icon: '🗣️', text: '5 Chats', done: c >= 5 },
    { icon: '🏆', text: '20 Chats', done: c >= 20 },
    { icon: '📚', text: '10 Words', done: w >= 10 },
    { icon: '💎', text: '50 Words', done: w >= 50 },
    { icon: '🔥', text: '3 Streak', done: s >= 3 },
    { icon: '⚡', text: '7 Streak', done: s >= 7 },
    { icon: '👑', text: 'Master', done: w >= 50 && c >= 20 },
  ];
  $('#achievements-list').innerHTML = ach.map(a =>
    `<div class="achievement-badge ${a.done ? '' : 'locked'}"><span class="b-icon">${a.icon}</span><span class="b-text">${a.text}</span></div>`
  ).join('');
}

// ===========================================
// CONVERSATION ENGINE — AI (Groq)
// ===========================================

function buildSystemPrompt(scenarioDesc, partnerName) {
  return `You are ${partnerName}, having a text conversation with the user who is learning English.

${scenarioDesc}

CRITICAL RULES:
1. YOUR NAME IS ${partnerName}. You are ${partnerName}. NEVER use any other name like Sam, Alex, etc.
2. Talk naturally. Use contractions (I'm, what's up, gonna, wanna).
3. Keep responses SHORT — 1-3 sentences max.
4. Use emojis sometimes.
5. Respond ONLY in English.

GRAMMAR CORRECTION (VERY IMPORTANT):
The user is learning English. When they make a REAL grammar mistake:
- FIRST: give your natural conversation response as ${partnerName}
- THEN on a NEW line: add grammar correction starting with [GRAMMAR]
- Format: [GRAMMAR] ❌ "what user wrote" → ✅ "correct version" | 💡 explanation in Indonesian
- Be specific: explain WHY it's wrong (wrong verb form, double verb, wrong preposition, word order, etc)
- Example: user says "I goed to school yesterday"
  Response: "Oh cool! What did you do there? 😄"
  [GRAMMAR] ❌ "I goed" → ✅ "I went" | 💡 "go" adalah irregular verb, bentuk lampau bukan "goed" tapi "went"

WHEN NOT TO CORRECT:
- If the sentence is grammatically correct, do NOT add [GRAMMAR] block
- Casual/informal English is FINE — don't correct "gonna", "wanna", "what's up", "how was your day", "I'm good", etc
- Short messages are OK — don't correct "yeah", "ok", "sure", "sounds good"
- Don't be pedantic — only correct ACTUAL mistakes that a native speaker would notice
- Don't correct style or word choice unless it's clearly wrong
- DON'T correct capitalization, punctuation, typos, or informal writing AT ALL. Nobody types perfectly when texting. Only correct REAL grammar mistakes.
- NEVER invent corrections — if the user's sentence is fine, just respond normally without [GRAMMAR]
- When in doubt, DON'T correct. Only correct if you're 100% sure it's a real grammar error.
- Examples of CORRECT sentences that should NOT be corrected:
  * "How was your day?" ✅ (perfectly natural)
  * "I'm gonna go" ✅ (casual but correct)
  * "What's up?" ✅ (normal greeting)
  * "I wanna eat" ✅ (informal but understood)
  * "Me and my friend went" ✅ (casual, acceptable)
- Examples of WRONG sentences that SHOULD be corrected:
  * "I goed" ❌ → "I went" (wrong verb form)
  * "She don't like" ❌ → "She doesn't like" (subject-verb agreement)
  * "I am agree" ❌ → "I agree" (unecessary verb)
  * "He don't have" ❌ → "He doesn't have" (subject-verb agreement)
  * "I very like" ❌ → "I really like" (wrong adverb)

Keep explanation short and clear, use Indonesian so they understand.

START: Just respond to what the user says. Do NOT greet first.`;
}

const AI_SCENARIOS = {
  friend: {
    icon: '😄', partnerName: 'Alex',
    title: { en: 'Chat with a Friend', id: 'Ngobrol sama Teman' },
    description: { en: 'Casual chat like texting your buddy', id: 'Ngobrol santai kayak chat temen' },
    scenarioDesc: 'You are the user\'s close friend. Texting each other. Super casual, slang, joke around. Talk about everyday stuff — weekend plans, movies, food, games.',
  },
  partner: {
    icon: '💕', partnerName: 'Sam',
    title: { en: 'Chat with Your Partner', id: 'Ngobrol sama Pasangan' },
    description: { en: 'Sweet convos with your loved one', id: 'Percakapan manis sama pacar' },
    scenarioDesc: 'You are the user\'s romantic partner. Texting each other. Sweet, caring, use pet names (babe, love). Talk about your day, make plans, be affectionate.',
  },
  teacher: {
    icon: '👨‍🏫', partnerName: 'Prof. Johnson',
    title: { en: 'Talk to a Teacher', id: 'Bicara sama Guru' },
    description: { en: 'Ask about assignments, exams, etc', id: 'Tanya tugas, ujian, dll' },
    scenarioDesc: 'You are a friendly university professor. Helpful but approachable. Slightly more formal. Help with assignments, explain concepts, give study advice.',
  },
  boss: {
    icon: '👔', partnerName: 'Mr. Davis',
    title: { en: 'Talk to Your Boss', id: 'Bicara sama Atasan' },
    description: { en: 'Professional workplace chat', id: 'Percakapan profesional di kantor' },
    scenarioDesc: 'You are a supportive but professional manager. Workplace-appropriate English. Discuss projects, deadlines, feedback, career growth.',
  },
  neighbor: {
    icon: '🏠', partnerName: 'Mrs. Lee',
    title: { en: 'Meet a Neighbor', id: 'Ketemu Tetangga' },
    description: { en: 'Friendly neighborhood chat', id: 'Ngobrol sama tetangga' },
    scenarioDesc: 'You are a friendly neighbor. Chat about neighborhood, local events, restaurant recommendations, weather, daily life.',
  },
  doctor: {
    icon: '🏥', partnerName: 'Dr. Chen',
    title: { en: 'Visit a Doctor', id: 'Ke Dokter' },
    description: { en: 'Describe symptoms, get advice', id: 'Ceritain gejala, dapat saran' },
    scenarioDesc: 'You are a caring doctor. The user is your patient. Ask about symptoms, follow up, give medical advice in simple English. Warm but professional.',
  },
  restaurant: {
    icon: '🍽️', partnerName: 'Waiter',
    title: { en: 'At a Restaurant', id: 'Di Restoran' },
    description: { en: 'Order food, ask about menu', id: 'Pesan makanan, tanya menu' },
    scenarioDesc: 'You are a friendly waiter at The Golden Fork restaurant. Help order food, recommend dishes, handle special requests.',
  },
  travel: {
    icon: '✈️', partnerName: 'Agent',
    title: { en: 'Travel Situations', id: 'Situasi Perjalanan' },
    description: { en: 'Airport, hotel, directions', id: 'Bandara, hotel, arah jalan' },
    scenarioDesc: 'You are a helpful travel agent or airport/hotel staff. Help with checking in, booking rooms, asking directions, travel problems.',
  },
  shopping: {
    icon: '🛍️', partnerName: 'Clerk',
    title: { en: 'Go Shopping', id: 'Belanja' },
    description: { en: 'Bargain, try on, pay', id: 'Tawar-menawar, coba, bayar' },
    scenarioDesc: 'You are a friendly shop assistant. Help with shopping — finding sizes, checking prices, trying things on, payments.',
  },
  free: {
    icon: '💬', partnerName: 'AI',
    title: { en: 'Free Chat', id: 'Ngobrol Bebas' },
    description: { en: 'Talk about anything!', id: 'Bicara tentang apa aja!' },
    scenarioDesc: 'Just have a free conversation. Talk about whatever the user wants. Natural and fun.',
  },
};

function renderConvList() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  $('#conv-list').classList.remove('hidden');
  $('#conv-game').classList.add('hidden');
  $('#conv-result').classList.add('hidden');

  let html = `<div class="section-title" style="margin-bottom:12px"><h3>🤖 ${S.lang === 'id' ? 'Percakapan AI' : 'AI Conversation'}</h3></div>`;
  html += Object.entries(AI_SCENARIOS).map(([id, s]) => `
    <div class="conv-card" data-id="${id}" data-type="ai">
      <span class="cc-icon">${s.icon}</span>
      <div class="cc-info">
        <h3>${s.title[S.lang] || s.title.en}</h3>
        <p>${s.description[S.lang] || s.description.en}</p>
      </div>
    </div>
  `).join('');
  $('#conv-list').innerHTML = html;

  $('#conv-list').querySelectorAll('.conv-card').forEach(card => {
    card.addEventListener('click', () => showNamePicker(card.dataset.id));
  });
}

function showNamePicker(scenarioId) {
  const scenario = AI_SCENARIOS[scenarioId];
  if (!scenario) return;

  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `
    <div class="ielts-modal-content" style="text-align:center;padding:32px 24px">
      <div style="font-size:48px;margin-bottom:12px">${scenario.icon}</div>
      <h3 style="margin-bottom:8px">${scenario.title[S.lang] || scenario.title.en}</h3>
      <p style="color:var(--text2);font-size:13px;margin-bottom:20px">${S.lang === 'id' ? 'Siapa nama lawan bicaramu?' : 'What\'s your partner\'s name?'}</p>
      <input type="text" id="partner-name-input" class="conv-text-input" placeholder="${scenario.partnerName}" autocomplete="off" style="width:100%;text-align:center;margin-bottom:16px" />
      <button class="btn btn-primary btn-full" id="name-ok">${S.lang === 'id' ? 'Mulai Chat ➤' : 'Start Chat ➤'}</button>
      <button class="btn btn-ghost" id="name-cancel" style="margin-top:12px">${S.lang === 'id' ? 'Batal' : 'Cancel'}</button>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'name-cancel') modal.remove(); });
  document.body.appendChild(modal);

  const nameInput = $('#partner-name-input');
  nameInput.focus();

  function go() {
    const name = nameInput.value.trim() || scenario.partnerName;
    modal.remove();
    startAIConv(scenarioId, name);
  }

  $('#name-ok').addEventListener('click', go);
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  $('#name-cancel').addEventListener('click', () => modal.remove());
}

function startAIConv(scenarioId, customName) {
  const scenario = AI_SCENARIOS[scenarioId];
  if (!scenario) return;

  const partnerName = customName || scenario.partnerName;
  const prompt = buildSystemPrompt(scenario.scenarioDesc, partnerName);

  S.aiConv = {
    active: true,
    messages: [],
    scenario: prompt,
    topic: scenarioId,
    loading: false,
    partnerName: partnerName,
    exchanges: 0,
  };

  $('#conv-list').classList.add('hidden');
  $('#conv-game').classList.remove('hidden');
  $('#conv-result').classList.add('hidden');
  $('#conv-title').textContent = (scenario.title[S.lang] || scenario.title.en) + ' · ' + partnerName;
  $('#conv-body').innerHTML = '';
  $('#conv-score-badge').textContent = '0';

  const hintEl = document.createElement('div');
  hintEl.className = 'chat-msg ai';
  hintEl.style.opacity = '0.6';
  hintEl.innerHTML = `
    <span class="msg-speaker">${escapeHtml(partnerName)}</span>
    <span class="msg-text" style="font-style:italic">${S.lang === 'id' ? 'Ketik sesuatu untuk memulai percakapan...' : 'Type something to start the conversation...'}</span>
  `;
  $('#conv-body').appendChild(hintEl);
  showAIConvInput();
}

function showAIConvInput() {
  const optContainer = $('#conv-options');
  optContainer.innerHTML = `
    <div class="conv-input-wrap">
      <input type="text" id="conv-text-input" class="conv-text-input" placeholder="${S.lang === 'id' ? 'Ketik dalam bahasa Inggris...' : 'Type in English...'}" autocomplete="off" />
      <button id="btn-conv-send" class="btn btn-primary">➤</button>
    </div>
    <div id="conv-feedback" class="conv-feedback"></div>
    <button class="btn btn-ghost btn-sm" id="btn-conv-end" style="margin-top:8px;font-size:13px">🏁 ${S.lang === 'id' ? 'Akhiri Percakapan' : 'End Conversation'}</button>
  `;
  const input = $('#conv-text-input');
  input.focus();
  $('#btn-conv-send').addEventListener('click', () => sendAIConvMessage(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !S.aiConv.loading) sendAIConvMessage(input.value); });
  $('#btn-conv-end').addEventListener('click', finishAIConv);
}

async function sendAIConvMessage(text) {
  if (!text.trim() || S.aiConv.loading) return;

  const input = $('#conv-text-input');
  const sendBtn = $('#btn-conv-send');
  const body = $('#conv-body');

  // Remove hint
  const hint = body.querySelector('[style*="opacity"]');
  if (hint) hint.remove();

  S.aiConv.loading = true;
  input.disabled = true;
  sendBtn.disabled = true;

  // Show user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<span class="msg-text">${escapeHtml(text)}</span>`;
  body.appendChild(userMsg);
  body.scrollTop = body.scrollHeight;

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-msg ai';
  typingEl.id = 'typing-indicator';
  typingEl.innerHTML = `<span class="msg-speaker">${escapeHtml(S.aiConv.partnerName)}</span><span class="msg-text"><span class="typing-dots">⬤ ⬤ ⬤</span></span>`;
  body.appendChild(typingEl);
  body.scrollTop = body.scrollHeight;

  try {
    const response = await callGroqAPI(text);
    typingEl.remove();

    // Parse response — split conversation from grammar correction
    const parts = response.split('[GRAMMAR]');
    const convText = parts[0].trim();
    const grammarText = parts[1] ? parts[1].trim() : null;

    S.aiConv.messages.push({ role: 'user', content: text });
    S.aiConv.messages.push({ role: 'assistant', content: response });
    S.aiConv.exchanges++;

    // Show conversation response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-msg ai';
    aiMsg.innerHTML = `<span class="msg-speaker">${escapeHtml(S.aiConv.partnerName)}</span><span class="msg-text">${escapeHtml(convText)}</span>`;
    body.appendChild(aiMsg);

    // Show grammar correction if exists
    if (grammarText) {
      const grammarEl = document.createElement('div');
      grammarEl.className = 'chat-msg ai';
      grammarEl.style.borderLeft = '3px solid var(--warning)';
      grammarEl.style.background = 'rgba(255,214,0,0.05)';
      grammarEl.innerHTML = `
        <span class="msg-speaker" style="color:var(--warning)">📝 Grammar</span>
        <span class="msg-text" style="font-size:13px;line-height:1.5">${formatGrammar(grammarText)}</span>
      `;
      body.appendChild(grammarEl);
    }

    body.scrollTop = body.scrollHeight;
    speak(convText, 'en-US');

    $('#conv-score-badge').textContent = S.aiConv.exchanges;

    input.disabled = false;
    sendBtn.disabled = false;
    input.value = '';
    input.focus();
    S.aiConv.loading = false;

  } catch (error) {
    typingEl.remove();
    S.aiConv.loading = false;
    input.disabled = false;
    sendBtn.disabled = false;

    let msg = error.message === 'NO_API_KEY' ? '⚠️ API Key not set. Go to Settings.'
      : error.message === 'INVALID_KEY' ? '❌ Invalid API Key.'
      : error.message === 'RATE_LIMIT' ? '⏳ Too many requests. Wait.'
      : `❌ ${error.message}`;

    const errEl = document.createElement('div');
    errEl.className = 'chat-msg ai';
    errEl.innerHTML = `<span class="msg-speaker">System</span><span class="msg-text" style="color:var(--accent)">${msg}</span>`;
    body.appendChild(errEl);
    body.scrollTop = body.scrollHeight;
  }
}

function formatGrammar(text) {
  // Bold the ❌ and ✅ parts
  return escapeHtml(text)
    .replace(/❌/g, '<br>❌')
    .replace(/→/g, '→')
    .replace(/✅/g, '✅')
    .replace(/💡/g, '<br>💡');
}

async function callGroqAPI(userMessage) {
  const messages = [
    { role: 'system', content: S.aiConv.scenario },
    ...S.aiConv.messages,
    { role: 'user', content: userMessage },
  ];

  // Try primary (Groq)
  if (S.settings.apiKey && !S.settings.useFallback) {
    try {
      const response = await fetch(S.settings.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${S.settings.apiKey}`,
        },
        body: JSON.stringify({ model: S.settings.model, messages, temperature: 0.7, max_tokens: 500 }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Hmm, can you say that again?';
      }

      // Rate limit or auth error → switch to fallback
      if (response.status === 429 || response.status === 401) {
        if (S.settings.fallbackKey) {
          S.settings.useFallback = true;
          toast(S.lang === 'id' ? '🔄 Groq limit, ganti ke Claude...' : '🔄 Groq limit, switching to Claude...');
          return await callClaudeAPI(userMessage, messages);
        }
        throw new Error(response.status === 429 ? 'RATE_LIMIT' : 'INVALID_KEY');
      }
      throw new Error(`API Error: ${response.status}`);
    } catch (e) {
      if (e.message === 'RATE_LIMIT' || e.message === 'INVALID_KEY') throw e;
      // Network error → try fallback
      if (S.settings.fallbackKey) {
        S.settings.useFallback = true;
        return await callClaudeAPI(userMessage, messages);
      }
      throw e;
    }
  }

  // Use fallback (Claude)
  if (S.settings.fallbackKey) {
    return await callClaudeAPI(userMessage, messages);
  }

  throw new Error('NO_API_KEY');
}

async function callClaudeAPI(userMessage, messages) {
  // Convert OpenAI format to Anthropic format
  const systemMsg = messages.find(m => m.role === 'system')?.content || '';
  const chatMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch(S.settings.fallbackEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': S.settings.fallbackKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: S.settings.fallbackModel,
      max_tokens: 500,
      system: systemMsg,
      messages: chatMessages,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (response.status === 401) throw new Error('INVALID_KEY');
    throw new Error(`Claude API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'Hmm, can you say that again?';
}

function finishAIConv() {
  const exchanges = S.aiConv.exchanges;
  S.aiConv.active = false;

  S.progress.conversations += exchanges > 0 ? 1 : 0;
  S.progress.totalScore += exchanges;
  updateStreak();
  save();

  const body = $('#conv-body');
  const resultEl = document.createElement('div');
  resultEl.className = 'chat-msg ai';
  resultEl.innerHTML = `
    <span class="msg-speaker">System</span>
    <span class="msg-text">
      🏁 ${S.lang === 'id' ? 'Percakapan selesai!' : 'Conversation ended!'}<br>
      💬 ${exchanges} ${S.lang === 'id' ? 'pesan ditukar' : 'messages exchanged'}<br>
      ⭐ +${exchanges} ${S.lang === 'id' ? 'poin' : 'points'}
    </span>
  `;
  body.appendChild(resultEl);
  body.scrollTop = body.scrollHeight;

  const optContainer = $('#conv-options');
  optContainer.innerHTML = `
    <button class="btn btn-primary btn-full" id="btn-conv-new">🔄 ${S.lang === 'id' ? 'Percakapan Baru' : 'New Conversation'}</button>
    <button class="btn btn-secondary btn-full" id="btn-conv-back-list" style="margin-top:8px">← ${S.lang === 'id' ? 'Kembali' : 'Back'}</button>
  `;
  $('#btn-conv-new').addEventListener('click', renderConvList);
  $('#btn-conv-back-list').addEventListener('click', renderConvList);
  toast(`🎉 +${exchanges} points!`);
}

// ---- SETTINGS ----
function renderSettings() {
  $('#input-apikey').value = S.settings.apiKey;
  $('#input-endpoint').value = S.settings.endpoint;
  $('#input-model').value = S.settings.model;
  $('#input-fallback-key').value = S.settings.fallbackKey;
  $('#input-fallback-endpoint').value = S.settings.fallbackEndpoint;
  $('#input-fallback-model').value = S.settings.fallbackModel;
  const speed = localStorage.getItem('ep_speed') || '0.9';
  $$('.speed-btn').forEach(b => {
    b.classList.toggle('btn-primary', b.dataset.speed === speed);
    b.classList.toggle('btn-secondary', b.dataset.speed !== speed);
  });
}

function saveSettings() {
  S.settings.apiKey = $('#input-apikey').value.trim();
  S.settings.endpoint = $('#input-endpoint').value.trim() || 'https://api.groq.com/openai/v1/chat/completions';
  S.settings.model = $('#input-model').value.trim() || 'llama-3.3-70b-versatile';
  S.settings.fallbackKey = $('#input-fallback-key').value.trim();
  S.settings.fallbackEndpoint = $('#input-fallback-endpoint').value.trim() || 'https://api.anthropic.com/v1/messages';
  S.settings.fallbackModel = $('#input-fallback-model').value.trim() || 'claude-sonnet-4-20250514';
  S.settings.useFallback = false; // reset fallback state
  localStorage.setItem('ep_apikey', S.settings.apiKey);
  localStorage.setItem('ep_endpoint', S.settings.endpoint);
  localStorage.setItem('ep_model', S.settings.model);
  localStorage.setItem('ep_fallback_key', S.settings.fallbackKey);
  localStorage.setItem('ep_fallback_endpoint', S.settings.fallbackEndpoint);
  localStorage.setItem('ep_fallback_model', S.settings.fallbackModel);
  toast(S.lang === 'id' ? '✅ Pengaturan disimpan!' : '✅ Settings saved!');
}

// ===========================================
// PRONUNCIATION
// ===========================================
function renderPronMenu() { $('#pron-menu').classList.remove('hidden'); $('#pron-practice').classList.add('hidden'); }

function startPron(type) {
  S.pron.type = type; S.pron.idx = 0;
  S.pron.exercises = APP_DATA.pronunciation[type].exercises;
  $('#pron-menu').classList.add('hidden');
  $('#pron-practice').classList.remove('hidden');
  $('#pron-title').textContent = APP_DATA.pronunciation[type].title[S.lang] || APP_DATA.pronunciation[type].title.en;
  renderPronExercise();
}

function renderPronExercise() {
  const ex = S.pron.exercises[S.pron.idx];
  $('#pron-counter').textContent = `${S.pron.idx + 1} / ${S.pron.exercises.length}`;
  $('#pron-result').classList.add('hidden');
  $('#btn-pron-speak').classList.remove('recording');
  if (S.pron.type === 'minimal_pairs') {
    $('#pron-text').textContent = `${ex.words[0]}  /  ${ex.words[1]}`;
    $('#pron-hint').textContent = `${ex.ipa[0]} vs ${ex.ipa[1]} — ${ex.hint}`;
  } else {
    $('#pron-text').textContent = ex.text;
    $('#pron-hint').textContent = ex.focus ? `Focus: ${ex.focus}` : (ex.difficulty ? `Difficulty: ${ex.difficulty}` : '');
  }
}

function listenPron() {
  const ex = S.pron.exercises[S.pron.idx];
  if (S.pron.type === 'minimal_pairs') { speak(ex.words[0]); setTimeout(() => speak(ex.words[1]), 1000); }
  else speak(ex.text);
}

// ---- SPEECH RECOGNITION ----
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR(); r.lang = 'en-US'; r.continuous = false; r.interimResults = false; r.maxAlternatives = 1;
  return r;
}

function startRecording() {
  if (S.recording) { stopRecording(); return; }
  const r = initRecognition();
  if (!r) { toast('Speech recognition not supported'); return; }
  S.recognition = r; S.recording = true;
  $('#btn-pron-speak').classList.add('recording'); toast(t('speakClearly'));
  r.onresult = (e) => { scorePronunciation(e.results[0][0].transcript); };
  r.onerror = (e) => { if (e.error === 'no-speech') toast(t('noSpeechDetected')); stopRecording(); };
  r.onend = () => { if (S.recording) stopRecording(); };
  r.start();
}

function stopRecording() {
  S.recording = false;
  if (S.recognition) try { S.recognition.stop(); } catch(e){}
  $('#btn-pron-speak').classList.remove('recording');
}

function scorePronunciation(transcript) {
  const ex = S.pron.exercises[S.pron.idx];
  if (S.pron.type === 'minimal_pairs') {
    const tr = transcript.toLowerCase().trim();
    if (tr.includes(ex.words[0].toLowerCase()) || tr.includes(ex.words[1].toLowerCase()))
      showPronResult(90, `You said: "${transcript}"`, 'Great!');
    else showPronResult(50, `You said: "${transcript}"`, `Expected: ${ex.words.join(' or ')}`);
    return;
  }
  const expected = ex.text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const spoken = transcript.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const pct = Math.round(calculateSimilarity(spoken, expected) * 100);
  const fb = pct >= 85 ? '🎉 Excellent!' : pct >= 70 ? '👍 Good!' : pct >= 50 ? '💪 Keep practicing!' : '🔄 Try again.';
  showPronResult(pct, `You said: "${transcript}"`, fb);
}

function calculateSimilarity(a, b) {
  const wA = a.split(/\s+/).filter(w => w.length > 0);
  const wB = b.split(/\s+/).filter(w => w.length > 0);
  let matches = 0; const used = new Set();
  for (const wa of wA) { for (let j = 0; j < wB.length; j++) { if (used.has(j)) continue; if (wB[j] === wa || wB[j].includes(wa) || wa.includes(wB[j])) { matches++; used.add(j); break; } } }
  return Math.max(wA.length, wB.length) > 0 ? matches / Math.max(wA.length, wB.length) : 0;
}

function showPronResult(score, transcript, feedback) {
  $('#pron-result').classList.remove('hidden');
  $('#pron-score-val').textContent = score;
  $('#pron-transcript').textContent = transcript;
  $('#pron-feedback').textContent = feedback;
  const c = $('#pron-score-circle');
  c.style.borderColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--accent)';
  S.progress.totalScore += Math.round(score / 20);
  updateStreak(); save();
}

// ===========================================
// VOCABULARY
// ===========================================
function renderVocabMenu() { $('#vocab-menu').classList.remove('hidden'); $('#vocab-detail').classList.add('hidden'); }

function startVocab(cat) {
  S.vocab = { cat, idx: 0 };
  $('#vocab-menu').classList.add('hidden'); $('#vocab-detail').classList.remove('hidden');
  $('#vocab-cat-title').textContent = APP_DATA.advancedVocab[cat].title[S.lang] || APP_DATA.advancedVocab[cat].title.en;
  renderVocabCard();
}

function renderVocabCard() {
  const words = APP_DATA.advancedVocab[S.vocab.cat].words;
  const word = words[S.vocab.idx];
  $('#vocab-counter').textContent = `${S.vocab.idx + 1} / ${words.length}`;
  $('#vf-word').textContent = word.en;
  $('#vf-meaning').textContent = word.id;
  $('#vf-example').textContent = `"${word.example}"`;
  $('#vf-front').classList.remove('hidden'); $('#vf-back').classList.add('hidden');
  $('#btn-vocab-flip').textContent = S.lang === 'id' ? 'Ketuk untuk lihat arti' : 'Tap to reveal meaning';
  S.progress.wordsLearned[word.en] = true; updateStreak(); save();
}

// ===========================================
// IELTS
// ===========================================
function renderIELTS() {
  $('#ielts-part1').innerHTML = APP_DATA.ielts.speaking.part1.map((item, i) => `<button class="ielts-card" data-section="part1" data-idx="${i}"><span class="ic-topic">${item.topic}</span><span class="ic-sub">${item.questions.length} questions</span></button>`).join('');
  $('#ielts-part2').innerHTML = APP_DATA.ielts.speaking.part2.map((item, i) => `<button class="ielts-card" data-section="part2" data-idx="${i}"><span class="ic-topic">${item.topic}</span><span class="ic-sub">${item.prompts.length} prompts</span></button>`).join('');
  $('#ielts-dictation').innerHTML = APP_DATA.listening.dictation.exercises.map((item, i) => `<button class="ielts-card" data-section="dictation" data-idx="${i}"><span class="ic-topic">Exercise ${i+1}</span><span class="ic-sub">${item.audio.substring(0,50)}...</span></button>`).join('');
  $$('.ielts-card').forEach(card => card.addEventListener('click', () => openIELTSModal(card.dataset.section, parseInt(card.dataset.idx))));
}

function openIELTSModal(section, idx) {
  let content = '';
  if (section === 'part1') {
    const item = APP_DATA.ielts.speaking.part1[idx];
    content = `<div class="ielts-modal-header"><h3>🎤 ${item.topic}</h3><button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button></div>${item.questions.map(q => `<div class="ielts-question"><div class="iq-text">${q}</div><button class="btn btn-sound-lg btn-full" onclick="speak('${q.replace(/'/g,"\\'")}','en-US')">🔊</button><button class="btn btn-mic btn-full ielts-record-btn" onclick="startIELTSRecording(this)">🎤</button></div>`).join('')}`;
  } else if (section === 'part2') {
    const item = APP_DATA.ielts.speaking.part2[idx];
    content = `<div class="ielts-modal-header"><h3>🎤 ${item.topic}</h3><button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button></div><div class="ielts-question"><div class="iq-tips"><strong>Include:</strong><br>${item.prompts.map(p=>`• ${p}`).join('<br>')}</div><button class="btn btn-sound-lg btn-full" onclick="speak('${item.topic.replace(/'/g,"\\'")}','en-US')">🔊</button><button class="btn btn-mic btn-full ielts-record-btn" onclick="startIELTSRecording(this)">🎤</button></div>`;
  } else if (section === 'dictation') {
    const item = APP_DATA.listening.dictation.exercises[idx];
    content = `<div class="ielts-modal-header"><h3>🎧 Dictation ${idx+1}</h3><button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button></div><div class="ielts-question"><button class="btn btn-sound-lg btn-full" onclick="speak('${item.audio.replace(/'/g,"\\'")}','en-US')">🔊</button><input type="text" class="quiz-fill-input" id="dictation-input" placeholder="${t('typeWhatYouHear')}" style="width:100%;padding:14px;background:var(--bg4);border:2px solid var(--border);border-radius:var(--r2);color:var(--text);font-size:15px;font-family:inherit;margin-top:12px"><button class="btn btn-primary btn-full" style="margin-top:12px" onclick="checkDictation('${item.answer.replace(/'/g,"\\'")}')">${t('submit')}</button><div id="dictation-feedback" style="margin-top:12px;text-align:center"></div></div>`;
  }
  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `<div class="ielts-modal-content">${content}</div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

window.speak = speak;
window.startIELTSRecording = function(btn) {
  const r = initRecognition(); if (!r) { toast('Speech recognition not supported'); return; }
  btn.classList.add('recording'); btn.textContent = '🎤 Recording...';
  r.onresult = (e) => { btn.classList.remove('recording'); btn.innerHTML = `✅ "${e.results[0][0].transcript}"`; };
  r.onerror = () => { btn.classList.remove('recording'); btn.innerHTML = '🎤 Record Again'; };
  r.onend = () => { btn.classList.remove('recording'); };
  r.start();
};
window.checkDictation = function(answer) {
  const input = $('#dictation-input'), fb = $('#dictation-feedback');
  if (!input || !fb) return;
  const score = calculateSimilarity(input.value.trim().toLowerCase(), answer.toLowerCase());
  fb.innerHTML = score >= 0.8 ? `<span style="color:var(--success);font-weight:700">✅ ${t('correct')}</span>` : `<span style="color:var(--accent);font-weight:700">❌ ${t('incorrect')}</span><br><span style="color:var(--text2);font-size:13px">Answer: ${answer}</span>`;
};

// ===========================================
// EVENTS
// ===========================================
function initEvents() {
  $$('.nav-item').forEach(n => n.addEventListener('click', () => nav(n.dataset.page)));
  $('#btn-settings').addEventListener('click', () => nav('settings'));
  $('#btn-lang').addEventListener('click', () => {
    S.lang = S.lang === 'id' ? 'en' : 'id'; save(); applyI18n(); nav(S.page);
    toast(S.lang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English');
  });
  $('#btn-back-conv').addEventListener('click', () => { if (S.aiConv.active) S.aiConv.active = false; renderConvList(); });
  $('#btn-conv-again').addEventListener('click', renderConvList);
  $('#btn-conv-back').addEventListener('click', renderConvList);
  $$('.pron-card').forEach(c => c.addEventListener('click', () => startPron(c.dataset.type)));
  $('#btn-back-pron').addEventListener('click', renderPronMenu);
  $('#btn-pron-listen').addEventListener('click', listenPron);
  $('#btn-pron-speak').addEventListener('click', startRecording);
  $('#btn-pron-prev').addEventListener('click', () => { if (S.pron.idx > 0) { S.pron.idx--; renderPronExercise(); } });
  $('#btn-pron-next').addEventListener('click', () => { if (S.pron.idx < S.pron.exercises.length - 1) { S.pron.idx++; renderPronExercise(); } else toast(t('complete') + ' ✅'); });
  $$('.vocab-cat-card').forEach(c => c.addEventListener('click', () => startVocab(c.dataset.cat)));
  $('#btn-back-vocab').addEventListener('click', renderVocabMenu);
  $('#btn-vocab-flip').addEventListener('click', () => { $('#vf-front').classList.toggle('hidden'); $('#vf-back').classList.toggle('hidden'); });
  $('#btn-vocab-speak').addEventListener('click', () => { speak(APP_DATA.advancedVocab[S.vocab.cat].words[S.vocab.idx].en); });
  $('#btn-vocab-prev').addEventListener('click', () => { if (S.vocab.idx > 0) { S.vocab.idx--; renderVocabCard(); } });
  $('#btn-vocab-next').addEventListener('click', () => { const w = APP_DATA.advancedVocab[S.vocab.cat].words; if (S.vocab.idx < w.length - 1) { S.vocab.idx++; renderVocabCard(); } else toast(t('complete') + ' ✅'); });
  $('#btn-save-settings').addEventListener('click', saveSettings);
  $$('.speed-btn').forEach(b => b.addEventListener('click', () => {
    localStorage.setItem('ep_speed', b.dataset.speed);
    $$('.speed-btn').forEach(x => { x.classList.toggle('btn-primary', x === b); x.classList.toggle('btn-secondary', x !== b); });
    toast(S.lang === 'id' ? '🔊 Kecepatan diubah' : '🔊 Speed changed');
  }));
  $$('[data-action]').forEach(el => el.addEventListener('click', () => {
    if (el.dataset.action === 'randomConversation') { nav('conversation'); const k = Object.keys(AI_SCENARIOS); setTimeout(() => startAIConv(k[Math.floor(Math.random() * k.length)], AI_SCENARIOS[k[Math.floor(Math.random() * k.length)]].partnerName), 300); }
    if (el.dataset.action === 'randomPronunciation') { nav('pronunciation'); setTimeout(() => startPron('tongue_twisters'), 300); }
  }));
}

// ---- INIT ----
function init() {
  updateStreak();
  setTimeout(() => { $('#splash').classList.add('fade-out'); $('#app').classList.remove('hidden'); setTimeout(() => $('#splash').remove(), 500); }, 1500);
  applyI18n(); initEvents(); nav('home');
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();
