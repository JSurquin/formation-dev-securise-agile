---
layout: new-section
routeAlias: 'cicd-securise'
---

<a name="cicd-securise" id="cicd-securise"></a>

# 🚀 Module 6
## Pratiques de sécurité dans les outils agiles

### Environnements, CI/CD sécurisé, Jenkins & GitLab CI

---

# Les environnements d'un projet agile 🌍

> **Analogie :** Dev = ta cuisine de test où tu goûtes. Staging = la cuisine du restaurant avant le service. Prod = les assiettes qui arrivent aux clients. Tu ne fais pas tes tests avec les vrais ingrédients du service !

| Environnement | Usage | Données | Accès |
|---------------|-------|---------|-------|
| **Dev** | Développement quotidien | Données fictives | Équipe dev |
| **Staging** | Tests & validation | Données anonymisées | Équipe + PO |
| **Production** | Utilisateurs réels | Données réelles | Restreint |

**Règle d'or :** jamais les mêmes credentials entre staging et prod.

---

# Gestion des configurations sécurisées 🔧

> **Analogie :** Les configurations, c'est le badge d'accès à chaque étage de l'immeuble. Il faut un badge différent par étage, pas un passe-partout pour tout le monde.

**Problèmes courants :**
- Secrets commités dans git (clé API, mot de passe DB)
- Même `.env` utilisé en dev et en prod
- Ports ouverts inutilement en production

**Solution : séparer les configurations par environnement**

```bash
.env.development  → données fictives, logs verbeux
.env.staging      → données anonymisées, logs modérés
.env.production   → secrets via Vault/AWS SSM, logs structurés
```

---

# Ne jamais commiter de secrets 🚨

```bash
# ❌ Ce qu'on voit trop souvent dans les repos
DATABASE_URL=postgres://admin:SuperSecret123@prod-db:5432/app
JWT_SECRET=myjwtsecret2025
STRIPE_KEY=sk_live_xxxxxxxxxxxxx
```

```bash
# ✅ Ce qu'il faut faire : référencer un secret manager
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
STRIPE_KEY=${STRIPE_KEY}
```

**Outils :**
- **HashiCorp Vault** : gestion centralisée des secrets
- **GitHub/GitLab Secrets** : variables chiffrées dans la CI
- **AWS Secrets Manager / Azure Key Vault** : cloud-native

---

# C'est quoi un pipeline CI/CD ? 🔄

> **Analogie :** Le pipeline CI/CD, c'est une chaîne de montage automobile. Chaque poste fait une vérification précise. Si une pièce est défectueuse, la chaîne s'arrête — on ne livre pas une voiture avec les freins qui lâchent.

**Sans pipeline sécurisé :**
- Un dev pousse du code avec une SQL injection → ça part en prod
- Une dépendance vulnérable est installée sans alerte

**Avec pipeline sécurisé :**
- Chaque push déclenche des scans automatiques
- La CI bloque si une vulnérabilité critique est détectée

---

# Les étapes d'un pipeline DevSecOps 🛡️

| Étape | Outil | Ce qu'on vérifie |
|-------|-------|-----------------|
| **Secrets** | Gitleaks | Clés API / mots de passe commités |
| **SAST** | Semgrep | Failles dans le code source |
| **SCA** | npm audit / Snyk | CVE dans les dépendances |
| **Build** | Docker | Image construite correctement |
| **Scan image** | Trivy | Vulnérabilités dans l'image Docker |
| **DAST** | OWASP ZAP | Attaques sur l'appli en cours d'exécution |
| **Deploy** | — | Seulement si tout est vert |

---

# Security Gates : bloquer les failles 🚧

> **Analogie :** Le security gate, c'est le contrôle du passeport à l'aéroport. Si le passeport est invalide, on ne passe pas — peu importe si l'avion est prêt à décoller.

**Principe :** le pipeline échoue automatiquement si une vulnérabilité dépasse le seuil.

| Sévérité | Comportement |
|----------|-------------|
| Critique | 🔴 Bloque le déploiement |
| Haute | 🟠 Bloque (sauf exception approuvée) |
| Moyenne | 🟡 Avertissement, déploiement autorisé |
| Basse | 🟢 Information uniquement |

---

# GitHub Actions : pipeline sécurisé (1/2)

```yaml
# .github/workflows/security.yml
name: Security Pipeline
on: [push, pull_request]

jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2

  sast:
    runs-on: ubuntu-latest
    needs: secrets-scan
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten
```

---

# GitHub Actions : pipeline sécurisé (2/2)

```yaml
  sca:
    runs-on: ubuntu-latest
    needs: secrets-scan
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high

  docker-scan:
    runs-on: ubuntu-latest
    needs: [sast, sca]
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:latest .
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'myapp:latest'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
```

---

# Jenkins : pipeline sécurisé (1/2) 🏗️

> **Jenkins** = le couteau suisse de la CI/CD en entreprise. Très répandu, très configurable.

```groovy
// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('Secrets Scan') {
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
        sh 'npm audit --audit-level=high'
      }
    }
  }
}
```

---

# Jenkins : pipeline sécurisé (2/2) 🏗️

```groovy
    stage('Docker Build & Scan') {
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
          currentBuild.result == null
        }
      }
      steps {
        sh './deploy.sh'
      }
    }
```

---

# GitLab CI : pipeline sécurisé (1/2) 🦊

> **GitLab CI** = CI/CD intégré à GitLab, avec des templates de sécurité natifs (SAST, DAST, Secret Detection inclus dans GitLab Ultimate).

```yaml
# .gitlab-ci.yml
stages: [secrets, sast, sca, build, deploy]

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

# GitLab CI : pipeline sécurisé (2/2) 🦊

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
    - docker build -t myapp:latest .
    - trivy image --exit-code 1
        --severity CRITICAL,HIGH myapp:latest
  allow_failure: false

deploy:
  stage: deploy
  script: [./deploy.sh]
  only: [main]
  when: on_success
```

---

# Dockerfile sécurisé 🐳

```dockerfile
# ✅ Bonnes pratiques : multi-stage + non-root
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
CMD ["node", "server.js"]
```

---

# Gestion des vulnérabilités dans le pipeline agile 🔗

**Quand le pipeline détecte une vuln, quelle est la suite ?**

1. **Alerte automatique** → notification au Security Champion
2. **Ticket créé** dans le backlog (Jira, GitLab Issues)
3. **Priorisation** selon le CVSS → sprint courant ou suivant
4. **Correction** → nouveau push → pipeline re-scanné
5. **Security gate** validé → déploiement autorisé

> **Objectif :** fermer la boucle entre détection et correction en moins d'un sprint.

---

# En résumé : Module 6 📝

- **3 environnements** (dev / staging / prod) : configurations et accès séparés
- **Jamais de secrets dans git** : utiliser Vault, GitHub Secrets ou GitLab CI Variables
- **Pipeline = chaîne de montage** : chaque étape vérifie avant de passer à la suivante
- **Security gates** : bloquer automatiquement sur les failles critiques/hautes
- **GitHub Actions, Jenkins, GitLab CI** : tous capables d'intégrer SAST + SCA + scan Docker
- **Lier le pipeline au backlog** : chaque alerte = ticket priorisé dans le sprint
