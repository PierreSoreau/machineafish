<?php
class ContenuCards
{
    private ?int $id = null;
    private ?string $categorie = null;
    private ?string $image = null;
    private ?string $description = null;
    private ?string $lien = null;



    public function getId(): int
    {
        return $this->id;
    }

    public function getCategorie(): string
    {
        return $this->categorie;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getLien()
    {
        return $this->lien;
    }
}
