---
layout: new-section
routeAlias: 'secure-coding'
---

<a name="secure-coding" id="secure-coding"></a>

# 💻 Module 4
## Secure Coding Practices

### Les bonnes pratiques de développement sécurisé

---

# Principe #1 : Validation des entrées 🛡️

**Règle d'or :** Ne JAMAIS faire confiance aux données utilisateur.

**Tout ce qui vient de l'extérieur est suspect :**
- Paramètres URL et query strings
- Corps des requêtes (JSON, formulaires)
- Headers HTTP
- Cookies
- Fichiers uploadés

---

# Validation : Whitelist vs Blacklist

**Blacklist (à éviter) :**
- Bloquer ce qui est "mauvais"
- Facilement contournable

**Whitelist (recommandé) :**
- Autoriser uniquement ce qui est "bon"
- Beaucoup plus sécurisé

```javascript
// ❌ Blacklist
if (!input.includes('<script>')) { /* OK */ }

// ✅ Whitelist avec Zod
const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  name: z.string().min(1).max(100).regex(/^[a-zA-ZÀ-ÿ\s-]+$/)
})
```

---

# Validation côté serveur obligatoire ⚠️

**Ne JAMAIS se fier uniquement à la validation côté client !**

```javascript
// Côté client (contournable facilement)
<input type="email" required maxlength="100">

// Côté serveur (obligatoire)
const { z } = require('zod')

const userSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(12).max(128),
})

app.post('/register', (req, res) => {
  const result = userSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.issues
    })
  }
})
```

---

# Principe #2 : Encodage des sorties 📤

**Prévenir les XSS (Cross-Site Scripting) :**

```javascript
// ❌ MAUVAIS : injection XSS possible
element.innerHTML = userInput

// ✅ BON : encodage automatique
element.textContent = userInput
```

---

# Encodage contextuel

Selon le contexte, l'encodage est différent :

| Contexte | Encodage |
|----------|----------|
| HTML Body | HTML Entity Encoding |
| HTML Attribute | Attribute Encoding |
| JavaScript | JavaScript Encoding |
| URL | URL Encoding |
| CSS | CSS Encoding |

---

# Principe #3 : Gestion des secrets 🔑

**Ne JAMAIS mettre de secrets dans le code source !**

```javascript
// ❌ MAUVAIS
const API_KEY = 'sk-1234567890abcdef'
const DB_PASSWORD = 'super_secret_123'
```

---

# Gestion des secrets : bonnes pratiques

```bash
# ✅ BON : variables d'environnement
# .env (JAMAIS commité)
API_KEY=sk-1234567890abcdef
DB_PASSWORD=super_secret_123

# .gitignore
.env
.env.local
.env.production
```

---

# Outils de détection de secrets

**Outils à intégrer dans votre workflow :**
- **git-secrets** : hook pre-commit
- **truffleHog** : scan de l'historique Git
- **detect-secrets** (Yelp) : baseline de secrets
- **GitLeaks** : scan CI/CD

```bash
# Installation de git-secrets
brew install git-secrets
git secrets --install
git secrets --register-aws
```

---

# Principe #4 : Moindre privilège 🔒

**Chaque composant ne doit avoir que les permissions strictement nécessaires.**

**Exemples :**
- L'utilisateur de la BDD ne doit pas être root
- Les tokens API doivent avoir des scopes limités
- Les conteneurs Docker ne doivent pas tourner en root
- Les fichiers de configuration doivent avoir des permissions restrictives

---

# Principe #5 : Gestion des erreurs 🚨

```javascript
// ❌ MAUVAIS : fuite d'information
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // JAMAIS en production !
    query: err.sql    // JAMAIS !
  })
})
```

---

# Gestion des erreurs sécurisée

```javascript
// ✅ BON : message générique + log interne
app.use((err, req, res, next) => {
  // Log interne détaillé
  logger.error({
    message: err.message,
    stack: err.stack,
    userId: req.user?.id,
    path: req.path,
    timestamp: new Date().toISOString()
  })
  // Réponse générique au client
  res.status(500).json({
    error: 'Une erreur interne est survenue'
  })
})
```

---

# Principe #6 : Défense en profondeur 🏰

**Ne pas se reposer sur une seule couche de sécurité :**

1. **Réseau** : Pare-feu, WAF
2. **Transport** : TLS 1.3
3. **Application** : Validation, encodage, auth
4. **Données** : Chiffrement au repos
5. **Monitoring** : Logs, alerting

> Si une couche tombe, les autres protègent encore.

---

# Principe #7 : JWT sécurisé 🔐

```javascript
// ❌ MAUVAIS : algorithme none, pas d'expiration
const token = jwt.sign({ id: user.id }, secret)

// ✅ BON : RS256, expiration, audience, issuer
const token = jwt.sign(
  {
    sub: user.id,
    role: user.role,
    aud: 'https://monapp.com',
    iss: 'https://auth.monapp.com'
  },
  privateKey,
  {
    algorithm: 'RS256',
    expiresIn: '1h'
  }
)
```

---

# JWT : vérification côté serveur

```javascript
// ✅ Vérification stricte
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],  // PAS de 'none' !
  audience: 'https://monapp.com',
  issuer: 'https://auth.monapp.com',
  clockTolerance: 30 // 30s de tolérance
})

// ✅ Refresh token pattern
// Access token : courte durée (15 min)
// Refresh token : longue durée (7 jours)
// Stocké en httpOnly cookie (pas localStorage !)
```

---

# Principe #8 : Protection contre les injections NoSQL 🛡️

```javascript
// ❌ MAUVAIS : MongoDB injection possible
app.post('/login', (req, res) => {
  const user = db.users.findOne({
    email: req.body.email,
    password: req.body.password
    // Si password = { "$gt": "" } → bypass !
  })
})
```

---

# Protection NoSQL : correction

```javascript
// ✅ BON : validation du type + sanitization
import { z } from 'zod'
import mongoSanitize from 'express-mongo-sanitize'

app.use(mongoSanitize())  // Supprime les $ et .

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128)
})

app.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const user = await db.users.findOne({ email })
  if (!user || !(await bcrypt.compare(
    password, user.passwordHash
  ))) {
    return res.status(401).json({
      error: 'Identifiants incorrects'
    })
  }
})
```

---

# En résumé : Secure Coding 📝

- **Valider** toutes les entrées côté serveur (whitelist)
- **Encoder** toutes les sorties selon le contexte
- **Gérer** les secrets via des variables d'environnement
- **Appliquer** le principe de moindre privilège
- **Ne jamais** exposer les détails d'erreur au client
- **Défense en profondeur** : plusieurs couches de sécurité
- **JWT** : RS256, expiration, audience, pas en localStorage
- **NoSQL** : sanitization + validation stricte des types
