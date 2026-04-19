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
            header('Location: /');
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
        $allimages = $dataquestions->findAllQuestionsImages();
        $datapoissons = new PoissonManager;
        $allpoissons = $datapoissons->findAll();

        $this->render('questions.html.twig', [
            'questions' => $allquestions,
            'poissons' => $allpoissons,
            'allimages' => $allimages
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


            $donneesQuiz = [
                'etendue_eau' => $answers[1],
                'profondeur'  => $answers[2],
                'poisson_nom' => $answers[3],
                'taille'    => $answers[4],
                'saison'    => $answers[5],
                'courant'   => $answers[6],
                'obstacle'   => $answers[7],

            ];

            //On enregistre les réponses
            $datareponses = new ReponsesUtilisateursManager;
            $datareponses->saveAll($answers, $userId);

            $dataleurres = new LeurresManager;
            $datacanne = new CannesManager;
            $datamoulinet = new MoulinetManager;
            $datafil = new FilManager;
            $leurres = $dataleurres->leurres($donneesQuiz);

            // // --- AJOUTE CECI POUR VOIR TOUS TES LEURRES ---
            // echo "<pre style='background: #222; color: #0f0; padding: 20px; z-index:9999; position:relative;'>";
            // echo "<h1>DEBUG DES LEURRES</h1>";
            // print_r($leurres); // Affiche tout le tableau
            // echo "</pre>";
            // die("Arrêt temporaire du script");


            $canne = $datacanne->cannes($donneesQuiz, $leurres);

            // 2. LE FILTRAGE DES LEURRES CLIVANTS
            // Si on a trouvé une canne, on ne garde que les leurres qu'elle peut lancer
            if (!empty($canne)) {
                $poidsMinCanne = $canne['poids_mini'];
                $poidsMaxCanne = $canne['poids_maxi'];

                $leurresFiltres = [];

                $poidsMinTolere = $poidsMinCanne * 0.8;

                foreach ($leurres as $typeLeurres => $infosType) {

                    $leurreConserve = [
                        'url'     => $infosType['url'],
                        'famille' => $infosType['famille'],
                        'donnees' => [] // On vide la liste des tailles pour la remplir proprement
                    ];

                    // 2. On vérifie qu'il y a bien des variantes
                    if (isset($infosType['donnees']) && is_array($infosType['donnees'])) {

                        foreach ($infosType['donnees'] as $donnee) {

                            if ($donnee["poids_leurre"] >= $poidsMinTolere && $donnee["poids_leurre"] <= $poidsMaxCanne) {
                                $leurreConserve['donnees'][] = $donnee;
                            }
                        }
                    }

                    if (!empty($leurreConserve['donnees'])) {
                        $leurresFiltres[$typeLeurres] = $leurreConserve;
                    }
                }

                $leurres = $leurresFiltres;
            }







            $moulinet = $datamoulinet->moulinets($donneesQuiz, $canne);
            $fil = $datafil->fil($donneesQuiz);


            // --- STOCKAGE EN SESSION parce qu'on va utiliser les données sur une autre page que la page question 
            //et qu'on utilise la méthode GET pour les utiliser et cette méthode ne fonctionne qu'avec 
            //les données présentes uniquement sur la page ou l'url de la page donc là 
            //vu que les données proviennent d'une autre page pas le choix que de les enregistrer via SESSION

            $_SESSION['resultats_quiz'] = [
                'leurres'  => $leurres,
                'canne' => $canne,
                'moulinet' => $moulinet,
                'fil' => $fil,
                'name_fish' => $donneesQuiz['poisson_nom']
            ];

            //redirection vers la page materiel avec les données obtenues de questions
            header('Location: /materiel-peche');
            exit;
        }

        if (!isset($_SESSION['resultats_quiz'])) {
            header('Location: /questions-materiel');
            exit;
        }

        // On récupère les données calculées lors du POST
        $dataFromSession = $_SESSION['resultats_quiz'];

        $dataphoto = new UrlManager;
        $datamateriel = new AnalyseMaterielManager;

        $urlimages = $dataphoto->findImageByPage("materiel");
        $infos = $datamateriel->findInfos();
        $infosleurres = $datamateriel->findInfosLeurres();

        // // --- AJOUTE CECI POUR VOIR TOUS TES LEURRES ---
        // echo "<pre style='background: #222; color: #0f0; padding: 20px; z-index:9999; position:relative;'>";
        // echo "<h1>DEBUG DES LEURRES</h1>";
        // print_r($infosleurres); // Affiche tout le tableau
        // echo "</pre>";
        // die("Arrêt temporaire du script");



        $this->render('materiel.html.twig', [
            "leurres" => $dataFromSession["leurres"],
            "canne" => $dataFromSession["canne"],
            "moulinet" => $dataFromSession["moulinet"],
            "fil" => $dataFromSession["fil"],
            "name_fish" => $dataFromSession["name_fish"],
            "urlimages" => $urlimages,
            "infos" => $infos,
            "infosleurres" => $infosleurres,

        ]);
    }


    public function recherche()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {


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

            $_SESSION['searchresults'] = [
                'searchuser' => $searchuser,
                'globalsearchtable' => $globalsearchtable

            ];

            //redirection vers la page recherche avec les données obtenues de la barre de recherche
            header('Location: /recherche-peche');
            exit;
        }


        $sessionform = $_SESSION['searchresults'];

        $searchdata = new SearchManager();



        $categories = $searchdata->comparaisonWords($sessionform['searchuser'], $sessionform['globalsearchtable']);

        $datacards = $searchdata->findSpecificCards($categories);

        $this->render('recherche.html.twig', [
            "datacards" => $datacards,
            "categories" => $categories

        ]);
    }

    public function erreur404()
    {
        // 1. On signale au navigateur que c'est une erreur 404 (important pour Google/SEO)
        http_response_code(404);

        // 2. Au lieu de rediriger, on affiche direct le template
        // (Vérifie bien que le chemin vers ton fichier twig est correct)
        $this->render('erreur404.html.twig', []);
    }

    public function mentionslegales()
    {

        // 2. Au lieu de rediriger, on affiche direct le template
        // (Vérifie bien que le chemin vers ton fichier twig est correct)
        $this->render('mentions_legales.html.twig', []);
    }

    public function apropos()
    {

        // 2. Au lieu de rediriger, on affiche direct le template
        // (Vérifie bien que le chemin vers ton fichier twig est correct)
        $this->render('a_propos.html.twig', []);
    }

    public function recettes()
    {

        $recepies = new RecettesManager;

        //On récupère le nom du poisson obtenu après analyse de 
        //la photo de l'utilisateur qu'Angular nous a envoyé via l'url

        $fishName = $_GET["poisson"] ?? null;

        //si on récupère aucun nom de poisson dans ce cas on va le dire à Angular

        if ($fishName === null) {

            // On indique au client (Angular ou le navigateur) le format exact des données (JSON).
            // Cela permet à Angular de "parser" (traduire) automatiquement ce texte 
            // en un véritable tableau TypeScript utilisable, sans provoquer d'erreur de lecture.
            // Sans ça le texte peut être affiché bêtement par le navigateur

            header("Content-Type:application/json");
            echo json_encode(['erreur' => "Aucun nom de poisson envoyé"]);

            //le exit permet d'arrêter la lecture du code pile à ce moment là
            //ça évite que php continue à lire la suite du code 
            //qui pourrait perturber les infos transmises à Angular et induire une erreur côté Angular
            exit;
        }

        $recepiesValues = $recepies->findRecepiesByFishName($fishName);

        // On indique au client (Angular ou le navigateur) le format exact des données (JSON).
        // Cela permet à Angular de "parser" (traduire) automatiquement ce texte 
        // en un véritable tableau TypeScript utilisable, sans provoquer d'erreur de lecture.
        // Sans ça le texte peut être affiché bêtement par le navigateur

        header("Content-Type: application/json");

        // C'est un laissez-passer de sécurité (CORS).
        // Il dit au navigateur web (Chrome/Firefox) d'autoriser notre application Angular (port 4200) 
        // à lire les données envoyées par notre serveur Apache (port 80). 
        // Sans ça, le navigateur bloque la réponse par sécurité.

        header("Access-Control-Allow-Origin:*");
        echo json_encode($recepiesValues);

        //le exit permet d'arrêter la lecture du code pile à ce moment là
        //ça évite que php continue à lire la suite du code 
        //qui pourrait perturber les infos transmises à Angular et induire une erreur côté Angular
        exit;
    }
}
