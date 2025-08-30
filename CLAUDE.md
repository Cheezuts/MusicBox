# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Le projet est une sorte de guitar pro pour batterie.
Le but premier étant de pouvoir créer des pattern de batterie simplement et efficacement afin de pouvoir les jouers ET les faires tourner en boucle, une sorte de batteur virtuel pour un groupe avec une interface rapide est facile à prendre en main.
l'utilisateur doit pouvoir créer un pattern ou plusieurs groupe de pattern afin de faire un morceau entier en utilisant des notes de batterie prise directement sur la batterie virtuelle et en les plaçant là ou il le veux à l'aide d'un drag'n'drop sur la grille qui sera découpé en fonction de ce que l'utilisateur aura décidé ( grille à la noir à la blance etc...) .
la grille sera donc découpé en 4 cases si l'utilisateur à choisi la noire, 2 cases pour la blanche, 8 cases à la croche etc...
ensuite l'utilisateur ajoute ou efface une "piste" du pattern, et il défini sur la piste la partie de batterie qu'il veux (ex: piste grosse caisse + piste charleston + caisse claire ) et viens placer les notes ou il veux sur la grille.
il peux éditer ou supprimer chaque note/piste/pattern.
le système entier sera un "bloc" qui contient un pattern un bloc peu contenir plusieurs pattern
le but étant de pouvoir créer des patterns les enregistrer et former des blocs que l'on peu placer les un à côté des autres pour créer des morceaux complet (ex: bloc 1 + bloc2 + bloc 3 puis re bloc 1 pour finir par bloc 4)
l'utilisateur peu enregistrer des blocs et directement les posers sur une grille prévu pour les blocs . il doit pouvoir drag'n'drop les blocs pour les organiser à sa convenance et former le morceau qu'il veux.

