<?php

class UserController extends AbstractController
{

    public function home(): void
    {
        $this->render('home_page.html.twig', []);
    }

    public function poissons(): void
    {
        $this->render('poissons.html.twig', ['route' => $_GET['route']]);
    }

    public function tutoriels(): void
    {
        $this->render('tutoriels.html.twig', ['route' => $_GET['route']]);
    }

    public function brochet(): void
    {
        $this->render('brochet.html.twig', ['route' => $_GET['route']]);
    }

    public function sandre(): void
    {
        $this->render('sandre.html.twig', ['route' => $_GET['route']]);
    }

    public function silure(): void
    {
        $this->render('silure.html.twig', ['route' => $_GET['route']]);
    }

    public function perche(): void
    {
        $this->render('perche.html.twig', ['route' => $_GET['route']]);
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

        $resultsJson = $_POST['results'] ?? '[]';
        $answers = json_decode($resultsJson, true) ?? [];

        // Si le formulaire est vide, on peut rediriger vers le quiz ou afficher une erreur
        if (empty($answers)) {
            $this->render('questions.html.twig', ['error' => 'Veuillez remplir le quiz']);
            return;
        }
        $userId = session_id();
        $datareponses = new ReponsesUtilisateursManager;
        $datareponses->saveAll($answers, $userId);

        
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

        $datamateriel = new MaterielManager;
        $resultats = $datamateriel->selection_matos($donneesQuiz);

        $this->render('materiel.html.twig', [
            "materiel" => $resultats

        ]);
    }
}
