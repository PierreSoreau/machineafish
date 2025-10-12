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
