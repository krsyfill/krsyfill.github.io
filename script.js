// Stav hry
let gameData = null;
let teams = JSON.parse(localStorage.getItem('riskuj_teams')) || [
    { id: 1, name: "Tým 1", score: 0 },
    { id: 2, name: "Tým 2", score: 0 },
    { id: 3, name: "Tým 3", score: 0 },
    { id: 4, name: "Tým 4", score: 0 }
];
let usedQuestions = []; // Ukládá řetězce "catIndex-qIndex"
let selectedQuestion = null;
let questionTimer = null;
let questionTimeLeft = 20;

let activeTeamId = JSON.parse(localStorage.getItem('riskuj_active_team')) || null;

async function loadGameData() {
    try {
        const response = await fetch('game_data.json');
        gameData = await response.json();
        init();
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
        gameBoard.innerHTML = '<p style="color:white; padding:20px;">Nepodařilo se načíst data hry. Ujistěte se, že game_data.json existuje.</p>';
    }
}

function saveTeams() {
    localStorage.setItem('riskuj_teams', JSON.stringify(teams));
}

// DOM elementy
const gameBoard = document.getElementById('game-board');
const teamsList = document.getElementById('teams-list');
const modalQuestion = document.getElementById('modal-question');
const modalSettings = document.getElementById('modal-settings');
const modalEndGame = document.getElementById('modal-endgame');

// Inicializace
function init() {
    // Načíst použité otázky, pokud existují (volitelné, ale pro svatbu se hodí persistence)
    const savedUsed = localStorage.getItem('riskuj_used');
    if (savedUsed) usedQuestions = JSON.parse(savedUsed);
    
    renderBoard();
    renderScoreboard();
    setupEventListeners();
    
    // Pokud je hra u konce, ukázat výsledky
    checkEndGame();
}

function saveUsed() {
    localStorage.setItem('riskuj_used', JSON.stringify(usedQuestions));
}

function renderBoard() {
    gameBoard.innerHTML = '';
    
    // Hlavičky kategorií
    gameData.categories.forEach((cat, catIdx) => {
        const div = document.createElement('div');
        const qId = `bonus-${catIdx}`;
        const isUsed = usedQuestions.includes(qId);
        const catQuestions = cat.questions.length;
        const usedInCat = usedQuestions.filter(id => id.startsWith(`${catIdx}-`)).length;
        const isReady = usedInCat === catQuestions && !isUsed;

        div.className = `category-name ${isReady ? 'bonus-ready' : ''} ${isUsed ? 'used' : ''}`;
        div.innerText = isUsed ? '✔' : cat.name;
        
        if (isReady) {
            div.onclick = () => openBonusQuestion(catIdx);
        }
        gameBoard.appendChild(div);
    });

    // Otázky (řádek po řádku pro lepší grid layout, ale data máme ve sloupcích)
    // Protože grid má 5 sloupců a chceme 6 řádků otázek:
    const maxQuestions = Math.max(...gameData.categories.map(c => c.questions.length));
    
    for (let qIdx = 0; qIdx < maxQuestions; qIdx++) {
        for (let catIdx = 0; catIdx < gameData.categories.length; catIdx++) {
            const question = gameData.categories[catIdx].questions[qIdx];
            const cell = document.createElement('div');
            
            if (question) {
                const qId = `${catIdx}-${qIdx}`;
                const isUsed = usedQuestions.includes(qId);
                
                cell.className = `question-card ${isUsed ? 'used' : ''}`;
                cell.innerText = isUsed ? '✔' : question.points;
                
                if (!isUsed) {
                    cell.onclick = () => openQuestion(catIdx, qIdx);
                }
            } else {
                cell.className = 'question-card used'; // Prázdné místo
            }
            gameBoard.appendChild(cell);
        }
    }
}

