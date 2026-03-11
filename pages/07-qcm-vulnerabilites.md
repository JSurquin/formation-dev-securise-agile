---

# QCM Module 7 : Suivi, audit et gestion des risques agiles ✅

**10 questions pour valider vos acquis**

---

# Question 1

Qu'est-ce que la surveillance continue de la sécurité ?

A) Un audit annuel réalisé par un prestataire externe

B) La mise en place d'outils qui détectent en temps réel les comportements anormaux et les nouvelles CVE

C) Une réunion mensuelle de l'équipe sécurité

D) Un scan manuel hebdomadaire des logs

---

# Question 2

Quel est le format d'un identifiant CVE ?

A) VULN-NUMÉRO

B) CVE-ANNÉE-NUMÉRO

C) SEC-ID-NUMÉRO

D) BUG-ANNÉE

---

# Question 3

Le score CVSS seul suffit-il à prioriser une vulnérabilité ?

A) Oui, c'est la seule métrique nécessaire

B) Non, il faut aussi croiser avec l'exposition en prod et l'existence d'un exploit public

C) Oui, si le score dépasse 5.0

D) Non, seul l'impact business compte

---

# Question 4

Qu'est-ce que la Sprint Security Review ?

A) Un audit de sécurité annuel commandé par la direction

B) Une vérification légère de la sécurité réalisée à chaque fin de sprint par le Security Champion

C) Un test de pénétration réalisé avant chaque déploiement

D) Une réunion entre le RSSI et le PO

---

# Question 5

Que signifie PDCA dans le contexte de l'amélioration continue de la sécurité ?

A) Patch, Deploy, Control, Audit

B) Plan, Do, Check, Act

C) Prevent, Detect, Contain, Analyze

D) Prioritize, Develop, Check, Approve

---

# Question 6

Quel est le MTTR ?

A) Maximum Time To Release

B) Mean Time To Remediate : temps moyen pour corriger une vulnérabilité

C) Minimum Test To Run

D) Mean Time To Rollback

---

# Question 7

Quelle donnée ne devrait JAMAIS apparaître dans les logs applicatifs ?

A) Les codes d'erreur HTTP

B) Les timestamps des requêtes

C) Les mots de passe et données personnelles des utilisateurs

D) Les noms des endpoints appelés

---

# Question 8

Quelle est la bonne approche pour les données de test dans un environnement de staging ?

A) Utiliser les vraies données de production pour des tests réalistes

B) Utiliser des données fictives ou anonymisées

C) Dupliquer la base de prod intégralement

D) Ne pas utiliser de données de test

---

# Question 9

Qu'est-ce qu'un post-mortem "blameless" ?

A) Un rapport qui identifie le développeur responsable de la faille

B) Une analyse d'incident qui cherche à améliorer les processus sans blâmer les individus

C) Un document confidentiel réservé au management

D) Un rapport uniquement pour les incidents critiques

---

# Question 10

Selon le principe du Privacy by Design (RGPD), quand faut-il intégrer la protection des données ?

A) Après la mise en production, lors du premier audit

B) Dès la conception, dans les User Stories et le backlog

C) Uniquement si l'entreprise traite des données bancaires

D) Une fois par an lors de la revue de conformité

---

# Réponses du Module 7 📝

**Réponse 1 :** B) Outils qui détectent en temps réel
- Dependabot, Snyk, SIEM — la sécurité ne s'arrête pas au déploiement

**Réponse 2 :** B) CVE-ANNÉE-NUMÉRO
- Exemple : CVE-2021-44228 (Log4Shell, score 10.0)

**Réponse 3 :** B) Non, croiser avec l'exposition et l'exploit public
- Une CVE 9.0 non exposée en prod est moins urgente qu'une CVE 7.0 exploitée activement

**Réponse 4 :** B) Vérification légère à chaque fin de sprint
- Réalisée en 30-60 min par le Security Champion + 1 dev

**Réponse 5 :** B) Plan, Do, Check, Act
- Le cycle PDCA est la base de l'amélioration continue en sécurité agile

---

# Réponses du Module 7 (suite) 📝

**Réponse 6 :** B) Mean Time To Remediate
- Objectif : < 24h pour les critiques, < 7j pour les hautes

**Réponse 7 :** C) Mots de passe et données personnelles
- Violation RGPD + risque de fuite si les logs sont accessibles

**Réponse 8 :** B) Données fictives ou anonymisées
- Les données réelles en staging = risque de fuite + violation RGPD

**Réponse 9 :** B) Améliorer les processus sans blâmer
- Analogie : l'enquête après un crash d'avion cherche les défaillances système

**Réponse 10 :** B) Dès la conception, dans les User Stories
- Art. 25 RGPD : Privacy by Design et Privacy by Default

---

# Score du Module 7 📊

Comptez vos bonnes réponses :

- **9-10** : Excellent ! ⭐⭐⭐
- **7-8** : Bien ! ⭐⭐
- **5-6** : À revoir ⭐
- **< 5** : Relire le module 7
