/* ============================================================
   ChatBot AI Platform - Dashboard
   ============================================================ */

const Dashboard = {
  init() {
    if (!Auth.guard()) return;
    this.renderStats();
    this.renderRecentConversations();
    this.renderRecentTickets();
    this.renderMiniChart();
    this.renderChannelChart();
  },

  getStats() {
    const convs = CB.get(CB.KEYS.conversations) || [];
    const tickets = CB.get(CB.KEYS.tickets) || [];
    const analytics = CB.get(CB.KEYS.analytics) || CB.DEMO.analytics;
    const total = convs.length;
    const open = convs.filter(c => c.status === 'open').length;
    const resolved = convs.filter(c => c.status === 'resolved').length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const daily = analytics.daily || [];
    const avgCsat = daily.length ? (daily.reduce((s, d) => s + d.csat, 0) / daily.length).toFixed(1) : '4.5';
    const todayConvs = daily.length ? daily[daily.length - 1].conversations : 0;
    return { total, open, resolved, openTickets, resolvedTickets, avgCsat, todayConvs };
  },

  renderStats() {
    const s = this.getStats();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('statTotalConvs', s.total);
    set('statOpenConvs', s.open);
    set('statOpenTickets', s.openTickets);
    set('statCsat', s.avgCsat + '/5.0');
    set('statTodayConvs', s.todayConvs);
    set('statResolvedTickets', s.resolvedTickets);
  },

  renderRecentConversations() {
    const el = document.getElementById('recentConvs');
    if (!el) return;
    const convs = (CB.get(CB.KEYS.conversations) || []).slice(0, 5);
    if (!convs.length) { el.innerHTML = '<div class="text-muted text-sm" style="padding:1rem">No conversations yet.</div>'; return; }
    el.innerHTML = convs.map(c => `
      <div class="conversation-item" onclick="window.location='chat-inbox.html?id=${c.id}'">
        <div class="avatar avatar-sm" style="background:${this.avatarColor(c.customerName)};color:#fff">${c.customerName[0]}</div>
        <div class="conv-info">
          <div class="conv-name">
            <span>${App.escHtml(c.customerName)}</span>
            <span class="conv-time">${App.timeAgo(c.startedAt)}</span>
          </div>
          <div class="conv-preview">${App.escHtml(c.lastMessage)}</div>
        </div>
        ${c.unread ? '<div class="conv-unread-dot"></div>' : ''}
      </div>`
    ).join('');
  },

  renderRecentTickets() {
    const el = document.getElementById('recentTickets');
    if (!el) return;
    const tickets = (CB.get(CB.KEYS.tickets) || []).filter(t => t.status !== 'resolved').slice(0, 5);
    if (!tickets.length) { el.innerHTML = '<div class="text-muted text-sm" style="padding:1rem">No open tickets.</div>'; return; }
    el.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Ticket</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead>
      <tbody>${tickets.map(t => `
        <tr style="cursor:pointer" onclick="window.location='tickets.html'">
          <td><span class="text-primary text-sm font-semibold">${t.ticketNo}</span></td>
          <td class="text-sm">${App.escHtml(t.subject)}</td>
          <td>${App.getPriorityBadge(t.priority)}</td>
          <td>${App.getStatusBadge(t.status)}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  },

  renderMiniChart() {
    const el = document.getElementById('miniChart');
    if (!el) return;
    const analytics = CB.get(CB.KEYS.analytics) || CB.DEMO.analytics;
    const daily = analytics.daily || [];
    const max = Math.max(...daily.map(d => d.conversations), 1);
    el.innerHTML = `<div class="bar-chart">${daily.map(d => {
      const pct = Math.round((d.conversations / max) * 100);
      const dt = new Date(d.date);
      const label = dt.toLocaleDateString('en-US', { weekday: 'short' });
      return `<div class="bar-group">
        <div class="bar-val">${d.conversations}</div>
        <div class="bar" style="height:${pct}%"></div>
        <div class="bar-label">${label}</div>
      </div>`;
    }).join('')}</div>`;
  },

  renderChannelChart() {
    const el = document.getElementById('channelChart');
    if (!el) return;
    const analytics = CB.get(CB.KEYS.analytics) || CB.DEMO.analytics;
    const channels = analytics.channels || [];
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
    el.innerHTML = `<div class="donut-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120" style="flex-shrink:0">
        ${this.donutSegments(channels, colors)}
        <circle cx="60" cy="60" r="30" fill="white"/>
        <text x="60" y="65" text-anchor="middle" font-size="14" font-weight="800" fill="#1e293b">${channels.reduce((s,c)=>s+c.count,0)}</text>
      </svg>
      <div class="donut-legend">${channels.map((c, i) => `
        <div class="legend-item">
          <div class="legend-dot" style="background:${colors[i]}"></div>
          <span class="text-sm">${App.escHtml(c.name)}</span>
          <span class="text-sm text-muted ml-auto" style="margin-left:auto">${c.pct}%</span>
        </div>`).join('')}
      </div>
    </div>`;
  },

  donutSegments(data, colors) {
    const total = data.reduce((s, d) => s + d.count, 0);
    let offset = 0;
    const r = 45, cx = 60, cy = 60, circumference = 2 * Math.PI * r;
    return data.map((d, i) => {
      const pct = d.count / total;
      const dash = pct * circumference;
      const gap = circumference - dash;
      const rotation = offset * 360 - 90;
      offset += pct;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[i]}" stroke-width="18" stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="0" transform="rotate(${rotation} ${cx} ${cy})" style="transition:stroke-dasharray .5s"/>`;
    }).join('');
  },

  avatarColor(name) {
    const colors = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#3b82f6','#ef4444','#ec4899'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
};
