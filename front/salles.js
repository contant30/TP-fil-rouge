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



        //salles

        // Données mock (équivalent React useState)
        let rooms = JSON.parse(localStorage.getItem('rooms')) || [
            { id: '1', name: 'Salle A - Réunion', capacity: 8, description: 'Idéale pour les réunions d\'équipe' },
            { id: '2', name: 'Salle B - Conférence', capacity: 50, description: 'Grande salle pour conférences' },
            { id: '3', name: 'Salle C - Créativité', capacity: 12, description: 'Espace créatif avec tableaux blancs' },
            { id: '4', name: 'Salle D - Collaboration', capacity: 6, description: 'Petite salle pour travail en groupe' }
        ];

        let editingRoom = null;
        //let deleteId = null;

        // Sauvegarde localStorage
        function saveRooms() {
            localStorage.setItem('rooms', JSON.stringify(rooms));
        }

        // Rendu tableau
        function renderRooms() {
            const tbody = document.getElementById('rooms-table-body');
            const mobile = document.getElementById('rooms-mobile');
            
            tbody.innerHTML = rooms.map(room => `
                <tr class="hover:bg-gray-50 border-b last:border-b-0">
                    <td class="p-4 font-medium text-gray-900">${room.name}</td>
                    <td class="p-4 text-gray-700">${room.capacity} personnes</td>
                    <td class="p-4 text-gray-600 max-w-md">${room.description}</td>
                    <td class="p-4">
                        <div class="flex gap-2 justify-center">
                            <button onclick="editRoom('${room.id}')" 
                                    class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteRoom('${room.id}')" 
                                    class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            mobile.innerHTML = rooms.map(room => `
                <div class="p-4 border rounded-xl hover:shadow-md transition-all">
                    <h3 class="font-semibold text-gray-900 mb-1">${room.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">${room.capacity} personnes</p>
                    <p class="text-sm text-gray-500">${room.description}</p>
                    <div class="flex gap-2 mt-3">
                        <button onclick="editRoom('${room.id}')" 
                                class="flex-1 p-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                            Modifier
                        </button>
                        <button onclick="deleteRoom('${room.id}')" 
                                class="flex-1 p-2 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                            Supprimer
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Modal add/edit
        function openDialog(room = null) {
            editingRoom = room;
            document.getElementById('room-name').value = room ? room.name : '';
            document.getElementById('room-capacity').value = room ? room.capacity : '';
            document.getElementById('room-description').value = room ? room.description : '';
            document.getElementById('modal-title').textContent = room ? 'Modifier la salle' : 'Nouvelle salle';
            document.getElementById('modal-desc').textContent = room ? 'Modifiez les informations' : 'Ajoutez une salle';
            document.getElementById('room-modal').classList.remove('hidden');
        }

        function closeDialog(event) {
            if (event) event.stopPropagation();
            editingRoom = null;
            document.getElementById('room-modal').classList.add('hidden');
        }

        function handleSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('room-name').value;
            const capacity = parseInt(document.getElementById('room-capacity').value);
            const description = document.getElementById('room-description').value;

            if (editingRoom) {
                // Edit
                rooms = rooms.map(r => r.id === editingRoom.id 
                    ? { ...r, name, capacity, description } 
                    : r);
            } else {
                // Add
                const newRoom = {
                    id: Date.now().toString(),
                    name, capacity, description
                };
                rooms.push(newRoom);
            }

            saveRooms();
            renderRooms();
            closeDialog();
        }

        function editRoom(id) {
            const room = rooms.find(r => r.id === id);
            openDialog(room);
        }

        function deleteRoom(id) {
            deleteId = id;
            document.getElementById('delete-modal').classList.remove('hidden');
        }

        function closeDelete(event) {
            if (event) event.stopPropagation();
            deleteId = null;
            document.getElementById('delete-modal').classList.add('hidden');
        }

        function confirmDelete() {
            if (deleteId) {
                rooms = rooms.filter(r => r.id !== deleteId);
                saveRooms();
                renderRooms();
                closeDelete();
            }
        }

        // Init
        document.addEventListener('DOMContentLoaded', renderRooms);