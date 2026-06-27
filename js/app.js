// ==========================================
// EnglishPro Advanced - Main Application
// Conversation AI (Gemini), Speech Recognition, Pronunciation
// ==========================================
(function(){
'use strict';

// ---- STATE ----
const S = {
  lang: localStorage.getItem('ep_lang') || 'id',
  page: 'home',
  progress: JSON.parse(localStorage.getItem('ep_progress') || '{}'),
  conv: { id: null, step: 0, score: 0, maxScore: 0, history: [], starter: null },
  pron: { type: null, idx: 0, exercises: [] },
  vocab: { cat: null, idx: 0 },
  recording: false,
  recognition: null,
  geminiKey: localStorage.getItem('ep_gemini_key') || '',
  geminiModel: localStorage.getItem('ep_gemini_model') || 'gemini-2.0-flash',
};

// Init progress
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
  localStorage.setItem('ep_gemini_key', S.geminiKey);
  localStorage.setItem('ep_gemini_model', S.geminiModel);
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

function getLevel() {
  const n = Object.keys(S.progress.wordsLearned).length;
  if (n >= 50) return { name: t('advanced'), num: 3 };
  if (n >= 20) return { name: t('intermediate'), num: 2 };
  return { name: t('beginner'), num: 1 };
}

function hasGemini() {
  return S.geminiKey && S.geminiKey.length > 10;
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
  if (page === 'more') { renderIELTS(); renderSettings(); }
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

// ---- SETTINGS ----
function renderSettings() {
  const container = $('#settings-container');
  if (!container) return;

  const statusIcon = hasGemini() ? '🟢' : '🔴';
  const statusText = hasGemini()
    ? (S.lang === 'id' ? 'Terhubung' : 'Connected')
    : (S.lang === 'id' ? 'Belum terhubung' : 'Not connected');

  container.innerHTML = `
    <div class="settings-card">
      <h3>🤖 ${S.lang === 'id' ? 'AI Conversation Engine' : 'AI Conversation Engine'}</h3>
      <p class="settings-desc">${S.lang === 'id'
        ? 'Hubungkan Google Gemini API supaya AI bisa ngobrol bebas dan fleksibel. Tanpa API key, percakapan tetap jalan tapi terbatas pada script.'
        : 'Connect Google Gemini API for free-form AI conversations. Without an API key, conversations still work but are limited to scripts.'}</p>

      <div class="settings-status">${statusIcon} ${statusText}</div>

      <div class="settings-field">
        <label>Gemini API Key</label>
        <div class="settings-input-wrap">
          <input type="password" id="settings-api-key" class="settings-input"
            placeholder="${S.lang === 'id' ? 'Masukkan API key...' : 'Enter API key...'}"
            value="${S.geminiKey}" autocomplete="off" />
          <button class="btn btn-ghost btn-sm" id="btn-toggle-key">👁️</button>
        </div>
        <small class="settings-hint">${S.lang === 'id'
          ? 'Dapatkan gratis di aistudio.google.com'
          : 'Get free at aistudio.google.com'}</small>
      </div>

      <div class="settings-field">
        <label>${S.lang === 'id' ? 'Model' : 'Model'}</label>
        <select id="settings-model" class="settings-select">
          <option value="gemini-2.0-flash" ${S.geminiModel === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash (Fast)</option>
          <option value="gemini-2.5-flash" ${S.geminiModel === 'gemini-2.5-flash' ? 'selected' : ''}>Gemini 2.5 Flash</option>
          <option value="gemini-2.5-pro" ${S.geminiModel === 'gemini-2.5-pro' ? 'selected' : ''}>Gemini 2.5 Pro (Best)</option>
        </select>
      </div>

      <div class="settings-actions">
        <button class="btn btn-primary btn-full" id="btn-save-key">${S.lang === 'id' ? '💾 Simpan' : '💾 Save'}</button>
        <button class="btn btn-secondary btn-full" id="btn-test-key" ${hasGemini() ? '' : 'disabled'}>${S.lang === 'id' ? '🧪 Test Koneksi' : '🧪 Test Connection'}</button>
      </div>

      <div id="settings-test-result" class="settings-test-result"></div>
    </div>
  `;

  // Toggle visibility
  const keyInput = $('#settings-api-key');
  const toggleBtn = $('#btn-toggle-key');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
    });
  }

  // Save
  const saveBtn = $('#btn-save-key');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      S.geminiKey = keyInput.value.trim();
      S.geminiModel = $('#settings-model').value;
      save();
      renderSettings();
      toast(S.lang === 'id' ? '✅ Tersimpan!' : '✅ Saved!');
    });
  }

  // Test
  const testBtn = $('#btn-test-key');
  if (testBtn) {
    testBtn.addEventListener('click', async () => {
      const result = $('#settings-test-result');
      result.innerHTML = '<span class="testing">⏳ Testing...</span>';
      try {
        const response = await callGemini('Say "Hello! I am working." in one short sentence.', []);
        result.innerHTML = `<span class="test-success">✅ ${response}</span>`;
      } catch (e) {
        result.innerHTML = `<span class="test-error">❌ ${e.message}</span>`;
      }
    });
  }
}

