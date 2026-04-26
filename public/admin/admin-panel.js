// Admin Panel JavaScript

const API_BASE = 'http://localhost:3000/api';
let token = localStorage.getItem('adminToken');
let currentAdmin = null;
let currentModal = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    verifyToken();
  } else {
    showLoginPage();
  }
  
  setupMenuClicks();
});

// ===== LOGIN =====
async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      errorDiv.textContent = data.error || 'Login failed';
      errorDiv.classList.add('show');
      return;
    }
    
    token = data.token;
    currentAdmin = data.admin;
    localStorage.setItem('adminToken', token);
    
    showAdminPanel();
  } catch (error) {
    console.error('Login error:', error);
    errorDiv.textContent = 'Errore di connessione';
    errorDiv.classList.add('show');
  }
}

function handleLogout() {
  token = null;
  currentAdmin = null;
  localStorage.removeItem('adminToken');
  showLoginPage();
  document.getElementById('loginForm').reset();
}

async function verifyToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    
    const data = await response.json();
    currentAdmin = data.admin;
    showAdminPanel();
  } catch (error) {
    console.error('Verification error:', error);
    token = null;
    localStorage.removeItem('adminToken');
    showLoginPage();
  }
}

function showLoginPage() {
  document.getElementById('loginContainer').classList.add('show');
  document.getElementById('adminContainer').classList.remove('show');
}

function showAdminPanel() {
  document.getElementById('loginContainer').classList.remove('show');
  document.getElementById('adminContainer').classList.add('show');
  document.getElementById('adminEmail').textContent = currentAdmin.email;
  
  loadDashboard();
}

// ===== MENU =====
function setupMenuClicks() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');
      
      const section = item.dataset.section;
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById(section).classList.add('active');
      
      const titles = {
        dashboard: 'Dashboard',
        unban: 'Richieste Unban',
        unmute: 'Richieste Unmute',
        reports: 'Segnalazioni',
        candidature: 'Candidature',
        communications: 'Comunicazioni'
      };
      
      document.getElementById('pageTitle').textContent = titles[section];
      
      if (section !== 'dashboard') {
        loadData(section);
      }
    });
  });
}

// ===== DASHBOARD =====
async function loadDashboard() {
  try {
    const [unbanRes, unmuteRes, reportsRes, candidatureRes] = await Promise.all([
      fetch(`${API_BASE}/unban`),
      fetch(`${API_BASE}/unmute`),
      fetch(`${API_BASE}/reports`),
      fetch(`${API_BASE}/candidature`)
    ]);
    
    const unban = await unbanRes.json();
    const unmute = await unmuteRes.json();
    const reports = await reportsRes.json();
    const candidature = await candidatureRes.json();
    
    document.getElementById('unbanCount').textContent = unban.filter(r => r.status === 'pending').length;
    document.getElementById('unmuteCount').textContent = unmute.filter(r => r.status === 'pending').length;
    document.getElementById('reportCount').textContent = reports.filter(r => r.status === 'pending').length;
    document.getElementById('candidatureCount').textContent = candidature.filter(r => r.status === 'pending').length;
  } catch (error) {
    console.error('Dashboard error:', error);
  }
}

// ===== DATA LOADING =====
async function loadData(section) {
  try {
    let endpoint = `/api/${section}`;
    const response = await fetch(`http://localhost:3000${endpoint}`);
    const data = await response.json();
    
    if (section === 'unban') {
      renderUnbanRequests(data);
    } else if (section === 'unmute') {
      renderUnmuteRequests(data);
    } else if (section === 'reports') {
      renderReports(data);
    } else if (section === 'candidature') {
      renderCandidatures(data);
    } else if (section === 'communications') {
      renderCommunications(data);
    }
  } catch (error) {
    console.error('Load data error:', error);
  }
}

