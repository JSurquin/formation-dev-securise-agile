# 🧑‍🏫 Tuto Formateur — Pipeline DevSecOps complet
## Deux chemins indépendants : A (gitlab.com + Runner) et B (tout self-hosted)

> **Statut : testé et validé le 13 mars 2026**  
> Testé sur macOS avec OrbStack (6 GiB RAM), architecture arm64.

---

## COMPRENDRE LES DEUX CHEMINS AVANT DE FAIRE

```
CHEMIN A : gitlab.com + Runner local      CHEMIN B : tout self-hosted (Docker)
─────────────────────────────────         ──────────────────────────────────────────
Repo sur gitlab.com                       Repo sur GitLab self-hosted (local)
    │                                         │
    ▼                                         ▼
Runner (Docker local) se connecte         GitLab envoie un webhook à Jenkins
vers gitlab.com pour chercher les jobs        │
    │                                         ▼
    ▼                                     Jenkins lit le Jenkinsfile dans le repo
Runner exécute .gitlab-ci.yml             Jenkins exécute les stages
    │                                         │
    ▼                                         ▼
Résultats dans gitlab.com                 Résultats dans Jenkins (localhost:9090)
```

**Règle d'or : Runner GitLab et Jenkins font le même travail.**  
On installe l'un OU l'autre, jamais les deux pour le même projet.

| | Chemin A | Chemin B |
|--|----------|----------|
| **GitLab** | gitlab.com (cloud) | Self-hosted (conteneur Docker) |
| **Outil CI** | GitLab Runner (Docker local) | Jenkins (Docker local) |
| **Fichier pipeline** | `.gitlab-ci.yml` | `Jenkinsfile` (à la racine du repo) |
| **RAM Docker nécessaire** | ~200 MB (Runner seul) | ~3.8 GiB (GitLab + Jenkins) |
| **Webhook** | Pas nécessaire (Runner sort vers gitlab.com) | `http://jenkins:8080/...` interne Docker |

---

## PRÉREQUIS COMMUNS

| Requis | Détail |
|--------|--------|
| Docker Desktop ou OrbStack | Version récente |
| Compte gitlab.com | Gratuit, pour le Chemin A |
| RAM allouée à Docker | **200 MB pour A — 6 GiB pour B** |

**Augmenter la RAM (nécessaire uniquement pour le Chemin B) :**

Docker Desktop :
```
Docker Desktop → Settings → Resources → Memory → 6144 MB → Apply & Restart
```

OrbStack :
```bash
# ~/.orbstack/vmconfig.json
{ "cpu": 4, "memory_mib": 6144 }
orb stop && orb start
```

---
---
---
# ═══════════════════════════════════════════════════════
# CHEMIN A — gitlab.com + GitLab Runner local (Docker)
# ═══════════════════════════════════════════════════════
---
---

## A.1 — Créer le projet sur gitlab.com

```
→ https://gitlab.com → New Project → Create blank project
→ Nom : php-devsecops-demo
→ Visibility : Private
→ ✅ Initialize with a README
→ Create project
```

---

## A.2 — Créer un Runner sur gitlab.com

```
gitlab.com → Projet → Settings → CI/CD → Runners
→ New project runner
→ Tag : docker
→ Create runner → Copier le token (glrt-xxxx)
```

---

## A.3 — Créer le docker-compose.yml et lancer le Runner

```bash
mkdir devsecops-lab-A && cd devsecops-lab-A
```

```yaml
# docker-compose.yml — CHEMIN A (gitlab.com + Runner local)
services:
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: unless-stopped
    volumes:
      - runner-config:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock

  renovate:
    image: renovate/renovate:latest
    environment:
      - RENOVATE_PLATFORM=gitlab
      - RENOVATE_ENDPOINT=https://gitlab.com/api/v4
      - RENOVATE_TOKEN=${RENOVATE_GITLAB_TOKEN}
      - RENOVATE_AUTODISCOVER=true
    profiles:
      - renovate

volumes:
  runner-config:
```

```bash
docker compose up -d

# Enregistrer le Runner vers gitlab.com
docker exec gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com" \
  --token "glrt-VOTRE_TOKEN" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --description "runner-local"
```

**Résultat attendu :**
```
Verifying runner... is valid
Runner registered successfully.
```

Vérifier dans gitlab.com → Projet → Settings → CI/CD → Runners → point vert ✅

---

## A.4 — Créer les fichiers du projet

