---
theme: ./
colorSchema: "auto"
layout: intro
highlighter: shiki
title: Formation Développer de manière sécurisée et agile 2026
#transition: slide-left
download: "https://dev-securise-agile.andromed.fr/slides.pdf"
themeConfig:
  logoHeader: "/avatar.png"
  eventLogo: "https://img2.storyblok.com/352x414/f/84560/2388x414/23d8eb4b8d/vue-amsterdam-with-name.png"
  eventUrl: "https://vuejs.amsterdam/"
---

# Développer de manière sécurisée et agile

🔐 Une formation présentée par Ascent et Andromed.

💚 12 - 13 Mars 2026

<div class="pt-12">
  <span @click="next" class="px-2 p-3 rounded cursor-pointer hover:bg-white hover:bg-opacity-10 neon-border">
    Appuyez sur espace pour la page suivante <carbon:arrow-right class="inline"/>
  </span>
</div>


<div class="absolute flex gap-x-2 bottom-0 left-0 p-4 z-50">
      <SlideCurrentNo
        class="dark:!text-white !text-[8px] p-1 w-5 h-5 items-center justify-center flex rounded-full bg-white/10 backdrop-blur-sm border border-gray-600 opacity-80"
      />
      <span class="text-gray-400">/</span>
  <SlideTotal
        class="dark:!text-white !text-[8px] p-1 w-5 h-5 items-center justify-center flex rounded-full bg-white/10 backdrop-blur-sm border border-gray-600 opacity-80"
      />
</div>


<div class="absolute bottom-0 right-0 z-50 flex flex-col gap-y-2 p-2">
<div class="hover:bg-white hover:bg-opacity-10 neon-border border-2 rounded-xl w-[200px] p-2 flex flex-col gap-y-2">
  <img src="/ascent.png" alt="Ascent" class="w-6 h-6 mx-auto rounded-full"></img>
  <span class="text-gray-400 text-xs">Programme : <b>2-024</b></span>
  <span class="text-gray-400 text-xs">Lot: <b>2</b></span>
</div>
</div>


---
layout: presenter
eventLogo: 'https://img2.storyblok.com/352x0/f/84560/2388x414/23d8eb4b8d/vue-amsterdam-with-name.png'
eventUrl: 'https://vuejs.amsterdam/'
twitter: '@jimmylansrq'

twitterUrl: 'https://twitter.com/jimmylansrq'
presenterImage: 'https://legacy.andromed.fr/images/fondator.jpg'
---

# Jimmylan Surquin

Fondateur <a  href="https://www.andromed.fr/"><logos-storyblok-icon  mr-1/>Andromed</a>

- Lille, France 🇫🇷
- Création de contenu sur <a href="https://www.youtube.com/channel/jimmylansrq"> <logos-youtube-icon mr-1 /> jimmylansrq </a>
- Blog & Portfolio <a href="https://jimmylan.fr"> jimmylan.fr </a>

---
layout: text-image
media: 'https://i.pinimg.com/originals/f5/5e/80/f55e8059ea945abfd6804b887dd4a0af.gif'
caption: 'DEV SÉCURISÉ & AGILE 2026'
---

# DISCLAIMER 🔐

### Dans cette formation nous allons voir comment développer de manière sécurisée dans un contexte agile.

---
layout: two-cols
routeAlias: 'sommaire'
---

<a name="sommaire" id="sommaire"></a>

# SOMMAIRE 📜

### Jour 1 : Fondamentaux

<div class="flex flex-col gap-2">
<Link to="introduction-devsecops">🔐 1. Introduction au DevSecOps</Link>
<Link to="methodologies-agiles">🔄 2. Méthodologies Agiles & Sécurité</Link>
<Link to="owasp-top10">🛡️ 3. OWASP Top 10 (2025)</Link>
<Link to="secure-coding">💻 4. Secure Coding Practices</Link>
</div>

::right::

### Jour 2 : Pratique avancée

<div class="flex flex-col gap-2">
<Link to="tests-securite">🧪 5. Tests de sécurité automatisés</Link>
<Link to="cicd-securise">🚀 6. CI/CD sécurisé</Link>
<Link to="gestion-vulnerabilites">🔍 7. Gestion des vulnérabilités</Link>
<Link to="exercice-final">🎯 8. Exercice final : Audit & Remédiation</Link>
<Link to="qcm-final">✅ QCM de validation finale</Link>
</div>

<br>

**Note :** Chaque module contient :
- 📖 Cours théorique
- ✅ QCM de validation
- 🎯 Exercices pratiques

---
layout: two-cols
---

### PROGRAMME JOUR 1 📅

<small>

**Module 1 - Introduction DevSecOps**
- Qu'est-ce que le DevSecOps ?
- Shift-Left Security
- Culture de la sécurité
- Threat Modeling

**Module 2 - Agile & Sécurité**
- Scrum et sécurité
- User Stories de sécurité (Evil User Stories)
- Definition of Done sécurisée
- Sprint Security Review

</small>

::right::

<small>

**Module 3 - OWASP Top 10**
- Injection (SQL, NoSQL, LDAP)
- Broken Authentication
- XSS, CSRF, SSRF
- Security Misconfiguration
- Exemples concrets et remédiation

**Module 4 - Secure Coding**
- Validation des entrées
- Encodage des sorties
- Gestion des secrets
- Principes SOLID appliqués à la sécurité

</small>

---
layout: two-cols
---

### PROGRAMME JOUR 2 📅

<small>

**Module 5 - Tests de sécurité**
- SAST (Static Application Security Testing)
- DAST (Dynamic Application Security Testing)
- SCA (Software Composition Analysis)
- Pentesting automatisé

**Module 6 - CI/CD sécurisé**
- Pipeline DevSecOps
- GitHub Actions & sécurité
- Scanning automatique
- Gestion des secrets en CI/CD

</small>

::right::

<small>

**Module 7 - Gestion des vulnérabilités**
- CVE, CWE, CVSS
- Triaging et priorisation
- Patch management
- Incident Response

**Module 8 - Exercice final**
- Audit d'une application vulnérable
- Identification des failles
- Plan de remédiation
- Mise en place d'un pipeline sécurisé

**QCM Final** ✅
- Validation des acquis
- Tous les modules

</small>

---
src: './pages/01-introduction-devsecops.md'
---

---
src: './pages/01-qcm-devsecops.md'
---

---
src: './pages/01-exercices-devsecops.md'
---

---
src: './pages/02-methodologies-agiles.md'
---

---
src: './pages/02-qcm-agile.md'
---

---
src: './pages/02-exercices-agile.md'
---

---
src: './pages/03-owasp-top10.md'
---

---
src: './pages/03-qcm-owasp.md'
---

---
src: './pages/03-exercices-owasp.md'
---

---
src: './pages/04-secure-coding.md'
---

---
src: './pages/04-qcm-secure-coding.md'
---

---
src: './pages/04-exercices-secure-coding.md'
---

---
src: './pages/05-tests-securite.md'
---

---
src: './pages/05-qcm-tests-securite.md'
---

---
src: './pages/05-exercices-tests-securite.md'
---

---
src: './pages/06-cicd-securise.md'
---

---
src: './pages/06-qcm-cicd.md'
---

---
src: './pages/06-exercices-cicd.md'
---

---
src: './pages/07-gestion-vulnerabilites.md'
---

---
src: './pages/07-qcm-vulnerabilites.md'
---

---
src: './pages/07-exercices-vulnerabilites.md'
---

---
src: './pages/08-exercice-final.md'
---

---
src: './pages/09-qcm-final.md'
---
