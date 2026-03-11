---
layout: new-section
routeAlias: 'qcm-final'
---

<a name="qcm-final" id="qcm-final"></a>

# ✅ QCM Final
## Validation des acquis — Développer de manière sécurisée et agile

---

# Question 1 — Bloc 1

Dans Scrum, qui décide de ce que l'équipe fait pendant le sprint ?

A) Le Scrum Master

B) Le manager

C) Le Product Owner définit les priorités, l'équipe s'engage sur ce qu'elle peut livrer

D) Le Security Champion

---

# Question 2 — Bloc 1

Quelle est la principale limite du Waterfall pour la sécurité ?

A) Il est trop rapide

B) La sécurité n'est testée qu'en fin de cycle, quand les corrections sont très coûteuses

C) Il n'a pas de phase de test

D) Il ne permet pas d'écrire des tests unitaires

---

# Question 3 — Bloc 1

Quelle notion Kanban empêche l'équipe de commencer trop de tâches simultanément ?

A) Definition of Done

B) Sprint Planning

C) WIP (Work In Progress) limité

D) Daily Standup

---

# Question 4 — Bloc 1

Qu'est-ce que l'incrément dans Scrum ?

A) Une augmentation de salaire à chaque sprint

B) Le produit fonctionnel et livrable produit à la fin d'un sprint

C) La liste des tâches planifiées

D) La durée d'un sprint

---

# Question 5 — Bloc 2

Quel est l'objectif du principe AAA ?

A) Automatiser, Auditer, Alerter

B) Vérifier qui est l'utilisateur (Authentification), ce qu'il peut faire (Autorisation), et tracer ses actions (Audit)

C) Accélérer le développement

D) Analyser, Appliquer, Archiver

---

# Question 6 — Bloc 2

Pourquoi ne faut-il pas stocker les mots de passe avec MD5 ?

A) MD5 n'est pas compatible avec les bases de données modernes

B) MD5 est trop lent

C) MD5 est cassable en quelques secondes avec des rainbow tables

D) MD5 prend trop de place en base

---

# Question 7 — Bloc 2

Comment intégrer la sécurité dans le Sprint Planning ?

A) Ajouter un sprint entier dédié à la sécurité en fin de projet

B) Inclure les stories de sécurité et les bugs CVE dans le backlog, estimés en story points comme les autres

C) Déléguer la sécurité à une équipe externe

D) Ne pas inclure la sécurité dans le planning pour ne pas ralentir

---

# Question 8 — Bloc 2

Qu'est-ce que le "Shift-Left Security" ?

A) Déplacer les tests de sécurité après la mise en production

B) Intégrer les contrôles de sécurité le plus tôt possible dans le cycle de développement

C) Supprimer la phase de test de sécurité

D) Confier la sécurité à un prestataire externe

---

# Question 9 — Bloc 3

Pourquoi faut-il séparer les configurations des environnements dev, staging et prod ?

A) Pour aller plus vite en développement

B) Pour éviter qu'une compromission de staging expose les credentials de prod

C) Pour économiser de la mémoire

D) Les configurations séparées ne sont pas nécessaires

---

# Question 10 — Bloc 3

Dans quel ordre les étapes d'un pipeline DevSecOps doivent-elles être exécutées ?

A) Deploy → Test → Build → Scan

B) Scan secrets → SAST → SCA → Build + scan image → Deploy

C) Deploy → DAST → SAST → Build

D) Build → Deploy → Scan

---

# Question 11 — Bloc 3

Quel est le comportement d'un security gate face à une vulnérabilité critique ?

A) Envoyer un email d'information et continuer le déploiement

B) Bloquer automatiquement le déploiement

C) Créer un ticket Jira et déployer quand même

D) Ignorer jusqu'au prochain sprint

---

# Question 12 — Bloc 3

Pourquoi utilise-t-on un utilisateur non-root dans un conteneur Docker ?

A) Pour des raisons de performance

B) Pour que si l'application est compromise, l'attaquant n'ait pas les droits root sur l'hôte

C) Docker exige un utilisateur non-root

D) Pour économiser de la mémoire

---

# Question 13 — Bloc 4

Quelle est la fréquence recommandée pour la Sprint Security Review ?

A) Une fois par an

B) À chaque fin de sprint

C) Seulement avant une release majeure

D) Uniquement quand il y a un incident

---

# Question 14 — Bloc 4

Que signifie MTTR et quelle est l'objectif pour une vulnérabilité critique ?

A) Mean Time To Release — objectif < 1 mois

