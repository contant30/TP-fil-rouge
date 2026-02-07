// Utilisateurs

// Charger le header au démarrage
        fetch('/front/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;

             // ✅ Charge footer aussi
        fetch('/front/footer.html')
        .then(res => res.text())
        .then(footerHtml => {
            const footerContainer = document.createElement('div');
            footerContainer.id = 'footer-container';
            footerContainer.innerHTML = footerHtml;
            document.body.appendChild(footerContainer);  // Fin body
        });
            initApp(); // Initialiser l'app après chargement du header
        });


                    // 🔄 Navigation tabs (pour header onclick)
        function navigateTo(tab) {
            console.log('➡️ Navigation:', tab);

            // 📍 Mapping onglet → page dédiée
            const pages = {
                'reservations': '/reservation.html',
                'resa': '/resa.html',
                'salles': '/salles.html',
                'ressources': '/ressources.html',
                'utilisateurs': '/utilisateurs.html'
            };

            // Si page existe → redirection
            if (pages[tab]) {
                window.location.href = pages[tab];
                return;
            }

            // Sinon, comportement par défaut (cache/affiche sections)
            document.querySelectorAll('[id$="-page"]').forEach(page => 
                page.classList.add('hidden')
            );
            
            const targetPage = document.getElementById(tab + '-page');
            if (targetPage) targetPage.classList.remove('hidden');
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-blue-600', 'text-blue-600', 'bg-blue-50', 'font-bold');
            });
            document.querySelector(`[data-tab="${tab}"]`)?.classList.add(
                'border-blue-600', 'text-blue-600', 'bg-blue-50', 'font-bold'
            );
            
            if (tab === 'reservations') renderCalendar();
        }
        
// ===== VARIABLES GLOBALES =====
let users = [];
let editingUser = null;
let deleteId = null;

// ===== CHARGEMENT API =====
async function loadUsers() {
    try {
        const response = await fetch('/api/utilisateurs');
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        users = await response.json();
        renderUsers();
    } catch (error) {
        console.error('Erreur API:', error);
        document.getElementById('users-list').innerHTML = 
            '<div class="p-8 text-center text-red-600 bg-red-50 rounded-xl border">❌ Erreur backend. Vérifiez /api/utilisateurs</div>';
    }
}

// ===== AFFICHAGE UTILISATEURS =====
function renderUsers() {
    const container = document.getElementById('users-list');
    if (!container) return console.error('❌ #users-list manquant');

    if (users.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-md border border-blue-100 p-12 text-center">
                <i class="fas fa-users w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-2xl font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
                <p class="text-gray-600">Ajoutez votre premier utilisateur</p>
                <button onclick="openDialog()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto">
                    <i class="fas fa-plus"></i>Nouvel utilisateur
                </button>
            </div>`;
        return;
    }

    let html = `
        <div class="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <!-- DESKTOP -->
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                    <thead><tr class="bg-blue-50">
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Nom</th>
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Rôle</th>
                        <th class="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                    </tr></thead>
                    <tbody>`;

    users.forEach(user => {
        const initial = (user.name || '?').charAt(0).toUpperCase();
        const badgeClass = user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
        const badgeText = user.role === 'admin' ? 'Administrateur' : 'Utilisateur';
        
        html += `
            <tr class="hover:bg-gray-50 border-t">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">${initial}</div>
                        <span class="font-medium">${user.name || 'N/A'}</span>
                    </div>
                </td>
                <td class="px-6 py-4"><div class="flex items-center gap-2 text-gray-600"><i class="fas fa-envelope"></i>${user.email || 'N/A'}</div></td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                        <i class="fas fa-shield-alt mr-1"></i>${badgeText}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editUser(${JSON.stringify(user)})" class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 mr-2">
                        <i class="fas fa-pencil"></i>Modifier
                    </button>
                    <button onclick="showDeleteDialog(${user.id})" class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                        <i class="fas fa-trash"></i>Supprimer
                    </button>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;

    // MOBILE (simplifié)
    html += `<div class="md:hidden divide-y divide-gray-200">`;
    users.forEach(user => {
        const initial = (user.name || '?').charAt(0).toUpperCase();
        const badgeClass = user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
        html += `
            <div class="p-6">
                <div class="flex items-start gap-4 mb-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">${initial}</div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${user.name}</h4>
                        <p class="text-sm text-gray-600">${user.email}</p>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row gap-2">
                    <button onclick="editUser(${JSON.stringify(user)})" class="flex-1 bg-blue-50 border border-blue-200 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100">
                        <i class="fas fa-pencil mr-1"></i>Modifier
                    </button>
                    <button onclick="showDeleteDialog(${user.id})" class="flex-1 bg-red-50 border border-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100">
                        <i class="fas fa-trash mr-1"></i>Supprimer
                    </button>
                </div>
            </div>`;
    });
    html += '</div></div>';
    container.innerHTML = html;
}

// ===== CRUD API =====
async function saveUser(e) {
    e.preventDefault();
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;

    const userData = { name, email, role };
    if (!editingUser) userData.password = password;

    try {
        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `/api/utilisateurs/${editingUser.id}` : '/api/utilisateurs';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        
        closeDialog();
        loadUsers();  // Refresh
    } catch (error) {
        alert(`❌ Erreur: ${error.message}`);
    }
}

async function confirmDelete() {
    if (!deleteId) return;
    
    try {
        const response = await fetch(`/api/utilisateurs/${deleteId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Suppression échouée');
        closeDeleteDialog();
        loadUsers();
    } catch (error) {
        alert('❌ Erreur suppression');
    }
}

// ===== DIALOGUES =====
function openDialog(user = null) {
    editingUser = user;
    document.getElementById('dialog-title').textContent = user ? 'Modifier utilisateur' : 'Nouvel utilisateur';
    document.getElementById('submit-text').textContent = user ? 'Enregistrer' : 'Créer';
    document.getElementById('password-field').style.display = user ? 'none' : 'block';

    if (user) {
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-role').value = user.role || 'user';
        document.getElementById('user-password').required = false;
    } else {
        document.getElementById('user-name').value = '';
        document.getElementById('user-email').value = '';
        document.getElementById('user-password').value = '';
        document.getElementById('user-role').value = 'user';
        document.getElementById('user-password').required = true;
    }
    document.getElementById('user-dialog').classList.remove('hidden');
}

function closeDialog() {
    document.getElementById('user-dialog').classList.add('hidden');
    editingUser = null;
}

function editUser(user) {
    openDialog(user);
}

function showDeleteDialog(id) {
    deleteId = id;
    document.getElementById('delete-dialog').classList.remove('hidden');
}

function closeDeleteDialog() {
    deleteId = null;
    document.getElementById('delete-dialog').classList.add('hidden');
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', loadUsers);
