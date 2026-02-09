---

# Exercices Module 3 : OWASP Top 10 🎯

---

# Exercice 1 : Identifier les vulnérabilités (15 min)

**Consigne :** Pour chaque extrait de code, identifiez la vulnérabilité OWASP et proposez une correction.

**Code 1 :**

```javascript
app.get('/api/documents/:id', (req, res) => {
  const doc = db.query(
    `SELECT * FROM documents WHERE id = ${req.params.id}`
  )
  res.json(doc)
})
```

---

# Exercice 1 : Solution Code 1 ✅

**Vulnérabilités identifiées :**
1. **A03 - Injection SQL** : concaténation directe du paramètre
2. **A01 - Broken Access Control** : pas de vérification d'ownership

```javascript
// Correction
app.get('/api/documents/:id', auth, (req, res) => {
  const doc = db.query(
    'SELECT * FROM documents WHERE id = ? AND owner_id = ?',
    [req.params.id, req.user.id]
  )
  if (!doc) return res.status(404).json({
    error: 'Document non trouvé'
  })
  res.json(doc)
})
```

---

# Exercice 1 : Code 2

```javascript
app.post('/api/register', (req, res) => {
  const { email, password } = req.body
  const hashedPassword = md5(password)
  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  )
  res.json({ success: true })
})
```

---

# Exercice 1 : Solution Code 2 ✅

**Vulnérabilité :** A02 - Cryptographic Failures (MD5 est cassé)

```javascript
import bcrypt from 'bcrypt'

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  // Validation du mot de passe
  if (password.length < 12) {
    return res.status(400).json({
      error: 'Mot de passe trop court (12 min)'
    })
  }
  const hashedPassword = await bcrypt.hash(password, 12)
  db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  )
  res.json({ success: true })
})
```

---

# Exercice 2 : Headers de sécurité (10 min)

**Consigne :** Configurez les headers de sécurité pour une application Express.js.

**Objectif :** Écrire un middleware qui ajoute tous les headers de sécurité nécessaires.

---

# Exercice 2 : Solution ✅

```javascript
// Middleware de sécurité
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'"
  )
  res.setHeader(
    'X-Content-Type-Options', 'nosniff'
  )
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  res.setHeader(
    'Referrer-Policy',
    'strict-origin-when-cross-origin'
  )
  next()
})
// Ou utiliser le package 'helmet' !
```
