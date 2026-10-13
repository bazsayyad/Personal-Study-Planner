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
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4.5 4.5"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  pause: '<path d="M8 5v14m8-14v14"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3"/>',
  trash: '<path d="M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  external: '<path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  expand: '<path d="M8 4H4v4m0-4 6 6m6-6h4v4m0-4-6 6M4 16v4h4m-4 0 6-6m10 2v4h-4m4 0-6-6"/>',
  compress: '<path d="M9 4v5H4m0 0 6-6m5 0 5 6m0 0h-5m5 10v-5m0 0h-5m5 0-6 6m-4-6-6 5m0 0v-5m0 5h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-1.3-3h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3l-.1-.1a1.8 1.8 0 0 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-1.3v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
};

document.querySelectorAll('[data-icon]').forEach((node) => {
  const key = node.dataset.icon;
  if (icons[key]) node.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`;
});

const DEFAULT_PREFERENCES = { sound_enabled: true, animations_enabled: true, motion_blur_enabled: true, motion_blur_strength: 3 };
const state = { tasks: [], notes: [], resources: [], subjects: [], focusSessions: [], user: null, theme: 'dark', preferences: { ...DEFAULT_PREFERENCES }, focusTaskId: null, selectedSubjectId: null, filter: 'all', subjectFilter: 'all', query: '' };
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
let latestCoachPlan = null;
const coachConversation = [];
const coachLinkedTaskIds = new Set();
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

function formatDueDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(year, month - 1, day));
}

function render() {
  renderSummary();
  renderDashboardTasks();
  renderTasks();
  renderNotes();
  renderResources();
  renderWeekPlanner();
  renderFocusHistory();
  renderSubjectsPage();
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
  const taskTitle = `<span class="${dashboard ? 'dashboard-task-title' : 'task-row-title'} ${checked ? 'is-done' : ''}">${esc(task.title)}</span>`;
  const taskMeta = [task.subject || 'General', task.due_date ? `Due ${formatDueDate(task.due_date)}` : '', task.estimate_minutes ? `${task.estimate_minutes} min` : ''].filter(Boolean).join(' · ');
  return `<div class="${dashboard ? 'dashboard-task-row' : 'task-row'}" style="animation-delay:${Math.min((task.id % 8) * 25, 175)}ms">
    <button class="task-check ${checked ? 'checked' : ''}" data-toggle-task="${task.id}" aria-label="Mark ${esc(task.title)} ${checked ? 'incomplete' : 'complete'}" aria-pressed="${checked}">${checked ? `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.check}</svg>` : ''}</button>
    ${dashboard ? `<span class="task-row-copy">${taskTitle}<small>${esc(taskMeta)}</small></span>` : `<span class="task-row-copy">${taskTitle}<small>${esc(taskMeta)}</small></span>`}
    ${dashboard ? `<span class="priority-pill ${priority}">${esc(task.priority)}</span>` : `<span class="priority-pill ${priority}">${esc(task.priority)}</span><button class="delete-button" data-delete-task="${task.id}" aria-label="Delete task: ${esc(task.title)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.trash}</svg></button>`}
  </div>`;
}

function renderDashboardTasks() {
  const pending = orderedTasks().filter((task) => !task.done).slice(0, 5);
  $('#dashboard-tasks').innerHTML = pending.length
    ? pending.map((task) => taskRow(task, true)).join('')
    : emptyState(state.tasks.length ? 'You cleared your list. Enjoy the breathing room.' : 'Add a task whenever you’re ready.', 'check');
  if (!$('#coach-sidecar').hidden && !$('#coach-task-picker').hidden) renderCoachTaskPicker();
}

function localIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderWeekPlanner() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = localIsoDate(today);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const endKey = localIsoDate(weekEnd);
  const pending = state.tasks.filter((task) => !task.done);
  const groups = [
    { label: 'TODAY & OVERDUE', tasks: pending.filter((task) => task.due_date && task.due_date <= todayKey) },
    { label: 'NEXT 7 DAYS', tasks: pending.filter((task) => task.due_date > todayKey && task.due_date <= endKey) },
    { label: 'LATER / NO DATE', tasks: pending.filter((task) => !task.due_date || task.due_date > endKey) },
  ];
  const columns = groups.map((group) => `<section class="weekly-column"><span class="weekly-column-label">${group.label}</span>${group.tasks.length
    ? group.tasks.slice(0, 5).map((task) => `<button class="weekly-task" type="button" data-go="tasks"><strong>${esc(task.title)}</strong><small>${esc(task.subject || 'General')}${task.due_date ? ` · ${formatDueDate(task.due_date)}` : ''}</small></button>`).join('')
    : '<p class="weekly-empty">Clear for now.</p>'}</section>`).join('');
  $('#weekly-columns').innerHTML = columns;
  $('#weekly-columns-page').innerHTML = columns;
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const startKey = localIsoDate(weekStart);
  const weekSessions = state.focusSessions.filter((item) => item.completed_at?.slice(0, 10) >= startKey && item.completed_at?.slice(0, 10) <= todayKey);
  const minutes = weekSessions.reduce((total, item) => total + Number(item.minutes || 0), 0);
  $('#weekly-focus-total').textContent = `${minutes} min focused in the last 7 days · ${weekSessions.length} session${weekSessions.length === 1 ? '' : 's'}`;
  $('#weekly-focus-total-page').textContent = `${minutes} min focused in the last 7 days · ${weekSessions.length} session${weekSessions.length === 1 ? '' : 's'}`;
}

function renderFocusHistory() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = localIsoDate(today);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const startKey = localIsoDate(weekStart);
  const recent = state.focusSessions.filter((item) => item.completed_at?.slice(0, 10) >= startKey && item.completed_at?.slice(0, 10) <= todayKey);
  const minutes = recent.reduce((total, item) => total + Number(item.minutes || 0), 0);
  $('#focus-week-count').textContent = `${recent.length} LAST 7 DAYS`;
  $('#focus-history-summary').textContent = recent.length
    ? `${minutes} focused minutes across ${recent.length} completed session${recent.length === 1 ? '' : 's'} this week.`
    : 'Finish a focus session to start your study record.';
  const row = (item) => `<div class="focus-history-item"><span class="status-dot"></span><strong>${esc(item.task_title || 'Independent study')}</strong><span>${item.minutes} min</span><small>${formatDate(item.completed_at)}</small></div>`;
  $('#focus-history-list').innerHTML = recent.slice(0, 6).map(row).join('');
  const allMinutes = state.focusSessions.reduce((total, item) => total + Number(item.minutes || 0), 0);
  $('#history-page-count').textContent = `${state.focusSessions.length} SESSION${state.focusSessions.length === 1 ? '' : 'S'}`;
  $('#history-total-minutes').textContent = `${allMinutes} min`;
  $('#history-week-summary').textContent = `${minutes} minutes across ${recent.length} completed session${recent.length === 1 ? '' : 's'} in the last 7 days.`;
  $('#study-history-list').innerHTML = state.focusSessions.length ? state.focusSessions.map(row).join('') : emptyState('Your completed focus sessions will be collected here.', 'timer');
}

function renderSubjectsPage() {
  const taskGroups = new Map();
  state.tasks.forEach((task) => {
    const name = task.subject || 'General';
    const key = name.toLocaleLowerCase();
    if (!taskGroups.has(key)) taskGroups.set(key, []);
    taskGroups.get(key).push(task);
  });
  const subjects = [...state.subjects];
  taskGroups.forEach((tasks, key) => {
    if (!subjects.some((subject) => subject.name.toLocaleLowerCase() === key)) subjects.push({ id: `task-${key}`, name: tasks[0].subject || 'General' });
  });
  subjects.sort((a, b) => a.name.localeCompare(b.name));
  if (!subjects.some((subject) => String(subject.id) === String(state.selectedSubjectId))) state.selectedSubjectId = subjects[0]?.id ?? null;
  $('#task-subject').innerHTML = subjects.map((subject) => `<option value="${esc(subject.name)}">${esc(subject.name)}</option>`).join('') || '<option value="General">General</option>';
  $('#subject-overview-grid').innerHTML = subjects.length ? subjects.map((subject) => {
    const name = subject.name;
    const tasks = taskGroups.get(name.toLocaleLowerCase()) || [];
    const pending = tasks.filter((task) => !task.done).length;
    const completed = tasks.length - pending;
    const nextDue = tasks.filter((task) => !task.done && task.due_date).map((task) => task.due_date).sort()[0];
    return `<article class="surface subject-overview-card ${String(subject.id) === String(state.selectedSubjectId) ? 'is-selected' : ''}"><span class="surface-kicker">COURSE / SUBJECT</span><h2>${esc(name)}</h2><div class="subject-card-stats"><span><strong>${pending}</strong><small>TO DO</small></span><span><strong>${completed}</strong><small>DONE</small></span><span><strong>${tasks.length}</strong><small>TOTAL</small></span></div><p>${nextDue ? `Next due · ${formatDueDate(nextDue)}` : 'No upcoming due dates'}</p><button type="button" class="soft-button" data-select-subject="${esc(subject.id)}">${String(subject.id) === String(state.selectedSubjectId) ? 'Selected course' : 'Open course'} <span data-icon="arrow"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.arrow}</svg></span></button></article>`;
  }).join('') : emptyState('Add your first course above. You can create tasks for it right here.', 'note');
  const selected = subjects.find((subject) => String(subject.id) === String(state.selectedSubjectId));
  const detailForm = $('#subject-task-form');
  const deleteButton = $('#delete-subject-button');
  if (!selected) {
    $('#subject-detail-title').textContent = 'Choose a subject';
    $('#subject-detail-copy').textContent = 'Add a course above, then create and manage its study tasks here.';
    $('#subject-detail-tasks').innerHTML = emptyState('Your course tasks will appear in this space.', 'check');
    detailForm.hidden = true;
    deleteButton.hidden = true;
    deleteButton.dataset.deleteSubject = '';
    return;
  }
  const selectedTasks = taskGroups.get(selected.name.toLocaleLowerCase()) || [];
  $('#subject-detail-title').textContent = selected.name;
  $('#subject-detail-copy').textContent = `${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'} in this course`;
  detailForm.hidden = false;
  deleteButton.hidden = selected.name.toLocaleLowerCase() === 'general' || !Number.isInteger(Number(selected.id));
  deleteButton.dataset.deleteSubject = selected.id;
  $('#subject-detail-tasks').innerHTML = selectedTasks.length ? orderedTasks().filter((task) => (task.subject || 'General').toLocaleLowerCase() === selected.name.toLocaleLowerCase()).map((task) => taskRow(task)).join('') : emptyState('No work here yet. Add one small next step above.', 'check');
}

function renderTasks() {
  const query = state.query.trim().toLowerCase();
  const filtered = orderedTasks().filter((task) => {
    const matchesFilter = state.filter === 'all' || (state.filter === 'done' ? Boolean(task.done) : !task.done);
    const matchesSubject = state.subjectFilter === 'all' || (task.subject || 'General') === state.subjectFilter;
    return matchesFilter && matchesSubject && `${task.title} ${task.subject || 'General'}`.toLowerCase().includes(query);
  });
  const subjects = [...new Set([...state.subjects.map((subject) => subject.name), ...state.tasks.map((task) => task.subject || 'General')])].sort((a, b) => a.localeCompare(b));
  const subjectSelect = $('#subject-filter');
  if (subjectSelect) {
    if (state.subjectFilter !== 'all' && !subjects.includes(state.subjectFilter)) state.subjectFilter = 'all';
    subjectSelect.innerHTML = `<option value="all">All subjects</option>${subjects.map((subject) => `<option value="${esc(subject)}">${esc(subject)}</option>`).join('')}`;
    subjectSelect.value = state.subjectFilter;
  }
  $('#task-list').innerHTML = filtered.length
    ? filtered.map((task) => taskRow(task)).join('')
    : `<div class="task-empty">${emptyState(query ? 'No tasks match that search.' : state.filter === 'done' ? 'Completed tasks will show up here.' : 'Nothing on your list yet. Add one small next step.', 'check')}</div>`;
  renderFocusTaskOptions();
}

function renderFocusTaskOptions() {
  const select = $('#focus-task-select');
  const openTasks = state.tasks.filter((task) => !task.done);
  if (!openTasks.some((task) => String(task.id) === String(state.focusTaskId))) state.focusTaskId = null;
  select.innerHTML = `<option value="">No task selected</option>${openTasks.map((task) => `<option value="${task.id}">${esc(task.title)}</option>`).join('')}`;
  select.value = state.focusTaskId == null ? '' : String(state.focusTaskId);
  const selectedTask = openTasks.find((task) => String(task.id) === String(state.focusTaskId));
  $('#focus-task-current').hidden = !selectedTask;
  $('#focus-task-current-name').textContent = selectedTask?.title || '';
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

const pageNames = { dashboard: 'Overview', tasks: 'Tasks', notes: 'Notes', resources: 'Resources', focus: 'Focus room', coach: 'Study Coach', weekly: 'Weekly planner', subjects: 'Subjects', history: 'Study history', account: 'My account', settings: 'Settings and info' };
const sidebarBreakpoint = window.matchMedia('(max-width: 850px)');
function syncSidebarToggle() {
  const hidden = $('.app-shell').classList.contains('sidebar-hidden');
  const mobileOpen = $('#sidebar').classList.contains('mobile-open');
  const expanded = sidebarBreakpoint.matches ? mobileOpen : !hidden;
  const label = sidebarBreakpoint.matches
    ? (mobileOpen ? 'Close navigation' : 'Open navigation')
    : (hidden ? 'Show sidebar' : 'Hide sidebar');
  $('#mobile-menu').setAttribute('aria-expanded', String(expanded));
  $('#mobile-menu').setAttribute('aria-label', label);
  $('#mobile-menu').title = label;
}
let coachPanelTimer = null;
let coachPanelToken = 0;
function setCoachSidecarOpen(open) {
  const focusIsActive = $('.view.active-view')?.dataset.viewPanel === 'focus';
  const isOpen = Boolean(open && !focusIsActive);
  const sidecar = $('#coach-sidecar');
  const toggle = $('#coach-dock-toggle');
  const wasOpen = !sidecar.hidden;
  const compactWorkspace = window.matchMedia('(max-width: 1200px)').matches;
  if (coachPanelTimer) window.clearTimeout(coachPanelTimer);
  const token = ++coachPanelToken;
  if (isOpen && !wasOpen && compactWorkspace) coachReturnScrollY = window.scrollY;
  const workspace = $('#workspace-frame');
  if (isOpen) {
    workspace.classList.add('coach-open');
    sidecar.hidden = false;
    sidecar.classList.remove('is-closing');
    sidecar.classList.add('is-opening');
    coachPanelTimer = window.setTimeout(() => {
      if (token === coachPanelToken) sidecar.classList.remove('is-opening');
      coachPanelTimer = null;
    }, 400);
  } else if (wasOpen) {
    sidecar.classList.remove('is-opening');
    sidecar.classList.add('is-closing');
    coachPanelTimer = window.setTimeout(() => {
      if (token !== coachPanelToken) return;
      sidecar.hidden = true;
      sidecar.classList.remove('is-closing');
      workspace.classList.remove('coach-open');
      workspace.classList.add('coach-restoring');
      window.setTimeout(() => workspace.classList.remove('coach-restoring'), 340);
      if (compactWorkspace) window.scrollTo({ top: coachReturnScrollY, behavior: 'instant' });
      coachPanelTimer = null;
    }, 300);
  } else {
    sidecar.hidden = true;
    sidecar.classList.remove('is-opening', 'is-closing');
    workspace.classList.remove('coach-open');
  }
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close Study Coach' : 'Open Study Coach');
  toggle.title = isOpen ? 'Close Study Coach' : 'Open Study Coach';
  const icon = $('.coach-dock-toggle [data-icon]');
  icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[isOpen ? 'close' : 'spark']}</svg>`;
  $('.coach-dock-label').textContent = isOpen ? 'Close Coach' : 'Talk to Coach';
  if (isOpen) {
    renderCoachTaskPicker();
    requestAnimationFrame(() => {
      if (compactWorkspace) {
        const reduceMotion = !state.preferences.animations_enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        sidecar.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
      } else {
        $('#coach-chat-input').focus({ preventScroll: true });
      }
    });
  }
}
$('#coach-dock-toggle').addEventListener('click', () => setCoachSidecarOpen($('#coach-sidecar').hidden));
let coachReturnScrollY = 0;
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('#coach-sidecar').hidden) setCoachSidecarOpen(false);
});
function navigate(view) {
  if (!pageNames[view]) return;
  $('#coach-dock-toggle').hidden = view === 'focus';
  if (view === 'focus' || (window.matchMedia('(max-width: 1200px)').matches && !$('#coach-sidecar').hidden)) setCoachSidecarOpen(false);
  const current = $('.view.active-view');
  const target = $(`[data-view-panel="${view}"]`);
  if (current === target) return;
  if (current) pageTransitionSound();
  const viewOrder = Object.keys(pageNames);
  const direction = viewOrder.indexOf(view) > viewOrder.indexOf(current?.dataset.viewPanel) ? 1 : -1;
  if (current) current.classList.remove('active-view', 'is-leaving');
  target.classList.remove('is-leaving');
  target.style.setProperty('--page-offset', `${direction * 10}px`);
  target.classList.add('active-view');
  $$('.nav-item').forEach((button) => button.classList.toggle('is-active', button.dataset.view === view));
  $(`[data-view="${view}"]`)?.closest('.nav-group')?.setAttribute('open', '');
  $('#breadcrumb-current').textContent = pageNames[view];
  $('#task-quick-action').hidden = view !== 'tasks';
  $('#sidebar').classList.remove('mobile-open');
  syncSidebarToggle();
  history.replaceState(null, '', `#${view}`);
  // Swap pages immediately; the new page's sections animate into place.
  window.scrollTo({ top: 0, behavior: 'instant' });
}

$('#breadcrumb-home').addEventListener('click', () => navigate('dashboard'));
$('#task-quick-action').addEventListener('click', () => {
  const field = $('#task-title');
  field.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => field.focus({ preventScroll: true }), 280);
});

