<?php

class SaisonManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll()
    {
        $query = $this->db->prepare('SELECT * FROM saison ');
        

        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        $saisons=[];

        foreach ($results as $result) {            
            
            $saison= new Saison(
                $result["saison"],
                $result["logo"],
                
            );

             $saisons[] = $saison;
        }          
        

        return $saisons;
    }
}



?>