# Guide étudiant — TP GitLab CI : pipeline DevSecOps

**Durée estimée :** 45-60 min  
**Prérequis :** un navigateur, une connexion internet, rien à installer

---

## Objectif

Tu vas créer un projet GitLab, y déposer une petite application Node.js, puis mettre en place un pipeline CI/CD qui scanne automatiquement ton code à chaque push.

---

## Étape 1 — Créer ton compte GitLab (5 min)

1. Va sur [gitlab.com](https://gitlab.com)
2. Clique sur **Register** → crée un compte avec ton email
3. Confirme ton adresse email

> **Info :** GitLab.com offre **400 minutes de CI/CD gratuites par mois** — largement suffisant pour ce TP.

---

## Étape 2 — Créer un nouveau projet (5 min)

1. Une fois connecté, clique sur **New project**
2. Choisis **Create blank project**
3. Remplis :
   - **Project name :** `tp-devsecops`
   - **Visibility :** Public
   - ✅ **Initialize repository with a README**
4. Clique sur **Create project**

Tu as maintenant un repo GitLab vide avec un README.

---

## Étape 3 — Créer les fichiers de l'application

Dans l'interface GitLab, clique sur **+ → New file** pour chaque fichier.

### Fichier 1 : `package.json`

```json
{
  "name": "tp-devsecops",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "echo 'Tests OK' && exit 0"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

---

### Fichier 2 : `index.js`

Voici le code de départ — il contient des vulnérabilités intentionnelles que tu devras corriger :

```javascript
const express = require('express')
const app = express()
app.use(express.json())

// ⚠️ Problème : secret codé en dur
const JWT_SECRET = 'monsecret123'

app.get('/search', (req, res) => {
  const { term } = req.query
  // ⚠️ Problème : injection SQL simulée
  const query = `SELECT * FROM products WHERE name='${term}'`
  res.json({ query })
})

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000')
})
```

---

### Fichier 3 : `Dockerfile`

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
RUN addgroup -g 1001 app && \
    adduser -u 1001 -G app -s /bin/sh -D app
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["node", "index.js"]
```

---

### Fichier 4 : `.gitignore`

```
node_modules/
.env
.env.*
```

---

## Étape 4 — Ajouter le pipeline CI/CD (15 min)

Crée le fichier `.gitlab-ci.yml` à la racine du projet :

```yaml
stages:
  - secrets
  - sast
  - sca
  - build
  - deploy

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

```yaml
sca:
  stage: sca
  image: node:22-alpine
  script:
    - npm ci
    - npm audit --audit-level=high
  allow_failure: true

trivy:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - apk add --no-cache curl
    - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
  script:
    - docker build -t myapp:latest .
    - trivy image --exit-code 0
        --severity CRITICAL,HIGH myapp:latest
  allow_failure: true

deploy:
  stage: deploy
  script:
    - echo "✅ Pipeline terminé — déploiement simulé"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: on_success
```

---

## Étape 5 — Observer le premier pipeline (10 min)

Le fait de créer `.gitlab-ci.yml` déclenche automatiquement le pipeline.

1. Dans le menu de gauche, clique sur **CI/CD → Pipelines**
2. Clique sur le pipeline en cours (rond orange = en cours, rouge = échec, vert = succès)
3. Clique sur chaque job pour voir les logs

**Questions à noter :**
- Quel job échoue en premier ? Pourquoi ?
- Quel message d'erreur Semgrep affiche-t-il sur `JWT_SECRET` ?

---

## Étape 6 — Corriger les vulnérabilités (15 min)

### 6.1 Stocker le secret dans GitLab CI Variables

1. Va dans **Settings → CI/CD → Variables**
2. Clique sur **Add variable**
3. Remplis :
   - **Key :** `JWT_SECRET`
   - **Value :** `une_valeur_secrete_complexe`
   - ✅ **Masked** (la valeur n'apparaîtra jamais dans les logs)
   - ✅ **Protected** (disponible uniquement sur `main`)
4. Clique sur **Add variable**

---

### 6.2 Corriger `index.js`

Remplace le secret codé en dur par la variable d'environnement :

```javascript
const express = require('express')
const express = require('express')
const app = express()
app.use(express.json())

// ✅ Secret lu depuis l'environnement
const JWT_SECRET = process.env.JWT_SECRET

app.get('/search', (req, res) => {
  const { term } = req.query
  // ✅ Requête paramétrée (simulation)
  const query = 'SELECT * FROM products WHERE name = $1'
  res.json({ query, params: [term] })
})

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000')
})
```

Commite la modification → un nouveau pipeline se déclenche automatiquement.

---

## Étape 7 — Vérifier que le pipeline passe (5 min)

1. Va dans **CI/CD → Pipelines**
2. Le nouveau pipeline devrait être vert ✅
3. Clique sur le job `semgrep` → vérifie que Semgrep ne détecte plus le secret

**Si le pipeline est toujours rouge :** relis le message d'erreur du job concerné et corrige.

---

## Étape 8 — Explorer l'interface GitLab (5 min)

Prends 5 minutes pour explorer :

- **Issues** : crée une issue "Corriger le CORS trop permissif" avec le label `security`
- **Merge Requests** : crée une branche `fix/security-cors`, modifie un fichier, puis crée une MR
- **CI/CD → Jobs** : voir l'historique de tous les jobs passés

---

## Ce que tu as appris

- ✅ Créer un projet GitLab et un pipeline `.gitlab-ci.yml`
- ✅ Intégrer Gitleaks (scan de secrets), Semgrep (SAST), npm audit (SCA), Trivy (Docker)
- ✅ Stocker les secrets dans GitLab CI Variables (Masked + Protected)
- ✅ Corriger du code vulnérable pour faire passer le pipeline
- ✅ Voir comment le pipeline CI/CD agit comme un filet de sécurité automatique

---

## Aller plus loin (optionnel)

- Ajoute un stage `dast` avec OWASP ZAP
- Configure des notifications Slack quand le pipeline échoue
- Explore les templates GitLab natifs : **Security & Compliance → Configuration**
- Essaie de commiter intentionnellement un `.env` avec un secret → observe Gitleaks réagir
