/* ============================================================
   ChatBot AI Platform - Bot Builder
   ============================================================ */

const BotBuilder = {
  state: { settings: null },

  init() {
    if (!Auth.guard()) return;
    this.state.settings = CB.get(CB.KEYS.botSettings) || CB.DEMO.botSettings;
    this.loadForm();
    this.bindEvents();
    this.renderFlows();
    this.renderSuggestions();
    this.updatePreview();
  },

  getSettings() { return this.state.settings; },

  loadForm() {
    const s = this.state.settings;
    this.setVal('botName', s.name);
    this.setVal('botGreeting', s.greeting);
    this.setVal('botFallback', s.fallback);
    this.setVal('botOffline', s.offlineMessage);
    this.setVal('collectEmail', s.collectEmail, 'checked');
    this.setVal('autoGreet', s.autoGreet, 'checked');
    this.setVal('showPoweredBy', s.showPoweredBy, 'checked');

    document.querySelectorAll('.color-swatch').forEach(sw => {
      sw.classList.toggle('selected', sw.dataset.color === s.color);
    });
  },

  setVal(id, val, prop = 'value') {
    const el = document.getElementById(id);
    if (!el) return;
    if (prop === 'checked') el.checked = !!val;
    else el.value = val || '';
  },

  getVal(id, prop = 'value') {
    const el = document.getElementById(id);
    if (!el) return prop === 'checked' ? false : '';
    return prop === 'checked' ? el.checked : el.value;
  },

  bindEvents() {
    document.getElementById('saveBot')?.addEventListener('click', () => this.save());
    document.getElementById('previewBot')?.addEventListener('click', () => this.togglePreview());
    document.getElementById('addFlowBtn')?.addEventListener('click', () => this.addFlow());
    document.getElementById('addSuggestionBtn')?.addEventListener('click', () => this.addSuggestion());
    document.getElementById('botName')?.addEventListener('input', () => this.liveUpdate());
    document.getElementById('botGreeting')?.addEventListener('input', () => this.liveUpdate());

    document.querySelectorAll('.color-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected');
        this.state.settings.color = sw.dataset.color;
        this.updatePreview();
      });
    });

    const emojiPicker = document.getElementById('avatarEmoji');
    if (emojiPicker) {
      emojiPicker.addEventListener('change', () => {
        this.state.settings.avatarEmoji = emojiPicker.value;
        this.updatePreview();
      });
    }
  },

  liveUpdate() {
    this.state.settings.name = this.getVal('botName') || this.state.settings.name;
    this.state.settings.greeting = this.getVal('botGreeting') || this.state.settings.greeting;
    this.updatePreview();
  },

  updatePreview() {
    const s = this.state.settings;
    const name = this.getVal('botName') || s.name;
    const greeting = this.getVal('botGreeting') || s.greeting;
    const color = s.color;
    const emoji = s.avatarEmoji || '🤖';

    const header = document.getElementById('previewHeader');
    if (header) header.style.background = `linear-gradient(135deg, ${color}, #8b5cf6)`;

    const botName = document.getElementById('previewBotName');
    if (botName) botName.textContent = name;

    const previewMsg = document.getElementById('previewGreeting');
    if (previewMsg) previewMsg.textContent = greeting;

    const avatarEls = document.querySelectorAll('.preview-bot-avatar, .preview-avatar-sm');
    avatarEls.forEach(el => el.textContent = emoji);
  },

  save() {
    const s = this.state.settings;
    s.name = this.getVal('botName') || s.name;
    s.greeting = this.getVal('botGreeting') || s.greeting;
    s.fallback = this.getVal('botFallback') || s.fallback;
    s.offlineMessage = this.getVal('botOffline') || s.offlineMessage;
    s.collectEmail = this.getVal('collectEmail', 'checked');
    s.autoGreet = this.getVal('autoGreet', 'checked');
    s.showPoweredBy = this.getVal('showPoweredBy', 'checked');
    CB.set(CB.KEYS.botSettings, s);
    App.toast('Bot settings saved!', 'success');
  },

  togglePreview() {
    const panel = document.getElementById('previewPanel');
    if (panel) panel.classList.toggle('hidden');
  },

  renderFlows() {
    const el = document.getElementById('flowList');
    if (!el) return;
    const flows = this.state.settings.flows || [];
    if (!flows.length) {
      el.innerHTML = '<div class="text-muted text-sm" style="padding:0.5rem">No flows yet. Add one below.</div>';
      return;
    }
    el.innerHTML = flows.map((f, i) => `
      <div class="card" style="margin-bottom:.625rem;padding:.875rem 1rem">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.75rem">
          <div style="flex:1">
            <div class="text-xs text-muted mb-1">Trigger keyword(s)</div>
            <input type="text" class="form-control" style="font-size:.8rem;margin-bottom:.5rem" value="${App.escHtml(f.trigger)}" onchange="BotBuilder.updateFlow(${i},'trigger',this.value)" />
            <div class="text-xs text-muted mb-1">Bot response</div>
            <textarea class="form-control" style="font-size:.8rem;min-height:60px" onchange="BotBuilder.updateFlow(${i},'response',this.value)">${App.escHtml(f.response)}</textarea>
          </div>
          <button class="btn btn-sm btn-danger" onclick="BotBuilder.deleteFlow(${i})" style="flex-shrink:0"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('');
  },

  addFlow() {
    const trigger = document.getElementById('newFlowTrigger')?.value?.trim();
    const response = document.getElementById('newFlowResponse')?.value?.trim();
    if (!trigger || !response) { App.toast('Please fill in both trigger and response', 'error'); return; }
    if (!this.state.settings.flows) this.state.settings.flows = [];
    this.state.settings.flows.push({ id: App.generateId('f'), trigger, response });
    document.getElementById('newFlowTrigger').value = '';
    document.getElementById('newFlowResponse').value = '';
    this.renderFlows();
    App.toast('Flow added!', 'success');
  },

  updateFlow(i, field, value) {
    if (this.state.settings.flows[i]) this.state.settings.flows[i][field] = value;
  },

  deleteFlow(i) {
    this.state.settings.flows.splice(i, 1);
    this.renderFlows();
    App.toast('Flow removed', 'success');
  },

  renderSuggestions() {
    const el = document.getElementById('suggestionList');
    if (!el) return;
    const suggs = this.state.settings.suggestions || [];
    el.innerHTML = suggs.map((s, i) => `
      <div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.5rem">
        <div class="suggestion-chip" style="flex:1">${App.escHtml(s)}</div>
        <button class="btn btn-sm btn-ghost" onclick="BotBuilder.deleteSuggestion(${i})"><i class="fas fa-times"></i></button>
      </div>`).join('') || '<div class="text-muted text-sm">No suggestions yet.</div>';
  },

  addSuggestion() {
    const input = document.getElementById('newSuggestion');
    const text = input?.value?.trim();
    if (!text) return;
    if (!this.state.settings.suggestions) this.state.settings.suggestions = [];
    this.state.settings.suggestions.push(text);
    input.value = '';
    this.renderSuggestions();
    this.updatePreview();
  },

  deleteSuggestion(i) {
    this.state.settings.suggestions.splice(i, 1);
    this.renderSuggestions();
  }
};
