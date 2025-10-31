
//-----------------------------------------------------------------------------

async function chargerNavetRecherche() {
  try {
    //Ces 3 lignes permettent de mettre le nav.html dans une div d'un document html qui a en id "nav-placeholder"
    //Cela permet de modifier le nav et qu'il soit appliqué sur l'ensemble des docs html qui ont id "nav-placeholder"
    //Cela évite de faire des copier coller dans les html à chaque modif de nav 
    //Ces lignes doivent être dans la fonction chargerRecherche et pas en dehors car sinon la fonction se lancerait sans que le nav soit affiché  
    const navRes = await fetch('nav.html');
    const navHTML = await navRes.text();
    document.getElementById('nav-placeholder').innerHTML = navHTML;

    const searchInput = document.getElementById("searchelement");
    const searchBtn = document.getElementById("rechercher");
    const navMenu = document.getElementById("navigation");

    function toggleSearchAndMenu() {
      searchInput.classList.toggle("show-search");
      if (!searchInput.classList.contains("show-search")) {
        navMenu.classList.remove("menu-hidden");
      } else {
        navMenu.classList.add("menu-hidden");
        searchInput.focus();
      }
    }

    // Clic sur la loupe
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleSearchAndMenu();
    });

    // Clic en dehors → ferme la barre et montre le menu
    document.addEventListener("click", (e) => {
      const clickedInside = searchInput.contains(e.target) || searchBtn.contains(e.target);
      if (!clickedInside) {
        searchInput.classList.remove("show-search");
        navMenu.classList.remove("menu-hidden");
      }
    });
  } catch (error) {
    console.error("Erreur lors du chargement du nav :", error);
  }

}

chargerNavetRecherche();


//--------AFFICHER FOOTER------------------------------------------------------

//Ces 3 lignes permettent de mettre le footer.html dans une div d'un document html qui a en id "footer-placeholder"
//Cela permet de modifier le footer et qu'il soit appliqué sur l'ensemble des docs html qui ont id "footer-placeholder"
//Cela évite de faire des copier coller dans les html à chaque modif de footer 

async function chargerFooter() {
  try {
    const footerRes = await fetch('footer.html');
    const footerHTML = await footerRes.text();
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
  } catch (error) {
    console.error("Erreur lors du chargement du footer :", error);
  }
}

chargerFooter();

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

//--------AFFICHAGE/DISPARITION MENU DEEROULANT POUR VISUEL FORMAT TELEPHONE-------------------------------
function toggleMenu() {
  const menu = document.getElementById("menudéroulant");
  menu.classList.toggle("caché");
}

//-----------------------------------------------------------------------------

//--------AFFICHAGE/DISPARITION BARRE DE RECHERCHE-------------------------------


