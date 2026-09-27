const icons = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  check: '<path d="m5 12.5 4.3 4.2L19 7"/>',
  note: '<path d="M7 3.8h7l4 4v12.4H7a2 2 0 0 1-2-2V5.8a2 2 0 0 1 2-2Z"/><path d="M14 4v4h4M9 13h6M9 16.5h6"/>',
  link: '<path d="M10 13.8a4.7 4.7 0 0 0 6.8 0l2-2a4.8 4.8 0 0 0-6.8-6.8l-1.2 1.2"/><path d="M14 10.2a4.7 4.7 0 0 0-6.8 0l-2 2A4.8 4.8 0 0 0 12 19l1.2-1.2"/>',
  timer: '<circle cx="12" cy="13" r="8.5"/><path d="M12 8v5l3.2 2M9 2.8h6M12 2.8v1.7"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  sun: '<circle cx="12" cy="12" r="3.8"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.6 8.6 0 1 0 20.5 14Z"/>',
  download: '<path d="M12 3.5v11m-4-4 4 4 4-4M4.5 17v3h15v-3"/>',
  upload: '<path d="M12 16V4m-4.5 4.5L12 4l4.5 4.5M4.5 15.5v4h15v-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5"/>',
  chart: '<path d="M4 19.5h16M6.5 16V9.5M12 16V5.5M17.5 16v-4"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  pause: '<path d="M8 5v14m8-14v14"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
  trash: '<path d="M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  external: '<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};

document.querySelectorAll('[data-icon]').forEach((node) => {
  const key = node.dataset.icon;
  if (icons[key]) node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
});

const state = { tasks: [], notes: [], resources: [], user: null, theme: 'dark', filter: 'all', query: '' };
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const body = await response.json();
      message = typeof body.detail === 'string' ? body.detail : message;
    } catch { /* Use the friendly default when a response isn't JSON. */ }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

let toastTimer;
function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove('visible'), 2700);
}

function emptyState(message, icon = 'spark') {
  return `<div class="empty-state"><span class="empty-state-mark"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg></span><p>${esc(message)}</p></div>`;
}

function formatDate(value) {
  if (!value) return 'JUST NOW';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return esc(value);
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date).toUpperCase();
}

function render() {
  renderSummary();
  renderDashboardTasks();
  renderTasks();
  renderNotes();
  renderResources();
}

function renderSummary() {
  const total = state.tasks.length;
  const done = state.tasks.filter((task) => task.done).length;
  const pending = total - done;
  const percent = total ? Math.round((done / total) * 100) : 0;
  $('#stat-completed').textContent = done;
  $('#stat-total').textContent = `/ ${total} task${total === 1 ? '' : 's'}`;
  $('#stat-pending').textContent = pending;
  $('#stat-notes').textContent = state.notes.length;
  $('#stat-resources').textContent = state.resources.length;
  $('#progress-fill').style.width = `${percent}%`;
  $('#progress-percent').textContent = `${percent}%`;
  $('#progress-copy').textContent = total ? `${done} of ${total} tasks completed` : 'Your progress starts here';
  $('#task-nav-count').textContent = pending;
  $('#task-list-count').textContent = total;
  $('#note-count').textContent = `${state.notes.length} NOTE${state.notes.length === 1 ? '' : 'S'}`;
  $('#note-board-count').textContent = String(state.notes.length).padStart(2, '0');
  $('#resource-count').textContent = `${state.resources.length} SAVED`;
  $('#resource-board-count').textContent = String(state.resources.length).padStart(2, '0');
}

const priorityOrder = { High: 0, Normal: 1, Low: 2 };
function orderedTasks() {
  return [...state.tasks].sort((a, b) => Number(a.done) - Number(b.done) || (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1) || b.id - a.id);
}

