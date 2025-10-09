function morphodescriptiontext(name, i) {
    const image = document.getElementById(name)
    const morpholo = document.getElementById("morpholo")
    const images = document.querySelectorAll(".image_silure")



    const existing = document.getElementById("descriptionmorpho");
    if (existing && existing.dataset.name === name) return;

    const morpho = ["Le silure possède plus de 1500 minuscules dents situées au-dessus et en dessous de l'entrée de sa bouche. Elles ne sont pas coupantes comme les dents d'un brochet. Elles sont considérées comme des rappes et lui permettent d'agripper ses proies pour les emmener vers le fond de sa bouche."
        , "Le silure possède 3 paires de barbillon qui sont des récepteurs gustatifs. Ils lui permettent également de capter les ondes aquatiques émises par ses proies. "
        , "Le silure possède des récepteurs gustatifs à l'intérieur de sa bouche."
        , "La ligne latérale du silure lui permet de détecter les vibrations aquatiques et dans l'air ambiant également. "
        , "Le silure possède des récepteurs olfactifs avec ses 4 narines. Elles lui confère un odorat très développé. Il peut par exemple détecter l'odeur d'une solution de 1mL dans 10 milliards de mL."
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
    pmorpho.style.color="white";

    const reset = document.createElement("button")
    reset.innerText = "Revenir à toutes les photos"
    reset.id = "reset"

    // Montage de l'html

    descriptionmorpho.appendChild(reset)
    descriptionmorpho.appendChild(imageClone)
    descriptionmorpho.appendChild(textmorpho)
    textmorpho.appendChild(pmorpho)
    morpholo.appendChild(descriptionmorpho)
    morpholo.style.justifyContent="flex-start";

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
        morpholo.style.justifyContent="center";
    });
}

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
  "1. Entre mai et juillet, c'est la periode de frai. Les mâles constituent un nid fait de racine et d'algues dans une zone peu profonde au niveau des berges. La femelle libère ses oeufs qui sont instantanément fécondés par le mâle.", 
  "2. Incubation – développement des œufs pendant 7 jours accrochés à la végétation du nid. Le nid est surveillé en permanence par le mâle qui se poste devant le nid",
  "3. Après 2 à 4 jours, les oeufs éclosent et les alevins qui en ressortent s'accrochent au nid par une ventouse au niveau de leur bouche. Pendant cette phase, ils se nourrissent de leur sac vitellin (masse noire sur la photo) qui se résorbe au fur et à mesure de la consommation. ",
  "4. 3 à 5 jours plus tard, l'alevin se décroche du nid. Il peut nager et se nourrir de zooplancton.",
  "5. Sa croissance est ensuite rapide : 20-30 cm en 1 an, maturité secuelle des mâles vers 3 à 5 ans pour une taille d'environ 60 à 80cm, maturité sexuelle des femelles vers 4 à 6 ans pour une taille d'environ 80cm à 1m."
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
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/nid_silure.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/oeufs_silure.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/embryon_silure.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/alevin_silure.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/petit_silure.webp'  
];

const picturenumber=[1,2,3,4,5]
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
  const p= document.createElement('p');
  p.textContent=picturenumber[i];
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

  infoBox.textContent="Cliquez sur une bulle pour découvrir les étapes de reproduction.";

  stepsDone = 0;
  stepsHistory = [];
  circle.style.strokeDashoffset = 1633

}

