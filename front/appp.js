// --------------------------
// Header & Footer
// --------------------------
fetch('/front/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header-container').innerHTML = html;

        fetch('/front/footer.html')
            .then(res => res.text())
            .then(footerHtml => {
                const footerContainer = document.createElement('div');
                footerContainer.id = 'footer-container';
                footerContainer.innerHTML = footerHtml;
                document.body.appendChild(footerContainer);
            });

        initApp(); // Initialiser l'app après chargement du header
    });

function navigateTo(tab) {
    console.log('➡️ Navigation:', tab);

    const pages = {
        'reservations': '/reservation.html',
        'resa': '/resa.html',
        'salles': '/salles.html',
        'ressources': '/ressources.html',
        'utilisateurs': '/utilisateurs.html'
    };

    if (pages[tab]) {
        window.location.href = pages[tab];
        return;
    }

    document.querySelectorAll('[id$="-page"]').forEach(page => page.classList.add('hidden'));
    const targetPage = document.getElementById(tab + '-page');
    if (targetPage) targetPage.classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('border-blue-600', 'text-blue-600', 'bg-blue-50', 'font-bold'));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add('border-blue-600', 'text-blue-600', 'bg-blue-50', 'font-bold');

    if (tab === 'reservations') renderCalendar();
}

// --------------------------
// Données & Calendar
// --------------------------
let selectedRoom = '';
let selectedSlot = null;
let selectedResources = [];
let weekSchedule = generateWeekSchedule();
let activeTab = 'reservations';
let currentWeekOffset = 0;

function generateWeekSchedule() {
    const rooms = [
        {id: '1', name: 'Salle A - Réunion'},
        {id: '2', name: 'Salle B - Conférence'},
        {id: '3', name: 'Salle C - Créativité'},
        {id: '4', name: 'Salle D - Collaboration'}
    ];

    const resources = [
        {id: '1', name: 'Écran interactif', icon: 'fas fa-tv'},
        {id: '2', name: 'WiFi renforcé', icon: 'fas fa-wifi'},
        {id: '3', name: 'Machine café', icon: 'fas fa-coffee'},
        {id: '4', name: 'Projecteur', icon: 'fas fa-projector'},
        {id: '5', name: 'Accès à la salle', icon: 'fas fa-door-open'},
        {id: '6', name: 'Matériel supplémentaire', icon: 'fas fa-box'}
    ];

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const dates = ['05/02', '06/02', '07/02', '08/02', '09/02'];

    return days.map((day, index) => ({
        day,
        date: dates[index],
        slots: Array.from({length: 9}, (_, i) => ({
            hour: 8 + i,
            isAvailable: Math.random() > 0.3,
            isMyBooking: Math.random() > 0.9,
            bookedBy: Math.random() > 0.7 ? 'Jean Dupont' : undefined
        }))
    }));
}

function renderCalendar() {
    const container = document.getElementById('calendar-container');
    if (!selectedRoom) {
        document.getElementById('no-room-selected').style.display = 'block';
        return;
    }
    document.getElementById('no-room-selected').style.display = 'none';

    let html = `<div class="hidden lg:block overflow-x-auto"><table class="w-full min-w-[800px]"><thead><tr class="bg-blue-50 border-b border-blue-200"><th class="p-4 text-left sticky left-0 bg-blue-50 z-10"><i class="fas fa-clock w-5 h-5 text-blue-600"></i></th>`;
    weekSchedule.forEach(daySchedule => {
        html += `<th class="p-4 text-center min-w-[120px]"><div class="font-medium text-gray-900">${daySchedule.day}</div><div class="text-sm text-gray-600">${daySchedule.date}</div></th>`;
    });
    html += `</tr></thead><tbody>`;

    for (let i = 0; i < 9; i++) {
        html += `<tr class="border-b border-gray-200 hover:bg-gray-50"><td class="p-4 sticky left-0 bg-white font-medium text-gray-700 z-10">${8+i}h00 - ${9+i}h00</td>`;
        weekSchedule.forEach(daySchedule => {
            const slot = daySchedule.slots[i];
            const className = slot.isMyBooking ? 'bg-blue-600 border-blue-700 text-white hover:bg-blue-700' :
                             slot.isAvailable ? 'bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400 hover:shadow-md' :
                             'bg-red-50 border-red-300 cursor-not-allowed';
            html += `<td class="p-2">
                        <button onclick="handleSlotClick('${daySchedule.day}', '${daySchedule.date}', ${slot.hour}, ${JSON.stringify(slot)})"
                                ${!slot.isAvailable ? 'disabled' : ''} 
                                class="w-full h-16 rounded-lg border-2 transition-all ${className}" 
                                aria-label="${daySchedule.day} ${daySchedule.date} ${slot.hour}h00">
                            ${slot.isMyBooking ? '<span class="text-xs font-medium">Ma résa</span>' : (!slot.isAvailable ? '<span class="text-xs text-red-600">Occupé</span>' : '')}
                        </button>
                    </td>`;
        });
        html += `</tr>`;
    }
    html += `</tbody></table></div>`;

    // Mobile
    html += `<div class="lg:hidden p-4 space-y-6">`;
    weekSchedule.forEach(daySchedule => {
        html += `<div><h3 class="font-medium text-gray-900 mb-3 flex items-center gap-2"><i class="fas fa-calendar w-4 h-4 text-blue-600"></i>${daySchedule.day} ${daySchedule.date}</h3><div class="grid grid-cols-2 sm:grid-cols-3 gap-2">`;
        daySchedule.slots.forEach(slot => {
            const className = slot.isMyBooking ? 'bg-blue-600 border-blue-700 text-white' :
                             slot.isAvailable ? 'bg-green-50 border-green-300 hover:bg-green-100' :
                             'bg-red-50 border-red-300 cursor-not-allowed';
            html += `<button onclick="handleSlotClick('${daySchedule.day}', '${daySchedule.date}', ${slot.hour}, ${JSON.stringify(slot)})" 
                             ${!slot.isAvailable ? 'disabled' : ''} 
                             class="p-3 rounded-lg border-2 transition-all text-sm ${className}">
                        <div class="font-medium">${slot.hour}h - ${slot.hour+1}h</div>
                     </button>`;
        });
        html += `</div></div>`;
    });
    html += `</div>`;

    container.innerHTML = html;
}

