<?php

class PoissonDescriptionManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function selectPoissonByName(string $name):array
    {
        $query = $this->db->prepare
        ('SELECT poisson_description.* 
        FROM poisson_description 
        JOIN poisson ON poisson_description.poisson_id=poisson.id 
        WHERE poisson.nom= :name ');
        

        $query->execute(['name'=> $name]);
        $select_poisson = $query->fetchAll(PDO::FETCH_ASSOC);


        return $select_poisson;

    }

   



}