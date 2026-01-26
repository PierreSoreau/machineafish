
const mediaPhone = window.matchMedia("(max-width: 575px)");
const mediaTablet = window.matchMedia("(min-width: 576px) and (max-width: 991px)");
const mediaDesktop = window.matchMedia("(min-width: 992px)");


const container = document.getElementById("search-container")
const logo_site = document.getElementById("logo1");
const menu = document.getElementById("menu");
const burgerButton=document.getElementById("menu_burger");
const menubutton = document.querySelector(".fleche");
const menuclosebutton = document.querySelector(".fa-xmark");
const navmenu = document.getElementById("nav_menu");
const searchbutton = document.getElementById("rechercher");
const barrerecherche = document.getElementById("searchelement");

//------------------------------ AFFICHAGE PAR DEFAUT DES ELEMENTS DU HEADER----------------------------------------------------

function resetElements() { 
logo_site.style.display = "";
menu.style.display = "";
container.style.display = "";
navmenu.style.display = "";
menuclosebutton.style.display = "";
menubutton.style.display = "";
}

//-----------------------------------------------------------------------------------------------------------------------
//------------------------------ANIMATION SUR TELEPHONE------------------------------------------------------------------

function comportementPhone() {

resetElements();

// Au clic du bouton loupe, affichage barre de recherche 
// Masquage du menu burger et logo du site
// Curseur directement dans barre de recherche

searchbutton.addEventListener("click", () => {
barrerecherche.classList.add("show");
menu.classList.remove('show');
logo_site.classList.remove('show');
container.classList.add("show");//le conteneur qui contient le logo recherche plus la barre de recherche prend une width de 100%
barrerecherche.focus(); // sert à mettre le curseur directement dans la barre de recherche sans avoir besoin de cliquer dans la barre

});

// Au clic du menu burger affichage de la barre de menu verticale
// Affichage de la croix pour fermer le menu

burgerButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate par le document donc empêche de faire le addeventlistener d'en dessous
        
        // .toggle ajoute la classe si elle n'est pas là, et l'enlève si elle y est
        navmenu.classList.toggle('show');
        menubutton.classList.toggle('show');
        menuclosebutton.classList.toggle('show');
    });

// Fermeture en cliquant n'importe où ailleurs (fond du site)
document.addEventListener("click", (e) => {
// Si le clic n'est ni sur le menu, ni sur le bouton
if (!navmenu.contains(e.target) && !burgerButton.contains(e.target) ) {
navmenu.classList.remove('show');
menubutton.classList.add('show');// Réaffiche le burger
menuclosebutton.classList.remove('show');// Cache la croix

};
});

// Fermeture en cliquant n'importe où ailleurs (fond du site)
document.addEventListener("click", (e) => {
// Si le clic n'est ni sur le logo rechercher, ni dans la barre de recherche
  if (! barrerecherche.contains(e.target) && ! searchbutton.contains(e.target)) {
barrerecherche.classList.remove("show");
menu.classList.add('show');
container.classList.remove("show");
logo_site.classList.add('show');
}
});
}

//-----------------------------------------------------------------------------------------------------------------------

//------------------------------ANIMATION SUR TABLETTE------------------------------------------------------------------

function comportementTablet() {

resetElements();

const container = document.getElementById("search-container");


searchbutton.addEventListener("click", () => {
barrerecherche.classList.add("show");
logo_site.classList.remove('show');
container.classList.add("show");
navmenu.classList.remove("show_");

});


document.addEventListener("click", (e) => {
if (! barrerecherche.contains(e.target) && ! searchbutton.contains(e.target)) {
barrerecherche.classList.remove("show");
container.classList.remove("show");
navmenu.classList.add('show_');
logo_site.classList.add('show');
}
});
}

//-----------------------------------------------------------------------------------------------------------------------

//------------------------------ANIMATION SUR ORDINATEUR------------------------------------------------------------------

function comportementDesktop() {
resetElements();
}

//-----------------------------------------------------------------------------------------------------------------------

//fonction qui permet d'activer l'une des 3 fonctions au dessus en fonction de la taille de l'écran 
//.matches est une fonctionnalité native de js
function handleResize() {
if (mediaPhone.matches) {
comportementPhone();
} else if (mediaTablet.matches) {
comportementTablet();
} else if (mediaDesktop.matches) {
comportementDesktop();
}
}

handleResize();


