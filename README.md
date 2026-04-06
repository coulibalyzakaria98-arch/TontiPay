# TontiPay 🚀

Plateforme moderne de gestion de tontines en ligne, sécurisée et automatisée.

## 🌟 Fonctionnalités

- **Authentification Sécurisée** : Inscription, Connexion (JWT).
- **Gestion des Tontines** : Créer ou rejoindre une tontine via un code unique.
- **Paiement Manuel** : Soumission de paiement avec référence de transaction.
- **Validation Admin** : Tableau de bord pour valider ou rejeter les paiements.
- **Notifications** : Alertes pour validation, rejet, et rappels de cotisation.
- **Statistiques** : Vue d'ensemble pour les administrateurs.
- **Rappels Automatiques** : Système de cron job pour les échéances.

## 🛠️ Stack Technique

- **Frontend** : React.js, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend** : Node.js, Express.js, MongoDB (Mongoose), JSON Web Token, Node-Cron.

## 📂 Structure du Projet

```text
TontiPay/
├── backend/      # API Node.js (Express & MongoDB)
└── frontend/     # Application React (Vite & Tailwind)
```

## 🚀 Déploiement

### Backend (Render)
1. Créez un **Web Service**.
2. Connectez votre repo GitHub.
3. Définissez le **Root Directory** à `backend`.
4. Commandes :
   - Build : `npm install`
   - Start : `npm start`
5. Variables d'env : `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`.

### Frontend (Vercel)
1. Créez un **New Project**.
2. Connectez votre repo GitHub.
3. Définissez le **Root Directory** à `frontend`.
4. Vercel détectera automatiquement **Vite**.
5. Variable d'env : `VITE_API_URL` (Lien de votre API Render).

---

Développé pour moderniser et sécuriser l'épargne collective. 💰
