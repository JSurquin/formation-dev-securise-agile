---
layout: new-section
---

# ✅ QCM — Module 10
## Chaîne DevSecOps complète

---

# QCM 1/8 — Docker 🐳

**Question :** Quelle commande permet de lancer tous les conteneurs définis dans un `docker-compose.yml` en arrière-plan ?

<v-clicks>

- A) `docker run -d`
- B) `docker compose up -d` ✅
- C) `docker start all`
- D) `docker compose start --background`

**✅ Réponse : B**

> `-d` = detached mode = en arrière-plan. Sans `-d`, les logs s'affichent dans votre terminal et les conteneurs s'arrêtent quand vous fermez le terminal.

</v-clicks>

---

# QCM 2/8 — Renovate vs Dependabot 🔄

**Question :** Pourquoi utilise-t-on Renovate plutôt que Dependabot sur un GitLab self-hosted ?

<v-clicks>

- A) Renovate est plus rapide
- B) Dependabot est réservé à GitHub, indisponible sur GitLab self-hosted ✅
- C) Renovate est gratuit, Dependabot est payant
- D) Dependabot ne gère pas Maven

**✅ Réponse : B**

> Dependabot est un service GitHub. GitLab.com a son propre système similaire, mais sur une instance GitLab self-hosted, seul Renovate fonctionne pleinement pour l'automatisation des dépendances.

</v-clicks>

---

# QCM 3/8 — SAST Java 🔍

**Question :** Quel outil utilise-t-on pour faire du SAST (analyse statique) sur du code Java dans nos pipelines ?

<v-clicks>

- A) Trivy
- B) Composer audit
- C) Bearer ✅
- D) Gitleaks

**✅ Réponse : C**

> **Bearer** (`bearer scan .`) analyse le code source Java et PHP pour détecter les failles (XSS, SQLi, secrets hardcodés...) en suivant le **flux des données**. Il retourne automatiquement un exit code 1 sur findings — contrairement à Semgrep qui nécessitait `--error`. Trivy scanne les images Docker, Gitleaks cherche les secrets, Composer audit est pour les CVE sur les dépendances PHP.

</v-clicks>

---

# QCM 4/8 — Security Gate ⛔

**Question :** Dans un `.gitlab-ci.yml`, quelle option rend un job **bloquant** (le pipeline s'arrête si ce job échoue) ?

<v-clicks>

- A) `blocking: true`
- B) `mandatory: true`
- C) `allow_failure: false` ✅
- D) `fail_fast: true`

**✅ Réponse : C**

> `allow_failure: false` est la valeur **par défaut** dans GitLab CI. Si vous voulez qu'un job soit non-bloquant (juste un avertissement), c'est `allow_failure: true` qu'il faut expliciter.

</v-clicks>

---

# QCM 5/8 — Multi-stage Docker 🏗️

**Question :** Quel est l'avantage principal d'un Dockerfile multi-stage ?

<v-clicks>

- A) Le build est plus rapide
- B) L'image finale est plus légère car elle ne contient que le nécessaire ✅
- C) On peut utiliser plusieurs langages en même temps
- D) Ça permet d'éviter les permissions root

**✅ Réponse : B**

> Le multi-stage permet de compiler dans une image lourde (avec Maven, npm...) et de copier uniquement le résultat compilé dans une image finale légère. Moins de packages = moins de surface d'attaque pour Trivy.

</v-clicks>

---

# QCM 6/8 — SCA PHP 📦

**Question :** Quelle commande permet d'auditer les dépendances Composer d'un projet PHP pour trouver des CVE ?

<v-clicks>

- A) `composer check`
- B) `composer security`
- C) `composer audit` ✅
- D) `php audit`

**✅ Réponse : C**

> `composer audit` (disponible depuis Composer 2.4) interroge la base de données Packagist Security Advisories et liste les CVE connues dans vos dépendances. Équivalent de `npm audit` pour PHP.

</v-clicks>

---

# QCM 7/8 — Ordre des stages ⚙️

**Question :** Pourquoi le stage `secrets` doit-il être le **premier** dans un pipeline DevSecOps ?

<v-clicks>

- A) C'est une convention, l'ordre n'a pas d'importance
- B) Pour éviter de faire tourner des scans coûteux si un secret est déjà exposé ✅
- C) Gitleaks ne fonctionne qu'en premier stage
- D) GitLab exige cet ordre

**✅ Réponse : B**

> **Principe "fail fast"** : si un mot de passe est committé dans le code, inutile de builder une image Docker ou de faire du SAST. On arrête immédiatement, on évite de perdre du temps (et des minutes CI/CD).

</v-clicks>

---

# QCM 8/8 — Jenkins vs GitLab CI 🆚

**Question :** Dans quel cas est-il pertinent d'utiliser Jenkins **plutôt que** la CI/CD GitLab native ?

<v-clicks>

- A) Quand on veut des pipelines plus simples
- B) Quand on a besoin de plugins très spécifiques ou d'intégrations d'outils enterprise ✅
- C) Quand on a moins de 16 GB de RAM
- D) Quand on utilise PHP

**✅ Réponse : B**

> GitLab CI couvre 95% des besoins avec sa CI native. Jenkins devient pertinent quand on a besoin des 1800+ plugins disponibles (SonarQube, Nexus, outils legacy enterprise) ou quand l'organisation utilise déjà Jenkins pour plusieurs plateformes de code (GitHub + GitLab + Bitbucket).

</v-clicks>

---

# Score QCM Module 10 🎯

| Score | Niveau |
|-------|--------|
| 8/8 | 🏆 Expert DevSecOps — prêt pour la prod |
| 6-7/8 | ✅ Bonne maîtrise — quelques points à revoir |
| 4-5/8 | 📚 Bases acquises — relire les slides clés |
| < 4/8 | 🔄 Relire le module depuis le début |

**Points clés à retenir :**
- Docker Compose = lotissement de conteneurs
- Renovate = seule option sur GitLab self-hosted
- `allow_failure: false` = security gate bloquant
- Ordre : secrets → SAST → SCA → build → scan image
