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

**Ce qu'on va construire :**
- Un environnement DevSecOps local (GitLab + Jenkins dans Docker)
- Un projet Java minimaliste avec pipeline sécurisé complet
- Un projet PHP minimaliste avec pipeline sécurisé complet
- La gestion automatique des mises à jour de dépendances (Renovate)

**Ce dont vous aurez besoin :**
- Docker Desktop installé sur votre machine
- 8 GB de RAM minimum (solution alternative si moins)
- 1h de patience pour la première installation 😄

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
→ Installer comme n'importe quel logiciel

**Étape 2 : Vérifier que ça fonctionne**

```bash
# Ouvrir un terminal et taper :
docker --version
# Résultat attendu : Docker version 27.x.x

docker compose version
# Résultat attendu : Docker Compose version v2.x.x
```

**Étape 3 : Augmenter la RAM allouée à Docker** ⚠️ CRITIQUE

> Docker Desktop → Settings → Resources → Memory → **6 GB minimum** (8 GB recommandé)

> **⚠️ Sur une machine de 8 GB de RAM totale :** Docker Desktop est limité à ~4 GB par défaut → GitLab crashe. Augmentez à 6 GB dans les settings Docker Desktop ou passez en **Solution B** (gitlab.com).

---

# Vérifier votre RAM disponible 🔍

> **Avant de lancer quoi que ce soit**, vérifiez que votre machine peut tenir la charge.

```bash
# Sur Windows (PowerShell) :
Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum

# Sur Mac :
system_profiler SPHardwareDataType | grep Memory

# Sur Linux :
free -h
```

**Résultats et solutions :**

