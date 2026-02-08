<?php
class CatalogueLeurres
{
    private ?int $id = null;
    private ?string $type_leurre = null;
    private ?string $taille_cm = null;
    private ?string $taille_equivalente = null;
    private ?string $poids_leurre_g = null;


    public function getId(): int
    {
        return $this->id;
    }

    public function getTypeLeurre(): string
    {
        return $this->type_leurre;
    }

    public function getTailleCm()
    {
        return $this->taille_cm;
    }

    public function getTailleEquivalente()
    {
        return $this->taille_equivalente;
    }

    public function getPoidsLeurreG()
    {
        return $this->poids_leurre_g;
    }
}