let audioContext;
function soundContext() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function buttonSound() {
  if (!state.preferences.sound_enabled) return;
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
  if (!state.preferences.sound_enabled) return;
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
  if (!state.preferences.sound_enabled) return;
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

function buzzerSound() {
  if (!state.preferences.sound_enabled) return;
  try {
    const context = soundContext();
    const now = context.currentTime;
    [587.33, 493.88, 392].forEach((frequency, index) => {
      const start = now + index * .19;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, start);
      envelope.gain.setValueAtTime(.0001, start);
      envelope.gain.linearRampToValueAtTime(.28, start + .025);
      envelope.gain.setValueAtTime(.28, start + .12);
      envelope.gain.exponentialRampToValueAtTime(.0001, start + .18);
      oscillator.connect(envelope).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + .19);
    });
  } catch { /* The focus and break timers still work if audio is unavailable. */ }
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
  const subjectCard = event.target.closest('[data-select-subject]');
  if (subjectCard) {
    state.selectedSubjectId = subjectCard.dataset.selectSubject;
    renderSubjectsPage();
  }
  const deleteSubject = event.target.closest('[data-delete-subject]');
  if (deleteSubject?.dataset.deleteSubject && window.confirm('Delete this subject? Its tasks will be moved to General.')) deleteSubjectRecord(Number(deleteSubject.dataset.deleteSubject));
  const preset = event.target.closest('[data-minutes]');
  if (preset) choosePreset(Number(preset.dataset.minutes), preset);
});

