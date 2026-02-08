<?php
class CalendrierPeche
{
    private ?int $id = null;
    private ?string $espece = null;
    private ?string $saison = null;
    private ?string $type_leurre = null;


    public function getId(): int
    {
        return $this->id;
    }

    public function getEspece(): string
    {
        return $this->espece;
    }

    public function getSaion()
    {
        return $this->saison;
    }

    public function getTypeLeurre()
    {
        return $this->type_leurre;
    }
}
