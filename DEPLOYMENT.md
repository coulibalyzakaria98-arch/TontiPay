# TontiPay Déploiement

Ce guide explique comment déployer la plateforme TontiPay.

## Structure du projet

- `backend/` : API Node.js (Express, MongoDB)
- `frontend-new/` : Application React Vite

> Attention : le dossier frontend utilisé en production est `frontend-new`, pas `frontend`.

---

## Backend - Render

### 1. Créer le service

- Sur Render, créez un nouveau service de type **Web Service**.
- Connectez votre dépôt GitHub.
- Définissez le **Root Directory** sur `backend`.

### 2. Paramètres de build

- Build Command : `npm install`
- Start Command : `npm start`

### 3. Variables d'environnement

Ajoutez au moins :

- `MONGO_URI` : chaîne de connexion MongoDB
- `JWT_SECRET` : secret pour signer les JWT
- `JWT_EXPIRE` : durée d'expiration du token (ex: `7d`)
- `NODE_ENV` : `production`
- Optionnel : `PORT` si nécessaire

### 4. Notes backend

- Le backend démarre depuis `backend/src/index.js`.
- Il utilise `dotenv` pour charger les variables.
- Les fichiers PDF sont générés dans `/uploads/receipts`.

---

## Frontend - Vercel

### 1. Créer le projet

- Sur Vercel, créez un nouveau projet.
- Connectez votre dépôt GitHub.
- Définissez le **Root Directory** sur `frontend-new`.

### 2. Configuration Vercel

Vercel détecte automatiquement Vite. Si nécessaire :

- Framework Preset : `Vite`
- Build Command : `npm run build`
- Output Directory : `dist`

### 3. Variables d'environnement

- `VITE_API_URL` : URL du backend déployé (ex: `https://tontipay-backend.onrender.com/api`)

### 4. Fichier de configuration

Le dossier `frontend-new` contient déjà `vercel.json` :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Cela permet de router correctement les pages React.

---

## Vérifications après déploiement

1. Le frontend charge correctement l'application React.
2. Les appels API pointent vers `VITE_API_URL`.
3. Les paiements peuvent être soumis via `/api/payments`.
4. Les reçus PDF sont générés et téléchargés depuis `/api/payments/:id/receipt`.

---

## Remarques

- Si vous utilisez MongoDB Atlas, assurez-vous d'autoriser l'adresse IP de Render.
- Pour un environnement de production, utilisez des secrets robustes et limitez l'accès par rôle.
- Si vous souhaitez déployer le frontend sur un autre service, gardez la même cible `frontend-new`.
