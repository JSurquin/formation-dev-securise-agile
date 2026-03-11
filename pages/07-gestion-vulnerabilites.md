---
layout: new-section
routeAlias: 'gestion-vulnerabilites'
---

<a name="gestion-vulnerabilites" id="gestion-vulnerabilites"></a>

# 🔍 Module 7
## Suivi, audit et gestion des risques agiles

### Surveillance continue, audit agile, amélioration continue et données sensibles

---

# Surveiller la sécurité en continu 📡

> **Analogie :** La surveillance continue, c'est le système d'alarme de la maison. Il ne suffit pas de vérifier les serrures une fois par an. L'alarme tourne 24h/24 et sonne dès qu'une fenêtre s'ouvre.

**Pourquoi surveiller en continu ?**
- Les nouvelles vulnérabilités (CVE) apparaissent chaque jour
- Un attaquant peut exploiter une faille en quelques heures après publication
- Les comportements anormaux indiquent souvent une attaque en cours

---

# Les outils de surveillance continue 🛠️

| Outil | Ce qu'il surveille | Intégration agile |
|-------|--------------------|------------------|
| **Dependabot / Renovate** | CVE dans les dépendances | Crée des PR automatiques |
| **Snyk** | Vulnérabilités libs + conteneurs | Alerte dans Slack/Jira |
| **SIEM** (Splunk, Elastic) | Logs & comportements suspects | Alertes temps réel |
| **SonarQube** | Qualité & sécurité du code | Rapport par PR |
| **Grafana + alerting** | Métriques applicatives | Dashboard équipe |

---

# CVE et CVSS : comprendre les identifiants 📋

> **Analogie :** Un CVE, c'est le numéro de plaque d'immatriculation d'une faille. Le CVSS, c'est le permis de priorité : 10/10 = priorité absolue, 2/10 = tu peux attendre le week-end.

**CVE** = Common Vulnerabilities and Exposures
- Format : `CVE-ANNÉE-NUMÉRO`
- Exemple : `CVE-2021-44228` = Log4Shell (score CVSS : **10.0**)

**CVSS** = Common Vulnerability Scoring System
- Score de 0.0 à 10.0
- Prend en compte : complexité d'attaque, privilèges requis, impact

---

# Triaging des vulnérabilités : prioriser comme un pro 🎯

> **Analogie :** Les urgences d'un hôpital ne traitent pas les patients dans l'ordre d'arrivée, mais par gravité. Une fracture ouverte passe avant un bobo au genou — même si le bobo est arrivé avant.

**Le processus de triage :**
1. **Identifier** : le scanner détecte une CVE
2. **Évaluer** : CVSS + est-ce exposé en prod ? Un exploit public existe-t-il ?
3. **Prioriser** : critique/haute → sprint en cours ; moyenne → backlog
4. **Assigner** : ticket créé, assigné au dev concerné
5. **Corriger** : fix développé et repassé dans la CI
6. **Vérifier** : re-scan confirme la correction
7. **Clôturer** : ticket fermé, documenté

---

# Matrice de priorisation des risques 📊

**Le CVSS seul ne suffit pas. Croiser avec le contexte :**

| | Exposé en prod | Non exposé |
|---|---|---|
| **Exploit public** | 🔴 Immédiat (< 24h) | 🟠 Sprint en cours |
| **Pas d'exploit** | 🟠 Sprint en cours | 🟡 Backlog priorisé |

**Autres facteurs à considérer :**
- Données à risque : données personnelles, financières, santé → impact réglementaire
- Effort de correction : un patch simple vs une refonte architecturale

---

# L'audit agile de sécurité 🔎

> **Analogie :** L'audit agile, c'est le contrôle technique de la voiture. Le contrôle annuel = audit approfondi. Mais tu ne roules pas sans regarder le tableau de bord tous les jours.

**Deux niveaux d'audit :**

| Niveau | Fréquence | Durée | Réalisé par |
|--------|-----------|-------|-------------|
| **Sprint Security Review** (léger) | Chaque sprint | 30-60 min | Security Champion + 1 dev |
| **Audit approfondi** | Tous les 3 mois | 1-2 jours | Équipe sécu ou prestataire |

---

# Sprint Security Review : que vérifier ? ✅

**À la fin de chaque sprint, le Security Champion vérifie :**

