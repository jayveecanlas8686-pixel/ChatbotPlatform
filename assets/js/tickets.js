/* ============================================================
   ChatBot AI Platform - Tickets Management
   ============================================================ */

const Tickets = {
  state: { filter: { status: '', priority: '', category: '', search: '' }, editingId: null },

  init() {
    if (!Auth.guard()) return;
    this.render();
    this.bindEvents();
  },

  getTeam() { return CB.get(CB.KEYS.team) || []; },
  getTickets() { return CB.get(CB.KEYS.tickets) || []; },
  saveTickets(t) { CB.set(CB.KEYS.tickets, t); },

  filtered() {
    const { status, priority, category, search } = this.state.filter;
    return this.getTickets().filter(t => {
      if (status && t.status !== status) return false;
      if (priority && t.priority !== priority) return false;
      if (category && t.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.subject.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q) || t.ticketNo.toLowerCase().includes(q);
      }
      return true;
    });
  },

  render() {
    const el = document.getElementById('ticketList');
    if (!el) return;
    const tickets = this.filtered();
    this.renderStats();
    if (!tickets.length) {
      el.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--text-muted)">No tickets found.</td></tr>`;
      return;
    }
    const team = this.getTeam();
    el.innerHTML = tickets.map(t => {
      const agent = team.find(m => m.id === t.assignedTo);
      return `<tr>
        <td><span class="text-primary text-sm font-semibold">${t.ticketNo}</span></td>
        <td>
          <div class="font-semibold text-sm">${App.escHtml(t.subject)}</div>
          <div class="text-xs text-muted">${App.escHtml(t.customerName)}</div>
        </td>
        <td>${App.getPriorityBadge(t.priority)}</td>
        <td>${App.getStatusBadge(t.status)}</td>
        <td class="text-sm text-muted">${App.escHtml(t.category)}</td>
        <td>
          ${agent ? `<div style="display:flex;align-items:center;gap:.375rem"><div class="avatar avatar-sm">${agent.avatar}</div><span class="text-sm">${App.escHtml(agent.name.split(' ')[0])}</span></div>` : '<span class="text-muted text-sm">—</span>'}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="Tickets.openDetail('${t.id}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-sm btn-outline" onclick="Tickets.openEdit('${t.id}')"><i class="fas fa-pen"></i></button>
            ${Auth.hasRole('admin','owner') ? `<button class="btn btn-sm btn-danger" onclick="Tickets.deleteTicket('${t.id}')"><i class="fas fa-trash"></i></button>` : ''}
          </div>
        </td>
      </tr>`;
    }).join('');
  },

  renderStats() {
    const all = this.getTickets();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('statOpen', all.filter(t => t.status === 'open').length);
    set('statInProgress', all.filter(t => t.status === 'in_progress').length);
    set('statResolved', all.filter(t => t.status === 'resolved').length);
    set('statUrgent', all.filter(t => t.priority === 'urgent').length);
  },

  bindEvents() {
    document.getElementById('filterStatus')?.addEventListener('change', e => { this.state.filter.status = e.target.value; this.render(); });
    document.getElementById('filterPriority')?.addEventListener('change', e => { this.state.filter.priority = e.target.value; this.render(); });
    document.getElementById('filterCategory')?.addEventListener('change', e => { this.state.filter.category = e.target.value; this.render(); });
    document.getElementById('searchTickets')?.addEventListener('input', e => { this.state.filter.search = e.target.value; this.render(); });
    document.getElementById('newTicketBtn')?.addEventListener('click', () => this.openCreate());
    document.getElementById('saveTicketBtn')?.addEventListener('click', () => this.saveTicket());
    document.getElementById('saveEditBtn')?.addEventListener('click', () => this.saveEdit());
    document.getElementById('addNoteBtn')?.addEventListener('click', () => this.addNote());
  },

  openCreate() {
    this.state.editingId = null;
    document.getElementById('ticketModalTitle').textContent = 'Create New Ticket';
    document.getElementById('ticketForm').reset();
    this.populateAssignees('ticketAssignTo');
    App.openModal('ticketModal');
  },

  openEdit(id) {
    const t = this.getTickets().find(x => x.id === id);
    if (!t) return;
    this.state.editingId = id;
    document.getElementById('editSubject').value = t.subject;
    document.getElementById('editDescription').value = t.description;
    document.getElementById('editStatus').value = t.status;
    document.getElementById('editPriority').value = t.priority;
    document.getElementById('editCategory').value = t.category;
    this.populateAssignees('editAssignTo', t.assignedTo);
    App.openModal('editTicketModal');
  },

  openDetail(id) {
    const t = this.getTickets().find(x => x.id === id);
    if (!t) return;
    this.state.editingId = id;
    const el = document.getElementById('ticketDetailContent');
    if (!el) return;
    const team = this.getTeam();
    const agent = team.find(m => m.id === t.assignedTo);
    const notes = (t.notes || []).map(n => `
      <div style="padding:.75rem;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border);margin-bottom:.5rem">
        <div class="text-sm">${App.escHtml(n.text)}</div>
        <div class="text-xs text-muted mt-1">${App.escHtml(n.author)} · ${App.formatTime(n.time)}</div>
      </div>`).join('') || '<div class="text-muted text-sm">No notes yet.</div>';
    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
        <div><div class="text-xs text-muted">Ticket No</div><div class="font-semibold">${t.ticketNo}</div></div>
        <div><div class="text-xs text-muted">Status</div>${App.getStatusBadge(t.status)}</div>
        <div><div class="text-xs text-muted">Priority</div>${App.getPriorityBadge(t.priority)}</div>
        <div><div class="text-xs text-muted">Category</div><div class="text-sm">${App.escHtml(t.category)}</div></div>
        <div><div class="text-xs text-muted">Customer</div><div class="text-sm font-semibold">${App.escHtml(t.customerName)}</div></div>
        <div><div class="text-xs text-muted">Assigned To</div><div class="text-sm">${agent ? App.escHtml(agent.name) : 'Unassigned'}</div></div>
        <div><div class="text-xs text-muted">Created</div><div class="text-sm">${App.formatDate(t.createdAt)}</div></div>
        <div><div class="text-xs text-muted">Updated</div><div class="text-sm">${App.formatDate(t.updatedAt)}</div></div>
      </div>
      <div style="margin-bottom:1.25rem">
        <div class="text-xs text-muted mb-1">Description</div>
        <div class="text-sm" style="background:var(--bg);padding:.75rem;border-radius:var(--radius);border:1px solid var(--border)">${App.escHtml(t.description)}</div>
      </div>
      <div>
        <div class="text-xs text-muted mb-1">Internal Notes</div>
        <div id="notesList">${notes}</div>
        <div style="display:flex;gap:.5rem;margin-top:.75rem">
          <input type="text" class="form-control" id="newNoteInput" placeholder="Add internal note..." style="font-size:.8rem" />
          <button class="btn btn-primary btn-sm" id="addNoteBtn">Add</button>
        </div>
      </div>`;
    document.getElementById('addNoteBtn')?.addEventListener('click', () => this.addNote());
    App.openModal('ticketDetailModal');
  },

  populateAssignees(selectId, selectedId = '') {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    const team = this.getTeam().filter(m => ['admin','agent'].includes(m.role));
    sel.innerHTML = `<option value="">Unassigned</option>` + team.map(m =>
      `<option value="${m.id}" ${m.id === selectedId ? 'selected' : ''}>${App.escHtml(m.name)}</option>`
    ).join('');
  },

  saveTicket() {
    const subject = document.getElementById('ticketSubject')?.value?.trim();
    const description = document.getElementById('ticketDescription')?.value?.trim();
    const priority = document.getElementById('ticketPriority')?.value;
    const category = document.getElementById('ticketCategory')?.value;
    const customerName = document.getElementById('ticketCustomer')?.value?.trim() || 'Customer';
    const customerEmail = document.getElementById('ticketEmail')?.value?.trim() || '';
    const assignedTo = document.getElementById('ticketAssignTo')?.value || null;

    if (!subject) { App.toast('Please enter a subject', 'error'); return; }

    const tickets = this.getTickets();
    const lastNo = tickets.length ? parseInt(tickets.sort((a,b) => a.ticketNo.localeCompare(b.ticketNo)).at(-1).ticketNo.split('-')[1]) : 0;
    const newTicket = {
      id: App.generateId('t'),
      ticketNo: `TKT-${String(lastNo + 1).padStart(3, '0')}`,
      subject, description: description || '', priority, category,
      customerName, customerEmail,
      status: 'open', assignedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationId: null, notes: [],
    };
    tickets.push(newTicket);
    this.saveTickets(tickets);
    App.closeModal('ticketModal');
    App.toast('Ticket ' + newTicket.ticketNo + ' created!', 'success');
    this.render();
  },

  saveEdit() {
    const id = this.state.editingId;
    if (!id) return;
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === id);
    if (idx < 0) return;
    tickets[idx] = {
      ...tickets[idx],
      subject: document.getElementById('editSubject').value.trim(),
      description: document.getElementById('editDescription').value.trim(),
      status: document.getElementById('editStatus').value,
      priority: document.getElementById('editPriority').value,
      category: document.getElementById('editCategory').value,
      assignedTo: document.getElementById('editAssignTo').value || null,
      updatedAt: new Date().toISOString(),
    };
    this.saveTickets(tickets);
    App.closeModal('editTicketModal');
    App.toast('Ticket updated!', 'success');
    this.render();
  },

  deleteTicket(id) {
    App.confirm('Delete this ticket? This cannot be undone.', () => {
      const tickets = this.getTickets().filter(t => t.id !== id);
      this.saveTickets(tickets);
      App.toast('Ticket deleted', 'success');
      this.render();
    });
  },

  addNote() {
    const input = document.getElementById('newNoteInput');
    if (!input || !input.value.trim()) return;
    const id = this.state.editingId;
    if (!id) return;
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === id);
    if (idx < 0) return;
    const user = Auth.getUser();
    if (!tickets[idx].notes) tickets[idx].notes = [];
    tickets[idx].notes.push({ text: input.value.trim(), author: user?.name || 'Agent', time: new Date().toISOString() });
    tickets[idx].updatedAt = new Date().toISOString();
    this.saveTickets(tickets);
    input.value = '';
    this.openDetail(id);
    App.toast('Note added', 'success');
  }
};
