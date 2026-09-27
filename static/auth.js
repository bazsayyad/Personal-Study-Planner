const auth$ = (selector) => document.querySelector(selector);
const authForm = auth$('#auth-form');
const nameField = auth$('#name-field');
const confirmField = auth$('#confirm-field');
const authError = auth$('#auth-error');
let authMode = 'login';

let authAudio;
function authClickSound() {
  try {
    authAudio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (authAudio.state === 'suspended') authAudio.resume();
    const now = authAudio.currentTime;
    const oscillator = authAudio.createOscillator();
    const envelope = authAudio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.exponentialRampToValueAtTime(330, now + .07);
    envelope.gain.setValueAtTime(.001, now);
    envelope.gain.linearRampToValueAtTime(.42, now + .008);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + .105);
    oscillator.connect(envelope).connect(authAudio.destination);
    oscillator.start(now);
    oscillator.stop(now + .11);
  } catch { /* Sign-in works even when browser audio is unavailable. */ }
}

document.addEventListener('click', (event) => {
  if (event.target.closest('button')) authClickSound();
});

function setMode(mode) {
  authMode = mode;
  const registering = mode === 'register';
  nameField.hidden = !registering;
  confirmField.hidden = !registering;
  auth$('#auth-name').required = registering;
  auth$('#auth-confirm').required = registering;
  auth$('#auth-password').autocomplete = registering ? 'new-password' : 'current-password';
  auth$('#password-hint').textContent = registering ? 'AT LEAST 8 CHARACTERS' : 'YOUR ACCOUNT STAYS ON THIS DEVICE';
  auth$('#auth-title').innerHTML = registering ? 'A space of <em>your own.</em>' : 'Welcome <em>back.</em>';
  auth$('#auth-subtitle').textContent = registering
    ? 'Create an account and make your study space yours.'
    : 'Sign in to return to your study space.';
  auth$('#submit-label').textContent = registering ? 'Create my account' : 'Enter your space';
  document.title = `${registering ? 'Create account' : 'Sign in'} · UniNest`;
  document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    const selected = button.dataset.authMode === mode;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  authError.textContent = '';
}

document.querySelectorAll('[data-auth-mode]').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.authMode));
});

authForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  authError.textContent = '';
  const data = {
    name: auth$('#auth-name').value.trim(),
    email: auth$('#auth-email').value.trim(),
    password: auth$('#auth-password').value,
  };
  if (authMode === 'register' && data.password !== auth$('#auth-confirm').value) {
    authError.textContent = 'Those passwords don’t match yet.';
    auth$('#auth-confirm').focus();
    return;
  }
  const button = auth$('#auth-submit');
  button.disabled = true;
  auth$('#submit-label').textContent = authMode === 'register' ? 'Creating your space…' : 'Opening your space…';
  try {
    const response = await fetch(`/api/auth/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'We couldn’t complete that request.');
    window.location.replace('/');
  } catch (error) {
    authError.textContent = error.message || 'Could not connect to UniNest. Is the local server still running?';
  } finally {
    button.disabled = false;
    auth$('#submit-label').textContent = authMode === 'register' ? 'Create my account' : 'Enter your space';
  }
});

const demoButton = auth$('#demo-entry');
if (demoButton) {
  demoButton.addEventListener('click', async () => {
    demoButton.disabled = true;
    try {
      const response = await fetch('/api/auth/demo-login', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Could not open the demo space.');
      window.location.replace('/');
    } catch (error) {
      authError.textContent = error.message;
      demoButton.disabled = false;
    }
  });
}

const themeToggle = auth$('#auth-theme-toggle');
function setAuthTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.querySelector('span').textContent = theme === 'dark' ? '☼' : '☾';
  themeToggle.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  auth$('#auth-theme-toggle').setAttribute('aria-label', themeToggle.title);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#151311' : '#f2eee7';
  localStorage.setItem('uninest-theme', theme);
}

setAuthTheme(localStorage.getItem('uninest-theme') || 'dark');
themeToggle.addEventListener('click', () => setAuthTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