**`public/index.php`** — avec faille XSS volontaire :
```php
<?php
// ❌ FAILLE XSS — donnée utilisateur affichée sans échappement
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . $name . "!</h1>";
?>
```

**`.gitlab-ci.yml`** (à la racine du repo) :
```yaml
stages:
  - secrets
  - sast
  - sca

secrets-scan:
  stage: secrets
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: [""]    # ⚠️ obligatoire — image sans shell
  script:
    - gitleaks detect --source . -v
  allow_failure: false

sast-bearer:
  stage: sast
  image:
    name: bearer/bearer:latest
    entrypoint: [""]    # ⚠️ obligatoire — image sans shell
  script:
    - bearer scan /builds/$CI_PROJECT_PATH
  allow_failure: false

sca-composer:
  stage: sca
  image: composer:2.7
  script:
    - composer install --no-interaction -q
    - composer audit
  allow_failure: false
```

---

## A.5 — Pousser le code et observer le pipeline

```bash
git clone https://gitlab.com/votre-user/php-devsecops-demo.git
cd php-devsecops-demo
# Créer public/index.php et .gitlab-ci.yml (contenus ci-dessus)
git add .
git commit -m "feat: add php page with XSS"
git push
```

**Résultat attendu dans gitlab.com → CI/CD → Pipelines :**
```
Pipeline → failed
  ✅ secrets-scan → success   (pas de secret)
  ❌ sast-bearer  → failed    (HIGH CWE-79 XSS détecté, exit code 1)
```

---

## A.6 — Déclencher Gitleaks (démo secret hardcodé)

Ajouter dans `public/index.php` :
```php
$stripe_key = "sk_live_51NxKjUIJV4QBqzxvXXXXXXXXXXXXXXXXXX";
```

```bash
git add . && git commit -m "bad: hardcoded stripe key" && git push
```

**Résultat attendu :**
```
Pipeline → failed
  ❌ secrets-scan → failed    (clé Stripe détectée)
  ⏭️ sast-bearer  → skipped
```

> **⚠️ Point pédagogique :** supprimer la clé et repusher ne suffit pas.  
> Gitleaks scanne **tout l'historique git**. Pour un pipeline vert → recréer le projet.

---

## A.7 — Pipeline au vert (code corrigé, projet recréé)

```php
<?php
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
?>
```

```bash
git add . && git commit -m "fix: escape XSS with htmlspecialchars" && git push
```

**Résultat attendu :**
```
Pipeline → success ✅
  ✅ secrets-scan → success
  ✅ sast-bearer  → success
  ✅ sca-composer → success
```

---

## A.8 — Lancer Renovate (optionnel)

Créer un PAT gitlab.com avec scopes `api + read_repository + write_repository` :
```
gitlab.com → User Settings → Access Tokens → New token → scopes : api, read_repo, write_repo
```

```bash
RENOVATE_GITLAB_TOKEN=glpat-XXXX docker compose --profile renovate run --rm renovate
# → Renovate crée des MR automatiques pour les dépendances obsolètes sur gitlab.com
```

---
---
---
# ═══════════════════════════════════════════════════════
# CHEMIN B — Tout self-hosted (GitLab + Jenkins dans Docker)
# ═══════════════════════════════════════════════════════
---
---

## B.1 — Créer le dossier et le docker-compose.yml

```bash
mkdir devsecops-lab-B && cd devsecops-lab-B
```

Avant de créer le `docker-compose.yml`, créer un `Dockerfile` pour Jenkins avec Docker CLI :

```bash
# Dans devsecops-lab-B/, créer ce fichier :
```

```dockerfile
# Dockerfile.jenkins
FROM jenkins/jenkins:lts-jdk17
USER root
# Installer le client Docker CLI dans le conteneur Jenkins
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
      https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*
```

> **Pourquoi ce Dockerfile ?** Jenkins tourne dans un conteneur qui n'a pas `docker` installé.  
> On monte le socket `/var/run/docker.sock` pour qu'il parle au daemon Docker de l'hôte,  
> mais il faut quand même le **client** `docker` à l'intérieur du conteneur.

