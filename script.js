// MusicBox - Interface seulement (pas de fonctionnalités audio)
// Ce fichier contient uniquement l'interface utilisateur

document.addEventListener('DOMContentLoaded', function() {
    console.log('MusicBox Interface chargée - Version Interface uniquement');
    
    // Éléments de l'interface
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const loopBtn = document.getElementById('loop-btn');
    const projectNameInput = document.getElementById('project-name');
    const tempoInput = document.getElementById('tempo');
    const volumeSlider = document.getElementById('volume');
    const volumeDisplay = document.getElementById('volume-display');
    const progressSlider = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    
    // Batterie virtuelle
    const drumKitWindow = document.getElementById('drum-kit-window');
    const drumKitToggle = document.getElementById('drum-kit-toggle');
    const drumKitContent = document.getElementById('drum-kit-content');
    
    // Grille de pattern
    const patternGrid = document.getElementById('pattern-grid');
    
    // Variables d'état
    let isPlaying = false;
    let isDrumKitOpen = false;
    let currentNoteValue = 'quarter'; // Valeur rythmique actuelle
    
    // Variables pour le drag-to-fill
    let isDragging = false;
    let dragAction = null; // 'add' ou 'remove'
    let dragTrackIndex = null;
    let dragStarted = false; // Pour différencier clic simple du drag
    let dragStartCell = null;
    
    // Variables pour la sélection et copier-coller
    let selectedCells = new Set(); // Cellules sélectionnées
    let isSelectionMode = false; // Mode sélection activé avec Ctrl
    let clipboard = []; // Presse-papiers pour les notes copiées
    let isMultiSelecting = false; // En train de sélectionner en drag
    
    // Variables pour la sélection rectangulaire
    let isRectSelecting = false; // En train de faire une sélection rectangulaire
    let rectSelectPrepared = false; // Préparé pour la sélection (clic droit maintenu)
    let rectSelectStart = null; // Point de départ de la sélection
    let rectSelectElement = null; // Élément visuel du rectangle de sélection
    let rectMinimumDistance = 5; // Distance minimale avant de commencer la sélection
    
    // Système audio
    let audioContext = null;
    const drumSounds = {};
    
    // Variables pour la lecture
    let playbackStartTime = 0;
    let playbackPauseTime = 0;
    let currentPosition = 0;
    let totalDuration = 0;
    let playbackInterval = null;
    let currentBPM = 120;
    let isLoopMode = false;
    
    // Variables pour la navigation temporelle
    let currentTimePosition = 0; // Position actuelle dans la grille (0-based)
    let totalTimePositions = 16; // Nombre total de positions (16 pour les double-croches sur 4 mesures)
    
    // Variables pour les modificateurs de notes
    let selectedModifiers = {
        accent: false,
        ghost: false,
        flam: false,
        swing: false,
        triplet: false,
        tied: false
    };
    
    // Variables pour les blocs
    let savedBlocks = [];
    let blockCounter = 0;
    
    // Variables pour l'historique
    let patternHistory = [];
    let historyIndex = -1;
    let maxHistorySize = 50;
    
    // Couleurs disponibles pour les blocs
    const blockColors = [
        { name: 'Bleu', value: '#4A90E2', light: '#6BB6F7' },
        { name: 'Vert', value: '#7ED321', light: '#9EE34A' },
        { name: 'Rouge', value: '#D0021B', light: '#E8334A' },
        { name: 'Orange', value: '#F5A623', light: '#F7B955' },
        { name: 'Violet', value: '#9013FE', light: '#A855F7' },
        { name: 'Rose', value: '#EC407A', light: '#F06292' },
        { name: 'Turquoise', value: '#00BCD4', light: '#26C6DA' },
        { name: 'Lime', value: '#8BC34A', light: '#AED581' },
        { name: 'Indigo', value: '#3F51B5', light: '#5C6BC0' },
        { name: 'Teal', value: '#009688', light: '#4DB6AC' }
    ];
    
    // Variables pour la composition
    let composition = [];
    let isCompositionPlaying = false;
    let isCompositionLooping = false;
    let currentCompositionBlock = 0;
    let compositionStartTime = 0;
    let compositionTimeout = null;
    
    // Variables pour les presets de sons
    let currentDrumKit = 'default';
    let customSounds = {}; // Stockage des sons personnalisés
    
    // Presets de batterie avec paramètres différents
    const drumKitPresets = {
        'default': {
            name: '🥁 Standard',
            kick: { freq: 60, decay: 0.3, gain: 0.8 },
            snare: { noiseFreq: 1000, tonalFreq: 200, decay: 0.2, gain: 0.5 },
            'hihat-closed': { freq: 8000, decay: 0.08, gain: 0.3 },
            'hihat-open': { freq: 5000, decay: 0.3, gain: 0.2 },
            crash: { freq: 3000, decay: 1.5, gain: 0.3 },
            ride: { freq: 2500, decay: 1.0, gain: 0.25 },
            splash: { freq: 4000, decay: 0.8, gain: 0.3 },
            'tom-high': { freq: 300, decay: 0.4, gain: 0.6 },
            'tom-mid': { freq: 200, decay: 0.4, gain: 0.6 },
            'tom-low': { freq: 150, decay: 0.5, gain: 0.6 },
            'tom-floor': { freq: 100, decay: 0.6, gain: 0.6 }
        },
        'rock': {
            name: '🤘 Rock',
            kick: { freq: 55, decay: 0.25, gain: 1.0 },
            snare: { noiseFreq: 1200, tonalFreq: 220, decay: 0.15, gain: 0.7 },
            'hihat-closed': { freq: 9000, decay: 0.06, gain: 0.4 },
            'hihat-open': { freq: 6000, decay: 0.25, gain: 0.3 },
            crash: { freq: 3500, decay: 2.0, gain: 0.4 },
            ride: { freq: 2800, decay: 1.2, gain: 0.3 },
            splash: { freq: 4500, decay: 0.6, gain: 0.35 },
            'tom-high': { freq: 320, decay: 0.35, gain: 0.7 },
            'tom-mid': { freq: 210, decay: 0.4, gain: 0.7 },
            'tom-low': { freq: 140, decay: 0.5, gain: 0.7 },
            'tom-floor': { freq: 90, decay: 0.7, gain: 0.7 }
        },
        'metal': {
            name: '⚡ Metal',
            kick: { freq: 50, decay: 0.15, gain: 1.2 },
            snare: { noiseFreq: 1500, tonalFreq: 250, decay: 0.12, gain: 0.8 },
            'hihat-closed': { freq: 10000, decay: 0.04, gain: 0.5 },
            'hihat-open': { freq: 7000, decay: 0.2, gain: 0.35 },
            crash: { freq: 4000, decay: 2.5, gain: 0.45 },
            ride: { freq: 3000, decay: 1.0, gain: 0.3 },
            splash: { freq: 5000, decay: 0.5, gain: 0.4 },
            'tom-high': { freq: 350, decay: 0.3, gain: 0.8 },
            'tom-mid': { freq: 230, decay: 0.35, gain: 0.8 },
            'tom-low': { freq: 120, decay: 0.45, gain: 0.8 },
            'tom-floor': { freq: 80, decay: 0.6, gain: 0.8 }
        },
        'jazz': {
            name: '🎷 Jazz',
            kick: { freq: 70, decay: 0.4, gain: 0.6 },
            snare: { noiseFreq: 800, tonalFreq: 180, decay: 0.3, gain: 0.4 },
            'hihat-closed': { freq: 6000, decay: 0.12, gain: 0.25 },
            'hihat-open': { freq: 4000, decay: 0.5, gain: 0.15 },
            crash: { freq: 2500, decay: 3.0, gain: 0.25 },
            ride: { freq: 2200, decay: 2.0, gain: 0.2 },
            splash: { freq: 3500, decay: 1.2, gain: 0.25 },
            'tom-high': { freq: 280, decay: 0.5, gain: 0.5 },
            'tom-mid': { freq: 180, decay: 0.6, gain: 0.5 },
            'tom-low': { freq: 130, decay: 0.7, gain: 0.5 },
            'tom-floor': { freq: 110, decay: 0.8, gain: 0.5 }
        },
        'electronic': {
            name: '🎛️ Electronic',
            kick: { freq: 45, decay: 0.2, gain: 1.0 },
            snare: { noiseFreq: 2000, tonalFreq: 300, decay: 0.1, gain: 0.6 },
            'hihat-closed': { freq: 12000, decay: 0.03, gain: 0.4 },
            'hihat-open': { freq: 8000, decay: 0.15, gain: 0.3 },
            crash: { freq: 5000, decay: 1.0, gain: 0.4 },
            ride: { freq: 3500, decay: 0.8, gain: 0.3 },
            splash: { freq: 6000, decay: 0.4, gain: 0.35 },
            'tom-high': { freq: 400, decay: 0.25, gain: 0.6 },
            'tom-mid': { freq: 250, decay: 0.3, gain: 0.6 },
            'tom-low': { freq: 150, decay: 0.4, gain: 0.6 },
            'tom-floor': { freq: 100, decay: 0.5, gain: 0.6 }
        }
    };
    
    // Initialisation
    initializeInterface();
    initializeAudio();
    generatePatternGrid();
    setupEventListeners();
    
    // Initialise l'affichage des blocs avec leurs event listeners
    updateBlocksDisplay();
    
    // Sauvegarde l'état initial
    setTimeout(() => {
        savePatternState('État initial');
    }, 100);
    
    // Événements globaux pour le drag-to-fill et la sélection rectangulaire
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Sauvegarde l'état après le drag seulement si c'était un vrai drag
            if (dragStarted) {
                savePatternState(dragAction === 'add' ? 'Remplir notes (drag)' : 'Effacer notes (drag)');
            }
            endDragFill();
        }
        
        if (rectSelectPrepared || isRectSelecting) {
            endRectangularSelection();
        }
    });
    
    // Gestion du mouvement de souris pour la sélection rectangulaire
    document.addEventListener('mousemove', (e) => {
        if (rectSelectPrepared || isRectSelecting) {
            updateRectangularSelection(e);
        }
    });
    
    // Empêche la sélection de texte pendant le drag
    document.addEventListener('selectstart', (e) => {
        if (dragStarted) {
            e.preventDefault();
        }
    });
    
    // Raccourcis clavier pour copier-coller
    document.addEventListener('keydown', (e) => {
        // Ctrl+C ou Cmd+C pour copier
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedCells.size > 0) {
            e.preventDefault();
            copySelectedCells();
        }
        
        // Ctrl+V ou Cmd+V pour coller
        if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard.length > 0) {
            e.preventDefault();
            if (selectedCells.size > 0) {
                // Colle à la première position sélectionnée
                const firstCellId = Array.from(selectedCells)[0];
                const [trackId, position] = firstCellId.split('-');
                const cell = document.querySelector(`[data-track-id="${trackId}"] .grid-cell[data-position="${position}"]`);
                if (cell) {
                    pasteSelectedCells(cell);
                }
            } else {
                // Colle à la première cellule de la première piste
                const firstCell = document.querySelector('.grid-cell[data-position="0"]');
                if (firstCell) {
                    pasteSelectedCells(firstCell);
                } else {
                    console.log('Utilisez clic droit pour coller à une position spécifique');
                }
            }
        }
        
        // Échap pour désélectionner
        if (e.key === 'Escape') {
            clearSelection();
        }
        
        // Suppr pour effacer les notes sélectionnées
        if (e.key === 'Delete' && selectedCells.size > 0) {
            e.preventDefault();
            deleteSelectedCells();
        }
    });

    // Ajout d'un gestionnaire de clic global pour désélectionner quand on clique à côté
    document.addEventListener('click', (e) => {
        // Ignore les clics avec Ctrl/Cmd (pour ne pas interférer avec la sélection multiple)
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        
        // Debug : afficher l'élément cliqué
        console.log('Clic sur:', e.target, 'Classes:', e.target.className);
        
        // Liste plus restrictive - ne pas désélectionner si on clique sur des éléments interactifs
        const isInteractiveElement = e.target.closest('.grid-cell') || 
                                    e.target.closest('.track-controls') ||
                                    e.target.closest('.drum-kit') ||
                                    e.target.closest('.pattern-controls') ||
                                    e.target.closest('.timeline-controls') ||
                                    e.target.closest('button') ||
                                    e.target.closest('input') ||
                                    e.target.closest('select') ||
                                    e.target.closest('.modal') ||
                                    e.target.closest('.track-drum-selector') ||
                                    e.target.closest('.track-volume-slider');
        
        console.log('Est un élément interactif:', !!isInteractiveElement);
        console.log('Nombre de cellules sélectionnées:', selectedCells.size);
        
        // Désélectionne uniquement si :
        // 1. On clique sur un élément non-interactif (fond, espaces vides)
        // 2. Il y a des cellules sélectionnées
        // 3. Ce n'est pas un clic sur une cellule de grille
        if (!isInteractiveElement && selectedCells.size > 0) {
            console.log('DÉSELECTION: clic sur zone non-interactive');
            clearSelection();
        }
    });
    
    function deleteSelectedCells() {
        if (selectedCells.size === 0) return;
        
        savePatternState('Supprimer notes sélectionnées');
        
        selectedCells.forEach(cellId => {
            const [trackId, position] = cellId.split('-');
            const cell = document.querySelector(`[data-track-id="${trackId}"] .grid-cell[data-position="${position}"]`);
            if (cell && cell.classList.contains('active')) {
                cell.classList.remove('active');
                removeAllDrumColors(cell);
                removeAllModifiers(cell);
            }
        });
        
        console.log(`${selectedCells.size} note(s) supprimée(s)`);
        clearSelection();
    }
    
    function initializeInterface() {
        // Met à jour l'affichage du volume initial
        volumeDisplay.textContent = volumeSlider.value + '%';
        
        // Initialise la batterie virtuelle fermée
        isDrumKitOpen = false;
        drumKitContent.style.display = 'none';
        drumKitToggle.textContent = '▼';
        
        // Initialise la progression
        calculateTotalDuration();
        updateTimeDisplays();
        
        // Initialise l'affichage temporel
        updateTimeIndicator();
    }
    
    function generatePatternGrid() {
        // Génère une grille adaptative selon l'unité de mesure choisie
        patternGrid.innerHTML = '';
        
        // Ajoute l'attribut data-note-value pour le CSS responsive
        patternGrid.dataset.noteValue = currentNoteValue;
        
        const tracks = document.querySelectorAll('.track');
        
        // Calcul du nombre de subdivisions selon l'unité rythmique
        const subdivisions = getSubdivisionsForNoteValue(currentNoteValue);
        const totalCells = subdivisions * 4; // 4 mesures
        
        tracks.forEach((track, trackIndex) => {
            const gridRow = document.createElement('div');
            gridRow.className = 'grid-row';
            gridRow.dataset.trackId = track.dataset.trackId;
            gridRow.style.gridTemplateColumns = `repeat(${totalCells}, 1fr)`;
            
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.position = i;
                
                // Marque les débuts de mesure
                if (i % subdivisions === 0) {
                    cell.classList.add('measure-start');
                }
                
                // Marque les temps forts (noires)
                const beatInterval = subdivisions / 4;
                if (beatInterval >= 1 && i % beatInterval === 0) {
                    cell.classList.add('beat');
                }
                
                // Événements pour clic simple
                cell.addEventListener('click', (e) => handleCellClick(e, cell, trackIndex, i));
                
                // Événement pour clic droit (coller)
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // Empêche le menu contextuel par défaut
                    console.log('🖱️ Clic droit détecté - clipboard:', clipboard.length, 'éléments');
                    
                    // Colle si le clipboard contient des éléments
                    if (clipboard.length > 0) {
                        console.log('🎵 COLLAGE par clic droit');
                        pasteSelectedCells(cell);
                    } else {
                        console.log('ℹ️ Clipboard vide - rien à coller');
                    }
                });
                
                // Événements pour drag-to-fill
                cell.addEventListener('mousedown', (e) => startDragFill(e, cell, trackIndex, i));
                cell.addEventListener('mouseenter', () => continueDragFill(cell, trackIndex, i));
                cell.addEventListener('mouseup', () => endDragFill());
                
                gridRow.appendChild(cell);
            }
            
            patternGrid.appendChild(gridRow);
        });
        
        // Met à jour l'en-tête de mesures
        updateMeasureHeaders(subdivisions);
        
        // Met à jour le nombre total de positions temporelles
        totalTimePositions = totalCells;
        updateTimeIndicator();
    }
    
    function getSubdivisionsForNoteValue(noteValue) {
        // Retourne le nombre de subdivisions par mesure selon la valeur rythmique
        const subdivisionMap = {
            'whole': 1,        // 1 ronde par mesure
            'half': 2,         // 2 blanches par mesure
            'quarter': 4,      // 4 noires par mesure
            'eighth': 8,       // 8 croches par mesure
            'sixteenth': 16,   // 16 double-croches par mesure
            'thirtysecond': 32, // 32 triple-croches par mesure
            'sixtyfourth': 64  // 64 quadruple-croches par mesure
        };
        return subdivisionMap[noteValue] || 4;
    }
    
    function updateMeasureHeaders(subdivisions) {
        const gridMeasureNumbers = document.querySelector('.grid-measure-numbers');
        if (!gridMeasureNumbers) return;
        
        gridMeasureNumbers.innerHTML = '';
        gridMeasureNumbers.style.gridTemplateColumns = `repeat(${subdivisions * 4}, 1fr)`;
        
        // Affiche les numéros de mesure
        for (let measure = 0; measure < 4; measure++) {
            for (let subdivision = 0; subdivision < subdivisions; subdivision++) {
                const span = document.createElement('span');
                if (subdivision === 0) {
                    span.textContent = measure + 1;
                    span.classList.add('measure-number');
                } else {
                    span.textContent = '';
                }
                gridMeasureNumbers.appendChild(span);
            }
        }
    }
    
    function updateTimeIndicator() {
        const timeIndicator = document.querySelector('.time-indicator');
        if (timeIndicator) {
            // Calcule la position actuelle en format "position/total"
            const displayPosition = currentTimePosition + 1; // Affichage en base 1
            timeIndicator.textContent = `${displayPosition}/${totalTimePositions}`;
        }
    }
    
    function navigateTime(direction) {
        switch (direction) {
            case 'first':
                currentTimePosition = 0;
                break;
            case 'prev':
                if (currentTimePosition > 0) {
                    currentTimePosition--;
                }
                break;
            case 'next':
                if (currentTimePosition < totalTimePositions - 1) {
                    currentTimePosition++;
                }
                break;
            case 'last':
                currentTimePosition = totalTimePositions - 1;
                break;
        }
        
        updateTimeIndicator();
        highlightCurrentTimePosition();
    }
    
    function highlightCurrentTimePosition() {
        // Retire le surlignage précédent
        document.querySelectorAll('.grid-cell.current-time').forEach(cell => {
            cell.classList.remove('current-time');
        });
        
        // Ajoute le surlignage à la position actuelle
        document.querySelectorAll(`.grid-cell[data-position="${currentTimePosition}"]`).forEach(cell => {
            cell.classList.add('current-time');
        });
    }
    
    function toggleNote(cell, trackIndex, position) {
        // Ignore le clic si un vrai drag a eu lieu
        if (dragStarted) {
            return;
        }
        
        // Sauvegarde l'état avant modification
        savePatternState(!cell.classList.contains('active') ? 'Ajouter note' : 'Supprimer note');
        
        const isActive = cell.classList.contains('active');
        
        if (isActive) {
            // Supprime la note et sa couleur
            cell.classList.remove('active');
            removeAllDrumColors(cell);
            removeAllModifiers(cell);
        } else {
            // Ajoute la note avec la couleur de la piste
            cell.classList.add('active');
            const trackElement = document.querySelectorAll('.track')[trackIndex];
            const drumType = trackElement.querySelector('.track-drum-selector').value;
            addDrumColor(cell, drumType);
            
            // Applique les modificateurs sélectionnés à toute la colonne
            applyModifiersToColumn(position);
        }
        
        console.log(`Note ${!isActive ? 'ajoutée' : 'supprimée'} - Piste: ${trackIndex}, Position: ${position}`);
    }
    
    function handleCellClick(e, cell, trackIndex, position) {
        console.log('=== handleCellClick appelé ===');
        console.log('dragStarted:', dragStarted);
        console.log('Ctrl/Cmd pressed:', e.ctrlKey || e.metaKey);
        console.log('Clipboard contient:', clipboard.length, 'éléments');
        
        // Ignore le clic si un vrai drag a eu lieu
        if (dragStarted) {
            console.log('Clic ignoré car dragStarted=true');
            return;
        }
        
        // Gestion de la sélection avec Ctrl/Cmd
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault(); // Empêche les comportements par défaut du navigateur
            console.log('Mode sélection activé');
            toggleCellSelection(cell);
            return;
        }
        
        
        // Clic normal sans clipboard : désélectionne tout et toggle la note
        console.log('Clic normal - désélection + toggle note');
        clearSelection();
        toggleNote(cell, trackIndex, position);
    }
    
    function toggleCellSelection(cell) {
        const cellId = `${cell.closest('.grid-row').dataset.trackId}-${cell.dataset.position}`;
        
        if (selectedCells.has(cellId)) {
            // Désélectionne
            selectedCells.delete(cellId);
            cell.classList.remove('selected');
        } else {
            // Sélectionne
            selectedCells.add(cellId);
            cell.classList.add('selected');
        }
        
        console.log(`${selectedCells.size} cellule(s) sélectionnée(s)`);
    }
    
    function clearSelection() {
        console.log('=== CLEARING SELECTION ===');
        console.log('selectedCells avant nettoyage:', selectedCells.size);
        
        // Méthode 1: Nettoie via selectedCells (si pas déjà vide)
        selectedCells.forEach(cellId => {
            const [trackId, position] = cellId.split('-');
            const cell = document.querySelector(`[data-track-id="${trackId}"] .grid-cell[data-position="${position}"]`);
            if (cell) {
                cell.classList.remove('selected');
                console.log('Cellule désélectionnée via selectedCells:', cellId);
            }
        });
        
        // Méthode 2: Nettoie toutes les cellules avec class "selected" (au cas où)
        const allSelectedCells = document.querySelectorAll('.grid-cell.selected');
        console.log('Cellules avec class "selected" trouvées:', allSelectedCells.length);
        allSelectedCells.forEach(cell => {
            cell.classList.remove('selected');
            console.log('Cellule désélectionnée via DOM:', cell);
        });
        
        selectedCells.clear();
        console.log('=== SELECTION CLEARED ===');
    }
    
    function copySelectedCells() {
        if (selectedCells.size === 0) {
            console.log('Aucune cellule sélectionnée à copier');
            return;
        }
        
        clipboard = [];
        
        selectedCells.forEach(cellId => {
            const [trackId, position] = cellId.split('-');
            const trackElement = document.querySelector(`[data-track-id="${trackId}"]`);
            const trackIndex = Array.from(document.querySelectorAll('.track')).indexOf(trackElement);
            const cell = trackElement.querySelector(`.grid-cell[data-position="${position}"]`);
            
            if (cell && cell.classList.contains('active')) {
                // Capture les données de la note
                const noteData = {
                    relativePosition: parseInt(position), // Position sera ajustée lors du collage
                    trackIndex: trackIndex,
                    drum: getDrumTypeFromCell(cell),
                    modifiers: getModifiersFromCell(cell)
                };
                clipboard.push(noteData);
            }
        });
        
        console.log(`📋 ${clipboard.length} note(s) copiée(s) dans le presse-papiers`);
        updateClipboardStatus();
    }
    
    function clearClipboard() {
        clipboard = [];
        console.log('🗑️ Clipboard vidé');
        updateClipboardStatus();
    }
    
    function updateClipboardStatus() {
        // Ajoute/met à jour un indicateur visuel du statut du clipboard
        let statusDiv = document.getElementById('clipboard-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'clipboard-status';
            statusDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(statusDiv);
        }
        
        if (clipboard.length > 0) {
            statusDiv.textContent = `📋 ${clipboard.length} note(s) - Cliquez pour coller`;
            statusDiv.style.opacity = '1';
            statusDiv.style.cursor = 'pointer';
            statusDiv.onclick = clearClipboard;
        } else {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                if (clipboard.length === 0) statusDiv.textContent = '';
            }, 300);
        }
    }
    
    function pasteSelectedCells(targetCell) {
        if (clipboard.length === 0) {
            console.log('❌ Presse-papiers vide');
            return;
        }
        
        console.log('📋 Début du collage - clipboard contient:', clipboard.length, 'éléments');
        console.log('🎯 Cellule cible:', targetCell, 'position:', targetCell.dataset.position);
        
        const targetTrackElement = targetCell.closest('.track');
        if (!targetTrackElement) {
            console.error('❌ Impossible de trouver l\'élément track parent');
            return;
        }
        
        const targetTrackIndex = Array.from(document.querySelectorAll('.track')).indexOf(targetTrackElement);
        const targetPosition = parseInt(targetCell.dataset.position);
        
        console.log('🎯 Position de collage - piste:', targetTrackIndex, 'position:', targetPosition);
        
        // Sauvegarde l'état avant collage
        savePatternState('Coller notes');
        
        // Trouve la position minimale dans le clipboard pour calculer l'offset de position
        const minPosition = Math.min(...clipboard.map(note => note.relativePosition));
        // Trouve l'index de piste minimal pour calculer l'offset de piste
        const minTrackIndex = Math.min(...clipboard.map(note => note.trackIndex));
        
        let pastedCount = 0;
        
        clipboard.forEach((noteData) => {
            // Calcule la nouvelle position relative
            const newPosition = targetPosition + (noteData.relativePosition - minPosition);
            // Calcule le nouvel index de piste relatif
            const newTrackIndex = targetTrackIndex + (noteData.trackIndex - minTrackIndex);
            
            // Trouve la piste cible
            const tracks = document.querySelectorAll('.track');
            console.log('🔍 Recherche piste index:', newTrackIndex, 'parmi', tracks.length, 'pistes disponibles');
            
            if (newTrackIndex >= 0 && newTrackIndex < tracks.length) {
                const newTargetTrack = tracks[newTrackIndex];
                const newTargetTrackId = newTargetTrack.dataset.trackId;
                console.log('🎯 Piste trouvée ID:', newTargetTrackId, 'recherche position:', newPosition);
                
                const newCell = document.querySelector(`[data-track-id="${newTargetTrackId}"] .grid-cell[data-position="${newPosition}"]`);
                console.log('📍 Cellule trouvée:', newCell ? 'OUI' : 'NON');
                
                if (newCell) {
                    // Efface la note existante si présente
                    if (newCell.classList.contains('active')) {
                        newCell.classList.remove('active');
                        removeAllDrumColors(newCell);
                        removeAllModifiers(newCell);
                    }
                    
                    // Ajoute la nouvelle note
                    newCell.classList.add('active');
                    addDrumColor(newCell, noteData.drum);
                    
                    // Applique les modificateurs
                    noteData.modifiers.forEach(modifier => {
                        newCell.classList.add(modifier);
                    });
                    
                    pastedCount++;
                }
            }
        });
        
        console.log(`🎵 ${pastedCount}/${clipboard.length} notes collées à la position cliquée`);
        clearSelection(); // Efface la sélection après collage
    }
    
    function getDrumTypeFromCell(cell) {
        const drumTypes = ['kick', 'snare', 'hihat-closed', 'hihat-open', 'crash', 'ride', 'splash', 'tom-high', 'tom-mid', 'tom-low', 'tom-floor'];
        for (const type of drumTypes) {
            if (cell.classList.contains(type)) {
                return type;
            }
        }
        return 'kick'; // Par défaut
    }
    
    function getModifiersFromCell(cell) {
        const modifiers = [];
        const modifierClasses = ['accent', 'ghost', 'flam', 'swing', 'triplet', 'tied'];
        
        modifierClasses.forEach(modifier => {
            if (cell.classList.contains(modifier)) {
                modifiers.push(modifier);
            }
        });
        
        return modifiers;
    }
    
    function startDragFill(e, cell, trackIndex, position) {
        e.preventDefault();
        
        if (e.button === 2) { // Bouton droit - sélection rectangulaire
            startRectangularSelection(e, cell);
            return;
        }
        
        if (e.button !== 0) return; // Seulement bouton gauche pour le remplissage
        
        // Prépare le drag mais ne l'active pas encore
        isDragging = true;
        dragStarted = false; // Pas encore un vrai drag
        dragTrackIndex = trackIndex;
        dragStartCell = cell;
        
        // Détermine l'action selon l'état actuel de la cellule
        const isActive = cell.classList.contains('active');
        dragAction = isActive ? 'remove' : 'add';
        
        console.log(`Drag prepared: ${dragAction} on track ${trackIndex}`);
    }
    
    function startRectangularSelection(e, cell) {
        rectSelectPrepared = true;
        
        // Récupère la position relative à la grille et absolue
        const gridRect = patternGrid.getBoundingClientRect();
        rectSelectStart = {
            x: e.clientX - gridRect.left,
            y: e.clientY - gridRect.top,
            absoluteX: e.clientX,
            absoluteY: e.clientY,
            cell: cell
        };
        
        console.log('Rectangular selection prepared');
    }
    
    function updateRectangularSelection(e) {
        // Si seulement préparé, vérifie si on doit commencer la sélection
        if (rectSelectPrepared && !isRectSelecting) {
            const distance = Math.sqrt(
                Math.pow(e.clientX - rectSelectStart.absoluteX, 2) + 
                Math.pow(e.clientY - rectSelectStart.absoluteY, 2)
            );
            
            if (distance > rectMinimumDistance) {
                // Commence vraiment la sélection rectangulaire
                isRectSelecting = true;
                
                // Crée l'élément visuel du rectangle
                rectSelectElement = document.createElement('div');
                rectSelectElement.className = 'selection-rectangle';
                patternGrid.appendChild(rectSelectElement);
                
                console.log('Rectangular selection started (drag detected)');
            }
        }
        
        if (!isRectSelecting || !rectSelectStart || !rectSelectElement) return;
        
        // Récupère la position actuelle relative à la grille
        const gridRect = patternGrid.getBoundingClientRect();
        const currentX = e.clientX - gridRect.left;
        const currentY = e.clientY - gridRect.top;
        
        // Calcule les dimensions du rectangle
        const left = Math.min(rectSelectStart.x, currentX);
        const top = Math.min(rectSelectStart.y, currentY);
        const width = Math.abs(currentX - rectSelectStart.x);
        const height = Math.abs(currentY - rectSelectStart.y);
        
        // Applique les dimensions au rectangle visuel
        rectSelectElement.style.left = left + 'px';
        rectSelectElement.style.top = top + 'px';
        rectSelectElement.style.width = width + 'px';
        rectSelectElement.style.height = height + 'px';
    }
    
    function endRectangularSelection() {
        console.log('=== END RECTANGULAR SELECTION ===');
        console.log('isRectSelecting:', isRectSelecting);
        console.log('rectSelectElement exists:', !!rectSelectElement);
        
        // Si une vraie sélection était en cours, sélectionne les cellules
        if (isRectSelecting) {
            console.log('Sélection rectangulaire validée - sélection des cellules...');
            selectCellsInRectangle();
        } else {
            console.log('Pas de sélection rectangulaire (pas de drag suffisant)');
        }
        
        // Nettoie
        if (rectSelectElement) {
            rectSelectElement.remove();
            rectSelectElement = null;
        }
        
        isRectSelecting = false;
        rectSelectPrepared = false;
        rectSelectStart = null;
        
        console.log('Rectangular selection ended');
    }
    
    function selectCellsInRectangle() {
        if (!rectSelectElement) return;
        
        const rectBounds = rectSelectElement.getBoundingClientRect();
        const allCells = document.querySelectorAll('.grid-cell');
        
        // Efface la sélection précédente si pas de Ctrl
        const event = window.event || {};
        if (!event.ctrlKey && !event.metaKey) {
            clearSelection();
        }
        
        allCells.forEach(cell => {
            const cellBounds = cell.getBoundingClientRect();
            
            // Vérifie si la cellule intersecte avec le rectangle
            if (cellBounds.left < rectBounds.right &&
                cellBounds.right > rectBounds.left &&
                cellBounds.top < rectBounds.bottom &&
                cellBounds.bottom > rectBounds.top) {
                
                // Sélectionne la cellule
                const cellId = `${cell.closest('.grid-row').dataset.trackId}-${cell.dataset.position}`;
                selectedCells.add(cellId);
                cell.classList.add('selected');
            }
        });
        
        console.log(`${selectedCells.size} cellule(s) sélectionnée(s) par rectangle`);
    }
    
    function continueDragFill(cell, trackIndex, position) {
        // Continue seulement si on est en train de draguer et sur la même piste
        if (!isDragging || trackIndex !== dragTrackIndex) return;
        
        // Si on n'a pas encore commencé le vrai drag et qu'on est sur une cellule différente
        if (!dragStarted && cell !== dragStartCell) {
            dragStarted = true;
            console.log('Real drag started');
            
            // Applique l'action à la cellule de départ maintenant
            const startPosition = parseInt(dragStartCell.dataset.position);
            applyDragAction(dragStartCell, trackIndex, startPosition);
        }
        
        // Applique l'action à cette cellule seulement si le drag a vraiment commencé
        if (dragStarted) {
            applyDragAction(cell, trackIndex, position);
        }
    }
    
    function endDragFill() {
        if (isDragging) {
            isDragging = false;
            dragAction = null;
            dragTrackIndex = null;
            dragStarted = false;
            dragStartCell = null;
            console.log('Drag ended');
        }
    }
    
    function applyDragAction(cell, trackIndex, position) {
        const isActive = cell.classList.contains('active');
        
        // Applique l'action seulement si elle change l'état de la cellule
        if ((dragAction === 'add' && !isActive) || (dragAction === 'remove' && isActive)) {
            // Ne pas sauvegarder l'état pour chaque cellule pendant le drag
            // L'état sera sauvé une fois à la fin du drag
            
            if (dragAction === 'add') {
                // Ajoute la note
                cell.classList.add('active');
                const trackElement = document.querySelectorAll('.track')[trackIndex];
                const drumType = trackElement.querySelector('.track-drum-selector').value;
                addDrumColor(cell, drumType);
                
                // Applique les modificateurs sélectionnés
                applyModifiersToColumn(position);
            } else {
                // Supprime la note
                cell.classList.remove('active');
                removeAllDrumColors(cell);
                removeAllModifiers(cell);
            }
        }
    }
    
    function addDrumColor(cell, drumType) {
        // Supprime toutes les couleurs existantes puis ajoute la nouvelle
        removeAllDrumColors(cell);
        cell.classList.add(drumType);
    }
    
    function removeAllDrumColors(cell) {
        const drumTypes = ['kick', 'snare', 'hihat-closed', 'hihat-open', 'crash', 'ride', 'splash', 'tom-high', 'tom-mid', 'tom-low', 'tom-floor'];
        drumTypes.forEach(type => cell.classList.remove(type));
    }
    
    function applySelectedModifiers(cell) {
        // Applique les modificateurs sélectionnés à la cellule
        if (selectedModifiers.accent) {
            cell.classList.add('accent');
            cell.setAttribute('data-modifier-accent', 'true');
        }
        if (selectedModifiers.ghost) {
            cell.classList.add('ghost');
            cell.setAttribute('data-modifier-ghost', 'true');
        }
        if (selectedModifiers.flam) {
            cell.classList.add('flam');
            cell.setAttribute('data-modifier-flam', 'true');
        }
        if (selectedModifiers.swing) {
            cell.classList.add('swing');
            cell.setAttribute('data-modifier-swing', 'true');
        }
        if (selectedModifiers.triplet) {
            cell.classList.add('triplet');
            cell.setAttribute('data-modifier-triplet', 'true');
        }
        if (selectedModifiers.tied) {
            cell.classList.add('tied');
            cell.setAttribute('data-modifier-tied', 'true');
        }
    }
    
    function applyModifiersToColumn(position) {
        // Applique les modificateurs sélectionnés à toutes les cellules actives de la colonne
        const allCellsInColumn = document.querySelectorAll(`[data-position="${position}"].active`);
        
        allCellsInColumn.forEach(cell => {
            // Retire d'abord les anciens modificateurs
            removeAllModifiers(cell);
            // Applique les nouveaux modificateurs sélectionnés
            applySelectedModifiers(cell);
        });
        
        console.log(`Modificateurs appliqués à la colonne ${position}:`, selectedModifiers);
    }
    
    function removeAllModifiers(cell) {
        // Supprime tous les modificateurs de la cellule
        const modifierClasses = ['accent', 'ghost', 'flam', 'swing', 'triplet', 'tied'];
        modifierClasses.forEach(modifier => cell.classList.remove(modifier));
        cell.removeAttribute('data-modifier-accent');
        cell.removeAttribute('data-modifier-ghost');
        cell.removeAttribute('data-modifier-flam');
        cell.removeAttribute('data-modifier-swing');
        cell.removeAttribute('data-modifier-triplet');
        cell.removeAttribute('data-modifier-tied');
    }
    
    function updateModifierDisplay() {
        // Met à jour l'affichage pour indiquer quels modificateurs sont sélectionnés
        const noteSelector = document.querySelector('.note-selector');
        if (noteSelector) {
            // Ajoute une classe pour indiquer l'état actuel
            noteSelector.classList.toggle('has-modifiers', 
                selectedModifiers.accent || selectedModifiers.ghost || 
                selectedModifiers.flam || selectedModifiers.swing ||
                selectedModifiers.triplet || selectedModifiers.tied);
        }
        
        console.log('Modificateurs sélectionnés:', selectedModifiers);
    }
    
    function setupEventListeners() {
        // Contrôles de transport
        playBtn.addEventListener('click', () => {
            startPlayback();
        });
        
        pauseBtn.addEventListener('click', () => {
            pausePlayback();
        });
        
        stopBtn.addEventListener('click', () => {
            stopPlayback();
        });
        
        // Bouton loop
        loopBtn.addEventListener('click', () => {
            toggleLoopMode();
        });
        
        // Volume master
        volumeSlider.addEventListener('input', () => {
            volumeDisplay.textContent = volumeSlider.value + '%';
        });
        
        // Navigation temporelle
        const firstTimeBtn = document.getElementById('first-time');
        const prevTimeBtn = document.getElementById('prev-time');
        const nextTimeBtn = document.getElementById('next-time');
        const lastTimeBtn = document.getElementById('last-time');
        
        if (firstTimeBtn) {
            firstTimeBtn.addEventListener('click', () => {
                navigateTime('first');
            });
        }
        
        if (prevTimeBtn) {
            prevTimeBtn.addEventListener('click', () => {
                navigateTime('prev');
            });
        }
        
        if (nextTimeBtn) {
            nextTimeBtn.addEventListener('click', () => {
                navigateTime('next');
            });
        }
        
        if (lastTimeBtn) {
            lastTimeBtn.addEventListener('click', () => {
                navigateTime('last');
            });
        }
        
        // Batterie virtuelle toggle
        drumKitToggle.addEventListener('click', () => {
            console.log('Toggle cliqué, état actuel:', isDrumKitOpen);
            isDrumKitOpen = !isDrumKitOpen;
            if (isDrumKitOpen) {
                drumKitContent.style.display = 'flex';
                drumKitToggle.textContent = '▲';
                console.log('Batterie ouverte');
            } else {
                drumKitContent.style.display = 'none';
                drumKitToggle.textContent = '▼';
                console.log('Batterie fermée');
            }
        });
        
        // Alternative: écouter aussi les clics sur l'en-tête complet
        const drumKitHeader = document.getElementById('drum-kit-header');
        drumKitHeader.addEventListener('click', (e) => {
            // Évite le double déclenchement si on clique sur le bouton
            if (e.target !== drumKitToggle) {
                drumKitToggle.click();
            }
        });
        
        // Pads de batterie
        const drumPads = document.querySelectorAll('.drum-pad');
        drumPads.forEach(pad => {
            // Clic : joue le son et anime
            pad.addEventListener('click', () => {
                const drumType = pad.dataset.drum;
                console.log(`Pad cliqué: ${drumType}`);
                
                // Animation visuelle
                pad.classList.add('playing');
                setTimeout(() => pad.classList.remove('playing'), 200);
                
                // Joue le son
                playDrumSound(drumType);
            });
            
            // Hover : pré-écoute instantanée
            pad.addEventListener('mouseenter', () => {
                const drumType = pad.dataset.drum;
                
                // Animation hover subtile
                pad.classList.add('hover-preview');
                
                // Pré-écoute avec volume réduit
                if (audioContext) {
                    const gainNode = audioContext.createGain();
                    gainNode.connect(audioContext.destination);
                    gainNode.gain.value = 0.15; // Volume réduit pour la pré-écoute
                    
                    // Son de pré-écoute
                    switch (drumType) {
                        case 'kick': createKickSound(gainNode); break;
                        case 'snare': createSnareSound(gainNode); break;
                        case 'hihat-closed': createHiHatSound(gainNode, 0.05, true); break;
                        case 'hihat-open': createHiHatSound(gainNode, 0.15, false); break;
                        case 'crash': createCymbalSound(gainNode, 1200, 0.3); break;
                        case 'ride': createCymbalSound(gainNode, 800, 0.2); break;
                        case 'splash': createCymbalSound(gainNode, 1500, 0.15); break;
                        case 'tom-high': createTomSound(gainNode, 300); break;
                        case 'tom-mid': createTomSound(gainNode, 200); break;
                        case 'tom-low': createTomSound(gainNode, 150); break;
                        case 'tom-floor': createTomSound(gainNode, 100); break;
                        default: createGenericDrumSound(gainNode, 440);
                    }
                }
            });
            
            // Sortie hover
            pad.addEventListener('mouseleave', () => {
                pad.classList.remove('hover-preview');
            });
        });
        
        // Boutons de piste
        setupTrackControls();
        
        // Modales
        setupModals();
        
        // Nom du projet
        projectNameInput.addEventListener('change', () => {
            console.log(`Projet renommé: ${projectNameInput.value}`);
        });
        
        // Tempo
        tempoInput.addEventListener('change', () => {
            currentBPM = parseInt(tempoInput.value);
            calculateTotalDuration();
            updateTimeDisplays();
            console.log(`Tempo changé: ${currentBPM} BPM`);
        });
        
        // Boutons tempo +/-
        const tempoUpBtn = document.getElementById('tempo-up');
        const tempoDownBtn = document.getElementById('tempo-down');
        
        tempoUpBtn.addEventListener('click', () => {
            let newBPM = currentBPM + 1;
            if (newBPM <= 300) {
                currentBPM = newBPM;
                tempoInput.value = currentBPM;
                calculateTotalDuration();
                updateTimeDisplays();
                console.log(`Tempo augmenté: ${currentBPM} BPM`);
            }
        });
        
        tempoDownBtn.addEventListener('click', () => {
            let newBPM = currentBPM - 1;
            if (newBPM >= 30) {
                currentBPM = newBPM;
                tempoInput.value = currentBPM;
                calculateTotalDuration();
                updateTimeDisplays();
                console.log(`Tempo diminué: ${currentBPM} BPM`);
            }
        });
        
        // Sélecteur d'unité rythmique
        const noteValueSelector = document.getElementById('note-value');
        noteValueSelector.addEventListener('change', () => {
            currentNoteValue = noteValueSelector.value;
            calculateTotalDuration();
            updateTimeDisplays();
            console.log(`Unité rythmique changée: ${currentNoteValue}`);
            generatePatternGrid();
        });
        
        // Barre de progression
        progressSlider.addEventListener('input', () => {
            if (!isPlaying) {
                currentPosition = (progressSlider.value / 100) * totalDuration;
                updateTimeDisplays();
                updateGridCursor();
            }
        });
        
        // Gestionnaires pour les modificateurs de notes
        const accentCheckbox = document.getElementById('accent');
        const ghostCheckbox = document.getElementById('ghost');
        const flamCheckbox = document.getElementById('flam');
        const swingCheckbox = document.getElementById('swing');
        const tripletCheckbox = document.getElementById('triplet');
        const tiedCheckbox = document.getElementById('tied');
        
        if (accentCheckbox) {
            accentCheckbox.addEventListener('change', () => {
                selectedModifiers.accent = accentCheckbox.checked;
                if (accentCheckbox.checked) {
                    // Désactive ghost si accent est sélectionné (opposés)
                    ghostCheckbox.checked = false;
                    selectedModifiers.ghost = false;
                }
                updateModifierDisplay();
            });
        }
        
        if (ghostCheckbox) {
            ghostCheckbox.addEventListener('change', () => {
                selectedModifiers.ghost = ghostCheckbox.checked;
                if (ghostCheckbox.checked) {
                    // Désactive accent si ghost est sélectionné (opposés)
                    accentCheckbox.checked = false;
                    selectedModifiers.accent = false;
                }
                updateModifierDisplay();
            });
        }
        
        if (flamCheckbox) {
            flamCheckbox.addEventListener('change', () => {
                selectedModifiers.flam = flamCheckbox.checked;
                updateModifierDisplay();
            });
        }
        
        if (swingCheckbox) {
            swingCheckbox.addEventListener('change', () => {
                selectedModifiers.swing = swingCheckbox.checked;
                updateModifierDisplay();
            });
        }
        
        if (tripletCheckbox) {
            tripletCheckbox.addEventListener('change', () => {
                selectedModifiers.triplet = tripletCheckbox.checked;
                updateModifierDisplay();
            });
        }
        
        if (tiedCheckbox) {
            tiedCheckbox.addEventListener('change', () => {
                selectedModifiers.tied = tiedCheckbox.checked;
                updateModifierDisplay();
            });
        }
        
        // Bouton sauvegarder comme bloc
        const saveAsBlockBtn = document.getElementById('save-as-block');
        saveAsBlockBtn.addEventListener('click', () => {
            saveCurrentPatternAsBlock();
        });
        
        // Template groove
        const applyTemplateBtn = document.getElementById('apply-template');
        applyTemplateBtn.addEventListener('click', () => {
            const templateSelect = document.getElementById('groove-template');
            const selectedTemplate = templateSelect.value;
            if (selectedTemplate) {
                applyGrooveTemplate(selectedTemplate);
            }
        });
        
        // Historique Undo/Redo
        const undoBtn = document.getElementById('undo');
        const redoBtn = document.getElementById('redo');
        
        undoBtn.addEventListener('click', () => {
            undoLastAction();
        });
        
        redoBtn.addEventListener('click', () => {
            redoLastAction();
        });
        
        // Export MIDI
        const exportMidiBtn = document.getElementById('export-midi');
        if (exportMidiBtn) {
            exportMidiBtn.addEventListener('click', () => {
                exportToMIDI();
            });
        }
        
        // Bouton vider pattern
        const clearPatternBtn = document.getElementById('clear-pattern');
        clearPatternBtn.addEventListener('click', () => {
            clearCurrentPattern();
        });
        
        // Contrôles de composition
        setupCompositionControls();
        setupDragAndDrop();
        
        // Presets et sons personnalisés
        setupSoundPresets();
        
        // Raccourcis clavier
        setupKeyboardShortcuts();
    }
    
    function setupTrackControls() {
        // Supprime les anciens événements pour éviter les doublons
        document.querySelectorAll('.track-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Boutons mute
        document.querySelectorAll('.track-mute').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.closest('.track');
                const trackName = track.querySelector('.track-name').textContent;
                const soloBtn = track.querySelector('.track-solo');
                
                // Toggle mute
                btn.classList.toggle('active');
                const isMuted = btn.classList.contains('active');
                
                // Si on mute, on retire le solo de cette piste
                if (isMuted && soloBtn.classList.contains('active')) {
                    soloBtn.classList.remove('active');
                }
                
                console.log(`Piste "${trackName}" ${isMuted ? 'mute' : 'unmute'}`);
            });
        });
        
        // Boutons solo
        document.querySelectorAll('.track-solo').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.closest('.track');
                const trackName = track.querySelector('.track-name').textContent;
                const muteBtn = track.querySelector('.track-mute');
                
                // Toggle solo
                btn.classList.toggle('active');
                const isSolo = btn.classList.contains('active');
                
                // Si on met en solo, on retire le mute de cette piste
                if (isSolo && muteBtn.classList.contains('active')) {
                    muteBtn.classList.remove('active');
                }
                
                console.log(`Piste "${trackName}" ${isSolo ? 'solo' : 'unsolo'}`);
            });
        });
        
        // Volume des pistes
        document.querySelectorAll('.track-volume-slider').forEach(slider => {
            const display = slider.nextElementSibling;
            slider.addEventListener('input', () => {
                display.textContent = slider.value + '%';
            });
        });
        
        // Sélecteurs d'instrument
        document.querySelectorAll('.track-drum-selector').forEach(selector => {
            selector.addEventListener('change', () => {
                const trackName = selector.parentElement.parentElement.querySelector('.track-name');
                const selectedOption = selector.options[selector.selectedIndex];
                trackName.textContent = selectedOption.text.split(' ')[1];
                console.log(`Instrument changé: ${selectedOption.text}`);
                
                // Met à jour les couleurs des notes existantes pour cette piste
                updateTrackColors(selector);
            });
        });
        
        // Boutons clone
        document.querySelectorAll('.track-clone').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.closest('.track');
                cloneTrack(track);
            });
        });
        
        // Boutons edit
        document.querySelectorAll('.track-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.closest('.track');
                editTrack(track);
            });
        });
        
        // Boutons delete
        document.querySelectorAll('.track-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const track = btn.closest('.track');
                deleteTrack(track);
            });
        });
        
        // Bouton ajouter piste
        document.getElementById('add-track').addEventListener('click', () => {
            addNewTrack();
        });
        
        // Applique les couleurs aux pistes existantes
        assignTrackColors();
    }
    
    function assignTrackColors() {
        // Assigne une couleur unique à chaque piste
        const tracks = document.querySelectorAll('.track');
        tracks.forEach((track, index) => {
            // Supprime les anciennes classes de couleur
            track.classList.remove(...Array.from(track.classList).filter(cls => cls.startsWith('track-color-')));
            // Ajoute la nouvelle couleur (cycle sur 10 couleurs)
            track.classList.add(`track-color-${index % 10}`);
        });
    }
    
    function addNewTrack() {
        const tracksList = document.getElementById('tracks-list');
        const newTrackId = 'track-' + (tracksList.children.length + 1);
        
        // SAUVEGARDER L'ÉTAT ACTUEL DU PATTERN AVANT D'AJOUTER LA PISTE
        const currentPattern = captureCurrentPattern();
        
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.dataset.trackId = newTrackId;
        
        trackElement.innerHTML = `
            <div class="track-header">
                <div class="track-volume">
                    <input type="range" class="track-volume-slider" min="0" max="100" value="80">
                    <span class="track-volume-display">80%</span>
                </div>
                <span class="track-name">Nouvelle Piste</span>
                <select class="track-drum-selector">
                    <option value="kick">🥁 Grosse Caisse</option>
                    <option value="snare">⚡ Caisse Claire</option>
                    <option value="hihat-closed">🔒 Hi-Hat Fermé</option>
                    <option value="hihat-open">🔓 Hi-Hat Ouvert</option>
                    <option value="crash">💥 Crash</option>
                    <option value="ride">🎯 Ride</option>
                    <option value="splash">✨ Splash</option>
                    <option value="tom-high">🥁 Tom Haut</option>
                    <option value="tom-mid">🪘 Tom Moyen</option>
                    <option value="tom-low">🛢️ Tom Bas</option>
                    <option value="tom-floor">🗂️ Tom de Sol</option>
                </select>
                <div class="track-controls">
                    <button class="track-btn track-mute" title="Mute">🔇</button>
                    <button class="track-btn track-solo" title="Solo">🎯</button>
                    <button class="track-btn track-clone" title="Cloner">⧉</button>
                    <button class="track-btn track-edit" title="Éditer">✎</button>
                    <button class="track-btn track-delete" title="Supprimer">🗑️</button>
                </div>
            </div>
        `;
        
        tracksList.appendChild(trackElement);
        console.log(`Nouvelle piste ajoutée: ${newTrackId}`);
        
        // Configure les événements uniquement pour la nouvelle piste
        setupNewTrackControls(trackElement);
        
        // Régénère la grille avec la nouvelle piste
        generatePatternGrid();
        
        // RESTAURER L'ÉTAT DU PATTERN APRÈS LA RÉGÉNÉRATION
        restorePatternState(currentPattern, currentNoteValue);
        
        // Applique les couleurs aux pistes (incluant la nouvelle)
        assignTrackColors();
        
        // Scroll automatique vers la nouvelle piste
        scrollToNewTrack(trackElement);
    }
    
    function setupNewTrackControls(trackElement) {
        // Configure uniquement les événements pour la nouvelle piste
        
        // Volume
        const volumeSlider = trackElement.querySelector('.track-volume-slider');
        const volumeDisplay = trackElement.querySelector('.track-volume-display');
        if (volumeSlider && volumeDisplay) {
            volumeSlider.addEventListener('input', () => {
                volumeDisplay.textContent = volumeSlider.value + '%';
            });
        }
        
        // Drum selector
        const drumSelector = trackElement.querySelector('.track-drum-selector');
        if (drumSelector) {
            drumSelector.addEventListener('change', () => {
                const trackName = trackElement.querySelector('.track-name');
                const selectedOption = drumSelector.options[drumSelector.selectedIndex];
                trackName.textContent = selectedOption.text.split(' ')[1];
                console.log(`Instrument changé: ${selectedOption.text}`);
                updateTrackColors(drumSelector);
            });
        }
        
        // Boutons de contrôle
        const muteBtn = trackElement.querySelector('.track-mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                const soloBtn = trackElement.querySelector('.track-solo');
                muteBtn.classList.toggle('active');
                const isMuted = muteBtn.classList.contains('active');
                
                if (isMuted && soloBtn.classList.contains('active')) {
                    soloBtn.classList.remove('active');
                }
                
                const trackName = trackElement.querySelector('.track-name').textContent;
                console.log(`Piste "${trackName}" ${isMuted ? 'mute' : 'unmute'}`);
            });
        }
        
        const soloBtn = trackElement.querySelector('.track-solo');
        if (soloBtn) {
            soloBtn.addEventListener('click', () => {
                const muteBtn = trackElement.querySelector('.track-mute');
                soloBtn.classList.toggle('active');
                const isSolo = soloBtn.classList.contains('active');
                
                if (isSolo && muteBtn.classList.contains('active')) {
                    muteBtn.classList.remove('active');
                }
                
                const trackName = trackElement.querySelector('.track-name').textContent;
                console.log(`Piste "${trackName}" ${isSolo ? 'solo' : 'unsolo'}`);
            });
        }
        
        const cloneBtn = trackElement.querySelector('.track-clone');
        if (cloneBtn) {
            cloneBtn.addEventListener('click', () => {
                cloneTrack(trackElement);
            });
        }
        
        const editBtn = trackElement.querySelector('.track-edit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editTrack(trackElement);
            });
        }
        
        const deleteBtn = trackElement.querySelector('.track-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deleteTrack(trackElement);
            });
        }
    }
    
    function scrollToNewTrack(trackElement) {
        // Scroll automatique vers la nouvelle piste dans la liste des pistes
        const tracksList = document.getElementById('tracks-list');
        if (tracksList) {
            // Attendre que le DOM soit mis à jour
            setTimeout(() => {
                trackElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }
    
    function cloneTrack(track) {
        const tracksList = document.getElementById('tracks-list');
        const trackId = track.dataset.trackId;
        
        // Trouver l'index de la piste à cloner
        const tracks = Array.from(document.querySelectorAll('.track'));
        const sourceTrackIndex = tracks.findIndex(t => t === track);
        
        if (sourceTrackIndex === -1) {
            console.error('Piste source non trouvée pour le clonage');
            return;
        }
        
        // SAUVEGARDER TOUT LE PATTERN ACTUEL avant de régénérer la grille
        const currentPattern = captureCurrentPattern();
        
        // Capturer spécifiquement les notes de la piste à cloner pour la duplication
        const sourceTrackNotes = [];
        const gridRows = document.querySelectorAll('.grid-row');
        const sourceRow = gridRows[sourceTrackIndex];
        
        if (sourceRow) {
            const activeCells = sourceRow.querySelectorAll('.grid-cell.active');
            activeCells.forEach(cell => {
                const position = parseInt(cell.dataset.position);
                const noteData = {
                    position: position,
                    modifiers: {
                        accent: cell.classList.contains('accent'),
                        ghost: cell.classList.contains('ghost'),
                        flam: cell.classList.contains('flam'),
                        swing: cell.classList.contains('swing'),
                        triplet: cell.classList.contains('triplet'),
                        tied: cell.classList.contains('tied')
                    },
                    drumColors: Array.from(cell.classList).filter(cls => cls.startsWith('drum-'))
                };
                sourceTrackNotes.push(noteData);
            });
        }
        
        // Créer la nouvelle piste
        const newTrackId = 'track-' + Date.now(); // ID unique basé sur timestamp
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.dataset.trackId = newTrackId;
        
        // Copier les paramètres de la piste originale
        const originalDrum = track.querySelector('.track-drum-selector').value;
        const originalVolume = track.querySelector('.track-volume-slider').value;
        const originalName = track.querySelector('.track-name').textContent;
        
        trackElement.innerHTML = `
            <div class="track-header">
                <div class="track-volume">
                    <input type="range" class="track-volume-slider" min="0" max="100" value="${originalVolume}">
                    <span class="track-volume-display">${originalVolume}%</span>
                </div>
                <span class="track-name">${originalName} (Copie)</span>
                <select class="track-drum-selector">
                    <option value="kick" ${originalDrum === 'kick' ? 'selected' : ''}>🥁 Grosse Caisse</option>
                    <option value="snare" ${originalDrum === 'snare' ? 'selected' : ''}>⚡ Caisse Claire</option>
                    <option value="hihat-closed" ${originalDrum === 'hihat-closed' ? 'selected' : ''}>🔒 Hi-Hat Fermé</option>
                    <option value="hihat-open" ${originalDrum === 'hihat-open' ? 'selected' : ''}>🔓 Hi-Hat Ouvert</option>
                    <option value="crash" ${originalDrum === 'crash' ? 'selected' : ''}>💥 Crash</option>
                    <option value="ride" ${originalDrum === 'ride' ? 'selected' : ''}>🎯 Ride</option>
                    <option value="splash" ${originalDrum === 'splash' ? 'selected' : ''}>✨ Splash</option>
                    <option value="tom-high" ${originalDrum === 'tom-high' ? 'selected' : ''}>🥁 Tom Haut</option>
                    <option value="tom-mid" ${originalDrum === 'tom-mid' ? 'selected' : ''}>🪘 Tom Moyen</option>
                    <option value="tom-low" ${originalDrum === 'tom-low' ? 'selected' : ''}>🛢️ Tom Bas</option>
                    <option value="tom-floor" ${originalDrum === 'tom-floor' ? 'selected' : ''}>🗂️ Tom de Sol</option>
                </select>
                <div class="track-controls">
                    <button class="track-btn track-mute" title="Mute">🔇</button>
                    <button class="track-btn track-solo" title="Solo">🎯</button>
                    <button class="track-btn track-clone" title="Cloner">⧉</button>
                    <button class="track-btn track-edit" title="Éditer">✎</button>
                    <button class="track-btn track-delete" title="Supprimer">🗑️</button>
                </div>
            </div>
        `;
        
        // Ajouter la nouvelle piste
        tracksList.appendChild(trackElement);
        
        // Régénérer la grille pour inclure la nouvelle piste
        generatePatternGrid();
        
        // Restaurer tout le pattern existant + ajouter les notes clonées sur la nouvelle piste
        setTimeout(() => {
            // 1. D'abord restaurer toutes les pistes existantes
            restorePatternState(currentPattern, currentNoteValue);
            
            // 2. Ensuite ajouter les notes clonées sur la nouvelle piste (dernière ligne)
            const newGridRows = document.querySelectorAll('.grid-row');
            const newTrackRow = newGridRows[newGridRows.length - 1]; // Dernière ligne = nouvelle piste
            
            if (newTrackRow) {
                sourceTrackNotes.forEach(noteData => {
                    const cells = newTrackRow.querySelectorAll('.grid-cell');
                    const targetCell = cells[noteData.position];
                    
                    if (targetCell) {
                        targetCell.classList.add('active');
                        
                        // Restaurer les modificateurs
                        Object.keys(noteData.modifiers).forEach(modifier => {
                            if (noteData.modifiers[modifier]) {
                                targetCell.classList.add(modifier);
                            }
                        });
                        
                        // Restaurer les couleurs de batterie
                        noteData.drumColors.forEach(colorClass => {
                            targetCell.classList.add(colorClass);
                        });
                        
                        // Ajouter la couleur de batterie appropriée
                        addDrumColor(targetCell, originalDrum);
                    }
                });
            }
        }, 100);
        
        // Reconfigurer les événements uniquement pour la nouvelle piste
        const newTrackElement = tracksList.lastElementChild;
        if (newTrackElement) {
            setupNewTrackControls(newTrackElement);
            scrollToNewTrack(newTrackElement);
        }
        
        // Applique les couleurs après le clonage
        assignTrackColors();
        
        console.log(`Piste "${originalName}" clonée vers "${newTrackId}" avec ${sourceTrackNotes.length} notes`);
    }
    
    function editTrack(track) {
        const trackName = track.querySelector('.track-name');
        const currentName = trackName.textContent;
        
        // Remplacer le nom par un input temporaire
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'track-name-edit';
        input.style.width = '100px';
        input.style.fontSize = '12px';
        
        trackName.style.display = 'none';
        trackName.parentNode.insertBefore(input, trackName);
        input.focus();
        input.select();
        
        function saveEdit() {
            const newName = input.value.trim() || currentName;
            trackName.textContent = newName;
            trackName.style.display = '';
            input.remove();
            console.log(`Piste renommée: ${currentName} → ${newName}`);
        }
        
        // Sauvegarder sur Enter ou perte de focus
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                trackName.style.display = '';
                input.remove();
            }
        });
        
        input.addEventListener('blur', saveEdit);
    }
    
    function deleteTrack(track) {
        const trackName = track.querySelector('.track-name').textContent;
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer la piste "${trackName}" ?`)) {
            const tracksList = document.getElementById('tracks-list');
            
            // Vérifier qu'il reste au moins une piste
            if (tracksList.children.length <= 1) {
                alert('Impossible de supprimer la dernière piste. Il faut au moins une piste.');
                return;
            }
            
            // Sauvegarder l'état actuel
            const currentPattern = captureCurrentPattern();
            
            // Supprimer la piste
            track.remove();
            
            // Régénérer la grille
            generatePatternGrid();
            
            // Restaurer l'état (les notes de la piste supprimée seront automatiquement perdues)
            restorePatternState(currentPattern, currentNoteValue);
            
            // Réapplique les couleurs après suppression
            assignTrackColors();
            
            console.log(`Piste "${trackName}" supprimée`);
        }
    }
    
    function setupModals() {
        // Modal paramètres
        const settingsBtn = document.getElementById('settings');
        const settingsModal = document.getElementById('settings-modal');
        const closeButtons = document.querySelectorAll('.modal-close');
        
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
        
        // Modal tutoriel
        const tutorialBtn = document.getElementById('tutorial');
        const tutorialModal = document.getElementById('tutorial-modal');
        
        tutorialBtn.addEventListener('click', () => {
            tutorialModal.classList.remove('hidden');
            startTutorial();
        });
        
        // Fermeture des modales
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });
        
        // Fermeture en cliquant à l'extérieur
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }
    
    function startTutorial() {
        let currentStep = 1;
        const totalSteps = 7;
        
        function showStep(step) {
            // Cache toutes les étapes
            document.querySelectorAll('.tutorial-step').forEach(s => s.classList.add('hidden'));
            
            // Affiche l'étape actuelle
            document.getElementById(`tutorial-step-${step}`).classList.remove('hidden');
            
            // Met à jour l'indicateur
            document.getElementById('tutorial-step-indicator').textContent = `Étape ${step} / ${totalSteps}`;
            
            // Met à jour la barre de progression
            const progressFill = document.getElementById('tutorial-progress-fill');
            progressFill.style.width = `${(step / totalSteps) * 100}%`;
            
            // Gestion des boutons
            document.getElementById('tutorial-prev').disabled = step === 1;
            document.getElementById('tutorial-next').style.display = step === totalSteps ? 'none' : 'inline-block';
            document.getElementById('tutorial-finish').style.display = step === totalSteps ? 'inline-block' : 'none';
        }
        
        // Boutons de navigation
        document.getElementById('tutorial-next').addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        });
        
        document.getElementById('tutorial-prev').addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
        
        document.getElementById('tutorial-finish').addEventListener('click', () => {
            document.getElementById('tutorial-modal').classList.add('hidden');
        });
        
        document.getElementById('tutorial-skip').addEventListener('click', () => {
            document.getElementById('tutorial-modal').classList.add('hidden');
        });
        
        // Affiche la première étape
        showStep(1);
    }
    
    // Gestion des blocs - utilise le système complet
    document.getElementById('add-block').addEventListener('click', () => {
        // Utilise la fonction saveCurrentPatternAsBlock qui gère tout correctement
        saveCurrentPatternAsBlock();
    });
    
    function updateTrackColors(selector) {
        // Trouve l'index de la piste
        const track = selector.closest('.track');
        const trackIndex = Array.from(document.querySelectorAll('.track')).indexOf(track);
        const newDrumType = selector.value;
        
        // Met à jour toutes les cellules actives de cette piste
        const gridRows = document.querySelectorAll('.grid-row');
        if (gridRows[trackIndex]) {
            const cells = gridRows[trackIndex].querySelectorAll('.grid-cell.active');
            cells.forEach(cell => {
                addDrumColor(cell, newDrumType);
            });
        }
    }
    
    // Système audio avec Web Audio API
    function initializeAudio() {
        try {
            // Crée le contexte audio (nécessite une interaction utilisateur)
            document.addEventListener('click', function initAudio() {
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    console.log('Contexte audio initialisé');
                }
                document.removeEventListener('click', initAudio);
            }, { once: true });
            
        } catch (error) {
            console.warn('Web Audio API non supportée:', error);
        }
    }
    
    function createDrumSound(type, frequency, duration = 0.2) {
        if (!audioContext) return;
        
        // Vérifie si on a un son personnalisé pour cet élément
        if (customSounds[type]) {
            playCustomSound(type);
            return;
        }
        
        const gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        
        // Récupère les paramètres du preset actuel
        const preset = drumKitPresets[currentDrumKit] || drumKitPresets['default'];
        const params = preset[type];
        
        if (!params) {
            console.warn(`Paramètres non trouvés pour ${type} dans le preset ${currentDrumKit}`);
            createGenericDrumSound(gainNode, frequency || 440);
            return;
        }
        
        switch (type) {
            case 'kick':
                createKickSoundWithParams(gainNode, params);
                break;
            case 'snare':
                createSnareSoundWithParams(gainNode, params);
                break;
            case 'hihat-closed':
                createHiHatSoundWithParams(gainNode, params, true);
                break;
            case 'hihat-open':
                createHiHatSoundWithParams(gainNode, params, false);
                break;
            case 'crash':
            case 'ride':
            case 'splash':
                createCymbalSoundWithParams(gainNode, params);
                break;
            case 'tom-high':
            case 'tom-mid':
            case 'tom-low':
            case 'tom-floor':
                createTomSoundWithParams(gainNode, params);
                break;
            default:
                createGenericDrumSound(gainNode, frequency || 440);
        }
    }
    
    
    function createKickSound(gainNode) {
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.1);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(100, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    function createSnareSound(gainNode) {
        // Composant de bruit
        const bufferSize = audioContext.sampleRate * 0.2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        
        const noiseFilter = audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1000, audioContext.currentTime);
        
        // Composant tonal
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        
        const oscGain = audioContext.createGain();
        oscGain.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(gainNode);
        oscillator.connect(oscGain);
        oscGain.connect(gainNode);
        
        noiseSource.start();
        oscillator.start();
        noiseSource.stop(audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    function createHiHatSound(gainNode, duration, isClosed) {
        const bufferSize = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(isClosed ? 8000 : 5000, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(isClosed ? 0.3 : 0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.connect(filter);
        filter.connect(gainNode);
        
        source.start();
        source.stop(audioContext.currentTime + duration);
    }
    
    function createCymbalSound(gainNode, baseFreq, duration) {
        const bufferSize = audioContext.sampleRate * duration;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
        filter.Q.setValueAtTime(1, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        source.connect(filter);
        filter.connect(gainNode);
        
        source.start();
        source.stop(audioContext.currentTime + duration);
    }
    
    function createTomSound(gainNode, frequency) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.connect(gainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
    }
    
    function createGenericDrumSound(gainNode, frequency) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    // Nouvelles fonctions avec paramètres des presets
    function createKickSoundWithParams(gainNode, params) {
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(params.freq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(params.freq * 0.5, audioContext.currentTime + 0.1);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(params.freq * 1.5, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(params.gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + params.decay);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + params.decay);
    }
    
    function createSnareSoundWithParams(gainNode, params) {
        // Composant de bruit
        const bufferSize = audioContext.sampleRate * params.decay;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        
        const noiseFilter = audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(params.noiseFreq, audioContext.currentTime);
        
        // Composant tonal
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(params.tonalFreq, audioContext.currentTime);
        
        const oscGain = audioContext.createGain();
        oscGain.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(params.gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + params.decay);
        
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(gainNode);
        oscillator.connect(oscGain);
        oscGain.connect(gainNode);
        
        noiseSource.start();
        oscillator.start();
        noiseSource.stop(audioContext.currentTime + params.decay);
        oscillator.stop(audioContext.currentTime + params.decay);
    }
    
    function createHiHatSoundWithParams(gainNode, params, isClosed) {
        const bufferSize = audioContext.sampleRate * params.decay;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(params.freq, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(params.gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + params.decay);
        
        source.connect(filter);
        filter.connect(gainNode);
        
        source.start();
        source.stop(audioContext.currentTime + params.decay);
    }
    
    function createCymbalSoundWithParams(gainNode, params) {
        const bufferSize = audioContext.sampleRate * params.decay;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(params.freq, audioContext.currentTime);
        filter.Q.setValueAtTime(1, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(params.gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + params.decay);
        
        source.connect(filter);
        filter.connect(gainNode);
        
        source.start();
        source.stop(audioContext.currentTime + params.decay);
    }
    
    function createTomSoundWithParams(gainNode, params) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(params.freq, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(params.freq * 0.5, audioContext.currentTime + params.decay * 0.7);
        
        gainNode.gain.setValueAtTime(params.gain, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + params.decay);
        
        oscillator.connect(gainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + params.decay);
    }
    
    function playCustomSound(type) {
        const audio = customSounds[type];
        if (audio) {
            const clone = audio.cloneNode();
            // Applique le volume master et les réglages spécifiques
            const masterVolume = document.getElementById('volume').value / 100;
            const elementVolume = document.getElementById('drum-element-volume').value / 100;
            clone.volume = masterVolume * elementVolume * 0.8;
            clone.currentTime = 0; // Remet à zéro pour éviter les décalages
            clone.play().catch(e => console.warn(`Erreur lecture son personnalisé ${type}:`, e));
        }
    }
    
    function playCustomSoundWithModifiers(type, volumeMultiplier = 1, isFlam = false, shouldPlayFlam = false) {
        const audio = customSounds[type];
        if (!audio) return;
        
        // Applique le volume master et les réglages spécifiques avec modificateurs
        const masterVolume = document.getElementById('volume').value / 100;
        const elementVolume = document.getElementById('drum-element-volume').value / 100;
        const finalVolume = masterVolume * elementVolume * 0.8 * volumeMultiplier;
        
        if (shouldPlayFlam) {
            // Première frappe (grace note) - plus douce et légèrement avant
            setTimeout(() => {
                const clone1 = audio.cloneNode();
                clone1.volume = finalVolume * 0.5; // Plus doux pour le flam
                clone1.currentTime = 0;
                clone1.play().catch(e => console.warn(`Erreur flam 1 ${type}:`, e));
            }, 0);
            
            // Deuxième frappe (note principale) - légèrement après
            setTimeout(() => {
                const clone2 = audio.cloneNode();
                clone2.volume = finalVolume * 0.8;
                clone2.currentTime = 0;
                clone2.play().catch(e => console.warn(`Erreur flam 2 ${type}:`, e));
            }, 30); // 30ms de décalage pour le flam
        } else {
            // Son normal avec modificateurs
            const clone = audio.cloneNode();
            clone.volume = finalVolume;
            clone.currentTime = 0;
            clone.play().catch(e => console.warn(`Erreur lecture modifiée ${type}:`, e));
        }
    }
    
    function shouldPlayTrack(track) {
        if (!track) return true; // Si pas de piste spécifiée, joue le son
        
        const tracks = document.querySelectorAll('.track');
        const muteButton = track.querySelector('.track-mute');
        const soloButton = track.querySelector('.track-solo');
        
        // Si la piste est en mute, ne joue pas
        if (muteButton && muteButton.classList.contains('active')) {
            return false;
        }
        
        // Vérifie s'il y a des pistes en solo
        const hasSoloTracks = Array.from(tracks).some(t => {
            const soloBtn = t.querySelector('.track-solo');
            return soloBtn && soloBtn.classList.contains('active');
        });
        
        // Si il y a des pistes en solo, ne joue que si cette piste est en solo
        if (hasSoloTracks) {
            return soloButton && soloButton.classList.contains('active');
        }
        
        // Sinon, joue normalement
        return true;
    }
    
    function playDrumSound(drumType, track = null) {
        if (!audioContext) {
            console.warn('Contexte audio non initialisé');
            return;
        }
        
        // Vérifie l'état mute/solo des pistes
        if (!shouldPlayTrack(track)) {
            return; // Ne joue pas le son si la piste est mute ou si d'autres sont en solo
        }
        
        try {
            createDrumSound(drumType);
        } catch (error) {
            console.error('Erreur lors de la lecture du son:', error);
        }
    }
    
    function playDrumSoundWithModifiers(drumType, cell, track = null) {
        if (!audioContext) {
            console.warn('Contexte audio non initialisé');
            return;
        }
        
        // Vérifie l'état mute/solo des pistes
        if (!shouldPlayTrack(track)) {
            return; // Ne joue pas le son si la piste est mute ou si d'autres sont en solo
        }
        
        // Récupère les modificateurs de la cellule
        const isAccent = cell.classList.contains('accent');
        const isGhost = cell.classList.contains('ghost');
        const isFlam = cell.classList.contains('flam');
        const isSwing = cell.classList.contains('swing');
        const isTriplet = cell.classList.contains('triplet');
        const isTied = cell.classList.contains('tied');
        
        // Calcule les paramètres modifiés
        let volumeMultiplier = 1;
        let decayMultiplier = 1;
        let pitchModifier = 0;
        let shouldPlayFlam = false;
        
        // Ajustements selon les modificateurs
        if (isAccent) {
            // Accent : son plus fort et plus percutant
            volumeMultiplier = 1.5;
            decayMultiplier = 0.9; // Légèrement plus court mais plus punchy
        } 
        
        if (isGhost) {
            // Ghost note : son très doux
            volumeMultiplier = 0.3;
            decayMultiplier = 0.8;
        }
        
        if (isFlam) {
            // Flam : double frappe rapide
            shouldPlayFlam = true;
            volumeMultiplier = 0.9; // Légèrement plus doux car double son
        }
        
        if (isSwing) {
            // Swing : léger décalage temporel (sera géré par timing)
            // Pour l'instant, on change juste le timbre
            pitchModifier = 20; // Légèrement plus aigu
            volumeMultiplier *= 0.95;
        }
        
        if (isTriplet) {
            // Triolet : légèrement plus aigu et plus court
            pitchModifier += 30; // +30 cents
            decayMultiplier *= 0.85;
            volumeMultiplier *= 0.95;
        }
        
        if (isTied) {
            // Note liée : son plus doux et plus long
            decayMultiplier *= 1.3;
            volumeMultiplier *= 0.8;
        }
        
        try {
            // Vérifie d'abord si on a un son personnalisé pour cet élément
            if (customSounds[drumType]) {
                // Utilise le son personnalisé avec modificateurs
                playCustomSoundWithModifiers(drumType, volumeMultiplier, isFlam, shouldPlayFlam);
                return;
            }
            
            // Sinon, utilise les sons générés avec modificateurs
            console.log(`Son ${drumType} avec modificateurs:`, {
                volume: volumeMultiplier,
                decay: decayMultiplier,
                pitch: pitchModifier,
                accent: isAccent,
                ghost: isGhost,
                flam: isFlam,
                swing: isSwing,
                triplet: isTriplet,
                tied: isTied
            });
            
            // Gestion du flam (double frappe)
            if (shouldPlayFlam) {
                // Première frappe (grace note) - plus douce et légèrement avant
                setTimeout(() => {
                    const flamGainNode1 = audioContext.createGain();
                    flamGainNode1.connect(audioContext.destination);
                    flamGainNode1.gain.value = 0.2 * volumeMultiplier; // Plus doux
                    
                    // Utilise le système existant pour la première frappe
                    switch (drumType) {
                        case 'kick': createKickSound(flamGainNode1); break;
                        case 'snare': createSnareSound(flamGainNode1); break;
                        case 'hihat-closed': createHiHatSound(flamGainNode1, 0.05, true); break;
                        case 'hihat-open': createHiHatSound(flamGainNode1, 0.15, false); break;
                        case 'crash': createCymbalSound(flamGainNode1, 1200, 0.4); break;
                        case 'ride': createCymbalSound(flamGainNode1, 800, 0.2); break;
                        case 'splash': createCymbalSound(flamGainNode1, 1500, 0.15); break;
                        case 'tom-high': createTomSound(flamGainNode1, 300); break;
                        case 'tom-mid': createTomSound(flamGainNode1, 200); break;
                        case 'tom-low': createTomSound(flamGainNode1, 150); break;
                        case 'tom-floor': createTomSound(flamGainNode1, 100); break;
                        default: createGenericDrumSound(flamGainNode1, 440);
                    }
                }, 0);
                
                // Deuxième frappe (note principale) - légèrement après
                setTimeout(() => {
                    const flamGainNode2 = audioContext.createGain();
                    flamGainNode2.connect(audioContext.destination);
                    flamGainNode2.gain.value = 0.25 * volumeMultiplier; // Normal
                    
                    // Utilise le système existant pour la deuxième frappe
                    switch (drumType) {
                        case 'kick': createKickSound(flamGainNode2); break;
                        case 'snare': createSnareSound(flamGainNode2); break;
                        case 'hihat-closed': createHiHatSound(flamGainNode2, 0.1 * decayMultiplier, true); break;
                        case 'hihat-open': createHiHatSound(flamGainNode2, 0.3 * decayMultiplier, false); break;
                        case 'crash': createCymbalSound(flamGainNode2, 1200, 0.8 * decayMultiplier); break;
                        case 'ride': createCymbalSound(flamGainNode2, 800, 0.4 * decayMultiplier); break;
                        case 'splash': createCymbalSound(flamGainNode2, 1500, 0.3 * decayMultiplier); break;
                        case 'tom-high': createTomSound(flamGainNode2, 300); break;
                        case 'tom-mid': createTomSound(flamGainNode2, 200); break;
                        case 'tom-low': createTomSound(flamGainNode2, 150); break;
                        case 'tom-floor': createTomSound(flamGainNode2, 100); break;
                        default: createGenericDrumSound(flamGainNode2, 440);
                    }
                }, 30); // 30ms de décalage
                
            } else {
                // Son normal avec volume ajusté
                const gainNode = audioContext.createGain();
                gainNode.connect(audioContext.destination);
                gainNode.gain.value = 0.3 * volumeMultiplier;
                
                // Simule la création du son avec les modificateurs appliqués
                switch (drumType) {
                case 'kick':
                    createKickSound(gainNode);
                    break;
                case 'snare':
                    createSnareSound(gainNode);
                    break;
                case 'hihat-closed':
                    createHiHatSound(gainNode, 0.1 * decayMultiplier, true);
                    break;
                case 'hihat-open':
                    createHiHatSound(gainNode, 0.3 * decayMultiplier, false);
                    break;
                case 'crash':
                    createCymbalSound(gainNode, 1200, 0.8 * decayMultiplier);
                    break;
                case 'ride':
                    createCymbalSound(gainNode, 800, 0.4 * decayMultiplier);
                    break;
                case 'splash':
                    createCymbalSound(gainNode, 1500, 0.3 * decayMultiplier);
                    break;
                case 'tom-high':
                    createTomSound(gainNode, 300);
                    break;
                case 'tom-mid':
                    createTomSound(gainNode, 200);
                    break;
                case 'tom-low':
                    createTomSound(gainNode, 150);
                    break;
                case 'tom-floor':
                    createTomSound(gainNode, 100);
                    break;
                default:
                    createGenericDrumSound(gainNode, 440);
                }
            }
            
        } catch (error) {
            console.error('Erreur lors de la lecture du son modifié:', error);
            // Fallback sur le son normal
            createDrumSound(drumType);
        }
    }
    
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Évite les conflits avec les champs de saisie
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                return;
            }
            
            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey;
            const shift = event.shiftKey;
            
            switch (key) {
                case ' ':
                    // Espace : Play/Pause
                    event.preventDefault();
                    if (isPlaying) {
                        pausePlayback();
                    } else {
                        startPlayback();
                    }
                    break;
                    
                case '1':
                    // Chiffre 1 : Toggle Accent
                    event.preventDefault();
                    toggleModifier('accent');
                    break;
                    
                case '2':
                    // Chiffre 2 : Toggle Ghost
                    event.preventDefault();
                    toggleModifier('ghost');
                    break;
                    
                case '3':
                    // Chiffre 3 : Toggle Flam
                    event.preventDefault();
                    toggleModifier('flam');
                    break;
                    
                case '4':
                    // Chiffre 4 : Toggle Swing
                    event.preventDefault();
                    toggleModifier('swing');
                    break;
                    
                case '5':
                    // Chiffre 5 : Toggle Triplet
                    event.preventDefault();
                    toggleModifier('triplet');
                    break;
                    
                case '6':
                    // Chiffre 6 : Toggle Tied
                    event.preventDefault();
                    toggleModifier('tied');
                    break;
                    
                case 'arrowleft':
                    // Flèche gauche : Position précédente
                    event.preventDefault();
                    navigateTime('prev');
                    break;
                    
                case 'arrowright':
                    // Flèche droite : Position suivante
                    event.preventDefault();
                    navigateTime('next');
                    break;
                    
                case 'arrowup':
                    // Flèche haut : Première position
                    event.preventDefault();
                    navigateTime('first');
                    break;
                    
                case 'arrowdown':
                    // Flèche bas : Dernière position
                    event.preventDefault();
                    navigateTime('last');
                    break;
                    
                case 'delete':
                case 'backspace':
                    // Suppr/Backspace : Effacer notes à la position actuelle
                    event.preventDefault();
                    deleteNotesAtCurrentPosition();
                    break;
                    
                case 'a':
                    if (ctrl) {
                        // Ctrl+A : Sélectionner toute la colonne actuelle
                        event.preventDefault();
                        selectCurrentColumn();
                    }
                    break;
                    
                case 'escape':
                    // Echap : Désactiver tous les modificateurs
                    event.preventDefault();
                    clearAllModifiers();
                    break;
                    
                case 'z':
                    if (ctrl) {
                        // Ctrl+Z : Undo
                        event.preventDefault();
                        undoLastAction();
                    }
                    break;
                    
                case 'y':
                    if (ctrl) {
                        // Ctrl+Y : Redo
                        event.preventDefault();
                        redoLastAction();
                    }
                    break;
            }
        });
        
        console.log('Raccourcis clavier activés:');
        console.log('Espace: Play/Pause | 1-6: Modificateurs | Flèches: Navigation | Suppr: Effacer | Ctrl+A: Sélectionner colonne | Echap: Désactiver modificateurs');
    }
    
    function toggleModifier(modifierName) {
        const checkbox = document.getElementById(modifierName);
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
            
            // Feedback visuel
            const label = checkbox.closest('label');
            if (label) {
                label.style.background = checkbox.checked ? 'rgba(255, 215, 0, 0.2)' : '';
                setTimeout(() => {
                    if (label.style.background) {
                        label.style.background = '';
                    }
                }, 200);
            }
        }
    }
    
    function deleteNotesAtCurrentPosition() {
        // Supprime toutes les notes actives à la position actuelle du time-indicator
        const cellsAtPosition = document.querySelectorAll(`[data-position="${currentTimePosition}"].active`);
        
        if (cellsAtPosition.length > 0) {
            cellsAtPosition.forEach(cell => {
                cell.classList.remove('active');
                removeAllDrumColors(cell);
                removeAllModifiers(cell);
            });
            
            console.log(`${cellsAtPosition.length} note(s) supprimée(s) à la position ${currentTimePosition + 1}`);
        } else {
            console.log(`Aucune note à supprimer à la position ${currentTimePosition + 1}`);
        }
    }
    
    function selectCurrentColumn() {
        // Sélectionne visuellement toute la colonne actuelle
        // Retire la sélection précédente
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Ajoute la sélection à toute la colonne actuelle
        const columnCells = document.querySelectorAll(`[data-position="${currentTimePosition}"]`);
        columnCells.forEach(cell => {
            cell.classList.add('selected');
        });
        
        console.log(`Colonne ${currentTimePosition + 1} sélectionnée (${columnCells.length} cellules)`);
        
        // Retire la sélection après 2 secondes
        setTimeout(() => {
            document.querySelectorAll('.grid-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
        }, 2000);
    }
    
    function clearAllModifiers() {
        // Désactive tous les modificateurs
        ['accent', 'ghost', 'flam', 'swing', 'triplet', 'tied'].forEach(modifier => {
            const checkbox = document.getElementById(modifier);
            if (checkbox && checkbox.checked) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        
        console.log('Tous les modificateurs désactivés');
    }
    
    function applyGrooveTemplate(templateName) {
        // Vide d'abord le pattern actuel (sans confirmation)
        if (isPlaying) {
            stopPlayback();
        }
        
        // Supprime toutes les notes actives de la grille
        document.querySelectorAll('.grid-cell.active').forEach(cell => {
            cell.classList.remove('active');
            removeAllDrumColors(cell);
            removeAllModifiers(cell);
        });
        
        // Définit les templates de grooves
        const templates = {
            'rock-basic': {
                name: 'Rock Basic',
                subdivision: 'quarter', // Noires
                notes: [
                    { track: 0, positions: [0, 8], drum: 'kick' }, // Kick sur 1 et 3
                    { track: 1, positions: [4, 12], drum: 'snare' }, // Snare sur 2 et 4
                    { track: 2, positions: [0, 2, 4, 6, 8, 10, 12, 14], drum: 'hihat-closed' } // Hi-hat 8ème
                ]
            },
            'rock-fill': {
                name: 'Rock Fill',
                subdivision: 'sixteenth', // Double-croches
                notes: [
                    { track: 0, positions: [0], drum: 'kick' },
                    { track: 1, positions: [4, 12], drum: 'snare' },
                    { track: 2, positions: [0, 4, 8, 12], drum: 'hihat-closed' },
                    { track: 3, positions: [13, 14, 15], drum: 'tom-high', modifiers: ['accent'] }
                ]
            },
            'jazz-swing': {
                name: 'Jazz Swing',
                subdivision: 'eighth',
                notes: [
                    { track: 0, positions: [0], drum: 'kick' },
                    { track: 1, positions: [4], drum: 'snare', modifiers: ['ghost'] },
                    { track: 2, positions: [0, 1, 2, 3, 4, 5, 6, 7], drum: 'ride', modifiers: ['swing'] }
                ]
            },
            'jazz-latin': {
                name: 'Jazz Latin',
                subdivision: 'eighth',
                notes: [
                    { track: 0, positions: [0, 4], drum: 'kick' },
                    { track: 1, positions: [2, 6], drum: 'snare', modifiers: ['accent'] },
                    { track: 2, positions: [1, 3, 5, 7], drum: 'hihat-closed' }
                ]
            },
            'funk-classic': {
                name: 'Funk Classic',
                subdivision: 'sixteenth',
                notes: [
                    { track: 0, positions: [0, 6], drum: 'kick' },
                    { track: 1, positions: [4], drum: 'snare', modifiers: ['accent'] },
                    { track: 2, positions: [0, 2, 4, 6, 8, 10, 12, 14], drum: 'hihat-closed' }
                ]
            },
            'funk-ghost': {
                name: 'Funk Ghost',
                subdivision: 'sixteenth',
                notes: [
                    { track: 0, positions: [0], drum: 'kick' },
                    { track: 1, positions: [4], drum: 'snare', modifiers: ['accent'] },
                    { track: 1, positions: [2, 6, 10, 14], drum: 'snare', modifiers: ['ghost'] },
                    { track: 2, positions: [0, 4, 8, 12], drum: 'hihat-closed' }
                ]
            },
            'latin-samba': {
                name: 'Samba',
                subdivision: 'eighth',
                notes: [
                    { track: 0, positions: [0, 3, 6], drum: 'kick' },
                    { track: 1, positions: [2, 4], drum: 'snare', modifiers: ['accent'] },
                    { track: 2, positions: [1, 5, 7], drum: 'hihat-closed' }
                ]
            },
            'latin-bossa': {
                name: 'Bossa Nova',
                subdivision: 'eighth',
                notes: [
                    { track: 0, positions: [0, 4], drum: 'kick' },
                    { track: 1, positions: [2, 6], drum: 'snare', modifiers: ['ghost'] },
                    { track: 2, positions: [0, 1, 2, 3, 4, 5, 6, 7], drum: 'hihat-closed' }
                ]
            },
            'electronic-basic': {
                name: 'Electronic Basic',
                subdivision: 'sixteenth',
                notes: [
                    { track: 0, positions: [0, 4, 8, 12], drum: 'kick', modifiers: ['accent'] },
                    { track: 1, positions: [4, 12], drum: 'snare' },
                    { track: 2, positions: [2, 6, 10, 14], drum: 'hihat-closed' }
                ]
            },
            'electronic-breakbeat': {
                name: 'Breakbeat',
                subdivision: 'sixteenth',
                notes: [
                    { track: 0, positions: [0, 6, 10], drum: 'kick' },
                    { track: 1, positions: [4], drum: 'snare', modifiers: ['accent'] },
                    { track: 1, positions: [12], drum: 'snare' },
                    { track: 2, positions: [2, 8, 14], drum: 'hihat-open' }
                ]
            }
        };
        
        const template = templates[templateName];
        if (!template) {
            console.error(`Template "${templateName}" introuvable`);
            return;
        }
        
        console.log(`Application du template: ${template.name}`);
        
        // Sauvegarde l'état avant application du template
        savePatternState(`Template: ${template.name}`);
        
        // Change la subdivision si nécessaire
        const noteValueSelect = document.getElementById('note-value');
        if (noteValueSelect.value !== template.subdivision) {
            noteValueSelect.value = template.subdivision;
            noteValueSelect.dispatchEvent(new Event('change'));
            
            // Attendre que la grille soit régénérée
            setTimeout(() => {
                applyTemplateNotes(template.notes);
            }, 100);
        } else {
            applyTemplateNotes(template.notes);
        }
    }
    
    function applyTemplateNotes(templateNotes) {
        templateNotes.forEach(noteData => {
            const { track, positions, drum, modifiers = [] } = noteData;
            
            // S'assurer que la piste existe
            const trackElement = document.querySelectorAll('.track')[track];
            if (!trackElement) return;
            
            // Définir le type de drum pour la piste
            const drumSelector = trackElement.querySelector('.track-drum-selector');
            if (drumSelector) {
                drumSelector.value = drum;
            }
            
            // Appliquer les notes aux positions spécifiées
            positions.forEach(position => {
                // Trouver la cellule correspondante
                const gridRows = document.querySelectorAll('.grid-row');
                const row = gridRows[track];
                if (!row) return;
                
                const cell = row.querySelectorAll('.grid-cell')[position];
                if (!cell) return;
                
                // Activer la cellule
                cell.classList.add('active');
                addDrumColor(cell, drum);
                
                // Appliquer les modificateurs
                if (modifiers.length > 0) {
                    // Sauvegarder les modificateurs actuels
                    const originalModifiers = { ...selectedModifiers };
                    
                    // Activer les modificateurs du template
                    modifiers.forEach(modifier => {
                        selectedModifiers[modifier] = true;
                    });
                    
                    // Appliquer à la cellule
                    applySelectedModifiers(cell);
                    
                    // Restaurer les modificateurs originaux
                    selectedModifiers = originalModifiers;
                }
            });
        });
        
        console.log('Template appliqué avec succès');
        
        // Reset la sélection du template
        document.getElementById('groove-template').value = '';
    }
    
    function savePatternState(actionName) {
        // Sauvegarde l'état actuel du pattern dans l'historique
        const currentState = {
            action: actionName,
            timestamp: Date.now(),
            noteValue: document.getElementById('note-value').value,
            pattern: captureCurrentPattern()
        };
        
        // Supprime les états futurs si on est au milieu de l'historique
        if (historyIndex < patternHistory.length - 1) {
            patternHistory = patternHistory.slice(0, historyIndex + 1);
        }
        
        // Ajoute le nouvel état
        patternHistory.push(currentState);
        
        // Limite la taille de l'historique
        if (patternHistory.length > maxHistorySize) {
            patternHistory = patternHistory.slice(-maxHistorySize);
        }
        
        historyIndex = patternHistory.length - 1;
        updateHistoryButtons();
        
        console.log(`État sauvé: ${actionName} (${historyIndex + 1}/${patternHistory.length})`);
    }
    
    function captureCurrentPattern() {
        const pattern = {
            tracks: [],
            notes: []
        };
        
        // Capture l'état des pistes
        const tracks = document.querySelectorAll('.track');
        tracks.forEach((track, trackIndex) => {
            const drumSelector = track.querySelector('.track-drum-selector');
            const volumeSlider = track.querySelector('.track-volume-slider');
            
            pattern.tracks.push({
                drum: drumSelector ? drumSelector.value : 'kick',
                volume: volumeSlider ? parseInt(volumeSlider.value) : 80,
                muted: track.querySelector('.track-mute').classList.contains('active') || false,
                solo: track.querySelector('.track-solo').classList.contains('active') || false
            });
        });
        
        // Capture l'état des notes
        const gridRows = document.querySelectorAll('.grid-row');
        gridRows.forEach((row, trackIndex) => {
            const cells = row.querySelectorAll('.grid-cell.active');
            cells.forEach(cell => {
                const position = parseInt(cell.dataset.position);
                
                // Capture les modificateurs
                const modifiers = [];
                if (cell.classList.contains('accent')) modifiers.push('accent');
                if (cell.classList.contains('ghost')) modifiers.push('ghost');
                if (cell.classList.contains('flam')) modifiers.push('flam');
                if (cell.classList.contains('swing')) modifiers.push('swing');
                if (cell.classList.contains('triplet')) modifiers.push('triplet');
                if (cell.classList.contains('tied')) modifiers.push('tied');
                
                // Capture la couleur (type de drum)
                const drumTypes = ['kick', 'snare', 'hihat-closed', 'hihat-open', 'crash', 'ride', 'splash', 'tom-high', 'tom-mid', 'tom-low', 'tom-floor'];
                let drumType = 'kick';
                for (const type of drumTypes) {
                    if (cell.classList.contains(type)) {
                        drumType = type;
                        break;
                    }
                }
                
                pattern.notes.push({
                    track: trackIndex,
                    position: position,
                    drum: drumType,
                    modifiers: modifiers
                });
            });
        });
        
        return pattern;
    }
    
    function restorePatternState(pattern, noteValue) {
        // Vide le pattern actuel
        document.querySelectorAll('.grid-cell.active').forEach(cell => {
            cell.classList.remove('active');
            removeAllDrumColors(cell);
            removeAllModifiers(cell);
        });
        
        // Restaure la valeur de note si différente
        const noteValueSelect = document.getElementById('note-value');
        if (noteValueSelect.value !== noteValue) {
            noteValueSelect.value = noteValue;
            noteValueSelect.dispatchEvent(new Event('change'));
            
            // Attendre que la grille soit régénérée
            setTimeout(() => {
                applyPatternState(pattern);
            }, 100);
        } else {
            applyPatternState(pattern);
        }
    }
    
    function applyPatternState(pattern) {
        // Restaure l'état des pistes
        const tracks = document.querySelectorAll('.track');
        pattern.tracks.forEach((trackData, trackIndex) => {
            const track = tracks[trackIndex];
            if (!track) return;
            
            const drumSelector = track.querySelector('.track-drum-selector');
            if (drumSelector) drumSelector.value = trackData.drum;
            
            const volumeSlider = track.querySelector('.track-volume-slider');
            if (volumeSlider) volumeSlider.value = trackData.volume;
            
            // TODO: Restaurer mute/solo si nécessaire
        });
        
        // Restaure les notes
        pattern.notes.forEach(noteData => {
            const gridRows = document.querySelectorAll('.grid-row');
            const row = gridRows[noteData.track];
            if (!row) return;
            
            const cell = row.querySelectorAll('.grid-cell')[noteData.position];
            if (!cell) return;
            
            // Active la cellule
            cell.classList.add('active');
            addDrumColor(cell, noteData.drum);
            
            // Applique les modificateurs
            noteData.modifiers.forEach(modifier => {
                cell.classList.add(modifier);
                cell.setAttribute(`data-modifier-${modifier}`, 'true');
            });
        });
    }
    
    function undoLastAction() {
        if (historyIndex > 0) {
            historyIndex--;
            const previousState = patternHistory[historyIndex];
            
            console.log(`Undo: ${previousState.action} (${historyIndex + 1}/${patternHistory.length})`);
            
            restorePatternState(previousState.pattern, previousState.noteValue);
            updateHistoryButtons();
        }
    }
    
    function redoLastAction() {
        if (historyIndex < patternHistory.length - 1) {
            historyIndex++;
            const nextState = patternHistory[historyIndex];
            
            console.log(`Redo: ${nextState.action} (${historyIndex + 1}/${patternHistory.length})`);
            
            restorePatternState(nextState.pattern, nextState.noteValue);
            updateHistoryButtons();
        }
    }
    
    function updateHistoryButtons() {
        const undoBtn = document.getElementById('undo');
        const redoBtn = document.getElementById('redo');
        
        if (undoBtn) {
            undoBtn.disabled = historyIndex <= 0;
        }
        
        if (redoBtn) {
            redoBtn.disabled = historyIndex >= patternHistory.length - 1;
        }
    }
    
    function exportToMIDI() {
        // Crée un fichier MIDI à partir du pattern actuel
        const pattern = captureCurrentPattern();
        const noteValue = document.getElementById('note-value').value;
        
        console.log('Export MIDI démarré...');
        
        // Mapping des drums vers les notes MIDI standard (General MIDI Percussion)
        const drumMidiMap = {
            'kick': 36,          // C2 - Bass Drum 1
            'snare': 38,         // D2 - Snare Drum 1
            'hihat-closed': 42,  // F#2 - Closed Hi-hat
            'hihat-open': 46,    // A#2 - Open Hi-hat
            'crash': 49,         // C#3 - Crash Cymbal 1
            'ride': 51,          // D#3 - Ride Cymbal 1
            'splash': 55,        // G3 - Splash Cymbal
            'tom-high': 48,      // C3 - Hi Mid Tom
            'tom-mid': 47,       // B2 - Low Mid Tom
            'tom-low': 45,       // A2 - Low Tom
            'tom-floor': 41      // F2 - Low Floor Tom
        };
        
        // Calcule la durée de tick basée sur la subdivision
        const ticksPerQuarter = 480; // Standard MIDI
        const subdivisionTicks = {
            'whole': ticksPerQuarter * 4,
            'half': ticksPerQuarter * 2,
            'quarter': ticksPerQuarter,
            'eighth': ticksPerQuarter / 2,
            'sixteenth': ticksPerQuarter / 4,
            'thirtysecond': ticksPerQuarter / 8,
            'sixtyfourth': ticksPerQuarter / 16
        };
        
        const tickDuration = subdivisionTicks[noteValue] || ticksPerQuarter;
        
        // Crée les données MIDI
        const midiData = {
            format: 1,
            division: ticksPerQuarter,
            tracks: [
                // Track 0: Meta track (tempo, etc.)
                {
                    name: 'MusicBox Pattern',
                    events: [
                        { type: 'trackName', text: 'MusicBox Export' },
                        { type: 'setTempo', microsecondsPerBeat: Math.round(60000000 / currentBPM) },
                        { type: 'timeSignature', numerator: 4, denominator: 4, metronome: 24, thirtySeconds: 8 }
                    ]
                },
                // Track 1: Percussion
                {
                    name: 'Drums',
                    events: []
                }
            ]
        };
        
        // Convertit les notes en événements MIDI avec temps absolus temporaires
        const allEvents = [];
        
        pattern.notes.forEach(noteData => {
            const midiNote = drumMidiMap[noteData.drum] || 36;
            const startTick = noteData.position * tickDuration;
            
            // Calcule la vélocité basée sur les modificateurs
            let velocity = 100; // Vélocité par défaut
            
            if (noteData.modifiers.includes('accent')) {
                velocity = 127; // Maximum pour les accents
            } else if (noteData.modifiers.includes('ghost')) {
                velocity = 40;  // Très doux pour les ghost notes
            } else if (noteData.modifiers.includes('flam')) {
                velocity = 90;  // Légèrement moins fort pour les flams
            }
            
            // Gestion spéciale pour les flams (grace note en premier)
            if (noteData.modifiers.includes('flam')) {
                const flamDelay = Math.round(tickDuration / 16); // Petit décalage
                
                // Grace note du flam
                allEvents.push({
                    type: 'noteOn',
                    channel: 9,
                    note: midiNote,
                    velocity: Math.round(velocity * 0.7), // Plus doux
                    absoluteTime: startTick - flamDelay
                });
                
                allEvents.push({
                    type: 'noteOff',
                    channel: 9,
                    note: midiNote,
                    velocity: 0,
                    absoluteTime: startTick - flamDelay + Math.round(tickDuration / 8)
                });
            }
            
            // Note On principale
            allEvents.push({
                type: 'noteOn',
                channel: 9, // Canal 10 (index 9) pour percussion
                note: midiNote,
                velocity: velocity,
                absoluteTime: startTick
            });
            
            // Note Off (durée courte pour percussion)
            let noteDuration = tickDuration / 8; // Durée courte par défaut
            
            if (noteData.modifiers.includes('tied')) {
                noteDuration = tickDuration; // Plus long si lié
            }
            
            allEvents.push({
                type: 'noteOff',
                channel: 9,
                note: midiNote,
                velocity: 0,
                absoluteTime: startTick + Math.round(noteDuration)
            });
        });
        
        // Trie tous les événements par temps absolu
        allEvents.sort((a, b) => a.absoluteTime - b.absoluteTime);
        
        // Convertit les temps absolus en deltaTime relatifs
        let lastTime = 0;
        allEvents.forEach(event => {
            const deltaTime = Math.max(0, event.absoluteTime - lastTime);
            event.deltaTime = deltaTime;
            lastTime = event.absoluteTime;
            delete event.absoluteTime; // Supprime le temps absolu temporaire
        });
        
        // Ajoute les événements à la piste MIDI
        midiData.tracks[1].events = allEvents;
        
        // Ajoute un événement de fin de track - assure un minimum de 4 temps (1 mesure)
        const minLength = ticksPerQuarter * 4; // 4 temps minimum
        const actualLength = pattern.notes.length > 0 
            ? Math.max(...pattern.notes.map(n => (n.position + 1) * tickDuration))
            : 0;
        const totalLength = Math.max(minLength, actualLength);
        
        console.log(`Pattern length: ${actualLength} ticks, Total length: ${totalLength} ticks, Last time: ${lastTime}`);
        
        // Calcule le deltaTime pour la fin de piste (temps depuis le dernier événement)
        const finalDelta = Math.max(0, totalLength - lastTime);
            
        midiData.tracks[1].events.push({
            type: 'endOfTrack',
            deltaTime: finalDelta
        });
        
        // Génère le fichier MIDI binaire
        const midiBuffer = generateMIDIBuffer(midiData);
        
        // Télécharge le fichier
        const blob = new Blob([midiBuffer], { type: 'audio/midi' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `MusicBox_Pattern_${Date.now()}.mid`;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        console.log('Export MIDI terminé !');
    }
    
    function generateMIDIBuffer(midiData) {
        // Génère un buffer MIDI binaire simplifié
        // Cette implémentation est basique et pourrait être améliorée avec une vraie librairie MIDI
        
        const tracks = [];
        
        // En-tête MIDI
        const header = new Uint8Array([
            0x4D, 0x54, 0x68, 0x64, // "MThd"
            0x00, 0x00, 0x00, 0x06, // Longueur de l'en-tête (6 bytes)
            0x00, 0x01,             // Format 1
            0x00, 0x02,             // 2 tracks
            0x01, 0xE0              // Division (480 ticks per quarter note)
        ]);
        
        // Pour simplifier, on crée un MIDI basique avec juste les notes
        const trackData = [];
        
        // Track header
        trackData.push(0x4D, 0x54, 0x72, 0x6B); // "MTrk"
        
        const trackEvents = [];
        
        // Tempo
        trackEvents.push(0x00, 0xFF, 0x51, 0x03);
        const microsecondsPerBeat = Math.round(60000000 / currentBPM);
        trackEvents.push(
            (microsecondsPerBeat >> 16) & 0xFF,
            (microsecondsPerBeat >> 8) & 0xFF,
            microsecondsPerBeat & 0xFF
        );
        
        // Utilise les événements MIDI préparés avec les bons deltaTime
        midiData.tracks[1].events.forEach(event => {
            // Convertit deltaTime en variable length quantity (VLQ)
            const deltaBytes = encodeVariableLengthQuantity(event.deltaTime);
            trackEvents.push(...deltaBytes);
            
            if (event.type === 'noteOn') {
                trackEvents.push(0x99, event.note, event.velocity);
            } else if (event.type === 'noteOff') {
                trackEvents.push(0x89, event.note, event.velocity);
            } else if (event.type === 'endOfTrack') {
                trackEvents.push(0xFF, 0x2F, 0x00);
            }
        });
        
        // Longueur du track
        const trackLength = trackEvents.length;
        trackData.push(
            (trackLength >> 24) & 0xFF,
            (trackLength >> 16) & 0xFF,
            (trackLength >> 8) & 0xFF,
            trackLength & 0xFF
        );
        
        trackData.push(...trackEvents);
        
        // Combine header + track
        const result = new Uint8Array(header.length + trackData.length);
        result.set(header, 0);
        result.set(trackData, header.length);
        
        return result;
    }
    
    // Fonction utilitaire pour encoder les variable length quantities MIDI
    function encodeVariableLengthQuantity(value) {
        const bytes = [];
        let val = value;
        
        // Prend les 7 bits de poids faible et les met en premier
        bytes.unshift(val & 0x7F);
        val >>= 7;
        
        // Tant qu'il reste des bits, continue
        while (val > 0) {
            bytes.unshift((val & 0x7F) | 0x80);
            val >>= 7;
        }
        
        return bytes;
    }
    
    // Fonctions de lecture
    function startPlayback() {
        if (!audioContext) {
            console.warn('Contexte audio non initialisé');
            return;
        }
        
        // Réactive le contexte audio si nécessaire
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Calcule la position de départ basée sur le time-indicator
        const subdivisions = getSubdivisionsForNoteValue(currentNoteValue);
        const totalCells = subdivisions * 4;
        const millisecondsPerCell = totalDuration / totalCells;
        const startPosition = currentTimePosition * millisecondsPerCell;
        
        isPlaying = true;
        playBtn.classList.add('active');
        pauseBtn.classList.remove('active');
        stopBtn.classList.remove('active');
        
        // Démarre à la position du time-indicator
        currentPosition = startPosition;
        playbackStartTime = audioContext.currentTime - (currentPosition / 1000);
        
        // Lance l'intervalle de mise à jour
        playbackInterval = setInterval(updatePlayback, 16); // ~60fps
        
        console.log('Lecture démarrée - Position time-indicator:', currentTimePosition, 'Position ms:', currentPosition, 'Contexte audio état:', audioContext.state);
    }
    
    function pausePlayback() {
        if (!isPlaying) return;
        
        isPlaying = false;
        playBtn.classList.remove('active');
        pauseBtn.classList.add('active');
        
        playbackPauseTime = audioContext.currentTime;
        
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
        
        // Annule aussi les timeouts de composition si nécessaire
        if (compositionTimeout) {
            clearTimeout(compositionTimeout);
            compositionTimeout = null;
        }
        
        // Rétablit le surlignage de navigation manuelle
        highlightCurrentTimePosition();
        
        console.log('Lecture en pause');
    }
    
    function stopPlayback() {
        isPlaying = false;
        playBtn.classList.remove('active');
        pauseBtn.classList.remove('active');
        stopBtn.classList.add('active');
        
        currentPosition = 0;
        
        if (playbackInterval) {
            clearInterval(playbackInterval);
            playbackInterval = null;
        }
        
        // Annule aussi les timeouts de composition si nécessaire
        if (compositionTimeout) {
            clearTimeout(compositionTimeout);
            compositionTimeout = null;
        }
        
        updateTimeDisplays();
        updateProgressBar();
        updateGridCursor();
        
        // Remet le time-indicator au début
        currentTimePosition = 0;
        updateTimeIndicator();
        highlightCurrentTimePosition();
        
        console.log('Lecture arrêtée');
    }
    
    function updatePlayback() {
        if (!isPlaying || !audioContext) return;
        
        // Calcule la position actuelle
        const elapsedTime = (audioContext.currentTime - playbackStartTime) * 1000;
        currentPosition = elapsedTime;
        
        // Vérifie si on a atteint la fin
        if (currentPosition >= totalDuration) {
            if (isLoopMode) {
                // Remet à zéro et continue la lecture en boucle
                currentPosition = 0;
                playbackStartTime = audioContext.currentTime;
                console.log('Boucle - Redémarrage du pattern');
            } else if (isCompositionPlaying) {
                // Si on est en mode composition, laisse le timeout gérer la transition
                currentPosition = totalDuration;
                return;
            } else {
                currentPosition = totalDuration;
                stopPlayback();
                return;
            }
        }
        
        updateProgressBar();
        updateTimeDisplays();
        updateGridCursor();
        playNotesAtCurrentPosition();
    }
    
    function updateProgressBar() {
        const percentage = totalDuration > 0 ? (currentPosition / totalDuration) * 100 : 0;
        progressSlider.value = Math.min(percentage, 100);
    }
    
    function updateTimeDisplays() {
        currentTimeDisplay.textContent = formatTime(currentPosition / 1000);
        totalTimeDisplay.textContent = formatTime(totalDuration / 1000);
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    function calculateTotalDuration() {
        // 4 mesures à 4 temps = 16 temps
        const beatsPerPattern = 16;
        const millisecondsPerBeat = (60 / currentBPM) * 1000;
        totalDuration = beatsPerPattern * millisecondsPerBeat;
    }
    
    function updateGridCursor() {
        // Supprime l'ancien curseur
        document.querySelectorAll('.grid-cell.current').forEach(cell => {
            cell.classList.remove('current');
        });
        
        // Calcule la position actuelle sur la grille
        const subdivisions = getSubdivisionsForNoteValue(currentNoteValue);
        const totalCells = subdivisions * 4; // 4 mesures
        const millisecondsPerCell = totalDuration / totalCells;
        const currentCell = Math.floor(currentPosition / millisecondsPerCell);
        
        // Met à jour la position temporelle pour le time-indicator
        if (isPlaying) {
            currentTimePosition = Math.min(currentCell, totalCells - 1);
            updateTimeIndicator();
            
            // Retire le surlignage de navigation manuelle pendant la lecture
            document.querySelectorAll('.grid-cell.current-time').forEach(cell => {
                cell.classList.remove('current-time');
            });
        }
        
        // Ajoute le curseur à la cellule actuelle
        const gridRows = document.querySelectorAll('.grid-row');
        gridRows.forEach(row => {
            const cells = row.querySelectorAll('.grid-cell');
            if (cells[currentCell]) {
                cells[currentCell].classList.add('current');
            }
        });
    }
    
    function playNotesAtCurrentPosition() {
        // Cette fonction joue les notes qui sont actives à la position actuelle
        const subdivisions = getSubdivisionsForNoteValue(currentNoteValue);
        const totalCells = subdivisions * 4;
        const millisecondsPerCell = totalDuration / totalCells;
        const currentCell = Math.floor(currentPosition / millisecondsPerCell);
        
        // Vérifie si on vient juste d'atteindre cette cellule
        const previousCell = Math.floor((currentPosition - 32) / millisecondsPerCell); // 32ms de tolérance
        if (currentCell !== previousCell && currentCell >= 0 && currentCell < totalCells) {
            
            // Pour chaque piste, vérifie s'il y a une note active à cette position
            const tracks = document.querySelectorAll('.track');
            const gridRows = document.querySelectorAll('.grid-row');
            
            tracks.forEach((track, trackIndex) => {
                const drumType = track.querySelector('.track-drum-selector').value;
                const row = gridRows[trackIndex];
                if (row) {
                    const cell = row.querySelectorAll('.grid-cell')[currentCell];
                    if (cell && cell.classList.contains('active')) {
                        // Animation visuelle de la note jouée
                        cell.classList.add('note-playing');
                        setTimeout(() => cell.classList.remove('note-playing'), 300);
                        
                        // Joue le son en tenant compte des modificateurs et de l'état mute/solo
                        playDrumSoundWithModifiers(drumType, cell, track);
                    }
                }
            });
        }
    }
    
    function toggleLoopMode() {
        isLoopMode = !isLoopMode;
        
        if (isLoopMode) {
            loopBtn.classList.add('loop-active');
            loopBtn.title = "Mode boucle ACTIVÉ - Cliquer pour désactiver";
            console.log('Mode boucle activé');
        } else {
            loopBtn.classList.remove('loop-active');
            loopBtn.title = "Mode boucle DÉSACTIVÉ - Cliquer pour activer";
            console.log('Mode boucle désactivé');
        }
    }
    
    // Fonctions de gestion des blocs
    function saveCurrentPatternAsBlock() {
        const currentPatternData = getCurrentPatternData();
        
        if (!currentPatternData.hasNotes) {
            alert('Aucune note à sauvegarder. Placez des notes sur la grille avant de créer un bloc.');
            return;
        }
        
        blockCounter++;
        const blockName = prompt(`Nom du bloc (par défaut: "Bloc ${blockCounter}"):`) || `Bloc ${blockCounter}`;
        
        // Assigne une couleur au bloc (cycle à travers les couleurs disponibles)
        const colorIndex = (blockCounter - 1) % blockColors.length;
        const blockColor = blockColors[colorIndex];
        
        const newBlock = {
            id: `block-${blockCounter}`,
            name: blockName,
            patternData: currentPatternData,
            createdAt: new Date(),
            noteValue: currentNoteValue,
            bpm: currentBPM,
            color: blockColor
        };
        
        savedBlocks.push(newBlock);
        updateBlocksDisplay();
        
        console.log(`Bloc "${blockName}" sauvegardé avec ${currentPatternData.noteCount} notes`);
        
        // Feedback visuel temporaire
        const saveBtn = document.getElementById('save-as-block');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '✅ Sauvegardé !';
        saveBtn.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.style.backgroundColor = '';
        }, 2000);
    }
    
    function getCurrentPatternData() {
        const patternData = {
            tracks: [],
            noteCount: 0,
            hasNotes: false
        };
        
        const tracks = document.querySelectorAll('.track');
        const gridRows = document.querySelectorAll('.grid-row');
        
        tracks.forEach((track, trackIndex) => {
            const drumType = track.querySelector('.track-drum-selector').value;
            const trackName = track.querySelector('.track-name').textContent;
            const volume = track.querySelector('.track-volume-slider').value;
            const row = gridRows[trackIndex];
            
            const trackData = {
                drumType: drumType,
                trackName: trackName,
                volume: parseInt(volume),
                notes: []
            };
            
            if (row) {
                const cells = row.querySelectorAll('.grid-cell');
                cells.forEach((cell, cellIndex) => {
                    if (cell.classList.contains('active')) {
                        trackData.notes.push({
                            position: cellIndex,
                            drumType: drumType
                        });
                        patternData.noteCount++;
                        patternData.hasNotes = true;
                    }
                });
            }
            
            patternData.tracks.push(trackData);
        });
        
        return patternData;
    }
    
    function updateBlocksDisplay() {
        const blocksContainer = document.getElementById('blocks-container');
        
        // Vide le conteneur mais garde le bouton "Ajouter Bloc"
        const addButton = blocksContainer.querySelector('#add-block');
        blocksContainer.innerHTML = '';
        
        // Ajoute tous les blocs sauvegardés
        savedBlocks.forEach(block => {
            const blockElement = createBlockElement(block);
            blocksContainer.appendChild(blockElement);
        });
        
        // Remet le bouton d'ajout à la fin
        if (addButton) {
            blocksContainer.appendChild(addButton);
        }
    }
    
    function createBlockElement(block) {
        const blockElement = document.createElement('div');
        blockElement.className = 'block';
        blockElement.draggable = true;
        blockElement.dataset.blockId = block.id;
        
        blockElement.innerHTML = `
            <div class="block-header" style="background-color: ${block.color.value};">
                <span class="block-name">${block.name}</span>
                <div class="block-controls">
                    <button class="block-btn clone" title="Cloner ce bloc">⧉</button>
                    <button class="block-btn edit" title="Éditer ce bloc">✎</button>
                    <button class="block-btn load" title="Charger ce bloc">📂</button>
                    <button class="block-btn delete" title="Supprimer ce bloc">✕</button>
                </div>
            </div>
            <div class="block-patterns" style="background-color: ${block.color.light};">${block.patternData.noteCount} notes • ${block.noteValue} • ${block.bpm} BPM</div>
        `;
        
        // Ajoute les event listeners pour les boutons du bloc
        setupBlockControls(blockElement, block);
        
        // Ajoute le drag and drop
        setupBlockDragAndDrop(blockElement, block);
        
        return blockElement;
    }
    
    function setupBlockControls(blockElement, block) {
        const cloneBtn = blockElement.querySelector('.clone');
        const editBtn = blockElement.querySelector('.edit');
        const loadBtn = blockElement.querySelector('.load');
        const deleteBtn = blockElement.querySelector('.delete');
        
        cloneBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cloneBlock(block);
        });
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editBlockName(block);
        });
        
        loadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            loadBlockPattern(block);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteBlock(block);
        });
    }
    
    function cloneBlock(originalBlock) {
        blockCounter++;
        
        // Assigne une nouvelle couleur au bloc cloné
        const colorIndex = (blockCounter - 1) % blockColors.length;
        const newBlockColor = blockColors[colorIndex];
        
        const clonedBlock = {
            ...originalBlock,
            id: `block-${blockCounter}`,
            name: `${originalBlock.name} (Copie)`,
            createdAt: new Date(),
            color: newBlockColor
        };
        
        savedBlocks.push(clonedBlock);
        updateBlocksDisplay();
        console.log(`Bloc "${clonedBlock.name}" cloné`);
    }
    
    function editBlockName(block) {
        const newName = prompt('Nouveau nom du bloc:', block.name);
        if (newName && newName !== block.name) {
            block.name = newName;
            updateBlocksDisplay();
            console.log(`Bloc renommé: "${newName}"`);
        }
    }
    
    function loadBlockPattern(block) {
        if (confirm(`Charger le bloc "${block.name}"? Cela remplacera le pattern actuel.`)) {
            try {
                // 1. Arrête la lecture si en cours
                if (isPlaying) {
                    stopPlayback();
                }
                
                // 2. Met à jour la subdivision et le BPM
                currentNoteValue = block.noteValue;
                currentBPM = block.bpm;
                
                // Met à jour l'interface
                document.getElementById('note-value').value = block.noteValue;
                document.getElementById('tempo').value = block.bpm;
                tempoInput.value = block.bpm;
                
                // 3. Adapte le nombre de pistes si nécessaire
                adjustTracksToMatchBlock(block.patternData.tracks.length);
                
                // 4. Configure chaque piste
                loadTracksFromBlock(block.patternData.tracks);
                
                // 5. Régénère la grille avec la nouvelle subdivision
                generatePatternGrid();
                
                // 6. Place les notes sur la nouvelle grille
                loadNotesFromBlock(block.patternData.tracks);
                
                // 7. Met à jour les durées et affichages
                calculateTotalDuration();
                updateTimeDisplays();
                
                console.log(`Bloc "${block.name}" chargé avec succès - ${block.patternData.noteCount} notes`);
                
                // Feedback visuel
                const loadBtn = document.querySelector(`[data-block-id="${block.id}"] .load`);
                if (loadBtn) {
                    const originalText = loadBtn.innerHTML;
                    loadBtn.innerHTML = '✅';
                    loadBtn.style.color = 'var(--success-color)';
                    
                    setTimeout(() => {
                        loadBtn.innerHTML = originalText;
                        loadBtn.style.color = '';
                    }, 1500);
                }
                
            } catch (error) {
                console.error('Erreur lors du chargement du bloc:', error);
                alert('Erreur lors du chargement du bloc. Vérifiez la console pour plus de détails.');
            }
        }
    }
    
    function deleteBlock(block) {
        if (confirm(`Supprimer définitivement le bloc "${block.name}"?`)) {
            const index = savedBlocks.findIndex(b => b.id === block.id);
            if (index !== -1) {
                savedBlocks.splice(index, 1);
                updateBlocksDisplay();
                console.log(`Bloc "${block.name}" supprimé`);
            }
        }
    }
    
    function adjustTracksToMatchBlock(requiredTracks) {
        const currentTracks = document.querySelectorAll('.track').length;
        
        if (currentTracks < requiredTracks) {
            // Ajoute des pistes manquantes
            for (let i = currentTracks; i < requiredTracks; i++) {
                addNewTrack();
            }
        } else if (currentTracks > requiredTracks) {
            // Supprime les pistes en trop
            const tracksToRemove = currentTracks - requiredTracks;
            const tracksList = document.getElementById('tracks-list');
            
            for (let i = 0; i < tracksToRemove; i++) {
                const lastTrack = tracksList.lastElementChild;
                if (lastTrack && lastTrack.classList.contains('track')) {
                    lastTrack.remove();
                }
            }
        }
    }
    
    function loadTracksFromBlock(tracksData) {
        const tracks = document.querySelectorAll('.track');
        
        tracksData.forEach((trackData, index) => {
            if (tracks[index]) {
                const track = tracks[index];
                
                // Configure l'instrument
                const drumSelector = track.querySelector('.track-drum-selector');
                if (drumSelector) {
                    drumSelector.value = trackData.drumType;
                }
                
                // Met à jour le nom de la piste
                const trackName = track.querySelector('.track-name');
                if (trackName) {
                    trackName.textContent = trackData.trackName;
                }
                
                // Configure le volume
                const volumeSlider = track.querySelector('.track-volume-slider');
                const volumeDisplay = track.querySelector('.track-volume-display');
                if (volumeSlider && volumeDisplay) {
                    volumeSlider.value = trackData.volume;
                    volumeDisplay.textContent = trackData.volume + '%';
                }
                
                // Réinitialise les boutons mute/solo
                track.querySelector('.track-mute')?.classList.remove('active');
                track.querySelector('.track-solo')?.classList.remove('active');
            }
        });
        
        // Met à jour les événements des nouveaux sélecteurs
        setupTrackControls();
    }
    
    function loadNotesFromBlock(tracksData) {
        // Vide d'abord toutes les notes existantes
        document.querySelectorAll('.grid-cell.active').forEach(cell => {
            cell.classList.remove('active');
            removeAllDrumColors(cell);
        });
        
        const gridRows = document.querySelectorAll('.grid-row');
        
        tracksData.forEach((trackData, trackIndex) => {
            const row = gridRows[trackIndex];
            if (row) {
                const cells = row.querySelectorAll('.grid-cell');
                
                trackData.notes.forEach(note => {
                    if (cells[note.position]) {
                        const cell = cells[note.position];
                        cell.classList.add('active');
                        addDrumColor(cell, note.drumType);
                    }
                });
            }
        });
    }
    
    // Fonctions de composition
    function setupCompositionControls() {
        const playCompositionBtn = document.getElementById('play-composition-btn');
        const pauseCompositionBtn = document.getElementById('pause-composition-btn');
        const stopCompositionBtn = document.getElementById('stop-composition-btn');
        const loopCompositionBtn = document.getElementById('loop-composition-btn');
        const clearCompositionBtn = document.getElementById('clear-composition-btn');
        
        playCompositionBtn.addEventListener('click', () => {
            playComposition();
        });
        
        pauseCompositionBtn.addEventListener('click', () => {
            pauseComposition();
        });
        
        stopCompositionBtn.addEventListener('click', () => {
            stopComposition();
        });
        
        loopCompositionBtn.addEventListener('click', () => {
            toggleCompositionLoop();
        });
        
        clearCompositionBtn.addEventListener('click', () => {
            clearComposition();
        });
    }
    
    function setupDragAndDrop() {
        const timeline = document.getElementById('composition-timeline');
        
        // Setup pour la timeline (zone de dépôt)
        timeline.addEventListener('dragover', (e) => {
            e.preventDefault();
            timeline.classList.add('drag-over');
        });
        
        timeline.addEventListener('dragleave', (e) => {
            if (!timeline.contains(e.relatedTarget)) {
                timeline.classList.remove('drag-over');
            }
        });
        
        timeline.addEventListener('drop', (e) => {
            e.preventDefault();
            timeline.classList.remove('drag-over');
            
            const blockId = e.dataTransfer.getData('text/plain');
            const block = savedBlocks.find(b => b.id === blockId);
            
            if (block) {
                addBlockToComposition(block);
            }
        });
    }
    
    function setupBlockDragAndDrop(blockElement, block) {
        blockElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', block.id);
            blockElement.classList.add('dragging');
        });
        
        blockElement.addEventListener('dragend', () => {
            blockElement.classList.remove('dragging');
        });
    }
    
    function addBlockToComposition(block) {
        const compositionBlock = {
            id: `comp-${Date.now()}`,
            blockId: block.id,
            block: block,
            position: composition.length
        };
        
        composition.push(compositionBlock);
        updateCompositionDisplay();
        console.log(`Bloc "${block.name}" ajouté à la composition`);
    }
    
    function updateCompositionDisplay() {
        const timeline = document.getElementById('composition-timeline');
        const dropZone = timeline.querySelector('.timeline-drop-zone');
        
        // Cache ou montre le message de zone de dépôt
        if (composition.length > 0) {
            dropZone.classList.add('hidden');
        } else {
            dropZone.classList.remove('hidden');
        }
        
        // Supprime tous les blocs existants (sauf la drop zone)
        const existingBlocks = timeline.querySelectorAll('.composition-block');
        existingBlocks.forEach(block => block.remove());
        
        // Ajoute tous les blocs de la composition
        composition.forEach((compBlock, index) => {
            const blockElement = createCompositionBlockElement(compBlock, index);
            timeline.appendChild(blockElement);
        });
    }
    
    function createCompositionBlockElement(compBlock, index) {
        const blockElement = document.createElement('div');
        blockElement.className = 'composition-block';
        blockElement.dataset.compositionId = compBlock.id;
        blockElement.dataset.position = index;
        blockElement.draggable = true;
        
        blockElement.innerHTML = `
            <div class="block-name" style="background-color: ${compBlock.block.color.value}; color: white; padding: 5px 10px; border-radius: 3px;">${compBlock.block.name}</div>
            <div class="block-info" style="background-color: ${compBlock.block.color.light}; padding: 3px 10px; border-radius: 3px; color: #333; font-size: 12px;">${compBlock.block.patternData.noteCount} notes</div>
            <button class="block-remove">✕</button>
        `;
        
        // Event listener pour supprimer le bloc
        const removeBtn = blockElement.querySelector('.block-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeBlockFromComposition(index);
        });
        
        // Setup du drag and drop pour réorganisation
        setupCompositionBlockDragAndDrop(blockElement, index);
        
        return blockElement;
    }
    
    function removeBlockFromComposition(index) {
        if (index >= 0 && index < composition.length) {
            const removedBlock = composition.splice(index, 1)[0];
            updateCompositionDisplay();
            console.log(`Bloc "${removedBlock.block.name}" supprimé de la composition`);
        }
    }
    
    function clearComposition() {
        if (composition.length > 0) {
            if (confirm('Vider toute la composition ?')) {
                composition = [];
                updateCompositionDisplay();
                console.log('Composition vidée');
            }
        }
    }
    
    function toggleCompositionLoop() {
        isCompositionLooping = !isCompositionLooping;
        const loopBtn = document.getElementById('loop-composition-btn');
        
        if (isCompositionLooping) {
            loopBtn.classList.add('loop-active');
            loopBtn.title = "Boucle composition ACTIVÉE";
            console.log('Boucle de composition activée');
        } else {
            loopBtn.classList.remove('loop-active');
            loopBtn.title = "Boucle composition DÉSACTIVÉE";
            console.log('Boucle de composition désactivée');
        }
    }
    
    function playComposition() {
        if (composition.length === 0) {
            alert('Aucun bloc dans la composition. Glissez des blocs dans la timeline pour créer une composition.');
            return;
        }
        
        if (!audioContext) {
            console.warn('Contexte audio non initialisé');
            return;
        }
        
        // Arrête la lecture de pattern si en cours
        if (isPlaying) {
            stopPlayback();
        }
        
        isCompositionPlaying = true;
        currentCompositionBlock = 0;
        
        // Met à jour l'interface
        document.getElementById('play-composition-btn').classList.add('active');
        document.getElementById('pause-composition-btn').classList.remove('active');
        document.getElementById('stop-composition-btn').classList.remove('active');
        
        playCurrentCompositionBlock();
        console.log('Lecture de composition démarrée');
    }
    
    function pauseComposition() {
        if (!isCompositionPlaying) return;
        
        isCompositionPlaying = false;
        
        // Annule les timeouts programmés
        if (compositionTimeout) {
            clearTimeout(compositionTimeout);
            compositionTimeout = null;
        }
        
        // Arrête la lecture du bloc actuel
        if (isPlaying) {
            pausePlayback();
        }
        
        // Met à jour l'interface
        document.getElementById('play-composition-btn').classList.remove('active');
        document.getElementById('pause-composition-btn').classList.add('active');
        
        console.log('Composition en pause');
    }
    
    function stopComposition() {
        isCompositionPlaying = false;
        currentCompositionBlock = 0;
        
        // Annule les timeouts programmés
        if (compositionTimeout) {
            clearTimeout(compositionTimeout);
            compositionTimeout = null;
        }
        
        // Arrête la lecture du bloc actuel
        if (isPlaying) {
            stopPlayback();
        }
        
        // Met à jour l'interface
        document.getElementById('play-composition-btn').classList.remove('active');
        document.getElementById('pause-composition-btn').classList.remove('active');
        document.getElementById('stop-composition-btn').classList.add('active');
        
        // Supprime la surbrillance des blocs
        document.querySelectorAll('.composition-block.playing').forEach(block => {
            block.classList.remove('playing');
        });
        
        console.log('Composition arrêtée');
    }
    
    function playCurrentCompositionBlock() {
        if (!isCompositionPlaying || currentCompositionBlock >= composition.length) {
            return;
        }
        
        const compBlock = composition[currentCompositionBlock];
        const block = compBlock.block;
        
        // Charge le pattern et prépare tout AVANT de changer la lecture
        const wasPlaying = isPlaying;
        const previousPosition = currentPosition;
        
        // Surbrillance du bloc en cours
        document.querySelectorAll('.composition-block.playing').forEach(b => {
            b.classList.remove('playing');
        });
        
        const blockElement = document.querySelector(`[data-position="${currentCompositionBlock}"]`);
        if (blockElement) {
            blockElement.classList.add('playing');
        }
        
        console.log(`Transition fluide vers bloc ${currentCompositionBlock + 1}/${composition.length}: "${block.name}"`);
        
        // Charge le pattern du bloc et réinitialise la position
        // En mode composition, préserve le BPM global
        loadBlockPatternSilently(block, true);
        currentPosition = 0;
        
        // Recalcule la durée totale pour ce bloc spécifique
        calculateTotalDuration();
        
        // Si on était en lecture, continue immédiatement avec le nouveau pattern
        if (wasPlaying && isCompositionPlaying) {
            // Recalcule le temps de démarrage pour une continuité parfaite
            playbackStartTime = audioContext.currentTime;
            updateTimeDisplays();
            updateGridCursor();
        } else if (isCompositionPlaying) {
            // Premier bloc ou redémarrage
            startPlayback();
        }
        
        // Programme la transition vers le bloc suivant au moment précis
        compositionTimeout = setTimeout(() => {
            if (isCompositionPlaying) {
                moveToNextCompositionBlock();
            }
        }, totalDuration);
    }
    
    function moveToNextCompositionBlock() {
        // Transition instantanée sans arrêter la lecture
        currentCompositionBlock++;
        
        console.log(`Transition vers bloc ${currentCompositionBlock + 1}/${composition.length}`);
        
        if (currentCompositionBlock >= composition.length) {
            if (isCompositionLooping) {
                currentCompositionBlock = 0;
                console.log('Redémarrage de la composition (boucle)');
                playCurrentCompositionBlock();
            } else {
                stopComposition();
                console.log('Fin de la composition');
            }
        } else {
            console.log(`Lecture du bloc suivant: ${composition[currentCompositionBlock].block.name}`);
            playCurrentCompositionBlock();
        }
    }
    
    function loadBlockPatternSilently(block, preserveGlobalBPM = false) {
        // Version silencieuse de loadBlockPattern (sans confirmation ni feedback)
        try {
            currentNoteValue = block.noteValue;
            
            // En mode composition, préserve le BPM global au lieu d'utiliser celui du bloc
            if (!preserveGlobalBPM) {
                currentBPM = block.bpm;
                document.getElementById('tempo').value = block.bpm;
                tempoInput.value = block.bpm;
            } else {
                // Garde le BPM actuel (global de la composition)
                console.log(`Préservation du BPM global: ${currentBPM} (bloc contenait: ${block.bpm})`);
            }
            
            document.getElementById('note-value').value = block.noteValue;
            
            adjustTracksToMatchBlock(block.patternData.tracks.length);
            loadTracksFromBlock(block.patternData.tracks);
            generatePatternGrid();
            loadNotesFromBlock(block.patternData.tracks);
            
            calculateTotalDuration();
            updateTimeDisplays();
        } catch (error) {
            console.error('Erreur lors du chargement silencieux du bloc:', error);
        }
    }
    
    // Fonction pour le drag and drop de réorganisation des blocs de composition
    function setupCompositionBlockDragAndDrop(blockElement, index) {
        blockElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/composition-reorder', index.toString());
            e.dataTransfer.effectAllowed = 'move';
            blockElement.classList.add('dragging');
        });
        
        blockElement.addEventListener('dragend', () => {
            blockElement.classList.remove('dragging');
            // Nettoie tous les indicateurs de drop
            document.querySelectorAll('.composition-block').forEach(block => {
                block.classList.remove('drop-target-before', 'drop-target-after');
            });
        });
        
        blockElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Vérifie si c'est un bloc de réorganisation
            const dragData = e.dataTransfer.types.includes('text/composition-reorder');
            if (!dragData) return;
            
            // Détermine la position de drop (avant ou après)
            const rect = blockElement.getBoundingClientRect();
            const midPoint = rect.left + rect.width / 2;
            const mouseX = e.clientX;
            
            // Nettoie d'abord tous les indicateurs
            document.querySelectorAll('.composition-block').forEach(block => {
                block.classList.remove('drop-target-before', 'drop-target-after');
            });
            
            // Ajoute l'indicateur approprié
            if (mouseX < midPoint) {
                blockElement.classList.add('drop-target-before');
            } else {
                blockElement.classList.add('drop-target-after');
            }
        });
        
        blockElement.addEventListener('dragleave', (e) => {
            // Supprime les indicateurs seulement si on quitte vraiment l'élément
            if (!blockElement.contains(e.relatedTarget)) {
                blockElement.classList.remove('drop-target-before', 'drop-target-after');
            }
        });
        
        blockElement.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const fromIndex = parseInt(e.dataTransfer.getData('text/composition-reorder'));
            const toPosition = parseInt(blockElement.dataset.position);
            
            if (fromIndex !== toPosition) {
                // Détermine si on insert avant ou après
                const rect = blockElement.getBoundingClientRect();
                const midPoint = rect.left + rect.width / 2;
                const mouseX = e.clientX;
                
                let insertIndex = toPosition;
                if (mouseX >= midPoint) {
                    insertIndex = toPosition + 1;
                }
                
                moveBlockInComposition(fromIndex, insertIndex);
            }
            
            // Nettoie les indicateurs
            document.querySelectorAll('.composition-block').forEach(block => {
                block.classList.remove('drop-target-before', 'drop-target-after');
            });
        });
    }
    
    function moveBlockInComposition(fromIndex, toIndex) {
        // Ajuste les indices pour éviter les problèmes de décalage
        if (fromIndex === toIndex) return;
        
        // Sauvegarde l'élément à déplacer
        const movedBlock = composition.splice(fromIndex, 1)[0];
        
        // Ajuste l'index de destination si nécessaire
        let adjustedToIndex = toIndex;
        if (fromIndex < toIndex) {
            adjustedToIndex = toIndex - 1;
        }
        
        // Assure-toi que l'index est dans les limites
        adjustedToIndex = Math.max(0, Math.min(adjustedToIndex, composition.length));
        
        // Insert l'élément à sa nouvelle position
        composition.splice(adjustedToIndex, 0, movedBlock);
        
        // Met à jour l'affichage
        updateCompositionDisplay();
        
        console.log(`Bloc déplacé de la position ${fromIndex} vers ${adjustedToIndex}`);
    }
    
    // Fonction pour vider le pattern actuel
    function clearCurrentPattern() {
        if (confirm('Vider toutes les notes du pattern actuel ?')) {
            // Arrête la lecture si en cours
            if (isPlaying) {
                stopPlayback();
            }
            
            // Supprime toutes les notes actives de la grille
            document.querySelectorAll('.grid-cell.active').forEach(cell => {
                cell.classList.remove('active');
                removeAllDrumColors(cell);
                removeAllModifiers(cell);
            });
            
            // Remet la position à zéro
            currentPosition = 0;
            updateTimeDisplays();
            updateProgressBar();
            updateGridCursor();
            
            console.log('Pattern vidé - Toutes les notes supprimées');
            
            // Feedback visuel temporaire
            const clearBtn = document.getElementById('clear-pattern');
            const originalText = clearBtn.innerHTML;
            clearBtn.innerHTML = '✅ Vidé !';
            clearBtn.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                clearBtn.innerHTML = originalText;
                clearBtn.style.backgroundColor = '';
            }, 1500);
        }
    }
    
    function setupSoundPresets() {
        // Sélecteur de preset de kit
        const drumKitSelect = document.getElementById('drum-kit-preset');
        if (drumKitSelect) {
            drumKitSelect.addEventListener('change', () => {
                currentDrumKit = drumKitSelect.value;
                console.log(`Kit de batterie changé: ${drumKitPresets[currentDrumKit].name}`);
            });
        }
        
        // Bouton aperçu du kit
        const previewKitBtn = document.getElementById('preview-kit');
        if (previewKitBtn) {
            previewKitBtn.addEventListener('click', () => {
                previewDrumKit();
            });
        }
        
        // Bouton changer son personnalisé
        const changeSoundBtn = document.getElementById('change-sound');
        if (changeSoundBtn) {
            changeSoundBtn.addEventListener('click', () => {
                const selectedDrum = document.getElementById('selected-drum').value;
                loadCustomSound(selectedDrum);
            });
        }
        
        // Bouton reset son
        const resetSoundBtn = document.getElementById('reset-sound');
        if (resetSoundBtn) {
            resetSoundBtn.addEventListener('click', () => {
                const selectedDrum = document.getElementById('selected-drum').value;
                resetCustomSound(selectedDrum);
            });
        }
        
        // Sélecteur d'élément de batterie (pour les sons personnalisés)
        const selectedDrumSelect = document.getElementById('selected-drum');
        if (selectedDrumSelect) {
            selectedDrumSelect.addEventListener('change', () => {
                updateSoundControls();
            });
        }
    }
    
    function previewDrumKit() {
        const drumElements = ['kick', 'snare', 'hihat-closed', 'hihat-open', 'crash', 'tom-high', 'tom-mid', 'tom-low'];
        let delay = 0;
        
        drumElements.forEach((drum, index) => {
            setTimeout(() => {
                playDrumSound(drum);
            }, delay);
            delay += 300; // 300ms entre chaque son
        });
    }
    
    function loadCustomSound(drumType) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const audio = new Audio();
                const url = URL.createObjectURL(file);
                audio.src = url;
                
                audio.oncanplaythrough = () => {
                    customSounds[drumType] = audio;
                    console.log(`Son personnalisé chargé pour ${drumType}: ${file.name}`);
                    updateSoundControls();
                    // Test immédiat du son chargé
                    playCustomSound(drumType);
                };
                
                audio.onerror = () => {
                    console.error(`Erreur lors du chargement du fichier audio: ${file.name}`);
                    alert('Erreur lors du chargement du fichier audio. Vérifiez que le format est supporté.');
                };
            }
        };
        
        input.click();
    }
    
    function resetCustomSound(drumType) {
        if (customSounds[drumType]) {
            URL.revokeObjectURL(customSounds[drumType].src);
            delete customSounds[drumType];
            console.log(`Son personnalisé supprimé pour ${drumType}`);
            updateSoundControls();
        }
    }
    
    function updateSoundControls() {
        const selectedDrum = document.getElementById('selected-drum').value;
        const changeSoundBtn = document.getElementById('change-sound');
        const resetSoundBtn = document.getElementById('reset-sound');
        const selectedDrumSelect = document.getElementById('selected-drum');
        
        if (customSounds[selectedDrum]) {
            changeSoundBtn.textContent = '🔄 Remplacer Son';
            resetSoundBtn.style.display = 'inline-block';
            // Ajoute un indicateur visuel sur l'option sélectionnée
            const option = selectedDrumSelect.querySelector(`option[value="${selectedDrum}"]`);
            if (option && !option.textContent.includes('✓')) {
                option.textContent += ' ✓';
            }
        } else {
            changeSoundBtn.textContent = '📁 Changer Son';
            resetSoundBtn.style.display = 'none';
            // Enlève l'indicateur visuel
            const option = selectedDrumSelect.querySelector(`option[value="${selectedDrum}"]`);
            if (option && option.textContent.includes(' ✓')) {
                option.textContent = option.textContent.replace(' ✓', '');
            }
        }
    }
    
    // Fonction utilitaire pour changer le preset via code
    function changeDrumKitPreset(presetName) {
        if (drumKitPresets[presetName]) {
            currentDrumKit = presetName;
            const drumKitSelect = document.getElementById('drum-kit-preset');
            if (drumKitSelect) {
                drumKitSelect.value = presetName;
            }
            console.log(`Kit changé programmatiquement: ${drumKitPresets[presetName].name}`);
        } else {
            console.warn(`Preset non trouvé: ${presetName}`);
        }
    }
    
    // Message d'information
    console.log('Interface MusicBox prête - Système audio, lecture, blocs et composition avec réorganisation activés');
});