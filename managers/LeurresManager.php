<?php

class LeurresManager extends AbstractManager
{

    function leurres(array $donneesQuiz): array
    {


        $etendue_eau = $donneesQuiz['etendue_eau'];
        $profondeur = $donneesQuiz['profondeur'];
        $espece = $donneesQuiz['poisson_nom'];
        $taille = $donneesQuiz['taille'];
        $saison = $donneesQuiz['saison'];
        $courant = $donneesQuiz['courant'];
        $obstacle = $donneesQuiz['obstacle'];

        $paramsleurre = [
            "etendue_eau" => $etendue_eau,
            "profondeur" => $profondeur,
            "espece" => $espece,
            "taille" => $taille,
            "saison" => $saison,
            "courant" => $courant,
            "obstacle" => $obstacle
        ];

        // obtention de la base de données des leurres       
        $sqlLeurres = '
        SELECT DISTINCT 
            p.type_leurre,            
            p.type_texan_conseille,
            p.famille,   
            p.url_photo,              
            c.taille_cm,  
            c.poids_leurre_g,             
            rg.poids_min_g,           
            rg.poids_max_g,           
            rh.taille_tp,                 
            rh.taille_texan,              
            rh.taille_agrafe  
        FROM proprietes_leurres p
        
        JOIN catalogue_leurres c        ON p.type_leurre = c.type_leurre
        JOIN regle_hameçon rh         ON c.taille_cm = rh.taille_reelle_cm
        -- 1. ON AJOUTE UNE SOUS-REQUÊTE POUR CONNAÎTRE LA TAILLE MAX DE CHAQUE TYPE
        JOIN (
            SELECT type_leurre, MAX(taille_equivalente) as max_taille_dispo
            FROM catalogue_leurres
            GROUP BY type_leurre
        ) as champions ON c.type_leurre = champions.type_leurre
        -- 2. JOINTURE INTELLIGENTE AVEC LES RÈGLES
        JOIN regle_especes re ON (
             -- Cas A : Match Classique (ex: Petit/Gros spécimen) -> Taille Exacte
             (re.selectivite != \'spécimen record\' AND c.taille_equivalente = re.taille_equivalente_cm)
             
             OR
             
             -- Cas B : Spécimen Record -> Logique "Best Effort"
             (re.selectivite = \'spécimen record\' AND (
                 -- Soit le leurre est assez gros (>= taille requise)
                 c.taille_equivalente >= re.taille_equivalente_cm
                 OR
                 -- Soit c\'est le plus gros de sa catégorie (ET il fait au moins 12cm pour pas proposer des micro-leurres)
                 (c.taille_equivalente = champions.max_taille_dispo AND c.taille_equivalente >= 12)
             ))
        )
        JOIN calendrier_peche cp        ON re.espece_cible = cp.espece 
        JOIN regle_grammages rg     ON re.espece_cible = rg.espece_cible

        WHERE rg.etendue_eau        = :etendue_eau
          AND rg.profondeur         = :profondeur
          AND re.espece_cible       = :espece   
          AND re.selectivite        = :taille 
          AND cp.saison             = :saison
          AND p.compatible_encombre = :obstacle          
          AND rg.courant            = :courant
          AND (
              -- CAS 1 : LEURRE DUR (On compare le poids du leurre directement)
              (p.famille = \'dur\' AND c.poids_leurre_g <= (rg.poids_max_g * 3))
              
              OR 
              
              -- CAS 2 : LEURRE SOUPLE (On compare Corps + Tête Plombée du spot)
              (p.famille != \'dur\' AND (c.poids_leurre_g + rg.poids_max_g) <= (rg.poids_max_g * 3))
          )
    ';

        $query = $this->db->prepare($sqlLeurres);
        $query->execute($paramsleurre);

        $leurres = $query->fetchAll(PDO::FETCH_ASSOC);

        //TRANSFORMATION DU TABLEAU LEURRE POUR QU'IL SOIT ADAPTE A LA VUE 
        $leurreinfos = [];

        foreach ($leurres as $leurre) {

            // Calculs de base
            $poids_tp_moyen = ($leurre['poids_min_g'] + $leurre['poids_max_g']) / 2;
            $poids_total_estime = $leurre['poids_leurre_g'] + $poids_tp_moyen;

            // On prépare un tableau "squelette" commun à tout le monde
            $info = [
                'nom'            => $leurre['type_leurre'],
                'famille'        => $leurre['famille'],
                'photo'          => $leurre['url_photo'],
                'taille'         => $leurre['taille_cm'] . ' cm',
                'taille_agrafe'  => $leurre['taille_agrafe']
            ];

            // CAS 1 : C'est un Leurre DUR 
            if ($leurre['famille'] === 'dur') {
                $info['poids_leurre']   = $leurre['poids_leurre_g'];
                $info['poids_tp']       = "Non applicable";
                $info['taille_hamecon'] = "Non applicable";
                $info['gap']            = "Non applicable";
            }

            // CAS 2 : C'est un Leurre SOUPLE
            else {
                // Le poids affiché est le poids TOTAL (Leurre + Plomb)
                $info['poids_leurre'] = round($poids_total_estime, 0);
                $info['poids_tp']     = $poids_tp_moyen;

                // Sous-Cas: Il y a des obstacles -> Montage TEXAN

                if ($obstacle === 'oui' && !empty($leurre['type_texan_conseille'])) {
                    $info['taille_hamecon'] = $leurre['taille_texan']; // Ex: 2/0
                    $info['gap']            = $leurre['type_texan_conseille']; // Ex: Wide Gap
                }

                // Sous-Cas: Pas d'obstacles (ou leurre pas compatible Texan) -> 
                //Tête Plombée CLASSIQUE plus simple une tête plombée classique pour le ferrage quand pas d'obstacle
                else {
                    $info['taille_hamecon'] = $leurre['taille_tp'];
                    $info['gap']            = "Non applicable";
                }
            }

            // On ajoute la ligne au tableau final
            $leurreinfos[] = $info;
        }

        return $leurreinfos;
    }
}
