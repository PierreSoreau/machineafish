<?php

class PoissonDescriptionManager extends AbstractManager
{

    public function __construct()
    {
        parent::__construct();
    }

    public function selectPoissonByName(string $name)
    {
        $query = $this->db->prepare('SELECT poisson_description.* 
        FROM poisson_description 
        JOIN poisson ON poisson_description.poisson_id=poisson.id 
        WHERE poisson.nom= :name ');


        $query->execute(['name' => $name]);
        $select_poisson = $query->fetchAll(PDO::FETCH_CLASS, 'PoissonDescription');


        return $select_poisson;
    }

    //Informations de l'habitat du poisson
    public function selectHabitatByName(string $name)
    {

        $query = $this->db->prepare('SELECT habitat.* 
        FROM habitat 
        JOIN poisson_habitat ON habitat.id=poisson_habitat.habitat_id 
        JOIN poisson ON poisson_habitat.poisson_id=poisson.id
        WHERE poisson.nom= :name ');


        $query->execute(['name' => $name]);
        $select_habitat = $query->fetchAll(PDO::FETCH_CLASS, 'Habitat');


        return $select_habitat;
    }


    //Informations sur les spots de pêche hiver du poisson
    public function selectSpotHiver(string $name)
    {

        $query = $this->db->prepare("SELECT spot.* 
        FROM spot
        JOIN poisson_spot ON spot.id=poisson_spot.spot_id 
        JOIN poisson ON poisson_spot.poisson_id=poisson.id
        WHERE poisson.nom= :name 
        AND poisson_spot.saison= 'toute_saison'");


        $query->execute(['name' => $name]);
        $select_spot = $query->fetchAll(PDO::FETCH_CLASS, 'Spot');


        return $select_spot;
    }


    //Informations sur les spots de pêche printemps/éte/automne du poisson
    public function selectSpotPea(string $name)
    {

        $query = $this->db->prepare("SELECT spot.* 
        FROM spot
        JOIN poisson_spot ON spot.id=poisson_spot.spot_id 
        JOIN poisson ON poisson_spot.poisson_id=poisson.id
        WHERE poisson.nom= :name 
        AND (poisson_spot.saison= 'toute_saison' 
        OR poisson_spot.saison= 'pea')");


        $query->execute(['name' => $name]);
        $select_spot = $query->fetchAll(PDO::FETCH_CLASS, 'Spot');


        return $select_spot;
    }


    //Informations sur l'alimentation du poisson
    public function selectFoodByName(string $name)
    {

        $query = $this->db->prepare('SELECT alimentation.* 
        FROM alimentation
        JOIN poisson_alimentation ON alimentation.id=poisson_alimentation.alimentation_id 
        JOIN poisson ON poisson_alimentation.poisson_id=poisson.id
        WHERE poisson.nom= :name
        ORDER BY alimentation.ordre ASC ');


        $query->execute(['name' => $name]);

        $select_alimentation = $query->fetchAll(PDO::FETCH_CLASS, 'Alimentation');


        return $select_alimentation;
    }

    //Données des étapes de reproduction du poisson
    public function selectReprodByName(string $name)
    {
        $query = $this->db->prepare("SELECT poisson_description.* 
        FROM poisson_description 
        JOIN poisson ON poisson_description.poisson_id=poisson.id       
        WHERE poisson.nom= :name 
        AND poisson_description.type_description= 'reproduction'
        ORDER BY poisson_description.id ASC");


        $query->execute(['name' => $name]);
        $select_reprod = $query->fetchAll(PDO::FETCH_CLASS, 'PoissonDescription');


        return $select_reprod;
    }
}
