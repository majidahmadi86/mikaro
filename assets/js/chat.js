/**
 * MIKARO STUDIO — chat.js
 * Advanced AI chat with lead qualification funnel
 * Captures: service → need → timeline → budget → name + email → WhatsApp handoff
 */

(function () {
  'use strict';

  /* ─── CONFIG ─── */
  const API_URL      = 'https://api.anthropic.com/v1/messages';
  const MODEL        = 'claude-sonnet-4-20250514';
  const MAX_TOKENS   = 400;
  const WA_NUMBER    = '66951967330';
  const LINE_ID      = 'mike_aj';
  const RATE_LIMIT_MS = 1500; // min ms between sends

  /* ─── SYSTEM PROMPT — the core of the qualification funnel ─── */
  const SYSTEM_PROMPT = `You are Maya, Mikaro Studio's smart sales assistant. You help visitors understand which service fits them and guide them to book a free discovery call.

PERSONA: Warm, direct, professional. Never pushy. Speak like a knowledgeable friend, not a salesperson.

YOUR ONLY GOAL: Qualify the lead across 5 dimensions, then collect their name and email, then hand off to WhatsApp with a full lead summary.

QUALIFICATION FUNNEL (follow this ORDER — one question per message):
1. SERVICE: What do they need? (Logo / Website / Both / Marketing / AI Workshop / English / Not sure)
2. BUSINESS: What's the business? (Get context — industry, size, stage)
3. GOAL: What outcome do they want? (More clients? Launch? Rebrand? Visibility?)
4. TIMELINE: When? (This week = urgent / This month / Exploring)
5. BUDGET: Ballpark? (Under 15K THB / 15–40K THB / 40K+ THB / Flexible — reassure them there's no wrong answer)

After you have answers for ALL 5, transition to lead capture:
Say something like: "Perfect — I have everything I need to match you with the right package. Before I connect you directly with Majid, can I grab your name and a contact email? That way he can prepare a proper proposal for you."

Then set a flag in your response by writing exactly this JSON line at the end (hidden from user):
COLLECT_LEAD:true

After they provide name/email, confirm with:
"Great — I'm sending your brief to Majid now. He'll reply within 2 hours. You'll also get a WhatsApp link to chat instantly."
Then set: HANDOFF_READY:true and include a LEAD_SUMMARY in your response:
LEAD_SUMMARY:{"service":"X","business":"Y","goal":"Z","timeline":"A","budget":"B","name":"C","email":"D"}

IMPORTANT RULES:
- One question per message — never stack multiple questions
- Keep messages SHORT (2-4 sentences max)
- NEVER quote prices — say "pricing depends on scope, Majid will send a custom quote"
- If they seem impatient, skip to lead capture earlier
- If they want to go straight to WhatsApp, give them the link immediately: https://wa.me/${WA_NUMBER}
- Be warm and genuine — you're the first impression of the studio
- For the lead capture step, show the HTML form (the JS will handle rendering it)
- Never break character. Never say you're an AI unless directly and sincerely asked.

SERVICES OVERVIEW (for context):
- Logo & Brand Identity: delivered in 48h, 3 concepts
- Web Design & Development: live in 5 days, responsive, SEO-ready
- Logo + Web Bundle: 2 weeks, best value
- Digital Marketing Strategy: channel strategy, SEO, paid ads, analytics
- AI Marketing Workshop: ChatGPT mastery, prompt engineering, content workflows
- English for Business: confidence-building, professionals & corporate teams
- Full Brand + Marketing: everything included, 1-month launch support

URGENCY (mention naturally when relevant):
"We have 3 project slots open this month."
"Logo in 48h — Website live in 5 days."
"Majid replies within 2 hours."`;

  /* ─── STATE ─── */
  let isOpen          = false;
  let history         = [];
  let leadData        = {};
  let isCollectingLead = false;
  let isHandoffReady  = false;
  let lastSendTime    = 0;
  let isTyping        = false;

  /* ─── QUICK REPLY SETS ─── */
  const QUICK = {
    intro: [
      'I need a logo design',
      'I need a website',
      'Logo + website together',
      'Digital marketing help',
    ],
    service_more: [
      'AI marketing workshop',
      'English for business',
      'Not sure yet — need advice',
    ],
    timeline: [
      'Very urgent — this week',
      'Within this month',
      'Just exploring for now',
    ],
    budget: [
      'Under 15,000 THB',
      '15,000 – 40,000 THB',
      '40,000+ THB',
      'Flexible / Discuss',
    ],
    handoff: [
      'Message on WhatsApp now',
      'Send to LINE instead',
    ],
  };

  /* ─── DOM REFS (resolved after DOMContentLoaded) ─── */
  let $bubble, $panel, $msgs, $input, $sendBtn, $quickRow;

  /* ─── INIT ─── */
  function init () {
    $bubble   = document.getElementById('chatBubble');
    $panel    = document.getElementById('chatPanel');
    $msgs     = document.getElementById('chatMsgs');
    $input    = document.getElementById('chatInput');
    $sendBtn  = document.getElementById('chatSend');
    $quickRow = document.getElementById('chatQuick');

    if (!$bubble || !$panel) return;

    $bubble.addEventListener('click', toggleChat);
    document.getElementById('chatClose')?.addEventListener('click', closeChat);
    $sendBtn?.addEventListener('click', sendMessage);
    $input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !$panel.contains(e.target) && !$bubble.contains(e.target)) {
        closeChat();
      }
    });
  }

  /* ─── TOGGLE ─── */
  function toggleChat () { isOpen ? closeChat() : openChat(); }

  function openChat () {
    isOpen = true;
    $panel.classList.add('open');
    $bubble.setAttribute('aria-expanded', 'true');
    $input?.focus();
    if (history.length === 0) greetUser();
  }

  function closeChat () {
    isOpen = false;
    $panel.classList.remove('open');
    $bubble.setAttribute('aria-expanded', 'false');
  }

  /* ─── GREETING ─── */
  function greetUser () {
    setTimeout(() => {
      addMessage('bot',
        "Hi! 👋 I'm Maya, Mikaro Studio's assistant.\n\n" +
        "I'll help you find the right solution — and connect you with Majid directly if it's a good fit. What brings you here today?"
      );
      showQuickReplies('intro');
    }, 380);
  }

  /* ─── QUICK REPLIES ─── */
  function showQuickReplies (set) {
    if (!$quickRow) return;
    const btns = QUICK[set] || [];
    $quickRow.innerHTML = '';
    $quickRow.style.display = btns.length ? 'flex' : 'none';
    btns.forEach((label) => {
      const btn = document.createElement('button');
      btn.className = 'chat-qbtn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        $input.value = label;
        sendMessage();
      });
      $quickRow.appendChild(btn);
    });
  }

  function hideQuickReplies () {
    if ($quickRow) { $quickRow.innerHTML = ''; $quickRow.style.display = 'none'; }
  }

  /* ─── MESSAGES ─── */
  function addMessage (role, text) {
    if (!$msgs) return;
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg--${role}`;

    // Render newlines as <br>, and links as anchors
    const safe = escapeHtml(text);
    div.innerHTML = safe
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color:var(--gold-lite);text-decoration:underline;">$1</a>');

    $msgs.appendChild(div);
    $msgs.scrollTop = $msgs.scrollHeight;
    return div;
  }

  function escapeHtml (str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function addTypingIndicator () {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--typing';
    div.id = 'chatTyping';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    $msgs?.appendChild(div);
    $msgs && ($msgs.scrollTop = $msgs.scrollHeight);
  }

  function removeTypingIndicator () {
    document.getElementById('chatTyping')?.remove();
  }

  /* ─── LEAD CAPTURE FORM ─── */
  function showLeadCaptureForm () {
    if (!$msgs) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-lead-form';
    wrap.id = 'leadForm';
    wrap.innerHTML = `
      <div style="font-size:.78rem;font-weight:600;color:rgba(255,255,255,.6);margin-bottom:.3rem;letter-spacing:.04em;">YOUR DETAILS</div>
      <input type="text" id="leadName" placeholder="Your full name" autocomplete="name" />
      <input type="email" id="leadEmail" placeholder="your@email.com" autocomplete="email" />
      <button class="chat-lead-submit" id="leadSubmit">Send My Brief to Majid →</button>
      <div style="font-size:.65rem;color:rgba(255,255,255,.22);text-align:center;margin-top:.25rem;">No spam. Majid replies within 2 hours.</div>
    `;
    $msgs.appendChild(wrap);
    $msgs.scrollTop = $msgs.scrollHeight;

    document.getElementById('leadSubmit')?.addEventListener('click', submitLead);
    document.getElementById('leadName')?.focus();
    document.getElementById('leadEmail')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitLead();
    });
  }

  function submitLead () {
    const name  = document.getElementById('leadName')?.value.trim();
    const email = document.getElementById('leadEmail')?.value.trim();

    if (!name || name.length < 2) {
      document.getElementById('leadName')?.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('leadEmail')?.focus();
      return;
    }

    leadData.name  = name;
    leadData.email = email;

    // Remove form
    document.getElementById('leadForm')?.remove();

    // Add user "message" showing they submitted
    addMessage('user', `${name} — ${email}`);

    // Tell Claude
    const userMsg = `My name is ${name} and my email is ${email}.`;
    history.push({ role: 'user', content: userMsg });

    callClaude(userMsg).then(handleResponse);
  }

  /* ─── HANDOFF ─── */
  function triggerHandoff (summary) {
    const {
      service  = 'Not specified',
      business = 'Not specified',
      goal     = 'Not specified',
      timeline = 'Not specified',
      budget   = 'Not specified',
      name     = leadData.name || '',
      email    = leadData.email || '',
    } = summary || leadData;

    const waText =
      `Hi Majid! I was chatting with Maya on mikaro.studio 👋\n\n` +
      `Here's my brief:\n` +
      `• Name: ${name}\n` +
      `• Email: ${email}\n` +
      `• Service needed: ${service}\n` +
      `• Business: ${business}\n` +
      `• Goal: ${goal}\n` +
      `• Timeline: ${timeline}\n` +
      `• Budget range: ${budget}\n\n` +
      `Looking forward to hearing from you!`;

    const waURL   = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
    const lineURL = `https://line.me/ti/p/~${LINE_ID}`;

    // Show handoff message
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.style.cssText = 'background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);max-width:96%;';
    div.innerHTML = `
      <div style="font-weight:600;color:var(--gold-lite);margin-bottom:.6rem;">✓ Brief sent to Majid</div>
      <div style="font-size:.78rem;color:rgba(255,255,255,.65);margin-bottom:.85rem;">Tap below to open the conversation. He'll see your full brief and reply within 2 hours.</div>
      <div style="display:flex;gap:.5rem;flex-direction:column;">
        <a href="${waURL}" target="_blank" rel="noopener"
           style="display:flex;align-items:center;justify-content:center;gap:.4rem;background:var(--gold);color:var(--navy-deep);padding:.62rem 1rem;border-radius:6px;font-weight:700;font-size:.78rem;text-decoration:none;transition:background .2s;"
           onmouseover="this.style.background='var(--gold-lite)'" onmouseout="this.style.background='var(--gold)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Open WhatsApp — Start Now
        </a>
        <a href="${lineURL}" target="_blank" rel="noopener"
           style="display:flex;align-items:center;justify-content:center;gap:.4rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.65);padding:.55rem 1rem;border-radius:6px;font-size:.75rem;font-weight:600;text-decoration:none;">
          Or message on LINE instead
        </a>
      </div>
    `;
    $msgs?.appendChild(div);
    $msgs && ($msgs.scrollTop = $msgs.scrollHeight);

    // Try to send lead data to a webhook (optional — silent fail)
    sendLeadToWebhook({ service, business, goal, timeline, budget, name, email });
  }

  /* Silent webhook — works if you set up a free Formspree / Netlify form endpoint */
  async function sendLeadToWebhook (data) {
    const endpoint = window.MIKARO_LEAD_WEBHOOK;
    if (!endpoint) return;
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, timestamp: new Date().toISOString(), source: 'chat' }),
      });
    } catch (_) { /* silent */ }
  }

  /* ─── SEND MESSAGE ─── */
  async function sendMessage () {
    const text = ($input?.value || '').trim();
    if (!text || isTyping) return;

    // Rate limit
    const now = Date.now();
    if (now - lastSendTime < RATE_LIMIT_MS) return;
    lastSendTime = now;

    $input.value = '';
    hideQuickReplies();
    addMessage('user', text);

    history.push({ role: 'user', content: text });
    await callClaude(text).then(handleResponse);
  }

  /* ─── CALL CLAUDE ─── */
  async function callClaude (userText) {
    isTyping = true;
    addTypingIndicator();

    const key = window.MIKARO_AI_KEY || '';

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: history.slice(-12), // keep context window lean
        }),
      });

      const data = await resp.json();
      const raw = data?.content?.[0]?.text || '';
      return raw;

    } catch (err) {
      console.warn('[Mikaro chat] API error:', err);
      return null;
    } finally {
      isTyping = false;
      removeTypingIndicator();
    }
  }

  /* ─── HANDLE RESPONSE ─── */
  function handleResponse (raw) {
    if (!raw) {
      // Fallback
      addMessage('bot',
        "Thanks for reaching out! 🙌\n\n" +
        "Message Majid directly — he replies within 2 hours:\n\n" +
        `📱 WhatsApp: https://wa.me/${WA_NUMBER}\n` +
        `💬 LINE: mike_aj`
      );
      showQuickReplies('handoff');
      return;
    }

    // Strip hidden flags before displaying
    let display = raw
      .replace(/COLLECT_LEAD:true/g, '')
      .replace(/HANDOFF_READY:true/g, '')
      .replace(/LEAD_SUMMARY:\{[^}]+\}/g, '')
      .trim();

    // Parse special flags
    const wantsCollect  = /COLLECT_LEAD:true/.test(raw);
    const wantsHandoff  = /HANDOFF_READY:true/.test(raw);
    const summaryMatch  = raw.match(/LEAD_SUMMARY:(\{[^}]+\})/);

    // Passive lead data extraction from all messages
    extractLeadData(history);

    // Display the clean message
    if (display) {
      addMessage('bot', display);
      history.push({ role: 'assistant', content: display });
    }

    // Act on flags
    if (wantsHandoff || summaryMatch) {
      let summary = leadData;
      if (summaryMatch) {
        try { summary = { ...leadData, ...JSON.parse(summaryMatch[1]) }; } catch (_) {}
      }
      setTimeout(() => triggerHandoff(summary), 600);
      return;
    }

    if (wantsCollect && !isCollectingLead) {
      isCollectingLead = true;
      setTimeout(() => showLeadCaptureForm(), 400);
      return;
    }

    // Smart quick replies based on conversation stage
    const lower = (display || '').toLowerCase();
    if (lower.includes('urgent') || lower.includes('week') || lower.includes('month') || lower.includes('timeline') || lower.includes('when')) {
      showQuickReplies('timeline');
    } else if (lower.includes('budget') || lower.includes('price') || lower.includes('cost') || lower.includes('invest')) {
      showQuickReplies('budget');
    } else if (lower.includes('whatsapp') || lower.includes('line') || lower.includes('connect') || lower.includes('slot')) {
      showQuickReplies('handoff');
    } else if (history.length <= 3) {
      showQuickReplies('intro');
    } else if (history.length <= 6) {
      showQuickReplies('timeline');
    }
  }

  /* Passive extraction from conversation */
  function extractLeadData (msgs) {
    const text = msgs.map(m => m.content).join(' ').toLowerCase();
    if (!leadData.service) {
      if      (text.includes('logo') && text.includes('web')) leadData.service = 'Logo + Web Design Bundle';
      else if (text.includes('website') || text.includes('web design')) leadData.service = 'Web Design & Development';
      else if (text.includes('logo'))        leadData.service = 'Logo & Brand Identity';
      else if (text.includes('marketing'))   leadData.service = 'Digital Marketing Strategy';
      else if (text.includes('ai') || text.includes('workshop')) leadData.service = 'AI Marketing Workshop';
      else if (text.includes('english'))     leadData.service = 'English for Business';
    }
    if (!leadData.timeline) {
      if      (text.includes('this week') || text.includes('urgent')) leadData.timeline = 'Urgent — this week';
      else if (text.includes('this month') || text.includes('month')) leadData.timeline = 'This month';
      else if (text.includes('exploring') || text.includes('not sure')) leadData.timeline = 'Exploring';
    }
    if (!leadData.budget) {
      if      (text.includes('under 15') || text.includes('15,000')) leadData.budget = 'Under 15,000 THB';
      else if (text.includes('15') && text.includes('40'))           leadData.budget = '15,000–40,000 THB';
      else if (text.includes('40') || text.includes('flexible'))     leadData.budget = '40,000+ THB';
    }
  }

  /* ─── EXPOSE sendQuick globally for onclick attributes ─── */
  window.chatSendQuick = function (text) {
    if (!isOpen) openChat();
    if ($input) $input.value = text;
    sendMessage();
  };

  window.toggleChat  = toggleChat;
  window.openChat    = openChat;
  window.closeChat   = closeChat;

  /* ─── BOOT ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
