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

**Ce qu'on va construire — deux chemins :**

| | Chemin A | Chemin B |
|--|----------|----------|
| **Outil CI** | GitLab CI + Runner | Jenkins |
| **Déclenché par** | Push sur GitLab | Webhook GitLab → Jenkins |
| **Config pipeline** | `.gitlab-ci.yml` | `Jenkinsfile` |
| **Runner GitLab** | ✅ Nécessaire | ❌ Inutile — Jenkins joue ce rôle |
| **Difficulté** | ⭐⭐ Simple | ⭐⭐⭐ Intermédiaire |

> **Règle d'or :** Runner GitLab et Jenkins font le **même travail** (exécuter les pipelines). On choisit l'un **OU** l'autre, jamais les deux en même temps pour le même projet.

---

# C'est quoi Docker ? (pour ceux qui ne connaissent pas) 🐳

> **Analogie :** Docker, c'est comme des **appartements préfabriqués en kit**. Au lieu de construire une maison de A à Z (installer Linux, puis Java, puis GitLab...), tu télécharges une boîte déjà prête qui contient tout. Tu la poses sur ta machine, elle démarre, et tu l'utilises. Quand tu n'en veux plus, tu la supprimes sans laisser de trace.

**Concepts clés :**

| Terme | Analogie | Explication |
|-------|----------|-------------|
| **Image** | Le plan de l'appartement | Le fichier de référence (ex: `gitlab/gitlab-ce`) |
| **Conteneur** | L'appartement construit | L'image qui tourne sur ta machine |
| **Docker Compose** | Le lotissement entier | Plusieurs conteneurs qui se parlent |
| **Volume** | Le garde-meuble | Les données qui persistent si on relance |

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

```
Docker Desktop → Settings → Resources → Memory → 6144 MB minimum
```

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

