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

# En résumé : Module 7 📝

- **Surveillance continue** : Dependabot, Snyk, SIEM — la sécurité ne s'arrête pas au déploiement
- **CVE + CVSS** : identifier et scorer chaque vulnérabilité
- **Triage** : prioriser selon gravité × exposition × impact business
- **Audit agile** : Sprint Security Review à chaque sprint + audit approfondi trimestriel
- **PDCA** : amélioration continue mesurée (MTTR, CVE ouvertes)
- **Données sensibles** : classifier, chiffrer, minimiser, respecter le RGPD
- **Incident Response** : plan en 6 phases + post-mortem blameless
