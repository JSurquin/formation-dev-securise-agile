---

# Travaux pratiques Module 2 🎯
## User stories liées à la sécurité dans un projet agile

---

# TP 1 : Gestion des accès — RBAC (15 min)

**Contexte :** Vous développez une plateforme RH en ligne. Les utilisateurs peuvent être : **employé**, **manager**, **RH**, **admin**.

**Consigne :** Concevez la matrice RBAC pour ces fonctionnalités :
- Voir sa fiche de paie
- Voir la fiche de paie de son équipe
- Modifier les salaires
- Créer/supprimer des comptes utilisateurs

---

# TP 1 : Solution ✅

| Action | Employé | Manager | RH | Admin |
|--------|---------|---------|-----|-------|
| Voir sa propre fiche de paie | ✅ | ✅ | ✅ | ✅ |
| Voir la fiche de paie de son équipe | ❌ | ✅ | ✅ | ✅ |
| Modifier les salaires | ❌ | ❌ | ✅ | ✅ |
| Créer / supprimer des comptes | ❌ | ❌ | ❌ | ✅ |

**Principe du moindre privilège appliqué :** chaque rôle n'a accès qu'à ce dont il a strictement besoin.

**Point critique à implémenter :** vérifier les permissions **côté serveur** à chaque requête — jamais côté client uniquement.

---

# TP 2 : Cryptographie appliquée (15 min)

**Contexte :** La plateforme RH stocke des données sensibles. Vous devez décider comment les protéger.

**Consigne :** Pour chaque donnée, choisissez la protection adaptée et justifiez :
1. Mot de passe de connexion
2. Numéro de sécurité sociale
3. Données en transit (API REST)
4. Fichiers de bulletins de paie (PDF)

---

# TP 2 : Solution ✅

| Donnée | Protection | Pourquoi |
|--------|------------|---------|
| **Mot de passe** | Hachage bcrypt (coût 12) | Irréversible → même si la DB est volée, le mdp est inutilisable |
| **Numéro SS** | Chiffrement AES-256 | Réversible → on a besoin de le lire, mais pas de le chercher |
| **API en transit** | HTTPS / TLS 1.3 | Chiffre les échanges entre client et serveur |
| **PDFs** | Chiffrement AES-256 + accès signé (S3) | Stockage sécurisé + URL temporaire à usage unique |

---

# TP 3 : Evil User Stories & mitigations (20 min)

**Contexte :** Votre équipe Scrum travaille sur une app de **gestion de notes médicales**.

**User Stories existantes :**
1. "Je veux me connecter avec mon email et mot de passe"
2. "Je veux consulter le dossier médical d'un patient"
3. "Je veux envoyer un message à un autre praticien"
4. "Je veux exporter le dossier d'un patient en PDF"

**Consigne :** Rédigez une Evil User Story + mitigation pour chacune.

---

# TP 3 : Solution ✅

| User Story | Evil User Story | Mitigation |
|-----------|-----------------|------------|
| Me connecter | "Je veux tenter 50 000 mots de passe via l'API" | Rate limiting (5 essais/15 min) + MFA obligatoire |
| Consulter un dossier | "Je veux accéder au dossier d'un autre patient en changeant l'ID dans l'URL" | Vérifier que l'ID demandé appartient bien à l'utilisateur connecté (IDOR protection) |
| Envoyer un message | "Je veux injecter du HTML/JS dans le message" | Sanitization + CSP |
| Exporter en PDF | "Je veux générer un PDF avec des URLs internes pour faire du SSRF" | Whitelist des ressources autorisées dans le PDF |

---

# TP 4 : Construire un Sprint avec sécurité intégrée (15 min)

**Contexte :** Sprint 3 de la plateforme RH. Backlog disponible :

<div class="text-xs">

| Story | Points | Type |
|-------|--------|------|
| Upload de documents RH | 8 | Feature |
| Evil Story : limite type de fichier | 3 | Sécu |
| CVE critique sur multer (lib upload) | 2 | Bug sécu |
| Notifications par email | 5 | Feature |
| XSS sur la page de profil | 3 | Bug sécu |
| Tableau de bord manager | 8 | Feature |
| Mise à jour dépendances | 3 | Tech |

</div>

**Capacité : 30 points. Consigne :** composez le sprint en justifiant l'ordre de priorité.

---

# TP 4 : Solution ✅

**Sprint 3 sélectionné (28 points) :**

1. 🔴 **CVE critique multer** — 2 pts *(exploit possible sur la fonctionnalité d'upload → traiter avant de l'activer)*
2. 🔴 **XSS page de profil** — 3 pts *(haute sévérité, exposition directe)*
3. 🟠 **Upload de documents RH** — 8 pts *(fonctionnalité principale du sprint)*
4. 🟠 **Evil Story : limite type de fichier** — 3 pts *(doit accompagner l'upload)*
5. 🟠 **Mise à jour dépendances** — 3 pts *(prévention, effort faible)*
6. 🟢 **Notifications par email** — 5 pts *(valeur business)*
7. ❌ **Tableau de bord manager** — 8 pts *(reporté au Sprint 4)*

> **Règle :** les bugs de sécurité passent avant les nouvelles fonctionnalités.