function handleSlotClick(day, date, hour, slot) {
    if (slot.isAvailable) {
        selectedSlot = { day, date, hour };
        showBookingModal();
    }
}

function showBookingModal() {
    document.getElementById('booking-modal').classList.remove('hidden');
    renderBookingDetails();
    renderResources(); // Liste des ressources pour la réservation
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    selectedSlot = null;
    selectedResources = [];
}

// --------------------------
// Réservations
// --------------------------
const mockBookings = [
    {id: 1, roomName: "Salle A - Réunion", date: "05/02/2026", timeSlot: "09h00 - 10h00", resources: ["Écran interactif","WiFi renforcé"]},
    {id: 2, roomName: "Salle B - Conférence", date: "06/02/2026", timeSlot: "14h00 - 15h00", resources: ["Projecteur"]},
    {id: 3, roomName: "Salle C - Créativité", date: "08/02/2026", timeSlot: "10h00 - 11h00", resources: []}
];
let bookings = [...mockBookings];

// --------------------------
// Ressources
// --------------------------
let resources = [
    {id: 1, name: 'Écran interactif', quantity: 5, available: true},
    {id: 2, name: 'WiFi renforcé', quantity: 10, available: true},
    {id: 3, name: 'Machine café', quantity: 3, available: true},
    {id: 4, name: 'Projecteur', quantity: 8, available: true},
    {id: 5, name: 'Tableau blanc', quantity: 12, available: false}
];
let editingResource = null;

// --------------------------
// Salles
// --------------------------
let rooms = JSON.parse(localStorage.getItem('rooms')) || [
    { id: '1', name: 'Salle A - Réunion', capacity: 8, description: 'Idéale pour les réunions d\'équipe' },
    { id: '2', name: 'Salle B - Conférence', capacity: 50, description: 'Grande salle pour conférences' },
    { id: '3', name: 'Salle C - Créativité', capacity: 12, description: 'Espace créatif avec tableaux blancs' },
    { id: '4', name: 'Salle D - Collaboration', capacity: 6, description: 'Petite salle pour travail en groupe' }
];
let editingRoom = null;

// --------------------------
// Utilisateurs
// --------------------------
let users = [
    {id: 1, name: 'Marie Martin', email: 'marie.martin@example.com', role: 'admin'},
    {id: 2, name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'user'},
    {id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@example.com', role: 'user'},
    {id: 4, name: 'Pierre Leroy', email: 'pierre.leroy@example.com', role: 'user'}
];
let editingUser = null;

// --------------------------
// Suppression universelle
// --------------------------
let deleteItem = { type: null, id: null };

function showDeleteDialog(type, id) {
    deleteItem = { type, id };
    document.getElementById('delete-dialog').classList.remove('hidden');
}

function closeDeleteDialog() {
    deleteItem = { type: null, id: null };
    document.getElementById('delete-dialog').classList.add('hidden');
}

function confirmDelete() {
    if (!deleteItem.type || deleteItem.id == null) return;

    switch(deleteItem.type) {
        case 'booking': bookings = bookings.filter(b => b.id !== deleteItem.id); renderBookings(); break;
        case 'resource': resources = resources.filter(r => r.id !== deleteItem.id); saveResources(); renderResources(); break;
        case 'room': rooms = rooms.filter(r => r.id !== deleteItem.id); saveRooms(); renderRooms(); break;
        case 'user': users = users.filter(u => u.id !== deleteItem.id); renderUsers(); break;
        default: console.warn('Type inconnu:', deleteItem.type);
    }

    closeDeleteDialog();
}

// --------------------------
// Initialisation
// --------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    renderBookings();
    renderResources();
    renderRooms();
    renderUsers();
});
