//--------- VISUEL PARTIE MORPHOLOGIE-------------------

function morphodescriptiontext(name, i) {
    const image = document.getElementById(name)
    const morpholo = document.getElementById("morpholo")
    const images = document.querySelectorAll(".image_perche")



    const existing = document.getElementById("descriptionmorpho");
    if (existing && existing.dataset.name === name) return;

    const morpho = ["Les nageoires dorsales de la perche sont pointues à leur extremité lorsqu'elles sont déployées. Cela lui permet de dissuader les prédateurs de l'avaler. Attention donc à manipuler la perche avec des gants sinon c'est la coupure assurée."        
        , "Ses nageoires pelviennes, anales et caudales sont orangées. Les mâles qui ont des nageoires à l'orange très vif vont plus être choisi par les femelles pour le frai car c'est gage de bonne santé. Cette couleur orange permet aussi aux perches de se reconnaitre entre elles."
        , "La coloration générale de la perche (dos vert-olive, flancs verts clairs avec bandes noires verticales) lui sert de camouflage face aux proies ou aux prédateurs dans les herbiers ou dans l'ombre ou en banc notamment."
        , "Tout comme le brochet la perche présente un corps fuselé qui lui permet de faire des attaques fulgurantes sur ses proies."
        , "La perche possède une ligne latérale très visible sur tout la longueur de ses flancs. Elle a pour fonction de capter les vibrations et déplacements d'eau environnants provoqués par les proies ou les obstacles. Elle peut donc même chasser en eau trouble."
        , "La perche possède également une excellente vue presque panoramique. Elle a notamment une très bonne perception des contrastes (une proie en mouvement sur fond sableux par exemple)."
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

//-------------VISUEL PARTIE REPRODUCTION---------------------------------

const stepsHistory = [];

const infos = [
  "1. Entre mars et mai, c'est la periode de frai. La femelle libère ses oeufs sous une forme de ruban. Le ruban est déposé sur des racines, des branches ou des plantes dans zone peu profonde avec une eau vers les 7-8 degrés. Ces oeufs sont instantanément fécondés par les mâles présents dans la zone en libérant leur laitance.",
  "2. Après 2 à 3 semaines d'incubation , les oeufs éclosent et les alevins qui en ressortent s'accrochent au nid par une ventouse au niveau de leur bouche. Pendant cette phase, ils se nourrissent de leur sac vitellin (masse noire sur la photo) qui se résorbe au fur et à mesure de la consommation. ",
  "3. Quelques jours plus tard, l'alevin se décroche du nid. Il peut nager et se nourrir de zooplancton.",
  "4. Au bout d'un an la perche mesure 4 à 6cm. La maturité secuelle des mâles se situe vers 1 à 2 ans contre 2 à 4 ans pour les femelles pour une taille entre 15 et 25cm."
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
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/oeufs_perche.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/alevin_perche_sac_vitellin.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/alevin_perche.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/petite_perche.webp',
    
];

const picturenumber=[1,2,3,4]
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