| RAM machine | Alloué à Docker | Solution |
|-------------|-----------------|----------|
| **≥ 16 GB** | 8 GB | ✅ **Chemin A ou B** — tout en local |
| **12-15 GB** | 6-8 GB | ✅ **Chemin A ou B** — lent au 1er démarrage |
| **8-11 GB** | Max 5 GB | ⚠️ **Chemin B uniquement** — Jenkins seul en local |
| **< 8 GB** | Insuffisant | ❌ Utiliser gitlab.com + Jenkins sur [play-with-docker.com](https://labs.play-with-docker.com/) |

---

# ═══════════════════════════════════
# CHEMIN A — GitLab CI + Runner
# `.gitlab-ci.yml` exécuté par le Runner
# ═══════════════════════════════════

---

# Chemin A : architecture 🏗️

> **Analogie :** GitLab est le chef de chantier. Le Runner est l'ouvrier sur le terrain. Quand tu pousses du code, GitLab dit au Runner "exécute ce pipeline". Jenkins n'intervient pas du tout.

```
┌─────────────────────────────────────────────┐
│              Docker Compose — Chemin A       │
│                                              │
│  ┌─────────────┐    ┌──────────────────┐    │
│  │  GitLab CE  │───►│  GitLab Runner   │    │
│  │  port 8080  │    │  (exécute la CI) │    │
│  └─────────────┘    └──────────────────┘    │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │  Renovate (optionnel, cron)          │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Ce qu'on n'installe PAS dans ce chemin : Jenkins.**  
Le Runner GitLab suffit pour exécuter `.gitlab-ci.yml`.

---

# Chemin A : docker-compose.yml 🗂️

```yaml
# devsecops-lab/docker-compose.yml — CHEMIN A (GitLab CI + Runner)
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

```yaml
  gitlab-runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: unless-stopped
    volumes:
      - runner-config:/etc/gitlab-runner
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - devsecops-net
    depends_on:
      - gitlab

  renovate:                         # optionnel — MR auto pour les dépendances
    image: renovate/renovate:latest
    environment:
      - RENOVATE_PLATFORM=gitlab
      - RENOVATE_ENDPOINT=http://gitlab/api/v4
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
  runner-config:

networks:
  devsecops-net:
    driver: bridge
```

---

# Chemin A : lancer et configurer 🚀

```bash
docker compose up -d

# Attendre ~3-5 min que GitLab soit prêt
until [ "$(docker inspect gitlab --format='{{.State.Health.Status}}')" = "healthy" ]; do
  echo "$(date +%H:%M:%S) — en attente..." && sleep 30
done && echo "✅ GitLab prêt !"

# Mot de passe root
docker exec gitlab cat /etc/gitlab/initial_root_password | grep Password:
```

**Enregistrer le Runner** (après avoir créé un token dans GitLab → Admin → Runners) :

```bash
docker exec gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "http://gitlab" \
  --token "glrt-VOTRE_TOKEN" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --docker-network-mode "devsecops-lab_devsecops-net" \
  --description "docker-runner"
```

> `devsecops-lab` = nom du dossier. Vérifier avec `docker network ls | grep devsecops`.

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
  allow_failure: false  # security gate bloquant

sast-semgrep:
  stage: sast
  image:
    name: returntocorp/semgrep:latest
    entrypoint: [""]    # ⚠️ obligatoire — même raison
  script:
    - semgrep --config=p/php --config=p/owasp-top-ten --error .
    #                                                  ^^^^^^
    #   Sans --error, Semgrep retourne exit 0 même avec des failles !
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

sast:
  stage: sast
  image:
    name: returntocorp/semgrep:latest
    entrypoint: [""]
  script:
    - semgrep --config=p/java --config=p/owasp-top-ten --error .
  allow_failure: false
```

---

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

# ═══════════════════════════════════
# CHEMIN B — GitLab + Jenkins
# `Jenkinsfile` exécuté par Jenkins
# ═══════════════════════════════════

---

# Chemin B : architecture 🏗️

> **Analogie :** GitLab est la sonnette d'alarme. Jenkins est le vigile qui patrouille. Quand quelqu'un pousse du code (ding !), GitLab envoie un webhook à Jenkins, Jenkins récupère le code et exécute le `Jenkinsfile`. Le Runner GitLab n'existe pas — Jenkins prend toute la place.

```
┌─────────────────────────────────────────────┐
│              Docker Compose — Chemin B       │
│                                              │
│  ┌─────────────┐  webhook  ┌─────────────┐  │
│  │  GitLab CE  │──────────►│   Jenkins   │  │
│  │  port 8080  │           │  port 9090  │  │
│  └─────────────┘           └─────────────┘  │
│                                              │
│  Pas de gitlab-runner ici !                 │
│  Jenkins = l'exécuteur des pipelines        │
└─────────────────────────────────────────────┘
```

---

# Chemin B : docker-compose.yml 🗂️

```yaml
# devsecops-lab/docker-compose.yml — CHEMIN B (GitLab + Jenkins)
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

```yaml
  jenkins:
    image: jenkins/jenkins:lts-jdk17
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

  # Pas de gitlab-runner ici — Jenkins remplace le Runner

volumes:
  gitlab-config:
  gitlab-logs:
  gitlab-data:
  jenkins-data:

networks:
  devsecops-net:
    driver: bridge
```

> **La différence avec le Chemin A :** `gitlab-runner` est retiré, `jenkins` est ajouté. Le volume `runner-config` disparaît, `jenkins-data` le remplace.

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

**Étape 1 : Dans Jenkins — créer le pipeline**

```
New Item → "php-devsecops-demo" → Multibranch Pipeline

Branch Sources → Add Source → Git
  → Project Repository : http://gitlab/root/php-devsecops-demo.git
  → Credentials        : gitlab-token (créé ci-dessus)

Scan Multibranch Pipeline Triggers
  → Interval : 1 minute
  → Save
```

**Étape 2 : Dans GitLab — créer le webhook**

```
GitLab → Projet → Settings → Webhooks → Add new webhook
  → URL   : http://jenkins:9090/project/php-devsecops-demo
  → Trigger : Push events + Merge request events
  → Add webhook
```

> **Jenkins détecte automatiquement** toutes les branches qui contiennent un `Jenkinsfile` et crée un pipeline par branche. Chaque push déclenche le webhook → Jenkins démarre immédiatement.

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

        stage('🔍 SAST — Semgrep PHP') {
            steps {
                script {
                    docker.image('returntocorp/semgrep:latest').inside('--entrypoint=""') {
                        sh 'semgrep --config=p/php --config=p/owasp-top-ten --error .'
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
                    docker.image('composer:2.7').inside {
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

        stage('🔍 SAST — Semgrep Java') {
            steps {
                script {
                    docker.image('returntocorp/semgrep:latest').inside('--entrypoint=""') {
                        sh 'semgrep --config=p/java --config=p/owasp-top-ten --error .'
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

**→ Sur GitLab self-hosted : Renovate est le seul choix.**

**Disponible dans les deux chemins** (ajouter au docker-compose avec `profiles: [renovate]`) :

```bash
RENOVATE_GITLAB_TOKEN=glpat-xxx docker compose --profile renovate run --rm renovate
```

---

# Comparatif Chemin A vs Chemin B 🆚

> **Analogie :** Chemin A = voiture automatique, facile à prendre en main. Chemin B = voiture manuelle avec plus d'options mais plus de configuration.

| Critère | Chemin A — GitLab CI | Chemin B — Jenkins |
|---------|---------------------|--------------------|
| **Composants** | GitLab + Runner | GitLab + Jenkins |
| **Config pipeline** | `.gitlab-ci.yml` | `Jenkinsfile` (Groovy) |
| **RAM nécessaire** | GitLab (~3 GB) + Runner (~30 MB) | GitLab (~3 GB) + Jenkins (~800 MB) |
| **Résultats visibles** | Directement dans GitLab | Dans l'interface Jenkins |
| **Plugins disponibles** | ~30 natifs | 1800+ |
| **Courbe d'apprentissage** | ⭐⭐ Faible | ⭐⭐⭐ Moyenne |
| **Usage** | Startups, projets agiles | Entreprises, pipelines complexes |

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

**2. `entrypoint: [""]` — obligatoire sur Gitleaks et Semgrep**
```yaml
# ❌ Crash : "Error: unknown command sh for gitleaks"
image: zricethezav/gitleaks:latest

# ✅ Correct
image:
  name: zricethezav/gitleaks:latest
  entrypoint: [""]
```

---

**3. `--error` — obligatoire sur Semgrep**
```bash
# ❌ Retourne exit 0 même avec des failles → pipeline vert à tort !
semgrep --config=p/php .

# ✅ Retourne exit 1 si findings bloquants
semgrep --config=p/php --error .
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
| **SAST** | Semgrep | Semgrep | Failles dans le code source |
| **SCA** | OWASP Dep-Check | Composer audit | CVE dans les dépendances |
| **Image Docker** | Trivy | Trivy | CVE dans l'image finale |
| **Dépendances** | Renovate | Renovate | MR auto quand dépendance obsolète |

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

- **Chemin A** = GitLab + **Runner** → `.gitlab-ci.yml` — simple, tout dans GitLab
- **Chemin B** = GitLab + **Jenkins** → `Jenkinsfile` — Runner inutile, Jenkins remplace le Runner
- **Ne pas mélanger** Runner GitLab et Jenkins pour le même projet — ils font le même travail
- **RAM minimum** : 6 GiB alloués à Docker (testé en live)
- **`external_url 'http://gitlab.local'`** — jamais `localhost:8080` (crash Puma)
- **`entrypoint: [""]`** — obligatoire sur Gitleaks et Semgrep dans GitLab CI
- **`--error`** — obligatoire sur Semgrep, sinon exit 0 même avec des failles
- **Gitleaks scanne l'historique** — supprimer le fichier ne suffit pas, il faut révoquer la clé
- **Renovate** = seul outil de MR automatique sur GitLab self-hosted