// ---- GEMINI API ----
async function callGemini(prompt, history) {
  if (!hasGemini()) throw new Error('No API key');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${S.geminiModel}:generateContent?key=${S.geminiKey}`;

  const contents = [];

  // Add history
  for (const msg of history) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Add current prompt
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      }
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API Error ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '...';
}

// Build system prompt for conversation scenario
function buildConvSystemPrompt(conv) {
  const title = conv.title.en;
  const partner = conv.partnerName || 'Partner';
  const scenario = conv.description.en;
  const level = conv.level;
  const lang = S.lang;

  return `You are ${partner} in a conversation scenario: "${title}".
Context: ${scenario}
Level: ${level}

RULES:
1. You are the ${partner}. Stay in character.
2. Respond naturally and realistically, like a real human conversation.
3. Keep responses SHORT (1-3 sentences max).
4. If the user makes grammar/spelling mistakes, gently correct them by rephrasing in your response (don't explicitly point out errors).
5. After your response, add a line starting with "FEEDBACK:" that rates the user's English (1-3) and briefly explains why. Format: "FEEDBACK: [score] [reason]"
6. Use casual/formal tone matching the scenario (casual for friends, formal for job interview etc.)
7. ${lang === 'id' ? 'After FEEDBACK line, add a TRANSLATION line in Indonesian: "TRANSLATION: [terjemahan]"' : 'No translation needed.'}
8. Drive the conversation forward naturally. Ask follow-up questions when appropriate.

START the conversation with a natural greeting appropriate for the scenario.`;
}

// Build prompt for mid-conversation (non-start)
function buildConvFollowUpPrompt(conv, userMessage) {
  const partner = conv.partnerName || 'Partner';
  const lang = S.lang;

  return `The user said: "${userMessage}"

Respond as ${partner}. Keep it SHORT (1-3 sentences).
${lang === 'id' ? 'Add TRANSLATION line in Indonesian after FEEDBACK.' : ''}

FEEDBACK format: "FEEDBACK: [1-3] [brief reason in English]"
${lang === 'id' ? 'TRANSLATION format: "TRANSLATION: [terjemahan bahasa Indonesia]"' : ''}`;
}

// Parse Gemini response into message + feedback + translation
function parseGeminiResponse(text) {
  let message = text;
  let feedback = null;
  let translation = '';
  let score = 2;

  // Extract FEEDBACK line
  const fbMatch = text.match(/FEEDBACK:\s*(\d)\s*(.*)/i);
  if (fbMatch) {
    score = parseInt(fbMatch[1]);
    feedback = fbMatch[2].trim();
    message = text.substring(0, fbMatch.index).trim();
  }

  // Extract TRANSLATION line
  const trMatch = text.match(/TRANSLATION:\s*(.*)/i);
  if (trMatch) {
    translation = trMatch[1].trim();
    message = message.replace(text.substring(trMatch.index), '').trim();
  }

  // Clean up message
  message = message.replace(/\n\n+/g, '\n').trim();

  return { message, feedback, translation, score };
}

// ---- CONVERSATION ENGINE ----
function renderConvList() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  $('#conv-list').classList.remove('hidden');
  $('#conv-game').classList.add('hidden');
  $('#conv-result').classList.add('hidden');

  const modeLabel = hasGemini()
    ? `<div class="conv-mode-badge gemini">🤖 ${S.lang === 'id' ? 'Mode AI Aktif' : 'AI Mode Active'}</div>`
    : `<div class="conv-mode-badge script">📋 ${S.lang === 'id' ? 'Mode Script' : 'Script Mode'}</div>`;

  $('#conv-list').innerHTML = modeLabel + Object.entries(APP_DATA.conversations).map(([id, c]) => `
    <div class="conv-card" data-id="${id}">
      <span class="cc-icon">${c.icon}</span>
      <div class="cc-info">
        <h3>${c.title[S.lang] || c.title.en}</h3>
        <p>${c.description[S.lang] || c.description.en}</p>
        <span class="cc-level">${t(c.level)}</span>
      </div>
    </div>
  `).join('');

  // Add "Free Talk" card
  $('#conv-list').innerHTML += `
    <div class="conv-card free-talk-card" data-id="__free_talk">
      <span class="cc-icon">🌟</span>
      <div class="cc-info">
        <h3>${S.lang === 'id' ? 'Bebas Bicara' : 'Free Talk'}</h3>
        <p>${S.lang === 'id' ? 'Ngobrol bebas tentang topik apapun' : 'Chat freely about any topic'}</p>
        <span class="cc-level">${hasGemini() ? 'AI' : 'Need API Key'}</span>
      </div>
    </div>
  `;

  $('#conv-list').querySelectorAll('.conv-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.id === '__free_talk') {
        if (!hasGemini()) {
          toast(S.lang === 'id' ? 'Butuh Gemini API key! Buka More → Settings' : 'Need Gemini API key! Go to More → Settings');
          return;
        }
        showFreeTalkStarter();
      } else {
        showConvStarterPicker(card.dataset.id);
      }
    });
  });
}

function showFreeTalkStarter() {
  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `
    <div class="ielts-modal-content" style="text-align:center;padding:32px 24px">
      <div style="font-size:48px;margin-bottom:12px">🌟</div>
      <h3 style="margin-bottom:8px">${S.lang === 'id' ? 'Bebas Bicara' : 'Free Talk'}</h3>
      <p style="color:var(--text2);font-size:13px;margin-bottom:24px">${S.lang === 'id' ? 'Tentang apa kamu mau ngobrol?' : 'What do you want to talk about?'}</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-primary btn-full" data-topic="daily">${S.lang === 'id' ? '☀️ Kehidupan Sehari-hari' : '☀️ Daily Life'}</button>
        <button class="btn btn-primary btn-full" data-topic="hobby">${S.lang === 'id' ? '🎮 Hobi & Minat' : '🎮 Hobbies & Interests'}</button>
        <button class="btn btn-primary btn-full" data-topic="travel">${S.lang === 'id' ? '✈️ Traveling' : '✈️ Traveling'}</button>
        <button class="btn btn-primary btn-full" data-topic="tech">${S.lang === 'id' ? '💻 Teknologi' : '💻 Technology'}</button>
        <button class="btn btn-primary btn-full" data-topic="food">${S.lang === 'id' ? '🍔 Makanan' : '🍔 Food'}</button>
        <button class="btn btn-primary btn-full" data-topic="random">${S.lang === 'id' ? '🎲 Acak' : '🎲 Random'}</button>
      </div>
      <button class="btn btn-ghost" id="ft-cancel" style="margin-top:12px">${S.lang === 'id' ? 'Batal' : 'Cancel'}</button>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'ft-cancel') modal.remove(); });
  document.body.appendChild(modal);

  modal.querySelectorAll('[data-topic]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.remove();
      startFreeTalk(btn.dataset.topic);
    });
  });
}

async function startFreeTalk(topic) {
  const topicNames = {
    daily: { en: 'Daily Life', id: 'Kehidupan Sehari-hari' },
    hobby: { en: 'Hobbies & Interests', id: 'Hobi & Minat' },
    travel: { en: 'Traveling', id: 'Traveling' },
    tech: { en: 'Technology', id: 'Teknologi' },
    food: { en: 'Food', id: 'Makanan' },
    random: { en: 'Random Topic', id: 'Topik Acak' },
  };

  S.conv = {
    id: '__free_talk',
    step: 0,
    score: 0,
    maxScore: 0,
    history: [],
    starter: 'ai',
    topic: topic,
    isFreeTalk: true,
  };

  $('#conv-list').classList.add('hidden');
  $('#conv-game').classList.remove('hidden');
  $('#conv-result').classList.add('hidden');
  $('#conv-title').textContent = topicNames[S.lang] || topicNames.en;
  $('#conv-body').innerHTML = '';
  $('#conv-score-badge').textContent = '0';
  $('#conv-options').innerHTML = '<div class="conv-typing"><span class="typing-dots">●●●</span> AI is thinking...</div>';

  try {
    const systemPrompt = `You are a friendly English conversation partner. The user wants to practice English by talking about "${topicNames.en[topic] || topic}".
RULES:
1. Be warm, friendly, and encouraging.
2. Keep responses SHORT (1-3 sentences).
3. Start with a natural greeting and an opening question about the topic.
4. If the user makes grammar mistakes, gently rephrase their sentence correctly in your response.
5. After your response, add: "FEEDBACK: [1-3] [brief reason]"
6. ${S.lang === 'id' ? 'Add "TRANSLATION: [terjemahan]" after FEEDBACK.' : ''}
7. Ask follow-up questions to keep the conversation going.

START the conversation now.`;

    const aiResponse = await callGemini(systemPrompt, []);
    const parsed = parseGeminiResponse(aiResponse);

    S.conv.history.push({ role: 'model', text: aiResponse });

    addAIMessage(parsed.message, parsed.translation);
    speak(parsed.message, 'en-US');
    showFreeTalkInput();
  } catch (e) {
    $('#conv-options').innerHTML = `<div class="conv-error">❌ ${e.message}</div>`;
  }
}

