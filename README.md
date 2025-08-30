# 🥁 MusicBox - Séquenceur de Batterie Professionnel

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-web-orange.svg)

**MusicBox** est un séquenceur de batterie numérique inspiré de Guitar Pro, conçu comme un batteur virtuel professionnel avec une interface intuitive pour la création, l'édition et la lecture de patterns rythmiques complexes.

## ✨ Caractéristiques Principales

### 🎯 Interface Professionnelle
- **Grille adaptative** : Subdivision automatique selon la valeur rythmique (noire, croche, double-croche...)
- **Drag & Drop intuitif** : Placement précis des notes par glisser-déposer
- **Timeline de composition** : Organisation des blocs pour créer des morceaux complets
- **Contrôles de transport** : Play, pause, navigation temporelle précise

### 🔧 Fonctionnalités Avancées
- **Système de blocs** : Patterns réutilisables et organisables
- **Pistes multiples** : Gestion séparée de chaque élément de batterie
- **Personnalisation sonore** : Support prévu pour VST et échantillons personnalisés
- **Export flexible** : Sauvegarde et partage de projets

### 🎵 Architecture Musicale
```
Notes → Pistes → Patterns → Blocs → Compositions
```

## 🚀 Démo en Ligne

Ouvrez simplement le fichier `index.html` dans votre navigateur pour commencer !

## 📋 Installation

### Installation Simple
```bash
# Cloner le repository
git clone https://github.com/Cheezuts/MusicBox.git

# Accéder au dossier
cd MusicBox

# Ouvrir dans le navigateur
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Pour le Développement
```bash
# Si vous voulez contribuer au projet
git clone https://github.com/Cheezuts/MusicBox.git
cd MusicBox