```yaml
# docker-compose.yml — CHEMIN B (tout self-hosted : GitLab + Jenkins)
services:
  gitlab:
    image: gitlab/gitlab-ce:18.9.2-ce.0
    container_name: gitlab
    hostname: gitlab.local
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://gitlab.local'
        nginx['listen_port'] = 80
        nginx['listen_https'] = false
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        puma['worker_processes'] = 2
        puma['min_threads'] = 1
        puma['max_threads'] = 4
        sidekiq['concurrency'] = 5
        prometheus_monitoring['enable'] = false
        gitlab_exporter['enable'] = false
        node_exporter['enable'] = false
        redis_exporter['enable'] = false
        postgres_exporter['enable'] = false
    ports:
      - "8080:80"
      - "2222:22"
    volumes:
      - gitlab-config:/etc/gitlab
      - gitlab-logs:/var/log/gitlab
      - gitlab-data:/var/opt/gitlab
    networks:
      - devsecops-net
    restart: unless-stopped
    shm_size: '256m'

  jenkins:
    build:
      context: .
      dockerfile: Dockerfile.jenkins   # ← image custom avec Docker CLI installé
    container_name: jenkins
    user: root
    ports:
      - "9090:8080"
      - "50000:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock   # socket du daemon Docker de l'hôte
    networks:
      - devsecops-net
    restart: unless-stopped

  renovate:
    image: renovate/renovate:latest
    environment:
      - RENOVATE_PLATFORM=gitlab
      - RENOVATE_ENDPOINT=http://gitlab/api/v4    # ← GitLab local dans le réseau Docker
      - RENOVATE_TOKEN=${RENOVATE_GITLAB_TOKEN}
      - RENOVATE_AUTODISCOVER=true
    networks:
      - devsecops-net
    profiles:
      - renovate

  # Pas de gitlab-runner — Jenkins joue ce rôle
  # Pas de Cloudflare Tunnel — GitLab et Jenkins sont dans le même réseau Docker

volumes:
  gitlab-config:
  gitlab-logs:
  gitlab-data:
  jenkins-data:

networks:
  devsecops-net:
    driver: bridge
```

> **⚠️ `external_url 'http://gitlab.local'`** — jamais `http://localhost:8080`.  
> Si vous mettez `localhost:8080`, Puma tente de bind ce port en interne et crashe en boucle.

---

## B.2 — Builder l'image Jenkins et lancer les conteneurs

```bash
# La première fois : build l'image Jenkins custom (installe Docker CLI — ~2 min)
docker compose build jenkins

# Puis lancer tout l'environnement
docker compose up -d
docker compose ps
```

> **Si Jenkins existait déjà sans Docker CLI :**
> ```bash
> docker compose down jenkins
> docker compose build jenkins
> docker compose up -d jenkins
> ```

**Résultat attendu :**
```
NAME      IMAGE                          STATUS
gitlab    gitlab/gitlab-ce:18.9.2-ce.0   Up (health: starting)
jenkins   devsecops-lab-jenkins          Up
```

---

## B.3 — Attendre que GitLab soit prêt (~3-5 min)

```bash
until [ "$(docker inspect gitlab --format='{{.State.Health.Status}}')" = "healthy" ]; do
  echo "$(date +%H:%M:%S) — en attente..."
  sleep 30
done && echo "✅ GitLab prêt !"
```

> **Sur 6 GiB alloués :** ~3 min. **Sur 8 GiB+ :** ~1-2 min.

---

## B.4 — Récupérer les mots de passe

**GitLab :**
```bash
docker exec gitlab cat /etc/gitlab/initial_root_password | grep Password:
```
→ Ouvrir http://localhost:8080, login `root` + le mot de passe.  
→ **⚠️ Changer immédiatement** le mot de passe dans `Edit Profile → Password` (il expire en 24h).  
→ **Mémoriser ce mot de passe** — il servira pour les credentials Jenkins.

**Jenkins :**
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
→ Ouvrir http://localhost:9090, coller le mot de passe, installer les plugins suggérés.

---

## B.5 — Installer les plugins Jenkins

**Manage Jenkins → Plugins → Available plugins**

| Plugin | Pourquoi |
|--------|---------|
| `Pipeline` (workflow-aggregator) | Lire les Jenkinsfile |
| `Docker Pipeline` | `docker.image().inside()` dans les stages |
| `Git plugin` | Cloner depuis GitLab local |
| `Multibranch Pipeline` (si absent) | Scanner les branches automatiquement |

> **⚠️ Ne pas installer "GitLab Branch Source"** — il cherche gitlab.com et complique tout.

Cliquer **Install** → attendre → cocher **Restart after installation**.

---

## B.6 — Ajouter les credentials GitLab dans Jenkins

