---

# QCM Module 2 : Intégration de la sécurité dans les projets agiles ✅

**10 questions pour valider vos acquis**

---

# Question 1

Que signifie AAA dans la gestion des accès ?

A) Agile, Automatisation, Audit

B) Authentification, Autorisation, Audit

C) Accès, Admin, Alerte

D) Application, Architecture, Analyse

---

# Question 2

Quel algorithme est recommandé pour stocker les mots de passe ?

A) MD5

B) SHA-1

C) Base64

D) Bcrypt ou Argon2

---

# Question 3

Qu'est-ce que le principe du moindre privilège ?

A) Donner les droits admin à tout le monde par défaut

B) Ne donner à chaque utilisateur que les accès strictement nécessaires

C) Supprimer tous les droits des utilisateurs

D) Partager les identifiants entre collègues

---

# Question 4

Quelle est la différence entre chiffrement symétrique et asymétrique ?

A) Le symétrique est plus sécurisé

B) Le symétrique utilise la même clé pour chiffrer et déchiffrer ; l'asymétrique utilise une paire de clés

C) L'asymétrique est uniquement pour les mots de passe

D) Le symétrique ne peut pas chiffrer les fichiers

---

# Question 5

Qu'est-ce qu'une Evil User Story ?

A) Une User Story rédigée par un développeur junior

B) Une story décrivant ce qu'un attaquant pourrait faire, avec une mitigation associée

C) Une User Story rejetée par le Product Owner

D) Une story avec un bug de sécurité connu

---

# Question 6

Quel score CVSS indique une vulnérabilité de sévérité haute ?

A) 0.1-3.9

B) 4.0-6.9

C) 7.0-8.9

D) 9.0-10.0

---

# Question 7

Quel critère de sécurité doit figurer dans la Definition of Done ?

A) Le design doit être validé par un designer UX

B) Aucun secret (clé API, mot de passe) ne doit être présent dans le code

C) Le code doit être écrit en TypeScript

D) Le sprint doit durer exactement 2 semaines

---

# Question 8

Qu'est-ce que le RBAC ?

A) Rapid Build And Compile

B) Role-Based Access Control : les droits sont attribués selon le rôle

C) Remote Backup And Cache

D) Un type d'attaque sur les API

---

# Question 9

Que signifie "Shift-Left Security" dans un sprint agile ?

A) Déplacer les tests de sécurité après la mise en production

B) Intégrer les contrôles de sécurité le plus tôt possible dans le cycle de développement

C) Confier la sécurité uniquement à l'équipe ops

D) Supprimer les sprints de sécurité

---

# Question 10

Quel est le rôle du Security Champion dans une équipe Scrum ?

A) Faire tous les pentests de l'application

B) Être le référent sécurité de l'équipe, faire la veille CVE et animer les revues de code sécurité

C) Remplacer l'équipe sécurité

D) Gérer les déploiements en production

---

# Réponses du Module 2 📝

**Réponse 1 :** B) Authentification, Autorisation, Audit
- Qui es-tu ? Que peux-tu faire ? Qu'as-tu fait ?

**Réponse 2 :** D) Bcrypt ou Argon2
- MD5 et SHA-1 sont cassables — bcrypt est conçu pour être lent à bruteforcer

**Réponse 3 :** B) Accès strictement nécessaires
- Un utilisateur (ou service) ne doit jamais avoir plus de droits que nécessaire

**Réponse 4 :** B) Même clé / paire de clés
- Symétrique (AES) = rapide, pour les données au repos. Asymétrique (RSA) = échanges sécurisés

**Réponse 5 :** B) Story décrivant un attaquant avec mitigation
- Pour chaque User Story, on écrit au moins 1 Evil User Story

---

# Réponses du Module 2 (suite) 📝

**Réponse 6 :** C) 7.0-8.9
- Haute = corriger dans la semaine. Critique (9.0-10.0) = 24-48h

**Réponse 7 :** B) Aucun secret dans le code
- Les clés API et mots de passe en dur sont une faille critique (A02 OWASP)

**Réponse 8 :** B) Role-Based Access Control
- Les droits sont liés au rôle (employé, manager, admin) pas à l'individu

**Réponse 9 :** B) Intégrer les contrôles de sécurité le plus tôt possible
- Plus tôt = moins cher à corriger (x1 en conception vs x100 en prod)

**Réponse 10 :** B) Référent sécurité de l'équipe
- Il n'est pas expert sécu à plein temps : c'est un dev avec ~20% de son temps dédié

---

# Score du Module 2 📊

Comptez vos bonnes réponses :

- **9-10** : Excellent ! ⭐⭐⭐
- **7-8** : Bien ! ⭐⭐
- **5-6** : À revoir ⭐
- **< 5** : Relire le module 2
