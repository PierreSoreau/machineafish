<?php

class CannesManager extends AbstractManager
{

    function cannes(array $donneesQuiz, array $leurres): array
    {

        if (empty($leurres)) {
            return [];
        }


        if ($donneesQuiz['etendue_eau'] === "petite étendue d'eau") {
            $etendue_eau = 1;
        } else {
            $etendue_eau = 2;
        }

        //On évalue le poids minimal et maximal que la canne doit dépasser qui correspond au poids de tous les leurres dispos

        $poidsleurremax = $leurres[0]['poids_leurre'];
        $poidsleurremin = $leurres[0]['poids_leurre'];

        foreach ($leurres as $leurre) {

            if ($leurre['poids_leurre'] > $poidsleurremax) {
                $poidsleurremax = $leurre['poids_leurre'];
            }

            if ($leurre['poids_leurre'] < $poidsleurremin) {
                $poidsleurremin = $leurre['poids_leurre'];
            }
        }

        $espece = $donneesQuiz['poisson_nom'];

        $paramscannes = [
            "etendue_eau" => $etendue_eau,
            "espece" => $espece,
            "poidsleurremin" => $poidsleurremin,
            "poidsleurremax" => $poidsleurremax
        ];

        echo "<pre style='background: #fff; color: #000; padding: 20px;'>";
        echo "<h3>DEBUG CONTRAINTES CANNE</h3>";
        echo "Espèce : " . $espece . "<br>";
        echo "Étendue d'eau (1=Petite, 2=Grande) : " . $etendue_eau . "<br>";
        echo "<strong>Poids Leurre le plus léger (Min) : </strong>" . $poidsleurremin . " g<br>";
        echo "<strong>Poids Leurre le plus lourd (Max) : </strong>" . $poidsleurremax . " g<br>";
        echo "</pre>";
        die(); // On arrête ici pour voir le résultat

        //obtention de la base de données des cannes      
        $sqlCannes = '
        SELECT 
            c.id,
            c.action,
            c.poids_mini,
            c.poids_maxi,
            c.longueur,
            -- Calcul de "l excédent de puissance" pour sélectionner la canne la plus optimal 
            -- cest à dire celle qui a le plus faible écart par rapport au poids max du leurre
            (c.poids_maxi - :poidsleurremax) as marge_haute           
            
        FROM canne c        
        JOIN regles_especes_canne re    ON c.action = re.action
        WHERE re.espece_cible = :espece
        AND c.etendue_eau = :etendue_eau
        
        -- 1. Sécurité MAX : La canne doit absolument pouvoir lancer le plus lourd
        AND c.poids_maxi >= :poidsleurremax 
        
        -- 2. Tolérance MIN : On accepte que la canne soit un peu "trop puissante" en bas
        -- On dit : Le poids min de la canne doit être <= (Poids leurre min + 20%)
        -- Ex: Si leurre min = 18g, on accepte une canne qui commence à 21.6g (18 * 1.2)
        AND c.poids_mini <= (:poidsleurremin * 1.2)
        
        ORDER BY 
            -- On privilégie la canne qui colle le mieux au poids MAX (sécurité et sensation)
            (c.poids_maxi - :poidsleurremax) ASC,
            (:poidsleurremin - c.poids_mini) ASC
        
        LIMIT 1 -- On ne prend que la plus optimisée qui correspond à la première du tableau
    ';

        $query = $this->db->prepare($sqlCannes);
        $query->execute($paramscannes);

        $canne = $query->fetch(PDO::FETCH_ASSOC);

        return $canne ?: [];
    }
}