> **Pourquoi Username/Password et pas un Personal Access Token ?**  
> Jenkins clone le repo via Git HTTP — Git utilise du Username/Password en basic auth.  
> Le type "GitLab API Token" dans Jenkins sert à appeler l'API REST GitLab, pas à cloner.  
> Sur GitLab self-hosted, Username/Password fonctionne à coup sûr.

```
Jenkins → Manage Jenkins → Credentials → (global) → Add Credentials
→ Kind     : Username with password        ← IMPORTANT, pas "GitLab API Token"
→ Username : root
→ Password : [le mot de passe root GitLab défini à l'étape B.4]
→ ID       : gitlab-root-creds
→ Save
```

---

## B.7 — Créer le projet PHP sur GitLab local

```
GitLab (http://localhost:8080) → New Project → Create blank project
→ Name : php-devsecops-demo
→ Visibility : Private
→ ✅ Initialize repository with a README
→ Create project
```

---

## B.8 — Créer les fichiers du projet (avec Jenkinsfile)

> **Le `Jenkinsfile` doit être à la racine du repo.** Jenkins le détecte automatiquement via le Multibranch Pipeline — c'est lui qui clone le repo et lit le fichier à chaque push.

**`public/index.php`** — avec faille XSS volontaire :
```php
<?php
// ❌ FAILLE XSS
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . $name . "!</h1>";
?>
```

**`Jenkinsfile`** (à la racine du repo) :
```groovy
pipeline {
    agent any

    stages {
        stage('Secrets — Gitleaks') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside('--entrypoint=""') {
                        sh 'gitleaks detect --source . -v'
                    }
                }
            }
        }

        stage('SAST — Bearer PHP') {
            steps {
                script {
                    docker.image('bearer/bearer:latest').inside('--entrypoint=""') {
                        sh 'bearer scan .'
                    }
                }
            }
        }

        stage('SCA — Composer Audit') {
            steps {
                script {
                    docker.image('composer:2.7').inside('--entrypoint=""') {
                        sh 'composer install --no-interaction -q && composer audit'
                    }
                }
            }
        }
    }

    post {
        failure { echo 'Security gate bloqué' }
        success { echo 'Tous les security gates passés' }
    }
}
```

---

## B.9 — Créer le pipeline Jenkins (Multibranch)

```
Jenkins → New Item
→ Nom  : php-devsecops-demo
→ Type : Multibranch Pipeline
→ OK
```

**Section "Branch Sources" :**
```
Add Source → Git    ← "Git", PAS "GitLab"

Project Repository :
  http://gitlab/root/php-devsecops-demo.git
               ↑ nom du conteneur Docker dans le réseau devsecops-net

Credentials → gitlab-root-creds → Validate → "Credentials OK"
```

**Section "Scan Multibranch Pipeline Triggers" :**
```
→ Periodically if not otherwise run → Interval : 1 minute
```

Cliquer **Save** → Jenkins scanne → branche `main` apparaît → pipeline démarre.

> **Si "Validate" échoue :**
> ```bash
> docker inspect gitlab --format='{{.State.Health.Status}}'  # doit être "healthy"
> docker exec jenkins curl -s http://gitlab/api/v4/version    # doit retourner {"version":"18.9.2",...}
> ```

---

## B.10 — Configurer le webhook GitLab → Jenkins

Sans webhook : Jenkins se déclenche par polling (toutes les minutes).  
Avec webhook : déclenchement instantané dès le push.

