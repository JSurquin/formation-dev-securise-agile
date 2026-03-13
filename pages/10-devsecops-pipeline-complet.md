---
layout: new-section
routeAlias: 'devsecops-pipeline-complet'
---

<a name="devsecops-pipeline-complet" id="devsecops-pipeline-complet"></a>

# 🏭 Module 10
## Chaîne DevSecOps complète

### De zéro à un pipeline sécurisé : GitLab + Jenkins, Java & PHP

---

# Pourquoi ce module ? 🎯

> **Analogie :** Jusqu'ici on a vu les ingrédients séparément (SAST, DAST, CI/CD, secrets...). Ce module, c'est la recette complète — on assemble tout, de la création du projet jusqu'au pipeline qui bloque automatiquement les failles.

<small>

**Ce qu'on va construire — deux chemins :**

| | Chemin A | Chemin B |
|--|----------|----------|
| **GitLab** | **gitlab.com** (cloud, gratuit) | **Self-hosted** (conteneur local) |
| **Outil CI** | GitLab Runner (Docker local) | Jenkins (Docker local) |
| **Config pipeline** | `.gitlab-ci.yml` | `Jenkinsfile` (dans le repo) |
| **Runner GitLab** | ✅ Nécessaire | ❌ Inutile — Jenkins joue ce rôle |
| **RAM nécessaire** | ~200 MB (Runner seul, pas de GitLab local) | ~3.8 GiB (GitLab + Jenkins) |
| **Difficulté** | ⭐⭐ Simple | ⭐⭐⭐ Intermédiaire |

</small>

---

> **Règle d'or :** Runner GitLab et Jenkins font le **même travail** (exécuter les pipelines). On choisit l'un **OU** l'autre, jamais les deux en même temps pour le même projet.

---

# C'est quoi Docker ? (pour ceux qui ne connaissent pas) 🐳

> **Analogie :** Docker, c'est comme des **appartements préfabriqués en kit**. Au lieu de construire une maison de A à Z (installer Linux, puis Java, puis GitLab...), tu télécharges une boîte déjà prête qui contient tout. Tu la poses sur ta machine, elle démarre, et tu l'utilises. Quand tu n'en veux plus, tu la supprimes sans laisser de trace.

<div class="text-xs">

**Concepts clés :**

| Terme | Analogie | Explication |
|-------|----------|-------------|
| **Image** | Le plan de l'appartement | Le fichier de référence (ex: `gitlab/gitlab-ce`) |
| **Conteneur** | L'appartement construit | L'image qui tourne sur ta machine |
| **Docker Compose** | Le lotissement entier | Plusieurs conteneurs qui se parlent |
| **Volume** | Le garde-meuble | Les données qui persistent si on relance |

</div>

---

# Docker Desktop : installation en 3 minutes ⚡

**Étape 1 : Télécharger Docker Desktop**

```
https://www.docker.com/products/docker-desktop/
```

→ Choisir la version pour votre OS (Windows / Mac / Linux)

**Étape 2 : Vérifier que ça fonctionne**

```bash
docker --version          # Docker version 27.x.x
docker compose version    # Docker Compose version v2.x.x
```

**Étape 3 : Augmenter la RAM allouée à Docker** ⚠️ CRITIQUE

<div class="text-xs">

```
Docker Desktop → Settings → Resources → Memory → 6144 MB minimum
```

</div>

> **⚠️ Testé en live :** avec moins de 6 GiB alloués à Docker, GitLab crashe (Puma, son serveur Rails, manque de mémoire). Jenkins seul ne nécessite que 400 MB.

---

# Vérifier votre RAM disponible 🔍

```bash
# Sur Windows (PowerShell) :
Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum

# Sur Mac :
system_profiler SPHardwareDataType | grep Memory

# Sur Linux :
free -h
```

<div class="text-xs">

