//--------- VISUEL PARTIE MORPHOLOGIE-------------------
function morphodescriptiontext(name, i) {
  const image = document.getElementById(name)
  const morpholo = document.getElementById("morpholo")
  const images = document.querySelectorAll(".image_sandre")



  const existing = document.getElementById("descriptionmorpho");
  if (existing && existing.dataset.name === name) return;

  const morpho = ["Le sandre possède une excellente vue grâce au tapis réflecteur de sa rétine. Cela lui permet de réflechir la lumière même dans des eaux à faible luminosité (eaux troubles/profondes). Il peut donc chasser ses proies dans toutes les situations."
    , "En plus de cette faculté visuelle, le sandre est dotée d'un ligne latérale tout le long de son corps (de la base de sa tête jusqu'à sa nageoire caudale). Cela lui permet de détecter les vibrations et les mouvements de l'eau. Dans une eau très sombre c'est un atout majeur pour qu'il détecte ses proies."
    , "La gueule du sandre est garnie de canines pointues lui permettant de blesser et maintenir dans sa gueule ses proies. Attention donc à bien porter des gants lorsque vous voulez le manipuler."
    , "La nageoire dorsale du sandre la plus proche de la tête est rigide et piquante, lui permettant de se diriger et de se défendre face aux prédateurs. Attention donc de manipuler si possible le sandre avec des gants."
    , "Le sandre est de couleur gris-vert avec des bandes sombres verticales. Cette couleur lui permet de se fondre facilement dans des zones sablonneuses, caillouteuses ou vaseuses. Il peut alors attaquer par surprise ses proies."
    , "Tout comme le brochet le sandre possède un corps fusiforme lui permettant de faire des attaques fulgurantes, en sortant de ses cachettes."

  ]



  // Créer le panneau de description
  const descriptionmorpho = document.createElement("div")
  descriptionmorpho.id = "descriptionmorpho"
  descriptionmorpho.dataset.name = name;

  // Clone de l'image (l'originale reste en place)
  const imageClone = image.cloneNode(true);
  imageClone.removeAttribute("id");
  imageClone.style.cursor = "default";
  imageClone.style.transform = "none";
  imageClone.style.transition = "none";


  const textmorpho = document.createElement("div")
  textmorpho.classList = `textmorpho`
  const pmorpho = document.createElement("p")
  pmorpho.innerText = morpho[i]
  pmorpho.style.color = "white";

  const reset = document.createElement("button")
  reset.innerText = "Revenir à toutes les photos"
  reset.id = "reset"

  // Montage de l'html

  descriptionmorpho.appendChild(reset)
  descriptionmorpho.appendChild(imageClone)
  descriptionmorpho.appendChild(textmorpho)
  textmorpho.appendChild(pmorpho)
  morpholo.appendChild(descriptionmorpho)
  morpholo.style.justifyContent = "flex-start";

  images.forEach(el => {
    if (el.id === name) {
      el.style.display = "none"; // l'original disparaît
    } else {
      el.style.display = "none"; // les autres aussi
    }
  });

  reset.addEventListener("click", () => {

    descriptionmorpho.remove();
    images.forEach(el => {
      el.style.display = "";
      el.style.cursor = "";
      el.style.pointerEvents = "";
      el.style.transform = "";
      el.style.transition = "";
    });
    morpholo.style.justifyContent = "center";
  });
}

//--------- VISUEL PARTIE HABITATS-------------------

function changerVisuel() {
  const saison = document.querySelector(".saisonselect").value;
  const visuelspotpea = document.getElementById("visuelspotpea");
  const visuelspoth = document.getElementById("visuelspoth");

  //Par défaut le visuel des spots sont masqués
  visuelspotpea.style.display = "none";
  visuelspoth.style.display = "none";

  //Si le volet déroulant choisi est printemps_ete_automne alors on affiche les photos des spots associés à printemps été automne
  //Les autres restent masqués. Même chose pour les visuels hiver 
  if (saison === "printemps_ete_automne") {
    visuelspotpea.style.display = "flex";
  }

  else if (saison === "Hiver") {
    visuelspoth.style.display = "flex";
  }
}

/*---------------VISUEL REPRODUCTION------------------------------*/


const stepsHistory = [];

const infos = [
  "1. Entre avril et juin, c'est la periode de frai lorsque la température de l'eau atteint environ 15°C. Le mâle prépare un emplacement sur les herbiers, racines d'arbres dans le fond, sables graviers vers 2m de profondeur. La femelle libère ses oeufs qui sont instantanément fécondés par le mâle.",
  "2. Incubation – développement des œufs pendant 10 à 15 jours accrochés aux herbiers, racines, obstacles sur le fond. Le nid est surveillé en permanence par le mâle qui oxygène les oeufs à coups de nageoires",
  "3. Après 10 à 15 jours, les oeufs éclosent et les alevins se nourrisent de leur poche vitelline",
  "4. Environ 15 jours après l'éclosion, leur poche vitelline est résorbée et les juvéniles se nourrissent de zooplanctons ou de larves d'insectes",
  "5. Le sandre devient ensuite exclusivement piscivoire lorsqu'il atteint 4 à 6 cm. Sa croissance est ensuite rapide : 20-30 cm en 1 an, maturité secuelle des mâles vers 2 à 3 ans contre 4 ans pour les femelles."
];