function showFreeTalkInput() {
  const optContainer = $('#conv-options');
  optContainer.innerHTML = `
    <div class="conv-input-wrap">
      <input type="text" id="conv-text-input" class="conv-text-input"
        placeholder="${S.lang === 'id' ? 'Ketik jawabanmu dalam bahasa Inggris...' : 'Type your answer in English...'}"
        autocomplete="off" />
      <button id="btn-conv-send" class="btn btn-primary">➤</button>
    </div>
    <div id="conv-feedback" class="conv-feedback"></div>
    <button class="btn btn-ghost btn-sm" id="btn-conv-end" style="margin-top:8px;font-size:13px">
      🏁 ${S.lang === 'id' ? 'Akhiri Percakapan' : 'End Conversation'}
    </button>
  `;

  const input = $('#conv-text-input');
  input.focus();

  $('#btn-conv-send').addEventListener('click', () => submitFreeTalk(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitFreeTalk(input.value); });
  $('#btn-conv-end').addEventListener('click', finishConv);
}

async function submitFreeTalk(text) {
  if (!text.trim()) return;

  const input = $('#conv-text-input');
  const sendBtn = $('#btn-conv-send');
  const feedback = $('#conv-feedback');
  const optContainer = $('#conv-options');

  // Disable input
  input.disabled = true;
  sendBtn.disabled = true;

  // Add user message
  addUserMessage(text);
  S.conv.history.push({ role: 'user', text: text });

  // Show typing
  optContainer.innerHTML = `<div class="conv-typing"><span class="typing-dots">●●●</span> AI is thinking...</div>`;

  try {
    const prompt = buildConvFollowUpPrompt({ partnerName: 'Conversation Partner' }, text);
    const aiResponse = await callGemini(prompt, S.conv.history.slice(0, -1));
    const parsed = parseGeminiResponse(aiResponse);

    S.conv.history.push({ role: 'model', text: aiResponse });

    // Update score
    const score = parsed.score || 2;
    S.conv.score += score;
    S.conv.maxScore += 3;
    $('#conv-score-badge').textContent = S.conv.score;

    addAIMessage(parsed.message, parsed.translation);
    speak(parsed.message, 'en-US');

    // Show feedback
    if (parsed.feedback) {
      const scoreColor = score >= 3 ? 'var(--success)' : score >= 2 ? 'var(--warning)' : 'var(--accent)';
      feedback.innerHTML = `<div class="conv-ai-feedback" style="border-left:3px solid ${scoreColor};padding:8px 12px;font-size:13px;color:var(--text2)">
        ${score >= 3 ? '✅' : score >= 2 ? '⚠️' : '💡'} ${parsed.feedback}
      </div>`;
    }

    showFreeTalkInput();
  } catch (e) {
    feedback.innerHTML = `<div class="conv-error">❌ ${e.message}</div>`;
    showFreeTalkInput(); // Re-enable
  }
}

function showConvStarterPicker(id) {
  const conv = APP_DATA.conversations[id];
  const title = conv.title[S.lang] || conv.title.en;
  const partnerName = conv.partnerName || (S.lang === 'id' ? 'Lawan bicara' : 'Conversation partner');

  // If Gemini is active, show mode picker
  if (hasGemini()) {
    const modal = document.createElement('div');
    modal.className = 'ielts-modal';
    modal.innerHTML = `
      <div class="ielts-modal-content" style="text-align:center;padding:32px 24px">
        <div style="font-size:48px;margin-bottom:12px">${conv.icon}</div>
        <h3 style="margin-bottom:8px">${title}</h3>
        <p style="color:var(--text2);font-size:13px;margin-bottom:24px">${S.lang === 'id' ? 'Pilih mode percakapan' : 'Choose conversation mode'}</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-primary btn-full" id="mode-ai">
            🤖 ${S.lang === 'id' ? 'Mode AI (Bebas bicara)' : 'AI Mode (Free conversation)'}
          </button>
          <button class="btn btn-secondary btn-full" id="mode-script">
            📋 ${S.lang === 'id' ? 'Mode Script (Panduan)' : 'Script Mode (Guided)'}
          </button>
        </div>
        <button class="btn btn-ghost" id="mode-cancel" style="margin-top:12px">${S.lang === 'id' ? 'Batal' : 'Cancel'}</button>
      </div>
    `;
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'mode-cancel') modal.remove(); });
    document.body.appendChild(modal);

    $('#mode-ai').addEventListener('click', () => { modal.remove(); showConvStarterPickerAI(id); });
    $('#mode-script').addEventListener('click', () => { modal.remove(); showConvStarterPickerScript(id); });
    $('#mode-cancel').addEventListener('click', () => modal.remove());
  } else {
    showConvStarterPickerScript(id);
  }
}

