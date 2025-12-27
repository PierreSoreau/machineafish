document.addEventListener('DOMContentLoaded', () => {
    if (typeof allQuestions !== 'undefined' && allQuestions.length > 0) {
        showQuestion();
    }
});
let currentIndex = 0;
let answers = {};

function showQuestion() {
    const question = allQuestions[currentIndex];
    //récupération du titre
    document.getElementById('questions_title').textContent = question.contenu_question;
    //avancée de la barre de progression
    document.getElementById('progress_title').textContent = `Question ${currentIndex + 1} / ${allQuestions.length}`;
    const progress = ((currentIndex + 1) / (allQuestions.length)) * 100;
    document.getElementById('progress_bar').style.width = progress + `%`;
    //MAJ des options

    const options = document.getElementById('options-container');
    options.innerHTML = "";
    const optionsarray = JSON.parse(question.options);
    optionsarray.forEach(opt => {
        opt = opt.trim();
        const card = document.createElement('div');
        card.className = 'answer-card';
        console.log(`Comparaison : "${opt}" (longueur ${opt.length}) VS "${allPoissons[0]?.nom}"`);
        //on vérifie si le nom du poisson ou de la saison correspondant à opt
        const poissondata = allPoissons.find(p => p.nom === opt);
        const saisondata = allSaisons.find(s => s.saison === opt);
        let imageHtml = "";
        if (poissondata) {
            const poissonurl = poissondata.logo;
            imageHtml = `<img src="${poissonurl}" alt="${opt}" class="img-logo">`;
        }

        if (saisondata) {
            const saisonurl = saisondata.logo;
            imageHtml = `<img src="${saisonurl}" alt="${opt}" class="img-logo">`;
        }

        const imgClass = imageHtml === "" ? "no-img" : "";
        card.className = `answer-card ${imgClass}`;

        card.innerHTML = `<div id="card-content" class="card">
                            <div class="card-img">
	                            ${imageHtml}
                            </div>
                            <div class="card-text">
	                            <span>${opt}</span>
                            </div>
                          </div>`;

        //au clique on change de question
        card.onclick = () => suiteQuestionnaire(question.id, opt);
        ///avant de cliquer il faut que le questionnaire s'affiche donc on ajoute tous les boutons
        options.appendChild(card);
    });



}

function suiteQuestionnaire(questionId, choice) {
    answers[questionId] = choice;

    if (currentIndex < allQuestions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        // On transforme tes réponses en texte
        const fluxDeDonnees = JSON.stringify(answers);

        // On met ce texte dans le champ caché du formulaire
        document.getElementById('results-input').value = fluxDeDonnees;

        // On "clique" sur envoyer automatiquement
        document.getElementById('hidden-quiz-form').submit();

    }
}