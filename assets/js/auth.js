/* ============================================================
   ChatBot AI Platform - Authentication
   ============================================================ */

const Auth = {
  getUser() {
    return CB.get(CB.KEYS.currentUser);
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  guard() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  login(email, password) {
    const users = CB.get(CB.KEYS.users) || [];
    const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    const { password: _, ...safeUser } = user;
    CB.set(CB.KEYS.currentUser, safeUser);
    return { success: true, user: safeUser };
  },

  register(data) {
    const users = CB.get(CB.KEYS.users) || [];
    if (users.find(u => u.email === data.email.trim().toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: App.generateId('u'),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: 'admin',
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      company: data.company || '',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    CB.set(CB.KEYS.users, users);
    const { password: _, ...safeUser } = newUser;
    CB.set(CB.KEYS.currentUser, safeUser);

    const team = CB.get(CB.KEYS.team) || [];
    team.push({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, status: 'online', avatar: newUser.avatar, conversations: 0, tickets: 0, joined: new Date().toISOString().split('T')[0] });
    CB.set(CB.KEYS.team, team);

    return { success: true, user: safeUser };
  },

  logout() {
    CB.remove(CB.KEYS.currentUser);
    window.location.href = 'login.html';
  },

  hasRole(...roles) {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }
};

// ---- Login Page ----
const LoginPage = {
  init() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    if (Auth.isLoggedIn()) { window.location.href = 'dashboard.html'; return; }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errEl = document.getElementById('loginError');
      errEl.style.display = 'none';

      const result = Auth.login(email, password);
      if (result.success) {
        App.toast('Welcome back, ' + result.user.name + '!', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
      } else {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
      }
    });

    document.querySelectorAll('.demo-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('email').value = btn.dataset.email;
        document.getElementById('password').value = 'password123';
        form.dispatchEvent(new Event('submit'));
      });
    });
  }
};

// ---- Register Page ----
const RegisterPage = {
  init() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    if (Auth.isLoggedIn()) { window.location.href = 'dashboard.html'; return; }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errEl = document.getElementById('registerError');
      errEl.style.display = 'none';

      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const company = document.getElementById('regCompany').value;
      const password = document.getElementById('regPassword').value;
      const confirm = document.getElementById('regConfirm').value;

      if (password !== confirm) {
        errEl.textContent = 'Passwords do not match.';
        errEl.style.display = 'block';
        return;
      }
      if (password.length < 8) {
        errEl.textContent = 'Password must be at least 8 characters.';
        errEl.style.display = 'block';
        return;
      }

      const result = Auth.register({ name, email, company, password });
      if (result.success) {
        App.toast('Account created! Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      } else {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
      }
    });
  }
};

// ---- Logout handler ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
});
