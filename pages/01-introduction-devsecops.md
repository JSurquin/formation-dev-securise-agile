---
layout: new-section
routeAlias: 'introduction-devsecops'
---

<a name="introduction-devsecops" id="introduction-devsecops"></a>

# 🔄 Module 1
## Introduction au développement agile

### Scrum, Kanban, principes de l'agilité et projet sécurisé

---

# C'est quoi l'Agile ? 🤔

> **Analogie :** Construire une maison en Waterfall, c'est livrer toute la maison 1 an après. En Agile, tu livres d'abord le studio, puis tu agrandis sprint après sprint.

**L'Agile** = famille de méthodes de développement basées sur des **cycles courts et itératifs**.

**Pourquoi ?**
- Le besoin client évolue en cours de route
- Mieux vaut livrer vite et ajuster que livrer parfait trop tard
- Les équipes s'auto-organisent et collaborent

---

# Le Manifeste Agile (2001) 📜

4 valeurs fondatrices signées par 17 experts du dev :

| On valorise... | ...plus que |
|----------------|-------------|
| Les **individus et interactions** | Les processus et outils |
| Un **logiciel fonctionnel** | Une documentation exhaustive |
| La **collaboration client** | La négociation contractuelle |
| L'**adaptation au changement** | Le suivi d'un plan figé |

> Ce n'est pas « pas de plan », c'est « s'adapter quand le plan ne tient plus ».

---

# Waterfall vs Agile 🆚

**Waterfall (cascade) :**
- Phases séquentielles : Analyse → Conception → Dev → Test → Livraison
- On livre **tout à la fin** (souvent 6-18 mois plus tard)
- Un bug découvert en test = retour en arrière coûteux
- La sécurité arrive en **dernière phase**

**Agile :**
- Cycles courts (1 à 4 semaines) = **sprints**
- On livre quelque chose de fonctionnel **à chaque sprint**
- Les bugs sont détectés tôt et corrigés vite
- La sécurité peut être intégrée **à chaque cycle**

---

# Analogie : le restaurant vs le traiteur 🍽️

> **Waterfall** = le traiteur : tu commandes ton menu de mariage 6 mois à l'avance, tu ne goûtes rien avant le jour J. Si la sauce est ratée, trop tard.

> **Agile** = le restaurant avec menu dégustation : le chef sort un plat à la fois, tu donnes ton avis, il ajuste. Tu repars satisfait.

**En développement :**
- Le traiteur livre une appli en une fois, 18 mois après
- Le restaurant livre une fonctionnalité utilisable chaque sprint

---

# Scrum : le framework agile le plus utilisé 🏉

> **Analogie rugby :** Scrum = la mêlée. Toute l'équipe pousse ensemble, organisée, vers un seul objectif.

**3 rôles :**
- **Product Owner** : le client/représentant — il décide *quoi* faire
- **Scrum Master** : le coach — il protège l'équipe et le processus
- **Équipe dev** : pluridisciplinaire, auto-organisée — ils décident *comment*

**3 artefacts :**
- **Product Backlog** : la liste de tout ce qu'on veut faire
- **Sprint Backlog** : ce qu'on s'engage à faire ce sprint
- **Incrément** : le livrable concret à la fin du sprint

---

# Scrum : les 4 cérémonies ⏰