function taskRow(task, dashboard = false) {
  const checked = Boolean(task.done);
  const priority = String(task.priority || 'Normal').toLowerCase();
  return `<div class="${dashboard ? 'dashboard-task-row' : 'task-row'}" style="animation-delay:${Math.min((task.id % 8) * 25, 175)}ms">
    <button class="task-check ${checked ? 'checked' : ''}" data-toggle-task="${task.id}" aria-label="Mark ${esc(task.title)} ${checked ? 'incomplete' : 'complete'}" aria-pressed="${checked}">${checked ? `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.check}</svg>` : ''}</button>
    <span class="${dashboard ? 'dashboard-task-title' : 'task-row-title'} ${checked ? 'is-done' : ''}">${esc(task.title)}</span>
    ${dashboard ? `<span class="priority-pill ${priority}">${esc(task.priority)}</span>` : `<span class="priority-pill ${priority}">${esc(task.priority)}</span><button class="delete-button" data-delete-task="${task.id}" aria-label="Delete task: ${esc(task.title)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.trash}</svg></button>`}
  </div>`;
}

function renderDashboardTasks() {
  const pending = orderedTasks().filter((task) => !task.done).slice(0, 5);
  $('#dashboard-tasks').innerHTML = pending.length
    ? pending.map((task) => taskRow(task, true)).join('')
    : emptyState(state.tasks.length ? 'You cleared your list. Enjoy the breathing room.' : 'Add a task whenever you’re ready.', 'check');
}

function renderTasks() {
  const query = state.query.trim().toLowerCase();
  const filtered = orderedTasks().filter((task) => {
    const matchesFilter = state.filter === 'all' || (state.filter === 'done' ? Boolean(task.done) : !task.done);
    return matchesFilter && task.title.toLowerCase().includes(query);
  });
  $('#task-list').innerHTML = filtered.length
    ? filtered.map((task) => taskRow(task)).join('')
    : `<div class="task-empty">${emptyState(query ? 'No tasks match that search.' : state.filter === 'done' ? 'Completed tasks will show up here.' : 'Nothing on your list yet. Add one small next step.', 'check')}</div>`;
}

function renderNotes() {
  $('#notes-list').innerHTML = state.notes.length ? state.notes.map((note, index) => `
    <article class="note-card" style="animation-delay:${Math.min(index * 45, 260)}ms">
      <div class="note-card-top"><span class="note-card-date">${formatDate(note.created)}</span><button class="delete-button" data-delete-note="${note.id}" aria-label="Delete note: ${esc(note.title)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.trash}</svg></button></div>
      <h4>${esc(note.title)}</h4><p>${esc(note.body)}</p>
    </article>`).join('') : emptyState('Nothing pinned here yet. Capture a thought before it drifts away.', 'note');
}

function renderResources() {
  $('#resources-list').innerHTML = state.resources.length ? state.resources.map((item, index) => {
    let host = item.url;
    try { host = new URL(item.url).hostname.replace(/^www\./, ''); } catch { /* The backend validates new links. */ }
    return `<article class="resource-card" style="animation-delay:${Math.min(index * 45, 260)}ms">
      <div class="resource-card-top"><span class="resource-type">${esc(item.kind)}</span><button class="delete-button" data-delete-resource="${item.id}" aria-label="Delete resource: ${esc(item.title)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.trash}</svg></button></div>
      <h4>${esc(item.title)}</h4><span class="resource-host">${esc(host)}</span>
      <div class="resource-card-actions"><a class="resource-open" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open resource <svg viewBox="0 0 24 24" aria-hidden="true">${icons.external}</svg></a><span class="note-card-date">${formatDate(item.created)}</span></div>
    </article>`;
  }).join('') : emptyState('Your reference shelf is ready. Save a useful link to get started.', 'link');
}

const pageNames = { dashboard: 'Overview', tasks: 'Tasks', notes: 'Notes', resources: 'Resources', focus: 'Focus room', account: 'My account' };
let navigationTimer = null;
let navigationToken = 0;
function navigate(view) {
  if (!pageNames[view]) return;
  const current = $('.view.active-view');
  const target = $(`[data-view-panel="${view}"]`);
  let canceledTransition = false;
  if (navigationTimer) {
    clearTimeout(navigationTimer);
    navigationTimer = null;
    navigationToken += 1;
    canceledTransition = true;
    $$('.view').forEach((panel) => panel.classList.remove('is-leaving'));
  }
  if (current === target) {
    if (canceledTransition) {
      $$('.nav-item').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
      $('#breadcrumb-current').textContent = pageNames[view];
      history.replaceState(null, '', `#${view}`);
    }
    return;
  }
  if (current) pageTransitionSound();
  const viewOrder = Object.keys(pageNames);
  const direction = viewOrder.indexOf(view) > viewOrder.indexOf(current?.dataset.viewPanel) ? 1 : -1;
  if (current) {
    current.style.setProperty('--exit-x', `${direction * -8}px`);
    current.classList.add('is-leaving');
  }
  target.style.setProperty('--page-offset', `${direction * 15}px`);
  $$('.nav-item').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
  $('#breadcrumb-current').textContent = pageNames[view];
  $('#sidebar').classList.remove('mobile-open');
  history.replaceState(null, '', `#${view}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const token = ++navigationToken;
  navigationTimer = window.setTimeout(() => {
    if (token !== navigationToken) return;
    if (current) {
      current.classList.remove('active-view', 'is-leaving');
      current.style.removeProperty('--exit-x');
    }
    target.classList.add('active-view');
    navigationTimer = null;
    window.setTimeout(() => target.style.removeProperty('--page-offset'), 470);
  }, current ? 190 : 0);
}

let audioContext;
function soundContext() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function buttonSound() {
  try {
    const context = soundContext();
    const oscillator = audioContext.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.exponentialRampToValueAtTime(330, now + .07);
    envelope.gain.setValueAtTime(.001, now);
    envelope.gain.linearRampToValueAtTime(.42, now + .008);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + .105);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + .11);
  } catch { /* The interface remains usable if audio is unavailable. */ }
}

function pageTransitionSound() {
  try {
    const context = soundContext();
    const duration = .19;
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    const now = context.currentTime;
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(720, now);
    filter.frequency.exponentialRampToValueAtTime(360, now + duration);
    envelope.gain.setValueAtTime(.0001, now);
    envelope.gain.linearRampToValueAtTime(.13, now + .035);
    envelope.gain.exponentialRampToValueAtTime(.0001, now + duration);
    source.connect(filter).connect(envelope).connect(context.destination);
    source.start(now);
    source.stop(now + duration);
  } catch { /* Some browsers disable Web Audio; navigation still works. */ }
}

function completionSound() {
  try {
    const context = soundContext();
    const now = context.currentTime;
    [440, 554.37].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      const start = now + index * .07;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(.0001, start);
      envelope.gain.linearRampToValueAtTime(.18, start + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, start + .2);
      oscillator.connect(envelope).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + .21);
    });
  } catch { /* Completion feedback is optional; the task state is saved regardless. */ }
}

document.addEventListener('click', (event) => {
  if (event.target.closest('button')) buttonSound();
  const nav = event.target.closest('[data-view]');
  if (nav) navigate(nav.dataset.view);
  const routeButton = event.target.closest('[data-go]');
  if (routeButton) navigate(routeButton.dataset.go);
  const toggle = event.target.closest('[data-toggle-task]');
  if (toggle) toggleTask(Number(toggle.dataset.toggleTask));
  const removeTask = event.target.closest('[data-delete-task]');
  if (removeTask) removeRecord('tasks', Number(removeTask.dataset.deleteTask));
  const removeNote = event.target.closest('[data-delete-note]');
  if (removeNote) removeRecord('notes', Number(removeNote.dataset.deleteNote));
  const removeResource = event.target.closest('[data-delete-resource]');
  if (removeResource) removeRecord('resources', Number(removeResource.dataset.deleteResource));
  const filter = event.target.closest('[data-task-filter]');
  if (filter) {
    state.filter = filter.dataset.taskFilter;
    $$('.filter-button').forEach((button) => button.classList.toggle('active-filter', button === filter));
    renderTasks();
  }
  const preset = event.target.closest('[data-minutes]');
  if (preset) choosePreset(Number(preset.dataset.minutes), preset);
});

async function submitTask(title, priority = 'Normal') {
  const task = await api('/api/tasks', { method: 'POST', body: JSON.stringify({ title, priority }) });
  state.tasks.unshift(task);
  renderSummary();
  renderDashboardTasks();
  renderTasks();
  toast('Task added to your plan.');
}

$('#task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = $('#task-title').value.trim();
  if (!title) return;
  try {
    await submitTask(title, $('#task-priority').value);
    event.currentTarget.reset();
    $('#task-title').focus();
  } catch (error) { toast(error.message); }
});

$('#quick-task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = $('#quick-task-title');
  const title = input.value.trim();
  if (!title) { navigate('tasks'); $('#task-title').focus(); return; }
  try { await submitTask(title); input.value = ''; }
  catch (error) { toast(error.message); }
});

$('#note-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = $('#note-title').value.trim();
  const body = $('#note-body').value.trim();
  if (!title || !body) return;
  try {
    const note = await api('/api/notes', { method: 'POST', body: JSON.stringify({ title, body }) });
    state.notes.unshift(note);
    event.currentTarget.reset();
    renderSummary();
    renderNotes();
    toast('Note saved to your study space.');
  } catch (error) { toast(error.message); }
});

$('#resource-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = { title: $('#resource-title').value.trim(), url: $('#resource-url').value.trim(), kind: $('#resource-kind').value };
  try {
    const item = await api('/api/resources', { method: 'POST', body: JSON.stringify(payload) });
    state.resources.unshift(item);
    event.currentTarget.reset();
    renderSummary();
    renderResources();
    toast('Resource added to your shelf.');
  } catch (error) { toast(error.message); }
});

function showAccount(user) {
  state.user = user;
  const name = user?.name || 'My study space';
  const email = user?.email || '';
  const initial = (name.trim()[0] || email[0] || 'U').toUpperCase();
  $('#account-name').textContent = name;
  $('#account-email').textContent = email;
  $('#profile-initial').textContent = initial;
  $('#top-avatar').textContent = initial;
  $('#account-page-initial').textContent = initial;
  $('#account-card-name').textContent = name;
  $('#account-card-email').textContent = email;
  $('#account-name-input').value = name;
  $('#account-email-input').value = email;
}

$('#account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const result = await api('/api/account', {
      method: 'PUT',
      body: JSON.stringify({ name: $('#account-name-input').value.trim(), email: $('#account-email-input').value.trim() }),
    });
    showAccount(result.user);
    toast('Your profile has been updated.');
  } catch (error) { toast(error.message); }
  finally { submit.disabled = false; }
});

$('#password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const currentPassword = $('#current-password').value;
  const newPassword = $('#new-password').value;
  if (newPassword !== $('#confirm-new-password').value) {
    toast('Your new passwords do not match.');
    return;
  }
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    await api('/api/account/password', { method: 'POST', body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) });
    event.currentTarget.reset();
    toast('Your password has been updated.');
  } catch (error) { toast(error.message); }
  finally { submit.disabled = false; }
});

$('#task-search').addEventListener('input', (event) => { state.query = event.target.value; renderTasks(); });

async function toggleTask(id) {
  try {
    const updated = await api(`/api/tasks/${id}`, { method: 'PATCH' });
    state.tasks = state.tasks.map((task) => task.id === id ? updated : task);
    if (updated.done) completionSound();
    renderSummary();
    renderDashboardTasks();
    renderTasks();
  } catch (error) { toast(error.message); }
}

async function removeRecord(group, id) {
  const route = group === 'tasks' ? 'tasks' : group;
  try {
    await api(`/api/${route}/${id}`, { method: 'DELETE' });
    state[group] = state[group].filter((item) => item.id !== id);
    renderSummary();
    if (group === 'tasks') {
      renderDashboardTasks();
      renderTasks();
    } else if (group === 'notes') renderNotes();
    else renderResources();
    toast(`${group === 'tasks' ? 'Task' : group === 'notes' ? 'Note' : 'Resource'} removed.`);
  } catch (error) { toast(error.message); }
}

$('#theme-toggle').addEventListener('click', async () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.theme);
  try { await api('/api/settings/theme', { method: 'PUT', body: JSON.stringify({ theme: state.theme }) }); }
  catch (error) { toast(error.message); }
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('#theme-toggle').innerHTML = `<span data-icon="${theme === 'dark' ? 'sun' : 'moon'}"></span>`;
  $('#theme-toggle span').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[theme === 'dark' ? 'sun' : 'moon']}</svg>`;
  $('#theme-toggle').title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#151311' : '#f2eee7';
  localStorage.setItem('uninest-theme', theme);
}

