<?php
class PoissonDescription 
{
    
        private int $id;
        private string $type_description;
        private int $poisson;
        private ?string $description = null;
        private ?string $alt = null;
        private ?string $image = null;


  


    public function getId()
    {
        return $this->id;
    }


    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }


    public function getType_description()
    {
        return $this->type_description;
    }


    public function setType_description($type_description)
    {
        $this->type_description = $type_description;

        return $this;
    }


    public function getPoisson()
    {
        return $this->poisson;
    }

    public function setPoisson($poisson)
    {
        $this->poisson = $poisson;

        return $this;
    }


    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }


    public function getAlt()
    {
        return $this->alt;
    }


    public function setAlt($alt)
    {
        $this->alt = $alt;

        return $this;
    }


    public function getImage()
    {
        return $this->image;
    }


    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }



}