async function submitTask(title, priority = 'Normal', planning = {}) {
  const task = await api('/api/tasks', { method: 'POST', body: JSON.stringify({ title, priority, ...planning }) });
  state.tasks.unshift(task);
  renderSummary();
  renderDashboardTasks();
  renderTasks();
  renderWeekPlanner();
  renderSubjectsPage();
  toast('Task added to your plan.');
}

$('#task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = $('#task-title').value.trim();
  if (!title) return;
  try {
    const estimate = $('#task-estimate').value;
    await submitTask(title, $('#task-priority').value, {
      subject: $('#task-subject').value.trim() || 'General',
      due_date: $('#task-due-date').value || null,
      estimate_minutes: estimate ? Number(estimate) : null,
    });
    event.currentTarget.reset();
    $('#task-title').focus();
  } catch (error) { toast(error.message); }
});

$('#subject-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = $('#subject-name');
  const name = input.value.trim();
  if (!name) return;
  try {
    const subject = await api('/api/subjects', { method: 'POST', body: JSON.stringify({ name }) });
    state.subjects.push(subject);
    state.selectedSubjectId = subject.id;
    event.currentTarget.reset();
    renderSubjectsPage();
    renderTasks();
    toast(`${subject.name} added to your subjects.`);
  } catch (error) { toast(error.message); }
});

