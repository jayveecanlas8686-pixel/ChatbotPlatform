/* ============================================================
   ChatBot AI Platform - Chatbot Engine
   ============================================================ */

const Chatbot = {
  state: {
    open: false,
    sessionId: null,
    messages: [],
    typing: false,
    escalated: false,
    waitingForEmail: false,
    customerEmail: null,
  },

  init(containerId = 'chatbotWidget') {
    const container = document.getElementById(containerId);
    if (!container) return;
    CB.initDemo();
    this.state.sessionId = 'sess_' + Date.now();
    this.render(container);
    this.loadHistory();
    if (this.state.messages.length === 0) this.sendGreeting();
  },

  getSettings() {
    return CB.get(CB.KEYS.botSettings) || CB.DEMO.botSettings;
  },

  render(container) {
    const s = this.getSettings();
    container.innerHTML = `
      <button class="chatbot-trigger" id="chatTrigger" aria-label="Open chat">
        <i class="fas fa-comment-dots"></i>
      </button>
      <div class="chatbot-window" id="chatWindow">
        <div class="chatbot-header" style="background: linear-gradient(135deg, ${s.color}, #8b5cf6)">
          <div class="chatbot-header-info">
            <div class="chatbot-bot-avatar">${s.avatarEmoji || '🤖'}</div>
            <div>
              <div class="chatbot-bot-name">${App.escHtml(s.name)}</div>
              <div class="chatbot-status">🟢 Online · Usually replies instantly</div>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button id="chatMinimize" title="Minimize"><i class="fas fa-minus"></i></button>
            <button id="chatClose" title="Close"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="chatbot-messages" id="chatMessages"></div>
        <div class="chatbot-suggestions" id="chatSuggestions"></div>
        <div class="chatbot-actions">
          <button class="chatbot-action-btn" id="escalateBtn">👤 Talk to Human</button>
          <button class="chatbot-action-btn" id="createTicketBtn">🎫 Create Ticket</button>
          <button class="chatbot-action-btn" id="clearChatBtn">🗑️ Clear Chat</button>
        </div>
        <div class="chatbot-input">
          <div class="chatbot-input-row">
            <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off" />
            <button class="chatbot-send" id="chatSend"><i class="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>`;

    this.bindEvents();
    this.renderSuggestions();
  },

  bindEvents() {
    document.getElementById('chatTrigger').addEventListener('click', () => this.toggle());
    document.getElementById('chatMinimize').addEventListener('click', () => this.close());
    document.getElementById('chatClose').addEventListener('click', () => this.close());
    document.getElementById('chatSend').addEventListener('click', () => this.handleSend());
    document.getElementById('chatInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
    document.getElementById('escalateBtn').addEventListener('click', () => this.escalate());
    document.getElementById('createTicketBtn').addEventListener('click', () => this.createTicket());
    document.getElementById('clearChatBtn').addEventListener('click', () => this.clearChat());
  },

  toggle() {
    this.state.open ? this.close() : this.open();
  },

  open() {
    this.state.open = true;
    document.getElementById('chatWindow').classList.add('open');
    document.getElementById('chatTrigger').innerHTML = '<i class="fas fa-times"></i>';
    setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
  },

  close() {
    this.state.open = false;
    document.getElementById('chatWindow').classList.remove('open');
    document.getElementById('chatTrigger').innerHTML = '<i class="fas fa-comment-dots"></i>';
  },

  sendGreeting() {
    const s = this.getSettings();
    this.addBotMessage(s.greeting);
    const settings = CB.get(CB.KEYS.settings);
    const bh = settings?.businessHours;
    if (bh && !this.isBusinessHours(bh)) {
      this.addBotMessage(s.offlineMessage || 'We\'re currently offline. Leave a message!');
    }
    if (s.collectEmail) {
      setTimeout(() => this.addBotMessage('To better assist you, could you share your email address?'), 1500);
      this.state.waitingForEmail = true;
    }
  },

  isBusinessHours(bh) {
    if (!bh.enabled) return true;
    const now = new Date();
    const days = ['sun','mon','tue','wed','thu','fri','sat'];
    const day = days[now.getDay()];
    const h = bh.hours?.[day];
    if (!h?.active) return false;
    const [oh, om] = h.open.split(':').map(Number);
    const [ch, cm] = h.close.split(':').map(Number);
    const current = now.getHours() * 60 + now.getMinutes();
    return current >= oh * 60 + om && current < ch * 60 + cm;
  },

  handleSend() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.addUserMessage(text);
    this.hidesuggestions();
    setTimeout(() => this.processInput(text), 400);
  },

  processInput(text) {
    if (this.state.waitingForEmail) {
      if (this.isEmail(text)) {
        this.state.customerEmail = text;
        this.state.waitingForEmail = false;
        this.addBotMessage(`Thanks! I'll remember that. How can I help you today?`);
        this.renderSuggestions();
      } else {
        this.addBotMessage('Please enter a valid email address (e.g. name@example.com)');
      }
      return;
    }
    this.showTyping();
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(text);
      this.addBotMessage(response);
    }, delay);
  },

  generateResponse(text) {
    const lower = text.toLowerCase();
    const s = this.getSettings();

    if (lower.match(/\b(hello|hi|hey|good morning|good afternoon|howdy)\b/)) {
      const greets = ['Hi there! 😊 How can I help you?', 'Hello! What can I do for you today?', 'Hey! Great to hear from you. How can I assist?'];
      return greets[Math.floor(Math.random() * greets.length)];
    }
    if (lower.match(/\b(thank|thanks|thank you|appreciate)\b/)) {
      return 'You\'re welcome! Is there anything else I can help you with? 😊';
    }
    if (lower.match(/\b(bye|goodbye|see you|ttyl)\b/)) {
      return 'Goodbye! Have a wonderful day. Don\'t hesitate to reach out if you need anything. 👋';
    }

    const flows = s.flows || [];
    for (const flow of flows) {
      const patterns = flow.trigger.split('|').map(p => p.trim());
      if (patterns.some(p => lower.includes(p))) {
        if (lower.match(/human|agent|talk to|speak/)) this.state.escalated = true;
        return flow.response;
      }
    }

    const articles = CB.get(CB.KEYS.articles) || [];
    const published = articles.filter(a => a.status === 'published');
    let best = null, bestScore = 0;
    for (const article of published) {
      const score = this.relevanceScore(lower, article);
      if (score > bestScore) { bestScore = score; best = article; }
    }
    if (best && bestScore > 1) {
      const excerpt = best.content.slice(0, 200) + (best.content.length > 200 ? '...' : '');
      return `Based on our knowledge base — <strong>${App.escHtml(best.title)}</strong>:<br><br>${App.escHtml(excerpt)}<br><br>Does this answer your question?`;
    }

    return s.fallback || 'I\'m not sure I understand. Could you rephrase? Or type "talk to agent" to speak with a human.';
  },

  relevanceScore(query, article) {
    const words = query.split(/\s+/).filter(w => w.length > 2);
    const haystack = (article.title + ' ' + article.content + ' ' + (article.tags || []).join(' ')).toLowerCase();
    let score = 0;
    words.forEach(w => { if (haystack.includes(w)) score++; });
    return score;
  },

  addBotMessage(html) {
    const s = this.getSettings();
    const id = App.generateId('msg');
    const msg = { id, role: 'bot', html, time: new Date().toISOString() };
    this.state.messages.push(msg);
    this.saveHistory();
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'bot-msg';
    el.innerHTML = `
      <div class="bot-avatar-sm">${s.avatarEmoji || '🤖'}</div>
      <div>
        <div class="bot-bubble">${html}</div>
        <div class="msg-time">${App.formatTime(msg.time)}</div>
      </div>`;
    container.appendChild(el);
    this.scrollToBottom();
  },

  addUserMessage(text) {
    const id = App.generateId('msg');
    const msg = { id, role: 'user', text, time: new Date().toISOString() };
    this.state.messages.push(msg);
    this.saveHistory();
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'user-msg';
    el.innerHTML = `
      <div>
        <div class="user-bubble">${App.escHtml(text)}</div>
        <div class="msg-time" style="text-align:right">${App.formatTime(msg.time)}</div>
      </div>`;
    container.appendChild(el);
    this.scrollToBottom();
  },

  showTyping() {
    this.state.typing = true;
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'bot-msg';
    el.id = 'typingIndicator';
    const s = this.getSettings();
    el.innerHTML = `
      <div class="bot-avatar-sm">${s.avatarEmoji || '🤖'}</div>
      <div class="bot-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>`;
    container.appendChild(el);
    this.scrollToBottom();
  },

  hideTyping() {
    this.state.typing = false;
    document.getElementById('typingIndicator')?.remove();
  },

  renderSuggestions() {
    const s = this.getSettings();
    const container = document.getElementById('chatSuggestions');
    if (!container) return;
    container.innerHTML = (s.suggestions || []).map(q =>
      `<button class="suggestion-chip" onclick="Chatbot.handleSuggestion('${App.escHtml(q)}')">${App.escHtml(q)}</button>`
    ).join('');
  },

  hidesuggestions() {
    const el = document.getElementById('chatSuggestions');
    if (el) el.innerHTML = '';
  },

  handleSuggestion(text) {
    document.getElementById('chatInput').value = text;
    this.handleSend();
  },

  escalate() {
    this.state.escalated = true;
    this.addBotMessage('Connecting you with a human agent... 👤<br><br>Please hold on. An agent will join this conversation shortly. Average wait time: <strong>~2 minutes</strong>.');
    App.toast('Escalated to human agent', 'info');
  },

  createTicket() {
    const ticketSubject = prompt('Enter a brief description of your issue:');
    if (!ticketSubject) return;
    const tickets = CB.get(CB.KEYS.tickets) || [];
    const lastNo = tickets.length > 0 ? parseInt(tickets[tickets.length - 1].ticketNo.split('-')[1]) : 0;
    const newTicket = {
      id: App.generateId('t'),
      ticketNo: `TKT-${String(lastNo + 1).padStart(3, '0')}`,
      subject: ticketSubject,
      customerName: 'Web Visitor',
      customerEmail: this.state.customerEmail || 'visitor@web.com',
      status: 'open',
      priority: 'medium',
      category: 'General',
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: `Created from chat. Session: ${this.state.sessionId}`,
      conversationId: this.state.sessionId,
      notes: [],
    };
    tickets.push(newTicket);
    CB.set(CB.KEYS.tickets, tickets);
    this.addBotMessage(`✅ Ticket <strong>${newTicket.ticketNo}</strong> created successfully! Our team will review it and get back to you within 24 hours.`);
    App.toast('Ticket created: ' + newTicket.ticketNo, 'success');
  },

  clearChat() {
    this.state.messages = [];
    this.saveHistory();
    const container = document.getElementById('chatMessages');
    if (container) container.innerHTML = '';
    this.sendGreeting();
    this.renderSuggestions();
  },

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) container.scrollTop = container.scrollHeight;
  },

  saveHistory() {
    CB.set(CB.KEYS.chatHistory + '_' + this.state.sessionId, this.state.messages);
  },

  loadHistory() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    const history = CB.get(CB.KEYS.chatHistory + '_demo') || [];
    history.forEach(msg => {
      this.state.messages.push(msg);
      if (msg.role === 'bot') {
        const s = this.getSettings();
        const el = document.createElement('div');
        el.className = 'bot-msg';
        el.innerHTML = `<div class="bot-avatar-sm">${s.avatarEmoji || '🤖'}</div><div><div class="bot-bubble">${msg.html || App.escHtml(msg.text || '')}</div><div class="msg-time">${App.formatTime(msg.time)}</div></div>`;
        container.appendChild(el);
      } else {
        const el = document.createElement('div');
        el.className = 'user-msg';
        el.innerHTML = `<div><div class="user-bubble">${App.escHtml(msg.text)}</div><div class="msg-time" style="text-align:right">${App.formatTime(msg.time)}</div></div>`;
        container.appendChild(el);
      }
    });
    this.scrollToBottom();
  },

  isEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }
};
