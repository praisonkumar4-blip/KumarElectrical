/* API client for Kumar Electrical Contractor. Configure API_CONFIG.baseUrl for deployment. */
const API_CONFIG = { baseUrl: 'https://springbootfix.onrender.com/api', mode: 'backend' };
const ApiLoading = (() => {
  let pending = 0, overlay, startup = false;
  function ensure() { if (overlay || !document.body) return; overlay = document.createElement('div'); overlay.id = 'apiLoadingOverlay'; overlay.className = 'api-loading-overlay'; overlay.setAttribute('role', 'status'); overlay.setAttribute('aria-live', 'polite'); overlay.innerHTML = '<div class="api-loader-card"><div class="api-loader-mark">⚡</div><div class="api-loader-title">Loading company data</div><div class="api-loader-message" id="apiLoadingMessage">Connecting to the server…</div><div class="api-loader-track"><span></span></div><div class="api-loader-foot">KUMAR ELECTRICAL CONTRACTOR</div></div>'; document.body.appendChild(overlay); }
  function show(message = 'Fetching the latest records…') { ensure(); pending++; if (overlay) { const m = overlay.querySelector('#apiLoadingMessage'); if (m) m.textContent = message; overlay.classList.add('visible'); } }
  function hide() { pending = Math.max(0, pending - 1); if (pending === 0 && !startup && overlay) overlay.classList.remove('visible'); }
  function beginStartup(message = 'Loading data from the database…') { startup = true; ensure(); if (overlay) { const m = overlay.querySelector('#apiLoadingMessage'); if (m) m.textContent = message; overlay.classList.add('visible'); } }
  function endStartup() { startup = false; if (pending === 0 && overlay) overlay.classList.remove('visible'); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensure, { once: true }); else ensure();
  return { show, hide, beginStartup, endStartup };
})();
function apiToken() { return sessionStorage.getItem('kec_token') || localStorage.getItem('kec_token') || ''; }
const ApiService = {
  async request(path, options = {}) {
    if (API_CONFIG.mode !== 'backend') throw new Error('Backend mode is disabled.');
    ApiLoading.show(options.loadingMessage || 'Fetching the latest records…');
    try {
      const headers = { Accept: 'application/json', ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(apiToken() ? { Authorization: `Bearer ${apiToken()}` } : {}), ...(options.headers || {}) };
      const response = await fetch(`${API_CONFIG.baseUrl}${path}`, { ...options, headers });
      const text = await response.text(); let body = null; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
      if (!response.ok) throw new Error(body?.error || body?.message || body || `Request failed: ${response.status}`);
      return body;
    } finally { ApiLoading.hide(); }
  },
  login: (body) => ApiService.request('/auth/login', { method: 'POST', body: JSON.stringify(body), loadingMessage: 'Signing in securely…' }),
  logout: () => ApiService.request('/auth/logout', { method: 'POST', loadingMessage: 'Signing out…' }),
  me: () => ApiService.request('/auth/me'),
  state: () => ApiService.request('/state', { loadingMessage: 'Loading company records from MySQL…' }),
  saveState: (state) => ApiService.request('/state', { method: 'PUT', body: JSON.stringify(state), loadingMessage: 'Saving changes to the database…' }),
  async mutateState(mutator) { const state = await ApiService.state(); mutator(state); return ApiService.saveState(state); },
  employees: () => ApiService.request('/employees'),
  createEmployee: (body) => ApiService.mutateState(s => { s.employees.push(body); }),
  updateEmployee: (id, body) => ApiService.mutateState(s => { s.employees = s.employees.map(x => String(x.id) === String(id) ? { ...body, id } : x); }),
  deleteEmployee: (id) => ApiService.mutateState(s => { s.employees = s.employees.filter(x => String(x.id) !== String(id)); }),
  sites: () => ApiService.request('/sites'),
  createSite: (body) => ApiService.mutateState(s => { s.sites.push(body); }),
  updateSite: (id, body) => ApiService.mutateState(s => { s.sites = s.sites.map(x => String(x.id) === String(id) ? { ...body, id } : x); }),
  deleteSite: (id) => ApiService.mutateState(s => { s.sites = s.sites.filter(x => String(x.id) !== String(id)); }),
  assignments: () => ApiService.request('/assignments'), attendance: () => ApiService.request('/attendance'),
  submitAttendance: (body) => ApiService.mutateState(s => { s.attendance.push(body); }),
  updateAttendance: (id, body) => ApiService.mutateState(s => { s.attendance = s.attendance.map(x => String(x.id) === String(id) ? { ...body, id } : x); }),
  deleteAttendance: (id) => ApiService.mutateState(s => { s.attendance = s.attendance.filter(x => String(x.id) !== String(id)); }),
  verifyLocation: (body) => ApiService.request('/attendance/verify-location', { method: 'POST', body: JSON.stringify(body), loadingMessage: 'Verifying worksite…' }),
  payroll: (week) => ApiService.request(`/payroll?week=${encodeURIComponent(week || '')}`, { loadingMessage: 'Loading payroll records…' }),
  projects: () => ApiService.request('/projects'),
  createProject: (body) => ApiService.mutateState(s => { s.projects.unshift(body); }),
  deleteProject: (id) => ApiService.mutateState(s => { s.projects = s.projects.filter(x => String(x.id) !== String(id)); }),
  async uploadProjectPhoto(formData) { const file = formData.get('file') || formData.get('photo'); if (!(file instanceof File)) throw new Error('Choose an image file.'); return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ photo: reader.result }); reader.onerror = () => reject(new Error('Could not read image file.')); reader.readAsDataURL(file); }); },
  async loadApplicationData() { return ApiService.state(); }
};
