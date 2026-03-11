# Guide professeur — Préparer le TP GitLab CI

## Ce que tu dois faire AVANT la session

---

## 1. Préparer le projet de démonstration

### Créer le repo sur GitLab.com

1. Connecte-toi sur [gitlab.com](https://gitlab.com) (ou crée un compte gratuit)
2. **New project → Create blank project**
   - Nom : `demo-devsecops`
   - Visibility : **Public** (pour que les étudiants puissent le voir)
   - ✅ Initialize repository with a README
3. Clone en local :
   ```bash
   git clone https://gitlab.com/TON_USERNAME/demo-devsecops.git
   cd demo-devsecops
   ```

---

## 2. Créer l'application Node.js volontairement vulnérable

Crée ces fichiers dans le repo :

### `package.json`

```json
{
  "name": "demo-devsecops",
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

### `index.js` (code volontairement vulnérable pour la démo)

```javascript
const express = require('express')
const app = express()
app.use(express.json())

// Vulnérabilité 1 : secret en dur
const JWT_SECRET = 'supersecret123'

// Vulnérabilité 2 : SQL injection possible
app.get('/users', (req, res) => {
  const { id } = req.query
  // Simulation : const query = `SELECT * FROM users WHERE id=${id}`
  res.json({ query: `SELECT * FROM users WHERE id=${id}` })
})

app.listen(3000, () => console.log('App running'))
```

### `Dockerfile`

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

### `.gitignore`

```
node_modules/
.env
.env.*
```

---

## 3. Créer le pipeline GitLab CI

### `.gitlab-ci.yml` (version de démo complète)

```yaml
stages:
  - secrets
  - sast
  - sca
  - build
  - deploy

variables:
  APP_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"

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

sca:
  stage: sca
  image: node:22-alpine
  script:
    - npm ci
    - npm audit --audit-level=high
  allow_failure: false
  # allow_failure: true  ← décommenter si npm audit bloque sur rien de critique

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
    - trivy image --exit-code 1 --severity CRITICAL,HIGH myapp:latest
  allow_failure: false

deploy:
  stage: deploy
  script:
    - echo "✅ Tous les scans passent — déploiement simulé"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: on_success
```

---

## 4. Premier push et vérification du pipeline

```bash
git add .
git commit -m "feat: initial vulnerable app with CI pipeline"
git push origin main
```

Aller dans **GitLab → CI/CD → Pipelines** pour voir le pipeline tourner.

**Ce que tu vas montrer en démo :**
- Semgrep détecte la variable `JWT_SECRET` en dur (SAST)
- Le pipeline s'arrête sur ce job
- Corriger le code → pousser → le pipeline repasse

---

## 5. Préparer les variables CI/CD pour la démo

Dans **Settings → CI/CD → Variables**, ajouter :

| Clé | Valeur | Masked | Protected |
|-----|--------|--------|-----------|
| `JWT_SECRET` | `une_vraie_valeur_secrete` | ✅ | ✅ |
| `DATABASE_URL` | `postgres://user:pass@db:5432/app` | ✅ | ✅ |

Montrer aux étudiants : si on fait `echo $JWT_SECRET` dans le pipeline, les logs affichent `[MASKED]`.

---

## 6. Scénario de démonstration recommandé (30 min)

1. **Montrer le code vulnérable** → expliquer les failles (5 min)
2. **Lancer le pipeline** → laisser échouer sur Semgrep (5 min)
3. **Corriger le code** → déplacer le secret en variable CI (5 min)
4. **Re-pousser** → pipeline vert de bout en bout (5 min)
5. **Montrer l'interface** → Issues GitLab, merge requests, historique des pipelines (10 min)

---

## 7. Checklist avant la session

- [ ] Repo `demo-devsecops` créé et public sur GitLab.com
- [ ] Premier pipeline qui échoue sur Semgrep (pour la démo)
- [ ] Variables CI/CD configurées (JWT_SECRET, DATABASE_URL)
- [ ] URL du repo à partager aux étudiants prête
- [ ] Vérifier que les runners GitLab.com sont disponibles (shared runners activés par défaut)

---

## Ressources utiles

- [GitLab CI/CD docs](https://docs.gitlab.com/ee/ci/)
- [Semgrep rules](https://semgrep.dev/r)
- [Trivy docs](https://aquasecurity.github.io/trivy/)
- [Gitleaks](https://github.com/zricethezav/gitleaks)
- Quota gratuit GitLab.com : **400 min CI/CD par mois** (suffisant pour la formation)
