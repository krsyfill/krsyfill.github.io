// Stav hry
let teams = JSON.parse(localStorage.getItem('riskuj_teams')) || [
    { id: 1, name: "Tým 1", score: 0 },
    { id: 2, name: "Tým 2", score: 0 },
    { id: 3, name: "Tým 3", score: 0 },
    { id: 4, name: "Tým 4", score: 0 }
];
let usedQuestions = []; // Ukládá řetězce "catIndex-qIndex"
let selectedQuestion = null;

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
        div.className = 'team-item';
        div.innerHTML = `
            <span class="team-name">${team.name}</span>
            <span class="team-score">${team.score}</span>
            <div class="team-controls">
                <button onclick="updateScore(${team.id}, 100)">+100</button>
                <button onclick="updateScore(${team.id}, -100)">-100</button>
            </div>
        `;
        teamsList.appendChild(div);
    });
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

    modalQuestion.classList.add('active');
}

function showAnswer() {
    document.getElementById('q-answer-container').classList.remove('hidden');
    document.getElementById('btn-show-answer').classList.add('hidden');
    document.getElementById('q-actions').classList.remove('hidden');

    // Generovat tlačítka týmů pro přidání/odebrání bodů
    const container = document.getElementById('q-team-buttons');
    container.innerHTML = '';
    teams.forEach(team => {
        const btnCorrect = document.createElement('button');
        btnCorrect.className = 'q-team-btn correct';
        btnCorrect.innerText = `${team.name} +`;
        btnCorrect.onclick = () => handleQuestionResult(team.id, true);

        const btnWrong = document.createElement('button');
        btnWrong.className = 'q-team-btn wrong';
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
        
        // Zavřeme otázku po jakémkoliv přidělení bodů (kladných i záporných)
        closeQuestion();
    }
}

function closeQuestion() {
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
    if (teams.length >= 5) {
        alert("Maximální počet týmů je 5.");
        return;
    }
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
        saveTeams();
        saveUsed();
        renderBoard();
        renderScoreboard();
        modalSettings.classList.remove('active');
        modalEndGame.classList.remove('active');
    }
}

function openBonusQuestion(catIdx) {
    const cat = gameData.categories[catIdx];
    selectedQuestion = { catIdx, qIdx: 'bonus', points: 700 };

    document.getElementById('q-category').innerText = cat.name;
    document.getElementById('q-points').innerText = "BONUS 700";
    document.getElementById('q-text').innerText = cat.bonus.question;
    document.getElementById('q-answer').innerText = cat.bonus.answer;

    document.getElementById('q-answer-container').classList.add('hidden');
    document.getElementById('q-actions').classList.add('hidden');
    document.getElementById('btn-show-answer').classList.remove('hidden');

    modalQuestion.classList.add('active');
}

function setupEventListeners() {
    document.getElementById('btn-settings').onclick = openSettings;
    document.getElementById('btn-close-settings').onclick = () => modalSettings.classList.remove('active');
    document.getElementById('btn-add-team').onclick = addTeam;
    document.getElementById('btn-reset-game').onclick = resetGame;
    document.getElementById('btn-new-game').onclick = resetGame;
    document.getElementById('btn-restart').onclick = resetGame;
    document.getElementById('btn-show-answer').onclick = showAnswer;
    document.getElementById('btn-nobody').onclick = () => {
        closeQuestion();
    };

    // Zavírání modalů klávesou Esc
    window.onkeydown = (e) => {
        if (e.key === 'Escape') {
            modalQuestion.classList.remove('active');
            modalSettings.classList.remove('active');
        }
    };
}

init();