function renderScoreboard() {
    teamsList.innerHTML = '';
    teams.forEach(team => {
        const div = document.createElement('div');
        div.className = `team-item ${team.id === activeTeamId ? 'active-team' : ''}`;
        div.onclick = (e) => {
            // Změnit aktivní tým pouze pokud se nekliklo na tlačítka skóre
            if (!e.target.closest('.team-controls') && !e.target.closest('.team-score')) {
                toggleActiveTeam(team.id);
            }
        };
        div.innerHTML = `
            <span class="team-name">${team.name}</span>
            <span class="team-score" title="Klikněte pro ruční úpravu" onclick="editScorePrompt(${team.id})">${team.score}</span>
            <div class="team-controls">
                <button onclick="updateScore(${team.id}, 100)">+100</button>
                <button onclick="updateScore(${team.id}, -100)">-100</button>
            </div>
        `;
        teamsList.appendChild(div);
    });
}

function toggleActiveTeam(teamId) {
    if (activeTeamId === teamId) {
        activeTeamId = null;
    } else {
        activeTeamId = teamId;
    }
    localStorage.setItem('riskuj_active_team', JSON.stringify(activeTeamId));
    renderScoreboard();
}

function editScorePrompt(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    const newScore = prompt(`Zadejte nové skóre pro tým ${team.name}:`, team.score);
    if (newScore !== null && !isNaN(parseInt(newScore))) {
        team.score = parseInt(newScore);
        saveTeams();
        renderScoreboard();
    }
}

function updateScore(teamId, amount) {
    const team = teams.find(t => t.id === teamId);
    if (team) {
        team.score += amount;
        saveTeams();
        renderScoreboard();
    }
}

function openQuestion(catIdx, qIdx) {
    const cat = gameData.categories[catIdx];
    const q = cat.questions[qIdx];
    selectedQuestion = { catIdx, qIdx, points: q.points };

    document.getElementById('q-category').innerText = cat.name;
    document.getElementById('q-points').innerText = q.points;
    document.getElementById('q-text').innerText = q.question;
    document.getElementById('q-answer').innerText = q.answer;

    document.getElementById('q-answer-container').classList.add('hidden');
    document.getElementById('q-actions').classList.add('hidden');
    document.getElementById('btn-show-answer').classList.remove('hidden');

    // Speciální efekt pro Zlatou cihlu
    if (q.question === "ZLATÁ CIHLA") {
        modalQuestion.classList.add('gold-brick-active');
        document.getElementById('q-timer').classList.add('q-timer-hidden');
    } else {
        modalQuestion.classList.remove('gold-brick-active');
        startQuestionTimer();
    }

    modalQuestion.classList.add('active');
}

function startQuestionTimer() {
    stopQuestionTimer();
    questionTimeLeft = 20;
    const timerDisplay = document.getElementById('q-timer');
    timerDisplay.innerText = questionTimeLeft;
    timerDisplay.classList.remove('q-timer-hidden', 'low-time');

    questionTimer = setInterval(() => {
        questionTimeLeft--;
        timerDisplay.innerText = questionTimeLeft;

        if (questionTimeLeft <= 5) {
            timerDisplay.classList.add('low-time');
        }

        if (questionTimeLeft <= 0) {
            stopQuestionTimer();
            timerDisplay.innerText = "!";
        }
    }, 1000);
}

function stopQuestionTimer() {
    if (questionTimer) {
        clearInterval(questionTimer);
        questionTimer = null;
    }
}