# Configuration TypeScript (optionnelle)
pnpm install    # ou npm install
pnpm tsc        # Compilation TypeScript
pnpm lint       # Vérification du code
```

## 🎮 Guide d'Utilisation

### 1. Interface Principale

#### Barre de Contrôle Supérieure
- **Projet** : Nom éditable + boutons Nouveau/Sauvegarder/Exporter
- **Transport** : Play/Pause/Stop avec navigation temporelle
- **Subdivision** : Sélection d'unité rythmique (ronde → quadruple-croche)
- **Paramètres Globaux** : Tempo BPM, Volume Master, Aide

#### Zone Musicale Centrale
- **Panneau Pistes** (gauche) : Liste des éléments de batterie
- **Grille Rythmique** (centre) : Zone de placement des notes
- **Batterie Virtuelle** (droite) : Kit interactif pour sélectionner les sons

#### Timeline de Composition (bas)
- **Bibliothèque de Blocs** : Patterns sauvegardés réutilisables
- **Arrangement** : Timeline pour organiser les blocs en morceaux complets

### 2. Workflow Typique

#### Création d'un Pattern
1. **Choisir la subdivision** (ex: croche = 8 cases par mesure)
2. **Ajouter des pistes** (kick, snare, hi-hat...)
3. **Placer les notes** par clic ou drag & drop sur la grille
4. **Sauvegarder en bloc** pour réutilisation

#### Composition d'un Morceau
1. **Créer plusieurs patterns** (couplet, refrain, pont...)
2. **Les organiser en blocs** dans la bibliothèque
3. **Arranger sur la timeline** (ex: A-A-B-A-B-B-A)
4. **Ajuster tempo et volumes** par section

### 3. Fonctionnalités Détaillées

#### Système de Grille Adaptative
- **Noire** : 4 cases par mesure (1 case = 1 temps)
- **Croche** : 8 cases par mesure (2 cases = 1 temps)  
- **Double-croche** : 16 cases par mesure (4 cases = 1 temps)
- **Support des modifications** : notes pointées, triolets, liaisons

#### Gestion des Pistes
- **Volume individuel** par piste
- **Mute/Solo** pour isolation
- **Assignation d'éléments** de batterie
- **Personnalisation sonore** (sons par défaut inclus)

#### Système de Blocs
- **Création** : Sauvegarder un pattern en bloc réutilisable
- **Édition** : Modifier, dupliquer, supprimer des blocs
- **Organisation** : Drag & drop sur la timeline de composition

## 🛠️ Architecture Technique

### Structure des Fichiers
```
MusicBox/
├── index.html          # Interface principale
├── script.js           # Logique du séquenceur
├── styles.css          # Styles et mise en page
├── sounds/             # Échantillons audio par défaut
├── CLAUDE.md          # Spécifications détaillées
└── README.md          # Cette documentation
```

### Technologies Utilisées
- **HTML5** : Structure et interface
- **JavaScript ES6+** : Logique métier et interactions
- **CSS3** : Styles et animations
- **Web Audio API** : Lecture et traitement audio
- **Drag & Drop API** : Interactions intuitives

### Fonctionnalités Techniques
- **Timing précis** : Synchronisation professionnelle pour usage en groupe
- **Lecture en boucle** : Mode loop pour patterns et compositions
- **Sauvegarde locale** : LocalStorage pour persistance des projets
- **Export flexible** : Format JSON pour partage et backup

## 🎯 Cas d'Usage

### Pour Musiciens
- **Création de patterns** pour répétitions de groupe
- **Batteur virtuel** fiable pour compositions
- **Pré-production** de morceaux avec structure rythmique

### Pour Compositeurs
- **Prototypage rapide** de sections rythmiques
- **Organisation de morceaux** avec structure claire
- **Export pour intégration** dans DAW professionnels

### Pour Pédagogie
- **Apprentissage du rythme** avec visualisation claire
- **Analyse de patterns** complexes décomposés
- **Exercices progressifs** avec tempo ajustable

## 🚧 Développement Futur

### Fonctionnalités Prévues
- [ ] **Support VST** : Intégration de plugins audio
- [ ] **Export MIDI** : Compatibilité avec DAW professionnels
- [ ] **Collaboration temps réel** : Édition partagée en ligne
- [ ] **Bibliothèque de sons** : Packs d'échantillons étendus
- [ ] **Mode performance** : Interface simplifiée pour live
- [ ] **Synchronisation externe** : MIDI Clock, Ableton Link

### Améliorations Techniques
- [ ] **PWA** : Application web progressive installable
- [ ] **Mode hors-ligne** : Fonctionnement sans connexion
- [ ] **Optimisation mobile** : Interface tactile adaptée
- [ ] **Plugin système** : Architecture modulaire extensible

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### Pour Signaler un Bug
1. Vérifiez les [issues existantes](https://github.com/Cheezuts/MusicBox/issues)
2. Créez une nouvelle issue avec :
   - Description claire du problème
   - Étapes pour reproduire
   - Navigateur et version utilisés

### Pour Proposer une Fonctionnalité
1. Ouvrez une [nouvelle issue](https://github.com/Cheezuts/MusicBox/issues/new)
2. Décrivez la fonctionnalité souhaitée
3. Expliquez le cas d'usage et les bénéfices

### Pour Contribuer au Code
1. **Fork** le projet
2. Créez une **branche de fonctionnalité** (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

## 📄 License

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 👨‍💻 Auteur

**Cheezuts** - [@Cheezuts](https://github.com/Cheezuts)

## 🙏 Remerciements

- Inspiration tirée de **Guitar Pro** pour l'interface musicale
- **Web Audio API** pour les capacités audio avancées
- Communauté open source pour les bonnes pratiques

## 🔗 Liens Utiles

- [Démo en ligne](https://cheezuts.github.io/MusicBox)
- [Documentation technique](./CLAUDE.md)
- [Signaler un bug](https://github.com/Cheezuts/MusicBox/issues)
- [Demander une fonctionnalité](https://github.com/Cheezuts/MusicBox/issues/new)

---

⭐ **Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**