<?php

class PoissonManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function findByName(string $name)
    {
        $query = $this->db->prepare('SELECT * FROM poisson WHERE nom= :nom ');


        $query->execute(['nom' => $name]);
       $query->setFetchMode(PDO::FETCH_CLASS, 'Poisson'); 
       $poissons = $query->fetch();       


        return $poissons;
    }

     public function findAll()
    {
        $query = $this->db->prepare('SELECT * FROM poisson ');


        $query->execute();
       $poissons = $query->fetchAll(PDO::FETCH_CLASS, 'Poisson');        


        return $poissons;
    }


    public function findImageByName(string $name): string
    {
        $query = $this->db->prepare('SELECT image FROM poisson WHERE nom = :nom ');
        $query->execute(['nom' => $name]);

       $result=$query->fetchColumn();

       return $result;
    }

    
}
