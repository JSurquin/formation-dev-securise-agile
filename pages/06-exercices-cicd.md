---

# Exercices Module 6 : Pratiques de sécurité dans les outils agiles 🎯

---

# Exercice 1 : Créer un pipeline DevSecOps (20 min)

**Consigne :** Écrivez un workflow GitHub Actions complet qui inclut :
1. Lint + détection de secrets
2. SAST avec Semgrep
3. SCA avec npm audit
4. Build Docker avec scan Trivy
5. Déploiement uniquement si tout est OK

---

# Exercice 1 : Solution ✅

```yaml
name: DevSecOps Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
```

---

# Exercice 1 : Solution (suite)

```yaml
  sast:
    runs-on: ubuntu-latest
    needs: secrets-scan
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with:
          config: p/owasp-top-ten

  sca:
    runs-on: ubuntu-latest
    needs: secrets-scan
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high
```

---

# Exercice 1 : Solution (fin)

```yaml
  docker-build:
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

  deploy:
    runs-on: ubuntu-latest
    needs: docker-build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy
        run: echo "Deploy to production"
```

---

# Exercice 2 : Sécuriser un Dockerfile (10 min)

**Consigne :** Corrigez ce Dockerfile non sécurisé :

```dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
ENV DB_PASSWORD=secret123
EXPOSE 3000
CMD ["node", "index.js"]
```

---

# Exercice 2 : Solution ✅

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

**Corrections :** Alpine, multi-stage, non-root, pas de secret en dur, healthcheck

---

# Exercice 3 : GitLab CI pour un projet agile (20 min)

**Contexte :** Votre équipe Scrum utilise GitLab. Votre CI actuel ne fait que lancer les tests unitaires. Le Security Champion (vous) doit mettre en place un pipeline sécurisé.

**Consigne :** Rédigez un `.gitlab-ci.yml` incluant :
1. Scan de secrets (Gitleaks)
2. SAST (Semgrep)
3. SCA (npm audit)
4. Build et scan Docker (Trivy)
5. Déploiement conditionnel sur la branche `main`

---

# Exercice 3 : Solution ✅

```yaml
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

# Exercice 3 : Solution (suite)

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
    - trivy image
        --exit-code 1
        --severity CRITICAL,HIGH
        myapp:latest
  allow_failure: false

deploy:
  stage: deploy
  script: [./deploy.sh]
  only: [main]
  when: on_success
```
