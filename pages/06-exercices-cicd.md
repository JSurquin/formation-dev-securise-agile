---

# Travaux pratiques Module 6 🎯
## Tests de sécurité automatisés dans Jenkins et GitLab CI

---

# TP 1 : Identifier les failles de configuration (10 min)

**Contexte :** Votre équipe livre une appli Node.js. Voici l'état actuel :

- Le fichier `.env.production` est présent dans le repo git
- L'environnement de staging utilise les mêmes credentials que la prod
- Le Dockerfile utilise `FROM node:22` et lance l'appli en `root`
- La CI fait uniquement `npm test`

**Consigne :** Listez tous les problèmes de sécurité et proposez une correction pour chacun.

---

# TP 1 : Solution ✅

| Problème | Risque | Correction |
|---------|--------|------------|
| `.env.production` dans git | Exposition des secrets | Ajouter au `.gitignore`, rotation des credentials, utiliser GitLab CI Variables |
| Credentials partagés staging/prod | Compromission staging = accès prod | Credentials séparés par environnement |
| Dockerfile en `root` | Escalade de privilèges si RCE | Utilisateur non-root (`adduser app`) |
| CI sans scan sécurité | Failles non détectées | Ajouter SAST + SCA + scan Docker |

---

# TP 2 : Écrire un pipeline GitLab CI sécurisé (25 min)

**Contexte :** Votre équipe Scrum utilise GitLab. Le Security Champion (vous) doit mettre en place le pipeline.

**Consigne :** Rédigez le `.gitlab-ci.yml` complet incluant :
- Scan de secrets (Gitleaks)
- SAST (Semgrep)
- SCA (npm audit)
- Build et scan Docker (Trivy)
- Déploiement conditionnel sur `main` uniquement

---

# TP 2 : Solution — Structure et secrets (1/2)

```yaml
# .gitlab-ci.yml
stages:
  - secrets
  - sast
  - sca
  - build
  - deploy

variables:
  APP_IMAGE: "myapp:latest"

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

# TP 2 : Solution — SCA, Docker, Deploy (2/2)

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
  script:
    - ./deploy.sh
  environment: production
  only:
    - main
  when: on_success
```

---

# TP 3 : Écrire un Jenkinsfile sécurisé (20 min)

**Contexte :** Une autre équipe utilise Jenkins en entreprise. Même objectif que le TP 2.

**Consigne :** Rédigez le `Jenkinsfile` équivalent avec les mêmes étapes :
- Scan de secrets
- SAST
- SCA
- Scan Docker
- Déploiement conditionnel sur la branche `main`

---

# TP 3 : Solution — Jenkinsfile (1/2)

```groovy
pipeline {
  agent any
  stages {
    stage('Scan Secrets') {
      steps {
        sh 'gitleaks detect --source . -v'
      }
    }
    stage('SAST') {
      steps {
        sh 'semgrep --config=p/owasp-top-ten .'
      }
    }
    stage('SCA') {
      steps {
        sh 'npm ci'
        sh 'npm audit --audit-level=high'
      }
    }
  }
}
```

---

# TP 3 : Solution — Jenkinsfile (2/2)

```groovy
    stage('Docker Scan') {
      steps {
        sh 'docker build -t myapp:latest .'
        sh '''trivy image \
          --exit-code 1 \
          --severity CRITICAL,HIGH \
          myapp:latest'''
      }
    }
    stage('Deploy') {
      when {
        branch 'main'
        expression {
          currentBuild.result == null ||
          currentBuild.result == 'SUCCESS'
        }
      }
      steps {
        sh './deploy.sh'
      }
    }
```

---

# TP 4 : Corriger un Dockerfile non sécurisé (10 min)

**Consigne :** Identifiez les problèmes et réécrivez ce Dockerfile :

```dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
ENV DB_PASSWORD=SuperSecret123
EXPOSE 3000
CMD ["node", "index.js"]
```

---

# TP 4 : Solution ✅

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
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "index.js"]
```

**Corrections :** Alpine (image légère), multi-stage (pas d'outils de build en prod), non-root, pas de secret en dur, healthcheck.
