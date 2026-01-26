<?php
class Spot
{
    private ?int $id = null;
    private ?string $spot = null;
    private ?string $alt = null;
    private ?string $image = null;
    private ?string $autresimage = null;
    private ?string $alt_autresimage = null;



    public function getId(): int
    {
        return $this->id;
    }
    public function getSpot(): string
    {
        return $this->spot;
    }
    public function getAlt(): ?string
    {
        return $this->alt;
    }
    public function getImage(): string
    {
        return $this->image;
    }
    public function getAutresImage(): ?string
    {
        return $this->autresimage;
    }
    public function getAlt_autresimage(): ?string
    {
        return $this->alt_autresimage;
    }
}
