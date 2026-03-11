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

# En résumé : Module 1 📝

- **Waterfall** = tout livrer à la fin → sécurité trop tardive
- **Agile** = cycles courts → feedback rapide, corrections moins chères
- **Scrum** : sprints + 3 rôles + 4 cérémonies + 3 artefacts
- **Kanban** : flux continu, limiter le WIP, visualiser
- Les **12 principes agiles** soutiennent l'excellence technique = sécurité
- La sécurité doit être intégrée **dans** le processus agile, pas ajoutée après
