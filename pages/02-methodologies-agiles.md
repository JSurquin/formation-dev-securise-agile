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

# Cas réel : la faille d'Equifax (2017) 💥

> **Ce qui s'est passé :** Equifax, agence de crédit américaine, subit une fuite de données touchant **147 millions de personnes**. Coût : **4 milliards de dollars**.

**Cause racine :**
- Une CVE critique sur Apache Struts publiée en **mars 2017**
- Un patch existait — il n'a pas été appliqué
- La faille a été exploitée en **mai 2017** (2 mois plus tard)

**Ce qu'un processus DevSecOps aurait évité :**
- Dependabot/Snyk aurait créé un ticket automatiquement
- La CVE critique aurait été traitée en 24-48h (politique de patch)
- La fuite n'aurait pas eu lieu

---

# Cas réel : Log4Shell (2021) 🔥

**CVE-2021-44228 — Score CVSS : 10.0 (maximum)**

> **Log4j** = bibliothèque de logging Java présente dans des millions d'applications.

**L'attaque :**
- Une simple ligne dans un champ texte suffit à exécuter du code sur le serveur
- Exploitable sans authentification
- Détectée un vendredi soir, exploits en masse le week-end suivant

**Impact :**
- Apple, Amazon, Tesla, Minecraft touchés
- Des centaines de milliers de serveurs compromis en 72h

**Leçon agile :** avoir un SBOM (inventaire de dépendances) à jour permet de savoir en 5 minutes si on est exposé.

---

# MFA : pourquoi c'est non négociable 📱

> **Analogie :** Le mot de passe seul, c'est une serrure sans chaîne de sécurité. Le MFA, c'est la serrure + la chaîne + le judas.

**Les statistiques :**
- 99.9% des attaques sur comptes sont bloquées par le MFA (Microsoft, 2023)
- 61% des violations de données impliquent des identifiants volés (Verizon DBIR)

**Types de second facteur :**
| Type | Sécurité | Exemple |
|------|----------|---------|
| SMS | ⭐⭐ (SIM swapping possible) | Code par texto |
| TOTP | ⭐⭐⭐ | Google Authenticator |
| FIDO2/Passkey | ⭐⭐⭐⭐⭐ | Clé physique YubiKey |

---

# Le chiffrement en pratique : ce qu'on stocke en base 🗄️

**Pour une appli e-commerce typique :**

| Donnée | Stockage | Méthode |
|--------|----------|---------|
| Mot de passe | Jamais en clair | `bcrypt(password, 12)` |
| Email | Clair ou chiffré | AES-256 si RGPD strict |
| Numéro de carte | **JAMAIS** | Déléguer à Stripe/Braintree |
| Numéro SS | Chiffré | AES-256 + clé hors BDD |
| Adresse | Clair ou chiffré | Selon sensibilité |
| Token JWT | Jamais | Stateless, non stocké |

> **Règle :** si la donnée n'est pas nécessaire, ne pas la collecter.

---

# OAuth 2.0 et authentification déléguée 🔗

> **Analogie :** OAuth, c'est le badge visiteur d'un immeuble. Tu ne donnes pas tes clés à un visiteur — tu lui donnes un badge temporaire avec accès limité.

**Flux OAuth 2.0 simplifié ("Connexion avec Google") :**

```
1. L'utilisateur clique "Se connecter avec Google"
2. Redirection vers Google (avec notre client_id)
3. L'utilisateur autorise sur Google
4. Google renvoie un code temporaire
5. Notre serveur échange le code contre un access_token
6. On récupère l'email/profil via l'API Google
7. On crée la session → jamais de mot de passe stocké
```

**Avantage sécurité :** on ne gère pas les mots de passe = pas de risque de fuite de mots de passe.

---

# Les injections : au-delà du SQL 💉

**Les injections ne concernent pas que les bases de données :**

| Type | Cible | Exemple d'attaque |
|------|-------|------------------|
| SQL | Base de données | `' OR '1'='1` |
| NoSQL | MongoDB | `{ "$gt": "" }` |
| Command | Système OS | `; rm -rf /` |
| LDAP | Annuaire | `*)(uid=*` |
| XPath | XML | `' or '1'='1` |
| Template | Moteur de rendu | `{{7*7}}` (SSTI) |

