---

# Exercices Module 4 : Secure Coding 🎯

---

# Exercice 1 : Code Review sécurité (15 min)

**Consigne :** Identifiez toutes les vulnérabilités dans ce code et proposez des corrections.

```javascript
const express = require('express')
const app = express()

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = db.query(
    `SELECT * FROM users
     WHERE username='${username}'
     AND password='${password}'`
  )
  if (user) {
    res.json({ token: user.id, role: user.role })
  } else {
    res.status(401).json({
      error: `User ${username} not found in database`
    })
  }
})
```

---

# Exercice 1 : Solution ✅

**Vulnérabilités trouvées :**
1. Injection SQL (concaténation)
2. Mot de passe comparé en clair
3. Token = user.id (prédictible)
4. Fuite d'information dans l'erreur

---

# Exercice 1 : Code corrigé

```javascript
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )
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
})
```

---

# Exercice 2 : Schéma de validation Zod (10 min)

**Consigne :** Créez un schéma Zod pour valider un formulaire d'inscription avec :
- Email valide
- Mot de passe (12 car. min, 1 majuscule, 1 chiffre, 1 spécial)
- Nom (2-50 caractères, lettres et espaces uniquement)
- Âge (18-120)

---

# Exercice 2 : Solution ✅

```javascript
const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(12, '12 caractères minimum')
    .regex(/[A-Z]/, '1 majuscule requise')
    .regex(/[0-9]/, '1 chiffre requis')
    .regex(/[!@#$%^&*]/, '1 caractère spécial'),
  name: z.string()
    .min(2).max(50)
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/,
           'Lettres et espaces uniquement'),
  age: z.number().int().min(18).max(120)
})
```
