---

# Exercices Module 1 : Introduction DevSecOps 🎯

---

# Exercice 1 : Threat Modeling STRIDE (20 min)

**Contexte :** Vous concevez une application de gestion de notes collaboratives (type Notion simplifié) avec :
- Authentification par email/mot de passe
- Partage de notes entre utilisateurs
- Export PDF des notes
- API REST publique

**Consigne :** Appliquez la méthode STRIDE sur les 3 composants principaux et proposez des mitigations.

---

# Exercice 1 : Solution ✅

**Composant 1 : Endpoint d'authentification `/api/auth/login`**

| Menace | Risque | Mitigation |
|--------|--------|------------|
| **Spoofing** | Usurpation d'identité via brute force | Rate limiting (5 tentatives/15 min) + MFA |
| **Tampering** | Modification du JWT en transit | HTTPS obligatoire + signature RS256 |
| **Repudiation** | Nier une connexion frauduleuse | Logs d'audit horodatés + IP |
| **Info Disclosure** | Message "email non trouvé" | Message générique "Identifiants incorrects" |
| **DoS** | Flood de requêtes login | WAF + CAPTCHA après 3 échecs |
| **Elevation** | JWT avec rôle admin modifié | Signature côté serveur, vérification à chaque requête |

---

# Exercice 1 : Solution (suite)

**Composant 2 : Partage de notes `/api/notes/:id/share`**

| Menace | Risque | Mitigation |
|--------|--------|------------|
| **Spoofing** | Partager au nom d'un autre | Vérifier ownership via token |
| **Tampering** | Modifier les droits de partage | Validation côté serveur des permissions |
| **Info Disclosure** | IDOR : accéder à une note via son ID | UUID au lieu d'ID séquentiel + vérification d'accès |
| **Elevation** | Passer de "lecture" à "écriture" | RBAC strict, vérification à chaque requête |

---

# Exercice 1 : Solution (fin)

**Composant 3 : Export PDF `/api/notes/:id/export`**

| Menace | Risque | Mitigation |
|--------|--------|------------|
| **Tampering** | Injection de contenu malveillant dans le PDF | Sanitization du HTML avant export |
| **Info Disclosure** | Export d'une note d'un autre | Vérification d'ownership |
| **DoS** | Export de notes très volumineuses | Limite de taille + file d'attente |
| **SSRF** | Images dans la note pointant vers des URLs internes | Whitelist des domaines d'images |

---

# Exercice 2 : Calcul du ROI de la sécurité (10 min)

**Scénario :** Votre entreprise hésite à investir dans un programme DevSecOps.

**Données :**
- Coût annuel moyen d'un data breach : **4.45M$ (IBM 2023)**
- Coût d'un programme DevSecOps : **150K$/an** (outils + formation)
- Nombre de vulnérabilités critiques détectées/an sans programme : **12**
- Avec programme DevSecOps : **2** (et détectées plus tôt)

**Question :** Calculez le ROI et préparez un argumentaire pour la direction.

---

# Exercice 2 : Solution ✅

**Calcul simplifié :**
- Risque sans DevSecOps : 12 vulnérabilités critiques
- Probabilité d'exploitation : ~10% → 1.2 incident/an
- Coût moyen par incident : ~500K$ (PME)
- **Coût du risque : 600K$/an**

**Avec DevSecOps :**
- 2 vulnérabilités résiduelles, détectées en amont
- Probabilité exploitation : ~2% → 0.04 incident/an
- Coût du risque : 20K$/an
- **Investissement : 150K$/an**

**ROI = (600K - 20K - 150K) / 150K = 286%**

**Argumentaire :** Pour 1$ investi en DevSecOps, on économise 2.86$ en risque. Sans compter la réputation, la conformité RGPD et la confiance client.

---

# Exercice 3 : Cartographie des rôles DevSecOps (10 min)

**Consigne :** Pour une équipe de 8 personnes (5 devs, 1 PO, 1 Scrum Master, 1 ops), définissez :
1. Qui devient Security Champion ?
2. Quelles responsabilités sécurité pour chaque rôle ?
3. Comment intégrer la sécurité dans les cérémonies Scrum ?

---

# Exercice 3 : Solution ✅

**Security Champion :** 1 des 5 développeurs (le plus motivé/expérimenté en sécurité), avec 20% de son temps dédié.

| Rôle | Responsabilités sécurité |
|------|-------------------------|
| **Security Champion** | Code review sécu, veille CVE, formation équipe |
| **Développeurs** | Écrire du code sécurisé, respecter la DoD |
| **PO** | Prioriser les stories de sécurité, écrire les Evil User Stories |
| **Scrum Master** | S'assurer que la sécurité est dans les cérémonies |
| **Ops** | Maintenir le pipeline CI/CD sécurisé, monitoring |

---

**Cérémonies :**
- **Planning** : inclure stories sécurité
- **Daily** : mentionner les alertes sécurité
- **Review** : démontrer les améliorations sécu
- **Rétro** : discuter les incidents et améliorations
