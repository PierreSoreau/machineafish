document.addEventListener("DOMContentLoaded", () => {
  const mediaPhone = window.matchMedia("(max-width: 575px)");
  const mediaTablet = window.matchMedia(
    "(min-width: 576px) and (max-width: 991px)",
  );
  const mediaDesktop = window.matchMedia("(min-width: 992px)");

  const container = document.getElementById("search-container");
  const logo_site = document.getElementById("logo1");
  const menu = document.getElementById("menu");
  const burgerButton = document.getElementById("menu_burger");
  const menubutton = document.querySelector(".fleche");
  const menuclosebutton = document.querySelector(".fa-xmark");
  const navmenu = document.getElementById("nav_menu");
  const searchbutton = document.getElementById("rechercher");
  const barrerecherche = document.getElementById("searchelement");
  const searchForm = document.querySelector("#search-container form");
  const button_navi = document.querySelectorAll(".navi1");

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

    searchbutton.addEventListener("click", (e) => {
      if (!barrerecherche.classList.contains("show")) {
        e.preventDefault(); // STOP ! On n'envoie pas le formulaire, ça évite qu'au clic du bouton recherche si la barre de recherche n'est pas visible
        // ça envoie un formulaire pour rien
        barrerecherche.classList.add("show");
        menu.classList.remove("show");
        logo_site.classList.remove("show");
        container.classList.add("show"); //le conteneur qui contient le logo recherche plus la barre de recherche prend une width de 100%
        barrerecherche.focus(); // sert à mettre le curseur directement dans la barre de recherche sans avoir besoin de cliquer dans la barre
      } else {
        if (barrerecherche.value.trim() === "") {
          e.preventDefault();
          barrerecherche.focus();
        } else {
        }
      }
    });

    // Au clic du menu burger affichage de la barre de menu verticale
    // Affichage de la croix pour fermer le menu

    burgerButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Empêche la fermeture immédiate par le document donc empêche de faire le addeventlistener d'en dessous

      // .toggle ajoute la classe si elle n'est pas là, et l'enlève si elle y est
      navmenu.classList.toggle("show");
      menubutton.classList.toggle("show");
      menuclosebutton.classList.toggle("show");
    });

    // --- Règle A : Fermeture du Menu Burger --- n'importe où ailleurs (fond du site)
    document.addEventListener("click", (e) => {
      // Si le clic n'est ni sur le menu, ni sur le bouton
      if (!navmenu.contains(e.target) && !burgerButton.contains(e.target)) {
        navmenu.classList.remove("show");
        menubutton.classList.add("show"); // Réaffiche le burger
        menuclosebutton.classList.remove("show"); // Cache la croix
      }

      // --- Règle B : Fermeture de la Recherche ---
      // Fermeture en cliquant n'importe où ailleurs (fond du site)
      // Si le clic n'est ni sur le logo rechercher, ni dans la barre de recherche
      if (
        !barrerecherche.contains(e.target) &&
        !searchbutton.contains(e.target) &&
        !searchForm.contains(e.target)
      ) {
        if (barrerecherche.classList.contains("show")) {
          barrerecherche.classList.remove("show");
          menu.classList.add("show");
          container.classList.remove("show");
          logo_site.classList.add("show");
        }
      }
    });
  }

  //-----------------------------------------------------------------------------------------------------------------------

  //------------------------------ANIMATION SUR TABLETTE------------------------------------------------------------------

  function comportementTablet() {
    resetElements();

    const container = document.getElementById("search-container");

    searchbutton.addEventListener("click", (e) => {
      if (!barrerecherche.classList.contains("show")) {
        e.preventDefault();
        barrerecherche.classList.add("show");
        logo_site.classList.remove("show");
        container.classList.add("show");
        navmenu.classList.remove("show_");
        barrerecherche.focus();
      } else {
        if (barrerecherche.value.trim() === "") {
          e.preventDefault();
          barrerecherche.focus();
        } else {
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (
        !barrerecherche.contains(e.target) &&
        !searchbutton.contains(e.target) &&
        !searchForm.contains(e.target)
      ) {
        if (barrerecherche.classList.contains("show")) {
          barrerecherche.classList.remove("show");
          container.classList.remove("show");
          navmenu.classList.add("show_");
          logo_site.classList.add("show");
        }
      }
    });

    // 1. On récupère l'URL complète de la page actuelle
    // ex: http://localhost/index.php?route=poissons
    //On pouvait pas faire au click ici parce que ça recharge la page ou ça met une autre page
    //donc ça remettrait à zero le js sinon donc on compare les liens
    const urlActuelle = window.location.href;

    button_navi.forEach((lien) => {
      if (lien.href === urlActuelle) {
        lien.classList.add("white");
      } else {
        lien.classList.remove("white");
      }
    });
  }

  //-----------------------------------------------------------------------------------------------------------------------

  //------------------------------ANIMATION SUR ORDINATEUR------------------------------------------------------------------

  function comportementDesktop() {
    // On nettoie les clics pour éviter des bugs si on passe de tablette à ordi
    resetElements();
    barrerecherche.focus();
    searchbutton.addEventListener("click", (e) => {
      if (barrerecherche.value.trim() === "") {
        e.preventDefault();
      } else {
      }
    });

    // 1. On récupère l'URL complète de la page actuelle
    // ex: http://localhost/index.php?route=poissons
    //On pouvait pas faire au click ici parce que ça recharge la page ou ça met une autre page
    //donc ça remettrait à zero le js sinon donc on compare les liens
    const urlActuelle = window.location.href;

    button_navi.forEach((lien) => {
      if (lien.href === urlActuelle) {
        lien.classList.add("white");
      } else {
        lien.classList.remove("white");
      }
    });
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
  mediaPhone.addEventListener("change", handleResize);
  mediaTablet.addEventListener("change", handleResize);
  mediaDesktop.addEventListener("change", handleResize);

  //----------------------------------------------------------------------------------
});
