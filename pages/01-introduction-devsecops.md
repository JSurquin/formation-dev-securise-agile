---
layout: new-section
routeAlias: 'introduction-devsecops'
---

<a name="introduction-devsecops" id="introduction-devsecops"></a>

# 🔐 Module 1
## Introduction au DevSecOps

### Intégrer la sécurité dès le début du cycle de développement

---

# Qu'est-ce que le DevSecOps ? 🔐

Le DevSecOps est l'intégration de la **sécurité** dans chaque étape du cycle de développement logiciel.

**Philosophie :**
- **Dev** : Développement rapide et itératif
- **Sec** : Sécurité intégrée, pas ajoutée après coup
- **Ops** : Opérations automatisées et fiables

**Objectif principal :**
> Faire de la sécurité une responsabilité partagée, pas un frein.

---

# Avant vs Après DevSecOps 📊

**Approche traditionnelle (Waterfall) :**
- Sécurité testée en fin de projet
- Coût de correction x30 en production
- Délais de livraison rallongés
- "On verra la sécurité plus tard"

**Approche DevSecOps :**
- Sécurité intégrée dès la conception (Shift-Left)
- Tests automatisés dans la CI/CD
- Feedback rapide aux développeurs
- "Security as Code"

---

# Le concept de Shift-Left Security ⬅️

Le **Shift-Left** consiste à déplacer les activités de sécurité le plus tôt possible dans le cycle de développement.

**Phases d'intervention :**
- **Conception** : Threat Modeling, Security Requirements
- **Développement** : Secure Coding, Code Review
- **Build** : SAST, SCA, Linting sécurité
- **Test** : DAST, Pentesting automatisé
- **Déploiement** : Scanning d'images, Config audit
- **Production** : Monitoring, Incident Response

---

# Coût de correction des vulnérabilités 💰

Plus une faille est détectée tard, plus elle coûte cher à corriger :

| Phase | Coût relatif |
|-------|-------------|
| Conception | x1 |
| Développement | x6 |
| Test | x15 |
| Production | x30-100 |

> **Règle d'or** : 1€ investi en sécurité en conception = 100€ économisés en production.

---

# Threat Modeling (Modélisation des menaces) 🎯

Le Threat Modeling est une technique pour identifier les menaces AVANT d'écrire du code.

**Méthode STRIDE :**
- **S**poofing (Usurpation d'identité)
- **T**ampering (Altération de données)
- **R**epudiation (Répudiation)
- **I**nformation Disclosure (Fuite d'information)
- **D**enial of Service (Déni de service)
- **E**levation of Privilege (Élévation de privilèges)

---

# Exemple de Threat Model 📋

**Application : API e-commerce**

```
Composant : Endpoint /api/login
- Spoofing → Brute force sur les identifiants
  → Mitigation : Rate limiting + 2FA
- Tampering → Modification du JWT
  → Mitigation : Signature RS256
- Info Disclosure → Erreurs trop détaillées
  → Mitigation : Messages d'erreur génériques
```

---

# Les 3 piliers du DevSecOps 🏛️

**1. Culture**
- Formation continue des équipes
- Security Champions dans chaque équipe
- Pas de blame, mais de l'amélioration continue

**2. Automatisation**
- Tests de sécurité automatisés
- Pipeline CI/CD avec gates de sécurité
- Infrastructure as Code (IaC) auditée

---

# Les 3 piliers du DevSecOps (suite) 🏛️

**3. Mesure**
- KPIs de sécurité (MTTR, taux de vulnérabilités)
- Tableaux de bord de sécurité
- Audits réguliers et rétrospectives

**Métrique clé : MTTR (Mean Time To Remediate)**
- Temps moyen pour corriger une vulnérabilité
- Objectif : < 24h pour les critiques, < 7j pour les hautes

---

# Les rôles clés en DevSecOps 👥

| Rôle | Responsabilité |
|------|---------------|
| **Security Champion** | Référent sécurité dans l'équipe dev |
| **AppSec Engineer** | Conception des outils et processus de sécurité |
| **DevOps Engineer** | Intégration des outils dans la pipeline |
| **Développeur** | Écriture de code sécurisé |
| **Product Owner** | Priorisation des stories de sécurité |

---

# En résumé : DevSecOps 📝

- La sécurité n'est **pas optionnelle**, c'est une **fonctionnalité**
- **Shift-Left** : plus tôt = moins cher
- **Threat Modeling** : anticiper les menaces avant de coder
- **Automatisation** : intégrer la sécurité dans la CI/CD
- **Culture** : responsabilité partagée par toute l'équipe
- **Mesure** : ce qui ne se mesure pas ne s'améliore pas