- Nouveau code : la checklist sécurité a-t-elle été respectée ?
- Nouvelles dépendances : CVE connues ?
- Nouvelles API : authentification et autorisation en place ?
- Nouvelles configurations : secrets bien gérés ?
- Alertes CI/CD : toutes les alertes ont-elles été traitées ?

> Si quelque chose n'est pas OK → ticket dans le backlog du prochain sprint.

---

# Amélioration continue : le cycle PDCA 🔁

> **Analogie :** Le PDCA, c'est la recette d'un chef qui améliore son plat à chaque service. Il planifie la recette, la cuisine, goûte, note ce qui cloche, et ajuste pour le lendemain.

| Phase | Action sécurité |
|-------|----------------|
| **Plan** | Identifier les risques, planifier les mitigations |
| **Do** | Implémenter les correctifs dans le sprint |
| **Check** | Re-scanner, auditer, mesurer le MTTR |
| **Act** | Ajuster les processus en rétrospective |

---

# Métriques de sécurité à suivre 📈

**Ce qui se mesure s'améliore :**

| Métrique | Définition | Objectif |
|----------|------------|---------|
| **MTTR** | Temps moyen pour corriger une vuln | Critique < 24h, Haute < 7j |
| **CVE ouvertes** | Nombre de vulns non corrigées | Tendance à la baisse |
| **% couverture SAST** | Part du code analysée | > 90% |
| **Taux de faux positifs** | Alertes non pertinentes | < 20% |

> Afficher ces métriques dans un **dashboard d'équipe** visible à chaque sprint review.

---

# Gestion des données sensibles 🔒

> **Analogie :** Les données sensibles, c'est comme de l'or en lingots. Tu ne laisses pas les lingots traîner sur les bureaux. Tu les mets dans un coffre, tu traces qui y accède, et tu n'en prends que ce dont tu as besoin.