| RAM machine | Docker Desktop alloué | Solution recommandée |
|-------------|----------------------|---------------------|
| **≥ 16 GB** | 8 GB+ à Docker | ✅ Docker Compose complet (GitLab + Jenkins local) |
| **12-15 GB** | 6-8 GB à Docker | ✅ Possible mais lent au 1er démarrage (~10 min) |
| **8-11 GB** | Max 4-5 GB à Docker | ⚠️ GitLab.com gratuit + Jenkins en Docker seul |
| **< 8 GB** | Insuffisant | ❌ GitLab.com gratuit + Jenkins sur [play-with-docker.com](https://labs.play-with-docker.com/) |

> **Testé en live (12 mars 2026) :** sur 8 GB de RAM avec Docker Desktop limité à ~4 GB, Puma (le serveur Rails de GitLab) crashe en boucle — pas assez de mémoire. Jenkins seul fonctionne parfaitement (383 MB RAM). L'interface gitlab.com est **identique** à un GitLab self-hosted pour 99% des usages pédagogiques.

---

# Solution A : 16 GB+ — Architecture complète 🏗️

> **Analogie :** Tu as un grand appartement, tu peux mettre tous les meubles.

```
┌─────────────────────────────────────────────┐
│              Docker Compose                  │
│                                              │
│  ┌─────────────┐    ┌──────────────────┐    │
│  │  GitLab CE  │    │    Jenkins LTS   │    │
│  │  port 8080  │◄──►│    port 9090     │    │
│  └──────┬──────┘    └──────────────────┘    │
│         │                                    │
│  ┌──────▼──────┐    ┌──────────────────┐    │
│  │GitLab Runner│    │    Renovate      │    │
│  │(CI/CD jobs) │    │  (cron, 1x/jour) │    │
│  └─────────────┘    └──────────────────┘    │
└─────────────────────────────────────────────┘
```

**GitLab** gère le code, les issues, la CI/CD légère.
**Jenkins** gère les pipelines complexes déclenchés par GitLab.
**Renovate** scanne les dépendances obsolètes chaque jour.

---

# Solution B : 8-15 GB — Version allégée 💡

> **Analogie :** Studio, mais bien équipé — on met l'essentiel.

```
┌──────────────────────────────────────────┐
│          gitlab.com (cloud gratuit)       │
│  400 min CI/CD/mois + Runner inclus       │
│  → Pas besoin de RAM locale pour GitLab  │
└─────────────────────────────────────────┘
              ▲
              │ webhook
              ▼
┌──────────────────────────────────────────┐
│         Docker sur votre machine          │
│  ┌─────────────────────────────────┐     │
│  │   Jenkins LTS (port 9090)       │     │
│  │   ~512 MB RAM                   │     │
│  └─────────────────────────────────┘     │
└──────────────────────────────────────────┘
```

**Avantage :** GitLab.com est **identique** à un GitLab self-hosted pour 99% des usages pédagogiques. L'interface est la même, les `.gitlab-ci.yml` sont les mêmes.

---

# Le docker-compose.yml complet (Solution A) 🗂️

> Créer un dossier `devsecops-lab/` et y créer ce fichier `docker-compose.yml`

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:18.9.2-ce.0
    container_name: gitlab
    hostname: gitlab.local
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://localhost:8080'
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
```

---

```yaml
  renovate:
    image: renovate/renovate:latest
    container_name: renovate
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
  jenkins-data:

networks:
  devsecops-net:
    driver: bridge
```

> **Note :** `profiles: [renovate]` → Renovate ne tourne pas en continu, on le lance manuellement avec `docker compose --profile renovate run --rm renovate`

---

# Lancer l'environnement 🚀

**Dans votre terminal, depuis le dossier `devsecops-lab/` :**

```bash
# Lancer GitLab + Runner + Jenkins en arrière-plan
docker compose up -d

# Vérifier que tout tourne
docker compose ps
```

**⚠️ GitLab met 3-5 minutes à démarrer la première fois** — c'est normal, ne pas paniquer.

```bash
# Surveiller le démarrage de GitLab
docker logs -f gitlab

# Quand vous voyez "gitlab Reconfigured!", GitLab est prêt
# Ouvrir : http://localhost:8080
```

**Récupérer le mot de passe root GitLab :**
```bash
docker exec gitlab cat /etc/gitlab/initial_root_password
```

---

# Configurer le GitLab Runner 🏃

> **Analogie :** Le Runner, c'est l'ouvrier de l'usine. GitLab lui donne les instructions, lui les exécute.

**Étape 1 : Dans GitLab, récupérer le token du Runner**
```
http://localhost:8080 → Admin Area → CI/CD → Runners → New instance runner
→ Copier le token (commence par "glrt-")
```

**Étape 2 : Enregistrer le Runner**
```bash
docker exec -it gitlab-runner gitlab-runner register \
  --non-interactive \
  --url "http://gitlab" \
  --token "glrt-VOTRE_TOKEN_ICI" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --docker-network-mode "devsecops-net" \
  --description "docker-runner"
```

**Étape 3 : Vérifier**
```
GitLab → Admin → Runners → votre runner doit apparaître en vert ✅
```

---

# Projet Java minimaliste : structure 📁

> **Analogie :** On va créer le projet le plus simple possible — une classe Java qui dit bonjour. L'objectif n'est pas le code, c'est le pipeline autour.

**Structure du projet `java-devsecops-demo/` :**
```
java-devsecops-demo/
├── pom.xml                    ← gestion des dépendances Maven
├── src/
│   └── main/
│       └── java/
│           └── com/demo/
│               └── App.java   ← notre "Hello World"
├── .gitlab-ci.yml             ← pipeline GitLab
├── Jenkinsfile                ← pipeline Jenkins
└── Dockerfile                 ← image Docker
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

---

# pom.xml du projet Java 📦

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>java-devsecops-demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Dépendance volontairement ancienne pour déclencher Renovate -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.12.0</version>
        </dependency>
    </dependencies>
</project>
```

---

# Dockerfile Java 🐳

```dockerfile
# Stage 1 : compilation avec Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -q -DskipTests

# Stage 2 : image finale légère (pas de Maven, pas de JDK complet)
FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/target/java-devsecops-demo-1.0.0.jar app.jar
USER appuser
ENTRYPOINT ["java", "-jar", "app.jar"]
```

> **Multi-stage :** l'image finale ne contient pas Maven ni le JDK complet (200 MB → 80 MB). Moins de surface d'attaque pour Trivy.

---

# Pipeline GitLab CI — Java (1/3) : secrets & SAST

```yaml
# .gitlab-ci.yml — Projet Java
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

# ── Stage 1 : Détecter les secrets ──────────────────────────
secrets-scan:
  stage: secrets
  image: zricethezav/gitleaks:latest
  script:
    - gitleaks detect --source . -v
  allow_failure: false
```

---

```yaml
# ── Stage 2 : SAST avec Semgrep ─────────────────────────────
sast:
  stage: sast
  image: returntocorp/semgrep:latest
  script:
    - semgrep --config=p/java --config=p/owasp-top-ten .
  allow_failure: false
```

---

# Pipeline GitLab CI — Java (2/3) : SCA & build

```yaml
# ── Stage 3 : SCA — dépendances vulnérables ─────────────────
sca-owasp:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn org.owasp:dependency-check-maven:check
        -DfailBuildOnCVSS=7
        -DsuppressionFile=.owasp-suppressions.xml
  artifacts:
    paths:
      - target/dependency-check-report.html
    when: always
  allow_failure: false

# ── Stage 4 : Compilation ────────────────────────────────────
build:
  stage: build
  image: maven:3.9-eclipse-temurin-17
  script:
    - mvn package -q -DskipTests
  artifacts:
    paths:
      - target/*.jar
```

---

# Pipeline GitLab CI — Java (3/3) : scan image Docker

```yaml
# ── Stage 5 : Build Docker + scan Trivy ─────────────────────
docker-build-scan:
  stage: scan-image
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t $APP_IMAGE .
    - |
      docker run --rm \
        -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy:latest image \
        --exit-code 1 \
        --severity CRITICAL,HIGH \
        $APP_IMAGE
  allow_failure: false
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

> **Résumé du pipeline Java :** 5 étapes, 4 security gates (`allow_failure: false`). Si un secret, une faille SAST, une CVE critique ou une vulnérabilité dans l'image est détecté → **le pipeline s'arrête**.

---

# Projet PHP minimaliste : structure 📁

> **Analogie :** Un site PHP simple — une page qui affiche un message. On va volontairement laisser une petite faille (XSS) pour que les outils la détectent.

**Structure du projet `php-devsecops-demo/` :**
```
php-devsecops-demo/
├── composer.json              ← gestion des dépendances PHP
├── public/
│   └── index.php              ← notre page PHP (avec XSS volontaire)
├── .gitlab-ci.yml             ← pipeline GitLab
├── Jenkinsfile                ← pipeline Jenkins
└── Dockerfile                 ← image Docker
```

**`public/index.php` :**
```php
<?php
// ⚠️ Faille XSS volontaire — à corriger dans l'exercice
$name = $_GET['name'] ?? 'World';
echo "<h1>Hello, " . $name . "!</h1>";

// ✅ Version sécurisée (commentée) :
// echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
?>
```

---

# composer.json du projet PHP 📦

```json
{
    "name": "demo/php-devsecops",
    "description": "Projet PHP DevSecOps demo",
    "type": "project",
    "require": {
        "php": ">=8.2",
        "symfony/http-foundation": "6.3.0"
    },
    "require-dev": {
        "phpstan/phpstan": "^1.10",
        "vimeo/psalm": "^5.15",
        "squizlabs/php_codesniffer": "^3.7"
    },
    "config": {
        "optimize-autoloader": true
    }
}
```

> La version `6.3.0` de Symfony est intentionnellement ancienne — Renovate va proposer une MR pour la mettre à jour.

---

# Dockerfile PHP 🐳

```dockerfile
# Stage 1 : installation des dépendances avec Composer
FROM composer:2.7 AS vendor
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader

# Stage 2 : image finale PHP-FPM + Nginx
FROM php:8.2-fpm-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=vendor /app/vendor ./vendor
COPY public/ ./public/
USER appuser
EXPOSE 9000
CMD ["php-fpm"]
```

---

# Pipeline GitLab CI — PHP (1/3) : secrets & SAST

```yaml
# .gitlab-ci.yml — Projet PHP
stages:
  - secrets
  - sast
  - sca
  - scan-image

variables:
  APP_IMAGE: "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"

# ── Stage 1 : Détecter les secrets ──────────────────────────
secrets-scan:
  stage: secrets
  image: zricethezav/gitleaks:latest
  script:
    - gitleaks detect --source . -v
  allow_failure: false

# ── Stage 2 : SAST PHP avec Psalm ───────────────────────────
sast-psalm:
  stage: sast
  image: php:8.2-cli
  script:
    - composer install --no-interaction -q
    - ./vendor/bin/psalm --show-info=false
  allow_failure: false
```

---

```yaml
# ── Stage 2bis : Semgrep pour OWASP sur PHP ─────────────────
sast-semgrep:
  stage: sast
  image: returntocorp/semgrep:latest
  script:
    - semgrep --config=p/php --config=p/owasp-top-ten .
  allow_failure: false
```

---

# Pipeline GitLab CI — PHP (2/3) : SCA

```yaml
# ── Stage 3 : SCA — Composer audit ──────────────────────────
sca-composer:
  stage: sca
  image: composer:2.7
  script:
    - composer install --no-interaction -q
    - composer audit
  allow_failure: false
  artifacts:
    paths:
      - composer-audit-report.json
    when: always
```

> **`composer audit`** (disponible depuis Composer 2.4) : interroge la base de données Packagist pour lister les CVE connues dans vos dépendances. Équivalent de `npm audit` pour PHP.

---

# Pipeline GitLab CI — PHP (3/3) : scan image Docker

```yaml
# ── Stage 4 : Build Docker + scan Trivy ─────────────────────
docker-build-scan:
  stage: scan-image
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t $APP_IMAGE .
    - |
      docker run --rm \
        -v /var/run/docker.sock:/var/run/docker.sock \
        aquasec/trivy:latest image \
        --exit-code 1 \
        --severity CRITICAL,HIGH \
        $APP_IMAGE
  allow_failure: false
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
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
| **Langages** | npm, Maven, Composer... | 80+ ecosystèmes |
| **Grouper les MR** | ❌ | ✅ (1 MR pour 10 deps) |

**→ Sur GitLab self-hosted : Renovate est le seul choix.**

---

# Configurer Renovate dans votre projet 📝

**Créer un fichier `renovate.json` à la racine du projet :**

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base"
  ],
  "assignees": ["votre-username-gitlab"],
  "labels": ["dependencies", "security"],
  "prConcurrentLimit": 3,
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security", "urgent"]
  },
  "packageRules": [
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true
    }
  ]
}
```

> **`automerge: true` sur les patchs** : les mises à jour de sécurité mineures (1.2.3 → 1.2.4) sont mergées automatiquement si la CI passe. Les mises à jour majeures attendent votre approbation.

---

# Lancer Renovate manuellement (self-hosted) ▶️

**Depuis le dossier `devsecops-lab/` :**

```bash
# Créer le fichier .env avec votre token GitLab
echo "RENOVATE_GITLAB_TOKEN=votre_personal_access_token" > .env

# Lancer Renovate (scanne tous vos projets GitLab)
docker compose --profile renovate run --rm renovate
```

**Ce que vous verrez dans GitLab après le scan :**

```
📦 Merge Requests créées automatiquement :
─────────────────────────────────────────
• Update symfony/http-foundation 6.3.0 → 7.1.5
• Update commons-lang3 3.12.0 → 3.14.0
• ⚠️ SECURITY: Update phpunit/phpunit (CVE-2024-xxxx)
```

> Chaque MR contient le changelog complet + les CVE corrigées + le lien vers le pipeline qui a tourné automatiquement.

---

# Jenkins : connexion à GitLab 🔗

> **Analogie :** Jenkins et GitLab se parlent via un webhook — comme une sonnette d'alarme. Quand quelqu'un pousse du code sur GitLab (ding !), GitLab appelle Jenkins (la sirène retentit) qui lance le pipeline.

**Étape 1 : Ouvrir Jenkins**
```
http://localhost:9090
```

**Récupérer le mot de passe initial Jenkins :**
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

**Étape 2 : Installer les plugins nécessaires**
```
Jenkins → Manage Jenkins → Plugins → Available plugins
→ Installer : "GitLab Plugin" + "Pipeline" + "Docker Pipeline"
→ Redémarrer Jenkins
```

**Étape 3 : Créer un Personal Access Token GitLab**
```
GitLab → User Settings → Access Tokens
→ Scopes : api, read_repository
→ Copier le token
```

---

# Jenkins : créer le pipeline Java 🏗️

**Dans Jenkins : New Item → Pipeline → Multibranch Pipeline**

```
Branch Sources → Add Source → Git
→ Project Repository : http://gitlab/votre-groupe/java-devsecops-demo.git
→ Credentials : ajouter votre token GitLab
→ Scan Multibranch Pipeline Triggers : cocher "Periodically" (1 min)
```

> Jenkins va automatiquement détecter toutes les branches qui contiennent un `Jenkinsfile` et créer un pipeline par branche.

---

# Jenkinsfile Java (1/2)

```groovy
// Jenkinsfile — Projet Java DevSecOps
pipeline {
    agent {
        docker {
            image 'maven:3.9-eclipse-temurin-17'
            args '-v /root/.m2:/root/.m2'
        }
    }

    environment {
        APP_NAME = 'java-devsecops-demo'
        APP_VERSION = '1.0.0'
    }

    stages {
        stage('🔑 Secrets Scan') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside {
                        sh 'gitleaks detect --source . -v'
                    }
                }
            }
        }

        stage('🔍 SAST — Semgrep') {
            steps {
                script {
                    docker.image('returntocorp/semgrep:latest').inside {
                        sh 'semgrep --config=p/java --config=p/owasp-top-ten .'
                    }
                }
            }
        }
```

---

```groovy
        stage('📦 SCA — OWASP Dependency Check') {
            steps {
                sh '''
                    mvn org.owasp:dependency-check-maven:check \
                        -DfailBuildOnCVSS=7 \
                        -q
                '''
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

        stage('🔨 Build') {
            steps {
                sh 'mvn package -q -DskipTests'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'target/*.jar'
                }
            }
        }
    }

    post {
        failure {
            echo '🔴 Pipeline échoué — vérifier les rapports de sécurité'
        }
        success {
            echo '✅ Tous les security gates passés !'
        }
    }
}
```

---

# Jenkinsfile PHP (1/2)

```groovy
// Jenkinsfile — Projet PHP DevSecOps
pipeline {
    agent any

    environment {
        APP_NAME = 'php-devsecops-demo'
    }

    stages {
        stage('🔑 Secrets Scan') {
            steps {
                script {
                    docker.image('zricethezav/gitleaks:latest').inside {
                        sh 'gitleaks detect --source . -v'
                    }
                }
            }
        }

        stage('🔍 SAST — Semgrep PHP') {
            steps {
                script {
                    docker.image('returntocorp/semgrep:latest').inside {
                        sh 'semgrep --config=p/php --config=p/owasp-top-ten .'
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

        stage('🐳 Docker Build & Trivy Scan') {
            steps {
                script {
                    def image = docker.build("${APP_NAME}:${env.BUILD_NUMBER}")
                    docker.image('aquasec/trivy:latest').inside(
                        '-v /var/run/docker.sock:/var/run/docker.sock'
                    ) {
                        sh """
                            trivy image \
                              --exit-code 1 \
                              --severity CRITICAL,HIGH \
                              ${APP_NAME}:${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }
    }

    post {
        failure {
            echo '🔴 Faille détectée — pipeline bloqué'
        }
    }
}
```

---

# Comparatif GitLab CI vs Jenkins 🆚

> **Analogie :** GitLab CI = une voiture automatique, facile à prendre en main. Jenkins = une voiture manuelle avec 200 options de personnalisation. Les deux vont au même endroit.

| Critère | GitLab CI | Jenkins |
|---------|-----------|---------|
| **Installation** | Aucune (cloud) ou 1 docker | 1 docker + plugins |
| **Config** | `.gitlab-ci.yml` dans le repo | `Jenkinsfile` dans le repo |
| **Interface** | Moderne, intégrée à GitLab | Classique, extensible |
| **Plugins** | ~30 intégrés natifs | 1800+ plugins |
| **Multi-langage** | ✅ | ✅ |
| **Courbe d'apprentissage** | Faible | Moyenne |
| **Usage recommandé** | Projets agiles, startups | Entreprises, pipelines complexes |

**→ Pour la formation :** on commence par GitLab CI (plus simple), on ajoute Jenkins quand on veut des pipelines plus riches.

---

# Récapitulatif : les outils de la chaîne 🔧

| Étape | Outil Java | Outil PHP | Rôle |
|-------|-----------|-----------|------|
| **Secrets** | Gitleaks | Gitleaks | Bloquer les tokens/mots de passe |
| **SAST** | Semgrep | Semgrep + Psalm | Failles dans le code |
| **SCA** | OWASP Dep-Check | Composer audit | CVE dans les dépendances |
| **Image Docker** | Trivy | Trivy | CVE dans l'image finale |
| **Dépendances** | Renovate | Renovate | MR auto quand dep obsolète |

**Pipeline = filet de sécurité à 4 couches :**
```
Code pushé
    │
    ▼ 1. Secrets ? → STOP
    ▼ 2. Failles dans le code ? → STOP
    ▼ 3. CVE dans les dépendances ? → STOP
    ▼ 4. CVE dans l'image Docker ? → STOP
    ▼
✅ Déploiement autorisé
```

---

# En résumé : Module 10 📝

- **Docker** = appartements préfabriqués. Docker Compose = le lotissement entier.
- **GitLab CE 17.x** self-hosted + **Jenkins LTS JDK17** → tout dans un `docker compose up`
- **Alternative 8-15 GB RAM** → gitlab.com gratuit (identique) + Jenkins en local
- **Renovate** = seule option viable pour les MR auto sur GitLab self-hosted (pas Dependabot)
- **Pipeline Java** : Gitleaks → Semgrep → OWASP Dep-Check → Build → Trivy
- **Pipeline PHP** : Gitleaks → Semgrep + Psalm → Composer audit → Trivy
- **Security gate** = `allow_failure: false` (GitLab CI) = `error { throw }` (Jenkins)
- **4 couches de sécurité** : secrets → SAST → SCA → image Docker → si tout vert → déploiement