> **⚠️ L'URL du webhook utilise le nom de conteneur Docker et le port interne.**  
> Jenkins écoute sur le port 8080 dans le conteneur (mappé 9090 sur l'hôte).  
> Depuis GitLab (qui est aussi dans Docker), l'URL correcte est `http://jenkins:8080/...`

```
GitLab (http://localhost:8080) → Projet → Settings → Webhooks → Add new webhook
→ URL     : http://jenkins:8080/project/php-devsecops-demo
→           ↑ nom Docker   ↑ port interne
→ Trigger : Push events
→ SSL verification : décocher (HTTP local, pas de certificat)
→ Add webhook → Test → Push events → HTTP 200 ✅
```

---

## B.11 — Pousser le code et observer le pipeline

```bash
git clone http://localhost:8080/root/php-devsecops-demo.git
cd php-devsecops-demo
# Créer public/index.php et Jenkinsfile (contenus ci-dessus)
git add .
git commit -m "feat: add php page with XSS"
git push
```

**Résultat attendu dans Jenkins → php-devsecops-demo → main :**
```
Build #1 → FAILED
  ✅ Secrets — Gitleaks  → SUCCESS
  ❌ SAST — Bearer PHP   → FAILED (HIGH CWE-79 XSS, exit code 1)
```

---

## B.12 — Déclencher Gitleaks (démo secret hardcodé)

```php
$stripe_key = "sk_live_51NxKjUIJV4QBqzxvXXXXXXXXXXXXXXXXXX";
```

```bash
git add . && git commit -m "bad: hardcoded stripe key" && git push
```

**Résultat attendu :**
```
Build #2 → FAILED
  ❌ Secrets — Gitleaks  → FAILED (clé Stripe détectée)
  ⏭️ SAST — Bearer PHP   → NOT RUN
```

> **⚠️ Supprimer la clé et repusher ne suffit pas** — Gitleaks scanne tout l'historique.  
> Recréer le projet pour la démo "pipeline vert".

---

## B.13 — Pipeline au vert

```php
<?php
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
?>
```

```bash
git add . && git commit -m "fix: escape XSS" && git push
```

**Résultat attendu dans Jenkins :**
```
Build #1 → SUCCESS ✅
  ✅ Secrets — Gitleaks  → SUCCESS
  ✅ SAST — Bearer PHP   → SUCCESS
  ✅ SCA — Composer Audit → SUCCESS
```

---

## B.14 — Lancer Renovate (optionnel)

Créer un PAT GitLab local : `Edit Profile → Access Tokens → scopes : api, read_repo, write_repo`

```bash
RENOVATE_GITLAB_TOKEN=glpat-XXXX docker compose --profile renovate run --rm renovate
# Renovate pointe vers http://gitlab/api/v4 (GitLab local dans le réseau Docker)
```

---
---
---
# ═══════════════════════════════════════════════
# RÉFÉRENCE RAPIDE — LES PIÈGES
# ═══════════════════════════════════════════════
---
---

## PIÈGE 0 — `docker: not found` dans Jenkins (Chemin B)

```
ERROR: script returned exit code 127
docker: not found
```

```bash
# ❌ jenkins/jenkins:lts-jdk17 n'inclut pas le client Docker
# → docker.image(...).inside(...) échoue immédiatement

# ✅ Créer un Dockerfile.jenkins qui installe docker-ce-cli
# → docker compose build jenkins   (à faire une seule fois)
```

> Le socket `/var/run/docker.sock` est monté pour parler au daemon de l'hôte,  
> mais le **client** `docker` doit être installé **dans** le conteneur Jenkins.

---

## PIÈGE 1 — `external_url` cause le crash de GitLab (Chemin B)

```yaml
# ❌ Puma crashe en boucle (port 8080 déjà utilisé en interne)
external_url 'http://localhost:8080'

# ✅ Correct
external_url 'http://gitlab.local'
nginx['listen_port'] = 80
```

---

## PIÈGE 2 — `--entrypoint=""` obligatoire sur Gitleaks, Bearer ET Composer

Ces trois images ont un entrypoint custom — Jenkins ne peut pas y injecter `cat` sans le désactiver.

Dans `.gitlab-ci.yml` (Chemin A) :
```yaml
# ❌ Crash : "Error: unknown command sh"
image: zricethezav/gitleaks:latest

# ✅ Correct — s'applique à gitleaks ET bearer
image:
  name: zricethezav/gitleaks:latest
  entrypoint: [""]
```

Dans le `Jenkinsfile` (Chemin B) :
```groovy
# ❌ Crash : "The container started but didn't run the expected command"
docker.image('composer:2.7').inside { ... }

# ✅ Correct — s'applique à gitleaks, bearer ET composer
docker.image('composer:2.7').inside('--entrypoint=""') { ... }
```

---

## PIÈGE 3 — Bearer exit code automatique (plus sûr que Semgrep)

```bash
# ✅ Bearer retourne exit 1 automatiquement si findings
bearer scan .

# Avec Semgrep il fallait --error, sinon exit 0 même avec des failles actives
# Bearer élimine ce risque
```

---

## PIÈGE 4 — Gitleaks scanne tout l'historique git

```bash
# Vous supprimez la clé du fichier et repushzez...
# Gitleaks trouve quand même la clé dans les commits précédents !
# → Solution : recréer le projet GitLab
# → Dans la vraie vie : révoquer la clé IMMÉDIATEMENT
```

---

## PIÈGE 5 — Credentials Jenkins : Username/Password, pas "GitLab API Token"

```
# ❌ "GitLab API Token" → Jenkins refuse au moment du clone git
# ✅ "Username with password" → root / [mot de passe GitLab root]

# "GitLab API Token" sert à appeler l'API REST, pas à cloner un repo Git.
```

---

## PIÈGE 6 — URL webhook Jenkins : nom Docker + port interne (Chemin B)

```bash
# ❌ localhost ne fonctionne pas depuis un conteneur Docker
http://localhost:9090/project/...

# ✅ Nom du conteneur + port interne (8080), pas le port mappé sur l'hôte (9090)
http://jenkins:8080/project/...
```

---

## COMMANDES DE RÉFÉRENCE RAPIDE

```bash
# === CHEMIN A ===
docker compose up -d
docker exec gitlab-runner gitlab-runner register \
  --non-interactive --url "https://gitlab.com" \
  --token "glrt-XXXX" --executor "docker" \
  --docker-image "alpine:latest" --description "runner-local"
RENOVATE_GITLAB_TOKEN=glpat-XXXX docker compose --profile renovate run --rm renovate

# === CHEMIN B ===
docker compose up -d

# Attendre GitLab
until [ "$(docker inspect gitlab --format='{{.State.Health.Status}}')" = "healthy" ]; do
  echo "$(date +%H:%M:%S) — en attente..." && sleep 30
done

# Mots de passe
docker exec gitlab cat /etc/gitlab/initial_root_password | grep Password:
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Lancer Renovate (Chemin B)
RENOVATE_GITLAB_TOKEN=glpat-XXXX docker compose --profile renovate run --rm renovate

# Tout arrêter et supprimer les volumes
docker compose down -v
```

---

## ORDRE DE LA DÉMO EN LIVE (45 min)

| Temps | Action |
|-------|--------|
| 0:00 | Expliquer les deux chemins — schéma au tableau |
| 2:00 | **Chemin A** — montrer le projet sur gitlab.com |
| 4:00 | `docker compose up -d` + enregistrer le Runner |
| 6:00 | Pousser `index.php` avec XSS + `.gitlab-ci.yml` |
| 9:00 | Pipeline → failed, montrer le finding Bearer (CWE-79 XSS) |
| 12:00 | Ajouter clé Stripe, pousser, montrer Gitleaks qui bloque |
| 15:00 | **Leçon historique git** — supprimer ne suffit pas |
| 18:00 | Recréer projet propre, corriger XSS, pipeline vert |
| 22:00 | **Chemin B** — `docker compose up -d` (GitLab + Jenkins) |
| 24:00 | Expliquer l'attente GitLab (~3 min) — en profiter pour expliquer Docker |
| 27:00 | GitLab HEALTHY — ouvrir http://localhost:8080 |
| 29:00 | Configurer Jenkins (plugins + credentials + Multibranch) |
| 34:00 | Pousser code avec Jenkinsfile → Jenkins déclenche |
| 37:00 | Montrer webhook `http://jenkins:8080/...` — expliquer réseau Docker |
| 40:00 | Questions / récap |

---

## TABLEAU DE BORD — TESTÉ ET VALIDÉ LE 13 MARS 2026

| Test | Résultat | Durée |
|------|----------|-------|
| Chemin A : Runner enregistré sur gitlab.com | ✅ | 30s |
| Chemin A : Pipeline déclenché automatiquement | ✅ | 15s après push |
| Chemin A : **Bearer bloque XSS PHP** | ✅ `failed` | < 1 min |
| Chemin A : **Gitleaks bloque clé Stripe** | ✅ `failed` | < 1 min |
| Chemin A : **Pipeline vert sur code propre** | ✅ `success` | ~1 min |
| Chemin B : `docker compose up -d` | ✅ | 6s |
| Chemin B : GitLab 18.9.2 HEALTHY | ✅ | 3m12s |
| Chemin B : Jenkins HTTP 200 | ✅ | 15s |
| Chemin B : Multibranch Pipeline + webhook | ✅ HTTP 200 | 2 min config |
| Chemin B : **Bearer bloque XSS PHP** | ✅ `FAILED` | < 1 min |
| Chemin B : **Pipeline vert sur code propre** | ✅ `SUCCESS` | ~1 min |
