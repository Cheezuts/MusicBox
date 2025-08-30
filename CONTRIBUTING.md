# 🤝 Guide de Contribution - MusicBox

Merci de votre intérêt pour contribuer à MusicBox ! Ce guide vous aidera à participer efficacement au développement du projet.

## 🎯 Types de Contributions

### 🐛 Signalement de Bugs
- Vérifiez d'abord les [issues existantes](https://github.com/Cheezuts/MusicBox/issues)
- Utilisez le template d'issue pour les bugs
- Incluez les détails de reproduction

### ✨ Nouvelles Fonctionnalités  
- Proposez vos idées via les issues
- Discutez de l'implémentation avant de coder
- Respectez l'architecture existante

### 📚 Documentation
- Améliorations du README
- Commentaires de code
- Guides d'utilisation

### 🎨 Interface Utilisateur
- Améliorations visuelles
- Accessibilité
- Responsive design

## 🛠️ Configuration de Développement

### Prérequis
```bash
# Node.js et pnpm pour les outils de développement (optionnel)
node --version  # v16+
pnpm --version  # 8+
```

### Installation
```bash
# Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/MusicBox.git
cd MusicBox

# Installation des dépendances de développement (si disponibles)
pnpm install

# Lancer les outils de développement
pnpm tsc     # TypeScript
pnpm lint    # ESLint
```

## 📝 Standards de Code

### JavaScript/TypeScript
- **ES6+** : Utilisez les fonctionnalités modernes
- **Nommage** : Variables et fonctions en camelCase
- **Fonctions** : Préférez les arrow functions pour les callbacks
- **Commentaires** : JSDoc pour les fonctions publiques

```javascript
/**
 * Crée un nouveau pattern de batterie
 * @param {string} name - Nom du pattern
 * @param {number} subdivision - Division rythmique (4, 8, 16...)
 * @returns {DrumPattern} Le pattern créé
 */
const createDrumPattern = (name, subdivision) => {
    // Implémentation...
};
```

### CSS
- **BEM** : Méthodologie pour les noms de classes
- **Variables CSS** : Pour les couleurs et espacements
- **Mobile-first** : Design responsive

```css
/* BEM naming */
.drum-grid {}
.drum-grid__cell {}
.drum-grid__cell--active {}

/* Variables CSS */
:root {
    --primary-color: #2563eb;
    --grid-cell-size: 40px;
}
```

### HTML
- **Sémantique** : Balises appropriées (section, article, nav...)
- **Accessibilité** : Attributs ARIA et labels
- **Performance** : Optimisation des ressources

## 🔄 Workflow de Développement

### 1. Préparation
```bash
# Créer une branche de fonctionnalité
git checkout -b feature/nom-fonctionnalite

# Ou pour un bug
git checkout -b fix/nom-du-bug
```

### 2. Développement
- **Commits fréquents** avec messages descriptifs
- **Tests** : Vérifiez que tout fonctionne
- **Lint** : Corrigez les erreurs de style

```bash
# Messages de commit conventionnels
git commit -m "feat: add drag and drop for patterns"
git commit -m "fix: resolve timing sync issues"
git commit -m "docs: update API documentation"
```

### 3. Tests
```bash
# Ouvrir index.html dans plusieurs navigateurs
# Tester les fonctionnalités nouvelles/modifiées
# Vérifier la compatibilité mobile

# Si outils disponibles
pnpm test    # Tests automatisés
pnpm lint    # Vérification du code
```

### 4. Pull Request
- **Description claire** de ce qui a été fait
- **Screenshots** pour les changements UI
- **Tests** : Comment vérifier que ça marche
- **Breaking changes** : Documenter si applicable

## 🎵 Architecture du Projet

### Structure des Fichiers
```
MusicBox/
├── index.html              # Interface principale
├── script.js               # Logique métier
│   ├── // Audio Engine     # Gestion audio
│   ├── // Pattern Manager  # Patterns de batterie  
│   ├── // UI Controller    # Interface utilisateur
│   └── // Export System    # Sauvegarde/export
├── styles.css              # Styles globaux
│   ├── // Layout           # Mise en page
│   ├── // Components       # Composants UI
│   └── // Responsive       # Adaptations mobiles
├── sounds/                 # Échantillons audio
├── docs/                   # Documentation
└── tests/                  # Tests (futur)
```

