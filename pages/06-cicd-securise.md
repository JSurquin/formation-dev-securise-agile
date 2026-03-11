---
layout: new-section
routeAlias: 'cicd-securise'
---

<a name="cicd-securise" id="cicd-securise"></a>

# 🚀 Module 6
## Pratiques de sécurité dans les outils agiles

### Environnements, configurations sécurisées et GitLab CI (compte gratuit)

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
.env.production   → secrets via GitLab CI Variables, logs structurés
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
# ✅ Ce qu'il faut faire : variables GitLab CI
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
STRIPE_KEY=${STRIPE_KEY}
```

**Où stocker les secrets sur GitLab :**
Settings → CI/CD → Variables → **Masked + Protected**

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

# Pourquoi GitLab CI ? 🦊

> **GitLab.com** = compte gratuit + **400 minutes CI/CD gratuites par mois** → parfait pour apprendre et pratiquer sans infrastructure à gérer.

**Avantages pour un projet agile :**
- CI/CD intégrée nativement (pas de serveur séparé à installer)
- Issues + Merge Requests + Pipeline dans la même interface
- Templates de sécurité natifs (SAST, Secret Detection)
- Variables CI chiffrées et masquées en 2 clics

**Pour démarrer :** créer un compte sur [gitlab.com](https://gitlab.com), créer un projet, pousser du code → la CI se déclenche automatiquement.

---

# Les étapes d'un pipeline DevSecOps GitLab 🛡️

| Étape | Outil | Ce qu'on vérifie |
|-------|-------|-----------------|
| **Secrets** | Gitleaks | Clés API / mots de passe commités |
| **SAST** | Semgrep | Failles dans le code source |
| **SCA** | npm audit | CVE dans les dépendances |
| **Build** | Docker | Image construite correctement |
| **Scan image** | Trivy | Vulnérabilités dans l'image Docker |
| **Deploy** | — | Seulement si tout est vert |

---

# Security Gates : bloquer les failles 🚧

> **Analogie :** Le security gate, c'est le contrôle du passeport à l'aéroport. Si le passeport est invalide, on ne passe pas — peu importe si l'avion est prêt à décoller.

**Dans GitLab CI :** `allow_failure: false` = le pipeline échoue si l'étape échoue.

| Sévérité | Comportement |
|----------|-------------|
| Critique | 🔴 Bloque le déploiement |
| Haute | 🟠 Bloque (sauf exception approuvée) |
| Moyenne | 🟡 Avertissement, déploiement autorisé |
| Basse | 🟢 Information uniquement |

---

# Structure d'un `.gitlab-ci.yml` 📄

```yaml
# .gitlab-ci.yml — structure de base
stages:
  - secrets   # 1. Détecter les secrets commités
  - sast      # 2. Analyser le code source
  - sca       # 3. Analyser les dépendances
  - build     # 4. Builder et scanner l'image Docker
  - deploy    # 5. Déployer si tout est vert

variables:
  APP_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
```

> Chaque `stage` s'exécute dans l'ordre. Si un job échoue avec `allow_failure: false`, les stages suivants ne s'exécutent pas.

---

# GitLab CI : scan de secrets et SAST (1/3)

```yaml
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

# GitLab CI : SCA et scan Docker (2/3)

```yaml
sca:
  stage: sca
  image: node:22-alpine
  script:
    - npm ci
    - npm audit --audit-level=high
  allow_failure: false

trivy:
  stage: build
  image: docker:latest
  services: [docker:dind]
  script:
    - docker build -t $APP_IMAGE .
    - trivy image --exit-code 1
        --severity CRITICAL,HIGH $APP_IMAGE
  allow_failure: false
```

---

# GitLab CI : déploiement conditionnel (3/3)

```yaml
deploy:
  stage: deploy
  script:
    - echo "Déploiement en production"
    - ./deploy.sh
  environment:
    name: production
    url: https://monapp.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: on_success
```

> `rules: when: on_success` = le déploiement ne se lance que si **toutes** les étapes précédentes ont réussi → c'est le security gate final.

---

# Variables CI/CD GitLab : stocker les secrets 🔑

**Dans GitLab : Settings → CI/CD → Variables**

| Option | Effet |
|--------|-------|
| **Masked** | La valeur n'apparaît jamais dans les logs |
| **Protected** | Disponible uniquement sur les branches protégées (main) |
| **File** | La variable est injectée comme fichier (ex : certificat) |

```yaml
# Utilisation dans le pipeline
deploy:
  script:
    - echo "$DEPLOY_KEY" > /tmp/key.pem
    - ssh -i /tmp/key.pem user@server "./deploy.sh"
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

**Quand GitLab CI détecte une vuln, quelle est la suite ?**

1. **Pipeline échoue** → notification automatique au Security Champion
2. **Issue créée** dans GitLab Issues (avec label `security`)
3. **Priorisation** selon le CVSS → sprint courant ou suivant
4. **Correction** → nouveau commit → pipeline re-déclenché
5. **Security gate** passe → merge request approuvée → déploiement

> **Avantage GitLab :** issues, pipeline et merge requests sont dans la même interface → visibilité immédiate pour toute l'équipe.

---

# En résumé : Module 6 📝

- **3 environnements** (dev / staging / prod) : configurations et accès séparés
- **Jamais de secrets dans git** : utiliser les GitLab CI Variables (Masked + Protected)
- **Pipeline = chaîne de montage** : chaque stage vérifie avant de passer au suivant
- **GitLab CI** : gratuit, intégré, 400 min/mois, tout dans une interface
- **`allow_failure: false`** + `when: on_success` = security gates automatiques
- **Lier le pipeline aux Issues GitLab** : chaque alerte = ticket priorisé dans le sprint
