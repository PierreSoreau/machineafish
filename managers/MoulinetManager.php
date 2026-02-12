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

        // 2. LA SÉCURITÉ "MONSTRE"
        // On définit une taille minimale obligatoire selon l'espèce
        $tailleMinimaleRequise = 0;

        if ($donneesQuiz['poisson_nom'] === 'silure') {
            $tailleMinimaleRequise = 5000; // Silure = Minimum 5000 (Pour encaisser la tresse épaisse)
        } elseif ($donneesQuiz['poisson_nom'] === 'brochet' && $donneesQuiz['taille'] === 'spécimen record') {
            $tailleMinimaleRequise = 4000; // Gros Brochet = Minimum 4000
        }

        $paramsmoulinet = [
            "canneid" => $canneid,
            "saison" => $saison,
            "taille_min" => $tailleMinimaleRequise

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
        AND m.taille_bobine >= :taille_min

        ORDER BY m.taille_bobine ASC       
        LIMIT 1 
    ';

        $query = $this->db->prepare($sqlMoulinet);
        $query->execute($paramsmoulinet);

        $moulinet = $query->fetch(PDO::FETCH_ASSOC);

        return $moulinet;
    }
}