$('#export-button').addEventListener('click', async () => {
  try {
    const response = await fetch('/api/export');
    if (!response.ok) throw new Error('Could not prepare your export.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `uninest_study_planner_${new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '')}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Your planner data has been exported.');
  } catch (error) { toast(error.message); }
});

$('#import-button').addEventListener('click', () => $('#import-file').click());
$('#import-file').addEventListener('change', async (event) => {
  const file = event.currentTarget.files?.[0];
  event.currentTarget.value = '';
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    toast('That file is too large. Choose a JSON backup under 8 MB.');
    return;
  }
  if (!window.confirm('Import and add the records in this backup? Your current planner data will be kept.')) return;
  try {
    let backup;
    try { backup = JSON.parse(await file.text()); }
    catch { throw new Error('This file is not valid JSON.'); }
    const result = await api('/api/import', { method: 'POST', body: JSON.stringify(backup) });
    const updated = await api('/api/bootstrap');
    state.tasks = updated.tasks;
    state.notes = updated.notes;
    state.resources = updated.resources;
    state.theme = updated.theme || state.theme;
    applyTheme(state.theme);
    render();
    const { tasks, notes, resources } = result.added;
    toast(`Imported ${tasks} tasks, ${notes} notes, and ${resources} resources.`);
  } catch (error) { toast(error.message); }
});