### Modules Principaux

#### 1. Audio Engine (`AudioEngine` class)
- Gestion Web Audio API
- Lecture des échantillons  
- Synchronisation temporelle
- Effets audio

#### 2. Pattern Manager (`PatternManager` class)
- Création/édition de patterns
- Système de grille
- Gestion des pistes
- Sérialisation

#### 3. UI Controller (`UIController` class)
- Interactions utilisateur
- Drag & drop
- Mise à jour de l'affichage
- Événements

#### 4. Export System (`ExportSystem` class)  
- Sauvegarde locale
- Export JSON/MIDI
- Import de projets
- Gestion de fichiers

## 🚀 Fonctionnalités Prioritaires

### À Court Terme
1. **Amélioration de l'interface**
   - Meilleur feedback visuel
   - Raccourcis clavier
   - Mode sombre

2. **Stabilité audio**
   - Gestion des erreurs
   - Performance optimisée
   - Compatibilité navigateurs

### À Moyen Terme
1. **Export avancé**
   - Format MIDI
   - Export audio WAV/MP3
   - Métadonnées

2. **Personnalisation**
   - Thèmes visuels
   - Configuration avancée
   - Préférences utilisateur

### À Long Terme
1. **Collaboration**
   - Partage de projets
   - Mode multi-utilisateur
   - Cloud storage

2. **Extensions**
   - Support VST/plugins
   - API pour développeurs
   - Marketplace de sons

## 📋 Checklist Pre-Commit

- [ ] **Code testé** : Fonctionne dans Chrome, Firefox, Safari
- [ ] **Pas d'erreurs console** : Console propre sans warnings
- [ ] **Mobile friendly** : Interface adaptée aux petits écrans
- [ ] **Performance** : Pas de ralentissements notables
- [ ] **Accessibilité** : Navigation clavier, contrastes OK
- [ ] **Documentation** : Commentaires et README mis à jour

## 🐛 Debugging et Tests

### Outils de Debug
```javascript
// Dans la console du navigateur
window.MusicBox.debug = true;  // Active les logs détaillés
window.MusicBox.getState();    // État actuel de l'application
window.MusicBox.resetState();  // Reset pour tests
```

### Tests Manuels Courants
1. **Création de patterns** : Placer notes, jouer, modifier
2. **Drag & Drop** : Notes et blocs, toutes interactions
3. **Navigation temporelle** : Play/pause, curseur, timing
4. **Sauvegarde** : LocalStorage, export, import
5. **Responsive** : Mobile, tablet, desktop

### Scenarios de Test
```javascript
// Test automatique simple
const testBasicPattern = () => {
    const pattern = new DrumPattern('test', 16);
    pattern.addNote(0, 'kick');
    pattern.addNote(8, 'snare');
    console.assert(pattern.notes.length === 2);
};
```

## 💡 Conventions Git

### Branches
- `main` : Branche principale stable
- `develop` : Développement en cours
- `feature/nom-fonctionnalite` : Nouvelles fonctionnalités
- `fix/nom-du-bug` : Corrections de bugs
- `docs/nom-doc` : Documentation

### Messages de Commit
```bash
# Format : type(scope): description

feat(audio): add reverb effect to drum samples
fix(ui): resolve drag drop on mobile devices  
docs(readme): update installation instructions
style(css): improve button hover animations
refactor(patterns): simplify pattern creation logic
test(audio): add unit tests for timing sync
```

## ❓ Besoin d'Aide ?

### Resources
- **Issues** : [GitHub Issues](https://github.com/Cheezuts/MusicBox/issues)
- **Discussions** : [GitHub Discussions](https://github.com/Cheezuts/MusicBox/discussions)
- **Documentation** : [CLAUDE.md](./CLAUDE.md)

### Contact
- Créez une issue pour les questions techniques
- Utilisez les discussions pour les idées générales
- Mentionnez @Cheezuts pour les questions urgentes

## 🏆 Reconnaissance

Les contributeurs seront ajoutés à la section remerciements du README !

Merci pour votre contribution à MusicBox ! 🥁