L'interface :
en haut de l'écran Nom du projet(éditable) bouton pause, bouton play, barre de temps( temps = unité choisi ) (ex:1/16 1er temp sur 16)avec flèche gauche et flèche droite autour pour passer d'un temps à l'autre.
bouton de sélection de l'unité choisi ( ronde/blanche/noire/croche/double-croche/triple-croche/quadruple-croche silence ( de chaque valeurs) note pointé/double-pointé , triolet, duolet et note lié )
réglage du tempo en BPM, Volume Master, Tutoriel,Nouveau Projet, Sauvergarder,Exporter,Paramètres(changer couleurs interfaces, importation de VST)
Ensuite l'interface "Musicale"
avec les pistes, la grille ( avec sélection de l'unité de mesure )
et la fenetre de la batterie virtuelle avec pouvoir changer le son de chacune des parties du "set" (caisse claire/ grosse caisse etc...) en utilisant des VST ( si possible )
si aucun son est configuré par l'utilisateur il faut en laisser par défaut.
pouvoir changer pour toutes les caisse claire/etc ... sur le total de la composition OU ponctuellement

je veux pouvoir cloner un bloc pour le coller, ou une partie d'un bloc
je veux pouvoir drag'n' drop les notes et les blocs
editer les bloc, supprimer bloc, cloner,déplacer avec drag'n'drop

## Development Setup

This project is in its initial state and does not yet have:

- Package management files (package.json, requirements.txt, etc.)
- Build system configuration
- Testing framework setup
- Source code structure

## Future Development Notes

When setting up this project, consider:

- Choosing a technology stack (web framework, mobile, desktop, etc.)
- Setting up appropriate package management and build tools
- Creating a clear directory structure for the music application
- Implementing proper testing and linting workflows

## Current State

The repository contains only:

- `.claude/settings.local.json` - Claude Code configuration with Bash directory permissions

Instruction du projet.

- Les commandes disponible
  - 'pnpm tsc' : lancer typescript
  - 'pnpm lint' : pour checker le linter
  ***
  description: Explore codebase, create implementation plan, code, and test following EPCT workflow

---

# Explore, Plan, Code, Test Workflow

At the end of this message, I will ask you to do something.
Please follow the "Explore, Plan, Code, Test" workflow when you start.

## Explore

First, use parallel subagents to find and read all files that may be useful for implementing the ticket, either as examples or as edit targets. The subagents should return relevant file paths, and any other info that may be useful.

## Plan

Next, think hard and write up a detailed implementation plan. Don't forget to include tests, lookbook components, and documentation. Use your judgement as to what is necessary, given the standards of this repo.

If there are things you are not sure about, use parallel subagents to do some web research. They should only return useful information, no noise.

If there are things you still do not understand or questions you have for the user, pause here to ask them before continuing.

## Code

When you have a thorough implementation plan, you are ready to start writing code. Follow the style of the existing codebase (e.g. we prefer clearly named variables and methods to extensive comments). Make sure to run our autoformatting script when you're done, and fix linter warnings that seem reasonable to you.

## Test

Use parallel subagents to run tests, and make sure they all pass.

If your changes touch the UX in a major way, use the browser to make sure that everything works correctly. Make a list of what to test for, and use a subagent for this step.

If your testing shows problems, go back to the planning stage and think ultrahard.

## Write up your work

When you are happy with your work, write up a short report that could be used as the PR description. Include what you set out to do, the choices you made with their brief justification, and any commands you ran in the process that may be useful for future developers to know about.

## Project Overview

● Résumé du Projet MusicBox - Séquenceur de Batterie Professionnel

🎯 Vision Générale

Créer un séquenceur de batterie numérique inspiré de Guitar Pro, conçu comme un batteur virtuel pour groupes avec une interface intuitive et efficace pour la création, l'édition et la lecture de patterns rythmiques complexes.

🏗️ Architecture Hiérarchique

1. Notes → Pistes → Patterns → Blocs → Compositions

- Note : Élément de batterie placé à un timing précis (kick, snare, hi-hat, etc.)
- Piste : Ligne dédiée à un élément de batterie spécifique avec ses propres réglages
- Pattern : Grille rythmique contenant plusieurs pistes synchronisées
- Bloc : Conteneur regroupant un ou plusieurs patterns avec répétitions
- Composition : Arrangement final de blocs organisés en timeline

2. Système de Grille Adaptative

- Subdivision automatique selon la valeur rythmique sélectionnée :
  - Noire = 4 cases par mesure (1 case = 1 temps)
  - Croche = 8 cases par mesure (2 cases = 1 temps)
  - Double-croche = 16 cases par mesure (4 cases = 1 temps)
  - Support des modifications : pointées, double-pointées, triolets, duolets, liaisons

🎛️ Interface Utilisateur Complète

Barre de Contrôle Principale

- Projet : Nom éditable, nouveau/sauvegarder/exporter
- Transport : Play/pause/stop avec navigation temporelle précise
- Timing : Indicateur de position (ex: "1/16" = 1er temps sur 16) avec navigation fléchée
- Subdivision : Sélecteur d'unité rythmique (ronde → quadruple-croche)
- Global : Tempo BPM, volume master, tutoriel, paramètres

Interface Musicale Centrale

- Zone Pistes : Liste des pistes avec contrôles individuels (volume, mute, solo, suppression)
- Grille Interactive : Placement précis des notes par drag & drop ou clic
- Batterie Virtuelle : Kit complet avec sons personnalisables (VST si possible)

Timeline de Composition

- Zone Blocs : Bibliothèque des blocs créés
- Arrangement : Timeline pour organiser les blocs par drag & drop
- Édition : Cloner, éditer, supprimer, déplacer les blocs

🔧 Fonctionnalités Techniques Clés

Édition Interactive

- Drag & Drop universel : Notes vers grille, blocs vers timeline
- Édition en temps réel : Modification sans interruption de lecture
- Gestion des pistes : Ajout/suppression/assignation d'éléments de batterie
- Clonage intelligent : Dupliquer patterns, blocs ou sections

Système Audio Avancé

- Personnalisation sonore : Remplacement des sons par défaut (VST recommandé)
- Application globale ou ponctuelle : Changer tous les kicks OU seulement celui d'un pattern
- Lecture en boucle : Mode loop pour patterns et compositions complètes
- Synchronisation précise : Timing professionnel pour usage en groupe

Workflow de Production

1. Création : Dessiner des patterns sur la grille adaptative
2. Organisation : Assembler patterns en blocs réutilisables
3. Arrangement : Composer morceaux complets via timeline de blocs
4. Personnalisation : Ajuster sons, tempo, volumes par section
5. Export : Sauvegarder/partager projets complets

🎵 Cas d'Usage Typique

1. Créer pattern de base (couplet) : kick + snare + hi-hat
2. Créer variation (refrain) : ajouter crash, modifier rythme
3. Assembler en blocs : Bloc A (couplet), Bloc B (refrain)
4. Composer morceau : A + A + B + A + B + B + A (structure classique)
5. Lecture en boucle pour répétition groupe

📋 Spécifications Techniques pour Développement

- Architecture modulaire : Services séparés pour audio, séquenceur, UI
- Types stricts : TypeScript pour robustesse et maintenabilité
- Performance : Gestion optimisée des gros projets avec nombreux patterns
- Extensibilité : Support VST et formats d'export standards
- Cross-platform : Fonctionnement web avec possibilité d'extension desktop

Cette spécification définit un outil professionnel de création rythmique alliant simplicité d'usage et puissance fonctionnelle, destiné aux musiciens souhaitant un batteur virtuel fiable et expressif.

Interface MusicBox - Séquenceur de Batterie Professionnel

Layout Principal : 3 Zones Verticales

🎛️ ZONE 1 : Barre de Contrôle Supérieure (Header fixe)

De gauche à droite :

- Projet : Champ texte éditable "Nom du Projet" + boutons [Nouveau] [Sauvegarder] [Exporter]
- Transport : Boutons circulaires [⏸️ Pause] [▶️ Play] [⏹️ Stop]
- Navigation Temporelle : [◀️] "1/16" [▶️] (position actuelle sur grille)
- Subdivision : Menu déroulant [Noire ▼] (ronde→quadruple-croche, pointées, triolets)
- Paramètres Globaux : [120 BPM] [Volume 🔊] [?Aide] [⚙️ Paramètres]

🎵 ZONE 2 : Interface Musicale Centrale (Corps principal)

Panneau Gauche - Pistes (200px largeur) :

- Liste verticale des pistes de batterie
- Chaque piste : [🥁 Kick] [🔇] [Solo] [Vol: |||] [❌]
- Bouton [+ Ajouter Piste] en bas

Panneau Central - Grille Rythmique (extensible) :

- Grille quadrillée adaptative selon subdivision choisie
- En-tête : mesures numérotées (1 | 2 | 3 | 4)
- Colonnes : temps subdivisés automatiquement
- Cellules : placement des notes par clic/drag&drop
- Curseur de lecture vertical rouge

Panneau Droit - Batterie Virtuelle (300px largeur) :

- Kit de batterie visuel interactif
- Éléments cliquables : Kick, Snare, Hi-hat, Toms, Cymbales
- Chaque élément = source sonore pour pistes

📊 ZONE 3 : Timeline de Composition (Bas, repliable)

Section Bibliothèque (gauche) :

- "Blocs Sauvegardés" : miniatures des blocs créés
- Chaque bloc : [🎼 Pattern A] [Clone] [Edit] [Delete]
- Scroll vertical si nombreux blocs

Section Arrangement (droite) :

- Timeline horizontale : axe temporel du morceau complet
- Pistes de blocs : drag&drop des blocs depuis bibliothèque
- Structure visuelle : [Bloc A][Bloc A][Bloc B][Bloc A][Bloc C]
- Contrôles : zoom timeline, lecture en boucle section

---

Interactions Clés :

- Drag & Drop : Notes vers grille, blocs vers timeline
- Clic droit : menus contextuels (édition, suppression, clone)
- Double-clic : édition rapide (nom projet, tempo, etc.)
- Raccourcis : Espace=Play/Pause, flèches=navigation

États Visuels :

- Mode Edition : grille active, curseur clignotant
- Mode Lecture : curseur rouge animé, boutons transport actifs
- Sélection Multiple : highlighting bleu pour opérations groupées

Cette interface combine l'efficacité de Guitar Pro avec l'intuitivité d'un DAW moderne, optimisée pour la création rythmique rapide et précise.

Bibliothèques libres : Freesound.org, Zapsplat

- Packs de samples : Splice, Loopmasters
- Enregistrements personnels : Votre propre batterie
- Conversion : Extraire d'autres fichiers audio
