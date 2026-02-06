
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







        // Données mock// === VARIABLES GLOBALES ===
let selectedRoom = '';
let selectedSlot = null;
let selectedResources = [];
let currentWeekOffset = 0;
let weekSchedule = [];

// Données mock (salles et ressources)
const rooms = [
    { id: '1', name: 'Salle A - Réunion' },
    { id: '2', name: 'Salle B - Conférence' },
    { id: '3', name: 'Salle C - Créativité' },
    { id: '4', name: 'Salle D - Collaboration' }
];

const resourcesList = [
    { id: '1', name: 'Écran interactif', icon: 'fa-desktop' },
    { id: '2', name: 'WiFi renforcé', icon: 'fa-wifi' },
    { id: '3', name: 'Machine café', icon: 'fa-coffee' },
    { id: '4', name: 'Projecteur', icon: 'fa-projector' },
    { id: '5', name: 'Accès à la salle', icon: 'fa-door-open' },
    { id: '6', name: 'Matériel supplémentaire', icon: 'fa-box' }
];

// === FONCTIONS PRINCIPALES ===

// 1. Calculer la SEMAINE ACTUELLE (lundi à vendredi contenant aujourd'hui)
function getCurrentWeek(offset = 0) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);

    const week = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    for (let i = 0; i < 5; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        week.push({
            day: days[i],
            date: date.getDate().toString().padStart(2,'0') + '/' + (date.getMonth()+1).toString().padStart(2,'0'),
            fullDate: date.toISOString().split('T')[0]
        });
    }
    return week;
}


// 2. Générer planning avec disponibilités aléatoires
function generateWeekSchedule() {
    const baseWeek = getCurrentWeek(currentWeekOffset);
    return baseWeek.map(dayInfo => ({
        day: dayInfo.day,
        date: dayInfo.date,
        fullDate: dayInfo.fullDate,
        slots: Array.from({ length: 9 }, (_, i) => ({
            hour: 8 + i,
            isAvailable: Math.random() > 0.25,
            isMyBooking: Math.random() > 0.85,
            bookedBy: Math.random() > 0.6 ? `Utilisateur ${Math.floor(Math.random()*10)}` : null
        }))
    }));
}


// 3. Mettre à jour affichage semaine actuelle
function updateCurrentWeekDisplay() {
    const currentWeek = getCurrentWeek(currentWeekOffset);
    const startDate = currentWeek[0].date;
    const endDate = currentWeek[4].date;
    document.getElementById('current-week').textContent = 
        `Semaine du ${startDate} au ${endDate} 2026`;
}


