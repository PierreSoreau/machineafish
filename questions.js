document.addEventListener("DOMContentLoaded", () => {
  if (typeof allQuestions !== "undefined" && allQuestions.length > 0) {
    showQuestion();
  }
});
let currentIndex = 0;
let answers = {};
const beginurl = "https://res.cloudinary.com/dgzbdoozf/image/upload/";
const endurl = ".webp";

//Fonction qui permet d'afficher les questions + choix de réponse
function showQuestion() {
  const question = allQuestions[currentIndex];
  //récupération du titre
  document.getElementById("questions_title").textContent =
    question.contenu_question;
  //avancée de la barre de progression
  document.getElementById("progress_title").textContent =
    `Question ${currentIndex + 1} / ${allQuestions.length}`;
  const progress = ((currentIndex + 1) / allQuestions.length) * 100;
  document.getElementById("progress_bar").style.width = progress + `%`;
  //MAJ des options

  const options = document.getElementById("options-container");
  options.innerHTML = "";
  //pour retirer les guillemets du tableau du json de la clé options
  //{ "id": 1, "contenu_question": "Quel poisson recherches-tu ?","options": "[\"Brochet\", \"Sandre\", \"Perche\"]", "type_reponse": "radio" }
  //on fait un parse optionsarray=["brochet","sandre","perche"] par exemple
  const optionsarray = JSON.parse(question.options);  
  optionsarray.forEach((opt) => {
    opt = opt.trim(); //permet de supprimer des espace ou sauts à la ligne dans le contenu
    const card = document.createElement("div");
    card.classList.add("answer-card");
    //on vérifie si le nom du poisson ou de la saison correspondent à opt
    const images = allimages.find((i) => i.theme === opt );    
    let imageHtml = "";
    if(images) {      
      imageHtml = `<img src="${beginurl}${images.url}${endurl}" alt="${images.alt}" class="img-logo">`;
    }    

    card.innerHTML = `<div id="card-content" class="card">
                            <div class="card-img">
	                            ${imageHtml}
                            </div>
                            <div class="card-text">
	                            <span>${opt}</span>
                            </div>
                          </div>`;

    ///avant de cliquer il faut que le questionnaire s'affiche donc on ajoute tous les boutons
    options.append(card);

    //au clique on change de question
    card.addEventListener("click", () => suiteQuestionnaire(question.id, opt));
  });
}

//fonction qui permet d'enchaîner sur la suite du questionnaire ou d'envoyer
// les réponses du questionnaire à la base de données via le formulaire caché
function suiteQuestionnaire(questionId, choice) {
  // 1. On enregistre la réponse
  answers[questionId] = choice;

  // 2. EST-CE LA DERNIÈRE QUESTION ?
  // Si l'index actuel est égal au dernier index possible (Total - 1)
  if (currentIndex === allQuestions.length - 1) {
    // --- C'EST LA FIN, ON LANCE LE LOADER ---

    // A. On prépare les données
    const fluxDeDonnees = JSON.stringify(answers);
    document.getElementById("results-input").value = fluxDeDonnees;

    // B. On sélectionne les éléments
    const quiz = document.querySelector(".quiz");
    const loader = document.querySelector(".loader");
    const form = document.getElementById("hidden-quiz-form");

    // C. On gère l'affichage (Masquer Quiz / Afficher Loader)
    if (quiz) quiz.style.display = "none";
    if (loader) loader.style.display = "block"; // Assure-toi que ton CSS .loader a bien z-index: 9999

    // On "clique" sur envoyer le formulaire en cliquant sur la dernière réponse du questionnaire mais on laisse 2 secondes
    // pour le sumit de manière à laisser le temps de faire disparaitre le visuel de la page quiz et apparaitre le loader
    setTimeout(() => {
      form.submit();
    }, 100);
  } else {
    // --- CE N'EST PAS FINI, QUESTION SUIVANTE ---
    currentIndex++;
    showQuestion();
  }
}
