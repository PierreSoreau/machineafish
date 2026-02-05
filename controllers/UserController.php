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
        //le if est nécessaire dans le cas ou l'utilisateur recommence 
        //le questionnaire dans ce cas on clear la session des réponses au questionnaire 
        //pour éviter que ça prenne en compte des anciennes réponses
        if (isset($_SESSION['resultats_quiz'])) {
            unset($_SESSION['resultats_quiz']);
        }

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
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

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


            $datareponses->saveAll($answers, $userId);
            $resultats = $datamateriel->selection_matos($donneesQuiz);


            // --- STOCKAGE EN SESSION parce qu'on va utiliser les données sur une autre page que la page question 
            //et qu'on utilise la méthode GET pour les utiliser et cette méthode ne fonctionne qu'avec 
            //les données présentes uniquement sur la page ou l'url de la page donc là 
            //vu que les données proviennent d'une autre page pas le choix que de les enregistrer via SESSION

            $_SESSION['resultats_quiz'] = [
                'materiel'  => $resultats,
                'name_fish' => $donneesQuiz['poisson_nom']
            ];

            //redirection vers la page materiel avec les données obtenues de questions
            header('Location: index.php?route=materiel');
            exit;
        }

        if (!isset($_SESSION['resultats_quiz'])) {
            header('Location: index.php?route=questions');
            exit;
        }

        // On récupère les données calculées lors du POST
        $dataFromSession = $_SESSION['resultats_quiz'];

        $dataphoto = new UrlManager;
        $datamateriel = new MaterielManager;

        $urlimages = $dataphoto->findImageByPage("materiel");
        $infos = $datamateriel->findInfos();



        $this->render('materiel.html.twig', [
            "materiel" => $dataFromSession["materiel"],
            "name_fish" => $dataFromSession["name_fish"],
            "urlimages" => $urlimages,
            "infos" => $infos,

        ]);
    }


    public function recherche()
    {

        $searchdata = new SearchManager();




        $globalsearchtable = [];


        //BASE DE DONNEES PAGE MATERIEL
        $materiel = [
            // --- Ton matériel de base ---
            "canne",
            "cannes",
            "puissance",
            "light",
            "medium-light",
            "medium",
            "medium-heavy",
            "heavy",
            "extra-heavy",
            "extra-extra-heavy",
            "action",
            "fast",
            "regular",
            "longueur",
            "taille",
            "poids",
            "fils",
            "fil",
            "tresse",
            "tresses",
            "fluorocarbone",
            "moulinet",
            "moulinets",
            "bobine",
            "bobines",
            "ratio",
            "leurre",
            "leurres",


            "tube-bait",
            "tube-baits",
            "minnow",
            "minnows",
            "shad",
            "shads",
            "rubberjig",
            "rubberjigs",
            "crankbait",
            "crankbaits",
            "worm",
            "worms",
            "cuillère tournante",
            "cuillères tournantes",
            "cuillère",
            "spintail",
            "spintails",
            "stickbait",
            "stickbaits",
            "jerkbait",
            "jerkbaits",
            "lipless",
            "jig",
            "jigs",
            "swimbait",
            "swimbaits",
            "crawler",
            "crawlers",
            "lame-vibrante",
            "lames-vibrantes",
            "lame",
            "leurre à hélice",
            "leurres à hélice",
            "popper",
            "poppers",
            "frog",
            "frogs",
            "glidebait",
            "glidebaits",
            "spinnerbait",
            "spinnerbaits",
            "spinner",
            "chatterbait",
            "chatterbaits",
            "chatter",
            "creature",
            "creatures",
            "grub",
            "grubs"
        ];

        $horsdatabase = ["alimentation", "reproduction", "morphologie", "habitat", "spot", "pêche", "poisson", "carnassier"];

        //BASE DE DONNEES PAGES POISSON
        $poissons = $searchdata->TriForPoissonPages();

        foreach ($poissons as $nomDuPoisson => $motsActuels) {
            // On fusionne les mots spécifiques du poisson avec les mots génériques
            // $poissons[$nomDuPoisson] va être mis à jour réellement
            $poissons[$nomDuPoisson] = array_merge($motsActuels, $horsdatabase);

            // On enlève les doublons au cas où un mot générique serait déjà présent
            $poissons[$nomDuPoisson] = array_unique($poissons[$nomDuPoisson]);

            //On réindexe proprement
            $poissons[$nomDuPoisson] = array_values($poissons[$nomDuPoisson]);
        }



        //BASE DE DONNEES PAGES TUTOS
        $tutos = $searchdata->TriForTutosPage();

        //assemblages des données dans le tabeau globalsearchtable

        $globalsearchtable["tutoriels"] = $tutos;

        $globalsearchtable["materiel"] = $materiel;

        //array merge permet d'ajouter le tableau poisson dans global searchtable à la suite en gardant ses clés
        $globalsearchtable = array_merge($globalsearchtable, $poissons);

        //on récupère le ou les mots de l'utilisateur
        $searchuser = $_POST['searchresults'] ?? "[]";

        $categories = $searchdata->comparaisonWords($searchuser, $globalsearchtable);

        $datacards = $searchdata->findSpecificCards($categories);

        $this->render('recherche.html.twig', [
            "datacards" => $datacards,
            "categories" => $categories

        ]);
    }
}
