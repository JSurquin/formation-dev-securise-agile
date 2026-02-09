---
layout: new-section
routeAlias: 'gestion-vulnerabilites'
---

<a name="gestion-vulnerabilites" id="gestion-vulnerabilites"></a>

# 🔍 Module 7
## Gestion des vulnérabilités

### CVE, CVSS, triaging et Incident Response

---

# CVE - Common Vulnerabilities and Exposures 📋

**CVE** = Identifiant unique pour chaque vulnérabilité connue.

**Format :** CVE-ANNÉE-NUMÉRO
- Exemple : CVE-2021-44228 (Log4Shell)

**Bases de données :**
- **NVD** (National Vulnerability Database)
- **MITRE CVE**
- **GitHub Advisory Database**
- **Snyk Vulnerability DB**

---

# CVSS - Common Vulnerability Scoring System 📊

**Score de 0.0 à 10.0 pour évaluer la sévérité :**

| Score | Sévérité | Exemple |
|-------|----------|---------|
| 9.0-10.0 | Critique | Log4Shell (10.0) |
| 7.0-8.9 | Haute | XSS stocké avec vol de session |
| 4.0-6.9 | Moyenne | Information disclosure mineure |
| 0.1-3.9 | Basse | Open redirect limité |

---

# CVSS v4 : les métriques

**Métriques de base :**
- **Attack Vector** : réseau, adjacent, local, physique
- **Attack Complexity** : basse, haute
- **Privileges Required** : aucun, bas, haut
- **User Interaction** : aucune, requise
- **Scope** : unchanged, changed

**Impact :**
- Confidentialité : none, low, high
- Intégrité : none, low, high
- Disponibilité : none, low, high

---

# CWE - Common Weakness Enumeration 🏷️

**CWE** = Classification des types de faiblesses logicielles.

**Top CWE 2025 :**
1. CWE-79 : Cross-Site Scripting (XSS)
2. CWE-89 : SQL Injection
3. CWE-787 : Out-of-bounds Write
4. CWE-20 : Improper Input Validation
5. CWE-125 : Out-of-bounds Read

**Relation CVE / CWE :**
- Un CVE décrit une vulnérabilité spécifique
- Un CWE décrit la catégorie de faiblesse

---

# Triaging des vulnérabilités 🎯

**Processus de tri et priorisation :**

1. **Identifier** : scanner automatique détecte une vuln
2. **Évaluer** : CVSS + contexte business
3. **Prioriser** : critique > haute > moyenne > basse
4. **Assigner** : qui corrige ? (dev team, infra, etc.)
5. **Corriger** : développement du fix
6. **Vérifier** : retest après correction
7. **Clôturer** : documenter et archiver

---

# Facteurs de priorisation 📋

Le CVSS seul ne suffit pas. Considérer aussi :

- **Exploitabilité** : un exploit existe-t-il déjà ?
- **Exposition** : le composant est-il accessible publiquement ?
- **Impact business** : quelles données sont à risque ?
- **Effort de correction** : combien de temps pour fixer ?

**Matrice de décision :**

| | Impact élevé | Impact faible |
|---|---|---|
| **Exploitable** | IMMÉDIAT | Sprint en cours |
| **Non exploitable** | Prochain sprint | Backlog |

---

# Patch Management 🔧

**Politique de patching recommandée :**

- **Critique** : patch dans les 24-48h
- **Haute** : patch dans la semaine
- **Moyenne** : patch dans le mois
- **Basse** : prochain cycle de maintenance

**Bonnes pratiques :**
- Maintenir un inventaire à jour (SBOM)
- Automatiser les mises à jour (Dependabot/Renovate)
- Tester les patches avant déploiement en prod
- Avoir un plan de rollback

---

# Incident Response Plan 🚨

**Les 6 phases de la réponse à incident :**

1. **Préparation** : plans, outils, équipe formée
2. **Identification** : détecter l'incident
3. **Containment** : limiter la propagation
4. **Eradication** : supprimer la cause
5. **Recovery** : restaurer les services
6. **Lessons Learned** : post-mortem et amélioration

---

# Post-mortem blameless 📝

**Après chaque incident de sécurité :**

- **Quoi** : que s'est-il passé ? Timeline précise
- **Pourquoi** : cause racine (5 Whys)
- **Impact** : données affectées, durée
- **Actions** : comment empêcher que ça se reproduise
- **Pas de blame** : on cherche des processus à améliorer, pas des coupables

---

# En résumé : Gestion des vulnérabilités 📝

- **CVE** : identifiant unique de chaque vulnérabilité
- **CVSS** : score de sévérité (0-10)
- **CWE** : classification des types de faiblesses
- **Triaging** : prioriser selon CVSS + contexte business
- **Patch management** : politique de délais par sévérité
- **Incident Response** : plan en 6 phases
- **Post-mortem blameless** : améliorer sans blâmer