// ===== RENDER FUNCTIONS =====
function renderUnbanRequests(data) {
  const tbody = document.getElementById('unbanBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nessuna richiesta</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(req => `
    <tr>
      <td>${req.username}</td>
      <td>${req.discordId}</td>
      <td>${req.reason}</td>
      <td><span class="status-badge status-${req.status}">${capitalizeStatus(req.status)}</span></td>
      <td>${formatDate(req.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-view" onclick="viewRequest('unban', ${req.id})">Vedi</button>
          ${req.status === 'pending' ? `
            <button class="btn-small btn-approve" onclick="updateRequest('unban', ${req.id}, 'approved')">Approva</button>
            <button class="btn-small btn-reject" onclick="updateRequest('unban', ${req.id}, 'rejected')">Rifiuta</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderUnmuteRequests(data) {
  const tbody = document.getElementById('unmuteBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nessuna richiesta</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(req => `
    <tr>
      <td>${req.username}</td>
      <td>${req.discordId}</td>
      <td>${req.reason}</td>
      <td><span class="status-badge status-${req.status}">${capitalizeStatus(req.status)}</span></td>
      <td>${formatDate(req.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-view" onclick="viewRequest('unmute', ${req.id})">Vedi</button>
          ${req.status === 'pending' ? `
            <button class="btn-small btn-approve" onclick="updateRequest('unmute', ${req.id}, 'approved')">Approva</button>
            <button class="btn-small btn-reject" onclick="updateRequest('unmute', ${req.id}, 'rejected')">Rifiuta</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderReports(data) {
  const tbody = document.getElementById('reportsBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nessuna segnalazione</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(req => `
    <tr>
      <td>${req.reporterUsername}</td>
      <td>${req.reportedUsername}</td>
      <td>${req.reason}</td>
      <td><span class="status-badge status-${req.status}">${capitalizeStatus(req.status)}</span></td>
      <td>${formatDate(req.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-view" onclick="viewRequest('reports', ${req.id})">Vedi</button>
          ${req.status === 'pending' ? `
            <button class="btn-small btn-approve" onclick="updateRequest('reports', ${req.id}, 'in_review')">Revisiona</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderCandidatures(data) {
  const tbody = document.getElementById('candidatureBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nessuna candidatura</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(req => `
    <tr>
      <td>${req.username}</td>
      <td>${capitalizePosition(req.position)}</td>
      <td>${req.email}</td>
      <td><span class="status-badge status-${req.status}">${capitalizeStatus(req.status)}</span></td>
      <td>${formatDate(req.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-view" onclick="viewRequest('candidature', ${req.id})">Vedi</button>
          ${req.status === 'pending' ? `
            <button class="btn-small btn-approve" onclick="updateRequest('candidature', ${req.id}, 'approved')">Approva</button>
            <button class="btn-small btn-reject" onclick="updateRequest('candidature', ${req.id}, 'rejected')">Rifiuta</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function renderCommunications(data) {
  const tbody = document.getElementById('communicationsBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nessuna comunicazione</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(comm => `
    <tr>
      <td>${comm.title}</td>
      <td>${capitalizeType(comm.type)}</td>
      <td>${comm.isActive ? '✓' : '✗'}</td>
      <td>${comm.priority > 0 ? '🔴 Alta' : 'Normale'}</td>
      <td>${formatDate(comm.createdAt)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-small btn-view" onclick="viewRequest('communications', ${comm.id})">Vedi</button>
          <button class="btn-small btn-delete" onclick="deleteCommunication(${comm.id})">Elimina</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ===== REQUEST ACTIONS =====
async function viewRequest(type, id) {
  try {
    const response = await fetch(`http://localhost:3000/api/${type}/${id}`);
    const data = await response.json();
    
    let content = '';
    
    if (type === 'unban' || type === 'unmute') {
      content = `
        <div class="info-group">
          <div class="info-label">Username</div>
          <div class="info-value">${data.username}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Discord ID</div>
          <div class="info-value">${data.discordId}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Motivo</div>
          <div class="info-value">${data.reason}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Status</div>
          <div class="info-value">${capitalizeStatus(data.status)}</div>
        </div>
        ${data.adminNotes ? `
        <div class="info-group">
          <div class="info-label">Note Admin</div>
          <div class="info-value">${data.adminNotes}</div>
        </div>
        ` : ''}
        <div class="info-group">
          <div class="info-label">Note Admin (Aggiungi/Modifica)</div>
          <textarea class="form-textarea" id="adminNotes" placeholder="Aggiungi note per questa richiesta">${data.adminNotes || ''}</textarea>
        </div>
      `;
    } else if (type === 'reports') {
      content = `
        <div class="info-group">
          <div class="info-label">Reporter</div>
          <div class="info-value">${data.reporterUsername} (${data.reporterDiscordId})</div>
        </div>
        <div class="info-group">
          <div class="info-label">Reported</div>
          <div class="info-value">${data.reportedUsername} (${data.reportedDiscordId})</div>
        </div>
        <div class="info-group">
          <div class="info-label">Motivo</div>
          <div class="info-value">${data.reason}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Descrizione</div>
          <div class="info-value">${data.description || 'No description'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Status</div>
          <div class="info-value">${capitalizeStatus(data.status)}</div>
        </div>
        ${data.adminNotes ? `
        <div class="info-group">
          <div class="info-label">Note Admin</div>
          <div class="info-value">${data.adminNotes}</div>
        </div>
        ` : ''}
        <div class="info-group">
          <div class="info-label">Note Admin (Aggiungi/Modifica)</div>
          <textarea class="form-textarea" id="adminNotes" placeholder="Aggiungi note per questa segnalazione">${data.adminNotes || ''}</textarea>
        </div>
      `;
    } else if (type === 'candidature') {
      content = `
        <div class="info-group">
          <div class="info-label">Username</div>
          <div class="info-value">${data.username}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Discord ID</div>
          <div class="info-value">${data.discordId}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Email</div>
          <div class="info-value">${data.email}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Posizione</div>
          <div class="info-value">${capitalizePosition(data.position)}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Messaggio</div>
          <div class="info-value">${data.message}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Status</div>
          <div class="info-value">${capitalizeStatus(data.status)}</div>
        </div>
        ${data.adminNotes ? `
        <div class="info-group">
          <div class="info-label">Note Admin</div>
          <div class="info-value">${data.adminNotes}</div>
        </div>
        ` : ''}
        <div class="info-group">
          <div class="info-label">Note Admin (Aggiungi/Modifica)</div>
          <textarea class="form-textarea" id="adminNotes" placeholder="Aggiungi note per questa candidatura">${data.adminNotes || ''}</textarea>
        </div>
      `;
    } else if (type === 'communications') {
      content = `
        <div class="info-group">
          <div class="info-label">Titolo</div>
          <div class="info-value">${data.title}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Contenuto</div>
          <div class="info-value">${data.content}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Tipo</div>
          <div class="info-value">${capitalizeType(data.type)}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Priorità</div>
          <div class="info-value">${data.priority > 0 ? '🔴 Alta' : 'Normale'}</div>
        </div>
        <div class="info-group">
          <div class="info-label">Attiva</div>
          <div class="info-value">${data.isActive ? 'Si' : 'No'}</div>
        </div>
      `;
    }
    
    currentModal = { type, id, data };
    document.getElementById('modalTitle').textContent = `Dettagli ${type}`;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('detailModal').classList.add('show');
  } catch (error) {
    console.error('View error:', error);
    alert('Errore nel caricamento dei dettagli');
  }
}

async function updateRequest(type, id, newStatus) {
  const adminNotes = document.getElementById('adminNotes')?.value || '';
  
  try {
    const response = await fetch(`http://localhost:3000/api/${type}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus, adminNotes })
    });
    
    if (!response.ok) {
      throw new Error('Update failed');
    }
    
    closeModal();
    loadData(type);
    loadDashboard();
  } catch (error) {
    console.error('Update error:', error);
    alert('Errore nell\'aggiornamento');
  }
}

async function deleteCommunication(id) {
  if (!confirm('Sei sicuro di voler eliminare questa comunicazione?')) return;
  
  try {
    const response = await fetch(`http://localhost:3000/api/communications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Delete failed');
    }
    
    loadData('communications');
    loadDashboard();
  } catch (error) {
    console.error('Delete error:', error);
    alert('Errore nell\'eliminazione');
  }
}

// ===== COMMUNICATIONS MODAL =====
function openCommunicationModal() {
  const content = `
    <div class="info-group">
      <div class="info-label">Titolo</div>
      <input type="text" id="commTitle" class="form-textarea" style="min-height: auto;" placeholder="Titolo della comunicazione">
    </div>
    <div class="info-group">
      <div class="info-label">Contenuto</div>
      <textarea class="form-textarea" id="commContent" placeholder="Contenuto della comunicazione"></textarea>
    </div>
    <div class="info-group">
      <div class="info-label">Tipo</div>
      <select id="commType" class="form-textarea" style="min-height: auto;">
        <option value="announcement">Annuncio</option>
        <option value="update">Aggiornamento</option>
        <option value="warning">Avvertimento</option>
        <option value="event">Evento</option>
      </select>
    </div>
    <div class="info-group">
      <div class="info-label">Priorità</div>
      <select id="commPriority" class="form-textarea" style="min-height: auto;">
        <option value="0">Normale</option>
        <option value="1">Alta</option>
      </select>
    </div>
  `;
  
  document.getElementById('modalTitle').textContent = 'Nuova Comunicazione';
  document.getElementById('modalBody').innerHTML = content;
  
  const actionBtn = document.getElementById('modalAction');
  actionBtn.textContent = 'Crea';
  actionBtn.style.display = 'block';
  actionBtn.onclick = createCommunication;
  
  document.getElementById('detailModal').classList.add('show');
}

async function createCommunication() {
  const title = document.getElementById('commTitle').value;
  const content = document.getElementById('commContent').value;
  const type = document.getElementById('commType').value;
  const priority = parseInt(document.getElementById('commPriority').value);
  
  if (!title || !content) {
    alert('Titolo e contenuto sono obbligatori');
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/communication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, type, priority })
    });
    
    if (!response.ok) {
      throw new Error('Create failed');
    }
    
    closeModal();
    loadData('communications');
    loadDashboard();
  } catch (error) {
    console.error('Create error:', error);
    alert('Errore nella creazione');
  }
}

// ===== MODAL =====
function closeModal() {
  document.getElementById('detailModal').classList.remove('show');
  document.getElementById('modalAction').style.display = 'none';
  currentModal = null;
}

// ===== UTILITIES =====
function formatDate(date) {
  return new Date(date).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function capitalizeStatus(status) {
  const statuses = {
    pending: 'In Sospeso',
    approved: 'Approvato',
    rejected: 'Rifiutato',
    in_review: 'In Revisione',
    resolved: 'Risolto',
    dismissed: 'Archiviato'
  };
  return statuses[status] || status;
}

function capitalizePosition(position) {
  const positions = {
    moderator: 'Moderatore',
    helper: 'Aiutante',
    staff: 'Staff'
  };
  return positions[position] || position;
}

function capitalizeType(type) {
  const types = {
    announcement: 'Annuncio',
    update: 'Aggiornamento',
    warning: 'Avvertimento',
    event: 'Evento'
  };
  return types[type] || type;
}
