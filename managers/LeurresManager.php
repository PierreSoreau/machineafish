<?php

class LeurresManager extends AbstractManager
{

    function leurres(array $donneesQuiz): array
    {


        // On nettoie les variables (minuscules + suppression des espaces) 
        // pour que le SQL ne fasse pas d'erreurs de casse !
        $etendue_eau = strtolower(trim($donneesQuiz['etendue_eau']));
        $profondeur  = strtolower(trim($donneesQuiz['profondeur']));
        $espece      = strtolower(trim($donneesQuiz['poisson_nom']));
        $taille      = strtolower(trim($donneesQuiz['taille']));
        $saison      = strtolower(trim($donneesQuiz['saison']));
        $courant     = strtolower(trim($donneesQuiz['courant']));
        $obstacle    = strtolower(trim($donneesQuiz['obstacle']));

        $paramsleurre = [
            "etendue_eau" => $etendue_eau,
            "profondeur" => $profondeur,
            "espece" => $espece,
            "taille" => $taille,
            "saison" => $saison,
            "courant" => $courant,
            "obstacle_param" => $obstacle
        ];

        // obtention de la base de données des leurres       
        $sqlLeurres = "
        SELECT DISTINCT 
            p.type_leurre,            
            p.type_texan_conseille,
            p.famille,   
            p.url_photo,
            p.url_photo_autres,              
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
        
        JOIN (
            SELECT type_leurre, MAX(taille_equivalente) as max_taille_dispo
            FROM catalogue_leurres
            GROUP BY type_leurre
        ) as champions ON c.type_leurre = champions.type_leurre

        JOIN regle_especes re ON (
             
             /* 1. Le leurre correspond exactement à la taille demandée (ex: 15cm ou 18cm) */
             (c.taille_equivalente = re.taille_equivalente_cm)
             
             OR              
             
             (
                 c.taille_equivalente = champions.max_taille_dispo 
                 AND champions.max_taille_dispo < re.taille_equivalente_cm 
                 AND champions.max_taille_dispo >= 10
             )
        )

        JOIN calendrier_peche cp ON (
            re.espece_cible = cp.espece 
            AND p.type_leurre = cp.type_leurre  
        )
        JOIN regle_grammages rg     ON re.espece_cible = rg.espece_cible

        WHERE rg.etendue_eau        = :etendue_eau
          AND rg.profondeur         = :profondeur
          AND re.espece_cible       = :espece   
          AND re.selectivite        = :taille 
          AND cp.saison             = :saison          
          
          
          AND (p.compatible_encombre = 'oui' OR :obstacle_param = 'non')          
          AND rg.courant            = :courant
          
          
        ";

        $query = $this->db->prepare($sqlLeurres);
        $query->execute($paramsleurre);

        $leurres = $query->fetchAll(PDO::FETCH_ASSOC);

        //TRANSFORMATION DU TABLEAU LEURRE POUR QU'IL SOIT ADAPTE A LA VUE 
        $leurreinfos = [];

        foreach ($leurres as $leurre) {

            // Calculs de base
            $poids_tp_moyen = ($leurre['poids_min_g'] + $leurre['poids_max_g']) / 2;
            $poids_total_estime = $leurre['poids_leurre_g'] + $poids_tp_moyen;

            $nom = $leurre["type_leurre"];

            if (!isset($leurreinfos[$nom])) {

                if ($nom === "Worm") {
                    $leurreinfos[$nom] = [
                        "url" => [],
                        "famille" => $leurre["famille"],
                        "montage_leurre" => "Texan",
                        'donnees' => []
                    ];
                }

                $leurreinfos[$nom] = [
                    "url" => [],
                    "famille" => $leurre["famille"],
                    "montage_leurre" => ($leurre['famille'] !== 'dur' && $obstacle === 'oui') ? "Texan" : "Classique",
                    'donnees' => []
                ]; // On va stocker ici les différentes tailles/poids de chacun des leurres qui sont du type $leurresinfos[$nom]
            }

            $ligneleurre = [
                'taille'         => $leurre['taille_cm'],
                'taille_agrafe'  => $leurre['taille_agrafe']
            ];



            // CAS 1 : C'est un Leurre DUR 
            if ($leurre['famille'] === 'dur') {
                $ligneleurre["poids_leurre"] = $leurre['poids_leurre_g'];
                $ligneleurre["poids_tp"] = "Non applicable";
                $ligneleurre["taille_hamecon"] = "Non applicable";
                $ligneleurre["gap"] = "Non applicable";
                $leurreinfos[$nom]['url'] = $leurre["url_photo"];
            }

            // CAS 2 : C'est un Leurre SOUPLE
            else {
                // Le poids affiché est le poids TOTAL (Leurre + Plomb)
                $ligneleurre["poids_leurre"] = round($poids_total_estime, 0);
                $ligneleurre["poids_tp"]     = $poids_tp_moyen;

                // Sous-Cas: Il y a des obstacles -> Montage TEXAN

                if (strtolower(trim($obstacle)) === 'oui' && !empty($leurre['type_texan_conseille'])) {
                    $ligneleurre["type_montage"] = "Texan";
                    $ligneleurre["taille_hamecon"] = $leurre['taille_texan']; // Ex: 2/0
                    $ligneleurre["gap"]            = $leurre['type_texan_conseille']; // Ex: Wide Gap
                    $leurreinfos[$nom]['url'] = $leurre["url_photo_autres"];
                }

                // Sous-Cas: Pas d'obstacles (ou leurre pas compatible Texan) -> 
                //Tête Plombée CLASSIQUE plus simple une tête plombée classique pour le ferrage quand pas d'obstacle
                else {
                    $ligneleurre["type_montage"] = "Classique";
                    $ligneleurre["taille_hamecon"] = $leurre['taille_tp'];
                    $ligneleurre["gap"]            = "Non applicable";
                    $leurreinfos[$nom]['url'] = $leurre["url_photo"];
                }
            }


            // On ajoute la ligne au tableau final
            $leurreinfos[$nom]["donnees"][] = $ligneleurre;
        }

        return $leurreinfos;
    }
}