| RAM machine | Alloué à Docker | Solution |
|-------------|-----------------|----------|
| **≥ 16 GB** | 8 GB | ✅ **Chemin A ou B** |
| **12-15 GB** | 6 GB | ✅ **Chemin A ou B** — lent au 1er démarrage pour B |
| **8-11 GB** | Max 5 GB | ⚠️ **Chemin A de préférence** — gitlab.com + Runner, ~200 MB seulement |
| **< 8 GB** | Insuffisant | ❌ **Chemin A uniquement** — gitlab.com + Runner léger |

</div>

---

# C'est quoi Bearer ? 🔍 (SAST — outil de la chaîne)

> **Analogie :** Bearer, c'est un inspecteur de code qui lit **tout ton projet en quelques secondes** et te dit "ligne 4 : tu affiches une donnée utilisateur sans la nettoyer — risque d'injection XSS (CWE-79)". Il comprend le **flux des données** dans ton code, pas juste des patterns.

**Pourquoi Bearer et pas autre chose ?**

| | Semgrep CE | SonarQube | Bearer |
|--|------------|-----------|--------|
| **Open source** | ✅ | ⚠️ Freemium | ✅ 100% |
| **Image Docker officielle** | ✅ | ✅ lourd | ✅ |
| **Exit code 1 sur findings** | ⚠️ Nécessite `--error` | Complexe | ✅ Automatique |
| **PHP + Java** | ✅ | ✅ | ✅ |
| **Détection XSS, SQLi, secrets** | ✅ | ✅ | ✅ |
| **CWE dans le rapport** | ✅ | ✅ | ✅ avec liens |

**→ Bearer sort automatiquement en exit code 1 s'il trouve des failles. Pas de flag `--error` à ne pas oublier.**

```bash
# Tester Bearer en local (avant de mettre en CI/CD)
docker run --rm -v $(pwd):/app bearer/bearer:latest scan /app
```

---
layout: new-section
---

# CHEMIN A — gitlab.com + Runner local
#### `.gitlab-ci.yml` exécuté par le Runner

---

# Chemin A : architecture 🏗️

> **Analogie :** gitlab.com est le chef de chantier dans le cloud. Le Runner (sur ta machine, dans Docker) est l'ouvrier qui exécute les tâches. Le Runner se connecte *lui-même* vers gitlab.com — pas besoin de tunnel car c'est lui qui initie la connexion.

```
┌──────────────────────────────────────────────────────────┐
│  Internet              │  Machine locale (Docker Compose) │
│                        │                                  │
│  ┌────────────────┐    │  ┌──────────────────────────┐   │
│  │   gitlab.com   │◄───┼──│    GitLab Runner         │   │
│  │  (ton projet)  │    │  │  (exécute .gitlab-ci.yml)│   │
│  └────────────────┘    │  └──────────────────────────┘   │
│                        │                                  │
│                        │  ┌──────────────────────────┐   │
│                        │  │  Renovate (optionnel)    │   │
│                        │  └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Pas de conteneur GitLab local.** Le Runner se connecte vers gitlab.com pour récupérer les jobs.  
**Pas de Jenkins. Pas de Cloudflare Tunnel.** Le Runner initie la connexion sortante vers gitlab.com.

---

# Chemin A : docker-compose.yml 🗂️

```yaml
# devsecops-lab/docker-compose.yml — CHEMIN A (gitlab.com + Runner local)
# Pas de conteneur GitLab — on utilise gitlab.com directement
services:
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: unless-stopped
    volumes:
      - runner-config:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock

  renovate:              # optionnel — MR auto pour les dépendances sur gitlab.com
    image: renovate/renovate:latest
    environment:
      - RENOVATE_PLATFORM=gitlab
      - RENOVATE_ENDPOINT=https://gitlab.com/api/v4   # ← gitlab.com, pas local
      - RENOVATE_TOKEN=${RENOVATE_GITLAB_TOKEN}
      - RENOVATE_AUTODISCOVER=true
    profiles:
      - renovate

volumes:
  runner-config:
