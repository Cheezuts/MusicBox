# 🛠️ TODO - MusicBox Development

## 🚨 Problèmes Critiques à Résoudre

### 1. Boutons Non Fonctionnels (Priorité HAUTE)

#### Menu Principal - `index.html:12-18`
- [ ] **Nouveau Projet** (`#new-project`) - ⚠️ **NON IMPLÉMENTÉ**
  - Réinitialiser complètement l'interface
  - Vider tous les patterns et blocs
  - Remettre paramètres par défaut
  
- [ ] **Charger Projet** (`#load-project`) - ⚠️ **NON IMPLÉMENTÉ**
  - Interface de sélection de fichier
  - Parser JSON des projets exportés
  - Restaurer état complet (patterns + blocs + paramètres)
  
- [ ] **Sauvegarder Projet** (`#save-project`) - ⚠️ **NON IMPLÉMENTÉ**
  - Sérialiser état complet du projet
  - Sauvegarder dans localStorage
  - Option export vers fichier JSON
  
- [ ] **Exporter Projet** (`#export-project`) - ⚠️ **NON IMPLÉMENTÉ**
  - Export JSON complet du projet
  - Métadonnées (nom, date, version)
  - Téléchargement automatique du fichier

- [ ] **Paramètres** (`#settings`) - ⚠️ **PARTIELLEMENT IMPLÉMENTÉ**
  - Modal s'ouvre mais contenu vide
  - Paramètres de couleurs d'interface
  - Configuration audio (gain, VST)
  - Préférences utilisateur

- [ ] **Tutoriel** (`#tutorial`) - ⚠️ **NON IMPLÉMENTÉ**
  - Guide interactif étape par étape
  - Tooltips contextuels
  - Documentation in-app

## 🔧 Fonctionnalités Audio à Finaliser

### 2. Système Audio (Priorité HAUTE)
- [ ] **Chargement des Sons** - script.js:4600+
  - Actuellement commenté "Interface seulement"
  - Implémenter chargement échantillons depuis `/sounds`
  - Gestion erreurs audio (permissions, formats)

- [ ] **Web Audio Context** - script.js:54-65
  - Initialisation robuste du contexte audio
  - Gestion de la suspension/reprise
  - Compatibilité navigateurs

- [ ] **Lecture Synchrone** 
  - Timing précis des échantillons
  - Compensation latence
  - Quantification des notes

### 3. Sons par Défaut Manquants
- [ ] **Dossier `/sounds` vide**
  - Kick, Snare, Hi-hat, Crash, Ride, Toms
  - Format WAV ou MP3 optimisé
  - Licences libres de droits

## 🎵 Améliorations Interface

### 4. Grille et Navigation (Priorité MOYENNE)
- [ ] **Subdivision Avancée**
  - Support triolets complet
  - Notes pointées/double-pointées  
  - Liaisons entre notes

- [ ] **Curseur de Lecture**
  - Position visuelle pendant playback
  - Suivi automatique (auto-scroll)
  - Click-to-position

- [ ] **Sélection Multiple**
  - Sélection rectangulaire (Shift+drag)
  - Operations groupées (copy/paste/delete)
  - Feedback visuel amélioré

### 5. Timeline de Composition (Priorité MOYENNE)
- [ ] **Arrangement de Blocs**
  - Drag & drop des blocs sur timeline
  - Répétition automatique de blocs
  - Visualisation structure du morceau

- [ ] **Lecture Continue** 
  - Enchaînement automatique des blocs
  - Boucles et répétitions
  - Navigation dans la timeline

## 🚀 Fonctionnalités Avancées

### 6. Export/Import (Priorité MOYENNE)
- [ ] **Export MIDI Complet** - `exportToMIDI()` partiellement implémenté
  - Mapping correct drum → MIDI notes
  - Vélocités variables selon modificateurs
  - Pistes séparées par élément

- [ ] **Export Audio**
  - Rendu WAV/MP3 du pattern
  - Utilisation Web Audio API
  - Qualité configurable