function showConvStarterPickerAI(id) {
  const conv = APP_DATA.conversations[id];
  const title = conv.title[S.lang] || conv.title.en;
  const partnerName = conv.partnerName || 'Partner';

  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `
    <div class="ielts-modal-content" style="text-align:center;padding:32px 24px">
      <div style="font-size:48px;margin-bottom:12px">${conv.icon}</div>
      <h3 style="margin-bottom:8px">${title}</h3>
      <p style="color:var(--text2);font-size:13px;margin-bottom:24px">${S.lang === 'id' ? 'Siapa yang mulai bicara?' : 'Who starts the conversation?'}</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-primary btn-full" id="ai-starter-you">
          🧑 ${S.lang === 'id' ? 'Kamu mulai' : 'You start'}
        </button>
        <button class="btn btn-secondary btn-full" id="ai-starter-them">
          ${conv.icon} ${partnerName} ${S.lang === 'id' ? 'mulai' : 'starts'}
        </button>
      </div>
      <button class="btn btn-ghost" id="ai-starter-cancel" style="margin-top:12px">${S.lang === 'id' ? 'Batal' : 'Cancel'}</button>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'ai-starter-cancel') modal.remove(); });
  document.body.appendChild(modal);

  $('#ai-starter-you').addEventListener('click', () => { modal.remove(); startConvAI(id, 'you'); });
  $('#ai-starter-them').addEventListener('click', () => { modal.remove(); startConvAI(id, 'them'); });
  $('#ai-starter-cancel').addEventListener('click', () => modal.remove());
}

function showConvStarterPickerScript(id) {
  const conv = APP_DATA.conversations[id];
  const title = conv.title[S.lang] || conv.title.en;
  const partnerName = conv.partnerName || (S.lang === 'id' ? 'Lawan bicara' : 'Conversation partner');

  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `
    <div class="ielts-modal-content" style="text-align:center;padding:32px 24px">
      <div style="font-size:48px;margin-bottom:12px">${conv.icon}</div>
      <h3 style="margin-bottom:8px">${title}</h3>
      <p style="color:var(--text2);font-size:13px;margin-bottom:24px">${S.lang === 'id' ? 'Siapa yang mulai bicara?' : 'Who starts the conversation?'}</p>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-primary btn-full" id="starter-you">
          🧑 ${S.lang === 'id' ? 'Kamu mulai' : 'You start'}
        </button>
        <button class="btn btn-secondary btn-full" id="starter-them">
          ${conv.icon} ${partnerName} ${S.lang === 'id' ? 'mulai' : 'starts'}
        </button>
      </div>
      <button class="btn btn-ghost" id="starter-cancel" style="margin-top:12px">${S.lang === 'id' ? 'Batal' : 'Cancel'}</button>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.id === 'starter-cancel') modal.remove(); });
  document.body.appendChild(modal);

  $('#starter-you').addEventListener('click', () => { modal.remove(); startConv(id, 'you'); });
  $('#starter-them').addEventListener('click', () => { modal.remove(); startConv(id, 'them'); });
  $('#starter-cancel').addEventListener('click', () => modal.remove());
}

// ---- AI CONVERSATION MODE ----
async function startConvAI(id, starter) {
  const conv = APP_DATA.conversations[id];

  S.conv = {
    id,
    step: 0,
    score: 0,
    maxScore: 0,
    history: [],
    starter,
    isAI: true,
  };

  $('#conv-list').classList.add('hidden');
  $('#conv-game').classList.remove('hidden');
  $('#conv-result').classList.add('hidden');
  $('#conv-title').textContent = conv.title[S.lang] || conv.title.en;
  $('#conv-body').innerHTML = '';
  $('#conv-score-badge').textContent = '0';

  if (starter === 'you') {
    showAIInput(conv);
  } else {
    // AI speaks first
    $('#conv-options').innerHTML = '<div class="conv-typing"><span class="typing-dots">●●●</span> AI is thinking...</div>';
    try {
      const systemPrompt = buildConvSystemPrompt(conv);
      const aiResponse = await callGemini(systemPrompt, []);
      const parsed = parseGeminiResponse(aiResponse);

      S.conv.history.push({ role: 'model', text: aiResponse });

      addAIMessage(parsed.message, parsed.translation);
      speak(parsed.message, 'en-US');
      showAIInput(conv);
    } catch (e) {
      $('#conv-options').innerHTML = `<div class="conv-error">❌ ${e.message}<br><small>${S.lang === 'id' ? 'Cek API key di Settings' : 'Check API key in Settings'}</small></div>`;
    }
  }
}

function showAIInput(conv) {
  const optContainer = $('#conv-options');
  optContainer.innerHTML = `
    <div class="conv-input-wrap">
      <input type="text" id="conv-text-input" class="conv-text-input"
        placeholder="${S.lang === 'id' ? 'Ketik jawabanmu dalam bahasa Inggris...' : 'Type your answer in English...'}"
        autocomplete="off" />
      <button id="btn-conv-send" class="btn btn-primary">➤</button>
    </div>
    <div id="conv-feedback" class="conv-feedback"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button class="btn btn-ghost btn-sm" id="btn-conv-hint" style="font-size:13px;flex:1">💡 ${S.lang === 'id' ? 'Lihat contoh' : 'See examples'}</button>
      <button class="btn btn-ghost btn-sm" id="btn-conv-end" style="font-size:13px;flex:1">🏁 ${S.lang === 'id' ? 'Akhiri' : 'End'}</button>
    </div>
  `;

  const input = $('#conv-text-input');
  input.focus();

  $('#btn-conv-send').addEventListener('click', () => submitAIAnswer(input.value, conv));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAIAnswer(input.value, conv); });
  $('#btn-conv-end').addEventListener('click', finishConv);

  // Show example options from script data
  $('#btn-conv-hint').addEventListener('click', () => {
    const step = APP_DATA.conversations[S.conv.id]?.dialogue?.[S.conv.step];
    if (step && step.options && step.options.length > 0) {
      const examples = step.options.map(o => o.text).join(' / ');
      $('#conv-feedback').innerHTML = `<div class="conv-hint-box">💡 <strong>${S.lang === 'id' ? 'Contoh:' : 'Examples:'}</strong> ${examples}</div>`;
    } else {
      $('#conv-feedback').innerHTML = `<div class="conv-hint-box">💡 ${S.lang === 'id' ? 'Jawab dengan bebas! AI akan mengerti.' : 'Answer freely! AI will understand.'}</div>`;
    }
  });
}

async function submitAIAnswer(text, conv) {
  if (!text.trim()) return;

  const input = $('#conv-text-input');
  const sendBtn = $('#btn-conv-send');
  const feedback = $('#conv-feedback');
  const optContainer = $('#conv-options');

  // Disable input
  input.disabled = true;
  sendBtn.disabled = true;

  // Add user message
  addUserMessage(text);
  S.conv.history.push({ role: 'user', text: text });

  // Show typing
  optContainer.innerHTML = `<div class="conv-typing"><span class="typing-dots">●●●</span> AI is thinking...</div>`;

  try {
    const partnerName = conv.partnerName || 'Partner';
    const prompt = `The user said: "${text}"

Respond as ${partnerName}. Stay in character for the "${conv.title.en}" scenario.
Keep it SHORT (1-3 sentences). Be natural and realistic.
${S.lang === 'id' ? 'Add "TRANSLATION: [terjemahan]" after FEEDBACK.' : ''}

FEEDBACK format: "FEEDBACK: [1-3] [brief reason]"`;

    const aiResponse = await callGemini(prompt, S.conv.history.slice(0, -1));
    const parsed = parseGeminiResponse(aiResponse);

    S.conv.history.push({ role: 'model', text: aiResponse });

    // Update score
    const score = parsed.score || 2;
    S.conv.score += score;
    S.conv.maxScore += 3;
    $('#conv-score-badge').textContent = S.conv.score;

    addAIMessage(parsed.message, parsed.translation);
    speak(parsed.message, 'en-US');

    // Show feedback
    if (parsed.feedback) {
      const scoreColor = score >= 3 ? 'var(--success)' : score >= 2 ? 'var(--warning)' : 'var(--accent)';
      feedback.innerHTML = `<div class="conv-ai-feedback" style="border-left:3px solid ${scoreColor};padding:8px 12px;font-size:13px;color:var(--text2)">
        ${score >= 3 ? '✅' : score >= 2 ? '⚠️' : '💡'} ${parsed.feedback}
      </div>`;
    }

    // Update script step for hint button
    if (S.conv.step < (APP_DATA.conversations[S.conv.id]?.dialogue?.length || 0) - 1) {
      S.conv.step++;
    }

    showAIInput(conv);
  } catch (e) {
    feedback.innerHTML = `<div class="conv-error">❌ ${e.message}</div>`;
    showAIInput(conv);
  }
}