$('#subject-task-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const subject = state.subjects.find((item) => String(item.id) === String(state.selectedSubjectId))
    || (() => {
      const task = state.tasks.find((item) => `task-${(item.subject || 'General').toLocaleLowerCase()}` === String(state.selectedSubjectId));
      return task ? { name: task.subject || 'General' } : null;
    })();
  const task = $('#subject-task-title').value.trim();
  if (!subject || !task) return;
  try {
    await submitTask(task, 'Normal', { subject: subject.name });
    event.currentTarget.reset();
    $('#subject-task-title').focus();
  } catch (error) { toast(error.message); }
});

async function deleteSubjectRecord(id) {
  try {
    const deleted = state.subjects.find((subject) => Number(subject.id) === id);
    const removed = await api(`/api/subjects/${id}`, { method: 'DELETE' });
    state.subjects = state.subjects.filter((subject) => Number(subject.id) !== id);
    if (removed.general && !state.subjects.some((subject) => subject.name.toLocaleLowerCase() === 'general')) state.subjects.push(removed.general);
    state.tasks = state.tasks.map((task) => task.subject?.toLocaleLowerCase() === deleted?.name.toLocaleLowerCase() ? { ...task, subject: 'General' } : task);
    state.selectedSubjectId = state.subjects[0]?.id ?? null;
    render();
    toast('Subject removed. Its tasks are now under General.');
  } catch (error) { toast(error.message); }
}

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
  $('#profile-initial').textContent = initial;
  $('#top-avatar').textContent = initial;
  $('#account-page-initial').textContent = initial;
  $('#account-card-name').textContent = name;
  $('#account-card-email').textContent = email;
  $('#account-name-input').value = name;
  $('#account-email-input').value = email;
  updateWelcomeGreeting();
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

async function updateCoachStatus() {
  try {
    const status = await api('/api/coach/status');
    $('#coach-config-note').hidden = status.available;
    $('#coach-setup-message').textContent = status.setup_message;
    $('#coach-live-status').classList.toggle('coach-ready', status.available);
    $('#coach-live-status span:last-child').textContent = status.available ? 'OPENROUTER KEY SAVED · CHECK ON USE' : 'PRIVATE PLAN READY · AI (OPTIONAL)';
  } catch { /* Study Coach setup status must not interrupt the rest of the planner. */ }
}

