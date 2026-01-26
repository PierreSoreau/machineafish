<?php
class Alimentation
{

    private int $id;
    private string $alimentation;
    private ?string $alt = null;
    private ?string $image = null;
    private int $ordre;
    private ?string $video = null;


    public function getId(): int
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }
    public function getAlimentation(): string
    {
        return $this->alimentation;
    }

    public function setAlimentation($alimentation)
    {
        $this->alimentation = $alimentation;

        return $this;
    }
    public function getAlt(): ?string
    {
        return $this->alt;
    }

    public function setAlt($alt)
    {
        $this->alt = $alt;

        return $this;
    }
    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }
    public function getOrdre(): int
    {
        return $this->ordre;
    }

    public function setOrdre($ordre)
    {
        $this->ordre = $ordre;

        return $this;
    }
    public function getVideo(): ?string
    {
        return $this->video;
    }

    public function setVideo($video)
    {
        $this->video = $video;

        return $this;
    }
}
