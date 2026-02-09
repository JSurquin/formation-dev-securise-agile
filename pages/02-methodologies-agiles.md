---
layout: new-section
routeAlias: 'methodologies-agiles'
---

<a name="methodologies-agiles" id="methodologies-agiles"></a>

# 🔄 Module 2
## Méthodologies Agiles & Sécurité

### Intégrer la sécurité dans les pratiques Agile

---

# Agile et Sécurité : le mariage 💍

**Le problème historique :**
- L'Agile prône la vitesse et l'itération
- La sécurité est perçue comme un frein
- Résultat : la sécurité est souvent ignorée dans les sprints

**La solution DevSecOps :**
- Intégrer la sécurité **dans** le processus Agile
- Pas de sprint sans considération sécuritaire
- La sécurité fait partie de la Definition of Done

---

# Les Evil User Stories 😈

Une **Evil User Story** décrit ce qu'un attaquant pourrait faire.

**Format classique :**
> En tant que [attaquant], je veux [action malveillante] afin de [objectif malveillant]

**Exemples :**
- "En tant qu'attaquant, je veux injecter du SQL dans le formulaire de login afin d'accéder aux données des utilisateurs"
- "En tant qu'attaquant, je veux voler le token JWT afin d'usurper l'identité d'un admin"

---

# Abuser Stories vs User Stories ⚔️

| User Story | Abuser Story |
|-----------|-------------|
| En tant qu'utilisateur, je veux me connecter | En tant qu'attaquant, je veux brute-forcer le login |
| En tant qu'admin, je veux gérer les utilisateurs | En tant qu'attaquant, je veux escalader mes privilèges |
| En tant qu'utilisateur, je veux uploader un fichier | En tant qu'attaquant, je veux uploader un webshell |

**Bonne pratique :** Pour chaque User Story, écrire au moins 1 Abuser Story.

---

# Definition of Done sécurisée ✅

Ajouter des critères de sécurité à votre DoD :

**DoD standard :**
- ✅ Code reviewé
- ✅ Tests unitaires passent
- ✅ Documentation à jour

**DoD + Sécurité :**
- ✅ Code reviewé **avec checklist sécurité**
- ✅ Tests unitaires **+ tests de sécurité** passent
- ✅ Pas de vulnérabilité critique (SAST)
- ✅ Dépendances scannées (SCA)
- ✅ Secrets non exposés dans le code
- ✅ Inputs validés côté serveur

---

# Sprint Security Review 🔍

**Quand ?** À chaque fin de sprint (avant la review)

**Qui ?** Security Champion + 1 dev minimum

**Quoi vérifier :**
- Nouveau code : respect des guidelines de sécurité
- Nouvelles dépendances : vulnérabilités connues ?
- Nouvelles API : authentification/autorisation en place ?
- Configuration : secrets bien gérés ?

---

# Scrum adapté DevSecOps 🏈

**Sprint Planning :**
- Inclure les stories de sécurité dans le backlog
- Estimer le travail de sécurité (story points)

**Daily Standup :**
- Mentionner les blocages de sécurité

**Sprint Review :**
- Démontrer les améliorations de sécurité

**Rétrospective :**
- Discuter des incidents de sécurité
- Améliorer les processus

---

# Le Backlog Sécurité 📋

**Types d'items sécurité dans le backlog :**

1. **Stories de sécurité** : nouvelles fonctionnalités sécuritaires
   - "Implémenter le rate limiting sur /api/login"

2. **Bugs de sécurité** : vulnérabilités à corriger
   - "Corriger l'injection SQL sur le endpoint /search"

3. **Tâches techniques** : amélioration de l'infrastructure
   - "Mettre à jour la lib crypto obsolète"

4. **Spike** : investigation de sécurité
   - "Évaluer l'impact du CVE-2025-XXXX"

---

# Priorisation des vulnérabilités 📊

**Matrice de priorisation :**

| Sévérité | Impact Business | Action |
|----------|----------------|--------|
| Critique | Élevé | Sprint en cours (hotfix) |
| Haute | Élevé | Prochain sprint |
| Moyenne | Moyen | Backlog priorisé |
| Basse | Faible | Backlog |

**Utiliser le CVSS (Common Vulnerability Scoring System) :**
- 9.0-10.0 : Critique
- 7.0-8.9 : Haute
- 4.0-6.9 : Moyenne
- 0.1-3.9 : Basse

---

# Security Champions Program 🏆

**Objectif :** Avoir un référent sécurité dans chaque équipe Scrum.

**Profil du Security Champion :**
- Développeur motivé par la sécurité
- Formé aux bonnes pratiques (OWASP, etc.)
- Lien entre l'équipe dev et l'équipe sécurité

**Responsabilités :**
- Revue de code orientée sécurité
- Veille sur les vulnérabilités
- Formation des collègues
- Participation aux audits

---

# En résumé : Agile & Sécurité 📝

- Les **Evil User Stories** anticipent les attaques
- La **DoD** doit inclure des critères de sécurité
- **Sprint Security Review** à chaque sprint
- Le **backlog sécurité** est priorisé par CVSS
- Les **Security Champions** sont essentiels
- La sécurité est une **feature**, pas un frein