function showAnswer() {
    stopQuestionTimer();
    document.getElementById('q-timer').classList.add('q-timer-hidden');
    document.getElementById('q-answer-container').classList.remove('hidden');
    document.getElementById('btn-show-answer').classList.add('hidden');
    document.getElementById('q-actions').classList.remove('hidden');

    const activeTeamShortcut = document.getElementById('active-team-shortcut');
    const activeTeam = teams.find(t => t.id === activeTeamId);

    if (activeTeam) {
        activeTeamShortcut.classList.remove('hidden');
        document.getElementById('active-team-name-display').innerText = activeTeam.name;
        document.getElementById('btn-active-correct').onclick = () => handleQuestionResult(activeTeam.id, true);
        document.getElementById('btn-active-wrong').onclick = () => handleQuestionResult(activeTeam.id, false);
        document.getElementById('q-other-teams-label').innerText = "Odpověděl jiný tým?";
    } else {
        activeTeamShortcut.classList.add('hidden');
        document.getElementById('q-other-teams-label').innerText = "Kdo odpověděl?";
    }

    // Generovat tlačítka týmů pro přidání/odebrání bodů
    const container = document.getElementById('q-team-buttons');
    container.innerHTML = '';
    teams.forEach(team => {
        // Preskočíme aktivní tým v seznamu "ostatních", pokud je už nahoře (volitelné, ale přehlednější)
        // Ne, necháme je tam pro jistotu, ale vizuálně je to jedno.
        
        const btnCorrect = document.createElement('button');
        btnCorrect.className = `q-team-btn correct ${team.id === activeTeamId ? 'active-team-btn-border' : ''}`;
        btnCorrect.innerText = `${team.name} +`;
        btnCorrect.onclick = () => handleQuestionResult(team.id, true);

        const btnWrong = document.createElement('button');
        btnWrong.className = `q-team-btn wrong ${team.id === activeTeamId ? 'active-team-btn-border' : ''}`;
        btnWrong.innerText = `${team.name} -`;
        btnWrong.onclick = () => handleQuestionResult(team.id, false);

        const group = document.createElement('div');
        group.style.display = 'flex';
        group.style.flexDirection = 'column';
        group.style.gap = '5px';
        group.appendChild(btnCorrect);
        group.appendChild(btnWrong);
        
        container.appendChild(group);
    });
}

function handleQuestionResult(teamId, isCorrect) {
    if (teamId !== null) {
        const points = selectedQuestion.points;
        updateScore(teamId, isCorrect ? points : -points);
        
        // Automaticky přepnout na další tým v pořadí
        const currentIndex = teams.findIndex(t => t.id === teamId);
        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % teams.length;
            activeTeamId = teams[nextIndex].id;
            localStorage.setItem('riskuj_active_team', JSON.stringify(activeTeamId));
            renderScoreboard();
        }

        // Zavřeme otázku po jakémkoliv přidělení bodů (kladných i záporných)
        closeQuestion();
    }
}

function closeQuestion() {
    stopQuestionTimer();
    const qId = selectedQuestion.qIdx === 'bonus' ? `bonus-${selectedQuestion.catIdx}` : `${selectedQuestion.catIdx}-${selectedQuestion.qIdx}`;
    if (!usedQuestions.includes(qId)) {
        usedQuestions.push(qId);
    }
    saveUsed();
    modalQuestion.classList.remove('active');
    renderBoard();
    checkEndGame();
}

function checkEndGame() {
    const totalQuestions = gameData.categories.reduce((acc, cat) => acc + cat.questions.length + 1, 0); // +1 za bonus
    if (usedQuestions.length === totalQuestions) {
        showEndGame();
    }
}

function showEndGame() {
    const resultsDiv = document.getElementById('endgame-results');
    resultsDiv.innerHTML = '';

    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
    sortedTeams.forEach((team, index) => {
        const div = document.createElement('div');
        div.className = `endgame-team ${index === 0 ? 'winner' : ''}`;
        div.innerHTML = `
            <span>${index + 1}. ${team.name}</span>
            <span>${team.score} bodů</span>
        `;
        resultsDiv.appendChild(div);
    });

    modalEndGame.classList.add('active');
    createConfetti();
}

function createConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#ffb7c5', '#d88194', '#7bbcd5', '#b8e0b8', '#ffd700'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
        container.appendChild(confetti);
    }

    // Odstranit po 10 sekundách
    setTimeout(() => {
        container.remove();
    }, 10000);
}

// Nastavení
function openSettings() {
    const list = document.getElementById('settings-teams-list');
    list.innerHTML = '';
    teams.forEach((team, idx) => {
        const row = document.createElement('div');
        row.className = 'setting-team-row';
        row.innerHTML = `
            <input type="text" value="${team.name}" onchange="renameTeam(${team.id}, this.value)">
            <button onclick="removeTeam(${team.id})">Smazat</button>
        `;
        list.appendChild(row);
    });
    modalSettings.classList.add('active');
}

