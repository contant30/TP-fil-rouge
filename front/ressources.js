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



// ressource 
        // Données mock

// Données persistantes localStorage
let resources =[
    {id: 1, name: 'Écran interactif', quantity: 5, available: true},
    {id: 2, name: 'WiFi renforcé', quantity: 10, available: true},
    {id: 3, name: 'Machine café', quantity: 3, available: true},
    {id: 4, name: 'Projecteur', quantity: 8, available: true},
    {id: 5, name: 'Tableau blanc', quantity: 12, available: false}
];

let editingResource = null;

// Sauvegarde
function saveResources() {
    localStorage.setItem('resources', JSON.stringify(resources));
}

// Rendu (nom corrigé)
function renderResources() {
    const container = document.getElementById('resources-list');  // ID fixe
    if (!container) return console.error('ID resources-list manquant');
    
    if (resources.length === 0) {
        container.innerHTML = `
            <div class="bg-white rounded-xl shadow-md border border-blue-100 p-12 text-center">
                <i class="fas fa-box w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-2xl font-semibold text-gray-900 mb-2">Aucune ressource</h3>
                <p class="text-gray-600">Ajoutez votre première ressource</p>
                <button onclick="openDialog()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors">
                    <i class="fas fa-plus"></i> Nouvelle ressource
                </button>
            </div>
        `;
        return;
    }

    // Desktop table
    let html = `
        <div class="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
            <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                    <thead><tr class="bg-blue-50">
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Ressource</th>
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Quantité</th>
                        <th class="px-6 py-4 text-left font-semibold text-gray-900">Disponibilité</th>
                        <th class="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                    </tr></thead>
                    <tbody>
    `;

    resources.forEach(resource => {
        html += `
            <tr class="hover:bg-gray-50 border-t">
                <td class="px-6 py-4 font-medium">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-box w-4 h-4 text-blue-600"></i>
                        ${resource.name}
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-700">${resource.quantity} unités</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${resource.available ? 'checked' : ''} 
                                   onchange="toggleAvailability(${resource.id})" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span class="text-sm font-medium ${resource.available ? 'text-green-600' : 'text-red-600'}">
                            ${resource.available ? 'Disponible' : 'Indisponible'}
                        </span>
                    </div>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editResource(${resource.id})" 
                            class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                        <i class="fas fa-pencil w-4 h-4"></i>Modifier
                    </button>
                    <button onclick="showDeleteDialog(${resource.id})" 
                            class="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                        <i class="fas fa-trash w-4 h-4"></i>Supprimer
                    </button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';

    // Mobile cards
    html += '<div class="md:hidden divide-y divide-gray-200">';
    resources.forEach(resource => {
        html += `
            <div class="p-4 hover:bg-gray-50">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2 font-medium text-gray-900">
                        <i class="fas fa-box w-4 h-4 text-blue-600"></i>
                        ${resource.name}
                    </div>
                </div>
                <div class="text-sm text-gray-600 mb-3">Quantité: ${resource.quantity} unités</div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" ${resource.available ? 'checked' : ''} onchange="toggleAvailability(${resource.id})" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <span class="text-sm font-medium ${resource.available ? 'text-green-600' : 'text-red-600'}">
                            ${resource.available ? 'Disponible' : 'Indisponible'}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editResource(${resource.id})" class="px-4 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium">
                            <i class="fas fa-pencil mr-1"></i>Modifier
                        </button>
                        <button onclick="showDeleteDialog(${resource.id})" class="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium">
                            <i class="fas fa-trash mr-1"></i>Suppr
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div></div>';
    
    container.innerHTML = html;
}

// Modals
function openDialog(resource = null) {
    editingResource = resource;
    const title = document.getElementById('dialog-title');
    const submitBtn = document.getElementById('submit-text');
    if (title) title.textContent = resource ? 'Modifier ressource' : 'Nouvelle ressource';
    if (submitBtn) submitBtn.textContent = resource ? 'Enregistrer' : 'Ajouter';
    
    if (resource) {
        document.getElementById('resource-name').value = resource.name;
        document.getElementById('resource-quantity').value = resource.quantity;
        document.getElementById('resource-available').checked = resource.available;
    } else {
        document.getElementById('resource-name').value = '';
        document.getElementById('resource-quantity').value = '';
        document.getElementById('resource-available').checked = true;
    }
    document.getElementById('resource-dialog').classList.remove('hidden');
}

function closeDialog() {
    document.getElementById('resource-dialog').classList.add('hidden');
    editingResource = null;
}

function handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('resource-name').value;
    const quantity = parseInt(document.getElementById('resource-quantity').value);
    const available = document.getElementById('resource-available').checked;

    if (editingResource) {
        resources = resources.map(r => r.id == editingResource.id ? {...r, name, quantity, available} : r);
    } else {
        resources.push({id: Date.now(), name, quantity, available});
    }
    saveResources();
    renderResources();
    closeDialog();
}

function editResource(id) {
    const resource = resources.find(r => r.id == id);
    openDialog(resource);
}

function showDeleteDialog(id) {
    deleteId = id;
    document.getElementById('delete-dialog').classList.remove('hidden');
}

function closeDeleteDialog() {
    deleteId = null;
    document.getElementById('delete-dialog').classList.add('hidden');
}

function confirmDelete() {
    if (deleteId !== null) {
        resources = resources.filter(r => r.id != deleteId);
        saveResources();
        renderResources();
        closeDeleteDialog();
    }
}

function toggleAvailability(id) {
    resources = resources.map(r => r.id == id ? {...r, available: !r.available} : r);
    saveResources();
    renderResources();
}

// Initialisation
document.addEventListener('DOMContentLoaded',renderResources());