---
layout: new-section
routeAlias: 'cicd-securise'
---

<a name="cicd-securise" id="cicd-securise"></a>

# 🚀 Module 6
## CI/CD sécurisé

### Intégrer la sécurité dans le pipeline de déploiement

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

# En résumé : CI/CD sécurisé 📝

- Intégrer **SAST, SCA, DAST** dans le pipeline
- **GitHub Secrets** pour les données sensibles
- **Scanner les images Docker** (Trivy)
- **Security Gates** : bloquer sur les vulnérabilités critiques
- **Signer** les commits et les artefacts
- **Dockerfile sécurisé** : multi-stage, non-root
