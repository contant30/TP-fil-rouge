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
        

        // Données mock
        let users = [
            {id: 1, name: 'Marie Martin', email: 'marie.martin@example.com', role: 'admin'},
            {id: 2, name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'user'},
            {id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@example.com', role: 'user'},
            {id: 4, name: 'Pierre Leroy', email: 'pierre.leroy@example.com', role: 'user'}
        ];

        let editingUser = null;

        function renderUsers() {
            const container = document.getElementById('users-list');
            
            if (users.length === 0) {
                container.innerHTML = `
                    <div class="bg-white rounded-xl shadow-md border border-blue-100 p-12 text-center">
                        <i class="fas fa-users w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                        <h3 class="text-2xl font-semibold text-gray-900 mb-2">Aucun utilisateur</h3>
                        <p class="text-gray-600">Ajoutez votre premier utilisateur</p>
                        <button onclick="openDialog()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors">
                            <i class="fas fa-plus"></i>Nouvel utilisateur
                        </button>
                    </div>
                `;
                return;
            }

            // Desktop
            let html = `
                <div class="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
                    <div class="hidden md:block overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-blue-50">
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Nom</th>
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
                                    <th class="px-6 py-4 text-left font-semibold text-gray-900">Rôle</th>
                                    <th class="px-6 py-4 text-right font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            users.forEach(user => {
                const initial = user.name.charAt(0).toUpperCase();
                const badgeClass = user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
                const badgeText = user.role === 'admin' ? 'Administrateur' : 'Utilisateur';
                
                html += `
                    <tr class="hover:bg-gray-50 border-t">
                        <td class="px-6 py-4 font-medium">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                                    ${initial}
                                </div>
                                <div>${user.name}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2 text-gray-600">
                                <i class="fas fa-envelope w-4 h-4"></i>
                                ${user.email}
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                                <i class="fas fa-shield-alt w-3 h-3 mr-1"></i>
                                ${badgeText}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button onclick="editUser(${JSON.stringify(user)})" 
                                        class="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                    <i class="fas fa-pencil w-4 h-4"></i>Modifier
                                </button>
                                <button onclick="showDeleteDialog(${user.id})" 
                                        class="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                                    <i class="fas fa-trash w-4 h-4"></i>Supprimer
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
            `;

            // Mobile
            html += `
                    <div class="md:hidden divide-y divide-gray-200">
            `;

            users.forEach(user => {
                const initial = user.name.charAt(0).toUpperCase();
                const badgeClass = user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700';
                const badgeText = user.role === 'admin' ? 'Administrateur' : 'Utilisateur';
                
                html += `
                    <div class="p-4 hover:bg-gray-50">
                        <div class="space-y-3">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                                    ${initial}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-gray-900">${user.name}</div>
                                    <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <i class="fas fa-envelope w-3 h-3"></i>
                                        <span class="truncate">${user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="pt-2">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}">
                                    <i class="fas fa-shield-alt w-3 h-3 mr-1"></i>
                                    ${badgeText}
                                </span>
                            </div>
                            <div class="flex gap-2 pt-2">
                                <button onclick="editUser(${JSON.stringify(user)})" 
                                        class="flex-1 border border-blue-200 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                    <i class="fas fa-pencil w-4 h-4"></i>Modifier
                                </button>
                                <button onclick="showDeleteDialog(${user.id})" 
                                        class="flex-1 border border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                    <i class="fas fa-trash w-4 h-4"></i>Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
            container.innerHTML = html;
        }

        function openDialog(user = null) {
            editingUser = user;
            document.getElementById('dialog-title').textContent = user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur';
            document.getElementById('submit-text').textContent = user ? 'Enregistrer' : 'Créer';
            
            document.getElementById('password-field').style.display = user ? 'none' : 'block';
            
            if (user) {
                document.getElementById('user-name').value = user.name;
                document.getElementById('user-email').value = user.email;
                document.getElementById('user-role').value = user.role;
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

        function handleSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const password = document.getElementById('user-password').value;
            const role = document.getElementById('user-role').value;

            if (editingUser) {
                // Modifier
                users = users.map(u => 
                    u.id === editingUser.id 
                        ? {...u, name, email, role}
                        : u
                );
            } else {
                // Ajouter (password simulé)
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    role
                };
                users.push(newUser);
            }
            
            closeDialog();
            renderUsers();
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

        function confirmDelete() {
            if (deleteId) {
                users = users.filter(u => u.id !== deleteId);
                closeDeleteDialog();
                renderUsers();
            }
        }

        // Initialisation
        document.addEventListener('DOMContentLoaded', renderUsers);