function renderCoachTaskPicker() {
  const picker = $('#coach-task-picker');
  if (!picker) return;
  const tasks = state.tasks.filter((task) => !task.done);
  const availableIds = new Set(tasks.map((task) => Number(task.id)));
  coachLinkedTaskIds.forEach((id) => { if (!availableIds.has(id)) coachLinkedTaskIds.delete(id); });
  $('#coach-context-count').textContent = coachLinkedTaskIds.size ? `${coachLinkedTaskIds.size} linked` : '(Optional)';
  picker.innerHTML = tasks.length ? tasks.map((task) => `<label class="coach-task-choice"><input type="checkbox" value="${task.id}" ${coachLinkedTaskIds.has(Number(task.id)) ? 'checked' : ''}><span><strong>${esc(task.title)}</strong><small>${esc(task.subject || 'General')} · ${esc(task.priority || 'Normal')}${task.due_date ? ` · due ${esc(formatDueDate(task.due_date))}` : ''}</small></span></label>`).join('') : '<p class="coach-task-empty">No unfinished tasks yet. You can still chat without linking one.</p>';
}

function appendCoachChatMessage(role, content = '', thinking = false) {
  const log = $('#coach-chat-messages');
  const article = document.createElement('article');
  article.className = `coach-chat-message ${role === 'user' ? 'user-message' : 'assistant-message'}${thinking ? ' is-thinking' : ''}`;
  const label = document.createElement('span');
  label.className = 'chat-message-label';
  label.textContent = role === 'user' ? 'YOU' : 'UNINEST STUDY COACH';
  const paragraph = document.createElement('p');
  renderCoachMessage(paragraph, content);
  article.append(label, paragraph);
  log.append(article);
  log.scrollTop = log.scrollHeight;
  return { article, paragraph };
}

function renderCoachMessage(paragraph, content) {
  // Escape model output first, then apply only a small, safe subset of Markdown.
  paragraph.innerHTML = esc(content)
    .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
    .replace(/__(.+?)__/gs, '<strong>$1</strong>')
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
}

$('#coach-context-toggle').addEventListener('click', () => {
  renderCoachTaskPicker();
  const picker = $('#coach-task-picker');
  picker.hidden = !picker.hidden;
  $('#coach-context-toggle').setAttribute('aria-expanded', String(!picker.hidden));
});

$('#coach-task-picker').addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;
  const id = Number(checkbox.value);
  if (checkbox.checked) coachLinkedTaskIds.add(id);
  else coachLinkedTaskIds.delete(id);
  renderCoachTaskPicker();
});

$('#coach-chat-reset').addEventListener('click', () => {
  coachConversation.length = 0;
  coachLinkedTaskIds.clear();
  $('#coach-chat-consent').checked = false;
  $('#coach-chat-input').value = '';
  $('#coach-chat-messages').innerHTML = '<article class="coach-chat-message assistant-message"><span class="chat-message-label">UNINEST STUDY COACH</span><p>Hi. What’s on your mind? We can break down an assignment, choose what to study next, or just talk through a busy day. Link tasks if you want me to use them.</p></article>';
  renderCoachTaskPicker();
});

$('#coach-chat-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    $('#coach-chat-form').requestSubmit();
  }
});

$('#coach-chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = $('#coach-chat-input');
  const prompt = input.value.trim();
  if (!prompt) return;
  if (!$('#coach-chat-consent').checked) {
    toast('Allow OpenRouter to receive this message in order to chat. For an on-device plan, open Study Coach and use its private planner.');
    return;
  }
  const send = $('#coach-chat-send');
  const reset = $('#coach-chat-reset');
  const sendLabel = send.querySelector('span:last-child');
  send.disabled = true;
  reset.disabled = true;
  sendLabel.textContent = 'Thinking';
  input.value = '';
  appendCoachChatMessage('user', prompt);
  const reply = appendCoachChatMessage('assistant', '', true);
  try {
    const response = await fetch('/api/coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...coachConversation, { role: 'user', content: prompt }].slice(-12), task_ids: [...coachLinkedTaskIds], share_with_ai: true }),
    });
    if (!response.ok) {
      let message = 'Study Coach could not start the conversation.';
      try { message = (await response.json()).detail || message; } catch { /* Keep the friendly fallback. */ }
      if (response.status === 503) {
        $('#coach-config-note').hidden = false;
        if ($('.view.active-view')?.dataset.viewPanel !== 'coach') {
          if (window.matchMedia('(max-width: 1200px)').matches) setCoachSidecarOpen(false);
          navigate('coach');
          window.setTimeout(() => $('#coach-config-note').scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        } else {
          $('#coach-config-note').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      throw new Error(message);
    }
    if (!response.body) throw new Error('This browser could not open a streamed reply. Try refreshing the page.');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let replyText = '';
    let streamError = '';
    const processEvent = (eventText) => {
      const dataLine = eventText.split('\n').find((line) => line.startsWith('data:'));
      if (!dataLine) return;
      let packet;
      try { packet = JSON.parse(dataLine.slice(5).trim()); } catch { return; }
      if (packet.type === 'delta' && typeof packet.text === 'string') {
        reply.article.classList.remove('is-thinking');
        replyText += packet.text;
        renderCoachMessage(reply.paragraph, replyText);
        $('#coach-chat-messages').scrollTop = $('#coach-chat-messages').scrollHeight;
      } else if (packet.type === 'error') streamError = packet.message || 'OpenRouter could not complete the reply.';
    };
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done }).replace(/\r\n/g, '\n');
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      events.forEach(processEvent);
      if (done) break;
    }
    if (buffer.trim()) processEvent(buffer);
    reply.article.classList.remove('is-thinking');
    if (streamError) {
      if (!replyText) reply.paragraph.textContent = streamError;
      if (streamError.includes('rejected this key')) await updateCoachStatus();
      toast(streamError);
    } else if (replyText) {
      coachConversation.push({ role: 'user', content: prompt });
      coachConversation.push({ role: 'assistant', content: replyText });
      if (coachConversation.length > 16) coachConversation.splice(0, coachConversation.length - 16);
    } else {
      reply.paragraph.textContent = 'I could not get a reply this time. Please try again.';
      toast('OpenRouter returned an empty response. Try again in a moment.');
    }
  } catch (error) {
    reply.article.classList.remove('is-thinking');
    if (!reply.paragraph.textContent) reply.paragraph.textContent = error.message;
    toast(error.message);
  } finally {
    send.disabled = false;
    reset.disabled = false;
    sendLabel.textContent = 'Send';
    input.focus();
  }
});