**Cycle de vie des données sensibles dans un projet agile :**
- **Conception** : identifier les données sensibles dès les User Stories
- **Développement** : chiffrement, pas de logs de données perso
- **Test** : utiliser des données anonymisées, jamais les vraies
- **Production** : chiffrement au repos + en transit, journalisation des accès
- **Fin de vie** : suppression sécurisée (droit à l'effacement RGPD)

---

# Catégorisation des données 🗂️

| Niveau | Exemples | Mesures minimales |
|--------|----------|------------------|
| **Public** | Nom du produit, CGU | Aucune mesure spéciale |
| **Interne** | Métriques business | Authentification requise |
| **Confidentiel** | Données clients, emails | Chiffrement + audit logs |
| **Critique** | Données santé, bancaires | Chiffrement AES-256 + MFA + accès restreint + RGPD |

**Bonne pratique Scrum :** classifier les données **dès le Sprint Planning** lors de l'écriture des User Stories.

---

# RGPD et développement agile 🇪🇺

> **Analogie :** Le RGPD, c'est le code de la route pour les données personnelles. Tu ne l'appliques pas une fois par an — tu conduis en le respectant à chaque kilomètre.

**Privacy by Design (art. 25 RGPD) :**
- Intégrer la protection des données dès la conception
- Minimisation : ne collecter que les données nécessaires
- Droit à l'effacement : prévu dans le backlog dès le départ

**En pratique dans Scrum :**
- Une **User Story** = "En tant qu'utilisateur, je veux supprimer mon compte et toutes mes données"
- Critère dans la **DoD** : aucune donnée personnelle dans les logs

---

# Incident Response dans un contexte agile 🚨

**Les 6 phases (adaptées à Scrum) :**

| Phase | Action | Qui |
|-------|--------|-----|
| **Préparation** | Plan d'incident dans le backlog | Security Champion |
| **Identification** | Alerte SIEM / utilisateur | Équipe ops |
| **Containment** | Isoler le composant affecté | Dev + ops |
| **Eradication** | Corriger la cause (hotfix) | Dev |
| **Recovery** | Restaurer le service | Ops |
| **Post-mortem** | Rétrospective blameless | Toute l'équipe |

---

# Post-mortem blameless 📝

> **Analogie :** Après un crash d'avion, l'enquête cherche les défaillances systèmes — pas à mettre le pilote en prison. C'est la même chose pour un incident de sécurité.

**Structure d'un bon post-mortem :**
- **Timeline** : que s'est-il passé exactement, minute par minute ?
- **Cause racine** (5 Whys) : pourquoi cela a-t-il pu arriver ?
- **Impact** : quelles données ? Combien d'utilisateurs ? Durée ?
- **Actions correctives** : quoi changer dans le process ?
- **Pas de blame** : on cherche des systèmes à améliorer, pas des coupables

---

# Cas réel : la fuite Uber (2022) 🚗

> **Contexte :** Un attaquant de 18 ans compromet les systèmes internes d'Uber. Pas via une faille technique sophistiquée — via de l'ingénierie sociale.

**Déroulé :**
1. L'attaquant trouve les credentials d'un sous-traitant sur le dark web
2. Il contourne le MFA par fatigue de notification push (envoi en masse)
3. Il accède au VPN → puis à Slack, AWS, GitLab, HackerOne
4. Il publie sur le canal Slack de l'équipe sécu : "I announce I am a hacker"

**Ce qui a manqué :**
- Limitation des tentatives MFA push
- Accès de sous-traitants trop larges (principe du moindre privilège)
- Monitoring d'anomalies de connexion (heure, pays, volume)

---

# Construire un registre des risques agile 📊

**Le registre des risques** = le backlog de sécurité de long terme.

| Risque | Probabilité | Impact | Score | Sprint cible |
|--------|-------------|--------|-------|--------------|
| Injection SQL sur /api/users | Haute | Critique | 9/10 | Sprint 8 |
| Token JWT sans expiration | Moyenne | Haute | 7/10 | Sprint 9 |
| Logs contenant des emails | Basse | Moyenne | 4/10 | Sprint 10 |
| Dépendance lodash 4.17.11 | Haute | Basse | 5/10 | Sprint 8 |

**Mise à jour du registre :**
- À chaque Sprint Security Review
- À chaque nouveau rapport Dependabot/Snyk
- Après chaque incident ou audit externe

---

# Les métriques de sécurité : comment les lire 📈

**MTTR (Mean Time To Remediate) :**
> Temps moyen entre la détection d'une CVE et son déploiement corrigé en production.

**Objectifs réalistes selon le CVSS :**
| Sévérité | Objectif MTTR | Exemple |
|----------|--------------|---------|
| Critique (9-10) | < 24h | Log4Shell, faille RCE |
| Haute (7-8.9) | < 7 jours | CVE avec exploit public |
| Moyenne (4-6.9) | < 30 jours | XSS sans auth |
| Basse (< 4) | < 90 jours | Info disclosure mineure |

**Autres métriques utiles :**
- % de sprints avec 0 CVE critique ouverte en fin de sprint
- Nombre de secrets scannés vs secrets bloqués (taux de détection)

---

# L'audit de sécurité agile : la checklist 🔍

**À chaque fin de sprint, le Security Champion passe cette liste :**

**Code :**
- [ ] Aucun secret dans les commits (Gitleaks ✅)
- [ ] SAST sans finding HIGH/CRITICAL (Semgrep ✅)
- [ ] Toutes les dépendances à jour ou CVE traitées

**Infrastructure :**
- [ ] Variables sensibles dans GitLab CI (Masked + Protected)
- [ ] Logs ne contenant pas de données personnelles
- [ ] Tokens de production différents des tokens de staging

**Processus :**
- [ ] DoD sécurisée respectée pour chaque story livrée
- [ ] Evil User Stories écrites pour les nouvelles fonctionnalités
- [ ] Incidents du sprint documentés (même mineurs)

---

# RGPD : les droits des personnes en pratique 📋

**Les 8 droits que votre appli doit implémenter :**

| Droit | Ce que ça implique techniquement |
|-------|----------------------------------|
| Accès | API pour exporter ses propres données (JSON/CSV) |
| Rectification | Formulaire d'édition de profil complet |
| Effacement | Fonction "supprimer mon compte" + cascade BDD |
| Portabilité | Export au format standard (JSON, CSV) |
| Opposition | Opt-out marketing, analytics désactivable |
| Limitation | Geler le traitement sans supprimer les données |
| Information | Politique de confidentialité claire + bannière cookies |
| Réclamation | Lien vers la CNIL dans la politique |

---

# Privacy by Design : les 7 principes 🏗️

**Intégrer la vie privée dès la conception, pas après :**

1. **Proactif** : anticiper les problèmes de vie privée avant qu'ils arrivent
2. **Par défaut** : les paramètres les plus privés sont les paramètres par défaut
3. **Intégré** : la vie privée fait partie de la conception, pas un ajout
4. **Somme positive** : sécurité + vie privée peuvent coexister sans compromis
5. **De bout en bout** : protection pendant toute la durée de vie des données
6. **Visibilité** : les pratiques sont transparentes et vérifiables
7. **Centré sur l'utilisateur** : l'utilisateur garde le contrôle

> **En pratique en Agile :** chaque nouvelle fonctionnalité traitant des données personnelles → critique de Privacy by Design dans le DoR.

---

# La pseudonymisation vs l'anonymisation 🎭

> **Une confusion fréquente qui a des conséquences légales.**

**Pseudonymisation :**
- On remplace l'identifiant direct par un pseudonyme
- La correspondance est stockée séparément (et sécurisée)
- Les données restent des données personnelles sous RGPD
- Exemple : remplacer `email` par `user_id_hash` dans les logs

**Anonymisation :**
- La correspondance est détruite, irréversible
- Les données ne sont plus des données personnelles → hors RGPD
- Très difficile à atteindre réellement (risque de ré-identification)

**En pratique :** utiliser la pseudonymisation en staging/preprod pour tester avec des données réalistes sans exposer les vraies données de production.

---

# Gestion des incidents : préparer avant que ça arrive 🚨

> **Analogie :** On ne lit pas le manuel d'évacuation pendant l'incendie. On le lit avant.

**Le Runbook de sécurité :**
Un runbook est un document qui décrit précisément quoi faire en cas d'incident.

**Contenu minimal d'un runbook :**
- Liste des systèmes critiques et leurs propriétaires
- Procédure d'isolation (couper l'accès sans tout éteindre)
- Contacts d'urgence (RSSI, DPO, juriste, hébergeur)
- Checklist de notification (CNIL dans 72h si données personnelles)
- Procédure de restauration depuis les backups
- Critères de sortie de crise (quand peut-on reprendre l'activité ?)

---

# Le 5 Whys appliqué à la sécurité 🔍

> **Technique de Toyota adaptée aux post-mortems de sécurité.**

**Exemple : une fuite de token de production dans les logs**

1. **Pourquoi** le token était dans les logs ?
   → Parce qu'une exception l'a loggué en clair

2. **Pourquoi** l'exception loggue-t-elle des données sensibles ?
   → Parce que le logger n'a pas de filtre de données sensibles

3. **Pourquoi** n'y a-t-il pas de filtre ?
   → Parce que ce n'est pas dans la DoD

4. **Pourquoi** n'est-ce pas dans la DoD ?
   → Parce qu'on n'avait pas pensé à ce cas lors de la définition

5. **Pourquoi** n'y a-t-il pas de revue de la DoD ?
   → Cause racine : **absence de revue périodique de la DoD sécurisée**

**Action corrective :** ajouter "logs sans données sensibles" à la DoD + revue trimestrielle.

---

# Amélioration continue : le rythme Agile de la sécurité 🔄

**La sécurité s'améliore sprint après sprint, pas d'un coup.**

**Rythme recommandé :**

| Fréquence | Action |
|-----------|--------|
| **Chaque commit** | Scan Gitleaks + SAST automatique |
| **Chaque sprint** | Sprint Security Review + mise à jour registre des risques |
| **Chaque mois** | Revue des métriques (MTTR, CVE ouvertes) |
| **Chaque trimestre** | Audit externe + pentest ciblé |
| **Chaque année** | Audit complet ISO 27001 / audit RGPD |

> **Clé :** ne pas attendre l'audit annuel pour découvrir les problèmes. La surveillance continue réduit la surface de risque au quotidien.

---

# En résumé : Module 7 📝

- **Uber (2022)** : MFA contourné par fatigue push → monitoring d'anomalies + moindre privilège
- **Registre des risques** : le backlog de sécurité de long terme, mis à jour chaque sprint
- **MTTR** : < 24h critique, < 7j haute, < 30j moyenne — mesuré à chaque sprint
- **Checklist d'audit** : code + infra + processus — sprint par sprint, pas annuellement
- **RGPD** : 8 droits à implémenter + Privacy by Design dans le DoR
- **Pseudonymisation** ≠ anonymisation — données de staging à pseudonymiser
- **Runbook** : préparer la réponse à incident avant l'incident
- **5 Whys** : trouver la vraie cause racine, pas juste le symptôme
- **Post-mortem blameless** : améliorer les systèmes, pas punir les personnes
