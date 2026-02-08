<?php

class MoulinetManager extends AbstractManager
{

    function moulinets(array $donneesQuiz, array $canne): array
    {


        if (empty($canne)) {
            return [];
        }

        $canneid = $canne['id'];


        $saison = $donneesQuiz['saison'];

        $paramsmoulinet = [
            "canneid" => $canneid,
            "saison" => $saison

        ];

        // obtention de la base de données des cannes      
        $sqlMoulinet = '
        SELECT DISTINCT 
            m.taille_bobine,
            m.ratio                     
            
        FROM moulinet m
        JOIN canne_moulinet cm ON m.id = cm.moulinet_id        
        JOIN canne c ON cm.canne_id = c.id
        JOIN saison_moulinet sm ON m.id = sm.moulinet_id
        JOIN saison s ON sm.saison_id = s.saison
        WHERE s.saison = :saison
        AND c.id = :canneid
               
        LIMIT 1 
    ';

        $query = $this->db->prepare($sqlMoulinet);
        $query->execute($paramsmoulinet);

        $moulinet = $query->fetch(PDO::FETCH_ASSOC);

        return $moulinet;
    }
}
