<?php
class PoissonDescription
{

    private int $id;
    private string $type_description;
    private int $poisson;
    private ?string $description = null;
    private ?string $alt = null;
    private ?string $image = null;
    private ?string $temperature_value = null;
    private ?string $autresimage = null;


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





    public function getTemperature_value()
    {
        return $this->temperature_value;
    }


    public function setTemperature_value($temperature_value)
    {
        $this->temperature_value = $temperature_value;

        return $this;
    }

    public function getAutresimage()
    {
        return $this->autresimage;
    }

    public function setAutresimage($autresimage)
    {
        $this->autresimage = $autresimage;

        return $this;
    }
}