- [ ] **Import Audio**
  - Drag & drop fichiers audio
  - Remplacement sons par défaut
  - Preview avant import

### 7. Personnalisation (Priorité BASSE)
- [ ] **Thèmes Visuels**
  - Mode sombre/clair
  - Couleurs personnalisables
  - Taille interface adaptable

- [ ] **Configuration VST**
  - Support plugins externes (si possible)
  - Routage audio avancé
  - Effets par piste

## 🐛 Bugs Identifiés

### 8. Corrections Techniques
- [ ] **Drag & Drop Mobile**
  - Events touch non optimaux
  - Interface mobile à améliorer
  - Feedback tactile manquant

- [ ] **Performance** 
  - Optimiser régénération grille
  - Mémoire audio (garbage collection)
  - Rendering grandes grilles

- [ ] **Sauvegarde État**
  - Perte données au refresh
  - localStorage limité
  - Gestion erreurs sauvegarde

## 📱 Adaptations Futures

### 9. PWA et Mobile (Priorité BASSE)
- [ ] **Progressive Web App**
  - Service Worker pour offline
  - Manifest pour installation
  - Optimisations mobile

- [ ] **Interface Tactile**
  - Boutons plus grands
  - Gestures spécialisés
  - Mode portrait optimisé

### 10. Collaboration (Priorité FUTURE)
- [ ] **Partage en Ligne**
  - Upload/download projets
  - URLs partagées
  - Versioning simple

---

## 🎯 Plan d'Action Recommandé

### Phase 1 - Fonctionnalités Core (2-3 semaines)
1. **Implémenter boutons menu** (Nouveau/Charger/Sauvegarder/Exporter)
2. **Finaliser système audio** (chargement sons + lecture)
3. **Ajouter sons par défaut** dans `/sounds/`
4. **Compléter modal Paramètres**

### Phase 2 - Audio et Export (1-2 semaines)  
1. **Perfectionner lecture synchrone**
2. **Finaliser export MIDI**
3. **Ajouter export audio** 
4. **Tutoriel interactif**

### Phase 3 - UX et Polish (1-2 semaines)
1. **Améliorer interface mobile**
2. **Optimisations performance**
3. **Thèmes et personnalisation**
4. **Tests cross-browser**

### Phase 4 - Fonctionnalités Avancées (temps libre)
1. **Timeline composition avancée**
2. **Collaboration en ligne**
3. **Support VST/plugins**
4. **PWA et installation**

---

## 💡 Notes Techniques

### Fichiers Principaux à Modifier
- `index.html` - Boutons non connectés lignes 12-18
- `script.js` - Fonctions manquantes pour menu principal
- `styles.css` - Modal paramètres incomplet
- `/sounds/` - Dossier vide à remplir

### APIs et Bibliothèques Nécessaires
- **Web Audio API** - Lecture et effets audio
- **File API** - Import/export fichiers
- **MIDI.js** - Export MIDI robuste (optionnel)
- **Tone.js** - Alternative pour audio (optionnel)

### Structure Recommandée
```javascript
// script.js - Nouvelles fonctions à créer
function newProject() { /* Réinitialiser état */ }
function loadProject() { /* Interface chargement */ }  
function saveProject() { /* Sérialiser état */ }
function exportProject() { /* Export JSON */ }
function openSettings() { /* Modal paramètres */ }
function openTutorial() { /* Guide interactif */ }
```

### Priorités pour Reprise de Projet
1. ⭐ **Commencer par les boutons menu** (impact utilisateur immédiat)
2. ⭐ **Ajouter sons par défaut** (fonctionnalité audio de base)  
3. ⭐ **Implémenter sauvegarde/chargement** (éviter perte de travail)
4. ⭐ **Finaliser modal paramètres** (configuration utilisateur)

---

*Dernière mise à jour: 30 août 2024*  
*Ce fichier sert de roadmap pour reprendre le développement après une pause.*