// ---- SHARED CONVERSATION HELPERS ----
function addAIMessage(text, translation) {
  const body = $('#conv-body');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg ai';
  msgEl.innerHTML = `
    <span class="msg-text">${text}</span>
    ${translation ? `<span class="msg-translation">${translation}</span>` : ''}
  `;
  body.appendChild(msgEl);
  body.scrollTop = body.scrollHeight;
}

function addUserMessage(text) {
  const body = $('#conv-body');
  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg user';
  msgEl.innerHTML = `<span class="msg-text">${text}</span>`;
  body.appendChild(msgEl);
  body.scrollTop = body.scrollHeight;
}

// ---- SCRIPT CONVERSATION MODE (Original) ----
function startConv(id, starter) {
  const conv = APP_DATA.conversations[id];
  let startStep = 0;

  if (starter === 'you' && conv.userStart) {
    startStep = conv.userStart;
  }

  S.conv = { id, step: startStep, score: 0, maxScore: 0, starter, history: [] };
  $('#conv-list').classList.add('hidden');
  $('#conv-game').classList.remove('hidden');
  $('#conv-result').classList.add('hidden');
  $('#conv-title').textContent = conv.title[S.lang] || conv.title.en;
  $('#conv-body').innerHTML = '';
  $('#conv-score-badge').textContent = '0';
  renderConvStep();
}

function renderConvStep() {
  const conv = APP_DATA.conversations[S.conv.id];
  const step = conv.dialogue[S.conv.step];
  const body = $('#conv-body');

  if (step.userPrompt) {
    showConvInput(step);
    return;
  }

  const msgEl = document.createElement('div');
  msgEl.className = 'chat-msg ai';
  msgEl.innerHTML = `
    <span class="msg-speaker">${step.speaker}</span>
    <span class="msg-text">${step.text}</span>
    <span class="msg-translation">${step.translation}</span>
  `;
  body.appendChild(msgEl);
  body.scrollTop = body.scrollHeight;

  speak(step.text, 'en-US');

  const optContainer = $('#conv-options');
  if (step.end) {
    optContainer.innerHTML = `<button class="btn btn-primary btn-full" id="btn-conv-finish">${t('complete')} ✅</button>`;
    $('#btn-conv-finish').addEventListener('click', finishConv);
    return;
  }

  showConvInput(step);
}

function showConvInput(step) {
  const optContainer = $('#conv-options');
  optContainer.innerHTML = `
    <div class="conv-input-wrap">
      <input type="text" id="conv-text-input" class="conv-text-input" placeholder="${S.lang === 'id' ? 'Ketik jawabanmu dalam bahasa Inggris...' : 'Type your answer in English...'}" autocomplete="off" />
      <button id="btn-conv-send" class="btn btn-primary">➤</button>
    </div>
    <div id="conv-feedback" class="conv-feedback"></div>
    <button class="btn btn-ghost btn-sm" id="btn-conv-hint" style="margin-top:8px;font-size:13px">💡 ${S.lang === 'id' ? 'Lihat contoh jawaban' : 'See example answers'}</button>
  `;

  const input = $('#conv-text-input');
  const sendBtn = $('#btn-conv-send');
  const hintBtn = $('#btn-conv-hint');

  input.focus();

  sendBtn.addEventListener('click', () => submitConvAnswer(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitConvAnswer(input.value); });

  hintBtn.addEventListener('click', () => {
    const examples = step.options.map(o => o.text).join(' / ');
    $('#conv-feedback').innerHTML = `<div class="conv-hint-box">💡 <strong>${S.lang === 'id' ? 'Contoh:' : 'Examples:'}</strong> ${examples}</div>`;
  });
}

function findClosestOption(userText, options) {
  const user = userText.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  let best = null;
  let bestScore = -1;

  for (const opt of options) {
    const target = opt.text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    let score = calculateSimilarity(user, target);

    if (target.includes(user) || user.includes(target)) score = Math.max(score, 0.95);
    if (user === target) score = 1.0;

    const userWords = user.split(/\s+/);
    const targetWords = target.split(/\s+/);
    const allFound = userWords.every(uw => targetWords.some(tw => tw === uw || tw.includes(uw) || uw.includes(tw)));
    if (allFound && userWords.length >= targetWords.length * 0.7) score = Math.max(score, 0.92);

    if (score > bestScore) {
      bestScore = score;
      best = opt;
    }
  }
  return { option: best, similarity: bestScore };
}

function findWordErrors(userText, correctText) {
  const userWords = userText.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/);
  const correctWords = correctText.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(/\s+/);
  const errors = [];
  const correct = [];

  const matched = new Set();
  const userMatched = new Set();

  for (let i = 0; i < userWords.length; i++) {
    let found = false;
    for (let j = 0; j < correctWords.length; j++) {
      if (matched.has(j)) continue;
      if (userWords[i] === correctWords[j] || levenshtein(userWords[i], correctWords[j]) <= 1) {
        matched.add(j);
        userMatched.add(i);
        correct.push({ word: userWords[i], status: 'correct' });
        found = true;
        break;
      }
    }
    if (!found) {
      let minDist = Infinity;
      let suggestion = '';
      for (let j = 0; j < correctWords.length; j++) {
        if (matched.has(j)) continue;
        const dist = levenshtein(userWords[i], correctWords[j]);
        if (dist < minDist) {
          minDist = dist;
          suggestion = correctWords[j];
        }
      }
      errors.push({ word: userWords[i], suggestion: minDist <= 3 ? suggestion : null });
    }
  }

  const missing = [];
  for (let j = 0; j < correctWords.length; j++) {
    if (!matched.has(j)) missing.push(correctWords[j]);
  }

  return { errors, missing, correct };
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

