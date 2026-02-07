# 🏢 TP Fil Rouge – Gestion des Réservations de Salles

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Angular](https://img.shields.io/badge/Angular-16-red)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![License](https://img.shields.io/badge/License-Education-lightgrey)

## 📌 Présentation

**TP Fil Rouge** est un projet **fullstack** réalisé dans un cadre pédagogique.  
Il permet de gérer la **réservation de salles**, les **utilisateurs**, ainsi que les **ressources**, avec un système d’authentification sécurisé via **JWT**.

Le projet est découpé en trois parties :
- une **API backend** en Node.js / Express
- un **frontend Angular**
- un **livrable statique** en HTML / CSS / JavaScript

---

🧱 Architecture du projet
```
TP fil rouge/
├── backend/ Node/Express/Sequelize/MySQL + JWT
├── front/ Angular Frontend
├── livrable/ HTML/CSS/JS statiques
└── .env DB config
```



## 🔧 Backend API (http://localhost:3000)

### 🛠 Technologies
- Node.js
- Express
- Sequelize
- MySQL
- JSON Web Token (JWT)

  
### 🔐 Authentification
L’API est protégée par un middleware **Bearer Token**.  
Une connexion utilisateur est nécessaire pour accéder aux routes sécurisées.

| Endpoint                | Méthode | Auth   | Description               |
| ----------------------- | ------- | ------ | ------------------------- |
| /api/utilisateurs       | GET     | Bearer | Liste tous les users [✅]  |
| /api/utilisateurs/:id   | GET     | Bearer | Détail user [✅]           |
| /api/utilisateurs       | POST    | -      | Register nouveau user [✅] |
| /api/utilisateurs/login | POST    | -      | Connexion → JWT token [✅] |
| /api/utilisateurs/:id   | PUT     | Bearer | Modifier user [✅]         |
| /api/utilisateurs/:id   | DELETE  | Bearer | Supprimer user [✅]        |
| /api/utilisateurs/debug | GET     | -      | Debug routes [✅]          |
| /api/salles             | GET     | Bearer | Toutes les salles [🔄]    |
| /api/salles/:id         | GET     | Bearer | Détail salle [🔄]         |
| /api/salles             | POST    | Bearer | Créer salle [🔄]          |
| /api/salles/:id         | PUT     | Bearer | Modifier salle [🔄]       |
| /api/salles/:id         | DELETE  | Bearer | Supprimer salle [🔄]      |
| /api/ressources         | GET     | Bearer | Toutes ressources [🔄]    |
| /api/reservations       | GET     | Bearer | Toutes réservations [🔄]  |
| /api/reservations       | POST    | Bearer | Créer réservation [🔄]    |

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
# 🚀 Installation & Lancement

# Backend

```
cd backend
npm install
npm run dev
```
➡ API disponible sur http://localhost:3000


# Frontend (Angular)

cd front
npm install
ng serve

🗃 Base de données
Base de données MySQL requise.
```
CREATE DATABASE tp_fil_rouge;
# Models auto-sync
```
Configurer le fichier .env :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=tp_fil_rouge
JWT_SECRET=secret
```
Les modèles Sequelize se synchronisent automatiquement au lancement du backend.

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


