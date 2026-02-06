# 🚀 TP Fil Rouge - Gestion Réservations Salles

## 🏗️ Architecture Fullstack


TP fil rouge/
├── backend/ Node/Express/Sequelize/MySQL + JWT
├── front/ Angular Frontend
├── livrable/ HTML/CSS/JS statiques
└── .env DB config



## 🔧 Backend API (http://localhost:3000)
| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/utilisateurs` | GET | Bearer | Liste users |
| `/api/utilisateurs/login` | POST | - | Connexion JWT |
| `/api/salles` | GET | Bearer | Toutes les salles |

**Exemple login**:
```json
POST /api/utilisateurs/login
{
  "email": "tzzzest@fizlrzouge.fr",
  "mot_de_passe": "mdp"
}
→ { "token": "eyJ...", "user": { "id_utilisateur": 16 } }

```
🚀 Setup Local

# Backend
cd backend
npm install
npm run dev


# Frontend (Angular)
cd ../front
ng serve

🗄️ Base MySQL
CREATE DATABASE tp_fil_rouge;
# Models auto-sync

📁 Structure Backend
backend/
├── models/     Utilisateur/Salle/Ressource/Reservation
├── services/   utilisateurService.js (JWT/CRUD)
├── middleware/ auth.js (Bearer verify)
├── routes/     utilisateurs.js (protected)
└── server.js   Express app


