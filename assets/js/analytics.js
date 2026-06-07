/* ============================================================
   ChatBot AI Platform - Analytics
   ============================================================ */

const Analytics = {
  init() {
    if (!Auth.guard()) return;
    this.renderSummaryStats();
    this.renderVolumeChart();
    this.renderTopQuestions();
    this.renderCategoryChart();
    this.renderCSATChart();
    this.renderChannelBars();
  },

  getData() {
    return CB.get(CB.KEYS.analytics) || CB.DEMO.analytics;
  },

  renderSummaryStats() {
    const d = this.getData();
    const daily = d.daily || [];
    const totalConvs = daily.reduce((s, x) => s + x.conversations, 0);
    const totalResolved = daily.reduce((s, x) => s + x.resolved, 0);
    const avgTime = daily.length ? (daily.reduce((s, x) => s + x.avgTime, 0) / daily.length).toFixed(1) : '0';
    const avgCsat = daily.length ? (daily.reduce((s, x) => s + x.csat, 0) / daily.length).toFixed(1) : '0';
    const resolutionRate = totalConvs ? Math.round(totalResolved / totalConvs * 100) : 0;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('anTotalConvs', totalConvs);
    set('anResolutionRate', resolutionRate + '%');
    set('anAvgTime', avgTime + 'm');
    set('anCsat', avgCsat + '/5');
    set('anTodayConvs', daily.at(-1)?.conversations || 0);
    set('anBotResolved', Math.round(totalResolved * 0.72));
  },

  renderVolumeChart() {
    const el = document.getElementById('volumeChart');
    if (!el) return;
    const d = this.getData();
    const daily = d.daily || [];
    const max = Math.max(...daily.map(x => x.conversations), 1);
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:.5rem">
        <span class="text-sm font-semibold">Conversations (Last 7 Days)</span>
        <span class="text-xs text-muted">Total: ${daily.reduce((s,x)=>s+x.conversations,0)}</span>
      </div>
      <div class="bar-chart" style="height:160px">${daily.map(d => {
        const pct = Math.max(Math.round((d.conversations / max) * 100), 4);
        const dt = new Date(d.date);
        const label = dt.toLocaleDateString('en-US', { weekday: 'short' });
        const dateLabel = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `<div class="bar-group" title="${dateLabel}: ${d.conversations} conversations">
          <div class="bar-val">${d.conversations}</div>
          <div class="bar" style="height:${pct}%"></div>
          <div class="bar-label">${label}</div>
        </div>`;
      }).join('')}</div>
      <div style="display:flex;gap:1.5rem;margin-top:1rem;justify-content:center">
        <div style="display:flex;align-items:center;gap:.375rem">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--primary)"></div>
          <span class="text-xs text-muted">Conversations</span>
        </div>
        <div style="display:flex;align-items:center;gap:.375rem">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--success)"></div>
          <span class="text-xs text-muted">Resolved</span>
        </div>
      </div>`;
  },

  renderTopQuestions() {
    const el = document.getElementById('topQuestions');
    if (!el) return;
    const d = this.getData();
    const questions = (d.topQuestions || []).slice(0, 5);
    const max = Math.max(...questions.map(q => q.count), 1);
    el.innerHTML = questions.map((q, i) => {
      const pct = Math.round(q.count / max * 100);
      return `<div style="margin-bottom:.875rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:.375rem">
          <span class="text-sm" style="flex:1;margin-right:.75rem">${i + 1}. ${App.escHtml(q.question)}</span>
          <span class="text-sm font-semibold" style="white-space:nowrap">${q.count}x</span>
        </div>
        <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      </div>`;
    }).join('') || '<div class="text-muted text-sm">No data yet.</div>';
  },

  renderCategoryChart() {
    const el = document.getElementById('categoryChart');
    if (!el) return;
    const d = this.getData();
    const categories = (d.categories || []);
    const max = Math.max(...categories.map(c => c.count), 1);
    const colors = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#3b82f6'];
    el.innerHTML = categories.map((c, i) => {
      const pct = Math.round(c.count / max * 100);
      return `<div style="margin-bottom:.75rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
          <span class="text-sm">${App.escHtml(c.name)}</span>
          <span class="text-sm text-muted">${c.count}</span>
        </div>
        <div class="progress" style="height:10px">
          <div style="width:${pct}%;height:100%;border-radius:9999px;background:${colors[i % colors.length]}"></div>
        </div>
      </div>`;
    }).join('');
  },

  renderCSATChart() {
    const el = document.getElementById('csatChart');
    if (!el) return;
    const d = this.getData();
    const daily = d.daily || [];
    const avg = daily.length ? (daily.reduce((s,x)=>s+x.csat,0)/daily.length).toFixed(1) : '4.5';
    const pct = (avg / 5 * 100).toFixed(0);
    const scores = [
      { stars: 5, count: 234, pct: 65 },
      { stars: 4, count: 87, pct: 24 },
      { stars: 3, count: 25, pct: 7 },
      { stars: 2, count: 8, pct: 2 },
      { stars: 1, count: 4, pct: 1 },
    ];
    el.innerHTML = `
      <div style="text-align:center;margin-bottom:1.25rem">
        <div style="font-size:3rem;font-weight:800;color:var(--primary)">${avg}</div>
        <div style="color:var(--warning);font-size:1.25rem;margin:.25rem 0">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</div>
        <div class="text-sm text-muted">Based on ${daily.reduce((s,x)=>s+x.conversations,0)} conversations</div>
      </div>
      ${scores.map(s => `
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
          <span class="text-xs text-muted" style="width:20px">${s.stars}★</span>
          <div class="progress" style="flex:1;height:10px"><div style="width:${s.pct}%;height:100%;border-radius:9999px;background:var(--warning)"></div></div>
          <span class="text-xs text-muted" style="width:30px;text-align:right">${s.pct}%</span>
        </div>`).join('')}`;
  },

  renderChannelBars() {
    const el = document.getElementById('channelBars');
    if (!el) return;
    const d = this.getData();
    const channels = d.channels || [];
    const colors = ['#6366f1','#8b5cf6','#10b981','#f59e0b'];
    el.innerHTML = channels.map((c, i) => `
      <div style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:.375rem">
          <span class="text-sm font-semibold">${App.escHtml(c.name)}</span>
          <span class="text-sm">${c.count} <span class="text-muted">(${c.pct}%)</span></span>
        </div>
        <div class="progress" style="height:12px">
          <div style="width:${c.pct}%;height:100%;border-radius:9999px;background:${colors[i % colors.length]};transition:width .6s ease"></div>
        </div>
      </div>`).join('');
  }
};
