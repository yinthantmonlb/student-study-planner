const STORAGE_KEY = 'study-bloom-tasks';
let tasks = loadTasks();
let activeFilter = 'all';

const els = {
  form: document.querySelector('#taskForm'), input: document.querySelector('#taskInput'), subject: document.querySelector('#subjectInput'), list: document.querySelector('#taskList'), empty: document.querySelector('#emptyState'), filterButtons: document.querySelectorAll('.filter'), progressPercent: document.querySelector('#progressPercent'), progressFill: document.querySelector('#progressFill'), progressMessage: document.querySelector('#progressMessage'), remaining: document.querySelector('#remainingCount'), completed: document.querySelector('#completedCount'), taskCount: document.querySelector('#taskCount'), today: document.querySelector('#todayLabel')
};

function loadTasks() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(saved) ? saved : []; } catch { return []; } }
function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function render() {
  const done = tasks.filter(task => task.completed).length;
  const percent = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  const visible = tasks.filter(task => activeFilter === 'all' || (activeFilter === 'completed' ? task.completed : !task.completed));
  els.list.innerHTML = visible.map(task => `<article class="task-item ${task.completed ? 'done' : ''}"><input class="check" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} as completed" data-id="${task.id}" ${task.completed ? 'checked' : ''}><div class="task-info"><p class="task-title">${escapeHTML(task.title)}</p><span class="subject-tag">${escapeHTML(task.subject)}</span></div><button class="delete-button" aria-label="Delete ${escapeHTML(task.title)}" data-delete="${task.id}">×</button></article>`).join('');
  els.empty.classList.toggle('visible', visible.length === 0); els.progressFill.style.width = `${percent}%`; els.progressPercent.textContent = `${percent}%`; els.remaining.textContent = tasks.length - done; els.completed.textContent = done; els.taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
  els.progressMessage.textContent = !tasks.length ? 'Add your first task to get started.' : percent === 100 ? 'Wonderful! Your whole plan is complete.' : `${done} of ${tasks.length} tasks complete. Keep going!`;
  els.filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
}
function escapeHTML(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
els.form.addEventListener('submit', event => { event.preventDefault(); const title = els.input.value.trim(); if (!title) return; tasks.unshift({ id: Date.now().toString(), title, subject: els.subject.value, completed: false }); saveTasks(); els.input.value = ''; els.input.focus(); render(); });
els.list.addEventListener('click', event => { const id = event.target.dataset.id || event.target.dataset.delete; if (!id) return; const task = tasks.find(item => item.id === id); if (event.target.matches('.check') && task) task.completed = event.target.checked; if (event.target.matches('[data-delete]')) tasks = tasks.filter(item => item.id !== id); saveTasks(); render(); });
els.filterButtons.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; render(); }));
els.today.textContent = new Intl.DateTimeFormat(undefined, { weekday:'long', month:'short', day:'numeric' }).format(new Date());
render();