$('#mobile-menu').addEventListener('click', () => $('#sidebar').classList.toggle('mobile-open'));
$('#task-focus-button').addEventListener('click', () => navigate('focus'));

const ring = $('#timer-ring');
const circumference = 2 * Math.PI * 126;
ring.style.strokeDasharray = circumference;
let timer = { duration: 25 * 60, remaining: 25 * 60, running: false, endAt: 0, interval: null };

function paintTimer() {
  const seconds = Math.max(0, Math.ceil(timer.remaining));
  $('#timer-display').innerHTML = `${String(Math.floor(seconds / 60)).padStart(2, '0')}<span>:</span>${String(seconds % 60).padStart(2, '0')}`;
  ring.style.strokeDashoffset = circumference * (1 - (1 - timer.remaining / timer.duration));
  if (!timer.running && timer.remaining === timer.duration) $('#timer-status').textContent = 'Settle in. You’re right where you need to be.';
}

function choosePreset(minutes, button) {
  if (timer.running) stopTimer();
  timer.duration = minutes * 60;
  timer.remaining = timer.duration;
  $$('.preset-button').forEach((node) => node.classList.toggle('is-selected', node === button));
  paintTimer();
  $('#timer-status').textContent = `${minutes} minutes, just for you.`;
}

function tickTimer() {
  timer.remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
  paintTimer();
  if (timer.remaining <= 0) {
    stopTimer();
    $('#timer-status').textContent = 'Session complete. Take a breath; you earned it.';
    toast('Focus session complete. Take a short break.');
  }
}

