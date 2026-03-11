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

# Pourquoi sécuriser la CI/CD ? L'attaque SolarWinds 🌐

> **2020 :** SolarWinds, éditeur de logiciels réseau, voit sa pipeline de build compromise. Les attaquants insèrent une backdoor directement dans le processus de compilation.

**Résultat :**
- 18 000 clients téléchargent la mise à jour compromise
- Agences gouvernementales US infiltrées pendant **9 mois**
- Coût estimé : plusieurs milliards de dollars

**Ce que cela nous apprend :**
- La CI/CD est une cible d'attaque à part entière
- Un secret volé dans une pipeline peut compromettre toute la prod
- Les artefacts de build doivent être signés et vérifiés

> **La CI/CD sécurisée n'est pas optionnelle — c'est l'épine dorsale du DevSecOps.**

---

# Les secrets : comment ils fuient 🔓

**Les 5 façons les plus courantes de perdre un secret :**

1. **Hardcodé dans le code** → poussé sur GitLab public
2. **Dans un fichier `.env` non ignoré** → `.gitignore` oublié
3. **Dans les logs de CI** → `echo $API_KEY` dans un script
4. **Dans les variables d'environnement non masquées** → visibles dans les logs
5. **Dans un commentaire de code** → `# ancien token: sk-abc123`

**Statistique :** GitGuardian détecte en moyenne **10 secrets exposés par développeur par an** dans les dépôts publics.

> **Règle d'or :** si un secret a été exposé même 1 seconde, il est compromis. Révoquer immédiatement.

---

# Gitleaks : scan de secrets en pre-commit 🔑

**Gitleaks** scanne le dépôt git à la recherche de secrets (clés API, tokens, mots de passe).

```bash
# Exemple de sortie Gitleaks dans le pipeline
Finding:     AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
Secret:      AKIAIOSFODNN7EXAMPLE
RuleID:      aws-access-key-id
Entropy:     3.22
File:        config/aws.js
Line:        12
Commit:      a1b2c3d
```

**Dans GitLab CI :** Gitleaks dans le stage `secrets-scan` bloque le pipeline si un secret est détecté — avant même le SAST ou le build.

---

# Variables GitLab CI : quel type utiliser ? 🔐

**GitLab offre 3 niveaux de protection pour les variables :**

| Type | Visible dans logs | Accessible depuis | Usage |
|------|------------------|------------------|-------|
| **Variable simple** | ✅ Oui | Toutes les branches | Variables non sensibles |
| **Masked** | ❌ Non (masqué) | Toutes les branches | Tokens de lecture |
| **Masked + Protected** | ❌ Non | Branches protégées seulement | Credentials de production |

**Où les configurer :**
> Settings → CI/CD → Variables → Add variable

**Bonne pratique :** `DB_PASSWORD`, `AWS_SECRET_KEY`, `DEPLOY_TOKEN` → toujours **Masked + Protected**.

---

# Lire un rapport SAST GitLab 📊

**Après un job Semgrep, GitLab affiche les résultats dans l'onglet "Security" :**

```
Security scanning results
─────────────────────────────────────
● Critical : 0
● High     : 2  ← bloque le pipeline (allow_failure: false)
● Medium   : 5  ← signalé mais non bloquant
● Low      : 12 ← informatif

High findings :
1. sql-injection in src/routes/users.js:47
   db.query(`SELECT * FROM users WHERE id=${req.params.id}`)
   
2. hardcoded-secret in src/config/db.js:12
   const DB_PASS = "admin1234"
```

**Workflow recommandé :**
- High/Critical → corriger avant merge
- Medium → ticket dans le backlog sprint suivant
- Low → revue mensuelle

---

# L'ordre des stages : le principe "fail fast" 📋

**Pourquoi l'ordre des stages est critique :**

```yaml
stages:
  - secrets      # 1. En premier : inutile de scanner du code avec des secrets
  - sast         # 2. Analyse statique du code source
  - test         # 3. Tests unitaires + intégration
  - build        # 4. Construction de l'image Docker
  - scan-image   # 5. Scan de vulnérabilités de l'image
  - staging      # 6. Déploiement en staging seulement si tout est vert
  - dast         # 7. Tests dynamiques sur staging
  - production   # 8. Déploiement en prod (branche main protégée)
```

