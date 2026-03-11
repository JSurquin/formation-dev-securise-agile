---

# QCM Module 6 : Pratiques de sécurité dans les outils agiles ✅

**10 questions pour valider vos acquis**

---

# Question 1

Pourquoi faut-il des configurations séparées entre dev, staging et prod ?

A) Pour aller plus vite en développement

B) Pour éviter qu'une compromission de staging donne accès aux credentials de prod

C) Pour économiser de l'espace disque

D) Les configurations séparées sont inutiles

---

# Question 2

Où stocker les secrets dans un pipeline GitLab CI ?

A) Dans le fichier `.gitlab-ci.yml`

B) Dans un fichier `.env` commité sur git

C) Dans GitLab CI Variables (Settings → CI/CD → Variables)

D) En commentaire dans le code source

---

# Question 3

Dans GitLab CI, que fait l'option `allow_failure: false` sur un job de sécurité ?

A) Elle ignore les erreurs de ce job

B) Elle fait échouer tout le pipeline si ce job échoue, bloquant les stages suivants

C) Elle relance le job automatiquement

D) Elle envoie un email d'alerte

---

# Question 4

Quelle option GitLab CI Variable garantit que la valeur n'apparaît jamais dans les logs ?

A) Protected

B) Masked

C) Hidden

D) Encrypted

---

# Question 5

Dans quel ordre les stages d'un pipeline DevSecOps doivent-ils s'exécuter ?

A) deploy → build → sast → secrets

B) secrets → sast → sca → build → deploy

C) build → deploy → sast → secrets

D) sca → deploy → secrets → sast

---

# Question 6

Quel outil scanne les images Docker à la recherche de CVE ?

A) SonarQube

B) Semgrep

C) Trivy

D) npm audit

---

# Question 7

Quelle condition GitLab CI permet de déployer uniquement sur la branche `main` ?

A) `only: [main]` ou `rules: if: $CI_COMMIT_BRANCH == "main"`

B) `branch: main`

C) `when: main`

D) `filter: main`

---

# Question 8

Quelle est la bonne pratique concernant l'utilisateur dans un conteneur Docker ?

A) Utiliser root pour simplifier les permissions

B) Utiliser un utilisateur non-root dédié à l'application

C) Utiliser l'utilisateur de l'hôte

D) Peu importe, le conteneur est isolé

---

# Question 9

Quel est l'avantage du multi-stage build dans un Dockerfile ?

A) Le build est plus rapide

B) L'image finale est plus petite et ne contient pas les outils de build

C) Il ajoute automatiquement un scan de sécurité

D) Il permet de lancer plusieurs services

---

# Question 10

Quand GitLab CI détecte une vuln dans le pipeline d'un projet Scrum, quelle est la bonne réaction ?

A) Supprimer le job de scan pour débloquer le pipeline

B) Créer une Issue GitLab, la prioriser selon le CVSS, et la traiter dans le sprint approprié

C) Ignorer si l'application fonctionne correctement en dev

D) Attendre le prochain audit trimestriel

---

# Réponses du Module 6 📝

**Réponse 1 :** B) Éviter la compromission croisée staging → prod
- Des credentials partagés = une seule brèche pour tout compromettre

**Réponse 2 :** C) GitLab CI Variables
- Settings → CI/CD → Variables → Masked + Protected

**Réponse 3 :** B) Fait échouer tout le pipeline
- C'est ce qui implémente le "security gate" en GitLab CI

**Réponse 4 :** B) Masked
- La valeur n'apparaît jamais dans les logs, même en cas d'erreur

**Réponse 5 :** B) secrets → sast → sca → build → deploy
- On détecte les problèmes le plus tôt possible, avant même de builder

---

# Réponses du Module 6 (suite) 📝

**Réponse 6 :** C) Trivy
- Trivy scanne images Docker, systèmes de fichiers et repos git

**Réponse 7 :** A) `only: [main]` ou `rules: if: $CI_COMMIT_BRANCH == "main"`
- `rules:` est la syntaxe moderne recommandée par GitLab

**Réponse 8 :** B) Utilisateur non-root dédié
- Si l'appli est compromise, l'attaquant n'a pas les droits root sur l'hôte

**Réponse 9 :** B) Image plus petite sans outils de build
- Le multi-stage sépare la phase de compilation de l'image finale livrée

**Réponse 10 :** B) Issue GitLab + priorisation CVSS + sprint
- Le pipeline alimente les Issues GitLab = backlog sécurité de l'équipe

---

# Score du Module 6 📊

Comptez vos bonnes réponses :

- **9-10** : Excellent ! ⭐⭐⭐
- **7-8** : Bien ! ⭐⭐
- **5-6** : À revoir ⭐
- **< 5** : Relire le module 6
