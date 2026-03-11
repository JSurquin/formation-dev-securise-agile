---

# QCM Module 6 : Pratiques de sécurité dans les outils agiles ✅

**10 questions pour valider vos acquis**

---

# Question 1

Pourquoi faut-il des configurations séparées entre les environnements dev, staging et prod ?

A) Pour aller plus vite en développement

B) Pour éviter qu'une compromission de staging donne accès à la prod

C) Pour économiser de l'espace disque

D) Les configurations séparées sont inutiles

---

# Question 2

Où stocker les secrets (clés API, mots de passe) utilisés dans un pipeline CI/CD ?

A) Dans le fichier YAML du pipeline

B) Dans un fichier `.env` commité sur git

C) Dans les variables chiffrées du CI (GitHub Secrets, GitLab CI Variables, Vault)

D) En commentaire dans le code source

---

# Question 3

Qu'est-ce qu'une Security Gate dans un pipeline CI/CD ?

A) Un pare-feu réseau

B) Un point de contrôle qui bloque le déploiement si une vulnérabilité critique est détectée

C) Un certificat SSL

D) Une étape de revue manuelle obligatoire

---

# Question 4

Quel outil permet de détecter des secrets commités dans un repo git ?

A) ESLint

B) Gitleaks

C) Jest

D) Webpack

---

# Question 5

Dans un Jenkinsfile, comment s'appelle le bloc qui définit les étapes du pipeline ?

A) `jobs`

B) `steps`

C) `stages`

D) `tasks`

---

# Question 6

Quel est l'avantage du multi-stage build dans un Dockerfile ?

A) Le build est plus rapide

B) L'image finale ne contient pas les outils de build, elle est plus petite et moins exposée

C) Il ajoute automatiquement la sécurité

D) Il permet de lancer plusieurs conteneurs

---

# Question 7

Quel outil scanne les images Docker à la recherche de CVE ?

A) SonarQube

B) Trivy

C) npm audit

D) ESLint

---

# Question 8

Quelle est la bonne pratique concernant l'utilisateur d'exécution dans un conteneur Docker ?

A) Utiliser root pour simplifier les permissions

B) Utiliser un utilisateur non-root dédié à l'application

C) Utiliser l'utilisateur de l'hôte

D) Peu importe, le conteneur est isolé

---

# Question 9

Dans GitLab CI, que fait l'option `allow_failure: false` ?

A) Elle ignore les erreurs de cette étape

B) Elle fait échouer tout le pipeline si cette étape échoue

C) Elle relance automatiquement l'étape en cas d'erreur

D) Elle envoie un email en cas d'erreur

---

# Question 10

Quand une vulnérabilité est détectée par la CI/CD dans un contexte agile, quelle est la bonne réaction ?

A) L'ignorer et déployer quand même

B) Créer un ticket dans le backlog, prioriser selon le CVSS, corriger dans le sprint approprié

C) Supprimer le scan pour débloquer le pipeline

D) Attendre le prochain audit trimestriel

---

# Réponses du Module 6 📝

**Réponse 1 :** B) Éviter qu'une compromission de staging donne accès à la prod
- Des credentials partagés = une seule brèche pour tout compromettre

**Réponse 2 :** C) Variables chiffrées du CI
- Jamais de secrets dans le code ou les fichiers de config versionnés

**Réponse 3 :** B) Point de contrôle qui bloque sur les vulnérabilités critiques
- Analogie : le contrôle du passeport — si invalide, on ne passe pas

**Réponse 4 :** B) Gitleaks
- Il scanne l'historique git et détecte les patterns de secrets

**Réponse 5 :** C) `stages`
- La structure Jenkinsfile : `pipeline > stages > stage > steps`

---

# Réponses du Module 6 (suite) 📝

**Réponse 6 :** B) Image plus petite sans outils de build
- Le multi-stage sépare la phase de build de l'image finale livrée

**Réponse 7 :** B) Trivy
- Trivy scanne images Docker, systèmes de fichiers et repos git

**Réponse 8 :** B) Utilisateur non-root dédié
- Si l'appli est compromise, l'attaquant n'a pas les droits root sur l'hôte

**Réponse 9 :** B) Fait échouer tout le pipeline
- C'est ce qui implémente le "security gate" en GitLab CI

**Réponse 10 :** B) Ticket backlog + priorisation CVSS + correction dans le sprint
- La CI/CD alimente le backlog sécurité de l'équipe Scrum

---

# Score du Module 6 📊

Comptez vos bonnes réponses :

- **9-10** : Excellent ! ⭐⭐⭐
- **7-8** : Bien ! ⭐⭐
- **5-6** : À revoir ⭐
- **< 5** : Relire le module 6
