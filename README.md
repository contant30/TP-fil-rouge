🏢 TP Fil Rouge – Gestion des Réservations de Salles

📌 Description

Ce projet est une application Fullstack permettant la gestion de réservations de salles avec authentification des utilisateurs.
Il est composé d’une API backend (Node/Express), d’un frontend Angular, ainsi que d’un livrable statique simple. Ce TP sert de fil rouge pour mettre en pratique des notions de backend, frontend, base de données et authentification JWT.

🧱 Architecture du projet
```
TP fil rouge/
├── backend/ Node/Express/Sequelize/MySQL + JWT
├── front/ Angular Frontend
├── livrable/ HTML/CSS/JS statiques
└── .env DB config
```



## 🔧 Backend API (http://localhost:3000)
| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/utilisateurs` | GET | Bearer | Liste users |
| `/api/utilisateurs/login` | POST | - | Connexion JWT |
| `/api/salles` | GET | Bearer | Toutes les salles |

**Exemple login**:
```json
POST /api/utilisateurs/register
{
  "nom_utilisateur": "test",
  "email": "test@test.fr",
  "mot_de_passe": "test123zz",
  "role": "admin"
}

POST /api/utilisateurs/login
→ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91dGlsaXNhdGV1ciI6MTgsImlhdCI6MTc3MDM5MjI4NSwiZXhwIjoxNzcwNDc4Njg1fQ.uKAUTG8dEEEW7VHfIe-bTI0cMFiqgABE9gL-r543yJY",
    "user": {
        "id_utilisateur": 18,
        "nom_utilisateur": "test",
        "email": "test@test.fr"
    }

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

```
backend/
├── models/     Utilisateur/Salle/Ressource/Reservation
├── services/   utilisateurService.js (JWT/CRUD)
├── middleware/ auth.js (Bearer verify)
├── routes/     utilisateurs.js (protected)
└── server.js   Express app
```

📄 Livrable statique

Le dossier livrable/ contient des pages HTML/CSS/JS statiques servant d’exemples ou de démonstrations.


