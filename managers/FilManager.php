<?php

class FilManager extends AbstractManager
{

    function fil(array $donneesQuiz): array
    {
        $espece = $donneesQuiz['poisson_nom'];
        $taille = $donneesQuiz['taille'];

        $paramsfil = [
            "espece" => $espece,
            "taille" => $taille

        ];

        // obtention de la base de données des cannes      
        $sqlFil = '
        SELECT DISTINCT 
            f.epaisseur_de_tresse,
            f.epaisseur_de_fluorocarbone                     
            
        FROM fil f        
        WHERE f.espece = :espece
        AND f.selectivite = :taille
    ';

        $query = $this->db->prepare($sqlFil);
        $query->execute($paramsfil);

        $fil = $query->fetch(PDO::FETCH_ASSOC);

        return $fil;
    }
}
