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
    textmorpho.id = `textmorpho_${i}`
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
    });
}


