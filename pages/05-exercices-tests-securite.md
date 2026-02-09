---

# Exercices Module 5 : Tests de sécurité 🎯

---

# Exercice 1 : Configuration Semgrep (15 min)

**Consigne :** Écrivez 3 règles Semgrep personnalisées pour détecter :
1. Utilisation de `eval()` en JavaScript
2. Mot de passe en dur dans une variable
3. Utilisation de `http://` au lieu de `https://`

---

# Exercice 1 : Solution ✅

```yaml
rules:
  - id: no-eval
    pattern: eval(...)
    message: "eval() est dangereux - injection possible"
    severity: ERROR
    languages: [javascript]

  - id: hardcoded-password
    pattern: |
      const $VAR = "..."
    metavariable-regex:
      metavariable: $VAR
      regex: "(?i)(password|secret|key|token)"
    message: "Secret potentiellement codé en dur"
    severity: WARNING
    languages: [javascript]

  - id: insecure-http
    pattern: '"http://..."'
    message: "Utiliser HTTPS au lieu de HTTP"
    severity: WARNING
    languages: [javascript]
```

---

# Exercice 2 : Analyser un rapport npm audit (10 min)

**Rapport npm audit simulé :**

| Package | Severity | Vulnerability |
|---------|----------|--------------|
| lodash@4.17.20 | High | Prototype Pollution |
| express@4.17.1 | Low | Open Redirect |
| jsonwebtoken@8.5.0 | Critical | Algorithm Confusion |

**Questions :**
1. Quelle vulnérabilité traiter en premier ?
2. Quelle commande pour corriger ?
3. Que faire si le fix casse une API ?

---

# Exercice 2 : Solution ✅

**1.** jsonwebtoken (Critical) en priorité absolue - algorithme confusion peut permettre de forger des tokens

**2.** `npm audit fix` ou mise à jour ciblée : `npm install jsonwebtoken@latest`

**3.** Si le fix casse l'API :
- Créer un spike dans le backlog
- Appliquer un workaround temporaire (configuration stricte de l'algorithme)
- Planifier la migration dans le sprint suivant
- Monitorer les tentatives d'exploitation
