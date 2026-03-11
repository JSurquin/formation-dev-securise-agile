---
layout: new-section
routeAlias: 'methodologies-agiles'
---

<a name="methodologies-agiles" id="methodologies-agiles"></a>

# 🔐 Module 2
## Intégration de la sécurité dans les projets agiles

### Gestion des accès, cryptographie, vulnérabilités et DevSecOps

---

# Les 3 piliers de la sécurité logicielle 🏛️

> **Analogie :** Sécuriser une appli, c'est comme sécuriser une banque : qui entre (accès), est-ce que les coffres sont protégés (crypto), et qui surveille les failles (vulnérabilités).

**CIA Triad :**
- **Confidentialité** : seules les bonnes personnes accèdent aux données
- **Intégrité** : les données ne sont pas altérées sans autorisation
- **Disponibilité** : le service reste accessible même sous attaque

---

# Gestion des accès (AAA) 🔑

> **Analogie :** Comme un immeuble avec badge, interphone et registre des entrées.

**3 concepts clés :**
- **Authentification** : *qui es-tu ?* → mot de passe, MFA, OAuth
- **Autorisation** : *que peux-tu faire ?* → RBAC, permissions
- **Audit** : *qu'as-tu fait ?* → logs, traçabilité

**Principe du moindre privilège :**
> Chaque utilisateur (et chaque service) ne doit avoir accès qu'à ce dont il a strictement besoin.

---

# RBAC : Role-Based Access Control 👥

> **Analogie :** Dans un hôpital, l'infirmière peut voir les dossiers patients, pas les données financières. Le comptable voit les finances, pas les dossiers médicaux.

**Modèle RBAC :**

| Rôle | Lecture | Écriture | Admin |
|------|---------|----------|-------|
| Visiteur | ✅ public | ❌ | ❌ |
| Utilisateur | ✅ ses données | ✅ ses données | ❌ |
| Admin | ✅ tout | ✅ tout | ✅ |

**En code :** vérifier le rôle à chaque requête, côté serveur.

---

# Cryptographie : les bases 🔒

> **Analogie :** La crypto, c'est transformer une lettre en charabia pour que seul le destinataire puisse la lire, avec la bonne clé.

**Chiffrement symétrique :**
- Même clé pour chiffrer et déchiffrer (AES-256)
- Rapide → utilisé pour les données au repos

**Chiffrement asymétrique :**
- Clé publique (chiffre) + clé privée (déchiffre) (RSA, EC)
- Lent → utilisé pour les échanges (HTTPS, JWT signé)

**Hachage :**
- Empreinte unique et irréversible (SHA-256, bcrypt)
- Utilisé pour les mots de passe : on stocke le hash, jamais le mdp

---

# Cryptographie appliquée au développement 💻

**Mots de passe :**
```javascript
// ❌ Ne jamais stocker en clair
user.password = "monmotdepasse"

// ✅ Toujours hasher avec bcrypt
const hash = await bcrypt.hash("monmotdepasse", 12)
```

**Données sensibles en base :**
- Chiffrer avec AES-256 les données critiques (numéros de carte, données de santé)
- Utiliser HTTPS (TLS 1.3) pour toutes les communications

---

# Gestion des vulnérabilités : c'est quoi ? 🐛

> **Analogie :** Une vulnérabilité, c'est une fenêtre entrouverte dans une maison. Le CVE, c'est le rapport du serrurier qui dit "fenêtre au 2e étage, modèle X, facile à ouvrir". Le CVSS, c'est son estimation du danger : 9/10 si la maison est en ville, 3/10 si elle est dans les champs.

**Vocabulaire clé :**
- **CVE** : identifiant unique d'une vulnérabilité (CVE-2021-44228)
- **CVSS** : score de sévérité de 0 à 10
- **Patch** : correctif qui ferme la fenêtre

---

# Scores CVSS et actions agiles 📊

| Score | Sévérité | Délai recommandé | Action Scrum |
|-------|----------|-----------------|--------------|
| 9.0-10.0 | Critique | 24-48h | Hotfix immédiat |
| 7.0-8.9 | Haute | < 7 jours | Sprint en cours |
| 4.0-6.9 | Moyenne | < 30 jours | Backlog priorisé |
| 0.1-3.9 | Basse | Prochain cycle | Backlog |

---

# La sécurité dans les sprints agiles 🏃

**Le problème :** dans un sprint de 2 semaines, tout va vite. La sécurité doit être automatisée et intégrée, pas ajoutée à la fin.

**Intégration dans chaque cérémonie :**

