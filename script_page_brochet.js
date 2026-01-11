document.addEventListener('DOMContentLoaded', () => {




  //---------------------------VISUEL MENU NAVIGATION---------------------------------

  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(button => {

    button.addEventListener('click', () => {

      buttons.forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');      
  });

});

  //--------AFFICHER DETAILS EXPLICATION PHOTO MORPHOLOGIE AU CLIQUE SUR L'IMAGE------

  //Cette fonction permet d'afficher le détail de l'explication d'une morpho au clique sur l'image et fait disparaître les autres 
  const container1 = document.getElementById("morpho_container");
  const resetbutton = document.getElementById("resetBtn");

  let activephoto = null;

  container1.addEventListener("click", e => {
    if (window.innerWidth < 992) return; // Ne rien faire sur mobile

    const photo = e.target.closest('.photo_morpho');

    if (!photo) return;

    if (activephoto === photo) return;

    activephoto = photo;

    container1.querySelectorAll(".photo_morpho").forEach(el => {
      const boxMorpho = el.querySelector("#box_morpho");
      if (el === photo) {
        el.classList.add("expanded");
        el.querySelector(".description").style.display = "block";
        el.querySelectorAll(".morpho").forEach(img => img.style.display = "block");
        photo.prepend(resetbutton); //resetbouton placé tout au début de la div expanded


        if (boxMorpho) {
          boxMorpho.style.flexDirection = "column";
        }

      }


      else {
        el.classList.remove("expanded");
        el.querySelector(".description").style.display = "none";
        el.querySelectorAll(".morpho").forEach(img => img.style.display = "none");
      }


    });

    resetbutton.style.display = 'inline-block';
    resetbutton.classList.add("expanded1");

  });


  resetbutton.addEventListener('click', (e) => {
    activephoto = null;
    //Empêche le clic de relancer l'ouverture de la photo
    e.stopPropagation();

    container1.querySelectorAll('.photo_morpho').forEach(ele => {
      ele.style.display = "block";
      ele.classList.remove("expanded");
      ele.querySelectorAll(".morpho").forEach(img => img.style.display = "block");
      ele.querySelector(".description").style.display = "none";


      const boxMorphoReset = ele.querySelector("#box_morpho");
      if (boxMorphoReset) {
        boxMorphoReset.style.flexDirection = "row";
      }
    });

    resetbutton.style.display = 'none'; // cacher le bouton reset
  });

  //---------------------------------------------------------------------------------

  //------------------AFFICHER LE GRAPHIQUE DU COURANT-------------------------------

  const courant = document.getElementById('jauge_courant').getContext('2d');


  new Chart(courant, {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    data: {
      labels: ['Lent', 'Modéré', 'Rapide'],
      datasets: [{
        data: [1, 1, 1],
        backgroundColor: ['#2ecc71', '#ffffff', '#ffffff'],
        borderWidth: 0,
        hoverOffset: 10, //permet de zoomer au survol de la zone
        datalabels: {
          color: ['#ffffff', '#000000', '#000000'],
          anchor: 'center',
          align: 'center',
          font: function (context) {
            // On récupère la largeur du graphique
            const width = context.chart.width;

            // On calcule une taille proportionnelle
            // Exemple : si le graph fait 400px, size sera de 12px
            // On peut ajouter une limite minimale avec Math.max
            const size = Math.round(width / 32);

            return {
              weight: 'bold',
              size: size < 10 ? 10 : size // Jamais plus petit que 10px
            };
          },

          formatter: (value, context) => {
            return context.chart.data.labels[context.dataIndex]; //context.chart veut dire applique la fonction au graphique et data.labels récupère la liste des labels en haut et les associe dans l'ordre
          }
        }
      }]
    },
    options: {
      layout: {
        padding: {
          // On laisse de la place partout pour le hoverOffset
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      cutout: '70%', // plus le pourcentage est élevé plus l'épaisseur du cercle est élevé
      rotation: -90, //permet d'avoir un demi cercle au lieu d'un cercle entier
      circumference: 180,//permet d'avoir un demi cercle au lieu d'un cercle entier
      plugins: {
        legend: { display: false }, //retire la légende de base située en dessous du cercle
        tooltip: { enabled: false } //retire la fenêtre qui s'affiche quand on met la souris dessus
      }
    }




  });

  // 2. Animation de l'aiguille
  const needle = document.getElementById('needle');
  const courantTarget = 10; // le courant cible

  // Calcul de l'angle (0% de courant = -90deg, 100% de courant = +90deg)
  const angle = (courantTarget / 100) * 180 - 90;

  // On lance l'animation après un court délai. Après 500 ms l'aiguille se décale jusqu'à courantTarget
  setTimeout(() => {
    needle.style.transform = `rotate(${angle}deg)`;
  }, 500);



  //---------------------------------------------------------------------------------

  //--------------------------AFFICHER GRAPHIQUE TEMPERATURE-------------------------

  const ctx = document.getElementById('pikeGauge').getContext('2d');


  new Chart(ctx, {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    data: {
      labels: ['Léthale', 'Acceptable', 'Idéale', 'Acceptable', 'Léthale'],
      datasets: [{
        data: [10, 26, 36, 18, 10],
        backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71', '#f39c12', '#e74c3c'],
        borderWidth: 0,
        hoverOffset: 10,
        datalabels: {
          color: '#ffffff',
          anchor: 'center',
          align: 'center',
          font: function (context) {
            // On récupère la largeur du graphique
            const width = context.chart.width;

            // On calcule une taille proportionnelle
            // Exemple : si le graph fait 400px, size sera de 12px
            // On peut ajouter une limite minimale avec Math.max
            const size = Math.round(width / 32);

            return {
              weight: 'bold',
              size: size < 10 ? 10 : size // Jamais plus petit que 10px
            };
          },

          formatter: (value, context) => {
            return context.chart.data.labels[context.dataIndex];
          }
        }
      }]
    },
    options: {
      layout: {
        padding: {
          // On laisse de la place partout pour le hoverOffset
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

});



//---------------------------------------------------------------------------------

//--------AFFICHER LES PHOTOS DES SPOTS DE PECHE EN FONCTION DU VOLET DEROULANT CHOISI------

function changerVisuel() {

  // On cherche l'input "saison" qui est coché (checked)
  const radioSelectionne = document.querySelector('input[name="saison"]:checked');
  const saison = radioSelectionne ? radioSelectionne.value : "printemps_ete_automne"; //si radioselecionne n'est pas nul alors ça prend la valeur sélectionné sinon ça prend la valeur "printemps_ete_automne"

  const visuelspotpea = document.getElementById("visuelspotpea");
  const visuelspoth = document.getElementById("visuelspoth");

  // On cache tout par défaut
  visuelspotpea.style.display = "grid";
  visuelspoth.style.display = "none";

  // On affiche selon le choix
  if (saison === "printemps_ete_automne") {
    visuelspotpea.style.display = "grid";
    visuelspoth.style.display = "none"
  }
  else {
    visuelspoth.style.display = "grid";
    visuelspotpea.style.display = "none";
  }
}

changerVisuel();

//-----------------------------------------------------

//--------AFFICHER LES PHOTOS DES POISSONS BLANCS------

function changeSlide(element, direction) {
  // 1. On trouve le conteneur parent du bouton cliqué
  const container = element.closest('.carousel-container');

  // 2. On récupère TOUS les slides de CE conteneur uniquement
  const slides = container.querySelectorAll('.slide');

  // 3. On cherche lequel est actuellement affiché
  let currentIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.classList.contains('active')) {
      currentIndex = index;
    }
  });

  // 4. On retire le mode actif du slide actuel
  slides[currentIndex].classList.remove('active');

  // 5. On calcule le nouvel index avec la boucle (début/fin)
  let newIndex = currentIndex + direction;
  if (newIndex >= slides.length) newIndex = 0;
  if (newIndex < 0) newIndex = slides.length - 1;

  // 6. On affiche le nouveau slide
  slides[newIndex].classList.add('active');
}

//----------------------------------------------------------------------------------------

const stepsData = [
  { title: "La Migration", desc: "1. Entre février et avril, les mâles et les femelles à maturité sexuelle migrent vers les zones de frai.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/migration_vers_frayere.webp" },
  { title: "L'Accouplement", desc: "2. Le mâle suit la femelle et libère sa laitance.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/reproduction_brochet_frayere.webp" },
  { title: "La Ponte", desc: "3. Ponte des œufs à 7°C-11°C. Les œufs se collent sur la végétation.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/oeufs_brochets.webp" },
  { title: "L'Incubation", desc: "4. Développement des œufs pendant 10-15 jours, naissance d'alevins avec ventouse.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/Alevin_accroche_avec_vesicule_vitelline.webp" },
  { title: "Le Brocheton", desc: "5. Après 10 jours, l'alevin se décroche et peut nager.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/Brocheton.webp" },
  { title: "La Migration", desc: "6. En mai, le brocheton migre vers des zones calmes et végétalisées.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/herbiers.webp" },
  { title: "La Croissance", desc: "7. Croissance rapide : 20-30 cm en 1 an, maturité sexuelle pour les mâles 2 à 3 ans pour une taille entre 30 et 40cm, pour les femelles 3 à 5 ans pour une taille entre 45 et 55cm.", img: "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/brochet_cycle.webp" }
];

function showStep(index) {
  const bulles = document.querySelectorAll('.step-bulle');
  const fill = document.getElementById('barFill');

  // 1. Animation de la barre
  const progress = (index / (bulles.length - 1)) * 100;
  fill.style.height = progress + "%";

  // 2. Update des bulles
  bulles.forEach((b, i) => {
    if (i <= index) b.classList.add('active');
    else b.classList.remove('active');
  });

  // 3. Changement du texte avec un petit effet
  const content = document.getElementById('stepContent');
  content.style.opacity = 0;

  setTimeout(() => {
    document.getElementById('stepTitle').innerText = stepsData[index].title;
    document.getElementById('stepDesc').innerText = stepsData[index].desc;
    document.getElementById('stepImage').src = stepsData[index].img;
    content.style.opacity = 1;
  }, 200);
}
/*
//--------AFFICHER VISUELS ET CONTENU ECRITS DES ETAPES DE REPRODUCTION-------------------
 
const stepsHistory = [];
const infos = [
  "1. Entre février et avril, les mâles et les femelles à maturité sexuelle migrent vers les zones de frai.",
  "2. Accouplement – le mâle suit la femelle et libère sa laitance.",
  "3. Ponte des œufs à 7°C-11°C. Les œufs se collent sur la végétation.",
  "4. Incubation – développement des œufs pendant 10-15 jours, naissance d'alevins avec ventouse.",
  "5. Après 10 jours, l'alevin se décroche et peut nager.",
  "6. En mai, le brocheton migre vers des zones calmes et végétalisées.",
  "7. Croissance rapide : 20-30 cm en 1 an, maturité sexuelle pour les mâles 2 à 3 ans pour une taille entre 30 et 40cm, pour les femelles 3 à 5 ans pour une taille entre 45 et 55cm."
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
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/migration_vers_frayere.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/reproduction_brochet_frayere.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/oeufs_brochets.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/Alevin_accroche_avec_vesicule_vitelline.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/Brocheton.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/herbiers.webp',
  'https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/images_leurres/brochet_cycle.webp'
];
 
const picturenumber = [1, 2, 3, 4, 5, 6, 7]
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
/*
 
//--------FILTRER LE VISUEL LEURRES/ANIMATIONS EN FONCTION DE LA SAISON ET DE LA PROFONDEUR-------------------
 
 
 
const supabaseClient = supabase.createClient(
  "https://dbaqpiukoronlivotpcl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiYXFwaXVrb3Jvbmxpdm90cGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Nzc1NDEsImV4cCI6MjA2NjQ1MzU0MX0.7kXwZJDAOHZ5Ov9fehi3ORm5nqVDfE_xWfQY_C1FYro"
);//Fait le lien entre mon projet supabase et les codes
 
console.log("Client Supabase initialisé :", supabaseClient);
 
//Fonction qui permet d'afficher le visuel des leurres 
function afficherleurres(leurres) {
  const div = document.getElementById('filtre_leurre');
  if (!div) return;
  div.innerHTML = '';
  //Pour chaque ligne du tableau leurre on affiche les div suivantes présentes dans la div filtre leurre
  leurres.forEach(l => {
    div.innerHTML += `
    <div class="Leurre">
      <h3>${l.nom}</h3>
      <div class="visuel_animation_leurre">
        <div class="leurre" style="background-image: url('${l.image}');">
          <h3>Visuel du leurre</h3>
        </div>
        <div class="leurre">
          <video autoplay muted loop playsinline preload="auto" class="animation">
            <source src="${l.video_animation_leurre}" type="video/mp4"/>
            Votre navigateur ne supporte pas la vidéo
          </video>
          <h3>Animation du leurre: ${l.animation}</h3>
        </div>
        <div class="leurre">
          <video autoplay muted loop playsinline preload="auto" class="animation">
            <source src="${l.video_animation_canne}" type="video/mp4"/>
            Votre navigateur ne supporte pas la vidéo
          </video>
          <h3>Animation de la canne: ${l.animation}</h3>
        </div>
      </div>
    </div>
  `;
  });
}
/*
//Fonction qui permet de relever les données de saison et profondeur filtrées sur le site et de prendre les données supabase associées à ces filtres
//puis d'afficher le visuel/animation des leurres via la fonction afficherleurres()
async function filtre() {
  const profondeur = document.getElementById('profondeur').value;
  const saison = document.getElementById('saison').value;
  if (!profondeur) return;
  if (!saison) return;
 
  let query = supabaseClient.from('leurres_brochet').select('*');
 
  if (profondeur) {
    query = query.contains('profondeur', [profondeur])//Les lignes de ma table supabase contenant la valeur surface par ex présente dans la colonne profondeur de supabase
    //'profondeur' c'est le nom de la colonne dans supabase et [profondeur] c'est le contenu de la colonne
  };
  if (saison) {
    query = query.contains('saison', [saison])//Les lignes de ma table supabase contenant la valeur saison filtrée présente dans la colonne saison
  };
 
  const { data, error } = await query; //Là on a un await pour le query parce que si on a pas cette donnée on pourra pas lancer afficherleurres correctement donc faut être sûr d'avoir data avat de lancer la fonction
 
  if (error) {
    console.error(error);
    return;
  }
 
  //Fonction qui permet d'afficher le visuel/animation des leurres représentant les lignes data
  afficherleurres(data);
}
  */
















