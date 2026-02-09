---
layout: new-section
routeAlias: 'exercice-final'
---

<a name="exercice-final" id="exercice-final"></a>

# 🎯 Module 8
## Exercice final : Audit & Remédiation

### Mettre en pratique tout ce qu'on a appris

---

# Exercice final : Contexte 📋

**Vous êtes Security Champion** dans une startup qui développe une application de e-commerce.

L'application utilise :
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Frontend** : React
- **CI/CD** : GitHub Actions
- **Hébergement** : Docker sur AWS

---

# Partie 1 : Audit de code (20 min)

**Analysez ce code et listez TOUTES les vulnérabilités :**

```javascript
const express = require('express')
const app = express()

const JWT_SECRET = 'monsecretjwt2025'

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = db.query(
    `SELECT * FROM users
     WHERE email='${email}'`
  )
  if (user && user.password === password) {
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET
    )
    res.json({ token, user })
  }
})
```

---

# Partie 1 : Solution ✅

**Vulnérabilités trouvées :**

1. **Secret codé en dur** (A02) : JWT_SECRET dans le code
2. **SQL Injection** (A03) : concaténation dans la query
3. **Mot de passe en clair** (A02) : comparaison directe
4. **Pas de validation d'entrée** (A04) : email/password non validés
5. **Token sans expiration** (A07) : pas d'option `expiresIn`
6. **Fuite de données** (A01) : on retourne l'objet user complet
7. **Pas de rate limiting** (A07) : brute force possible
8. **Pas de gestion d'erreur** : pas de try/catch

---

# Partie 2 : Remédiation (20 min)

**Consigne :** Réécrivez le code corrigé avec toutes les bonnes pratiques.

---

# Partie 2 : Solution ✅

```javascript
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives' }
})
```

---

# Partie 2 : Solution (suite)

```javascript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

app.post('/api/login', loginLimiter,
  async (req, res) => {
  try {
    const { email, password } =
      loginSchema.parse(req.body)
    const user = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
```

---

# Partie 2 : Solution (fin)

```javascript
    if (!user || !(await bcrypt.compare(
      password, user.password_hash
    ))) {
      return res.status(401).json({
        error: 'Identifiants incorrects'
      })
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    res.json({ token })
  } catch (err) {
    logger.error('Login error', { err })
    res.status(500).json({
      error: 'Erreur interne'
    })
  }
})
```

---

# Partie 3 : Pipeline CI/CD (15 min)

**Consigne :** Concevez un pipeline DevSecOps complet pour cette application.

**Dessinez ou listez :**
- Les étapes du pipeline
- Les outils à chaque étape
- Les security gates

---

# Partie 3 : Solution ✅

**Pipeline DevSecOps :**

1. **Pre-commit** : git-secrets + lint
2. **PR** : Semgrep (SAST) + npm audit (SCA)
3. **Build** : Docker build + Trivy scan
4. **Test** : Tests unitaires + tests de sécurité
5. **Staging** : OWASP ZAP (DAST)
6. **Security Gate** : bloquer si critique/haute
7. **Production** : deploy si tout vert
8. **Post-deploy** : monitoring + alerting

**Gates :**
- Critique → BLOQUE
- Haute → BLOQUE (sauf exception)
- Moyenne → WARNING
- Basse → INFO

---

# Bravo ! 🎉

Vous avez complété l'exercice final.

**Compétences validées :**
- Audit de code sécurité
- Remédiation de vulnérabilités
- Conception de pipeline DevSecOps
- Application des principes OWASP
- Gestion des secrets et de l'authentification
