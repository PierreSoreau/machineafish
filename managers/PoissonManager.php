<?php

class PoissonManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findAll()
    {
        $query = $this->db->prepare('SELECT * FROM poisson ');
        

        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        $poissons=[];

        foreach ($results as $result) {            
            
            $poisson= new Poisson(
                $result["id"],
                $result["nom"],
                $result["logo"],
                $result["image"]
            );

             $poissons[] = $poisson;
        }          
        

        return $poissons;
    }
}



?>