function submitConvAnswer(text) {
  if (!text.trim()) return;

  const conv = APP_DATA.conversations[S.conv.id];
  const step = conv.dialogue[S.conv.step];
  const input = $('#conv-text-input');
  const feedback = $('#conv-feedback');

  if (input) input.disabled = true;
  const sendBtn = $('#btn-conv-send');
  if (sendBtn) sendBtn.disabled = true;

  let matchStep = step;
  let nextStep;
  if (step.userPrompt && S.conv.step + 1 < conv.dialogue.length) {
    matchStep = conv.dialogue[S.conv.step + 1];
    nextStep = S.conv.step + 2;
  } else {
    nextStep = step.options.length > 0 ? step.options[0].next : S.conv.step + 1;
  }

  const { option: bestOpt, similarity } = findClosestOption(text, matchStep.options);

  let score;
  if (similarity >= 0.85) score = 3;
  else if (similarity >= 0.5) score = 2;
  else score = 1;

  S.conv.score += score;
  S.conv.maxScore += 3;
  $('#conv-score-badge').textContent = S.conv.score;

  addUserMessage(text);

  if (step.userPrompt) {
    const aiStep = conv.dialogue[S.conv.step + 1];
    if (aiStep) {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg ai';
      aiMsg.innerHTML = `
        <span class="msg-speaker">${aiStep.speaker}</span>
        <span class="msg-text">${aiStep.text}</span>
        <span class="msg-translation">${aiStep.translation}</span>
      `;
      $('#conv-body').appendChild(aiMsg);
      $('#conv-body').scrollTop = $('#conv-body').scrollHeight;
      speak(aiStep.text, 'en-US');
    }
  }

  if (score < 3) {
    const { errors, missing } = findWordErrors(text, bestOpt.text);
    let detailsHTML = '';

    if (errors.length > 0) {
      detailsHTML += `<div class="correction-section"><span class="correction-label">❌ ${S.lang === 'id' ? 'Kata yang salah:' : 'Wrong words:'}</span>`;
      errors.forEach(e => {
        detailsHTML += `<div class="correction-item"><span class="wrong-word">${e.word}</span>`;
        if (e.suggestion) detailsHTML += ` → <span class="correct-word">${e.suggestion}</span>`;
        detailsHTML += '</div>';
      });
      detailsHTML += '</div>';
    }

    if (missing.length > 0) {
      detailsHTML += `<div class="correction-section"><span class="correction-label">📝 ${S.lang === 'id' ? 'Kata yang kurang:' : 'Missing words:'}</span>`;
      missing.forEach(m => {
        detailsHTML += `<span class="missing-word">${m}</span> `;
      });
      detailsHTML += '</div>';
    }

    detailsHTML += `<div class="correction-section"><span class="correction-label">✅ ${S.lang === 'id' ? 'Jawaban yang benar:' : 'Correct answer:'}</span><span class="full-correct">${bestOpt.text}</span></div>`;

    const summaryText = score === 2
      ? (S.lang === 'id' ? '⚠️ Hampir benar, ada sedikit kesalahan' : '⚠️ Almost correct, small mistakes')
      : (S.lang === 'id' ? '❌ Ada kesalahan, klik untuk lihat detail' : '❌ Mistakes found, tap to see details');

    feedback.innerHTML = `
      <div class="conv-correction">
        <button class="correction-toggle" id="correction-toggle">
          <span class="toggle-text">${summaryText}</span>
          <span class="toggle-arrow">▲</span>
        </button>
        <div class="correction-details" id="correction-details">${detailsHTML}</div>
        <div class="conv-action-btns">
          <button class="btn btn-secondary" id="btn-conv-retry">🔄 ${S.lang === 'id' ? 'Coba Lagi' : 'Try Again'}</button>
          <button class="btn btn-primary" id="btn-conv-continue">${S.lang === 'id' ? 'Lanjut ➤' : 'Continue ➤'}</button>
        </div>
      </div>
    `;

    const toggleBtn = $('#correction-toggle');
    const detailsDiv = $('#correction-details');
    let expanded = true;
    toggleBtn.addEventListener('click', () => {
      expanded = !expanded;
      detailsDiv.classList.toggle('collapsed', !expanded);
      toggleBtn.querySelector('.toggle-arrow').textContent = expanded ? '▲' : '▼';
    });

    $('#btn-conv-retry').addEventListener('click', () => {
      S.conv.score -= score;
      S.conv.maxScore -= 3;
      $('#conv-score-badge').textContent = S.conv.score;
      const lastUserMsg = $('#conv-body').querySelector('.chat-msg.user:last-of-type');
      if (lastUserMsg) lastUserMsg.remove();
      feedback.innerHTML = '';
      const newInput = $('#conv-text-input');
      const newSendBtn = $('#btn-conv-send');
      if (newInput) { newInput.disabled = false; newInput.value = ''; newInput.focus(); }
      if (newSendBtn) newSendBtn.disabled = false;
    });

    $('#btn-conv-continue').addEventListener('click', () => {
      const actualNext = step.userPrompt ? nextStep : bestOpt.next;
      S.conv.step = actualNext;
      renderConvStep();
    });
  } else {
    feedback.innerHTML = `<div class="conv-success">🎉 ${S.lang === 'id' ? 'Bagus! Jawabanmu benar!' : 'Great! Your answer is correct!'}</div>`;
    setTimeout(() => {
      S.conv.step = bestOpt.next;
      renderConvStep();
    }, 1500);
  }

  speak(text, 'en-US');
}

function finishConv() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  $('#conv-game').classList.add('hidden');
  $('#conv-result').classList.remove('hidden');

  const pct = S.conv.maxScore > 0 ? Math.round((S.conv.score / S.conv.maxScore) * 100) : 0;
  let icon, msg;
  if (pct >= 80) { icon = '🏆'; msg = t('excellent'); }
  else if (pct >= 60) { icon = '👍'; msg = t('good'); }
  else { icon = '💪'; msg = t('needsPractice'); }

  $('#conv-result-icon').textContent = icon;
  $('#conv-overall').textContent = pct + '%';

  S.progress.conversations++;
  S.progress.totalScore += Math.round(pct / 10);
  updateStreak();
  save();
}

// ---- PRONUNCIATION ENGINE ----
function renderPronMenu() {
  $('#pron-menu').classList.remove('hidden');
  $('#pron-practice').classList.add('hidden');
}

function startPron(type) {
  S.pron.type = type;
  S.pron.idx = 0;
  S.pron.exercises = APP_DATA.pronunciation[type].exercises;
  $('#pron-menu').classList.add('hidden');
  $('#pron-practice').classList.remove('hidden');
  $('#pron-title').textContent = APP_DATA.pronunciation[type].title[S.lang] || APP_DATA.pronunciation[type].title.en;
  renderPronExercise();
}

