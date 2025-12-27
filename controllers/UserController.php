<?php

class UserController extends AbstractController
{


    public function brochet(): void
    {
        $this->render('brochet.html.twig', []);
    }

    public function notFound(): void
    {
        $this->render('notfound.html.twig', []);
    }

    public function home(): void
    {
        $this->render('home_page.html.twig', []);
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

    public function savedata(): void
    {
        if (!empty($_POST['results'])) {
            $answers = json_decode($_POST['results'], true); //le true permet à ce que ça soit un tableau associatif classique de PHP : ```php [ "1" => "Brochet", "2" => "Été" ]
            $userId = session_id();
            $datareponses = new ReponsesUtilisateursManager;

            $datareponses->saveAll($answers, $userId);
        }


        $this->render('materiel.html.twig', []);
    }

    public function result(): void
    {
        $answers = json_decode($_POST['results'], true);
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
        $poissonId=$mappingpoisson[$nomPoisson];

        $donneesQuiz = [
            'milieu_id' => $milieuId, // On envoie maintenant un chiffre !
            'poissonid'  => $poissonId,
            'poisson_nom' =>$answers[2],
            'taille'    => $answers[3],
            'saison'    => $answers[4],
            'courant'   => $answers[5],
        ];

        $datamateriel=new MaterielManager;
        $resultats=$datamateriel->selection_matos($donneesQuiz);

        $this->render('materiel.html.twig', [
            "materiel"=>$resultats,

        ]);
}

}