```

> **Beaucoup plus léger que le Chemin B** : pas de GitLab à héberger en local.  
> Le Runner se connecte vers gitlab.com tout seul — aucun port à exposer, aucun tunnel.

---

# Chemin A : lancer et configurer 🚀

**Étape 1 : Créer un projet sur gitlab.com**
```
→ https://gitlab.com → New Project → Create blank project
→ Nom : php-devsecops-demo  (ou java-devsecops-demo)
→ Visibility : Private
→ ✅ Initialize with a README
```

**Étape 2 : Créer un Runner sur gitlab.com**
```
gitlab.com → Projet → Settings → CI/CD → Runners → New project runner
→ Tag : docker
→ Create runner → Copier le token (glrt-xxxx)
```

**Étape 3 : Lancer le Runner en local et l'enregistrer**
```bash
docker compose up -d

docker exec gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com" \
  --token "glrt-VOTRE_TOKEN" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --description "runner-local"
```

**Résultat :** le Runner apparaît en vert dans gitlab.com → Projet → Settings → CI/CD → Runners ✅

---

# Chemin A : pipeline PHP — `.gitlab-ci.yml`

```yaml
# .gitlab-ci.yml — Projet PHP — Chemin A (Runner GitLab)
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
    # Exit code 1 automatique si failles → pas besoin de --error
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

# Chemin A : pipeline Java — `.gitlab-ci.yml` (1/2)

```yaml
# .gitlab-ci.yml — Projet Java — Chemin A (Runner GitLab)
stages:
  - secrets
  - sast
  - build
  - scan-image

variables:
  APP_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
  MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2"

cache:
  paths:
    - .m2/

secrets-scan:
  stage: secrets
  image:
    name: zricethezav/gitleaks:latest
    entrypoint: [""]
  script:
    - gitleaks detect --source . -v
  allow_failure: false

sast-bearer:
  stage: sast
  image:
    name: bearer/bearer:latest
    entrypoint: [""]
  script:
    - bearer scan /builds/$CI_PROJECT_PATH
  allow_failure: false
```

---

# Chemin A : pipeline Java — `.gitlab-ci.yml` (2/2)

```yaml
sca-owasp:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn org.owasp:dependency-check-maven:check
        -DfailBuildOnCVSS=7
  artifacts:
    paths:
      - target/dependency-check-report.html
    when: always
  allow_failure: false

build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn package -q -DskipTests
  artifacts:
    paths:
      - target/*.jar

docker-build-scan:
  stage: scan-image
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t $APP_IMAGE .
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock
        aquasec/trivy:latest image --exit-code 1 --severity CRITICAL,HIGH $APP_IMAGE
  allow_failure: false
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

---
layout: new-section
---

# CHEMIN B — tout self-hosted
### GitLab + Jenkins dans Docker

---

# Chemin B : architecture 🏗️

> **Analogie :** GitLab est la sonnette d'alarme et Jenkins est le vigile — ils sont dans **le même bâtiment** (le même réseau Docker). GitLab envoie un webhook à Jenkins directement par le réseau interne. Pas besoin de passer par Internet, pas de tunnel.

```
┌──────────────────────────────────────────────────────────┐
│              Machine locale — Docker Compose              │
│                                                          │
│  ┌─────────────┐  webhook interne  ┌─────────────────┐  │
│  │  GitLab CE  │──────────────────►│    Jenkins      │  │
│  │  port 8080  │  http://jenkins   │   port 9090     │  │
│  └─────────────┘       :8080       └─────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Renovate (optionnel, pointe vers GitLab local)  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Pas de gitlab-runner — Jenkins remplace le Runner       │
│  Pas de Cloudflare Tunnel — tout est en réseau local     │
└──────────────────────────────────────────────────────────┘
```

> **Le `Jenkinsfile` est dans le repo GitLab** (à la racine). Jenkins le détecte automatiquement via le Multibranch Pipeline — c'est lui qui clone le repo et lit le fichier.

---

# Chemin B : Dockerfile.jenkins ⚠️ obligatoire

> **Problème :** `jenkins/jenkins:lts-jdk17` ne contient pas le client `docker`.  
> Or le Jenkinsfile utilise `docker.image(...).inside(...)` — il a besoin de `docker` en CLI.  
> On monte le socket `/var/run/docker.sock` pour parler au daemon de l'hôte,  
> **mais il faut aussi installer le client Docker à l'intérieur du conteneur Jenkins.**

```dockerfile
# Dockerfile.jenkins — à créer dans le même dossier que docker-compose.yml
FROM jenkins/jenkins:lts-jdk17
USER root
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg \
      -o /etc/apt/keyrings/docker.asc && \
    chmod a+r /etc/apt/keyrings/docker.asc && \
    echo "deb [arch=$(dpkg --print-architecture) \
      signed-by=/etc/apt/keyrings/docker.asc] \
      https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*