$('#coach-key-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = $('#coach-api-key');
  const button = $('#coach-key-submit');
  const apiKey = input.value.trim();
  if (!apiKey) return;
  button.disabled = true;
  button.textContent = 'Connecting…';
  try {
    await api('/api/coach/key', { method: 'PUT', body: JSON.stringify({ api_key: apiKey }) });
    input.value = '';
    await updateCoachStatus();
    toast('OpenRouter key saved for this session. It will be checked when you use Study Coach.');
  } catch (error) {
    toast(error.message);
  } finally {
    button.disabled = false;
    button.textContent = 'Connect key';
  }
});

function renderCoachPlan(plan) {
  latestCoachPlan = plan;
  const steps = plan.steps.map((step, index) => `${index ? `<div class="coach-break"><span>✳</span> ${plan.break_minutes}-minute reset</div>` : ''}
    <article class="coach-step"><span class="coach-step-index">${String(index + 1).padStart(2, '0')}</span><div class="coach-step-copy"><span class="coach-task-name">${esc(step.task_title)}</span><h4>${esc(step.action)}</h4><p>${esc(step.reason)}</p></div><span class="coach-step-time">${step.minutes} <small>MIN</small></span></article>`).join('');
  const result = $('#coach-result');
  const sourceLabel = plan.source === 'openrouter' ? 'OPENROUTER AI PLAN' : plan.source === 'local_fallback' ? 'PRIVATE PLAN · AI UNAVAILABLE' : 'PRIVATE PLAN · NO TASK DATA SENT';
  result.innerHTML = `<div class="coach-result-heading"><div><span class="surface-kicker">${sourceLabel}</span><h2>${esc(plan.headline)}</h2><p>${esc(plan.support)}</p></div><span class="coach-plan-total">${plan.available_minutes}<small>MIN AVAILABLE</small></span></div><div class="coach-timeline">${steps}</div><div class="coach-result-footer"><p>${esc(plan.closing)}</p><button type="button" class="soft-button" id="save-coach-plan"><span data-icon="note"></span>Save plan to Notes</button></div>`;
  const icon = $('#save-coach-plan [data-icon="note"]');
  if (icon) icon.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons.note}</svg>`;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

$('#coach-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const submit = $('#coach-submit');
  submit.disabled = true;
  submit.textContent = 'Finding a steadier rhythm…';
  try {
    const plan = await api('/api/coach/plan', { method: 'POST', body: JSON.stringify({
      stress_level: Number($('#coach-stress').value),
      available_minutes: Number($('#coach-time').value),
      share_with_ai: $('#coach-consent').checked,
    }) });
    renderCoachPlan(plan);
    if (plan.source === 'local_fallback') {
      await updateCoachStatus();
      toast(plan.fallback_reason || 'OpenRouter could not make a plan, so UniNest made a private basic plan instead.');
    }
  } catch (error) {
    toast(error.message);
    if (error.status === 502 && error.message.includes('OpenRouter rejected this API key')) {
      $('#coach-config-note').hidden = false;
      await updateCoachStatus();
    }
  } finally {
    submit.disabled = false;
    submit.innerHTML = `<span data-icon="spark"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.spark}</svg></span>Build my study plan`;
  }
});

document.addEventListener('click', async (event) => {
  const saveButton = event.target.closest('#save-coach-plan');
  if (!saveButton || !latestCoachPlan || saveButton.disabled) return;
  saveButton.disabled = true;
  const body = [
    `Available study time: ${latestCoachPlan.available_minutes} minutes`,
    `A gentle reminder: ${latestCoachPlan.support}`,
    '',
    ...latestCoachPlan.steps.flatMap((step, index) => [
      `${index + 1}. ${step.task_title}: ${step.action} (${step.minutes} min)`,
      step.reason ? `   ${step.reason}` : '',
      index < latestCoachPlan.steps.length - 1 ? `   Take a ${latestCoachPlan.break_minutes}-minute reset.` : '',
    ].filter(Boolean)),
    '',
    latestCoachPlan.closing,
  ].join('\n');
  try {
    const note = await api('/api/notes', { method: 'POST', body: JSON.stringify({
      title: `Study plan · ${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date())}`,
      body,
    }) });
    state.notes.unshift(note);
    renderSummary();
    renderNotes();
    toast('Your study plan was saved to Notes.');
  } catch (error) { toast(error.message); }
  finally { if (saveButton.isConnected) saveButton.disabled = false; }
});

$('#task-search').addEventListener('input', (event) => { state.query = event.target.value; renderTasks(); });
$('#subject-filter').addEventListener('change', (event) => { state.subjectFilter = event.target.value; renderTasks(); });

async function toggleTask(id) {
  try {
    const updated = await api(`/api/tasks/${id}`, { method: 'PATCH' });
    state.tasks = state.tasks.map((task) => task.id === id ? updated : task);
    if (updated.done) {
      completionSound();
    }
    renderSummary();
    renderDashboardTasks();
    renderTasks();
    renderWeekPlanner();
    renderSubjectsPage();
    if (updated.done && state.preferences.animations_enabled
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const checkButtons = $$(`[data-toggle-task="${id}"]`);
      checkButtons.forEach((button) => button.classList.add('just-completed'));
      window.setTimeout(() => checkButtons.forEach((button) => button.classList.remove('just-completed')), 480);
    }
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
      renderWeekPlanner();
      renderSubjectsPage();
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
}

function applyPreferences() {
  const preferences = state.preferences;
  const root = document.documentElement;
  root.dataset.animations = preferences.animations_enabled ? 'on' : 'off';
  root.dataset.motionBlur = preferences.motion_blur_enabled ? 'on' : 'off';
  root.style.setProperty('--motion-blur-strength', `${preferences.motion_blur_enabled ? preferences.motion_blur_strength : 0}px`);
  root.style.setProperty('--ambient-motion-blur', `${preferences.motion_blur_enabled ? Math.min(preferences.motion_blur_strength * .12, .9) : 0}px`);
  $('#setting-sounds').checked = preferences.sound_enabled;
  $('#setting-animations').checked = preferences.animations_enabled;
  $('#setting-motion-blur').checked = preferences.motion_blur_enabled;
  $('#setting-blur-strength').value = preferences.motion_blur_strength;
  $('#blur-strength-value').textContent = `${preferences.motion_blur_strength} px`;
  $('#blur-strength-control').classList.toggle('is-disabled', !preferences.motion_blur_enabled);
  $('#setting-blur-strength').disabled = !preferences.motion_blur_enabled;
}

async function persistPreferences() {
  try {
    const result = await api('/api/settings/preferences', {
      method: 'PUT', body: JSON.stringify({ preferences: state.preferences }),
    });
    state.preferences = { ...DEFAULT_PREFERENCES, ...result.preferences };
    applyPreferences();
    toast('Preferences saved.');
  } catch (error) {
    toast(`Could not save preferences: ${error.message}`);
  }
}

$('#setting-sounds').addEventListener('change', (event) => {
  state.preferences.sound_enabled = event.currentTarget.checked;
  applyPreferences();
  persistPreferences();
});
$('#setting-animations').addEventListener('change', (event) => {
  state.preferences.animations_enabled = event.currentTarget.checked;
  applyPreferences();
  persistPreferences();
});
$('#setting-motion-blur').addEventListener('change', (event) => {
  state.preferences.motion_blur_enabled = event.currentTarget.checked;
  applyPreferences();
  persistPreferences();
});
$('#setting-blur-strength').addEventListener('input', (event) => {
  state.preferences.motion_blur_strength = Number(event.currentTarget.value);
  applyPreferences();
});
$('#setting-blur-strength').addEventListener('change', persistPreferences);

$('#settings-reset').addEventListener('click', async (event) => {
  if (!window.confirm('Reset theme, sound, animations, and motion blur to their defaults? Your tasks, notes, resources, and study history will stay unchanged.')) return;
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const result = await api('/api/settings/reset', { method: 'POST' });
    state.theme = result.theme;
    state.preferences = { ...DEFAULT_PREFERENCES, ...result.preferences };
    applyTheme(state.theme);
    applyPreferences();
    toast('Settings restored to defaults.');
  } catch (error) {
    toast(`Could not reset settings: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});

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
    state.subjects = updated.subjects || [];
    state.focusSessions = updated.focus_sessions || [];
    state.theme = updated.theme || state.theme;
    state.preferences = { ...DEFAULT_PREFERENCES, ...(updated.preferences || {}) };
    applyTheme(state.theme);
    applyPreferences();
    render();
    const { tasks, notes, resources, focus_sessions: sessions = 0, subjects = 0 } = result.added;
    toast(`Imported ${subjects} subjects, ${tasks} tasks, ${notes} notes, ${resources} resources, and ${sessions} focus sessions.`);
  } catch (error) { toast(error.message); }
});