let stepsDone = 0;
const totalSteps = infos.length;
const circle = document.querySelector(".progress");
const infoBox = document.getElementById("infoBox");

function clickBubble(index, element) {
  //Si l'élément de la fonction a été cliqué dans ce cas on fait rien si c'est de nouveau cliqué
  //Sinon s'il a jamais été cliqué et qu'on clique dessus alors il est noté cliqué et on ajoute le paragraphe associé à la photo
  //et on fait avancer le cercle vert

  if (element.classList.contains("clicked")) return;

  if (index > 0 && !bubbles[index - 1].classList.contains("clicked")) return;

  element.classList.add("clicked");

  if (stepsDone === 0) infoBox.textContent = '';

  //Ajoute au fur et à mesure les paragraphes de description des étapes de repro associées aux images 
  const paragraph = document.createElement("p");
  paragraph.textContent = infos[index];
  infoBox.appendChild(paragraph);
  stepsHistory.push(element);
  stepsDone++;

  //Fait avancer le visuel du cercle vert au fur et à mesure des clics
  //strokeDashoffset est une fonction css pour justement faire avancée le cercle vert
  //Plus sa valeur est élevée plus il est masqué
  const progressPercent = stepsDone / totalSteps;
  const totalLength = 1633;
  const offset = totalLength * (1 - progressPercent);
  circle.style.strokeDashoffset = offset;
}

const container = document.querySelector('.cycle');
const radius = 260;
const centerX = 400;
const centerY = 400;
const images = [
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/branche_sous_eau.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/oeufs_sandre.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/alevin_sandre.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/juvenile_sandre.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/petit_sandre.webp'
];

const picturenumber = [1, 2, 3, 4, 5]
//Pour chaque image du tableau image situé juste au dessus on leur associe une position sur le cercle (x,y)
//On les mets dans le html brochet
//On leur demande les fonctionnalités de clickbubble au click via setattribute 
images.forEach((src, i) => {
  const angle = (2 * Math.PI / images.length) * i - Math.PI / 2;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  //création de la div bubble
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  //les trois lignes qui suivent permettent de positionner précisément la bulle sur le cercle
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubble.style.transform = 'translate(-50%, -50%)';
  bubble.setAttribute('onclick', `clickBubble(${i}, this)`);
  //crée l'image
  const img = document.createElement('img');
  const p = document.createElement('p');
  p.textContent = picturenumber[i];
  img.src = src;
  img.alt = `etape_${i}`;
  //met la div img dans bubble
  bubble.appendChild(img);
  bubble.appendChild(p);
  //met la div bubble dans container
  container.appendChild(bubble);
});

const bubbles = document.querySelectorAll('.bubble')
//fonction qui permet de faire l'inverse de clickbubble, c'est à dire retirer le paragraphe de la dernière étape
//faire reculer le cercle vert
//Ces étapes fonctionnent en cliquant sur le bouton qui s'appelle revenir à l'étape précédente
function undoStep() {
  if (stepsDone === 0) return;
  //pop retire le dernier paragraphe du tableau stepHistory 
  const lastElement = stepsHistory.pop();
  //Retrait de la class clicked du dernier élément pour qu'il puisse être recliqué après
  lastElement.classList.remove("clicked");
  stepsDone--;

  //Retrait du dernier paragraphe du html
  const lastParagraph = infoBox.querySelector('p:last-child');
  if (lastParagraph) lastParagraph.remove();

  if (stepsDone === 0) {
    infoBox.textContent = "Cliquez sur une bulle pour découvrir les étapes de reproduction.";
  }

  //Fait reculer étapes par étapes le cercle vert
  //Le calcul est le même que clickbubble, la seule différence c'est que stepsDone est de plus en plus négatif
  //au lieu de plus en plus positif dans clickbubble du coup on part de 1633 et après ça augmente 
  const progressPercent = stepsDone / totalSteps;
  const totalLength = 1633;
  const offset = totalLength * (1 - progressPercent);
  circle.style.strokeDashoffset = offset;
}

function return_to_step1() {
  const bubbles = document.getElementsByClassName('bubble');
  const paragraph = infoBox.querySelectorAll('p');


  Array.from(bubbles).forEach((el) => {
    if (!el.classList.contains("clicked")) return;
    el.classList.remove("clicked")
  });

  Array.from(paragraph).forEach((p) => {
    p.remove();

  });

  infoBox.textContent = "Cliquez sur une bulle pour découvrir les étapes de reproduction.";

  stepsDone = 0;
  stepsHistory = [];
  circle.style.strokeDashoffset = 1633

}