```

---

# Chemin B : docker-compose.yml 🗂️

```yaml
# devsecops-lab/docker-compose.yml — CHEMIN B (tout self-hosted)
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
```

---

# Chemin B : docker-compose.yml 🗂️

```yaml
  jenkins:
    build:
      context: .
      dockerfile: Dockerfile.jenkins   # image custom — Jenkins + Docker CLI
    container_name: jenkins
    user: root
    ports:
      - "9090:8080"
      - "50000:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - devsecops-net
    restart: unless-stopped

  renovate:              # optionnel — pointe vers GitLab local
    image: renovate/renovate:latest
    environment:
      - RENOVATE_PLATFORM=gitlab
      - RENOVATE_ENDPOINT=http://gitlab/api/v4   # ← GitLab local dans Docker
      - RENOVATE_TOKEN=${RENOVATE_GITLAB_TOKEN}
      - RENOVATE_AUTODISCOVER=true
    networks:
      - devsecops-net
    profiles:
      - renovate

volumes:
  gitlab-config:
  gitlab-logs:
  gitlab-data:
  jenkins-data:

networks:
  devsecops-net:
    driver: bridge
```

---

> **Tout est local dans le même réseau Docker.** Webhook = `http://jenkins:8080/...`  
> Pas de Cloudflare Tunnel — GitLab et Jenkins se parlent directement.

---

# Chemin B : configurer Jenkins 🔧

**Mot de passe initial Jenkins :**
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

→ Ouvrir http://localhost:9090, coller le mot de passe.

**Plugins à installer :**
```
Jenkins → Manage Jenkins → Plugins → Available plugins
→ Chercher et installer :
  • "GitLab Plugin"       ← connexion GitLab ↔ Jenkins
  • "Pipeline"            ← support des Jenkinsfile
  • "Docker Pipeline"     ← lancer des conteneurs dans le pipeline
→ Redémarrer Jenkins
```

**Créer les credentials GitLab dans Jenkins :**
```
Jenkins → Manage Jenkins → Credentials → Global → Add credentials
→ Kind: "GitLab API Token"
→ API Token: votre Personal Access Token GitLab (glpat-xxxx)
→ ID: gitlab-token
```

---

# Chemin B : connecter GitLab → Jenkins 🔗

**Étape 1 : Dans Jenkins — ajouter les credentials GitLab**

```
Manage Jenkins → Credentials → (global) → Add Credentials
→ Kind     : Username with password   ← PAS "GitLab API Token"
→ Username : root
→ Password : [mot de passe root GitLab]
→ ID       : gitlab-root-creds
```

> **Pourquoi pas le Personal Access Token ?** Jenkins clone le repo via Git HTTP — Git attend un username/password. Le type "GitLab API Token" ne sert qu'à l'API REST, pas au clone.

**Étape 2 : Dans Jenkins — créer le pipeline Multibranch**

```
New Item → "php-devsecops-demo" → Multibranch Pipeline

Branch Sources → Add Source → Git   ← "Git", PAS "GitLab"
  → Project Repository : http://gitlab/root/php-devsecops-demo.git
  →                              ↑ nom du conteneur Docker dans le réseau
  → Credentials : gitlab-root-creds → Validate → "Credentials OK"

Scan Multibranch Pipeline Triggers → Interval : 1 minute → Save
```