$('#mobile-menu').addEventListener('click', () => {
  if (sidebarBreakpoint.matches) {
    $('#sidebar').classList.toggle('mobile-open');
  } else {
    $('.app-shell').classList.toggle('sidebar-hidden');
  }
  syncSidebarToggle();
});
sidebarBreakpoint.addEventListener('change', () => {
  $('#sidebar').classList.remove('mobile-open');
  $('.app-shell').classList.remove('sidebar-hidden');
  syncSidebarToggle();
});
syncSidebarToggle();
$('#task-focus-button').addEventListener('click', () => navigate('focus'));

const ring = $('#timer-ring');
const circumference = 2 * Math.PI * 126;
ring.style.strokeDasharray = circumference;
const BREAK_DURATION = 5 * 60;
let timer = { mode: 'focus', focusDuration: 25 * 60, duration: 25 * 60, remaining: 25 * 60, running: false, endAt: 0, interval: null };

function syncTimerControls() {
  const isBreak = timer.mode === 'break';
  const startIcon = timer.running ? icons.pause : icons.play;
  const startLabel = timer.running ? `Pause ${isBreak ? 'break' : 'session'}` : isBreak ? 'Start break' : 'Begin focus';
  $('#timer-start').innerHTML = `<span data-icon="${timer.running ? 'pause' : 'play'}"><svg viewBox="0 0 24 24" aria-hidden="true">${startIcon}</svg></span><span>${startLabel}</span>`;
  $('#timer-reset').innerHTML = `<span data-icon="refresh"><svg viewBox="0 0 24 24" aria-hidden="true">${icons.refresh}</svg></span>${isBreak ? 'Reset break' : 'Reset'}`;
  $('#timer-label').textContent = isBreak ? 'SHORT BREAK' : 'FOCUS SESSION';
  $('#focus-kicker-copy').textContent = isBreak ? 'A MOMENT TO RESET' : 'A LITTLE SPACE TO THINK';
  $('#timer-preset-row').hidden = isBreak;
  $('#timer-skip-break').hidden = !isBreak;
}

function paintTimer() {
  const seconds = Math.max(0, Math.ceil(timer.remaining));
  $('#timer-display').innerHTML = `${String(Math.floor(seconds / 60)).padStart(2, '0')}<span>:</span>${String(seconds % 60).padStart(2, '0')}`;
  ring.style.strokeDashoffset = circumference * (1 - (1 - timer.remaining / timer.duration));
  if (!timer.running && timer.remaining === timer.duration) $('#timer-status').textContent = 'Settle in. You’re right where you need to be.';
}

