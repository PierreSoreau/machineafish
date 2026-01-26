<?php

class UserController extends AbstractController
{

    public function home(): void
    {
        $url = new UrlManager;
        $dataPoisson = new PoissonManager;

        $extensionimage = $url->findExtensionByType("image");
        $contenuimage = $url->findContenuByType("image");
        $extensionvideo = $url->findExtensionByType("video");
        $contenuvideo = $url->findContenuByType("video");
        $videopage = $url->findVideoByPage("accueil");
        $imagematos = $url->findImageByTheme("materiel");
        $imagetuto = $url->findImageByTheme("tutos");
        $photoPoisson = $dataPoisson->findByName("brochet");


        $this->render(
            'home_page.html.twig',
            [
                'extensionimage' => $extensionimage,
                'contenuimage' => $contenuimage,
                'extensionvideo' => $extensionvideo,
                'contenuvideo' => $contenuvideo,
                'urlpage' => $videopage,
                'photopoisson' => $photoPoisson,
                'imagematos' => $imagematos,
                'imagetuto' => $imagetuto

            ]
        );
    }

    public function poissons(): void
    {
        $url = new UrlManager;
        $dataPoisson = new PoissonManager;

        $extensionimage = $url->findExtensionByType("image");
        $contenuimage = $url->findContenuByType("image");
        $extensionvideo = $url->findExtensionByType("video");
        $contenuvideo = $url->findContenuByType("video");
        $videopage = $url->findVideoByPage("accueil");
        $detailAllPoissons = $dataPoisson->findAll();




        $this->render(
            'poissons.html.twig',
            [
                'route' => $_GET['route'],
                'extensionimage' => $extensionimage,
                'contenuimage' => $contenuimage,
                'extensionvideo' => $extensionvideo,
                'contenuvideo' => $contenuvideo,
                'urlpage' => $videopage,
                'detailallpoissons' => $detailAllPoissons
            ]
        );
    }

    public function tutoriels(): void
    {
        $data = new TutosVideosManager;
        $datatutos = $data->findAll();

        $this->render(
            'tutoriels.html.twig',
            [
                'route' => $_GET['route'],
                'tutos' => $datatutos
            ]
        );
    }

    public function descriptionPoisson(): void
    {
        $dataPoisson = new PoissonManager;
        $descriptionsPoisson = new PoissonDescriptionManager;
        $url = new UrlManager;

        $imagePoisson = $dataPoisson->findImageByName($_GET['route']);
        $detailPoisson = $dataPoisson->findByName($_GET['route']);
        $detailAllPoissons = $dataPoisson->findAll();
        $descriptionPoisson = $descriptionsPoisson->selectPoissonByName($_GET['route']);
        $descriptionhabitat = $descriptionsPoisson->selectHabitatByName($_GET['route']);
        $descriptionspotpea = $descriptionsPoisson->selectSpotPea($_GET['route']);
        $descriptionspothiver = $descriptionsPoisson->selectSpotHiver($_GET['route']);
        $descriptionfood = $descriptionsPoisson->selectFoodByName($_GET['route']);
        $reprod = $descriptionsPoisson->selectReprodByName($_GET['route']);
        $extensionUrl = $url->findExtensionByType("image");
        $contenuUrl = $url->findContenuByType("image");




        if (!$imagePoisson && empty($descriptionPoisson)) {
            // On redirige vers l'accueil 
            header('Location: index.php');
            exit();
        }

        $this->render(
            'detail_poisson.html.twig',
            [
                'namepoisson' => $_GET['route'],
                'imagepoisson' => $imagePoisson,
                'descriptionpoisson' => $descriptionPoisson,
                'detailpoisson' => $detailPoisson,
                'detailallpoissons' => $detailAllPoissons,
                'descriptionhabitat' => $descriptionhabitat,
                'descriptionspotpea' => $descriptionspotpea,
                'descriptionspothiver' => $descriptionspothiver,
                'descriptionfood' => $descriptionfood,
                'reprod' => $reprod,
                'extensionurl' => $extensionUrl,
                'contenuurl' => $contenuUrl
            ]
        );
    }



    public function notFound(): void
    {
        $this->render('notfound.html.twig', []);
    }



    public function questions(): void
    {
        $dataquestions = new QuestionsManager;
        $allquestions = $dataquestions->findAll();
        $datapoissons = new PoissonManager;
        $allpoissons = $datapoissons->findAll();
        $datasaisons = new SaisonManager;
        $allsaisons = $datasaisons->findAll();

        $this->render('questions.html.twig', [
            'questions' => $allquestions,
            'poissons' => $allpoissons,
            'saisons' => $allsaisons
        ]);
    }

    public function result(): void
    {

        $resultsJson = $_POST['results'] ?? '[]'; //si $_POST['results'] existe alors il prend sa valeur sinon par défaut c'est "[]"
        $answers = json_decode($resultsJson, true) ?? []; //permet de transformer les données pour les rendre exploitables 
        //c'est à dire un tableau associatif. 
        // on passe de ça '{"1":"Brochet"}' à ça [ 1 => "Brochet" ]

        // Si le formulaire est vide, on peut rediriger vers le quiz ou afficher une erreur
        if (empty($answers)) {
            $this->render('questions.html.twig', ['error' => 'Veuillez remplir le quiz']);
            return;
        }

        $userId = session_id();

        $mappingMilieux = [
            "petite étendue d'eau" => 1,
            "grande étendue d'eau" => 2,
        ];

        $mappingpoisson = [
            "sandre" => 1,
            "brochet" => 2,
            "silure" => 3,
            "perche" => 4
        ];

        // On récupère le texte et on trouve l'ID correspondant
        $nomMilieu = $answers[1]; // ex: "Lac"
        $milieuId  = $mappingMilieux[$nomMilieu] ?? 1; // 1 par défaut si non trouvé

        $nomPoisson = $answers[2];
        $poissonId = $mappingpoisson[$nomPoisson] ?? 1;

        $donneesQuiz = [
            'milieu_id' => $milieuId, // On envoie maintenant un chiffre !
            'poisson'  => $poissonId,
            'poisson_nom' => $answers[2] ?? "Brochet",
            'taille'    => $answers[3] ?? 0,
            'saison'    => $answers[4] ?? "Été",
            'courant'   => $answers[5] ?? "Faible",

        ];

        $datareponses = new ReponsesUtilisateursManager;
        $datamateriel = new MaterielManager;
        $dataphoto = new UrlManager;

        $datareponses->saveAll($answers, $userId);
        $resultats = $datamateriel->selection_matos($donneesQuiz);
        $urlimages = $dataphoto->findImageByPage("materiel");



        $this->render('materiel.html.twig', [
            "materiel" => $resultats,
            "urlimages" => $urlimages
        ]);
    }
}
