/* ===== EduSphere - Auth & Session Management ===== */
/* Uses localStorage to persist users (BCA project — no backend needed) */

const AUTH_KEY = 'edusphere_users';
const SESSION_KEY = 'edusphere_session';

const Auth = {
  getUsers() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || []; }
    catch { return []; }
  },
  saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
  },
  signup({ firstName, lastName, email, password }) {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    const user = {
      id: Date.now().toString(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password, // ⚠ Plain text — fine for college project demo only
      createdAt: new Date().toISOString(),
      enrolled: []
    };
    users.push(user);
    this.saveUsers(users);
    this.setSession(user);
    return { ok: true, user };
  },
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    this.setSession(user);
    return { ok: true, user };
  },
  setSession(user) {
    const sess = {
      id: user.id, firstName: user.firstName,
      lastName: user.lastName, email: user.email,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
  },
  getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  },
  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  },
  // Auth guard: call on every protected page
  requireAuth() {
    const s = this.getSession();
    if (!s) {
      window.location.href = 'login.html';
      return null;
    }
    return s;
  }
};

/* ===== Inject navbar user pill on protected pages ===== */
function renderUserPill() {
  const s = Auth.getSession();
  if (!s) return;
  const initials = (s.firstName[0] + (s.lastName[0] || '')).toUpperCase();
  const slot = document.getElementById('userSlot');
  if (!slot) return;
  slot.innerHTML = `
    <div class="user-menu" id="userMenu">
      <button class="user-pill" onclick="document.getElementById('userMenu').classList.toggle('open')">
        <span class="user-avatar">${initials}</span>
        <span class="user-name">${s.firstName} ${s.lastName}</span>
        <span style="color:#6b7280;font-size:12px;">▼</span>
      </button>
      <div class="user-dropdown">
        <a href="index.html">🏠 Home</a>
        <a href="learning.html">📚 My Learning</a>
        <a href="contact.html">✉️ Contact</a>
        <button class="logout" onclick="Auth.logout()">🚪 Logout</button>
      </div>
    </div>`;
  // close on outside click
  document.addEventListener('click', (e) => {
    const m = document.getElementById('userMenu');
    if (m && !m.contains(e.target)) m.classList.remove('open');
  });
}

/* Mobile menu toggle */
function bindMobileMenu() {
  const t = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (t && links) t.addEventListener('click', () => links.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  renderUserPill();
  bindMobileMenu();
});