**Remède universel :** ne jamais concaténer des données utilisateur dans une commande ou requête. Toujours utiliser des paramètres ou des échappements adaptés au contexte.

---

# SAST en action : ce que Semgrep détecte 🔍

**Exemples de règles Semgrep sur du code Node.js :**

```javascript
// 🔴 Semgrep détecte : hardcoded-secret
const API_KEY = "sk-1234567890"

// 🔴 Semgrep détecte : sql-injection
db.query(`SELECT * FROM users WHERE id=${req.params.id}`)

// 🔴 Semgrep détecte : weak-crypto
crypto.createHash('md5').update(password)

// 🔴 Semgrep détecte : express-xss
res.send('<div>' + req.query.name + '</div>')
```

> Semgrep analyse le code **sans l'exécuter** → feedback en secondes dans la CI.

---

# SCA en action : npm audit 📦

```bash
$ npm audit

# found 3 vulnerabilities (1 moderate, 2 high)

# severity : high
# Package : express-fileupload
# Patched in : >=1.4.0
# CVE : CVE-2022-27261 — prototype pollution
# Dependency of : myapp > express-fileupload

# Run `npm audit fix` to fix 2 of 3 issues.
# 1 issue requires manual review (breaking change)
```

**Dans le contexte agile :**
- Ce rapport → ticket dans le backlog
- CVE high → traité dans le sprint en cours
- Breaking change → spike pour évaluer la migration

---

# Le coût réel d'une faille non corrigée 💰

**IBM Cost of a Data Breach 2023 :**

- Coût moyen mondial d'une violation de données : **4,45 M$**
- En France : **4,08 M$**
- Délai moyen avant détection : **204 jours**
- Délai moyen avant confinement : **73 jours** supplémentaires

<div class="text-xs">

**Par type de faille :**
| Vecteur | Coût moyen |
|---------|-----------|
| Identifiants compromis | 4,6 M$ |
| Phishing | 4,76 M$ |
| Cloud misconfiguration | 4,0 M$ |
| Vulnérabilité logicielle | 4,5 M$ |

</div>

---

# DevSecOps : les outils par phase 🗺️

| Phase du sprint | Outil | Action |
|----------------|-------|--------|
| **IDE (dev)** | Snyk IDE, SonarLint | Alerte en temps réel en codant |
| **Pre-commit** | Gitleaks, git-secrets | Bloque si secret détecté |
| **CI - SAST** | Semgrep, CodeQL | Scan du code source |
| **CI - SCA** | npm audit, Snyk | Scan des dépendances |
| **CI - Image** | Trivy | Scan Docker |
| **Staging - DAST** | OWASP ZAP | Test de l'appli en cours d'exécution |
| **Production** | Snyk Monitor | Surveillance continue |

---

# Threat Modeling express en sprint 🎯

**On n'a pas toujours le temps d'un threat model complet. Version rapide pour un sprint :**

**4 questions à poser pour chaque nouvelle fonctionnalité :**

1. **Qui peut abuser de cette fonctionnalité ?**
   → Rédiger l'Evil User Story

2. **Quelles données sont exposées ?**
   → Vérifier le RBAC et le chiffrement

3. **Quels composants tiers sont utilisés ?**
   → Vérifier les CVE (SCA)

4. **Qu'est-ce qui se passe si ça tombe ?**
   → Prévoir la gestion d'erreur et le monitoring

---

# En résumé : Module 2 📝

- **Accès** : AAA (Authentification + Autorisation + Audit) → RBAC + principe du moindre privilège
- **Crypto** : bcrypt pour les mots de passe, AES-256 pour les données, HTTPS partout
- **MFA** : bloque 99.9% des attaques sur comptes — non négociable
- **Injections** : SQL, NoSQL, Command, Template → requêtes paramétrées toujours
- **CVE + CVSS** → délais de correction agiles : 24h critique, 7j haute
- **DevSecOps** : outils à chaque phase du sprint (IDE → pre-commit → CI → staging → prod)
- **Equifax, Log4Shell** : exemples réels du coût d'une CVE non traitée
- **Evil User Stories** + **DoD sécurisée** = outils concrets pour chaque sprint
