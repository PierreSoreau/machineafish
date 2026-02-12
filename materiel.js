//FONCTION POUR AFFICHER LES POPUPS AU CLIC D'UN LOGO OU IMAGE

function displayPopup(displaybuttons, affichageblur) {
  displaybuttons.forEach((displaybutton) => {
    const datatarget = displaybutton.getAttribute("data-target");
    displaybutton.addEventListener("click", () => {
      document.getElementById(datatarget).style.display = "block";
      affichageblur.style.display = "block";
    });
  });
}

//FONCTION POUR FERMER LES POPUPS AVEC LE LOGO CROIX

function closePopupByCross(classpopup, nameclosebuttons, affichageblur) {
  nameclosebuttons.forEach((nameclosebutton) => {
    nameclosebutton.addEventListener("click", () => {
      document.querySelectorAll(classpopup).forEach((e) => {
        e.style.display = "none";
      });
      affichageblur.style.display = "none";
    });
  });
}

//FONCTION POUR FERMER LES POPUPS AVEC LE BACKGROUND

function closePopupByBackground(affichageblur, classpopups) {
  affichageblur.addEventListener("click", () => {
    classpopups.forEach((classpopup) => {
      classpopup.style.display = "none";
    });
    affichageblur.style.display = "none";
  });
}

const ibutton = document.querySelectorAll(".infos");
const closebuttons = document.querySelectorAll(".fa-xmark");
const blur_display = document.querySelector(".blur-overlay");
const allcontenuinfos = document.querySelectorAll(".infos-box");
const popupleurres = document.querySelectorAll(".popup-leurres");
const photoleurres = document.querySelectorAll(".leurre-box");

//-------------------------------------------------------------------------
//POPUP INFORMATIONS CANNES/MOULINET/FIL
//-------------------------------------------------------------------------

//AFFICHAGE DES POPUPS INFORMATIONS CANNES/MOULINET/FIL AU CLIC DU LOGO INFO

displayPopup(ibutton, blur_display);

//FERMETURE DES POPUPS INFORMATIONS CANNES/MOULINET/FIL PAR LA CROIX

closePopupByCross(".infos-box", closebuttons, blur_display);

//FERMETURE DES POPUPS INFORMATIONS CANNES/MOULINET/FIL PAR LE FOND D'ECRAN

closePopupByBackground(blur_display, allcontenuinfos);

//-------------------------------------------------------------------------
//POPUP INFORMATIONS LEURRES
//-------------------------------------------------------------------------

//AFFICHAGE DU POPUP INFORMATION DU LEURRE AU CLIC DE LA BOX DU LEURRE

displayPopup(photoleurres, blur_display);

//FERMETURE DES POPUPS INFORMATIONS LEURRES PAR LA CROIX

closePopupByCross(".popup-leurres", closebuttons, blur_display);

//FERMETURE DES POPUPS INFORMATIONS LEURRES PAR LE FOND D'ECRAN

closePopupByBackground(blur_display, popupleurres);
