<?php

class MaterielManager extends AbstractManager
{

    //fonction qui permet de transformer les tableaux php en chaine de caractère lisible par SQL

    private function formatInClause(array $items): string
    {
        // On transforme chaque élément en 'element' (avec des quotes)
        $formatted = array_map(function ($item) {
            return "'" . addslashes($item) . "'";
        }, $items);

        // On les joint avec une virgule
        return implode(',', $formatted);
    }
    public function selection_matos(array $donneesQuiz): array

    {
        $milieuid = $donneesQuiz['milieu_id'];
        $espece = $donneesQuiz['poisson'];
        $taille = $donneesQuiz['taille'];
        $courant = $donneesQuiz['courant'];
        $saison = $donneesQuiz['saison'];

        //les règles de puissance de la canne en fonction du poisson et du courant

        $reglespoids = [
            'brochet' => ['peu importe' => [15, 40], 'gros spécimen' => [40, 100]],
            'sandre'  => ['peu importe' => [5, 14],   'gros spécimen' => [14, 35]],
            'perche'  => ['peu importe' => [3, 10],  'gros spécimen' => [7, 20]],
            'silure'  => ['peu importe' => [40, 80], 'gros spécimen' => [80, 200]]

        ];

        $poidsmini=$reglespoids[$espece][$taille][0];
        $poidsmaxi=$reglespoids[$espece][$taille][1];

        $poidsreference = ( $poidsmini +  $poidsmaxi) / 2;

        if ($courant === "oui") {
            $poids = $poidsreference * 1.5;
        } else {
            $poids = $poidsreference;
        }

        //les règles d'action de la canne en fonction du poisson

        $reglesAction = [
            'brochet' => ["fast", "regular"],
            'sandre'  => ["fast"],
            'perche'  => ["regular"],
            'silure'  => ["regular"]
        ];

        $actionsAutorisees = $reglesAction[$espece] ?? ["regular"];

        //les regles du leurre en fonction du poisson et de la saison

        $reglesSaison = [
            'perche' => [
                'printemps' => ["grub", "shad", "tube bait", "cuillère tournante", "spintail", "lame vibrante"],
                'été'       => ["popper", "frog", "jerkbait", "stickbait", "leurre à hélice", "cuillère tournante", "spintail", "lame vibrante", "grub", "shad"],
                'automne'   => ["chatterbait", "spinnerbait", "lipless", "minnow", "shad", "spintail", "lame vibrante", "grub"],
                'hiver'     => ["shad", "jig", "grub"]
            ],
            'sandre' => [
                'printemps' => ["minnow", "shad", "grub"],
                'été'       => ["jerkbait", "swimbait", "spinnerbait", "shad", "lame vibrante"],
                'automne'   => ["crankbait", "tube bait", "lipless", "grub", "shad"],
                'hiver'     => ["grub", "jig", "shad", "lame vibrante"]
            ],
            'brochet' => [
                'printemps' => ["frog", "jerkbait", "creature", "shad", "spinnerbait", "cuillère tournante", "lame vibrante", "crawler", "grub"],
                'été'       => ["glidebait", "swimbait", "stickbait", "spinnerbait", "shad", "popper", "leurre à hélice", "cuillère tournante", "crawler", "grub"],
                'automne'   => ["crankbait", "stickbait", "lipless", "shad", "swimbait", "jerkbait", "lame vibrante", "grub"],
                'hiver'     => ["shad", "jig", "rubberjig", "grub"]
            ],
            'silure' => [
                'printemps' => ["glidebait", "swimbait", "shad", "grub"],
                'été'       => ["shad", "jig", "grub"],
                'automne'   => ["rubberjig", "glidebait", "shad", "grub"],
                'hiver'     => ["jig", "rubberjig", "shad", "grub"]
            ]
        ];

        $especeNom = strtolower($donneesQuiz['poisson_nom']);
       

        $typesAutorises = $reglesSaison[$especeNom][$saison] ?? ["shad"];


        // obtention de la base de données des cannes en fonction du milieu et du poisson et du courant       

        $sqlCannes = "SELECT DISTINCT canne.* FROM canne 
              INNER JOIN canne_milieu_aquatique ON canne.id = canne_milieu_aquatique.canne_id 
              INNER JOIN milieu_aquatique ON canne_milieu_aquatique.milieu_id = milieu_aquatique.id
              WHERE milieu_aquatique.id = :idMilieu
              AND :pref BETWEEN canne.poids_mini AND canne.poids_maxi
              AND canne.action IN (" . $this->formatInClause($actionsAutorisees) . ")";

        $query = $this->db->prepare($sqlCannes);
        $query->execute([
            'idMilieu' => $milieuid,
            'pref'     => $poids
        ]);

        $cannes = $query->fetchAll(PDO::FETCH_CLASS, 'Canne');

        // obtention de la base de données des moulinets en fonction du premier filtre des cannes et de la saison

        $sqlmoulinet = "SELECT DISTINCT moulinet.* FROM moulinet 
        INNER JOIN saison_moulinet ON moulinet.id = saison_moulinet.moulinet_id
        INNER JOIN canne_moulinet ON moulinet.id = canne_moulinet.moulinet_id
        WHERE canne_moulinet.canne_id IN (
            SELECT canne.id FROM canne
            INNER JOIN canne_milieu_aquatique ON canne.id = canne_milieu_aquatique.canne_id 
            WHERE canne_milieu_aquatique.milieu_id = :idMilieu
            AND :pref BETWEEN canne.poids_mini AND canne.poids_maxi
            AND canne.action IN (" . $this->formatInClause($actionsAutorisees) . ")
        ) 
        AND saison_moulinet.saison_id = :saison";

        $query1 = $this->db->prepare($sqlmoulinet);
        $query1->execute([
            'idMilieu' => $milieuid,
            'pref'     => $poids,
            'saison' => $saison
        ]);

        $moulinets = $query1->fetchAll(PDO::FETCH_CLASS, 'Moulinet');

        // obtention de la base de données des leurres en fonction des réponses de tout le questionnaire

        $sqlleurres = "SELECT DISTINCT leurre.* FROM leurre
        -- On lie le leurre au poisson
        INNER JOIN poisson_leurre ON leurre.id = poisson_leurre.leurre_id
        -- On lie le leurre à la canne
        INNER JOIN canne_leurre ON leurre.id = canne_leurre.leurre_id
        -- On lie la canne au milieu
        INNER JOIN canne_milieu_aquatique ON canne_leurre.canne_id = canne_milieu_aquatique.canne_id
        INNER JOIN canne ON canne_leurre.canne_id = canne.id

        WHERE poisson_leurre.poisson_id = :idPoisson -- Optionnel si tu as l'ID
        AND canne_milieu_aquatique.milieu_id = :idMilieu
        AND :pref BETWEEN canne.poids_mini AND canne.poids_maxi
        AND canne.action IN ({$this->formatInClause($actionsAutorisees)})
        -- IMPORTANT : On vérifie que le poids du leurre est cohérent avec le calcul du quiz
        AND leurre.poids_leurre BETWEEN :pmin AND :pmax
        AND leurre.type IN (" . $this->formatInClause($typesAutorises) . ")";

        $query2 = $this->db->prepare($sqlleurres);
        $query2->execute([
            'idMilieu' => $milieuid,
            'pref'     => $poids,
            'pmin'     => $poidsmini,
            'pmax'     => $poidsmaxi,
            'idPoisson' => $espece
        ]);

        $leurres = $query2->fetchAll(PDO::FETCH_CLASS, 'Leurre');


        $sqlfil="SELECT fil.* FROM fil
        JOIN poisson_fil ON fil.id=poisson_fil.fil_id
        WHERE fil.gros_specimen = :taille
        AND poisson_fil.poisson_id = :poissonid";

        $query3 = $this->db->prepare($sqlfil);
        $query3->execute([
            'taille' => $taille,
            'poissonid' => $espece            
        ]);

        $fils = $query3->fetchAll(PDO::FETCH_CLASS, 'Fil');

        $materiel=[
            'cannes'=>$cannes,
            'moulinets'=>$moulinets,
            'leurres'=>$leurres,
            'fils'=>$fils           

        ];



        return $materiel;
    }
}
