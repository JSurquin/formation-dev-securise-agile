---

# Exercices Module 7 : Gestion des vulnérabilités 🎯

---

# Exercice 1 : Triaging (15 min)

**Consigne :** Vous recevez le rapport suivant. Priorisez les vulnérabilités et assignez des délais.

| # | Vulnérabilité | CVSS | Composant | Exploit public |
|---|--------------|------|-----------|---------------|
| 1 | SQL Injection sur /api/search | 9.8 | API publique | Oui |
| 2 | XSS réfléchi sur /about | 6.1 | Page marketing | Non |
| 3 | Dépendance lodash obsolète | 7.5 | Backend | Oui |
| 4 | CORS trop permissif | 5.3 | API interne | Non |
| 5 | Log4j en test | 10.0 | Env de test | Oui |

---

# Exercice 1 : Solution ✅

| Priorité | # | Action | Délai |
|----------|---|--------|-------|
| 🔴 1 | 1 | Hotfix SQL Injection - API publique + exploit | 24h |
| 🔴 2 | 5 | Patcher Log4j même en test (pivot possible) | 48h |
| 🟠 3 | 3 | Mettre à jour lodash (exploit public) | 1 semaine |
| 🟡 4 | 2 | Corriger XSS (pas d'exploit, page non critique) | 2 semaines |
| 🟢 5 | 4 | CORS - API interne, pas d'exploit | Prochain sprint |

---

# Exercice 2 : Rédiger un post-mortem (15 min)

**Scénario :** Un développeur a commité un fichier `.env` contenant la clé API d'un service de paiement. Le fichier est resté 3 jours sur GitHub public avant d'être détecté. 200 transactions frauduleuses ont eu lieu.

**Consigne :** Rédigez un post-mortem blameless avec :
- Timeline
- Cause racine
- Impact
- Actions correctives

---

# Exercice 2 : Solution ✅

**Timeline :**
- J0 10h : Commit du .env sur main
- J0-J3 : Fichier visible publiquement
- J3 14h : Alerte du service de paiement
- J3 14h30 : Rotation de la clé API
- J3 15h : Nettoyage de l'historique Git

**Cause racine :** Pas de hook pre-commit pour détecter les secrets + .gitignore incomplet

---

# Exercice 2 : Solution (suite) ✅

**Impact :**
- 200 transactions frauduleuses (~15 000€)
- Clé API compromise pendant 3 jours

**Actions correctives :**
1. ✅ Installer git-secrets comme hook pre-commit obligatoire
2. ✅ Ajouter GitLeaks dans le pipeline CI
3. ✅ Template .gitignore avec .env par défaut
4. ✅ Formation équipe sur la gestion des secrets
5. ✅ Rotation automatique des clés API (tous les 90 jours)
6. ✅ Alerting sur usage anormal des API de paiement
