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
// resa

        
        // Données mock (comme dans le composant React)
        const mockBookings = [
            {
                id: 1,
                roomName: "Salle A - Réunion",
                date: "05/02/2026",
                timeSlot: "09h00 - 10h00",
                resources: ["Écran interactif", "WiFi renforcé"]
            },
            {
                id: 2,
                roomName: "Salle B - Conférence",
                date: "06/02/2026",
                timeSlot: "14h00 - 15h00",
                resources: ["Projecteur"]
            },
            {
                id: 3,
                roomName: "Salle C - Créativité",
                date: "08/02/2026",
                timeSlot: "10h00 - 11h00",
                resources: []
            }
        ];

        let bookings = [...mockBookings];
        let deleteId = null;

        function renderBookings() {
            const container = document.getElementById('bookingsList');
            
            if (bookings.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-xl shadow-md border border-blue-100 p-12 text-center">
                        <i class="fas fa-calendar w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Aucune réservation</h3>
                        <p class="text-gray-600">Vous n'avez pas encore de réservation active</p>
                    </div>
                `;
                return;
            }

            // Version Desktop
            let html = `
                <div class="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                    <div class="hidden md:block overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-blue-50">
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Salle</th>
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Horaire</th>
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Ressources</th>
                                    <th class="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            bookings.forEach(booking => {
                html += `
                    <tr class="hover:bg-gray-50 border-t">
                        <td class="px-6 py-4 font-medium">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-map-pin text-blue-600 w-4 h-4"></i>
                                ${booking.roomName}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-calendar text-gray-500 w-4 h-4"></i>
                                ${booking.date}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-clock text-gray-500 w-4 h-4"></i>
                                ${booking.timeSlot}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            ${booking.resources.length === 0 ? 
                                '<span class="text-gray-400 text-sm">Aucune</span>' : 
                                booking.resources.map(r => `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">${r}</span>`).join('')
                            }
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="showDeleteDialog(${booking.id})" 
                                    class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium flex items-center mx-auto transition-colors">
                                <i class="fas fa-trash w-4 h-4 mr-1"></i>Supprimer
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
            `;

            // Version Mobile
            html += `
                    <!-- Mobile -->
                    <div class="md:hidden divide-y divide-gray-200">
            `;

            bookings.forEach(booking => {
                html += `
                    <div class="p-4 hover:bg-gray-50">
                        <div class="space-y-3">
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-2 font-medium text-gray-900">
                                    <i class="fas fa-map-pin text-blue-600 w-4 h-4"></i>
                                    ${booking.roomName}
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-calendar w-4 h-4"></i>
                                    ${booking.date}
                                </div>
                                <div class="flex items-center gap-2">
                                    <i class="fas fa-clock w-4 h-4"></i>
                                    ${booking.timeSlot}
                                </div>
                            </div>
                            <div>
                                ${booking.resources.length === 0 ? 
                                    '<div class="flex items-center gap-2 text-sm text-gray-600 mb-2"><i class="fas fa-box w-4 h-4"></i>Ressources</div><span class="text-gray-400 text-sm">Aucune</span>' : 
                                    `<div class="flex items-center gap-2 text-sm text-gray-600 mb-2"><i class="fas fa-box w-4 h-4"></i>Ressources</div>
                                     ${booking.resources.map(r => `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">${r}</span>`).join('')}`
                                }
                            </div>
                            <button onclick="showDeleteDialog(${booking.id})" 
                                    class="w-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                                <i class="fas fa-trash w-4 h-4"></i>Supprimer cette réservation
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;

            container.innerHTML = html;
        }

        function showDeleteDialog(id) {
            deleteId = id;
            document.getElementById('deleteDialog').classList.remove('hidden');
        }

        function closeDeleteDialog() {
            deleteId = null;
            document.getElementById('deleteDialog').classList.add('hidden');
        }

        function confirmDelete() {
            if (deleteId) {
                bookings = bookings.filter(b => b.id !== deleteId);
                deleteId = null;
                closeDeleteDialog();
                renderBookings();
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', renderBookings);