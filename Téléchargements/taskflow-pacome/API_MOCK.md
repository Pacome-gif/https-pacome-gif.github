# API Mock avec json-server

## 📋 Démarrer l'API mock

```bash
npm run mock-api
# Serveur disponible sur http://localhost:3001
```

## 📚 Endpoints disponibles

### Users (Utilisateurs)
```bash
GET    /users           # Récupérer tous les utilisateurs
GET    /users/:id       # Récupérer un utilisateur par ID
POST   /users           # Créer un nouvel utilisateur
PUT    /users/:id       # Mettre à jour un utilisateur
DELETE /users/:id       # Supprimer un utilisateur
```

### Tasks (Tâches)
```bash
GET    /tasks           # Récupérer toutes les tâches
GET    /tasks/:id       # Récupérer une tâche par ID
POST   /tasks           # Créer une nouvelle tâche
PUT    /tasks/:id       # Mettre à jour une tâche
DELETE /tasks/:id       # Supprimer une tâche
```

### Posts (Articles)
```bash
GET    /posts           # Récupérer tous les posts
GET    /posts/:id       # Récupérer un post par ID
POST   /posts           # Créer un nouveau post
PUT    /posts/:id       # Mettre à jour un post
DELETE /posts/:id       # Supprimer un post
```

## 🔍 Filtrage et Recherche

```bash
# Filtrer par propriété
GET /tasks?completed=true
GET /users?id=1

# Recherche textuelle
GET /posts?title_like=Premier

# Pagination
GET /tasks?_page=1&_limit=10

# Tri
GET /tasks?_sort=title&_order=asc
```

## 📝 Exemples de requêtes

### Créer une tâche
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle tâche",
    "completed": false,
    "userId": 1
  }'
```

### Mettre à jour une tâche
```bash
curl -X PUT http://localhost:3001/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tâche mise à jour",
    "completed": true,
    "userId": 1
  }'
```

### Supprimer une tâche
```bash
curl -X DELETE http://localhost:3001/tasks/1
```

## 🔄 Utilisation avec fetch en React/Next.js

```javascript
// Récupérer les tâches
fetch('http://localhost:3001/tasks')
  .then(res => res.json())
  .then(data => console.log(data))

// Créer une tâche
fetch('http://localhost:3001/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Nouvelle tâche',
    completed: false,
    userId: 1
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
```

## 💾 Données initiales (db.json)

Le fichier `db.json` contient:
- **users**: Utilisateurs de l'application
- **tasks**: Tâches à faire
- **posts**: Articles/posts

Vous pouvez modifier `db.json` directement pour ajouter des données de test.

---

**Note**: Le serveur json-server redémarrera automatiquement quand vous modifiez `db.json`.
