# Formation Unix

![Unix Logo](https://venam.net/blog/assets/tux.png)

## À propos de cette formation

Cette formation complète sur Unix utilise [Slidev](https://github.com/slidevjs/slidev) pour offrir une expérience d'apprentissage interactive et moderne.

Formation UNIX/Linux - Initiation 2025 🐧

Une formation pratique, complète et progressive pour découvrir et maîtriser les bases d’Unix/Linux.

## 📚 Table des matières

1.  🧱 Introduction et rappels Unix/Linux
2.  ⚙️ Gestion du système et des utilisateurs
3.  💾 Gestion des processus et des services
4.  🧮 Gestion du stockage et du système de fichiers
5.  📡 Réseau
6.  🧰 Gestion des paquets et maintenance
7.  📅 Automatisation, scripts et tâches planifiées
8.  🔐 Sécurité système
9.  ☁️ Services serveurs
10. ✅ QCM de validation finale
11. 🎯 Exercices pratiques

---

### Module 1 - Introduction et rappels
-   Historique Unix, GNU/Linux, distributions
-   Philosophie Unix (“tout est fichier”, etc.)
-   Architecture d’un système Linux
-   Noyau, shell, système de fichiers
-   Commandes essentielles de base

### Module 2 - Gestion système et utilisateurs
-   Comptes utilisateurs et groupes
-   Permissions, droits, umask, sudoers
-   Gestion des quotas
-   Structure du système de fichiers

### Module 3 - Processus et services
-   PID, états des processus
-   Démarrage et arrêt du système
-   systemd et gestion des services

### Module 4 - Stockage et système de fichiers
-   Disques, partitions, montage
-   Systèmes de fichiers (ext4, xfs, NFS)
-   Permissions étendues (ACL)
-   Gestion de l’espace disque

### Module 5 - Réseau
-   Configuration réseau
-   Diagnostic réseau
-   Gestion du pare-feu
-   SSH et transfert de fichiers

### Module 6 - Paquets et maintenance
-   Systèmes de paquets (apt, dnf)
-   Installation, mise à jour
-   Gestion des dépendances

### Module 7 - Automatisation et scripts
-   Scripts Bash de base
-   Tâches planifiées (cron, at)
-   Supervision et logs

### Module 8 - Sécurité système
-   Sécurité des comptes
-   SELinux/AppArmor
-   Durcissement système
-   Audit et logs de sécurité

### Module 9 - Services serveurs
-   Services de base (Nginx, Apache)
-   Configuration réseau avancée
-   Monitoring basique

## Projet pratique 💻

Un mini-projet sera développé étape par étape tout au long de la formation, permettant de mettre en pratique chaque concept appris.

## Prérequis techniques

- Unix ou Linux
- Un éditeur de code (VS Code recommandé)
- Connaissances de base en terminal

## Installation

1. Clonez ce dépôt

```bash
git clone [url-du-repo]
```

2. Installez les dépendances (avec frozen lockfile recommandé car Slidev évolue rapidement)

```bash
# Avec npm
npm ci  # Équivalent à npm install avec frozen lockfile

# Avec yarn
yarn install --frozen-lockfile

# Avec pnpm
pnpm install --frozen-lockfile
```

3. Lancez les slides

```bash
npm run dev
```

ou pnpm :

```bash
pnpm run dev
```

ou yarn :

```bash
yarn run dev
```
## Caractéristiques des slides

- 🎨 Design moderne et responsive
- 🌙 Mode sombre/clair automatique
- 📝 Support du Markdown
- 🎨 Mise en évidence de la syntaxe
- 📊 Diagrammes et schémas
- 🖼️ Support des images et GIFs
- 🎥 Enregistrement en PDF disponible

## Ressources supplémentaires

- [Documentation officielle de Unix](https://www.gnu.org/software/libc/manual/)
- [Documentation Slidev](https://sli.dev/)
- [Guide TypeScript](https://www.typescriptlang.org/docs/)

## Licence

MIT
