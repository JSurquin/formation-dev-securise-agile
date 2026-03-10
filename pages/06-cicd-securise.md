---
layout: new-section
routeAlias: 'cicd-securise'
---

<a name="cicd-securise" id="cicd-securise"></a>

# 🚀 Module 6
## Pratiques de sécurité dans les outils agiles

### Sécurisation des environnements, CI/CD et gestion des vulnérabilités

---

# Sécurisation des environnements 🌍

**Dans un projet agile, on distingue plusieurs environnements :**

| Environnement | Usage | Risques principaux |
|---------------|-------|-------------------|
| **Dev** | Développement quotidien | Secrets exposés, dépendances non vérifiées |
| **Staging** | Tests & validation | Config proche prod, données de test sensibles |
| **Production** | Utilisateurs finaux | Exposition maximale, impact réel |

**Bonnes pratiques :**
- Configurations séparées par environnement (`.env.dev`, `.env.prod`)
- Aucun secret en dur dans le code ou dans git
- Accès à la prod restreint (least privilege)

---

# Gestion des configurations sécurisée 🔧

**Le problème des configurations non sécurisées :**
- Variables d'env commitées dans git → exposition de secrets
- Mêmes credentials en dev et prod
- Ports et services ouverts inutilement

**Solution : Configuration as Code sécurisée**

```bash
# ❌ À ne jamais faire
DATABASE_URL=postgres://admin:superpassword@prod-db:5432/myapp

# ✅ Bonne pratique : référencer un secret manager
DATABASE_URL=${VAULT_DB_URL}
```

---

# Pipeline DevSecOps 🔄

Un pipeline CI/CD sécurisé intègre des contrôles de sécurité à chaque étape :

1. **Code** → Lint sécurité + git-secrets
2. **Build** → SAST + SCA
3. **Test** → Tests de sécurité automatisés
4. **Release** → Signature des artefacts
5. **Deploy** → Scan d'images Docker + Config audit
6. **Monitor** → Logging + Alerting

---

# GitHub Actions : Pipeline sécurisé

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/owasp-top-ten
            p/javascript
```

---

# GitHub Actions : SCA et secrets

```yaml
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: npm audit
        run: npm audit --audit-level=high
      - name: Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: GitLeaks
        uses: gitleaks/gitleaks-action@v2
```

---

# Gestion des secrets en CI/CD 🔑

**Ne JAMAIS mettre de secrets dans le code ou les fichiers YAML !**

**Solutions :**
- **GitHub Secrets** : variables chiffrées
- **HashiCorp Vault** : gestion centralisée
- **AWS Secrets Manager** / **Azure Key Vault**

```yaml
# ✅ Utilisation de GitHub Secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

---

# Scan d'images Docker 🐳

```yaml
  docker-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t myapp:latest .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
```

---

# Dockerfile sécurisé 🔒

```dockerfile
# ✅ Bonnes pratiques
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine
# Utilisateur non-root
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
```

---

# Security Gates (portes de sécurité) 🚧

**Principe :** Le pipeline échoue si des vulnérabilités critiques sont détectées.

**Seuils recommandés :**

| Sévérité | Action |
|----------|--------|
| Critique | Bloquer le déploiement |
| Haute | Bloquer (sauf exception approuvée) |
| Moyenne | Avertissement, déploiement autorisé |
| Basse | Information uniquement |

---

# Signed Commits et Tags ✍️

```bash
# Configuration GPG pour les commits signés
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# Vérifier un commit signé
git log --show-signature

# GitHub : badge "Verified" sur les commits
```

**Pourquoi signer ?**
- Garantir l'identité de l'auteur
- Empêcher la modification de l'historique
- Prérequis pour certaines certifications (SOC 2)

---

# Jenkins : Pipeline sécurisé 🏗️

**Jenkins** est l'outil CI/CD le plus répandu en entreprise.

```groovy
// Jenkinsfile - Pipeline déclaratif
pipeline {
  agent any
  stages {
    stage('SAST') {
      steps {
        sh 'semgrep --config=p/owasp-top-ten .'
      }
    }
    stage('SCA') {
      steps {
        sh 'npm audit --audit-level=high'
      }
    }
  }
}
```

---

# Jenkins : Scan Docker & Security Gate

```groovy
    stage('Docker Scan') {
      steps {
        sh 'docker build -t myapp:latest .'
        sh 'trivy image --exit-code 1 \
            --severity CRITICAL,HIGH \
            myapp:latest'
      }
    }
    stage('Deploy') {
      when {
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

# GitLab CI : Pipeline sécurisé 🦊

```yaml
# .gitlab-ci.yml
stages:
  - sast
  - sca
  - build
  - dast

semgrep:
  stage: sast
  image: returntocorp/semgrep
  script:
    - semgrep --config=p/owasp-top-ten .
  allow_failure: false

dependency_check:
  stage: sca
  script:
    - npm audit --audit-level=high
  allow_failure: false
```

---

# GitLab CI : DAST & Secrets

```yaml
dast:
  stage: dast
  image: owasp/zap2docker-stable
  script:
    - zap-baseline.py
        -t $APP_URL
        -r zap-report.html
  artifacts:
    paths: [zap-report.html]

variables:
  DATABASE_URL: $DATABASE_URL
  JWT_SECRET: $JWT_SECRET
```

> **GitLab** intègre nativement SAST, DAST et Secret Detection dans ses templates CI/CD.

---

# Gestion des vulnérabilités dans le pipeline 🔍

**Dans un cadre agile, les vulnérabilités détectées en CI/CD doivent :**

1. **Être signalées** automatiquement au Security Champion
2. **Créer un ticket** dans le backlog (avec priorité CVSS)
3. **Bloquer le déploiement** si critique ou haute
4. **Être résolues** dans le sprint courant (critique) ou suivant (haute)

**Outils d'intégration backlog :**
- Jenkins → Jira (webhook)
- GitLab → GitLab Issues (natif)
- GitHub Actions → GitHub Issues

---

# En résumé : Pratiques de sécurité dans les outils agiles 📝

- **Séparer les environnements** dev / staging / prod
- **Configurations sécurisées** : jamais de secrets en dur
- Intégrer **SAST, SCA, DAST** dans le pipeline (Jenkins ou GitLab CI)
- **GitHub/GitLab Secrets** pour les données sensibles
- **Scanner les images Docker** (Trivy)
- **Security Gates** : bloquer sur les vulnérabilités critiques
- **Relier les alertes** au backlog agile
