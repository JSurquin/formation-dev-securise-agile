---
layout: new-section
---

# 🎯 Exercices — Module 10
## Chaîne DevSecOps complète

---

# Exercice 1 : Lancer l'environnement DevSecOps 🚀

**Durée estimée : 20 min**

> **Objectif :** Avoir GitLab + Jenkins qui tournent localement via Docker Compose.

**Étapes :**

**1. Créer la structure**
```bash
mkdir devsecops-lab && cd devsecops-lab
# Créer le docker-compose.yml (voir slide du module)
```

**2. Lancer les conteneurs**
```bash
docker compose up -d
docker compose ps   # vérifier que tout est "running"
```

**3. Accéder aux interfaces**
```
GitLab  → http://localhost:8080  (user: root, mdp: voir slide)
Jenkins → http://localhost:9090  (mdp: voir slide)
```

**✅ Critère de validation :** les deux interfaces sont accessibles dans le navigateur et le Runner GitLab apparaît en vert dans Admin → Runners.

---

# Exercice 2 : Projet Java — pipeline complet 🔨

**Durée estimée : 30 min**

> **Objectif :** Créer le projet Java minimaliste et le pusher sur GitLab pour déclencher le pipeline.

**Étapes :**

**1. Créer le projet sur GitLab**
```
http://localhost:8080 → New Project → Create blank project
Nom : java-devsecops-demo
Visibilité : Private
```

**2. Créer le code**
```bash
git clone http://localhost:8080/root/java-devsecops-demo.git
cd java-devsecops-demo
# Créer App.java, pom.xml, Dockerfile, .gitlab-ci.yml
# (utiliser les contenus des slides)
git add . && git commit -m "feat: initial devsecops setup"
git push
```

**3. Observer le pipeline**
```
GitLab → CI/CD → Pipelines → voir les stages s'exécuter
```

**✅ Critère de validation :** le pipeline passe au vert (toutes les étapes vertes).

---

# Exercice 3 : Déclencher un security gate 🚨

**Durée estimée : 15 min**

> **Objectif :** Comprendre ce que ressent le développeur quand le pipeline bloque pour une bonne raison.

**Étapes :**

**1. Ajouter un faux secret dans le code Java**
```java
// App.java — ajouter volontairement
public class App {
    // ❌ Ceci va déclencher Gitleaks (clé Stripe au format valide)
    private static final String STRIPE_KEY = "sk_live_51NxKjUIJV4QBqzxvXXXXXXXXXXXXXXXXXX";
    
    public static void main(String[] args) {
        System.out.println("Hello DevSecOps!");
    }
}
```

> **⚠️ Astuce :** Les clés AWS de documentation (`AKIAIOSFODNN7EXAMPLE`) sont intentionnellement ignorées par Gitleaks. Utilisez le format Stripe `sk_live_51...` qui est détecté immédiatement.

**2. Pusher et observer**
```bash
git add . && git commit -m "test: add fake secret"
git push
# → Le pipeline doit s'arrêter au stage "secrets" en rouge
```

**3. Corriger et repusher**
```java
// Supprimer la constante, utiliser une variable d'environnement
String stripeKey = System.getenv("STRIPE_KEY");
```

**⚠️ Attention :** si vous repushzez simplement sans la clé, Gitleaks **trouvera quand même la clé dans l'historique git** des commits précédents. Pour que le pipeline repasse au vert, il faut **recréer le projet** (ou faire un `git rebase` pour réécrire l'historique).

> C'est volontairement la leçon la plus importante : **un secret committé même une seule fois doit être révoqué**. Réécrire l'historique ne suffit pas si quelqu'un a déjà cloné le repo.

**✅ Critère de validation :** comprendre pourquoi Gitleaks bloque même après correction du fichier.

---

# Exercice 4 : Projet PHP — corriger la faille XSS ⚔️

**Durée estimée : 25 min**

> **Objectif :** Le pipeline PHP doit détecter la faille XSS, vous la corrigez, le pipeline repasse au vert.

