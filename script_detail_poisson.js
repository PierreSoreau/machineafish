//---------------------------VISUEL MENU NAVIGATION (au clic le bouton devient blanc)---------------------------------

const buttons = document.querySelectorAll('.filter-btn');

buttons.forEach(button => {

    button.addEventListener('click', () => {

        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');
    });

});

//------------------------------------------------------------------------------------------------------------
//---------------------------AFFICHAGE CONTENU ECRIT MORPHOLOGIE (au clic des images bulles)---------------------------------

const container = document.getElementById("morpho_container")
const fleche = document.getElementById("resetBtn")

container.addEventListener("click", function (e) {

    container.classList.add("mode-focus");


    if (window.innerWidth < 992) return;

    const containerphoto = e.target.closest(".photo_morpho")//Cherche l'élément photo_morpho le plus proche en partant de l'endroit 
    // où j'ai cliqué et en remontant vers les parents.

    if (!containerphoto) return;//dans le cas où tu cliques entre 2 conteneur de photos

    container.querySelectorAll(".photo_morpho").forEach(morpho => {

        const description = morpho.querySelector(".description");
        

        if (containerphoto === morpho) {
            morpho.classList.add("active");
            description.style.display = "flex";
            fleche.style.display = "flex";

        }

        else {
            // toute les autres div disparaissents
            morpho.classList.remove("active");            
            morpho.style.display = "none";
            description.style.display = "none";
            
        }


    })

});

fleche.addEventListener("click", function (e) {

    fleche.style.display = "none";
    container.classList.remove("mode-focus");
    

    container.querySelectorAll('.photo_morpho').forEach(morpho => {

        const description = morpho.querySelector(".description");

        morpho.style.display = ""; 
        
        // On enlève la classe active
        morpho.classList.remove("active");

        // On recache la description
        if (description) {
            description.style.display = "none";
        }



    })
});





