function renderPronExercise() {
  const ex = S.pron.exercises[S.pron.idx];
  const total = S.pron.exercises.length;
  $('#pron-counter').textContent = `${S.pron.idx + 1} / ${total}`;
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
  if (S.pron.type === 'minimal_pairs') {
    speak(ex.words[0], 'en-US');
    setTimeout(() => speak(ex.words[1], 'en-US'), 1000);
  } else {
    speak(ex.text, 'en-US');
  }
}

// ---- SPEECH RECOGNITION ----
function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = 'en-US';
  r.continuous = false;
  r.interimResults = false;
  r.maxAlternatives = 1;
  return r;
}

function startRecording() {
  if (S.recording) { stopRecording(); return; }

  const r = initRecognition();
  if (!r) { toast('Speech recognition not supported'); return; }

  S.recognition = r;
  S.recording = true;
  $('#btn-pron-speak').classList.add('recording');
  toast(t('speakClearly'));

  r.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const confidence = e.results[0][0].confidence;
    scorePronunciation(transcript, confidence);
  };

  r.onerror = (e) => {
    console.log('Speech error:', e.error);
    if (e.error === 'no-speech') toast(t('noSpeechDetected'));
    stopRecording();
  };

  r.onend = () => {
    if (S.recording) stopRecording();
  };

  r.start();
}

function stopRecording() {
  S.recording = false;
  if (S.recognition) { try { S.recognition.stop(); } catch(e){} }
  $('#btn-pron-speak').classList.remove('recording');
}

function scorePronunciation(transcript, confidence) {
  const ex = S.pron.exercises[S.pron.idx];
  let expected;

  if (S.pron.type === 'minimal_pairs') {
    const t = transcript.toLowerCase().trim();
    const match0 = t.includes(ex.words[0].toLowerCase());
    const match1 = t.includes(ex.words[1].toLowerCase());
    if (match0 || match1) {
      showPronResult(90, `You said: "${transcript}"`, 'Great pronunciation!');
    } else {
      showPronResult(50, `You said: "${transcript}"`, `Expected one of: ${ex.words.join(' or ')}`);
    }
    return;
  }

  expected = ex.text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const spoken = transcript.toLowerCase().replace(/[^a-z\s]/g, '').trim();

  const score = calculateSimilarity(spoken, expected);
  const pct = Math.round(score * 100);

  let feedback;
  if (pct >= 85) feedback = '🎉 Excellent pronunciation!';
  else if (pct >= 70) feedback = '👍 Good! Try to be more clear.';
  else if (pct >= 50) feedback = '💪 Keep practicing!';
  else feedback = '🔄 Try again, speak more clearly.';

  showPronResult(pct, `You said: "${transcript}"`, feedback);
}

function calculateSimilarity(a, b) {
  const wordsA = a.split(/\s+/).filter(w => w.length > 0);
  const wordsB = b.split(/\s+/).filter(w => w.length > 0);
  let matches = 0;
  const usedB = new Set();

  for (const wa of wordsA) {
    let bestJ = -1;
    let bestLen = 0;
    for (let j = 0; j < wordsB.length; j++) {
      if (usedB.has(j)) continue;
      const wb = wordsB[j];
      if (wb === wa) { bestJ = j; bestLen = wa.length; break; }
      if (wb.includes(wa) && wa.length > bestLen) { bestJ = j; bestLen = wa.length; }
      if (wa.includes(wb) && wb.length > bestLen) { bestJ = j; bestLen = wb.length; }
    }
    if (bestJ >= 0) { matches++; usedB.add(bestJ); }
  }

  const maxLen = Math.max(wordsA.length, wordsB.length);
  return maxLen > 0 ? matches / maxLen : 0;
}

function showPronResult(score, transcript, feedback) {
  $('#pron-result').classList.remove('hidden');
  $('#pron-score-val').textContent = score;
  $('#pron-transcript').textContent = transcript;
  $('#pron-feedback').textContent = feedback;

  const circle = $('#pron-score-circle');
  if (score >= 80) circle.style.borderColor = 'var(--success)';
  else if (score >= 60) circle.style.borderColor = 'var(--warning)';
  else circle.style.borderColor = 'var(--accent)';

  S.progress.totalScore += Math.round(score / 20);
  updateStreak();
  save();
}

// ---- VOCABULARY ----
function renderVocabMenu() {
  $('#vocab-menu').classList.remove('hidden');
  $('#vocab-detail').classList.add('hidden');
}

function startVocab(cat) {
  S.vocab = { cat, idx: 0 };
  $('#vocab-menu').classList.add('hidden');
  $('#vocab-detail').classList.remove('hidden');
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
  $('#vf-front').classList.remove('hidden');
  $('#vf-back').classList.add('hidden');
  $('#btn-vocab-flip').textContent = S.lang === 'id' ? 'Ketuk untuk lihat arti' : 'Tap to reveal meaning';

  S.progress.wordsLearned[word.en] = true;
  updateStreak();
  save();
}

// ---- IELTS ----
function renderIELTS() {
  $('#ielts-part1').innerHTML = APP_DATA.ielts.speaking.part1.map((item, i) => `
    <button class="ielts-card" data-section="part1" data-idx="${i}">
      <span class="ic-topic">${item.topic}</span>
      <span class="ic-sub">${item.questions.length} questions</span>
    </button>
  `).join('');

  $('#ielts-part2').innerHTML = APP_DATA.ielts.speaking.part2.map((item, i) => `
    <button class="ielts-card" data-section="part2" data-idx="${i}">
      <span class="ic-topic">${item.topic}</span>
      <span class="ic-sub">${item.prompts.length} prompts</span>
    </button>
  `).join('');

  $('#ielts-dictation').innerHTML = APP_DATA.listening.dictation.exercises.map((item, i) => `
    <button class="ielts-card" data-section="dictation" data-idx="${i}">
      <span class="ic-topic">Exercise ${i + 1}</span>
      <span class="ic-sub">${item.audio.substring(0, 50)}...</span>
    </button>
  `).join('');

  $$('.ielts-card').forEach(card => {
    card.addEventListener('click', () => openIELTSModal(card.dataset.section, parseInt(card.dataset.idx)));
  });
}

