/* ===== EduSphere Chatbot - Rule-based AI Assistant ===== */

const ChatBot = {
  responses: [
    { keys: ['hi', 'hello', 'hey', 'hola'], reply: "Hi there! 👋 I'm EduBot, your learning assistant. How can I help you today?" },
    { keys: ['course', 'courses', 'learn', 'study'], reply: "We offer 50+ courses across Web Development, Data Science, AI/ML, Design, Mobile Apps, and Business. Visit the <b>Learning</b> page to explore them all! 📚" },
    { keys: ['price', 'cost', 'fee', 'fees', 'payment'], reply: "Most courses range from ₹499 to ₹4,999. We also have many <b>free</b> courses for beginners! 💰 Premium membership gives unlimited access for ₹999/month." },
    { keys: ['certificate', 'certification'], reply: "Yes! 🎓 You get an industry-recognized certificate after completing any course with at least 80% score." },
    { keys: ['instructor', 'teacher', 'mentor'], reply: "All our instructors are industry experts from Google, Microsoft, Amazon, and top startups, with 5+ years of teaching experience. 👨‍🏫" },
    { keys: ['refund', 'money back'], reply: "We offer a <b>30-day money-back guarantee</b> on all paid courses. No questions asked! ✅" },
    { keys: ['contact', 'support', 'help'], reply: "You can reach us via the <b>Contact</b> page, or email support@edusphere.com. We reply within 24 hours! ✉️" },
    { keys: ['time', 'duration', 'how long'], reply: "Course duration varies from 4 weeks to 6 months. You learn at your own pace — lifetime access included! ⏰" },
    { keys: ['beginner', 'start', 'new'], reply: "Perfect! 🌟 Start with our <b>Web Development Basics</b> or <b>Python for Beginners</b> course. Both are FREE!" },
    { keys: ['job', 'placement', 'career'], reply: "We have a 92% placement rate! Our career services include resume building, mock interviews, and partner company referrals. 💼" },
    { keys: ['login', 'sign in', 'account'], reply: "You can log in from the top-right corner. New here? Click <b>Sign Up</b> — it's free! 🔐" },
    { keys: ['thank', 'thanks'], reply: "You're very welcome! 😊 Happy learning with EduSphere!" },
    { keys: ['bye', 'goodbye'], reply: "Goodbye! 👋 Come back anytime. Keep learning, keep growing! 🌱" },
    { keys: ['who', 'what is edusphere', 'about'], reply: "EduSphere is a modern e-learning platform helping 50,000+ learners worldwide master in-demand skills. 🌍" },
  ],
  defaultReply: "I'm not sure about that one 🤔. Try asking about <b>courses, pricing, certificates, instructors, or career support</b>. You can also visit the Contact page!",
  suggestions: ['Show courses', 'Pricing?', 'Certificates?', 'Beginner courses', 'Career support'],

  findReply(text) {
    const t = text.toLowerCase();
    for (const r of this.responses) {
      if (r.keys.some(k => t.includes(k))) return r.reply;
    }
    return this.defaultReply;
  },

  init() {
    // Inject HTML
    const html = `
      <button class="chatbot-toggle" id="chatToggle" aria-label="Open chat">💬</button>
      <div class="chatbot-window" id="chatWindow">
        <div class="chatbot-header">
          <div class="av">🤖</div>
          <div>
            <strong>EduBot Assistant</strong>
            <span>Online — typically replies instantly</span>
          </div>
        </div>
        <div class="chatbot-body" id="chatBody"></div>
        <div class="chatbot-input">
          <input type="text" id="chatInput" placeholder="Ask me anything..." autocomplete="off"/>
          <button id="chatSend" aria-label="Send">➤</button>
        </div>
      </div>`;
    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    const toggle = document.getElementById('chatToggle');
    const win = document.getElementById('chatWindow');
    const body = document.getElementById('chatBody');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');

    toggle.addEventListener('click', () => {
      win.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.textContent = win.classList.contains('open') ? '✕' : '💬';
      if (win.classList.contains('open') && body.children.length === 0) {
        const s = (typeof Auth !== 'undefined' && Auth.getSession()) || null;
        const greet = s ? `Hi <b>${s.firstName}</b>! 👋 Welcome back to EduSphere. How can I help you today?`
                        : "Hi there! 👋 I'm EduBot. How can I help you?";
        this.addBot(greet);
        this.addSuggestions();
      }
    });

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;
      this.addUser(text);
      input.value = '';
      this.showTyping();
      setTimeout(() => {
        this.removeTyping();
        this.addBot(this.findReply(text));
      }, 700 + Math.random() * 500);
    };
    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
  },

  addBot(text) {
    const body = document.getElementById('chatBody');
    const m = document.createElement('div');
    m.className = 'chat-msg bot';
    m.innerHTML = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  },
  addUser(text) {
    const body = document.getElementById('chatBody');
    const m = document.createElement('div');
    m.className = 'chat-msg user';
    m.textContent = text;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
  },
  addSuggestions() {
    const body = document.getElementById('chatBody');
    const wrap = document.createElement('div');
    wrap.className = 'chat-suggestions';
    this.suggestions.forEach(s => {
      const b = document.createElement('button');
      b.textContent = s;
      b.onclick = () => {
        document.getElementById('chatInput').value = s;
        document.getElementById('chatSend').click();
      };
      wrap.appendChild(b);
    });
    body.appendChild(wrap);
  },
  showTyping() {
    const body = document.getElementById('chatBody');
    const t = document.createElement('div');
    t.className = 'chat-msg bot typing';
    t.id = 'typingDots';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
  },
  removeTyping() {
    const t = document.getElementById('typingDots');
    if (t) t.remove();
  }
};

document.addEventListener('DOMContentLoaded', () => ChatBot.init());