function renameTeam(id, newName) {
    const team = teams.find(t => t.id === id);
    if (team) team.name = newName;
    saveTeams();
    renderScoreboard();
}

function addTeam() {
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    teams.push({ id: newId, name: `Tým ${newId}`, score: 0 });
    saveTeams();
    openSettings();
    renderScoreboard();
}

function removeTeam(id) {
    teams = teams.filter(t => t.id !== id);
    saveTeams();
    openSettings();
    renderScoreboard();
}

function resetGame() {
    if (confirm('Opravdu chcete restartovat celou hru?')) {
        usedQuestions = [];
        teams.forEach(t => t.score = 0);
        activeTeamId = null;
        saveTeams();
        saveUsed();
        localStorage.removeItem('riskuj_active_team');
        renderBoard();
        renderScoreboard();
        modalSettings.classList.remove('active');
        modalEndGame.classList.remove('active');
        
        const confetti = document.querySelector('.confetti-container');
        if (confetti) confetti.remove();
    }
}

function resetTeams() {
    if (confirm('Opravdu chcete resetovat názvy všech týmů na výchozí?')) {
        teams.forEach((team, idx) => {
            team.name = `Tým ${team.id}`;
        });
        saveTeams();
        renderScoreboard();
        openSettings();
    }
}

function openBonusQuestion(catIdx) {
    const cat = gameData.categories[catIdx];
    selectedQuestion = { catIdx, qIdx: 'bonus', points: 800 };

    document.getElementById('q-category').innerText = cat.name;
    document.getElementById('q-points').innerText = "BONUS 800";
    document.getElementById('q-text').innerText = cat.bonus.question;
    document.getElementById('q-answer').innerText = cat.bonus.answer;

    document.getElementById('q-answer-container').classList.add('hidden');
    document.getElementById('q-actions').classList.add('hidden');
    document.getElementById('btn-show-answer').classList.remove('hidden');

    modalQuestion.classList.add('active');
}

function setupEventListeners() {
    document.getElementById('btn-help').onclick = () => document.getElementById('modal-help').classList.add('active');
    document.getElementById('btn-close-help').onclick = () => document.getElementById('modal-help').classList.remove('active');
    document.getElementById('btn-settings').onclick = openSettings;
    document.getElementById('btn-close-settings').onclick = () => modalSettings.classList.remove('active');
    document.getElementById('btn-add-team').onclick = addTeam;
    document.getElementById('btn-reset-teams').onclick = resetTeams;
    document.getElementById('btn-reset-game').onclick = resetGame;
    document.getElementById('btn-new-game').onclick = resetGame;
    document.getElementById('btn-restart').onclick = resetGame;
    document.getElementById('btn-show-answer').onclick = showAnswer;
    document.getElementById('btn-nobody').onclick = () => {
        closeQuestion();
    };

    // Zavírání modalů klávesou Esc a klávesové zkratky pro týmy
    window.onkeydown = (e) => {
        if (e.key === 'Escape') {
            stopQuestionTimer();
            modalQuestion.classList.remove('active');
            modalSettings.classList.remove('active');
            document.getElementById('modal-help').classList.remove('active');
        }
        
        // Mezerník pro zobrazení odpovědi, pokud je otevřen modál otázky
        if (e.code === 'Space' && modalQuestion.classList.contains('active') && !document.getElementById('btn-show-answer').classList.contains('hidden')) {
            e.preventDefault();
            showAnswer();
        }

        // Klávesové zkratky 1-9 pro přidělení bodů týmu, pokud je zobrazená odpověď
        if (modalQuestion.classList.contains('active') && !document.getElementById('q-actions').classList.contains('hidden')) {
            const num = parseInt(e.key);
            if (num >= 1 && num <= teams.length) {
                handleQuestionResult(teams[num-1].id, true);
            }

            // Klávesové zkratky + a - pro aktivní tým
            if (activeTeamId) {
                if (e.key === '+' || e.key === '=') {
                    handleQuestionResult(activeTeamId, true);
                } else if (e.key === '-' || e.key === '_') {
                    handleQuestionResult(activeTeamId, false);
                }
            }
        }
    };
}

loadGameData();