// 4. Rendre le header (onglets)
function renderHeader() {
    document.getElementById('header-container').innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-1">
                    <i class="fas fa-calendar w-7 h-7 text-blue-600"></i>
                    Gestion des Réservations
                </h1>
                <p class="text-gray-600 text-sm">Planifiez et gérez vos espaces de travail</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <i class="fas fa-user w-5 h-5 text-blue-600"></i>
                    <span class="text-gray-700 font-medium">Marie Martin</span>
                </div>
                <button onclick="handleLogout()" class="p-2.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-all" title="Déconnexion">
                    <i class="fas fa-sign-out-alt w-5 h-5"></i>
                </button>
            </div>
        </div>
        <!-- Onglets -->
        <nav class="flex gap-2 pt-4 overflow-x-auto pb-2">
            <button data-tab="reservations" class="tab-btn flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-lg bg-blue-50 border-blue-600 text-blue-600 font-semibold whitespace-nowrap">
                <i class="fas fa-calendar-day w-4 h-4"></i> <span>Réservations</span>
            </button>
            <button data-tab="mes-reservations" class="tab-btn flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-lg text-gray-600 hover:text-blue-600 hover:border-gray-300 whitespace-nowrap transition-colors">
                <i class="fas fa-book w-4 h-4"></i> <span>Mes réservations</span>
            </button>
            <button data-tab="salles" class="tab-btn flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-lg text-gray-600 hover:text-blue-600 hover:border-gray-300 whitespace-nowrap transition-colors">
                <i class="fas fa-door-open w-4 h-4"></i> <span>Salles</span>
            </button>
            <button data-tab="ressources" class="tab-btn flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-lg text-gray-600 hover:text-blue-600 hover:border-gray-300 whitespace-nowrap transition-colors">
                <i class="fas fa-box w-4 h-4"></i> <span>Ressources</span>
            </button>
            <button data-tab="utilisateurs" class="tab-btn flex items-center gap-2 px-4 py-3 border-b-2 rounded-t-lg text-gray-600 hover:text-blue-600 hover:border-gray-300 whitespace-nowrap transition-colors">
                <i class="fas fa-users w-4 h-4"></i> <span>Utilisateurs</span>
            </button>
        </nav>
    `;
}

// 5. Rendre calendrier (comme avant, mais avec dates réelles)
function renderCalendar() {
    const container = document.getElementById('calendar-container');
    if (!selectedRoom) {
        document.getElementById('no-room-selected').style.display = 'block';
        return;
    }
    document.getElementById('no-room-selected').style.display = 'none';

    let html = '<div class="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden mb-6">';
    
    // Desktop table
    html += `
        <div class="hidden lg:block overflow-x-auto">
            <table class="w-full min-w-[800px]">
                <thead><tr class="bg-blue-50 border-b border-blue-200">
                    <th class="p-4 text-left sticky left-0 bg-blue-50 z-10 font-semibold">
                        <i class="fas fa-clock w-5 h-5 text-blue-600 mr-1"></i>Horaire
                    </th>
    `;
    weekSchedule.forEach(day => {
        html += `
            <th class="p-4 text-center min-w-[140px]">
                <div class="font-semibold text-gray-900">${day.day}</div>
                <div class="text-sm text-gray-600">${day.date}</div>
            </th>
        `;
    });
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < 9; i++) {
        html += `<tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="p-4 sticky left-0 bg-white font-semibold text-gray-700 z-10">
                ${(8+i).toString().padStart(2,'0')}h00 - ${(9+i).toString().padStart(2,'0')}h00
            </td>`;
        weekSchedule.forEach(day => {
            const slot = day.slots[i];
            const btnClass = slot.isMyBooking ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700 shadow-md' :
                        slot.isAvailable ? 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400' :
                        'bg-red-50 border-red-300 cursor-not-allowed';
            html += `
                <td class="p-2">
                    <button onclick="handleSlotClick('${day.fullDate}', ${slot.hour}, ${JSON.stringify(slot)})" 
                            ${!slot.isAvailable ? 'disabled' : ''} 
                            class="w-full h-16 rounded-lg border-2 ${btnClass}" 
                            title="${day.day} ${day.date} - ${slot.isMyBooking ? 'Ma résa' : slot.isAvailable ? 'Disponible' : 'Réservé'}">
                        ${slot.isMyBooking ? '<span class="text-xs font-bold">Ma résa</span>' : ''}
                        ${!slot.isAvailable && !slot.isMyBooking ? '<span class="text-xs text-red-600">Occupé</span>' : ''}
                    </button>
                </td>
            `;
        });
        html += '</tr>';
    }
    html += '</tbody></table></div>';
    
    // Mobile cards (similaire, abrégé pour espace)
    html += '<div class="lg:hidden p-4 space-y-6">'; // ... code mobile similaire
    html += '</div>'; // fin mobile
    
    html += '</div>';
    container.innerHTML = html;
}

// === FONCTIONS EXPOSÉES (pour onclick HTML) ===
function setSelectedRoom(roomId) {
    selectedRoom = roomId;
    renderCalendar();
}

function prevWeek() {
    currentWeekOffset--;
    weekSchedule = generateWeekSchedule();
    updateCurrentWeekDisplay();
    if (selectedRoom) renderCalendar();
}

function nextWeek() {
    currentWeekOffset++;
    weekSchedule = generateWeekSchedule();
    updateCurrentWeekDisplay();
    if (selectedRoom) renderCalendar();
}

function handleSlotClick(fullDate, hour, slot) {
    if (slot.isAvailable) {
        selectedSlot = { fullDate, hour, ...slot };
        document.getElementById('booking-modal').classList.remove('hidden');
        renderBookingDetails();
        renderResources();
    }
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    selectedSlot = null;
    selectedResources = [];
}

function confirmBooking() {
    console.log('✅ Réservation confirmée:', {
        room: selectedRoom,
        slot: selectedSlot,
        resources: selectedResources
    });
    alert('🎉 Réservation confirmée pour ' + rooms.find(r => r.id === selectedRoom)?.name);
    closeBookingModal();
    renderCalendar(); // Refresh visuel
}

function handleLogout() {
    console.log('🚪 Déconnexion');
    alert('Déconnexion réussie');
}

// === FONCTIONS MODAL ===
function renderBookingDetails() {
    document.getElementById('booking-details').innerHTML = `
        <div class="bg-blue-50 rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-2 text-gray-700">
                <i class="fas fa-map-pin w-4 h-4 text-blue-600"></i>
                <span class="font-semibold">${rooms.find(r => r.id === selectedRoom)?.name}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
                <i class="fas fa-calendar w-4 h-4 text-blue-600"></i>
                <span>${selectedSlot.fullDate.split('T')[0].split('-').reverse().join('/')}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
                <i class="fas fa-clock w-4 h-4 text-blue-600"></i>
                <span>${selectedSlot.hour.toString().padStart(2,'0')}h00 - ${(selectedSlot.hour+1).toString().padStart(2,'0')}h00</span>
            </div>
        </div>
    `;
    document.getElementById('booking-details').classList.remove('hidden');
}

function renderResources() {
    let html = '';
    resourcesList.forEach(res => {
        const checked = selectedResources.includes(res.id) ? 'checked' : '';
        html += `
            <label class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input type="checkbox" ${checked} onchange="toggleResource('${res.id}')" class="rounded text-blue-600 focus:ring-blue-500">
                <i class="fas ${res.icon} w-4 h-4 text-blue-600"></i>
                <span class="flex-1">${res.name}</span>
            </label>
        `;
    });
    document.getElementById('resources-list').innerHTML = html;
}

function toggleResource(resId) {
    const index = selectedResources.indexOf(resId);
    if (index > -1) selectedResources.splice(index, 1);
    else selectedResources.push(resId);
}

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', () => {
    weekSchedule = generateWeekSchedule();
    updateCurrentWeekDisplay();
    renderHeader();
    
    // Onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('bg-blue-50', 'border-blue-600', 'text-blue-600', 'font-semibold');
            });
            btn.classList.add('bg-blue-50', 'border-blue-600', 'text-blue-600', 'font-semibold');
        });
    });
    
    // Modal backdrop
    document.getElementById('booking-modal').onclick = (e) => {
        if (e.target === e.currentTarget) closeBookingModal();
    };
    
    console.log('📅 Planning chargé pour la semaine actuelle:', getCurrentWeek());
});


  
    
    