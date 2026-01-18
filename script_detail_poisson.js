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

//------------------AFFICHER LE GRAPHIQUE DU COURANT-------------------------------

const vitesse_courant = {
    perche: "lent"
    , brochet: "lent"
    , sandre: "lent"
    , silure: "lent"
}

let backgroundColors = [];
let textcolor = [];

const vitesse = vitesse_courant[poissonactuel.toLowerCase()];

//les différents cas de figure des couleurs du graphique en fonction du type de courant dans lequel est adapté le poisson

switch (vitesse) {

    case 'lent':
        backgroundColors = ['#2ecc71', '#ffffff', '#ffffff'];
        textcolor = ['#ffffff', '#000000', '#000000'];
        break;

    case 'modéré':
        backgroundColors = ['#ffffff', '#2ecc71', '#ffffff'];
        textcolor = ['#000000', '#ffffff', '#000000'];
        break;

    case 'rapide':
        backgroundColors = ['#ffffff', '#ffffff', '#2ecc71'];
        textcolor = ['#000000', '#000000', '#ffffff'];
        break;

    default:
        // Cas par défaut (tout gris par exemple)
        backgroundColors = ['#ecf0f1', '#ecf0f1', '#ecf0f1'];
        textcolor = ['#000000', '#000000', '#000000'];
}





const courant = document.getElementById('jauge_courant').getContext('2d');

new Chart(courant, {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    data: {
        labels: ['Lent', 'Modéré', 'Rapide'],
        datasets: [{
            data: [1, 1, 1],
            backgroundColor: backgroundColors,
            borderWidth: 0,
            hoverOffset: 10, //permet de zoomer au survol de la zone
            datalabels: {
                color: textcolor,
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


//---------------------------------------------------------------------------------

//--------------------------AFFICHER GRAPHIQUE TEMPERATURE-------------------------

const ctx = document.getElementById('jauge_temperature').getContext('2d');


new Chart(ctx, {
    type: 'doughnut',
    plugins: [ChartDataLabels],
    data: {
        labels: ['Léthale', 'Acceptable', 'Idéale', 'Acceptable', 'Léthale'],
        datasets: [{
            data: [10, 20, 30, 20, 10],
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

//----------------------------------------------------------------------------------------------------------
//--------------------------AFFICHER SPOT DE PECHE EN FONCTION DE LA SAISON---------------------------------

const pea=document.getElementById("saison-pea")
const hiver=document.getElementById("saison-hiver")

pea.addEventListener("click",function(){
    document.querySelectorAll(".pea").forEach(function(e){

        e.style.display="flex"


    })
    document.querySelectorAll(".hiver").forEach(function(e){

        e.style.display="none"


    })

})

hiver.addEventListener("click",function(){
    document.querySelectorAll(".pea").forEach(function(e){

        e.style.display="none"


    })
    document.querySelectorAll(".hiver").forEach(function(e){

        e.style.display="flex"


    })
})



//---------------------------------------------------------------------------------
























