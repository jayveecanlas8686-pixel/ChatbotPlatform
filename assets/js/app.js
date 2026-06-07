/* ============================================================
   ChatBot AI Platform - Core App Utilities
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  CB.initDemo();
  App.init();
});

const App = {
  init() {
    this.setupSidebar();
    this.setActiveNav();
    this.setupDropdowns();
    this.setupModals();
    this.setupTabs();
    this.renderUserInfo();
    this.setupNotificationBadge();
    this.setupResetButton();
  },

  setupSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
      });
    }
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
      });
    }
  },

  setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  setupDropdowns() {
    document.querySelectorAll('[data-dropdown]').forEach(trigger => {
      const menuId = trigger.dataset.dropdown;
      const menu = document.getElementById(menuId);
      if (!menu) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
        if (!isOpen) menu.classList.add('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    });
  },

  setupModals() {
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const modal = document.getElementById(trigger.dataset.modal);
        if (modal) App.openModal(modal.id);
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) App.closeModal(overlay.id);
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = btn.closest('.modal-overlay');
        if (overlay) App.closeModal(overlay.id);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => App.closeModal(m.id));
      }
    });
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('active'); document.body.style.overflow = 'hidden'; }
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('active'); document.body.style.overflow = ''; }
  },

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = btn.closest('[data-tabs]') || btn.closest('.card') || btn.parentElement.parentElement;
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const pane = container.querySelector(`#${target}`) || document.getElementById(target);
        if (pane) pane.classList.add('active');
      });
    });
  },

  renderUserInfo() {
    const user = Auth.getUser();
    if (!user) return;
    document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = user.name);
    document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = App.formatRole(user.role));
    document.querySelectorAll('[data-user-avatar]').forEach(el => el.textContent = user.avatar);
    document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = user.email);
    if (user.role === 'agent') {
      document.querySelectorAll('[data-admin-only]').forEach(el => el.style.display = 'none');
    }
  },

  formatRole(role) {
    return { admin: 'Administrator', agent: 'Support Agent', owner: 'Business Owner', viewer: 'Viewer' }[role] || role;
  },

  setupNotificationBadge() {
    const notifs = CB.get(CB.KEYS.notifications) || [];
    const unread = notifs.filter(n => !n.read).length;
    document.querySelectorAll('.notif-badge').forEach(el => {
      if (unread > 0) { el.textContent = unread; el.style.display = 'flex'; }
      else el.style.display = 'none';
    });
  },

  setupResetButton() {
    const btn = document.getElementById('resetDemoBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (confirm('Reset all demo data to defaults? This cannot be undone.')) {
          CB.resetDemo();
          App.toast('Demo data reset successfully!', 'success');
          setTimeout(() => location.reload(), 800);
        }
      });
    }
  },

  toast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  confirm(message, onConfirm) {
    if (window.confirm(message)) onConfirm();
  },

  formatDate(dateStr, opts = {}) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', ...opts });
  },

  formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  timeAgo(dateStr) {
    const d = new Date(dateStr);
    const diff = (Date.now() - d) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  },

  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  },

  getPriorityBadge(priority) {
    const map = { urgent: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-neutral' };
    return `<span class="badge ${map[priority] || 'badge-neutral'}">${priority}</span>`;
  },

  getStatusBadge(status) {
    const map = { open: 'badge-info', in_progress: 'badge-warning', resolved: 'badge-success', closed: 'badge-neutral' };
    const labels = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${labels[status] || status}</span>`;
  },

  getTeamMemberName(id) {
    const team = CB.get(CB.KEYS.team) || [];
    const m = team.find(t => t.id === id);
    return m ? m.name : 'Unassigned';
  },

  escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
};

// Sidebar overlay element (create if needed)
(function() {
  const overlay = document.createElement('div');
  overlay.id = 'sidebarOverlay';
  overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99;';
  overlay.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
  const obs = new MutationObserver(() => {
    overlay.style.display = overlay.classList.contains('active') ? 'block' : 'none';
  });
  obs.observe(overlay, { attributes: true });
  document.body.appendChild(overlay);
})();
