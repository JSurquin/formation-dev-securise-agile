---
layout: new-section
routeAlias: 'exercice-final'
---

<a name="exercice-final" id="exercice-final"></a>

# 🎯 Module 8
## Exercice final : Audit de sécurité agile

### Auditer un projet agile en cours, identifier les risques et proposer des corrections

---

# Exercice final : Contexte 📋

**Vous êtes Security Champion** dans une startup qui développe une application de e-commerce en mode Scrum.

L'équipe est au **Sprint 8**. Le projet a accumulé de la dette technique et de sécurité.

L'application utilise :
- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Frontend** : React
- **CI/CD** : GitLab CI
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

# Partie 3 : Audit agile du projet (20 min)

**Contexte :** Le projet n'a pas de Security Review dans ses sprints. Voici l'état actuel :

| Élément | État constaté |
|---------|--------------|
| DoD | Pas de critère sécurité |
| Backlog | 3 CVE haute non traitées depuis 2 sprints |
| CI/CD (GitLab) | Pas de scan SAST ni SCA |
| Secrets | `.env.prod` commité dans le repo |
| Logs | Mots de passe loggués en clair |
| Données clients | Non chiffrées en base |

**Consigne :** Rédigez un rapport d'audit avec les risques identifiés et vos recommandations de correction priorisées.

---

# Partie 3 : Solution ✅

**Rapport d'audit - Synthèse des risques :**

| Risque | Sévérité | Action recommandée | Sprint |
|--------|----------|--------------------|--------|
| Secrets dans git | Critique | Rotation immédiate + git-secrets | En cours |
| CVE haute non traitées | Haute | Patch dans ce sprint | En cours |
| Mots de passe en logs | Haute | Masquer les champs sensibles | En cours |
| Pas de SAST/SCA en CI | Haute | Intégrer Semgrep + npm audit | Sprint +1 |
| Données non chiffrées | Haute | Chiffrement AES-256 | Sprint +1 |
| DoD sans sécurité | Moyenne | Mettre à jour la DoD | Sprint +1 |

---

# Partie 4 : Pipeline GitLab CI sécurisé (15 min)

**Consigne :** Rédigez le fichier `.gitlab-ci.yml` pour sécuriser le pipeline de ce projet.

**Inclure :**
- Scan SAST (Semgrep)
- Scan SCA (npm audit)
- Scan Docker (Trivy)
- Security Gate

---

# Partie 4 : Solution ✅

```yaml
# .gitlab-ci.yml
stages: [sast, sca, build, deploy]

sast:
  stage: sast
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/owasp-top-ten .
  allow_failure: false

sca:
  stage: sca
  script:
    - npm audit --audit-level=high
  allow_failure: false
```

---

# Partie 4 : Solution (suite)

```yaml
docker_scan:
  stage: build
  script:
    - docker build -t myapp:latest .
    - trivy image
        --exit-code 1
        --severity CRITICAL,HIGH
        myapp:latest
  allow_failure: false

deploy:
  stage: deploy
  script:
    - ./deploy.sh
  environment: production
  only:
    - main
  when: on_success
```

---

# Bravo ! 🎉

Vous avez complété l'exercice final.

**Compétences validées :**
- Audit de code sécurité (vulnérabilités + contexte agile)
- Remédiation de vulnérabilités priorisée par sprint
- Réalisation d'un rapport d'audit agile
- Conception d'un pipeline GitLab CI sécurisé
- Protection des données sensibles
- Gestion de la dette sécurité dans le backlog
