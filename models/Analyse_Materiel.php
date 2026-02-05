<?php
class Analyse_Materiel
{

    private ?int $id = null;
    private ?string $type_materiel = null;
    private ?string $caractéristiques = null;
    private ?string $description = null;
    private ?string $image = null;



    public function getId(): ?int
    {
        return $this->id;
    }


    public function getType_materiel()
    {
        return $this->type_materiel;
    }


    public function getCaractéristiques()
    {
        return $this->caractéristiques;
    }


    public function getDescription()
    {
        return $this->description;
    }


    public function getImage()
    {
        return $this->image;
    }
}
