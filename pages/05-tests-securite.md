---
layout: new-section
routeAlias: 'tests-securite'
---

<a name="tests-securite" id="tests-securite"></a>

# 🧪 Module 5
## Tests de sécurité automatisés

### SAST, DAST, SCA et pentesting automatisé

---

# Les 3 types de tests de sécurité 🔍

| Type | Quand | Comment |
|------|-------|---------|
| **SAST** | Développement | Analyse du code source |
| **DAST** | Runtime | Test de l'app en exécution |
| **SCA** | Build | Scan des dépendances |

**Complémentaires :** les 3 sont nécessaires pour une couverture complète.

---

# SAST - Static Application Security Testing 📝

**Analyse du code source SANS l'exécuter.**

**Avantages :**
- Détection précoce (avant le deploy)
- Couvre tout le code
- Feedback rapide aux développeurs

**Outils populaires :**
- **SonarQube** (multi-langages)
- **Semgrep** (règles personnalisables)
- **CodeQL** (GitHub)
- **Snyk Code** (IDE intégré)

---

# Exemple SAST avec Semgrep

```yaml
# .semgrep.yml
rules:
  - id: sql-injection
    patterns:
      - pattern: |
          $DB.query(`...${$VAR}...`)
    message: "Possible SQL injection"
    severity: ERROR
    languages: [javascript, typescript]

  - id: hardcoded-secret
    pattern: |
      const $KEY = "sk-..."
    message: "Secret codé en dur détecté"
    severity: ERROR
```

---

# DAST - Dynamic Application Security Testing 🌐

**Teste l'application en cours d'exécution.**

**Avantages :**
- Teste le comportement réel
- Détecte les problèmes de configuration
- Indépendant du langage

**Outils populaires :**
- **OWASP ZAP** (gratuit, open source)
- **Burp Suite** (professionnel)
- **Nuclei** (templates communautaires)

---

# Exemple DAST avec OWASP ZAP

```bash
# Scan rapide avec ZAP en mode ligne de commande
docker run -t zaproxy/zap-stable zap-baseline.py \
  -t https://mon-app.dev \
  -r rapport-zap.html

# Scan complet (plus long, plus approfondi)
docker run -t zaproxy/zap-stable zap-full-scan.py \
  -t https://mon-app.dev \
  -r rapport-complet.html
```

---

# SCA - Software Composition Analysis 📦

**Analyse les dépendances tierces pour trouver les vulnérabilités connues.**

**Pourquoi c'est crucial :**
- 80% du code d'une app vient de bibliothèques externes
- Les attaques supply chain sont en hausse
- Log4Shell a touché des millions d'applications

**Outils :**
- `npm audit` / `yarn audit`
- **Snyk** (scan + fix automatique)
- **Dependabot** (GitHub)
- **Renovate** (multi-plateforme)

---

# npm audit en pratique

```bash
# Scanner les vulnérabilités
npm audit

# Corriger automatiquement
npm audit fix

# Résultat typique :
# found 3 vulnerabilities
#   1 low, 1 moderate, 1 high
# Run `npm audit fix` to fix them
```

---

# Pentesting automatisé 🎯

**Tests de pénétration automatisés dans la CI/CD :**

**Nuclei** : scanner de vulnérabilités basé sur des templates

```bash
# Installation
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Scan avec templates OWASP
nuclei -u https://mon-app.dev \
  -t cves/ \
  -t vulnerabilities/ \
  -severity critical,high
```

---

# Pyramide des tests de sécurité 🔺

De la base au sommet :

1. **SAST** (le plus fréquent, à chaque commit)
2. **SCA** (à chaque build)
3. **DAST** (à chaque déploiement en staging)
4. **Pentest manuel** (trimestriel/annuel)

> Plus on monte, plus c'est coûteux mais complet.

---

# En résumé : Tests de sécurité 📝

- **SAST** : scan du code source statiquement
- **DAST** : test de l'app en exécution
- **SCA** : scan des dépendances
- Les 3 sont **complémentaires** et nécessaires
- Automatiser au maximum dans la **CI/CD**
- Le pentest manuel reste utile mais moins fréquent