function choosePreset(minutes, button) {
  if (timer.running) stopTimer();
  timer.mode = 'focus';
  timer.focusDuration = minutes * 60;
  timer.duration = timer.focusDuration;
  timer.remaining = timer.duration;
  $$('.preset-button').forEach((node) => node.classList.toggle('is-selected', node === button));
  syncTimerControls();
  paintTimer();
  $('#timer-status').textContent = `${minutes} minutes, just for you.`;
}

function beginBreak() {
  timer.mode = 'break';
  timer.duration = BREAK_DURATION;
  timer.remaining = BREAK_DURATION;
  syncTimerControls();
  paintTimer();
  $('#timer-status').textContent = 'Focus complete. Let your mind rest for five minutes.';
  startTimer();
  toast('Focus complete. Your five-minute break has started.');
}

function finishBreak(skipped = false) {
  stopTimer();
  timer.mode = 'focus';
  timer.duration = timer.focusDuration;
  timer.remaining = timer.focusDuration;
  syncTimerControls();
  paintTimer();
  $('#timer-status').textContent = skipped ? 'Break skipped. Ready for your next focus session.' : 'Break complete. Ready when you are.';
  toast(skipped ? 'Break skipped. Your next focus session is ready.' : 'Break complete. Your next focus session is ready.');
}

function tickTimer() {
  timer.remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
  paintTimer();
  if (timer.remaining <= 0) {
    const completedMode = timer.mode;
    stopTimer();
    buzzerSound();
    if (completedMode === 'focus') {
      saveFocusSession();
      beginBreak();
    }
    else finishBreak();
  }
}

async function saveFocusSession() {
  const selected = state.tasks.find((item) => String(item.id) === String(state.focusTaskId));
  try {
    const record = await api('/api/focus/sessions', { method: 'POST', body: JSON.stringify({
      task_id: selected?.id ?? null,
      minutes: Math.round(timer.focusDuration / 60),
    }) });
    state.focusSessions.unshift(record);
    renderFocusHistory();
    renderWeekPlanner();
    toast('Focus session logged. Nice work.');
  } catch (error) { toast(`Session ended, but could not save its record: ${error.message}`); }
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
  syncTimerControls();
  const focusTask = state.tasks.find((item) => String(item.id) === String(state.focusTaskId));
  $('#timer-status').textContent = timer.mode === 'break'
    ? 'Step away, stretch, and let your attention recharge.'
    : focusTask ? `Stay with “${focusTask.title}”. One thing at a time.` : 'You’re in your focus session. Stay with it.';
  timer.interval = window.setInterval(tickTimer, 1000);
}

function stopTimer() {
  timer.running = false;
  clearInterval(timer.interval);
  timer.interval = null;
  syncTimerControls();
  paintTimer();
}

$('#timer-start').addEventListener('click', startTimer);
$('#timer-reset').addEventListener('click', () => {
  stopTimer();
  timer.remaining = timer.duration;
  paintTimer();
  $('#timer-status').textContent = timer.mode === 'break'
    ? 'Break reset. Take the full five minutes.'
    : 'Reset. Start again whenever you’re ready.';
});
$('#timer-skip-break').addEventListener('click', () => finishBreak(true));
$('#focus-task-select').addEventListener('change', (event) => {
  state.focusTaskId = event.currentTarget.value || null;
  renderFocusTaskOptions();
  if (timer.running && timer.mode === 'focus') {
    const task = state.tasks.find((item) => String(item.id) === String(state.focusTaskId));
    $('#timer-status').textContent = task
      ? `Stay with “${task.title}”. One thing at a time.`
      : 'You’re in your focus session. Stay with it.';
  }
});

const focusSurface = $('#focus-surface');
const focusFullscreenButton = $('#focus-fullscreen-button');
function syncFocusFullscreenButton() {
  const active = document.fullscreenElement === focusSurface;
  const label = active ? 'Exit full screen' : 'Full screen';
  const icon = active ? 'compress' : 'expand';
  focusFullscreenButton.setAttribute('aria-pressed', String(active));
  focusFullscreenButton.setAttribute('aria-label', active ? 'Exit timer full screen' : 'Make timer full screen');
  focusFullscreenButton.title = active ? 'Exit full screen (Esc)' : 'Make timer full screen';
  focusFullscreenButton.innerHTML = `<span data-icon="${icon}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[icon]}</svg></span><span>${label}</span>`;
}

focusFullscreenButton.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement === focusSurface) await document.exitFullscreen();
    else await focusSurface.requestFullscreen();
  } catch {
    toast('Full screen is unavailable in this browser.');
  }
});
document.addEventListener('fullscreenchange', syncFocusFullscreenButton);
syncFocusFullscreenButton();

function updateDate() {
  const now = new Date();
  $('#top-date').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now).toUpperCase();
  updateWelcomeGreeting();
}

function updateWelcomeGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 5 || hour >= 21
    ? 'Good night'
    : hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';
  const firstName = String(state.user?.name || '').trim().split(/\s+/)[0];
  if (firstName) $('#welcome-title').textContent = `${greeting}, ${firstName}.`;
}

window.setInterval(updateDate, 60_000);

document.addEventListener('visibilitychange', () => {
  document.documentElement.dataset.documentHidden = String(document.hidden);
});
document.documentElement.dataset.documentHidden = String(document.hidden);

async function init() {
  updateDate();
  const view = location.hash.slice(1);
  if (pageNames[view] && view !== 'dashboard') navigate(view);
  try {
    const data = await api('/api/bootstrap');
    state.tasks = data.tasks;
    state.notes = data.notes;
    state.resources = data.resources;
    state.subjects = data.subjects || [];
    state.focusSessions = data.focus_sessions || [];
    state.theme = data.theme || 'dark';
    state.preferences = { ...DEFAULT_PREFERENCES, ...(data.preferences || {}) };
    showAccount(data.user);
    applyTheme(state.theme);
    applyPreferences();
    render();
    updateCoachStatus();
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

syncTimerControls();
paintTimer();
init();
