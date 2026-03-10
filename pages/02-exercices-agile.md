---

# Exercices Module 2 : Intégration de la sécurité dans les projets agiles 🎯

---

# Exercice 1 : Evil User Stories (15 min)

**Contexte :** Vous développez une application de gestion de notes en ligne (type Notion).

**Consigne :** Pour chaque User Story ci-dessous, rédigez une Evil User Story correspondante avec une mitigation.

1. "En tant qu'utilisateur, je veux créer un compte avec mon email"
2. "En tant qu'utilisateur, je veux partager mes notes avec d'autres utilisateurs"
3. "En tant qu'admin, je veux pouvoir supprimer un utilisateur"

---

# Exercice 1 : Solution ✅

**1. Création de compte :**
- Evil : "En tant qu'attaquant, je veux créer des milliers de comptes pour spammer"
- Mitigation : CAPTCHA, rate limiting, vérification email

**2. Partage de notes :**
- Evil : "En tant qu'attaquant, je veux accéder aux notes privées des autres"
- Mitigation : Vérification des permissions, IDOR protection

**3. Suppression utilisateur :**
- Evil : "En tant qu'attaquant, je veux escalader mes privilèges pour supprimer des admins"
- Mitigation : RBAC strict, audit logging, confirmation 2FA

---

# Exercice 2 : Definition of Done sécurisée (10 min)

**Consigne :** Créez une Definition of Done complète pour votre équipe incluant les aspects sécurité.

**Contraintes :**
- Minimum 5 critères classiques
- Minimum 5 critères de sécurité
- Doit être réaliste et applicable à chaque sprint

---

# Exercice 2 : Solution ✅

**DoD complète :**
- ✅ Code reviewé par au moins 1 pair
- ✅ Tests unitaires écrits et passent (couverture > 80%)
- ✅ Tests d'intégration passent
- ✅ Documentation mise à jour
- ✅ Feature démontrée au PO
- 🔐 Scan SAST sans vulnérabilité critique/haute
- 🔐 Dépendances vérifiées (pas de CVE critique)
- 🔐 Inputs validés côté serveur
- 🔐 Pas de secrets dans le code (détecté par git-secrets)
- 🔐 Logs de sécurité implémentés (login, erreurs)

---

# Exercice 3 : Sprint Planning sécurisé (15 min)

**Contexte :** Votre backlog contient les éléments suivants. Priorisez-les pour le prochain sprint (capacité : 40 story points).

<small>

| Item | Type | Points | Sévérité |
|------|------|--------|----------|
| Feature : Export PDF | Feature | 8 | - |
| CVE critique sur la lib auth | Bug sécu | 5 | Critique |
| Evil Story : brute force login | Story sécu | 8 | Haute |
| Feature : Dark mode | Feature | 3 | - |
| Mise à jour dépendances | Tech | 5 | Moyenne |
| Feature : Notifications | Feature | 13 | - |
| XSS sur la page profil | Bug sécu | 3 | Haute |

</small>

---

# Exercice 3 : Solution ✅

**Sprint priorisé (40 points) :**

1. 🔴 CVE critique lib auth - 5 pts (Critique = immédiat)
2. 🔴 XSS page profil - 3 pts (Haute = ce sprint)
3. 🟠 Evil Story brute force - 8 pts (Haute = ce sprint)
4. 🟡 Mise à jour dépendances - 5 pts (Prévention)
5. 🟢 Feature Export PDF - 8 pts (Business value)
6. 🟢 Feature Dark mode - 3 pts (Quick win)
7. ❌ Feature Notifications - 13 pts (Reportée au prochain sprint)

**Total : 32 points** (marge de sécurité pour imprévus)

---

# Exercice 4 : Mise en place d'un projet Scrum sécurisé (20 min)

**Contexte :** Vous montez une nouvelle équipe de 5 personnes pour développer une application de prise de rendez-vous médicaux.

**Consigne :** Définissez la structure complète du projet Scrum avec sécurité intégrée :
1. Définissez les rôles et leur responsabilité sécurité
2. Rédigez 3 User Stories + leur Evil User Story correspondante
3. Rédigez la Definition of Done sécurisée
4. Listez les Security Requirements à inclure dans le backlog initial

---

# Exercice 4 : Solution - Rôles & Evil Stories ✅

**Rôles :**
- PO : priorise les stories sécurité, valide la conformité RGPD
- Scrum Master : intègre la Security Review dans les cérémonies
- Security Champion (1 dev) : revue de code sécurisée, veille CVE

**Evil User Stories :**
- US "Prendre RDV" → Evil : "En tant qu'attaquant, je veux réserver tous les créneaux pour bloquer le service" → Mitigation : rate limiting + CAPTCHA
- US "Voir mes RDV" → Evil : "En tant qu'attaquant, je veux accéder aux RDV d'autres patients via l'ID" → Mitigation : IDOR protection + RBAC
- US "S'inscrire" → Evil : "En tant qu'attaquant, je veux créer des faux comptes médecins" → Mitigation : validation email + vérification RPPS
Exercice 4 : Solution
---

# Exercice 4 : Solution - DoD & Security Requirements ✅

<div class="text-xs">

**Definition of Done sécurisée :**
- ✅ Code reviewé (checklist sécurité incluse)
- ✅ SAST sans vulnérabilité critique/haute
- ✅ Données médicales chiffrées (AES-256)
- ✅ Logs sans données personnelles
- ✅ Tests unitaires + tests de sécurité passent
- ✅ Dépendances sans CVE critique (SCA)

**Security Requirements backlog initial :**
- Authentification MFA pour les médecins
- Chiffrement des données patients au repos et en transit
- Journalisation des accès aux dossiers médicaux
- Conformité RGPD : consentement + droit à l'effacement
- Rate limiting sur toutes les API publiques

</div>