> **Fail fast :** les vérifications les plus rapides et critiques passent en premier. On évite de builder une image Docker si le code contient un mot de passe hardcodé.

---

# Trivy : scan d'image Docker 🐳

**Trivy** scanne une image Docker et détecte CVE dans les packages, fichiers de config mal sécurisés, et secrets dans les layers.

```bash
$ trivy image node:18-alpine

node:18-alpine (alpine 3.18.4)
Total: 3 (HIGH: 1, MEDIUM: 2)

┌────────────────┬──────────────────┬──────────┬──────────────────────────────┐
│    Library     │  Vulnerability   │ Severity │         Title                │
├────────────────┼──────────────────┼──────────┼──────────────────────────────┤
│ libssl3        │ CVE-2023-5363    │ HIGH     │ OpenSSL: incorrect cipher key│
│ busybox        │ CVE-2023-42363   │ MEDIUM   │ busybox: use-after-free      │
└────────────────┴──────────────────┴──────────┴──────────────────────────────┘
```

---

# Security Gates : exemples concrets 🚦

**Security Gate = condition qui bloque le déploiement.**

```yaml
# Gate 1 : Secrets détectés → arrêt immédiat
secrets-scan:
  script: gitleaks detect
  allow_failure: false   # BLOQUANT

# Gate 2 : CVE critique dans les dépendances
sca-audit:
  script: npm audit --audit-level=critical
  allow_failure: false

# Gate 3 : SAST avec findings HIGH
sast-semgrep:
  script: semgrep --error --severity ERROR
  allow_failure: false

# Gate 4 : Deploy prod = branche main uniquement
deploy-production:
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

---

# Dockerfile : les anti-patterns à éviter 🚫

**Anti-pattern 1 : Image trop grosse**
```dockerfile
# ❌ Ubuntu complet = 100+ MB, surface d'attaque immense
FROM ubuntu:latest
RUN apt-get install nodejs npm

# ✅ Alpine = 5 MB, minimaliste
FROM node:18-alpine
```

**Anti-pattern 2 : Tourner en root**
```dockerfile
# ❌ Par défaut, le conteneur tourne en root
RUN npm install
CMD ["node", "app.js"]

# ✅ Utilisateur non-root
RUN addgroup -S app && adduser -S app -G app
USER app
CMD ["node", "app.js"]
```

---

# Multi-stage build en pratique 🏗️

```dockerfile
# Stage 1 : build (contient les outils de dev)
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2 : production (image finale légère, sans les outils)
FROM node:18-alpine AS production
WORKDIR /app
# On copie SEULEMENT le résultat du build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/index.js"]
```

> **Résultat :** image finale sans npm, sans compilateurs, sans code source → surface d'attaque réduite de 80%.

---

# Intégrer les alertes pipeline dans GitLab Issues 🎫

**Automatiser la création de tickets quand le pipeline échoue :**

```yaml
notify-on-failure:
  stage: notify
  script: |
    curl --request POST \
      --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
      --data "title=🔴 Pipeline failed on $CI_COMMIT_BRANCH" \
      --data "description=Stage $CI_JOB_NAME failed. See $CI_PIPELINE_URL" \
      --data "labels=security,ci-cd,urgent" \
      "$CI_API_V4_URL/projects/$CI_PROJECT_ID/issues"
  when: on_failure
```

> **Résultat :** chaque échec de pipeline crée automatiquement un ticket GitLab → intégré dans le backlog du sprint suivant.

---

# En résumé : Module 6 📝

- **SolarWinds (2020)** : pipeline compromise → 18 000 clients touchés → CI/CD = cible d'attaque
- **Secrets** : Masked + Protected dans GitLab CI Variables, jamais dans le code
- **Gitleaks** : scan pre-commit, bloque en 5 secondes si secret détecté
- **Ordre des stages** : secrets → SAST → test → build → scan image → staging → DAST → prod
- **Trivy** : scanne les images Docker (CVE + secrets dans les layers)
- **Security Gates** : `allow_failure: false` = bloquant, `on_failure` = alertes issues GitLab
- **Dockerfile** : Alpine + multi-stage + USER non-root = surface d'attaque minimale
- **3 environnements** séparés : configs séparées, pas de partage de secrets