B) Mean Time To Remediate — objectif < 24h pour les critiques

C) Maximum Time To Rollback — objectif < 1 semaine

D) Mean Time To Restart — objectif < 1 heure

---

# Question 15 — Bloc 4

Quelle donnée ne doit jamais être présente dans les logs applicatifs ?

A) Les codes HTTP de réponse

B) Les timestamps des requêtes

C) Les mots de passe et données personnelles des utilisateurs

D) Les noms des routes appelées

---

# Question 16 — Bloc 4

Que cherche à faire un post-mortem "blameless" ?

A) Identifier et sanctionner le développeur responsable

B) Analyser les causes systémiques et améliorer les processus sans blâmer les individus

C) Documenter l'incident uniquement pour les assurances

D) Rassurer les clients par un communiqué de presse

---

# Question 17 — Bloc 4

Dans le cycle PDCA appliqué à la sécurité, que fait la phase "Check" ?

A) Planifier les mitigations du prochain sprint

B) Implémenter les correctifs

C) Vérifier l'efficacité des corrections : re-scanner, mesurer le MTTR

D) Présenter les résultats à la direction

---

# Question 18 — Bloc 2 & 4

Selon le RGPD, quand la protection des données personnelles doit-elle être intégrée dans un projet agile ?

A) Après la mise en production lors du premier audit CNIL

B) Dès la conception, dans les User Stories (Privacy by Design)

C) Uniquement si le projet traite des données bancaires

D) Une fois par an lors du renouvellement de la certification

---

# Question 19 — Bloc 3 & 4

Lorsqu'un scanner CI/CD détecte une CVE haute sur une dépendance, quelle est la réaction correcte ?

A) Supprimer le scan pour débloquer le pipeline

B) Créer un ticket dans le backlog, prioriser dans le sprint en cours ou suivant, patcher et re-scanner

C) Attendre la prochaine réunion mensuelle sécu

D) Ignorer si l'application fonctionne correctement

---

# Question 20 — Tous blocs

Quelle est la bonne définition de "DevSecOps" ?

A) Une équipe dédiée à la sécurité, séparée du développement

B) L'intégration de la sécurité comme responsabilité partagée à chaque étape du cycle de développement agile

C) Un outil de scan automatique

D) Une certification de sécurité logicielle

---

# Réponses QCM Final 📝

| Q | Réponse | Bloc |
|---|---------|------|
| 1 | C) PO priorise, équipe s'engage | 1 |
| 2 | B) Sécurité testée trop tard | 1 |
| 3 | C) WIP limité | 1 |
| 4 | B) Produit livrable fin de sprint | 1 |
| 5 | B) Authentification / Autorisation / Audit | 2 |
| 6 | C) MD5 cassable avec rainbow tables | 2 |
| 7 | B) Stories sécurité dans le backlog | 2 |
| 8 | B) Contrôles le plus tôt possible | 2 |
| 9 | B) Éviter la compromission croisée | 3 |
| 10 | B) Secrets → SAST → SCA → Image → Deploy | 3 |

---

# Réponses QCM Final (suite) 📝

| Q | Réponse | Bloc |
|---|---------|------|
| 11 | B) Bloquer automatiquement | 3 |
| 12 | B) Pas de droits root si compromis | 3 |
| 13 | B) À chaque fin de sprint | 4 |
| 14 | B) Mean Time To Remediate < 24h | 4 |
| 15 | C) Mots de passe et données perso | 4 |
| 16 | B) Améliorer sans blâmer | 4 |
| 17 | C) Vérifier l'efficacité des corrections | 4 |
| 18 | B) Dès la conception (Privacy by Design) | 2 & 4 |
| 19 | B) Ticket backlog + patch + re-scan | 3 & 4 |
| 20 | B) Sécurité partagée à chaque étape | Tous |

---

# Score Final 📊

Comptez vos bonnes réponses sur 20 :

- **18-20** : Expert DevSecOps Agile ! 🏆
- **15-17** : Très bien ! ⭐⭐⭐
- **12-14** : Bien ! ⭐⭐
- **9-11** : À revoir ⭐
- **< 9** : Revoir les modules

---

# Merci ! 🎉

**Formation Développer de manière sécurisée et agile**

**12 - 13 Mars 2026**

Ressources pour aller plus loin :
- OWASP : https://owasp.org/
- NIST / NVD : https://nvd.nist.gov/
- Semgrep : https://semgrep.dev/
- Snyk : https://snyk.io/
- GitLab CI security docs : https://docs.gitlab.com/ee/user/application_security/