Jenkins détecte toutes les branches avec un `Jenkinsfile` et crée un pipeline par branche.

---

**Étape 3 : Dans GitLab local — créer le webhook**

```
GitLab → Projet → Settings → Webhooks → Add new webhook
  → URL     : http://jenkins:8080/project/php-devsecops-demo
  →                  ↑ nom Docker    ↑ port interne (pas 9090 !)
  → Trigger  : Push events
  → SSL      : décocher (HTTP local)
  → Add webhook → Test → Push events → HTTP 200 ✅
```

---

# Chemin B : Jenkinsfile PHP

```groovy
// Jenkinsfile — Projet PHP — Chemin B (Jenkins)
pipeline {
    agent any   // Jenkins choisit un agent disponible

    environment {
        APP_NAME = 'php-devsecops-demo'
    }

    stages {
        stage('🔑 Secrets — Gitleaks') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside('--entrypoint=""') {
                        sh 'gitleaks detect --source . -v'
                    }
                }
            }
        }

        stage('🔍 SAST — Bearer PHP') {
            steps {
                script {
                    docker.image('bearer/bearer:latest').inside('--entrypoint=""') {
                        sh 'bearer scan .'
                        // Exit code 1 automatique si failles — pas de flag à ajouter
                    }
                }
            }
        }
```

---

```groovy
        stage('📦 SCA — Composer Audit') {
            steps {
                script {
                    docker.image('composer:2.7').inside('--entrypoint=""') {
                        sh '''
                            composer install --no-interaction -q
                            composer audit
                        '''
                    }
                }
            }
        }

        stage('🐳 Docker Build & Trivy') {
            when { branch 'main' }
            steps {
                script {
                    def img = docker.build("${APP_NAME}:${env.BUILD_NUMBER}")
                    docker.image('aquasec/trivy:latest').inside(
                        '-v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                    ) {
                        sh "trivy image --exit-code 1 --severity CRITICAL,HIGH ${APP_NAME}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        failure { echo '🔴 Security gate bloqué — voir les logs ci-dessus' }
        success { echo '✅ Tous les security gates passés !' }
    }
}
```

---

# Chemin B : Jenkinsfile Java

```groovy
// Jenkinsfile — Projet Java — Chemin B (Jenkins)
pipeline {
    agent {
        docker {
            image 'maven:3.9-eclipse-temurin-17'
            args '-v /root/.m2:/root/.m2'
        }
    }

    stages {
        stage('🔑 Secrets — Gitleaks') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside('--entrypoint=""') {
                        sh 'gitleaks detect --source . -v'
                    }
                }
            }
        }

        stage('🔍 SAST — Bearer Java') {
            steps {
                script {
                    docker.image('bearer/bearer:latest').inside('--entrypoint=""') {
                        sh 'bearer scan .'
                    }
                }
            }
        }
```

---

```groovy
        stage('📦 SCA — OWASP Dependency Check') {
            steps {
                sh 'mvn org.owasp:dependency-check-maven:check -DfailBuildOnCVSS=7 -q'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'target',
                        reportFiles: 'dependency-check-report.html',
                        reportName: 'OWASP Dependency Check'
                    ])
                }
            }
        }

        stage('🔨 Build Maven') {
            steps {
                sh 'mvn package -q -DskipTests'
            }
            post {
                success { archiveArtifacts artifacts: 'target/*.jar' }
            }
        }

        stage('🐳 Docker Build & Trivy') {
            when { branch 'main' }
            steps {
                script {
                    def img = docker.build("java-devsecops-demo:${env.BUILD_NUMBER}")
                    docker.image('aquasec/trivy:latest').inside(
                        '-v /var/run/docker.sock:/var/run/docker.sock --entrypoint=""'
                    ) {
                        sh "trivy image --exit-code 1 --severity CRITICAL,HIGH java-devsecops-demo:${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        failure { echo '🔴 Pipeline bloqué — vérifier les rapports de sécurité' }
        success { echo '✅ Tous les security gates passés !' }
    }
}
```