| Cérémonie | Quand | Durée | Pour quoi faire |
|-----------|-------|-------|----------------|
| **Sprint Planning** | Début de sprint | 2-4h | Choisir et planifier les tâches |
| **Daily Standup** | Chaque jour | 15 min | Se synchroniser (hier / aujourd'hui / blocages) |
| **Sprint Review** | Fin de sprint | 1-2h | Montrer ce qui a été livré |
| **Rétrospective** | Fin de sprint | 1h | Améliorer le fonctionnement d'équipe |

---

# Le Sprint : boucle de base de Scrum 🔁

> **Analogie :** Un sprint = une émission de cuisine en direct. En 2 semaines, l'équipe part de zéro, cuisine, goûte, ajuste et livre un plat fini.

**Déroulement d'un sprint de 2 semaines :**

```
Jour 1    → Sprint Planning : on choisit les stories
Jours 2-9 → Développement quotidien + Daily Standup
Jour 10   → Sprint Review : démo au client
Jour 10   → Rétrospective : qu'est-ce qu'on améliore ?
           → Sprint suivant
```

---

# Kanban : le flux continu 📌

> **Analogie :** Kanban = la cuisine d'un restaurant. Les commandes arrivent, passent de "à faire" à "en cours" à "servi". Pas de sprint figé, flux continu.

**Principes Kanban :**
- Visualiser tout le travail sur un tableau
- Limiter le **WIP** (Work In Progress) pour éviter de tout faire à moitié
- Améliorer le flux en continu

| À faire | En cours *(max 3)* | En revue | Terminé |
|---------|--------------------|----------|---------|
| Tâche D | Tâche B | Tâche C | Tâche A |
| Tâche E | Tâche F | | |

---

# Scrum vs Kanban : lequel choisir ? 🤷

| Critère | Scrum | Kanban |
|---------|-------|--------|
| Rythme | Sprints fixes | Flux continu |
| Planification | Par sprint | Au fil de l'eau |
| Changement en cours | Sprint suivant | Immédiat |
| Idéal pour | Dev de nouvelles fonctionnalités | Maintenance, support |
| Sécurité | Intégrée dans le sprint | Intégrée dans le flux |

> **En pratique :** beaucoup d'équipes combinent les deux (Scrumban).

---

# Les 12 principes agiles liés à la sécurité 🔐

Le Manifeste Agile contient 12 principes. Voici ceux directement applicables à la sécurité :

- **Livrer souvent** → détecter les failles plus tôt
- **Répondre au changement** → s'adapter aux nouvelles menaces
- **L'excellence technique** favorise l'agilité → le code propre est plus sûr
- **Amélioration continue** → la sécurité s'améliore à chaque rétro

> **Principe clé :** "Une attention continue à l'excellence technique et à la bonne conception renforce l'agilité." → Elle renforce aussi la sécurité.

---

# Agile + Sécurité : le combo gagnant 🏆

**Le problème historique :**
- Agile → vite, livrer, itérer
- Sécurité → perçue comme lente et contraignante
- Résultat : sécurité sacrifiée au profit de la vélocité

**La bonne approche :**
- La sécurité = une **fonctionnalité** à livrer comme les autres
- Elle rentre dans le **backlog**, les **sprints**, la **DoD**
- Elle est **automatisée** pour ne pas ralentir

> **Analogie :** La sécurité dans Agile, c'est comme la ceinture de sécurité en F1. Elle n'est pas optionnelle et elle ne ralentit pas le pilote.

---

# Histoire de l'Agile : d'où ça vient ? 📖

**Avant l'Agile (années 80-90) :**
- Tous les projets informatiques suivaient le modèle Waterfall
- Taux d'échec des projets IT : **70%** (Standish Group, 1994)
- Raisons : besoins mal compris, livraisons trop tardives, coûts explosés

**En 2001 :**
- 17 experts se réunissent dans une station de ski à Snowbird, Utah
- Ils rédigent le **Manifeste Agile** en 2 jours
- Objectif : trouver de "meilleures façons de développer des logiciels"

> Parmi eux : les créateurs de Scrum, XP, DSDM, Crystal...

---

# Pourquoi l'Agile a-t-il changé le secteur ? 💡

**Le Chaos Report (Standish Group) compare Waterfall vs Agile :**

| Indicateur | Waterfall | Agile |
|------------|-----------|-------|
| Projets réussis | 14% | 42% |
| Projets en échec total | 29% | 9% |
| Livraison dans les délais | 16% | 59% |

> **Résultat :** l'Agile multiplie par 3 les chances de succès d'un projet logiciel.

---

# Scrum en pratique : exemple d'une startup 🚀

**Contexte :** Startup qui développe une appli de covoiturage.

**Sprint 1 (2 semaines) :**
- Inscription + connexion utilisateur ✅
- Affichage d'une carte ✅

**Sprint 2 :**
- Création d'un trajet ✅
- Recherche de trajets ✅

**Sprint 3 :**
- ⚠️ Feedback utilisateur : "la recherche est trop lente"
- → Priorisation immédiate, réponse au changement

> En Waterfall, ce feedback aurait été reçu 12 mois plus tard.

---

# Le Product Backlog : comment il est structuré 📋

**Un backlog bien tenu, c'est la clé d'un projet Scrum qui marche.**

**Structure d'une User Story :**
> En tant que **[rôle]**, je veux **[fonctionnalité]** afin de **[bénéfice]**

**Exemple :**
> En tant que **voyageur**, je veux **voir les trajets disponibles sur une carte** afin de **choisir le trajet le plus pratique**

**Critères d'acceptation :**
- La carte affiche les départs et arrivées
- Les trajets sont filtrables par date
- Le temps de chargement est < 2 secondes

---

# La vélocité : mesurer le rythme de l'équipe 📊

**La vélocité** = nombre de story points livrés par sprint.

**Pourquoi c'est utile :**
- Prédire combien de sprints pour livrer le backlog restant
- Détecter les sprints où l'équipe a été ralentie (incident, dette technique)

<div class="text-xs">

**Exemple de suivi sur 5 sprints :**

| Sprint | Vélocité | Observation |
|--------|----------|-------------|
| 1 | 18 pts | Démarrage, équipe qui s'organise |
| 2 | 24 pts | Rythme trouvé |
| 3 | 12 pts | CVE critique traité en urgence |
| 4 | 26 pts | Productivité au top |
| 5 | 22 pts | Stable |

</div>

---

# Kanban en pratique : exemple d'une équipe support 🎫

**Une équipe de maintenance/support utilise Kanban :**

```
À faire          En cours (max 3)    En test     Terminé
─────────────    ─────────────────   ────────    ────────
Bug #47          Bug #45             Bug #44     Bug #42
Bug #48          Bug #43             Fix #41     Bug #40
CVE npm          Upgrade Node
```

**Règle WIP = 3 :** si "En cours" est plein, on ne commence rien de nouveau.
→ On finit ce qui est commencé avant de prendre autre chose.

> **Résultat :** moins de contexte switching, finitions plus rapides.

---

# Scrum vs Kanban : cas d'usage réels 🏭

**Quand choisir Scrum ?**
- Nouvelle fonctionnalité à développer
- Équipe stable avec roadmap définie
- Besoin de démos régulières au client
- Exemple : développement d'une nouvelle appli mobile

**Quand choisir Kanban ?**
- Maintenance et support continu
- Flux de bugs imprévisible
- Équipe qui reçoit des demandes ad hoc
- Exemple : équipe SRE (Site Reliability Engineering)

**Quand combiner les deux (Scrumban) ?**
- Quand l'équipe fait à la fois du dev et du support

---

# Les erreurs classiques en Agile 🚫

> Connaître les pièges évite de les reproduire.

**Erreur 1 : "Scrum washing"**
- Donner des noms Scrum (sprint, daily) à un projet Waterfall déguisé
- Signe : pas de vraie adaptation, le plan ne change jamais

**Erreur 2 : Le "sprint sans fin"**
- Un sprint qui dure 3 mois n'est plus un sprint
- Les feedbacks arrivent trop tard

**Erreur 3 : Oublier la rétrospective**
- C'est la cérémonie la plus sacrifiée... et la plus utile
- Sans rétro, les mêmes erreurs se répètent indéfiniment

**Erreur 4 : Backlog jamais reffiné**
- Un backlog non entretenu = dette de planification

---

# L'estimation en Agile : les story points ♟️

**Les story points** mesurent la **complexité relative**, pas le temps.

**Échelle de Fibonacci :** 1 · 2 · 3 · 5 · 8 · 13 · 21

> **Pourquoi Fibonacci ?** L'incertitude augmente avec la taille. On ne sait pas si une tâche prend 11 ou 12 jours, mais on sait si c'est "petit" (3) ou "gros" (13).

**Planning Poker :**
- Chaque membre estime secrètement
- Tout le monde révèle en même temps
- Si écart important → discussion → ré-estimation

**Lien avec la sécurité :** les stories de sécurité s'estiment comme les autres — elles ont une taille et une complexité.

---

# DoD, DoR : deux définitions clés ✅

**DoR = Definition of Ready**
> Une story est "prête" à entrer dans un sprint si...
- Elle est compréhensible par toute l'équipe
- Les critères d'acceptation sont définis
- Les Evil User Stories ont été écrites
- Elle est estimée

**DoD = Definition of Done**
> Une story est "terminée" si...
- Code reviewé + tests passent
- SAST sans vulnérabilité critique
- Pas de secret dans le code
- Déployée en staging et validée

---

# La dette technique et la dette de sécurité ⚠️

> **Analogie :** La dette technique, c'est comme emprunter de l'argent. Tu avances vite maintenant, mais tu paies des intérêts plus tard. La dette de sécurité, c'est la même chose — sauf que les "intérêts" peuvent être une fuite de données.

**Comment la dette s'accumule en Agile :**
- On rush une story pour finir le sprint
- On ne corrige pas une CVE "pas urgente"
- On reporte la mise à jour d'une dépendance

**Comment la limiter :**
- Inclure le remboursement de dette dans chaque sprint (10-20% de la vélocité)
- CVE dans le backlog avec priorité CVSS

---

# Agile et conformité réglementaire 📜

**Une idée reçue :** "L'Agile est incompatible avec les exigences réglementaires (RGPD, ISO 27001, PCI-DSS)."

**La réalité :**
- Ces normes définissent *quoi* faire, pas *comment*
- Agile est parfaitement compatible — il faut juste intégrer les exigences dans le backlog

**En pratique :**
| Exigence | Traduction Agile |
|----------|-----------------|
| Chiffrement des données (RGPD) | User Story + critère DoD |
| Audit trail (ISO 27001) | Story technique dans le backlog |
| Tests de pénétration (PCI-DSS) | Spike dans le backlog |

---

# Les outils de l'équipe Scrum agile 🛠️

**Pour gérer le backlog et les sprints :**
- **Jira** : le plus répandu en entreprise
- **GitLab Issues + Boards** : intégré au code (notre choix dans cette formation)
- **Trello / Linear** : plus légers, startups

**Pour la communication quotidienne :**
- Slack / Teams : canaux dédiés par projet et par alerte sécu
- Un canal `#security-alerts` pour les CVE détectées en CI

**Pour le tableau Kanban physique :**
- Post-its sur un tableau blanc reste efficace en présentiel

---

# En résumé : Module 1 📝

- **Waterfall** = tout livrer à la fin → sécurité trop tardive
- **Agile** = cycles courts → feedback rapide, corrections moins chères
- Le Manifeste Agile (2001) : 4 valeurs, 12 principes
- **Scrum** : sprints + 3 rôles + 4 cérémonies + 3 artefacts + vélocité
- **Kanban** : flux continu, WIP limité, idéal support/maintenance
- **DoR + DoD** : encadrent la qualité de chaque story
- **Dette de sécurité** : à rembourser activement à chaque sprint
- La sécurité doit être intégrée **dans** le processus agile, pas ajoutée après