**Étapes :**

**1. Créer le projet PHP sur GitLab et pusher le code**
```bash
# Créer php-devsecops-demo sur GitLab
# Pusher le code avec la faille XSS volontaire dans index.php
```

**2. Observer la détection Semgrep**
```
Le stage "sast-semgrep" doit échouer avec :
→ php.lang.security.audit.xss.tainted-html-response.tainted-html-response
   public/index.php line 3
   Détecté : echo "<h1>Hello, " . $name . "!</h1>";
```

**3. Corriger la faille**
```php
<?php
$name = $_GET['name'] ?? 'World';
// ✅ Toujours échapper les données utilisateur affichées en HTML
echo "<h1>Hello, " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "!</h1>";
?>
```

**4. Pusher et vérifier**
```bash
git add . && git commit -m "fix: escape XSS vulnerability in index.php"
git push
# → Le pipeline doit repasser au vert
```

---

# Exercice 5 : Renovate — MR automatique 🔄

**Durée estimée : 20 min**

> **Objectif :** Voir Renovate créer une Merge Request automatique pour une dépendance obsolète.

**Étapes :**

**1. Créer votre token GitLab**
```
GitLab → User Settings → Access Tokens
→ Nom : renovate-bot
→ Scopes : api, read_repository, write_repository
→ Copier le token
```

**2. Configurer et lancer Renovate**
```bash
# Dans devsecops-lab/
echo "RENOVATE_GITLAB_TOKEN=glpat-VOTRE_TOKEN" > .env

# Lancer Renovate (une seule fois)
docker compose --profile renovate run --rm renovate
```

**3. Vérifier dans GitLab**
```
GitLab → votre projet → Merge Requests
→ Des MR créées par "renovate-bot" doivent apparaître
→ Ouvrir une MR et lire le changelog automatique
```

**✅ Critère de validation :** au moins une MR Renovate visible dans votre projet.

---

# Exercice 6 (Bonus) : Jenkins pipeline PHP 🎁

**Durée estimée : 30 min**

> **Objectif :** Connecter Jenkins à GitLab et déclencher le pipeline PHP via un webhook.

**Étapes :**

**1. Dans Jenkins : créer le pipeline**
```
New Item → Pipeline → Multibranch Pipeline
Branch Sources → Git → URL du projet PHP GitLab
```

**2. Configurer le webhook GitLab → Jenkins**
```
GitLab → Settings → Webhooks
URL : http://localhost:9090/project/php-devsecops-demo
Trigger : Push events + Merge request events
```

**3. Pousser un commit et observer Jenkins**
```bash
# Modifier index.php (ex: ajouter un commentaire)
git add . && git commit -m "chore: trigger jenkins"
git push
# → Vérifier que Jenkins démarre le pipeline automatiquement
```

**✅ Critère de validation :** le Jenkinsfile PHP s'exécute automatiquement à chaque push sur GitLab.

---

# Solutions & Points de blocage courants 💡

**Problème : GitLab met 10 min à démarrer**
```bash
# Normal — surveiller avec :
docker logs -f gitlab 2>&1 | grep -E "(Starting|Reconfigured|error)"
# Attendre le message : "gitlab Reconfigured!"
```

**Problème : Le Runner ne s'enregistre pas**
```bash
# Vérifier que GitLab est bien accessible depuis le runner
docker exec gitlab-runner curl -s http://gitlab/-/readiness
# Doit répondre : {"status":"ok"}
```

**Problème : Le pipeline échoue sur Docker-in-Docker**
```yaml
# Vérifier que le runner a bien privileged: true dans sa config
# /etc/gitlab-runner/config.toml
[runners.docker]
  privileged = true
  volumes = ["/certs/client", "/cache"]
```

**Problème : RAM insuffisante → passer en Solution B**
```bash
# Arrêter GitLab local
docker compose stop gitlab gitlab-runner
# Utiliser gitlab.com et ne garder que Jenkins
docker compose up -d jenkins
```