---

# Renovate : gérer les dépendances obsolètes 🔄

> **Analogie :** Renovate, c'est le service d'entretien de la voiture qui t'appelle automatiquement quand une révision est due. Il crée une Merge Request toute prête — toi tu n'as plus qu'à valider (ou rejeter).

**Pourquoi Renovate et pas Dependabot ?**

| | Dependabot | Renovate |
|--|------------|----------|
| **GitHub.com** | ✅ Natif | ✅ |
| **GitLab.com** | ✅ (limité) | ✅ Complet |
| **GitLab self-hosted** | ❌ Indisponible | ✅ |
| **Grouper les MR** | ❌ | ✅ (1 MR pour 10 deps) |

---

**Chemin A** → Renovate pointe vers `https://gitlab.com/api/v4` (cloud)  
**Chemin B** → Renovate pointe vers `http://gitlab/api/v4` (GitLab local dans Docker)

```bash
# Même commande pour les deux — l'endpoint est déjà dans le docker-compose.yml
RENOVATE_GITLAB_TOKEN=glpat-xxx docker compose --profile renovate run --rm renovate
```

**`renovate.json`** à ajouter à la racine du projet GitLab :

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended"],
  "automerge": false,
  "labels": ["dependencies"]
}
```

---

# Comparatif Chemin A vs Chemin B 🆚

> **Analogie :** Chemin A = voiture automatique, facile à prendre en main. Chemin B = voiture manuelle avec plus d'options mais plus de configuration.

| Critère | Chemin A — gitlab.com + Runner | Chemin B — tout self-hosted |
|---------|--------------------------------|-----------------------------|
| **GitLab** | gitlab.com (cloud) | Self-hosted (Docker local) |
| **Outil CI** | GitLab Runner | Jenkins |
| **Config pipeline** | `.gitlab-ci.yml` | `Jenkinsfile` (dans le repo) |
| **RAM Docker** | ~200 MB (Runner seul) | ~3.8 GiB (GitLab + Jenkins) |
| **Résultats** | Directement dans gitlab.com | Dans l'interface Jenkins |
| **Webhook** | Pas nécessaire (Runner sort vers gitlab.com) | Interne Docker `http://jenkins:8080` |
| **Plugins** | ~30 natifs | 1800+ |
| **Usage** | Étudiants, petites équipes | Entreprises avec Jenkins existant |

**→ Pour débuter :** Chemin A. **Pour les entreprises déjà sur Jenkins :** Chemin B.

---

# Projet PHP : les fichiers essentiels 📁

```
php-devsecops-demo/
├── public/
│   └── index.php          ← page avec XSS volontaire (à corriger)
├── composer.json           ← dépendances (Symfony volontairement ancien)
├── .gitlab-ci.yml          ← utilisé par le Chemin A
├── Jenkinsfile             ← utilisé par le Chemin B
└── Dockerfile              ← utilisé par les deux
```

**`public/index.php`** — version avec faille XSS volontaire :
```php
<?php
// ❌ FAILLE XSS — donnée utilisateur affichée sans échappement
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . $name . "!</h1>";

// ✅ Version corrigée :
// echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
?>
```

---

# Projet Java : les fichiers essentiels 📁

```
java-devsecops-demo/
├── pom.xml                         ← Maven, dépendance commons-lang3 ancienne
├── src/main/java/com/demo/App.java ← Hello World
├── .gitlab-ci.yml                  ← Chemin A
├── Jenkinsfile                     ← Chemin B
└── Dockerfile                      ← multi-stage Maven → JRE alpine
```

**`src/main/java/com/demo/App.java` :**
```java
package com.demo;

public class App {
    public static void main(String[] args) {
        System.out.println("Hello DevSecOps!");
    }
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
```