| Cérémonie | Action sécurité |
|-----------|----------------|
| **Sprint Planning** | Inclure les stories sécurité, estimer le temps |
| **Daily Standup** | Signaler les alertes de sécurité |
| **Sprint Review** | Démontrer les améliorations sécurité |
| **Rétrospective** | Analyser les incidents, améliorer le process |

---

# Tests de sécurité intégrés au cycle de dev 🧪

> **Analogie :** Les tests de sécurité automatiques, c'est comme un détecteur de fumée. Il tourne en permanence, il sonne si quelque chose cloche, et il ne te demande pas de le surveiller manuellement.

**Types de tests :**
- **SAST** (Static) : analyse le code sans l'exécuter → détecte les injections, secrets exposés
- **SCA** (Composition) : scanne les dépendances → détecte les CVE dans tes libs
- **DAST** (Dynamic) : teste l'appli en cours d'exécution → simule un attaquant

---

# DevSecOps : la sécurité en continu 🔄

> **Analogie :** Le DevSecOps, c'est un contrôle qualité intégré à la chaîne de montage automobile. Pas de QC en toute fin de chaîne — chaque poste vérifie, chaque poste corrige.

**Shift-Left Security :**
- Détecter les failles le plus tôt possible
- Plus tôt = moins cher à corriger

| Phase | Coût relatif de correction |
|-------|---------------------------|
| Conception | ×1 |
| Développement | ×6 |
| Test | ×15 |
| Production | ×30 à ×100 |

---

# DevSecOps : les 3 piliers 🏛️

**1. Culture**
- Sécurité = responsabilité partagée (pas seulement l'équipe sécu)
- **Security Champion** : un dev référent sécurité dans chaque équipe
- Post-mortem blameless : on cherche des processus à améliorer, pas des coupables

**2. Automatisation**
- SAST, SCA, DAST dans la pipeline CI/CD
- Security gates : le build échoue si une vuln critique est détectée

**3. Mesure**
- MTTR (Mean Time To Remediate) : objectif < 24h sur critique
- Taux de vulnérabilités par sprint : tendance à la baisse

---

# Les Evil User Stories 😈

> **Analogie :** Pour chaque porte qu'on installe, on demande à un cambrioleur ce qu'il ferait. C'est ça, une Evil User Story.

**Format :**
> En tant que **[attaquant]**, je veux **[action malveillante]** afin de **[objectif malveillant]**

**Exemple concret :**

| User Story normale | Evil User Story |
|-------------------|-----------------|
| Je veux me connecter avec mon email | Je veux tenter 10 000 mots de passe sur chaque compte |
| Je veux uploader une photo de profil | Je veux uploader un fichier `.php` exécutable |
| Je veux partager un document | Je veux accéder au document d'un autre utilisateur |

---

# Definition of Done sécurisée ✅

La **DoD** définit ce que "terminé" veut dire. Sans critère sécurité, une story peut être "done" avec une injection SQL dedans.

**DoD standard + sécurité :**
- ✅ Code reviewé avec **checklist sécurité**
- ✅ Tests unitaires + **tests de sécurité** passent
- ✅ Scan SAST : **zéro vulnérabilité critique ou haute**
- ✅ Dépendances scannées (SCA) : **pas de CVE critique**
- ✅ **Aucun secret** dans le code (clé API, mot de passe)
- ✅ Inputs **validés côté serveur**

---

# Security Champions Program 🏆

> **Analogie :** Le Security Champion, c'est le secouriste de l'équipe. Il n'est pas médecin, mais il connaît les gestes de base et il peut appeler les secours au bon moment.

**Rôle :**
- Développeur avec **20% de son temps** dédié à la sécurité
- Fait le lien entre l'équipe dev et l'équipe sécu
- Anime les revues de code orientées sécurité
- Fait la veille CVE pour l'équipe

**Sans Security Champion :**
- Les alertes de sécurité passent inaperçues
- Les CVE s'accumulent dans le backlog sans être traitées

---

# En résumé : Module 2 📝

- **Accès** : authentification + autorisation (RBAC) + audit → principe du moindre privilège
- **Crypto** : hasher les mots de passe (bcrypt), chiffrer les données sensibles (AES-256), HTTPS
- **Vulnérabilités** : CVE + CVSS → délais de correction selon sévérité
- **Sprints sécurisés** : sécurité dans chaque cérémonie Scrum
- **Tests intégrés** : SAST, SCA, DAST dans la CI/CD
- **DevSecOps** : Shift-Left + automatisation + culture partagée
- **Evil User Stories** + **DoD sécurisée** = outils concrets pour chaque sprint
