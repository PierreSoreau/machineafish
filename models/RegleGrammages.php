<?php
class RegleGrammages
{
    private ?int $id = null;
    private ?string $espece_cible = null;
    private ?string $poids_min_g = null;
    private ?string $poids_max_g = null;
    private ?string $profondeur = null;
    private ?string $courant = null;



    public function getId()
    {
        return $this->id;
    }

    public function getEspeceCible()
    {
        return $this->espece_cible;
    }

    public function getPoisMinG()
    {
        return $this->poids_min_g;
    }

    public function getPoisMaxG()
    {
        return $this->poids_max_g;
    }

    public function getProfondeur()
    {
        return $this->profondeur;
    }

    public function getCourant()
    {
        return $this->courant;
    }
}