> L'objectif n'est pas le code Java — c'est le pipeline autour. Plus le code est simple, plus les élèves se concentrent sur la sécurité.

---

# Les 4 pièges à connaître ⚠️

**1. `external_url` — cause le crash de GitLab**
```yaml
# ❌ Puma tente de bind le port 8080 en interne → crash
external_url 'http://localhost:8080'

# ✅ Correct — Nginx écoute sur le port 80 en interne
external_url 'http://gitlab.local'
nginx['listen_port'] = 80
```

**2. `entrypoint: [""]` — obligatoire sur Gitleaks et Bearer**
```yaml
# ❌ Crash : "Error: unknown command sh for gitleaks"
image: zricethezav/gitleaks:latest

# ✅ Correct
image:
  name: zricethezav/gitleaks:latest
  entrypoint: [""]
# Idem pour bearer/bearer:latest
```

---

**3. Bearer — exit code automatique (pas de flag à oublier)**
```bash
# ✅ Bearer retourne exit 1 si findings — aucun flag requis
bearer scan .

# Contrairement à Semgrep qui nécessitait --error :
# semgrep --config=p/php --error .    ← l'oubli de --error = pipeline vert à tort
```

**4. Gitleaks scanne tout l'historique git**
```
# ❌ Vous supprimez le secret dans le dernier commit
# → Gitleaks trouve quand même la clé dans les commits précédents
# → Pipeline toujours en échec

# ✅ Solution : recréer le projet (ou git rebase pour réécrire l'historique)
# → Dans la vraie vie : révoquer la clé IMMÉDIATEMENT
```

> Ces 4 pièges ont été découverts en testant le tuto en live le 13 mars 2026.

---

# Récapitulatif : les outils de la chaîne 🔧

| Étape | Outil Java | Outil PHP | Rôle |
|-------|-----------|-----------|------|
| **Secrets** | Gitleaks | Gitleaks | Bloque les tokens/mots de passe |
| **SAST** | Bearer | Bearer | Failles dans le code source (XSS, SQLi, secrets...) |
| **SCA** | OWASP Dep-Check | Composer audit | CVE dans les dépendances |
| **Image Docker** | Trivy | Trivy | CVE dans l'image finale |
| **Dépendances** | Renovate | Renovate | MR auto quand dépendance obsolète |

---

**Pipeline = filet de sécurité à 4 couches :**
```
Code pushé
    │
    ▼ 1. Secret hardcodé ? → STOP immédiat
    ▼ 2. Faille dans le code (XSS, injection...) ? → STOP
    ▼ 3. CVE dans les dépendances ? → STOP
    ▼ 4. CVE dans l'image Docker ? → STOP
    ▼
✅ Déploiement autorisé
```

---

# En résumé : Module 10 📝

- **Chemin A** = **gitlab.com** + Runner local → `.gitlab-ci.yml` — léger, pas de GitLab à héberger
- **Chemin B** = **tout self-hosted** (GitLab + Jenkins dans Docker) → `Jenkinsfile` dans le repo
- **Ne pas mélanger** Runner GitLab et Jenkins pour le même projet — ils font le même travail
- **Chemin B : RAM minimum 6 GiB** à allouer à Docker (GitLab seul en consomme ~3 GiB)
- **`external_url 'http://gitlab.local'`** — jamais `localhost:8080` (crash Puma)
- **Webhook Chemin B** = `http://jenkins:8080/project/...` — nom Docker, port interne, pas localhost
- **Credentials Jenkins** = Username/Password (root + mdp GitLab), pas "GitLab API Token"
- **`entrypoint: [""]`** — obligatoire sur Gitleaks et Bearer dans GitLab CI et Jenkinsfile
- **Bearer** — exit code 1 automatique sur findings (pas de `--error` à ne pas oublier)
- **Gitleaks scanne l'historique** — supprimer le fichier ne suffit pas, il faut révoquer la clé