function startTimer() {
  if (timer.running) {
    timer.remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
    stopTimer();
    $('#timer-status').textContent = 'Paused. Pick up whenever you’re ready.';
    return;
  }
  if (timer.remaining <= 0) timer.remaining = timer.duration;
  timer.running = true;
  timer.endAt = Date.now() + timer.remaining * 1000;
  $('#timer-start').innerHTML = `<span data-icon="pause"></span><span>Pause session</span>`;
  $('#timer-start span').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.pause}</svg>`;
  $('#timer-status').textContent = 'You’re in your focus session. Stay with it.';
  timer.interval = window.setInterval(tickTimer, 250);
}

function stopTimer() {
  timer.running = false;
  clearInterval(timer.interval);
  timer.interval = null;
  $('#timer-start').innerHTML = `<span data-icon="play"></span><span>Begin focus</span>`;
  $('#timer-start span').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.play}</svg>`;
  paintTimer();
}

$('#timer-start').addEventListener('click', startTimer);
$('#timer-reset').addEventListener('click', () => {
  stopTimer();
  timer.remaining = timer.duration;
  paintTimer();
  $('#timer-status').textContent = 'Reset. Start again whenever you’re ready.';
});

const cursor = $('#custom-cursor');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (finePointer.matches) {
  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    document.body.classList.add('has-custom-cursor');
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;
    cursor.style.opacity = '1';
    cursor.classList.toggle('cursor-hover', Boolean(event.target.closest('button,a,input,textarea,select,[role="button"]')));
  }, { passive: true });
  window.addEventListener('pointerdown', () => cursor.classList.add('cursor-press'), { passive: true });
  window.addEventListener('pointerup', () => cursor.classList.remove('cursor-press'), { passive: true });
  window.addEventListener('pointercancel', () => cursor.classList.remove('cursor-press'), { passive: true });
  window.addEventListener('pointerleave', () => {
    cursor.style.opacity = '0';
    document.body.classList.remove('has-custom-cursor');
  });
}

function updateDate() {
  const now = new Date();
  $('#top-date').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now).toUpperCase();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.';
  $('#welcome-title').innerHTML = `${greeting.replace(/\.$/, '')} <em>Make it count.</em>`;
}

async function init() {
  updateDate();
  const view = location.hash.slice(1);
  if (pageNames[view] && view !== 'dashboard') navigate(view);
  try {
    const data = await api('/api/bootstrap');
    state.tasks = data.tasks;
    state.notes = data.notes;
    state.resources = data.resources;
    state.theme = data.theme || localStorage.getItem('uninest-theme') || 'dark';
    showAccount(data.user);
    applyTheme(state.theme);
    render();
  } catch (error) {
    if (error.status === 401) {
      window.location.replace('/');
      return;
    }
    toast(`Could not connect to your local planner: ${error.message}`);
  }
}

$('#logout-button').addEventListener('click', async () => {
  try { await api('/api/auth/logout', { method: 'POST' }); }
  finally { window.location.replace('/'); }
});

paintTimer();
init();