//permet de changer d'affichage(format téléphone ou ordi ou tablette) 
// en fonction du format de l'écran du site sur l'ordi 
// par exemple il réduit de moitié l'écran parce qu'il veut voir autre chose sur son écran le navigateur plus excel par exemple 
mediaPhone.addEventListener("change",handleResize);
mediaTablet.addEventListener("change",handleResize);
mediaDesktop.addEventListener("change",handleResize);




//--------RECHERCHE ELEMENTS SUR SITE VIA BARRE DE RECHERCHE-------------------

//Constante qui comprend l'url qui amène aux données de supabase 
/*const urlJSON = "https://dbaqpiukoronlivotpcl.supabase.co/storage/v1/object/public/public-data//keywords.json"; 
let index = {};

//Fonction qui permet de rechercher et d'afficher une page correspondant à un mot-clé tapé par l'utilisateur dans la barre de recherche
function lancerRechercheGlobale() {
  //query est la contante qui stocke les données écrites dans la barre de recherche par l'utilisateur
  //trim() fonction qui enlève les espaces avant et après l'écrit de l'utilisateur
  //toLowerCase() fonction qui transforme en minuscule l'écrit de l'utilisateur
  const query = document.getElementById("searchelement").value.trim().toLowerCase();
  //Si l'utilisateur n'a rien renseigné dans la barre de recherche rien n'est fait 
  if (!query) return;

  //Tableau qui stocke le nom des pages html
  const pagesCorrespondantes = [];

  //Boucle for qui inspecte l'ensemble des mots présents dans la constante index
  //et le if affiche la première page présente dans le tableau pagesCorrespondantes 
  for (const page in index) {
    const mots = index[page];
    if (mots.some(mot => mot.includes(query))) {
      pagesCorrespondantes.push(page);
    }
  }

  if (pagesCorrespondantes.length > 0) {
    console.log("Pages trouvées :", pagesCorrespondantes);
    window.location.href = pagesCorrespondantes[0]; // 🔁 ou afficher la liste
  } 
  
  else {
    alert("Aucune page trouvée pour : " + query);
  }
}

//Fonction qui permet d'afficher à l'écran la recherche que l'utilisateur a demandé dans la barre de recherche 
//Elle est asynchrone (async) parce qu'elle passe par des étapes qui sont longues à charger par l'ordinateur
//Du coup, chaque étape de la fonction qui demande du temps doit avoir un await devant elle
//Tant que l'étape avec le await n'est pas finalisée la fonction ne passe pas à l'étape suivante 
//Grâce à ça on évite des messages d'erreur dans la console   
async function chargerRecherche() {
  //try recense l'ensemble des actions à effectuer de la fonction mais sans les conditions en cas d'erreur
  try {
    //Ces 3 lignes permettent de mettre le nav.html dans une div d'un document html qui a en id "nav-placeholder"
    //Cela permet de modifier le nav et qu'il soit appliqué sur l'ensemble des docs html qui ont id "nav-placeholder"
    //Cela évite de faire des copier coller dans les html à chaque modif de nav 
    //Ces lignes doivent être dans la fonction chargerRecherche et pas en dehors car sinon la fonction se lancerait sans que le nav soit affiché  
    const navRes = await fetch('nav.html');
    const navHTML = await navRes.text();
    document.getElementById('nav-placeholder').innerHTML = navHTML;

    //Récupération du fichier json dans supabase + transformation du fichier en json
    const jsonRes = await fetch(urlJSON);
    index = await jsonRes.json();

    //Permet de lancer concrètement la recherche via la fonction lancerRechercheGlobale  
    //Lorsque l'utilisateur a renseigné quelque chose dans la barre et qu'il a appuyé sur le bouton recherche ou appuyé sur entrée 
    //,la fonction lancerRechercheGlobale se lance
    const input = document.getElementById("searchelement");
    const bouton = document.getElementById("rechercher");
    if (input && bouton) {
      bouton.addEventListener("click", lancerRechercheGlobale);
      input.addEventListener("keypress", e => {
        if (e.key === "Enter") lancerRechercheGlobale();
      });
    }

  } 
  
  //catch recense les situations en cas d'erreur dans le code
  //Là s'il y a une erreur de code, dans la console il s'affichera erreur lors du chargement...
  catch (err) {
    console.error("Erreur lors du chargement :", err);
  }
}

//La fonction chargerRecherche est lancée uniquement quand tous les éléments écrits des pages sont chargés
document.addEventListener("DOMContentLoaded", chargerRecherche);

//----------------------------------------------------------------------------------*/