function openIELTSModal(section, idx) {
  let content = '';

  if (section === 'part1') {
    const item = APP_DATA.ielts.speaking.part1[idx];
    content = `
      <div class="ielts-modal-header">
        <h3>🎤 ${item.topic}</h3>
        <button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button>
      </div>
      ${item.questions.map(q => `
        <div class="ielts-question">
          <div class="iq-text">${q}</div>
          <button class="btn btn-sound-lg btn-full ielts-record-btn" onclick="speak('${q.replace(/'/g, "\\'")}', 'en-US')">🔊 Listen</button>
          <button class="btn btn-mic btn-full ielts-record-btn" onclick="startIELTSRecording(this)">🎤 Record Answer</button>
        </div>
      `).join('')}
    `;
  } else if (section === 'part2') {
    const item = APP_DATA.ielts.speaking.part2[idx];
    content = `
      <div class="ielts-modal-header">
        <h3>🎤 ${item.topic}</h3>
        <button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button>
      </div>
      <div class="ielts-question">
        <div class="iq-tips"><strong>Include:</strong><br>${item.prompts.map(p => `• ${p}`).join('<br>')}</div>
        <button class="btn btn-sound-lg btn-full ielts-record-btn" onclick="speak('${item.topic.replace(/'/g, "\\'")}', 'en-US')">🔊 Listen to Topic</button>
        <button class="btn btn-mic btn-full ielts-record-btn" onclick="startIELTSRecording(this)">🎤 Record Your Answer (2 min)</button>
      </div>
    `;
  } else if (section === 'dictation') {
    const item = APP_DATA.listening.dictation.exercises[idx];
    content = `
      <div class="ielts-modal-header">
        <h3>🎧 Dictation ${idx + 1}</h3>
        <button class="btn btn-ghost" onclick="this.closest('.ielts-modal').remove()">✕</button>
      </div>
      <div class="ielts-question">
        <button class="btn btn-sound-lg btn-full" onclick="speak('${item.audio.replace(/'/g, "\\'")}', 'en-US')">🔊 Play Audio</button>
        <input type="text" class="quiz-fill-input" id="dictation-input" placeholder="${t('typeWhatYouHear')}" style="width:100%;padding:14px;background:var(--bg4);border:2px solid var(--border);border-radius:var(--r2);color:var(--text);font-size:15px;font-family:inherit;margin-top:12px">
        <button class="btn btn-primary btn-full" style="margin-top:12px" onclick="checkDictation('${item.answer.replace(/'/g, "\\'")}')">${t('submit')}</button>
        <div id="dictation-feedback" style="margin-top:12px;text-align:center"></div>
      </div>
    `;
  }

  const modal = document.createElement('div');
  modal.className = 'ielts-modal';
  modal.innerHTML = `<div class="ielts-modal-content">${content}</div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

window.speak = speak;
window.startIELTSRecording = function(btn) {
  const r = initRecognition();
  if (!r) { toast('Speech recognition not supported'); return; }

  btn.classList.add('recording');
  btn.textContent = '🎤 Recording...';

  r.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    btn.classList.remove('recording');
    btn.innerHTML = `✅ "${transcript}"`;
    toast(`You said: "${transcript}"`);
  };

  r.onerror = () => {
    btn.classList.remove('recording');
    btn.innerHTML = '🎤 Record Again';
  };

  r.onend = () => {
    btn.classList.remove('recording');
  };

  r.start();
};

window.checkDictation = function(answer) {
  const input = $('#dictation-input');
  const fb = $('#dictation-feedback');
  if (!input || !fb) return;

  const user = input.value.trim().toLowerCase();
  const correct = answer.toLowerCase();
  const score = calculateSimilarity(user, correct);

  if (score >= 0.8) {
    fb.innerHTML = `<span style="color:var(--success);font-weight:700">✅ ${t('correct')}</span>`;
  } else {
    fb.innerHTML = `<span style="color:var(--accent);font-weight:700">❌ ${t('incorrect')}</span><br><span style="color:var(--text2);font-size:13px">Answer: ${answer}</span>`;
  }
};

// ---- EVENT LISTENERS ----
function initEvents() {
  $$('.nav-item').forEach(n => n.addEventListener('click', () => nav(n.dataset.page)));

  $('#btn-lang').addEventListener('click', () => {
    S.lang = S.lang === 'id' ? 'en' : 'id';
    save();
    applyI18n();
    nav(S.page);
    toast(S.lang === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English');
  });

  $('#btn-back-conv').addEventListener('click', renderConvList);
  $('#btn-conv-again').addEventListener('click', () => startConv(S.conv.id));
  $('#btn-conv-back').addEventListener('click', renderConvList);

  $$('.pron-card').forEach(c => c.addEventListener('click', () => startPron(c.dataset.type)));
  $('#btn-back-pron').addEventListener('click', renderPronMenu);
  $('#btn-pron-listen').addEventListener('click', listenPron);
  $('#btn-pron-speak').addEventListener('click', startRecording);
  $('#btn-pron-prev').addEventListener('click', () => {
    if (S.pron.idx > 0) { S.pron.idx--; renderPronExercise(); }
  });
  $('#btn-pron-next').addEventListener('click', () => {
    if (S.pron.idx < S.pron.exercises.length - 1) { S.pron.idx++; renderPronExercise(); }
    else toast(t('complete') + ' ✅');
  });

  $$('.vocab-cat-card').forEach(c => c.addEventListener('click', () => startVocab(c.dataset.cat)));
  $('#btn-back-vocab').addEventListener('click', renderVocabMenu);
  $('#btn-vocab-flip').addEventListener('click', () => {
    $('#vf-front').classList.toggle('hidden');
    $('#vf-back').classList.toggle('hidden');
  });
  $('#btn-vocab-speak').addEventListener('click', () => {
    const w = APP_DATA.advancedVocab[S.vocab.cat].words[S.vocab.idx];
    speak(w.en, 'en-US');
  });
  $('#btn-vocab-prev').addEventListener('click', () => {
    if (S.vocab.idx > 0) { S.vocab.idx--; renderVocabCard(); }
  });
  $('#btn-vocab-next').addEventListener('click', () => {
    const words = APP_DATA.advancedVocab[S.vocab.cat].words;
    if (S.vocab.idx < words.length - 1) { S.vocab.idx++; renderVocabCard(); }
    else toast(t('complete') + ' ✅');
  });

  $$('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = el.dataset.action;
      if (action === 'randomConversation') {
        const keys = Object.keys(APP_DATA.conversations);
        nav('conversation');
        setTimeout(() => startConv(keys[Math.floor(Math.random() * keys.length)]), 300);
      }
      if (action === 'randomPronunciation') {
        nav('pronunciation');
        setTimeout(() => startPron('tongue_twisters'), 300);
      }
    });
  });
}

// ---- INIT ----
function init() {
  updateStreak();
  setTimeout(() => {
    $('#splash').classList.add('fade-out');
    $('#app').classList.remove('hidden');
    setTimeout(() => $('#splash').remove(), 500);
  }, 1500);
  applyI18n();
  initEvents();
  nav('home');
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();
