---
layout: new-section
routeAlias: 'exercice-final'
---

<a name="exercice-final" id="exercice-final"></a>

# 🎯 Module 8
## Exercice final : Audit de sécurité d'un projet agile

### Tout mettre en pratique sur un projet réel

---

# Contexte général 📋

**Vous êtes Security Champion** d'une startup qui développe une appli de **e-commerce** en Scrum.

L'équipe est au **Sprint 8**. Le projet a été développé vite, sans processus sécurité. Le CTO veut un bilan avant la mise en prod.

**Stack :**
- Backend : Node.js + Express
- Base de données : PostgreSQL
- Frontend : React
- CI/CD : GitLab CI (actuellement : uniquement `npm test`)
- Hébergement : Docker sur AWS

---

# Partie 1 : Audit de code (20 min)

**Analysez ce code et listez TOUTES les vulnérabilités avec leur catégorie OWASP :**

```javascript
const express = require('express')
const app = express()

const JWT_SECRET = 'monsecretjwt2025'

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const user = db.query(
    `SELECT * FROM users WHERE email='${email}'`
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

| # | Vulnérabilité | Catégorie OWASP | Sévérité |
|---|--------------|-----------------|---------|
| 1 | `JWT_SECRET` codé en dur | A02 - Cryptographic Failures | Critique |
| 2 | SQL Injection via concaténation | A03 - Injection | Critique |
| 3 | Mot de passe comparé en clair | A02 - Cryptographic Failures | Critique |
| 4 | Token sans expiration | A07 - Auth Failures | Haute |
| 5 | Objet `user` entier retourné | A01 - Broken Access Control | Haute |
| 6 | Pas de rate limiting | A07 - Auth Failures | Haute |
| 7 | Pas de validation des inputs | A04 - Insecure Design | Haute |
| 8 | Pas de try/catch | — | Moyenne |

---

# Partie 2 : Remédiation (20 min)

**Consigne :** Réécrivez le endpoint `/api/login` avec toutes les corrections.

**Attendu :**
- Requête SQL paramétrée
- Vérification bcrypt du mot de passe
- JWT avec expiration
- Rate limiting
- Validation des inputs
- Gestion des erreurs

---

# Partie 2 : Solution (1/2)

```javascript
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives, réessayez plus tard' }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})
```

---

# Partie 2 : Solution (2/2)

```javascript
app.post('/api/login', loginLimiter,
  async (req, res) => {
  try {
    const { email, password } =
      loginSchema.parse(req.body)
    const user = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (!user || !(await bcrypt.compare(
      password, user.password_hash))) {
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
    res.status(500).json({ error: 'Erreur interne' })
  }
})
```

---

# Partie 3 : Audit du projet agile (20 min)

**Observations sur le projet au Sprint 8 :**

| Élément | État |
|---------|------|
| DoD de l'équipe | Aucun critère sécurité |
| Backlog | 3 CVE haute non traitées depuis 2 sprints |
| CI/CD GitLab | Uniquement `npm test` |
| Secrets | `.env.production` présent dans le repo git |
| Logs | Emails clients présents en clair |
| Mots de passe | Stockés en MD5 |

**Consigne :** Rédigez le rapport d'audit avec risques priorisés et plan de correction par sprint.

---

# Partie 3 : Rapport d'audit ✅

| Risque | Sévérité | Action | Sprint |
|--------|----------|--------|--------|
| `.env.production` dans git | 🔴 Critique | Rotation credentials + `.gitignore` | Immédiat |
| Mots de passe en MD5 | 🔴 Critique | Migration vers bcrypt | Sprint en cours |
| CVE haute non traitées ×3 | 🟠 Haute | Patch dans ce sprint | Sprint en cours |
| Emails dans les logs | 🟠 Haute | Masquer les champs perso | Sprint en cours |
| CI/CD sans sécurité | 🟠 Haute | Intégrer SAST + SCA + Trivy | Sprint +1 |
| DoD sans sécurité | 🟡 Moyenne | Mise à jour en rétrospective | Sprint +1 |

---

# Partie 4 : Pipeline GitLab CI sécurisé (15 min)

**Consigne :** Rédigez le `.gitlab-ci.yml` complet pour ce projet.

**Inclure :** scan secrets, SAST, SCA, build + scan Docker, déploiement conditionnel.

---

# Partie 4 : Solution (1/2)

```yaml
stages: [secrets, sast, sca, build, deploy]

variables:
  APP_IMAGE: "ecommerce-app:latest"

gitleaks:
  stage: secrets
  image: zricethezav/gitleaks
  script:
    - gitleaks detect --source . -v
  allow_failure: false

semgrep:
  stage: sast
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/owasp-top-ten .
  allow_failure: false
```

---

# Partie 4 : Solution (2/2)

```yaml
sca:
  stage: sca
  script:
    - npm ci
    - npm audit --audit-level=high
  allow_failure: false

trivy:
  stage: build
  script:
    - docker build -t $APP_IMAGE .
    - trivy image --exit-code 1
        --severity CRITICAL,HIGH $APP_IMAGE
  allow_failure: false

deploy:
  stage: deploy
  script: [./deploy.sh]
  environment: production
  only: [main]
  when: on_success
```

---

# Bravo ! 🎉

**Compétences validées sur les 4 blocs du programme :**

- 🔄 **Module 1** : Scrum, Kanban, agilité et projet sécurisé
- 🔐 **Module 2** : Accès, crypto, vulnérabilités et DevSecOps dans les sprints
- 🚀 **Module 6** : Environnements, configurations et GitLab CI sécurisé
- 🔍 **Module 7** : Surveillance continue, audit agile, données sensibles

> **La sécurité n'est pas un sprint en plus. C'est une dimension de chaque sprint.**
